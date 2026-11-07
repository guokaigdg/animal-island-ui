# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2026-11-07

### Fixed

- `Calendar` / `CodeBlock` / `Tooltip` 适配 React 19 的类型变更：`ReactElement.props` 的默认类型由 `any` 改为 `unknown`、`useRef` 删掉了无参重载。运行时行为不变（`useRef()` 与 `useRef(undefined)` 等价）
- CI 补上组件库构建与产物守卫：demo 是从 `src/` 引组件的，此前 GitHub CI 从未构建过组件库，产物层面的问题（比如 peer 依赖被子路径入口带着打进 `dist/`）在 CI 里根本看不见
- CI 的测试矩阵加上 React 版本维度，React 18 / 19 分别跑测试与类型检查

## [3.0.2] - 2026-11-07

### Fixed

- **修复 React 19 下调用 `Notification` 报 `TypeError: Cannot set properties of undefined (setting 'usingClientEntryPoint')`**（[issue #78](https://github.com/guokaigdg/animal-island-ui/issues/78)）
    - 根因：构建时 `rollupOptions.external` 只列了 `react` / `react-dom` / `react/jsx-runtime` / `classnames` 四个**字面量**，而 Rollup 的数组匹配是精确匹配 —— `react-dom/client` 这个**子路径入口**没被 external 住，于是旧版 `react-dom/client` 被打进产物。它会去写**消费者** react-dom 的 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint`，而 React 19 已移除该字段 → 调用即崩
    - 修复：`external` 改为判定函数 `isPeerDependency`，覆盖 `react` / `react-dom` / `classnames` 的**全部子路径入口**，以后新增任何子路径都不会再漏
    - 新增 `npm run check:bundle` 产物守卫并接入 `npm run ci`：一旦有 peer 依赖（或那个已被 React 移除的内部字段）重新出现在 `dist/`，构建直接失败

## [3.0.1] - 2026-11-07

### Changed

- `naive-icons` 升级至 `1.14.0`（图标数 202 → **709**，**无破坏性变更，旧图标全部保留**）：
    - 新增 508 枚图标，分类从 11 个扩到 18 个（新增建筑场所 / 设备硬件 / 健康医疗 / 工具 / 金融 / 办公 / 运动）
    - `user` / `user-plus` / `user-minus` / `users` 改为无五官画风，16px 下不再糊成黑点
    - `donut` 糖屑加粗且相邻不同色
    - `no-data` 图标的 React 版与 `svg/` 目录同步为同一图形（此前两版不一致，自 naive-icons 1.13.0 起上游已修复）
- `NoData` 空态改用 naive-icons 原生的 `NoDataIcon`（`default` / `simple` 变体），`search` 变体仍用 `SearchIcon`
- `Button` 的 loading 图标不再覆写描边色（`color="currentColor"`），跟随图标库原生配色，描边回归墨色后在青绿底上更清晰
- ADR 0005 的运行时依赖版本同步为 `^1.14.0`

### Fixed

- demo 图标页补齐 709 枚图标的中文名（此前仅覆盖 201 枚），并改用 naive-icons 官方导出的 `IconComponent` 类型

## [3.0.0] - 2026-11-01

### Added

- 新增 `Chart` SVG 图表组件（组件数 40 → 42）：19 种统计图形（柱 / 条 / 折线 / 面积 / 山峰 / 混合 / 散点 / 气泡 / 饼 / 环 / 玫瑰 / 雷达 / 弧形 / 仪表盘 / 漏斗 / 词云 / 蜡烛 / 时间轴 / 地图），共用图例、提示、键盘导航、数据明细表与空态。无新增图表运行时依赖，不请求远程数据
- 新增 `NoData` 空状态组件：`default` / `search` / `simple` 三种形态，`small` / `medium` / `large` 三档尺寸，可自定义图标、标题、说明与操作区
- `Countdown` 新增分级提醒与可配置紧迫动效：提醒颜色、抖动、结束与完成动画可按阶段配置
- `Divider` 新增海波浪动效样式
- `Progress` 支持自定义颜色与海波浪效果
- `Upload` 新增背景填充与进度条展示
- 文档与 skill 参考补齐 Chart、NoData、Countdown 动效及中英文镜像；demo 侧边栏新增独立的「图表统计」分类与 19 个类型页

### Changed

- **破坏性变更：最低 React 版本提升至 18**。`react` / `react-dom` 的 peerDependencies 由 `>=17.0.0` 改为 `>=18.0.0`；组件使用 React 18 的 `useId`。React 18 起支持，React 17 不再支持；仍在 React 17 上的项目应停留在 2.x
- `Table` 的 `emptyText` 改为块级容器，可直接传入 `NoData` 等块级组件，不再受 `<span>` 包裹限制
- 空状态文字与背景、上传背景进度改为跟随运行时主题变量
- `AGENTS.md` 运行时依赖说明补上 `dayjs`，与 `package.json` 保持一致

### Fixed

- 图表网格、坐标文字、图例、数据表与空态颜色改用主题 CSS 变量，主题切换时跟随；移除 SVG `<g>` 上无效的 `border-radius` 焦点圆角
- 图表、波浪与空状态在评审中发现的可访问性与交互问题

## [2.3.0] - 2026-10-17

### Added

- 新增 `Calendar` 轻量月历组件（组件数 39 → 40）：常驻月面板（无弹层、无周/年视图），6×7 满格日期网格、月份与年份导航、「今天」快捷键。日期算术走 `dayjs`（见 [ADR 0005](docs/adr/0005-dayjs-as-the-date-layer.md)）
- `Calendar` 支持声明式 `events`：同日多条 + 跨天连续条。跨天条在周边界切断、永不换行，首段带 `HH:mm` 前缀、续接段只留标题；同一天第 3 条折叠为日期格上的 `+N` 而不撑高行高；完全落在 42 格视图外的事项既不渲染也不计数
- `Calendar` 新增 `draggableEvents`：拖拽跨日期创建事项，松手经 `onEventCreate` 回调起止日期
- 运行时依赖新增 `dayjs@^1.11.23`

### Changed

- `Cursor` default 箭头缩小 20%（缩放系数 K=1.36 → 1.12），描边固定 2.75px 不缩，占外廓宽从 13.1% 升到 15.4%
- `Cursor` 文本选中态重做
- `Button` loading 图标旋转方向改为顺时针（`-360deg` → `360deg`）
- `Calendar` 事项条水平留白 4px → 5px，与格子内容盒（`.cell` 的 `padding`）对齐，跨天条接缝处不再错位 1px
- 文档与 skill 参考中移除竞品库引用，改为直接陈述本库自身的设计理由（补齐 demo 与 Calendar 文档中的遗漏）
- `AGENTS.md` 新增注释规范：只有「删掉就会静默出错」的信息才写注释，代码可推导的一律不写

### Fixed

- `Calendar` 受控 `value` 落在面板可见月份之外时，42 格全部 `tabindex=-1`，键盘用户 Tab 进日历后无处可停、方向键也无法救回。roving tabindex 现改为每次渲染夹回可见网格内，选中态用同一规则夹取（此前只夹光标，会出现「有焦点环却没有任何格被选中」）
- `Calendar` 不传 `defaultPanelValue` 时面板不跟随受控 `value`（此前只认 `defaultValue`，与文档描述不符）
- `Calendar` 右键拖拽会建出事项（`onMouseDown` 未区分按键，React 对任意按键都触发）
- `Calendar` 拖拽抬在月份表头上静默取消（收尾 handler 只挂在日期区，`表头`属于面板内却按「面板外」处理）
- `Calendar` 拖拽预览条计入 `+N` 统计，拖拽经过已有 2 条事项的格子时会凭空冒出 `+1` 徽标
- `Calendar` 事项条 `key` 含数组下标，在列表头部插入一条事项会把其后所有条目整体重建
- `Calendar` 事项布局的两个 `useMemo` 依赖恒变（`dayjs` 对象每次渲染都是新引用），memo 从不命中，拖拽时每次 `mouseenter` 都全量重算。改用字符串依赖后，1000 事项 × 20 次重渲染从 253ms 降到 23ms（原先随事项数线性增长）
- `Calendar` 日期格 `aria-label` 把 JSX 标题渲染成 `[object Object]` 被读屏念出；`title: 0` 被 `filter(Boolean)` 当空值丢弃；同名标题去重后与事项数错位（「2 项事项」只念 1 个标题），现补「等」尾缀

## [2.2.1] - 2026-10-11

### Added

- `Background` 新增 `dots-gray` 变体：白底浅灰波点，补齐 dots-* 系列的第 13 种底色

### Changed

- `Background` 与 `Card` 的波点纹理统一收细：dots-* / pattern-* 的 `radial-gradient` 半径 1.5px → 1.4px，部分底色的波点不透明度上调（0.12 → 0.18、0.18 → 0.26），让波点在浅色底上更清晰
- 文档与 skill 参考中移除对 antd 的引用，改为直接陈述本库自身的设计理由

### Fixed

- `Select` 在 `showSearch` 下选中回显后再次打字，输入会**追加**到刚选中的 label 上（选完 Banana 打个 `c` 得到 `Bananac`，并把结果全过滤掉）。此前依赖「聚焦即全选回显 label，输入自然替换」这条隐式约定；现改为聚焦时只聚焦、不全选（回显文字保持未选中、不做高亮），并在输入时检测「当前无搜索词且输入以回显 label 开头」，剥掉 label 前缀把余下部分作为新查询词
- `Select` 的清除按钮补一条回归测试：选中回显后鼠标移开，按钮必须消失（焦点虽被交回 trigger，但不应让它常驻）

## [2.2.0] - 2026-10-11

### Added

- `CountUp` 分数计数器组件：rAF 时间戳时钟驱动 `start` → `end`（无 `setInterval` 累积漂移），五条内置缓动（`linear` / `easeInCubic` / `easeOutCubic` / `easeInOutCubic` / `easeOutExpo`）加自定义曲线，未知曲线名回退到 `easeOutCubic` 而不崩；`isCounting` 播放/暂停/续播、`reset()`、`onComplete` 返回 `{ shouldRepeat: true }` 可在 `delay` 秒后自动重播，`duration={0}` 与无 rAF 环境直接落到终值；`decimalPlaces` / `decimalSeparator` / `thousandsSeparator` 或 `formatter` 完全接管格式化，`prefix` / `suffix` 支持任意 ReactNode；可选庆祝动效（两段式底板弹跳 + 两圈冲击波 + 四枚纯 CSS `clip-path` 星芒，`celebrate.text` 额外弹出贴纸并在 900ms 后隐去，默认关闭，庆祝文案由调用方提供）；根节点 `role="status"`、跳动数字块 `aria-hidden`，另有视觉隐藏 span 只播报一次最终分数。视觉复用 `Countdown` 的两种外壳、三档尺寸与奶油渐变数字底板
- `Select` 新增 `allowClear` 与 `showSearch`（prop 名与 `Input` / `DatePicker` / `TimePicker` / `Rate` 保持一致）：`allowClear` 的按钮只在有选中值时渲染，点击不弹开下拉，先触发 `onChange('')` 再触发 `onClear`；`showSearch` 的搜索框就在 trigger 内，开启后 trigger 的 `<input>` 按 ARIA 1.2 承担 `role="combobox"`，非搜索模式的 trigger `<div>` 逐字节不变；`optionFilterProp` 默认为 `'label'`（本库 option 的 `value` 是标识符，按它默认匹配会导致 label 搜不到）
- `CodeBlock` 新增 Shell 命令高亮：行首为 `npm` / `yarn` / `pnpm` / `npx` / `node` / `git` / `cd` 等命令时按 Shell 着色（命令名、子命令、flag、注释各自取色，注释为斜体淡色），此前一律按 JSX/TS 解析；为此把 token 渲染逻辑从 `highlightJSX` 中抽为 `renderTokens`，token 增加可选的斜体标记

### Changed

- `naive-icons` 升级至 `1.6.0`（导出数 125 → 171，**无破坏性变更，旧图标全部保留**）：新增 38 个图标（`AlertCircleIcon`、`AlertTriangleIcon`、`BadgeCheckIcon`、`FilterIcon`、`GridIcon`、`InboxIcon`、`InfoIcon`、`KeyboardIcon`、`ListIcon`、`ShieldIcon`、`SlidersIcon`、`SortIcon`、`VolumeIcon`、`XCircleIcon`、`ZoomInIcon` 等），并新增 `IconProps` / `IconName` / `IconComponent` / `PaletteColor` 类型，以及 `NAIVE_PALETTE` 调色板与 `normalizeIconProps` / `resolveStrokeWidth` / `scaledStroke` 工具导出
- `Select` 的 `allowClear` 清除按钮改为**仅在悬停时显示**，不再常驻于已选值旁
- npm 11.17 默认拒绝执行依赖的安装脚本，`package.json` 新增 `allowScripts` 放行 `esbuild` 与 `fsevents`；此前 `fsevents` 的原生模块一直被静默跳过，`vite dev` 的文件监听退化为轮询
- `vitest` / `@vitest/coverage-v8` 4.1.8 → 4.1.11，`npm audit` 修复使已知漏洞 23 → 10（剩余 10 个分别源自 `gh-pages` 与 `vite-plugin-dts`，两者均已是 registry 最新版且都是 devDependency，对消费者零影响）

### Fixed

- `BackTop` 的返回顶部图标此前是组件目录内自带的 `rocket.svg`（且为旧稿，机身 / 火焰 / 舷窗坐标均已过时），现已改用 `naive-icons` 的 `RocketIcon` 并删除该文件；图标改为 `aria-hidden`，可读名称仅由按钮自身的 `aria-label` 提供，不再重复播报
- `Drawer` **首次打开卡顿**：背景下沉景深原先对 `document.body` 下每个非 fixed 子元素施加 `filter: blur(1px)`。`filter` 是非合成器属性，会为每个元素新建合成层并对整个视口做逐像素高斯模糊，各层首次打开时需从零光栅化 —— 症状正是「第一次卡、之后顺」。景深现由 `scale(0.94)` + 圆角 + 遮罩压暗承担，并在过渡开始前用 `will-change` 完成分层
- `Modal` 与 `Drawer` 补齐 `prefers-reduced-motion`：`Modal` 关闭面板 `scale(0.92) → scale(1)` 的缩放入场，`Drawer` 同时关闭背景下沉位移与面板自身的 `translateX/Y(±100%) → none` 滑入 —— 两者均为位移类动效。关闭后面板直接落位，不会停在中间帧或不可见。两者均保留遮罩的纯 opacity 淡入 —— opacity 不属于位移动效
- `Loading` 在 `prefers-reduced-motion: reduce` 下只剩一块黑屏：雪花唯一的可见性来源就是那段动画，`.flake` 的静止位置在视口上方 `top: -30px`，而 reduced-motion 分支写的是 `animation: none`，50 片雪花因此整体冻在视口外。改用 `animation-play-state: paused` —— 雪花本就带负延迟，暂停会将其冻结在下落途中的随机高度，得到一张铺满视口的静态雪景
- `Select` 的查询、光标与焦点（评审中发现并逐条复现的 5 个问题）：点击搜索框内部不再冒泡到 trigger 的 click 而收起下拉（此前移动光标就会把查询丢掉）；查询改用 `string | null`，空字符串不再与「未搜索」混淆（此前删空查询会重新显示已选 label，下一个字符即在编辑它）；`readOnly` 关闭态下打字现在会打开并过滤，而非与文档描述矛盾地什么都不做；全选 label 限定在输入框仍显示 label 时才执行（此前往关闭态 Select 打 `ban` 会得到 `n`）；清空后焦点移到搜索框或 trigger，不再掉到 body
- 选中后关闭下拉、焦点仍在输入框时再次打字，现在会开始一次**新查询**，而不是追加到刚选中的 label 上（此前选完 Banana 打个 `c` 会得到 `Bananac` 并把结果全过滤掉）

## [2.1.1] - 2026-10-03

### Added

- `Badge` 角标组件：数字 / 字符串 / 任意 ReactNode（含 `naive-icons` 图标）三种内容形态，`overflowCount` 封顶后显示为 `${count}+`（仅纯数字参与换算），`dot` 只展示小圆点，`showZero` 控制数值为 0 时是否展示；`size`（`small` / `medium`）与 12 色 `color` 调色板与 `Card` / `Tag` 保持一致；**内容 ≤ 2 字符时自动渲染为正圆**并同步收窄字号，`100` / `99+` / `999+` 及「热更」等超宽内容自动回退为胶囊；不传 `children` 时可作为独立徽标使用

### Changed

- `Progress` 改为**描边岛屿**样式：轨道加 2px 描边，填充换成带内高光的薄荷渐变，100% 完成态有独立配色；轨道纹理保留原有手作纸质感，`size` 契约不变（改为含描边总高），`variant` 场景图路径不受影响
- `Input` 背景色统一为 `#fffdf7`，与仓库既有奶油色板对齐（与 `Upload` / `Select` / `DatePicker` 弹层同色），并修正文档中与实现不一致的旧色值
- 场景图 URL 抽到独立的 `sceneImages` 模块，`Background` 与 `Progress` 共用，消除重复

### Fixed

- `Badge` 数值为空字符串时不再渲染空角标
- `Form` 校验失败标记此前是裸 `✕` 字符，现改用 `naive-icons` 的 `CloseIcon`，与「图标必须来自 `naive-icons`」的设计硬规则一致
- 移除源码中的裸 Unicode 符号（`✕`、制表符字符），全部迁移至图标或转义写法

## [2.1.0] - 2026-10-02

### Added

- `Rate` 星级评分组件：受控（`value` / `onChange`）与非受控（`defaultValue`）两种用法，`count` 星星总数、`size` 尺寸、`readonly` 只读、`allowClear` 再次点击同一颗星清空评分（默认开启，清空时回调值为 `0`）；完整键盘操作（方向键移动、`Enter` / `Space` 确认，焦点与读屏均可用）；连续点击时星星按提交顺序逐颗点亮，动画重放而非跳过

- `Avatar` 头像组件：图片 / 图标 / 文字三种形态，圆形 / 方形两种形状，三档预设尺寸（32 / 40 / 48px）与任意数值尺寸；`gap` 控制内边距并对超长文字自动缩放；图片加载失败自动回退到图标或文字。`Avatar.Group` 支持 `gap` 控制的头像叠加与 `maxCount` 超出折叠为「+N」，组级 `size` / `shape` 会注入未自行设置的子项，同时提供 `Avatar.Group` 静态属性写法
- `Avatar` 的 a11y：图片头像透传 `alt`，裸图标头像带 `role="img"` + `aria-label="avatar"`，并新增 2 条 axe 冒烟用例

### Fixed

- Skill 组件目录回填此前漏登记的 `Upload` / `Pagination` / `Loading` / `Time`，英文 `SKILL.md` 补齐 Layout 与 Feedback 分类；`AGENTS.md` 组件数由 30 更正为 37
- Skill props 参考按 200 行上限拆分：新建 `media.md`（Image / Avatar / Carousel），`layout.md`（199 → 154）与 `data-display.md`（196 → 124）回到上限以内
- Demo Skill 页图标恢复渲染：`resolveIcon` 用 `typeof === 'function'` 判断组件，而 `naive-icons` 导出的是 `ForwardRefExoticComponent`（运行时为对象），此前 10 个图标全部解析失败；页面数据同步至 37 个组件
- `Avatar.Group` 静态属性此前被 `as unknown as` 强转从公开类型中抹去，现已在 `AvatarProps` 导出处声明

### Internal

- `tsc --noEmit` 接入 `ci`：`npm run test:run` 现在串联 a11y 配置（此前混合 filter 时 `test/a11y.test.tsx` 会被静默跳过并仍报绿）
- 清理 44 个累积的类型错误，其中 33 个源于 tsconfig `lib` 缺少 ES2022（`Array.prototype.at`）

## [2.0.0] - 2026-09-24

### Changed

- **许可证由 CC BY-NC 4.0 变更为 MIT**：移除非商业使用限制，允许用户自由用于个人及商业用途
- **`naive-icons` 升级至 `1.2.0`**：新增 9 个图标，并修复组件改为 `forwardRef` 后图标不渲染的问题
- `Progress` 的 `variant` 改为可选项：不传时使用纯色填充，传时显示场景图

### Added

- `Upload` 上传组件：text / picture-card 两种列表形态，点击与拖拽触发，`beforeUpload` 拦截、`maxCount`、`customRequest` / `action` 真实上传，内置预览灯箱

## [1.13.0] - 2026-09-16

### Changed

- **图标迁移至 `naive-icons`**（破坏性变更）：内置 `Icon` 组件与 101 个私有图标移除，库改用独立的 [naive-icons](https://github.com/guokaigdg/naive-icons) 图标包；`naive-icons` 成为唯一运行时依赖，`Icon` 相关 API 迁移至该包
- `Divider` 的 `icon` prop 由图标名改为接收 React 图标元素（如 `<FishIcon />`）
- `Button` / `Collapse` / `Image` 内置装饰图标迁移至 `naive-icons`
- `naive-icons` 升级至 `1.1.0`：新增 15 个图标（箭头、折叠、复制、菜单、外链等），Demo Icon 页同步适配并补齐中文名
- `naive-icons` 升级至 `1.2.0`：新增 9 个图标（篮球、哑铃、谷歌浏览器、山、帐篷、暂停、停止、咖啡杯、水杯），修复主页与 Icon 页因组件改为 `forwardRef` 导致的图标不渲染问题
- `Title` 默认变体由 `layer` 改为 `ribbon`（飘带、默认）

### Added

- `Footer` 由图标链重构为版权栏：渲染 `© {year} {text}`，年份动态获取，文案默认 `All Rights Reserved.`，支持 `text` / `year` / `className` / `style` 自定义
- Demo Icon 页展示全部 `naive-icons` 图标及 npm / yarn / pnpm 安装说明
- Demo 首页与侧边栏改用 GROBOLD 展示字体

## [1.11.0] - 2026-09-11

### Added

- `Background` 组件扩展为 16 种图案类型（含 `grid`、`sprinkles` 及 13 种 `dots-*`）
- 工具链：ESLint flat config + CI workflow + EditorConfig

### Changed

- `Divider` 移除锯齿线 `line-*` 变体，仅保留虚线 `dashed-*`（破坏性变更）
- `Icon` 组件改用内置可爱图标集（101 个），`name` 支持帕斯卡命名（如 `<Icon name="HeartIcon" />`），并移除 `lucide-react` 运行时依赖（运行时依赖归零）；库根同时导出全部 101 个图标组件
- `DatePicker` 翻页箭头由 lucide 迁移为内联 SVG
- `Collapse` 展开装饰 SVG 改用 `Fish` 图标
- `Input` / `Table` 样式细节优化

### Removed

- `Divider` 移除 `line-*` 变体（破坏性变更）

## [1.9.0] - 2026-09-04

### Removed

- 移除 `Phone`、`Wallet`、`Time`、`Loading`、`WeddingInvitation` 组件（版权整改，详见 README）
- 移除 `Icon` 组件内置位图图标，改用 [lucide-react](https://lucide.dev/icons/) 矢量图标
- 移除 `BackTop` 内置位图素材，改为原创 SVG 徽章
- 移除 `Divider` 位图锯齿线素材，改为纯 CSS 渐变实现
- 移除全部内嵌 base64 图片与外部图片引用，仓库现零图片文件

### Changed

- **版权整改版本**：全 git 历史重写（git-filter-repo），删除全部第三方版权素材
- `Icon` 组件新增 `icon` prop，支持传入任意 lucide 图标组件
- `DatePicker` 翻页箭头、`Phone`（已移除）状态栏等图标全面迁移至 lucide
- README 与文档同步清理，移除案例展示章节

### Security

- 建议所有用户从 1.8.0 及以下版本升级至 1.9.0+

## [1.0.1] - 2026-06-09

### Fixed

- `vite.config.ts`：`assetInfo.name` → `assetInfo.names`（对齐 Rollup 弃用 API）
- `vite.config.ts`：修复 Vite 7 `assetFileNames` 多 output 一致性校验
- `vite.config.ts`：CSS 产物 `build.lib.cssFileName` 命名规范化
- `package.json`：`classnames` 移出 `dependencies`、改入 `peerDependencies`
- Icon 组件：488 个 PNG 由静态 import 改为动态懒加载

### Changed

- 字体加载策略调整
- 图片格式优化：`.png` → `.webp` / `.jpg`
- 移除 CSS 内联的 base64 图片

## [1.0.0] - 2026-XX-XX

### Added

- 首次正式发布 1.0.0 版本

## [0.9.x]

历史版本 0.9.0 ~ 0.9.8 因版权整改已从发布渠道移除，升级请直接使用 1.9.0+
