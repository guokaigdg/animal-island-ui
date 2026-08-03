# Design Tokens

## Color system

```less
// Primary color (mint teal)
@primary-color: #19c8b9;
@primary-color-hover: #3dd4c6;
@primary-color-active: #11a89b;
@primary-color-bg: #e6f9f6;

// Text (warm brown family)
@text-color: #794f27; // Primary text (header/sidebar)
@text-color-body: #725d42; // Body text (inside components)
@text-color-secondary: #9f927d; // Secondary text
@text-color-muted: #8a7b66; // Light brown (modal body)
@text-color-disabled: #c4b89e; // Disabled

// Borders
@border-color: #9f927d;
@border-color-light: #c4b89e; // Input border
@border-color-hover: #a89878; // Input hover

// Backgrounds (cream parchment)
@bg-color: #f8f8f0; // Main background
@bg-color-content: rgb(247, 243, 223); // Content area (Modal, Card)
@bg-color-secondary: #f0e8d8;
@bg-color-disabled: #f0ece2;
@bg-color-input: #fffbe7; // Input background
@bg-color-input-dis: #ece8dc; // Input disabled

// Status colors
@success-color: #6fba2c;
@success-color-active: #5a9e1e;
@warning-color: #f5c31c;
@warning-color-active: #dba90e;
@error-color: #e05a5a;
@error-color-active: #c94444;

// Game-specific colors
@focus-yellow: #ffcc00; // Focus highlight (never blue)
@focus-yellow-dark: #e0b800; // Focus shadow
@sidebar-active-bg: #b7c6e5; // Sidebar selected background
@sidebar-hover-bg: #d6dff0; // Sidebar hover background

// 3D shadow colors
@shadow-btn: #bdaea0; // Button 3D shadow
@shadow-input: #d4c9b4; // Input 3D shadow
@shadow-switch-on: #5a9e1e; // Switch ON 3D shadow
```

**IslandPhone app palette** (accepted values of the Card `color` prop):

| color value     | Background           | Text      |
| --------------- | -------------------- | --------- |
| default         | `rgb(247, 243, 223)` | `#725d42` |
| app-pink        | `#f8a6b2`            | `#fff`    |
| purple          | `#b77dee`            | `#fff`    |
| app-blue        | `#889df0`            | `#fff`    |
| app-yellow      | `#f7cd67`            | `#725d42` |
| app-orange      | `#e59266`            | `#fff`    |
| app-teal        | `#82d5bb`            | `#fff`    |
| app-green       | `#8ac68a`            | `#fff`    |
| app-red         | `#fc736d`            | `#fff`    |
| lime-green      | `#d1da49`            | `#3d5a1a` |
| yellow-green    | `#ecdf52`            | `#725d42` |
| brown           | `#9a835a`            | `#fff`    |
| warm-peach-pink | `#e18c6f`            | `#fff`    |

---

## Typography

The design language uses two rounded typefaces, delivered in one of two ways depending on the scenario:

- **Consuming the component library**: both fonts ship inside the package as `@fontsource` woff2 assets — `import 'animal-island-ui/style'` loads them, and no font `<link>` is needed.
- **Re-implementing the style without the library** (standalone HTML, demos, external tools): load them from Google Fonts as follows:

```html
<!-- In the <head> of index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap"
    rel="stylesheet"
/>
```

Or at the top of the CSS / Less entry file:

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap');
```

```css
font-family:
    Nunito,
    'Noto Sans SC',
    -apple-system,
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    sans-serif;
```

| Font             | Purpose                            | Google Fonts key      |
| ---------------- | ---------------------------------- | --------------------- |
| **Nunito**       | Main font, Latin characters        | `family=Nunito`       |
| **Noto Sans SC** | Chinese font, Simplified coverage   | `family=Noto+Sans+SC` |

> Earlier versions bundled the Japanese font `Zen Maru Gothic`; it was removed in v0.9.x (the project has no Japanese UI requirement). To extend Japanese coverage, `@import` that font yourself and append it to the end of `font-family`.

Font weight scale:

- Body content: **500**
- Button text, headings, menu items: **600–700**
- Numeric emphasis (time digits, clock): **900**
- placeholder / helper text: **400**

Letter spacing: `letter-spacing: 0.01em` (body) / `0.02em` (buttons and headings) / `1.5px` (uppercase weekday labels)

Never use light weights (weight < 400) or monospace fonts.

---

## Spacing, radius, and borders

```
Spacing: xs=4px  sm=8px  md=12px  lg=16px  xl=24px
Radius:  sm=12px  base=18px  lg=24px  pill=50px (buttons/inputs)
Borders: 2px solid by default, 2.5px for inputs, 3px for large inputs
```

---

## Shadows

```css
/* Card/container shadow (warm tone, never cold black) */
box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.1); /* base */
box-shadow: 0 8px 24px 0 rgba(61, 52, 40, 0.14); /* larger */
/* Card has no box-shadow by default (depth comes from border / pattern, not from an elevation shadow) */

/* Shadows for default/dashed/text/link buttons (soft elevation — NOT the thick 3D shadow) */
box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06); /* btn-default at rest: --animal-shadow-sm */
box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.1); /* btn-default on hover: --animal-shadow-base */
/* active falls back to --animal-shadow-sm, translateY(0) */

/* Game-button 3D shadow (primary / danger-primary buttons only; Input only when shadow={true}; Switch only has an inset track shadow, the handle has no box-shadow) */
box-shadow: 0 5px 0 0 #bdaea0; /* primary button, default */
box-shadow: 0 6px 0 0 #bdaea0; /* primary button, hover */
box-shadow: 0 1px 0 0 #bdaea0; /* primary button, active */
box-shadow: 0 5px 0 0 #c94444; /* danger-primary button, default (hover 6 / active 1) */
box-shadow: 0 3px 0 0 #d4c9b4; /* input with shadow={true}, middle */
box-shadow: 0 2px 0 0 #d4c9b4; /* input with shadow={true}, small */
box-shadow: 0 4px 0 0 #d4c9b4; /* input with shadow={true}, large */
/* Only the Switch track has an inset shadow: inset 0 2px 4px rgba(114,93,66,0.15) (OFF) / inset 0 2px 4px rgba(90,158,30,0.20) (ON); the handle has no outer box-shadow */
```

> **Important**: only primary-style buttons (including danger primary) use the pixel-stacked 3D shadow `0 5px 0 0`; `default` / `dashed` / `text` / `link` use the soft elevation shadows above. Applying the 3D shadow to every button makes the interface far too heavy and too game-like.

---

## Motion

```css
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* general */
transition: all 0.15s; /* fast (clear button, etc.) */
transition: all 0.3s ease; /* cards */
transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* accordion */

/* Hover: lift */
transform: translateY(-1px); /* buttons / inputs */
transform: translateY(-2px); /* cards */
/* Switch handle: always translateY(-50%) for vertical centering, no hover lift */

/* Active: press down (game-button feedback) */
transform: translateY(2px); /* button active */

/* Entrance animations */
@keyframes animal-zoom-in {
    from {
        opacity: 0;
        transform: scale(0.92);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
@keyframes animal-fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes ac-fade-up {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```
