---
name: animal-island-ui-style
description: >
    使用 animal-island-ui 设计风格创建 React UI 界面或组件。当用户需要：
    (1) 用治愈系海岛风格创建 UI 页面或组件；
    (2) 使用 animal-island-ui 组件库开发界面；
    (3) 构建温馨自然、圆润可爱风格的 React 界面；
    (4) 复现或扩展 animal-island-ui 的视觉语言；
    (5) 提问"治愈系海岛风格"、"animal island 风格"、"可爱圆润风格"的 UI 时，务必使用此 skill。
---

# Animal Island UI 设计风格指南

> **三文档分工**（生成代码 / 调样式时按需查阅，避免互相翻查）：
>
> - `AI_USAGE.md` — API 手册：每个组件的 props、类型、默认值、合法取值、禁用用法。**写代码优先查这里**。
> - `skill/SKILL.md`（本文档）— 像素级样式：设计 token、每组件精确 CSS（hex/px/keyframe）、Demo 布局、新组件开发模板。**要自己实现/扩展样式时查这里**。
> - `DESIGN_PROMPT.md` — 给外部工具（v0 / Figma AI / Midjourney / DALL-E）的提示词包，含 clip-path、色板速查、禁用清单。**只在喂别的 AI 时用**。

## 概述

animal-island-ui 是一套受《治愈系海岛风格》启发的 React + TypeScript UI 组件库。
设计语言核心：**温暖大地色系 + 大圆角 pill 形 + 游戏按键立体感 + 柔和动效 + 几何 / 有机形状并存**（几何代表：Title 飘带的 swallowtail clip-path、Wallet 的橄榄黄胶囊；有机代表：Modal 的 SVG blob）。

- 源码：`src/components/<ComponentName>/`
- Demo 站：`demo/`
- 构建：Vite (library mode) + `vite.config.ts`（库）/ `vite.config.demo.ts`（Demo）
- 样式系统：Less Modules + `src/styles/variables.less` 设计 token

### 全量导出清单（26 个组件 + 3 个伴生导出：FormItem / useForm / ICON_LIST）

从 `src/index.ts` 导出：

| 组件                | 职责                                                                                                              | 交互 | 装饰 / 纯展示 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- | ---- | ------------- |
| `Button`            | 按钮，5 种类型 × 3 种尺寸                                                                                         | ✓    |               |
| `Input`             | 输入框，3 种尺寸 + clear/prefix/suffix                                                                            | ✓    |               |
| `Switch`            | 开关，默认/小号                                                                                                   | ✓    |               |
| `Modal`             | SVG blob 裁切弹窗                                                                                                 | ✓    |               |
| `Drawer`            | 下沉景深抽屉（背景下沉 + 缩放 + 降亮，left/right/top/bottom 四方向）                                              | ✓    |               |
| `Card`              | 容器，`default`/`dashed`，13 种 IslandPhone 实色 + 13 种 `pattern` 波点墙纸（CSS radial-gradient，非图片）          |      | ✓             |
| `Title`             | 章节标题，飘带横幅（swallowtail clip-path 燕尾 + 折角阴影 + 微透视正面），13 种配色（替代旧 `Card type="title"`） |      | ✓             |
| `Collapse`          | 手风琴（动画用 CSS Grid 0fr↔1fr 实现，无 JS 动画）                                                                | ✓    |               |
| `Select`            | 下拉选择器（受控）                                                                                                | ✓    |               |
| `Checkbox`          | 多选框组，水平/垂直，3 种尺寸                                                                                     | ✓    |               |
| `Radio`             | 单选框组，3 种尺寸，键盘 roving tabindex                                                                          | ✓    |               |
| `Tooltip`           | 12 种 placement，`hover`/`focus`/`click` 触发，`default`/`island` 形态                                            | ✓    |               |
| `Icon`              | SVG 图标库（10 个）                                                                                               |      | ✓             |
| `Time`              | HUD 实时时钟                                                                                                      |      | ✓             |
| `Phone`             | IslandPhone 3×3 应用网格                                                                                            |      | ✓             |
| `Footer`            | 底部装饰图（`sea`/`tree`）                                                                                        |      | ✓             |
| `Divider`           | 装饰分割线，5 种风格                                                                                              |      | ✓             |
| `Cursor`            | 游戏手指光标包裹器                                                                                                |      | ✓             |
| `Typewriter`        | 打字机效果，保留 ReactNode 结构                                                                                   |      | ✓             |
| `Tabs`              | 标签页切换，叶子摆动动画可选                                                                                      | ✓    |               |
| `CodeBlock`         | JSX/TS 语法高亮代码块                                                                                             |      | ✓             |
| `Loading`           | 全屏遮罩 + SVG spinner（mint `#19c8b9`，`stroke-dasharray` 动画）                                                 |      | ✓             |
| `Table`             | 数据表格，固定列、空状态、loading                                                                                 | ✓    |               |
| `Form`              | 表单容器 + 校验（含 `FormItem` / `useForm` 伴生导出，类主流表单库 API）                                          | ✓    |               |
| `Wallet`            | 治愈海岛钱袋样式金额胶囊（橄榄黄 pill + Island bag 图标，3 种尺寸，千分位自动格式化）                                  |      | ✓             |
| `Tag`               | 胶囊标签，3 尺寸 × 3 变体（solid/outlined/dashed）× 12 配色（与 Card 调色板完全对齐），支持 closable / onClick / disabled  | ✓    |               |

类型导出：`ButtonProps/ButtonType/ButtonSize`、`InputProps/InputSize`、`SwitchProps/SwitchSize`、`ModalProps`、`DrawerProps/DrawerPlacement`、`CardProps/CardType/CardColor`、`TitleProps/TitleSize/TitleColor`、`FooterProps/FooterType`、`CollapseProps`、`CursorProps`、`TimeProps`、`PhoneProps`、`DividerProps`、`TypewriterProps`、`SelectProps/SelectOption`、`IconProps/IconName`、`TabsProps/TabItem`、`CheckboxProps/CheckboxOption/CheckboxSize`、`RadioProps/RadioOption/RadioSize`、`TooltipProps/TooltipPlacement/TooltipTrigger/TooltipVariant`、`CodeBlockProps`、`LoadingProps`、`TableProps/TableColumn`、`FormProps/FormItemProps/FormInstance/FormLayout/FormItemLayout/FormSize/FormLabelAlign/ColProps/NamePath/RequiredMark/RuleObject/RuleRender/RuleType/Rules/FieldData/ValidateStatus/ValidateError/ValidateInfo/ScrollOptions`、`WalletProps/WalletSize`、`TagProps/TagSize/TagVariant/TagColor`。运行时值：`ICON_LIST`。伴生导出：`FormItem`、`useForm`（默认导出 `Form` 也支持 `Form.Item` / `Form.useForm` 写法）。

---

## 1. Design Tokens

### 色彩系统

```less
// 主色（薄荷青绿）
@primary-color: #19c8b9;
@primary-color-hover: #3dd4c6;
@primary-color-active: #11a89b;
@primary-color-bg: #e6f9f6;

// 文字（温暖棕色系）
@text-color: #794f27; // 主文字（header/sidebar）
@text-color-body: #725d42; // 正文（组件内文字）
@text-color-secondary: #9f927d; // 次级文字
@text-color-muted: #8a7b66; // 浅棕（modal body）
@text-color-disabled: #c4b89e; // 禁用

// 边框
@border-color: #9f927d;
@border-color-light: #c4b89e; // 输入框边框
@border-color-hover: #a89878; // 输入框 hover

// 背景（奶油米白）
@bg-color: #f8f8f0; // 主背景
@bg-color-content: rgb(247, 243, 223); // 内容区（Modal、Card）
@bg-color-secondary: #f0e8d8;
@bg-color-disabled: #f0ece2;
@bg-color-input: rgb(247, 243, 223); // 输入框背景
@bg-color-input-dis: #ece8dc; // 输入框禁用

// 状态色
@success-color: #6fba2c;
@success-color-active: #5a9e1e;
@warning-color: #f5c31c;
@warning-color-active: #dba90e;
@error-color: #e05a5a;
@error-color-active: #c94444;

// 游戏特殊色
@focus-yellow: #ffcc00; // 焦点高亮（非蓝色）
@focus-yellow-dark: #e0b800; // 焦点阴影
@sidebar-active-bg: #b7c6e5; // 侧边栏选中背景
@sidebar-hover-bg: #d6dff0; // 侧边栏 hover 背景

// 3D 阴影色
@shadow-btn: #bdaea0; // 按钮 3D 阴影
@shadow-input: #d4c9b4; // 输入框 3D 阴影
@shadow-switch-on: #5a9e1e; // Switch 开启 3D 阴影
```

**IslandPhone 应用调色板**（Card `color` prop 可选值）：

| color 值        | 背景色               | 文字色    |
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

### 字体

项目使用两款 Google Fonts 圆体字，**必须**按以下方式引入，本地未安装时通过在线地址加载：

```html
<!-- 在 index.html <head> 中引入 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&display=swap"
    rel="stylesheet"
/>
```

或在 CSS / Less 入口文件顶部：

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

| 字体             | 用途               | Google Fonts key      |
| ---------------- | ------------------ | --------------------- |
| **Nunito**       | 主字体，拉丁字符   | `family=Nunito`       |
| **Noto Sans SC** | 中文字体，简体覆盖 | `family=Noto+Sans+SC` |

> 历史版本曾捆绑日文 `Zen Maru Gothic`，已于 v0.9.x 移除（项目无日文 UI 需求）。如需扩展日文字符，自行 `@import` 该字体并追加到 `font-family` 末尾即可。

字重分级：

