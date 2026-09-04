# Build and Release

`npm run build` produces the published artifact: `vite build` emits JavaScript, CSS, and assets into `dist/`, then
`tsc --project tsconfig.build.json --emitDeclarationOnly` emits declarations into `dist/types/`. The rationale behind
the choices below is recorded in [../adr/](../adr/); this page is the contract itself.

## Build Contract

`vite.config.ts` registers six plugins on top of `@vitejs/plugin-react` to make per-component imports work. Changing
build logic without preserving the following breaks consumer tree-shaking:

- **Dual output** — ES into `dist/es/` and CJS into `dist/cjs/`, both with `preserveModules: true` and
  `preserveModulesRoot: 'src'`, so consumers tree-shake per component and the fonts or images of unused components never
  reach their bundle. Do not turn `preserveModules` off.
- **Externals** — `react`, `react-dom`, `react/jsx-runtime`, and `classnames` are never bundled; they are
  peerDependencies.
- **`cssCodeSplit: true` + `injectImportedCssPlugin`** — component CSS is split per module, and the plugin writes the
  `import "./x.css"` (ES) / `require("./x.css")` (CJS) statements back into the emitted JavaScript, so importing a
  component pulls in exactly its styles. Do not turn `cssCodeSplit` off.
- **Assets stay external** — `@laynezh/vite-plugin-lib-assets` (`outputPath: 'files'`, `limit: 0`) writes fonts and
  images to `dist/files/` instead of letting library mode inline them.
- **Global stylesheet entry** — `emitGlobalStyleEntryPlugin` aggregates `dist/index.css` (what `animal-island-ui/style`
  resolves to) and prunes orphaned files from `dist/files/`. After changing a component's CSS, confirm those styles
  still appear in `dist/index.css`.
- **woff2 only** — `stripWoffFallbackPlugin` removes the woff fallbacks emitted alongside the woff2 fonts, cutting
  roughly 40% of font weight.
- `pruneEmptyDirsPlugin('dist')` cleans up directories left empty by the steps above.

## Package Contract

`package.json` is already wired for per-component consumption; keep it that way:

- `exports` maps `.` to the ES/CJS/types triple, `./style` to `dist/index.css`, `./es/*` to the preserved ES modules,
  and `./items/*` to the copied item assets.
- `sideEffects: false` lets bundlers drop unused modules.
- `files` limits the published tarball to the build output plus the top-level type shim and docs.
- `dependencies` is `{}`. The library has zero runtime dependencies — everything third-party is a peerDependency or a
  devDependency.

`prepublishOnly` runs `npm run build`, so a publish always ships a fresh artifact.

## Badges

`npm run badges` (`scripts/generate-coverage-badges.mjs`) reads `coverage/coverage-summary.json` and
`coverage/vitest-results.json`, writes `coverage/badges/coverage.json`, counts components by scanning
`src/components/` for directories containing a matching `<Name>.tsx`, and rewrites the hardcoded `tests-NN` and
`components-NN` shields in both `README.md` and `docs/README.zh-CN.md`. Run `npm run test:cov` first — the script exits
with an error if the coverage summary is missing.

## Demo Site

`npm run build:demo` builds the demo into `demo-dist/` using `vite.config.demo.ts`; `npm run deploy` chains that with
`gh-pages -d demo-dist` to publish it. The demo is never part of the npm artifact.
