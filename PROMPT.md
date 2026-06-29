# animal-island-ui 一键提示词

> 给普通用户使用的 self-contained 提示词。把下面整块代码块复制到 Cursor / Claude / ChatGPT / v0 / Bolt / Lovable / Windsurf 等任意 AI 编程工具发送即可。
>
> **AI 会先反问你想做什么页面**（例如「做一个个人博客」、「做一个商品列表」、「做一个 FAQ 页面」），你回答后它再输出**一个 self-contained `index.html` 文件**，**保存后双击即可在浏览器预览**——不需要 npm、不需要打包工具、不需要任何安装。
>
> - **最后同步**：v0.9.5 / 2026-06-02。
> - **真实数据源**：`src/styles/variables.less` + 各组件 `*.module.less`。
> - **冲突处理**：本文件与源码冲突时，**以源码为准**。新增 / 修改组件时请同步更新本文件。
> - **要 100% 像素级还原**：项目内直接 `npm i animal-island-ui` + `import` 真实组件。

---

````markdown
You are a senior React engineer. Generate a **single self-contained `index.html` file** that the user can save to disk and double-click to preview in a browser. It must PERFECTLY match the visual style of the npm package "animal-island-ui" (an a cozy island-style UI-inspired component library, v0.9.5).

## OUTPUT REQUIREMENTS

- **DELIVER A SINGLE SELF-CONTAINED `index.html` FILE** that the user can save to disk and **double-click to preview directly in any modern browser** — NO build step, NO npm install, NO bundler. The user is non-technical.
- The HTML must use these CDN scripts inside `<head>`:
    ```html
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    ```
- Write the page as a `<script type="text/babel" data-presets="react,typescript">` block — JSX/TS is fine, Babel-standalone will transpile in-browser.
- Mount target: `<div id="root"></div>` inside `<body>`. Use `ReactDOM.createRoot(document.getElementById('root')).render(<App />);`.
- Put ALL CSS inline in a single `<style>` block in `<head>` (design tokens on `:root`, then component classes). Do NOT depend on external CSS frameworks. Tailwind is forbidden in this output mode.
- Inject the Modal SVG `<defs>` clip-path block (see Modal section) once at the top of `<body>` so `clip-path: url(#animal-modal-clip)` resolves.
- Every value below is exact. Do NOT round, approximate, or substitute "close" colors.
- The npm package `animal-island-ui` is NOT available via UMD CDN in this offline-HTML mode, so you must **hand-roll the library's components inline as React components that mirror the real library's API** (named exports, prop names, prop values). **Always prefer the library API over raw HTML.** Concretely:
    - At the top of the `<script type="text/babel">` block, define inline React components named exactly like the library's exports: `Button`, `Input`, `Switch`, `Checkbox`, `Radio`, `Card`, `Title`, `Tabs`, `Collapse`, `Modal`, `Select`, `Tooltip`, `Loading`, `Table`, `Time`, `Divider`, `Footer`, `Phone`, `Cursor`, `Typewriter`, `Icon`, `CodeBlock`, `Form` (with `Form.Item`), `Wallet`. Each component must accept the documented props (e.g. `<Card pattern="default">`, `<Button type="primary" size="large">`, `<Title color="app-teal" size="large">`, `<Switch checked onChange={...} />`, `<Wallet value={1234} size="medium" />`).
    - In the page (`<App />`), **compose the UI exclusively with these JSX components** — do NOT write `<div className="card">` / `<button class="btn">` etc. inline. The page should read like real animal-island-ui usage.
    - Only fall back to raw HTML/JSX (`<div>`, `<span>`, `<h1>`, `<img>`, layout helpers, page-specific decorations, app-specific widgets) when no library component covers the use case (e.g. page layout, header bar, two-column grid, custom illustration). In that case, still use the design tokens (`var(--text-body)`, `var(--bg-content)` …) instead of raw colors.
    - Forbidden: native `<button>`, native `<input>`, native `<select>`, native checkbox/radio used as visible UI. They MUST be wrapped by the inline `Button` / `Input` / `Select` / `Checkbox` / `Radio` components defined above.
- The file must work with **zero network access except for the unpkg CDN + Google Fonts** — no other external dependencies.

## TECH STACK CONSTRAINTS

- Fonts: Nunito + Noto Sans SC ONLY. Add to <head>:
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
- Body font-family: Nunito, 'Noto Sans SC', -apple-system, 'PingFang SC', sans-serif;
- Body weight 500, button/heading 600–700, time/Title-ribbon 900, placeholder 400.
- Letter-spacing: body 0.01em, button/heading 0.02em.
- NEVER use system monospace for UI text. Use it only for code blocks.

## DESIGN TOKENS (paste these into :root)

