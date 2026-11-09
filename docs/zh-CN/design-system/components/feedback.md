# Feedback — 精确样式规范

反馈进度与等待状态的组件：Progress、Skeleton、BackTop 的精确取值

## Progress（描边轨道 + 渐变或场景图 fill）

源码：`src/components/Progress/Progress.tsx`（受控渲染 + aria 适配）+ `types.ts`（类型定义）+ `progress.module.less`。
**JSX 组件**（非命令式）：`percent` 受控传入，从 0 平滑动画到目标值。track 是奶油色 pill，带细波点纹理和 2px 沙色实描边；传 `variant` 时 fill 是场景图（`sweet-corner.svg`、`forest-grove.svg` …）由组件内联注入，`background-size` 等于整条轨道宽度，场景铺满整条轨道；未传 `variant` 时 fill 回退为薄荷色竖向渐变。百分比文字固定显示在进度条右侧。

**props**：
```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

interface ProgressProps {
    percent: number;            // required, 0-100, auto-clamped; non-integers are rounded for aria
    size?: ProgressSize;        // small=14px / middle=24px / large=32px
    showInfo?: boolean;         // default true；文字显示在进度条右侧
    variant?: ProgressVariant;  // fill 场景图；不传时用薄荷渐变
    color?: string;
    wave?: boolean;
    animated?: boolean;
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
    box-sizing: border-box;  /* 高度含描边，保证 size 是总高 */
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    background:
        radial-gradient(circle, rgba(196, 184, 158, 0.1) 1.5px, transparent 1.5px) 7px 7px / 14px 14px,
        #f8f8f0;              /* 细奶油波点 + 未改动的奶油底 */
    border: 2px solid #e2d6bd; /* 沙色实描边（替掉原来的内凹阴影） */
    border-radius: 999px;    /* pill */
    overflow: hidden;
}
.track.size-small  { height: 14px; }
.track.size-middle { height: 24px; }
.track.size-large  { height: 32px; }
```

原来的壁纸轨道，小点层保留了 14px 网格、7px 偏移、`#f8f8f0` 底色和 `rgba(196, 184, 158, 0.1)`，但**点半径是 1.5px，不是原来的 1px**。2px 描边吃掉了 4px 画布（14px 的 small 档内腔只剩 10px），原半径的点在这个更小的画布里显得又小又稀，所以把点径调宽来补偿。1.5px / 28px 的粗大点层去掉了：描边已经在勾边，再叠一层更大的点会显脏。`background-origin` 保持默认的 `padding-box`，所以波点从描边内侧起画，不会压在描边下面。

