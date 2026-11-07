# NoData

源码：`src/components/NoData/`。可复用空内容展示，沿用组件库字体、大地棕文字、奶油表面及 `naive-icons`。不增加请求、定时器或运行时依赖。

# 变体与结构

`default` 直接使用 naive-icons 的 NoDataIcon：敞开的棕色纸箱，深蓝内壁搭配奶白标签。`search` 使用原生 SearchIcon，保留青绿镜片、白色中心与墨色手柄，默认标题为“没有找到相关结果”。`simple` 使用较小的 NoDataIcon。其他变体默认标题为“暂无数据”。保留图标原有的 48×48 造型、按比例缩放的 3.5 单位圆角墨色描边与实色调色板；不叠加徽章、背景形状、旋转、改色或阴影。全部图形对辅助技术隐藏。

内容顺序为图形、标题、可选说明、可选操作区。title/icon 为 undefined 时采用默认值，null/false 隐藏。extra 优先于 children。bordered 添加 1.5px 沙色虚线、20px 圆角与 `var(--animal-bg-color, #faf8f1)` 主题背景；默认关闭，便于放入已有卡片。

# 视觉规范

| 部分 | 规范 |
| --- | --- |
| Small | 18px × 12px 内边距，图标区域 64 × 64px；14px 标题、12px 说明；图形下间距与操作区上间距 14px，说明上间距 5px。 |
| Medium | 32px × 24px 内边距，图标区域 96 × 96px；16px 标题、13px 说明；图形下间距与操作区上间距 22px，说明上间距 8px。 |
| Large | 40px × 24px 内边距，图标区域 120 × 120px；18px 标题、14px 说明；图形下间距 26px。 |
| 文字 | 组件库字体，标题 700，正文继承 500。标题继承 `--animal-text-color`，说明使用 `var(--animal-text-color-secondary, #7f6e57)`，行高 1.8，最大 32ch，均衡换行避免末行只剩单个词。 |
| 图标 | 直接使用 naive-icons 的原生 NoDataIcon / SearchIcon；组件只控制展示尺寸，不覆盖 SVG 填充与描边。不增加底托、渐变或投影。 |
| 简洁/自定义 | 简洁态与自定义图标在 small/medium/large 下使用 32/52/64px 正方形区域。自定义图标保留原有配色和方向，不额外添加方片。 |
| 操作区 | 居中 flex，间距 12px，窄容器自动换行；复用 Button 样式与焦点态。 |
| 动效 | 静态展示，没有持续播放的空态动画。 |

图形宽度不超出容器。组件不重写图标包的内置配色；需要其他图形或颜色时，通过 `icon` 插槽传入图标及其支持的颜色属性。原生属性、标题/说明/图标插槽与操作区优先级保持不变。

# 语义与组合

根节点为原生 div，可透传原生属性，不强制给静态页面内容增加实时播报。业务需要动态播报时可传 role="status" 或 aria-live。图形区设置 aria-hidden，标题、说明和操作区保持可读与可交互。使用简洁的恢复说明，并为操作区传入真实回调。

Chart 的无数据、缺少地图轮廓和图例全隐藏场景使用 small 变体；图例全隐藏提供恢复全部操作。Table 保留现有空态图标，在 emptyText 中放置 NoData 时可传 icon={null}。不改变原有 Table 行为。

独立演示位于 **反馈 → NoData 空状态**，顶部新增独立的纸箱/搜索并排预览，随后保留基础用法、可操作的搜索恢复（通过持久的礼貌活区播报结果数量或无匹配）、表格新建操作、多尺寸、自定义图标和纯文字。属性与示例见 [NoData 参考](https://github.com/guokaigdg/animal-island-ui/blob/main/skills/animal-island-ui-style/references/components/no-data.md)。
