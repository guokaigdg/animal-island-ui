# Feedback — pixel spec

Exact values for the components that report progress or pending state: Progress, Skeleton and BackTop.

## Progress (Button-loading teal stripes)

Source: `src/components/Progress/Progress.tsx` (controlled rendering + aria wiring) + `types.ts` (type definitions) + `progress.module.less`.
**A JSX component** (not imperative): `percent` is passed in controlled and animates smoothly from 0 to the target value. The track is a sand-coloured pill with an inner shadow; the fill reuses the Button loading `-45°` stripes verbatim (`#0ec4b6` / `#01b0a7`), scrolling right-to-left infinitely (1s linear) so it reads as the same "in progress" visual as Button.

**props**:
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressInfoPosition = 'inside' | 'right' | 'top';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=12px / middle=20px / large=28px
    showInfo?: boolean;         // default true
    infoPosition?: ProgressInfoPosition; // default 'inside'
    infoFormat?: (p: number) => ReactNode; // default `${p}%`
    duration?: number;          // seconds; 0 disables the fill width animation; default 0.6 (does not affect stripe scrolling)
    className?: string;
    style?: CSSProperties;
}
```

**Track (exact values):**
```css
.track {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    min-width: 80px;
    background: #f8f8f0;          /* main background colour (matches --animal-bg, blends into the page) */
    border: 2px solid #e8dcc8;     /* very light stroke, one step lighter than #c4b89e, softer overall */
    box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.08); /* inner recess (very subtle) */
    border-radius: 999px;         /* pill */
    overflow: hidden;
}
.track.size-small  { height: 12px; border-width: 1.5px; }
.track.size-middle { height: 20px; }
.track.size-large  { height: 28px; }
```

**Fill (exact values, 1:1 with Button loading):**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    background: #0ec4b6;
    background-image: repeating-linear-gradient(
        -45deg,
        #0ec4b6 0, #0ec4b6 10px,
        #01b0a7 10px, #01b0a7 20px
    );
    background-size: 28.28px 28.28px;  /* 10px * √2, same as Button loading */
    animation: animal-progress-stripe 1s linear infinite;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex; align-items: center; justify-content: flex-end; padding-right: 4px;
}
@keyframes animal-progress-stripe {
    0%   { background-position: 0 0; }
    100% { background-position: -28.28px 0; }
}
```

**Info text:**
```css
.infoInside {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    color: #fff; font-weight: 800; font-size: 11px;  /* small 9px / large 13px */
    letter-spacing: 0.02em; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    pointer-events: none; white-space: nowrap; z-index: 1;
}
.info.right { min-width: 44px; text-align: right; color: #725d42; font-weight: 700; }
.info.top   { align-self: flex-end; color: #725d42; font-weight: 700; }
```

**Key interaction details:**
- With `infoPosition="inside"` and `percent < 18%`, the label automatically moves out of the fill (white) to the end of the track (dark `#725d42`), so white text never lands on the sand-coloured track. This is the only "magic" behaviour; everything else is declarative.
- `duration=0` → the fill width transition is disabled (`transition: none`) and jumps instantly; **stripe scrolling is unaffected**.
- Stripe scrolling honours `prefers-reduced-motion: reduce`: with the preference set, `animation: none`, and the fill width transition is also set to none.
- The legacy `status` / `strokeColor` / `leafAnimated` props are fully removed: the fill colour is fixed to the same teal stripes as Button loading, so the library keeps exactly one "in progress" visual and never clashes with status colours.
- a11y: the root div carries `role="progressbar"` plus `aria-valuemin=0` / `aria-valuemax=100` / `aria-valuenow=<rounded percent>` / `aria-valuetext=<string result of infoFormat>`.
- Under `prefers-reduced-motion: reduce`, all animations are switched off automatically.

## Skeleton (shimmer placeholder)

Source: `src/components/Skeleton/Skeleton.tsx` + `skeleton.module.less`.

Skeleton loading placeholder. Four variants: `text` / `circle` / `rect` / `paragraph`. When `loading=false` it renders `children` directly.

**props**:
```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // paragraph row count, default 3
    width?: number | string;     // text/circle/rect width
    rowWidths?: (number | string)[]; // paragraph per-row width array
    widthValue?: number | string;    // circle/rect width
    heightValue?: number | string;   // circle/rect height
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

// sub-components
SkeletonButtonProps { size?: 'small'|'middle'|'large'; active?: boolean; }
SkeletonInputProps  { size?: 'small'|'middle'|'large'; active?: boolean; }
SkeletonAvatarProps { size?: 'small'|'middle'|'large'; shape?: 'circle'|'square'; active?: boolean; }
```

