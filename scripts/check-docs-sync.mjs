#!/usr/bin/env node
/**
 * Docs sync check — documentation is a first-class deliverable in this repo.
 *
 * Discovers components from src/components/ and verifies:
 *   1. Component coverage — every component has a `## <Name>` (any level) heading in:
 *        - docs/design-system/components/*.md          (canonical pixel specs)
 *        - skills/animal-island-ui-style/references/components/*.md (published skill)
 *   2. Skill reference size — each skill components file is ≤ 200 lines.
 *   3. Translation parity — docs/zh-CN/ mirrors docs/ file-for-file
 *      (excluding docs/zh-CN/ itself, docs/img/, docs/README.zh-CN.md).
 *   4. skills/animal-island-ui-style/SKILL.zh-CN.md exists (human-review translation).
 *
 * Usage: node scripts/check-docs-sync.mjs
 * Exit code: 0 all aligned; 1 drift found.
 *
 * Sync policy source of truth: AGENTS.md "Content that must be kept in sync".
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const COMPONENTS_DIR = resolve(ROOT, 'src/components');
const DESIGN_SYSTEM_COMPONENTS = resolve(ROOT, 'docs/design-system/components');
const SKILL_DIR = resolve(ROOT, 'skills/animal-island-ui-style');
const SKILL_COMPONENTS = resolve(SKILL_DIR, 'references/components');
const DOCS_DIR = resolve(ROOT, 'docs');
const DOCS_ZH_DIR = resolve(ROOT, 'docs/zh-CN');
const SKILL_REF_MAX_LINES = 200;

const problems = [];

// ---------- 1. Discover components from src/components/ ----------
const components = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(resolve(COMPONENTS_DIR, d.name, `${d.name}.tsx`)))
    .map((d) => d.name)
    .sort();

// ---------- Helpers ----------
const listMarkdown = (dir) =>
    existsSync(dir)
        ? readdirSync(dir)
              .filter((f) => f.endsWith('.md'))
              .sort()
              .map((f) => join(dir, f))
        : [];

/** Strict match: a markdown heading starting with the component name. */
const hasHeading = (text, name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^#{1,6}\\s+${escaped}\\b`, 'm').test(text);
};

const walkFiles = (dir, skip = () => false) => {
    const out = [];
    if (!existsSync(dir)) return out;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (skip(full)) continue;
        if (entry.isDirectory()) out.push(...walkFiles(full, skip));
        else out.push(full);
    }
    return out;
};

// ---------- 2. Component coverage in design system + skill references ----------
const coverageGroups = {
    'docs/design-system/components/': listMarkdown(DESIGN_SYSTEM_COMPONENTS),
    'skills/animal-island-ui-style/references/components/': listMarkdown(SKILL_COMPONENTS),
};

for (const [label, files] of Object.entries(coverageGroups)) {
    if (files.length === 0) {
        problems.push(`${label} contains no markdown files`);
        continue;
    }
    const corpus = files.map((f) => readFileSync(f, 'utf8')).join('\n');
    for (const name of components) {
        if (!hasHeading(corpus, name)) {
            problems.push(`component "${name}" has no heading in ${label}`);
        }
    }
}

// ---------- 3. Skill reference size cap ----------
for (const file of listMarkdown(SKILL_COMPONENTS)) {
    const lines = readFileSync(file, 'utf8').split('\n').length;
    if (lines > SKILL_REF_MAX_LINES) {
        problems.push(`${relative(ROOT, file)} has ${lines} lines (cap ${SKILL_REF_MAX_LINES}) — split or compress it`);
    }
}

// ---------- 4. Translation parity: docs/ ↔ docs/zh-CN/ ----------
const skipInDocs = (p) => p === DOCS_ZH_DIR || p === join(DOCS_DIR, 'img') || p === join(DOCS_DIR, 'README.zh-CN.md');

const enDocs = walkFiles(DOCS_DIR, skipInDocs)
    .filter((f) => f.endsWith('.md'))
    .map((f) => relative(DOCS_DIR, f))
    .sort();
const zhDocs = walkFiles(DOCS_ZH_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => relative(DOCS_ZH_DIR, f))
    .sort();

for (const f of enDocs) {
    if (!zhDocs.includes(f)) problems.push(`missing Chinese mirror: docs/zh-CN/${f} (for docs/${f})`);
}
for (const f of zhDocs) {
    if (!enDocs.includes(f)) problems.push(`orphan Chinese mirror: docs/zh-CN/${f} has no docs/${f}`);
}

// ---------- 5. Skill translation for human review ----------
if (!existsSync(join(SKILL_DIR, 'SKILL.zh-CN.md'))) {
    problems.push('skills/animal-island-ui-style/SKILL.zh-CN.md is missing');
} else if (!statSync(join(SKILL_DIR, 'SKILL.zh-CN.md')).size) {
    problems.push('skills/animal-island-ui-style/SKILL.zh-CN.md is empty');
}

// ---------- Report ----------
console.log(`\n🔎 docs sync check — ${components.length} components from src/components/\n`);

if (problems.length === 0) {
    console.log('🎉 all aligned: design-system + skill coverage, size caps, zh-CN parity.\n');
    process.exit(0);
}

console.error(`⚠️  ${problems.length} drift issue(s) found:\n`);
for (const p of problems) console.error(`   • ${p}`);
console.error('\nSync policy: AGENTS.md § "Content that must be kept in sync". Re-run: npm run check:docs\n');
process.exit(1);
