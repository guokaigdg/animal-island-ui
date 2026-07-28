# ADR 0003: Vite Library Mode 构建

## 状态

Accepted（已采纳）

## 背景

组件库交付 30 个组件、两套 Web 字体和 488 个 item 图标。传统的单文件库产物会把这些全部拖进每一个消费应用，不管它 import 的是一个组件还是全部组件。

Vite library mode 的默认行为与此背道而驰：它每种格式只产出一个扁平产物，并强制把每个被引用的资源内联为 data URI。对一个以按组件 tree-shaking 为核心价值的组件库来说，这两种行为都必须被覆盖。

## 决策

以 `src/index.ts` 为入口，用 Vite library mode 构建，target 为 `es2020`。类型声明由 `tsc --project tsconfig.build.json --emitDeclarationOnly` 单独产出到 `dist/types/`。

产出两份 Rollup output，都保留源码模块图：

- ES → `dist/es/[name].js`
- CJS → `dist/cjs/[name].cjs`，`exports: 'named'`

两者都设置 `preserveModules: true` 与 `preserveModulesRoot: 'src'`，因此每个源码模块对应一个产物文件，消费者的打包器可以丢掉从未 import 的组件 —— 连同它们的字体与图片。`cssCodeSplit: true` 让样式表沿同样的边界拆分。peer 包保持 external（见 [ADR 0001](0001-zero-runtime-dependencies.md)）。

`vite.config.ts` 里的六个插件让这套安排产出一个可用的包 —— 五个定义在该文件内，外加一个第三方插件：

- `strip-woff-fallback`（`stripWoffFallbackPlugin`）—— 改写 `@fontsource` 的 CSS，去掉 `woff` 兜底的 `url()`，并从产物中删除因此变成孤儿的 `.woff` 资源。本库面向的浏览器全都支持 `woff2`，产出的资源目录因此缩小约 40%。以 `enforce: 'pre'` 运行，确保改写发生在资源被收集之前。
- `@laynezh/vite-plugin-lib-assets`（`libAssetsPlugin`，`outputPath: 'files'`、`limit: 0`）—— 这个第三方插件击穿 library mode 的强制内联，把字体与图片以内容哈希文件的形式产出到 `dist/files/`。
- `inject-imported-css`（`injectImportedCssPlugin`）—— 在 `cssCodeSplit` 与 `preserveModules` 同时开启时，Vite 会产出逐组件的 CSS 却不写任何引用，留下一堆孤儿样式表。该插件读取每个 chunk 的 `viteMetadata.importedCss`，在前面插入 `import "./x.css"`（ES）或 `require("./x.css")`（CJS），使 import 一个组件就把它的样式带上。
- `emit-global-style-entry`（`emitGlobalStyleEntryPlugin`）—— 把全局样式表与全部组件 CSS Module 依次拼接进 `dist/index.css`，支撑 `animal-island-ui/style` 这个子路径。全局样式排在最前，组件规则才能解析到 `:root` 上的自定义属性。资源 URL 从相对源码（`url(../../files/x.svg)`）改写为相对 `dist`（`url("files/x.svg")`），`dist/files/` 中未被引用的文件会被删除。
- `copy-item-assets`（`copyItemAssetsPlugin`）—— 把 488 个 item PNG 拷到 `dist/items/` 以支撑 `animal-island-ui/items/*` 子路径，消费者按 URL 引用单个图标，只打包用到的那些。
- `prune-empty-dirs`（`pruneEmptyDirsPlugin`）—— 删除资源重定向在 `dist/` 下留下的空目录树。

`package.json` 补齐契约的另一半：`sideEffects: false`，以及覆盖根入口、`./style`、`./es/*`、`./items/*` 的 `exports` 映射。

## 影响

- 消费者只为自己 import 的东西付出体积代价，两种模块格式皆然。使用老式打包器的 CJS 消费者拿到的也是逐文件产物，而不是一整块。
- 不想要逐组件 CSS 的消费者，仍可以用一次 import 拿到完整样式。
- **永远不要关掉 `preserveModules` 或 `cssCodeSplit`。** 任一改动都会把产物塌缩成单体，悄无声息地让每一个消费者退回到「打包整个组件库」。重新开启资源内联或缩短 externals 列表，后果相同。
- 构建的正确性依赖插件顺序。`strip-woff-fallback` 必须早于资源收集；聚合与拷贝类插件运行在 `closeBundle`，即 CSS 写盘之后。
- `dist/files/` 的孤儿清理，是扫描产出的 JS 与 CSS 中形如 `files/<name>` 的字面量引用。路径在运行时拼出来的资源不会被找到，因而会被删除；资源必须静态 import，或从 CSS 中引用。
- 改完某个组件的样式后，确认这些规则仍出现在 `dist/index.css` 里 —— 聚合过程走的是产出的文件树，一个不再被产出的样式表会无声无息地从全局入口里消失。
