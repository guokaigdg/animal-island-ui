# General components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Button

```ts
type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
type ButtonSize = 'small' | 'middle' | 'large';
type ButtonHTMLType = 'submit' | 'reset' | 'button';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    type?: ButtonType; // default 'default'
    size?: ButtonSize; // default 'middle'
    danger?: boolean; // default false
    ghost?: boolean; // default false
    block?: boolean; // default false
    loading?: boolean; // default false — renders diagonal-stripe animation
    disabled?: boolean; // default false
    icon?: React.ReactNode;
    htmlType?: ButtonHTMLType; // default 'button'
    children?: React.ReactNode;
}
```

```tsx
<Button type="primary" onClick={save}>Save</Button>
<Button type="primary" danger loading>Deleting…</Button>
<Button type="dashed" icon={<PlusIcon />} size="large" block>Add</Button>
<Button type="text">Cancel</Button>
```

## Typewriter

```ts
interface TypewriterProps {
    children?: React.ReactNode; // ANY ReactNode — preserves element structure, classNames, inline styles
    speed?: number; // ms per char, default 90
    trigger?: unknown; // change this value to restart animation (e.g. modal openCount)
    autoPlay?: boolean; // default true (false = show full immediately)
    onDone?: () => void;
}
```

```tsx
<Typewriter speed={60} onDone={() => setStep(2)}>
  <p>Hello, <strong>traveler</strong>.</p>
  <p>Welcome to the island.</p>
</Typewriter>

// Restart on modal open:
<Typewriter trigger={openCount}>{dialogueText}</Typewriter>
```

Renders NO wrapper element; zero layout impact. Recursively truncates the ReactNode by char count while preserving tree structure.

## Cursor

```ts
interface CursorProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    type?: 'default' | 'raindrop'; // default 'default' — bold-outline rounded arrow / blue raindrop
    forceAll?: boolean; // default true — force the custom cursor on every descendant
}
```

Wrap the region where you want a game finger cursor:

```tsx
<Cursor>
    <App />
</Cursor>

{/* or a blue raindrop cursor */}
<Cursor type="raindrop">
    <App />
</Cursor>
```

**Text selection.** `default` also restyles selected text in its subtree to `#e9c46a` on `#2b2620`. The dark text is required, not stylistic: the body color `#794f27` on that background is 4.25:1 and misses AA for body text. Carry the two variants as custom properties (`--animal-selection-bg` / `--animal-selection-fg`) that raindrop overwrites with `Highlight` / `HighlightText` — **never** as `.animal-cursor:not(.animal-cursor--raindrop) ::selection`, which paints a raindrop nested inside a default (descendant combinators match at any depth) and leaves a top-level raindrop with no selection styling at all. Custom properties resolve against the nearest declaring ancestor, so nesting always resolves correctly.

The arrow is a **bold-outline rounded pointer**: the classic seven-vertex silhouette scaled `1.12` into a 32×32 canvas, every corner rounded (tip `3.1`, tail `2.8`, notches `1.2`), and filled and stroked by one closed path with a stroke ~15% of the shape width. The heavy outline around a small bright core *is* the style — keep it. The path must read `L Q L Q …`: straight `L` edges between corners, one `Q` per corner. A pure `Q` chain that spans corner-to-corner also renders each edge, and the vertex control points bow the long ones by ~1 unit. The tip is deliberately blunt so it still reads against the heavy stroke, and the left edge is tilted slightly for a hand-placed feel. **The arrow is a strict mirror.** Only vertices `①``②``③``④` are free; `⑤``⑥``⑦` are each the reflection of `④``③``②` across the line through the tip at `61.14°` from horizontal (`28.86°` from vertical). So `①→②` and `①→⑦` are both `19.12` and `②→③` and `⑥→⑦` are both `6.35` — never fix either by hand. Editing a free vertex forces its partner to move; pushing a partner past the axis breaks the pairing. Two dead ends: shortening the arm by sliding notch `⑥` right (it leaves the mirror position), and any symmetry about the *vertical* — both long edges are ~19 units on a 32-wide canvas, so a vertical mirror would put the left edge at negative x. Do not tune this axis against the ink centroid: a classic arrow is asymmetric by construction, so even a maximally extended arm leaves the ink centroid short of the canvas centre (`14.5` against `16` at the current scale). Judge left-right balance by eye at real 32px. When editing `cursor.css`, express stroke weight as a ratio of shape width, not a fixed pixel value, and recompute it if the scale changes — a too-thin stroke reads as a line drawing, a too-thick one swallows the bright core. **Changing that scale factor is not a proportional edit**: it applies to the seven base vertices only, while the `1.8` left-edge tilt and the `1.2` offset on `④` are added *after* scaling and stay put — so `1.36 → 1.12` moved the axis from `61.62°`/`28.38°` to `61.14°`/`28.86°` and the edges from `23.19`/`7.87` to `19.12`/`6.35`. **Re-measure, never scale those numbers by hand.** The stroke stays `2.75`, lifting its share of the outer width from 13.1% to 15.4% on purpose; `1.12` is the practical floor, since below it the bright core closes up. The **raindrop stays plain geometric art** (path + highlight ellipse). The artwork lives in the `--animal-cursor-img` / `--animal-cursor-hotspot` custom properties on `.animal-cursor`, so changing it means editing those two declarations, not the four mode rules.

