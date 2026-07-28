# Layout — pixel spec

Pixel-level styling for the layout and structural components: Card, Title, Divider, Collapse and Tabs.

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
<Divider type="wave-yellow" />
```

```less
.divider {
    width: 100%;
    height: 12px;
    background: url('./img/divider-line-brown.svg') center/contain no-repeat;
}
.line-teal {
    background-image: url('./img/divider-line-teal.svg');
}
.line-white {
    background-image: url('./img/divider-line-white.png');
}
.line-yellow {
    background-image: url('./img/divider-line-yellow.svg');
}
.wave-yellow {
    background-image: url('./img/wave-yellow.svg');
}
```

Default SVG color reference: `#D8D0C3` (beige), `viewBox="0 0 297 14"`.

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
