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

## 概述

animal-island-ui 是一套受《治愈系海岛风格》启发的 React + TypeScript UI 组件库。
设计语言核心：**温暖大地色系 + 大圆角 pill 形 + 游戏按键立体感 + 柔和动效 + 有机不规则形状**。

- 源码：`src/components/<ComponentName>/`
- Demo 站：`demo/`
- 构建：Vite (library mode) + `vite.config.ts`（库）/ `vite.config.demo.ts`（Demo）
- 样式系统：Less Modules + `src/styles/variables.less` 设计 token

### 全量组件清单（15 个）

从 `src/index.ts` 导出：

| 组件 | 职责 | 交互 | 装饰 / 纯展示 |
|---|---|---|---|
| `Button` | 按钮，5 种类型 × 3 种尺寸 | ✓ | |
| `Input` | 输入框，3 种尺寸 + clear/prefix/suffix | ✓ | |
| `Switch` | 开关，默认/小号 | ✓ | |
| `Modal` | SVG blob 裁切弹窗 | ✓ | |
| `Card` | 容器，`default`/`title`，13 种 IslandPhone 配色 | | ✓ |
| `Collapse` | 手风琴（CSS Grid，无 JS 过渡） | ✓ | |
| `Select` | 下拉选择器，支持搜索 | ✓ | |
| `Icon` | SVG 图标库 | | ✓ |
| `Time` | HUD 实时时钟 | | ✓ |
| `Phone` | IslandPhone 3×3 应用网格 | | ✓ |
| `Footer` | 底部装饰图（`sea`/`tree`） | | ✓ |
| `Divider` | 装饰分割线，5 种风格 | | ✓ |
| `Cursor` | 游戏手指光标包裹器 | | ✓ |
| `Typewriter` | 打字机效果，保留 ReactNode 结构 | | ✓ |
| `Tabs` | 标签页切换，平滑动画 | ✓ | |

类型导出：`ButtonProps/ButtonType/ButtonSize`、`InputProps/InputSize`、`SwitchProps/SwitchSize`、`ModalProps`、`CardProps/CardType/CardColor`、`FooterProps/FooterType`、`CollapseProps`、`CursorProps`、`TimeProps`、`PhoneProps`、`DividerProps`、`TypewriterProps`、`SelectProps`、`IconProps`、`TabsProps/TabItem`。

---

## 1. Design Tokens

### 色彩系统

```less
// 主色（薄荷青绿）
@primary-color:        #19c8b9;
@primary-color-hover:  #3dd4c6;
@primary-color-active: #11a89b;
@primary-color-bg:     #e6f9f6;

// 文字（温暖棕色系）
@text-color:           #794f27;    // 主文字（header/sidebar）
@text-color-body:      #725d42;    // 正文（组件内文字）
@text-color-secondary: #9f927d;    // 次级文字
@text-color-muted:     #8a7b66;    // 浅棕（modal body）
@text-color-disabled:  #c4b89e;    // 禁用

// 边框
@border-color:         #9f927d;
@border-color-light:   #c4b89e;    // 输入框边框
@border-color-hover:   #a89878;    // 输入框 hover

// 背景（奶油米白）
@bg-color:             #f8f8f0;    // 主背景
@bg-color-content:     rgb(247, 243, 223);  // 内容区（Modal、Card）
@bg-color-secondary:   #f0e8d8;
@bg-color-disabled:    #f0ece2;
@bg-color-input:       rgb(247, 243, 223);  // 输入框背景
@bg-color-input-dis:   #ece8dc;    // 输入框禁用

// 状态色
@success-color:        #6fba2c;
@success-color-active: #5a9e1e;
@warning-color:        #f5c31c;
@warning-color-active: #dba90e;
@error-color:          #e05a5a;
@error-color-active:   #c94444;

// 游戏特殊色
@focus-yellow:         #ffcc00;    // 焦点高亮（非蓝色）
@focus-yellow-dark:    #e0b800;    // 焦点阴影
@sidebar-active-bg:    #B7C6E5;    // 侧边栏选中背景
@sidebar-hover-bg:     #d6dff0;    // 侧边栏 hover 背景

// 3D 阴影色
@shadow-btn:           #bdaea0;    // 按钮 3D 阴影
@shadow-input:         #d4c9b4;    // 输入框 3D 阴影
@shadow-switch-on:     #5a9e1e;    // Switch 开启 3D 阴影
```

