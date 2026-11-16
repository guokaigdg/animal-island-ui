# 构建与发布

`npm run build` 产出发布物：`vite build` 把 JavaScript、CSS 与静态资源输出到 `dist/`，随后 `tsc --project tsconfig.build.json --emitDeclarationOnly` 把类型声明输出到 `dist/types/`。下面这些选择背后的理由记录在 [../adr/](../adr/)，本页是契约本身。

## 构建契约

`vite.config.ts` 在 `@vitejs/plugin-react` 之上注册了六个插件来支撑按需引入。改动构建逻辑时若不保住以下契约，就会破坏消费者的 tree-shaking：

- **双格式输出** —— ES 输出到 `dist/es/`，CJS 输出到 `dist/cjs/`，两者都开 `preserveModules: true` 与 `preserveModulesRoot: 'src'`，消费者才能按组件 tree-shake，未使用组件的字体与图片也不会进入他们的产物包。不要关掉 `preserveModules`。
- **external 不打包** —— `react`、`react-dom`、`react/jsx-runtime`、`classnames` 永不被打进产物，它们是 peerDependencies。
- **`cssCodeSplit: true` + `injectImportedCssPlugin`** —— 组件 CSS 按模块拆分，插件把 `import "./x.css"`（ES）/ `require("./x.css")`（CJS）回填进产出的 JavaScript，消费者 import 一个组件就只带进它自己的样式。不要关掉 `cssCodeSplit`。
- **资源不内联** —— `@laynezh/vite-plugin-lib-assets`（`outputPath: 'files'`、`limit: 0`）把字体与图片写到 `dist/files/`，而不是让 library mode 强制内联。
- **全局样式入口** —— `emitGlobalStyleEntryPlugin` 聚合出 `dist/index.css`（即 `animal-island-ui/style` 指向的文件），并清理 `dist/files/` 里的孤儿资源。改完某个组件的 CSS 后，确认这些样式仍出现在 `dist/index.css` 里。
- **ESM 兼容的类型声明** —— `scripts/fix-dts-extensions.mjs` 把 `dist/types/` 里的相对说明符改写成 ESM 形式（`./Button` → `./Button.js`，`./components/Button` → `./components/Button/index.js`），并去掉样式副作用导入。本包是 ESM（`"type": "module"`），消费方用 `moduleResolution: "node16"` / `"nodenext"` 时无法解析 `tsc` 从源码原样抄来的无扩展名、目录式说明符 —— 模块图整体解析失败，**所有导出退化成 `any`**，消费方的类型检查被静默关掉（issue #79）。`npm run check:types` 会在 `dist/types/` 里仍有缺扩展名或指向不存在 `.d.ts` 的相对说明符时让构建失败。这与上面的 `rewriteCssAssetUrls` 是同一条纪律：让发布产物去适配本包自己的 exports 契约，而不是让消费方迁就我们的源码风格。
- **字体只留 woff2** —— `stripWoffFallbackPlugin` 删掉与 woff2 一起产出的 woff 备份，字体体积降低约 40%。
- `pruneEmptyDirsPlugin('dist')` 清理上述步骤留下的空目录。

## 包契约

`package.json` 已经为按需引入配好，保持这个状态：

- `exports` 把 `.` 映射到 ES / CJS / types 三件套，`./style` 映射到 `dist/index.css`，`./es/*` 映射到保留模块结构的 ES 产物，`./items/*` 映射到拷贝出来的 item 资源。
- `sideEffects: false` 让打包器可以丢弃未使用的模块。
- `files` 把发布的 tarball 限制在构建产物加顶层类型垫片与文档。
- `dependencies` 只保留两个运行时依赖，都是无传递依赖的纯包：`naive-icons`（图标集）与 `dayjs`（日期层，见 [ADR 0005](../adr/0005-dayjs-as-the-date-layer.md)）。其余第三方包一律要么是 peerDependency，要么是 devDependency。`dayjs` **不**进入 `external` 列表，因此它被产出为 `dist/**/node_modules/dayjs/` 下的单份文件、由本包内的日期/时间组件共享，消费者无需额外安装；但宿主应用自己引入 `dayjs` 时仍可能出现互相独立的实例，二者不共享 locale 与插件注册。`preserveModules` 仍能让未引入日期或时间组件的消费者摇掉它。不得再新增运行时依赖。

`prepublishOnly` 会执行 `npm run build`，因此每次发布带出去的都是新鲜产物。

## 徽章

`npm run badges`（`scripts/generate-coverage-badges.mjs`）读取 `coverage/coverage-summary.json` 与 `coverage/vitest-results.json`，写出 `coverage/badges/coverage.json`，通过扫描 `src/components/` 下含有同名 `<Name>.tsx` 的目录统计组件数，并改写 `README.md` 与 `docs/README.zh-CN.md` 里硬编码的 `tests-NN` 和 `components-NN` 徽章。先跑 `npm run test:cov` —— 覆盖率汇总文件缺失时脚本会直接报错退出。

## Demo 站点

`npm run build:demo` 用 `vite.config.demo.ts` 把 demo 构建到 `demo-dist/`；`npm run deploy` 在此之后接上 `gh-pages -d demo-dist` 发布。demo 永远不进 npm 产物。
