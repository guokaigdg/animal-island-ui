# ADR 0001: 零运行时依赖

## 状态

Accepted（已采纳）

## 背景

`animal-island-ui` 被安装进的应用，已经拥有自己的依赖树。组件库在 `dependencies` 里声明的每一个包都会强加给这些应用：撑大安装体积、塞进消费者从未选择过的传递依赖树，而对 `react` 这类带状态的包来说，还有被解析成两个不同版本副本的风险。

组件库在运行时只需要三样东西：`react` 与 `react-dom` 负责渲染，`classnames` 负责条件类名拼接（`src/` 下有 12 个模块用到）。这三个包，React 应用要么本来就有，要么可以自行提供。源码树里没有别的东西需要运行时引入：设计 token 被编译为字面量（见 [ADR 0002](0002-dual-design-token-system.md)），字体与图片在构建时以静态文件形式产出。

## 决策

`package.json` 完全不声明 `dependencies` 字段。三项运行时需求以 peer dependencies 声明，版本范围刻意放宽：

```json
"peerDependencies": {
    "classnames": "^2.5.1",
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
}
```

同一批模块在 Rollup 配置里标记为 external，因此永远不会被内联进发布产物：

```
external: ['react', 'react-dom', 'react/jsx-runtime', 'classnames']
```

`react/jsx-runtime` 单独列出，是因为自动 JSX 转换会直接 import 它；漏掉它就会把 React 运行时的第二份副本打进 `dist/`。

字体包（`@fontsource/nunito`、`@fontsource/noto-sans-sc`）是开发依赖。它们的 `woff2` 文件在构建时被拷进 `dist/files/`，消费者拿到字体字节，但不会继承这两个包。

## 影响

- 安装本库不会带来任何传递依赖。发布的 tarball 就是 `dist/` 加类型垫片。
- React 版本由宿主应用决定。React 实例唯一，因此 hooks 与 context 能跨边界正常工作，不会踩到「两份 React」的坑。
- `react` 接受 17 及以上。因此组件库必须避免使用 React 17 之后引入的 API，除非做了保护。
- 消费者必须安装 `classnames`。npm 7 及以上会自动安装缺失的 peer dependencies，通常无感；使用更老 npm 或严格包管理器（未开 `auto-install-peers` 的 pnpm）的消费者会看到 unmet peer 警告，需要显式添加。
- 未来任何运行时工具函数，要么内置进 `src/`，要么提升为 peer dependency。新增一条 `dependencies` 就是推翻这个决策，必须以新记录取代本记录。
- 维护 externals 列表的正确性是 [ADR 0003](0003-vite-library-mode-build.md) 所述构建契约的一部分；删掉其中一项，就会悄无声息地把那个包的副本发给每一个消费者。
