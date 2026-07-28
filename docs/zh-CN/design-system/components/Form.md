# Form —— 精确样式规范

Form 容器及其伴生导出 `Form.Item`（FormItem）、`Form.useForm` 的像素级样式规范。

## Form（容器、FormItem + useForm）

**表单容器**：类主流表单库 API，提供 `Form.useForm()` 实例、`<Form.Item>` 字段注册、校验、提交、reset 等命令式能力。`FormItem` 通过 `React.cloneElement` 劫持子控件的 `value` / `onChange`（受控注入），子控件无需自己实现受控逻辑。

```css
/* 容器 .island-form —— 沿用中性灰色系，不走 parchment 暖棕系 */
.island-form {
    color: rgba(0, 0, 0, 0.85); /* label / 正文 —— 故意不是 #725d42 */
    font-size: 14px;
    line-height: 1.6;
    box-sizing: border-box;
}

/* horizontal：垂直堆叠，每个 item 是 24 列 CSS Grid（label/wrapper 相邻无 column-gap）*/
.island-form-horizontal {
    display: flex;
    flex-direction: column;
    gap: 8px; /* @form-item-gap */
}
.island-form-horizontal .island-form-item {
    display: grid;
    grid-template-columns: repeat(24, minmax(0, 1fr));
    align-items: baseline;
    row-gap: 8px;
    /* 注意：label 与 wrapper 之间不加 column-gap，否则 23 × 16px = 368px 撑爆 form */
}

/* vertical：item 是 block，label 独占一行 */
.island-form-vertical .island-form-item {
    display: block;
}
.island-form-vertical .island-form-item-label {
    display: block;
    margin-bottom: 6px; /* @vertical-gap */
}

/* inline：item 横向排开 */
.island-form-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* @inline-gap */
}
.island-form-inline .island-form-item {
    flex: 0 0 auto;
}

/* label */
.island-form-item-label {
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    white-space: nowrap;
    line-height: 1.6;
}
.island-form-item-label-required::before {
    content: '*';
    color: #ff4d4f;
    margin-right: 4px;
}
.island-form-item-label-colon::after {
    content: ':';
    margin: 0 4px 0 2px;
}

/* 尺寸只缩放 label 字号 */
.island-form-small .island-form-item-label { font-size: 12px; }
.island-form-middle .island-form-item-label { font-size: 14px; } /* default */
.island-form-large .island-form-item-label { font-size: 16px; }

/* 控件容器 + 错误文案槽 */
.island-form-item-control-input {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 32px;
}
.island-form-item-explain {
    min-height: 22px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    line-height: 1.5;
    margin-top: 4px;
}
/* 状态色（采用中性灰 + 主流状态色，不走 parchment token）*/
.island-form-item-has-error .island-form-item-explain { color: #ff4d4f; }
.island-form-item-has-warning .island-form-item-explain { color: #faad14; }
.island-form-item-has-success .island-form-item-explain { color: #52c41a; }
.island-form-item-is-validating .island-form-item-explain { color: #1677ff; }

/* 全局 disabled */
.island-form-disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
```

> Form 内部中性灰 `rgba(0,0,0,0.85)` / `#ff4d4f` / `#faad14` / `#52c41a` / `#1677ff` **故意不走** parchment 暖棕设计 token，是为了贴合主流表单库的视觉习惯（用户在表单场景对这些状态色有既定认知）。请勿"为了统一"把它们改成 `#725d42` / `#e05a5a` 等。
>
> `FormItem` 必须在 `<Form>` 或 `<Form.Provider>` 内使用，否则抛 `Form.Item must be used inside <Form>`。disabled / size / `status="error"` 三个 prop 会通过 cloneElement 透传给子控件。
