# Data display — pixel spec

Exact values for the components that present content: Table, Pagination, CodeBlock, Tag, Badge, Image, Avatar, CountUp and Calendar.

## Table (dashed row rules, solid hover)

Source: `src/components/Table/table.module.less`. **The shell has no solid border**; row separators are dashed rules drawn with `::after`; the hover row is a solid light-teal background.

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

/* row hover — solid light-teal + inner rounded clip */
background: #d6f0ea;
border-radius: 30px;
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

**Built-in pagination** — pass `pagination` (a `PaginationProps` object, default `false` = off) and Table slices `dataSource` client-side and renders a `Pagination` footer inside the shell:

```css
/* footer wrapper — right aligned inside the table shell */
display: flex;
justify-content: flex-end;
padding: 10px 16px 8px;
```

`pagination.current` / `pagination.pageSize` are controlled when provided; otherwise Table keeps the page state internally. All other `PaginationProps` (see below) pass through, and `onChange` receives the same signature `(page, pageSize)`.

## Pagination (ghost-cell pager, DatePicker visual language)

Source: `src/components/Pagination/pagination.module.less`. **Ghost-cell pager sharing the DatePicker panel vocabulary**: transparent page cells that hover to light-teal, the active page as a solid teal circle, and the size-changer / jumper controls styled like the DatePicker trigger (cream capsule + 3px hard bottom shadow). Ellipses when pages exceed 7.

```less
// root — inline-flex row, gap 2px, colour #725d42
.pagination {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-family: 'Nunito', 'Noto Sans SC', sans-serif;
    font-size: 14px;
    user-select: none;
}

// total text (showTotal)
.total { margin-right: 10px; font-size: 13px; font-weight: 600; color: #a09080; }

// page & prev/next buttons — ghost circles (same as DatePicker dayCell / navBtn)
.item {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #725d42;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s ease;
    // hover (non-active, non-disabled): background #e6f9f6 + color #19c8b9 (same as dayCell:hover)
    // focus-visible: outline 2px solid #ffcc00, offset 1
    // disabled: color #d4c9b4, cursor not-allowed, background stays transparent
}

// active page — teal solid circle, white text (same as dayCellSelected)
.active {
    background: #19c8b9;
    color: #fff;
    font-weight: 700;
    cursor: default;
    &:hover { background: #3dd4c6; } // deepen, no lift
}

// ellipsis between page runs
.ellipsis { width: 24px; height: 32px; color: #c4b89e; font-weight: 900; letter-spacing: 1px; }

// size changer trigger (showSizeChanger) — DatePicker trigger style
.sizeTrigger {
    height: 32px;
    padding: 0 14px;
    border: none;
    border-radius: 50px;
    background: #fffbe7;
    color: #8a7b66;
    font-size: 12px;
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    // hover: box-shadow 0 3px 0 0 #c4b89e + color #725d42
    // focus-visible: 0 3px 0 0 #e0b800 + 0 0 0 3px rgba(255, 204, 0, 0.15) (same as trigger-open)
}

// size options — upward popover (bottom: calc(100% + 8px)), DatePicker panel style
.sizeList {
    padding: 8px;
    background: #fffdf7;
    border: 1.5px solid #e8dcc8;
    border-radius: 20px;
    box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12);
    animation: size-list-in 0.2s cubic-bezier(0.4, 0, 0.2, 1); // fade + rise 6px
}
.sizeOption       { min-width: 96px; padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 500;
                    &:hover { background: #e6f9f6; color: #19c8b9; } }
.sizeOptionActive { background: #19c8b9; color: #fff; font-weight: 700; &:hover { background: #3dd4c6; } }

// quick jumper input (showQuickJumper) — cream capsule, gold focus (same as trigger-open)
.jumperInput {
    width: 52px;
    height: 32px;
    border: none;
    border-radius: 50px;
    background: #fffbe7;
    color: #725d42;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    // focus: box-shadow 0 3px 0 0 #e0b800 + 0 0 0 3px rgba(255, 204, 0, 0.15)
    // disabled: background #ece8dc, opacity 0.5
}
```

