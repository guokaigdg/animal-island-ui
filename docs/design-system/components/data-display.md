# Data display — pixel spec

Exact values for the components that present content: Table, CodeBlock and Tag.

## Table (dashed row rules, striped hover)

Source: `src/components/Table/table.module.less`. **The shell has no solid border**; row separators are dashed rules drawn with `::after`; the hover row is a diagonal teal stripe.

```css
/* outer wrapper */
background: rgb(247, 243, 223);
border-radius: 20px;
padding: 6px; /* only 6px of padding, no border */
box-sizing: border-box;

/* header cell */
padding: 16px 20px;
font-size: 14px;
font-weight: 700;
color: #725d42; /* not #794f27 */
letter-spacing: 0.02em;
/* header bottom separator (::after dashed) */
border-image: none;
&::after {
    content: '';
    border-bottom: 1px dashed rgb(240, 232, 216);
    /* dash pattern: 6px on / 6px off */
}

/* body cell */
padding: 14px 20px; /* no fixed 48px row height — the padding sets it */
font-size: 14px;
font-weight: 500;
color: #725d42;
line-height: 1.6;
/* the row bottom separator is likewise 1px dashed (6/6) rgb(240,232,216) */

/* striped even rows */
background: rgba(248, 248, 240, 0.6); /* not rgba(247,243,223,0.5) */

/* row hover — diagonal teal stripes + inner rounded clip */
background: repeating-linear-gradient(-45deg, rgba(25, 200, 185, 0.6) 0 10px, rgba(14, 196, 182, 0.6) 10px 20px);
background-size: 28.28px 28.28px;
clip-path: inset(0 0 0 0 round 30px);
color: #3d2e1e;

/* empty state */
padding: 60px 20px;
text-align: center;
color: #9f927d;
/* icon */
opacity: 0.5;

/* loading mask */
background: rgba(247, 243, 223, 0.8);
backdrop-filter: blur(2px);
/* spinner */
color: #19c8b9;
```

## CodeBlock (dark theme, JSX/TS tokenizer)

Props:

| name        | type            | default | description                                                                     |
| ----------- | --------------- | ------- | ------------------------------------------------------------------------------- |
| `code`      | `string`        | —       | **required**; raw source string, tokenized and highlighted internally as JSX/TS |
| `style`     | `CSSProperties` | —       | merged over the default dark theme                                              |
| `className` | `string`        | —       | custom class name                                                               |
| `copyable`  | `boolean`       | `true`  | shows the copy button                                                           |
| `onCopy`    | `(code) => void`| —       | called after the code was copied successfully                                   |

**Default theme (hard-coded in the component, not driven by Less):**

```css
padding: 20px 24px;
background: #2b2118;
border: 1px solid #3d3028;
border-radius: 20px;
font-size: 14px;
line-height: 1.7;
font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
font-weight: 600;
color: #e8d5bc;
white-space: pre;
overflow: auto;
tab-size: 4;
```

When the copy button is visible and the consumer has not supplied custom `padding` / `paddingRight`, the component reserves `96px` on the right so the button never covers the first line.

**Token palette (the `COLORS` constant):**

| token     | colour    | covers                                                                    |
| --------- | --------- | ------------------------------------------------------------------------- |
| comment   | `#6b5e50` | `/* */`, `//`                                                             |
| string    | `#a8d4a0` | backticks / single and double quotes, numbers                             |
| keyword   | `#d4a0e0` | `import/export/const/return/async/...`, `true/false/null/undefined`       |
| react     | `#e06c75` | `React/useState/useEffect/FC/ReactNode/CSSProperties/...`                 |
| component | `#80c0e0` | capitalized camel-case identifiers (JSX component names, type names)      |
| func      | `#61afef` | lowercase identifier followed by `(`                                      |
| prop      | `#e8c87a` | identifier followed by `=` (JSX props / assignment)                       |
| jsx       | `#f0a870` | `<Tag`, `</Tag`, `/>`                                                     |
| operator  | `#d4b896` | `{}[]();,` and `+-\*/=<>&\|^~?:` etc.                                     |
| default   | `#e8d5bc` | everything else                                                           |