**IslandPhone 应用调色板**（Card `color` prop 可选值）：

| color 值 | 背景色 | 文字色 |
|---|---|---|
| default | `rgb(247, 243, 223)` | `#725d42` |
| app-pink | `#f8a6b2` | `#fff` |
| purple | `#b77dee` | `#fff` |
| app-blue | `#889df0` | `#fff` |
| app-yellow | `#f7cd67` | `#725d42` |
| app-orange | `#e59266` | `#fff` |
| app-teal | `#82d5bb` | `#fff` |
| app-green | `#8ac68a` | `#fff` |
| app-red | `#fc736d` | `#fff` |
| lime-green | `#d1da49` | `#3d5a1a` |
| yellow-green | `#ecdf52` | `#725d42` |
| brown | `#9a835a` | `#fff` |
| warm-peach-pink | `#e18c6f` | `#fff` |

---

### 字体

项目使用三款 Google Fonts 圆体字，**必须**按以下方式引入，本地未安装时通过在线地址加载：

```html
<!-- 在 index.html <head> 中引入 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Zen+Maru+Gothic:wght@400;500;700&family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

或在 CSS / Less 入口文件顶部：

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700&family=Zen+Maru+Gothic:wght@400;500;700&display=swap');
```

```css
font-family: Nunito, 'Noto Sans SC', 'Zen Maru Gothic',
  -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

| 字体 | 用途 | Google Fonts key |
|---|---|---|
| **Nunito** | 主字体，拉丁字符 | `family=Nunito` |
| **Noto Sans SC** | 中文字体，简体覆盖 | `family=Noto+Sans+SC` |
| **Zen Maru Gothic** | 日文字体 | `family=Zen+Maru+Gothic` |

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
box-shadow: 0 3px 10px 0 rgba(61, 52, 40, 0.10);   /* 基础 */
box-shadow: 0 8px 24px 0 rgba(61, 52, 40, 0.14);   /* 较大 */
box-shadow: 0 4px 10px rgba(107, 92, 67, 0.42);    /* Card */

/* 游戏按键立体阴影（最重要特征）*/
box-shadow: 0 5px 0 0 #bdaea0;   /* 按钮默认 */
box-shadow: 0 6px 0 0 #bdaea0;   /* 按钮 hover */
box-shadow: 0 1px 0 0 #bdaea0;   /* 按钮 active */
box-shadow: 0 3px 0 0 #d4c9b4;   /* 输入框 */
box-shadow: 0 2px 0 0 #d4c9b4;   /* 小号输入框 */
box-shadow: 0 4px 0 0 #d4c9b4;   /* 大号输入框 */
box-shadow: 0 3px 0 0 #5a9e1e;   /* Switch 开启态 */
box-shadow: 0 2px 0 0 #5a9e1e;   /* Switch 小号开启态 */
```

---

### 动效

```css
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);   /* 通用 */
transition: all 0.15s;                                  /* 快速（clear 按钮等）*/
transition: all 0.3s ease;                              /* 卡片 */
transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);  /* 手风琴 */

/* Hover：上浮 */
transform: translateY(-1px);   /* 按钮 / 输入框 */
transform: translateY(-2px);   /* Switch handle */
transform: translateY(-4px);   /* 卡片 */

/* Active：下压（游戏按键反馈）*/
transform: translateY(2px);    /* 按钮 active */

/* 出现动画 */
@keyframes animal-zoom-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes animal-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ac-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 2. 组件精确样式规范

### Button

| 属性 | small | middle | large |
|---|---|---|---|
| height | 32px | **45px** | 48px |
| padding | `0 16px` | `0 20px` | `0 32px` |
| font-size | 12px | 14px | 16px |
| border-radius | 12px | **50px** | 24px |
| border-width | 2px | 2px | 2px |

**primary 按钮精确值：**
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

**loading 斜纹动画（精确值）：**
```css
background: #0ec4b6;
border: 4px solid #4de2da;
color: #fff;
background-image: repeating-linear-gradient(
  -45deg,
  #0ec4b6, #0ec4b6 10px,
  #01b0a7 10px, #01b0a7 20px
);
background-size: 28.28px 28.28px;
animation: animal-btn-loading 1s linear infinite;

