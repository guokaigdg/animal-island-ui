# Design Rules

## 7 条设计铁律

1. **颜色**：大地棕色系文字 + 薄荷青绿主色 + 奶油米白背景，禁止纯黑 / 冷灰。
2. **圆角**：最小 12px；按钮、输入框必须 50px pill 形。
3. **立体感**：3D 厚阴影（`0 Npx 0 0 [暗色]` + hover 上浮 / active 下压）**仅**用于 primary 按钮、danger-primary 按钮、Input、Switch。`default` / `dashed` / `text` / `link` 按钮用柔和 elevation 阴影（`0 2px 4px` / `0 3px 10px rgba(61,52,40,...)`）。
4. **字体**：Nunito（Google Fonts）圆体，按钮/标题 weight 600+，从不使用细体。
5. **动效**：过渡 0.15–0.35s，缓动 `cubic-bezier(0.4, 0, 0.2, 1)`，平滑不生硬。
6. **焦点**：输入框用黄色 `#ffcc00`，按钮用青绿 `#19c8b9`，绝不用蓝色。
7. **禁止**：直角矩形交互元素、纯黑文字 `#000`、冷蓝色调、扁平无阴影设计。

## 视觉硬规则

以下 14 条契约是本库的视觉契约，违反任意一条即不合格。

1. 禁止纯黑文字（`#000` / `#111`）。用 `#794f27` / `#725d42` / `#8a7b66` / `#9f927d`。
2. 禁止冷蓝焦点环（`#0066ff` 等）。Input/Switch/Checkbox 用 `#ffcc00`，Radio 用 `#f5c31c`，Button 用 `#19c8b9`。
3. 禁止 0px 圆角的交互元素，最小 12px。按钮/输入框 50px（pill），卡片 20px，Tooltip 16px。
4. 禁止冷灰背景（`#fafafa` / `#f5f5f5`）。用 `#f8f8f0`（主背景）或 `rgb(247,243,223)`（内容区）。
5. 3D 像素堆叠阴影 `0 5px 0 0 #bdaea0` **仅**用于 primary / danger+primary 按钮。`default` / `dashed` / `text` / `link` 按钮只用软高程阴影 `0 2px 4px 0 rgba(61,52,40,0.06)`。
6. Input 默认无阴影，`shadow` prop 默认 `false`；只有显式 `shadow={true}` 才加 `0 3px 0 0 #d4c9b4`。状态（error/warning）阴影不受 `shadow` 控制，始终渲染。
7. Switch 无外阴影。track 仅 `inset` 阴影，handle 是带 2.5px border 的扁圆、无 `box-shadow`，通过 `transform: translateY(-50%)` 垂直居中。
8. Card 无 `box-shadow`，仅 hover `translateY(-2px)` 浮起。pattern 变体加 1.5px 同色调边框。
9. Modal 必须用 SVG blob clip-path（`#animal-modal-clip`），不可换成圆角矩形。
10. Title 是 swallowtail 飘带（clip-path + 折角三角阴影 + 3deg 透视），不是 blob / pill / 矩形。`<Card type="title">` 已移除，统一用 `<Title>`。
11. 字体：`Nunito, 'Noto Sans SC'`（@fontsource 自带 woff2，构建时剥掉 woff 备份）。禁止系统等宽字体用于 UI 文字（CodeBlock 除外）。
12. 字重：正文 500，按钮/标题 600–700，Time 数字 / Title 飘带 900，placeholder 400。任何位置不得低于 400。
13. 动效缓动统一 `cubic-bezier(0.4, 0, 0.2, 1)`，时长 0.15–0.35s。
14. Radio 是高圆化方形（border-radius 12/14/16px），不是正圆；内含 SVG 对勾，不是圆点。

## 反例速查

提交代码前对照本清单检查。**所有 ❌ 出现即不合格。**

1. **禁止纯黑文字**
    - ❌ `color: #000;` / `color: #111;`
    - ✅ `color: #794f27;`（主）/ `#725d42`（次）/ `#8a7b66`（辅助）/ `#9f927d`（弱化）

