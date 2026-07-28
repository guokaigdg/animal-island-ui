# Overlays — pixel spec

Exact values for the layered surfaces that sit above page content: Modal, Drawer and Tooltip.

## Modal (SVG blob clip-path)

**Full SVG clip-path `d` value (exact blob outline):**

```jsx
<svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
    <defs>
        <clipPath id="animal-modal-clip" clipPathUnits="objectBoundingBox">
            <path
                d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006
        C0.704,0.01,0.796,0.017,0.825,0.027
        L0.827,0.028
        C0.872,0.045,0.939,0.044,0.978,0.17
        C1,0.254,1,0.365,0.99,0.505
        L0.988,0.513
        C0.979,0.558,0.971,0.598,0.965,0.633
        C0.956,0.689,0.979,0.77,0.964,0.865
        C0.953,0.928,0.921,0.966,0.869,0.979
        C0.821,0.986,0.773,0.992,0.726,0.995
        L0.712,0.996 L0.694,0.997
        C0.648,1,0.586,1,0.507,1
        L0.501,1 L0.464,1
        C0.385,1,0.325,0.998,0.283,0.995
        C0.234,0.992,0.184,0.987,0.133,0.979
        C0.081,0.966,0.05,0.928,0.039,0.865
        C0.023,0.77,0.047,0.689,0.037,0.633
        C0.031,0.595,0.023,0.552,0.013,0.505
        C-0.006,0.365,-0.002,0.254,0.024,0.17
        C0.064,0.045,0.13,0.045,0.174,0.028
        L0.175,0.028
        C0.204,0.017,0.303,0.009,0.474,0.005
        L0.501,0.005"
            />
        </clipPath>
    </defs>
</svg>
```

**Exact Modal styles:**

```css
/* mask */
background: rgba(0, 0, 0, 0.35);
animation: animal-fade-in 0.25s ease;
z-index: 1000;

/* modal container */
max-width: calc(100vw - 32px);
max-height: calc(100vh - 64px);
animation: animal-zoom-in 0.3s ease;

/* clipped content area */
clip-path: url(#animal-modal-clip);
background: rgb(247, 243, 223);
color: rgb(128, 115, 89);
padding: 48px 48px 32px 48px;

/* title */
font-size: 28px;
font-weight: 700;
color: rgba(114, 93, 66, 1);
padding-bottom: 15px;

/* close button */
width: 32px;
height: 32px;
font-size: 22px;
color: rgba(114, 93, 66, 0.6);
border-radius: 50%;
transition: all 0.2s;
/* hover */
background: rgba(114, 93, 66, 0.1);
color: rgba(114, 93, 66, 1);

/* body */
font-size: 20px;
font-weight: 600;
line-height: 1.6;
color: #8a7b66;
padding-bottom: 20px;

/* footer */
gap: 12px;

/* normal button */
height: 40px;
padding: 0 24px;
font-size: 18px;
border: 2px solid rgba(114, 93, 66, 0.3);
border-radius: 39.81px;
transition: all 0.2s;
line-height: 1;
/* hover */
border-color: rgba(114, 93, 66, 0.6);
background: rgba(114, 93, 66, 0.08);

/* primary button (confirm) */
color: rgba(114, 93, 66, 1);
background: rgba(255, 204, 0, 1); /* game yellow! */
border-color: rgba(255, 204, 0, 1);
/* hover */
background: rgba(255, 204, 0, 0.85);
border-color: rgba(255, 204, 0, 0.85);
```

## Drawer (recessed depth-of-field)

**Recessed depth-of-field drawer — the background sinks, scales down and dims to push the panel forward.**

