# ADR 0006：Time 的可格式化、可本地化日期胶囊

## 状态

已接受 —— 取代 [ADR 0005](0005-dayjs-as-the-date-layer.md) 中「`Time`……不引入 dayjs」这一条，该记录的其余内容保持不变。

## 背景

`Time` 渲染当前墙钟 `HH:MM`，下方是一个日期胶囊。胶囊的星期与月日由两个写死的英文数组（`Sunday…` 与 `Jan…`）拼出，因此组件只能显示 `MONDAY · Jun 8`：中文界面无法直接使用，调用方也完全无法改变日期形状。

要改这一点，会撞上 ADR 0005 立下的约束。`dayjs` 是打包进本包的，其 locale 注册表与宿主应用的那份副本互相独立：宿主应用即使 `import 'dayjs/locale/zh-cn'` 并调用 `dayjs.locale('zh-cn')`，也够不到 `Time` 看到的那个实例。所以 locale 只能作为 prop 传入，语言数据必须随组件一起发布。

## 决策

- **两个 format prop，而不是一个。** `weekdayFormat`（默认 `dddd`）与 `dateFormat`（默认 `MMM D`）接受 dayjs **核心** token。胶囊把星期（主色、800 字重）与月日（次级色、700 字重）放在各自独立的 span 里，单个整行 `format` 会丢掉这层视觉分层。插件 token 不会展开 —— 与 `DatePicker` 的契约一致。
- **`locale` prop 使用闭合联合类型。** `TimeLocale` 是 `'en' | 'zh-cn'` 而不是 `string`，因为语言数据必须已经在包里，这个 prop 才有意义。`zh-cn` 随组件模块一起发布，且在该语言下 `dateFormat` 默认 `M月D日`，常见场景只需传一个 prop。
- **locale 以绑定形式导入，而不是为了副作用导入。** `src/components/Time` 导入 `zh-cn` 的 locale 对象，再传给实例上的 `.locale(...)`。包声明了 `sideEffects: false`，裸 `import 'dayjs/locale/zh-cn'` 可能被消费者的打包器当成无副作用模块丢弃；被组件读取的值则不会被丢。
- **不设置全局 locale。** 格式化在副本上进行（`dayjs(now).locale(zhCn)`）；本库从不调用 `dayjs.locale()` 切换活动语言，宿主应用自己的 dayjs 行为不受影响。
- **时钟仍然基于 `Date`。** `HH:MM` 依旧从 `Date` 读取并围绕闪烁冒号拆分，只有日期胶囊走 dayjs。

## 后果

- `Time` 现在引入 dayjs，因此只 import 该组件的消费者会带上 dayjs（约 3 kB gzip）与 `zh-cn` 语言数据（约 1 kB gzip）。`preserveModules` 会让从不 import `Time` 的产物完全不含这两者。
- 日期胶囊保持「星期 · 月日」的顺序，这是组件的视觉标识。需要其他顺序或完全自定义整行时，需要改代码而非传 prop。
- 对包内的 dayjs 实例，`locale="zh-cn"` 开箱即用；宿主应用自己的 dayjs 仍保留其语言，两者按设计互相独立。
- `Time` 现在遵守与 `DatePicker` 相同的核心 token 契约，包括无法展开插件 token 这一限制。

## 相关

- 取代 [ADR 0005](0005-dayjs-as-the-date-layer.md) 中「`Time`……不引入 dayjs」这一条；其中 TimePicker 与 locale 的决策继续有效。
- dayjs 的打包与 external 策略：[ADR 0003](0003-vite-library-mode-build.md)。
