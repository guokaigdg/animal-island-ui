# ADR 0003: Vite Library-Mode Build

## Status

Accepted

## Context

The library ships 43 components and two web font families. A conventional single-file library bundle would drag all of that into every consuming application, regardless of whether the application imports one component or all of them.

Vite's library mode defaults work against this: it emits one flat artifact per format and forcibly inlines every referenced asset as a data URI. Both behaviours must be overridden for a component library where per-component tree-shaking is the whole point.

## Decision

Build with Vite in library mode from `src/index.ts`, targeting `es2020`. Type declarations are emitted separately by `tsc --project tsconfig.build.json --emitDeclarationOnly` into `dist/types/`, then normalised by `scripts/fix-dts-extensions.mjs` (see the ESM declaration paragraph below).

Two Rollup outputs are produced, both preserving the source module graph:

- ES → `dist/es/[name].js`
- CJS → `dist/cjs/[name].cjs` with `exports: 'named'`

Both set `preserveModules: true` and `preserveModulesRoot: 'src'`, so one output file exists per source module and a consumer's bundler can drop the components it never imports — including their fonts and images. `cssCodeSplit: true` splits stylesheets along the same boundaries. Peer packages stay external (see [ADR 0001](0001-zero-runtime-dependencies.md)).

Externals are matched by a predicate, not a literal list: `isPeerDependency` matches `react`, `react-dom` and `classnames` **together with every sub-path entry point** (`react-dom/client`, `react/jsx-runtime`, …). Rollup's `external` array matches literal strings only, so a sub-path import that is not spelled out gets bundled instead of externalised. The bundled `react-dom/client` then writes `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint` on the **consumer's** react-dom — a field React 19 removed — so `Notification.success()` throws `TypeError: Cannot set properties of undefined` in a React 19 app (issue #78). `npm run check:bundle` fails the build if any peer dependency (or the removed internal field) reappears in `dist/`.

Four plugins in `vite.config.ts` make this arrangement produce a usable package — three defined in that file, plus one third-party plugin:

- `strip-woff-fallback` (`stripWoffFallbackPlugin`) — rewrites `@fontsource` CSS to drop the `woff` fallback `url()`, and deletes the now-orphaned `.woff` assets from the bundle. Every browser the library targets supports `woff2`; the emitted asset directory shrinks by roughly 40%. Runs with `enforce: 'pre'` so the rewrite happens before assets are collected.
- `@laynezh/vite-plugin-lib-assets` (`libAssetsPlugin`, `outputPath: 'files'`, `limit: 0`) — the third-party plugin that defeats library mode's forced inlining, emitting fonts and images as content-hashed files under `dist/files/`.
- `emit-global-style-entry` (`emitGlobalStyleEntryPlugin`) — concatenates the global stylesheet followed by every component CSS module into `dist/index.css`, which backs the `animal-island-ui/style` subpath. Global styles come first so component rules can resolve the `:root` custom properties. Asset URLs are rewritten from source-relative (`url(../../files/x.svg)`) to `dist`-relative (`url("files/x.svg")`), and unreferenced files in `dist/files/` are deleted.
- `prune-empty-dirs` (`pruneEmptyDirsPlugin`) — removes the empty directory tree that asset redirection leaves behind under `dist/`.

Styles ship as **one stylesheet**. The component JavaScript deliberately carries no CSS import. A published `import "./x.css"` is a file-style import, and Node refuses to parse it — the whole package fails to load in plain Node (`ERR_UNKNOWN_FILE_EXTENSION`) and in any SSR bundler that follows the import graph, even when the consumer never asked for that stylesheet. The library therefore delivers every rule through `dist/index.css` (`animal-island-ui/style`), which already contains the global tokens plus all 42 component stylesheets; consumers import it once at their entry point. A per-component CSS import would be a nicety, but it is not worth making the package unloadable outside a browser bundler.

Illustrations are referenced with `new URL('./x.svg', import.meta.url).href` rather than `import`. An `import` would emit `import x from "../../files/x.svg"` into the published JavaScript — another file-style import Node cannot resolve. `new URL(...)` produces a plain string, so the module graph stays clean. Vite's library mode inlines every such asset as a data URI (`shouldInline` returns `true` for `build.lib`), which is the only form that survives the consumer's bundler: a relative path into `dist/files/` would be resolved against the consumer's own output chunks and 404. The cost is that the four scene illustrations (~315 KB of SVG) are baked into the JavaScript as percent-encoded data URIs, roughly 20% larger than the sources.

`package.json` completes the contract: `sideEffects: false` plus an `exports` map covering the root entry, `./style`, and `./es/*`. The `./es/*` subpath carries a `types` condition pointing at `dist/types/*`, so a consumer importing a component by path keeps its types under every `moduleResolution`.

## Consequences

- Consumers pay only for what they import, in both module formats. CJS consumers on older bundlers get per-file output rather than one monolith.
- Full styles remain available in one import for consumers who do not want per-component CSS. That import is now the only style channel — a consumer that forgets `import 'animal-island-ui/style'` gets unstyled components.
- The published JavaScript contains no file-style import — no CSS, no SVG, no font URL. `npm run check:bundle` fails the build if one reappears, because the failure it causes (an unloadable package) stays invisible until a consumer loads the library in Node or SSR.
- A consumer that imports `Progress` or `Background` carries roughly 54 KB gzipped of scene illustrations inside the JavaScript. They are no longer separate, separately cacheable files.
- **Never disable `preserveModules` or `cssCodeSplit`.** Either change collapses the output into a monolith and silently reverts every consumer to shipping the whole library. The same applies to re-enabling asset inlining or narrowing the externals matcher — a peer dependency that ends up inside `dist/` shadows the consumer's own copy and breaks them at runtime.
- Build correctness depends on plugin ordering. `strip-woff-fallback` must precede asset collection, and the aggregation plugin runs in `closeBundle`, after CSS has been written to disk.
- Orphan cleanup in `dist/files/` scans emitted JS and CSS for literal `files/<name>` references. An asset whose path is assembled at runtime would not be found and would be deleted; assets must be statically imported or referenced from CSS.
- After changing a component's styles, confirm those rules still appear in `dist/index.css` — the aggregation walks the emitted tree, so a stylesheet that stops being emitted disappears from the global entry without error.
