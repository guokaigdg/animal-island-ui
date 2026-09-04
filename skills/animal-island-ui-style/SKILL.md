---
name: animal-island-ui-style
description: >
    Build React UIs in the animal-island-ui style — an a cozy island-style UI-inspired component
    library (warm earth tones, pill shapes, 3D game-button depth, soft motion).
    Use when (1) building pages or components with the animal-island-ui npm package in a
    React project; (2) generating a standalone single-file HTML page in this style with no
    build step; (3) the user asks for "a cozy island-style UI style", "animal island style", or a
    cozy rounded game-like UI.
---

# animal-island-ui style

animal-island-ui is a React + TypeScript component library with an original
cozy island-style design — 30 components, zero runtime dependencies,
CC BY-NC 4.0 (non-commercial use only).

Source & canonical design definition: https://github.com/guokaigdg/animal-island-ui

## Pick your scenario first

| Scenario | Entry |
| --- | --- |
| React project — the `animal-island-ui` npm package is (or can be) installed | [references/react-project.md](references/react-project.md) |
| Single self-contained HTML file — no npm, no bundler, React via CDN + Babel runtime | [references/standalone-html.md](references/standalone-html.md) |

Both scenarios share the component catalog and the hard rules below.

## The style in one paragraph

Warm parchment backgrounds (`--animal-bg`), earth-brown text (never pure black), mint-teal
primary accent, large-radius pill shapes (buttons and inputs are 50px pills; nothing
interactive below 12px radius), 3D "game button" stacked shadow on primary buttons only,
rounded Nunito + Noto Sans SC typography (body weight 500, headings 600–900), soft
`cubic-bezier(0.4, 0, 0.2, 1)` motion over 0.15–0.35s, and a mix of geometric shapes
(swallowtail ribbon Title, digit-tile Countdown) with organic ones (SVG blob-clipped Modal).

## Design tokens

The packaged stylesheet declares runtime CSS custom properties on `:root` — prefix
`--animal-*` — mapped from the library's compile-time tokens. Groups: primary/status
colors (with hover/active/bg variants), text colors, backgrounds, borders, radii, spacing,
shadows, font family/sizes, motion durations/easing, control heights.

When to use them:

- Styling layout wrappers, custom elements, or app-specific decoration next to library
  components: use `var(--animal-*)` instead of raw hex values so custom UI stays on-palette.
- Theming: consumers may override `--animal-*` variables after importing the library style.
- Re-implementing the style without the library (standalone HTML): a complete `:root`
  template with exact values lives in the design system —
  [css-variables.md](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/css-variables.md)
  (raw: https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/css-variables.md).

Token values are deliberately not restated here. Exact definitions (every hex/px/ms):
[design-tokens.md](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-tokens.md).
Pixel-exact per-component CSS (shadows, keyframes, clip-paths):
[design-system/components/](https://github.com/guokaigdg/animal-island-ui/tree/main/docs/design-system/components).

## Component catalog

Props references are grouped by category under `references/components/` (props, legal
values, defaults — copied from source):

| Category | Components | Reference |
| --- | --- | --- |
| General | Button, Icon, Typewriter, Cursor | [general.md](references/components/general.md) |
| Layout | Card, Title, Divider, Collapse, Tabs | [layout.md](references/components/layout.md) |
| Form controls | Input, Switch, Checkbox, Radio, Select | [form-controls.md](references/components/form-controls.md) |
| Form container | Form (+ FormItem, useForm) | [Form.md](references/components/Form.md) |
| Overlays | Modal, Drawer, Tooltip | [overlays.md](references/components/overlays.md) |
| Feedback | Loading, Progress, Skeleton, BackTop | [feedback.md](references/components/feedback.md) |
| Notification | Notification (imperative API) | [Notification.md](references/components/Notification.md) |
| Data display | Table, CodeBlock, Tag | [data-display.md](references/components/data-display.md) |
| Decorative | Footer, Divider, Cursor, Typewriter | [decorative.md](references/components/decorative.md) |

## Hard rules (violations are bugs)

1. Never invent props. Every prop must appear in the component reference (or, in an
   installed project, in the package's TypeScript declarations — the ground truth).
2. Import the stylesheet exactly once at the app entry: `import 'animal-island-ui/style'`.
   Without it components render unstyled.
3. Never use pure black (`#000`/`#111`) text or cold gray (`#fafafa`/`#f5f5f5`) backgrounds.
4. Never use cold blue focus rings. Focus colors are yellow (`#ffcc00` inputs) or the mint
   primary (buttons).
5. Never give an interactive element corners sharper than 12px radius; buttons and inputs
   are 50px pills.
6. The 3D pixel-stack shadow belongs to primary / danger-primary buttons only. Cards have
   no box-shadow. Switch has no outer shadow. Input shadow is opt-in (`shadow={true}`).
7. Modal keeps its SVG blob clip-path — never a rounded rectangle. Title is a swallowtail
   ribbon — never a blob, pill, or plain block (`Card type="title"` no longer exists).
8. Fonts are Nunito + Noto Sans SC; weight never below 400; no monospace for UI text
   (CodeBlock excepted).
9. Motion uses `cubic-bezier(0.4, 0, 0.2, 1)` over 0.15–0.35s.
10. Icons come from `<Icon name="..." />` (10 built-in names) — never emoji, Unicode
    symbols (✓ ✕ →), hand-rolled SVG, or third-party icon fonts.
11. Select is controlled-only (`options` + `value` + `onChange` all required). Controlled
    `Input`/`Switch`/`Checkbox`/`Radio` need `onChange` too.
12. Prefer library components over raw HTML: no visible native `<button>`, `<input>`,
    `<select>`, checkbox/radio — wrap or use the library equivalents.
13. Import only from the package root and `animal-island-ui/style` — no deep imports.
14. Style custom elements with `var(--animal-*)` tokens, not hard-coded colors; never use
    `className`/`style` to override a component's colors, radii, or shadows.
