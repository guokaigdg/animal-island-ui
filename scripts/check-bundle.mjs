#!/usr/bin/env node
/**
 * 校验构建产物里没有被打包进去的 peer 依赖（react / react-dom / classnames）。
 *
 * 为什么需要：peer 依赖一旦漏了 external，Rollup 会把它打进产物 —— 字符串数组
 * 只做精确匹配，`react-dom/client` 这类子路径入口极易漏掉。被打进去的旧版
 * `react-dom/client` 会去写**消费者** react-dom 的
 * `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint`，
 * 而 React 19 已移除该字段 → 消费方调用 `Notification.success()` 时抛
 * `TypeError: Cannot set properties of undefined (setting 'usingClientEntryPoint')`（issue #78）。
 *
 * 运行时依赖（dayjs / naive-icons）是**故意**打进产物的，不在此检查范围。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { execFileSync } from 'child_process';
import { resolve, relative } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');

const FORBIDDEN = ['react', 'react-dom', 'classnames'];

if (!existsSync(DIST)) {
    console.error('[check:bundle] 找不到 dist/ —— 请先运行 npm run build');
    process.exit(1);
}

/** 递归收集 dist 下的 node_modules 顶层包名（被打进产物的依赖） */
const collectBundled = (dir) => {
    const found = new Set();
    const nm = resolve(dir, 'node_modules');
    if (!existsSync(nm)) return found;
    const walk = (d) => {
        let entries;
        try {
            entries = readdirSync(d);
        } catch {
            return;
        }
        for (const entry of entries) {
            if (entry === '.bin') continue;
            const full = resolve(d, entry);
            let st;
            try {
                st = statSync(full);
            } catch {
                continue;
            }
            if (st.isDirectory()) walk(full);
        }
    };
    walk(nm);
    // node_modules/<pkg> 即顶层包名
    let entries;
    try {
        entries = readdirSync(nm);
    } catch {
        return found;
    }
    for (const entry of entries) {
        if (entry === '.bin') continue;
        const full = resolve(nm, entry);
        try {
            if (statSync(full).isDirectory()) found.add(entry);
        } catch {
            /* noop */
        }
    }
    return found;
};

const violations = [];
for (const out of ['es', 'cjs']) {
    const dir = resolve(DIST, out);
    if (!existsSync(dir)) continue;
    const bundled = collectBundled(dir);
    for (const pkg of FORBIDDEN) {
        if (bundled.has(pkg)) {
            violations.push(`${relative(ROOT, dir)}/node_modules/${pkg}`);
        }
    }
}

// 另一条兜底：产物里不该出现 React 19 已移除的内部字段
const needle = 'usingClientEntryPoint';
const scanDir = (dir, hits) => {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return hits;
    }
    for (const entry of entries) {
        const full = resolve(dir, entry);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) scanDir(full, hits);
        else if (/\.(js|cjs|mjs)$/.test(entry)) {
            try {
                if (readFileSync(full, 'utf8').includes(needle)) hits.push(relative(ROOT, full));
            } catch {
                /* noop */
            }
        }
    }
    return hits;
};

const stale = [];
for (const out of ['es', 'cjs']) {
    const dir = resolve(DIST, out);
    if (existsSync(dir)) scanDir(dir, stale);
}

// 产物 JS 里不能出现文件式导入（.css / .less / .svg …）：
// Node 解析 ESM / CJS 时不认这些扩展名，命中就直接抛 ERR_UNKNOWN_FILE_EXTENSION
// 或把 CSS 当 JS 解析的 SyntaxError —— 整个包在纯 Node 里就加载不了（SSR 同样中招）。
// 样式统一走 `animal-island-ui/style`，场景图用 new URL(..., import.meta.url) 引用。
const fileImports = [];
const scanFileImports = (dir) => {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return;
    }
    for (const entry of entries) {
        const full = resolve(dir, entry);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) scanFileImports(full);
        else if (/\.(js|cjs|mjs)$/.test(entry)) {
            let text;
            try {
                text = readFileSync(full, 'utf8');
            } catch {
                continue;
            }
            const re =
                /(?:from\s*|import\s*|require\s*\(\s*)["'](\.[^"']+\.(?:css|less|sass|scss|svg|png|jpe?g|webp|gif))["']/g;
            for (const m of text.matchAll(re)) {
                fileImports.push(`${relative(ROOT, full)} → ${m[1]}`);
            }
        }
    }
};
for (const out of ['es', 'cjs']) {
    const dir = resolve(DIST, out);
    if (existsSync(dir)) scanFileImports(dir);
}

// 产物必须能被纯 Node 以 ESM 方式真的导入一次。
// 只扫字符串扫不到 `dayjs/locale/zh-cn` 这类缺扩展名的裸子路径 —— dayjs 没有 exports 字段，
// Node 的 ESM 解析器不做扩展名补全，缺了 .js 就是 ERR_MODULE_NOT_FOUND，
// 整个包在纯 Node 与 Next.js Pages Router 下都加载不了（4.0.1 就是这么发出去的）。
// 这里让 Node 真跑一次导入，失败即构建失败。
const esEntry = resolve(DIST, 'es/index.js');
let importFailure = '';
if (existsSync(esEntry)) {
    try {
        execFileSync(
            process.execPath,
            [
                '--input-type=module',
                '-e',
                `import(${JSON.stringify(pathToFileURL(esEntry).href)}).then(
                    () => process.exit(0),
                    (error) => {
                        console.error(String(error && error.message ? error.message : error));
                        process.exit(1);
                    }
                )`,
            ],
            { stdio: 'pipe' }
        );
    } catch (error) {
        const detail = error?.stderr?.toString().trim() || error?.message || String(error);
        importFailure = detail.split('\n').slice(0, 3).join(' / ');
    }
}

if (violations.length > 0 || stale.length > 0 || fileImports.length > 0 || importFailure) {
    if (violations.length > 0 || stale.length > 0) {
        console.error('[check:bundle] ✗ 产物里出现了不该被打包进去的 peer 依赖');
        for (const v of violations) console.error(`  · ${v}`);
        for (const s of stale) console.error(`  · ${s}（含 React 19 已移除的 ${needle}）`);
        console.error('  → 修 vite.config.ts 的 rollupOptions.external，让 peer 依赖及其子路径保持 external');
    }
    if (fileImports.length > 0) {
        console.error('[check:bundle] ✗ 产物 JS 里出现了文件式导入，Node 加载不了');
        for (const f of fileImports) console.error(`  · ${f}`);
        console.error('  → 样式走 `animal-island-ui/style`；图片用 new URL(..., import.meta.url) 引用，不产生模块依赖');
    }
    if (importFailure) {
        console.error('[check:bundle] ✗ 产物无法被纯 Node 以 ESM 方式导入');
        console.error(`  · ${importFailure}`);
        console.error('  → 检查产物里的裸子路径导入是否缺扩展名（如 dayjs/locale/zh-cn.js）；');
        console.error('    Node 的 ESM 解析器不做扩展名补全，缺 .js 即 ERR_MODULE_NOT_FOUND');
    }
    process.exit(1);
}

console.log('[check:bundle] ✓ 产物里没有被打包进去的 peer 依赖（react / react-dom / classnames）');
console.log('[check:bundle] ✓ 产物 JS 里没有文件式导入（纯 Node / SSR 可加载）');
console.log('[check:bundle] ✓ 产物能被纯 Node 以 ESM 方式导入');
