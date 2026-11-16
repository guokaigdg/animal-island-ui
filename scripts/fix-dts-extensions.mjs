#!/usr/bin/env node
/**
 * 规范化 dist/types 里的相对说明符，让发布出去的类型声明在 ESM 下自洽。
 *
 * 为什么需要：本包是 ESM（package.json 的 "type": "module"），消费方用
 * `moduleResolution: "node16"` / `"nodenext"` 时，ESM 的 .d.ts 必须写显式扩展名、
 * 且不能用目录导入 —— 否则整个模块图解析失败，**所有导出退化成 any**，
 * 消费方的类型检查被静默关掉（issue #79）。
 *
 * 根因：tsconfig 用 `moduleResolution: "bundler"`，源码里允许无扩展名和目录导入
 * （`./Button`、`./components/Button`），而 `tsc --emitDeclarationOnly` 会把
 * 这些说明符**原样抄进** .d.ts。
 *
 * 这里做的是与 CSS 侧同款的产物规范化（见 vite.config.ts 的 rewriteCssAssetUrls）：
 * 让发布产物与包的 exports 契约自洽，而不是让消费方迁就我们的源码风格。
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TYPES_DIR = resolve(ROOT, 'dist/types');

if (!existsSync(TYPES_DIR)) {
    console.error('[fix:dts] 找不到 dist/types —— 请先运行 npm run build');
    process.exit(1);
}

/** 递归收集 dist/types 下的 .d.ts */
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

let rewritten = 0;
let dropped = 0;
const unresolved = [];

for (const file of collect(TYPES_DIR)) {
    const original = readFileSync(file, 'utf8');
    const dir = dirname(file);

    // 1) 纯副作用导入：样式表在类型产物里没有对应文件（消费方通过
    //    `animal-island-ui/style` 拿样式），留着只会在 node16/nodenext 下报 TS2882
    const withoutStyles = original.replace(/^[ \t]*import\s+['"](\.[^'"]+\.(?:less|css))['"];?[ \t]*\r?\n/gm, () => {
        dropped++;
        return '';
    });

    // 2) 相对说明符补显式扩展名 / 目录导入补 /index.js
    const next = withoutStyles.replace(/(\bfrom\s+['"])(\.[^'"]*)(['"])/g, (match, head, spec, tail) => {
        if (/\.[a-z0-9]+$/i.test(spec)) return match; // 已带扩展名
        const abs = resolve(dir, spec);
        let target;
        if (existsSync(abs) && statSync(abs).isDirectory()) {
            if (!existsSync(resolve(abs, 'index.d.ts'))) {
                unresolved.push(`${relative(ROOT, file)} → ${spec}`);
                return match;
            }
            target = `${spec.replace(/\/+$/, '')}/index.js`;
        } else if (existsSync(`${abs}.d.ts`)) {
            target = `${spec}.js`;
        } else {
            unresolved.push(`${relative(ROOT, file)} → ${spec}`);
            return match;
        }
        rewritten++;
        return `${head}${target}${tail}`;
    });

    if (next !== original) writeFileSync(file, next);
}

if (unresolved.length > 0) {
    console.error('[fix:dts] ✗ 有相对说明符无法定位到对应的 .d.ts');
    for (const u of unresolved) console.error(`  · ${u}`);
    process.exit(1);
}

console.log(`[fix:dts] ✓ 规范化完成：改写 ${rewritten} 处说明符，移除 ${dropped} 条样式副作用导入`);
