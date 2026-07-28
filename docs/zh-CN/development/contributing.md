# 贡献指南

欢迎提交 Issue 与 Pull Request。

## 提交 Issue

- Bug 反馈与功能建议走 [GitHub Issues](https://github.com/guokaigdg/animal-island-ui/issues)。
- Bug 反馈请附上复现步骤、预期行为、实际行为，以及浏览器与操作系统。
- 功能建议请描述使用场景，以及你设想的 API 设计。

## Pull Request

1. Fork 仓库，从 `main` 拉分支（`git checkout -b feature/my-feature`）。
2. 写代码，并确保 `npm run ci` 通过。
3. 按 [Conventional Commits](https://www.conventionalcommits.org/) 提交：
    - `feat: add xxx` —— 新功能
    - `fix: resolve xxx` —— 修复缺陷
    - `docs: update xxx` —— 文档
    - `refactor: simplify xxx` —— 重构
    - `chore:` / `test:` —— 工具链与测试
4. 推送分支（`git push origin feature/my-feature`）。
5. 开 Pull Request，说明改了什么以及为什么。

`npm run ci` 是 `format:check` + `check:docs` + `lint` + `test:run` + `test:a11y` + `build`。它必须全绿，PR 才会进入 review。

## Pre-commit 钩子

git pre-commit 钩子会在每次 `git commit` 前跑 `npm run ci`，CI 失败则中止提交。

- **新克隆仓库**：`npm install` 会通过 `prepare` 脚本自动装好钩子（`git config core.hooksPath .githooks`）。
- **手动安装**：`npm run setup:hooks`
- **卸载**：`git config --unset core.hooksPath`
- **紧急绕过**（不建议）：`git commit --no-verify` —— 完全跳过检查，坏代码会因此进仓库
- **钩子位置**：`.githooks/pre-commit`，已提交进仓库，新克隆即可获得

## 本地开发

```bash
# 克隆
git clone https://github.com/guokaigdg/animal-island-ui.git
cd animal-island-ui

# 安装依赖（同时装好 pre-commit 钩子）
npm install

# 启动 Demo 开发服务器
npm run dev

# 构建组件库
npm run build

# 构建 Demo 站点
npm run build:demo
```

完整脚本清单见 [repository-structure.md](./repository-structure.md)。

## 提 PR 前

- 新增或修改了组件？按 [component-development.md](./component-development.md) 走一遍，包括其中的文档同步矩阵与四处 demo 注册点。
- 组件数或覆盖率有变化？跑 `npm run badges`，让 `README.md` 与 `docs/README.zh-CN.md` 保持同步。
- 改了 `docs/` 下的英文文件？在同一个 commit 里更新它在 `docs/zh-CN/` 的对应文件 —— 否则 `npm run check:docs` 会失败。
- 加了运行时依赖？不要加 —— 见 [build-and-release.md](./build-and-release.md)。

## 许可证

贡献的代码采用本仓库的许可证 CC BY-NC 4.0（见 `LICENSE`）。禁止商业使用。
