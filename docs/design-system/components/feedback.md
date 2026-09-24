# Feedback — pixel spec

Exact values for the components that report progress or pending state: Progress, Skeleton and BackTop.

## Progress (scene or solid fill on dotted track)

Source: `src/components/Progress/Progress.tsx` (controlled rendering + aria wiring) + `types.ts` (type definitions) + `progress.module.less`.
**A JSX component** (not imperative): `percent` is passed in controlled and animates smoothly from 0 to the target value. The track is a cream dotted pill with an inner shadow; when a `variant` is passed the fill is a scene image (`sweet-corner.svg`, `forest-grove.svg`, …) injected inline at `background-size` equal to the full track width so the scene spans the whole bar, while omitting `variant` falls back to a solid teal fill (`#19c8b9`). The label always sits right of the bar.

**props**:
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=14px / middle=24px / large=32px
    showInfo?: boolean;         // default true; label sits right of the bar
    variant?: ProgressVariant;  // scene image for the fill; omit to use solid #19c8b9
    infoFormat?: (p: number) => ReactNode; // default `${p}%`
    duration?: number;          // seconds; 0 disables the fill width animation; default 0.6
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
    background:
        radial-gradient(circle, rgba(196, 184, 158, 0.15) 1.5px, transparent 1.5px) 0 0 / 28px 28px,
        radial-gradient(circle, rgba(196, 184, 158, 0.1) 1px, transparent 1px) 7px 7px / 14px 14px,
        #f8f8f0;               /* cream dots (same as Background default / Card pattern-default) */
    box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.08); /* inner recess (very subtle) */
    border-radius: 999px;      /* pill */
    overflow: hidden;
}
.track.size-small  { height: 14px; }
.track.size-middle { height: 24px; }
.track.size-large  { height: 32px; }
```

**Fill (exact values):**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    /* scene image injected inline by Progress.tsx:
       background-image: url(<variant svg>);
       background-repeat: no-repeat;
       background-position: left top;
       background-size: <trackWidth>px auto;  (image spans the full track, clipped left by progress) */
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex; align-items: center; justify-content: flex-end; padding-right: 4px;
}
```

**Info text (right of the bar):**
```css
.row {
    display: flex; align-items: center; gap: 12px; width: 100%; flex: 1 1 auto; min-width: 0;
}
.info {
    font-weight: 700; color: #725d42; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.02em;
}
.info.right { min-width: 44px; text-align: right; }
```

**Key interaction details:**
- `duration=0` → the fill width transition is disabled (`transition: none`) and jumps instantly.
- a11y: the root div carries `role="progressbar"` plus `aria-valuemin=0` / `aria-valuemax=100` / `aria-valuenow=<rounded percent>` / `aria-valuetext=<string result of infoFormat>`.
- Under `prefers-reduced-motion: reduce`, the fill width transition is switched off automatically.

## Loading (fullscreen falling snow)

Source: `src/components/Loading/Loading.tsx` + `types.ts` + `loading.module.less`.
A fullscreen night-sky snowfall: 50 white round flakes (1–6px, randomly sized and positioned) fall from above the viewport while rotating, each with its own 6–12s linear duration and a negative delay so the screen is instantly filled. When `active` turns false the whole screen fades out over `fadeDuration` seconds, then unmounts.

**props**:
```ts
interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;       // true/false toggles the screen; default true; false → fade out then unmount
    tip?: React.ReactNode;  // centred caption over the snowfall; falls back to a visually-hidden 加载中
    delay?: number;         // ms before the screen appears; default 0; re-arms on every active→true transition
    fadeDuration?: number;  // fade-out duration in seconds; default 0.6
    zIndex?: number;        // default 3000 (above Notification's 2000)
}
```

**Screen (exact values):**
```css
.loading {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #0b101a;               /* night-sky base */
    opacity: 1;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    animation: animal-loading-fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.loading.exiting {                    /* fade-out state */
    opacity: 0;
    pointer-events: none;
    /* inline transition-duration: <fadeDuration>s set from the prop */
}
```

