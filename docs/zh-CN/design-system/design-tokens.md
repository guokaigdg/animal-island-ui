# Design Tokens

## 色彩系统

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
@bg-color-input: #fffbe7; // 输入框背景
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

## 字体

设计语言使用两款圆体字，按场景有两种交付方式：

- **使用组件库时**：两款字体以 `@fontsource` woff2 资源打进包内，`import 'animal-island-ui/style'` 即完成加载，不需要任何字体 `<link>`
- **脱离组件库自行实现风格时**（单文件 HTML、demo、外部工具）：按以下方式从 Google Fonts 引入：

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

## 间距 / 圆角 / 边框

```
间距：xs=4px  sm=8px  md=12px  lg=16px  xl=24px
圆角：sm=12px  base=18px  lg=24px  pill=50px（按钮/输入框）
边框：默认 2px solid，输入框 2.5px，大尺寸输入框 3px
```

---

## 阴影

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

## 动效

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
