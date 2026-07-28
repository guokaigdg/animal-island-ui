# AGENTS.md — working in this repository

animal-island-ui is a React 18 + TypeScript 5.7 component library (30 components, Less
Modules, Vite 7 library build, Vitest 4) inspired by a cozy island-style UI.
Zero runtime dependencies (`dependencies: {}`); CC BY-NC 4.0 (non-commercial).

This file is the entry point for coding agents. It routes; the referenced docs hold the
detail. Keep it lean — add new rules to the docs below, not here.

## Read first, by task

| Task                                     | Authority                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Use / compose components (consumer code) | installed package's TypeScript declarations; [skills/animal-island-ui-style/](skills/animal-island-ui-style/SKILL.md) |
| Change component styles or visuals       | [docs/design-system/](docs/design-system/README.md) — tokens, rules, per-component pixel specs                        |
| Add or modify a component                | [docs/development/component-development.md](docs/development/component-development.md)                                |
| Write or fix tests                       | [docs/development/testing.md](docs/development/testing.md)                                                            |
| Touch build / vite.config.ts / packaging | [docs/development/build-and-release.md](docs/development/build-and-release.md) + [docs/adr/](docs/adr/README.md)      |
| Language, lint, TS, styling conventions  | [docs/development/coding-standards.md](docs/development/coding-standards.md)                                          |
| Repo layout, commands, aliases           | [docs/development/repository-structure.md](docs/development/repository-structure.md)                                  |
| Submit changes                           | [docs/development/contributing.md](docs/development/contributing.md)                                                  |

Conflict priority (high → low): repository source code (`*.tsx` / `*.module.less` /
`*.config.ts`) → this file → docs. When docs disagree with source, source wins — fix the
doc in the same change.

## Verification

```bash
npm run ci      # format:check + check:docs + lint + test:run + test:a11y + build — must pass before any PR
npm run badges  # after coverage/component-count changes: regenerates badges in README.md + docs/README.zh-CN.md
```

A pre-commit hook (`.githooks/pre-commit`) runs `npm run ci`; don't bypass it with
`--no-verify`.

## Content that must be kept in sync

Documentation is a first-class deliverable here. There are exactly two kinds of
intentional duplication — when you touch one side, update the other in the same change:

1. **Translations** (mirror structure and meaning; tech terms stay English):
    - `docs/**` (English) ↔ `docs/zh-CN/**`
    - `README.md` ↔ `docs/README.zh-CN.md`
    - `skills/animal-island-ui-style/SKILL.md` ↔ `SKILL.zh-CN.md` (human-review copy; agents read only SKILL.md)
2. **The published skill restates usage** of what the design system defines:
    - component API changes → `skills/animal-island-ui-style/references/components/<category>.md` (props verbatim from source)
    - component style changes → `docs/design-system/components/<category>.md` (+ zh-CN mirror)

Everything else is single-source: the design system ([docs/design-system/](docs/design-system/README.md))
defines the design language and depends on nothing; code implements it; all other docs
link instead of restating. The skill directory is self-contained — links between files
inside the skill stay relative (they must resolve after the skill is installed on its
own), while anything outside the skill directory is referenced only by GitHub URL, never
by repo-relative path.

`npm run check:docs` enforces: every component in `src/components/` is covered in both
`docs/design-system/components/` and the skill's `references/components/` (which are also
capped at 200 lines per file), and `docs/zh-CN/` mirrors `docs/`. Demo pages have **no**
automated check — a new component must be registered in three places by hand:
`demo/pageInfo.ts`, `demo/ComponentPage.tsx` (`PAGE_INFO` + `PAGES`), and
`demo/HomePage.tsx` (`components` list). If a demo menu click shows a blank main area,
check `ComponentPage.tsx`'s internal `PAGE_INFO` first.

## Ground rules

- Never invent component APIs — read the source or declarations first.
- Visual changes must satisfy [docs/design-system/design-rules.md](docs/design-system/design-rules.md).
- No new runtime dependencies; never disable `preserveModules` / `cssCodeSplit`
  (rationale in [docs/adr/](docs/adr/README.md)).
- Conventional Commits; branch from `main`.
- Docs are English-primary with Chinese mirrors under `docs/zh-CN/`.
- For audit/optimization requests: report P0 (must-fix) vs suggestions and let the user
  decide — don't apply every suggestion unprompted.
