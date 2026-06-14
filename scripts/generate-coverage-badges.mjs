#!/usr/bin/env node
/**
 * 端到端徽章同步：
 *   1. 解析 coverage/coverage-summary.json → 写 docs/badges/coverage.json
 *   2. 解析 coverage/vitest-results.json → 统计真实测试数 / 组件数
 *   3. 自动更新 README.md + docs/README.zh-CN.md 中的硬编码徽章
 *
 * 使用：
 *   npm run test:cov -- --reporter=json --outputFile=coverage/vitest-results.json
 *   npm run badges
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SUMMARY = resolve(ROOT, 'coverage/coverage-summary.json');
const VITEST = resolve(ROOT, 'coverage/vitest-results.json');
const BADGE_JSON = resolve(ROOT, 'coverage/badges/coverage.json');

// ---------- 1. 读 coverage-summary ----------
if (!existsSync(SUMMARY)) {
    console.error(`[badges] 找不到 ${SUMMARY}，请先跑 npm run test:cov`);
    process.exit(1);
}
const summary = JSON.parse(readFileSync(SUMMARY, 'utf8'));
const total = summary.total;

// 统计源组件数：按 src/components/ 下含同名 .tsx 的目录数
// （不依赖 coverage 数据 —— Icon 已被 coverage exclude，但仍是有测试的组件）
import { readdirSync } from 'fs';
const components = readdirSync(resolve(ROOT, 'src/components')).filter((d) =>
    existsSync(resolve(ROOT, `src/components/${d}/${d}.tsx`))
).length;

// ---------- 2. 读 vitest JSON（可选用） ----------
let tests = 0;
if (existsSync(VITEST)) {
    const vr = JSON.parse(readFileSync(VITEST, 'utf8'));
    const real = vr.testResults.filter((t) => t.name.includes('/src/components/'));
    tests = real.reduce((s, t) => s + t.assertionResults.filter((a) => a.status === 'passed').length, 0);
    if (real.length !== components) {
        console.warn(
            `[badges] vitest 报告 ${real.length} 个组件测试文件，但 coverage 统计到 ${components} 个组件 —— 以 components 为准`
        );
    }
}

// ---------- 3. 写 docs/badges/coverage.json ----------
mkdirSync(dirname(BADGE_JSON), { recursive: true });
const badge = {
    schemaVersion: 1,
    label: 'coverage',
    message: `${total.lines.pct.toFixed(2)}%`,
    color:
        total.lines.pct >= 90
            ? 'brightgreen'
            : total.lines.pct >= 80
              ? 'green'
              : total.lines.pct >= 70
                ? 'yellow'
                : total.lines.pct >= 60
                  ? 'orange'
                  : 'red',
    statements: total.statements.pct.toFixed(2),
    branches: total.branches.pct.toFixed(2),
    functions: total.functions.pct.toFixed(2),
    lines: total.lines.pct.toFixed(2),
    components,
    tests,
};
writeFileSync(BADGE_JSON, JSON.stringify(badge, null, 2));
console.log(`[badges] -> ${BADGE_JSON}`);
console.log(`         lines ${badge.lines}% · ${components} components · ${tests} tests`);

// ---------- 4. 同步 README 徽章 ----------
/**
 * 替换策略：行内硬编码的徽章 markdown
 *   旧：<img src="https://img.shields.io/badge/tests-180%20✓-brightgreen?style=flat-square"
 *   新：<img src="https://img.shields.io/badge/tests-181%20✓-brightgreen?style=flat-square"
 */
const updateReadme = (readmePath) => {
    if (!existsSync(readmePath)) return;
    let content = readFileSync(readmePath, 'utf8');
    const orig = content;

    // tests-XX ✓  ← 把 XX 换成新值
    content = content.replace(/(badge\/tests-)\d+/g, (m, p1) => `${p1}${tests}`);

    // components-XX  ← 把 XX 换成新值
    content = content.replace(/(badge\/components-)\d+/g, (m, p1) => `${p1}${components}`);

    if (content !== orig) {
        writeFileSync(readmePath, content);
        console.log(`[badges] updated ${relative(ROOT, readmePath)}`);
    } else {
        console.log(`[badges] no change in ${relative(ROOT, readmePath)}`);
    }
};

updateReadme(resolve(ROOT, 'README.md'));
updateReadme(resolve(ROOT, 'docs/README.zh-CN.md'));
