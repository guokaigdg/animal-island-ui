# Decorative components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

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

