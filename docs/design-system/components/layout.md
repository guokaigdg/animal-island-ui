# Layout — pixel spec

Pixel-level styling for the layout and structural components: Card, Title, Divider, Background, Collapse and Tabs.

## Card

```css
/* default (no hover) */
border-radius: 20px;
background: rgb(247, 243, 223);
padding: 16px 24px;
color: #725d42;
font-weight: 500;
/* NO box-shadow by default (layering relies on border / pattern, not a floating shadow) */
transition: all 0.3s ease;
/* no cursor:pointer and no hover transform by default — read-only card scenario */

/* applied only when hoverable=true (cursor + lift) */
cursor: pointer;
&:hover { transform: translateY(-2px); }

/* dashed type */
border: 2px dashed #e8dcc8;
background: rgb(250, 248, 242);
box-shadow: none;
/* dashed + hoverable:hover  → border color changes only, no displacement */
&.card-dashed:hover { transform: none; border-color: #d4c4a8; }

/* pattern overlay (when pattern !== 'none'; pure CSS, **no png/svg**) */
/* Two radial-gradient dot layers + a 1.5px solid border in the same hue + a pastel tint,
   13 names (default / app-pink / purple / app-blue / app-yellow / app-orange /
   app-teal / app-green / app-red / lime-green / yellow-green / brown / warm-peach-pink)
   matching Card.color, but rendered as a light polka-dot "wallpaper" rather than a solid block. */
/* e.g. pattern="app-pink" */
background:
    radial-gradient(circle, rgba(248, 166, 178, 0.18) 1.5px, transparent 1.5px) 0 0/28px 28px,
    radial-gradient(circle, rgba(255, 200, 210, 0.12) 1px, transparent 1px) 7px 7px/14px 14px,
    #fde4e8;
border: 1.5px solid #f8a6b2;
color: #a85565;
/* when color and pattern are both set, pattern visually overrides color */
```

> The legacy `Card type="title"` was removed in v0.9.x; use the standalone `<Title>` component (below) for section headings.

## Title (ribbon banner)

Replaces the legacy `Card type="title"` and renders a game-style ribbon banner: swallow-tail ends, folded-corner shadows and a slightly perspective-transformed front face.

```css
/* default (green palette, overridable by .color-*) */
--rf: #27d039; /* front face */
--rb: #20992a; /* back  swallow tail */
--rk: #115017; /* fold  folded-corner shadow */
--rt: #fff; /* text  text color */

font-family: Nunito, 'Noto Sans SC', sans-serif;
font-weight: 800; /* outer wrapper */
/* .ribbonText inner text font-weight 900; padding-top 0.11em for CJK optical centering */

/* ribbon body */
display: inline-flex;
height: 2em;
padding: 0 1.6em;
letter-spacing: 0.04em;
filter: drop-shadow(0 0.08em 0.12em rgba(0, 0, 0, 0.05));

/* swallow tails (left/right) — fishtail shape via clip-path */
.ribbonBackLeft {
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 30% 50%, 0% 0%);
}
.ribbonBackRight {
    clip-path: polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%);
}
width: 1.7em;
height: 1.7em;
bottom: -0.4em;

/* folded-corner shadow — CSS border triangle */
.ribbonFoldLeft {
    border-width: 0 0.95em 0.45em 0;
    border-color: transparent var(--rk) transparent transparent;
}
.ribbonFoldRight {
    border-width: 0 0 0.45em 0.95em;
    border-color: transparent transparent transparent var(--rk);
}

/* front main body */
.ribbonFront {
    inset: 0 0.1em;
    border-radius: 0.2em;
    transform: perspective(11.5em) rotateX(3deg);
}
```

### Variants — `variant` prop (`layer` | `ribbon` | `tab`, default `layer`)

The same four `--rf / --rb / --rk / --rt` variables drive every variant, so all 13 `.color-*` overrides apply equally to `layer` and `tab`.

**`layer` (双层纸, double-layer note)** — a back sheet peeks out to the upper-left with the front face floating on top:

```css
.layer {
    display: inline-flex;
    align-items: center;
    height: 2.1em;
    transition: transform 0.2s ease;
}
.layer:hover { transform: scale(1.06); }
.layer::before { /* back sheet */
    left: -0.26em; top: -0.3em; right: 0.65em; bottom: 0;
    background: var(--rb);
    border-radius: 0.35em;
    z-index: 0;
}
.layerFront { /* front face */
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; justify-content: center;
    height: 2.1em; padding: 0 1.55em;
    border-radius: 0.35em;
    color: var(--rt); background: var(--rf);
    box-shadow: 0 0.1em 0.16em rgba(0, 0, 0, 0.08);
    letter-spacing: 0.04em; font-weight: 900; white-space: nowrap;
    text-shadow: 0 0.05em 0.1em rgba(0, 0, 0, 0.12);
}
```

**`tab` (折角便签, corner tab)** — a 135° gradient cuts off the bottom-right corner, with a dark triangle fold:

