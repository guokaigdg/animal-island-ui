# Architecture Decision Records

This directory records the load-bearing technical decisions behind `animal-island-ui` — the ones that constrain future changes rather than describe current code. Each record states the context that forced a choice, the choice itself, and the consequences the project accepted by making it.

Records are immutable once accepted. A decision that no longer holds is superseded by a new record, not edited in place.

| ADR                                       | Title                         | Summary                                                                                                                       |
| ----------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [0001](0001-zero-runtime-dependencies.md) | Zero runtime dependencies     | The package declares no `dependencies`; React, React DOM, and `classnames` are peer dependencies kept external at build time. |
| [0002](0002-dual-design-token-system.md)  | Dual design token system      | Less compile-time variables for computed values, `--animal-*` CSS custom properties for everything consumers may re-theme.    |
| [0003](0003-vite-library-mode-build.md)   | Vite library-mode build       | ES + CJS dual output with `preserveModules` and split CSS, so consumers pull only the components they import.                 |
| [0004](0004-docs-sync-automation.md)      | Documentation sync automation | Component coverage across the design-system docs and skill references is machine-checked and enforced in CI.                  |

Related reading: [design system](../design-system/) for the visual contract, [development](../development/) for day-to-day workflow.
