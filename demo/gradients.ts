// 代码生成的渐变图（data URI），仓库不携带任何图片素材文件
// 用途：demo 站占位图（Carousel / Image / Icon / 首页卡片等）

const svgToDataUri = (inner: string) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">${inner}</svg>`
    )}`;

export const islandGradient = svgToDataUri(
    '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7ec8e3"/><stop offset="100%" stop-color="#4aa8cc"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/>'
);

export const flowersGradient = svgToDataUri(
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fdf3e3"/><stop offset="100%" stop-color="#f9d9a9"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/>'
);

export const sceneryGradient = svgToDataUri(
    '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#aee3f5"/><stop offset="100%" stop-color="#e8f7d4"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/>'
);

export const GRADIENTS = [islandGradient, flowersGradient, sceneryGradient];