- 正文内容：**500**
- 按钮文字、标题、菜单项：**600–700**
- 数字强调（时间数字、时钟）：**900**
- placeholder / 说明文字：**400**

字间距：`letter-spacing: 0.01em`（正文）/ `0.02em`（按钮/标题）/ `1.5px`（星期大写）

禁止使用细体（weight < 400）或等宽字体。

---

### 间距 / 圆角 / 边框

```
间距：xs=4px  sm=8px  md=12px  lg=16px  xl=24px
圆角：sm=12px  base=18px  lg=24px  pill=50px（按钮/输入框）
边框：默认 2px solid，输入框 2.5px，大尺寸输入框 3px
```

---

### 阴影

```css
/* 卡片/容器阴影（暖色调，非冷黑）*/
box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.1); /* 基础 */
box-shadow: 0 8px 24px 0 rgba(61, 52, 40, 0.14); /* 较大 */
/* Card 默认无 box-shadow（依赖 border / pattern 营造层次，不靠悬浮阴影）*/

/* 默认/虚线/文字/链接按钮阴影（柔和 elevation —— 非 3D 厚阴影）*/
box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06); /* btn-default 静止：--animal-shadow-sm */
box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.1); /* btn-default hover：--animal-shadow-base */
/* active 回落到 --animal-shadow-sm，translateY(0) */

/* 游戏按键 3D 立体阴影（仅 primary / danger-primary 按钮；Input 仅 shadow={true} 时启用；Switch 仅 track inset 阴影，handle 无 box-shadow）*/
box-shadow: 0 5px 0 0 #bdaea0; /* primary 按钮默认 */
box-shadow: 0 6px 0 0 #bdaea0; /* primary 按钮 hover */
box-shadow: 0 1px 0 0 #bdaea0; /* primary 按钮 active */
box-shadow: 0 5px 0 0 #c94444; /* danger-primary 按钮默认（hover 6 / active 1） */
box-shadow: 0 3px 0 0 #d4c9b4; /* 输入框 shadow={true} 中号 */
box-shadow: 0 2px 0 0 #d4c9b4; /* 输入框 shadow={true} 小号 */
box-shadow: 0 4px 0 0 #d4c9b4; /* 输入框 shadow={true} 大号 */
/* Switch 仅 track 有 inset 阴影：inset 0 2px 4px rgba(114,93,66,0.15) (OFF) / inset 0 2px 4px rgba(90,158,30,0.20) (ON)；handle 无 outer box-shadow */
```

> **重要**：只有 primary 风格按钮（含 danger primary）才使用 `0 5px 0 0` 这种像素级 3D 厚阴影；`default` / `dashed` / `text` / `link` 用上面的柔和 elevation 阴影。把 3D 阴影套到所有按钮上会让界面变得过重过游戏化。

---

### 动效

```css
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* 通用 */
transition: all 0.15s; /* 快速（clear 按钮等）*/
transition: all 0.3s ease; /* 卡片 */
transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 手风琴 */

/* Hover：上浮 */
transform: translateY(-1px); /* 按钮 / 输入框 */
transform: translateY(-2px); /* 卡片 */
/* Switch handle: 始终 translateY(-50%) 垂直居中，无 hover 上浮 */

/* Active：下压（游戏按键反馈）*/
transform: translateY(2px); /* 按钮 active */

/* 出现动画 */
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

---

### 1.5 反例速查（视觉硬规则 ❌/✅ 配对）

对应 `.cursorrules` §7.3 14 条契约。写代码前对照本节，**所有 ❌ 出现即不合格**。

#### 1. 禁止纯黑文字

- ❌ `color: #000;` / `color: #111;`
- ✅ `color: #794f27;`（主）/ `#725d42`（次）/ `#8a7b66`（辅助）/ `#9f927d`（弱化）

#### 2. 禁止冷蓝焦点环

- ❌ `outline: 2px solid #0066ff;`
- ✅ `outline: 2px solid #ffcc00;`（Input/Switch/Checkbox）/ `#f5c31c`（Radio）/ `#19c8b9`（Button）

#### 3. 禁止 0px 圆角 / 交互元素最小 12px

- ❌ `border-radius: 0;` / `border-radius: 4px;`（按钮、输入框、卡片、Tooltip）
- ✅ `border-radius: 50px;`（按钮/输入框 pill）/ `20px`（卡片）/ `16px`（Tooltip）

#### 4. 禁止冷灰背景

- ❌ `background: #fafafa;` / `background: #f5f5f5;`
- ✅ `background: #f8f8f0;`（主背景）/ `background: rgb(247, 243, 223);`（内容区）

#### 5. 3D 像素堆叠阴影仅用于 primary / danger-primary 按钮

- ❌ `<Button>` 默认就加 `box-shadow: 0 5px 0 0 #bdaea0;`
- ✅ `<Button type="primary">` 加 3D 阴影；`type="default"` 用 `box-shadow: 0 2px 4px 0 rgba(61, 52, 40, 0.06);`

#### 6. Input 默认无阴影

- ❌ `<Input>` 组件默认就带 3D 阴影
- ✅ `<Input>` 无阴影；`<Input shadow />` 加 `box-shadow: 0 3px 0 0 #d4c9b4;`；`status="error"` 不受 `shadow` 控制，始终渲染

#### 7. Switch 无外阴影 / handle 不浮起

- ❌ handle 用 `box-shadow` 浮起 / 用 `margin-top` 居中
- ✅ handle `position: absolute; top: 50%; transform: translateY(-50%); border: 2.5px solid <同色调>;`

#### 8. Card 无 box-shadow

- ❌ `box-shadow: 0 4px 12px rgba(0,0,0,0.1);` 用于 Card
- ✅ `&:hover { transform: translateY(-2px); }`；`type="pattern"` 时加 `border: 1.5px solid <同色调>;`

#### 9. Modal 必须用 SVG blob clip-path

- ❌ `border-radius: 20px;` 配合矩形容器
- ✅ `clip-path: url(#animal-modal-clip);` 引用 SVG blob

#### 10. Title 是 swallowtail 飘带

- ❌ 用 `<Card type="title">` 或带 `border-radius` 的矩形 Title
- ✅ 用 `<Title>` 组件，clip-path 配合 `transform: perspective(800px) rotateY(3deg);`

#### 11. 字体

- ❌ `font-family: -apple-system, sans-serif;`（UI 文字）
- ✅ `font-family: var(--animal-font-family, 'Nunito', 'Noto Sans SC');`

#### 12. 字重不得低于 400

- ❌ `font-weight: 300;` / `font-weight: normal;`（< 400）
- ✅ 正文 `500`；按钮/标题 `600-700`；Time/Title `900`；placeholder `400`

#### 13. 动效缓动

- ❌ `transition: all 0.3s ease;`
- ✅ `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);`（时长落在 0.15–0.35s 区间）

#### 14. Radio 是高圆化方形 + SVG 对勾

- ❌ `border-radius: 50%;` 配合 `<span class="dot" />`
- ✅ `border-radius: 14px;` 配合内嵌 `<svg>` 对勾

> 反例条目以 `.cursorrules` §7.3 为唯一真源；本节与 .cursorrules 冲突时以 .cursorrules 为准。

---

## 2. 组件精确样式规范

### Button

| 属性          | small    | middle   | large    |
| ------------- | -------- | -------- | -------- |
| height        | 32px     | **45px** | 48px     |
| padding       | `0 16px` | `0 20px` | `0 32px` |
| font-size     | 12px     | 14px     | 16px     |
| border-radius | 12px     | **50px** | 24px     |
| border-width  | 2px      | 2px      | 2px      |

**primary 按钮精确值（**仅 primary / danger-primary 用 3D 厚阴影**）：**

```css
color: #794f27;
background: #f8f8f0;
border-color: #f8f8f0;
font-weight: 600;
letter-spacing: 0.02em;
line-height: 1;
box-shadow: 0 5px 0 0 #bdaea0;

/* hover */
transform: translateY(-1px);
box-shadow: 0 6px 0 0 #bdaea0;

/* active */
transform: translateY(2px);
box-shadow: 0 1px 0 0 #bdaea0;

/* focus-visible */
outline: 2px solid #19c8b9;
outline-offset: 2px;

/* disabled */
opacity: 0.5;
```

**default / dashed / text / link 按钮（柔和 elevation）：**

```css
/* 静止 */
box-shadow: var(--animal-shadow-sm); /* 0 2px 4px 0 rgba(61,52,40,0.06) */

/* hover */
color: #19c8b9;
border-color: #19c8b9;
box-shadow: var(--animal-shadow-base); /* 0 3px 10px 0 rgba(61,52,40,0.10) */
transform: translateY(-1px);

/* active */
color: #11a89b;
border-color: #11a89b;
transform: translateY(0);
box-shadow: var(--animal-shadow-sm); /* 回落到静止态 */
```

> 不要把 primary 那套 `0 5px / 6px / 1px #bdaea0` 套到 default / dashed 上 —— 整体会显得过重过 cartoon。

**loading 斜纹动画（精确值）：**

```css
background: #0ec4b6;
border: 4px solid #4de2da;
color: #fff;
background-image: repeating-linear-gradient(-45deg, #0ec4b6, #0ec4b6 10px, #01b0a7 10px, #01b0a7 20px);
background-size: 28.28px 28.28px;
animation: animal-btn-loading 1s linear infinite;

@keyframes animal-btn-loading {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: -28.28px 0;
    }
}
```

**danger primary 按钮：**

```css
color: #fff;
box-shadow: 0 5px 0 0 #c94444; /* error-active */
```

---

### Input

> ⚠️ **`shadow` prop 默认 `false`**：默认无阴影，下表的 `box-shadow` 仅在 `<Input shadow />` 显式开启时生效。status (error/warning) 阴影与 focus 黄色光晕不受此 prop 控制。

