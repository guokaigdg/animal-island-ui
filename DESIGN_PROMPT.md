# animal-island-ui 设计提示词

## UI 工具提示词（适用于 v0 / Figma AI / Framer AI / Locofy）

```
Design a UI in the style of "animal-island-ui" — an a cozy island-style UI-inspired React component library.
Reproduce every detail below as precisely as possible.

=== FONTS (REQUIRED — load from Google Fonts if not installed) ===
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&family=Zen+Maru+Gothic:wght@400;500;700&display=swap');

font-family: Nunito, 'Noto Sans SC', 'Zen Maru Gothic', -apple-system, 'PingFang SC', sans-serif;

Font weights:
- Body text:           500
- Buttons / headings:  600–700
- Time digits:         900
- Placeholder:         400
- letter-spacing:      0.01–0.02em (wider on buttons/weekday labels)

=== COLOR PALETTE ===
Primary background:       #f8f8f0 (warm parchment)
Content area background:  rgb(247, 243, 223) (slightly warmer — use for cards, modals)
Page background (homepage): #7DC395 + url(home_bg.svg)
Page background (component page): url(content_bg_pc.jpg) center fixed

Text colors:
  Primary (header/sidebar): #794f27
  Body (inside components):  #725d42
  Secondary:                 #9f927d
  Muted:                     #8a7b66
  Disabled:                  #c4b89e
  Placeholder:               #c4b89e

Primary accent (mint teal):
  Default: #19c8b9 | Hover: #3dd4c6 | Active: #11a89b | Light bg: #e6f9f6

Status:
  Success: #6fba2c (active: #5a9e1e)
  Warning: #f5c31c (active: #dba90e)
  Error:   #e05a5a (active: #c94444)
  Switch ON green: #86d67a (border: #6fba2c)
  Switch OFF gray: #d4c9b4 (border: #c4b89e)

Game-special:
  Focus yellow:        #ffcc00 (darker: #e0b800) — input focus highlight, NOT blue
  Sidebar selected bg: #B7C6E5
  Sidebar hover bg:    #d6dff0
  Modal confirm btn (custom footer): background #ffcc00, color #725d42

Borders:
  Standard:       2px solid #9f927d
  Input (normal): 2.5px solid #c4b89e | hover: #a89878 | large: 3px
  Time component: 3px solid #d4cfc3

3D shadow colors (bottom box-shadow only — NO elevation shadow):
  Button:       0 5px 0 0 #bdaea0 | hover: 0 6px | active: 0 1px
  Input:        0 3px 0 0 #d4c9b4 | small: 0 2px | large: 0 4px
  Switch OFF:   0 3px 0 0 #bdaea0
  Switch ON:    0 3px 0 0 #5a9e1e
  Card:         0 4px 10px rgba(107, 92, 67, 0.42)
  Feature card hover: 0 8px 24px rgba(114, 93, 66, 0.15)

=== SHAPE & RADIUS ===
Buttons and inputs:        border-radius: 50px  (full pill/capsule — most important)
Default cards:             border-radius: 20px
Title cards (organic):     border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px
Modals:                    SVG blob clip-path (see path below)
Sidebar menu items:        border-radius: 12px
Collapse panel outer:      border-radius: 18px
Version badge:             border-radius: 10px
Code block:                border-radius: 20px  (dark #2b2118, border #3d3028)
Checkbox box:              border-radius: 8px   (22px square, middle size)
Minimum anywhere:          12px — NO sharp right-angle interactive elements

=== MODAL SVG BLOB CLIP-PATH (exact path) ===
<svg style="position:absolute;width:0;height:0" aria-hidden>
  <defs>
    <clipPath id="animal-modal-clip" clipPathUnits="objectBoundingBox">
      <path d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006
        C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028
        C0.872,0.045,0.939,0.044,0.978,0.17
        C1,0.254,1,0.365,0.99,0.505 L0.988,0.513
        C0.979,0.558,0.971,0.598,0.965,0.633
        C0.956,0.689,0.979,0.77,0.964,0.865
        C0.953,0.928,0.921,0.966,0.869,0.979
        C0.821,0.986,0.773,0.992,0.726,0.995
        L0.712,0.996 L0.694,0.997
        C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1
        C0.385,1,0.325,0.998,0.283,0.995
        C0.234,0.992,0.184,0.987,0.133,0.979
        C0.081,0.966,0.05,0.928,0.039,0.865
        C0.023,0.77,0.047,0.689,0.037,0.633
        C0.031,0.595,0.023,0.552,0.013,0.505
        C-0.006,0.365,-0.002,0.254,0.024,0.17
        C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028
        C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005"/>
    </clipPath>
  </defs>
</svg>
Modal content: clip-path: url(#animal-modal-clip); padding: 48px 48px 32px 48px;

=== DEPTH & INTERACTION (a game company button press — most defining feature) ===
ALL clickable elements get a bottom box-shadow that simulates a game button:
  Default: box-shadow: 0 5px 0 0 #bdaea0; transform: none;
  Hover:   box-shadow: 0 6px 0 0 #bdaea0; transform: translateY(-1px);
  Active:  box-shadow: 0 1px 0 0 #bdaea0; transform: translateY(2px);
Cards hover: transform: translateY(-4px) — gentle float, no button press
Switch handle: always has transform: translateY(-2px) — floats above track
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)

=== FOCUS STATES ===
Input focus:    border-color: #ffcc00; box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255,204,0,0.15)
Button focus:   outline: 2px solid #19c8b9; outline-offset: 2px
Switch focus:   outline: 2px solid #ffcc00; outline-offset: 2px

=== BUTTON SIZES (exact) ===
small:  height 32px, padding 0 16px, font-size 12px, border-radius 12px
middle: height 45px, padding 0 20px, font-size 14px, border-radius 50px
large:  height 48px, padding 0 32px, font-size 16px, border-radius 24px
font-weight: 600, letter-spacing: 0.02em, line-height: 1

=== INPUT SIZES (exact) ===
small:  height 32px, padding 0 14px, font-size 12px, radius 40px,  border 2.5px, shadow: 0 2px 0 0 #d4c9b4
middle: height 40px, padding 0 18px, font-size 14px, radius 50px,  border 2.5px, shadow: 0 3px 0 0 #d4c9b4
large:  height 48px, padding 0 22px, font-size 16px, radius 50px,  border 3px,   shadow: 0 4px 0 0 #d4c9b4
Input text: color #725d42, font-weight 500, letter-spacing 0.01em

=== SWITCH SIZES (exact) ===
default: min-width 52px, height 28px, border 2.5px
  handle: 21×21px, top 2px, left 2px; ON position: left calc(100%-24px)
  box-shadow handle: 0 3px 0 0 #bdaea0 (OFF) / 0 3px 0 0 #5a9e1e (ON)
small:   min-width 38px, height 20px, border 2px
  handle: 14×14px, top 1px, left 1px; ON position: left calc(100%-16px)
Inner text: font-size 11px, font-weight 700, color #fff, letter-spacing 0.02em
  OFF padding: 0 8px 0 28px | ON padding: 0 28px 0 8px

=== LOADING ANIMATION (Button) ===
background-image: repeating-linear-gradient(-45deg, #0ec4b6, #0ec4b6 10px, #01b0a7 10px, #01b0a7 20px);
background-size: 28.28px 28.28px;
animation: animal-btn-loading 1s linear infinite;
@keyframes animal-btn-loading { 0% { background-position: 0 0; } 100% { background-position: -28.28px 0; } }

=== ACCORDION (Collapse) — no JS ===
display: grid; grid-template-rows: 0fr;
transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
expanded: grid-template-rows: 1fr;
inner wrapper: overflow: hidden;

=== TIME DISPLAY ===
Container: padding 16px 36px, gap 24px, background linear-gradient(180deg, #fff 0%, #f8f8f0 100%),
           border 3px solid #d4cfc3, border-radius 18px
Date section right border: 3px solid rgba(159, 146, 125, 0.35), padding-right 24px
Weekday: color #6fba2c, font-weight 900, font-size 14px, letter-spacing 1.5px, UPPERCASE
Month/day: color #8b7355, font-weight 800, font-size 22px
Time digits: color #8b7355, font-weight 900, font-size 48px, letter-spacing 2px
Colon blink: animation blink 1s step-end infinite; @keyframes blink { 50% { opacity: 0; } }

=== SIDEBAR LAYOUT ===
Width: 220px, background: url(menu_bg.svg) center/cover no-repeat
Header: padding 20px 16px 12px, font-size 15px, font-weight 700, color #725d42
Category labels: font-size 11px, color #a0936e, font-weight 600, letter-spacing 0.5px, uppercase
Menu items: height 40px, padding-left 26px, font-size 14px, font-weight 600
  inactive: color #8a7b66 | hover: background #d6dff0 | active: background #B7C6E5, color #fff
  border-radius: 12px, margin: 1px 5px, transition: all 0.15s

=== ISLANDPHONE CARD PALETTE (13 colors, incl. default) ===
default rgb(247,243,223) (#725d42 text) /
app-pink #f8a6b2 / purple #b77dee / app-blue #889df0 / app-yellow #f7cd67 (#725d42 text) /
app-orange #e59266 / app-teal #82d5bb / app-green #8ac68a / app-red #fc736d /
lime-green #d1da49 (#3d5a1a text) / yellow-green #ecdf52 (#725d42 text) /
brown #9a835a / warm-peach-pink #e18c6f

=== DECORATIVE ELEMENTS ===
- Collapse: teal circle icon (28px, #19c8b9 bg) with +/− that rotates 180° on expand
- Collapse: leaf SVG decoration, opacity 0.5→1, rotates 45° on expand
- Footer sea: SVG ocean wave illustration, height 80px, object-fit: contain
- Footer tree: webp forest image, height 60px, background-position: bottom center
- Dividers: illustrated lines (brown/teal/white/yellow/wave) — 12px height PNG/SVG
- Cursor: custom game-style finger pointer PNG
- Backgrounds: nature illustrations (leaf texture sidebar, island scene homepage)

=== ISLANDPHONE DEVICE (decorative widget) ===
Phone shell:   width 527px, height 788px, background #F8F4E8,
               border-radius 136px (almost capsule), overflow hidden
Home screen:   padding-top 40px, background #F8F4E8,
               background-size 100% 200%, animation grasswave 8s ease-in-out infinite
               (@keyframes grasswave { 0%,100% { background-position: 0% 0%; } 50% { background-position: 0% 100%; } })
Top bar:       wifi icon (79×29) ← time 32px/800/letter-spacing 2px color #DDDBCC → location icon (36×36)
Colon blink:   animation blink 1s steps(1) infinite (0–50% opacity 1, 51–100% opacity 0)
Welcome text:  48px / 800 / color #725C4E / letter-spacing 2px / margin-top 20px
Apps grid:     grid-template-columns: repeat(3, 1fr); gap 32px; padding 8px
App tile:      123×123px, border-radius 45px, flex center
App icon:      background-size 70% auto (iconApp only: 100% auto)
Hover bounce:  @keyframes iconBounce (0% scale 1 rotate 0, 50% scale 1.2 rotate -5deg, 100% scale 1.1 rotate -4deg), 0.3s ease-in-out forwards
Badge dot:     28×28 circle, top 0 left 0, background #FF544A, border 5px solid #F8F4E8
Page indicator: page svg 65×32, margin-top 74px
App palette:   camera #B77DEE, app #889DF0 (with offset), encyclopedia #F7CD67, diy #E59266,
               shopping #F8A6B2, variant #82D5BB, design #8AC68A, map #FC736D, chat #D1DA49

=== FOOTER DECORATION ===
<Footer type="sea" />   width 100%, height 80px, background url(footer-sea.svg) center/contain no-repeat
                        (SVG viewBox 0 0 1440 186, coral #EC7175 / ocean #327A93 / #98D2E3 / #008077)
<Footer type="tree" />  (default) width 100%, height 60px, background url(footer-tree.webp) bottom center/cover

=== DIVIDER DECORATION ===
5 types — all width 100%, height 12px, background center/contain no-repeat:
  line-brown  (default, SVG viewBox 0 0 297 14, fill #D8D0C3)
  line-teal   (SVG)
  line-white  (PNG)
  line-yellow (SVG)
  wave-yellow (SVG)

=== CURSOR WRAPPER ===
<Cursor>{children}</Cursor> — applies ".animal-cursor, .animal-cursor * { cursor: url(cursor-icon.png) 4 0, auto !important; }"
Hotspot coordinates: (4, 0). Uses !important to override all child cursors.

=== TYPEWRITER (no markup wrapper) ===
Props: children (ReactNode), speed=90ms, trigger (any unknown; change to restart),
       autoPlay=true, onDone?: () => void
Behavior: recursively truncates ReactNode tree by character count while preserving
          element structure, className, and inline styles. Returns a plain fragment
          (NO extra wrapping div/span) so it has ZERO layout impact.

=== COMPONENT INVENTORY (17 exports from src/index.ts) ===
Interactive: Button, Input, Switch, Modal, Collapse, Select, Tabs, Checkbox
Containers:  Card (13 IslandPhone colors)
Decorative:  Time, Phone, Footer, Divider, Cursor, Typewriter, Icon, CodeBlock

=== CHECKBOX (sizes small 18 / middle 22 / large 28 px) ===
Unchecked box:  background rgb(247,243,223); border 2.5px solid #c4b89e; border-radius 8px
Hover box:      border-color #19c8b9; transform translateY(-1px)
Checked box:    background #19c8b9; border-color #11a89b
Checkmark ✓:    color #fff, font-weight 700, pop animation 0.15s
Label:          color #725d42 (hover #794f27), font-weight 500, letter-spacing 0.01em
Focus ring:     outline 2px solid #ffcc00; outline-offset 2px
Disabled:       opacity 0.55, box bg #f0ece2, border #d4c9b4, label #c4b89e, cursor not-allowed
Group layout:   horizontal flex gap 12px / vertical flex-direction column gap 8px
Per-option label font-size by size: small 12px / middle 14px / large 16px

=== CODE BLOCK (dark theme, JSX/TS only) ===
Container: padding 20px 24px; background #2b2118; border 1px solid #3d3028;
           border-radius 20px; font-size 14px; line-height 1.7; tab-size 4;
           font-family 'SF Mono','Fira Code','Cascadia Code',Consolas,monospace; font-weight 600;
           white-space pre; overflow auto; color (default) #e8d5bc
Token colors:
  comment   #6b5e50 (/* */, //)
  string    #a8d4a0 (quoted strings, numeric literals)
  keyword   #d4a0e0 (import/export/const/return/true/false/null/async/await/type/interface...)
  react     #e06c75 (React, useState, useEffect, FC, ReactNode, CSSProperties...)
  component #80c0e0 (PascalCase identifiers — JSX tags / type names)
  func      #61afef (lowercase identifier followed by `(`)
  prop      #e8c87a (identifier followed by `=`)
  jsx       #f0a870 (`<Tag`, `</Tag`, `/>`)
  operator  #d4b896 (`{}[]();,` and arithmetic / comparison / logical operators)

=== FORBIDDEN PATTERNS ===
✗ Sharp right-angle (0px radius) on any interactive element
✗ Pure black #000 or #111 text — always use warm brown tones
✗ Cold blue focus rings (#0066ff etc.) — use #ffcc00 or #19c8b9
✗ Cold gray backgrounds — always warm parchment
✗ Flat design without bottom box-shadow on interactive elements
✗ font-weight below 400 anywhere in the UI
✗ System monospace fonts for UI text (code blocks excluded)
```

---

## 图片生成提示词（适用于 Midjourney / DALL-E / Stable Diffusion）

```
Pixel-perfect UI screenshot of "animal-island-ui" React component library website,
a cozy island-style UI a game company Switch life-sim game aesthetic,

Interface details:
- Warm parchment background rgb(247,243,223), NEVER pure white
- Pill-shaped buttons (border-radius 50px) with 3D bottom shadow in warm taupe #bdaea0,
  buttons press down on click like a game company game buttons
- Organic blob-shaped modal dialog with irregular soft SVG silhouette
- Pastel IslandPhone app icon color cards: pink #f8a6b2, lavender #b77dee, sky blue #889df0,
  sunshine yellow #f7cd67, coral #e59266, seafoam #82d5bb, sage green #8ac68a
- Mint teal accent #19c8b9, warm brown text #725d42
- Sidebar 220px wide with leaf texture background, menu items highlight in light blue #B7C6E5
- Nunito rounded font family (Google Fonts), weight 600-700, friendly chubby letterforms
- Yellow focus highlight #ffcc00 on focused inputs (NOT blue)
- Switch toggle with floating 3D handle, green #86d67a when ON
- Collapse accordion with teal circle icon, leaf SVG decoration
- Time widget showing weekday in green #6fba2c, large 48px clock digits
- Nature decorations: leaf SVG icons, illustrated ocean wave footer, forest tree silhouette
- Diagonal stripe loading animation on active buttons
- Custom game-style finger cursor icon
- Soft warm diffuse lighting, cozy pastoral atmosphere, flat illustration style
- 4K resolution, UI design mockup
```

---

## 关键数值速查表

| Token | 精确值 | 用途 |
|---|---|---|
| 内容区背景 | `rgb(247, 243, 223)` | Modal、Card 内容区 |
| 主背景 | `#f8f8f0` | 按钮、通用背景 |
| 正文文字 | `#725d42` | 组件内正文 |
| Header 文字 | `#794f27` | 侧边栏、标题 |
| 主色调 | `#19c8b9` | 焦点环、Collapse 图标 |
| Switch ON 绿 | `#86d67a` | Switch 开启背景 |
| 成功绿 | `#6fba2c` | 星期文字、成功状态 |
| 按钮 3D 阴影 | `#bdaea0` | `0 5px 0 0 #bdaea0` |
| 输入框 3D 阴影 | `#d4c9b4` | `0 3px 0 0 #d4c9b4` |
| 焦点黄 | `#ffcc00` | 输入框 focus |
| Modal 确认按钮 | bg `#ffcc00`, color `#725d42` | 游戏黄主操作 |
| 侧边栏选中 | `#B7C6E5` | 菜单 active |
| 侧边栏 hover | `#d6dff0` | 菜单 hover |
| 按钮高度（中） | `45px` | middle size |
| pill 圆角 | `50px` | 按钮、输入框 |
| 有机圆角 | `40px 35px 45px 38px / 38px 45px 35px 40px` | title Card |
| 字体 | `Nunito, 'Noto Sans SC', 'Zen Maru Gothic'` | Google Fonts 加载 |
| 按钮字重 | `600` | 按钮文字 |
| 时间数字字重 | `900` | Time 组件 |
| 过渡 | `0.25s cubic-bezier(0.4,0,0.2,1)` | 通用动画 |
| Loading stripe | `28.28px` step, `-45deg`, `#0ec4b6/#01b0a7` | 按钮 loading |
| 侧边栏宽度 | `220px` | Desktop sidebar |
| Phone 外壳 | `527 × 788px`，`border-radius: 136px` | IslandPhone 容器 |
| Phone app tile | `123 × 123px`，`border-radius: 45px` | 3×3 网格 |
| Phone 新消息点 | 28px 红圆 `#FF544A` + 5px 奶油描边 `#F8F4E8` | badge |
| Footer sea | `height: 80px`，SVG `contain` | 海浪底部 |
| Footer tree | `height: 60px`，webp `cover bottom` | 森林底部 |
| Divider | `height: 12px`，5 种背景图 | 装饰分割线 |
| Cursor | `cursor: url(...) 4 0, auto !important` | 游戏手指光标 |
| Typewriter 默认速度 | `90ms/字` | 按字符打印，无包裹元素 |
| Google Fonts URL | `fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Zen+Maru+Gothic:wght@400;500;700&display=swap` | 在线加载 |
