# Decorative — 精确样式规范

承载海岛主题氛围的场景件：Time、Phone、Footer、Wallet 的精确取值

## Time（时钟面板）

```css
/* container */
display: flex; align-items: center;
gap: 20px;
padding: 16px 36px;
background: linear-gradient(180deg, #fff 0%, #f8f8f0 100%);
border: 3px solid #d4cfc3;
border-radius: 18px;
animation: ac-fade-up 0.5s ease-out;

/* date block (separator on the right) */
padding-right: 24px;
border-right: 3px solid rgba(159, 146, 125, 0.35);

/* weekday */
color: #6fba2c;
font-weight: 900; font-size: 14px;
letter-spacing: 1.5px;

/* month / day */
color: #8b7355;
font-weight: 800; font-size: 22px;

/* time digits */
color: #8b7355;
font-weight: 900; font-size: 48px;
letter-spacing: 2px;

/* colon (blinking) */
font-size: 48px; color: #8b7355;
position: relative; top: -0.08em;
margin: 0 1px;
animation: blink 1s step-end infinite;

@keyframes blink { 50% { opacity: 0; } }

/* responsive 768px */
padding: 12px 20px; gap: 12px;
.acWeekday → font-size: 11px;
.acMonthday → font-size: 16px;
.acTime / .acColon → font-size: 32px;
```

## Phone（IslandPhone）

**外壳（固定尺寸，不响应式）：**

```css
.phone {
    width: 527px;
    height: 788px;
    background: #f8f4e8; /* cream beige */
    border-radius: 136px; /* oversized radius, close to a capsule */
    overflow: hidden;
}
.homeScreen {
    height: 100%;
    padding-top: 40px;
    background: #f8f4e8;
    background-size: 100% 200%;
    animation: grasswave 8s ease-in-out infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
}
@keyframes grasswave {
    0%,
    100% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 0% 100%;
    }
}
```

**顶部时间栏：**

```css
.dateDisplay {
    padding: 0 70px 31px 70px;
    text-align: center;
}
.dateDisplayHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #dddbcc;
}
.blink {
    font-size: 32px;
    font-weight: 800;
    color: #dddbcc;
    animation: blink 1s steps(1) infinite;
    vertical-align: text-bottom;
}
@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}
.dayText {
    font-size: 48px;
    font-weight: 800;
    color: #725c4e;
    letter-spacing: 2px;
    height: 56px;
    margin-top: 20px;
}
```

**3×3 应用网格：**

```css
.appsGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    padding: 8px;
    flex: 1;
    align-content: center;
    justify-content: center;
}
.appItem {
    width: 123px;
    height: 123px;
    border-radius: 45px; /* rounded square */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.appItem:hover .appIcon {
    animation: iconBounce 0.3s ease-in-out forwards;
}
.appIcon {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 70% auto;
}
.appItemOffset {
    overflow: hidden;
}
.appIconOffset {
    transform: translateY(10px);
}

@keyframes iconBounce {
    0% {
        transform: scale(1) rotate(0deg);
    }
    50% {
        transform: scale(1.2) rotate(-5deg);
    }
    100% {
        transform: scale(1.1) rotate(-4deg);
    }
}
```

**应用数据结构（`src/components/Phone/Phone.tsx`）：**

| id           | iconClass        | 背景色    | offset | hasNewMessage |
| ------------ | ---------------- | --------- | ------ | ------------- |
| camera       | iconCamera       | `#B77DEE` |        | ✓             |
| app          | iconApp          | `#889DF0` | ✓      |               |
| encyclopedia | iconEncyclopedia | `#F7CD67` |        |               |
| diy          | iconDiy          | `#E59266` |        |               |
| shopping     | iconDesign       | `#F8A6B2` |        |               |
| variant      | iconMap          | `#82D5BB` |        | ✓             |
| design       | iconVariant      | `#8AC68A` |        |               |
| map          | iconHelicopter   | `#FC736D` |        |               |
| chat         | iconChat         | `#D1DA49` |        |               |

每个 iconClass 都绑定一个 `background-image: url('./img/icon-*.svg')`，`iconApp` 特殊使用 `background-size: 100% auto`（其他是 `70% auto`）。可用图标资源：`icon-miles/camera/chat/encyclopedia/design/diy/helicopter/map/shopping/variant.svg`，以及状态图标 `wifi.svg` / `location.svg` / `page.svg`。

**小红点（新消息）：**

```css
.badge {
    position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ff544a;
    border: 5px solid #f8f4e8; /* cream beige stroke, forming a game-style badge */
}
```

**底部状态图标：**

```css
.iconWifi {
    width: 79px;
    height: 29px;
    background: url('./img/wifi.svg') center/contain no-repeat;
}
.iconLocation {
    width: 36px;
    height: 36px;
    background: url('./img/location.svg') center/contain no-repeat;
}
.iconPage {
    width: 65px;
    height: 32px;
    background: url('./img/page.svg') center/contain no-repeat;
}
.pageIndicator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 74px;
}
```