> **Key design decisions**:
> - The pager deliberately reuses the DatePicker panel vocabulary (ghost cells, `#e6f9f6` hover, teal `#19c8b9` selection circle, `#fffdf7` popover with `#e8dcc8` border) so date grids and page grids read as the same product family.
> - Page runs follow the classic pager: first + last page always visible, current ±1 neighbourhood, `···` ellipses when `pageCount > 7`.
> - `current` / `pageSize` are controlled when passed; otherwise internal state (`defaultCurrent` 1, `defaultPageSize` 10). `onChange(page, pageSize)` fires on both page and size changes; `onShowSizeChange(current, size)` only on size change, with `current` already clamped into the new page count.
> - The size changer is a self-contained popover (click outside / Escape closes) rather than reusing `Select`, so the pager has no dependency on the form components.
> - a11y: root is `<nav aria-label="分页">`; the active page carries `aria-current="page"`; prev/next have `aria-label` and use native `disabled`; the jumper input has an `aria-label`.

## CodeBlock (dark theme, JSX/TS + shell tokenizer)

Props:

| name        | type            | default | description                                                                                    |
| ----------- | --------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `code`      | `string`        | —       | **required**; raw source string. JSX/TS code is tokenized and highlighted; lines starting with a shell command (`npm/yarn/pnpm/npx/node/git/...`) are highlighted as shell instead |
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

The top-right copy button uses the Clipboard API and reports `已复制` or `复制失败`; set `copyable={false}` to hide it. There is no `language` prop, line numbers or soft wrapping. When the first line starts with a shell command (`npm/yarn/pnpm/npx/node/git/cd/ls/...`), the block switches to shell highlighting: command names in the `jsx` colour, known subcommands (`install/add/build/git commit/...`) in `string`, flags (`-x` / `--flag`) in `operator`, `//` comments in italic `comment`; package/argument names stay in the default colour. Other non-JS/TS code is coloured by the generic rules and may render inaccurately.

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

## Badge (corner count badge, 2px cream ring)

Source: `src/components/Badge/Badge.tsx` + `badge.module.less`. **Corner count badge**: a `<sup>` pill pinned to the top-right of the wrapped element, showing a number, a capped number (`99+`) or a bare dot; it also works standalone (no wrapped element). The colour palette is shared with Card / Tag.

```less
/* wrapper — inline-flex so the sup anchors on the wrapped element */
.badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    line-height: 1;
    font-family: inherit;
}

.indicator {
    /* positioning offsets are variables so the entrance animation also works standalone */
    --badge-shift-x: 50%;
    --badge-shift-y: -50%;

    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translate(var(--badge-shift-x), var(--badge-shift-y));
    transform-origin: 100% 0;
    background: #fc736d; /* app-red, the default */
    color: #fff;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    border-radius: 999px; /* pill */
    border: 2px solid var(--animal-bg-color, #f8f8f0); /* cream ring, same as Avatar's */
    box-shadow: var(--animal-shadow-sm, 0 2px 4px 0 rgba(61, 52, 40, 0.06));
    animation: animal-badge-zoom-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* standalone — nothing is covered: drop the offset, the cream ring and the shadow */
.standalone .indicator {
    position: static;
    --badge-shift-x: 0;
    --badge-shift-y: 0;
    border-color: transparent;
    box-shadow: none;
}

/* size — medium is the default; the type is sized to the 2px ring's inner cavity */
.size-medium { min-width: 20px; height: 20px; padding: 0 6px; font-size: 10px; }
.size-small  { min-width: 16px; height: 16px; padding: 0 4px; font-size: 9px; }

/* circle — 1–2 character content locks to a true circle */
.size-medium.circle { width: 20px; min-width: 0; padding: 0; }
.size-small.circle  { width: 16px; min-width: 0; padding: 0; }

/* dot — declared after the size classes so it overrides their box */
.dot { width: 10px; min-width: 0; height: 10px; padding: 0; }
```

**Circle vs pill** — the size classes alone let the box grow: with `0 6px` padding a two-digit badge is wider than it is tall, so it renders as a squashed pill rather than a circle. `Badge.tsx` therefore adds `.circle` whenever the rendered content is short, which pins `width` to the same value as `height` and makes the `999px` radius resolve to a true circle with the content centred by the `.indicator` flex box.

