// 场景背景图（Progress 填充场景图 / Background 场景背景同款）集中导出。
// 多个组件引用同一 URL，preserveModules 下避免同源资源被多个 chunk 重复 emit
// （否则会触发 "emitted file ... overwrites a previously emitted file" 警告）。
// 仅收录被多组件共用的资源；单组件独占的图片（如 forest-grove / starry-camp）保持直接 import。
// 用 new URL(..., import.meta.url) 而不是 import：前者只是字符串，不会产生模块依赖，
// Node 加载本包时就不会去解析 SVG 文件。构建产物里的 data URI 会被
// `foldDataUriNewUrlPlugin` 折叠成字符串（见 vite.config.ts）。
export const sweetCorner = new URL('./sweet-corner.svg', import.meta.url).href;
export const coffeeBreak = new URL('./coffee-break.svg', import.meta.url).href;