| 属性                             | small               | middle              | large               |
| -------------------------------- | ------------------- | ------------------- | ------------------- |
| height                           | 32px                | 40px                | 48px                |
| padding                          | `0 14px`            | `0 18px`            | `0 22px`            |
| font-size                        | 12px                | 14px                | 16px                |
| border-radius                    | 40px                | 50px                | 50px                |
| border-width                     | 2.5px               | 2.5px               | **3px**             |
| box-shadow（仅 `shadow={true}`） | `0 2px 0 0 #d4c9b4` | `0 3px 0 0 #d4c9b4` | `0 4px 0 0 #d4c9b4` |

**精确颜色值：**

```css
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
/* 默认无 box-shadow；shadow={true} 时按上表中号取 0 3px 0 0 #d4c9b4 */

/* 文字 */
color: #725d42;
font-weight: 500;
letter-spacing: 0.01em;

/* placeholder */
color: #c4b89e;
font-weight: 400;

/* prefix/suffix */
color: #a0936e;

/* prefix margin-right */
margin-right: 6px;

/* suffix margin-left */
margin-left: 6px;

/* hover */
border-color: #a89878;
box-shadow: 0 3px 0 0 #c4b89e;

/* focus */
border-color: #ffcc00;
box-shadow:
    0 3px 0 0 #e0b800,
    0 0 0 3px rgba(255, 204, 0, 0.15);

/* disabled */
background: #ece8dc;
border-color: #d4c9b4;
box-shadow: none;
opacity: 0.6;
color: #c4b89e;

/* error */
box-shadow: 0 3px 0 0 #c94444;

/* warning */
box-shadow: 0 3px 0 0 #dba90e;
```

**clear 按钮：**

```css
width: 20px;
height: 20px;
margin-left: 4px;
color: #c4b89e;
font-size: 13px;
font-weight: 700;
border-radius: 50%;
transition: all 0.15s;
/* hover */
color: #725d42;
background: rgba(114, 93, 66, 0.1);
```

---

### Switch

**默认尺寸：**

```css
min-width: 52px;
height: 28px;
border: 2.5px solid #c4b89e;
border-radius: 50px;
background: #d4c9b4;
box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.15);

/* handle */
width: 21px;
height: 21px;
top: 50%;
left: 2px;
transform: translateY(-50%); /* 垂直居中 */
background: rgb(247, 243, 223);
border: 2.5px solid #bdaea0;
border-radius: 50%;
/* handle 无 outer box-shadow，仅靠 border 与 track inset 阴影分层 */

/* 开启态 */
background: #86d67a;
border-color: #6fba2c;
box-shadow: inset 0 2px 4px rgba(90, 158, 30, 0.2);
/* handle 开启后 left */
left: calc(100% - 24px);
border-color: #5a9e1e;

/* focus-visible */
outline: 2px solid #ffcc00;
outline-offset: 2px;

/* disabled */
opacity: 0.5;
```

**small 尺寸：**

```css
min-width: 38px;
height: 20px;
border-width: 2px;
/* handle */
width: 14px;
height: 14px;
top: 1px;
left: 1px;
box-shadow: 0 2px 0 0 #bdaea0;
/* 开启 handle left */
left: calc(100% - 16px);
box-shadow: 0 2px 0 0 #5a9e1e;
```

**inner 文字（checkedChildren/unCheckedChildren）：**

```css
font-size: 11px;
font-weight: 700;
color: #fff;
line-height: 1;
letter-spacing: 0.02em;
text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
padding: 0 8px 0 28px; /* 未开启 */
padding: 0 28px 0 8px; /* 开启 */
/* small 版 */
padding: 0 6px 0 20px;
font-size: 9px;
```

**loading spinner：**

```css
width: 11px;
height: 11px;
border: 2px solid #6fba2c;
border-right-color: transparent;
border-radius: 50%;
animation: animal-spin 0.6s linear infinite;
/* 关闭态 */
border-color: #a89878;
@keyframes animal-spin {
    to {
        transform: rotate(360deg);
    }
}
```

---

### Card

```css
/* 默认 */
border-radius: 20px;
background: rgb(247, 243, 223);
padding: 16px 24px;
color: #725d42;
font-weight: 500;
/* 默认 NO box-shadow（依赖 border / pattern 分层，不靠悬浮阴影）*/
transition: all 0.3s ease;
/* hover */
transform: translateY(-2px);

/* dashed 类型 */
border: 2px dashed #e8dcc8;
background: rgb(250, 248, 242);
box-shadow: none;

/* pattern 叠加（pattern !== 'none' 时，纯 CSS 实现，**无 png/svg**） */
/* 双层 radial-gradient 点阵 + 同色调 1.5px solid 边框 + pastel 浅底，
   13 种命名（default / app-pink / purple / app-blue / app-yellow / app-orange /
   app-teal / app-green / app-red / lime-green / yellow-green / brown / warm-peach-pink）
   与 Card.color 同名，但呈现为浅底波点"墙纸"而非实色块。 */
/* 例：pattern="app-pink" */
background:
    radial-gradient(circle, rgba(248, 166, 178, 0.18) 1.5px, transparent 1.5px) 0 0/28px 28px,
    radial-gradient(circle, rgba(255, 200, 210, 0.12) 1px, transparent 1px) 7px 7px/14px 14px,
    #fde4e8;
border: 1.5px solid #f8a6b2;
color: #a85565;
/* 当 color 与 pattern 同时设置时，pattern 视觉上覆盖 color */
```

> 旧版 `Card type="title"` 在 v0.9.x 移除，章节标题请使用独立的 `<Title>` 组件（见下文）。

---

### Title（飘带 Ribbon 章节标题）

替代旧 `Card type="title"`，渲染游戏风飘带横幅：燕尾两端 + 折角阴影 + 微透视正面主体。
源码：`src/components/Title/title.module.less`。

```css
/* 默认（绿色配色，可被 .color-* 覆盖） */
--rf: #27d039; /* front 正面 */
--rb: #20992a; /* back  燕尾 */
--rk: #115017; /* fold  折角阴影 */
--rt: #fff; /* text  文字色 */

font-family: Nunito, 'Noto Sans SC', sans-serif;
font-weight: 800; /* 外层 wrapper */
/* .ribbonText 内层文字 font-weight 900；padding-top 0.11em CJK 光学居中 */

/* 飘带主体 */
display: inline-flex;
height: 2em;
padding: 0 1.6em;
letter-spacing: 0.04em;
filter: drop-shadow(0 0.08em 0.12em rgba(0, 0, 0, 0.05));

/* 燕尾（左/右）—— clip-path 鱼尾形 */
.ribbonBackLeft {
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 30% 50%, 0% 0%);
}
.ribbonBackRight {
    clip-path: polygon(0% 0%, 100% 0%, 70% 50%, 100% 100%, 0% 100%);
}
width: 1.7em;
height: 1.7em;
bottom: -0.4em;

/* 折角阴影 —— CSS border 三角 */
.ribbonFoldLeft {
    border-width: 0 0.95em 0.45em 0;
    border-color: transparent var(--rk) transparent transparent;
}
.ribbonFoldRight {
    border-width: 0 0 0.45em 0.95em;
    border-color: transparent transparent transparent var(--rk);
}

/* 正面主体 */
.ribbonFront {
    inset: 0 0.1em;
    border-radius: 0.2em;
    transform: perspective(11.5em) rotateX(3deg);
}
```

尺寸（`SIZE_MAP` 通过 inline `font-size` 注入；所有内部 `em` 自动缩放）：

| size   | font-size |
| ------ | --------- |
| small  | 14px      |
| middle | 20px      |
| large  | 28px      |

13 种颜色覆盖：在 wrapper 上叠加 `.color-app-pink` / `.color-purple` / `.color-app-blue` / `.color-app-yellow` / `.color-app-orange` / `.color-app-teal` / `.color-app-green` / `.color-app-red` / `.color-lime-green` / `.color-yellow-green` / `.color-brown` / `.color-warm-peach-pink` 之一；每个类同时覆盖 `--rf / --rb / --rk / --rt` 四个变量。详见 `title.module.less` 末尾的 13 行 `.color-*` 定义。

例：

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

---

### Collapse

```css
/* 外层卡片 */
border-radius: 18px;
border: 2px solid #9f927d;
margin-bottom: 12px;
/* disabled */ opacity: 0.6;

/* 问题栏 */
padding: 16px 24px;
gap: 12px;

/* 图标圆圈 */
width: 28px; height: 28px;
background: #19c8b9;
color: #fff;
border-radius: 50%;
font-size: 18px; font-weight: 700;
box-shadow: 0 2px 4px rgba(25, 200, 185, 0.3);
/* 展开时 */ transform: rotate(180deg);

/* 叶子装饰 */
opacity: 0.5;
/* 展开时 */ opacity: 1; transform: rotate(45deg);

/* 问题文字 */
font-size: 16px; font-weight: 600; line-height: 1.4;

/* 答案展开（CSS Grid trick，无 JS）*/
display: grid;
grid-template-rows: 0fr;
transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
/* 展开 */ grid-template-rows: 1fr;
/* 内层 */ overflow: hidden;

/* 答案文字 */
padding: 0 24px;
font-size: 14px; line-height: 1.7;
/* 展开后 padding-bottom */ 24px;
```

---

### Tabs

