# 编码规范

适用于仓库内每个文件的语言、样式与工具链规则。组件层面的约定（props 形态、代码骨架、命名、demo）见 [component-development.md](./component-development.md)，视觉规则见 [../design-system/design-rules.md](../design-system/design-rules.md)。

## TypeScript

- 编译器基线：`strict: true`、`isolatedModules: true`、`moduleResolution: 'bundler'`、`jsx: 'react-jsx'`、`target: ES2020`。
- 三套 tsconfig，各司其职：
    - `tsconfig.json` —— 基础配置，覆盖 `src` / `demo` / `test`
    - `tsconfig.build.json` —— 仅 `src`，`emitDeclarationOnly`，声明输出到 `dist/types`
    - `tsconfig.test.json` —— 仅测试文件，`noEmit`
- 不要在组件代码里用 `any`（ESLint warn，测试文件放宽）。刻意不使用的绑定用 `_` 前缀，以消除 unused-vars 告警。
- 类型导出必须用 `export type`，与值导出分开 —— `isolatedModules` 要求这样。

## CSS Modules

`vite.config.ts` 与 `vitest.config.ts` 声明了完全一致的 CSS Module 配置，因此构建与测试中类名解析结果相同：

- `generateScopedName: 'animal-[local]-[hash:base64:5]'` —— 生成形如 `animal-btn-primary-abc12` 的类名
- `localsConvention: 'camelCase'`
- Less 的 `additionalData` 自动注入 `src/styles/variables.less`，组件 `.less` 里可以直接用 `@primary-color` 之类的变量，无需显式 `@import`

两份配置必须保持同步；一旦出现分歧，测试断言的就是构建根本不会产出的类名。

## 设计 Token

设计 token 有两套，彼此不可互换：

1. **Less 编译期变量**（`src/styles/variables.less`，`@` 前缀）：`@primary-color`、`@text-color`、`@bg-color`、`@border-radius-base`、`@motion-ease`、`@height-base` 等。构建时被替换为字面量，不进运行时。
2. **运行时 CSS 自定义属性**（`src/styles/themes/default.less`，`--animal-` 前缀）：`--animal-primary-color`、`--animal-text-color`、`--animal-spacing-sm`、`--animal-font-family`、`--animal-shadow-sm` 等。组件 `.module.less` 通过 `var(--animal-*)` 引用，消费者可以覆盖。

组件样式优先用 `var(--animal-*)`，下游主题定制才能生效。只有当值必须参与编译期计算（算术、`darken()`、mixin）时，才用 Less 变量。

具体数值定义在 [../design-system/design-tokens.md](../design-system/design-tokens.md) —— 不要在代码注释或其他文档里再抄一遍。

`src/styles/index.less` 是全局样式入口（`fonts.less` + `themes/default.less` + `reset.less`）；它如何变成发布的样式表，见 [build-and-release.md](./build-and-release.md)。

## 格式化与 Lint

Prettier（`.prettierrc`）：单引号、4 空格缩进、带分号、尾逗号 `es5`、`printWidth: 120`、箭头函数参数总是加括号、`endOfLine: lf`。

ESLint（`eslint.config.js` 里的 flat config），在 `js.configs.recommended` + `typescript-eslint` recommended 之上：

- `@typescript-eslint/no-unused-vars`：warn，参数、变量与捕获的错误均忽略 `^_` 前缀
- `@typescript-eslint/no-explicit-any`：warn（测试与 demo 中关闭）
- `no-console`：warn，允许 `console.warn` / `console.error`（测试与 demo 中关闭）
- `prefer-const`：warn
- `eqeqeq`：error
- `react-refresh/only-export-components`：warn，带 `allowConstantExport`（demo 中关闭）
- 来自 `eslint-plugin-react-hooks` 的 React Hooks 规则
- 忽略：`dist` / `demo-dist` / `coverage` / `node_modules` / `scripts` / `*.config.{js,ts}` / `**/*.min.js` / `**/*.min.d.ts` / `**/island/**`

## 禁止事项

- 不要在 `vite.config.ts` 内嵌 Vitest 的 `test` 块 —— Vitest 4 会静默忽略。配置属于 `vitest.config.ts`，见 [testing.md](./testing.md)。
- 不要在组件 `.module.less` 里写全局选择器（`body`、`:root` 等）。全局样式放 `src/styles/`。
- 不要破坏 `src/index.ts` 的桶文件导出格式（值用 `export {}`，类型用 `export type {}`）。
- 不要硬编码 CSS Module 类名字面量做断言 —— 一律通过 `styles['xxx']` 引用。
- 不要虚构组件 API。看组件源码，或看 [component-development.md](./component-development.md) 里列出的 reference 文档。
- 不要新增运行时依赖；`dependencies` 保持 `{}`。
- 不要提交 `dist/`、`demo-dist/`、`coverage/`。

## 脚本踩坑

写一次性维护脚本时反复踩到的坑：

- 字符串批量替换：`String.replace` 是不可变的（返回值才是结果），在 replacer 回调里改的 `changed` flag 会逃逸出你以为的局部推理，`[^>]*` 不跨引号属性匹配。Vitest 的 JSON 输出必须用 `--outputFile` 显式指定路径。
- DOM 转 PNG 导出（html-to-image、modern-screenshot）：Chromium 在截图时不读 `document.fonts`，必须把 `@font-face` 规则作为 `<style>` 子节点塞进截图根节点，否则导出结果会回退到兜底字体。
