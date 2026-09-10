# Decorative — pixel spec

Exact values for the scene-setting pieces that carry the island theme: Time, Phone, Footer and Wallet.

## Footer (icon chain)

A continuous chain of all 101 built-in icons, tightly adjacent, repeating to fill the container width. Icon size matches the `Icon` component default (24px).

```tsx
<Footer />           // default: 101-icon chain, size=24
<Footer size={36} /> // custom icon size
<Footer name="Heart" /> // single icon chained
<Footer name="Leaf" size={36} /> // single icon + custom size
```

```less
.footer {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    overflow: hidden;
    align-items: flex-start;
}
.cycle {
    display: flex;
    flex: 0 0 auto;
    align-items: flex-start;
}
```

- Each cycle renders the icon sequence at `size` px; the number of cycles is recomputed from the container width via `ResizeObserver` so the row always fills it. Duplicate cycles are `aria-hidden`.
- By default the sequence is the full 101-icon list (from the `Icon` registry order). Pass `name` (an `IconName`) to chain a single icon instead.
- Icons are flex items with no gap, so they sit tightly adjacent. `size` defaults to 24px — the same as the `Icon` component.

