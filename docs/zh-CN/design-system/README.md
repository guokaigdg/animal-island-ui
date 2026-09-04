# Design System

本目录是 animal-island-ui 设计语言的唯一真源。组件库源码是它的实现，其余所有使用类文档都是对这里内容的派生摘要。

## 设计语言

animal-island-ui 是一套受《治愈系海岛风格》启发的 React + TypeScript UI 组件库。

设计语言核心：**温暖大地色系 + 大圆角 pill 形 + 游戏按键立体感 + 柔和动效 + 几何 / 有机形状并存**。几何代表：Title 飘带的 swallowtail clip-path、Countdown 的 12px 圆角数字块；有机代表：Modal 的 SVG blob。

- 源码：`src/components/<ComponentName>/`
- Demo 站：`demo/`
- 构建：Vite (library mode)，`vite.config.ts` 构建库，`vite.config.demo.ts` 构建 Demo
- 样式系统：Less Modules + `src/styles/variables.less` 设计 token

## 全量导出清单

35 个组件 + 3 个伴生导出（`FormItem` / `useForm` / `ICON_LIST`），全部从 `src/index.ts` 导出：

| 组件           | 职责                                                                                                                                                                                    | 交互 | 装饰 / 纯展示 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------- |
| `Button`       | 按钮，5 种类型 × 3 种尺寸                                                                                                                                                                   | ✓    |               |
| `Input`        | 输入框，3 种尺寸 + clear/prefix/suffix                                                                                                                                                      | ✓    |               |
| `Switch`       | 开关，默认/小号                                                                                                                                                                             | ✓    |               |
| `Modal`        | SVG blob 裁切弹窗                                                                                                                                                                           | ✓    |               |
| `Drawer`       | 下沉景深抽屉（背景下沉 + 缩放 + 降亮，left/right/top/bottom 四方向）                                                                                                                        | ✓    |               |
| `Card`         | 容器，`default`/`dashed`，13 种海岛实色 + 13 种 `pattern` 波点墙纸（CSS radial-gradient，非图片）                                                                                     |      | ✓             |
| `Title`        | 章节标题，飘带横幅（swallowtail clip-path 燕尾 + 折角阴影 + 微透视正面），13 种配色（替代已移除的 `Card type="title"`）                                                                      |      | ✓             |
| `Collapse`     | 手风琴（动画用 CSS Grid 0fr↔1fr 实现，无 JS 动画）                                                                                                                                          | ✓    |               |
| `Select`       | 下拉选择器（受控）                                                                                                                                                                          | ✓    |               |
| `DatePicker`   | 日期选择器，支持日期/月/年面板、范围选择与键盘导航                                                                                                                                           | ✓    |               |
| `TimePicker`   | 时间选择器，支持时/分/秒滚选、步进与键盘导航                                                                                                                                                 | ✓    |               |
| `Checkbox`     | 多选框组，水平/垂直，3 种尺寸                                                                                                                                                               | ✓    |               |
| `Radio`        | 单选框组，3 种尺寸，键盘 roving tabindex                                                                                                                                                    | ✓    |               |
| `Tooltip`      | 12 种 placement，`hover`/`focus`/`click` 触发，`default`/`island` 形态                                                                                                                      | ✓    |               |
| `Icon`         | SVG 图标库（10 个）                                                                                                                                                                         |      | ✓             |
| `Footer`       | 底部装饰图（`sea`/`tree`）                                                                                                                                                                  |      | ✓             |
| `Divider`      | 装饰分割线，5 种风格                                                                                                                                                                        |      | ✓             |
| `Cursor`       | 游戏手指光标包裹器                                                                                                                                                                          |      | ✓             |
| `Typewriter`   | 打字机效果，保留 ReactNode 结构                                                                                                                                                             |      | ✓             |
| `Tabs`         | 标签页切换，叶子摆动动画可选                                                                                                                                                                | ✓    |               |
| `CodeBlock`    | JSX/TS 语法高亮代码块                                                                                                                                                                       |      | ✓             |
| `Table`        | 数据表格，固定列、空状态、loading                                                                                                                                                           | ✓    |               |
| `Form`         | 表单容器 + 校验（含 `FormItem` / `useForm` 伴生导出，类主流表单库 API）                                                                                                                    | ✓    |               |
| `Tag`          | 胶囊标签，3 尺寸 × 3 变体（solid/outlined/dashed）× 12 配色（与 Card 调色板完全对齐），支持 closable / onClick / disabled                                                                   | ✓    |               |
| `Notification` | 命令式全局通知（antd 风格）：4 种 type × 6 个 position，支持 description / btn / onClick / key 复用更新 / destroy 全部                                                                      | ✓    |               |
| `Progress`     | 斜纹滚动进度条：fill 复用 Button loading 的 -45° 斜纹（`#0ec4b6`/`#01b0a7`）+ 1s 无限滚动，3 档 size，支持 inside/right/top 三种文字位置、infoFormat 自定义、duration 控制 fill 宽度动画 |      | ✓             |
| `Skeleton`     | 加载占位骨架，4 种变体（`text`/`circle`/`rect`/`paragraph`）加 `SkeletonButton` / `SkeletonInput` / `SkeletonAvatar` 子组件，暖白微光扫过                                                   |      | ✓             |
| `BackTop`      | 固定右下角回到顶部按钮（Island bag 图案，easeInOutQuad 平滑滚动）                                                                                                                            | ✓    |               |
| `Image`        | 衬板相框图片，支持懒加载、错误占位和点击预览                                                                                                                                                 | ✓    |               |
| `Countdown`    | 实时截止倒计时，支持 DD/HH/mm/ss 格式、三种尺寸和两种视觉风格                                                                                                                               |      | ✓             |
| `Carousel`     | 受控/非受控轮播，支持自动播放、循环、箭头、圆点和键盘导航                                                                                                                                   | ✓    |               |

