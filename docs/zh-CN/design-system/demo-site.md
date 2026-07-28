# Demo Site

以下规范描述的是 Demo 与文档站，不属于发布的组件库。它们是 `demo/App.tsx` 的实际布局数值，保留下来用于还原完整页面效果。

## 整体布局

```css
/* 页面背景 */
/* 首页 */
background:
    url(home_bg.svg) center/cover no-repeat,
    #7dc395;
/* 组件页 */
background: url(content_bg_pc.jpg) center fixed;

/* Sidebar */
width: 220px;
min-width: 220px;
background: url(menu_bg.svg) center/cover no-repeat;
```

## Sidebar 精确值

```css
/* 顶部 Logo 区 */
padding: 20px 16px 12px;
border-bottom: 1px solid #e8e2d6;
font-weight: 700;
font-size: 15px;
color: #725d42;
letter-spacing: -0.3px;

/* Logo 图片 */
width: 24px;
height: 24px;
margin-right: 8px;

/* 菜单列表 */
padding: 8px 0;

/* 分类标题 */
padding: 12px 16px 4px;
font-size: 11px;
color: #a0936e;
font-weight: 600;
letter-spacing: 0.5px;
text-transform: uppercase;

/* 菜单项 */
margin: 1px 5px;
height: 40px;
padding: 0 16px;
padding-left: 26px;
font-weight: 600;
font-size: 14px;
border-radius: 12px;
transition: all 0.15s;

/* inactive */
color: #8a7b66;
background: transparent;
/* inactive hover */
background: #d6dff0;
/* active */
color: #fff;
background: #b7c6e5;
```

## 主内容区

```css
/* 桌面 */
padding: 32px 40px;

/* 底部装饰图（桌面端，固定定位）*/
left: 220px;
width: calc(100% - 220px);
z-index: 0;
pointer-events: none;
```

## 移动端适配

```css
/* 顶栏 */
height: 52px; padding: 0 12px;
background: rgba(255, 252, 244, 0.92);
backdrop-filter: blur(8px);
border-bottom: 1px solid #e8e2d6;
z-index: 50;

/* 按钮 */ font-size: 20px; color: #725d42; padding: 4px 8px; border-radius: 8px;

/* 主内容区 padding-top */ 68px;

/* 抽屉 */
width: 240px; z-index: 99;
box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
/* 遮罩 */ background: rgba(0, 0, 0, 0.35); z-index: 98;
```

## HomePage

```css
/* Hero 区域 */
padding: 60px 40px 40px;
min-height: 80vh;

/* 主标题 */
font-size: 50px;
font-weight: 700;
color: #fff9e6;
text-shadow: 0px 4px 1px rgba(0, 0, 0, 0.4);
margin: 0 0 12px;

/* 版本 Badge */
font-size: 12px;
font-weight: 600;
padding: 2px 10px;
border-radius: 10px;
background: #e6f9f6;
color: #19c8b9;
margin-left: 8px;

/* 副标题 */
font-size: 17px;
color: #7c5734;
line-height: 1.7;
margin: 0 0 28px;
max-width: 520px;

/* Logo 图片 */
width: 172px;
height: 172px;

/* Section */
padding: 48px 40px;
max-width: 960px;
margin: 0 auto;

/* Section 标题 */
font-size: 24px;
font-weight: 700;
color: #725d42;
margin: 0 0 8px;

/* Section 描述 */
font-size: 14px;
color: #7c5734;
margin-bottom: 32px;

/* Feature 网格 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 16px;

/* Feature Card hover */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(114, 93, 66, 0.15);

/* Feature 图标 hover */
transform: scale(1.1) rotate(-4deg);

/* 代码块 */
max-width: 600px;
margin: 0 auto;
padding: 20px 28px;
background: #2b2118;
border: 1px solid #3d3028;
border-radius: 20px;
font-size: 13px;
font-weight: 600;
color: #e8d5bc;
line-height: 1.8;
```

**代码高亮配色：**

| Token 类型              | 颜色                            |
| ----------------------- | ------------------------------- |
| 注释                    | `#6b5e50`（italic, weight 400） |
| 字符串                  | `#a8d4a0`                       |
| JSX 标签                | `#f0a870`                       |
| 关键字 / npm/pnpm       | `#f0a870`                       |
| 命令动词（install/add） | `#a8d4a0`                       |
| 括号 `{}`               | `#d4b896`                       |
| 箭头 `=>`               | `#d4a0e0`                       |
| CSS 变量名              | `#e8c87a`                       |
| `:root`                 | `#f0a870`                       |
| 十六进制色值            | `#8ab8e0`                       |