```css
:root {
    /* primary mint teal */
    --primary: #19c8b9;
    --primary-hover: #3dd4c6;
    --primary-active: #11a89b;
    --primary-bg: #e6f9f6;

    /* warm-brown text */
    --text: #794f27; /* headings / sidebar */
    --text-body: #725d42; /* in-component body */
    --text-secondary: #9f927d;
    --text-muted: #8a7b66;
    --text-disabled: #c4b89e;

    /* parchment background */
    --bg: #f8f8f0;
    --bg-content: rgb(247, 243, 223); /* card / modal / table inside */
    --bg-disabled: #f0ece2;

    /* borders */
    --border: #c4b89e;
    --border-hover: #a89878;
    --border-strong: #9f927d;

    /* status */
    --success: #6fba2c;
    --success-active: #5a9e1e;
    --warning: #f5c31c;
    --warning-active: #dba90e;
    --error: #e05a5a;
    --error-active: #c94444;

    /* game-special */
    --focus-yellow: #ffcc00; /* Input/Switch/Checkbox focus — NOT blue */
    --focus-yellow-d: #e0b800;
    --focus-yellow-radio: #f5c31c; /* Radio uses warmer yellow */

    /* 3D shadow taupe */
    --shadow-btn: #bdaea0;
    --shadow-input: #d4c9b4;
    --shadow-switch: #5a9e1e;

    /* radii */
    --r-sm: 12px;
    --r-base: 18px;
    --r-lg: 24px;
    --r-pill: 50px;

    /* motion */
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --d-fast: 0.15s;
    --d-base: 0.25s;
    --d-slow: 0.35s;
}
```

## SHADOW SYSTEM (CRITICAL — do not over-apply)

- ONLY `Button(type="primary"|"danger"+primary)` uses the 3D pixel-stack shadow `0 Npx 0 0 [color]`. Hover lifts +1 (taller shadow), active sinks -1 (shorter shadow).
- `Switch` does NOT have any outer 3D pixel-stack shadow. The track has an INSET shadow only: `inset 0 2px 4px rgba(114,93,66,0.15)` (off) / `inset 0 2px 4px rgba(90,158,30,0.20)` (on). The handle is a flat circle with 2.5px border and NO box-shadow.
- `Input` does NOT show any shadow by default (`shadow` prop defaults to `false`). Only when explicitly opted-in does it apply the 3D pixel-stack shadow described in the Input section. (Status error/warning shadows render regardless.)
- `default`/`dashed`/`text`/`link` buttons use a soft elevation only:
  rest: box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06);
  hover: box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.10); transform: translateY(-1px);
- Cards have NO box-shadow. They float on hover with `transform: translateY(-2px);` only. Pattern variants add a 1.5px solid border in the palette hue.
- Switch handle stays vertically centered via `transform: translateY(-50%);` and has a 2.5px border but NO `box-shadow` of its own. Track has only inset shadow (see SHADOW SYSTEM above).

## COMPONENT SPECS (26 components + 3 companion exports: FormItem, useForm, ICON_LIST)

### Button (3 sizes × 5 types)

- Sizes (height / padding-x / font-size / radius):
  small 32px / 16px / 12px / 16px
  middle 45px / 20px / 14px / 50px ← default
  large 48px / 32px / 16px / 24px
- font-weight 600, letter-spacing 0.02em, line-height 1, border-width 2px.
- type="primary":
  color #794f27; bg #f8f8f0; border #f8f8f0;
  rest: box-shadow: 0 5px 0 0 #bdaea0;
  hover: box-shadow: 0 6px 0 0 #bdaea0; transform: translateY(-1px);
  active: box-shadow: 0 1px 0 0 #bdaea0; transform: translateY(2px);
  focus-visible: outline 2px solid #19c8b9; outline-offset 2px;
- type="danger" + primary: same shape, replace #bdaea0 with #c94444. Text white.
- type="default" / "dashed": bg #f8f8f0, border 2px solid #9f927d (dashed: dashed style),
  rest: box-shadow 0 2px 4px 0 rgba(61,52,40,0.06);
  hover: color/border #19c8b9; box-shadow 0 3px 10px 0 rgba(61,52,40,0.10); transform translateY(-1px);
  active: color/border #11a89b; transform translateY(0); box-shadow back to rest.
