# Design Rules

## The seven design laws

1. **Color**: earth-brown text + mint-teal primary + cream parchment backgrounds. Never pure black or cold gray.
2. **Radius**: 12px minimum; buttons and inputs must be 50px pills.
3. **Depth**: the thick 3D shadow (`0 Npx 0 0 [dark color]` plus hover lift / active press) is **only** for primary buttons, danger-primary buttons, Input and Switch. `default` / `dashed` / `text` / `link` buttons use the soft elevation shadow (`0 2px 4px` / `0 3px 10px rgba(61,52,40,...)`).
4. **Typography**: Nunito (Google Fonts) rounded type, weight 600+ for buttons and headings, never a light weight.
5. **Motion**: transitions of 0.15–0.35s eased with `cubic-bezier(0.4, 0, 0.2, 1)` — smooth, never abrupt.
6. **Focus**: yellow `#ffcc00` for inputs, teal `#19c8b9` for buttons. Never blue.
7. **Forbidden**: right-angled interactive elements, pure black text `#000`, cold blue tints, flat shadowless design.

## Visual hard rules

These fourteen contracts are the visual contract of the library. Violating any of them fails review.

1. No pure black text (`#000` / `#111`). Use `#794f27` / `#725d42` / `#8a7b66` / `#9f927d`.
2. No cold blue focus rings (`#0066ff` and similar). Input/Switch/Checkbox use `#ffcc00`, Radio uses `#f5c31c`, Button uses `#19c8b9`.
3. No 0px radius on interactive elements; 12px is the minimum. Buttons and inputs are 50px (pill), cards 20px, Tooltip 16px.
4. No cold gray backgrounds (`#fafafa` / `#f5f5f5`). Use `#f8f8f0` (main background) or `rgb(247,243,223)` (content area).
5. The pixel-stacked 3D shadow `0 5px 0 0 #bdaea0` is used **only** on primary and danger+primary buttons. `default` / `dashed` / `text` / `link` buttons use only the soft elevation shadow `0 2px 4px 0 rgba(61,52,40,0.06)`.
6. Input has no shadow by default; the `shadow` prop defaults to `false`. Only an explicit `shadow={true}` adds `0 3px 0 0 #d4c9b4`. Status shadows (error/warning) are not governed by `shadow` and always render.
7. Switch has no outer shadow. The track carries an `inset` shadow only; the handle is a flat circle with a 2.5px border and no `box-shadow`, vertically centered via `transform: translateY(-50%)`.
8. Card has no `box-shadow`; it only lifts with `translateY(-2px)` on hover. The pattern variant adds a 1.5px border in the matching hue.
9. Modal must use the SVG blob clip-path (`#animal-modal-clip`); it may not be swapped for a rounded rectangle.
10. Title is a swallowtail ribbon (clip-path + folded-corner triangle shadow + 3deg perspective), not a blob, pill, or rectangle. `<Card type="title">` has been removed; use `<Title>`.
11. Fonts: `Nunito, 'Noto Sans SC'` (shipped as woff2 through @fontsource, with the woff fallbacks stripped at build time). System monospace fonts are forbidden for UI text (CodeBlock excepted).
12. Font weight: body 500, buttons and headings 600–700, Time digits and Title ribbons 900, placeholder 400. Never below 400 anywhere.
13. Motion easing is uniformly `cubic-bezier(0.4, 0, 0.2, 1)` with durations of 0.15–0.35s.
14. Radio is a heavily rounded square (border-radius 12/14/16px), not a perfect circle, and contains an SVG checkmark rather than a dot.

## Anti-pattern quick reference

Check code against this list before submitting it. **Any ❌ that appears is a failure.**

1. **No pure black text**
    - ❌ `color: #000;` / `color: #111;`
    - ✅ `color: #794f27;` (primary) / `#725d42` (secondary) / `#8a7b66` (supporting) / `#9f927d` (de-emphasized)

2. **No cold blue focus rings**
    - ❌ `outline: 2px solid #0066ff;`
    - ✅ `outline: 2px solid #ffcc00;` (Input/Switch/Checkbox) / `#f5c31c` (Radio) / `#19c8b9` (Button)

3. **No 0px radius; interactive elements are 12px minimum**
    - ❌ `border-radius: 0;` / `border-radius: 4px;` (buttons, inputs, cards, Tooltip)
    - ✅ `border-radius: 50px;` (button/input pill) / `20px` (cards) / `16px` (Tooltip)

4. **No cold gray backgrounds**
    - ❌ `background: #fafafa;` / `background: #f5f5f5;`
    - ✅ `background: #f8f8f0;` (main background) / `background: rgb(247, 243, 223);` (content area)

5. **The pixel-stacked 3D shadow is only for primary / danger-primary buttons**
    - ❌ `<Button>` carrying `box-shadow: 0 5px 0 0 #bdaea0;` by default
    - ✅ `<Button type="primary">` gets the 3D shadow; `type="default"` uses `box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06);`

6. **Input has no shadow by default**
    - ❌ `<Input>` shipping a 3D shadow out of the box
    - ✅ `<Input>` has no shadow; `<Input shadow />` adds `box-shadow: 0 3px 0 0 #d4c9b4;`; `status="error"` is not governed by `shadow` and always renders

7. **Switch has no outer shadow and the handle does not float**
    - ❌ Floating the handle with `box-shadow` or centering it with `margin-top`
    - ✅ `handle { position: absolute; top: 50%; transform: translateY(-50%); border: 2.5px solid <matching hue>; }`

8. **Card has no box-shadow**
    - ❌ `box-shadow: 0 4px 12px rgba(0,0,0,0.1);` on a Card
    - ✅ `&:hover { transform: translateY(-2px); }`; for `type="pattern"` add `border: 1.5px solid <matching hue>;`

9. **Modal must use the SVG blob clip-path**
    - ❌ `border-radius: 20px;` on a rectangular container
    - ✅ `clip-path: url(#animal-modal-clip);` referencing the SVG blob

10. **Title is a swallowtail ribbon**
    - ❌ Using `<Card type="title">` or a rectangular Title with `border-radius`
    - ✅ Using `<Title>`, whose clip-path is paired with `transform: perspective(800px) rotateY(3deg);`

11. **Fonts**
    - ❌ `font-family: -apple-system, sans-serif;` (for UI text)
    - ✅ `font-family: var(--animal-font-family, 'Nunito', 'Noto Sans SC');`

12. **Font weight never below 400**
    - ❌ `font-weight: 300;` / `font-weight: normal;` (< 400)
    - ✅ body `500`; buttons and headings `600-700`; Time/Title `900`; placeholder `400`

13. **Motion easing**
    - ❌ `transition: all 0.3s ease;`
    - ✅ `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);` (duration within the 0.15–0.35s range)

14. **Radio is a heavily rounded square with an SVG checkmark**
    - ❌ `border-radius: 50%;` paired with `<span class="dot" />`
    - ✅ `border-radius: 14px;` paired with an inline `<svg>` checkmark

15. **No emoji standing in for UI icons**
    - ❌ `<span>🌊 Beach</span>` / `<span>✨ Sale</span>` — emoji vary in color temperature, style and weight across platforms
    - ✅ `<Icon name="..." />` from the library; build purely decorative marks with CSS/HTML

16. **Icons come from the `<Icon>` component; no inline SVG, no Unicode symbols**
    - ❌ Writing raw Unicode symbols (✓ ✕ ✗ → ←), hard-coding `<svg>`, or pulling in a third-party icon library
    - ✅ `<Icon name="icon-camera" size={24} />` using one of the 10 built-in icon names; when no icon matches, substitute a pure-CSS decorative element