The top-right copy button uses the Clipboard API and reports `已复制` or `复制失败`; set `copyable={false}` to hide it. There is no `language` prop, line numbers or soft wrapping; non-JS/TS code is coloured by the generic rules and may render inaccurately.

## Tag (pill, 12-colour palette)

Source: `src/components/Tag/Tag.tsx` + `tag.module.less`. **Pill-shaped tag**: perfectly aligned with the Card palette (12 brand colours + 1 default), 3 sizes × 4 variants (solid / outlined / dashed / soft), supporting closable / onClick / disabled.

```less
// root — full pill, 1.5px transparent border (reserves space for the variants so nothing jitters)
.tag {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    line-height: 1;
    font-family: inherit;
    font-weight: 600;
    border-radius: 999px;
    border: 1.5px solid transparent;
    transition: all 0.2s ease;
    user-select: none;
    white-space: nowrap;
}

// ---------- Size ----------
// line-height stays at 1 (inherited from .tag root); vertical centering is handled
// by inline-flex + align-items: center, so size classes only set height / padding / font-size.
// height uses 8px steps (24/32/40); font-size uses 12/14/16.
.size-small  { height: 24px; padding: 0 10px; font-size: 12px; }
.size-medium { height: 32px; padding: 0 12px; font-size: 14px; } /* default */
.size-large  { height: 40px; padding: 0 16px; font-size: 16px; }

// ---------- Variant ----------
.variant-solid    { background: rgb(247, 243, 223); color: #8f734f; border-color: #d4c4a8; }
.variant-outlined { background: transparent;    color: #8f734f; border-color: #c4b89e; }
.variant-dashed   { background: transparent;    color: #8f734f; border-color: #c4b89e; border-style: dashed; }
.variant-soft     { background: #f5f0e6; color: #8f734f; border-color: transparent; }

// ---------- Colour (identical to Card's .pattern-{color} border colours) ----------
// solid variant: background = saturated colour, text #fff
.color-app-pink-solid         { background: #f8a6b2; border-color: #f8a6b2; color: #fff; }
.color-purple-solid           { background: #b77dee; border-color: #b77dee; color: #fff; }
.color-app-blue-solid         { background: #889df0; border-color: #889df0; color: #fff; }
.color-app-yellow-solid       { background: #f7cd67; border-color: #f7cd67; color: #fff; }
.color-app-orange-solid       { background: #e59266; border-color: #e59266; color: #fff; }
.color-app-teal-solid         { background: #82d5bb; border-color: #82d5bb; color: #fff; }
.color-app-green-solid        { background: #8ac68a; border-color: #8ac68a; color: #fff; }
.color-app-red-solid          { background: #fc736d; border-color: #fc736d; color: #fff; }
.color-lime-green-solid       { background: #d1da49; border-color: #d1da49; color: #fff; }
.color-yellow-green-solid     { background: #ecdf52; border-color: #ecdf52; color: #fff; }
.color-brown-solid            { background: #9a835a; border-color: #9a835a; color: #fff; }
.color-warm-peach-pink-solid  { background: #e18c6f; border-color: #e18c6f; color: #fff; }

// outlined / dashed variants: text + border = saturated colour, transparent background
.color-app-pink-outlined,
.color-app-pink-dashed         { color: #f8a6b2; border-color: #f8a6b2; }
.color-purple-outlined,
.color-purple-dashed           { color: #b77dee; border-color: #b77dee; }
.color-app-blue-outlined,
.color-app-blue-dashed         { color: #889df0; border-color: #889df0; }
.color-app-yellow-outlined,
.color-app-yellow-dashed       { color: #f7cd67; border-color: #f7cd67; }
.color-app-orange-outlined,
.color-app-orange-dashed       { color: #e59266; border-color: #e59266; }
.color-app-teal-outlined,
.color-app-teal-dashed         { color: #82d5bb; border-color: #82d5bb; }
.color-app-green-outlined,
.color-app-green-dashed        { color: #8ac68a; border-color: #8ac68a; }
.color-app-red-outlined,
.color-app-red-dashed          { color: #fc736d; border-color: #fc736d; }
.color-lime-green-outlined,
.color-lime-green-dashed       { color: #d1da49; border-color: #d1da49; }
.color-yellow-green-outlined,
.color-yellow-green-dashed     { color: #ecdf52; border-color: #ecdf52; }
.color-brown-outlined,
.color-brown-dashed            { color: #9a835a; border-color: #9a835a; }
.color-warm-peach-pink-outlined,
.color-warm-peach-pink-dashed  { color: #e18c6f; border-color: #e18c6f; }

// soft variant: light pastel background + deeper same-hue text, no border
.color-app-pink-soft         { background: #fce4ec; color: #c2185b; }
.color-purple-soft           { background: #f3e5f5; color: #7b1fa2; }
.color-app-blue-soft         { background: #e6f0ff; color: #1565c0; }
.color-app-yellow-soft       { background: #fff8e1; color: #f9a825; }
.color-app-orange-soft       { background: #fff3e0; color: #e65100; }
.color-app-teal-soft         { background: #e0f2f1; color: #00695c; }
.color-app-green-soft        { background: #e8f5e9; color: #2e7d32; }
.color-app-red-soft          { background: #ffebee; color: #c62828; }
.color-lime-green-soft       { background: #f1f8e9; color: #558b2f; }
.color-yellow-green-soft     { background: #f9fbe7; color: #827717; }
.color-brown-soft            { background: #efebe9; color: #4e342e; }
.color-warm-peach-pink-soft  { background: #fbe9e7; color: #bf360c; }

// ---------- Close button ----------
.close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 2px;
    margin-right: -4px;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: rgba(0, 0, 0, 0.08);
    color: inherit;
    font-size: 14px;
    line-height: 1;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.15s ease;
}
.close:hover { background: rgba(0, 0, 0, 0.18); }
.close:disabled { cursor: not-allowed; opacity: 0.5; }

// ---------- Interactive ----------
.is-clickable { cursor: pointer; }
.is-clickable:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(61, 52, 40, 0.12);
}
.is-clickable:active { transform: translateY(0); }
.is-clickable:focus-visible {
    outline: 2px solid var(--animal-focus-yellow, #f5c31c);
    outline-offset: 2px;
}
.is-disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
```

