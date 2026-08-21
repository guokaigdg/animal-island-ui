# Feedback components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Loading

```ts
interface LoadingProps {
    active?: boolean; // default true
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Loading />                  {/* full-bleed loading scene */}
<Loading active={isLoading} />
```

> Self-contained illustrated loading scene (no configurable content). When `active={false}`, the scene fades out via a CSS mask radius transition.
>
> **Not supported:** no `tip` / `text`, no `size`, no `spinning`, no `delay`, no `indicator`, no `children` (this is NOT a generic Spin-style wrapper — do not wrap content with it). Use it as a sibling overlay element controlled via `active`.

## Progress

Horizontal bar whose fill reuses the **Button loading** stripe: a teal `-45°` ribbon (`#0ec4b6` / `#01b0a7`) scrolling infinitely right-to-left. The track uses the page background (`#f8f8f0`, same as `--animal-bg`) with a light `#e8dcc8` border + soft inner dent. The percent label sits inside the fill (default, white), to the right, or on top.

```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressInfoPosition = 'inside' | 'right' | 'top';

interface ProgressProps {
    percent: number; // REQUIRED, 0-100, clamped; non-integer rounded for aria
    size?: ProgressSize; // default 'middle' (small=12px, middle=20px, large=28px)
    showInfo?: boolean; // default true
    infoPosition?: ProgressInfoPosition; // default 'inside'
    infoFormat?: (percent: number) => React.ReactNode; // default `${percent}%`
    duration?: number; // fill WIDTH transition in seconds; 0 disables; default 0.6 — does NOT affect stripe scroll
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Progress percent={50} size="large" />
<Progress percent={45} infoPosition="right" />          {/* or "inside" (default) / "top" */}
<Progress percent={50} infoFormat={(p) => `${Math.round(p / 10)} / 10`} />
<Progress percent={pct} duration={0} />                 {/* no fill-width animation */}
<Progress percent={66} showInfo={false} />
```

Notes:

- **Always provide `percent`.** Out-of-range values are clamped to `[0, 100]`. NaN is treated as `0`. The aria value is rounded.
- **Default `infoPosition="inside"`** — the label rides at the right edge of the fill. If `percent < 18`, the label is **automatically moved outside** the fill (track-end, dark text) to keep white text readable on the sandy track. This is the only "magic" behavior; everything else is purely declarative.
- **Fill color is fixed** (the same teal stripe as `Button` loading) — there is no `status` / `strokeColor` / `leafAnimated` prop.
- **Two independent animations**: fill **width** transitions on `percent` change (`duration` prop, default 0.6s, `0` disables) with `cubic-bezier(0.4, 0, 0.2, 1)`; stripe **background-position** scrolls from `0 0` to `-28.28px 0` over 1s linear (matches Button loading 1:1), disabled only under `prefers-reduced-motion: reduce`.
- **Accessibility**: root has `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<rounded percent>`, and `aria-valuetext` set to the rendered text when it's a string.

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

Floating back-to-top button that appears in the bottom-right corner after scrolling past a threshold. Default icon is a Island bag PNG (base64-embedded); clicking smooth-scrolls to the top with an easeInOutQuad animation.

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
<BackTop />                                    {/* Island bag icon, 400px threshold */}
<div ref={ref} style={{ height: 300, overflow: 'auto' }}>
    <BackTop target={() => ref.current!} visibilityHeight={200} />
</div>
<BackTop duration={800} />
```

Notes:

- **Default target is `window`** — works out of the box for page-level scrolling. Pass `target` for a custom scroll container.
- **Mobile responsive**: icon shrinks from 120px to 80px under 768px viewport.
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
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

```tsx
<Countdown value={Date.now() + 60_000} />
<Countdown value={deadline} format="DD 天 HH:mm:ss" prefix="活动结束还有" variant="island" />
```

The remaining time never drops below zero and `onFinish` fires once. Without a `DD` token, `HH` is total hours; with `DD`, hours are the 0–23 remainder. The root is `role="timer"` with `aria-live="off"`.
