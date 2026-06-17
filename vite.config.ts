import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import { resolve, dirname, join, posix } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, rmdirSync, statSync, cpSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import type { PreRenderedAsset } from 'rollup';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 资源（CSS/图片/字体等）文件名生成器。
 * Vite 要求所有 output 共享同一个 assetFileNames 模式，因此提为模块级常量函数，
 * 让 ES/CJS 两个 output 引用同一份配置 —— Vite/Rollup 会按 output.format 自动
 * 把 es/ 路径改写到 cjs/ 并补 .cjs 扩展名。
 */
const assetFileNames = (_assetInfo: PreRenderedAsset): string => `es/[name][extname]`;

/**
 * libAssetsPlugin 会按源资源的相对路径在 dist 下创建目录树（如 dist/img/），
 * 然后实际文件被重定向到 dist/files/，留下空目录。构建结束后递归清理之。
 */
function pruneEmptyDirsPlugin(targetDir: string): Plugin {
    const prune = (dir: string): boolean => {
        let entries: string[];
        try {
            entries = readdirSync(dir);
        } catch {
            return false;
        }
        let hasFile = false;
        for (const entry of entries) {
            const full = join(dir, entry);
            const stat = statSync(full);
            if (stat.isDirectory()) {
                const childHasFile = prune(full);
                if (childHasFile) hasFile = true;
            } else {
                hasFile = true;
            }
        }
        if (!hasFile) {
            try {
                rmdirSync(dir);
            } catch {
                /* noop */
            }
        }
        return hasFile;
    };
    return {
        name: 'prune-empty-dirs',
        closeBundle() {
            const abs = resolve(__dirname, targetDir);
            try {
                const entries = readdirSync(abs);
                for (const entry of entries) {
                    const full = join(abs, entry);
                    if (statSync(full).isDirectory()) prune(full);
                }
            } catch {
                /* noop */
            }
        },
    };
}

/**
 * 去掉 fontsource CSS 里的 woff 备份，只保留 woff2。
 * 现代浏览器（Chrome 36+/Firefox 39+/Safari 10+/Edge 14+）100% 支持 woff2。
 * 产物 dist/files/ 体积可进一步降低 ~40%。
 */
function stripWoffFallbackPlugin(): Plugin {
    return {
        name: 'strip-woff-fallback',
        enforce: 'pre',
        transform(code, id) {
            if (!id.includes('@fontsource')) return null;
            if (!id.endsWith('.css') && !/\.css\?/.test(id)) return null;
            const transformed = code.replace(/,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\)/g, '');
            return transformed === code ? null : { code: transformed, map: null };
        },
        // libAssetsPlugin 会独立扫描源 CSS 并 emit 所有 url() 引用的文件（包括被我们剥掉的 woff），
        // 在 bundle 阶段删除未被最终 CSS 引用的 woff 孤儿文件。
        generateBundle(_, bundle) {
            for (const key of Object.keys(bundle)) {
                const asset = bundle[key];
                if (asset.type === 'asset' && /\.woff$/i.test(key)) {
                    delete bundle[key];
                }
            }
        },
    };
}

/**
 * 把 488 个 item PNG 原样拷贝到 dist/items/，作为子路径资源发布。
 * 消费者按需 `import url from 'animal-island-ui/items/item-001.png'` 引用，
 * 只有被 import 的那几张才会进消费者 bundle，未引用的不打包。
 */
function copyItemAssetsPlugin(): Plugin {
    return {
        name: 'copy-item-assets',
        closeBundle() {
            const from = resolve(__dirname, 'src/assets/img/icons/items');
            const to = resolve(__dirname, 'dist/items');
            try {
                cpSync(from, to, { recursive: true });
            } catch {
                /* noop */
            }
        },
    };
}

/**
 * cssCodeSplit + preserveModules 下，Vite 把每个组件 CSS 拆成独立文件，
 * 但默认不会在组件 JS 里写回样式引用，会留下样式孤儿。
 * 本插件读取每个 chunk 的 viteMetadata.importedCss，按相对路径以副作用形式
 * 注入对应 JS 顶部 —— 消费者 import/require 某组件即按需带上其 CSS。
 *
 * ES 输出用 `import "./x.css";`，CJS 输出用 `require("./x.css");`，按 output.format 区分。
 */
