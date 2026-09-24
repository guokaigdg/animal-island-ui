# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-09-24

### Changed

- **许可证由 CC BY-NC 4.0 变更为 MIT**：移除非商业使用限制，允许用户自由用于个人及商业用途
- **`naive-icons` 升级至 `1.2.0`**：新增 9 个图标，并修复组件改为 `forwardRef` 后图标不渲染的问题
- `Progress` 的 `variant` 改为可选项：不传时使用纯色填充，传时显示场景图

### Added

- `Upload` 上传组件：text / picture-card 两种列表形态，点击与拖拽触发，`beforeUpload` 拦截、`maxCount`、`customRequest` / `action` 真实上传，内置预览灯箱

## [1.13.0] - 2026-09-16

### Changed

- **图标迁移至 `naive-icons`**（破坏性变更）：内置 `Icon` 组件与 101 个私有图标移除，库改用独立的 [naive-icons](https://github.com/guokaigdg/naive-icons) 图标包；`naive-icons` 成为唯一运行时依赖，`Icon` 相关 API 迁移至该包
- `Divider` 的 `icon` prop 由图标名改为接收 React 图标元素（如 `<FishIcon />`）
- `Button` / `Collapse` / `Image` 内置装饰图标迁移至 `naive-icons`
- `naive-icons` 升级至 `1.1.0`：新增 15 个图标（箭头、折叠、复制、菜单、外链等），Demo Icon 页同步适配并补齐中文名
- `naive-icons` 升级至 `1.2.0`：新增 9 个图标（篮球、哑铃、谷歌浏览器、山、帐篷、暂停、停止、咖啡杯、水杯），修复主页与 Icon 页因组件改为 `forwardRef` 导致的图标不渲染问题
- `Title` 默认变体由 `layer` 改为 `ribbon`（飘带、默认）

### Added

- `Footer` 由图标链重构为版权栏：渲染 `© {year} {text}`，年份动态获取，文案默认 `All Rights Reserved.`，支持 `text` / `year` / `className` / `style` 自定义
- Demo Icon 页展示全部 `naive-icons` 图标及 npm / yarn / pnpm 安装说明
- Demo 首页与侧边栏改用 GROBOLD 展示字体

## [1.11.0] - 2026-09-11

### Added

- `Background` 组件扩展为 16 种图案类型（含 `grid`、`sprinkles` 及 13 种 `dots-*`）
- 工具链：ESLint flat config + CI workflow + EditorConfig

### Changed

- `Divider` 移除锯齿线 `line-*` 变体，仅保留虚线 `dashed-*`（破坏性变更）
- `Icon` 组件改用内置可爱图标集（101 个），`name` 支持帕斯卡命名（如 `<Icon name="HeartIcon" />`），并移除 `lucide-react` 运行时依赖（运行时依赖归零）；库根同时导出全部 101 个图标组件
- `DatePicker` 翻页箭头由 lucide 迁移为内联 SVG
- `Collapse` 展开装饰 SVG 改用 `Fish` 图标
- `Input` / `Table` 样式细节优化

### Removed

- `Divider` 移除 `line-*` 变体（破坏性变更）

## [1.9.0] - 2026-09-04

### Removed

- 移除 `Phone`、`Wallet`、`Time`、`Loading`、`WeddingInvitation` 组件（版权整改，详见 README）
- 移除 `Icon` 组件内置位图图标，改用 [lucide-react](https://lucide.dev/icons/) 矢量图标
- 移除 `BackTop` 内置位图素材，改为原创 SVG 徽章
- 移除 `Divider` 位图锯齿线素材，改为纯 CSS 渐变实现
- 移除全部内嵌 base64 图片与外部图片引用，仓库现零图片文件

### Changed

- **版权整改版本**：全 git 历史重写（git-filter-repo），删除全部第三方版权素材
- `Icon` 组件新增 `icon` prop，支持传入任意 lucide 图标组件
- `DatePicker` 翻页箭头、`Phone`（已移除）状态栏等图标全面迁移至 lucide
- README 与文档同步清理，移除案例展示章节

### Security

- 建议所有用户从 1.8.0 及以下版本升级至 1.9.0+

## [1.0.1] - 2026-06-09

### Fixed

- `vite.config.ts`：`assetInfo.name` → `assetInfo.names`（对齐 Rollup 弃用 API）
- `vite.config.ts`：修复 Vite 7 `assetFileNames` 多 output 一致性校验
- `vite.config.ts`：CSS 产物 `build.lib.cssFileName` 命名规范化
- `package.json`：`classnames` 移出 `dependencies`、改入 `peerDependencies`
- Icon 组件：488 个 PNG 由静态 import 改为动态懒加载

### Changed

- 字体加载策略调整
- 图片格式优化：`.png` → `.webp` / `.jpg`
- 移除 CSS 内联的 base64 图片

## [1.0.0] - 2026-XX-XX

### Added

- 首次正式发布 1.0.0 版本

## [0.9.x]

历史版本 0.9.0 ~ 0.9.8 因版权整改已从发布渠道移除，升级请直接使用 1.9.0+
