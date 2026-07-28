# ADR 0001: Zero Runtime Dependencies

## Status

Accepted

## Context

`animal-island-ui` is installed into applications that already own their dependency tree. Every package the library declares under `dependencies` is imposed on those applications: it enlarges the install footprint, adds a transitive tree the consumer never chose, and — for anything stateful like React — risks a duplicated copy being resolved at two different versions.

The library needs exactly three things at runtime: `react` and `react-dom` for rendering, and `classnames` for conditional class composition (used by 12 modules under `src/`). All three are packages a React application either already has or can supply. Nothing else in the source tree needs a runtime import: design tokens are compiled to literals (see [ADR 0002](0002-dual-design-token-system.md)), and fonts and images are emitted as static files at build time.

## Decision

`package.json` declares no `dependencies` field at all. The three runtime requirements are declared as peer dependencies with deliberately wide ranges:

```json
"peerDependencies": {
    "classnames": "^2.5.1",
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
}
```

The same modules are marked external in the Rollup configuration, so they are never inlined into the published output:

```
external: ['react', 'react-dom', 'react/jsx-runtime', 'classnames']
```

`react/jsx-runtime` is listed separately because the automatic JSX transform imports it directly; omitting it would bundle a second copy of React's runtime into `dist/`.

Font packages (`@fontsource/nunito`, `@fontsource/noto-sans-sc`) are development dependencies. Their `woff2` files are copied into `dist/files/` during the build, so consumers receive the font bytes without inheriting the package.

## Consequences

- Installing the library adds no transitive packages. The published tarball is `dist/` plus type shims.
- The host application owns the React version. A single React instance is guaranteed, so hooks and context work across the boundary without the "two copies of React" failure mode.
- `react` is accepted from 17 upward. The library must therefore avoid APIs introduced after React 17 unless guarded.
- Consumers must have `classnames` installed. npm 7 and later install missing peer dependencies automatically, so this is usually invisible; consumers on older npm or on strict package managers (pnpm without `auto-install-peers`) will see an unmet-peer warning and must add it explicitly.
- Any future runtime utility must be vendored into `src/` or promoted to a peer dependency. Adding a `dependencies` entry breaks this decision and must supersede this record.
- Keeping the externals list correct is part of the build contract described in [ADR 0003](0003-vite-library-mode-build.md); removing an entry silently ships a duplicate of that package to every consumer.
