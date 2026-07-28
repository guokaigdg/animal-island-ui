# Repository Structure

## Project

animal-island-ui is a React + TypeScript UI component library inspired by _a cozy island-style UI_, aimed at
personal learning and non-commercial use. Its design language is warm earth tones, large pill-shaped radii, tactile
game-button depth, soft motion, and a mix of geometric and organic shapes — see
[../design-system/](../design-system/) for the definition.

- Repository: https://github.com/guokaigdg/animal-island-ui
- License: CC BY-NC 4.0 (commercial use prohibited) — see `LICENSE`
- Current version: see `package.json`
- Component list: `src/index.ts` is the source of truth; every component under `src/components/` with a matching
  `<Name>.tsx` counts as one

## Tech Stack

| Area            | Choice                                          |
| --------------- | ----------------------------------------------- |
| Framework       | React 18 (peerDependencies allow >=17)          |
| Language        | TypeScript 5.7, `strict: true`                  |
| Build           | Vite 7 (library mode, dual ES + CJS output)     |
| Testing         | Vitest 4 + jsdom 29 + @testing-library/react 16 |
| Accessibility   | axe-core 4 + vitest-axe (`npm run test:a11y`)   |
| Styling         | Less Modules (`*.module.less`)                  |
| Code quality    | ESLint 9 (flat config) + Prettier               |
| Package manager | npm (`package-lock.json`)                       |
| Node            | `engines.node >= 18`                            |

## npm Scripts

```bash
npm run dev          # start the demo dev server (vite, not a library build)
npm run build        # build the library into dist/ (vite build + tsc --emitDeclarationOnly)
npm run build:demo   # build the demo site into demo-dist/
npm run test         # vitest watch
npm run test:run     # vitest run (single pass)
npm run test:cov     # coverage + json output
npm run test:a11y    # axe-core accessibility smoke tests (separate vitest config)
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm run check:docs   # documentation drift check (scripts/check-docs-sync.mjs)
npm run badges       # regenerate coverage badges and sync them into both READMEs
npm run ci           # format:check + check:docs + lint + test:run + test:a11y + build
npm run deploy       # build:demo + publish demo-dist to GitHub Pages
npm run setup:hooks  # point git at .githooks (runs automatically via prepare)
```

Fast loop while working: `npm run lint && npm run test:run && npm run build`. `npm run ci` is the gate — it also runs
inside the pre-commit hook, see [contributing.md](./contributing.md).

## Directory Layout

```
src/
  components/
    <ComponentName>/
      <ComponentName>.tsx        # component implementation
      <component>.module.less    # styles (CSS Modules, lowercase-hyphen filename)
      index.ts                   # export entry (export { X } from './X'; export type { ... })
      <ComponentName>.test.tsx   # unit test, colocated with the component
  styles/
    variables.less               # Less compile-time design tokens (@primary-color, ...)
    themes/default.less          # runtime CSS custom properties (--animal-*)
    fonts.less / reset.less / index.less
  assets/                        # fonts, images
  index.ts                       # library barrel export
demo/                            # demo site source (never published to npm)
test/                            # shared test helpers (setup.ts / utils.tsx / components.tsx) + a11y.test.tsx
scripts/                         # check-docs-sync.mjs / generate-coverage-badges.mjs
docs/
  design-system/                 # canonical visual definition: tokens, rules, per-component pixel specs
  development/                   # this directory
  adr/                           # architecture decision records
  zh-CN/                         # Chinese mirror of docs/
  img/                           # screenshots referenced by the READMEs
  README.zh-CN.md                # Chinese README (mirrors the root README.md)
skills/
  animal-island-ui-style/        # external-facing skill package (references/components/*.md)
```

## Path Aliases

- `@/*` → `./src/*` — declared in `tsconfig.json`, `vite.config.ts`, and `vitest.config.ts`
- `@test/*` → `./test/*` — declared in `tsconfig.json` and `vitest.config.ts` (test-only)

Both are already wired up in every config that needs them; import through them directly rather than writing long
relative paths.