> **Key design decisions**:
> - Shares the same 12-colour palette as Card (reusing its `pattern-{color}` border colours directly), keeping "card + tag" combinations visually consistent.
> - `border: 1.5px solid transparent` is the default placeholder so that switching to outlined/dashed never resizes the tag as the border appears or disappears.
> - The `closable` button's click calls `stopPropagation`, so it never bubbles into `onClick`.
> - When `onClick` is provided, the whole tag is promoted to `role="button"` + `tabIndex={0}` and responds to Enter / Space.

## Image (mat frame)

Source: `src/components/Image/image.module.less`. **Mat frame**: `#fff` background by default (`color="white"` — plain; any other `color` renders the Card `pattern` base colour — soft pastel, dots omitted), 12px padding (the image sits inset like a photo mat), 8px radius, `0 8px 14px 0 rgba(0, 0, 0, 0.08)` soft shadow and a built-in error placeholder.

```less
// frame wrapper
.image {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
    border: none; /* 相框无边框；preview 默认开启时相框是 <button>，显式去除 UA 边框 */
    background: #fff; /* 默认白色；`color` prop 覆盖 */
    padding: 12px; /* 相框内边距，图片像照片衬板一样内缩 */
    border-radius: 8px; /* 圆角固定，不提供 radius prop */
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.08);
    line-height: 0;
    vertical-align: middle;
    flex-shrink: 0;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

// inner img — fills the frame, fades in after load
.img        { display: block; width: 100%; height: 100%; opacity: 0; transition: opacity 0.25s ease; }
.loaded .img { opacity: 1; }

// error placeholder — camera icon + muted text
.error { flex-direction: column; gap: 8px; color: #c4b89e; font-size: 13px; font-weight: 500; line-height: 1.5; }
```

