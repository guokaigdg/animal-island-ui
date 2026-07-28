# 仓库结构

## 项目简介

animal-island-ui 是一套受《治愈系海岛风格》启发的 React + TypeScript UI 组件库，面向个人学习与非商业用途。设计语言核心：温暖大地色、大圆角 pill 形、游戏按键立体感、柔和动效、几何与有机形状并存 —— 定义见 [../design-system/](../design-system/)。

- 仓库：https://github.com/guokaigdg/animal-island-ui
- License：CC BY-NC 4.0（禁止商业使用）—— 见 `LICENSE`
- 当前版本：见 `package.json`
- 组件清单：以 `src/index.ts` 为准；`src/components/` 下每个含有同名 `<Name>.tsx` 的目录算一个组件

## 技术栈

| 类别     | 选型                                            |
| -------- | ----------------------------------------------- |
| 框架     | React 18（peerDependencies 支持 >=17）          |
| 语言     | TypeScript 5.7，`strict: true`                  |
| 构建     | Vite 7（library mode，ES + CJS 双格式输出）     |
| 测试     | Vitest 4 + jsdom 29 + @testing-library/react 16 |
| 无障碍   | axe-core 4 + vitest-axe（`npm run test:a11y`）  |
| 样式     | Less Modules（`*.module.less`）                 |
| 代码规范 | ESLint 9（flat config）+ Prettier               |
| 包管理   | npm（`package-lock.json`）                      |
| Node     | `engines.node >= 18`                            |

## npm 脚本

```bash
npm run dev          # 启动 Demo 开发服务器（vite，非库构建）
npm run build        # 构建组件库产物到 dist/（vite build + tsc --emitDeclarationOnly）
npm run build:demo   # 构建 Demo 站点到 demo-dist/
npm run test         # vitest watch
npm run test:run     # vitest run（单次）
npm run test:cov     # 覆盖率 + json 输出
npm run test:a11y    # axe-core 无障碍冒烟测试（独立的 vitest 配置）
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm run check:docs   # 文档漂移检查（scripts/check-docs-sync.mjs）
npm run badges       # 重新生成覆盖率徽章并同步进两份 README
npm run ci           # format:check + check:docs + lint + test:run + test:a11y + build
npm run deploy       # build:demo + 发布 demo-dist 到 GitHub Pages
npm run setup:hooks  # 把 git 指向 .githooks（由 prepare 自动执行）
```

开发时的快速回路：`npm run lint && npm run test:run && npm run build`。`npm run ci` 是关卡 —— 它同时跑在 pre-commit 钩子里，见 [contributing.md](./contributing.md)。

## 目录结构

```
src/
  components/
    <ComponentName>/
      <ComponentName>.tsx        # 组件实现
      <component>.module.less    # 样式（CSS Modules，文件名小写连字符）
      index.ts                   # 导出入口（export { X } from './X'; export type { ... }）
      <ComponentName>.test.tsx   # 单测，与组件同目录
  styles/
    variables.less               # Less 编译期设计 token（@primary-color 等）
    themes/default.less          # 运行时 CSS 自定义属性（--animal-*）
    fonts.less / reset.less / index.less
  assets/                        # 字体、图片资源
  index.ts                       # 组件库总导出桶文件
demo/                            # Demo 站点源码（不进 npm 产物）
test/                            # 测试公共工具（setup.ts / utils.tsx / components.tsx）+ a11y.test.tsx
scripts/                         # check-docs-sync.mjs / generate-coverage-badges.mjs
docs/
  design-system/                 # 视觉规范的权威定义：token、规则、逐组件像素级 spec
  development/                   # 当前目录
  adr/                           # 架构决策记录
  zh-CN/                         # docs/ 的中文镜像
  img/                           # README 引用的截图
  README.zh-CN.md                # 中文 README（镜像根目录 README.md）
skills/
  animal-island-ui-style/        # 对外发布的 skill 包（references/components/*.md）
```

## 路径别名

- `@/*` → `./src/*` —— 在 `tsconfig.json`、`vite.config.ts`、`vitest.config.ts` 三处声明
- `@test/*` → `./test/*` —— 在 `tsconfig.json`、`vitest.config.ts` 两处声明（仅测试可用）

需要它们的配置里都已经接好，直接按别名 import，不要写长相对路径。
