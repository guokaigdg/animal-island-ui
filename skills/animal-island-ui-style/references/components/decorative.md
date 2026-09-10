# Decorative components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Footer

```ts
interface FooterProps {
    size?: number; // default 24 — icon size, same as Icon component
    name?: IconName; // optional single icon; chain just that one icon, else the full 101-icon list
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Footer />          {/* 101-icon chain, 24px each, fills container width */}
<Footer size={36} />{/* custom icon size */}
<Footer name="Heart" />{/* single icon chained */}
```

Renders a continuous chain of icons, tightly adjacent (flex items with no gap), repeating to fill the container width via `ResizeObserver`. Default sequence is all 101 built-in icons; pass `name` (an `IconName`) to chain a single icon instead. `size` defaults to 24px, matching the `Icon` component default.

