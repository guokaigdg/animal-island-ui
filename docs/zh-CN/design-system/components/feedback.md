# Feedback — 精确样式规范

反馈进度与等待状态的组件：Loading、Progress、Skeleton、BackTop 的精确取值

## Loading（全屏遮罩）

源码：`src/components/Loading/loading.module.less`。**项目无 GSAP / MotionPath**，全部用原生 CSS + SVG `stroke-dasharray` 实现。

```css
/* container */
position: absolute; /* not fixed — bounded by the nearest positioned ancestor */
inset: 0;
background: black; /* not #f8f8f0 */
overflow: hidden;

/* reveal mask (radius ramps up as it disappears) */
--mask-r: 0;
mask: radial-gradient(circle at center, transparent var(--mask-r), black calc(var(--mask-r) + 1px));
/* when active=false, transition --mask-r to a large value for a circular fade-out */

/* SVG spinner */
color: #19c8b9; /* @primary-color mint teal */
animation: spin 1s linear infinite;
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* dash animation on the inner circle */
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

## Progress（Button loading 同款青色斜纹）

源码：`src/components/Progress/Progress.tsx`（受控渲染 + aria 适配）+ `types.ts`（类型定义）+ `progress.module.less`。
**JSX 组件**（非命令式）：`percent` 受控传入，从 0 平滑动画到目标值。track 是沙土色 pill 带内阴影，fill 直接复用 Button loading 的 `-45°` 斜纹（`#0ec4b6` / `#01b0a7`），从右往左无限滚动（1s linear），与 Button 视觉上"同款进行中"。

**props**：
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressInfoPosition = 'inside' | 'right' | 'top';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=12px / middle=20px / large=28px
    showInfo?: boolean;         // default true
    infoPosition?: ProgressInfoPosition; // default 'inside'
    infoFormat?: (p: number) => ReactNode; // default `${p}%`
    duration?: number;          // seconds; 0 disables the fill width animation; default 0.6 (does not affect stripe scrolling)
    className?: string;
    style?: CSSProperties;
}
```

**Track（精确值）：**
```css
.track {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    min-width: 80px;
    background: #f8f8f0;          /* main background colour (matches --animal-bg, blends into the page) */
    border: 2px solid #e8dcc8;     /* very light stroke, one step lighter than #c4b89e, softer overall */
    box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.08); /* inner recess (very subtle) */
    border-radius: 999px;         /* pill */
    overflow: hidden;
}
.track.size-small  { height: 12px; border-width: 1.5px; }
.track.size-middle { height: 20px; }
.track.size-large  { height: 28px; }
```

**Fill（精确值，与 Button loading 1:1）：**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    background: #0ec4b6;
    background-image: repeating-linear-gradient(
        -45deg,
        #0ec4b6 0, #0ec4b6 10px,
        #01b0a7 10px, #01b0a7 20px
    );
    background-size: 28.28px 28.28px;  /* 10px * √2, same as Button loading */
    animation: animal-progress-stripe 1s linear infinite;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex; align-items: center; justify-content: flex-end; padding-right: 4px;
}
@keyframes animal-progress-stripe {
    0%   { background-position: 0 0; }
    100% { background-position: -28.28px 0; }
}
```

**Info 文字：**
```css
.infoInside {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    color: #fff; font-weight: 800; font-size: 11px;  /* small 9px / large 13px */
    letter-spacing: 0.02em; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    pointer-events: none; white-space: nowrap; z-index: 1;
}
.info.right { min-width: 44px; text-align: right; color: #725d42; font-weight: 700; }
.info.top   { align-self: flex-end; color: #725d42; font-weight: 700; }
```

**关键交互细节：**
- `infoPosition="inside"` + `percent < 18%` 时，文字自动从 fill 内（白色）移到 track 末端（深色 `#725d42`），避免白字落在沙土色 track 上看不清。这是唯一「魔法」行为，其它都是声明式。
- `duration=0` → 关闭 fill 宽度过渡（`transition: none`），瞬间到位；**不影响斜纹滚动**。
- 斜纹滚动与 `prefers-reduced-motion: reduce` 联动：偏好降低动效时 `animation: none`，fill 宽度过渡同样置为 none。
- 旧版 `status` / `strokeColor` / `leafAnimated` 已全部移除：fill 颜色固定为 Button loading 同款 teal 斜纹，库内只保留一种"进行中"视觉，避免与状态色打架。
- a11y：根 div 有 `role="progressbar"` + `aria-valuemin=0/aria-valuemax=100/aria-valuenow=<四舍五入后的 percent>/aria-valuetext=<infoFormat 的字符串结果>`。
- `prefers-reduced-motion: reduce` 时所有动画自动关闭。

## Skeleton（流光占位）

源码：`src/components/Skeleton/Skeleton.tsx` + `skeleton.module.less`。

骨架屏加载占位组件。四种变体：`text` / `circle` / `rect` / `paragraph`。`loading=false` 时直接渲染 children。