```css
/* mask — light black (0.18), lighter than Modal so the recessed background stays visible (key to the depth effect) */
position: fixed;
inset: 0;
z-index: 1000;
background: rgba(0, 0, 0, 0.18);
animation: animal-drawer-fade-in 0.25s ease;

/* panel (shared) */
position: fixed;
z-index: 1001;
display: flex;
flex-direction: column;
background: rgb(247, 243, 223);
color: rgb(128, 115, 89);
font-family: Nunito, 'Noto Sans SC', sans-serif;
overflow: hidden;
animation-duration: 0.3s;
animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
animation-fill-mode: both;

/* panel direction (0 radius on the viewport edge, 20px on the content edge) */
/* right */
top: 0; right: 0; height: 100vh;
max-width: calc(100vw - 32px);
border-radius: 20px 0 0 20px;
box-shadow: -12px 0 32px rgba(61, 52, 40, 0.18);
animation-name: animal-drawer-slide-right; /* translateX(100%) → 0 */
/* left */
border-radius: 0 20px 20px 0;
box-shadow: 12px 0 32px rgba(61, 52, 40, 0.18);
animation-name: animal-drawer-slide-left; /* translateX(-100%) → 0 */
/* top */
border-radius: 0 0 20px 20px;
box-shadow: 0 12px 32px rgba(61, 52, 40, 0.18);
animation-name: animal-drawer-slide-top; /* translateY(-100%) → 0 */
/* bottom */
border-radius: 20px 20px 0 0;
box-shadow: 0 -12px 32px rgba(61, 52, 40, 0.18);
animation-name: animal-drawer-slide-bottom; /* translateY(100%) → 0 */

/* title */
font-size: 28px;
font-weight: 700;
color: rgba(114, 93, 66, 1);

/* close button × */
width: 32px; height: 32px;
font-size: 22px;
color: rgba(114, 93, 66, 0.6);
border-radius: 50%;
/* hover */
background: rgba(114, 93, 66, 0.1);
color: rgba(114, 93, 66, 1);

/* body */
font-size: 20px;
font-weight: 600;
line-height: 1.6;
color: #8a7b66;
padding: 0 24px 24px 24px;

/* footer */
gap: 12px;
padding: 0 24px 24px 24px;
```

**Background recession (injected by JS into the inline style of every non-fixed child of `body`):**

```css
transform: translateY(24px) scale(0.96);
filter: brightness(0.85) saturate(0.9);
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

> `pushBackground={false}` skips this effect and degrades to a plain masked drawer. On close, the original inline style of each element is restored.

## Tooltip (default and island variants)

Source: `src/components/Tooltip/tooltip.module.less`. `default` and `island` are two **completely different** visuals — do not mix them up.

**`default` variant (standard warm bubble):**

```css
background: rgb(247, 243, 223); /* @tooltip-bg */
border: 2px solid #c4b89e; /* @tooltip-border */
border-radius: 16px; /* @border-radius-sm */
padding: 6px 12px;
max-width: 240px;

font-size: 12px;
font-weight: 500;
line-height: 1.5;
letter-spacing: 0.01em;
color: #725d42;

box-shadow: 0 3px 10px rgba(61, 52, 40, 0.1); /* @shadow-base */
z-index: 100;

/* distance from the trigger */
gap: 10px;
/* entry animation: translateY 4px → 0, smooth fade in/out */

/* triangular arrow */
size: 8px;
border-radius: 2px; /* 8px diamond, 2px radius — not 6px */
```

**`island` variant (transparent organic bubble):**

```css
background: transparent; /* transparent container, no border, no shadow */
border: none;
box-shadow: none;
/* Note: island is **not** the Modal blob clip-path — it is a transparent container whose inner content carries its own bubble */

/* content area */
padding: 12px 20px;
max-width: 280px;
font-weight: 600;
line-height: 1.55;
text-align: center;

/* arrow: 14px dot (borderless) or 10px diamond (bordered) */
.islandArrow {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    filter: drop-shadow(0 4px 14px rgba(121, 79, 39, 0.14));
}
```

12 placements: `top` / `top_start` / `top_end` / `bottom` / `bottom_start` / `bottom_end` / `left` / `left_start` / `left_end` / `right` / `right_start` / `right_end`.
