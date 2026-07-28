# General — pixel spec

Pixel-level styling for the general-purpose components: Button, Icon, Typewriter and Cursor.

## Button

| Property      | small    | middle   | large    |
| ------------- | -------- | -------- | -------- |
| height        | 32px     | **45px** | 48px     |
| padding       | `0 16px` | `0 20px` | `0 32px` |
| font-size     | 12px     | 14px     | 16px     |
| border-radius | 12px     | **50px** | 24px     |
| border-width  | 2px      | 2px      | 2px      |

**Exact values for the primary button (**only primary / danger-primary use the 3D thick shadow**):**

```css
color: #794f27;
background: #f8f8f0;
border-color: #f8f8f0;
font-weight: 600;
letter-spacing: 0.02em;
line-height: 1;
box-shadow: 0 5px 0 0 #bdaea0;

/* hover */
transform: translateY(-1px);
box-shadow: 0 6px 0 0 #bdaea0;

/* active */
transform: translateY(2px);
box-shadow: 0 1px 0 0 #bdaea0;

/* focus-visible */
outline: 2px solid #19c8b9;
outline-offset: 2px;

/* disabled */
opacity: 0.5;
```

**default / dashed / text / link buttons (soft elevation):**

```css
/* resting */
box-shadow: var(--animal-shadow-sm); /* 0 2px 4px 0 rgba(61,52,40,0.06) */

/* hover */
color: #19c8b9;
border-color: #19c8b9;
box-shadow: var(--animal-shadow-base); /* 0 3px 10px 0 rgba(61,52,40,0.10) */
transform: translateY(-1px);

/* active */
color: #11a89b;
border-color: #11a89b;
transform: translateY(0);
box-shadow: var(--animal-shadow-sm); /* falls back to the resting state */
```

> Never carry the primary `0 5px / 6px / 1px #bdaea0` stack over to default / dashed — the whole thing turns too heavy and too cartoonish.

**loading diagonal-stripe animation (exact values):**

```css
background: #0ec4b6;
border: 4px solid #4de2da;
color: #fff;
background-image: repeating-linear-gradient(-45deg, #0ec4b6, #0ec4b6 10px, #01b0a7 10px, #01b0a7 20px);
background-size: 28.28px 28.28px;
animation: animal-btn-loading 1s linear infinite;

@keyframes animal-btn-loading {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: -28.28px 0;
    }
}
```

**danger primary button:**

```css
color: #fff;
box-shadow: 0 5px 0 0 #c94444; /* error-active */
```

## Icon

Monochrome SVG icon library, 10 built-in icons (arrow-down, arrow-up, check, close, copy, leaf, menu, search, star, trash and so on — the runtime `ICON_LIST` export is authoritative). Accepts `name` (looked up in `ICON_LIST`) and the undocumented `src` (any image source; Wallet uses it internally to load the coin-bag PNG).

```css
.icon {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor; /* color inherits the parent's color */
    width: 1em;
    height: 1em;
}
```

> Usage: `<Icon name="check" size={20} color="#19c8b9" />`. `size` defaults to 16, `color` defaults to `currentColor`. The `src` mode renders through `<img>` and covers any icon source outside the built-in library.

## Typewriter

```tsx
<Typewriter speed={90} trigger={openCount} autoPlay onDone={() => ...}>
  <p>Line one <strong>bold</strong></p>
  <p>Line two</p>
</Typewriter>
```

Props:

| name       | type          | default | Description                                                            |
| ---------- | ------------- | ------- | ---------------------------------------------------------------------- |
| `children` | `ReactNode`   | —       | Content to type out character by character; **the original element structure / line breaks / styles are preserved** |
| `speed`    | `number (ms)` | `90`    | Interval between characters                                             |
| `trigger`  | `unknown`     | —       | Any value change replays the animation (typically a modal open counter or an incrementing key) |
| `autoPlay` | `boolean`     | `true`  | `false` renders the full content immediately                            |
| `onDone`   | `() => void`  | —       | Fired when playback completes                                           |

**Implementation notes:**

- `countText(node)`: recursively counts the plain-text length of a ReactNode
- `renderTruncated(node, state)`: recursively truncates by remaining character count; `React.cloneElement` preserves the original nodes and their styles
- `useEffect` depends on `[total, speed, trigger, autoPlay]`, with an internal `setInterval` stepping `count` upward
- **No stylesheet**, and no extra DOM wrapper (returns `<>...</>`), so layout is completely unaffected

## Cursor

```tsx
<Cursor>
    <App /> {/* every element inside this subtree switches to the game finger cursor */}
</Cursor>
```

The stylesheet is **plain CSS** (not a CSS module):

```css
.animal-cursor,
.animal-cursor * {
    cursor:
        url('./cursor-icon.png') 4 0,
        auto !important;
}
```

- `cursor-icon.png` hotspot coordinates are `(4, 0)`
- `!important` overrides the default cursor; `className` is applied directly to the root `<div>`, and the class name is fixed as `animal-cursor`