@keyframes animal-btn-loading {
  0%   { background-position: 0 0; }
  100% { background-position: -28.28px 0; }
}
```

**danger primary 按钮：**
```css
color: #fff;
box-shadow: 0 5px 0 0 #c94444;  /* error-active */
```

---

### Input

| 属性 | small | middle | large |
|---|---|---|---|
| height | 32px | 40px | 48px |
| padding | `0 14px` | `0 18px` | `0 22px` |
| font-size | 12px | 14px | 16px |
| border-radius | 40px | 50px | 50px |
| border-width | 2.5px | 2.5px | **3px** |
| box-shadow | `0 2px 0 0 #d4c9b4` | `0 3px 0 0 #d4c9b4` | `0 4px 0 0 #d4c9b4` |

**精确颜色值：**
```css
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
box-shadow: 0 3px 0 0 #d4c9b4;

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
box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);

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
width: 20px; height: 20px;
margin-left: 4px;
color: #c4b89e;
font-size: 13px; font-weight: 700;
border-radius: 50%;
transition: all 0.15s;
/* hover */ color: #725d42; background: rgba(114, 93, 66, 0.1);
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
width: 21px; height: 21px;
top: 2px; left: 2px;
background: rgb(247, 243, 223);
border: 2px solid #c4b89e;
border-radius: 50%;
box-shadow: 0 3px 0 0 #bdaea0;
transform: translateY(-2px);   /* 悬浮效果 */

/* 开启态 */
background: #86d67a;
border-color: #6fba2c;
box-shadow: inset 0 2px 4px rgba(90, 158, 30, 0.2);
/* handle 开启后 left */
left: calc(100% - 24px);
border-color: #6fba2c;
box-shadow: 0 3px 0 0 #5a9e1e;

/* focus-visible */
outline: 2px solid #ffcc00;
outline-offset: 2px;

/* disabled */
opacity: 0.5;
```

**small 尺寸：**
```css
min-width: 38px; height: 20px; border-width: 2px;
/* handle */ width: 14px; height: 14px; top: 1px; left: 1px;
box-shadow: 0 2px 0 0 #bdaea0;
/* 开启 handle left */ left: calc(100% - 16px);
box-shadow: 0 2px 0 0 #5a9e1e;
```

**inner 文字（checkedChildren/unCheckedChildren）：**
```css
font-size: 11px; font-weight: 700; color: #fff;
line-height: 1; letter-spacing: 0.02em;
text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
padding: 0 8px 0 28px;   /* 未开启 */
padding: 0 28px 0 8px;   /* 开启 */
/* small 版 */ padding: 0 6px 0 20px; font-size: 9px;
```

**loading spinner：**
```css
width: 11px; height: 11px;
border: 2px solid #6fba2c;
border-right-color: transparent;
border-radius: 50%;
animation: animal-spin 0.6s linear infinite;
/* 关闭态 */ border-color: #a89878;
@keyframes animal-spin { to { transform: rotate(360deg); } }
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
box-shadow: 0 4px 10px rgba(107, 92, 67, 0.42);
transition: all 0.3s ease;
/* hover */ transform: translateY(-4px);

/* title 类型 */
background: #fdfdf5;
border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px;
padding: 12px 32px;
font-weight: 600;
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
/* 激活状态 */
.tabItem.active {
    background: rgba(25, 200, 185, 0.15);
    color: #19c8b9;
    font-weight: 600;
    box-shadow: 0 3px 0 0 #d4c9b4;
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

@keyframes leafWiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
}

/* 内容区 */
.tabContent {
    padding: 24px;
    animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
```

---

### Modal

