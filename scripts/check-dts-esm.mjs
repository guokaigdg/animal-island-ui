#!/usr/bin/env node
/**
 * 校验 dist/types 里的类型声明符合 ESM 的解析规则。
 *
 * 为什么需要：包是 ESM，消费方用 `moduleResolution: "node16"` / `"nodenext"` 时，
 * ESM 的 .d.ts 必须写显式扩展名、且不能用目录导入 —— 否则模块图解析失败，
 * **所有导出退化成 any**，消费方的类型检查被静默关掉（issue #79）。
 *
 * 产物这一层此前从不被检查（typecheck 只查源码，check:bundle 只查 peer 依赖），
 * 所以这类问题能一路溜到 npm 上。这里把它固化成一道 CI 门禁。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TYPES_DIR = resolve(ROOT, 'dist/types');

if (!existsSync(TYPES_DIR)) {
    console.error('[check:dts] 找不到 dist/types —— 请先运行 npm run build');
    process.exit(1);
}

const collect = (dir) => {
    const found = [];
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return found;
    }
    for (const entry of entries) {
        const full = resolve(dir, entry);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) found.push(...collect(full));
        else if (entry.endsWith('.d.ts')) found.push(full);
    }
    return found;
};

const missingExtension = [];
const unresolved = [];
const styleImports = [];

for (const file of collect(TYPES_DIR)) {
    const text = readFileSync(file, 'utf8');
    const dir = dirname(file);
    const rel = relative(ROOT, file);

    // 样式表在类型产物里没有对应文件，留在类型图里只会在 node16/nodenext 下报 TS2882
    for (const m of text.matchAll(/^[ \t]*import\s+['"](\.[^'"]+\.(?:less|css))['"]/gm)) {
        styleImports.push(`${rel} → ${m[1]}`);
    }

    for (const m of text.matchAll(/\bfrom\s+['"](\.[^'"]*)['"]/g)) {
        const spec = m[1];
        if (!/\.[a-z0-9]+$/i.test(spec)) {
            missingExtension.push(`${rel} → ${spec}`);
            continue;
        }
        // 只校验指向类型产物的 .js 说明符；.svg 等资源说明符由 bundler 处理
        if (!spec.endsWith('.js')) continue;
        const target = resolve(dir, spec.replace(/\.js$/, '.d.ts'));
        if (!existsSync(target)) unresolved.push(`${rel} → ${spec}`);
    }
}

const problems = [];
if (missingExtension.length > 0) {
    problems.push('相对说明符缺少显式扩展名（node16/nodenext 下会解析失败）');
    for (const p of missingExtension) console.error(`  · ${p}`);
}
if (unresolved.length > 0) {
    problems.push('相对说明符指向的 .d.ts 不存在');
    for (const p of unresolved) console.error(`  · ${p}`);
}
if (styleImports.length > 0) {
    problems.push('类型产物里残留样式副作用导入');
    for (const p of styleImports) console.error(`  · ${p}`);
}

if (problems.length > 0) {
    console.error('[check:dts] ✗ 类型声明不符合 ESM 解析规则');
    console.error('  → 运行 npm run build（会调用 scripts/fix-dts-extensions.mjs 规范化说明符）');
    process.exit(1);
}

console.log('[check:dts] ✓ 类型声明的相对说明符均带显式扩展名且可解析');
