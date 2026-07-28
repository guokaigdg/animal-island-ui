# ADR 0002: 双层设计 Token 体系

## 状态

Accepted（已采纳）

## 背景

本库的设计 token 服务两类受众，而两者的需求彼此不兼容。

组件作者写 Less Modules，需要能参与计算的值 —— 算术、`darken()` / `lighten()`、mixin 参数、媒体查询条件。Less 函数只能作用于编译器已知的值，CSS 自定义属性对它们是不透明的：`darken(var(--animal-primary-color), 10%)` 无法工作。

消费者的需求恰好相反。重新定制主题不应该要求 fork 或重新构建组件库。只有当组件绘制时用的值是在浏览器里经由级联解析出来的，应用侧样式表才有可能覆盖它。

只服务第一类受众，主题就被冻结在构建期；只服务第二类受众，需要计算的样式就写不出来。

## 决策

维护两层 token，层与层之间是单向依赖。

**第一层 —— Less 编译期变量。** `src/styles/variables.less` 是唯一事实来源：色板、中性色、字体排印、间距、圆角、阴影、动效曲线、控件高度，全部以 `@` 前缀声明。它们在编译期被替换为字面量，不存在于运行时。

该文件通过 `vite.config.ts` 里的 `css.preprocessorOptions.less.additionalData` 注入每一个 Less 编译单元，因此任意 `*.module.less` 都能直接引用 `@primary-color`，无需显式 `@import`。`vitest.config.ts` 重复了同一份注入，保证测试中样式的编译结果完全一致。

**第二层 —— 运行时 CSS 自定义属性。** `src/styles/themes/default.less` 把同一批 token 以 `--animal-*` 属性重新声明在 `:root` 上，每一项都由其 Less 对应项初始化：

```less
:root {
    --animal-primary-color: @primary-color;
    --animal-spacing-sm: @spacing-sm;
    --animal-motion-ease: @motion-ease;
}
```

这个映射是机械的，因此不存在重复的字面量 —— Less 文件仍是数值被写下来的唯一位置。这一层经由 `src/styles/index.less` 与聚合出的 `dist/index.css` 抵达消费者。

**编写规则。** 组件样式默认引用 `var(--animal-*)`。只有当值必须在编译期已知时才用 Less 变量：参与计算、颜色函数、mixin 参数或媒体查询。

## 影响

- 消费者在 `:root` 或任意作用域选择器上重新声明 `--animal-*` 即可换主题，无需构建步骤，也无需 fork。
- 新增一个 token 需要改两处：先在 `variables.less` 写值，再在 `default.less` 写映射。只加在 Less 层的 token 对消费者不可见。
- 任何用了 Less 变量的地方都会把字面量烘进产物，因此运行时**不可**覆盖。在本可以用自定义属性的地方选了 Less 变量，等于悄悄从主题定制 API 中拿掉了这个面。
- `--animal-*` 这些名字是公开 API。重命名或删除其中之一，对消费者就是破坏性变更，与用它的是哪个组件无关。
- 大多数值都存在两个名字，而选哪一个并没有工具强制。这需要 review 时人工把关；经验法则是：设计师可能想改的东西，都归自定义属性层。

具体 token 数值以及基于它们的视觉规则，记录在[设计体系](../design-system/)。
