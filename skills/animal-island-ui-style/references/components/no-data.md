# NoData

Import `NoData` and types from `animal-island-ui`; import `animal-island-ui/style` once.

# Public declarations

Copied verbatim from source.

```ts
import type React from 'react';

/** 空态尺寸，适用于表格单元、卡片与整块内容区。 */
export type NoDataSize = 'small' | 'medium' | 'large';
/** 默认空数据、搜索无结果与简洁空态。 */
export type NoDataVariant = 'default' | 'search' | 'simple';

/** 海岛风格空态；操作区直接复用业务按钮，不内置请求或加载逻辑。 */
export interface NoDataProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** 展示风格，默认 default */
    variant?: NoDataVariant;
    /** 尺寸，默认 medium */
    size?: NoDataSize;
    /** 标题，默认“暂无数据”，search 默认“没有找到相关结果”；null 隐藏 */
    title?: React.ReactNode;
    /** 说明内容，默认不显示 */
    description?: React.ReactNode;
    /** 自定义装饰图标；null 或 false 隐藏图标 */
    icon?: React.ReactNode;
    /** 操作区，推荐放置 Button；优先于 children */
    extra?: React.ReactNode;
    /** 操作区的简写 */
    children?: React.ReactNode;
    /** 显示奶油色背景与沙色虚线边框，默认 false */
    bordered?: boolean;
}
```

# Usage

```tsx
<NoData description="No records yet." />
<NoData variant="search" description="Try another name or clear the filters."
    extra={<Button onClick={clearFilters}>Clear filters</Button>} />
<NoData size="small" variant="simple" icon={null} title="No matches" />
```

- Default uses the original naive-icons NoDataIcon (open cardboard box with a deep-blue inner wall); search uses SearchIcon and simple uses a smaller NoDataIcon. Original solid colors and rounded ink strokes are preserved. No badge, background shape, rotation, shadow or SVG fill/stroke overrides are added.
- Default icon areas are 64/96/120px square for small/medium/large; simple and custom icons use 32/52/64px square areas. Custom icons retain their own colors without a tile.
- Title inherits `--animal-text-color`; description uses `--animal-text-color-secondary` and the bordered surface uses `--animal-bg-color`. Use the `icon` slot for a different icon or its supported color props.
- `undefined` uses the default title/icon; explicit null or false hides it. `extra` takes precedence over children, including null/false.
- The root is a native div; pass `role="status"` or `aria-live` when a business flow requires announcements. Decorative icons are hidden from assistive technology; action content remains keyboard-accessible.
- The component has no built-in retry, loading or request behavior. Pass real business actions via Button. No continuous animation.
- In a Table emptyText slot, use `icon={null}` when retaining the table's existing empty icon. Chart empty states use NoData automatically.

Canonical visuals: [NoData design system](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/components/no-data.md).