- type="text" / "link": no border, no rest shadow; same hover color rules.
- loading state: replace bg with diagonal stripe animation:
  background: #0ec4b6;
  background-image: repeating-linear-gradient(-45deg, #0ec4b6 0 10px, #01b0a7 10px 20px);
  background-size: 28.28px 28.28px;
  border: 4px solid #4de2da; color: #fff; box-shadow: none;
  animation: btn-loading 1s linear infinite;
  @keyframes btn-loading { to { background-position: -28.28px 0; } }
- disabled: opacity 0.5; cursor not-allowed; remove shadow.
- `ghost` prop: transparent bg, no box-shadow (keeps border + text color of the chosen type).
- `block` prop: `display: flex; width: 100%`.

### Input (3 sizes)

- **Default `shadow={false}`** — no box-shadow at rest. The `shadow / hover / focus` shadow values below ONLY apply when the user opts in via `shadow` prop. Status (error/warning) and focus rings render regardless.
- Sizes (height / padding-x / font-size / radius / opt-in-shadow):
  small 32px / 14px / 12px / 40px / 0 2px 0 0 #d4c9b4
  middle 40px / 18px / 14px / 50px / 0 3px 0 0 #d4c9b4
  large 48px / 22px / 16px / 50px / 0 4px 0 0 #d4c9b4
- bg rgb(247, 243, 223); border 2px solid #c4b89e; color #725d42; weight 500; letter-spacing 0.01em.
- placeholder color #c4b89e; weight 400.
- prefix/suffix color #a0936e; gap 6px.
- hover: border #a89878. (If `shadow` opt-in: also shadow 0 3px 0 0 #c4b89e.)
- focus: border #ffcc00; box-shadow 0 0 0 3px rgba(255,204,0,0.15). (If `shadow` opt-in: also 0 3px 0 0 #e0b800.)
- error: shadow 0 3px 0 0 #c94444. warning: shadow 0 3px 0 0 #dba90e. (status shadows render regardless of `shadow` prop.)
- disabled: bg #ece8dc; color #c4b89e; border #d4c9b4; opacity 0.6; no shadow.
- clear button: 20×20 circle, color #c4b89e, hover bg rgba(114,93,66,0.1) + color #725d42.

### Switch (default 52×28 / small 38×20)

- Track: min-width 52px (small 38px); height 28px (small 20px); border-radius 50px; bg `#d4c9b4`; border `2.5px solid #c4b89e`; inset shadow `inset 0 2px 4px rgba(114,93,66,0.15)`. NO outer box-shadow.
- Handle: 21×21 circle (small 14×14); bg `rgb(247,243,223)`; border `2.5px solid #c4b89e`; border-radius 50%; absolutely positioned `left: 2px` (small: 1px); vertically centered via `top:50%; transform: translateY(-50%)`. Handle has NO `box-shadow`.
- Hover (off): track border `#a89878`.
- ON state: track bg `#86d67a`; border `#6fba2c`; track shadow `inset 0 2px 4px rgba(90,158,30,0.20)`; handle border `#6fba2c`; handle position `left: calc(100% - 24px)` (small: `calc(100% - 16px)`). Hover (on): track bg `#7ccc70`; track border `#5a9e1e`.
- Inner text (checkedChildren/unCheckedChildren): font-size 11px (small 9px), weight 700, color #fff, letter-spacing 0.02em, text-shadow `0 1px 1px rgba(0,0,0,0.1)`; padding `0 8px 0 28px` (off) / `0 28px 0 8px` (on); for small: `0 6px 0 20px` / `0 20px 0 6px`.
- Loading: opacity 0.7; pointer-events none; replace handle inner with 11×11 spinner (2px circle border `#6fba2c` on; `#a89878` off; `border-right-color: transparent`; rotate 0.6s linear infinite).
- Disabled: opacity 0.5; cursor not-allowed.
- focus-visible: outline `2px solid #ffcc00`; outline-offset 2px.

### Modal (SVG blob clip-path — cannot be replaced with rounded rect)

- Inject ONCE somewhere in body:
    ```html
    <svg style="position:absolute;width:0;height:0" aria-hidden>
        <defs>
            <clipPath id="animal-modal-clip" clipPathUnits="objectBoundingBox">
                <path
                    d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005"
                />
            </clipPath>
        </defs>
    </svg>
    ```
- Modal content: clip-path: url(#animal-modal-clip); bg rgb(247,243,223); padding 48px 48px 32px 48px; color #725d42.
- Backdrop: rgba(40, 30, 20, 0.45); backdrop-filter: blur(2px).
- Confirm button uses game yellow: bg #ffcc00, color #725d42, 3D shadow #e0b800.

### Drawer (sinking-depth drawer — background sinks to create depth)

- When open, ALL non-fixed direct children of `<body>` get `transform: translateY(24px) scale(0.96); filter: brightness(0.85) saturate(0.9)` with a 0.3s cubic-bezier(0.4,0,0.2,1) transition. Fixed-position elements (overlays, portals) are auto-excluded. This is the signature depth effect — `pushBackground` prop defaults true; set false to disable.
- Mask is LIGHT black rgba(0,0,0,0.18) — lighter than Modal — so the sunken page stays visible (the depth must be readable).
- Panel: fixed; bg rgb(247,243,223); color #8a7b66; font Nunito, 'Noto Sans SC'.
- placement: 'left' | 'right' (default) | 'top' | 'bottom'. Panel slides in from that side (translateX/Y 100% → 0, 0.3s ease).
- Border-radius: 20px on content-facing corners, 0 on the edge flush with viewport.
- Box-shadow on the content-facing edge: ±12px 0 32px (left/right) or 0 ±12px 32px (top/bottom) rgba(61,52,40,0.18) — enhances "floating above sunken page".
- Title: 28px / 700 / rgba(114,93,66,1). Close × button (32×32, 50% radius, color rgba(114,93,66,0.6) → hover 1) in header.
- Body: 20px / 600 / #8a7b66 / line-height 1.6.
- Default footer: NONE (unlike Modal). Pass `footer={<><Button>...</Button></>}` for confirm actions.
- a11y: role="dialog", aria-modal="true", aria-labelledby on title, focus trap + restore, Esc / mask close.
- width default 378 (left/right); height default 300 (top/bottom).

### Card (default radius 20px + 13 colors + 13 dot patterns)

- **VISUAL DEFAULT — always pass a `pattern` prop on Card unless the user specifically asks for a flat solid color.** The polka-dot wallpaper is the signature animal-island look. (API default is `pattern="none"`, but in generated pages prefer `<Card pattern="default" />` or any other matching `pattern="<color-name>"` for that island vibe.)
- Default (no pattern): bg rgb(247,243,223); padding 16px 24px; color #725d42; weight 500; **no box-shadow**; transition 0.3s ease; hover transform translateY(-2px); cursor pointer.
- type="dashed": bg rgb(250,248,242); border 2px dashed #e8dcc8; no shadow; hover border-color #d4c4a8 + no transform.
- color prop (13 solid variants — choose one):
  default rgb(247,243,223)+#725d42 / app-pink #f8a6b2+#fff / purple #b77dee+#fff / app-blue #889df0+#fff / app-yellow #f7cd67+#725d42 / app-orange #e59266+#fff / app-teal #82d5bb+#fff / app-green #8ac68a+#fff / app-red #fc736d+#fff / lime-green #d1da49+#3d5a1a / yellow-green #ecdf52+#725d42 / brown #9a835a+#fff / warm-peach-pink #e18c6f+#fff
- pattern prop (13 names same as color, polka-dot pastel WALLPAPER overriding solid color):
    ```css
    /* example pattern="app-pink" */
    background:
        radial-gradient(circle, rgba(248, 166, 178, 0.18) 1.5px, transparent 1.5px) 0 0/28px 28px,
        radial-gradient(circle, rgba(255, 200, 210, 0.12) 1px, transparent 1px) 7px 7px/14px 14px,
        #fde4e8;
    border: 1.5px solid #f8a6b2;
    color: #a85565;
    ```
    Pattern values for the other 12 colors follow the same formula: lighten the palette hue ~70% for bg, use the pure palette hue at 0.18 alpha for the 1.5px dots and a paler tint at 0.12 alpha for the 1px dots, set border to the pure palette hue, choose darker readable text (#3d2e1e, #6a3a9a, etc.).

### Title (ribbon banner — REPLACES old `Card type="title"`)

- Layered structure: back-tail (swallowtail clip-path) → fold-shadow triangle → 3deg-tilted front face → top text.
- Sizes (font-size of wrapper; everything else in em):
  small 14px / middle 20px / large 28px.
- Wrapper: display inline-flex; height 2em; padding 0 1.6em; weight 800; line-height 1; letter-spacing 0.04em; filter drop-shadow(0 0.08em 0.12em rgba(0,0,0,0.05)).
- .ribbonText: weight 900; padding-top 0.11em (CJK optical centering); z-index 4.
- .ribbonBack (z-index 1, width 1.7em, height 1.7em, bottom -0.4em):
  left: clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 30% 50%, 0% 0%);
  right: clip-path: polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%);
  bg: var(--rb).
- .ribbonFold (z-index 2, top calc(100% - 0.04em); CSS triangle via border):
  left: border-width: 0 0.95em 0.45em 0; border-color: transparent var(--rk) transparent transparent;
  right: border-width: 0 0 0.45em 0.95em; border-color: transparent transparent transparent var(--rk);
- .ribbonFront (z-index 3): inset 0 0.1em; border-radius 0.2em; bg var(--rf); transform perspective(11.5em) rotateX(3deg); inset shadow 0 -0.06em 0 rgba(0,0,0,0.05).
- Color attribute drives 4 vars (--rf front / --rb back / --rk fold / --rt text). 13 schemes:
  default-green: --rf #27d039 --rb #20992a --rk #115017 --rt #fff
  app-pink: --rf #f8a6b2 --rb #e06880 --rk #a03060 --rt #fff
  purple: --rf #b77dee --rb #9050d0 --rk #5a1a9a --rt #fff
  app-blue: --rf #889df0 --rb #5068d8 --rk #2030a0 --rt #fff
  app-yellow: --rf #f7cd67 --rb #d4a030 --rk #8a6010 --rt #725d42
  app-orange: --rf #e59266 --rb #c06a30 --rk #7a3a10 --rt #fff
  app-teal: --rf #82d5bb --rb #40a880 --rk #186048 --rt #fff
  app-green: --rf #8ac68a --rb #509050 --rk #205020 --rt #fff
  app-red: --rf #fc736d --rb #d43030 --rk #900010 --rt #fff
  lime-green: --rf #d1da49 --rb #90a010 --rk #485800 --rt #3d5a1a
  yellow-green: --rf #ecdf52 --rb #c0b010 --rk #706800 --rt #725d42
  brown: --rf #9a835a --rb #705830 --rk #3a2810 --rt #fff
  warm-peach-pink: --rf #e18c6f --rb #b85a30 --rk #6a2a10 --rt #fff

### Collapse / Accordion (CSS-only height animation)

- Container: bg rgb(247,243,223); border 2px solid #9f927d; border-radius 18px; margin-bottom 12px.
- Header row: padding 16px 24px; gap 12px; font-size 16px; weight 600; line-height 1.4.
- Toggle icon: 28px circle bg #19c8b9 color #fff; weight 700; border-radius 50%; shadow 0 2px 4px rgba(25,200,185,0.3); content `+` (collapsed) → `−` (expanded), rotated 180deg on expand.
- Animation: display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s var(--ease); expanded: 1fr. Inner wrapper overflow: hidden.

### Tabs

- Wrapper: bg rgb(247,243,223); border 2px solid #9f927d; border-radius 24px; overflow hidden.
- Tab list: padding 16px; gap 6px; bg rgba(255,255,255,0.6); border-bottom 2px solid #c4b89e.
- Tab item: padding 8px 16px; border-radius 24px (pill); color #725d42; weight 500.
  hover: bg rgba(25,200,185,0.1); color #725d42.
  active: **bg `#0CC0B5` (solid teal)**; **color `#FFF9E3` (cream)**; weight 600; icon scales 1.2.
  Optional `shadow` modifier (only when explicitly enabled): box-shadow 0 3px 0 0 #d4c9b4 on active tab — NOT default.
- Optional leaf decoration on active tab (top-right, 18×18), animated leafWiggle 2s ease-in-out infinite.

### Select

- Trigger is **NOT the Input visual** — it's its own design:
  bg `#fff`; border `2px solid #e8dcc8`; border-radius `12px`; padding `8px 13px`; color `#725d42` weight 600.
  hover: border `#d4c4a8`; bg `#fffdf7`. open: arrow rotated 180deg, color `#19c8b9`.
- Dropdown panel: **bg `#FFEEA0` (banana yellow)**; border-radius `28px`; padding `12px 0`; opacity-fade-in 0.2s; z-index 100.
- Option: display flex center; padding `10px 30px 10px 14px`; font 14px/500 #725d42.
  selected: pill bar background effect via ::before/z-index:-1, font-weight 700 (NOT a tinted bg color).
  hover: subtle highlight (no opaque teal tint).
- Placeholder color `#a09080`; arrow color `#a09080`.

### Checkbox (square box, sizes 18 / 22 / 28 px)

- Box: bg rgb(247,243,223); border 2.5px solid #c4b89e; border-radius 8px.
- hover: border #19c8b9; transform translateY(-1px).
- checked: bg #19c8b9; border #11a89b; checkmark color #fff weight 700; pop animation 0.15s.
- focus: outline 2px solid #ffcc00; outline-offset 2px.
- disabled: opacity 0.55; bg #f0ece2; border #d4c9b4; label color #c4b89e.
- Label color #725d42 (hover #794f27); weight 500; letter-spacing 0.01em.
- Group: horizontal flex gap 12px / vertical flex-column gap 8px.
- Per-size label font-size: 12 / 14 / 16 px.

### Radio (heavily-rounded square with check-mark — NOT a circle, NOT a dot)

- API: `<Radio options={[{label, value, disabled?}]} value onChange size direction />`. The component IS the group — there is no separate `<Radio>` item + `<RadioGroup>` split. `direction="horizontal" | "vertical"`. Roving tabindex on the focused circle (don't set tabIndex manually).
- Box (`.circle`, sizes small/middle/large): 18×18 / 22×22 / 28×28 px; bg rgb(247,243,223); border 2px solid #c4b89e; border-radius 12 / 14 / 16 px (heavily rounded square — NOT a circle).
- hover: border #19c8b9; transform translateY(-1px).
- checked: bg #19c8b9; border #11a89b; render an SVG CHECKMARK (✓) inside (white stroke 2.5px, `M2 8L6 12L14 4`), 10/12/16 px. Pop animation 0.15s `scale(0.4) → 1.2 → 1`.
- Item label: color #725d42 (checked: #794f27); weight 500; letter-spacing 0.01em; font-size 12 / 14 / 16 px.
- focus-visible on the circle: outline 2px solid #ffcc00; outline-offset 2px (warmer than other inputs would be `#f5c31c`, but the source uses `#ffcc00`).
- disabled: opacity 0.55; bg #f0ece2; border #d4c9b4; label #c4b89e; cursor not-allowed.
- Group container: flex, gap 16px (horizontal) / 8px (vertical); flex-wrap allowed.

### Tooltip (two distinct variants — do not confuse)

- variant="default": bg rgb(247,243,223); border 2px solid #c4b89e; border-radius 16px;
  padding 6px 12px; max-width 240px; font 12px/500 #725d42; line-height 1.5;
  shadow 0 3px 10px rgba(61,52,40,0.10); z-index 100; gap 10px from trigger;
  arrow 8px diamond with border-radius 2px.
- variant="island": bg transparent; no border; no box-shadow; padding 12px 20px; max-width 280px;
  weight 600; line-height 1.55; text-align center; arrow is a 14px circle dot with drop-shadow 0 4px 14px rgba(121,79,39,0.14).
- Placements (12): top / bottom / left / right + each with \_start / \_end.

### Loading (full-screen overlay — NOT button stripe)

- Container: position absolute; inset 0; bg black; overflow hidden.
- Reveal mask: mask: radial-gradient(circle at center, transparent var(--mask-r), black calc(var(--mask-r) + 1px));
  Animate --mask-r outward to fade in/out content.
- SVG spinner: color #19c8b9; rotate 1s linear infinite; circle stroke-dasharray animation 1.5s ease-in-out:
  0% stroke-dasharray 1, 150; stroke-dashoffset 0;
  50% stroke-dasharray 90, 150; stroke-dashoffset -35;
  100% stroke-dasharray 90, 150; stroke-dashoffset -124.
- The diagonal-stripe loading at -45deg #0ec4b6/#01b0a7 28.28px is for Button only — do not put it here.

### Table

- Wrapper: bg rgb(247,243,223); border-radius 20px; padding 6px (NO border).
- Header cell: padding 16px 20px; font 14px/700 #725d42; letter-spacing 0.02em; ::after divider 1px dashed (6px on / 6px off) rgb(240,232,216).
- Body cell: padding 14px 20px; font 14px/500 #725d42; line-height 1.6; same dashed bottom divider via ::after.
- Striped rows: bg rgba(248,248,240,0.6).
- Row hover: diagonal teal stripes
  background: repeating-linear-gradient(-45deg, rgba(25,200,185,0.6) 0 10px, rgba(14,196,182,0.6) 10px 20px);
  background-size: 28.28px 28.28px;
  clip-path: inset(0 round 30px); color #3d2e1e.
- Empty: padding 60px 20px; text-align center; color #9f927d; icon opacity 0.5.
- Loading overlay: rgba(247,243,223,0.8) + backdrop-filter blur(2px); spinner #19c8b9.

### Time (HUD clock)

- Container: padding 16px 36px; gap 24px; bg linear-gradient(180deg, #fff 0%, #f8f8f0 100%); border 3px solid #d4cfc3; border-radius 18px.
- Date section right border 3px solid rgba(159,146,125,0.35); padding-right 24px.
- Weekday: color #6fba2c; weight 900; font-size 14px; letter-spacing 1.5px; UPPERCASE.
- Month/day: color #8b7355; weight 800; font-size 22px.
- Time digits: color #8b7355; weight 900; font-size 48px; letter-spacing 2px.
- Colon blink: animation blink 1s step-end infinite; @keyframes blink { 50% { opacity: 0; } }.

### Phone (IslandPhone decorative widget)

- Shell: 527×788; border-radius 136px (capsule); bg #F8F4E8; overflow hidden.
- Home: padding-top 40px; bg #F8F4E8 with 100% 200% size; animation grasswave 8s ease-in-out infinite.
- Top bar: wifi icon (79×29) | time 32px/800/letter-spacing 2px color #DDDBCC | location icon (36×36).
- Welcome: 48px / 800 / #725C4E / letter-spacing 2px / margin-top 20px.
- Apps grid: grid-template-columns repeat(3, 1fr); gap 32px; padding 8px.
- App tile: 123×123; border-radius 45px; flex center.
- App icon: background-size 70% auto.
- Badge dot: 28×28 circle; bg #FF544A; border 5px solid #F8F4E8; top 0 left 0.
- App palette: camera #B77DEE, app #889DF0, encyclopedia #F7CD67, diy #E59266, shopping #F8A6B2, variant #82D5BB, design #8AC68A, map #FC736D, chat #D1DA49.

### Footer (decoration)

- type="sea": width 100%; height 80px; bg url(footer-sea.svg) center/contain no-repeat. Coral #EC7175, ocean #327A93/#98D2E3/#008077.
- type="tree" (default): width 100%; height 60px; bg url(footer-tree.webp) bottom center/cover.

### Divider

- 9 types, all height 12px; background center/contain no-repeat:
  line-brown (default, SVG fill #D8D0C3), line-teal (SVG), line-white (PNG), line-yellow (SVG), wave-yellow (SVG),
  dashed-brown, dashed-teal, dashed-white, dashed-yellow.

### Cursor (wrapper)

- Wraps children, applies: cursor: url(cursor-icon.png) 4 0, auto !important; (and same on all descendants via .animal-cursor \*). Hotspot (4, 0). `forceAll` prop (default true) controls whether the override cascades to all descendants.

### Typewriter

- Recursively truncates ReactNode tree by character count, preserves element structure, className, inline styles. Returns plain fragment (NO extra wrapping div/span — zero layout impact).
- Default speed 90ms/char. Restart by changing the `trigger` prop (any value).

### Icon (10 named icons)

- SVG-based, single-color. Pass via `<Icon name="..." size={...} color="..." />`. Names: arrow-down, arrow-up, check, close, copy, leaf, menu, search, star, trash (or similar curated set — defer to ICON_LIST runtime export).

### CodeBlock (dark JSX/TS only)

- Container: padding 20px 24px; bg #2b2118; border 1px solid #3d3028; border-radius 20px;
  font-size 14px; line-height 1.7; tab-size 4;
  font-family 'SF Mono','Fira Code','Cascadia Code',Consolas,monospace; weight 600;
  white-space pre; overflow auto; default text #e8d5bc.
- Token colors:
  comment #6b5e50 string #a8d4a0 keyword #d4a0e0 react #e06c75
  component #80c0e0 func #61afef prop #e8c87a jsx #f0a870
  operator #d4b896

### Form (form container — layout only in inline-HTML mode)

- In static-HTML mode, implement Form as a **layout-only shell** matching the visual spec; do NOT reimplement field hijacking, useForm, validation, or submit. Real interactivity requires `npm i animal-island-ui`.
- Root `<form class="island-form island-form-horizontal|vertical|inline island-form-{size}">`. Inline `<Form.Item>` is `<div class="island-form-item island-form-item-{layout} island-form-item-{size}">`.
- Horizontal layout: outer is `display: flex; flex-direction: column; gap: 8px;`. Each item is a **24-column CSS grid** (`grid-template-columns: repeat(24, minmax(0,1fr)); align-items: baseline;`). Label sits in column 1 / span N (labelCol.span, default 6), wrapper in column N+1 / span M (wrapperCol.span, default 18). **No column-gap** between label and wrapper in horizontal (or 23×16px=368px explodes the form).
- Vertical layout: outer flex column gap 8px; each item is `display: block`; label is `display: block; margin-bottom: 6px;` above the control.
- Inline layout: outer `display: flex; flex-wrap: wrap; gap: 8px;`; items are `flex: 0 0 auto;` (each item internally stacks label-over-control like vertical).
- Label: `color: rgba(0,0,0,0.85); font-weight: normal; white-space: nowrap; line-height: 1.6;`. Required `*` before label `color: #ff4d4f; margin-right: 4px;`. Optional colon `:` after label `margin: 0 4px 0 2px;`. Label font-size scales with size: small 12 / middle 14 / large 16 px.
- Control wrapper: `min-width: 0;`. Help/explain slot: `min-height: 22px; font-size: 12px; color: rgba(0,0,0,0.45); margin-top: 4px;`. Error color `#ff4d4f`, warning `#faad14`, success `#52c41a`, validating `#1677ff`.
- NOTE: Form's neutral grays (`rgba(0,0,0,0.85)` etc.) intentionally diverge from the warm-parchment token palette used by other components — they mirror conventional form-library defaults so existing forms look familiar. Do NOT recolor Form internals to `#725d42`.

### Wallet (currency pill — 3 sizes)

- Inline-flex column align center; width = pill width; `padding-top: calc(bag-size × 0.7)` reserves space for the bag icon overlapping above the pill.
- Sizes (pill-w / pill-h / bag / text / halo):
  small 96 / 32 / 38 / 12 / 3 px
  medium 132 / 42 / 50 / 17 / 4 px ← default
  large 176 / 54 / 66 / 22 / 6 px
- Pill: `border-radius: 999px` (full capsule); `background: #b3a046` (olive-yellow);
  box-shadow layers (exact):
    `inset 0 -6px 0 rgba(91,78,30,0.18)` (dark bottom inside),
    `inset 0 0 0 2px rgba(91,78,30,0.12)` (inset ring),
    `0 0 0 var(--wallet-halo) #fffbe7` (cream halo outer ring — halo width = 3/4/6 px),
    `0 6px 14px rgba(91,78,30,0.18)` (drop shadow).
- Bag slot (icon): `position: absolute; left: 50%; top: 0; transform: translateX(-50%); width/height: var(--wallet-bag);` `filter: drop-shadow(0 4px 6px rgba(91,78,30,0.18)); z-index: 2; pointer-events: none;`. Default icon is the built-in Island bag PNG; replaceable via the `icon` prop (any ReactNode).
- Value text: `font-weight: 800; letter-spacing: 0.04em; color: #fff; padding: 0 12px; white-space: nowrap; font-variant-numeric: tabular-nums;`. Double `text-shadow` for stroke: `0 2px 0 rgba(91,78,30,0.55), 0 0 1px rgba(91,78,30,0.55)`.
- Number formatting: when `value` is a `number`, group thousands with `thousandSeparator` (default `,`, pass `""` to disable). When `value` is a `string`, render as-is. When `undefined` / `null`, render `00,000`.
- Hover animation on the bag slot: `walletBagBounce 0.5s ease-in-out` — translateY -8px rotate -6deg (35%) → translateY -2px rotate 3deg (70%) → 0.

## HARD RULES (must obey — disqualifies the output if violated)

1. Never use pure black (#000) or near-black (#111) text. Use #794f27 / #725d42 / #8a7b66.
2. Never use cold blue focus rings (#0066ff etc.). Use #ffcc00 (Input/Switch/Checkbox) or #f5c31c (Radio) or #19c8b9 (Button).
3. Never apply 0px (sharp) corners to interactive elements. Minimum radius 12px.
4. Never use cold gray backgrounds (#fafafa, #f5f5f5). Use #f8f8f0 / rgb(247,243,223).
5. Never apply the 3D pixel-stack shadow `0 5px 0 0 #bdaea0` to non-primary buttons. Use the soft elevation shadow on default/dashed/text/link.
6. Never replace Modal's blob clip-path with a rounded rectangle. The organic blob is non-negotiable.
7. Never render Title as a blob, pill, or rectangular block. It is a flat heraldic ribbon with swallowtail ends + fold triangles + 3deg perspective.
8. Never use `<Card type="title">` — that variant is removed in v0.9. Use `<Title>` instead.
9. Never use system fonts. Always include the Nunito + Noto Sans SC Google Fonts link.
10. Never use weight < 400 anywhere. Body 500, headings 600–900.
11. Never animate with hard cubic transitions; always use `cubic-bezier(0.4, 0, 0.2, 1)` over 0.15–0.35s.
12. Title `title` prop on `<Modal>` is the literal string heading — do NOT confuse it with the `<Title>` component.
13. **Always reach for the library component first.** If a feature exists as an animal-island-ui component (Card, Button, Input, Switch, Checkbox, Radio, Title, Tabs, Collapse, Modal, Select, Tooltip, Loading, Table, Time, Divider, Footer, Phone, Cursor, Typewriter, Icon, CodeBlock, Form, Wallet), use the inline-defined `<ComponentName>` JSX with documented props. Only hand-roll raw HTML/JSX when the library has no equivalent (page layout, app-specific composition, decorative blocks).

## TASK

**STEP 1 — Ask before generating.** If the user has not yet told you what page/component they want, your FIRST reply must be a short question asking what to build, with 3–5 concrete suggestions. Do NOT generate any HTML in this turn. Example reply (adapt to the user's language):

> 你想生成什么页面？比如：
>
> - 一个个人博客首页
> - 一个商品列表 / 卡片墙
> - 一个 FAQ / 设置页
> - 一个登录 / 注册页
> - 一个仪表盘
>
> 或者直接描述你的需求（标题、要展示的内容、需要哪些交互）。

Only proceed to STEP 2 after the user answers.

**STEP 2 — Generate.** Produce **one complete `index.html` file** implementing the page/component the user asked for, strictly following the spec above. The user will save it as `index.html` and double-click to open in a browser — it MUST render correctly with no extra setup.

Structure the script like this:

```jsx
// 1) Inline React components mirroring animal-island-ui's API (Card, Button, Input, Switch, ...)
function Button({ type = 'default', size = 'middle', loading, disabled, children, ...rest }) { ... }
function Card({ pattern, color, type, children, ...rest }) { ... }
// ...all components used by the page

// 2) Page composition uses ONLY those components (plus layout divs)
function App() {
  return (
    <div className="page">
      <Title color="app-teal" size="large">Settings</Title>
      <Card pattern="default"> ... </Card>
      <Tabs items={[...]} />
      <Button type="primary" size="large">Save</Button>
    </div>
  );
}
```

Wrap the entire file content in a single fenced ` ```html ` code block so the user can copy-paste it as-is. After the code block, list any spec line you intentionally relaxed (e.g., simplified an animation) and why.
````

> 这个提示词是 self-contained 的：不需要打开 `AI_USAGE.md` 或 `skill/SKILL.md` 也能让 AI 工具复现 95%+ 视觉。要 100% 像素级还原，**项目内**直接 `npm i animal-island-ui` + `import` 真实组件即可。