**Exact styles**:
```less
// base colours
@bg-base: #eae5db;      // light beige grey
@bg-line: #dfd9ce;      // row colour, slightly darker

// shimmer (warm white)
@shimmer-light: rgba(255, 252, 242, 0.55);
@shimmer-mid: rgba(255, 250, 235, 0.18);

// shared
.skeleton {
    background: @bg-base;
    border-radius: 12px;            // minimum radius
    overflow: hidden;
    position: relative;
}

// shimmer animation
.active::after {
    background: linear-gradient(90deg, transparent, @shimmer-mid, @shimmer-light, @shimmer-mid, transparent);
    animation: animal-skeleton-shimmer 1.6s ease-in-out infinite;
}

// per-variant radius
.vt-text   { border-radius: 12px; height: 16px; }
.vt-circle { border-radius: 50%; }
.vt-rect   { border-radius: 18px; }
.vt-paragraph { background: none; }
.line      { border-radius: 12px; background: @bg-line; }

// sub-components
.skeleton-btn   { border-radius: 50px; }             // pill
.skeleton-input { border-radius: 50px; }             // pill
.skeleton-avatar { border-radius: 50%; }             // shape="circle" (default); shape="square" → 12px, set inline by the shape prop
```

**Key interaction details:**
- The shimmer is a warm-white gradient sweeping left to right over 1.6s.
- Every radius is ≥12px, satisfying the "no sharp corners" rule.
- In paragraph mode the last row defaults to 60% width (overridable via `rowWidths`).
- `aria-hidden` keeps it out of screen readers.

## BackTop (Island bag scroll-to-top)

Source: `src/components/BackTop/BackTop.tsx` + `back-top.module.less`.

A fixed bottom-right back-to-top button, using the Island bag PNG (inlined as base64) by default; clicking it scrolls smoothly to the top with easeInOutQuad.

**props**:
```ts
interface BackTopProps {
    target?: () => HTMLElement | Window; // default () => window
    visibilityHeight?: number;           // default 400
    duration?: number;                   // animation duration in ms, default 300
    onClick?: (e: MouseEvent) => void;
    className?: string;
    style?: CSSProperties;
}
```

**Exact styles**:
```less
// container
position: fixed;
bottom: 48px;
right: 32px;
z-index: 1000;
cursor: pointer;
opacity: 0;
visibility: hidden;
transition: opacity 0.3s, transform 0.3s, visibility 0.3s cubic-bezier(0.4,0,0.2,1);

// visible state
opacity: 1;
visibility: visible;
transform: translateY(0);

// icon
width: 120px;           // desktop
height: 120px;
object-fit: contain;    // preserve the original 158×136 ratio without stretching
filter: drop-shadow(0 4px 10px rgba(91,78,30,0.22));

// hover
transform: scale(1.08);
filter: drop-shadow(0 4px 14px rgba(91,78,30,0.32));

// focus-visible
outline: 2px solid #ffcc00;
outline-offset: 4px;
border-radius: 50%;

// mobile @media (max-width: 768px)
bottom: 24px;
right: 16px;
icon 80×80px;
```

**Key interaction details:**
- Listens to `window.scroll` by default and appears once scrolled past `visibilityHeight`.
- The `target` prop accepts a function returning a custom scroll container.
- The scroll animation uses `requestAnimationFrame` with easeInOutQuad easing.
- Enter/Space on the keyboard triggers the scroll.
- The icon is a 158×136px PNG, scaled proportionally inside the 120×120px container via `object-fit: contain`.

## Countdown (deadline timer)

Source: `src/components/Countdown/Countdown.tsx` + `countdown.module.less`.

The component calculates the non-negative distance between `value` (`number | Date`) and `Date.now()`, refreshing every 250ms so the displayed, ceiling-rounded second changes on time. `onFinish` fires once when the value reaches zero.

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date;
    format?: string; // default 'HH:mm:ss'; tokens DD / HH / mm / ss
    prefix?: ReactNode;
    size?: CountdownSize; // default 'middle'
    variant?: CountdownVariant; // default 'default'
    bordered?: boolean; // default false — draws the 1.5px digit-tile borders
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

The default variant is a white 20px-radius panel with a warm border and soft elevation. `island` uses the parchment background `rgb(247,243,223)` with a 2px dashed `#d4c4a8` border. Each DD / HH / mm / ss token renders as its own 12px-radius digit tile (a cream gradient face `linear-gradient(180deg, #fff, #f8f8f0)`; a `#fffdf4→#f8f8f0` gradient on the island variant; the 1.5px `#d4c9b4` border is opt-in via `bordered`, off by default) while format literals such as `:` or `天` render as plain separators. Colons are sized with the digits, 900 weight, `#8b7355`. Inside each tile every digit is a vertical strip of two 0-9 cycles; all changes roll downward with a 0.35s `cubic-bezier(0.4, 0, 0.2, 1)` transition (odometer style). When a digit wraps past 0, the strip instantly teleports to the same digit in the next cycle and keeps rolling down, so the direction never reverses. Digits use the earth-tone `#8b7355`, 900 weight, tabular, sized 20/26/34px. The rolling strips are `aria-hidden` and a visually-hidden span carries the full formatted value; the root uses `role="timer"` and `aria-live="off"` so screen readers are not interrupted four times per second.
