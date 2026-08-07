# Data display — 精确样式规范

承载内容展示的组件：Table、CodeBlock、Tag 的精确取值

## Table（虚线行分隔，条纹 hover）

源码：`src/components/Table/table.module.less`。**外壳无实线 border**；行分隔靠 `::after` 的 dashed 横线实现；hover 行是对角青色条纹。

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

/* row hover — diagonal teal stripes + inner rounded clip */
background: repeating-linear-gradient(-45deg, rgba(25, 200, 185, 0.6) 0 10px, rgba(14, 196, 182, 0.6) 10px 20px);
background-size: 28.28px 28.28px;
clip-path: inset(0 0 0 0 round 30px);
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

## CodeBlock（深色主题，JSX/TS 分词）

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

> 不支持 `language` prop；非 JS/TS 代码（Python/Shell/SQL）会按通用规则着色，显示可能不准确。不带 copy 按钮、行号或折行。

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

