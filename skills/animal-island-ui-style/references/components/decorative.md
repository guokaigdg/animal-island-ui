# Decorative components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Time

```ts
interface TimeProps {
    className?: string;
}
```

```tsx
<Time /> // auto-updates every second, shows weekday + date + clock
```

> No configurable props beyond `className` — it is a self-contained HUD widget. No `format`, no `value`, no timezone — uses the browser's local clock.

## Phone (decorative IslandPhone)

```ts
interface PhoneProps {
    className?: string;
}
```

```tsx
<Phone />
```

> Fixed size 527×788px. A decorative showcase widget: 3×3 app grid + live AM/PM clock + blinking colon + hover icon bounce. Not configurable beyond `className` — no app slots, no badge API, no callback.

## Footer

```ts
type FooterType = 'sea' | 'tree';

interface FooterProps {
    type?: FooterType; // default 'tree'
    seamless?: boolean; // default true (无缝拼接背景循环平铺)
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Footer />                        {/* forest silhouette, 80px tall — default */}
<Footer type="sea" />             {/* ocean wave */}
<Footer type="sea" seamless />    {/* ocean wave with seamless horizontal tiling */}
```

> `style` accepts layout properties only (margin / position). Don't try to recolor via `backgroundColor` — the asset is a fixed PNG/SVG.

## Wallet

```ts
type WalletSize = 'small' | 'medium' | 'large';

interface WalletProps {
    value?: number | string; // default '00,000' — numbers auto-formatted with thousandSeparator
    icon?: React.ReactNode; // default built-in Island bag PNG (item-022.png)
    size?: WalletSize; // default 'medium'
    thousandSeparator?: string; // default ',' — pass '' to disable grouping
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Wallet value={12345} />
<Wallet value="9,999,999" size="large" />
<Wallet value={-1500} thousandSeparator="." size="small" />
<Wallet value={8888} icon={<span>💰</span>} />
```

> Decorative currency display — Island-bag-style olive-yellow pill with the bag icon overlapping 70% above. Three sizes: small (96×32 pill / 38px bag / 12px text), medium default (132×42 / 50px / 17px), large (176×54 / 66px / 22px).
>
> **Value formatting:** `number` → thousand-grouped with `thousandSeparator`; `string` → rendered as-is; `undefined`/`null` → `00,000`. Negative numbers prefix `-`.
>
> **`icon` replaces the entire bag slot** (a single ReactNode in an absolutely-positioned 50×50 px container). Default is the built-in `assets/img/icons/items/item-022.png` rendered via the `Icon` component's hidden `src` prop.
