# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 工具链：ESLint flat config + CI workflow + EditorConfig

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

历史版本 0.9.0 ~ 0.9.8 见 [GitHub Releases](https://github.com/guokaigdg/animal-island-ui/releases)
