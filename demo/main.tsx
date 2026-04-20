import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.body.style.margin = '0';

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  *::-webkit-scrollbar { display: none; }
`;
//   * { scrollbar-width: none; font-family: Nunito, 'Zen Maru Gothic', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif !important; }
document.head.appendChild(globalStyle);

// 添加全局光标样式
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  * { cursor: url('./cursor-icon.png') 4 0, auto; }
`;
document.head.appendChild(cursorStyle);

// 生成圆角 favicon
const faviconImg = new Image();
faviconImg.crossOrigin = 'anonymous';
faviconImg.src = new URL('./img/animal.ico', import.meta.url).href;
faviconImg.onload = () => {
    const size = 64;
    const radius = 14;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.arcTo(size, 0, size, size, radius);
    ctx.arcTo(size, size, 0, size, radius);
    ctx.arcTo(0, size, 0, 0, radius);
    ctx.arcTo(0, 0, size, 0, radius);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(faviconImg, 0, 0, size, size);
    const link =
        document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
        document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
