# ADR 0003: Vite Library Mode 构建

## 状态

Accepted（已采纳）

## 背景

组件库交付 43 个组件和两套 Web 字体。传统的单文件库产物会把这些全部拖进每一个消费应用，不管它 import 的是一个组件还是全部组件。

Vite library mode 的默认行为与此背道而驰：它每种格式只产出一个扁平产物，并强制把每个被引用的资源内联为 data URI。对一个以按组件 tree-shaking 为核心价值的组件库来说，这两种行为都必须被覆盖。

## 决策

以 `src/index.ts` 为入口，用 Vite library mode 构建，target 为 `es2020`。类型声明由 `tsc --project tsconfig.build.json --emitDeclarationOnly` 单独产出到 `dist/types/`，再由 `scripts/fix-dts-extensions.mjs` 规范化（见下文 ESM 声明段落）。

产出两份 Rollup output，都保留源码模块图：

- ES → `dist/es/[name].js`
- CJS → `dist/cjs/[name].cjs`，`exports: 'named'`

两者都设置 `preserveModules: true` 与 `preserveModulesRoot: 'src'`，因此每个源码模块对应一个产物文件，消费者的打包器可以丢掉从未 import 的组件 —— 连同它们的字体与图片。`cssCodeSplit: true` 让样式表沿同样的边界拆分。peer 包保持 external（见 [ADR 0001](0001-zero-runtime-dependencies.md)）。

external 由**判定函数**而非字面量列表决定：`isPeerDependency` 匹配 `react`、`react-dom`、`classnames` **及其全部子路径入口**（`react-dom/client`、`react/jsx-runtime` 等）。Rollup 的 `external` 数组只做字面量匹配，一旦漏掉某个子路径导入，它就会被**打进产物**而不是 external 掉。被打进去的 `react-dom/client` 会去写**消费者** react-dom 的 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint` —— 而 React 19 已移除该字段 —— 于是 React 19 项目里调用 `Notification.success()` 会抛 `TypeError: Cannot set properties of undefined`（issue #78）。`npm run check:bundle` 会在任何 peer 依赖（或那个已被移除的内部字段）重新出现在 `dist/` 时让构建失败。

`vite.config.ts` 里的四个插件让这套安排产出一个可用的包 —— 三个定义在该文件内，外加一个第三方插件：

- `strip-woff-fallback`（`stripWoffFallbackPlugin`）—— 改写 `@fontsource` 的 CSS，去掉 `woff` 兜底的 `url()`，并从产物中删除因此变成孤儿的 `.woff` 资源。本库面向的浏览器全都支持 `woff2`，产出的资源目录因此缩小约 40%。以 `enforce: 'pre'` 运行，确保改写发生在资源被收集之前。
- `@laynezh/vite-plugin-lib-assets`（`libAssetsPlugin`，`outputPath: 'files'`、`limit: 0`）—— 这个第三方插件击穿 library mode 的强制内联，把字体与图片以内容哈希文件的形式产出到 `dist/files/`。
- `emit-global-style-entry`（`emitGlobalStyleEntryPlugin`）—— 把全局样式表与全部组件 CSS Module 依次拼接进 `dist/index.css`，支撑 `animal-island-ui/style` 这个子路径。全局样式排在最前，组件规则才能解析到 `:root` 上的自定义属性。资源 URL 从相对源码（`url(../../files/x.svg)`）改写为相对 `dist`（`url("files/x.svg")`），`dist/files/` 中未被引用的文件会被删除。
- `prune-empty-dirs`（`pruneEmptyDirsPlugin`）—— 删除资源重定向在 `dist/` 下留下的空目录树。

样式以**单一样式表**交付。组件 JavaScript 里刻意不带任何 CSS 导入。发布出去的 `import "./x.css"` 是一种文件式导入，Node 拒绝解析它 —— 整个包在纯 Node 里加载失败（`ERR_UNKNOWN_FILE_EXTENSION`），任何顺着模块图走的 SSR 打包器同样失败，哪怕消费方根本没要那份样式表。于是本库把所有规则统一通过 `dist/index.css`（`animal-island-ui/style`）交付，它已经包含全局令牌与全部 43 个组件的样式表；消费方在入口处 import 一次即可。逐组件 CSS 导入固然更精细，但不值得为此让这个包在浏览器打包器之外加载不了。

插画资源用 `new URL('./x.svg', import.meta.url).href` 引用，而不是 `import`。用 `import` 会在发布的 JavaScript 里留下 `import x from "../../files/x.svg"` —— 又是 Node 解析不了的文件式导入。`new URL(...)` 只产出一个字符串，模块图保持干净。Vite 的 library mode 会把这类资源一律内联成 data URI（`shouldInline` 对 `build.lib` 直接返回 `true`），这也是唯一能在消费方打包器里存活的形式：指向 `dist/files/` 的相对路径会被按消费方自己的产物 chunk 解析，直接 404。代价是四张场景插画（约 315 KB SVG）以百分号编码的 data URI 形式烤进 JavaScript，比源文件大约 20%。

`package.json` 补齐契约的另一半：`sideEffects: false`，以及覆盖根入口、`./style`、`./es/*` 的 `exports` 映射。`./es/*` 子路径带 `types` 条件指向 `dist/types/*`，消费方按路径 import 组件时，在任何 `moduleResolution` 下都拿得到类型。

## 影响

- 消费者只为自己 import 的东西付出体积代价，两种模块格式皆然。使用老式打包器的 CJS 消费者拿到的也是逐文件产物，而不是一整块。
- 不想要逐组件 CSS 的消费者，仍可以用一次 import 拿到完整样式。这次 import 现在是唯一的样式通道 —— 消费方忘了 `import 'animal-island-ui/style'`，拿到的就是没有样式的组件。
- 发布的 JavaScript 里没有任何文件式导入 —— 没有 CSS、没有 SVG、没有字体 URL。`npm run check:bundle` 会在它们重新出现时让构建失败，因为它造成的后果（包加载不了）要等到消费方在 Node 或 SSR 里加载这个库时才会暴露。
- import 了 `Progress` 或 `Background` 的消费方，JavaScript 里会带上约 54 KB（gzip）的场景插画。它们不再是独立的、可单独缓存的文件。
- **永远不要关掉 `preserveModules` 或 `cssCodeSplit`。** 任一改动都会把产物塌缩成单体，悄无声息地让每一个消费者退回到「打包整个组件库」。重新开启资源内联或收窄 externals 判定函数，后果相同 —— peer 依赖一旦进了 `dist/`，就会遮蔽消费者自己那份并在运行时炸掉。
- 构建的正确性依赖插件顺序。`strip-woff-fallback` 必须早于资源收集；聚合插件运行在 `closeBundle`，即 CSS 写盘之后。
- `dist/files/` 的孤儿清理，是扫描产出的 JS 与 CSS 中形如 `files/<name>` 的字面量引用。路径在运行时拼出来的资源不会被找到，因而会被删除；资源必须静态 import，或从 CSS 中引用。
- 改完某个组件的样式后，确认这些规则仍出现在 `dist/index.css` 里 —— 聚合过程走的是产出的文件树，一个不再被产出的样式表会无声无息地从全局入口里消失。