**Snowfall (50 flakes):**
```css
.snow {                                /* aria-hidden wrapper */
    position: absolute;
    inset: 0;
}
.flake {
    position: absolute;
    top: -30px;                        /* starts above the viewport */
    background: #fff;
    border-radius: 50%;
    animation: animal-loading-snow 10s linear infinite;
    /* per-flake inline style (generated once per mount via useMemo):
       width/height: Math.random() * 5 + 1 px        (1–6px)
       left: Math.random() * 100 %
       animationDuration: Math.random() * 6 + 6 s    (6–12s, overrides the 10s above)
       animationDelay: -(Math.random() * duration) s (negative → starts mid-cycle,
                                                       so the first frame is already full of snow) */
}

@keyframes animal-loading-snow {
    0%   { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(calc(100vh + 60px)) rotate(360deg); }
}
```

**Vignette / tip:**
```css
.vignette {
    background: radial-gradient(ellipse at center, transparent 55%, rgba(5,10,20,0.6) 100%);
}
.tip {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center; padding: 0 24px;
    color: #f8f8f0; font-weight: 800; font-size: 18px;
    letter-spacing: 0.04em; line-height: 1.5; text-align: center;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}
```

**Key interaction details:**
- **Exit sequence**: `active` → false keeps the screen mounted with the `exiting` class (opacity → 0, `pointer-events: none`), and unmounts after a `fadeDuration * 1000` ms timer. Restoring `active` mid-fade cancels the timer and snaps back to fully opaque instantly.
- `delay` re-arms on every `active` → `true` transition, so a fast load never flashes the screen.
- a11y: the root carries `role="status"`; the snowfall wrapper and the vignette are `aria-hidden`; without `tip` a visually-hidden `加载中` span provides the accessible content.
- `prefers-reduced-motion: reduce` stops the falling animation and the enter animation; the opacity fade is kept since it is not motion.

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

## BackTop (arrow scroll-to-top)

Source: `src/components/BackTop/BackTop.tsx` + `back-top.module.less`.

A fixed bottom-right back-to-top button, using an original sticker-style up-arrow SVG (inlined data URI: warm-brown `#c9a06c` outline + cream `#fffdf4` frosting layer + teal `#19c8b9` body with a light-teal `#7fe0d4` highlight); clicking it scrolls smoothly to the top with easeInOutQuad.

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

// icon (240×240 viewBox sticker arrow)
.img {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 4px 10px rgba(91,78,30,0.22));
    transition: filter 0.3s cubic-bezier(0.4,0,0.2,1);
}
.backtop:hover .img { filter: drop-shadow(0 4px 14px rgba(91,78,30,0.32)); }

// hover (container)
transform: scale(1.08);
// active (press)
transform: translateY(2px) scale(0.96);

// focus-visible
outline: 2px solid #ffcc00;
outline-offset: 4px;
border-radius: 16px;
```

**Key interaction details:**
- Listens to `window.scroll` by default and appears once scrolled past `visibilityHeight`.
- The `target` prop accepts a function returning a custom scroll container.
- The scroll animation uses `requestAnimationFrame` with easeInOutQuad easing.
- Enter/Space on the keyboard triggers the scroll.

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

## Time (live clock card)

Source: `src/components/Time/Time.tsx` + `time.module.less`.

A zero-config live clock card: a large `HH:MM` readout on top refreshed from `new Date()` every second, and a date capsule below showing the weekday and `Mon DD`. All native `div` attributes (`className`, `style`, `aria-*`…) pass through to the root.

```ts
type TimeProps = React.HTMLAttributes<HTMLDivElement>;
```

The card is a vertically stacked inline-flex panel — background `var(--animal-bg-color)`, 20px radius, `--animal-shadow-sm` elevation, no border — fading in over `--animal-motion-duration-slow` on mount. The clock is 40px / 800 weight / `var(--animal-text-color)` with tabular numerals and 1px letter-spacing; the colon blinks every second (`step-end`, opacity 0 at 50%). The date capsule is a 999px-radius pill on `var(--animal-primary-color-bg)` holding the uppercase weekday in `var(--animal-primary-color)` (800 weight, 1px letter-spacing), a `·` separator in the disabled tone, and the month-day in `var(--animal-text-color-secondary)` (700 weight). The root uses `role="timer"` with `aria-live="off"` so the per-second refresh never interrupts screen readers.
