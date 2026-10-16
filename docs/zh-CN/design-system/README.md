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

40 个组件，全部从 `src/index.ts` 导出（含 `FormItem` / `useForm` 伴生导出）：

| 组件           | 职责                                                                                                                                                                                    | 交互 | 装饰 / 纯展示 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------- |
| `Avatar`       | 头像 / Avatar.Group：图片、图标或文字内容，圆形/方形，3 种尺寸 + 任意数值，`gap` 自动缩放，叠加展示与 `+N` 超出折叠                                                                                                                                       | ✓    |               |
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
| `Calendar`     | 独立月历：6×7 日期网格（节奏随自身宽度缩放）、事项通知与跨日期连续条、拖拽创建、键盘导航                                                                                        | ✓    |               |
| `Checkbox`     | 多选框组，水平/垂直，3 种尺寸                                                                                                                                                               | ✓    |               |
| `Radio`        | 单选框组，3 种尺寸，键盘 roving tabindex                                                                                                                                                    | ✓    |               |
| `Rate`         | 星级评分：3 种尺寸、悬停预览、`readonly` 只读展示、再次点击清空                                                                                                                               | ✓    |               |
| `Upload`       | 文件上传：text/picture/picture-card 三种触发形态、拖拽区、`action`/`customRequest` 真实上传（进度与中止）、图片预览灯箱、`maxCount` 替换、`directory` 目录上传                                                                                                                                 | ✓    |               |
| `Tooltip`      | 12 种 placement，`hover`/`focus`/`click` 触发，`default`/`island` 形态                                                                                                                      | ✓    |               |
| `Footer`       | 版权栏（`©` 当前年份 + 文案），12px 灰色，默认 `padding: 16px 0`                                                                                                                                                                                                                                                                                 |      | ✓             |
| `Divider`      | 装饰分割线，5 种风格                                                                                                                                                                        |      | ✓             |
| `Background`   | 装饰壁纸，`default` 奶油 / `dots-dark-green` 深绿波点、`sprinkles` 彩色针糖 + 12 色 `dots-*` 粉彩波点壁纸（底色对应 Card `pattern-*` 系列，无图片资源），内容渲染在图案之上                                                       |      | ✓             |
| `Cursor`       | 游戏光标包裹器，`default` 粗描边圆角箭头 / `raindrop` 雨滴两种风格                                                                                                                                        |      | ✓             |
| `Typewriter`   | 打字机效果，保留 ReactNode 结构                                                                                                                                                             |      | ✓             |
| `Tabs`         | 标签页切换，叶子摆动动画可选                                                                                                                                                                | ✓    |               |
| `CodeBlock`    | JSX/TS 语法高亮代码块                                                                                                                                                                       |      | ✓             |
| `Table`        | 数据表格，固定列、空状态、loading                                                                                                                                                           | ✓    |               |
| `Pagination`   | 内置客户端分页（`pagination` prop 集成）：胶囊页码、页面大小选择器、首末页固定 + `···` 省略号、可键盘导航的 `nav`                                                                                                                                                       | ✓    |               |
| `Form`         | 表单容器 + 校验（含 `FormItem` / `useForm` 伴生导出，类主流表单库 API）                                                                                                                    | ✓    |               |
| `Tag`          | 胶囊标签，3 尺寸 × 3 变体（solid/outlined/dashed）× 12 配色（与 Card 调色板完全对齐），支持 closable / onClick / disabled                                                                   | ✓    |               |
| `Badge`        | 角标数字：图标 / 头像右上角的圆形徽标，支持数字、封顶数字（`99+`）、小红点、独立使用，2 尺寸 × 12 配色（与 Card / Tag 调色板一致）                                                                |      | ✓             |
| `Notification` | 命令式全局通知：4 种 type × 6 个 position，支持 description / btn / onClick / key 复用更新 / destroy 全部                                                                      | ✓    |               |
| `Progress`     | 描边进度条：奶油色 pill 轨道 + 2px 沙色描边（size 为含描边的总高），fill 为薄荷色竖向渐变、按进度从左揭开、100% 时提亮；可选 `variant` 把渐变换成 4 张岛屿场景图之一铺满整条轨道，文字固定显示在进度条右侧，infoFormat 自定义、duration 控制 fill 宽度动画 |      | ✓             |
| `Skeleton`     | 加载占位骨架，4 种变体（`text`/`circle`/`rect`/`paragraph`）加 `SkeletonButton` / `SkeletonInput` / `SkeletonAvatar` 子组件，暖白微光扫过                                                   |      | ✓             |
| `Loading`      | 全屏夜空飘雪（`#0b101a` 底 + 中央暗角），50 片白雪花漂落旋转、可选居中 `tip`；`active` 关闭时淡出并卸载，支持 `prefers-reduced-motion`                                                           |      | ✓             |
| `BackTop`      | 固定右下角回到顶部按钮（`naive-icons` 的 `RocketIcon`，easeInOutQuad 平滑滚动）                                                                                                                            | ✓    |               |
| `Image`        | 衬板相框图片，支持懒加载、错误占位和点击预览                                                                                                                                                 | ✓    |               |
| `Countdown`    | 实时截止倒计时，支持 DD/HH/mm/ss 格式、三种尺寸和两种视觉风格                                                                                                                               |      | ✓             |
| `CountUp`      | 计分数字滚动：`duration` 秒内从 `start` 滚到 `end`（rAF 驱动）、5 条缓动曲线或自定义函数、千分位 / 小数位格式化、播放 / 暂停 / 继续，可选的结束庆祝动效（两拍弹跳、光环、CSS 星芒，可加文案贴纸），并在静止后通过 `role="status"` 播报得分          |      | ✓             |
| `Time`         | 实时时钟卡片，三种尺寸，暖棕数字与冒号分隔符呈现数码管样式                                                                                                                                     |      | ✓             |
| `Carousel`     | 受控/非受控轮播，支持自动播放、循环、箭头、圆点和键盘导航                                                                                                                                   | ✓    |               |

