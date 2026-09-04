# Decorative — 精确样式规范

承载海岛主题氛围的场景件：Time、Phone、Footer、Wallet 的精确取值

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

