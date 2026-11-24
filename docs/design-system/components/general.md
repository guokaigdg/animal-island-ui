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

<Cursor type="raindrop">
    <App /> {/* raindrop cursor instead */}
</Cursor>
```

The stylesheet is **plain CSS** (`cursor.css`, not a CSS module) with two style variants selected by the `type` prop and two modes selected by the `forceAll` prop (default `true`); the root `<div>` carries `animal-cursor` plus a mode class (`animal-cursor--raindrop` is appended for the drop):

- `'default'` — bold-outline rounded arrow, 32×32 inline SVG, hotspot `8 5`
- `'raindrop'` — blue water drop, 32×32 inline SVG with a lighter highlight ellipse, hotspot `16 6`

**Arrow construction.** The arrow keeps the classic seven-vertex pointer silhouette (`M6 4 L6 21 L10.5 16.5 L13.5 23 L16.8 21.5 L13.8 15.2 L20.5 15.2 Z`) but **every corner is rounded and the stroke is very heavy** — that pairing is the whole style. A thick outline wrapped around a small bright core reads as a chunky, sticker-like pointer at any size, where a thin outline reads as a line drawing. The silhouette is scaled `1.12` so the shape plus its stroke fills roughly 75% of the 32×32 canvas height: an earlier 28×28 version left too much dead space, which forced the stroke so thick that the bright core vanished entirely. Stroke weight is therefore expressed as a **ratio of shape width (~15%)**, not a fixed pixel value, and has to be recomputed whenever the scale changes.

**Changing the scale factor is not a proportional edit.** The factor is applied to the seven base vertices only; the `1.8` left-edge tilt and the `1.2` hand-placed offset on `④` are applied *after* scaling and therefore stay fixed. At `1.36` that left the axis at `61.62°` and the edges at `23.19` / `7.87`; at `1.12` it moves the axis to `61.14°` and the edges to `19.12` / `6.35`. **Re-measure every number below after any scale change — never scale them by hand.** The stroke stays at `2.75`, so shrinking the silhouette raises its share of the outer width from 13.1% to 15.4%. That is deliberate — a smaller cursor still needs an outline of comparable visual weight — but `1.12` is the practical floor: any lower and the bright core starts closing up.

Corners are rounded with uneven per-vertex radii (tip `3.1`, tail `2.8`, notches `1.2`), and each corner is a `Q` whose control point sits on the original vertex. The **edges stay straight**: each one is an explicit `L` from the previous corner's exit point to the next corner's entry point, so the path reads `L Q L Q …`. Emitting only the `Q` chain — letting each quadratic span corner-to-corner, as the first version did — also renders the edge, and the vertex control point then drags long edges into a shallow bow of roughly `1` unit, worst on the left edge. The tip is deliberately **blunt** — a sharp tip would fight the heavy stroke and stop reading as a cursor. Fill and stroke live on **one** closed path, so no split-path trick is needed. The left edge's lower vertex is nudged right by `1.8`, tilting that edge slightly for a bit of hand-placed dynamism.

**The arrow is a strict mirror.** Only four vertices are free — `①` `②` `③` `④` — and `⑤` `⑥` `⑦` are each the reflection of `④` `③` `②` across the line through the tip at `61.14°` from horizontal (`28.86°` from vertical). Two consequences fall out for free and must not be "fixed" by hand: `①→②` and `①→⑦` are both `19.12`, and `②→③` and `⑥→⑦` are both `6.35`. Editing a free vertex therefore *forces* its partner to move, and pushing a partner past the axis breaks the pairing — work through the mirror, never around it.

Two earlier attempts are worth recording because they look reasonable and are wrong. Shortening the arm by sliding the notch `⑥` right is self-defeating: it moves `⑥` off its mirror position and breaks `②→③ = ⑥→⑦`. And the symmetry axis is emphatically **not** the vertical — both long edges are ~19 units on a 32-wide canvas, so a true vertical mirror would put the left edge at negative x. A previous version also hand-tuned four vertices independently and drifted out of sync; every one of those offsets is now gone.

Left-right "symmetry" here is a peripheral-weight judgement, not centring: even with the arm pushed as far right as it will go the ink centroid still falls short of the canvas centre (`14.5` against `16` at the current scale), because a classic arrow is asymmetric by construction. Never tune this axis against the centroid; judge it at real 32px.

The drop is **left as plain geometric geometry** — a round-capped path plus a highlight ellipse. Softening it was tried and reverted: rounding a teardrop's apex just makes it read as a blob.

**Text selection.** The `default` variant also restyles selected text inside its subtree: `#e9c46a` background with `#2b2620` text. The text color is not optional — the design system's body color `#794f27` on that background is only **4.25:1**, which misses AA for body text, while `#2b2620` reaches **8.97:1**, past WCAG AAA.

