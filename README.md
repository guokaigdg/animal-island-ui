# animail-crossing-ui

a cozy island-style UI 风格的 React 组件库，基于 TypeScript + Vite 构建。

## 安装

```bash
npm install animail-crossing-ui
```

**Peer Dependencies:**

```json
{
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
}
```

## 使用

```tsx
import { Button, Modal, Switch } from "animail-crossing-ui";
import "animail-crossing-ui/dist/index.css";
```

## 组件一览

### 基础 UI

| 组件      | 说明                               |
| --------- | ---------------------------------- |
| `Button`  | 按钮                               |
| `Input`   | 输入框                             |
| `Switch`  | 开关                               |
| `Modal`   | 模态弹窗（SVG clip-path 有机形状） |
| `Card`    | 卡片容器                           |
| `Collapse`| 折叠面板                           |
| `Cursor`  | 治愈海岛风格手指光标                   |
| `Divider` | 分割线                             |

## 本地开发

```bash
# 安装依赖
npm install

# 启动 Demo 开发服务器
npm run dev

# 构建组件库
npm run build
```

启动后访问 Demo 页面可预览全部组件。

## 构建产物

```
dist/
  es/index.js       # ESM
  cjs/index.cjs     # CommonJS
  types/index.d.ts   # TypeScript 声明
  index.css          # 样式
```

## 技术栈

- React 18 + TypeScript
- Vite 6 (构建 & 开发服务器)
- Less CSS Modules (scoped 类名: `animail-[local]-[hash]`)
- SVG clip-path 实现有机形状裁切

## 参考网站

- [治愈系海岛风格 FAQ](https://www.example.com/tw/switch/island/faq/)
- [治愈系海岛风格 官网](https://www.example.com/tw/switch/island/index.html)
- [治愈系海岛风格 居民名录](https://www.example.com/tw/switch/island/namelist/m01.html)

## License

MIT