With `forceAll` (default `true`) every descendant gets the custom cursor via `cursor: var(--animal-cursor-img) var(--animal-cursor-hotspot) !important` (hotspot `8 5` for the arrow, `16 6` for the raindrop); the custom properties inherit, so descendants resolve the right variant on their own. Set `forceAll={false}` for scoped mode: only the container shows the custom cursor while links/buttons keep `pointer`, text inputs keep `text`, and disabled elements keep `not-allowed`. Do NOT nest multiple `<Cursor>`. `style` is for layout only — do not try to override the cursor URL via inline style.

## Scrollbar

```ts
type ScrollbarDirection = 'vertical' | 'horizontal' | 'both';

interface ScrollbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    height?: number | string; // container height, numbers read as px
    maxHeight?: number | string;
    width?: number | string; // container width, numbers read as px
    maxWidth?: number | string;
    direction?: ScrollbarDirection; // default 'vertical'
    thumbColor?: string; // pass a CSS variable to follow the theme
    thumbSize?: number; // default 8 — px, slimmer than the OS classic scrollbar
    showTrack?: boolean; // default false
    children?: React.ReactNode;
}
```

```tsx
<Scrollbar height={200}>{items.map((i) => <div key={i}>{i}</div>)}</Scrollbar>
<Scrollbar direction="horizontal" width={420}>{items.map((i) => <span key={i}>{i}</span>)}</Scrollbar>
<Scrollbar height={160} showTrack thumbColor="var(--animal-primary-color)">{items}</Scrollbar>
```

**Native scrolling, restyled.** The root keeps `overflow: auto`, so momentum, keyboard scrolling and touch gestures stay the browser's — only the track and the thumb are re-skinned. `direction` clips the unused axis instead of leaving a second scrollbar behind. `thumbSize` reaches Chromium / Safari only; Firefox's width can only be `thin` / `auto` / `none`. The root is focusable (`tabindex="0"`), which is what keeps arrow-key scrolling working on browsers that do not focus scrollers by themselves. `overscroll-behavior: contain` locks the wheel to the box — reaching a boundary no longer chains the scroll to the outer page (restore with `style={{ overscrollBehavior: 'auto' }}`). `ref` is forwarded to the root scrolling `<div>`, so `scrollTo` / `scrollTop` are directly reachable. The thumb and track use no transparent borders; the gutter is exactly `thumbSize` wide, and `border-radius: 50px` produces symmetric semicircular ends. One-sided borders are deliberately avoided because their inner padding-box radii differ from side to side. Firefox cannot reproduce this shape.

**Styling the scrollbar makes it permanent.** On macOS the unstyled system scrollbar is an overlay — it fades out when idle and reserves almost no width. A scrollbar with `::-webkit-scrollbar` styles (or Firefox's `scrollbar-width`) is rendered as a classic scrollbar instead: always visible, reserving real layout space. Expect the styled box to be a few pixels narrower than a plain `overflow: auto` one.

**Two gotchas the component already handles.** A global reset of `*::-webkit-scrollbar { display: none }` matches every scrollbar on the page, so the component sets `display: block` on its own pseudo-element to stay visible. And `scrollbar-width` / `scrollbar-color` are scoped behind `@supports not selector(::-webkit-scrollbar)`, because Chrome 121+ ignores the webkit pseudo-elements as soon as those standard properties are set — which would silently drop `thumbSize` and the thumb shape.
