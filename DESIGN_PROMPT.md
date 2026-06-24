# animal-island-ui 设计提示词

> 本文件目标：给 **AI 设计 / 出图工具**（v0、Figma AI、Framer AI、Locofy、Midjourney、DALL·E、SD）喂可以一次成型的视觉风格描述。
>
> - 描述对象是 `animal-island-ui` 组件库本身的视觉风格（v0.9.5，24 个组件，外加 FormItem / useForm / ICON_LIST 三个伴生导出）。
> - 文件中提到的 **侧边栏 / 页面背景图（home_bg.svg / content_bg_pc.jpg / menu_bg.svg）** 属于 **demo 文档站**，库本身不附带，仅作为整体风格参考保留。
> - 配套文档：消费侧 API 看 [`AI_USAGE.md`](./AI_USAGE.md)；源码内部规范看 [`skill/SKILL.md`](./skill/SKILL.md)；贡献流程看 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

## 一键提示词

> 给普通用户使用的 self-contained 一键提示词已拆出到 [`PROMPT.md`](./PROMPT.md)，复制即用。本文件保留下方更细分的 v0 / Figma AI / Midjourney / DALL·E 风格描述。

## UI 工具提示词（适用于 v0 / Figma AI / Framer AI / Locofy）

```
Design a UI in the style of "animal-island-ui" — an a cozy island-style UI-inspired React component library.
Reproduce every detail below as precisely as possible.

=== FONTS (REQUIRED — load from Google Fonts if not installed) ===
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap');

font-family: Nunito, 'Noto Sans SC', -apple-system, 'PingFang SC', sans-serif;

Font weights:
- Body text:           500
- Buttons / headings:  600–700
- Time digits:         900
- Title ribbon text:   900
- Placeholder:         400
- letter-spacing:      0.01–0.02em (wider on buttons/weekday labels)

=== COLOR PALETTE ===
Primary background:       #f8f8f0 (warm parchment)
Content area background:  rgb(247, 243, 223) (slightly warmer — use for cards, modals, table)
[Demo-site only] Page background (homepage):       #7DC395 + url(home_bg.svg)
[Demo-site only] Page background (component page): url(content_bg_pc.jpg) center fixed

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
  [Demo-site only] Sidebar selected bg: #B7C6E5
  [Demo-site only] Sidebar hover bg:    #d6dff0
  Modal confirm btn (custom footer): background #ffcc00, color #725d42

Borders:
  Standard:       2px solid #9f927d
  Input (normal): 2.5px solid #c4b89e | hover: #a89878 | large: 3px
  Time component: 3px solid #d4cfc3

3D shadow colors (bottom box-shadow only — NO elevation shadow):
  Button (primary / danger-primary ONLY):
                0 5px 0 0 #bdaea0 | hover: 0 6px | active: 0 1px
                — danger-primary uses 0 5px 0 0 #c94444
  Button (default / dashed / text / link):
                rest:  0 2px 4px 0 rgba(61, 52, 40, 0.06)   /* subtle elevation */
                hover: 0 3px 10px 0 rgba(61, 52, 40, 0.10)  /* slight lift */
                — NO 3D pixel-stack shadow on these variants
  Input:        none by default; opt-in via shadow={true} → 0 3px 0 0 #d4c9b4 | small: 0 2px | large: 0 4px
  Switch track: inset 0 2px 4px rgba(114,93,66,0.15) (off) / inset 0 2px 4px rgba(90,158,30,0.20) (on)  — INSET only, no outer 3D shadow
  Switch handle: NO box-shadow (flat circle with 2.5px border, vertically centered)
  Card:         NO box-shadow. Hover: transform translateY(-2px). Pattern variants add 1.5px solid border in palette hue.
  Feature card hover: 0 8px 24px rgba(114, 93, 66, 0.15)

=== SHAPE & RADIUS ===
Buttons and inputs:        border-radius: 50px  (full pill/capsule — most important)
Default cards:             border-radius: 20px
Title heading (ribbon):    swallowtail clip-path banner with 3D fold (use <Title>, NOT <Card>)
Modals:                    SVG blob clip-path (see path below)
[Demo-site only] Sidebar menu items: border-radius: 12px
Collapse panel outer:      border-radius: 18px
Tooltip bubble:            border-radius: 16px (standard) — Tooltip variant=island uses transparent bg
Table wrapper:             border-radius: 20px
Version badge:             border-radius: 10px
Code block:                border-radius: 20px  (dark #2b2118, border #3d3028)
Checkbox box:              border-radius: 8px   (22px square, middle size)
Radio circle:              border-radius: 12–16px (small/middle/large) — NOT a perfect circle, but heavily rounded square
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

=== DEPTH & INTERACTION (a game company button press — defining feature for primary buttons) ===
Primary / danger-primary buttons + Switch get a bottom 3D pixel-stack shadow that simulates a game button:
  Default: box-shadow: 0 5px 0 0 #bdaea0; transform: none;
  Hover:   box-shadow: 0 6px 0 0 #bdaea0; transform: translateY(-1px);
  Active:  box-shadow: 0 1px 0 0 #bdaea0; transform: translateY(2px);
Input is shadow-less by default (`shadow` prop defaults to false). Only when opted in via `<Input shadow />` does it apply the 0 Npx 0 0 #d4c9b4 stack shown below. Status (error/warning) and focus rings render regardless.
Default / dashed / text / link buttons use a softer elevation shadow only:
  Rest:    box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06);
  Hover:   box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.10); transform: translateY(-1px);
  Active:  transform: translateY(0); box-shadow: same as rest;
Cards hover: transform: translateY(-2px) — gentle float, no button press, no box-shadow
Switch handle: vertically centered via transform: translateY(-50%) — NO outer box-shadow, NO floating offset
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)

=== FOCUS STATES ===
Input focus:    border-color: #ffcc00; box-shadow: 0 0 0 3px rgba(255,204,0,0.15)  (if shadow={true}: also 0 3px 0 0 #e0b800)
Button focus:   outline: 2px solid #19c8b9; outline-offset: 2px
Switch focus:   outline: 2px solid #ffcc00; outline-offset: 2px
Radio focus:    outline: 2px solid #f5c31c; outline-offset: 2px
Checkbox focus: outline: 2px solid #ffcc00; outline-offset: 2px

=== BUTTON SIZES (exact) ===
small:  height 32px, padding 0 16px, font-size 12px, border-radius 16px
middle: height 45px, padding 0 20px, font-size 14px, border-radius 50px
large:  height 48px, padding 0 32px, font-size 16px, border-radius 24px
font-weight: 600, letter-spacing: 0.02em, line-height: 1

=== INPUT SIZES (exact) ===
NOTE: shadow column applies ONLY when `shadow={true}` is passed. Default rendering has NO box-shadow.
small:  height 32px, padding 0 14px, font-size 12px, radius 40px,  border 2px, opt-in shadow: 0 2px 0 0 #d4c9b4
middle: height 40px, padding 0 18px, font-size 14px, radius 50px,  border 2px, opt-in shadow: 0 3px 0 0 #d4c9b4
large:  height 48px, padding 0 22px, font-size 16px, radius 50px,  border 2px, opt-in shadow: 0 4px 0 0 #d4c9b4
Input text: color #725d42, font-weight 500, letter-spacing 0.01em

=== SWITCH SIZES (exact) ===
default: min-width 52px, height 28px, border 2.5px
  handle: 21×21px, top 50%, left 2px, transform translateY(-50%); ON position: left calc(100%-24px)
  track inset shadow: inset 0 2px 4px rgba(114,93,66,0.15) (OFF) / inset 0 2px 4px rgba(90,158,30,0.20) (ON)
  handle: NO outer box-shadow, only border 2.5px solid (#bdaea0 OFF / #5a9e1e ON)
small:   min-width 38px, height 20px, border 2px
  handle: 14×14px, top 1px, left 1px; ON position: left calc(100%-16px)
Inner text: font-size 11px, font-weight 700, color #fff, letter-spacing 0.02em
  OFF padding: 0 8px 0 28px | ON padding: 0 28px 0 8px

=== LOADING ANIMATION (Button inline stripes) ===
background-image: repeating-linear-gradient(-45deg, #0ec4b6, #0ec4b6 10px, #01b0a7 10px, #01b0a7 20px);
background-size: 28.28px 28.28px;
animation: animal-btn-loading 1s linear infinite;
@keyframes animal-btn-loading { 0% { background-position: 0 0; } 100% { background-position: -28.28px 0; } }

=== ACCORDION (Collapse) — CSS-only animation ===
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

=== [Demo-site only] SIDEBAR LAYOUT ===
Width: 220px, background: url(menu_bg.svg) center/cover no-repeat
Header: padding 20px 16px 12px, font-size 15px, font-weight 700, color #725d42
Category labels: font-size 11px, color #a0936e, font-weight 600, letter-spacing 0.5px, uppercase
Menu items: height 40px, padding-left 26px, font-size 14px, font-weight 600
  inactive: color #8a7b66 | hover: background #d6dff0 | active: background #B7C6E5, color #fff
  border-radius: 12px, margin: 1px 5px, transition: all 0.15s

=== ISLANDPHONE 13-COLOR PALETTE (shared by Card.color, Card.pattern, Title.color) ===
default rgb(247,243,223) (#725d42 text) /
app-pink #f8a6b2 / purple #b77dee / app-blue #889df0 / app-yellow #f7cd67 (#725d42 text) /
app-orange #e59266 / app-teal #82d5bb / app-green #8ac68a / app-red #fc736d /
lime-green #d1da49 (#3d5a1a text) / yellow-green #ecdf52 (#725d42 text) /
brown #9a835a / warm-peach-pink #e18c6f

=== CARD ===
Default container: background rgb(247, 243, 223); border-radius 20px;
                   NO box-shadow (cards rely on border / pattern, not elevation);
                   padding 16px 20px; color #725d42
13 solid color variants: see palette above. White text on dark variants (purple/app-blue/app-orange/app-red/brown/warm-peach-pink etc.), dark brown text on light variants (default/app-yellow/yellow-green).
Hover: transform translateY(-2px); transition 0.25s cubic-bezier(0.4,0,0.2,1)
NEW `pattern` prop (v0.9+) — pastel polka-dot wallpaper layer (REPLACES solid color):
  Two stacked radial-gradient dot grids: 1.5px dot at 28×28px + 1px dot at 14×14px (offset 7,7)
  Light pastel pastel-tinted background, 1.5px solid colored border in the matching palette hue
  pattern values: same 13 names as color (default / app-pink / purple / app-blue / app-yellow / app-orange / app-teal / app-green / app-red / lime-green / yellow-green / brown / warm-peach-pink)
  Example (pattern="app-pink"):
    background: radial-gradient(circle, rgba(248,166,178,0.18) 1.5px, transparent 1.5px) 0 0/28px 28px,
                radial-gradient(circle, rgba(255,200,210,0.12) 1px, transparent 1px) 7px 7px/14px 14px,
                #fde4e8;
    border: 1.5px solid #f8a6b2;
    color: #a85565;
  pattern overrides color when both are set; use pattern for "wallpaper" feel, color for solid blocks.
  VISUAL DEFAULT: API default is `pattern='none'`, but for the animal-island look, pass a `pattern` (e.g. `pattern="default"`) on Cards by default.

=== TITLE (ribbon banner — replaces deprecated Card type="title") ===
Layered ribbon with swallowtail ends + 3D fold-shadow triangles. ALL sizes are em-based so they scale with font-size.
  Sizes:  small=14px / middle=20px / large=28px (font-size of the wrapper)
  Text:   font-weight 900, line-height 1, letter-spacing 0.01em, padding-top 0.11em (CJK optical centering)
  Container: height 2em, padding 0 1.6em, drop-shadow 0 0.08em 0.12em rgba(0,0,0,0.05)
Layer stack (z-index ascending):
  1. Back tail (--rb): 1.7em square, bottom -0.4em, clip-path swallowtail
       left:  polygon(100% 0%, 100% 100%, 0% 100%, 30% 50%, 0% 0%)
       right: polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%)
  2. Fold triangle (--rk): below front, top calc(100% - 0.04em)
       left  border-width: 0 0.95em 0.45em 0
       right border-width: 0 0 0.45em 0.95em
  3. Front (--rf): inset 0 0.1em, border-radius 0.2em,
       transform: perspective(11.5em) rotateX(3deg),
       inset shadow 0 -0.06em 0 rgba(0,0,0,0.05)
  4. Text (--rt): on top of front
13 color schemes (same 13 IslandPhone names): each defines --rf (front) / --rb (back tail) / --rk (fold shadow) / --rt (text).
  Example "Default Green":  --rf #27d039  --rb #20992a  --rk #115017  --rt #fff
  Example "app-yellow":     --rf #f7cd67  --rb #d4a030  --rk #8a6010  --rt #725d42
  Example "purple":         --rf #b77dee  --rb #9050d0  --rk #5a1a9a  --rt #fff

=== RADIO (sizes small 18 / middle 22 / large 28 px) ===
Outer button: heavily-rounded square (border-radius 12/14/16px), NOT a perfect circle
Default:   background rgb(247,243,223); border 2px solid #c4b89e
Hover:     border-color #19c8b9; transform translateY(-1px)
Checked:   background #19c8b9; border-color #11a89b
Checkmark dot inside: 10/12/16px, color #fff
Pop animation (checkmark): 0.15s ease — 0% scale(0.4) opacity 0 → 60% scale(1.2) → 100% scale(1) opacity 1
Label:     color #725d42 (checked: #794f27), font-weight 500, letter-spacing 0.01em
Label font-size: small 12px / middle 14px / large 16px
Focus:     outline 2px solid #f5c31c; outline-offset 2px
Disabled:  opacity 0.55, bg #f0ece2, border #d4c9b4, label #c4b89e, cursor not-allowed
Group:     horizontal flex gap 12px / vertical column gap 8px

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

=== TOOLTIP ===
Standard variant (default):
  Background rgb(247,243,223); border 2px solid #c4b89e; border-radius 16px
  Padding 6px 12px; max-width 240px
  Font-size 12px; font-weight 500; color #725d42; line-height 1.5; letter-spacing 0.01em
  Box-shadow 0 3px 10px rgba(61,52,40,0.1); z-index 100
  Arrow: 8px diamond (border-radius 2px); gap 10px from trigger
  Entrance: translateY 4px → 0 (smooth)
Island variant (transparent organic bubble):
  Background transparent; no border / no shadow on container
  Inner content: padding 12px 20px; max-width 280px; font-weight 600; line-height 1.55; text-align center
  Arrow as 14px circle dot, drop-shadow 0 4px 14px rgba(121,79,39,0.14)
Placements: top / bottom / left / right (+ _start / _end variants)

=== LOADING (page-overlay full-screen — distinct from button stripe loading) ===
Container: position absolute, full-screen, overflow hidden, background black
Mask: radial-gradient circle on custom property --mask-r (expanding/contracting reveal)
SVG spinner color: #19c8b9 (mint teal); 1s linear infinite rotation (360deg/s)
Circle dash animation: 1.5s ease-in-out
  0%:   stroke-dasharray: 1, 150;  stroke-dashoffset: 0
  50%:  stroke-dasharray: 90, 150; stroke-dashoffset: -35
  100%: stroke-dasharray: 90, 150; stroke-dashoffset: -124

=== TABLE ===
Wrapper:        background rgb(247,243,223); border-radius 20px; padding 6px; box-sizing border-box
Header cell:    padding 16px 20px; font-size 14px; font-weight 700; color #725d42; letter-spacing 0.02em
Body cell:      padding 14px 20px; font-size 14px; font-weight 500; color #725d42; line-height 1.6
Row divider:    1px dashed pattern (6px on / 6px off), color rgb(240,232,216) (via ::after)
Striped rows:   alternate background rgba(248,248,240,0.6)
Row hover:      diagonal teal stripe pattern,
                background: repeating-linear-gradient(-45deg,
                  rgba(25,200,185,0.6) 0 10px,
                  rgba(14,196,182,0.6) 10px 20px);
                background-size 28.28px 28.28px; clip-path inset(0 round 30px); text color #3d2e1e
Empty state:    padding 60px 20px; text-align center; color #9f927d; icon opacity 0.5
Loading overlay: rgba(247,243,223,0.8) + backdrop-filter blur(2px); spinner #19c8b9

=== TIME / ISLANDPHONE / FOOTER / DIVIDER / CURSOR / TYPEWRITER (decorative widgets) ===
[See dedicated blocks below]

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
9 types — all width 100%, height 12px, background center/contain no-repeat:
  line-brown  (default, SVG viewBox 0 0 297 14, fill #D8D0C3)
  line-teal   (SVG)
  line-white  (PNG)
  line-yellow (SVG)
  wave-yellow (SVG)
  dashed-brown / dashed-teal / dashed-white / dashed-yellow (dashed variants)

=== CURSOR WRAPPER ===
<Cursor>{children}</Cursor> — applies ".animal-cursor, .animal-cursor * { cursor: url(cursor-icon.png) 4 0, auto !important; }"
Hotspot coordinates: (4, 0). Uses !important to override all child cursors.

=== TYPEWRITER (no markup wrapper) ===
Props: children (ReactNode), speed=90ms, trigger (any unknown; change to restart),
       autoPlay=true, onDone?: () => void
Behavior: recursively truncates ReactNode tree by character count while preserving
          element structure, className, and inline styles. Returns a plain fragment
          (NO extra wrapping div/span) so it has ZERO layout impact.

=== FORM (form container + validation — conventional form API) ===
Root class .island-form with -horizontal | -vertical | -inline | -small | -middle | -large | -disabled modifiers.
Horizontal layout: display flex column gap 8px; each .island-form-item is a 24-column CSS grid
                   (grid-template-columns: repeat(24, minmax(0,1fr)); align-items: baseline).
Vertical layout:   flex column gap 8px; .island-form-item is display block; label stacks above control with margin-bottom 6px.
Inline layout:     flex wrap gap 8px; items flex 0 0 auto; label/wrapper stack vertically per item.
Label:             color rgba(0,0,0,0.85) (NOT the warm parchment text tokens), font-weight normal, white-space nowrap.
                   Required mark: "*" before label, color #ff4d4f, margin-right 4px. Colon after label: ":", margin 0 4px 0 2px.
Control input:     min-height 32px, flex align center. Help/explain block: min-height 22px, font-size 12px, color rgba(0,0,0,0.45), margin-top 4px.
Status explain colors: error #ff4d4f / warning #faad14 / success #52c41a / validating #1677ff.
Size only scales label font-size: small 12px / middle 14px / large 16px.
Disabled: opacity 0.6, cursor not-allowed (also propagates disabled prop to child input).
FormItem injects value/onChange into child via React.cloneElement (controlled hijack) — child must accept value + onChange.

=== WALLET (currency pill — decorative data display) ===
Container: inline-flex column align center; width = pill width; padding-top = bag size × 0.7 (钱袋上凸空间).
Sizes (pill-w / pill-h / bag / text / halo):
  small:  96px / 32px / 38px / 12px / 3px
  medium: 132px / 42px / 50px / 17px / 4px (default)
  large:  176px / 54px / 66px / 22px / 6px
Pill: border-radius 999px (full capsule); background #b3a046 (olive-yellow main);
      multi-layer box-shadow:
        inset 0 -6px 0 rgba(91,78,30,0.18)         /* dark bottom inside */
        inset 0 0 0 2px rgba(91,78,30,0.12)        /* inset ring */
        0 0 0 var(--wallet-halo) #fffbe7           /* cream halo outer ring */
        0 6px 14px rgba(91,78,30,0.18)             /* drop shadow */
Bag slot: absolute, top 0, centered via translateX(-50%); size var(--wallet-bag);
          filter drop-shadow 0 4px 6px rgba(91,78,30,0.18); z-index 2; pointer-events none.
          Default icon: built-in Island bag PNG (item-022.png); replaceable via `icon` prop.
Value text: font-weight 800; letter-spacing 0.04em; color #fff; padding 0 12px; white-space nowrap;
            font-variant-numeric: tabular-nums; double text-shadow for fake stroke:
              0 2px 0 rgba(91,78,30,0.55), 0 0 1px rgba(91,78,30,0.55).
Number format: number → 千分位 with thousandSeparator (default ",", pass "" to disable);
               string → 原样; undefined/null → '00,000'.
Hover animation: bagSlot walletBagBounce 0.5s ease-in-out (translateY -8px rot -6deg → -2px rot 3deg → 0).

=== COMPONENT INVENTORY (24 components from src/index.ts, + 3 companion exports FormItem / useForm / ICON_LIST) ===
Interactive:           Button, Input, Switch, Modal, Collapse, Select, Tabs, Checkbox, Radio
Container / Heading:   Card (13 colors + 13 dot patterns), Title (ribbon banner — 13 schemes), Table
Forms:                 Form (with FormItem + useForm companions — conventional form layout + validation)
Feedback:              Tooltip, Loading
Decorative:            Time, Phone, Footer, Divider, Cursor, Typewriter, Icon
Content display:       CodeBlock
Currency display:      Wallet (3 sizes, olive-yellow pill + Island bag icon)

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
✗ Cold blue focus rings (#0066ff etc.) — use #ffcc00 / #f5c31c / #19c8b9
✗ Cold gray backgrounds — always warm parchment
✗ Flat design without ANY shadow on interactive elements (default buttons still need the soft elevation shadow)
✗ Applying the 3D pixel-stack shadow (0 5px 0 0) to non-primary buttons (default/dashed/text/link)
✗ font-weight below 400 anywhere in the UI
✗ System monospace fonts for UI text (code blocks excluded)
✗ Using <Card type="title"> — that variant is removed; use <Title> instead
✗ Treating Title as a blob/organic shape — it is a flat ribbon with swallowtail ends
```