The type is sized against the **inner cavity**, not the outer box. The 2px cream ring takes 4px off, leaving the `medium` circle a 16px interior; at the original 12px type `99` measured ~13.5px wide — 84% of the cavity, effectively touching the edge. The sizes are therefore 10px / 9px rather than 12px / 11px.

The rule measures the **displayed text**, so numbers go through `String(value)` and land on the same path as strings:

| content | shape | why |
| ------- | ----- | --- |
| `5`, `12`, `99`, `0` | circle | 1–2 characters |
| `新` | circle | 1 full-width character still fits the diameter |
| `100`, `99+`, `999+` | pill | 3+ characters |
| `热更` | pill | 2 full-width characters overflow the circle |
| `<GiftIcon />`, any ReactNode | pill | no measurable text; the caller's node decides the box |

**Colour** — identical to the Card / Tag palette; the pale hues (`app-yellow`, `lime-green`, `yellow-green`) swap to dark text so the digits stay readable:

```less
.color-app-red         { background: #fc736d; color: #fff; } /* default */
.color-app-pink        { background: #f8a6b2; color: #fff; }
.color-app-orange      { background: #e59266; color: #fff; }
.color-app-yellow      { background: #f7cd67; color: #725d42; }
.color-app-teal        { background: #82d5bb; color: #fff; }
.color-app-green       { background: #8ac68a; color: #fff; }
.color-app-blue        { background: #889df0; color: #fff; }
.color-purple          { background: #b77dee; color: #fff; }
.color-lime-green      { background: #d1da49; color: #3d5a1a; }
.color-yellow-green    { background: #ecdf52; color: #725d42; }
.color-brown           { background: #9a835a; color: #fff; }
.color-warm-peach-pink { background: #e18c6f; color: #fff; }
```

**Entrance motion** — the `<sup>` is only mounted once it becomes visible, so this keyframed pop plays exactly on a 0 → N transition; `prefers-reduced-motion: reduce` disables it:

```less
@keyframes animal-badge-zoom-in {
    from { opacity: 0; transform: translate(var(--badge-shift-x), var(--badge-shift-y)) scale(0.6); }
    to   { opacity: 1; transform: translate(var(--badge-shift-x), var(--badge-shift-y)) scale(1); }
}
```

> **Key design decisions**:
> - The indicator is a `<sup>` element; `position: absolute` + `translate(50%, -50%)` pins it exactly on the wrapped element's top-right corner, and `transform-origin: 100% 0` makes the pop grow out of that corner.
> - The 2px cream ring (`--animal-bg-color`) reuses Avatar's sticker ring, so a badge overlapping an image or icon separates cleanly instead of floating on the artwork. A standalone badge covers nothing, so it drops ring, shadow and offset.
> - Capping applies to numbers and numeric strings only (`100` → `99+`); a ReactNode `count` (e.g. a naive-icons glyph) renders verbatim. The true value stays in the native `title` even when the visible text is capped — pass `title` explicitly to override it.
> - Visibility: hidden when `count` is empty (`null`, `undefined` or a blank string), when the value is `0` / `"0"` without `showZero`, and for `dot` when the value is zero; `dot` without a `count` still shows. `size` only affects the numeric pill — the dot box wins over it.
> - `color` is drawn from the shared island palette rather than a free-form CSS colour, so a badge cannot drift outside the Card / Tag colour language.

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

**Frame variants** (`variant` prop, default `'default'`). Three frame treatments share the same `.image` wrapper:

- `default` — no padding, transparent background, 12px radius, layered card shadow (the "big shadow" look).
- `bordered` — soft shadow + small radius; pairs with the `color` pastel backgrounds above.
- `stamp` — **postage-stamp frame**: cream paper `#fbfaf5`, 14px inset, 4-edge perforated border, faint halftone print texture (`::after`, `radial-gradient` 4px grid, `opacity: 0.13`) and a slight photo desaturation. The shadow is rendered via `filter: drop-shadow` (a `mask` clips `box-shadow`), and hover lifts the stamp (`translateY(-9px) scale(1.03)`).
  The perforation is built from four edge strips — one `radial-gradient` tile per edge, hole radius 5px / pitch 16px (constant at any aspect ratio) — combined with `mask-composite: intersect`, so **all four edges** are scalloped. Do **not** switch back to the "solid base − 4 hole strips" `subtract` form: the compositing operator list only steps through the layers, so Chrome falls back to `add` on the remaining edges and only the first edge shows perforations.