The two variants are carried by custom properties (`--animal-selection-bg` / `--animal-selection-fg`) that the raindrop rule overwrites with the system colors `Highlight` / `HighlightText`. This is not cosmetic. A plain `.animal-cursor:not(.animal-cursor--raindrop) ::selection` looks equivalent but breaks twice over, because a Cursor is very often nested inside another one (the demo wraps its whole page in a `default` Cursor):

- a descendant combinator matches a raindrop nested in a default at **any depth**, so the drop gets painted `#2b2620`
- a top-level raindrop matches **nothing at all**, and silently loses any selection styling

Custom properties resolve against the *nearest* declaring ancestor, so the innermost Cursor always wins with no `!important` and no `:not()` gymnastics.

**The images live in CSS custom properties** so all the variant and mode rules share them; editing the artwork means editing one declaration per variant, not touching four rules:

```css
/* artwork + hotspot declared once, inherited down by every descendant */
.animal-cursor {
    --animal-cursor-img: url("data:image/svg+xml,…bold-outline arrow…");
    --animal-cursor-hotspot: 8 5;
}
.animal-cursor--raindrop {
    --animal-cursor-img: url("data:image/svg+xml,…water drop…");
    --animal-cursor-hotspot: 16 6;
}
/* force mode (default, forceAll={true}): every descendant gets the custom cursor.
   Custom properties inherit, so descendants resolve the right variant automatically. */
.animal-cursor--force,
.animal-cursor--force * {
    cursor: var(--animal-cursor-img) var(--animal-cursor-hotspot), default !important;
}

/* scoped mode (forceAll={false}): only the container shows the custom cursor …
   (double-class selector so a scoped Cursor nested inside a force Cursor still wins) */
.animal-cursor.animal-cursor--scoped {
    cursor: var(--animal-cursor-img) var(--animal-cursor-hotspot), default !important;
}

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

- The artwork is inline SVG only — there is no `cursor-icon.png` and no base64 fallback; both variants are defined once in `cursor.css` and reach every rule through `--animal-cursor-img`
- `!important` on every rule so the mode semantics survive component-level cursor styles; `className` is applied to the root `<div>` alongside the fixed `animal-cursor` class

## Scrollbar

```tsx
<Scrollbar height={200} showTrack>
  {items.map((item) => (
    <div key={item}>{item}</div>
  ))}