**Fill（精确值）：**
```css
.fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 0;
    border-radius: 999px;
    background: linear-gradient(180deg, #3dd4c6 0%, #19c8b9 60%, #14b6a8 100%); /* 薄荷色，上亮下沉 */
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.45);  /* 顶部内高光 */
    /* 传 variant 时由 Progress.tsx 内联注入场景图，覆盖渐变层：
       background-image: url(<variant svg>);
       background-repeat: no-repeat;
       background-position: left top;
       background-size: <trackWidth>px auto;  (图片铺满整条轨道，按进度从左裁剪) */
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

/* 100% 完成态：整体提亮，读作「已抵达」而不是「还在加载」。
   纯 CSS，挂在组件本来就渲染的 aria 值上。 */
.progress[aria-valuenow='100'] .fill {
    background: linear-gradient(180deg, #7fe0d5 0%, #3dd4c6 100%);
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
- 100% 提亮只作用于默认薄荷渐变 fill。传了 `variant` 时场景图会内联注入自己的 `background-image`，100% 下刻意保持场景原色不染色。

`color` 支持 CSS 颜色或变量，叠加透明高光与底部阴影，100% 时保留自定义色。`variant` 优先于 `color`；两者都未传时保持原薄荷渐变。`wave` 默认 `false`，在 fill 内叠加白色双层海浪，可与颜色、场景图组合。`animated` 默认 `true`，为 `false` 或进度为 0% / 100% 时保持静态；离屏或页面隐藏时暂停，减少动态效果设置下停止。`duration` 只控制进度宽度过渡。

```tsx
<Progress percent={58} color="#82d5bb" wave />
<Progress percent={58} wave animated={false} />
```

海浪复用 `src/internal/Wave.tsx` 与 `wave.module.less`：128px 波长，6s / 9s 匀速反向循环，透明度 0.28 / 0.48；第二层顶部偏移 20%、相位偏移 -32px。同时提供 `-webkit-mask` / `mask` 及对应的位置声明，兼容需要前缀的 WebKit 引擎。固定纹理波长配合 transform 位移，fill 宽度仍对应真实百分比。轨道最小宽度为 0，可适配 Upload 的 84px 图片卡片。

## Loading（全屏落雪 / 圆形扩散展开）

源码：`src/components/Loading/Loading.tsx` + `Sailboat.tsx` + `types.ts` + `loading.module.less` + `sailboat.module.less`。
同一个全屏外壳，由 `type` 选择两种形态：

- `type="snow"`（默认）——全屏夜空落雪：50 片白色圆点雪花（1–6px 随机尺寸与位置）从视口上方旋转飘落，每片拥有独立的 6–12s 线性时长与负延迟，首屏即刻铺满。`active` 变为 false 时整体按 `fadeDuration` 秒渐变消失，随后卸载。
- `type="circle"` —— `active` 变为 false 时不是淡出，而是**从中心开出不断扩大的透明圆孔**，把遮罩一圈圈展开，露出底层内容。右下角有一艘驶在横向流动海面上的帆船（naive-icons 的 `sailboat`，MIT），船身随波浮沉摇曳，底下的波浪线持续侧向滚动；传 `showBoat={false}` 可以去掉帆船，只留遮罩背景。

**props**：
```ts
type LoadingType = 'snow' | 'circle';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: LoadingType;     // default 'snow'; 'circle' swaps the scene and the exit animation
    showBoat?: boolean;     // default true; 'circle' only — false leaves just the masked backdrop
    active?: boolean;       // true/false toggles the screen; default true; false → fade out then unmount
    tip?: React.ReactNode;  // centred caption over the snowfall; falls back to a visually-hidden 加载中
    delay?: number;         // ms before the screen appears; default 0; re-arms on every active→true transition
    fadeDuration?: number;  // fade-out duration in seconds; default 0.6; for 'circle' it drives the circle expansion
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
.loading.circle {                     /* circle variant: no enter fade */
    animation: none;
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

**圆形形态（`type="circle"`）：**

场景是图标自带的 48×48 viewBox，停在**右下角**（离右 20px、离下 30px，宽 120px）。波浪保持 naive-icons 的原始长度 —— 和船身一样宽 —— 并向侧向滚动。

```css
.sailboatScene {
    position: absolute;
    right: 20px;
    bottom: 30px;
    width: 120px;
    max-width: 40vw;
}
```

`tip` 仍然居中于视口（复用公共的 `.tip` 规则），因此提示文字与船身不会打架。

**波浪（侧向滚动，无接缝）：**
```css
.waveTrack {
    animation: animal-sailboat-wave 4s linear infinite;
}
@keyframes animal-sailboat-wave {
    from { transform: translateX(0); }
    to   { transform: translateX(var(--animal-sailboat-wave-scroll, 28.73px)); }  /* px = SVG user units here */
}
```
naive-icons 的波浪路径横跨 4.85 → 43.15，分成 4 段完全等长的 9.575，因此波形每 38.3 重复一次。路径整体平移 −4.85 让第 0 份正好从画布原点起画，再按 38.3 铺开（偏移 −81.45 / −43.15 / −4.85 / 33.45）。每个周期滚动 **28.74** 单位 —— 即一个可见窗口的宽度；滚动距离由 TS 常量通过内联 `--animal-sailboat-wave-scroll` 下发，两处数字不会对不上。

**缩短的波浪**：只露出中间 3 个波形周期 —— 居中的 28.74 单位窗口，比 32.56 单位的船身窄一截。这个窗口是普通的 SVG **clipPath**（硬切，不做渐变）。线宽同步收细到 **1.9** —— naive-icons 的 2.5 是按 38.3 单位的整条波浪定的，波浪变短后不收细就会变成一条粗带子。

波浪整组比图标原本的位置**下沉 1.2 个单位**（船底在 y=39.32，波峰在 41.24），船身与水面之间因此留出一道空隙。

**船身缩小**：船组按 **0.8** 缩放，支点取船底中心 (24, 39.32) —— 船底留在原处贴着水面，只是船变小了。波浪层完全不受影响，长度、线宽、位置都保持原样。

**船身（浮沉与摇曳）：**
```css
.boat {
    animation: animal-sailboat-bob 1s ease-in-out infinite alternate;
}
@keyframes animal-sailboat-bob {
    from { transform: translateY(0) rotate(0deg); }
    to   { transform: translateY(-2px) rotate(1deg); }
}
```
`alternate` 等价于 GSAP 的 `yoyo: true`：船身 1 秒内升起并侧倾，再缓缓荡回。

**圆形展开（退出）：**
```css
@property --animal-loading-mask-r {   /* registered → the radius can be transitioned */
    syntax: '<length>'; inherits: false; initial-value: 0px;
}
.masking {
    -webkit-mask-image: radial-gradient(circle at center,
        transparent var(--animal-loading-mask-r),
        black calc(var(--animal-loading-mask-r) + 1px));
    mask-image: radial-gradient(circle at center,
        transparent var(--animal-loading-mask-r),
        black calc(var(--animal-loading-mask-r) + 1px));
    transition: --animal-loading-mask-r var(--animal-loading-mask-duration, 0.6s) linear;
    pointer-events: none;
}
```
最终半径为 `ceil(hypot(width, height) / 2) + 50` —— 必须完全覆盖到最远角的对角线，否则四角会残留遮罩。它以内联自定义属性的形式写在根元素上，且**在 `masking` 类挂上之后**才写入，因此半径一定是从 0 开始过渡。展开途中恢复 `active` 会把半径归零，下次关闭仍能重新展开。

**关键交互细节：**
- **首帧**：`shown` 的初值直接由 `active && delay === 0` 推导，遮罩在第一帧就在，而不是等 effect 跑完才出现。`circle` 形态另外去掉了进入淡入（`animation: none`）—— 全屏遮罩从透明淡入的那 0.2s 会把底下已经铺好的内容透出来，恰恰是页面级 Loading 要避免的那种闪屏。
- **退出时序**：`active` → false 时落雪保持挂载并加 `exiting` 类（opacity → 0、`pointer-events: none`），`fadeDuration * 1000` 毫秒计时结束后卸载。淡出途中恢复 `active` 会取消计时器并立即回到不透明。
- **退出时序（circle）**：`active` → false 时加的是 `masking` 类而非 `exiting` —— 屏幕由中心向外扩大的透明圆孔展开，而不是淡出，`fadeDuration` 此时就是圆形展开的时长。两种形态用同一个计时器卸载。
- `type` 只切换场景与退出动画 —— `active` / `tip` / `delay` / `fadeDuration` / `zIndex` 两种形态行为一致。
- `delay` 在每次 `active` 切换为 `true` 时重新计时，加载快速结束时雪花屏不会闪烁。
- a11y：根元素带 `role="status"`；落雪包裹层与暗角均 `aria-hidden`，帆船场景同样 `aria-hidden`；无 `tip` 时用视觉隐藏的 `加载中` span 提供可读内容。
- `prefers-reduced-motion: reduce` 暂停飘落与进入动画；opacity 渐隐不属于位移运动，予以保留。落雪是**暂停而非移除**——`animation: none` 会让 50 片雪花全部退回静止位置 `top: -30px`（视口上方），只剩一块夜空底；纯落雪无 `tip` 时没有任何可见元素，看起来就是黑屏。由于每片雪花本就带**负延迟**（从周期中段起步），暂停会把每片冻结在下落途中的随机高度，开启「减弱动态效果」的用户看到的是一张铺满视口的静态雪景。帆船的波浪与浮沉同样只暂停不移除 —— 波浪的静止位置本就在画布内，暂停后是一幅静止的海景。

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

固定右下角的返回顶部按钮，使用 `naive-icons` 的 `RocketIcon`（48×48 viewBox：奶油 `#FAEDCD` 机身、青绿 `#2A9D8F` 舷窗、`#E76F51` 火焰与尾翼、墨色 `#2A2A2A` 描边），以 `size={64}` 渲染；点击后 easeInOutQuad 平滑滚动到顶部。该图标是纯装饰性的，带 `aria-hidden`，可读名称由按钮自身的 `aria-label` 提供。

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

// icon (naive-icons RocketIcon,48×48 viewBox,按 size 64 渲染)
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
interface CountdownReminderRule { seconds: number; color: string }
interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    value: number | Date;
    format?: string; // 默认 'HH:mm:ss'；支持 DD / HH / mm / ss
    prefix?: ReactNode;
    size?: CountdownSize; // 默认 'middle'
    variant?: CountdownVariant; // 默认 'default'
    bordered?: boolean; // 默认 false — 数字块是否带 1.5px 细边框
    reminder?: boolean | readonly CountdownReminderRule[]; // default false
    shake?: boolean | number | CountdownShakeOptions; // 默认 false
    endingAnimation?: boolean | CountdownEndingAnimationOptions; // 默认 false；true 为最后 5 秒每秒一次
    finishAnimation?: boolean | CountdownEffectOptions; // 默认 false；实际归零时播放一次
    onChange?: (remaining: number) => void;
    onFinish?: () => void;
}
```

默认风格是白色 20px 圆角面板、暖色边框和柔和投影；`island` 使用 `rgb(247,243,223)` 羊皮纸背景与 2px `#d4c4a8` 虚线边框。每个 DD / HH / mm / ss token 渲染为独立的 12px 圆角数字块（奶油渐变底 `linear-gradient(180deg, #fff, #f8f8f0)`；island 风格下为 `#fffdf4→#f8f8f0` 渐变底；1.5px `#d4c9b4` 细边框通过 `bordered` 属性开启，默认无边框），格式中的字面量（如 `:`、`天`）渲染为普通分隔符，冒号与数字同字号、900 字重、`#8b7355`。数字块内每一位数字是包含两轮 0-9 的纵向数字条，所有变化都以 0.35s `cubic-bezier(0.4, 0, 0.2, 1)` 过渡向下滚动（里程表式）；数字滚过 0 回绕时，数字条先无动画瞬移到下一循环的同数字位置，再继续向下滚动，方向永不反向。数字采用大地棕 `#8b7355`、900 字重、等宽数字，三档字号为 20/26/34px。滚动数字条对辅助技术隐藏，由视觉隐藏的完整格式化文本代替；根节点使用 `role="timer"` 与 `aria-live="off"`，避免读屏软件每 250ms 打断用户。

