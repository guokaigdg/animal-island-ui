# Decorative — pixel spec

Exact values for the scene-setting pieces that carry the island theme: Time, Phone, Footer and Wallet.

## Time

Two layouts via the `type` prop: `hud` (horizontal) and `game` (vertical, default).

**hud（左右结构）:**

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

**game（上下结构，默认）:**

```css
/* container — bare text HUD: no padding, no border, no background */
display: flex; flex-direction: column; align-items: center;
gap: 12px;
animation: ac-fade-up 0.5s ease-out;

/* time digits (top) */
color: #8b7355;
font-weight: 900; font-size: 40px;
letter-spacing: 2px;

/* colon (blinking) */
font-size: 40px; color: #8b7355;
position: relative; top: -0.08em;
margin: 0 1px;
animation: blink 1s step-end infinite;

/* divider (horizontal separator) */
width: 100%;
height: 3px;
background: rgba(159, 146, 125, 0.35);
border-radius: 2px;

/* date row (month/day + weekday, bottom) */
display: flex; align-items: center;
gap: 16px;
margin-top: 5px;

/* month / day (6月8日) */
color: #8b7355;
font-weight: 800; font-size: 22px;

/* weekday (single Chinese char: 一 … 日) — pill badge with #fffbe7 background */
display: inline-flex; align-items: center; justify-content: center;
padding: 0 16px;
height: 27px;
border-radius: 999px;
background: #fffbe7;
color: #8b7355;
font-weight: 900; font-size: 18px;
line-height: 1;
letter-spacing: 1px;

/* responsive 768px */
.gameTime / .gameColon → font-size: 32px;
.gameMonthday → font-size: 14px;
```

## Phone (IslandPhone)

**Shell (fixed size, not responsive):**

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

**Top time bar:**

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

**3×3 app grid:**

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

**App data structure (`src/components/Phone/Phone.tsx`):**

| id           | iconClass        | background | offset | hasNewMessage |
| ------------ | ---------------- | ---------- | ------ | ------------- |
| camera       | iconCamera       | `#B77DEE`  |        | ✓             |
| app          | iconApp          | `#889DF0`  | ✓      |               |
| encyclopedia | iconEncyclopedia | `#F7CD67`  |        |               |
| diy          | iconDiy          | `#E59266`  |        |               |
| shopping     | iconDesign       | `#F8A6B2`  |        |               |
| variant      | iconMap          | `#82D5BB`  |        | ✓             |
| design       | iconVariant      | `#8AC68A`  |        |               |
| map          | iconHelicopter   | `#FC736D`  |        |               |
| chat         | iconChat         | `#D1DA49`  |        |               |

Every iconClass binds a `background-image: url('./img/icon-*.svg')`; `iconApp` is special in using `background-size: 100% auto` (the others use `70% auto`). Available icon assets: `icon-miles/camera/chat/encyclopedia/design/diy/helicopter/map/shopping/variant.svg`, plus the status icons `wifi.svg` / `location.svg` / `page.svg`.

**Badge (new message):**

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

**Bottom status icons:**

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

**Behaviour:** an internal `useEffect + setInterval(1000)` updates the time in `12-hour format + AM/PM + zero-padded minutes`, with the colon blinking on a 1s cycle. The component has no business callbacks — it is purely presentational.

## Footer (sea and tree variants)

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

- `sea`: an SVG wave illustration, `viewBox="0 0 1440 186"`, multi-coloured (coral `#EC7175`, sea blue `#327A93`, light blue `#98D2E3`, deep teal `#008077`, etc.).
- `tree`: a webp forest silhouette, placed at the very bottom of the page.

## Wallet (olive pill + bell bag)

Source: `src/components/Wallet/Wallet.tsx` + `wallet.module.less`. **An amount display component**: an olive-yellow pill with the island-style money bag protruding above it, and outlined digits. Three size presets (driven by CSS variables), with the number auto-formatted with thousands separators.

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

> Number formatting (JS logic, not CSS): when `value` is a `number`, `thousandSeparator` is inserted every three digits (default `,`, pass `""` to disable); a `string` is displayed as-is; `undefined` / `null` renders `00,000`.
>
> The default bag icon is the built-in `assets/img/icons/items/item-022.png` (an island-style money bag) and can be replaced by passing any `ReactNode` through the `icon` prop. Note that internally it uses the hidden `src` parameter of `<Icon src={bagIcon} />` (Icon supports both `name`, which goes through ICON_LIST, and `src`, which accepts any image source).
