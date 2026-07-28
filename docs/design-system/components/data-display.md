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

> There is no `language` prop; non-JS/TS code (Python/Shell/SQL) is coloured by the generic rules and may render inaccurately. No copy button, line numbers or soft wrapping.

## Tag (pill, 12-colour palette)

Source: `src/components/Tag/Tag.tsx` + `tag.module.less`. **Pill-shaped tag**: perfectly aligned with the Card palette (12 brand colours + 1 default), 3 sizes × 3 variants (solid / outlined / dashed), supporting closable / onClick / disabled.

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
.size-small  { height: 24px; line-height: 21px; padding: 0 10px; font-size: 12px; }
.size-medium { height: 29px; line-height: 26px; padding: 0 12px; font-size: 13px; } /* default */
.size-large  { height: 34px; line-height: 31px; padding: 0 16px; font-size: 15px; }

// ---------- Variant ----------
.variant-solid    { background: rgb(247, 243, 223); color: #8f734f; border-color: #d4c4a8; }
.variant-outlined { background: transparent;    color: #8f734f; border-color: #c4b89e; }
.variant-dashed   { background: transparent;    color: #8f734f; border-color: #c4b89e; border-style: dashed; }

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
