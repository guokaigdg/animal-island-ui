# Decorative — 精确样式规范

承载海岛主题氛围的场景件：Time、Phone、Footer、Wallet 的精确取值

## Footer（Icon 图标链）

由全部 101 个内置 Icon 组成的连续图标链，紧贴相连、按容器宽度循环铺满。图标大小同 `Icon` 组件默认（24px）。

```tsx
<Footer />           // 默认：101 图标链，size=24
<Footer size={36} /> // 自定义图标大小
<Footer name="Heart" /> // 单一图标相连
<Footer name="Leaf" size={36} /> // 单一图标 + 自定义大小
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

- 每个周期渲染图标序列 `size` px；周期数通过 `ResizeObserver` 根据容器宽度实时重算，保证行始终铺满。重复周期设 `aria-hidden`。
- 默认序列为完整 101 个图标（按 `Icon` 注册表顺序）。传入 `name`（`IconName`）则改为仅该单一图标相连铺满。
- 图标为无 gap 的 flex 项，彼此紧贴相连。`size` 默认 24px，与 `Icon` 组件一致。

