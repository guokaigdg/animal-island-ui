#!/usr/bin/env node
/**
 * 文档同步对账：扫 src/components/ 自动发现组件，校验 4 份规则文档是否都已收录。
 *
 * 校验矩阵：
 *   - AI_USAGE.md     → 必须含 `### 1.X <Name>` 段
 *   - skill/SKILL.md  → 必须含 `### <Name>` 段
 *   - PROMPT.md       → 必须含 `### <Name>` 段
 *   - DESIGN_PROMPT.md→ 必须含 `<Name>`（样式用现成调色板，松校验：仅出现一次即可）
 *
 * 用法：node scripts/check-docs-sync.mjs
 * 退出码：0 全部对齐；1 存在漂移。
 *
 * 来源真源：.cursorrules §10 文档同步矩阵。
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const COMPONENTS_DIR = resolve(ROOT, 'src/components');
const DOCS = {
    'AI_USAGE.md': resolve(ROOT, 'AI_USAGE.md'),
    'skill/SKILL.md': resolve(ROOT, 'skill/SKILL.md'),
    'PROMPT.md': resolve(ROOT, 'PROMPT.md'),
    'DESIGN_PROMPT.md': resolve(ROOT, 'DESIGN_PROMPT.md'),
};

// ---------- 1. 扫 src/components/ 自动发现组件 ----------
const components = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(resolve(COMPONENTS_DIR, d.name, `${d.name}.tsx`)))
    .map((d) => d.name)
    .sort();

// ---------- 2. 读 4 份文档 ----------
const readSafe = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const contents = {
    'AI_USAGE.md': readSafe(DOCS['AI_USAGE.md']),
    'skill/SKILL.md': readSafe(DOCS['skill/SKILL.md']),
    'PROMPT.md': readSafe(DOCS['PROMPT.md']),
    'DESIGN_PROMPT.md': readSafe(DOCS['DESIGN_PROMPT.md']),
};

// ---------- 3. 逐组件校验 ----------
/**
 * 严格匹配：必须是 markdown 段头形式。
 * - AI_USAGE.md 用 `### 1.X <Name>` 编号
 * - skill/SKILL.md 用 `### <Name>`
 * - PROMPT.md 用 `### <Name>`（括号描述可忽略）
 * 容忍大小写、容忍前后空格；不命中任何宽松形式即视为缺失。
 */
const checkStrict = (text, name, file) => {
    if (!text) return false;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let re;
    if (file === 'AI_USAGE.md') {
        // ### 1.1 Button / ### 1.10 Phone (decorative IslandPhone)
        re = new RegExp(`^#{1,6}\\s+\\d+\\.\\d+\\s+${escaped}\\b`, 'm');
    } else {
        re = new RegExp(`^#{1,6}\\s+${escaped}\\b`, 'm');
    }
    return re.test(text);
};

/** 松散匹配：文档正文里提到组件名（用于 DESIGN_PROMPT 等只引述不细写的文件）。 */
const checkLoose = (text, name) => {
    if (!text) return false;
    return text.includes(name);
};

const matrix = components.map((name) => ({
    name,
    'AI_USAGE.md': checkStrict(contents['AI_USAGE.md'], name, 'AI_USAGE.md'),
    'skill/SKILL.md': checkStrict(contents['skill/SKILL.md'], name, 'skill/SKILL.md'),
    'PROMPT.md': checkStrict(contents['PROMPT.md'], name, 'PROMPT.md'),
    'DESIGN_PROMPT.md': checkLoose(contents['DESIGN_PROMPT.md'], name),
}));

// ---------- 4. 报告 ----------
const DOC_HEADERS = Object.keys(DOCS);
const widths = {
    name: Math.max(4, ...components.map((n) => n.length)),
    ...Object.fromEntries(DOC_HEADERS.map((h) => [h, Math.max(h.length, 4)])),
};

const pad = (s, w) => String(s).padEnd(w, ' ');
const STATUS = { true: '✅', false: '❌' };

console.log(`\n🔎 文档同步对账（自动扫 src/components/ → ${components.length} 个组件）\n`);

const header = [pad('组件', widths.name), ...DOC_HEADERS.map((h) => pad(h, widths[h]))].join('  ');
console.log(header);
console.log('-'.repeat(header.length));

let driftCount = 0;
for (const row of matrix) {
    const cells = DOC_HEADERS.map((h) => pad(`${STATUS[row[h]]} ${row[h] ? 'ok' : 'MISS'}`, widths[h]));
    console.log(`${pad(row.name, widths.name)}  ${cells.join('  ')}`);
    if (DOC_HEADERS.some((h) => !row[h])) driftCount++;
}

console.log('-'.repeat(header.length));
console.log(
    `总计：${components.length} 组件 · 漂移：${driftCount} 组件 · 通过率：${(
        (1 - driftCount / components.length) *
        100
    ).toFixed(1)}%\n`
);

if (driftCount === 0) {
    console.log('🎉 全部对齐，文档与源码一致。\n');
    process.exit(0);
}

console.error('⚠️  发现文档漂移，请按 .cursorrules §10 同步矩阵补齐：\n');
for (const row of matrix) {
    const missing = DOC_HEADERS.filter((h) => !row[h]);
    if (missing.length) {
        console.error(`   • ${row.name}  →  缺失于：${missing.join(', ')}`);
    }
}
console.error('\n补齐后再跑一次：npm run check:docs\n');
process.exit(1);
