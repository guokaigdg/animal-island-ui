# 通用组件 —— 精确样式规范

通用类组件 Button、Icon、Typewriter、Cursor 的像素级样式规范。

## Button

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

## Icon

SVG 单色图标库，10 个内置图标 —— `icon-miles`、`icon-camera`、`icon-chat`、`icon-encyclopedia`、`icon-design`、`icon-diy`、`icon-helicopter`、`icon-map`、`icon-shopping`、`icon-variant`（以运行时 `ICON_LIST` 导出为准）。支持 `name`（内置图标名之一）或 `src`（任意图片 URL，Wallet 内部用此加载钱袋 PNG）。

```css
.icon {
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

/* 可选 hover 弹跳（`bounce` prop） */
.icon-bounce:hover {
    animation: iconBounce 0.3s ease-in-out forwards;
}
@keyframes iconBounce {
    0%   { transform: scale(1) rotate(0deg); }
    50%  { transform: scale(1.2) rotate(-5deg); }
    100% { transform: scale(1.1) rotate(-4deg); }
}
```

> 用法：`<Icon name="icon-camera" size={32} />`。`size` 默认 `24`，以内联 `width`/`height` 应用（number 为 px，string 为任意 CSS 长度）。组件渲染为 `<span>`，图标通过 `background-image` 呈现：`name` 映射到带内置 SVG 的 class，`src` 则内联设置 `background-image: url(...)` 以支持任意图源。没有 `color` prop —— 内置图标是固定的单色资源。

## Typewriter

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

## Cursor

```tsx
<Cursor>
    <App /> {/* 此范围内所有元素变为游戏手指光标 */}
</Cursor>
```

样式文件为 **普通 CSS**（`cursor.css`，非 module），由 `forceAll` prop（默认 `true`）选择两种模式；根 `<div>` 挂 `animal-cursor` 加一个模式 class：

```css
/* force 模式（默认，forceAll={true}）：所有后代都使用自定义光标 */
.animal-cursor--force,
.animal-cursor--force * {
    cursor:
        url('../../assets/img/cursor/cursor-icon.png') 4 0,
        url(data:image/png;base64,…) 4 0, /* 同图 base64 内联 fallback */
        default !important;
}

/* scoped 模式（forceAll={false}）：仅容器本身显示自定义光标 …
   （双类选择器保证嵌套在 force Cursor 内部的 scoped Cursor 仍能胜出） */
.animal-cursor.animal-cursor--scoped { cursor: url(…) 4 0, url(data:…) 4 0, default !important; }

/* … 后代回退浏览器默认语义 */
.animal-cursor--scoped * { cursor: auto !important; }
/* 交互元素显式恢复 pointer（a[href]、button、[role='button']、[role='link']、
   label[for]、select、summary、input[type='button'|'submit'|'reset'|'checkbox'|'radio']、
   [data-cursor='pointer']） */
.animal-cursor--scoped a[href] { cursor: pointer !important; }
/* 文本输入控件保留 text（text/search/email/password/number/tel/url、textarea） */
.animal-cursor--scoped textarea { cursor: text !important; }
/* 禁用态优先 */
.animal-cursor--scoped [disabled],
.animal-cursor--scoped [aria-disabled='true'] { cursor: not-allowed !important; }
```

- `cursor-icon.png` 热点坐标 `(4, 0)`；base64 data URI 是同图 fallback
- 每条规则都带 `!important`，保证模式语义不被组件级 cursor 样式覆盖；`className` 挂在根 `<div>` 上，与固定的 `animal-cursor` class 并存