`reminder` 默认关闭；设为 `true` 使用默认规则：剩余 ≤60 秒为暖橙 `#c77c34`，≤10 秒为错误色 `var(--animal-error-color, #e05a5a)`。传入 `{ seconds, color }` 数组完全替换默认规则；颜色支持 CSS 颜色或变量。阈值按显示的向上取整秒数判断，命中多档时采用最小阈值，不要求数组排序；相同阈值取首项，无效阈值（负数或非有限数）与空颜色被忽略，空数组等同关闭。提醒只修改数字、分隔符及已开启的数字块边框，颜色过渡 0.2s，保持前缀与面板原样。归零保留命中的提醒色，重置到阈值外或关闭提醒时恢复默认色，计时与回调语义不变。

`shake` 保留布尔值和秒数简写，新增对象配置阈值、加强阶段、周期、位移、旋转与缓动。抖动位于内部数字组，回弹位于外部动效层，两个 transform 不冲突。每轮只重播装饰，不重挂数字条。离屏和隐藏页面停止循环定时器；重置或关闭会清理当前动效。减少动态效果时禁用循环运动，归零可选轻微淡入或完全静止。

`finishAnimation` 保留归零播放一次的语义，并新增对象配置。`endingAnimation` 将同一套回弹与波纹应用到最后几秒：`true` 默认最后 5 秒每秒一次；对象自定义阈值、间隔和视觉参数。二者可独立开关、分别设置风格，归零时循环切换到一次性收尾。完整参数与像素规范见 [倒计时动效](countdown-motion.md)。

