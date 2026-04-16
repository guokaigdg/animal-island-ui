# Contributing to animal-island-ui

感谢你对 animal-island-ui 的关注！欢迎提交 Issue 和 Pull Request。

## 提交 Issue

- 使用 [GitHub Issues](https://github.com/guokaigdg/animal-island-ui/issues) 提交 Bug 报告或功能建议
- Bug 报告请附上：复现步骤、预期行为、实际行为、浏览器/系统环境
- 功能建议请说明使用场景和期望的 API 设计

## 提交 Pull Request

1. Fork 本仓库并基于 `main` 创建分支 (`git checkout -b feature/my-feature`)
2. 编写代码并确保 `npm run build` 通过
3. 提交修改，遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：
    - `feat: add xxx` — 新功能
    - `fix: resolve xxx` — Bug 修复
    - `docs: update xxx` — 文档更新
    - `refactor: simplify xxx` — 重构
4. 推送到你的分支 (`git push origin feature/my-feature`)
5. 创建 Pull Request，描述改动内容和动机

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/guokaigdg/animal-island-ui.git
cd animal-island-ui

# 安装依赖
npm install

# 启动 Demo 开发服务器
npm run dev

# 构建组件库
npm run build

# 构建 Demo 站点
npm run build:demo
```

## 项目结构

```
src/
  components/
    Button/
      Button.tsx            # 组件实现
      button.module.less    # 样式（CSS Modules）
      index.ts              # 导出入口
    ...
  styles/
    variables.less          # 全局 Less 变量（设计令牌）
    index.less              # 全局样式入口
  index.ts                  # 库导出入口
demo/                       # Demo 站点源码
```

## 新增组件规范

1. 在 `src/components/` 下创建同名目录，包含 `组件.tsx`、`组件.module.less`、`index.ts`
2. 样式使用 Less CSS Modules，类名会自动生成为 `animal-[local]-[hash]`
3. 全局变量通过 `@import variables.less` 自动注入，直接使用 `@primary-color` 等变量即可
4. 在 `src/index.ts` 中导出组件及类型
5. 在 `demo/` 中添加组件演示

## 设计令牌

组件库通过 CSS 自定义属性（`--animal-*`）支持运行时主题定制。

| 类别 | 变量前缀                   | 示例                                                    |
| ---- | -------------------------- | ------------------------------------------------------- |
| 颜色 | `--animal-*-color`         | `--animal-primary-color`、`--animal-error-color`        |
| 字体 | `--animal-font-*`          | `--animal-font-size-base`、`--animal-font-family`       |
| 间距 | `--animal-spacing-*`       | `--animal-spacing-sm`(8px)、`--animal-spacing-lg`(16px) |
| 圆角 | `--animal-border-radius-*` | `--animal-border-radius-base`(18px)                     |
| 阴影 | `--animal-shadow-*`        | `--animal-shadow-base`                                  |
| 动画 | `--animal-motion-*`        | `--animal-motion-duration-base`(0.25s)                  |
| 尺寸 | `--animal-height-*`        | `--animal-height-base`(40px)                            |

覆盖示例：

```css
:root {
    --animal-primary-color: #19c8b9;
    --animal-text-color: #827157;
    --animal-bg-color: #f8f8f0;
}
```

## License

MIT