**Color variants** — `color="white"` renders the plain `#fff` base; every other value (`default` + 12 brand colours) renders the Card `pattern` **base colour** (the soft pastel the pattern sits on, dots omitted). Each class also sets a readable text colour (visible in the error placeholder):

```less
// White — 纯白，由 base .image 提供
.image-default         { background: rgb(247, 243, 223); color: #725d42; }
.image-app-pink        { background: #fde4e8; color: #a85565; }
.image-purple          { background: #f0e8ff; color: #6a3a9a; }
.image-app-blue        { background: #e8edff; color: #4a5a8a; }
.image-app-yellow      { background: #fff8e0; color: #7a6528; }
.image-app-orange      { background: #fff0e8; color: #8a4a2a; }
.image-app-teal        { background: #e8faf5; color: #2a6b5a; }
.image-app-green       { background: #e8f5e8; color: #3a6b3a; }
.image-app-red         { background: #ffe8e8; color: #9a3a3a; }
.image-lime-green      { background: #f5f8e0; color: #5a6b28; }
.image-yellow-green    { background: #fffde8; color: #6a5a28; }
.image-brown           { background: #f5f0e0; color: #5a4a2a; }
.image-warm-peach-pink { background: #fff0e8; color: #8a4a2a; }
```

**Preview lightbox** (click-to-zoom, `preview` prop — **on by default**). The frame is promoted to a `<button type="button">` (native Enter/Space support, `cursor: zoom-in`); the overlay is portaled to `document.body` so it escapes any ancestor `transform` stacking context:

```less
// full-screen mask — same as Modal (`--animal-mask-bg`, default rgba(0,0,0,0.35)), click closes
.mask {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--animal-mask-bg);
    animation: animal-image-fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

// dialog — shrink-wraps the large image; its click is stopPropagation'd (only the mask closes)
.dialog { position: relative; display: inline-flex; line-height: 0; }

// large image
.previewImg {
    max-width: min(88vw, 1100px);
    max-height: 86vh;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(43, 33, 24, 0.55);
    object-fit: contain;
    animation: animal-image-zoom-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

// close button — 40×40 circle, light gray scrim + white ×
.closeBtn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
    width: 40px;
    height: 40px;
    border: 1.5px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    background: rgba(216, 220, 226, 0.9);
    color: #fff;
    cursor: pointer;
}
.closeBtn:hover { background: rgba(196, 201, 208, 0.95); transform: scale(1.06); }
.closeBtn:focus-visible { outline: 2px solid #ffcc00; outline-offset: 2px; }
```

> **Key design decisions**:
> - `width` / `height` land on the frame wrapper while the `<img>` fills it at 100% (fixed `object-fit: cover`), inset by the 12px padding. The background is plain `#fff` for `color="white"` and the Card `pattern` base colour (dots omitted) for every other `color`; 12px padding and 8px frame radius are fixed by the stylesheet, not configurable. The frame carries a soft `0 8px 14px 0 rgba(0, 0, 0, 0.08)` shadow (no border), and `overflow: hidden` + `line-height: 0` keep the image pixel-perfectly aligned.
> - On load error the built-in placeholder is rendered, exposed as `role="img"` with `aria-label` (uses `alt`, else "图片加载失败").
> - While unloaded, the image is `opacity: 0`; `onLoad` fades it in (`.loaded .img`).
> - **Preview a11y**: opening focuses the close button; `Escape` closes; Tab stays trapped on the close button (the only focusable element); closing restores focus to the trigger. The overlay is `role="dialog"` + `aria-modal` with a name derived from `alt`, and the close button carries `aria-label="关闭预览"`. The trigger button shows the yellow `#ffcc00` focus ring (`:focus-visible`) instead of the browser default.
