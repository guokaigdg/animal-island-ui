# Feedback components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Progress

Horizontal bar whose fill defaults to a **solid teal** (`#19c8b9`); when a `variant` is passed it becomes a **scene image** (`sweet-corner.svg`, `forest-grove.svg`, …) injected inline at `background-size` equal to the full track width, so the scene spans the whole bar; the fill is clipped from the left by progress width ("unveils from the left"). The track is a **cream dotted** pill (`#f8f8f0` + two cream radial-dot layers, same as Background default / Card pattern-default) with a soft inner dent and no border. The percent label always sits **right of the bar**.

```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number; // REQUIRED, 0-100, clamped; non-integer rounded for aria
    size?: ProgressSize; // default 'middle' (small=14px, middle=24px, large=32px)
    showInfo?: boolean; // default true; label sits right of the bar
    variant?: ProgressVariant; // fill scene image; omit to use solid #19c8b9
    infoFormat?: (percent: number) => React.ReactNode; // default `${percent}%`
    duration?: number; // fill WIDTH transition in seconds; 0 disables; default 0.6
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Progress percent={50} size="large" />
<Progress percent={45} variant="forest-grove" />          {/* no variant = solid #19c8b9 fill */}
<Progress percent={50} infoFormat={(p) => `${Math.round(p / 10)} / 10`} />
<Progress percent={pct} duration={0} />                   {/* no fill-width animation */}
<Progress percent={66} showInfo={false} />
```

Notes:

- **Always provide `percent`.** Out-of-range values are clamped to `[0, 100]`. NaN is treated as `0`. The aria value is rounded.
- **Label position is fixed `right`** — it sits in a flex row after the track, right-aligned (`min-width: 44px`).
- **Fill scene image is fixed per `variant`** — there is no `status` / `strokeColor` / `leafAnimated` prop.
- **Fill width transition** animates on `percent` change (`duration` prop, default 0.6s, `0` disables) with `cubic-bezier(0.4, 0, 0.2, 1)`; disabled under `prefers-reduced-motion: reduce`.
- **Accessibility**: root has `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<rounded percent>`, and `aria-valuetext` set to the rendered text when it's a string.

## Loading

Fullscreen night-sky snowfall over a `#0b101a` base: 50 white round flakes (1–6px, randomly sized and positioned) fall from above the viewport while rotating, each with its own 6–12s linear duration and a negative delay so the screen is instantly filled. A centre vignette adds depth; the optional `tip` floats centred in cream white. When `active` turns false the whole screen fades out over `fadeDuration` seconds, then unmounts.

```ts
interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean; // true/false toggles the screen; default true; false → fade out then unmount
    tip?: React.ReactNode; // centred caption; falls back to a visually-hidden 加载中
    delay?: number; // ms before the screen appears; default 0; re-arms on every active→true transition
    fadeDuration?: number; // fade-out duration in seconds; default 0.6
    zIndex?: number; // default 3000 (above Notification's 2000)
}
```

```tsx
<Loading active={active} />
<Loading active={active} tip="正在连接岛屿…" />
<Loading active={active} delay={300} />
<Loading active={active} fadeDuration={1.2} zIndex={5000} />
```

Notes:

- **Exit sequence**: `active` → false keeps the screen mounted with an `exiting` class (opacity → 0, `pointer-events: none`); a `fadeDuration * 1000` ms timer then unmounts it. Restoring `active` mid-fade cancels the timer and snaps back to opaque instantly.
- **`delay` prevents flash**: the timer re-arms on every `active` → `true` transition, so a 600ms load with `delay={300}` barely flickers.
- **Flakes are generated once per mount** (`useMemo`): random size 1–6px, `left` 0–100%, duration 6–12s, and a *negative* delay that starts each flake mid-cycle so the first frame is already full of snow instead of waiting up to 10s.
- **A11y**: the root carries `role="status"`; the snowfall wrapper and vignette are `aria-hidden`; without `tip`, a visually-hidden `加载中` span provides the accessible content. `prefers-reduced-motion: reduce` stops the falling animation but keeps the opacity fade.

## Skeleton

Loading placeholder rendering gray/beige blocks with a shimmer animation. When `loading` is `false`, children are rendered directly.