**SVG clip-path 完整 path d 值（精确还原 blob 轮廓）：**
```jsx
<svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
  <defs>
    <clipPath id="animal-modal-clip" clipPathUnits="objectBoundingBox">
      <path d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006
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
        L0.501,0.005" />
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
font-size: 28px; font-weight: 700;
color: rgba(114, 93, 66, 1);
padding-bottom: 15px;

/* 关闭按钮 */
width: 32px; height: 32px;
font-size: 22px;
color: rgba(114, 93, 66, 0.6);
border-radius: 50%;
transition: all 0.2s;
/* hover */ background: rgba(114, 93, 66, 0.1); color: rgba(114, 93, 66, 1);

/* body */
font-size: 20px; font-weight: 600; line-height: 1.6;
color: #8a7b66;
padding-bottom: 20px;

/* footer */
gap: 12px;

/* 普通按钮 */
height: 40px; padding: 0 24px;
font-size: 18px;
border: 2px solid rgba(114, 93, 66, 0.3);
border-radius: 39.81px;
transition: all 0.2s; line-height: 1;
/* hover */ border-color: rgba(114,93,66,0.6); background: rgba(114,93,66,0.08);

/* 主按钮（确认）*/
color: rgba(114, 93, 66, 1);
background: rgba(255, 204, 0, 1);     /* 游戏黄色！*/
border-color: rgba(255, 204, 0, 1);
/* hover */ background: rgba(255,204,0,0.85); border-color: rgba(255,204,0,0.85);
```

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
  width: 527px; height: 788px;
  background: #F8F4E8;           /* 奶油米 */
  border-radius: 136px;           /* 超大圆角，近似胶囊 */
  overflow: hidden;
}
.homeScreen {
  height: 100%;
  padding-top: 40px;
  background: #F8F4E8;
  background-size: 100% 200%;
  animation: grasswave 8s ease-in-out infinite;
  display: flex; flex-direction: column; align-items: center;
}
@keyframes grasswave {
  0%, 100% { background-position: 0% 0%; }
  50%      { background-position: 0% 100%; }
}
```

**顶部时间栏：**
```css
.dateDisplay        { padding: 0 70px 31px 70px; text-align: center; }
.dateDisplayHeader  { display:flex; justify-content:space-between; align-items:center;
                      font-size: 32px; font-weight: 800; letter-spacing: 2px; color: #DDDBCC; }
.blink              { font-size: 32px; font-weight: 800; color: #DDDBCC;
                      animation: blink 1s steps(1) infinite; vertical-align: text-bottom; }
@keyframes blink    { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
.dayText            { font-size: 48px; font-weight: 800; color: #725C4E;
                      letter-spacing: 2px; height: 56px; margin-top: 20px; }
```

**3×3 应用网格：**
```css
.appsGrid   { display: grid; grid-template-columns: repeat(3, 1fr);
              gap: 32px; padding: 8px; flex: 1;
              align-content: center; justify-content: center; }
.appItem    { width: 123px; height: 123px;
              border-radius: 45px;        /* 圆角正方形 */
              position: relative;
              display: flex; justify-content: center; align-items: center; }
.appItem:hover .appIcon { animation: iconBounce 0.3s ease-in-out forwards; }
.appIcon    { width: 100%; height: 100%;
              background-repeat: no-repeat; background-position: center;
              background-size: 70% auto; }
.appItemOffset { overflow: hidden; }
.appIconOffset { transform: translateY(10px); }

@keyframes iconBounce {
  0%   { transform: scale(1) rotate(0deg); }
  50%  { transform: scale(1.2) rotate(-5deg); }
  100% { transform: scale(1.1) rotate(-4deg); }
}
```

**应用数据结构（`src/components/Phone/Phone.tsx`）：**

| id | iconClass | 背景色 | offset | hasNewMessage |
|---|---|---|---|---|
| camera       | iconCamera       | `#B77DEE` |  | ✓ |
| app          | iconApp          | `#889DF0` | ✓ |  |
| encyclopedia | iconEncyclopedia | `#F7CD67` |  |  |
| diy          | iconDiy          | `#E59266` |  |  |
| shopping     | iconDesign       | `#F8A6B2` |  |  |
| variant      | iconMap          | `#82D5BB` |  | ✓ |
| design       | iconVariant      | `#8AC68A` |  |  |
| map          | iconHelicopter   | `#FC736D` |  |  |
| chat         | iconChat         | `#D1DA49` |  |  |

每个 iconClass 都绑定一个 `background-image: url('./img/icon-*.svg')`，`iconApp` 特殊使用 `background-size: 100% auto`（其他是 `70% auto`）。可用图标资源：`icon-miles/camera/chat/encyclopedia/design/diy/helicopter/map/shopping/variant.svg`，以及状态图标 `wifi.svg` / `location.svg` / `page.svg`。

**小红点（新消息）：**
```css
.badge {
  position: absolute; top: 0; left: 0;
  width: 28px; height: 28px; border-radius: 50%;
  background: #FF544A;
  border: 5px solid #F8F4E8;       /* 奶油米描边，形成游戏风徽章 */
}
```

**底部状态图标：**
```css
.iconWifi     { width: 79px; height: 29px;  background: url('./img/wifi.svg') center/contain no-repeat; }
.iconLocation { width: 36px; height: 36px;  background: url('./img/location.svg') center/contain no-repeat; }
.iconPage     { width: 65px; height: 32px;  background: url('./img/page.svg') center/contain no-repeat; }
.pageIndicator{ display: flex; justify-content: center; align-items: center;
                margin-top: 74px; }
```

**行为：** 内部 `useEffect + setInterval(1000)` 更新时间，`12 小时制 + AM/PM + 零填充分钟`，冒号闪烁 1s 一个周期。组件无业务回调，纯展示。

---

### Footer

```tsx
<Footer type="sea" />   // 默认：海浪
<Footer type="tree" />  // 森林树
```

```less
.footer       { width: 100%; height: 80px;
                background: url('./img/footer-sea.svg') center/contain no-repeat; }
.tree         { background-image: url('./img/footer-tree.webp');
                height: 60px;
                background-size: cover;
                background-position: bottom center; }
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
.divider { width: 100%; height: 12px;
           background: url('./img/divider-line-brown.svg') center/contain no-repeat; }
.line-teal   { background-image: url('./img/divider-line-teal.svg'); }
.line-white  { background-image: url('./img/divider-line-white.png'); }
.line-yellow { background-image: url('./img/divider-line-yellow.svg'); }
.wave-yellow { background-image: url('./img/wave-yellow.svg'); }
```

默认 SVG 色值参考：`#D8D0C3`（米褐），`viewBox="0 0 297 14"`。

---

### Cursor

```tsx
<Cursor>
  <App />   {/* 此范围内所有元素变为游戏手指光标 */}
</Cursor>
```

样式文件为 **普通 CSS**（非 module）：
```css
.animal-cursor,
.animal-cursor * {
  cursor: url('./cursor-icon.png') 4 0, auto !important;
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

| name | type | default | 说明 |
|---|---|---|---|
| `children` | `ReactNode` | — | 要逐字打出的内容，**保留原有元素结构 / 换行 / 样式** |
| `speed` | `number (ms)` | `90` | 每字间隔 |
| `trigger` | `unknown` | — | 值变化即重新播放（通常传递弹窗 open 次数或递增 key） |
| `autoPlay` | `boolean` | `true` | `false` 直接全量显示 |
| `onDone` | `() => void` | — | 播放完成回调 |

**实现要点：**
- `countText(node)`：递归统计 ReactNode 的纯文本长度
- `renderTruncated(node, state)`：按剩余字符数递归裁剪，`React.cloneElement` 保留原节点与样式
- `useEffect` 依赖 `[total, speed, trigger, autoPlay]`，内部 `setInterval` 按步递增 `count`
- **无样式文件**，不包裹任何额外 DOM（返回 `<>...</>`），对布局零影响

---

## 3. Demo 布局精确规范

这是 Demo 站（`demo/App.tsx`）的实际布局数值，用于还原完整页面效果：

### 整体布局

```css
/* 页面背景 */
/* 首页 */ background: url(home_bg.svg) center/cover no-repeat, #7DC395;
/* 组件页 */ background: url(content_bg_pc.jpg) center fixed;

/* Sidebar */
width: 220px; min-width: 220px;
background: url(menu_bg.svg) center/cover no-repeat;
```

### Sidebar 精确值

```css
/* 顶部 Logo 区 */
padding: 20px 16px 12px;
border-bottom: 1px solid #e8e2d6;
font-weight: 700; font-size: 15px;
color: #725d42; letter-spacing: -0.3px;

/* Logo 图片 */
width: 24px; height: 24px; margin-right: 8px;

/* 菜单列表 */
padding: 8px 0;

/* 分类标题 */
padding: 12px 16px 4px;
font-size: 11px; color: #a0936e;
font-weight: 600; letter-spacing: 0.5px;
text-transform: uppercase;

/* 菜单项 */
margin: 1px 5px;
height: 40px; padding: 0 16px;
padding-left: 26px;
font-weight: 600; font-size: 14px;
border-radius: 12px;
transition: all 0.15s;

/* inactive */ color: #8a7b66; background: transparent;
/* inactive hover */ background: #d6dff0;
/* active */ color: #fff; background: #B7C6E5;
```

### 主内容区

```css
/* 桌面 */
padding: 32px 40px;

/* 底部装饰图（桌面端，固定定位）*/
left: 220px;
width: calc(100% - 220px);
z-index: 0; pointer-events: none;
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
font-size: 50px; font-weight: 700;
color: #FFF9E6;
text-shadow: 0px 4px 1px rgba(0, 0, 0, 0.4);
margin: 0 0 12px;

/* 版本 Badge */
font-size: 12px; font-weight: 600;
padding: 2px 10px; border-radius: 10px;
background: #e6f9f6; color: #19c8b9;
margin-left: 8px;

/* 副标题 */
font-size: 17px; color: #7c5734; line-height: 1.7;
margin: 0 0 28px; max-width: 520px;

/* Logo 图片 */
width: 172px; height: 172px;

/* Section */
padding: 48px 40px; max-width: 960px; margin: 0 auto;

/* Section 标题 */
font-size: 24px; font-weight: 700; color: #725d42; margin: 0 0 8px;

/* Section 描述 */
font-size: 14px; color: #7c5734; margin-bottom: 32px;

/* Feature 网格 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 16px;

/* Feature Card hover */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(114, 93, 66, 0.15);

/* Feature 图标 hover */
transform: scale(1.1) rotate(-4deg);

/* 代码块 */
max-width: 600px; margin: 0 auto;
padding: 20px 28px;
background: #2b2118;
border: 1px solid #3d3028;
border-radius: 20px;
font-size: 13px; font-weight: 600;
color: #e8d5bc; line-height: 1.8;
```

**代码高亮配色：**

| Token 类型 | 颜色 |
|---|---|
| 注释 | `#6b5e50`（italic, weight 400）|
| 字符串 | `#a8d4a0` |
| JSX 标签 | `#f0a870` |
| 关键字 / npm/pnpm | `#f0a870` |
| 命令动词（install/add）| `#a8d4a0` |
| 括号 `{}` | `#d4b896` |
| 箭头 `=>` | `#d4a0e0` |
| CSS 变量名 | `#e8c87a` |
| `:root` | `#f0a870` |
| 十六进制色值 | `#8ab8e0` |

---

## 5. 自实现 CSS 变量完整模板

不依赖组件库时，在 `:root` 中声明以下变量：

```css
:root {
  /* 字体 */
  --animal-font: Nunito, 'Noto Sans SC', 'Zen Maru Gothic',
    -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;

  /* 主色 */
  --animal-primary:        #19c8b9;
  --animal-primary-hover:  #3dd4c6;
  --animal-primary-active: #11a89b;
  --animal-primary-bg:     #e6f9f6;

  /* 文字 */
  --animal-text:           #794f27;
  --animal-text-body:      #725d42;
  --animal-text-secondary: #9f927d;
  --animal-text-muted:     #8a7b66;
  --animal-text-disabled:  #c4b89e;

  /* 背景 */
  --animal-bg:             #f8f8f0;
  --animal-bg-content:     rgb(247, 243, 223);
  --animal-bg-disabled:    #f0ece2;

  /* 边框 */
  --animal-border:         #c4b89e;
  --animal-border-hover:   #a89878;

  /* 圆角 */
  --animal-radius-sm:      12px;
  --animal-radius:         18px;
  --animal-radius-lg:      24px;
  --animal-radius-pill:    50px;

  /* 3D 阴影 */
  --animal-shadow-btn:     #bdaea0;
  --animal-shadow-input:   #d4c9b4;
  --animal-shadow-switch:  #5a9e1e;

  /* 游戏特殊色 */
  --animal-focus-yellow:   #ffcc00;
  --animal-focus-yellow-d: #e0b800;
  --animal-sidebar-active: #B7C6E5;
  --animal-sidebar-hover:  #d6dff0;

  /* 状态 */
  --animal-success:        #6fba2c;
  --animal-warning:        #f5c31c;
  --animal-error:          #e05a5a;

  /* 动效 */
  --animal-ease:           cubic-bezier(0.4, 0, 0.2, 1);
  --animal-duration-fast:  0.15s;
  --animal-duration:       0.25s;
  --animal-duration-slow:  0.35s;
}
```

---

## 6. 7 条设计铁律

1. **颜色**：大地棕色系文字 + 薄荷青绿主色 + 奶油米白背景，禁止纯黑 / 冷灰
2. **圆角**：最小 12px；按钮、输入框必须 50px pill 形
3. **立体感**：所有可点击元素加底部厚阴影 `0 Npx 0 0 [暗色]`，hover 上浮，active 下压
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
export { default as MyComponent } from './components/MyComponent'
export type { MyComponentProps } from './components/MyComponent/MyComponent'
```

Less 模板（直接使用设计 token）：

```less
@import '../../styles/variables.less';

.container {
  background: @bg-color-content;      // rgb(247,243,223)
  color: @text-color-body;            // #725d42
  border: @border-width solid @border-color-light;  // 2px solid #c4b89e
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
    border-color: @focus-yellow;       // #ffcc00
    box-shadow: 0 3px 0 0 @focus-yellow-dark,
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
import React from 'react'
import styles from './myComponent.module.less'
import classNames from 'classnames'

export interface MyComponentProps {
  /** 尺寸 */
  size?: 'small' | 'middle' | 'large'
  /** 禁用 */
  disabled?: boolean
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

const MyComponent: React.FC<MyComponentProps> = ({
  size = 'middle',
  disabled = false,
  children,
  className,
  style,
}) => {
  const cls = classNames(
    styles.container,
    styles[size],
    { [styles.disabled]: disabled },
    className
  )

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  )
}

MyComponent.displayName = 'MyComponent'
export default MyComponent
```

---

## 8. Demo 页面规范

每个组件在 `demo/components/<ComponentName>/index.tsx` 创建演示页：

```tsx
import { CodeBlock, ApiTable } from '../../tools'

const props = [
  { name: 'size', type: "'small' | 'middle' | 'large'", default: "'middle'", description: '尺寸' },
]

export default function MyComponentDemo() {
  return (
    <div>
      <h2>MyComponent</h2>
      <CodeBlock code={`<MyComponent size="large">内容</MyComponent>`} />
      <ApiTable data={props} />
    </div>
  )
}
```

并在 `demo/ComponentPage.tsx` 中注册路由，同时把 `title / desc` 写入 `demo/pageInfo.ts`：

```ts
// demo/pageInfo.ts — 供 App 静态导入的轻量元信息
export const PAGE_INFO: Record<string, { title: string; desc: string }> = {
  button:        { title: 'Button 按钮',       desc: '...' },
  input:         { title: 'Input 输入框',      desc: '...' },
  switch:        { title: 'Switch 开关',       desc: '...' },
  card:          { title: 'Card 卡片',         desc: '...' },
  collapse:      { title: 'Collapse 折叠面板', desc: '...' },
  cursor:        { title: 'Cursor 光标',       desc: '...' },
  time:          { title: 'Time 时间',         desc: '...' },
  phone:         { title: 'Phone 手机',        desc: '...' },
  footer:        { title: 'Footer 底部装饰',   desc: '...' },
  modal:         { title: 'Modal 弹窗',        desc: '...' },
  typewriter:    { title: 'Typewriter 打字机', desc: '...' },
  'divider-comp':{ title: 'Divider 分割线',    desc: '...' },
}
```

新增组件务必追加对应条目，否则 Demo 侧栏不会展示。

---

## 9. 新增组件 Checklist

- [ ] Google Fonts 已在 `index.html` 或样式入口引入（Nunito + Noto Sans SC + Zen Maru Gothic）
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