function injectImportedCssPlugin(): Plugin {
    return {
        name: 'inject-imported-css',
        generateBundle(options, bundle) {
            const isCjs = options.format === 'cjs';
            for (const file of Object.values(bundle)) {
                if (file.type !== 'chunk') continue;
                const css = file.viteMetadata?.importedCss;
                if (!css || css.size === 0) continue;
                const stmts = [...css]
                    .map((cssFile) => {
                        let rel = posix.relative(posix.dirname(file.fileName), cssFile);
                        if (!rel.startsWith('.')) rel = './' + rel;
                        return isCjs ? `require("${rel}");` : `import "${rel}";`;
                    })
                    .join('\n');
                file.code = stmts + '\n' + file.code;
            }
        },
    };
}

/**
 * 改写 CSS 文本中 url() 引用的相对路径：
 * Vite 产出的 CSS 总是相对源 CSS 自身位置（如 url(../../files/x.svg)），
 * 但 dist/index.css 位于 dist 根目录，需要把 "../" 前缀剥掉改成
 * 相对 dist/ 的形式（url(files/x.svg)），消费者 `import 'animal-island-ui/style'`
 * 时 CSS 解析器才能正确定位到 dist/files/。
 *
 * sourceCssRelPath 是源 CSS 相对 dist/ 的路径，如 'es/styles/index.css' 或
 * 'es/components/Divider/divider.module.css'。其目录深度决定 "../" 的层数。
 */
function rewriteCssAssetUrls(text: string, sourceCssRelPath: string): string {
    const sourceDir = posix.dirname(sourceCssRelPath);
    const depth = sourceDir === '.' ? 0 : sourceDir.split('/').length;
    if (depth === 0) return text;
    // 整体匹配 url( .../files/xxx ) 形式（兼容带/不带引号），重写为 url("files/xxx")
    const prefix = '\\.\\./'.repeat(depth);
    const re = new RegExp(`url\\(\\s*["']?${prefix}files/([^)'"\\s]+)["']?\\s*\\)`, 'g');
    return text.replace(re, 'url("files/$1")');
}

/**
 * 把全局主题样式 + 全部组件 CSS 聚合为 dist/index.css，
 * 供 `animal-island-ui/style` 子路径一次性引入全量样式。
 * cssCodeSplit 模式下：
 *   - 全局变量/reset：dist/es/styles/index.css
 *   - 组件 CSS：dist/es/components/**\/*.module.css（CSS Modules 散落各组件目录）
 * 拼接顺序：全局 → 组件，保证组件样式可消费 :root CSS 变量。
 */