类型导出：`ButtonProps/ButtonType/ButtonSize`、`InputProps/InputSize`、`SwitchProps/SwitchSize`、`ModalProps`、`DrawerProps/DrawerPlacement`、`CardProps/CardType/CardColor`、`TitleProps/TitleSize/TitleColor`、`FooterProps/FooterType`、`CollapseProps`、`CursorProps`、`DividerProps`、`TypewriterProps`、`SelectProps/SelectOption`、`DatePickerProps/DatePickerSize/DatePickerStatus/DatePickerValue`、`TimePickerProps/TimePickerSize/TimePickerStatus/TimePart`、`IconProps/IconName`、`TabsProps/TabItem`、`CheckboxProps/CheckboxOption/CheckboxSize`、`RadioProps/RadioOption/RadioSize`、`TooltipProps/TooltipPlacement/TooltipTrigger/TooltipVariant`、`CodeBlockProps`、`TableProps/TableColumn`、`FormProps/FormItemProps/FormInstance/FormLayout/FormItemLayout/FormSize/FormLabelAlign/ColProps/NamePath/RequiredMark/RuleObject/RuleRender/RuleType/Rules/FieldData/ValidateStatus/ValidateError/ValidateInfo/ScrollOptions`、`TagProps/TagSize/TagVariant/TagColor`、`NotificationConfig/NotificationType/NotificationPosition/NotificationPlacement/NotificationItem/NotificationStatic`、`ProgressProps/ProgressSize/ProgressInfoPosition`、`SkeletonProps/SkeletonVariant/SkeletonButtonProps/SkeletonInputProps/SkeletonAvatarProps`、`BackTopProps`、`ImageProps/ImageColor`、`CountdownProps/CountdownSize/CountdownVariant`、`CarouselProps`。

运行时值：`Notification`、`notificationOpen`、`notificationDestroy`、`NOTIFICATION_DEFAULT_DURATION`、`ICON_LIST`。伴生导出：`FormItem`、`useForm`（默认导出 `Form` 也支持 `Form.Item` / `Form.useForm` 写法）。

## 本目录文件

- [design-tokens.md](./design-tokens.md) — 色彩、字体、间距、圆角、边框、阴影与动效的精确值。
- [design-rules.md](./design-rules.md) — 7 条设计铁律、14 条视觉硬规则，以及 ❌/✅ 反例速查。
- [css-variables.md](./css-variables.md) — 不依赖组件库自实现样式时的完整 `:root` 变量模板。
- [components/](./components/) — 各组件的像素级样式规范。
- [demo-site.md](./demo-site.md) — Demo 与文档站的布局规范（不属于发布的组件库）。
