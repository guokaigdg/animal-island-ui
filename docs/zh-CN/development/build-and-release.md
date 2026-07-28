# 构建与发布

`npm run build` 产出发布物：`vite build` 把 JavaScript、CSS 与静态资源输出到 `dist/`，随后 `tsc --project tsconfig.build.json --emitDeclarationOnly` 把类型声明输出到 `dist/types/`。下面这些选择背后的理由记录在 [../adr/](../adr/)，本页是契约本身。

## 构建契约

`vite.config.ts` 在 `@vitejs/plugin-react` 之上注册了六个插件来支撑按需引入。改动构建逻辑时若不保住以下契约，就会破坏消费者的 tree-shaking：

- **双格式输出** —— ES 输出到 `dist/es/`，CJS 输出到 `dist/cjs/`，两者都开 `preserveModules: true` 与 `preserveModulesRoot: 'src'`，消费者才能按组件 tree-shake，未使用组件的字体与图片也不会进入他们的产物包。不要关掉 `preserveModules`。
- **external 不打包** —— `react`、`react-dom`、`react/jsx-runtime`、`classnames` 永不被打进产物，它们是 peerDependencies。
- **`cssCodeSplit: true` + `injectImportedCssPlugin`** —— 组件 CSS 按模块拆分，插件把 `import "./x.css"`（ES）/ `require("./x.css")`（CJS）回填进产出的 JavaScript，消费者 import 一个组件就只带进它自己的样式。不要关掉 `cssCodeSplit`。
- **资源不内联** —— `@laynezh/vite-plugin-lib-assets`（`outputPath: 'files'`、`limit: 0`）把字体与图片写到 `dist/files/`，而不是让 library mode 强制内联；`copyItemAssetsPlugin` 把 `src/assets/img/icons/items/` 下所有 item PNG 拷到 `dist/items/`，消费者才能单独引用 `animal-island-ui/items/*`。
- **全局样式入口** —— `emitGlobalStyleEntryPlugin` 聚合出 `dist/index.css`（即 `animal-island-ui/style` 指向的文件），并清理 `dist/files/` 里的孤儿资源。改完某个组件的 CSS 后，确认这些样式仍出现在 `dist/index.css` 里。
- **字体只留 woff2** —— `stripWoffFallbackPlugin` 删掉与 woff2 一起产出的 woff 备份，字体体积降低约 40%。
- `pruneEmptyDirsPlugin('dist')` 清理上述步骤留下的空目录。

## 包契约

`package.json` 已经为按需引入配好，保持这个状态：

- `exports` 把 `.` 映射到 ES / CJS / types 三件套，`./style` 映射到 `dist/index.css`，`./es/*` 映射到保留模块结构的 ES 产物，`./items/*` 映射到拷贝出来的 item 资源。
- `sideEffects: false` 让打包器可以丢弃未使用的模块。
- `files` 把发布的 tarball 限制在构建产物加顶层类型垫片与文档。
- `dependencies` 为 `{}`。组件库零运行时依赖 —— 所有第三方包要么是 peerDependency，要么是 devDependency。

`prepublishOnly` 会执行 `npm run build`，因此每次发布带出去的都是新鲜产物。

## 徽章

`npm run badges`（`scripts/generate-coverage-badges.mjs`）读取 `coverage/coverage-summary.json` 与 `coverage/vitest-results.json`，写出 `coverage/badges/coverage.json`，通过扫描 `src/components/` 下含有同名 `<Name>.tsx` 的目录统计组件数，并改写 `README.md` 与 `docs/README.zh-CN.md` 里硬编码的 `tests-NN` 和 `components-NN` 徽章。先跑 `npm run test:cov` —— 覆盖率汇总文件缺失时脚本会直接报错退出。

## Demo 站点

`npm run build:demo` 用 `vite.config.demo.ts` 把 demo 构建到 `demo-dist/`；`npm run deploy` 在此之后接上 `gh-pages -d demo-dist` 发布。demo 永远不进 npm 产物。
