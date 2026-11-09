# Feedback components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Progress

Horizontal bar whose fill defaults to a **mint vertical gradient** (`#3dd4c6 → #19c8b9 → #14b6a8`, top-lit, plus a `rgba(255,255,255,0.45)` inner highlight); when a `variant` is passed it becomes a **scene image** (`sweet-corner.svg`, `forest-grove.svg`, …) injected inline at `background-size` equal to the full track width, so the scene spans the whole bar; the fill is clipped from the left by progress width ("unveils from the left"). The track is a **cream pill** (`#f8f8f0`) carrying the old wallpaper track's fine dot texture — 1.5px-radius dots on a 14px grid, `rgba(196,184,158,0.1)`, base unchanged — inside a solid 2px sand outline (`#e2d6bd`); `box-sizing: border-box` means `size` is the total height including the border, so the dot radius is 1.5px rather than the pre-outline 1px to stay legible in the 4px the border takes. At `percent=100` the gradient fill brightens to `#7fe0d5 → #3dd4c6` so a full bar reads as finished, not loading. The percent label always sits **right of the bar**.

```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number; // REQUIRED, 0-100, clamped; non-integer rounded for aria
    size?: ProgressSize; // default 'middle' (small=14px, middle=24px, large=32px)
    showInfo?: boolean; // default true; label sits right of the bar
    variant?: ProgressVariant; // fill scene image; omit to use the mint gradient
    color?: string;
    wave?: boolean;
    animated?: boolean;
    infoFormat?: (percent: number) => React.ReactNode; // default `${percent}%`
    duration?: number; // fill WIDTH transition in seconds; 0 disables; default 0.6
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Progress percent={50} size="large" />
<Progress percent={45} variant="forest-grove" />          {/* no variant = mint gradient fill */}
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

`color` accepts a CSS color or variable with a translucent top highlight and bottom shade; it retains the chosen hue at 100%. `variant` takes precedence over `color`; omitting both preserves the original mint gradient. `wave` defaults to `false` and adds two white wave layers inside the fill, composable with colors and scenes. `animated` defaults to `true`; false or 0% / 100% keeps the waves static. Loops pause offscreen or when hidden and stop under reduced motion. `duration` controls width transitions only.

```tsx
<Progress percent={58} color="#82d5bb" wave />
<Progress percent={58} wave animated={false} />
```

## Loading

Two fullscreen variants over the same `#0b101a` night-sky base, chosen by `type`:

- `'snow'` (default) — 50 white round flakes (1–6px, randomly sized and positioned) fall from above the viewport while rotating, each with its own 6–12s linear duration and a negative delay so the screen is instantly filled. A centre vignette adds depth; the optional `tip` floats centred in cream white. When `active` turns false the whole screen fades out over `fadeDuration` seconds, then unmounts.
- `'circle'` — when `active` turns false the screen is erased by an expanding transparent circle from the centre instead of fading. A sailboat (naive-icons `sailboat`, MIT) rides a scrolling sea in the bottom-right corner: the hull bobs and rocks while the wave line scrolls sideways. `showBoat={false}` drops the boat and keeps just the masked backdrop.

```ts
type LoadingType = 'snow' | 'circle';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: LoadingType; // default 'snow'; 'circle' swaps the scene and the exit animation
    showBoat?: boolean; // default true; 'circle' only — false leaves just the masked backdrop
    active?: boolean; // true/false toggles the screen; default true; false → fade out then unmount
    tip?: React.ReactNode; // centred caption; falls back to a visually-hidden 加载中
    delay?: number; // ms before the screen appears; default 0; re-arms on every active→true transition
    fadeDuration?: number; // fade-out duration in seconds; default 0.6; for 'circle' it drives the circle expansion
    zIndex?: number; // default 3000 (above Notification's 2000)
}
```

```tsx
<Loading active={active} />
<Loading active={active} type="circle" tip="正在驶向岛屿…" />
<Loading active={active} type="circle" showBoat={false} />
<Loading active={active} delay={300} />
<Loading active={active} fadeDuration={1.2} zIndex={5000} />
```

Notes:

- **First frame**: `shown` starts from `active && delay === 0`, so the screen is in the first paint; the `circle` variant also drops the enter fade (`animation: none`) — a fullscreen mask fading in from transparent would show the content underneath for those 0.2s.
- **Exit sequence**: `active` → false keeps the screen mounted with an `exiting` class (opacity → 0, `pointer-events: none`); a `fadeDuration * 1000` ms timer then unmounts it. Restoring `active` mid-fade cancels the timer and snaps back to opaque instantly. For `'circle'` the class is `masking` instead: a registered `--animal-loading-mask-r` custom property transitions from 0 to `ceil(hypot(w, h) / 2) + 50` and a radial mask punches that hole out of the screen. The radius must be written *after* the class is applied so it always transitions from 0, and restoring `active` resets it to 0.
- **`delay` prevents flash**: the timer re-arms on every `active` → `true` transition, so a 600ms load with `delay={300}` barely flickers.
- **Flakes are generated once per mount** (`useMemo`): random size 1–6px, `left` 0–100%, duration 6–12s, and a *negative* delay that starts each flake mid-cycle so the first frame is already full of snow instead of waiting up to 10s.
- **Sailboat scene**: one SVG in the icon's own 48×48 viewBox, parked in the **bottom-right corner** (20px from the right, 30px from the bottom, 120px wide) just like the illustration in the original island Loading. The wave is shortened to the middle 3 wave periods (a 28.74 unit window centred on the canvas, narrower than the 32.56 unit hull) and its stroke thinned to 1.9 to keep it a line rather than a band; the window is a plain SVG clipPath — a hard cut, no fade. The wave group sits 1.2 units lower than the icon's own artwork so a gap opens between the hull and the water. The path is shifted by −4.85 so copy 0 starts at the canvas origin, then tiled every 38.3 (the wave's full period) into 4 copies; the scroll covers one window width per 4s and the distance is passed down as the inline `--animal-sailboat-wave-scroll` custom property so the LESS and the TypeScript constant cannot drift apart. The boat group is scaled to 0.8 about its hull bottom centre (24, 39.32) so the boat shrinks while the wave keeps its length, stroke and position. The boat bobs and rocks over 1s with `alternate` (GSAP's `yoyo`). Every instance gets its own `<defs>` id, so several Loading screens can coexist without the waves crossing over.
- **A11y**: the root carries `role="status"`; the snowfall wrapper, the vignette and the sailboat scene are `aria-hidden`; without `tip`, a visually-hidden `加载中` span provides the accessible content. Under `prefers-reduced-motion: reduce` the snowfall is **paused rather than removed** — never use `animation: none` here: the flakes' only source of visibility is the animation and their static position is `top: -30px`, above the viewport, so removing it leaves a bare black backdrop. The built-in negative `animation-delay` is what makes pausing useful: each flake freezes at a random point along its fall, producing a static snow scene that fills the viewport. The opacity fade is kept since it is not motion. The sailboat's wave and bob are paused the same way — the wave rests inside the canvas, so a still seascape remains.

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

Floating back-to-top button that appears in the bottom-right corner after scrolling past a threshold. Default icon is `RocketIcon` from `naive-icons` rendered at `size={64}` (cream `#FAEDCD` fuselage, teal `#2A9D8F` porthole, `#E76F51` flame and fins, ink `#2A2A2A` stroke) with a drop-shadow elevation; clicking smooth-scrolls to the top with an easeInOutQuad animation. There is no icon prop — the rocket is fixed, and per the icon rule it comes from `naive-icons` rather than a local asset.

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

See [countdown.md](countdown.md) for the full API, color reminders and final-seconds shaking.

## Time

```ts
type TimeLocale = 'en' | 'zh-cn';

interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    weekdayFormat?: string; // default 'dddd'
    dateFormat?: string; // default 'MMM D'; 'M月D日' when locale is 'zh-cn'
    locale?: TimeLocale; // default 'en'
}
```

```tsx
<Time />
<Time locale="zh-cn" />
<Time weekdayFormat="ddd" dateFormat="YYYY/MM/DD" />
<Time className="island-clock" aria-label="岛屿时间" />
```

Live clock card: a large `HH:MM` readout on top refreshed from `new Date()` every second, weekday + month-day in a date capsule below. `weekdayFormat` / `dateFormat` accept dayjs core tokens (`dddd` / `ddd` / `MMM` / `M` / `D` / `YYYY`…); plugin-owned tokens do not expand. `locale="zh-cn"` is built in and needs no import. Borderless panel on `var(--animal-bg-color)` with 20px radius and `--animal-shadow-sm` elevation, fading in on mount; clock 44px 900 tabular in `var(--animal-text-color)` with a blinking colon; the capsule is a 999px pill on `var(--animal-primary-color-bg)` with an uppercase `var(--animal-primary-color)` weekday. The root is `role="timer"` with `aria-live="off"` so the per-second refresh stays silent to screen readers.
