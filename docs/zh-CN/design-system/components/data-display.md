# Data display — 精确样式规范

承载内容展示的组件：Table、Pagination、CodeBlock、Tag、Badge、Image、Avatar、CountUp、Calendar 的精确取值

## Table（虚线行分隔，纯色 hover）

源码：`src/components/Table/table.module.less`。**外壳无实线 border**；行分隔靠 `::after` 的 dashed 横线实现；hover 行是纯色浅青背景。

```css
/* outer wrapper */
background: rgb(247, 243, 223);
border-radius: 20px;
padding: 6px; /* only 6px of padding, no border */
box-sizing: border-box;

/* header cell */
padding: 16px 20px;
font-size: 14px;
font-weight: 700;
color: #725d42; /* not #794f27 */
letter-spacing: 0.02em;
/* header bottom separator (::after dashed) */
border-image: none;
&::after {
    content: '';
    border-bottom: 1px dashed rgb(240, 232, 216);
    /* dash pattern: 6px on / 6px off */
}

/* body cell */
padding: 14px 20px; /* no fixed 48px row height — the padding sets it */
font-size: 14px;
font-weight: 500;
color: #725d42;
line-height: 1.6;
/* the row bottom separator is likewise 1px dashed (6/6) rgb(240,232,216) */

/* striped even rows */
background: rgba(248, 248, 240, 0.6); /* not rgba(247,243,223,0.5) */

/* row hover — 纯色浅青 + 内圆角裁剪 */
background: #d6f0ea;
border-radius: 30px;
color: #3d2e1e;

/* empty state */
padding: 60px 20px;
text-align: center;
color: #9f927d;
/* icon */
opacity: 0.5;

/* loading mask */
background: rgba(247, 243, 223, 0.8);
backdrop-filter: blur(2px);
/* spinner */
color: #19c8b9;
```

**内置分页** — 传入 `pagination`（`PaginationProps` 对象，默认 `false` 关闭），Table 在客户端对 `dataSource` 切片，并在外壳内部渲染 `Pagination` 底部条：

```css
/* 分页容器 — 在表格外壳内右对齐 */
display: flex;
justify-content: flex-end;
padding: 10px 16px 8px;
```

`pagination.current` / `pagination.pageSize` 受控时优先；否则由 Table 内部维护页码状态。其余 `PaginationProps`（见下）全部透传，`onChange` 签名同为 `(page, pageSize)`。

## Pagination（幽灵格子分页器，DatePicker 视觉语言）

源码：`src/components/Pagination/pagination.module.less`。**与 DatePicker 面板同语言的幽灵格子分页器**：透明底页码格子 hover 浅青色，当前页为青色正圆实底；每页条数切换器 / 跳转输入框沿用 DatePicker 触发区的奶油胶囊 + 3px 硬底阴影。页数超过 7 时显示省略号。

```less
// 根节点 — inline-flex 行，gap 2px，颜色 #725d42
.pagination {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-family: 'Nunito', 'Noto Sans SC', sans-serif;
    font-size: 14px;
    user-select: none;
}

// 总条数文本（showTotal）
.total { margin-right: 10px; font-size: 13px; font-weight: 600; color: #a09080; }

// 页码 / 前后翻页按钮 — 幽灵正圆（同 DatePicker dayCell / navBtn）
.item {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #725d42;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.15s ease;
    // hover（非当前页、非禁用）：背景 #e6f9f6 + 文字 #19c8b9（同 dayCell:hover）
    // focus-visible：outline 2px solid #ffcc00，offset 1
    // disabled：文字 #d4c9b4，cursor not-allowed，背景保持透明
}

// 当前页 — 青色正圆实底白字（同 dayCellSelected）
.active {
    background: #19c8b9;
    color: #fff;
    font-weight: 700;
    cursor: default;
    &:hover { background: #3dd4c6; } // 加深，无位移
}

// 页码区间之间的省略号
.ellipsis { width: 24px; height: 32px; color: #c4b89e; font-weight: 900; letter-spacing: 1px; }

// 每页条数触发器（showSizeChanger）— DatePicker 触发区样式
.sizeTrigger {
    height: 32px;
    padding: 0 14px;
    border: none;
    border-radius: 50px;
    background: #fffbe7;
    color: #8a7b66;
    font-size: 12px;
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    // hover：box-shadow 0 3px 0 0 #c4b89e + 文字 #725d42
    // focus-visible：0 3px 0 0 #e0b800 + 0 0 0 3px rgba(255, 204, 0, 0.15)（同 trigger-open）
}

// 选项列表 — 向上弹出（bottom: calc(100% + 8px)），DatePicker panel 样式
.sizeList {
    padding: 8px;
    background: #fffdf7;
    border: 1.5px solid #e8dcc8;
    border-radius: 20px;
    box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12);
    animation: size-list-in 0.2s cubic-bezier(0.4, 0, 0.2, 1); // 淡入 + 上浮 6px
}
.sizeOption       { min-width: 96px; padding: 7px 16px; border-radius: 10px; font-size: 13px; font-weight: 500;
                    &:hover { background: #e6f9f6; color: #19c8b9; } }
.sizeOptionActive { background: #19c8b9; color: #fff; font-weight: 700; &:hover { background: #3dd4c6; } }

// 快速跳转输入框（showQuickJumper）— 奶油胶囊 + 金色 focus（同 trigger-open）
.jumperInput {
    width: 52px;
    height: 32px;
    border: none;
    border-radius: 50px;
    background: #fffbe7;
    color: #725d42;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    // focus：box-shadow 0 3px 0 0 #e0b800 + 0 0 0 3px rgba(255, 204, 0, 0.15)
    // disabled：背景 #ece8dc，opacity 0.5
}
```

