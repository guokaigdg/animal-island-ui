# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 工具链：ESLint flat config + CI workflow + EditorConfig

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
