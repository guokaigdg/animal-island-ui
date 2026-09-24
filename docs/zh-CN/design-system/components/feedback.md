# Feedback — 精确样式规范

反馈进度与等待状态的组件：Progress、Skeleton、BackTop 的精确取值

## Progress（场景图或纯色 fill + 波点 track）

源码：`src/components/Progress/Progress.tsx`（受控渲染 + aria 适配）+ `types.ts`（类型定义）+ `progress.module.less`。
**JSX 组件**（非命令式）：`percent` 受控传入，从 0 平滑动画到目标值。track 是奶油色波点 pill 带内阴影、无边框；传 `variant` 时 fill 是场景图（`sweet-corner.svg`、`forest-grove.svg` …）由组件内联注入，`background-size` 等于整条轨道宽度，场景铺满整条轨道；未传 `variant` 时 fill 回退为纯青色（`#19c8b9`）。百分比文字固定显示在进度条右侧。

**props**：
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=14px / middle=24px / large=32px
    showInfo?: boolean;         // default true；文字显示在进度条右侧
    variant?: ProgressVariant;  // fill 场景图；不传时用纯青色 #19c8b9
    infoFormat?: (p: number) => ReactNode; // default `${p}%`
    duration?: number;          // seconds; 0 disables the fill width animation; default 0.6
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
    background:
        radial-gradient(circle, rgba(196, 184, 158, 0.15) 1.5px, transparent 1.5px) 0 0 / 28px 28px,
        radial-gradient(circle, rgba(196, 184, 158, 0.1) 1px, transparent 1px) 7px 7px / 14px 14px,
        #f8f8f0;               /* 奶油色波点（与 Background default / Card pattern-default 一致） */
    box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.08); /* 内凹阴影（很淡） */
    border-radius: 999px;      /* pill */
    overflow: hidden;
}
.track.size-small  { height: 14px; }
.track.size-middle { height: 24px; }
.track.size-large  { height: 32px; }
```

**Fill（精确值）：**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    /* 场景图由 Progress.tsx 内联注入：
       background-image: url(<variant svg>);
       background-repeat: no-repeat;
       background-position: left top;
       background-size: <trackWidth>px auto;  (图片铺满整条轨道，按进度从左裁剪) */
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex; align-items: center; justify-content: flex-end; padding-right: 4px;
}
```

**Info 文字（进度条右侧）：**
```css
.row {
    display: flex; align-items: center; gap: 12px; width: 100%; flex: 1 1 auto; min-width: 0;
}
.info {
    font-weight: 700; color: #725d42; white-space: nowrap; flex-shrink: 0; letter-spacing: 0.02em;
}
.info.right { min-width: 44px; text-align: right; }
```

**关键交互细节：**
- `duration=0` → 关闭 fill 宽度过渡（`transition: none`），瞬间到位。
- a11y：根 div 有 `role="progressbar"` + `aria-valuemin=0/aria-valuemax=100/aria-valuenow=<四舍五入后的 percent>/aria-valuetext=<infoFormat 的字符串结果>`。
- `prefers-reduced-motion: reduce` 时 fill 宽度过渡自动关闭。

## Loading（全屏落雪）

源码：`src/components/Loading/Loading.tsx` + `types.ts` + `loading.module.less`。
全屏夜空落雪：50 片白色圆点雪花（1–6px 随机尺寸与位置）从视口上方旋转飘落，每片拥有独立的 6–12s 线性时长与负延迟，首屏即刻铺满。`active` 变为 false 时整体按 `fadeDuration` 秒渐变消失，随后卸载。

**props**：
```ts
interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;       // true/false toggles the screen; default true; false → fade out then unmount
    tip?: React.ReactNode;  // centred caption over the snowfall; falls back to a visually-hidden 加载中
    delay?: number;         // ms before the screen appears; default 0; re-arms on every active→true transition
    fadeDuration?: number;  // fade-out duration in seconds; default 0.6
    zIndex?: number;        // default 3000 (above Notification's 2000)
}
```

**Screen（精确值）：**
```css
.loading {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #0b101a;               /* night-sky base */
    opacity: 1;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    animation: animal-loading-fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.loading.exiting {                    /* fade-out state */
    opacity: 0;
    pointer-events: none;
    /* inline transition-duration: <fadeDuration>s set from the prop */
}
```

**落雪（50 片雪花）：**
```css
.snow {                                /* aria-hidden wrapper */
    position: absolute;
    inset: 0;
}
.flake {
    position: absolute;
    top: -30px;                        /* starts above the viewport */
    background: #fff;
    border-radius: 50%;
    animation: animal-loading-snow 10s linear infinite;
    /* per-flake inline style (generated once per mount via useMemo):
       width/height: Math.random() * 5 + 1 px        (1–6px)
       left: Math.random() * 100 %
       animationDuration: Math.random() * 6 + 6 s    (6–12s, overrides the 10s above)
       animationDelay: -(Math.random() * duration) s (negative → starts mid-cycle,
                                                       so the first frame is already full of snow) */
}

@keyframes animal-loading-snow {
    0%   { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(calc(100vh + 60px)) rotate(360deg); }
}
```