**行为：** 内部 `useEffect + setInterval(1000)` 更新时间，`12 小时制 + AM/PM + 零填充分钟`，冒号闪烁 1s 一个周期。组件无业务回调，纯展示。

## Footer（sea / tree 两种变体）

```tsx
<Footer />              // default: forest (tree, 60px tall)
<Footer type="sea" />   // waves (80px tall)
```

```less
.footer {
    width: 100%;
    height: 80px;
    background: url('./img/footer-sea.svg') center/contain no-repeat;
}
.tree {
    background-image: url('./img/footer-tree.webp');
    height: 60px;
    background-size: cover;
    background-position: bottom center;
}
```

- `sea`：SVG 海浪插画，`viewBox="0 0 1440 186"`，多色（珊瑚 `#EC7175`、海蓝 `#327A93`、浅蓝 `#98D2E3`、深青 `#008077` 等）。
- `tree`：webp 森林剪影，置于页面最底部。

## Wallet（橄榄黄胶囊 + 钱袋）

源码：`src/components/Wallet/Wallet.tsx` + `wallet.module.less`。**金额展示组件**：橄榄黄胶囊 + 治愈海岛钱袋图标上凸，数字带描边。3 种尺寸预设（CSS 变量驱动），数字按千分位自动格式化。

```css
@wallet-pill-fill:   #b3a046; /* olive-yellow primary */
@wallet-pill-shadow: #8e7d2c;
@wallet-halo:        #fffbe7; /* cream outer glow */
@wallet-text:        #ffffff;
@wallet-text-shadow: rgba(91, 78, 30, 0.55);

/* root container — inline-flex, leaving room at the top for the bag to protrude */
.wallet {
    --wallet-pill-w: 132px;
    --wallet-pill-h: 42px;
    --wallet-bag: 50px;
    --wallet-text-size: 17px;
    --wallet-halo: 4px;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: var(--wallet-pill-w);
    padding-top: calc(var(--wallet-bag) * 0.7); /* bag protrudes by 70% */
    user-select: none;
    line-height: 1;
}

/* size presets */
.size-small  { --wallet-pill-w: 96px;  --wallet-pill-h: 32px; --wallet-bag: 38px; --wallet-text-size: 12px; --wallet-halo: 3px; }
.size-large  { --wallet-pill-w: 176px; --wallet-pill-h: 54px; --wallet-bag: 66px; --wallet-text-size: 22px; --wallet-halo: 6px; }
/* medium is the default and has no modifier class */

/* bag slot (icon): absolutely positioned, protruding above the pill */
.bagSlot {
    position: absolute;
    left: 50%;
    top: 0;
    width: var(--wallet-bag);
    height: var(--wallet-bag);
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
    filter: drop-shadow(0 4px 6px rgba(91, 78, 30, 0.18));
}

/* the pill itself: capsule + layered box-shadow */
.pill {
    position: relative;
    width: 100%;
    height: var(--wallet-pill-h);
    border-radius: 999px;
    background: @wallet-pill-fill;
    /* layered shadows: inner shading + inner stroke + outer halo + drop shadow */
    box-shadow:
        inset 0 -6px 0 rgba(91, 78, 30, 0.18),
        inset 0 0 0 2px rgba(91, 78, 30, 0.12),
        0 0 0 var(--wallet-halo) @wallet-halo,
        0 6px 14px rgba(91, 78, 30, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
}

/* numeric text */
.value {
    font-family: 'Nunito', 'Noto Sans SC', system-ui, sans-serif;
    font-weight: 800;
    font-size: var(--wallet-text-size);
    color: @wallet-text;
    letter-spacing: 0.04em;
    /* two-layer text-shadow simulating an outline */
    text-shadow:
        0 2px 0 @wallet-text-shadow,
        0 0 1px @wallet-text-shadow;
    font-variant-numeric: tabular-nums; /* stops digits from jittering */
    padding: 0 12px;
    white-space: nowrap;
}

/* hover: the bag bounces for 0.5s */
.wallet:hover .bagSlot {
    animation: walletBagBounce 0.5s ease-in-out;
}
@keyframes walletBagBounce {
    0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
    35%      { transform: translateX(-50%) translateY(-8px) rotate(-6deg); }
    70%      { transform: translateX(-50%) translateY(-2px) rotate(3deg); }
}
```

> 数字格式化（JS 逻辑，不是 CSS）：`value` 为 `number` 时按千分位插入 `thousandSeparator`（默认 `,`，传 `""` 关闭）；`string` 原样展示；`undefined` / `null` 显示 `00,000`。
>
> 默认钱袋图标是内置 `assets/img/icons/items/item-022.png`（治愈海岛风格钱袋），通过 `icon` prop 传任意 `ReactNode` 可替换。注意：内部使用了 `<Icon src={bagIcon} />` 的隐藏 `src` 入参（Icon 既支持 `name` 走 ICON_LIST，也支持 `src` 走任意图源）。