</Scrollbar>
```

Props:

| name         | type                                   | default      | Description                                                                                  |
| ------------ | -------------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `height`     | `number \| string`                     | —            | Container height; numbers are read as px. The common case for a vertical scroll               |
| `maxHeight`  | `number \| string`                     | —            | Maximum container height                                                                      |
| `width`      | `number \| string`                     | —            | Container width; numbers are read as px. The common case for a horizontal scroll              |
| `maxWidth`   | `number \| string`                     | —            | Maximum container width                                                                       |
| `direction`  | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Which axis scrolls; the other one is clipped away instead of being left as a second scrollbar  |
| `thumbColor` | `string`                               | —            | Thumb colour; pass a CSS variable to follow the theme                                         |
| `thumbSize`  | `number`                               | `8`          | Thumb thickness in px; default 8, slimmer than the OS classic scrollbar                       |
| `showTrack`  | `boolean`                              | `false`      | Whether the track background is visible                                                        |
| `className`  | `string`                               | —            | Extra class name                                                                               |
| `style`      | `CSSProperties`                        | —            | Extra inline styles                                                                            |

**Implementation notes:**

- The scrollbar is **native**: the root keeps `overflow: auto` and the browser's own scrolling, so momentum, keyboard scrolling, touch gestures and the platform's scrollbar behaviour all survive. Only the track and the thumb are restyled — nothing is re-implemented in JavaScript.
- **Styling the scrollbar is what makes it permanent.** On macOS the unstyled system scrollbar is an *overlay*: it fades out when idle and reserves almost no width. A scrollbar carrying `::-webkit-scrollbar` styles — or `scrollbar-width: thin` — is rendered as a classic scrollbar instead: always visible, reserving real layout space. That is the sharpest difference against a plain `overflow: auto` box, and it is a side effect of the styling rather than behaviour the component implements. The default width is 8px — deliberately slimmer than the OS classic scrollbar (15–17px on Windows). CSS `thin` is only a keyword with no fixed pixel value, so the component picks its own number rather than claiming to match the platform.
- **Both ends are symmetric semicircles.** The thumb and track have no transparent borders: a one-sided border would make the padding-box corner radii differ from side to side when combined with `background-clip: padding-box`. The scrollbar gutter is exactly `thumbSize` wide, and a large `border-radius` (`50px`) resolves to half the 8px width, producing a true capsule with identical left and right curves. There is no extra inner or outer gap. Firefox uses the standard `thin` scrollbar and cannot reproduce this shape.
- Two rendering paths, and they must not overlap. Chromium / Safari read `::-webkit-scrollbar`, `::-webkit-scrollbar-track` and `::-webkit-scrollbar-thumb`; Firefox reads `scrollbar-width` + `scrollbar-color`. The standard properties sit inside `@supports not selector(::-webkit-scrollbar)` on purpose: **as soon as a rule sets `scrollbar-width` or `scrollbar-color`, Chrome 121+ ignores the `::-webkit-scrollbar` pseudo-elements** — the custom width, the radius and the thumb shape would all be lost and the browser's own thin scrollbar would be used instead. Scoping the standard properties to browsers that do not know the webkit pseudo-elements keeps both paths intact. `thumbSize` only reaches the WebKit path, because Firefox's width can only be `thin` / `auto` / `none`.
- The WebKit rule sets `display: block` explicitly. A widespread global reset — `*::-webkit-scrollbar { display: none }` — matches every scrollbar on the page, including this component's; the class selector outranks it, so the component's own scrollbar stays visible.
- A container with a `border-radius` clips the scrollbar with it: the thumb starts flush against the rounded corner, so the very top of the track is cut off. Give the scroll area a radius only if the surrounding design needs one, or inset the scrollbar with padding.
- `::-webkit-scrollbar-button` is hidden — a customised scrollbar otherwise keeps Chromium's default arrow buttons, which clash with the rounded island styling.
- The thumb is a `50px` pill in the secondary text colour (`#9f927d`) that darkens to the primary text colour (`#794f27`) on hover, over a `0.2s cubic-bezier(0.4, 0, 0.2, 1)` transition. The track is transparent unless `showTrack` turns it into the secondary background (`#f0e8d8`).
- `direction` clips the unused axis (`overflow-x: hidden` / `overflow-y: hidden`) rather than leaving a second scrollbar in place.
- The root carries `tabindex="0"`: a scrollable region has to be keyboard focusable, or arrow-key scrolling fails on browsers that do not make scrollers focusable on their own.
- `overscroll-behavior: contain` locks the wheel to this box: once the scroll reaches the top or bottom, it does not chain to the outer page the way the browser default does. While the pointer is inside the region the wheel belongs to the region — move the pointer out to scroll the page again. That is a deliberate default; pass `style={{ overscrollBehavior: 'auto' }}` to restore chaining.
- `ref` is forwarded to the root `<div>` (the scrolling container itself), so callers can call `scrollTo` or read/write `scrollTop` without an extra wrapper.
- Colours are exposed as the custom properties `--animal-scrollbar-thumb` / `--animal-scrollbar-thumb-hover` / `--animal-scrollbar-track`, so `thumbColor` only has to override the first one.