> **关键设计决策**：
> - 分页器刻意复用 DatePicker 面板语言（幽灵格子、`#e6f9f6` hover、青色 `#19c8b9` 选中圆、`#fffdf7` 弹层 + `#e8dcc8` 边框），让日期网格与页码网格读起来是同一个产品家族。
> - 页码序列遵循经典分页器：首尾页恒显、当前页 ±1 邻域、`pageCount > 7` 时显示 `···` 省略号。
> - `current` / `pageSize` 传入即受控；否则走内部状态（`defaultCurrent` 1、`defaultPageSize` 10）。页码与每页条数变化都会触发 `onChange(page, pageSize)`；仅每页条数变化触发 `onShowSizeChange(current, size)`，其中 `current` 已按新页数收敛。
> - 每页条数切换器为自包含弹层（点击外部 / Escape 关闭），不复用 `Select`，分页器因此不依赖表单组件。
> - a11y：根节点为 `<nav aria-label="分页">`；当前页带 `aria-current="page"`；前后翻页按钮带 `aria-label` 并使用原生 `disabled`；跳转输入框带 `aria-label`。

## CodeBlock（深色主题，JSX/TS + shell 分词）

Props：

| name        | type            | default | 说明                                                                     |
| ----------- | --------------- | ------- | ------------------------------------------------------------------------ |
| `code`      | `string`        | —       | **必填**；原始源码字符串。JSX/TS 代码自动分词高亮；以 shell 命令（`npm/yarn/pnpm/npx/node/git/...`）开头的行则按 shell 高亮 |
| `style`     | `CSSProperties` | —       | 会合并覆盖默认深色主题                               |
| `className` | `string`        | —       | 自定义类名                                           |
| `copyable`  | `boolean`       | `true`  | 是否显示复制按钮                                     |
| `onCopy`    | `(code) => void`| —       | 代码复制成功后的回调                                 |

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

复制按钮显示时，如果使用者没有传入自定义 `padding` / `paddingRight`，组件会在右侧预留 `96px`，避免按钮遮挡首行代码。

**Token 调色板（`COLORS` 常量）：**

| token     | 颜色      | 覆盖                                                               |
| --------- | --------- | ------------------------------------------------------------------ |
| comment   | `#6b5e50` | `/* */`、`//`                                                      |
| string    | `#a8d4a0` | 反引号 / 单双引号、数字                                            |
| keyword   | `#d4a0e0` | `import/export/const/return/async/...`、`true/false/null/undefined` |
| react     | `#e06c75` | `React/useState/useEffect/FC/ReactNode/CSSProperties/...`           |
| component | `#80c0e0` | 大写驼峰标识符（JSX 组件名、类型名）                               |
| func      | `#61afef` | 小写标识符后跟 `(`                                                 |
| prop      | `#e8c87a` | 标识符后跟 `=`（JSX props / 赋值）                                 |
| jsx       | `#f0a870` | `<Tag`、`</Tag`、`/>`                                              |
| operator  | `#d4b896` | `{}[]();,` 和 `+-\*/=<>&\|^~?:` 等                                 |
| default   | `#e8d5bc` | 其余文本                                                           |

右上角复制按钮使用 Clipboard API，并显示“已复制”或“复制失败”反馈；传入 `copyable={false}` 可隐藏。不支持 `language` prop、行号或折行。当首行以 shell 命令（`npm/yarn/pnpm/npx/node/git/cd/ls/...`）开头时，代码块自动切换为 shell 高亮：命令名用 `jsx` 色，已知子命令（`install/add/build/git commit/...`）用 `string` 色，flag（`-x` / `--flag`）用 `operator` 色，`//` 注释为斜体 `comment` 色；包名/参数保持默认色。其他非 JS/TS 代码会按通用规则着色，显示可能不准确。

## Tag（胶囊标签，12 色调色板）

源码：`src/components/Tag/Tag.tsx` + `tag.module.less`。**胶囊标签**：与 Card 调色板完全对齐（12 品牌色 + 1 默认），3 种尺寸 × 4 种变体（solid / outlined / dashed / soft），支持 closable / onClick / disabled。

```less
// root — full pill, 1.5px transparent border (reserves space for the variants so nothing jitters)
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
// line-height stays at 1 (inherited from .tag root); vertical centering is handled
// by inline-flex + align-items: center, so size classes only set height / padding / font-size.
// height uses 8px steps (24/32/40); font-size uses 12/14/16.
.size-small  { height: 24px; padding: 0 10px; font-size: 12px; }
.size-medium { height: 32px; padding: 0 12px; font-size: 14px; } /* default */
.size-large  { height: 40px; padding: 0 16px; font-size: 16px; }

// ---------- Variant ----------
.variant-solid    { background: rgb(247, 243, 223); color: #8f734f; border-color: #d4c4a8; }
.variant-outlined { background: transparent;    color: #8f734f; border-color: #c4b89e; }
.variant-dashed   { background: transparent;    color: #8f734f; border-color: #c4b89e; border-style: dashed; }
.variant-soft     { background: #f5f0e6; color: #8f734f; border-color: transparent; }

// ---------- Colour (identical to Card's .pattern-{color} border colours) ----------
// solid variant: background = saturated colour, text #fff
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

// outlined / dashed variants: text + border = saturated colour, transparent background
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

// soft variant: light pastel background + deeper same-hue text, no border
.color-app-pink-soft         { background: #fce4ec; color: #c2185b; }
.color-purple-soft           { background: #f3e5f5; color: #7b1fa2; }
.color-app-blue-soft         { background: #e6f0ff; color: #1565c0; }
.color-app-yellow-soft       { background: #fff8e1; color: #f9a825; }
.color-app-orange-soft       { background: #fff3e0; color: #e65100; }
.color-app-teal-soft         { background: #e0f2f1; color: #00695c; }
.color-app-green-soft        { background: #e8f5e9; color: #2e7d32; }
.color-app-red-soft          { background: #ffebee; color: #c62828; }
.color-lime-green-soft       { background: #f1f8e9; color: #558b2f; }
.color-yellow-green-soft     { background: #f9fbe7; color: #827717; }
.color-brown-soft            { background: #efebe9; color: #4e342e; }
.color-warm-peach-pink-soft  { background: #fbe9e7; color: #bf360c; }

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

## Badge（角标数字，2px 奶油描边）

源码：`src/components/Badge/Badge.tsx` + `badge.module.less`。**角标数字**：钉在被包裹元素右上角的 `<sup>` 胶囊，展示数字、封顶数字（`99+`）或一个纯小圆点；不包裹元素时即为独立使用。调色板与 Card / Tag 共用。

```less
/* 外壳 —— inline-flex，让 sup 相对被包裹元素定位 */
.badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    line-height: 1;
    font-family: inherit;
}

