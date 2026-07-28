# CSS Variables

不依赖组件库自实现样式时，在 `:root` 中声明以下变量：

```css
:root {
    /* 字体 */
    --animal-font: Nunito, 'Noto Sans SC', -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;

    /* 主色 */
    --animal-primary: #19c8b9;
    --animal-primary-hover: #3dd4c6;
    --animal-primary-active: #11a89b;
    --animal-primary-bg: #e6f9f6;

    /* 文字 */
    --animal-text: #794f27;
    --animal-text-body: #725d42;
    --animal-text-secondary: #9f927d;
    --animal-text-muted: #8a7b66;
    --animal-text-disabled: #c4b89e;

    /* 背景 */
    --animal-bg: #f8f8f0;
    --animal-bg-content: rgb(247, 243, 223);
    --animal-bg-disabled: #f0ece2;

    /* 边框 */
    --animal-border: #c4b89e;
    --animal-border-hover: #a89878;

    /* 圆角 */
    --animal-radius-sm: 12px;
    --animal-radius: 18px;
    --animal-radius-lg: 24px;
    --animal-radius-pill: 50px;

    /* 3D 阴影 */
    --animal-shadow-btn: #bdaea0;
    --animal-shadow-input: #d4c9b4;
    --animal-shadow-switch: #5a9e1e;

    /* 游戏特殊色 */
    --animal-focus-yellow: #ffcc00;
    --animal-focus-yellow-d: #e0b800;
    --animal-sidebar-active: #b7c6e5;
    --animal-sidebar-hover: #d6dff0;

    /* 状态 */
    --animal-success: #6fba2c;
    --animal-warning: #f5c31c;
    --animal-error: #e05a5a;

    /* 动效 */
    --animal-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --animal-duration-fast: 0.15s;
    --animal-duration: 0.25s;
    --animal-duration-slow: 0.35s;
}
```

组件库本身也提供一套运行时 CSS 自定义属性：打包后的样式表在 `:root` 上声明 `--animal-*` 属性，由 Less 编译期 token 映射而来，组件样式通过 `var(--animal-*)` 引用。安装组件库的消费者可覆盖这些属性做主题定制。上面的模板用于脱离组件库自实现，因此变量名是精简版命名，而非完整的运行时属性集。
