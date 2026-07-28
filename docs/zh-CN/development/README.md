# 开发文档

如何构建、测试并交付 animal-island-ui 的改动。视觉规范见 [../design-system/](../design-system/)，架构背后的取舍见 [../adr/](../adr/)。

## 目录

- [repository-structure.md](./repository-structure.md) —— 项目简介、技术栈、npm 脚本、目录结构与路径别名。
- [component-development.md](./component-development.md) —— 新增或修改组件的完整流程：文件结构、导出、demo 注册、文档同步。
- [coding-standards.md](./coding-standards.md) —— TypeScript、CSS Modules、设计 token 用法、lint 与格式化规则、禁止事项。
- [testing.md](./testing.md) —— Vitest 配置、覆盖率阈值、单测与无障碍测试约定。
- [build-and-release.md](./build-and-release.md) —— 组件库的构建契约，以及它支撑的包入口。
- [contributing.md](./contributing.md) —— Issue、Pull Request、提交格式、pre-commit 钩子。

## 阅读顺序

1. `repository-structure.md`：先在目录树里找到方向。
2. `contributing.md`：搭好本地环境，理解提交关卡。
3. `component-development.md`：日常开发的主流程。
4. `coding-standards.md` 与 `testing.md`：一次改动落地前必须满足的规则。
5. `build-and-release.md`：只在改动 `vite.config.ts`、`package.json` 或发布产物时才需要看。
