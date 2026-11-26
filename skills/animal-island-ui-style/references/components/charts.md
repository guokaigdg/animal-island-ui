# Chart

Import `Chart` and its types from `animal-island-ui`; import `animal-island-ui/style` once.
19 chart types share legends, tooltips, keyboard access and an expandable data table.
This is an independent React API; uCharts configurations are not accepted.

# Demo labels and type selection

The demo's bottom **图表统计** category has a single **Chart 图表** entry; one page hosts a sticky switcher with **全部** plus the 19 types, and only the selected demo is mounted — **全部** keeps the original overview. Use the lowercase `ChartType` values from [data declarations](chart-data.md) in code. Display labels `Mountain`, `Mixed`, `WordCloud`, `Candlestick` and `TimeSeries` map to `mount`, `mix`, `word`, `candle` and `time`; `ArcBar` maps to `arcbar`. These labels do not introduce exported components or API aliases.

For example, **Mountain 山峰图** uses `<Chart type="mount" smooth series={series} />` for rounded peaks. The full label mapping and demo routes are in [Chart navigation](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/demo-site.md#chart-navigation).

# Public declarations

Props copied verbatim from source. See [data declarations](chart-data.md) for input types and [interaction declarations](chart-interaction.md) for tooltip options.

```ts
import type React from 'react';
import type { ChartType, ChartSeries, ChartMapRegion, ChartDataEvent, ChartTooltipOptions } from 'animal-island-ui';

/** 海岛风统计图，共用图例、数据提示、键盘访问与空态。 */
export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
    /** 图表类型，默认 column */
    type?: ChartType;
    /** 数据系列；饼/环/玫瑰/漏斗/词云/地图读取首个系列 */
    series: readonly ChartSeries[];
    /** 分类标签；缺省时采用点名称或从 1 开始的序号 */
    categories?: readonly string[];
    /** 标题 */
    title?: React.ReactNode;
    /** 辅助说明 */
    description?: React.ReactNode;
    /** 绘图区高度，默认 300，最小 180px */
    height?: number;
    /** 配色组；系列色与单点色优先于此值 */
    colors?: readonly string[];
    /** 显示可点击图例，默认 true */
    legend?: boolean;
    /** 数据提示开关或配置，默认 true；触摸或键盘聚焦也可查看 */
    tooltip?: boolean | ChartTooltipOptions;
    /** 高亮当前数据或图例并淡化其他图形，默认 true */
    highlight?: boolean;
    /** 点击/Enter/Space 锁定读数，再次激活或 Escape 解除，默认 true */
    selectable?: boolean;
    /** 柱状/条状图采用正负分开的堆叠，默认 false */
    stacked?: boolean;
    /** 折线/面积/混合/时序图使用平滑曲线，山峰图使用圆润峰顶，默认 false */
    smooth?: boolean;
    /** 显示坐标轴与网格，默认 true */
    showAxes?: boolean;
    /** 显示扇区、漏斗或数据点标签，默认 false */
    showLabels?: boolean;
    /** 数值轴/雷达/仪表盘最小值；圆弧与仪表盘默认 0 */
    min?: number;
    /** 数值轴/雷达/仪表盘最大值；圆弧与仪表盘默认 100 */
    max?: number;
    /** 数值格式化，供刻度、数据提示、数值中心使用 */
    valueFormatter?: (value: number) => string;
    /** 数值横轴格式化；时序图默认显示本地 HH:mm */
    xFormatter?: (value: number) => string;
    /** 地图轮廓，仅 map 使用；不内置或请求地理数据 */
    regions?: readonly ChartMapRegion[];
    /** 加载状态，默认 false */
    loading?: boolean;
    /** 空态内容 */
    emptyText?: React.ReactNode;
    /** 入场淡入，默认 true；遵循减少动态效果设置 */
    animated?: boolean;
    /** 数据点击/Enter/Space 回调 */
    onDataClick?: (event: ChartDataEvent) => void;
}
```

# Usage

```tsx
<Chart
    type="column"
    title="Weekly visits"
    categories={['Mon', 'Tue', 'Wed']}
    series={[{ name: 'Visitors', data: [32, 46, 38] }]}
    colors={['#19b7a7']}
    onDataClick={(point) => console.log(point.name, point.value)}
/>
```

- `column`/`bar`: `stacked` separates positive and negative sums. `line`/`area` preserve category gaps; `smooth` also works for `mix`/`time`.
- `mount`: the default keeps pointed peaks. Set `smooth` for rounded peaks with horizontal tangents at the summit and base; peak height still represents the same value, including negative values.
- `mix`: series `type` selects column/line/area on the same axis. `scatter`/`bubble`: pass `{ x, y, size? }`; `time`: x is a millisecond timestamp, y is required.
- `pie`/`ring`/`rose`/`funnel`/`word`/`map` read the first series; use `{ name, value }`. Proportion charts omit negative values. Zero values never create positive sector areas.
- `radar`: at least three categories with a comparable common scale. `arcbar`/`gauge`: first valid point per series; gauge uses only the first visible series; default range 0–100.
- `candle`: pass `{ open, close, low, high }`. Open/close must be inside low–high. Rising candles are coral and falling ones mint; an explicit series or point colour overrides both.
- Value axes include zero and pick readable steps. Set both `min` and `max` to divide that range evenly, or only one to pin that end while the other stays on readable steps.
- `map`: provide planar `regions`; names match point names. No bundled map boundaries, projection or remote requests. Nested outlines use evenodd fill.
- Use unique series names and replace array references when data changes. `null`, non-finite values and incomplete coordinates are missing data, not zeros.
- Legend hover/focus highlights the matching series or item; click toggles visibility. Tab enters the plot, arrows/Home/End browse marks; Enter/Space locks or unlocks a reading and calls onDataClick; Escape dismisses it. A restore-all action remains available when legends are hidden. The data table retains hidden points and omitted words.
- Height is plot height; the canvas follows the measured container width, so narrow layouts never introduce horizontal scrolling. Narrow canvases shrink margins, radii and label budgets instead of overflowing: pie/ring/rose labels and axis ticks are truncated to the available width and dropped when even one character plus the ellipsis does not fit, and map outlines keep their original orientation. `loading` and empty/hidden states are built in. String emptyText uses NoData; a React element is rendered as the complete custom empty content.
- Intended for dashboard-sized datasets; preprocess large datasets. No zoom/pan, dual axes or automatic data aggregation. Shared tooltips compare existing points without aggregating their values.

Canonical visual specifications: [Chart design system](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/components/charts.md).