```css
/* 外层容器 */
.tabs {
    background: rgb(247, 243, 223);
    border-radius: 20px;
    border: 2px solid #9f927d;
    overflow: hidden;
}

/* 标签列表 */
.tabList {
    display: flex;
    gap: 4px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
    border-bottom: 2px solid #c4b89e;
}

/* 标签项 */
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
/* 激活状态 — 实心 teal 胶囊 + 奶油色字 */
.tabItem.active {
    background: #0cc0b5;
    color: #fff9e3;
    font-weight: 600;
}
.tabItem.active-shadow {
    box-shadow: 0 3px 0 0 #d4c9b4; /* 仅 shadow opt-in 时启用 */
}

/* 标签图标 */
.tabIcon {
    font-size: 10px;
}
/* 激活时图标放大 */
.tabItem.active .tabIcon {
    transform: scale(1.2);
}

/* 叶子装饰动画 */
.tabLeaf {
    position: absolute;
    right: -6px;
    top: -3px;
    font-size: 12px;
    animation: leafWiggle 2s ease-in-out infinite;
}
/* leafAnimation={false} 时追加 tabLeafStatic 类去除 animation */

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

/* 内容区 */
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

---

### Modal

**SVG clip-path 完整 path d 值（精确还原 blob 轮廓）：**

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

**Modal 精确样式：**

```css
/* 遮罩 */
background: rgba(0, 0, 0, 0.35);
animation: animal-fade-in 0.25s ease;
z-index: 1000;

/* 弹窗容器 */
max-width: calc(100vw - 32px);
max-height: calc(100vh - 64px);
animation: animal-zoom-in 0.3s ease;