**暗角 / 提示文字：**
```css
.vignette {
    background: radial-gradient(ellipse at center, transparent 55%, rgba(5,10,20,0.6) 100%);
}
.tip {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center; padding: 0 24px;
    color: #f8f8f0; font-weight: 800; font-size: 18px;
    letter-spacing: 0.04em; line-height: 1.5; text-align: center;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}
```

**关键交互细节：**
- **退出时序**：`active` → false 时落雪保持挂载并加 `exiting` 类（opacity → 0、`pointer-events: none`），`fadeDuration * 1000` 毫秒计时结束后卸载。淡出途中恢复 `active` 会取消计时器并立即回到不透明。
- `delay` 在每次 `active` 切换为 `true` 时重新计时，加载快速结束时雪花屏不会闪烁。
- a11y：根元素带 `role="status"`；落雪包裹层与暗角均 `aria-hidden`；无 `tip` 时用视觉隐藏的 `加载中` span 提供可读内容。
- `prefers-reduced-motion: reduce` 停止飘落与进入动画；opacity 渐隐不属于位移运动，予以保留。

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

## BackTop（上箭头返回顶部）

源码：`src/components/BackTop/BackTop.tsx` + `back-top.module.less`。

固定右下角的返回顶部按钮，默认使用原创贴纸风上箭头 SVG（内联 data URI：暖棕 `#c9a06c` 描边 + 奶油 `#fffdf4` 糖霜层 + 青绿 `#19c8b9` 主体带浅青 `#7fe0d4` 高光），点击后 easeInOutQuad 平滑滚动到顶部。

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

// icon (240×240 viewBox 贴纸箭头)
.img {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 4px 10px rgba(91,78,30,0.22));
    transition: filter 0.3s cubic-bezier(0.4,0,0.2,1);
}
.backtop:hover .img { filter: drop-shadow(0 4px 14px rgba(91,78,30,0.32)); }

// hover (container)
transform: scale(1.08);
// active (press)
transform: translateY(2px) scale(0.96);

// focus-visible
outline: 2px solid #ffcc00;
outline-offset: 4px;
border-radius: 16px;
```

**关键交互细节：**
- 默认监听 `window.scroll`，超过 `visibilityHeight` 显示。
- `target` prop 支持传入自定义滚动容器函数。
- 滚动动画使用 `requestAnimationFrame` + easeInOutQuad 缓动。
- 键盘 Enter/Space 触发滚动。

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
    bordered?: boolean; // 默认 false — 数字块是否带 1.5px 细边框
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

默认风格是白色 20px 圆角面板、暖色边框和柔和投影；`island` 使用 `rgb(247,243,223)` 羊皮纸背景与 2px `#d4c4a8` 虚线边框。每个 DD / HH / mm / ss token 渲染为独立的 12px 圆角数字块（奶油渐变底 `linear-gradient(180deg, #fff, #f8f8f0)`；island 风格下为 `#fffdf4→#f8f8f0` 渐变底；1.5px `#d4c9b4` 细边框通过 `bordered` 属性开启，默认无边框），格式中的字面量（如 `:`、`天`）渲染为普通分隔符，冒号与数字同字号、900 字重、`#8b7355`。数字块内每一位数字是包含两轮 0-9 的纵向数字条，所有变化都以 0.35s `cubic-bezier(0.4, 0, 0.2, 1)` 过渡向下滚动（里程表式）；数字滚过 0 回绕时，数字条先无动画瞬移到下一循环的同数字位置，再继续向下滚动，方向永不反向。数字采用大地棕 `#8b7355`、900 字重、等宽数字，三档字号为 20/26/34px。滚动数字条对辅助技术隐藏，由视觉隐藏的完整格式化文本代替；根节点使用 `role="timer"` 与 `aria-live="off"`，避免读屏软件每 250ms 打断用户。

## Time（实时时钟卡片）

源码：`src/components/Time/Time.tsx` + `time.module.less`。

零配置的实时时钟卡片：上方是大号 `HH:MM` 时间，每秒从 `new Date()` 刷新一次；下方胶囊显示星期与 `Mon DD`。其余 `div` 原生属性（`className`、`style`、`aria-*`…）全部透传到根节点。

```ts
type TimeProps = React.HTMLAttributes<HTMLDivElement>;
```

卡片为纵向堆叠的 inline-flex 面板 —— 背景为 `var(--animal-bg-color)`、20px 圆角、`--animal-shadow-sm` 柔和投影、无边框，挂载时以 `--animal-motion-duration-slow` 淡入。时钟为 40px / 800 字重 / `var(--animal-text-color)`，等宽数字、1px 字距；冒号按秒闪烁（`step-end`，50% 处透明度为 0）。日期胶囊为 `var(--animal-primary-color-bg)` 底、999px 圆角的药丸形，内含大写星期（`var(--animal-primary-color)`、800 字重、1px 字距）、`·` 分隔点（禁用色调）与月日（`var(--animal-text-color-secondary)`、700 字重）。根节点使用 `role="timer"` 与 `aria-live="off"`，每秒刷新不打断读屏软件。
