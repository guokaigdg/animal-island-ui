# Form — pixel spec

Pixel-level styling for the Form container together with its companion exports `Form.Item` (FormItem) and `Form.useForm`.

## Form (container, FormItem + useForm)

**Form container**: a mainstream-form-library-style API providing a `Form.useForm()` instance, `<Form.Item>` field registration, validation, submit, reset and other imperative capabilities. `FormItem` hijacks the child control's `value` / `onChange` through `React.cloneElement` (controlled injection), so child controls do not need to implement controlled logic themselves.

```css
/* container .island-form — keeps the neutral gray scale, not the parchment warm-brown scale */
.island-form {
    color: rgba(0, 0, 0, 0.85); /* label / body text — deliberately not #725d42 */
    font-size: 14px;
    line-height: 1.6;
    box-sizing: border-box;
}

/* horizontal: stacked vertically; each item is a 24-column CSS Grid (no column-gap between adjacent label/wrapper) */
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
    /* NOTE: no column-gap between label and wrapper, otherwise 23 × 16px = 368px blows out the form */
}

/* vertical: item is a block, label occupies its own line */
.island-form-vertical .island-form-item {
    display: block;
}
.island-form-vertical .island-form-item-label {
    display: block;
    margin-bottom: 6px; /* @vertical-gap */
}

/* inline: items laid out horizontally */
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

/* size only scales the label font-size */
.island-form-small .island-form-item-label { font-size: 12px; }
.island-form-middle .island-form-item-label { font-size: 14px; } /* default */
.island-form-large .island-form-item-label { font-size: 16px; }

/* control wrapper + error message slot */
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
/* status colors (neutral gray + mainstream status colors, not parchment tokens) */
.island-form-item-has-error  .island-form-item-explain { color: #ff4d4f; }
.island-form-item-has-warning.island-form-item-explain { color: #faad14; }
.island-form-item-has-success.island-form-item-explain { color: #52c41a; }
.island-form-item-is-validating .island-form-item-explain { color: #1677ff; }

/* global disabled */
.island-form-disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
```

> Form's internal neutral grays `rgba(0,0,0,0.85)` / `#ff4d4f` / `#faad14` / `#52c41a` / `#1677ff` **deliberately bypass** the parchment warm-brown design tokens, in order to match the visual conventions of mainstream form libraries (users already have fixed expectations for these status colors in form contexts). Do not "unify" them into `#725d42` / `#e05a5a` and the like.
>
> `FormItem` must be used inside `<Form>` or `<Form.Provider>`, otherwise it throws `Form.Item must be used inside <Form>`. The three props disabled / size / `status="error"` are passed down to the child control through cloneElement.
