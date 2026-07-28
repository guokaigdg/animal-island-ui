# CSS Variables

When re-implementing the style without depending on the component library, declare the following variables on `:root`:

```css
:root {
    /* Fonts */
    --animal-font: Nunito, 'Noto Sans SC', -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;

    /* Primary color */
    --animal-primary: #19c8b9;
    --animal-primary-hover: #3dd4c6;
    --animal-primary-active: #11a89b;
    --animal-primary-bg: #e6f9f6;

    /* Text */
    --animal-text: #794f27;
    --animal-text-body: #725d42;
    --animal-text-secondary: #9f927d;
    --animal-text-muted: #8a7b66;
    --animal-text-disabled: #c4b89e;

    /* Backgrounds */
    --animal-bg: #f8f8f0;
    --animal-bg-content: rgb(247, 243, 223);
    --animal-bg-disabled: #f0ece2;

    /* Borders */
    --animal-border: #c4b89e;
    --animal-border-hover: #a89878;

    /* Radius */
    --animal-radius-sm: 12px;
    --animal-radius: 18px;
    --animal-radius-lg: 24px;
    --animal-radius-pill: 50px;

    /* 3D shadows */
    --animal-shadow-btn: #bdaea0;
    --animal-shadow-input: #d4c9b4;
    --animal-shadow-switch: #5a9e1e;

    /* Game-specific colors */
    --animal-focus-yellow: #ffcc00;
    --animal-focus-yellow-d: #e0b800;
    --animal-sidebar-active: #b7c6e5;
    --animal-sidebar-hover: #d6dff0;

    /* Status */
    --animal-success: #6fba2c;
    --animal-warning: #f5c31c;
    --animal-error: #e05a5a;

    /* Motion */
    --animal-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --animal-duration-fast: 0.15s;
    --animal-duration: 0.25s;
    --animal-duration-slow: 0.35s;
}
```

The library itself also ships a set of runtime CSS custom properties: the packaged stylesheet declares `--animal-*` properties on `:root`, mapped from the Less compile-time tokens, and component styles reference them through `var(--animal-*)`. Consumers who install the library can override those properties for theming. The template above is for standalone re-implementation, so its variable names are the short-hand set rather than the full runtime property set.
