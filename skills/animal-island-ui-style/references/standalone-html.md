# Standalone single-file HTML usage

Scenario: deliver **one self-contained `index.html`** the user saves and double-clicks —
no npm, no bundler, non-technical user. The npm package is not available as a UMD bundle,
so you hand-roll the components inline while mirroring the real library API.
For a real React project, use [react-project.md](react-project.md) instead.

## Workflow

1. **Ask first.** If the user has not said what page they want, reply with a short question
   plus 3–5 concrete suggestions (personal blog, product grid, FAQ, login, dashboard).
   Generate nothing yet.
2. **Fetch the exact specs.** Values are not restated in this skill — fetch:
    - `:root` token template (complete, paste-ready):
      https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/css-variables.md
    - Design rules (hard visual contracts + anti-patterns):
      https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-rules.md
    - Pixel specs for the components the page needs (category files):
      `https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/components/<category>.md`
      (categories: general, layout, form-controls, Form, overlays, feedback, Notification,
      data-display, decorative — same grouping as [components/](components/))
3. **Generate** one complete `index.html` in a single fenced code block, then list any spec
   line you intentionally relaxed and why.

## Output requirements

- Single `index.html`, working offline except the unpkg CDN + Google Fonts:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

- Page code in one `<script type="text/babel" data-presets="react,typescript">` block;
  mount on `<div id="root"></div>` via `ReactDOM.createRoot(...).render(<App />)`.
- All CSS inline in one `<style>` block in `<head>`: design tokens on `:root` first (from
  the fetched template), then component classes. No CSS frameworks; Tailwind is forbidden.
- Inject the Modal SVG `<defs>` clip-path block once at the top of `<body>` so
  `clip-path: url(#animal-modal-clip)` resolves (exact path data is in the overlays pixel spec).
- Fonts from Google Fonts — Nunito (400–900) + Noto Sans SC (400/500/700):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap"
    rel="stylesheet"
/>
```

## Hand-roll the library API, then compose with it

- At the top of the babel script, define inline React components named exactly like the
  library exports (`Button`, `Input`, `Card`, `Title`, `Tabs`, `Modal`, ...) accepting the
  documented props — see [components/](components/) for every prop, legal value, and default.
  `Notification` is imperative (static methods), not a JSX element.
- Compose the page **exclusively** with these components. Raw HTML/JSX is allowed only
  where no library component fits (page layout, header bars, custom illustration) — and
  then styled with `var(--animal-*)` tokens, never raw colors.
- Forbidden as visible UI: native `<button>`, `<input>`, `<select>`, native checkbox/radio.
- Every value from the fetched specs is exact — do not round, approximate, or substitute
  "close" colors.

## Shadow system (the most-misapplied rule)

- 3D pixel-stack shadow (`0 Npx 0 0 <dark>`; hover lifts, active sinks): **only**
  `Button type="primary"` and danger-primary.
- default/dashed/text/link buttons: soft elevation `0 2px 4px 0 rgba(61,52,40,0.06)`
  (hover `0 3px 10px 0 rgba(61,52,40,0.10)` + `translateY(-1px)`).
- Card: no box-shadow at all; hover floats via `translateY(-2px)` only.
- Switch: inset track shadow only; flat handle with 2.5px border, no box-shadow.
- Input: no shadow by default (`shadow` opt-in); error/warning status shadows always render.

## Scenario-specific rules

- Typography: body weight 500, buttons/headings 600–700, Countdown digits / Title ribbon 900,
  placeholder 400; letter-spacing 0.01–0.02em; never below weight 400.
- All hard rules from [SKILL.md](../SKILL.md) apply (blob Modal, ribbon Title, no emoji
  icons, minimum 12px radius, warm palette only).
