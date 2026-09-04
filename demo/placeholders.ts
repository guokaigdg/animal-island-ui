// 代码生成的纯色图（data URI），仓库不携带任何图片素材文件
// 用途：demo 站占位图（Carousel / Image / Icon / 首页卡片等）

const svgToDataUri = (inner: string) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">${inner}</svg>`
    )}`;

export const islandPlaceholder = svgToDataUri('<rect width="640" height="400" fill="#7ec8e3"/>');

export const flowersPlaceholder = svgToDataUri('<rect width="640" height="400" fill="#f9d9a9"/>');

export const sceneryPlaceholder = svgToDataUri('<rect width="640" height="400" fill="#bfe3a8"/>');

export const PLACEHOLDERS = [islandPlaceholder, flowersPlaceholder, sceneryPlaceholder];