类型导出：`AvatarProps/AvatarSize/AvatarShape/AvatarGroupProps`、`ButtonProps/ButtonType/ButtonSize`、`InputProps/InputSize`、`SwitchProps/SwitchSize`、`ModalProps`、`DrawerProps/DrawerPlacement`、`CardProps/CardType/CardColor`、`TitleProps/TitleSize/TitleColor`、`FooterProps`、`CollapseProps`、`CursorProps/CursorType`、`DividerProps`、`BackgroundProps/BackgroundType`、`TypewriterProps`、`SelectProps/SelectOption`、`DatePickerProps/DatePickerSize/DatePickerStatus/DatePickerValue`、`TimePickerProps/TimePickerSize/TimePickerStatus/TimePart`、`CalendarProps/CalendarEvent/CalendarColor`、`TabsProps/TabItem`、`CheckboxProps/CheckboxOption/CheckboxSize`、`RadioProps/RadioOption/RadioSize`、`RateProps/RateSize`、`TooltipProps/TooltipPlacement/TooltipTrigger/TooltipVariant`、`CodeBlockProps`、`TableProps/TableColumn`、`PaginationProps`、`FormProps/FormItemProps/FormInstance/FormLayout/FormItemLayout/FormSize/FormLabelAlign/ColProps/NamePath/RequiredMark/RuleObject/RuleRender/RuleType/Rules/FieldData/ValidateStatus/ValidateError/ValidateInfo/ScrollOptions`、`TagProps/TagSize/TagVariant/TagColor`、`BadgeProps/BadgeSize/BadgeColor`、`NotificationConfig/NotificationType/NotificationPosition/NotificationPlacement/NotificationItem/NotificationStatic`、`ProgressProps/ProgressSize/ProgressVariant`、`SkeletonProps/SkeletonVariant/SkeletonButtonProps/SkeletonInputProps/SkeletonAvatarProps`、`LoadingProps`、`BackTopProps`、`ImageProps/ImageColor`、`CountdownProps/CountdownSize/CountdownVariant`、`CountUpProps/CountUpSize/CountUpVariant/CountUpEasing/CountUpEasingName/CountUpEasingFunction/CountUpRenderState/CountUpCelebrateOptions/CountUpCompleteResult`、`UploadProps/UploadFile/UploadFileStatus/UploadListType/UploadCustomRequestOptions/UploadChangeParam/UploadShowUploadList/UploadOnChange`、`CarouselProps`。

运行时值：`Notification`、`notificationOpen`、`notificationDestroy`、`NOTIFICATION_DEFAULT_DURATION`。伴生导出：`FormItem`、`useForm`（默认导出 `Form` 也支持 `Form.Item` / `Form.useForm` 写法）。

## 本目录文件

- [design-tokens.md](./design-tokens.md) — 色彩、字体、间距、圆角、边框、阴影与动效的精确值。
- [design-rules.md](./design-rules.md) — 7 条设计铁律、14 条视觉硬规则，以及 ❌/✅ 反例速查。
- [css-variables.md](./css-variables.md) — 不依赖组件库自实现样式时的完整 `:root` 变量模板。
- [components/](./components/) — 各组件的像素级样式规范。
- [demo-site.md](./demo-site.md) — Demo 与文档站的布局规范（不属于发布的组件库）。