/* 裁切内容区 */
clip-path: url(#animal-modal-clip);
background: rgb(247, 243, 223);
color: rgb(128, 115, 89);
padding: 48px 48px 32px 48px;

/* 标题 */
font-size: 28px;
font-weight: 700;
color: rgba(114, 93, 66, 1);
padding-bottom: 15px;

/* 关闭按钮 */
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

/* 普通按钮 */
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

/* 主按钮（确认）*/
color: rgba(114, 93, 66, 1);
background: rgba(255, 204, 0, 1); /* 游戏黄色！*/
border-color: rgba(255, 204, 0, 1);
/* hover */
background: rgba(255, 204, 0, 0.85);
border-color: rgba(255, 204, 0, 0.85);
```

---

### Drawer

**下沉景深抽屉 — 背景下沉 + 缩放 + 降亮突出主体。**

```css
/* 遮罩 — 浅黑（0.18），比 Modal 浅，让下沉的背景仍可见（景深关键）*/
position: fixed;
inset: 0;
z-index: 1000;
background: rgba(0, 0, 0, 0.18);
animation: animal-drawer-fade-in 0.25s ease;

/* 面板（通用） */
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

/* 面板方向（贴视口边 0 圆角，内容边 20px）*/
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

/* 标题 */
font-size: 28px;
font-weight: 700;
color: rgba(114, 93, 66, 1);

/* 关闭按钮 × */
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

**背景下沉（JS 注入到 body 非固定子元素的 inline style）：**

```css
transform: translateY(24px) scale(0.96);
filter: brightness(0.85) saturate(0.9);
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

> `pushBackground={false}` 时跳过此效果，退化为普通遮罩抽屉。关闭时恢复元素原始 inline style。

---

### Time

```css
/* 容器 */
display: flex; align-items: center;
gap: 20px;
padding: 16px 36px;
background: linear-gradient(180deg, #fff 0%, #f8f8f0 100%);
border: 3px solid #d4cfc3;
border-radius: 18px;
animation: ac-fade-up 0.5s ease-out;

/* 日期块（右侧分隔线）*/
padding-right: 24px;
border-right: 3px solid rgba(159, 146, 125, 0.35);

/* 星期 */
color: #6fba2c;
font-weight: 900; font-size: 14px;
letter-spacing: 1.5px;

/* 月日 */
color: #8b7355;
font-weight: 800; font-size: 22px;

/* 时间数字 */
color: #8b7355;
font-weight: 900; font-size: 48px;
letter-spacing: 2px;

/* 冒号（闪烁）*/
font-size: 48px; color: #8b7355;
position: relative; top: -0.08em;
margin: 0 1px;
animation: blink 1s step-end infinite;

@keyframes blink { 50% { opacity: 0; } }

/* 响应式 768px */
padding: 12px 20px; gap: 12px;
.acWeekday → font-size: 11px;
.acMonthday → font-size: 16px;
.acTime / .acColon → font-size: 32px;
```

---

### Phone（IslandPhone）

**外壳（固定尺寸，不响应式）：**

```css
.phone {
    width: 527px;
    height: 788px;
    background: #f8f4e8; /* 奶油米 */
    border-radius: 136px; /* 超大圆角，近似胶囊 */
    overflow: hidden;
}
.homeScreen {
    height: 100%;
    padding-top: 40px;
    background: #f8f4e8;
    background-size: 100% 200%;
    animation: grasswave 8s ease-in-out infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
}
@keyframes grasswave {
    0%,
    100% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 0% 100%;
    }
}
```

**顶部时间栏：**

```css
.dateDisplay {
    padding: 0 70px 31px 70px;
    text-align: center;
}
.dateDisplayHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #dddbcc;
}
.blink {
    font-size: 32px;
    font-weight: 800;
    color: #dddbcc;
    animation: blink 1s steps(1) infinite;
    vertical-align: text-bottom;
}
@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}
.dayText {
    font-size: 48px;
    font-weight: 800;
    color: #725c4e;
    letter-spacing: 2px;
    height: 56px;
    margin-top: 20px;
}
```

**3×3 应用网格：**

```css
.appsGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    padding: 8px;
    flex: 1;
    align-content: center;
    justify-content: center;
}
.appItem {
    width: 123px;
    height: 123px;
    border-radius: 45px; /* 圆角正方形 */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.appItem:hover .appIcon {
    animation: iconBounce 0.3s ease-in-out forwards;
}
.appIcon {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 70% auto;
}
.appItemOffset {
    overflow: hidden;
}
.appIconOffset {
    transform: translateY(10px);
}

@keyframes iconBounce {
    0% {
        transform: scale(1) rotate(0deg);
    }
    50% {
        transform: scale(1.2) rotate(-5deg);
    }
    100% {
        transform: scale(1.1) rotate(-4deg);
    }
}
```

**应用数据结构（`src/components/Phone/Phone.tsx`）：**

| id           | iconClass        | 背景色    | offset | hasNewMessage |
| ------------ | ---------------- | --------- | ------ | ------------- |
| camera       | iconCamera       | `#B77DEE` |        | ✓             |
| app          | iconApp          | `#889DF0` | ✓      |               |
| encyclopedia | iconEncyclopedia | `#F7CD67` |        |               |
| diy          | iconDiy          | `#E59266` |        |               |
| shopping     | iconDesign       | `#F8A6B2` |        |               |
| variant      | iconMap          | `#82D5BB` |        | ✓             |
| design       | iconVariant      | `#8AC68A` |        |               |
| map          | iconHelicopter   | `#FC736D` |        |               |
| chat         | iconChat         | `#D1DA49` |        |               |

每个 iconClass 都绑定一个 `background-image: url('./img/icon-*.svg')`，`iconApp` 特殊使用 `background-size: 100% auto`（其他是 `70% auto`）。可用图标资源：`icon-miles/camera/chat/encyclopedia/design/diy/helicopter/map/shopping/variant.svg`，以及状态图标 `wifi.svg` / `location.svg` / `page.svg`。

**小红点（新消息）：**

```css
.badge {
    position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ff544a;
    border: 5px solid #f8f4e8; /* 奶油米描边，形成游戏风徽章 */
}
```

**底部状态图标：**

```css
.iconWifi {
    width: 79px;
    height: 29px;
    background: url('./img/wifi.svg') center/contain no-repeat;
}
.iconLocation {
    width: 36px;
    height: 36px;
    background: url('./img/location.svg') center/contain no-repeat;
}
.iconPage {
    width: 65px;
    height: 32px;
    background: url('./img/page.svg') center/contain no-repeat;
}
.pageIndicator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 74px;
}
```

**行为：** 内部 `useEffect + setInterval(1000)` 更新时间，`12 小时制 + AM/PM + 零填充分钟`，冒号闪烁 1s 一个周期。组件无业务回调，纯展示。

---

### Footer

```tsx
<Footer />              // 默认：森林（tree，高 60px）
<Footer type="sea" />   // 海浪（高 80px）
```

```less
.footer {
    width: 100%;
    height: 80px;
    background: url('./img/footer-sea.svg') center/contain no-repeat;
}
.tree {
    background-image: url('./img/footer-tree.webp');
    height: 60px;
    background-size: cover;
    background-position: bottom center;
}
```

- `sea`：SVG 海浪插画，`viewBox="0 0 1440 186"`，多色（珊瑚 `#EC7175`、海蓝 `#327A93`、浅蓝 `#98D2E3`、深青 `#008077` 等）。
- `tree`：webp 森林剪影，置于页面最底部。

---

### Divider

```tsx
<Divider type="line-brown" />  // 默认
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

默认 SVG 色值参考：`#D8D0C3`（米褐），`viewBox="0 0 297 14"`。

---

### Cursor

```tsx
<Cursor>
    <App /> {/* 此范围内所有元素变为游戏手指光标 */}
</Cursor>
```

样式文件为 **普通 CSS**（非 module）：

```css
.animal-cursor,
.animal-cursor * {
    cursor:
        url('./cursor-icon.png') 4 0,
        auto !important;
}
```

- `cursor-icon.png` 热点坐标 `(4, 0)`
- 使用 `!important` 覆盖默认光标；`className` 直接挂在根 `<div>` 上，类名固定为 `animal-cursor`

---

### Typewriter

```tsx
<Typewriter speed={90} trigger={openCount} autoPlay onDone={() => ...}>
  <p>第一行 <strong>加粗</strong></p>
  <p>第二行</p>
</Typewriter>
```

Props：

| name       | type          | default | 说明                                                 |
| ---------- | ------------- | ------- | ---------------------------------------------------- |
| `children` | `ReactNode`   | —       | 要逐字打出的内容，**保留原有元素结构 / 换行 / 样式** |
| `speed`    | `number (ms)` | `90`    | 每字间隔                                             |
| `trigger`  | `unknown`     | —       | 值变化即重新播放（通常传递弹窗 open 次数或递增 key） |
| `autoPlay` | `boolean`     | `true`  | `false` 直接全量显示                                 |
| `onDone`   | `() => void`  | —       | 播放完成回调                                         |

**实现要点：**

- `countText(node)`：递归统计 ReactNode 的纯文本长度
- `renderTruncated(node, state)`：按剩余字符数递归裁剪，`React.cloneElement` 保留原节点与样式
- `useEffect` 依赖 `[total, speed, trigger, autoPlay]`，内部 `setInterval` 按步递增 `count`
- **无样式文件**，不包裹任何额外 DOM（返回 `<>...</>`），对布局零影响

---

### Checkbox

Props：

| name           | type                             | default        | 说明                                         |
| -------------- | -------------------------------- | -------------- | -------------------------------------------- |
| `options`      | `CheckboxOption[]`               | —              | **必填**；每项 `{ label, value, disabled? }` |
| `value`        | `Array<string \| number>`        | —              | 受控选中值                                   |
| `defaultValue` | `Array<string \| number>`        | `[]`           | 非受控默认值                                 |
| `size`         | `'small' \| 'middle' \| 'large'` | `'middle'`     | 尺寸                                         |
| `disabled`     | `boolean`                        | `false`        | 禁用全部项                                   |
| `direction`    | `'horizontal' \| 'vertical'`     | `'horizontal'` | 排列方向                                     |
| `onChange`     | `(values) => void`               | —              | 选中值变化                                   |

**尺寸表（box 方框）：**

| 属性           | small   | middle      | large   |
| -------------- | ------- | ----------- | ------- |
| 宽高           | 18×18px | **22×22px** | 28×28px |
| border-width   | 2px     | 2.5px       | 3px     |
| 标签 font-size | 12px    | 14px        | 16px    |
| 对勾 font-size | 11px    | 13px        | 16px    |

**精确样式：**

```css
/* group */
display: flex; flex-wrap: wrap;
gap: 12px;                                 /* horizontal */
/* vertical */ flex-direction: column; gap: 8px;

/* item */
display: inline-flex; align-items: center;
gap: 8px;
cursor: pointer;
transition: all 0.25s cubic-bezier(0.4,0,0.2,1);

/* box（未选）*/
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
border-radius: 8px;
display: inline-flex; align-items: center; justify-content: center;

/* box hover */
border-color: #19c8b9;
transform: translateY(-1px);

/* box focus-visible */
outline: 2px solid #ffcc00; outline-offset: 2px;

/* 选中 */
background: #19c8b9;
border-color: #11a89b;
/* 选中 hover */ background: #3dd4c6; border-color: #19c8b9;

/* 对勾 ✓ */
color: #fff; font-weight: 700; line-height: 1;
animation: animal-checkbox-pop 0.15s cubic-bezier(0.4,0,0.2,1);

@keyframes animal-checkbox-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1);   opacity: 1; }
}

/* label */
color: #725d42; font-weight: 500;
letter-spacing: 0.01em;
/* item hover */ label color: #794f27;

/* 禁用（单项或整组）*/
cursor: not-allowed;
opacity: 0.55;
/* box */ background: #f0ece2; border-color: #d4c9b4; transform: none !important;
/* label */ color: #c4b89e;
```

---

### CodeBlock

Props：

| name        | type            | default | 说明                                                 |
| ----------- | --------------- | ------- | ---------------------------------------------------- |
| `code`      | `string`        | —       | **必填**；原始源码字符串，内部自动按 JSX/TS 分词高亮 |
| `style`     | `CSSProperties` | —       | 会合并覆盖默认深色主题                               |
| `className` | `string`        | —       | 自定义类名                                           |

**默认主题（写死在组件，不走 Less）：**

```css
padding: 20px 24px;
background: #2b2118;
border: 1px solid #3d3028;
border-radius: 20px;
font-size: 14px;
line-height: 1.7;
font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
font-weight: 600;
color: #e8d5bc;
white-space: pre;
overflow: auto;
tab-size: 4;
```

**Token 调色板（`COLORS` 常量）：**

| token     | 颜色      | 覆盖                                                                |
| --------- | --------- | ------------------------------------------------------------------- | -------- |
| comment   | `#6b5e50` | `/* */`、`//`                                                       |
| string    | `#a8d4a0` | 反引号 / 单双引号、数字                                             |
| keyword   | `#d4a0e0` | `import/export/const/return/async/...`、`true/false/null/undefined` |
| react     | `#e06c75` | `React/useState/useEffect/FC/ReactNode/CSSProperties/...`           |
| component | `#80c0e0` | 大写驼峰标识符（JSX 组件名、类型名）                                |
| func      | `#61afef` | 小写标识符后跟 `(`                                                  |
| prop      | `#e8c87a` | 标识符后跟 `=`（JSX props / 赋值）                                  |
| jsx       | `#f0a870` | `<Tag`、`</Tag`、`/>`                                               |
| operator  | `#d4b896` | `{}[]();,` 和 `+-\*/=<>&                                            | ^~?:` 等 |
| default   | `#e8d5bc` | 其余文本                                                            |

> 不支持 `language` prop；非 JS/TS 代码（Python/Shell/SQL）会按通用规则着色，显示可能不准确。不带 copy 按钮、行号或折行。

---

### Radio

源码：`src/components/Radio/radio.module.less`。

| 属性            | small   | middle  | large                        |
| --------------- | ------- | ------- | ---------------------------- |
| 外盒尺寸        | 18×18px | 22×22px | 28×28px                      |
| 圆角            | 12px    | 14px    | 16px（**重圆方形，非正圆**） |
| 边框宽          | 2px     | 2px     | 2px                          |
| 内勾尺寸        | 10×10px | 12×12px | 16px font-size               |
| label font-size | 12px    | 14px    | 16px                         |

```css
/* 默认（未选） */
background: rgb(247, 243, 223);
border: 2px solid #c4b89e;

/* hover */
border-color: #19c8b9;
transform: translateY(-1px);

/* checked */
background: #19c8b9; /* @primary-color */
border-color: #11a89b; /* @primary-color-active */
/* 内白色勾 pop 动画 */
@keyframes radio-pop {
    0% {
        transform: scale(0.4);
        opacity: 0;
    }
    60% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
/* 时长 0.15s ease（@motion-duration-fast） */

/* label */
color: #725d42;
font-weight: 500;
letter-spacing: 0.01em;
/* checked label */
color: #794f27;

/* focus-visible */
outline: 2px solid #f5c31c; /* 注意：Radio 用 @focus-yellow=#f5c31c，而非 Checkbox/Input 的 #ffcc00 */
outline-offset: 2px;

/* disabled */
opacity: 0.55;
cursor: not-allowed;
background: #f0ece2;
border-color: #d4c9b4;
/* label */
color: #c4b89e;

/* group 布局 */
/* horizontal */
display: flex;
gap: 12px;
/* vertical */
display: flex;
flex-direction: column;
gap: 8px;
```

---

### Tooltip

源码：`src/components/Tooltip/tooltip.module.less`。`default` 与 `island` 是两套**完全不同**的视觉，不要混淆。

**default 变体（标准温色 bubble）：**

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

/* 距 trigger 间距 */
gap: 10px;
/* 入场动画：translateY 4px → 0，平滑显隐 */

/* 三角箭头 */
size: 8px;
border-radius: 2px; /* 8px 菱形，圆角 2px —— 不是 6px */
```

**island 变体（透明有机气泡）：**

```css
background: transparent; /* 容器透明，无 border 无 shadow */
border: none;
box-shadow: none;
/* 注意：island **不是** Modal blob clip-path —— 它是 transparent 容器 + 内部内容自带气泡 */

/* 内容区 */
padding: 12px 20px;
max-width: 280px;
font-weight: 600;
line-height: 1.55;
text-align: center;

/* 箭头：14px 圆点（borderless）或 10px 菱形（bordered） */
.islandArrow {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    filter: drop-shadow(0 4px 14px rgba(121, 79, 39, 0.14));
}
```

placement 12 种：`top` / `top_start` / `top_end` / `bottom` / `bottom_start` / `bottom_end` / `left` / `left_start` / `left_end` / `right` / `right_start` / `right_end`。

---

### Loading（全屏遮罩）

源码：`src/components/Loading/loading.module.less`。**项目无 GSAP / MotionPath**，全部用原生 CSS + SVG `stroke-dasharray` 实现。

```css
/* 容器 */
position: absolute; /* 不是 fixed —— 受最近的 positioned 父级约束 */
inset: 0;
background: black; /* 不是 #f8f8f0 */
overflow: hidden;

/* 揭示遮罩（消失时 mask 半径渐变） */
--mask-r: 0;
mask: radial-gradient(circle at center, transparent var(--mask-r), black calc(var(--mask-r) + 1px));
/* active=false 时把 --mask-r 过渡到大值，得到圆形渐隐效果 */

/* SVG spinner */
color: #19c8b9; /* @primary-color mint teal */
animation: spin 1s linear infinite;
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 内圈 circle 的 dash 动画 */
animation: dash 1.5s ease-in-out infinite;
@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}
```

> 按钮 inline 的 loading 斜纹（`-45deg` mint 条纹 28.28px）属于 Button 组件，不要与 `<Loading>` 全屏遮罩混为一谈。

---

### Table

源码：`src/components/Table/table.module.less`。**外壳无实线 border**；行分隔靠 `::after` 的 dashed 横线实现；hover 行是对角青色条纹。

```css
/* 外壳 wrapper */
background: rgb(247, 243, 223);
border-radius: 20px;
padding: 6px; /* 仅 6px 内边距，无 border */
box-sizing: border-box;

