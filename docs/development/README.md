# Development

How to build, test, and ship changes to animal-island-ui. Visual specifications live in
[../design-system/](../design-system/); the reasoning behind the architecture lives in [../adr/](../adr/).

## Contents

- [repository-structure.md](./repository-structure.md) — what the project is, its tech stack, npm scripts, directory
  layout, and path aliases.
- [component-development.md](./component-development.md) — the workflow for adding or changing a component: file layout,
  exports, demo registration, documentation sync.
- [coding-standards.md](./coding-standards.md) — TypeScript, CSS Modules, design-token usage, lint and format rules,
  prohibitions.
- [testing.md](./testing.md) — Vitest configuration, coverage thresholds, unit and accessibility test conventions.
- [build-and-release.md](./build-and-release.md) — the library build contract and the package entry points it feeds.
- [contributing.md](./contributing.md) — issues, pull requests, commit format, pre-commit hook.

## Reading order

1. `repository-structure.md` to orient yourself in the tree.
2. `contributing.md` to set up locally and understand the commit gate.
3. `component-development.md` — the main day-to-day workflow.
4. `coding-standards.md` and `testing.md` — the rules a change has to satisfy before it can land.
5. `build-and-release.md` — only when touching `vite.config.ts`, `package.json`, or the published artifact.