The year is an opt-in text overlay, rendered only when `stampYear` is supplied (`pointer-events: none`, `z-index: 2` above the halftone):

```less
// 年份 — 右上角照片上，白字 + 暗阴影
.variant-stamp .stamp-year { position:absolute; right:19px; top:18px; font-size:8px; letter-spacing:.18em; color:rgba(255,255,255,.88); text-shadow:0 1px 3px rgba(0,0,0,.55); }
```

```ts
// 邮票 prop（仅 variant='stamp' 生效，可选）
stampYear?: string; // 发行年份，如「2026」 — 右上角照片上
```

```tsx
<Image src="/photo.jpg" alt="邮票（带年份）" width={240} height={176} variant="stamp" stampYear="2026" />
// 仅齿孔边框、不印文字
<Image src="/photo.jpg" alt="纯邮票边框" width={240} height={176} variant="stamp" />
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

## Avatar (circle/squircle sticker head)

Source: `src/components/Avatar/avatar.module.less`. A `<span>` that shows either an image, an icon, or text. Sizes are the Button ladder: **32 / 40 / 48px** for `small` / `middle` / `large`; any numeric `size` is used verbatim.

```css
/* root */
.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--animal-primary-color-bg); /* #e6f9f6 light teal */
    color: var(--animal-primary-color);         /* #19c8b9 teal */
    font-weight: 600;
    border-radius: 999px; /* circle */
    vertical-align: middle;
}

/* square */
.shape-square { border-radius: 8px; } /* matches the Image mat radius */

/* image fills the circle */
.img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* text/icon holder — measured for gap-based auto-shrink */
.string { display: inline-flex; align-items: center; justify-content: center; line-height: 1; white-space: nowrap; }

/* placeholder (icon/text) — cream sticker ring */
.placeholder { border: 2px solid var(--animal-bg-color); }
```

**Text/icon placeholder** — content colour is the teal primary on a light-teal primary-bg; the 2px `--animal-bg-color` (#f8f8f0) border gives the "sticker" separation. Font size per preset is 14 / 16 / 20px; for numeric sizes it derives as `max(12, round(size * 0.4))`. **`gap` auto-shrink**: after mount the `.string` width is measured and, when it exceeds `size - gap * 2`, the font scales down by that ratio (`useLayoutEffect` → `setScale`) — text avatars only. Passing a naive-icons component as `children` (element type is a function component) creates an icon avatar that shares the `icon` rendering path (no shrink measurement); string/number children are text avatars.

**Image loading** — an `<img>` fills the box (`object-fit: cover`, no padding). On `error` the component re-renders the placeholder (icon, defaulting to the naive-icons `UserIcon`, or `children`) unless `onError` returns `false`. `src` change resets the load state. The img carries `alt` when provided, `alt=""` (decorative) otherwise; the bare default icon exposes `role="img"` + `aria-label="avatar"`.

**Avatar.Group** — `display: inline-flex` on a `.group` wrapper; avatars overlap via `margin-left: calc(-1 * var(--avatar-group-gap))` with the gap variable set inline from the `gap` prop (default 8px). Each avatar keeps a 2px `--animal-bg-color` ring so the overlap reads as deliberate stacking, not clipping. `maxCount` slices children and renders a `+N` pill (`styles.avatar` + `placeholder`, style overridable via `maxStyle`); group-level `size`/`shape` are cloned into children that don't set their own. `Avatar.Group` also works as a static property on `Avatar` (convenience alias).


## CountUp (score counter, digit plate + optional celebration)

Source: `src/components/CountUp/CountUp.tsx` + `count-up.module.less`.

A declarative count-up readout for score screens: animate `start` → `end` over `duration` seconds. The `requestAnimationFrame` timestamp is the clock (no `setInterval` drift), `isCounting` plays / pauses / resumes without losing elapsed progress, and the digit plate reuses Countdown's cream-gradient tile so a score screen and a deadline screen read as one family. No timer library: the easing curves and number formatting are local.

**props**:
```ts
type CountUpSize = 'small' | 'middle' | 'large';
type CountUpVariant = 'default' | 'island';
type CountUpEasing = 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeOutExpo'
    | ((progress: number) => number);