2. **禁止冷蓝焦点环**
    - ❌ `outline: 2px solid #0066ff;`
    - ✅ `outline: 2px solid #ffcc00;`（Input/Switch/Checkbox）/ `#f5c31c`（Radio）/ `#19c8b9`（Button）

3. **禁止 0px 圆角 / 交互元素最小 12px**
    - ❌ `border-radius: 0;` / `border-radius: 4px;`（按钮、输入框、卡片、Tooltip）
    - ✅ `border-radius: 50px;`（按钮/输入框 pill）/ `20px`（卡片）/ `16px`（Tooltip）

4. **禁止冷灰背景**
    - ❌ `background: #fafafa;` / `background: #f5f5f5;`
    - ✅ `background: #f8f8f0;`（主背景）/ `background: rgb(247, 243, 223);`（内容区）

5. **3D 像素堆叠阴影仅用于 primary / danger-primary 按钮**
    - ❌ `<Button>` 默认就加 `box-shadow: 0 5px 0 0 #bdaea0;`
    - ✅ `<Button type="primary">` 加 3D 阴影；`type="default"` 用 `box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06);`

6. **Input 默认无阴影**
    - ❌ `<Input>` 组件默认就带 3D 阴影
    - ✅ `<Input>` 无阴影；`<Input shadow />` 加 `box-shadow: 0 3px 0 0 #d4c9b4;`；`status="error"` 不受 `shadow` 控制，始终渲染

7. **Switch 无外阴影 / handle 不浮起**
    - ❌ handle 用 `box-shadow` 浮起 / 用 `margin-top` 居中
    - ✅ `handle { position: absolute; top: 50%; transform: translateY(-50%); border: 2.5px solid <同色调>; }`

8. **Card 无 box-shadow**
    - ❌ `box-shadow: 0 4px 12px rgba(0,0,0,0.1);` 用于 Card
    - ✅ `&:hover { transform: translateY(-2px); }`；`type="pattern"` 时加 `border: 1.5px solid <同色调>;`

9. **Modal 必须用 SVG blob clip-path**
    - ❌ `border-radius: 20px;` 配合矩形容器
    - ✅ `clip-path: url(#animal-modal-clip);` 引用 SVG blob

10. **Title 是 swallowtail 飘带**
    - ❌ 用 `<Card type="title">` 或带 `border-radius` 的矩形 Title
    - ✅ 用 `<Title>` 组件，clip-path 配合 `transform: perspective(800px) rotateY(3deg);`

11. **字体**
    - ❌ `font-family: -apple-system, sans-serif;`（UI 文字）
    - ✅ `font-family: var(--animal-font-family, 'Nunito', 'Noto Sans SC');`

12. **字重不得低于 400**
    - ❌ `font-weight: 300;` / `font-weight: normal;`（< 400）
    - ✅ 正文 `500`；按钮/标题 `600-700`；Time/Title `900`；placeholder `400`

13. **动效缓动**
    - ❌ `transition: all 0.3s ease;`
    - ✅ `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);`（时长落在 0.15–0.35s 区间）

14. **Radio 是高圆化方形 + SVG 对勾**
    - ❌ `border-radius: 50%;` 配合 `<span class="dot" />`
    - ✅ `border-radius: 14px;` 配合内嵌 `<svg>` 对勾

15. **禁止用 emoji 替代 UI 图标**
    - ❌ `<span>🌊 海滩</span>` / `<span>✨ 特价</span>` — emoji 跨平台色温、样式、权重不统一
    - ✅ `<Icon name="..." />` 使用组件库内置图标；纯装饰性图形用 CSS/HTML 实现

16. **图标一律使用 `<Icon>` 组件，禁止内联 SVG 或 Unicode 符号**
    - ❌ 直接写 Unicode 符号（✓ ✕ ✗ → ←）、硬编码 `<svg>`、或引入第三方图标库
    - ✅ `<Icon name="icon-camera" size={24} />`，使用 10 个内置图标名之一；如无匹配图标，用纯 CSS 装饰元素替代
