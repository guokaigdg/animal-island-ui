# Design Prompts

Prompts for feeding the animal-island-ui visual style to external AI design and image tools. This document is derived: the canonical values live in [docs/design-system/](./design-system/). Tools that can read URLs are pointed at those files instead of a copied token dump; only the image-tool prompt inlines a few anchor values, because image generators cannot fetch links.

## UI tools (v0 / Figma AI / Framer AI / Locofy)

These tools accept file attachments or URLs, so give them the canonical documents instead of a hand-copied token dump — that way the output tracks the design system as it changes.

Attach the following files to the conversation, or paste the raw URLs and ask the tool to fetch them:

| Document        | Human-readable                                                                                        | Raw (fetchable)                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Design tokens   | https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-tokens.md            | https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-tokens.md          |
| Design rules    | https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-rules.md             | https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-rules.md           |
| Component specs | https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/components/                 | Per file under https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/components/ |

Paste this qualitative description alongside them, so the tool knows what it is aiming at before it reads the numbers:

```
Design a UI in the style of "animal-island-ui" — an a cozy island-style UI-inspired React
component library. Reproduce the attached token and rule documents as precisely as
possible; they are the source of truth for every exact value.

The overall feel: a warm, cozy, hand-crafted life-sim game interface. Cream parchment
backgrounds instead of white, earth-brown text instead of black, one mint-teal accent
running through the whole UI. Every interactive element is heavily rounded — buttons and
inputs are full pills, nothing has a sharp right angle. Primary buttons sit on a stacked
3D bottom shadow and press down like a physical game button, while secondary buttons stay
flat with only a soft warm elevation shadow. Shapes mix geometric and organic: section
headings are flat swallowtail ribbons with a folded-corner shadow, dialogs are clipped to
an irregular organic blob, cards are pastel IslandPhone app tiles or polka-dot wallpaper.
Type is Nunito rounded, never lighter than weight 400, chunky and friendly. Focus states
are warm yellow, never blue. Motion is short and soft — small lifts on hover, a press-down
on active, nothing snappy or mechanical.
```

The **sidebar and page background images** (`home_bg.svg`, `content_bg_pc.jpg`, `menu_bg.svg`) belong to the demo documentation site. The library does not ship them; they are kept only as a reference for the overall look.

## Image tools (Midjourney / DALL-E / Stable Diffusion)

```
Pixel-perfect UI screenshot of "animal-island-ui" React component library website,
a cozy island-style UI a game company Switch life-sim game aesthetic,

Interface details:
- Warm parchment background rgb(247,243,223), NEVER pure white
- Pill-shaped buttons (border-radius 50px); the **primary** action button has a 3D
  pixel-stack bottom shadow in warm taupe #bdaea0 (5px tall) and presses down on
  click like a a game company game button. Secondary (default / dashed) buttons sit
  flatter, with only a soft 2px elevation shadow.
- Organic blob-shaped modal dialog with irregular soft SVG silhouette
- Ribbon-banner section headings (Title component): swallowtail clip-path ends like a
  flat heraldic ribbon, with darker fold-shadow triangles tucked behind, and a slightly
  3D-tilted front face — comes in 13 IslandPhone color schemes (green/pink/purple/blue/
  yellow/orange/teal/red/brown etc.). NOT a blob, NOT a Card.
- Pastel IslandPhone app icon color cards: pink #f8a6b2, lavender #b77dee, sky blue #889df0,
  sunshine yellow #f7cd67, coral #e59266, seafoam #82d5bb, sage green #8ac68a
- Polka-dot pastel "wallpaper" Card variants: light tinted bg with two layered radial-gradient
  dot grids (28px and 14px) and a 1.5px solid colored border in the matching palette hue
- Mint teal accent #19c8b9, warm brown text #725d42
- [Demo-site only] Sidebar 220px wide with leaf texture background, menu items highlight in
  light blue #B7C6E5
- Nunito rounded font family (Google Fonts), weight 600-700, friendly chubby letterforms
- Yellow focus highlight #ffcc00 on focused inputs (NOT blue)
- Switch toggle with floating 3D handle, green #86d67a when ON
- Collapse accordion with teal circle icon, leaf SVG decoration
- Time widget showing weekday in green #6fba2c, large 48px clock digits
- Pastel parchment Table with dashed dotted row dividers and diagonal teal stripe hover
- Soft warm Tooltip bubble with 8px diamond arrow, OR transparent island-bubble variant
- Nature decorations: leaf SVG icons, illustrated ocean wave footer, forest tree silhouette
- Diagonal stripe loading animation on active buttons
- Custom game-style finger cursor icon
- Soft warm diffuse lighting, cozy pastoral atmosphere, flat illustration style
- 4K resolution, UI design mockup
```
