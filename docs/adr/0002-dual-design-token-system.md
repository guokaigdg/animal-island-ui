# ADR 0002: Dual Design Token System

## Status

Accepted

## Context

Design tokens in this library serve two audiences with incompatible requirements.

Component authors write Less Modules and need values that participate in computation — arithmetic, `darken()`/`lighten()`, mixin arguments, media query conditions. Less functions operate on values known to the compiler, and a CSS custom property is opaque to them: `darken(var(--animal-primary-color), 10%)` cannot work.

Consumers need the opposite. Re-theming the library must not require forking it or rebuilding it. That is only possible if the values a component paints with are resolved in the browser, through the cascade, where an application stylesheet can override them.

Serving only the first audience freezes the theme at build time. Serving only the second makes computed styles impossible to author.

## Decision

Maintain two token layers with a one-way dependency between them.

**Layer 1 — Less compile-time variables.** `src/styles/variables.less` is the single source of truth: colour palette, neutrals, typography, spacing, border radii, shadows, motion curves, and control heights, all `@`-prefixed. These are substituted for literals during compilation and do not exist at runtime.

The file is injected into every Less compilation unit through `css.preprocessorOptions.less.additionalData` in `vite.config.ts`, so any `*.module.less` can reference `@primary-color` without an explicit `@import`. `vitest.config.ts` repeats the same injection so styles compile identically under test.

**Layer 2 — Runtime CSS custom properties.** `src/styles/themes/default.less` re-declares the same tokens on `:root` as `--animal-*` properties, each initialised from its Less counterpart:

```less
:root {
    --animal-primary-color: @primary-color;
    --animal-spacing-sm: @spacing-sm;
    --animal-motion-ease: @motion-ease;
}
```

The mapping is mechanical, so there are no duplicated literals — the Less file remains the only place a value is written. This layer reaches consumers through `src/styles/index.less` and the aggregated `dist/index.css`.

**Authoring rule.** Component styles reference `var(--animal-*)` by default. Reach for a Less variable only when the value must be known at compile time: computation, colour functions, mixin arguments, or media queries.

## Consequences

- Consumers re-theme by redeclaring `--animal-*` properties on `:root` or on any scoped selector, with no build step and no fork.
- Adding a token requires two edits: the value in `variables.less`, then the mapping in `default.less`. A token added only to the Less layer is invisible to consumers.
- Any site that uses a Less variable bakes a literal into the output and is therefore _not_ overridable at runtime. Choosing a Less variable where a custom property would do silently removes that surface from the theming API.
- The `--animal-*` names are public API. Renaming or removing one is a breaking change for consumers, independent of the component that used it.
- Two names exist for most values, and the correct choice is not enforced by tooling. Reviewers must check it; the rule of thumb is that anything a designer might want to change belongs in the custom-property layer.

Concrete token values and the visual rules built on them are documented in the [design system](../design-system/).