---

## 图片生成提示词（适用于 Midjourney / DALL-E / Stable Diffusion）

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

---

## 关键数值速查表

| Token                  | 精确值                                                                                                                   | 用途                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 内容区背景             | `rgb(247, 243, 223)`                                                                                                     | Modal、Card、Table、Tooltip 内容区                 |
| 主背景                 | `#f8f8f0`                                                                                                                | 按钮、通用背景                                     |
| 正文文字               | `#725d42`                                                                                                                | 组件内正文                                         |
| Header 文字            | `#794f27`                                                                                                                | 章节标题、checked label                            |
| 主色调                 | `#19c8b9`                                                                                                                | 焦点环、Collapse 图标、Radio/Checkbox checked      |
| Switch ON 绿           | `#86d67a`                                                                                                                | Switch 开启背景                                    |
| 成功绿                 | `#6fba2c`                                                                                                                | 星期文字、成功状态                                 |
| 按钮 3D 阴影           | `#bdaea0`                                                                                                                | **仅 primary** `0 5px 0 0`（hover 6 / active 1）   |
| 默认按钮阴影           | `0 2px 4px 0 rgba(61,52,40,0.06)`                                                                                        | default / dashed / text / link 静止态              |
| 默认按钮 hover         | `0 3px 10px 0 rgba(61,52,40,0.10)`                                                                                       | 同上，hover 时                                     |
| 输入框 3D 阴影         | `#d4c9b4`                                                                                                                | 默认无阴影；`shadow={true}` 时 `0 3px 0 0 #d4c9b4` |
| 焦点黄                 | `#ffcc00`                                                                                                                | Input / Switch / Checkbox focus                    |
| Radio focus 黄         | `#f5c31c`                                                                                                                | Radio focus（暖一档黄）                            |
| Modal 确认按钮         | bg `#ffcc00`, color `#725d42`                                                                                            | 游戏黄主操作                                       |
| 按钮高度（中）         | `45px`                                                                                                                   | middle size                                        |
| pill 圆角              | `50px`                                                                                                                   | 按钮、输入框                                       |
| Title 飘带             | swallowtail clip-path + fold 三角阴影 + 3deg X 透视                                                                      | `<Title>` 章节标题                                 |
| Title 字号             | small 14 / middle 20 / large 28 px                                                                                       | em 缩放，含 padding-top 0.11em                     |
| Title 13 色变量        | `--rf` 正面 / `--rb` 背面燕尾 / `--rk` 折角 / `--rt` 文字                                                                | 13 套 IslandPhone 配色                               |
| Card 圆角              | `20px`                                                                                                                   | 默认卡片                                           |
| Card pattern           | 双层径向渐变点 (1.5px@28px + 1px@14px offset 7,7)                                                                        | 13 色波点墙纸                                      |
| Card pattern border    | `1.5px solid` 同色调                                                                                                     | 配 pastel 浅底                                     |
| Radio 圆角             | 12 / 14 / 16px                                                                                                           | 高度圆化方形（非正圆）                             |
| Radio 尺寸             | 18 / 22 / 28 px                                                                                                          | small / middle / large                             |
| Checkbox 圆角          | `8px`                                                                                                                    | 22px 中号                                          |
| Tooltip 圆角           | `16px`                                                                                                                   | 标准气泡                                           |
| Tooltip arrow          | 8px 菱形 + radius 2px                                                                                                    | 标准；island 变体为 14px 圆点                      |
| Table 圆角             | `20px` 外壳；hover 行 `inset(0 round 30px)`                                                                              | 表格                                               |
| Table 行分隔           | `1px dashed`（6px on / 6px off）`rgb(240,232,216)`                                                                       | ::after 实现                                       |
| Table hover 条纹       | `-45deg` teal `rgba(25,200,185,0.6)/rgba(14,196,182,0.6)` 28.28px                                                        | 对角条纹                                           |
| 字体                   | `Nunito, 'Noto Sans SC'`                                                                                                 | Google Fonts 加载                                  |
| 按钮字重               | `600`                                                                                                                    | 按钮文字                                           |
| 时间数字字重           | `900`                                                                                                                    | Time 组件                                          |
| Title 字重             | `900`                                                                                                                    | 飘带文字                                           |
| 过渡                   | `0.25s cubic-bezier(0.4,0,0.2,1)`                                                                                        | 通用动画                                           |
| Loading stripe         | `28.28px` step, `-45deg`, `#0ec4b6/#01b0a7`                                                                              | 按钮 inline loading                                |
| Loading 全屏           | mint `#19c8b9` SVG spinner，1s 旋转 + 1.5s dash                                                                          | `<Loading>` 全屏遮罩                               |
| Phone 外壳             | `527 × 788px`，`border-radius: 136px`                                                                                    | IslandPhone 容器                                     |
| Phone app tile         | `123 × 123px`，`border-radius: 45px`                                                                                     | 3×3 网格                                           |
| Phone 新消息点         | 28px 红圆 `#FF544A` + 5px 奶油描边 `#F8F4E8`                                                                             | badge                                              |
| Footer sea             | `height: 80px`，SVG `contain`                                                                                            | 海浪底部                                           |
| Footer tree            | `height: 60px`，webp `cover bottom`                                                                                      | 森林底部                                           |
| Divider                | `height: 12px`，5 种背景图                                                                                               | 装饰分割线                                         |
| Cursor                 | `cursor: url(...) 4 0, auto !important`                                                                                  | 游戏手指光标                                       |
| Typewriter 默认速度    | `90ms/字`                                                                                                                | 按字符打印，无包裹元素                             |
| Form 布局              | horizontal=24 列 CSS Grid；vertical=label 上 control 下；inline=flex wrap                                                | 主流表单布局                                       |
| Form label             | `rgba(0,0,0,0.85)`，必填星号 `#ff4d4f`                                                                                   | 不走 parchment 色系                                |
| Form 错误文案          | `#ff4d4f`（error）/ `#faad14`（warning）/ `#52c41a`（success）/ `#1677ff`（validating）                                   | 12px，min-height 22px                              |
| Wallet pill            | `#b3a046`（橄榄黄）+ `999px` 胶囊；多层 box-shadow（inset 暗部 + halo + drop）                                            | 金额胶囊                                           |
| Wallet 默认尺寸        | small 96×32 / medium 132×42 / large 176×54 px（pill）；bag 38/50/66 px                                                    | medium 默认                                        |
| Wallet 钱袋 slot       | absolute top:0，translateX(-50%)，drop-shadow `0 4px 6px rgba(91,78,30,0.18)`；70% 上凸于 pill                              | 默认 item-022.png，可自定义                        |
| Wallet 数字            | weight 800，`tabular-nums`，`letter-spacing 0.04em`，白色 + 双层 text-shadow 描边                                          | 自动千分位                                         |
| Google Fonts URL       | `fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap` | 在线加载                                           |
