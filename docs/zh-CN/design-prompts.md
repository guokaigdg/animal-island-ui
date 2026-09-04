# Design Prompts

把 animal-island-ui 的视觉风格喂给外部 AI 设计 / 出图工具的提示词。本文是派生文档：精确数值的真源在 [docs/design-system/](./design-system/)，这里不再重复。

## UI 工具（适用于 v0 / Figma AI / Framer AI / Locofy）

这类工具支持上传附件或读取 URL，所以直接把真源文档交给它，不要手抄一份 token 清单——这样产出才会随设计系统的变化同步更新。

把以下文件附加到对话里，或粘贴 raw URL 让工具自行抓取：

| 文档          | 可读版                                                                                                | Raw（可抓取）                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Design tokens | https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-tokens.md            | https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-tokens.md          |
| Design rules  | https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-rules.md             | https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-rules.md           |
| 组件规范      | https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/components/                 | 逐文件位于 https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/components/     |

同时粘贴下面这段定性描述，让工具在读到具体数值之前先知道要做的是什么：

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

**侧边栏 / 页面背景图**（`home_bg.svg`、`content_bg_pc.jpg`、`menu_bg.svg`）属于 Demo 文档站。库本身不附带，仅作为整体风格参考保留。

## 出图工具（适用于 Midjourney / DALL-E / Stable Diffusion）

```
Pixel-perfect UI screenshot of "animal-island-ui" React component library website,
a cozy island-style life-sim game aesthetic,

Interface details:
- Warm parchment background rgb(247,243,223), NEVER pure white
- Pill-shaped buttons (border-radius 50px); the **primary** action button has a 3D
  pixel-stack bottom shadow in warm taupe #bdaea0 (5px tall) and presses down on
  click like a game console button. Secondary (default / dashed) buttons sit
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
- Switch toggle with a flat circular handle (thin border, no outer shadow; the track carries an inset shadow only), track green #86d67a when ON
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
