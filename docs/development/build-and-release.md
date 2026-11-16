# Build and Release

`npm run build` produces the published artifact: `vite build` emits JavaScript, CSS, and assets into `dist/`, then
`tsc --project tsconfig.build.json --emitDeclarationOnly` emits declarations into `dist/types/`. The rationale behind
the choices below is recorded in [../adr/](../adr/); this page is the contract itself.

## Build Contract

`vite.config.ts` registers four plugins on top of `@vitejs/plugin-react` to make per-component imports work. Changing
build logic without preserving the following breaks consumer tree-shaking:

- **Dual output** — ES into `dist/es/` and CJS into `dist/cjs/`, both with `preserveModules: true` and
  `preserveModulesRoot: 'src'`, so consumers tree-shake per component and the fonts or images of unused components never
  reach their bundle. Do not turn `preserveModules` off.
- **Externals** — `react`, `react-dom`, `react/jsx-runtime`, and `classnames` are never bundled; they are
  peerDependencies.
- **`cssCodeSplit: true`, one stylesheet** — component CSS is split per module and aggregated by
  `emitGlobalStyleEntryPlugin` into `dist/index.css`, but the component JavaScript carries **no CSS import**. A
  published `import "./x.css"` is a file-style import: Node refuses to parse it, so the package fails to load in
  plain Node (`ERR_UNKNOWN_FILE_EXTENSION`) and in any SSR bundler that follows the import graph. Styles are
  delivered through the single `animal-island-ui/style` entry instead. Do not turn `cssCodeSplit` off, and do not
  reintroduce per-component CSS imports.
- **Assets stay external** — `@laynezh/vite-plugin-lib-assets` (`outputPath: 'files'`, `limit: 0`) writes fonts and
  images to `dist/files/` instead of letting library mode inline them.
- **Global stylesheet entry** — `emitGlobalStyleEntryPlugin` aggregates `dist/index.css` (what `animal-island-ui/style`
  resolves to) and prunes orphaned files from `dist/files/`. After changing a component's CSS, confirm those styles
  still appear in `dist/index.css`.
- **Illustrations are strings, not modules** — the scene SVGs are referenced with
  `new URL('./x.svg', import.meta.url).href`, never with `import`. An `import` would emit
  `import x from "../../files/x.svg"` into the published JavaScript, which Node cannot resolve either. Vite's
  library mode inlines such assets as data URIs (`shouldInline` returns `true` for `build.lib`), which is the only
  form that survives the consumer's bundler. The four illustrations (~315 KB of SVG) therefore live inside the
  JavaScript, roughly 20% larger as percent-encoded data URIs.
- **No file-style imports in the output** — `npm run check:bundle` scans `dist/es` and `dist/cjs` for `import` /
  `require` of `.css`, `.less`, `.svg`, `.png` and friends, and fails the build on any hit. The published JavaScript
  must stay loadable by plain Node and by SSR bundlers.
- **ESM-compatible declarations** — `scripts/fix-dts-extensions.mjs` rewrites the relative specifiers in
  `dist/types/` to their ESM form (`./Button` → `./Button.js`, `./components/Button` →
  `./components/Button/index.js`) and drops the style side-effect imports. The package is ESM
  (`"type": "module"`), so a consumer on `moduleResolution: "node16"` / `"nodenext"` cannot resolve the
  extensionless, directory-style specifiers `tsc` copies verbatim from the source — the whole module graph
  fails to resolve and **every export degrades to `any`**, silently disabling the consumer's type checking
  (issue #79). `npm run check:types` fails the build if any relative specifier in `dist/types/` still lacks an
  explicit extension or points at a missing `.d.ts`. This is the same discipline as `rewriteCssAssetUrls` above:
  the published artifact is normalised to the package's own export contract, not the other way round.
- **woff2 only** — `stripWoffFallbackPlugin` removes the woff fallbacks emitted alongside the woff2 fonts, cutting
  roughly 40% of font weight.
- `pruneEmptyDirsPlugin('dist')` cleans up directories left empty by the steps above.

## Package Contract

`package.json` is already wired for per-component consumption; keep it that way:

- `exports` maps `.` to the ES/CJS/types triple, `./style` to `dist/index.css`, and `./es/*` to the preserved ES
  modules with a `types` condition pointing at `dist/types/*`, so a deep import keeps its types under every
  `moduleResolution`.
- `sideEffects: false` lets bundlers drop unused modules.
- `files` limits the published tarball to the build output plus the README.
- `dependencies` holds exactly two runtime dependencies, both pure and dependency-free:
  `naive-icons` (the icon set) and `dayjs` (the date layer, per
  [ADR 0005](../adr/0005-dayjs-as-the-date-layer.md)). Everything else third-party is a
  peerDependency or a devDependency. `dayjs` stays **out** of the `external` list, so it is
  emitted once under `dist/**/node_modules/dayjs/` and shared by the date and time
  components of this package — consumers get it without a separate install, though a host
  application importing its own `dayjs` can still end up with an independent instance that
  shares neither locale nor plugins. `preserveModules` still drops it for consumers who
  import none. Do not add further runtime dependencies.

`prepublishOnly` runs `npm run build && npm run check:types`, so a publish always ships a fresh artifact and never
ships declarations the ESM module graph cannot resolve.

## Badges

`npm run badges` (`scripts/generate-coverage-badges.mjs`) reads `coverage/coverage-summary.json` and
`coverage/vitest-results.json`, writes `coverage/badges/coverage.json`, counts components by scanning
`src/components/` for directories containing a matching `<Name>.tsx`, and rewrites the hardcoded `tests-NN` and
`components-NN` shields in both `README.md` and `docs/README.zh-CN.md`. Run `npm run test:cov` first — the script exits
with an error if the coverage summary is missing.

## Demo Site

`npm run build:demo` builds the demo into `demo-dist/` using `vite.config.demo.ts`; `npm run deploy` chains that with
`gh-pages -d demo-dist` to publish it. The demo is never part of the npm artifact.