/* 表头 cell */
padding: 16px 20px;
font-size: 14px;
font-weight: 700;
color: #725d42; /* 不是 #794f27 */
letter-spacing: 0.02em;
/* 表头底部分隔（::after dashed） */
border-image: none;
&::after {
    content: '';
    border-bottom: 1px dashed rgb(240, 232, 216);
    /* dash pattern: 6px on / 6px off */
}

/* body cell */
padding: 14px 20px; /* 无固定行高 48px —— 由 padding 撑起 */
font-size: 14px;
font-weight: 500;
color: #725d42;
line-height: 1.6;
/* 行底分隔线同样是 1px dashed (6/6) rgb(240,232,216) */

/* striped 偶数行 */
background: rgba(248, 248, 240, 0.6); /* 不是 rgba(247,243,223,0.5) */

/* row hover —— 对角青色条纹 + 内圆角剪切 */
background: repeating-linear-gradient(-45deg, rgba(25, 200, 185, 0.6) 0 10px, rgba(14, 196, 182, 0.6) 10px 20px);
background-size: 28.28px 28.28px;
clip-path: inset(0 0 0 0 round 30px);
color: #3d2e1e;

/* 空状态 */
padding: 60px 20px;
text-align: center;
color: #9f927d;
/* icon */
opacity: 0.5;

/* loading 遮罩 */
background: rgba(247, 243, 223, 0.8);
backdrop-filter: blur(2px);
/* spinner */
color: #19c8b9;
```

---

### Form

源码：`src/components/Form/Form.tsx` + `FormItem.tsx` + `useForm.ts` + `Form.module.less` + `types.ts`。**表单容器**：类主流表单库 API，提供 `Form.useForm()` 实例、`<Form.Item>` 字段注册、校验、提交、reset 等命令式能力。`FormItem` 通过 `React.cloneElement` 劫持子控件的 `value` / `onChange`（受控注入），子控件无需自己实现受控逻辑。

```css
/* 容器 .island-form —— 沿用中性灰色系，不走 parchment 暖棕系 */
.island-form {
    color: rgba(0, 0, 0, 0.85); /* label / 正文 —— 故意不是 #725d42 */
    font-size: 14px;
    line-height: 1.6;
    box-sizing: border-box;
}

/* horizontal：垂直堆叠，每个 item 是 24 列 CSS Grid（label/wrapper 相邻无 column-gap）*/
.island-form-horizontal {
    display: flex;
    flex-direction: column;
    gap: 8px; /* @form-item-gap */
}
.island-form-horizontal .island-form-item {
    display: grid;
    grid-template-columns: repeat(24, minmax(0, 1fr));
    align-items: baseline;
    row-gap: 8px;
    /* 注意：label 与 wrapper 之间不加 column-gap，否则 23 × 16px = 368px 撑爆 form */
}

/* vertical：item 是 block，label 独占一行 */
.island-form-vertical .island-form-item {
    display: block;
}
.island-form-vertical .island-form-item-label {
    display: block;
    margin-bottom: 6px; /* @vertical-gap */
}

/* inline：item 横向排开 */
.island-form-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* @inline-gap */
}
.island-form-inline .island-form-item {
    flex: 0 0 auto;
}

/* label */
.island-form-item-label {
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    white-space: nowrap;
    line-height: 1.6;
}
.island-form-item-label-required::before {
    content: '*';
    color: #ff4d4f;
    margin-right: 4px;
}
.island-form-item-label-colon::after {
    content: ':';
    margin: 0 4px 0 2px;
}

/* 尺寸只缩放 label 字号 */
.island-form-small .island-form-item-label { font-size: 12px; }
.island-form-middle .island-form-item-label { font-size: 14px; } /* default */
.island-form-large .island-form-item-label { font-size: 16px; }