type CountUpChildren = (state: { value: number; reset: (newStartAt?: number) => void }) => React.ReactNode;

interface CountUpProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'children'> {
    start?: number;                  // default 0
    end: number;                     // REQUIRED — the score
    duration?: number;               // seconds, default 2; 0 jumps straight to end
    isCounting?: boolean;            // default false; false pauses and keeps the current value
    decimalPlaces?: number;          // default max(decimals(start), decimals(end))
    decimalSeparator?: string;       // default '.'
    thousandsSeparator?: string;     // default '' (no grouping)
    easing?: CountUpEasing;          // default 'easeOutCubic'
    formatter?: (value: number) => React.ReactNode;   // highest priority
    updateInterval?: number;         // seconds between value updates, default 0 = every frame
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    size?: CountUpSize;              // default 'middle'
    variant?: CountUpVariant;        // default 'default'
    bordered?: boolean;              // default false — draws the 1.5px plate border
    celebrate?: boolean | { text?: React.ReactNode };   // default false
    onUpdate?: (value: number) => void;
    onComplete?: (elapsedTime: number) => void | { shouldRepeat?: boolean; delay?: number; newStartAt?: number };
    children?: CountUpChildren;      // render prop, replaces the number content
}
```

**Shell and plate (exact values):**
```css
.count-up {                          /* same panel language as Countdown */
    display: inline-flex;
    align-items: center;
    gap: var(--animal-spacing-sm, 8px);
    color: var(--animal-text-color, #794f27);
    font-family: var(--animal-font-family, 'Nunito', 'Noto Sans SC');
    font-weight: 700;
    border-radius: 20px;
}
.default { padding: 12px 18px; background: var(--animal-bg-color, #fff); box-shadow: var(--animal-shadow-sm, ...); }
.island  { padding: 13px 20px; background: rgb(247, 243, 223); border: 2px dashed #d4c4a8; }

.plate {                             /* identical tile to Countdown's .unit */
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    padding: 3px 8px;
    border-radius: 12px;
    background: linear-gradient(180deg, #fff 0%, #f8f8f0 100%);
}
.island .plate    { background: linear-gradient(180deg, #fffdf4 0%, #f8f8f0 100%); }
.bordered .plate  { border: 1.5px solid #d4c9b4; }   /* island: #d4c4a8 */

.number {                            /* 20 / 26 / 34px per size — same as Countdown digits */
    color: #8b7355;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
}
.affix { color: #a89878; font-weight: 800; font-size: 0.62em; }   /* prefix / suffix */
```

**Celebration (opt-in, exact values):**
```css
/* the plate itself bounces twice */
.celebrating .plate { animation: animal-countup-pop 0.7s cubic-bezier(0.4, 0, 0.2, 1) both; }
/* 1 → 1.14(-2deg) → 0.98 → 1.08(1.6deg) → 0.99 → 1 */

/* two shockwave rings, 0.12s apart */
.ring { position: absolute; inset: 0; border: 2px solid rgba(247, 205, 103, 0.85); border-radius: 14px;
        animation: animal-countup-ring 0.7s cubic-bezier(0.4, 0, 0.2, 1) both; }   /* scale 1→1.5, opacity .9→0 */
.ring:nth-child(2) { border-color: rgba(255, 204, 0, 0.7); animation-delay: 0.12s; }

/* four CSS four-point sparkles flying out of the plate corners */
.sparkle { position: absolute; width: 10px; height: 10px; background: #f7cd67;
           clip-path: polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%);
           animation: animal-countup-sparkle 0.72s cubic-bezier(0.4, 0, 0.2, 1) both; }
.sparkle:nth-child(odd)  { --cu-x: -16px; }   /* corner offsets are per-nth-child; delays 0 / .06 / .12 / .18s */
.sparkle:nth-child(even) { --cu-x: 16px; }

/* sticker, above the plate — only rendered when celebrate.text is set */
.badgeWrap { position: absolute; left: 50%; bottom: 100%; margin-bottom: 6px; transform: translateX(-50%); }
.badge { padding: 2px 10px; color: #725d42; font-weight: 800; font-size: 12/13/15px per size; letter-spacing: 0.04em;
         background: linear-gradient(180deg, #ffe08a 0%, #f7cd67 100%);
         border: 1.5px solid #e0b800; border-radius: 50px; box-shadow: 0 2px 6px rgba(61, 52, 40, 0.18);
         animation: animal-countup-badge 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }   /* 0.4 → 1.12(3deg) → 1 */
```

**Key interaction details:**

- The celebration is a **status effect, not information**: the whole layer (rings, sparkles, sticker) is `aria-hidden` and `pointer-events: none`, and it sits above the plate only while `.celebrating` is set. It is unmounted 900ms after `onComplete` so the next completion replays the CSS animations from scratch.
- **The sticker is where the copy goes**: `celebrate` runs the two-beat bounce, rings and sparkles; `celebrate={{ text: '…' }}` also renders the warm-yellow sticker with whatever copy is passed (`完美！`, `当当！`, `+100`, …).
- The sticker is the only warm-yellow element and the only thing that overflows the shell — it hangs off `bottom: 100%`, so a parent with `overflow: hidden` clips it. It is a pill (`50px`) instead of a rectangle; the sparkles are pure CSS `clip-path` stars, so no emoji, Unicode glyph or inline SVG is introduced (`design-rules.md` rules 15/16).
- `duration` is measured against the rAF timestamp and pauses with `isCounting`; resuming continues from the stored elapsed time instead of restarting. `duration={0}` and any environment without `requestAnimationFrame` settle immediately on the value (`0` → `end`, no rAF → static `start`).
- `start` / `end` / `duration` changes restart the animation from `start`; a completed component restarts when `isCounting` goes `false → true`, so the `key`-based replay recipe of the reference library is only needed when the value alone must trigger a re-run. Moving `start` and `end` together therefore **continues from the previous total instead of recounting** — the accumulation pattern (`start={Math.max(0, total - 15)} end={total}` for a +15 pickup).
- **Formatting** mirrors `use-count-up`: `decimalPlaces <= 0` renders `Math.round(value)` (then thousands grouping); otherwise `toFixed(places)` is split on `.` and rejoined with `decimalSeparator`; `formatter` wins over all of it. With `updateInterval > 0` the *elapsed time* is quantized (`floor(elapsed / interval) * interval`) before easing, so updates land exactly one interval apart.
- a11y: the root is `role="status"`; the animated digits are `aria-hidden` and a visually-hidden span carries the **default-formatted** number (never a `formatter` node). It stays empty while counting and is filled once the value settles — a per-frame live region would be unusable, so only the final score is announced. `prefix` / `suffix` are decorative and excluded from that text. The whole digit plate is `aria-hidden`, so a `children` render prop must stay presentational: a focusable element placed inside it would sit in an `aria-hidden` subtree (an axe `aria-hidden-focus` violation). The demo therefore parks the `reset` function it receives in a ref and renders the replay button **outside** the component.
- `prefers-reduced-motion: reduce` drops the pop and hides the rings + sparkles; a sticker, when used, keeps a plain 0.25s opacity fade so completion is still signalled visually.

## Calendar (month panel, event bars that span days)

Source: `src/components/Calendar/calendar.module.less`. A **standalone** month calendar (not a popup): the month panel is
permanent, so the shell is a cream card rather than a positioned popover. It reuses DatePicker's visual language —
`#fffdf7` card, `#e8dcc8` 1.5px border, 20px radius, day circles — and adds an event band under each week's dates.

**Shell and header.** The panel has no size tiers: it measures its own box (`ResizeObserver`, or the numeric `width`
prop when given) and derives every metric from it. `--animal-calendar-scale` = actual width / **750** (the baseline is
tuned to match antd's full calendar card, measured at 751px wide / 107px cells / 116px rows / 14px day digits), clamped
to `0.6 … 2`, and the whole rhythm is `baseline × scale`:

| Metric | Baseline at 750px | At 1000px (scale 1.33) |
| ------ | ----------------- | ---------------------- |
| header height | 32px | 43px |
| cell height | 104px | 139px |
| day circle | 28px | 37px |
| event row / bar height | 22 / 17px | 29 / 23px |
| event font | 11px | 15px |

The day-number font stays at **13px** at every width — the circle grows with the panel, the digit inside it does not,
because a scaled-up digit overflows the circle. The cell must also fit the number band plus both event rows
(`38 + 22 × 2 = 82 ≤ 104`), which is what keeps a busy week from bleeding into the next one.



```css
.calendar {                       /* fixed accent trio (DatePicker's teal); every metric is baseline × scale */
    --animal-calendar-accent: #19c8b9;
    --animal-calendar-accent-soft: rgba(25, 200, 185, 0.14);
    --animal-calendar-accent-tint: #e6f9f6;
    --animal-calendar-header-height: calc(32px * var(--animal-calendar-scale, 1));
    --animal-calendar-number-size: calc(28px * var(--animal-calendar-scale, 1));
    --animal-calendar-cell-height: calc(104px * var(--animal-calendar-scale, 1));
    --animal-calendar-row-height: calc(22px * var(--animal-calendar-scale, 1));
    --animal-calendar-bar-height: calc(17px * var(--animal-calendar-scale, 1));
}

.body   { position: relative; padding-bottom: calc(var(--animal-calendar-row-height) * 2 + 6px);
          border: 1.5px solid #e8dcc8; border-radius: 20px; background: #fffdf7;
          box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12); }
.monthLabel { padding: 4px 12px; border-radius: 12px; background: #fffbe7; /* same chip as the DatePicker nav label */
              color: #725d42; font-size: 15px; font-weight: 700; }
.navBtn { width: 28px; height: 28px; border-radius: 10px; color: #a0936e;   /* 14px / 16px chevrons */
          /* hover */ background: var(--animal-calendar-accent-tint); color: var(--animal-calendar-accent); }
.todayBtn { padding: 4px 12px; border-radius: 10px; color: #8a7b66; font-size: 13px; font-weight: 700;
            /* hover */ background: rgba(114, 93, 66, 0.1); color: #725d42; }
```

**Date grid** — one `<table role="grid">`, 7 equal columns × 6 weeks (42 cells, always full; leading/trailing days of the
neighbouring months included but dimmed). Each cell is `--animal-calendar-cell-height` tall and carries the same 4px
side gutter the event bars use, so a bar and the day circle above it sit on one track:

```css
.weekCell { height: 32px; color: #a09080; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; }
.cell     { height: var(--animal-calendar-cell-height); padding: 0 4px; box-sizing: border-box;
            vertical-align: top; border-radius: 12px; cursor: pointer; }
.cell:hover           { background: #f4f0e4; }                      /* the whole cell, not just the number */
.cell:focus-visible   { outline: 2px solid var(--animal-calendar-accent); outline-offset: -2px; }
.cellSelected         { background: var(--animal-calendar-accent-tint); }
.dayNumber            { width: 1em; height: 1em; border-radius: 50%; line-height: 1em; text-align: center;
                        color: #725d42; font-size: 13px; font-weight: 500; }   /* fixed: the circle scales, the digit does not */
.cellOutside .dayNumber { color: #c4b89e; font-weight: 400; }
.cellToday   .dayNumber { box-shadow: inset 0 0 0 1.5px var(--animal-calendar-accent);
                          color: var(--animal-calendar-accent); font-weight: 700; }
.cellSelected .dayNumber { background: var(--animal-calendar-accent); box-shadow: none; color: #fff; font-weight: 700; }
.more  { padding: 1px 5px; border-radius: 8px; font-size: 10px; font-weight: 700;   /* the +N fold */
         background: var(--animal-calendar-accent-soft); color: var(--animal-calendar-accent); }
```

**Event bars** — the layer is absolutely positioned over the card and the component hands each bar three computed
values. It deliberately does **not** use `grid-column`: the bars are absolutely positioned, so they are outside grid
layout and a grid placement would be ignored.

```css
.eventsLayer { position: absolute; inset: 0; pointer-events: none; }
.event { position: absolute;
         top: var(--animal-calendar-bar-top);   /* header + week × cell + number band + row × row-height + half a row */
         left: var(--animal-calendar-bar-left);    /* (100% / 7) × column + 4px — the same 4px gutter as .cell */
         width: var(--animal-calendar-bar-width);  /* (100% / 7) × span − 8px */
         height: var(--animal-calendar-bar-height); margin: 0; padding: 0 6px;
         transform: translateY(-50%);   /* top points at the row start; this centres the bar in it */
         border-radius: 10px; font-size: calc(11px * var(--animal-calendar-scale, 1)); font-weight: 600;
         line-height: var(--animal-calendar-bar-height); overflow: hidden; white-space: nowrap; }
/* a span bar only keeps a 1px gutter at the seams, so consecutive weeks read as one strip */
.event[data-span='true']  { margin-left: 1px; margin-right: 1px; border-radius: 6px; }
.event[data-start='true'] { margin-left: 0; }    /* flush with the grid edge on the week it starts */
.event[data-end='true']   { margin-right: 0; }
/* 5 palettes: teal #e0f7f4/#17756d · amber #fff3d1/#8a6a08 · coral #ffe7de/#a44b32
   · green #eaf6db/#4a7a1d · purple #f0eafb/#6849b8, each with a matching 45% border */
.event[data-preview='true'] { border-style: dashed; }   /* drag-to-create preview */
.eventTime  { display: inline; margin-right: 4px; color: #9f927d; font-variant-numeric: tabular-nums; }
.eventTitle { display: inline; font-weight: 600; }
```

**Layout rules.** A multi-day event is cut at week boundaries, so every bar occupies 1–7 columns and never wraps; the
week-internal first slice carries the `HH:mm` prefix, continuation slices carry the title only. Each week row can host
2 bars (2 event rows); a third same-day event folds into `+N` on the day cell instead of pushing the row taller. Events
that fall entirely outside the 42-day grid are neither rendered nor counted — the `+N` tally and the cell's `aria-label`
both describe only what is on screen. `prefers-reduced-motion` drops the `.cell` / `.dayNumber` / `.navBtn` /
`.todayBtn` transitions.

## TimePicker

Time popup selector; value is a plain `HH:mm:ss` string. A wall-clock time is not attached to a calendar date, so the
panel needs no date library at all (see [ADR 0005](../../adr/0005-dayjs-as-the-date-layer.md)). The trigger follows the
Input visual spec (cream pill, no border); the panel holds three scrollable columns (时 / 分 / 秒) plus a footer.

**Trigger (matches Input):**

| Property    | small | middle | large |
| ----------- | ----- | ------ | ----- |
| height      | 32px  | 40px   | 48px  |
| padding     | `0 14px` | `0 18px` | `0 22px` |
| font-size   | 12px  | 14px   | 16px  |
| border-radius | 40px | 50px   | 50px  |

```css
background: #fffbe7;      /* no border, same as Input */
/* hover */ box-shadow: 0 3px 0 0 #c4b89e;
/* open/focus */ box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
/* error */ box-shadow: 0 3px 0 0 #c94444;
/* warning */ box-shadow: 0 3px 0 0 #dba90e;
/* disabled */ background: #ece8dc; box-shadow: none; opacity: 0.6;
```

**Panel** (248px wide, narrowing to 172px when `format` omits `ss`): three columns titled 时 / 分 / 秒 (`format`
without `ss` hides the seconds column); each column is a scrollable list of pill options (28px tall, radius 16px):

```css
/* option */ color: #725d42; border-radius: 16px;
/* option hover */ background: #ffd54f; color: #725d42;
/* selected option */ background: #ffb400; color: #fff; font-weight: 700;
```

**Footer** — `此刻` (sets the pending value to the current time) + `确定` (commits via `onChange` and closes with the
0.2s exit animation). Picking a column value updates the trigger live; Esc / click-outside discards the pending value.

**Interaction:** keyboard Enter/Space/ArrowDown opens, Enter confirms, Esc closes; `hourStep` / `minuteStep` /
`secondStep` filter the column options.