.indicator {
    /* 定位位移抽成变量，让出场动画在独立使用下也能复用同一组 keyframes */
    --badge-shift-x: 50%;
    --badge-shift-y: -50%;

    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translate(var(--badge-shift-x), var(--badge-shift-y));
    transform-origin: 100% 0;
    background: #fc736d; /* app-red，默认色 */
    color: #fff;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    border-radius: 999px; /* 胶囊 */
    border: 2px solid var(--animal-bg-color, #f8f8f0); /* 与 Avatar 一致的奶油贴纸描边 */
    box-shadow: var(--animal-shadow-sm, 0 2px 4px 0 rgba(61, 52, 40, 0.06));
    animation: animal-badge-zoom-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 独立使用 —— 没有覆盖目标：取消位移、奶油描边与投影 */
.standalone .indicator {
    position: static;
    --badge-shift-x: 0;
    --badge-shift-y: 0;
    border-color: transparent;
    box-shadow: none;
}

/* 尺寸 —— medium 为默认；字号按 2px 描边内的净腔定 */
.size-medium { min-width: 20px; height: 20px; padding: 0 6px; font-size: 10px; }
.size-small  { min-width: 16px; height: 16px; padding: 0 4px; font-size: 9px; }

/* 正圆 —— 1–2 位内容锁成正圆 */
.size-medium.circle { width: 20px; min-width: 0; padding: 0; }
.size-small.circle  { width: 16px; min-width: 0; padding: 0; }

/* 小圆点 —— 定义在尺寸类之后，覆盖其宽高 */
.dot { width: 10px; min-width: 0; height: 10px; padding: 0; }
```

**正圆 vs 胶囊** —— 只靠尺寸类时盒子是可长的：加 `0 6px` 内边距后两位数比高度宽，渲染成扁胶囊而不是正圆。所以 `Badge.tsx` 在渲染内容较短时追加 `.circle`，把 `width` 钉死成与 `height` 相同，`999px` 圆角才成立；内容由 `.indicator` 的 flex 居中。

字号按**内腔**而不是外框定。2px 奶油描边吃掉 4px，medium 的 20px 圆只剩 16px 净腔；原来的 12px 字号下 `99` 约 13.5px 宽 —— 占净腔 84%，基本顶到边。所以字号是 10px / 9px 而非 12px / 11px。

判定量的是**最终显示的文本**，数字先经 `String(value)` 转成字符串，与字符串走同一套逻辑：

| 内容 | 形态 | 原因 |
| ---- | ---- | ---- |
| `5`、`12`、`99`、`0` | 正圆 | 1–2 个字符 |
| `新` | 正圆 | 1 个全角字符仍放得下 |
| `100`、`99+`、`999+` | 胶囊 | 3 个字符以上 |
| `热更` | 胶囊 | 2 个全角字符顶破圆直径 |
| `<GiftIcon />` 等 ReactNode | 胶囊 | 无可量文本，盒型由调用方的节点决定 |

**配色** —— 与 Card / Tag 调色板完全一致；浅色底（`app-yellow`、`lime-green`、`yellow-green`）换成深色文字保证数字可读：

```less
.color-app-red         { background: #fc736d; color: #fff; } /* 默认 */
.color-app-pink        { background: #f8a6b2; color: #fff; }
.color-app-orange      { background: #e59266; color: #fff; }
.color-app-yellow      { background: #f7cd67; color: #725d42; }
.color-app-teal        { background: #82d5bb; color: #fff; }
.color-app-green       { background: #8ac68a; color: #fff; }
.color-app-blue        { background: #889df0; color: #fff; }
.color-purple          { background: #b77dee; color: #fff; }
.color-lime-green      { background: #d1da49; color: #3d5a1a; }
.color-yellow-green    { background: #ecdf52; color: #725d42; }
.color-brown           { background: #9a835a; color: #fff; }
.color-warm-peach-pink { background: #e18c6f; color: #fff; }
```

**出场动画** —— `<sup>` 只在可见时才挂载，所以这组 keyframes 恰好只在 0 → N 的切换时播放；`prefers-reduced-motion: reduce` 下关闭：

```less
@keyframes animal-badge-zoom-in {
    from { opacity: 0; transform: translate(var(--badge-shift-x), var(--badge-shift-y)) scale(0.6); }
    to   { opacity: 1; transform: translate(var(--badge-shift-x), var(--badge-shift-y)) scale(1); }
}
```

> **关键设计决策**：
> - 角标是 `<sup>` 元素；`position: absolute` + `translate(50%, -50%)` 让它精确钉在被包裹元素的右上角，`transform-origin: 100% 0` 让弹出动画从该角生长。
> - 2px 奶油描边（`--animal-bg-color`）复用 Avatar 的贴纸描边，角标压在图片 / 图标上时能干净分离，而不是浮在画面上。独立使用时没有需要分离的目标，因此去掉描边、投影与位移。
> - 封顶只对数字与数字字符串生效（`100` → `99+`）；ReactNode 类型的 `count`（如 naive-icons 图标）原样展示。可见文字被封顶时，真实数值仍保留在原生 `title` 中 —— 显式传入 `title` 可覆盖它。
> - 显隐规则：`count` 为空（`null`、`undefined` 或空 / 纯空白字符串）、数值为 `0` / `"0"` 且未开启 `showZero` 时隐藏；`dot` 且数值为 0 时同样隐藏，但 `dot` 未传 `count` 仍会展示。`size` 只作用于数字胶囊 —— 小圆点的盒子尺寸优先。
> - `color` 使用共享的海岛调色板而非自由的 CSS 颜色，角标不会脱离 Card / Tag 的色彩语言。

## Image（衬板相框）

源码：`src/components/Image/image.module.less`。**衬板相框**：默认白色 `#fff`（`color="white"` 为纯白；其他 `color` 渲染 Card `pattern` 同款底色 — 柔和浅色，无花纹）+ 12px 内边距（图片像照片衬板一样内缩）+ 8px 圆角 + `0 8px 14px 0 rgba(0, 0, 0, 0.08)` 柔和投影，内置错误占位。

```less
// 相框外壳
.image {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
    border: none; /* 相框无边框；preview 默认开启时相框是 <button>，显式去除 UA 边框 */
    background: #fff; /* 默认白色；`color` prop 覆盖 */
    padding: 12px; /* 相框内边距，图片像照片衬板一样内缩 */
    border-radius: 8px; /* 圆角固定，不提供 radius prop */
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.08);
    line-height: 0;
    vertical-align: middle;
    flex-shrink: 0;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

// 内层 img — 填满相框，加载完成后淡入
.img        { display: block; width: 100%; height: 100%; opacity: 0; transition: opacity 0.25s ease; }
.loaded .img { opacity: 1; }

// 错误占位 — 相机图标 + 弱化文字
.error { flex-direction: column; gap: 8px; color: #c4b89e; font-size: 13px; font-weight: 500; line-height: 1.5; }
```

**颜色变体** — `color="white"` 渲染纯白 `#fff` 底色；其余每个值（`default` + 12 品牌色）渲染 Card `pattern` 的**底色**（花纹底下的柔和浅色，去掉点状花纹）。每个类同时设置可读的文字色（错误占位中的文字可见）：

```less
// White — 纯白，由 base .image 提供
.image-default         { background: rgb(247, 243, 223); color: #725d42; }
.image-app-pink        { background: #fde4e8; color: #a85565; }
.image-purple          { background: #f0e8ff; color: #6a3a9a; }
.image-app-blue        { background: #e8edff; color: #4a5a8a; }
.image-app-yellow      { background: #fff8e0; color: #7a6528; }
.image-app-orange      { background: #fff0e8; color: #8a4a2a; }
.image-app-teal        { background: #e8faf5; color: #2a6b5a; }
.image-app-green       { background: #e8f5e8; color: #3a6b3a; }
.image-app-red         { background: #ffe8e8; color: #9a3a3a; }
.image-lime-green      { background: #f5f8e0; color: #5a6b28; }
.image-yellow-green    { background: #fffde8; color: #6a5a28; }
.image-brown           { background: #f5f0e0; color: #5a4a2a; }
.image-warm-peach-pink { background: #fff0e8; color: #8a4a2a; }
```

**相框变体**（`variant` prop，默认 `'default'`）。三种相框共用同一 `.image` 外壳：

- `default` — 无内边距、透明底、12px 圆角、分层卡片大阴影。
- `bordered` — 柔和阴影 + 小圆角，配合上方 `color` 浅色底色。
- `stamp` — **邮票相框**：暖白底纸 `#fbfaf5`、14px 内缩、四边齿孔、淡半色调网点（`::after`，4px 径向渐变网格，`opacity: 0.13`）与轻微降饱和。阴影用 `filter: drop-shadow` 实现（`mask` 会裁掉 `box-shadow`），悬浮时邮票上浮（`translateY(-9px) scale(1.03)`）。
  齿孔由四条边的贴边条带构成——每边一条 `radial-gradient` 平铺，孔半径 5px / 孔距 16px（任意宽高比不变形）——再用 `mask-composite: intersect` 求交，因此**四条边**都有齿孔。不要改回「实心基底 − 四条孔带」的 `subtract` 写法：合成算子列表只会逐层作用于过渡，Chrome 下其余边会回退成叠加，导致只有第一条边出现齿孔。

年份为可选文字覆盖层，仅在传入 `stampYear` 时渲染（`pointer-events: none`、`z-index: 2`，位于网点之上）：

```less
// 年份 — 右上角照片上，白字 + 暗阴影
.variant-stamp .stamp-year { position:absolute; right:19px; top:18px; font-size:8px; letter-spacing:.18em; color:rgba(255,255,255,.88); text-shadow:0 1px 3px rgba(0,0,0,.55); }
```

```ts
// 邮票 prop（仅 variant='stamp' 生效，可选）
stampYear?: string; // 发行年份，如「2026」 — 右上角照片上
```

```tsx
<Image src="/photo.jpg" alt="邮票（带年份）" width={240} height={176} variant="stamp" stampYear="2026" />
// 仅齿孔边框、不印文字
<Image src="/photo.jpg" alt="纯邮票边框" width={240} height={176} variant="stamp" />
```

**大图预览**（点击放大，`preview` prop，**默认开启**）。相框升格为 `<button type="button">`（原生支持 Enter / Space，`cursor: zoom-in`）；弹层经 Portal 挂到 `document.body`，避开祖先 `transform` 造成的定位上下文：

```less
// 全屏遮罩 — 与 Modal 同款（--animal-mask-bg，默认 rgba(0,0,0,0.35)），点击关闭
.mask {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--animal-mask-bg);
    animation: animal-image-fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

// dialog — 包裹大图；其 click 被 stopPropagation（只有遮罩能关闭）
.dialog { position: relative; display: inline-flex; line-height: 0; }

// 大图
.previewImg {
    max-width: min(88vw, 1100px);
    max-height: 86vh;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(43, 33, 24, 0.55);
    object-fit: contain;
    animation: animal-image-zoom-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

// 关闭按钮 — 40×40 圆形，浅灰背景 + 白色叉号，纯 CSS 绘制 ×
.closeBtn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
    width: 40px;
    height: 40px;
    border: 1.5px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    background: rgba(216, 220, 226, 0.9);
    color: #fff;
    cursor: pointer;
}
.closeBtn:hover { background: rgba(196, 201, 208, 0.95); transform: scale(1.06); }
.closeBtn:focus-visible { outline: 2px solid #ffcc00; outline-offset: 2px; }
```

> **关键设计决策**：
> - `width` / `height` 落在相框外壳上，`<img>` 以 100% 填满（固定 `object-fit: cover`），并因 12px 内边距内缩。`color="white"` 为纯白 `#fff`，其余 `color` 为 Card `pattern` 同款底色（无花纹）；12px 内边距与 8px 相框圆角由样式表固定，不可配置。相框带柔和投影 `0 8px 14px 0 rgba(0, 0, 0, 0.08)`（无边框）；`overflow: hidden` + `line-height: 0` 保证图片像素级对齐。
> - 加载失败时渲染内置占位，占位以 `role="img"` + `aria-label` 暴露（优先用 `alt`，缺省为「图片加载失败」）。
> - 未加载完成时图片 `opacity: 0`；`onLoad` 后淡入（`.loaded .img`）。
> - **预览无障碍**：打开时聚焦关闭按钮；`Escape` 关闭；Tab 圈定在关闭按钮上（遮罩内唯一可聚焦元素）；关闭后焦点还给触发元素。弹层为 `role="dialog"` + `aria-modal`，名称取自 `alt`，关闭按钮带 `aria-label="关闭预览"`。触发按钮使用黄色 `#ffcc00` 焦点环（`:focus-visible`），取代浏览器默认样式。

## Avatar（圆形 / 圆角方形贴纸头像）

来源：`src/components/Avatar/avatar.module.less`。一个 `<span>`，展示图片 / 图标 / 文字三种内容。尺寸沿用 Button 阶梯：`small` / `middle` / `large` 为 **32 / 40 / 48px**；任意数字 `size` 原样生效。

```css
/* 根元素 */
.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--animal-primary-color-bg); /* #e6f9f6 浅青 */
    color: var(--animal-primary-color);         /* #19c8b9 青绿 */
    font-weight: 600;
    border-radius: 999px; /* 圆形 */
    vertical-align: middle;
}

/* 方形 */
.shape-square { border-radius: 8px; } /* 与 Image 相框圆角一致 */

/* 图片铺满 */
.img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* 文字 / 图标容器 —— 用于 gap 自动缩放测量 */
.string { display: inline-flex; align-items: center; justify-content: center; line-height: 1; white-space: nowrap; }

/* 占位（图标 / 文字）—— 奶油贴纸描边 */
.placeholder { border: 2px solid var(--animal-bg-color); }
```

**文字 / 图标占位** —— 内容为青绿主色，落在浅青 primary-bg 上；2px `--animal-bg-color`（#f8f8f0）描边形成「贴纸」分离感。预设字号 14 / 16 / 20px；数字尺寸按 `max(12, round(size * 0.4))` 推导。**`gap` 自动缩小**：挂载后测量 `.string` 宽度，超过 `size - gap * 2` 时按比例缩小字号（`useLayoutEffect` → `setScale`）——仅文字头像。将 naive-icons 图标组件作为 `children`（元素 type 为函数组件）会创建图标头像，与 `icon` 走同一渲染路径（不参与缩小测量）；字符串 / 数字 children 为文字头像。

**图片加载** —— `<img>` 铺满（`object-fit: cover`，无内边距）。`error` 时重渲染为占位（图标，缺省 naive-icons `UserIcon`，或 `children`），除非 `onError` 返回 `false`。`src` 变化重置加载状态。img 带 `alt`（缺省 `alt=""` 为装饰性图片）；纯默认图标暴露 `role="img"` + `aria-label="avatar"`。

**Avatar.Group** —— `.group` 外壳 `display: inline-flex`；头像通过 `margin-left: calc(-1 * var(--avatar-group-gap))` 相互叠加，gap 变量由 `gap` prop（默认 8px）内联设置。每个头像保留 2px `--animal-bg-color` 描边，让叠加读作「刻意堆叠」而非「裁切」。`maxCount` 裁切子级并渲染 `+N` 胶囊（`styles.avatar` + `placeholder`，可用 `maxStyle` 覆盖样式）；组级 `size` / `shape` 会克隆注入到未显式指定的子 Avatar。`Avatar.Group` 也可经 `Avatar` 静态属性访问（便捷别名）。

## CountUp（计分数字滚动，数字块 + 可选庆祝动效）

源码：`src/components/CountUp/CountUp.tsx` + `count-up.module.less`。

声明式的计分滚动读数：在 `duration` 秒内把 `start` 滚到 `end`。时钟取自 `requestAnimationFrame` 的时间戳（没有 `setInterval` 的累积漂移），`isCounting` 可播放 / 暂停 / 继续且不丢失已用时长，数字块复用 Countdown 的奶油渐变底 —— 结算页和倒计时页因此读起来是同一家族。缓动曲线与数字格式化全部本地实现，没有计时器库。

**props**：
```ts
type CountUpSize = 'small' | 'middle' | 'large';
type CountUpVariant = 'default' | 'island';
type CountUpEasing = 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeOutExpo'
    | ((progress: number) => number);
type CountUpChildren = (state: { value: number; reset: (newStartAt?: number) => void }) => React.ReactNode;

interface CountUpProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'children'> {
    start?: number;                  // 默认 0
    end: number;                     // 必填 —— 总分
    duration?: number;               // 秒，默认 2；0 表示直接到位
    isCounting?: boolean;            // 默认 false；置 false 暂停并保留当前值
    decimalPlaces?: number;          // 默认取 max(decimals(start), decimals(end))
    decimalSeparator?: string;       // 默认 '.'
    thousandsSeparator?: string;     // 默认 ''（不分组）
    easing?: CountUpEasing;          // 默认 'easeOutCubic'
    formatter?: (value: number) => React.ReactNode;   // 优先级最高
    updateInterval?: number;         // 展示值刷新间隔（秒），默认 0 = 每帧
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    size?: CountUpSize;              // 默认 'middle'
    variant?: CountUpVariant;        // 默认 'default'
    bordered?: boolean;              // 默认 false —— 数字块 1.5px 描边
    celebrate?: boolean | { text?: React.ReactNode };   // 默认 false
    onUpdate?: (value: number) => void;
    onComplete?: (elapsedTime: number) => void | { shouldRepeat?: boolean; delay?: number; newStartAt?: number };
    children?: CountUpChildren;      // 渲染函数，替换数字内容
}
```

**外壳与数字块（精确取值）**：
```css
.count-up {                          /* 与 Countdown 同一套面板语言 */
    display: inline-flex;
    align-items: center;
    gap: var(--animal-spacing-sm, 8px);
    color: var(--animal-text-color, #794f27);
    font-family: var(--animal-font-family, 'Nunito', 'Noto Sans SC');
    font-weight: 700;
    border-radius: 20px;
}
.default { padding: 12px 18px; background: var(--animal-bg-color, #fff); box-shadow: var(--animal-shadow-sm, ...); }
.island  { padding: 13px 20px; background: rgb(247, 243, 223); border: 2px dashed #d4c4a8; }

.plate {                             /* 与 Countdown 的 .unit 完全同款 */
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    padding: 3px 8px;
    border-radius: 12px;
    background: linear-gradient(180deg, #fff 0%, #f8f8f0 100%);
}
.island .plate    { background: linear-gradient(180deg, #fffdf4 0%, #f8f8f0 100%); }
.bordered .plate  { border: 1.5px solid #d4c9b4; }   /* island 变体：#d4c4a8 */

.number {                            /* 按尺寸 20 / 26 / 34px —— 与 Countdown 数字一致 */
    color: #8b7355;
    font-weight: 900;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
}
.affix { color: #a89878; font-weight: 800; font-size: 0.62em; }   /* prefix / suffix */
```

**庆祝动效（可选，精确取值）**：
```css
/* 数字块自己弹两下 */
.celebrating .plate { animation: animal-countup-pop 0.7s cubic-bezier(0.4, 0, 0.2, 1) both; }
/* 1 → 1.14(-2deg) → 0.98 → 1.08(1.6deg) → 0.99 → 1 */

/* 两圈向外扩散的光环，错开 0.12s */
.ring { position: absolute; inset: 0; border: 2px solid rgba(247, 205, 103, 0.85); border-radius: 14px;
        animation: animal-countup-ring 0.7s cubic-bezier(0.4, 0, 0.2, 1) both; }   /* scale 1→1.5，opacity .9→0 */
.ring:nth-child(2) { border-color: rgba(255, 204, 0, 0.7); animation-delay: 0.12s; }

/* 四颗纯 CSS 四角星从数字块四角飞出 */
.sparkle { position: absolute; width: 10px; height: 10px; background: #f7cd67;
           clip-path: polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%);
           animation: animal-countup-sparkle 0.72s cubic-bezier(0.4, 0, 0.2, 1) both; }
/* 四角的位移量由 nth-child 提供 --cu-x / --cu-y；延迟 0 / .06 / .12 / .18s */

/* 贴纸，浮在数字块上方 —— 只有传了 celebrate.text 才渲染 */
.badgeWrap { position: absolute; left: 50%; bottom: 100%; margin-bottom: 6px; transform: translateX(-50%); }
.badge { padding: 2px 10px; color: #725d42; font-weight: 800; 按尺寸 12/13/15px; letter-spacing: 0.04em;
         background: linear-gradient(180deg, #ffe08a 0%, #f7cd67 100%);
         border: 1.5px solid #e0b800; border-radius: 50px; box-shadow: 0 2px 6px rgba(61, 52, 40, 0.18);
         animation: animal-countup-badge 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }   /* 0.4 → 1.12(3deg) → 1 */
```

**关键交互细节：**

- 庆祝动效是**状态提示而非信息**：整层（光环、星芒、贴纸）都是 `aria-hidden` + `pointer-events: none`，只在 `.celebrating` 期间出现在数字块上方；`onComplete` 之后 900ms 卸载，让下一次结束能从零重播 CSS 动画。
- **贴纸承载文案**：`celebrate` 走两拍弹跳、光环与星芒；`celebrate={{ text: '…' }}` 会额外渲染暖黄色贴纸，文案随意（`完美！`、`当当！`、`+100`……）。
- 贴纸是唯一的暖黄色元素，也是唯一溢出外壳的部分 —— 它挂在 `bottom: 100%`，父级若 `overflow: hidden` 会裁掉它。徽标是 `50px` 胶囊而非矩形；星芒是纯 CSS `clip-path` 星形，因此没有引入 emoji、Unicode 字形或内联 SVG（`design-rules.md` 第 15/16 条）。
- `duration` 以 rAF 时间戳计时，并随 `isCounting` 一起暂停；继续时从已存时长接着走，而不是从头开始。`duration={0}` 以及没有 `requestAnimationFrame` 的环境会立即落值（`0` 直接到 `end`；无 rAF 则静止在 `start`）。
- `start` / `end` / `duration` 变化会从 `start` 重新播放；已结束的组件在 `isCounting` `false → true` 时重播，因此只有「必须由数值本身触发重播」的场景才需要参考库那套 `key` 用法。把 `start` 与 `end` 一起往后挪则**从上一个总数接着涨，而不是从 0 重数** —— 也就是累加模式（每次捡 +15 时写 `start={Math.max(0, total - 15)} end={total}`）。
- **格式化**与 `use-count-up` 对齐：`decimalPlaces <= 0` 渲染 `Math.round(value)`（再做千分位分组）；否则 `toFixed(places)` 按 `.` 拆分后用 `decimalSeparator` 重新拼接；`formatter` 优先级高于以上全部。`updateInterval > 0` 时先量化**已用时长**（`floor(elapsed / interval) * interval`）再做缓动，因此刷新点严格落在间隔整数倍上。
- 无障碍：根节点 `role="status"`；跳动中的数字 `aria-hidden`，由视觉隐藏的 span 承载**默认格式**的数值（永远不是 `formatter` 返回的节点）。它在计数期间保持为空、数值静止后写入 —— 每帧更新的 live region 无法使用，所以只播报最终得分。`prefix` / `suffix` 属装饰，不计入该文本。数字块整体 `aria-hidden`，因此 `children` 渲染函数只能放展示性内容：把可聚焦元素放进去会落在 `aria-hidden` 子树内（触发 axe 的 `aria-hidden-focus` 规则）。Demo 因此把渲染函数拿到的 `reset` 存进 ref，把重播按钮渲染在组件**外面**。
- `prefers-reduced-motion: reduce` 下取消弹跳、隐藏光环与星芒；使用贴纸时保留 0.25s 纯淡入，结束状态依然有视觉信号。

## Calendar（月面板，事项条可跨日期）

源码：`src/components/Calendar/calendar.module.less`。**独立**的月历（不是弹出面板）：月份面板常驻，所以外壳是一张奶油卡片而不是定位浮层。视觉沿用 DatePicker —— `#fffdf7` 卡片、`#e8dcc8` 1.5px 描边、20px 圆角、圆形日期格 —— 并在每一周的日期下方增加事项带。

**外壳与头部。** 面板没有尺寸档位：它测量自身盒子（`ResizeObserver`，或直接取数值型 `width`），再由宽度推导所有度量。`--animal-calendar-scale` = 实际宽度 / **750**（基准对齐 antd 的 full 日历卡片：实测 751px 宽 / 107px 格 / 116px 行 / 日期数字 14px），夹在 `0.6 … 2`，整套节奏都是 `基准值 × 系数`：

| 度量 | 750px 基准 | 1000px（系数 1.33） |
| ---- | ---------- | ------------------- |
| 表头高度 | 32px | 43px |
| 单元格高度 | 104px | 139px |
| 日期圆 | 28px | 37px |
| 事项行 / 事项条高度 | 22 / 17px | 29 / 23px |
| 事项字号 | 11px | 15px |

日期数字字号恒为 **13px** —— 随面板放大的是圆，不是圆里的数字（数字跟着放大会溢出圆外）。单元格还必须容得下
「日期数字带 + 2 条事项行」（`38 + 22 × 2 = 82 ≤ 104`），这正是忙的那一周不会压到下一周的原因。



```css
.calendar {                       /* 固定强调色三件套（DatePicker 的青绿）；所有度量都是 基准值 × 系数 */
    --animal-calendar-accent: #19c8b9;
    --animal-calendar-accent-soft: rgba(25, 200, 185, 0.14);
    --animal-calendar-accent-tint: #e6f9f6;
    --animal-calendar-header-height: calc(32px * var(--animal-calendar-scale, 1));
    --animal-calendar-number-size: calc(28px * var(--animal-calendar-scale, 1));
    --animal-calendar-cell-height: calc(104px * var(--animal-calendar-scale, 1));
    --animal-calendar-row-height: calc(22px * var(--animal-calendar-scale, 1));
    --animal-calendar-bar-height: calc(17px * var(--animal-calendar-scale, 1));
}

.body   { position: relative; padding-bottom: calc(var(--animal-calendar-row-height) * 2 + 6px);
          border: 1.5px solid #e8dcc8; border-radius: 20px; background: #fffdf7;
          box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12); }
.monthLabel { padding: 4px 12px; border-radius: 12px; background: #fffbe7; /* 与 DatePicker 的导航标签同款胶囊 */
              color: #725d42; font-size: 15px; font-weight: 700; }
.navBtn { width: 28px; height: 28px; border-radius: 10px; color: #a0936e;   /* 14px / 16px 箭头 */
          /* hover */ background: var(--animal-calendar-accent-tint); color: var(--animal-calendar-accent); }
.todayBtn { padding: 4px 12px; border-radius: 10px; color: #8a7b66; font-size: 13px; font-weight: 700;
            /* hover */ background: rgba(114, 93, 66, 0.1); color: #725d42; }
```

**日期网格** —— 单个 `<table role="grid">`，7 等分列 × 6 周（恒定 42 格，含上下月日期并置灰）。每格高度为 `--animal-calendar-cell-height`，并带与事项条相同的左右 4px 内边距，因此事项条与它上方的日期圆落在同一条轨道上：

```css
.weekCell { height: 32px; color: #a09080; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; }
.cell     { height: var(--animal-calendar-cell-height); padding: 0 4px; box-sizing: border-box;
            vertical-align: top; border-radius: 12px; cursor: pointer; }
.cell:hover           { background: #f4f0e4; }                      /* 整个格子，不只是数字 */
.cell:focus-visible   { outline: 2px solid var(--animal-calendar-accent); outline-offset: -2px; }
.cellSelected         { background: var(--animal-calendar-accent-tint); }
.dayNumber            { width: 1em; height: 1em; border-radius: 50%; line-height: 1em; text-align: center;
                        color: #725d42; font-size: 13px; font-weight: 500; }
.cellOutside .dayNumber { color: #c4b89e; font-weight: 400; }
.cellToday   .dayNumber { box-shadow: inset 0 0 0 1.5px var(--animal-calendar-accent);
                          color: var(--animal-calendar-accent); font-weight: 700; }
.cellSelected .dayNumber { background: var(--animal-calendar-accent); box-shadow: none; color: #fff; font-weight: 700; }
.more  { padding: 1px 5px; border-radius: 8px; font-size: 10px; font-weight: 700;   /* +N 折叠 */
         background: var(--animal-calendar-accent-soft); color: var(--animal-calendar-accent); }
```

**事项条** —— 事项层绝对定位覆盖整张卡片，组件为每条事项下发三个算好的值。这里**刻意不用** `grid-column`：事项条是绝对定位元素，已经脱离网格布局，写网格定位不会生效。

```css
.eventsLayer { position: absolute; inset: 0; pointer-events: none; }
.event { position: absolute;
         top: var(--animal-calendar-bar-top);   /* 表头 + 周序 × 单元格 + 日期数字带 + 事项行序 × 行高 + 半行 */
         left: var(--animal-calendar-bar-left);    /* (100% / 7) × 列序 + 4px —— 与 .cell 同一个 4px 内边距 */
         width: var(--animal-calendar-bar-width);  /* (100% / 7) × 跨列数 − 8px */
         height: var(--animal-calendar-bar-height); margin: 0; padding: 0 6px;
         transform: translateY(-50%);   /* top 指向行首，这里把条在行内垂直居中 */
         border-radius: 10px; font-size: calc(11px * var(--animal-calendar-scale, 1)); font-weight: 600;
         line-height: var(--animal-calendar-bar-height); overflow: hidden; white-space: nowrap; }
/* 跨天条在接缝处只留 1px 空档，相邻两周读起来是一条 */
.event[data-span='true']  { margin-left: 1px; margin-right: 1px; border-radius: 6px; }
.event[data-start='true'] { margin-left: 0; }    /* 起始周贴齐网格左缘 */
.event[data-end='true']   { margin-right: 0; }
/* 5 套配色：teal #e0f7f4/#17756d · amber #fff3d1/#8a6a08 · coral #ffe7de/#a44b32
   · green #eaf6db/#4a7a1d · purple #f0eafb/#6849b8，各配 45% 同色描边 */
.event[data-preview='true'] { border-style: dashed; }   /* 拖拽创建预览 */
.eventTime  { display: inline; margin-right: 4px; color: #9f927d; font-variant-numeric: tabular-nums; }
.eventTitle { display: inline; font-weight: 600; }
```

**布局规则。** 跨天事项在周边界处切断，因此每条最多占 1–7 列、永不换行；周内首段带 `HH:mm` 前缀，续接段只保留标题。每个周行最多并排 2 条（2 条事项行），同一天第 3 条折叠为日期格上的 `+N`，不撑高行高。完全落在 42 格视图之外的事项既不渲染也不计数 —— `+N` 与日期格的 `aria-label` 只描述屏幕上真正可见的内容。`prefers-reduced-motion` 下移除 `.cell` / `.dayNumber` / `.navBtn` / `.todayBtn` 的过渡。

## TimePicker

时间弹出选择器；值为纯 `HH:mm:ss` 字符串。挂钟时间不依附于某个日历日期，因此面板完全不需要日期库（见 [ADR 0005](../../adr/0005-dayjs-as-the-date-layer.md)）。触发区沿用 Input 视觉规格（奶油胶囊、
无边框）；面板为 时 / 分 / 秒 三列滚选 + 底部按钮。

**触发区（对齐 Input）：**

| 属性        | small | middle | large |
| ----------- | ----- | ------ | ----- |
| 高度        | 32px  | 40px   | 48px  |
| 内边距      | `0 14px` | `0 18px` | `0 22px` |
| 字号        | 12px  | 14px   | 16px  |
| 圆角        | 40px  | 50px   | 50px  |

```css
background: #fffbe7;      /* 无边框，同 Input */
/* hover */ box-shadow: 0 3px 0 0 #c4b89e;
/* 展开/聚焦 */ box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
/* error */ box-shadow: 0 3px 0 0 #c94444;
/* warning */ box-shadow: 0 3px 0 0 #dba90e;
/* disabled */ background: #ece8dc; box-shadow: none; opacity: 0.6;
```

**面板**（宽 248px，`format` 不含 `ss` 时收窄至 172px）：时 / 分 / 秒 三列（`format` 不含 `ss` 时隐藏秒列）；
每列为可滚动列表，选项为胶囊（高 28px、圆角 16px）：

```css
/* 选项 */ color: #725d42; border-radius: 16px;
/* 选项 hover */ background: #ffd54f; color: #725d42;
/* 选中选项 */ background: #ffb400; color: #fff; font-weight: 700;
```

**底部** —— `此刻`（待选值设为当前时间）+ `确定`（经 `onChange` 提交并以 0.2s 退场动效关闭）。点选某列数值时
触发区实时更新；Esc / 点击外部丢弃待选值。

**交互：** 键盘 Enter/空格/下箭头展开，Enter 确认，Esc 关闭；`hourStep` / `minuteStep` / `secondStep` 过滤列选项。
