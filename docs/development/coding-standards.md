# Coding Standards

Language, styling, and tooling rules that apply to every file in the repository. Component-level conventions (props
shape, skeleton, naming, demo) live in [component-development.md](./component-development.md); visual rules live in
[../design-system/design-rules.md](../design-system/design-rules.md).

## TypeScript

- Compiler baseline: `strict: true`, `isolatedModules: true`, `moduleResolution: 'bundler'`, `jsx: 'react-jsx'`,
  `target: ES2020`.
- Three tsconfigs, each with one job:
    - `tsconfig.json` — the base config, covers `src` / `demo` / `test`
    - `tsconfig.build.json` — `src` only, `emitDeclarationOnly`, declarations into `dist/types`
    - `tsconfig.test.json` — test files only, `noEmit`
- Do not use `any` in component code (ESLint warns; test files are exempt). Prefix intentionally unused bindings with
  `_` to silence the unused-vars rule.
- Type exports must use `export type`, kept separate from value exports — `isolatedModules` requires it.

## CSS Modules

`vite.config.ts` and `vitest.config.ts` declare identical CSS Module settings, so class names resolve the same way in
the build and in tests:

- `generateScopedName: 'animal-[local]-[hash:base64:5]'` — produces class names like `animal-btn-primary-abc12`
- `localsConvention: 'camelCase'`
- Less `additionalData` auto-injects `src/styles/variables.less`, so component `.less` files can use `@primary-color`
  and friends without an explicit `@import`

Keep the two configs in sync; a divergence makes tests assert against class names the build never produces.

## Design Tokens

There are two token systems and they are not interchangeable:

1. **Less compile-time variables** (`src/styles/variables.less`, `@` prefix): `@primary-color`, `@text-color`,
   `@bg-color`, `@border-radius-base`, `@motion-ease`, `@height-base`, … These are substituted with literals at build
   time and do not exist at runtime.
2. **Runtime CSS custom properties** (`src/styles/themes/default.less`, `--animal-` prefix): `--animal-primary-color`,
   `--animal-text-color`, `--animal-spacing-sm`, `--animal-font-family`, `--animal-shadow-sm`, … Component
   `.module.less` files reference them through `var(--animal-*)`, and consumers can override them.

Prefer `var(--animal-*)` in component styles so downstream theming works. Reach for Less variables only when the value
must participate in compile-time computation (arithmetic, `darken()`, mixins).

The values themselves are defined in [../design-system/design-tokens.md](../design-system/design-tokens.md) — do not
restate them in code comments or other docs.

`src/styles/index.less` is the global style entry (`fonts.less` + `themes/default.less` + `reset.less`); how it becomes
the published stylesheet is covered in [build-and-release.md](./build-and-release.md).

## Formatting and Linting

Prettier (`.prettierrc`): single quotes, 4-space indent, semicolons, trailing comma `es5`, `printWidth: 120`, always
parenthesized arrow params, `endOfLine: lf`.

ESLint (flat config in `eslint.config.js`), on top of `js.configs.recommended` + `typescript-eslint` recommended:

- `@typescript-eslint/no-unused-vars`: warn, ignores the `^_` prefix for args, vars, and caught errors
- `@typescript-eslint/no-explicit-any`: warn (off in tests and demo)
- `no-console`: warn, `console.warn` / `console.error` allowed (off in tests and demo)
- `prefer-const`: warn
- `eqeqeq`: error
- `react-refresh/only-export-components`: warn with `allowConstantExport` (off in demo)
- React Hooks rules from `eslint-plugin-react-hooks`
- Ignored: `dist` / `demo-dist` / `coverage` / `node_modules` / `scripts` / `*.config.{js,ts}` / `**/*.min.js` /
  `**/*.min.d.ts` / `**/island/**`

## Prohibitions

- Do not embed a Vitest `test` block in `vite.config.ts` — Vitest 4 silently ignores it. Configuration belongs in
  `vitest.config.ts`, see [testing.md](./testing.md).
- Do not write global selectors (`body`, `:root`, …) inside a component `.module.less`. Global styles belong in
  `src/styles/`.
- Do not break the `src/index.ts` barrel format (values via `export {}`, types via `export type {}`).
- Do not hardcode CSS Module class-name literals in assertions — always go through `styles['xxx']`.
- Do not invent component APIs. Read the component source, or the reference docs listed in
  [component-development.md](./component-development.md).
- Do not add runtime dependencies; `dependencies` stays `{}`.
- Do not commit `dist/`, `demo-dist/`, or `coverage/`.

## Scripting Pitfalls

Recurring traps when writing one-off maintenance scripts:

- Batch string replacement: `String.replace` is immutable (its return value is the result), a `changed` flag mutated
  inside a replacer callback escapes the local reasoning you expect, and `[^>]*` does not match across quoted
  attributes. Vitest JSON output needs an explicit `--outputFile` path.
- DOM-to-PNG export (html-to-image, modern-screenshot): Chromium does not read `document.fonts` during capture, so the
  `@font-face` rules must be injected as a `<style>` child of the screenshot root node or the export renders with
  fallback fonts.