**props**：
```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // paragraph row count, default 3
    width?: number | string;     // text/circle/rect width
    rowWidths?: (number | string)[]; // paragraph per-row width array
    widthValue?: number | string;    // circle/rect width
    heightValue?: number | string;   // circle/rect height
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

// sub-components
SkeletonButtonProps { size?: 'small'|'middle'|'large'; active?: boolean; }
SkeletonInputProps  { size?: 'small'|'middle'|'large'; active?: boolean; }
SkeletonAvatarProps { size?: 'small'|'middle'|'large'; shape?: 'circle'|'square'; active?: boolean; }
```

**样式精确值**：
```less
// base colours
@bg-base: #eae5db;      // light beige grey
@bg-line: #dfd9ce;      // row colour, slightly darker

// shimmer (warm white)
@shimmer-light: rgba(255, 252, 242, 0.55);
@shimmer-mid: rgba(255, 250, 235, 0.18);

// shared
.skeleton {
    background: @bg-base;
    border-radius: 12px;            // minimum radius
    overflow: hidden;
    position: relative;
}

// shimmer animation
.active::after {
    background: linear-gradient(90deg, transparent, @shimmer-mid, @shimmer-light, @shimmer-mid, transparent);
    animation: animal-skeleton-shimmer 1.6s ease-in-out infinite;
}

// per-variant radius
.vt-text   { border-radius: 12px; height: 16px; }
.vt-circle { border-radius: 50%; }
.vt-rect   { border-radius: 18px; }
.vt-paragraph { background: none; }
.line      { border-radius: 12px; background: @bg-line; }

// sub-components
.skeleton-btn   { border-radius: 50px; }             // pill
.skeleton-input { border-radius: 50px; }             // pill
.skeleton-avatar { border-radius: 50%; }             // shape="circle"（默认）；shape="square" → 12px，由 shape prop 以内联样式设置
```

**关键交互细节：**
- 流光动画是暖白色渐变，从左到右扫描，时长 1.6s。
- 所有圆角 ≥12px，符合「无锐角」规则。
- paragraph 模式最后一行默认宽 60%（可通 `rowWidths` 覆盖）。
- `aria-hidden` 屏蔽屏幕阅读器。

## BackTop（Island 袋返回顶部）

源码：`src/components/BackTop/BackTop.tsx` + `back-top.module.less`。

固定右下角的返回顶部按钮，默认使用 Island 袋 PNG（base64 内嵌），点击后 easeInOutQuad 平滑滚动到顶部。

**props**：
```ts
interface BackTopProps {
    target?: () => HTMLElement | Window; // default () => window
    visibilityHeight?: number;           // default 400
    duration?: number;                   // animation duration in ms, default 300
    onClick?: (e: MouseEvent) => void;
    className?: string;
    style?: CSSProperties;
}
```

**样式精确值**：
```less
// container
position: fixed;
bottom: 48px;
right: 32px;
z-index: 1000;
cursor: pointer;
opacity: 0;
visibility: hidden;
transition: opacity 0.3s, transform 0.3s, visibility 0.3s cubic-bezier(0.4,0,0.2,1);

// visible state
opacity: 1;
visibility: visible;
transform: translateY(0);

// icon
width: 120px;           // desktop
height: 120px;
object-fit: contain;    // preserve the original 158×136 ratio without stretching
filter: drop-shadow(0 4px 10px rgba(91,78,30,0.22));

// hover
transform: scale(1.08);
filter: drop-shadow(0 4px 14px rgba(91,78,30,0.32));

// focus-visible
outline: 2px solid #ffcc00;
outline-offset: 4px;
border-radius: 50%;

// mobile @media (max-width: 768px)
bottom: 24px;
right: 16px;
icon 80×80px;
```

**关键交互细节：**
- 默认监听 `window.scroll`，超过 `visibilityHeight` 显示。
- `target` prop 支持传入自定义滚动容器函数。
- 滚动动画使用 `requestAnimationFrame` + easeInOutQuad 缓动。
- 键盘 Enter/Space 触发滚动。
- 图标是 158×136px PNG，通过 `object-fit: contain` 在 120×120px 容器内等比缩放。

## Countdown（截止倒计时）

源码：`src/components/Countdown/Countdown.tsx` + `countdown.module.less`。

组件计算 `value`（`number | Date`）与 `Date.now()` 的非负差值，每 250ms 刷新，使向上取整后的秒数准时变化。到零时 `onFinish` 只触发一次。

```ts
type CountdownSize = 'small' | 'middle' | 'large';
type CountdownVariant = 'default' | 'island';
interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date;
    format?: string; // 默认 'HH:mm:ss'；支持 DD / HH / mm / ss
    prefix?: ReactNode;
    size?: CountdownSize; // 默认 'middle'
    variant?: CountdownVariant; // 默认 'default'
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

默认风格是白色 20px 圆角面板、暖色边框和柔和投影；`island` 使用 `rgb(247,243,223)` 羊皮纸背景与 2px `#d4c4a8` 虚线边框。数字为 teal、900 字重、等宽数字，三档字号为 20/26/34px。根节点使用 `role="timer"` 与 `aria-live="off"`，避免读屏软件每 250ms 打断用户。