/* 控件容器 + 错误文案槽 */
.island-form-item-control-input {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 32px;
}
.island-form-item-explain {
    min-height: 22px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    line-height: 1.5;
    margin-top: 4px;
}
/* 状态色（采用中性灰 + 主流状态色，不走 parchment token）*/
.island-form-item-has-error  .island-form-item-explain { color: #ff4d4f; }
.island-form-item-has-warning.island-form-item-explain { color: #faad14; }
.island-form-item-has-success.island-form-item-explain { color: #52c41a; }
.island-form-item-is-validating .island-form-item-explain { color: #1677ff; }

/* 全局 disabled */
.island-form-disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
```

> Form 内部中性灰 `rgba(0,0,0,0.85)` / `#ff4d4f` / `#faad14` / `#52c41a` / `#1677ff` **故意不走** `src/styles/variables.less` 的 parchment 暖棕 token，是为了贴合主流表单库的视觉习惯（用户在表单场景对这些状态色有既定认知）。请勿"为了统一"把它们改成 `#725d42` / `#e05a5a` 等。
>
> `FormItem` 必须在 `<Form>` 或 `<Form.Provider>` 内使用，否则抛 `Form.Item must be used inside <Form>`。disabled / size / `status="error"` 三个 prop 会通过 cloneElement 透传给子控件。

---

### Wallet

源码：`src/components/Wallet/Wallet.tsx` + `wallet.module.less`。**金额展示组件**：橄榄黄胶囊 + 治愈海岛钱袋图标上凸，数字带描边。3 种尺寸预设（CSS 变量驱动），数字按千分位自动格式化。

```css
@wallet-pill-fill:   #b3a046; /* 橄榄黄主色 */
@wallet-pill-shadow: #8e7d2c;
@wallet-halo:        #fffbe7; /* 奶油外发光 */
@wallet-text:        #ffffff;
@wallet-text-shadow: rgba(91, 78, 30, 0.55);

/* 根容器 —— inline-flex，顶部留出钱袋上凸空间 */
.wallet {
    --wallet-pill-w: 132px;
    --wallet-pill-h: 42px;
    --wallet-bag: 50px;
    --wallet-text-size: 17px;
    --wallet-halo: 4px;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: var(--wallet-pill-w);
    padding-top: calc(var(--wallet-bag) * 0.7); /* 70% 钱袋上凸 */
    user-select: none;
    line-height: 1;
}

/* 尺寸预设 */
.size-small  { --wallet-pill-w: 96px;  --wallet-pill-h: 32px; --wallet-bag: 38px; --wallet-text-size: 12px; --wallet-halo: 3px; }
.size-large  { --wallet-pill-w: 176px; --wallet-pill-h: 54px; --wallet-bag: 66px; --wallet-text-size: 22px; --wallet-halo: 6px; }
/* medium 是默认，不写修饰类 */

/* 钱袋 slot（图标）：absolute 上凸于 pill */
.bagSlot {
    position: absolute;
    left: 50%;
    top: 0;
    width: var(--wallet-bag);
    height: var(--wallet-bag);
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
    filter: drop-shadow(0 4px 6px rgba(91, 78, 30, 0.18));
}

/* pill 本体：胶囊 + 多层 box-shadow */
.pill {
    position: relative;
    width: 100%;
    height: var(--wallet-pill-h);
    border-radius: 999px;
    background: @wallet-pill-fill;
    /* 多层阴影：内暗部 + 内描边 + 外 halo + 投影 */
    box-shadow:
        inset 0 -6px 0 rgba(91, 78, 30, 0.18),
        inset 0 0 0 2px rgba(91, 78, 30, 0.12),
        0 0 0 var(--wallet-halo) @wallet-halo,
        0 6px 14px rgba(91, 78, 30, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
}

/* 数字文本 */
.value {
    font-family: 'Nunito', 'Noto Sans SC', system-ui, sans-serif;
    font-weight: 800;
    font-size: var(--wallet-text-size);
    color: @wallet-text;
    letter-spacing: 0.04em;
    /* 双层 text-shadow 模拟描边 */
    text-shadow:
        0 2px 0 @wallet-text-shadow,
        0 0 1px @wallet-text-shadow;
    font-variant-numeric: tabular-nums; /* 防数字跳动 */
    padding: 0 12px;
    white-space: nowrap;
}

/* hover：钱袋 0.5s 跳动 */
.wallet:hover .bagSlot {
    animation: walletBagBounce 0.5s ease-in-out;
}
@keyframes walletBagBounce {
    0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
    35%      { transform: translateX(-50%) translateY(-8px) rotate(-6deg); }
    70%      { transform: translateX(-50%) translateY(-2px) rotate(3deg); }
}
```

> 数字格式化（JS 逻辑，不是 CSS）：`value` 为 `number` 时按千分位插入 `thousandSeparator`（默认 `,`，传 `""` 关闭）；`string` 原样展示；`undefined` / `null` 显示 `00,000`。
>
> 默认钱袋图标是内置 `assets/img/icons/items/item-022.png`（治愈海岛风格钱袋），通过 `icon` prop 传任意 `ReactNode` 可替换。注意：内部使用了 `<Icon src={bagIcon} />` 的隐藏 `src` 入参（Icon 既支持 `name` 走 ICON_LIST，也支持 `src` 走任意图源）。

---

### Icon

源码：`src/components/Icon/Icon.tsx`。SVG 单色图标库，10 个内置图标（arrow-down、arrow-up、check、close、copy、leaf、menu、search、star、trash 等——以运行时 `ICON_LIST` 导出为准）。支持 `name`（查 ICON_LIST）和隐藏的 `src`（任意图源，Wallet 内部用此加载钱袋 PNG）。

```css
.icon {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor; /* 颜色继承父级 color */
    width: 1em;
    height: 1em;
}
```

> 用法：`<Icon name="check" size={20} color="#19c8b9" />`。`size` 默认 16，`color` 默认 `currentColor`。`src` 模式走 `<img>` 渲染，可用于内置图标库之外的任意图标源。

---

### Select

源码：`src/components/Select/Select.tsx`。受控下拉选择器，hover/click 展开下拉面板，选项支持键盘 ↑/↓ 导航 + Enter 确认 + Esc 取消。

```css
.select {
    position: relative;
    display: inline-block;
    min-width: 120px;
}
.selectTrigger {
    /* 与 Input 同款：border 1.5px solid @border-color-light，radius 12px */
    /* 背景 rgb(247,243,223)，hover/focus 切换到 @border-color-hover */
}
.selectDropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 240px;
    overflow-y: auto;
    background: #fffcef;
    border: 1.5px solid @border-color-light;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12);
    z-index: 1000;
}
.selectOption {
    padding: 8px 12px;
    cursor: pointer;
    color: @text-color-body;
}
.selectOption.isActive { background: @primary-color-bg; color: @primary-color; }
.selectOption.isSelected { font-weight: 600; }
```

> 完整交互（键盘 roving、滚动到选中项、点击外部关闭）见 `src/components/Select/Select.tsx`，API 见 `AI_USAGE.md §1`。

---

### Tag

源码：`src/components/Tag/Tag.tsx` + `tag.module.less`。**胶囊标签**：与 Card 调色板完全对齐（12 品牌色 + 1 默认），3 种尺寸 × 3 种变体（solid / outlined / dashed），支持 closable / onClick / disabled。

```less
// 根容器 —— 全胶囊，1.5px transparent border（为变体预留空间，避免抖动）
.tag {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    line-height: 1;
    font-family: inherit;
    font-weight: 600;
    border-radius: 999px;
    border: 1.5px solid transparent;
    transition: all 0.2s ease;
    user-select: none;
    white-space: nowrap;
}

// ---------- Size ----------
.size-small  { height: 24px; line-height: 21px; padding: 0 10px; font-size: 12px; }
.size-medium { height: 29px; line-height: 26px; padding: 0 12px; font-size: 13px; } /* 默认 */
.size-large  { height: 34px; line-height: 31px; padding: 0 16px; font-size: 15px; }

// ---------- Variant ----------
.variant-solid    { background: rgb(247, 243, 223); color: #8f734f; border-color: #d4c4a8; }
.variant-outlined { background: transparent;    color: #8f734f; border-color: #c4b89e; }
.variant-dashed   { background: transparent;    color: #8f734f; border-color: #c4b89e; border-style: dashed; }

// ---------- Color（与 Card 的 .pattern-{color} 边框色完全一致） ----------
// solid 变体：背景 = 饱和色，文字 #fff
.color-app-pink-solid         { background: #f8a6b2; border-color: #f8a6b2; color: #fff; }
.color-purple-solid           { background: #b77dee; border-color: #b77dee; color: #fff; }
.color-app-blue-solid         { background: #889df0; border-color: #889df0; color: #fff; }
.color-app-yellow-solid       { background: #f7cd67; border-color: #f7cd67; color: #fff; }
.color-app-orange-solid       { background: #e59266; border-color: #e59266; color: #fff; }
.color-app-teal-solid         { background: #82d5bb; border-color: #82d5bb; color: #fff; }
.color-app-green-solid        { background: #8ac68a; border-color: #8ac68a; color: #fff; }
.color-app-red-solid          { background: #fc736d; border-color: #fc736d; color: #fff; }
.color-lime-green-solid       { background: #d1da49; border-color: #d1da49; color: #fff; }
.color-yellow-green-solid     { background: #ecdf52; border-color: #ecdf52; color: #fff; }
.color-brown-solid            { background: #9a835a; border-color: #9a835a; color: #fff; }
.color-warm-peach-pink-solid  { background: #e18c6f; border-color: #e18c6f; color: #fff; }

// outlined / dashed 变体：文字 + 边框 = 饱和色，背景透明
.color-app-pink-outlined,
.color-app-pink-dashed         { color: #f8a6b2; border-color: #f8a6b2; }
.color-purple-outlined,
.color-purple-dashed           { color: #b77dee; border-color: #b77dee; }
.color-app-blue-outlined,
.color-app-blue-dashed         { color: #889df0; border-color: #889df0; }
.color-app-yellow-outlined,
.color-app-yellow-dashed       { color: #f7cd67; border-color: #f7cd67; }
.color-app-orange-outlined,
.color-app-orange-dashed       { color: #e59266; border-color: #e59266; }
.color-app-teal-outlined,
.color-app-teal-dashed         { color: #82d5bb; border-color: #82d5bb; }
.color-app-green-outlined,
.color-app-green-dashed        { color: #8ac68a; border-color: #8ac68a; }
.color-app-red-outlined,
.color-app-red-dashed          { color: #fc736d; border-color: #fc736d; }
.color-lime-green-outlined,
.color-lime-green-dashed       { color: #d1da49; border-color: #d1da49; }
.color-yellow-green-outlined,
.color-yellow-green-dashed     { color: #ecdf52; border-color: #ecdf52; }
.color-brown-outlined,
.color-brown-dashed            { color: #9a835a; border-color: #9a835a; }
.color-warm-peach-pink-outlined,
.color-warm-peach-pink-dashed  { color: #e18c6f; border-color: #e18c6f; }

// ---------- Close button ----------
.close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 2px;
    margin-right: -4px;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: rgba(0, 0, 0, 0.08);
    color: inherit;
    font-size: 14px;
    line-height: 1;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.15s ease;
}
.close:hover { background: rgba(0, 0, 0, 0.18); }
.close:disabled { cursor: not-allowed; opacity: 0.5; }

// ---------- Interactive ----------
.is-clickable { cursor: pointer; }
.is-clickable:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(61, 52, 40, 0.12);
}
.is-clickable:active { transform: translateY(0); }
.is-clickable:focus-visible {
    outline: 2px solid var(--animal-focus-yellow, #f5c31c);
    outline-offset: 2px;
}
.is-disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
```

> **关键设计决策**：
> - 与 Card 共用同一 12 色调色板（直接复用其 `pattern-{color}` 边框色），保证「卡片 + 标签」组合视觉一致。
> - `border: 1.5px solid transparent` 默认占位，让 outlined/dashed 切换时不会因为 border 出现/消失导致尺寸抖动。
> - `closable` × 按钮的 click `stopPropagation`，不会冒泡触发 `onClick`。
> - 提供 `onClick` 时整个 tag 升格为 `role="button"` + `tabIndex={0}`，支持 Enter / Space 键盘触发。

---

## 3. Demo 布局精确规范

这是 Demo 站（`demo/App.tsx`）的实际布局数值，用于还原完整页面效果：

### 整体布局

```css
/* 页面背景 */
/* 首页 */
background:
    url(home_bg.svg) center/cover no-repeat,
    #7dc395;
/* 组件页 */
background: url(content_bg_pc.jpg) center fixed;

/* Sidebar */
width: 220px;
min-width: 220px;
background: url(menu_bg.svg) center/cover no-repeat;
```

### Sidebar 精确值

```css
/* 顶部 Logo 区 */
padding: 20px 16px 12px;
border-bottom: 1px solid #e8e2d6;
font-weight: 700;
font-size: 15px;
color: #725d42;
letter-spacing: -0.3px;

/* Logo 图片 */
width: 24px;
height: 24px;
margin-right: 8px;

/* 菜单列表 */
padding: 8px 0;

/* 分类标题 */
padding: 12px 16px 4px;
font-size: 11px;
color: #a0936e;
font-weight: 600;
letter-spacing: 0.5px;
text-transform: uppercase;

/* 菜单项 */
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

### 主内容区

```css
/* 桌面 */
padding: 32px 40px;

/* 底部装饰图（桌面端，固定定位）*/
left: 220px;
width: calc(100% - 220px);
z-index: 0;
pointer-events: none;
```

### 移动端适配

```css
/* 顶栏 */
height: 52px; padding: 0 12px;
background: rgba(255, 252, 244, 0.92);
backdrop-filter: blur(8px);
border-bottom: 1px solid #e8e2d6;
z-index: 50;

/* 按钮 */ font-size: 20px; color: #725d42; padding: 4px 8px; border-radius: 8px;

/* 主内容区 padding-top */ 68px;

/* 抽屉 */
width: 240px; z-index: 99;
box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
/* 遮罩 */ background: rgba(0, 0, 0, 0.35); z-index: 98;
```

---

## 4. HomePage 精确规范

```css
/* Hero 区域 */
padding: 60px 40px 40px;
min-height: 80vh;

/* 主标题 */
font-size: 50px;
font-weight: 700;
color: #fff9e6;
text-shadow: 0px 4px 1px rgba(0, 0, 0, 0.4);
margin: 0 0 12px;

/* 版本 Badge */
font-size: 12px;
font-weight: 600;
padding: 2px 10px;
border-radius: 10px;
background: #e6f9f6;
color: #19c8b9;
margin-left: 8px;

/* 副标题 */
font-size: 17px;
color: #7c5734;
line-height: 1.7;
margin: 0 0 28px;
max-width: 520px;

/* Logo 图片 */
width: 172px;
height: 172px;

/* Section */
padding: 48px 40px;
max-width: 960px;
margin: 0 auto;

/* Section 标题 */
font-size: 24px;
font-weight: 700;
color: #725d42;
margin: 0 0 8px;

/* Section 描述 */
font-size: 14px;
color: #7c5734;
margin-bottom: 32px;

/* Feature 网格 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 16px;

/* Feature Card hover */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(114, 93, 66, 0.15);

/* Feature 图标 hover */
transform: scale(1.1) rotate(-4deg);

/* 代码块 */
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

**代码高亮配色：**

| Token 类型              | 颜色                            |
| ----------------------- | ------------------------------- |
| 注释                    | `#6b5e50`（italic, weight 400） |
| 字符串                  | `#a8d4a0`                       |
| JSX 标签                | `#f0a870`                       |
| 关键字 / npm/pnpm       | `#f0a870`                       |
| 命令动词（install/add） | `#a8d4a0`                       |
| 括号 `{}`               | `#d4b896`                       |
| 箭头 `=>`               | `#d4a0e0`                       |
| CSS 变量名              | `#e8c87a`                       |
| `:root`                 | `#f0a870`                       |
| 十六进制色值            | `#8ab8e0`                       |

---

## 5. 自实现 CSS 变量完整模板

不依赖组件库时，在 `:root` 中声明以下变量：

```css
:root {
    /* 字体 */
    --animal-font: Nunito, 'Noto Sans SC', -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;

    /* 主色 */
    --animal-primary: #19c8b9;
    --animal-primary-hover: #3dd4c6;
    --animal-primary-active: #11a89b;
    --animal-primary-bg: #e6f9f6;

    /* 文字 */
    --animal-text: #794f27;
    --animal-text-body: #725d42;
    --animal-text-secondary: #9f927d;
    --animal-text-muted: #8a7b66;
    --animal-text-disabled: #c4b89e;

    /* 背景 */
    --animal-bg: #f8f8f0;
    --animal-bg-content: rgb(247, 243, 223);
    --animal-bg-disabled: #f0ece2;

    /* 边框 */
    --animal-border: #c4b89e;
    --animal-border-hover: #a89878;

    /* 圆角 */
    --animal-radius-sm: 12px;
    --animal-radius: 18px;
    --animal-radius-lg: 24px;
    --animal-radius-pill: 50px;

    /* 3D 阴影 */
    --animal-shadow-btn: #bdaea0;
    --animal-shadow-input: #d4c9b4;
    --animal-shadow-switch: #5a9e1e;

    /* 游戏特殊色 */
    --animal-focus-yellow: #ffcc00;
    --animal-focus-yellow-d: #e0b800;
    --animal-sidebar-active: #b7c6e5;
    --animal-sidebar-hover: #d6dff0;

    /* 状态 */
    --animal-success: #6fba2c;
    --animal-warning: #f5c31c;
    --animal-error: #e05a5a;

    /* 动效 */
    --animal-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --animal-duration-fast: 0.15s;
    --animal-duration: 0.25s;
    --animal-duration-slow: 0.35s;
}
```

---

## 6. 7 条设计铁律

1. **颜色**：大地棕色系文字 + 薄荷青绿主色 + 奶油米白背景，禁止纯黑 / 冷灰
2. **圆角**：最小 12px；按钮、输入框必须 50px pill 形
3. **立体感**：3D 厚阴影（`0 Npx 0 0 [暗色]` + hover 上浮 / active 下压）**仅用于 primary 按钮 / danger-primary 按钮 / Input / Switch**；default / dashed / text / link 按钮用柔和 elevation 阴影（`0 2px 4px / 0 3px 10px rgba(61,52,40,...)`）即可
4. **字体**：Nunito（Google Fonts）圆体，按钮/标题 weight 600+，从不使用细体
5. **动效**：过渡 0.15~0.35s，缓动 `cubic-bezier(0.4, 0, 0.2, 1)`，平滑不生硬
6. **焦点**：输入框用黄色 `#ffcc00`，按钮用青绿 `#19c8b9`，绝不用蓝色
7. **禁止**：直角矩形交互元素、纯黑文字 `#000`、冷蓝色调、扁平无阴影设计

---

## 7. 新组件文件结构模板

```
src/components/MyComponent/
├── MyComponent.tsx          # 组件逻辑（必须设置 displayName）
├── myComponent.module.less  # CSS Modules 样式
└── index.ts                 # 统一导出
```

`src/index.ts` 追加：

```ts
// 方式 A：组件用 default export
export { default as MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent/MyComponent';

// 方式 B：组件用 named export（如 Checkbox / CodeBlock / Select / Icon / Tabs 当前采用）
export { MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent';
```

> 仓库内两种风格并存；新增组件选一种即可，只要 `src/index.ts` 能成功 re-export。

Less 模板（直接使用设计 token）：

```less
@import '../../styles/variables.less';

.container {
    background: @bg-color-content; // rgb(247,243,223)
    color: @text-color-body; // #725d42
    border: @border-width solid @border-color-light; // 2px solid #c4b89e
    border-radius: @border-radius-base; // 18px
    font-family: @font-family;
    font-weight: 500;
    letter-spacing: 0.01em;
    transition: all @motion-duration-base @motion-ease;
    box-shadow: 0 3px 0 0 @shadow-input; // #d4c9b4

    &:hover:not(.disabled) {
        border-color: @border-color-hover; // #a89878
        transform: translateY(-1px);
        box-shadow: 0 4px 0 0 @shadow-input;
    }

    &:focus-within {
        border-color: @focus-yellow; // #ffcc00
        box-shadow:
            0 3px 0 0 @focus-yellow-dark,
            0 0 0 3px rgba(255, 204, 0, 0.15);
    }

    &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: @bg-color-disabled;
        color: @text-color-disabled;
        border-color: @shadow-input;
        box-shadow: none;
    }
}
```

TSX 模板：

```tsx
import React from 'react';
import styles from './myComponent.module.less';
import classNames from 'classnames';

export interface MyComponentProps {
    /** 尺寸 */
    size?: 'small' | 'middle' | 'large';
    /** 禁用 */
    disabled?: boolean;
    /** 子元素 */
    children?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

const MyComponent: React.FC<MyComponentProps> = ({ size = 'middle', disabled = false, children, className, style }) => {
    const cls = classNames(styles.container, styles[size], { [styles.disabled]: disabled }, className);

    return (
        <div className={cls} style={style}>
            {children}
        </div>
    );
};

MyComponent.displayName = 'MyComponent';
export default MyComponent;
```

---

## 8. Demo 页面规范

每个组件在 `demo/components/<ComponentName>/index.tsx` 创建演示页：

```tsx
import { CodeBlock, ApiTable } from '../../tools';

const props = [{ name: 'size', type: "'small' | 'middle' | 'large'", default: "'middle'", description: '尺寸' }];

export default function MyComponentDemo() {
    return (
        <div>
            <h2>MyComponent</h2>
            <CodeBlock code={`<MyComponent size="large">内容</MyComponent>`} />
            <ApiTable data={props} />
        </div>
    );
}
```

并在 `demo/ComponentPage.tsx` 中注册路由，同时把 `title / desc` 写入 `demo/pageInfo.ts`：

```ts
// demo/pageInfo.ts — 供 App 静态导入的轻量元信息
export const PAGE_INFO: Record<string, { title: string; desc: string }> = {
    button: { title: 'Button 按钮', desc: '...' },
    input: { title: 'Input 输入框', desc: '...' },
    switch: { title: 'Switch 开关', desc: '...' },
    card: { title: 'Card 卡片', desc: '...' },
    collapse: { title: 'Collapse 折叠面板', desc: '...' },
    cursor: { title: 'Cursor 光标', desc: '...' },
    time: { title: 'Time 时间', desc: '...' },
    phone: { title: 'Phone 手机', desc: '...' },
    footer: { title: 'Footer 底部装饰', desc: '...' },
    modal: { title: 'Modal 弹窗', desc: '...' },
    typewriter: { title: 'Typewriter 打字机', desc: '...' },
    'divider-comp': { title: 'Divider 分割线', desc: '...' },
    icon: { title: 'Icon 图标', desc: '...' },
    select: { title: 'Select 选择器', desc: '...' },
    checkbox: { title: 'Checkbox 多选框', desc: '...' },
    radio: { title: 'Radio 单选框', desc: '...' },
    tooltip: { title: 'Tooltip 文字提示', desc: '...' },
    tabs: { title: 'Tabs 标签页', desc: '...' },
    title: { title: 'Title 章节标题', desc: '...' },
    loading: { title: 'Loading 加载', desc: '...' },
    table: { title: 'Table 表格', desc: '...' },
    form: { title: 'Form 表单', desc: '...' },
    wallet: { title: 'Wallet 钱袋', desc: '...' },
    codeblock: { title: 'CodeBlock 代码高亮', desc: '...' },
};
```

新增组件务必追加对应条目，否则 Demo 侧栏不会展示。

---

## 9. 新增组件 Checklist

- [ ] Google Fonts 已在 `index.html` 或样式入口引入（Nunito + Noto Sans SC）
- [ ] Props interface 从组件文件导出
- [ ] 所有 props 有 JSDoc 注释（中文 OK）
- [ ] 有状态组件同时支持受控（`value`）和非受控（`defaultValue`）模式
- [ ] `disabled` 状态：cursor: not-allowed + opacity 0.5~0.6 + 移除阴影
- [ ] 颜色优先引用 `variables.less` token，避免硬编码 hex
- [ ] 阴影使用暖色调（`#bdaea0` / `#d4c9b4` / `rgba(61,52,40,...)`），非冷黑
- [ ] hover 时 `translateY(-1px 或 -4px)` + 阴影加深
- [ ] active 时 `translateY(2px)` + 阴影减小
- [ ] 焦点：输入类用 `#ffcc00`，按钮类用 `#19c8b9`
- [ ] 动画使用 `@motion-duration-*` 和 `@motion-ease` token
- [ ] 组件从 `src/index.ts` 导出
- [ ] Demo 页创建于 `demo/components/`
- [ ] Demo 在 `demo/ComponentPage.tsx` 中注册
- [ ] `demo/pageInfo.ts` 追加 `{ title, desc }` 元信息