```css
.tab {
    display: inline-flex; align-items: center; justify-content: center;
    height: 2em; padding: 0 1.5em;
    border-radius: 0.32em;
    color: var(--rt);
    background: linear-gradient(135deg, transparent 0.9em, var(--rf) 0.9em);
    filter: drop-shadow(0 0.1em 0.16em rgba(0, 0, 0, 0.08));
    transition: transform 0.2s ease;
}
.tab:hover { transform: scale(1.06); }
.tab::after { /* folded corner triangle */
    content: '';
    position: absolute; right: 0; bottom: 0;
    border-width: 0 0 0.9em 0.9em;
    border-color: transparent transparent var(--rk) transparent;
}
.tabText {
    position: relative; z-index: 2;
    letter-spacing: 0.04em; font-weight: 900; white-space: nowrap;
    text-shadow: 0 0.05em 0.1em rgba(0, 0, 0, 0.12);
}
```

## Carousel (fade carousel)

Source: `src/components/Carousel/Carousel.tsx` + `carousel.module.less`.

```ts
interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
    children: ReactNode;
    activeIndex?: number;
    defaultActiveIndex?: number; // default 0
    onChange?: (index: number) => void;
    autoplay?: boolean; // default false
    interval?: number; // default 3000; minimum effective interval 1000
    loop?: boolean; // default true
    showArrows?: boolean; // default true
    showDots?: boolean; // default true
    pauseOnHover?: boolean; // default true; also pauses while focused
}
```

The 20px-radius viewport uses a parchment background and cross-fades slides over 0.3s; inactive slides are invisible and non-interactive. Circular 42px arrow buttons are built with CSS borders. Every dot has a 30×30px pill-shaped hit target and draws its 10px mark with `::before`; the current mark expands to a 24px teal pill. Autoplay adds a visible top-right pause/resume pill. The root is a focusable `region` with `aria-roledescription="carousel"`; slides expose position/count labels. ArrowLeft/ArrowRight, Home and End navigate, and reduced-motion mode removes transitions.

Sizes (`SIZE_MAP` is injected as an inline `font-size`; every internal `em` scales automatically):

| size   | font-size |
| ------ | --------- |
| small  | 14px      |
| middle | 20px      |
| large  | 28px      |

13 color overrides: add one of `.color-app-pink` / `.color-purple` / `.color-app-blue` / `.color-app-yellow` / `.color-app-orange` / `.color-app-teal` / `.color-app-green` / `.color-app-red` / `.color-lime-green` / `.color-yellow-green` / `.color-brown` / `.color-warm-peach-pink` on the wrapper; each class overrides all four variables `--rf / --rb / --rk / --rt`.

Example:

```less
.color-app-yellow {
    --rf: #f7cd67;
    --rb: #d4a030;
    --rk: #8a6010;
    --rt: #725d42;
}
.color-purple {
    --rf: #b77dee;
    --rb: #9050d0;
    --rk: #5a1a9a;
    --rt: #fff;
}
```

## Divider

```tsx
<Divider type="line-brown" />  // default
<Divider type="line-teal" />
<Divider type="line-white" />
<Divider type="line-yellow" />
```

```less
.divider {
    width: 100%;
    height: 12px;
    /* default type=line-brown */
    background: conic-gradient(from -45deg at 50% 100%, #b08d57 90deg, #0000 0) center / 12px 100%;
}
.line-teal {
    background: conic-gradient(from -45deg at 50% 100%, #19c8b9 90deg, #0000 0) center / 12px 100%;
}
.line-white {
    background: conic-gradient(from -45deg at 50% 100%, #ffffff 90deg, #0000 0) center / 12px 100%;
}
.line-yellow {
    background: conic-gradient(from -45deg at 50% 100%, #f5d04a 90deg, #0000 0) center / 12px 100%;
}
```

Pure CSS, no image assets: `line-*` types draw a triangular zigzag band with a 12px `conic-gradient` tile; `dashed-*` types draw a 2px dashed rule via `linear-gradient` (12px rhythm, 50% on / 50% off).

## Background (pattern wallpaper)

```tsx
<Background type="dots" />        // default
<Background type="sprinkles" />
```

```less
.background {
    position: relative;
    width: 100%;
    min-height: 100%;
    /* default type=dots: two offset dot layers + solid base */
    background:
        radial-gradient(circle, rgba(90, 160, 90, 0.22) 1.5px, transparent 1.5px) 0 0 / 28px 28px,
        radial-gradient(circle, rgba(140, 200, 140, 0.15) 1px, transparent 1px) 7px 7px / 14px 14px,
        #bfe3bf;
}
.sprinkles {
    /* capsule sprinkles: rounded rect (rx = half thickness) + shared highlight
       gradient = cylinder shading; three mutually-prime inline-SVG tiles
       (190×170 / 230×195 / 255×215, 6 capsules each) give a combined repeat
       period of ~220000×280000px — beyond any screen, reads as random */
    background:
        url("data:image/svg+xml,…tile A…") 0 0 / 190px 170px,
        url("data:image/svg+xml,…tile B…") 45px 30px / 230px 195px,
        url("data:image/svg+xml,…tile C…") 90px 60px / 255px 215px,
        #fdf3e3;
}
```

