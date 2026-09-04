# Decorative — pixel spec

Exact values for the scene-setting pieces that carry the island theme: Time, Phone, Footer and Wallet.

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

