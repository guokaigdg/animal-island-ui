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

Vector icon component built on [lucide-react](https://lucide.dev/icons/). 13 built-in semantic names — `icon-left`, `icon-right`, `location`, `page`, `wifi`, `icon-shopping`, `icon-chat`, `icon-variant`, `icon-encyclopedia`, `icon-design`, `icon-map`, `icon-diy`, `icon-camera` (the runtime `ICON_LIST` export is authoritative). Three rendering modes:

- `name` — one of the built-in semantic names (maps to a lucide icon component)
- `icon` — any `lucide-react` icon component, e.g. `<Icon icon={Heart} />` (takes precedence over `name`)
- `src` — any image URL for colorful raster assets; renders a `<span>` with `background-image`

```css
.icon {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
}

/* optional hover bounce (`bounce` prop) */
.icon-bounce:hover {
    animation: iconBounce 0.3s ease-in-out forwards;
}
@keyframes iconBounce {
    0%   { transform: scale(1) rotate(0deg); }
    50%  { transform: scale(1.2) rotate(-5deg); }
    100% { transform: scale(1.1) rotate(-4deg); }
}
```

> Usage: `<Icon name="wifi" size={32} />` or `<Icon icon={Heart} size={32} />`. `size` defaults to `24` and is applied as inline `width`/`height` (number = px, string = any CSS length). Lucide icons are stroke-based SVGs: `color` sets the stroke color (defaults to `currentColor`), `strokeWidth` sets the stroke weight (defaults to `2`). Icons without an `aria-label` are marked `aria-hidden="true"` as decorative; passing `aria-label` also sets `role="img"` so the label becomes the accessible name.

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

The stylesheet is **plain CSS** (`cursor.css`, not a CSS module) with two modes selected by the `forceAll` prop (default `true`); the root `<div>` carries `animal-cursor` plus a mode class:

```css
/* force mode (default, forceAll={true}): every descendant gets the custom cursor */
.animal-cursor--force,
.animal-cursor--force * {
    cursor:
        url('../../assets/img/cursor/cursor-icon.png') 4 0,
        url(data:image/png;base64,…) 4 0, /* inlined base64 fallback of the same PNG */
        default !important;
}

/* scoped mode (forceAll={false}): only the container shows the custom cursor …
   (double-class selector so a scoped Cursor nested inside a force Cursor still wins) */
.animal-cursor.animal-cursor--scoped { cursor: url(…) 4 0, url(data:…) 4 0, default !important; }

/* … while descendants fall back to browser semantics */
.animal-cursor--scoped *,
.animal-cursor.animal-cursor--scoped * {
    cursor: auto !important;
}

/* interactive elements restore pointer */
.animal-cursor--scoped a[href],
.animal-cursor--scoped button,
.animal-cursor--scoped [role='button'],
.animal-cursor--scoped [role='link'],
.animal-cursor--scoped label[for],
.animal-cursor--scoped select,
.animal-cursor--scoped summary,
.animal-cursor--scoped input[type='button'],
.animal-cursor--scoped input[type='submit'],
.animal-cursor--scoped input[type='reset'],
.animal-cursor--scoped input[type='checkbox'],
.animal-cursor--scoped input[type='radio'],
.animal-cursor--scoped [data-cursor='pointer'] {
    cursor: pointer !important;
}

/* text inputs keep the text cursor */
.animal-cursor--scoped input[type='text'],
.animal-cursor--scoped input[type='search'],
.animal-cursor--scoped input[type='email'],
.animal-cursor--scoped input[type='password'],
.animal-cursor--scoped input[type='number'],
.animal-cursor--scoped input[type='tel'],
.animal-cursor--scoped input[type='url'],
.animal-cursor--scoped textarea {
    cursor: text !important;
}

/* disabled state wins */
.animal-cursor--scoped [disabled],
.animal-cursor--scoped [aria-disabled='true'] {
    cursor: not-allowed !important;
}
```

- `cursor-icon.png` hotspot coordinates are `(4, 0)`; the base64 data URI is a same-image fallback
- `!important` on every rule so the mode semantics survive component-level cursor styles; `className` is applied to the root `<div>` alongside the fixed `animal-cursor` class
