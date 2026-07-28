# ADR 0003: Vite Library-Mode Build

## Status

Accepted

## Context

The library ships 30 components, two web font families, and 488 item icons. A conventional single-file library bundle would drag all of that into every consuming application, regardless of whether the application imports one component or all of them.

Vite's library mode defaults work against this: it emits one flat artifact per format and forcibly inlines every referenced asset as a data URI. Both behaviours must be overridden for a component library where per-component tree-shaking is the whole point.

## Decision

Build with Vite in library mode from `src/index.ts`, targeting `es2020`. Type declarations are emitted separately by `tsc --project tsconfig.build.json --emitDeclarationOnly` into `dist/types/`.

Two Rollup outputs are produced, both preserving the source module graph:

- ES → `dist/es/[name].js`
- CJS → `dist/cjs/[name].cjs` with `exports: 'named'`

Both set `preserveModules: true` and `preserveModulesRoot: 'src'`, so one output file exists per source module and a consumer's bundler can drop the components it never imports — including their fonts and images. `cssCodeSplit: true` splits stylesheets along the same boundaries. Peer packages stay external (see [ADR 0001](0001-zero-runtime-dependencies.md)).

Six plugins in `vite.config.ts` make this arrangement produce a usable package — five defined in that file, plus one third-party plugin:

- `strip-woff-fallback` (`stripWoffFallbackPlugin`) — rewrites `@fontsource` CSS to drop the `woff` fallback `url()`, and deletes the now-orphaned `.woff` assets from the bundle. Every browser the library targets supports `woff2`; the emitted asset directory shrinks by roughly 40%. Runs with `enforce: 'pre'` so the rewrite happens before assets are collected.
- `@laynezh/vite-plugin-lib-assets` (`libAssetsPlugin`, `outputPath: 'files'`, `limit: 0`) — the third-party plugin that defeats library mode's forced inlining, emitting fonts and images as content-hashed files under `dist/files/`.
- `inject-imported-css` (`injectImportedCssPlugin`) — with `cssCodeSplit` and `preserveModules`, Vite emits per-component CSS but writes no reference to it, leaving orphaned stylesheets. This plugin reads each chunk's `viteMetadata.importedCss` and prepends `import "./x.css"` (ES) or `require("./x.css")` (CJS), so importing a component brings its styles along.
- `emit-global-style-entry` (`emitGlobalStyleEntryPlugin`) — concatenates the global stylesheet followed by every component CSS module into `dist/index.css`, which backs the `animal-island-ui/style` subpath. Global styles come first so component rules can resolve the `:root` custom properties. Asset URLs are rewritten from source-relative (`url(../../files/x.svg)`) to `dist`-relative (`url("files/x.svg")`), and unreferenced files in `dist/files/` are deleted.
- `copy-item-assets` (`copyItemAssetsPlugin`) — copies the 488 item PNGs to `dist/items/` for the `animal-island-ui/items/*` subpath, so consumers import individual icons by URL and bundle only those.
- `prune-empty-dirs` (`pruneEmptyDirsPlugin`) — removes the empty directory tree that asset redirection leaves behind under `dist/`.

`package.json` completes the contract: `sideEffects: false` plus an `exports` map covering the root entry, `./style`, `./es/*`, and `./items/*`.

## Consequences

- Consumers pay only for what they import, in both module formats. CJS consumers on older bundlers get per-file output rather than one monolith.
- Full styles remain available in one import for consumers who do not want per-component CSS.
- **Never disable `preserveModules` or `cssCodeSplit`.** Either change collapses the output into a monolith and silently reverts every consumer to shipping the whole library. The same applies to re-enabling asset inlining or shortening the externals list.
- Build correctness depends on plugin ordering. `strip-woff-fallback` must precede asset collection, and the aggregation and copy plugins run in `closeBundle`, after CSS has been written to disk.
- Orphan cleanup in `dist/files/` scans emitted JS and CSS for literal `files/<name>` references. An asset whose path is assembled at runtime would not be found and would be deleted; assets must be statically imported or referenced from CSS.
- After changing a component's styles, confirm those rules still appear in `dist/index.css` — the aggregation walks the emitted tree, so a stylesheet that stops being emitted disappears from the global entry without error.
