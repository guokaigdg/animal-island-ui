# Chart

Source: `src/components/Chart/`. One React/SVG component for 19 statistical chart types, with shared legends, tooltips, keyboard access and a data table. No chart runtime dependency or remote data request. Type names refer to the [uCharts catalog](https://gitee.com/uCharts); this is an independent API, not a uCharts configuration adapter.

# Types and data semantics

| Types | Data and behavior |
| --- | --- |
| `column`, `bar` | Grouped categories; optional positive/negative stacking, separate accumulators on each side of zero. |
| `line`, `area` | Category trends; `null`/invalid values leave a gap. Optional horizontal-control-point curves do not overshoot adjacent y values. |
| `mount` | Hill heights represent category values. Default pointed peaks; `smooth` enables rounded peaks using two cubic curves with horizontal tangents at the summit and base. Positive, negative and zero values retain their original height. |
| `mix` | Each series selects `column`, `line` or `area`; all use one value axis. |
| `scatter`, `bubble` | Explicit finite `x` and `y`; bubble area follows positive `size` (default 1). Non-positive weights are omitted. |
| `pie`, `ring`, `rose` | First series; positive values only. Pie/ring angles represent shares; equal-angle rose sectors use square-root radii to represent values by area. Ring center shows the visible total. |
| `radar` | At least three categories; one shared range. An incomplete series draws available points without inventing a filled polygon. |
| `arcbar`, `gauge` | First valid point of each visible series; gauge uses the first visible series only. Default range 0–100. Geometry clamps to range, while the tooltip preserves the actual value. |
| `funnel` | First series; stage width represents value. Keeps input order instead of silently sorting stages. |
| `word` | First series; positive values drive text size. Deterministic collision avoidance, reduced sizes on narrow canvases; omitted words remain in the data table and an explanatory note appears. |
| `candle` | Complete `open/close/low/high`; open and close must lie inside low–high. Rising candles coral, falling candles mint; an explicit series or point colour overrides both. Tooltips expose all four values. |
| `time` | Explicit millisecond `x` and finite `y`, sorted by x with real temporal spacing. Default x labels use local `HH:mm`. |
| `map` | First series matched by point `name` to `regions`. Caller-supplied planar polygon coordinates, y upward; equal scale on both axes, evenodd fill for nested outlines. No built-in geographic boundaries or projection. |

`null`, non-finite values and incomplete coordinates are omitted; category indices are retained. Zero is not missing data: it remains in Cartesian charts and the data table, but never becomes a positive pie sector. Negative values are supported on Cartesian axes and maps; they are not proportions for pie/ring/rose/funnel/word/radar.

Automatic value axes include zero and choose readable decimal steps. Explicit `min`/`max` define the range; values outside it are clamped geometrically but retain their original value in tooltips. Setting both divides that range evenly; setting only one keeps that bound exact and still rounds the other end to readable steps. Series names should be unique; category names come from `categories`, point names or one-based indices. Data arrays are treated as immutable: replace the series reference when updating data.

# Visual specification

| Part | Specification |
| --- | --- |
| Container | Full width, 20px padding, 20px radius, 1.5px light sand border, cream background; no card shadow. Padding becomes 12px below 480px. |
| Palette | Mint `#19b7a7`, peach `#e59266`, green `#8ac68a`, purple `#b38ad3`, yellow `#e4b84f`, blue `#7e9fc4`, pink `#dc8c9e`, brown `#9a835a`. Point color overrides series color, then `colors`. |
| Text | Inherits library font. Title 17px/800, axis 11px/600, data labels 12px/700; earth-brown text. |
| Ring center | Value 24px/900 in secondary earth brown; caption 12px/600. Both use central SVG baselines and centered text anchors; their centers sit 8px above and 16px below the ring center, creating one visually centered two-line block. Tabular numerals stabilize changing totals. |
| Plot | Default 300px high, minimum 180px. ResizeObserver follows container width and the canvas always fits it, so narrow layouts never introduce horizontal scrolling. Narrow canvases shrink margins, radii and label budgets instead of overflowing: pie/ring/rose labels and Cartesian axis ticks are truncated to the available width and dropped when even one character plus the ellipsis does not fit; map outlines keep their original orientation at any width. |
| Grid | Sand dashed lines (`3 6`), separate visible zero baseline for mixed signs; category labels thinned according to available space. |
| Marks | Rounded columns up to 9px, stacked columns 2px; line width 3px and rounded joins; area opacity 0.18; bubble opacity 0.55. Data geometry is SVG, not an icon system. |
| Tooltip | Cream panel, 14px radius, 14px × 16px padding, maximum width 260px, soft `0 4px 14px rgba(61,52,40,.16)` shadow. Measured after rendering, anchored to data and constrained inside the visible plot. Hover panels do not intercept clicks; once locked, long content scrolls within the panel. Color dots, aligned tabular values and a lock indicator identify each reading. |
| Legend | Wrapping 50px pills, 10px color swatches, muted strikethrough when hidden. Series legends for Cartesian/radar/gauge; item legends for pie/ring/rose/funnel/word/map. |
| Motion/focus | 250ms fade; opacity/filter and legend hover transitions 200ms, both use the library easing. Mint 2px focus outline. Unrelated marks dim to 0.24 opacity; active marks gain a subtle drop shadow without changing data geometry. Auxiliary lines use a 4 5 dash; active coordinate points have 7px indicators. Reduced-motion disables animation and transitions. |

# Interaction and accessibility

The root has `role="figure"`; the plot is a labelled group with labelled data marks. Tab enters the plot at one roving tab stop; arrow keys cycle through marks, Home/End go to the first/last mark, and Tab leaves for subsequent controls. Enter/Space and pointer clicks call `onDataClick` and toggle locking when `selectable` is true (default). Locking preserves a reading while the pointer moves; clicking the same mark, the release button, empty plot space or Escape unlocks. Arrow navigation also unlocks. Loading, removing/hiding the selected datum or changing its identity clears the selection. Same-identity updates refresh its value.

`tooltip` accepts a boolean or options. By default category charts compare all visible series at the same category index, time compares identical timestamps, and radar compares the same dimension. Scatter/bubble and non-category types use single-item tooltips. Missing data remains absent. Cartesian plots resolve the nearest category; inside the radar circle, the pointer angle resolves the nearest visible dimension, including zero-valued points. Neither requires contact with a thin mark; discrete coordinates use a 24-pixel proximity limit, while small marks and zeros have 12-pixel hit areas. Category charts use one axis guide, single-item coordinate charts use both where applicable. `trigger: 'item'` and `crosshair: false` customize these behaviors.

Pie/ring/rose tips show percentages of the drawn total. Funnel tips show percentages relative to the first and preceding visible stages, preserving input order; zero denominators omit the corresponding rate. Increasing funnel values may exceed 100%. `showPercentage: false` hides these details. `render` receives the category, original data, formatted values, colors, applicable rates and lock state; returning null hides the panel. `tooltip={false}` hides the panel and guides, while `highlight={false}` disables visual emphasis and `selectable={false}` disables locking independently.

Legend hover/focus highlights its series (including line/area/radar layers) or data item. Buttons use `aria-pressed`; clicking hides/shows data and clears active readings. A restore-all button remains reachable even when all legends are hidden. The expandable data table preserves every valid source point, including hidden items and omitted words. Loading uses `aria-busy` and a status message; NoData distinguishes empty data, all-hidden legends and missing map outlines. A React element supplied as emptyText replaces the complete normal empty state, avoiding nested icons. The map demo is a fictional island partition.

# Scope and usage

The mount page also provides an independent pointed-versus-rounded comparison above the existing gallery, using identical data, range and colors. The rounded example enables `smooth`; its copyable configuration, tooltips and data selection use the standard Chart API.

Type selection lives in the sticky switcher at the top of the page rather than in a catalog inside the overview. Its buttons are cream pills with a sand border; the selected type fills with the library mint and carries `aria-current`, keyboard focus uses the mint outline, and reduced-motion removes the transitions.

Import `Chart` and its types from the package root, plus the usual shared stylesheet. Full public declarations and usage examples are in the [Chart skill reference](https://github.com/guokaigdg/animal-island-ui/blob/main/skills/animal-island-ui-style/references/components/charts.md). The demo sidebar has a separate **图表统计** category at the bottom of the sidebar with a single **Chart 图表** entry. The whole category lives on one page: a sticky switcher shows **全部** plus the 19 types and mounts only the selected demo; **全部** keeps the original overview. Label-to-type mappings and route rules are defined in [Chart navigation](../demo-site.md#chart-navigation). Each type has an additional interaction demo with independent controls; earlier demos are retained.

Each type also includes four independent style and scenario examples (76 in total), and the overview features eight selected examples whose links switch the page to that type. The gallery uses two columns, four when its container reaches 1400px, and one below 720px. Plots are normally 240px high. Variants use the existing public API to demonstrate palettes, single-point colors, grouped/stacked/signed data, labels, smooth or minimal trends, ranges, units and different datasets where applicable. All sample data and island outlines are fictional. Each chart retains its own legend filtering, tooltips, selection and data table; an expandable configuration block is generated from the exact rendered props, including standalone formatter functions. The data table and the configuration block expand and collapse with a 0.3s eased height transition (`::details-content` with `interpolate-size: allow-keywords`); browsers without `::details-content` support open them instantly, which changes nothing functionally. Existing basic, boundary and interaction demonstrations remain below the gallery. Gallery code is demo-only and adds no component API or runtime dependency.

This API covers SVG charts for dashboard-sized datasets. It does not implement uCharts option compatibility, geographic projection, zoom/pan, dual value axes, automatic aggregation or streaming downsampling. Choose an appropriate number of points and preprocess large datasets before rendering. `map` expects already projected planar outlines; `radar` expects metrics in a comparable unit/range.