Each tile is an inline SVG (encoded into the CSS — no external image file) stamping 6 capsules at fixed pseudo-random positions and angles. One capsule is two rounded rects sharing a transform — base color plus a vertical highlight overlay that shades it like a lit cylinder:

```html
<g transform='translate(18 26) rotate(24)'>
    <rect width='17' height='4.6' rx='2.3' fill='#f8a6b2' />
    <rect width='17' height='4.6' rx='2.3' fill='url(#s)' />
</g>
```

- `default`: cream wallpaper `rgb(247, 243, 223)` with beige dots — same palette as Card `pattern-default`.
- `dots-dark-green`: green wallpaper — two offset polka-dot layers (28px big dots, 14px small dots) over `#bfe3bf`.
- 12 `dots-*` Card-palette wallpapers — `dots-pink` `#fde4e8` / `dots-purple` `#f0e8ff` / `dots-blue` `#e8edff` / `dots-yellow` `#fff8e0` / `dots-orange` `#fff0e8` / `dots-teal` `#e8faf5` / `dots-green` `#e8f5e8` / `dots-red` `#ffe8e8` / `dots-lime-green` `#f5f8e0` / `dots-yellow-green` `#fffde8` / `dots-brown` `#f5f0e0` / `dots-warm-peach-pink` `#fff0e8` — pastel bases with two dot layers tinted by the same color family (values 1:1 with the matching Card `pattern-*` class, minus its border). No built-in text color — set it yourself if you place content directly on the wallpaper.
- `sprinkles`: doughnut frosting `#fdf3e3` scattered with cylindrical candy sprinkles in 6 colors (pink `#f8a6b2` / yellow `#f5d04a` / blue `#8ecae6` / green `#95d5b2` / orange `#f4a261` / purple `#c9a7f5`). Each sprinkle is a capsule 13–18px long × ~4.5px thick — rounded ends, highlight shading, rotated at scattered angles. Three mutually-prime SVG tiles (190×170, 230×195, 255×215) yield a combined repeat period of ~220000×280000px — beyond any screen, so the scatter reads as random with no visible repetition.
- Content (children) renders above the pattern; size the element via `style` (`height` / `min-height`) — it has no built-in fixed height.

## Collapse

```css
/* outer card */
border-radius: 18px;
border: 2px solid #9f927d;
margin-bottom: 12px;
/* disabled */ opacity: 0.6;

/* question bar */
padding: 16px 24px;
gap: 12px;

/* icon circle */
width: 28px; height: 28px;
background: #19c8b9;
color: #fff;
border-radius: 50%;
font-size: 18px; font-weight: 700;
box-shadow: 0 2px 4px rgba(25, 200, 185, 0.3);
/* expanded */ transform: rotate(180deg);

/* leaf decoration */
opacity: 0.5;
/* expanded */ opacity: 1; transform: rotate(45deg);

/* question text */
font-size: 16px; font-weight: 600; line-height: 1.4;

/* answer expansion (CSS Grid trick, no JS) */
display: grid;
grid-template-rows: 0fr;
transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
/* expanded */ grid-template-rows: 1fr;
/* inner */ overflow: hidden;

/* answer text */
padding: 0 24px;
font-size: 14px; line-height: 1.7;
/* padding-bottom once expanded */ 24px;
```

## Tabs

```css
/* outer container */
.tabs {
    background: rgb(247, 243, 223);
    border-radius: 20px;
    border: 2px solid #9f927d;
    overflow: hidden;
}

/* tab list */
.tabList {
    display: flex;
    gap: 4px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
    border-bottom: 2px solid #c4b89e;
}

/* tab item */
.tabItem {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: transparent;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #8a7b66;
    transition: all 0.2s ease;
}
/* hover */
.tabItem:hover {
    background: rgba(25, 200, 185, 0.1);
    color: #725d42;
}
/* active state — solid teal pill + cream text */
.tabItem.active {
    background: #0cc0b5;
    color: #fff9e3;
    font-weight: 600;
}
.tabItem.active-shadow {
    box-shadow: 0 3px 0 0 #d4c9b4; /* enabled only when shadow is opted in */
}

/* tab icon */
.tabIcon {
    font-size: 10px;
}
/* icon scales up when active */
.tabItem.active .tabIcon {
    transform: scale(1.2);
}

/* leaf decoration animation */
.tabLeaf {
    position: absolute;
    right: -6px;
    top: -3px;
    font-size: 12px;
    animation: leafWiggle 2s ease-in-out infinite;
}
/* leafAnimation={false} appends the tabLeafStatic class to drop the animation */

@keyframes leafWiggle {
    0%,
    100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-10deg);
    }
    75% {
        transform: rotate(10deg);
    }
}

/* content area */
.tabContent {
    padding: 24px;
    animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```