```tsx
<Countdown value={deadline} reminder shake endingAnimation finishAnimation />
<Countdown value={deadline} reminder />
<Countdown value={deadline} reminder shake />
<Countdown value={deadline} reminder shake={8} />
<Countdown value={deadline} reminder={[{ seconds: 120, color: '#c77c34' }, { seconds: 30, color: '#b25770' }]} />
```

## Time（实时时钟卡片）

源码：`src/components/Time/Time.tsx` + `time.module.less`。

实时时钟卡片：上方是大号 `HH:MM` 时间，每秒从 `new Date()` 刷新一次；下方胶囊显示星期与月日。星期与月日都通过 dayjs 格式模板渲染，可改形状也可切换语言；其余 `div` 原生属性（`className`、`style`、`aria-*`…）全部透传到根节点。

```ts
export type TimeLocale = 'en' | 'zh-cn';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    weekdayFormat?: string; // 默认 'dddd'
    dateFormat?: string;    // 默认 'MMM D'；locale 为 'zh-cn' 时默认 'M月D日'
    locale?: TimeLocale;    // 默认 'en'
}
```

两个格式都支持 dayjs **核心** token（`dddd` / `ddd` / `MMM` / `M` / `D` / `YYYY`…），插件 token 不会展开。`zh-cn` 在组件模块内注册 —— 打包进本包的 dayjs 实例看不到宿主应用的 locale 导入，所以这一步让 `locale="zh-cn"` 开箱即用。格式化都在实例副本上进行（`dayjs(now).locale(locale)`），从不调用全局 `dayjs.locale()`，因此不会改动进程级状态。

卡片为纵向堆叠的 inline-flex 面板 —— 背景为 `var(--animal-bg-color)`、20px 圆角、`--animal-shadow-sm` 柔和投影、无边框，挂载时以 `--animal-motion-duration-slow` 淡入。时钟为 44px / 900 字重 / `var(--animal-text-color)`，等宽数字、1px 字距；冒号按秒闪烁（`step-end`，50% 处透明度为 0）。日期胶囊为 `var(--animal-primary-color-bg)` 底、999px 圆角的药丸形，内含大写星期（`var(--animal-primary-color)`、800 字重、1px 字距）、`·` 分隔点（禁用色调）与月日（`var(--animal-text-color-secondary)`、700 字重）。根节点使用 `role="timer"` 与 `aria-live="off"`，每秒刷新不打断读屏软件。