function emitGlobalStyleEntryPlugin(): Plugin {
    return {
        name: 'emit-global-style-entry',
        closeBundle() {
            const root = resolve(__dirname, 'dist');
            const chunks: string[] = [];
            const seen = new Set<string>();

            // 1. 全局主题变量 + reset（必须最先，组件依赖 :root 变量）
            const globalCss = resolve(root, 'es/styles/index.css');
            try {
                if (statSync(globalCss).isFile()) {
                    const text = rewriteCssAssetUrls(readFileSync(globalCss, 'utf8'), 'es/styles/index.css');
                    if (text.trim().length > 0) {
                        chunks.push(text);
                        seen.add(globalCss);
                    }
                }
            } catch {
                /* no global css emitted */
            }

            // 2. 全部组件 CSS Modules（递归 dist/es/components/**/*.module.css）
            const compDir = resolve(root, 'es/components');
            const walk = (dir: string): void => {
                let entries: string[];
                try {
                    entries = readdirSync(dir);
                } catch {
                    return;
                }
                for (const entry of entries) {
                    const full = join(dir, entry);
                    let stat;
                    try {
                        stat = statSync(full);
                    } catch {
                        continue;
                    }
                    if (stat.isDirectory()) {
                        walk(full);
                    } else if (full.endsWith('.module.css') && !seen.has(full)) {
                        const text = rewriteCssAssetUrls(readFileSync(full, 'utf8'), posix.relative(root, full));
                        if (text.trim().length > 0) {
                            chunks.push(text);
                            seen.add(full);
                        }
                    }
                }
            };
            walk(compDir);

            if (chunks.length > 0) {
                writeFileSync(resolve(root, 'index.css'), chunks.join('\n'));
            }

            // 3. 清理 dist/files/ 里未被任何 CSS url() 或 JS 静态 import 引用的孤儿资源。
            // libAssetsPlugin 会把 fontsource 字体、未被组件 CSS 实际用到的图片等
            // 一并 emit 到 dist/files/，但它们永远不会进消费者 bundle —— 直接删掉。
            // 注意：扫描必须覆盖 JS 文件里的 import 引用（如 Wallet 静态 import 的 item-022.png），
            //       否则会被误删，导致对应组件在消费者侧 bundler 解析失败。
            const filesDir = resolve(root, 'files');
            const referenced = new Set<string>();
            const fileRefRe = /files\/([a-zA-Z0-9._-]+\.[a-zA-Z0-9]+)/g;
            const collectRefs = (dir: string): void => {
                let entries: string[];
                try {
                    entries = readdirSync(dir);
                } catch {
                    return;
                }
                for (const entry of entries) {
                    const full = join(dir, entry);
                    let stat;
                    try {
                        stat = statSync(full);
                    } catch {
                        continue;
                    }
                    if (stat.isDirectory()) {
                        collectRefs(full);
                    } else if (full.endsWith('.css') || full.endsWith('.js') || full.endsWith('.cjs')) {
                        const text = readFileSync(full, 'utf8');
                        let m: RegExpExecArray | null;
                        while ((m = fileRefRe.exec(text)) !== null) {
                            referenced.add(m[1]);
                        }
                    }
                }
            };
            collectRefs(resolve(root, 'es'));
            collectRefs(resolve(root, 'cjs'));
            // dist/index.css 也是引用源（animal-island-ui/style 入口）
            const idxCss = resolve(root, 'index.css');
            try {
                if (statSync(idxCss).isFile()) {
                    const text = readFileSync(idxCss, 'utf8');
                    const re = /files\/([a-zA-Z0-9._-]+\.[a-z]+)/g;
                    let m: RegExpExecArray | null;
                    while ((m = re.exec(text)) !== null) {
                        referenced.add(m[1]);
                    }
                }
            } catch {
                /* noop */
            }

            try {
                const files = readdirSync(filesDir);
                for (const f of files) {
                    if (!referenced.has(f)) {
                        try {
                            unlinkSync(join(filesDir, f));
                        } catch {
                            /* noop */
                        }
                    }
                }
            } catch {
                /* no files dir */
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        stripWoffFallbackPlugin(),
        // lib 模式下 Vite 会强制内联所有资源，本插件绕过该限制，把字体/图片等作为独立文件输出
        libAssetsPlugin({
            outputPath: 'files',
            name: '[name].[contenthash:8].[ext]',
            limit: 0,
        }),
        injectImportedCssPlugin(),
        emitGlobalStyleEntryPlugin(),
        copyItemAssetsPlugin(),
        pruneEmptyDirsPlugin('dist'),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    css: {
        modules: {
            // 生成类名格式：animal-[类名]-[hash]
            generateScopedName: 'animal-[local]-[hash:base64:5]',
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less')}";`,
            },
        },
    },
    build: {
        // 现代浏览器目标 —— Vite lib 默认 'modules'，显式声明可保留更多 ES2020+ 语法
        target: 'es2020',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'classnames'],
            // 多输出：
            //  - ES：preserveModules 保持源码目录结构 → 消费者可按组件 tree-shake，
            //        CSS 随 cssCodeSplit 按组件拆分，配合 injectImportedCssPlugin 自动回填 import
            //  - CJS：同样 preserveModules（不再 inlineDynamicImports），保留逐组件文件，
            //        使 require 老式打包器也能摇掉未用组件及其字体/图片资源
            // Vite 要求所有 output 共享同一个 assetFileNames 模式，
            // 因此抽为模块级函数，让 ES/CJS 两个 output 引用同一份配置。
            output: [
                {
                    format: 'es',
                    dir: 'dist',
                    entryFileNames: 'es/[name].js',
                    chunkFileNames: 'es/[name].js',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    globals: { react: 'React', 'react-dom': 'ReactDOM' },
                    assetFileNames,
                },
                {
                    format: 'cjs',
                    dir: 'dist',
                    entryFileNames: 'cjs/[name].cjs',
                    chunkFileNames: 'cjs/[name].cjs',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    exports: 'named',
                    globals: { react: 'React', 'react-dom': 'ReactDOM' },
                    assetFileNames,
                },
            ],
        },
        cssCodeSplit: true,
    },
});
