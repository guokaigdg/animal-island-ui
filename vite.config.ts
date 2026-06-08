import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, rmdirSync, statSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
            const transformed = code.replace(
                /,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\)/g,
                '',
            );
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
            external: ['react', 'react-dom', 'react/jsx-runtime', 'modern-screenshot'],
            // 多输出：
            //  - ES：preserveModules 保持源码目录结构 → 消费者可按组件 tree-shake
            //  - CJS：单文件 bundle，兼容老式 require
            output: [
                {
                    format: 'es',
                    dir: 'dist',
                    entryFileNames: 'es/[name].js',
                    chunkFileNames: 'es/[name].js',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    globals: { react: 'React', 'react-dom': 'ReactDOM' },
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css')) return 'index.css';
                        return assetInfo.name!;
                    },
                },
                {
                    format: 'cjs',
                    dir: 'dist',
                    entryFileNames: 'cjs/index.cjs',
                    inlineDynamicImports: true,
                    globals: { react: 'React', 'react-dom': 'ReactDOM' },
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css')) return 'index.css';
                        return assetInfo.name!;
                    },
                },
            ],
        },
        cssCodeSplit: false,
    },
});
