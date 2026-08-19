# 布局组件 —— 精确样式规范

布局与结构类组件 Card、Title、Divider、Collapse、Tabs 的像素级样式规范。

## Card

```css
/* 默认 (无 hover) */
border-radius: 20px;
background: rgb(247, 243, 223);
padding: 16px 24px;
color: #725d42;
font-weight: 500;
/* 默认 NO box-shadow(依赖 border / pattern 分层,不靠悬浮阴影)*/
transition: all 0.3s ease;
/* 默认无 cursor:pointer、无 hover transform —— 只读卡片场景 */

/* hoverable=true 时才应用(光标 + 上浮) */
cursor: pointer;
&:hover { transform: translateY(-2px); }

/* dashed 类型 */
border: 2px dashed #e8dcc8;
background: rgb(250, 248, 242);
box-shadow: none;
/* dashed + hoverable:hover  → 只换边框色,不做位移 */
&.card-dashed:hover { transform: none; border-color: #d4c4a8; }

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

## Title（飘带 Ribbon 章节标题）

替代旧 `Card type="title"`，渲染游戏风飘带横幅：燕尾两端 + 折角阴影 + 微透视正面主体。

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

## Carousel（淡入淡出轮播）

源码：`src/components/Carousel/Carousel.tsx` + `carousel.module.less`。

```ts
interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
    children: ReactNode;
    activeIndex?: number;
    defaultActiveIndex?: number; // 默认 0
    onChange?: (index: number) => void;
    autoplay?: boolean; // 默认 false
    interval?: number; // 默认 3000；实际最小间隔 1000
    loop?: boolean; // 默认 true
    showArrows?: boolean; // 默认 true
    showDots?: boolean; // 默认 true
    pauseOnHover?: boolean; // 默认 true；聚焦时也暂停
}
```

20px 圆角视口使用羊皮纸背景，幻灯片以 0.3s 淡入淡出；非活动页不可见且不可交互。圆形箭头按钮为 42px，箭头由 CSS border 绘制。每个圆点拥有 30×30px pill 点击区，10px 标记由 `::before` 绘制；当前标记展开成 24px teal 胶囊。自动播放时右上角显示暂停/继续 pill。根节点是可聚焦 `region` 并带 `aria-roledescription="carousel"`，每页暴露位置/总数标签；ArrowLeft/ArrowRight、Home、End 可导航，减少动态效果模式会移除过渡。

尺寸（`SIZE_MAP` 通过 inline `font-size` 注入；所有内部 `em` 自动缩放）：

| size   | font-size |
| ------ | --------- |
| small  | 14px      |
| middle | 20px      |
| large  | 28px      |

13 种颜色覆盖：在 wrapper 上叠加 `.color-app-pink` / `.color-purple` / `.color-app-blue` / `.color-app-yellow` / `.color-app-orange` / `.color-app-teal` / `.color-app-green` / `.color-app-red` / `.color-lime-green` / `.color-yellow-green` / `.color-brown` / `.color-warm-peach-pink` 之一；每个类同时覆盖 `--rf / --rb / --rk / --rt` 四个变量。

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

## Divider

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

## Collapse

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

## Tabs

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
