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

基于 [lucide-react](https://lucide.dev/icons/) 的矢量图标组件，13 个内置语义名 —— `icon-left`、`icon-right`、`location`、`page`、`wifi`、`icon-shopping`、`icon-chat`、`icon-variant`、`icon-encyclopedia`、`icon-design`、`icon-map`、`icon-diy`、`icon-camera`（以运行时 `ICON_LIST` 导出为准）。三种渲染模式：

- `name` —— 内置语义名之一（映射到 lucide 图标组件）
- `icon` —— 任意 `lucide-react` 图标组件，如 `<Icon icon={Heart} />`（优先级高于 `name`）
- `src` —— 任意图片 URL，适合彩色位图素材；渲染为带 `background-image` 的 `<span>`

```css
.icon {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
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

> 用法：`<Icon name="wifi" size={32} />` 或 `<Icon icon={Heart} size={32} />`。`size` 默认 `24`，以内联 `width`/`height` 应用（number 为 px，string 为任意 CSS 长度）。lucide 图标为描边风 SVG：`color` 设置描边色（默认 `currentColor`），`strokeWidth` 设置描边粗细（默认 `2`）。未传 `aria-label` 的图标默认 `aria-hidden="true"`（装饰性）；传入 `aria-label` 时同时设置 `role="img"`，使标签成为可访问名。

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
    <App /> {/* 此范围内所有元素变为手指光标 */}
</Cursor>

<Cursor type="raindrop">
    <App /> {/* 改为雨滴光标 */}
</Cursor>
```

样式文件为 **普通 CSS**（`cursor.css`，非 module）：`type` prop（默认 `'default'`）选择两种风格 —— `'default'` 手指箭头（28×28 内联 SVG，hotspot `6 4`）、`'raindrop'` 蓝色雨滴（32×32 内联 SVG，带浅色高光椭圆，hotspot `16 6`）；`forceAll` prop（默认 `true`）选择两种模式。根 `<div>` 挂 `animal-cursor` 加一个模式 class（雨滴风格额外追加 `animal-cursor--raindrop`）：

```css
/* force 模式（默认，forceAll={true}）：所有后代都使用自定义光标 */
.animal-cursor--force,
.animal-cursor--force * {
    cursor:
        url("data:image/svg+xml,…箭头…") 6 4,
        default !important;
}

/* 雨滴 force：双类切换 URL 与 hotspot */
.animal-cursor--force.animal-cursor--raindrop,
.animal-cursor--force.animal-cursor--raindrop * {
    cursor:
        url("data:image/svg+xml,…水滴…") 16 6,
        default !important;
}

/* scoped 模式（forceAll={false}）：仅容器本身显示自定义光标 …
   （双类选择器保证嵌套在 force Cursor 内部的 scoped Cursor 仍能胜出） */
.animal-cursor.animal-cursor--scoped { cursor: url(…) 6 4, default !important; }
.animal-cursor.animal-cursor--scoped.animal-cursor--raindrop { cursor: url(…) 16 6, default !important; }

/* … 后代回退浏览器默认语义 */
.animal-cursor--scoped *,
.animal-cursor.animal-cursor--scoped * {
    cursor: auto !important;
}

/* 交互元素显式恢复 pointer */
.animal-cursor--scoped a[href],
.animal-cursor--scoped button,
.animal-cursor--scoped [role='button'],
.animal-cursor--scoped [role='link'],
.animal-cursor--scoped label[for],
.animal-cursor--scoped select,
.animal-cursor--scoped summary,
.animal-cursor--scoped input[type='button'],
.animal-cursor--scoped input[type='submit'],
.animal-cursor--scoped input[type='reset'],
.animal-cursor--scoped input[type='checkbox'],
.animal-cursor--scoped input[type='radio'],
.animal-cursor--scoped [data-cursor='pointer'] {
    cursor: pointer !important;
}

/* 文本输入控件保留 text */
.animal-cursor--scoped input[type='text'],
.animal-cursor--scoped input[type='search'],
.animal-cursor--scoped input[type='email'],
.animal-cursor--scoped input[type='password'],
.animal-cursor--scoped input[type='number'],
.animal-cursor--scoped input[type='tel'],
.animal-cursor--scoped input[type='url'],
.animal-cursor--scoped textarea {
    cursor: text !important;
}

/* 禁用态优先 */
.animal-cursor--scoped [disabled],
.animal-cursor--scoped [aria-disabled='true'] {
    cursor: not-allowed !important;
}
```

- `cursor-icon.png` 热点坐标 `(4, 0)`；base64 data URI 是同图 fallback
- 每条规则都带 `!important`，保证模式语义不被组件级 cursor 样式覆盖；`className` 挂在根 `<div>` 上，与固定的 `animal-cursor` class 并存