```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // for 'paragraph', default 3
    width?: number | string;     // for 'text'/'circle'/'rect'
    rowWidths?: (number | string)[]; // for 'paragraph', per-line widths
    widthValue?: number | string;    // for 'circle'/'rect'
    heightValue?: number | string;   // for 'circle'/'rect'
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;  // rendered when loading=false
}

// Sub-components
interface SkeletonButtonProps { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonInputProps  { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonAvatarProps { size?: 'small' | 'middle' | 'large'; shape?: 'circle' | 'square'; active?: boolean; }
```

```tsx
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from 'animal-island-ui';

<Skeleton variant="text" width="80%" />
<Skeleton variant="circle" widthValue={44} />
<Skeleton variant="rect" widthValue={200} heightValue={120} />
<Skeleton variant="paragraph" rows={4} />
<SkeletonButton size="middle" />
<SkeletonInput size="large" />
<SkeletonAvatar size="small" shape="square" />
<Skeleton loading={fetching}><div>Content loaded</div></Skeleton>
```

Notes:

- **Shimmer**: a warm-ivory `linear-gradient(90deg, transparent, rgba(255,252,235,0.18), rgba(255,252,242,0.55), ...)` sweeps left-to-right over 1.6s.
- **Shapes**: `circle` is 50% rounded; `rect` uses 18px radius; `text` uses 12px radius (matching the "no sharp corners" rule).
- **All sub-components** (`SkeletonButton`, `SkeletonInput`, `SkeletonAvatar`) share the same `active` shimmer and light-beige background.
- **A11y**: the skeleton root is marked `aria-hidden` to hide it from screen readers when `loading=true`.

## BackTop

Floating back-to-top button that appears in the bottom-right corner after scrolling past a threshold. Default icon is an original sticker-style up-arrow SVG (inline data URI, 64px, with drop-shadow elevation); clicking smooth-scrolls to the top with an easeInOutQuad animation.

```ts
interface BackTopProps {
    target?: () => HTMLElement | Window; // default () => window
    visibilityHeight?: number;           // default 400 (px)
    duration?: number;                   // scroll animation ms, default 300
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<BackTop />                                    {/* arrow icon, 400px threshold */}
<div ref={ref} style={{ height: 300, overflow: 'auto' }}>
    <BackTop target={() => ref.current!} visibilityHeight={200} />
</div>
<BackTop duration={800} />
```

Notes:

- **Default target is `window`** — works out of the box for page-level scrolling. Pass `target` for a custom scroll container.
- **A11y**: `role="button"`, `tabIndex={0}`, `aria-label="返回顶部"`. Enter/Space trigger the scroll.

## Countdown

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date; // REQUIRED — absolute deadline
    format?: string; // default 'HH:mm:ss'; DD / HH / mm / ss tokens
    prefix?: React.ReactNode;
    size?: CountdownSize; // default 'middle'
    variant?: CountdownVariant; // default 'default'
    bordered?: boolean; // default false — draws the 1.5px digit-tile borders
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

```tsx
<Countdown value={Date.now() + 60_000} />
<Countdown value={deadline} format="DD 天 HH:mm:ss" prefix="活动结束还有" variant="island" />
```

The remaining time never drops below zero and `onFinish` fires once. Without a `DD` token, `HH` is total hours; with `DD`, hours are the 0–23 remainder. Each DD / HH / mm / ss token renders as its own 12px-radius digit tile; every digit inside is a vertical strip of two 0-9 cycles that always rolls downward to the current value with a 0.35s transition (odometer style — wrapping past 0 teleports to the next cycle and keeps rolling down, never reversing). Format literals such as `:` or `天` render as plain separators. The rolling strips are `aria-hidden`; a visually-hidden span carries the full formatted value. The root is `role="timer"` with `aria-live="off"`.

## Time

```ts
type TimeProps = React.HTMLAttributes<HTMLDivElement>;
```

```tsx
<Time />
<Time className="island-clock" aria-label="岛屿时间" />
```

Zero-config live clock card: a large `HH:MM` readout on top refreshed from `new Date()` every second, weekday + `Mon DD` in a date capsule below. Borderless panel on `var(--animal-bg-color)` with 20px radius and `--animal-shadow-sm` elevation, fading in on mount; clock 44px 900 tabular in `var(--animal-text-color)` with a blinking colon; the capsule is a 999px pill on `var(--animal-primary-color-bg)` with an uppercase `var(--animal-primary-color)` weekday. The root is `role="timer"` with `aria-live="off"` so the per-second refresh stays silent to screen readers.
