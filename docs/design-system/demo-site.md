# Demo Site

These specs describe the demo and documentation site, not the shipped library. They are the actual layout values of `demo/App.tsx`, kept so the full page effect can be reproduced.

## Overall layout

```css
/* Page background */
/* Home page */
background:
    url(home_bg.svg) center/cover no-repeat,
    #7dc395;
/* Component pages */
background: url(content_bg_pc.jpg) center fixed;

/* Sidebar */
width: 220px;
min-width: 220px;
background: url(menu_bg.svg) center/cover no-repeat;
```

## Sidebar exact values

```css
/* Top logo area */
padding: 20px 16px 12px;
border-bottom: 1px solid #e8e2d6;
font-weight: 700;
font-size: 15px;
color: #725d42;
letter-spacing: -0.3px;

/* Logo image */
width: 24px;
height: 24px;
margin-right: 8px;

/* Menu list */
padding: 8px 0;

/* Category heading */
padding: 12px 16px 4px;
font-size: 11px;
color: #a0936e;
font-weight: 600;
letter-spacing: 0.5px;
text-transform: uppercase;

/* Menu item */
margin: 1px 5px;
height: 40px;
padding: 0 16px;
padding-left: 26px;
font-weight: 600;
font-size: 14px;
border-radius: 12px;
transition: all 0.15s;

/* inactive */
color: #8a7b66;
background: transparent;
/* inactive hover */
background: #d6dff0;
/* active */
color: #fff;
background: #b7c6e5;
```

## Main content area

```css
/* Desktop */
padding: 32px 40px;

/* Footer decoration (desktop, fixed positioning) */
left: 220px;
width: calc(100% - 220px);
z-index: 0;
pointer-events: none;
```

## Mobile adaptation

```css
/* Top bar */
height: 52px; padding: 0 12px;
background: rgba(255, 252, 244, 0.92);
backdrop-filter: blur(8px);
border-bottom: 1px solid #e8e2d6;
z-index: 50;

/* Button */ font-size: 20px; color: #725d42; padding: 4px 8px; border-radius: 8px;

/* Main content padding-top */ 68px;

/* Drawer */
width: 240px; z-index: 99;
box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
/* Mask */ background: rgba(0, 0, 0, 0.35); z-index: 98;
```

## Home page

```css
/* Hero area */
padding: 60px 40px 40px;
min-height: 80vh;

/* Main heading */
font-size: 50px;
font-weight: 700;
color: #fff9e6;
text-shadow: 0px 4px 1px rgba(0, 0, 0, 0.4);
margin: 0 0 12px;

/* Version badge */
font-size: 12px;
font-weight: 600;
padding: 2px 10px;
border-radius: 10px;
background: #e6f9f6;
color: #19c8b9;
margin-left: 8px;

/* Subheading */
font-size: 17px;
color: #7c5734;
line-height: 1.7;
margin: 0 0 28px;
max-width: 520px;

/* Logo image */
width: 172px;
height: 172px;

/* Section */
padding: 48px 40px;
max-width: 960px;
margin: 0 auto;

/* Section heading */
font-size: 24px;
font-weight: 700;
color: #725d42;
margin: 0 0 8px;

/* Section description */
font-size: 14px;
color: #7c5734;
margin-bottom: 32px;

/* Feature grid */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 16px;

/* Feature card hover */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(114, 93, 66, 0.15);

/* Feature icon hover */
transform: scale(1.1) rotate(-4deg);

/* Code block */
max-width: 600px;
margin: 0 auto;
padding: 20px 28px;
background: #2b2118;
border: 1px solid #3d3028;
border-radius: 20px;
font-size: 13px;
font-weight: 600;
color: #e8d5bc;
line-height: 1.8;
```

**Code highlighting palette:**

| Token type                 | Color                            |
| -------------------------- | -------------------------------- |
| Comment                    | `#6b5e50` (italic, weight 400)   |
| String                     | `#a8d4a0`                        |
| JSX tag                    | `#f0a870`                        |
| Keyword / npm/pnpm         | `#f0a870`                        |
| Command verb (install/add) | `#a8d4a0`                        |
| Braces `{}`                | `#d4b896`                        |
| Arrow `=>`                 | `#d4a0e0`                        |
| CSS variable name          | `#e8c87a`                        |
| `:root`                    | `#f0a870`                        |
| Hex color value            | `#8ab8e0`                        |
