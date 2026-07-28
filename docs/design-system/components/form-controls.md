# Form controls — pixel spec

Pixel-level styling for the interactive input controls: Input, Switch, Checkbox, Radio and Select.

## Input

> ⚠️ **The `shadow` prop defaults to `false`**: there is no shadow by default, and the `box-shadow` values in the table below only apply when `<Input shadow />` is explicitly enabled. The status (error/warning) shadows and the yellow focus glow are not controlled by this prop.

| Property                          | small               | middle              | large               |
| --------------------------------- | ------------------- | ------------------- | ------------------- |
| height                            | 32px                | 40px                | 48px                |
| padding                           | `0 14px`            | `0 18px`            | `0 22px`            |
| font-size                         | 12px                | 14px                | 16px                |
| border-radius                     | 40px                | 50px                | 50px                |
| border-width                      | 2.5px               | 2.5px               | **3px**             |
| box-shadow (only `shadow={true}`) | `0 2px 0 0 #d4c9b4` | `0 3px 0 0 #d4c9b4` | `0 4px 0 0 #d4c9b4` |

**Exact color values:**

```css
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
/* no box-shadow by default; with shadow={true} the middle size takes 0 3px 0 0 #d4c9b4 from the table above */

/* text */
color: #725d42;
font-weight: 500;
letter-spacing: 0.01em;

/* placeholder */
color: #c4b89e;
font-weight: 400;

/* prefix/suffix */
color: #a0936e;

/* prefix margin-right */
margin-right: 6px;

/* suffix margin-left */
margin-left: 6px;

/* hover */
border-color: #a89878;
box-shadow: 0 3px 0 0 #c4b89e;

/* focus */
border-color: #ffcc00;
box-shadow:
    0 3px 0 0 #e0b800,
    0 0 0 3px rgba(255, 204, 0, 0.15);

/* disabled */
background: #ece8dc;
border-color: #d4c9b4;
box-shadow: none;
opacity: 0.6;
color: #c4b89e;

/* error */
box-shadow: 0 3px 0 0 #c94444;

/* warning */
box-shadow: 0 3px 0 0 #dba90e;
```

**clear button:**

```css
width: 20px;
height: 20px;
margin-left: 4px;
color: #c4b89e;
font-size: 13px;
font-weight: 700;
border-radius: 50%;
transition: all 0.15s;
/* hover */
color: #725d42;
background: rgba(114, 93, 66, 0.1);
```

## Switch

**Default size:**

```css
min-width: 52px;
height: 28px;
border: 2.5px solid #c4b89e;
border-radius: 50px;
background: #d4c9b4;
box-shadow: inset 0 2px 4px rgba(114, 93, 66, 0.15);

/* handle */
width: 21px;
height: 21px;
top: 50%;
left: 2px;
transform: translateY(-50%); /* vertically centered */
background: rgb(247, 243, 223);
border: 2.5px solid #bdaea0;
border-radius: 50%;
/* the handle has no outer box-shadow; layering relies on the border plus the track inset shadow */

/* checked state */
background: #86d67a;
border-color: #6fba2c;
box-shadow: inset 0 2px 4px rgba(90, 158, 30, 0.2);
/* handle left once checked */
left: calc(100% - 24px);
border-color: #5a9e1e;

/* focus-visible */
outline: 2px solid #ffcc00;
outline-offset: 2px;

/* disabled */
opacity: 0.5;
```

**small size:**

```css
min-width: 38px;
height: 20px;
border-width: 2px;
/* handle */
width: 14px;
height: 14px;
top: 1px;
left: 1px;
box-shadow: 0 2px 0 0 #bdaea0;
/* checked handle left */
left: calc(100% - 16px);
box-shadow: 0 2px 0 0 #5a9e1e;
```

**inner text (checkedChildren/unCheckedChildren):**

```css
font-size: 11px;
font-weight: 700;
color: #fff;
line-height: 1;
letter-spacing: 0.02em;
text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
padding: 0 8px 0 28px; /* unchecked */
padding: 0 28px 0 8px; /* checked */
/* small variant */
padding: 0 6px 0 20px;
font-size: 9px;
```

**loading spinner:**

```css
width: 11px;
height: 11px;
border: 2px solid #6fba2c;
border-right-color: transparent;
border-radius: 50%;
animation: animal-spin 0.6s linear infinite;
/* unchecked state */
border-color: #a89878;
@keyframes animal-spin {
    to {
        transform: rotate(360deg);
    }
}
```

## Checkbox

Props:

| name           | type                             | default        | Description                                       |
| -------------- | -------------------------------- | -------------- | ------------------------------------------------- |
| `options`      | `CheckboxOption[]`               | —              | **Required**; each entry is `{ label, value, disabled? }` |
| `value`        | `Array<string \| number>`        | —              | Controlled selected values                        |
| `defaultValue` | `Array<string \| number>`        | `[]`           | Uncontrolled default value                        |
| `size`         | `'small' \| 'middle' \| 'large'` | `'middle'`     | Size                                              |
| `disabled`     | `boolean`                        | `false`        | Disables every option                             |
| `direction`    | `'horizontal' \| 'vertical'`     | `'horizontal'` | Layout direction                                  |
| `onChange`     | `(values) => void`               | —              | Fired when the selected values change             |

**Size table (the box):**

| Property         | small   | middle      | large   |
| ---------------- | ------- | ----------- | ------- |
| width × height   | 18×18px | **22×22px** | 28×28px |
| border-width     | 2px     | 2.5px       | 3px     |
| label font-size  | 12px    | 14px        | 16px    |
| check font-size  | 11px    | 13px        | 16px    |

**Exact styles:**

```css
/* group */
display: flex; flex-wrap: wrap;
gap: 12px;                                 /* horizontal */
/* vertical */ flex-direction: column; gap: 8px;

/* item */
display: inline-flex; align-items: center;
gap: 8px;
cursor: pointer;
transition: all 0.25s cubic-bezier(0.4,0,0.2,1);

/* box (unchecked) */
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
border-radius: 8px;
display: inline-flex; align-items: center; justify-content: center;

/* box hover */
border-color: #19c8b9;
transform: translateY(-1px);

/* box focus-visible */
outline: 2px solid #ffcc00; outline-offset: 2px;

/* checked */
background: #19c8b9;
border-color: #11a89b;
/* checked hover */ background: #3dd4c6; border-color: #19c8b9;

/* check mark ✓ */
color: #fff; font-weight: 700; line-height: 1;
animation: animal-checkbox-pop 0.15s cubic-bezier(0.4,0,0.2,1);

@keyframes animal-checkbox-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1);   opacity: 1; }
}

/* label */
color: #725d42; font-weight: 500;
letter-spacing: 0.01em;
/* item hover */ label color: #794f27;

/* disabled (single option or whole group) */
cursor: not-allowed;
opacity: 0.55;
/* box */ background: #f0ece2; border-color: #d4c9b4; transform: none !important;
/* label */ color: #c4b89e;
```

## Radio

| Property         | small   | middle  | large                                 |
| ---------------- | ------- | ------- | ------------------------------------- |
| outer box size   | 18×18px | 22×22px | 28×28px                               |
| border-radius    | 12px    | 14px    | 16px (**heavily rounded square, not a true circle**) |
| border-width     | 2px     | 2px     | 2px                                   |
| inner check size | 10×10px | 12×12px | 16px font-size                        |
| label font-size  | 12px    | 14px    | 16px                                  |

```css
/* default (unchecked) */
background: rgb(247, 243, 223);
border: 2px solid #c4b89e;

/* hover */
border-color: #19c8b9;
transform: translateY(-1px);

/* checked */
background: #19c8b9; /* @primary-color */
border-color: #11a89b; /* @primary-color-active */
/* white inner check pop animation */
@keyframes radio-pop {
    0% {
        transform: scale(0.4);
        opacity: 0;
    }
    60% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
/* duration 0.15s ease (@motion-duration-fast) */

/* label */
color: #725d42;
font-weight: 500;
letter-spacing: 0.01em;
/* checked label */
color: #794f27;

/* focus-visible */
outline: 2px solid #f5c31c; /* NOTE: Radio uses @focus-yellow=#f5c31c, not the #ffcc00 used by Checkbox/Input */
outline-offset: 2px;

/* disabled */
opacity: 0.55;
cursor: not-allowed;
background: #f0ece2;
border-color: #d4c9b4;
/* label */
color: #c4b89e;

/* group layout */
/* horizontal */
display: flex;
gap: 12px;
/* vertical */
display: flex;
flex-direction: column;
gap: 8px;
```

## Select

Controlled dropdown selector; the panel opens on hover/click, and options support ↑/↓ keyboard navigation, Enter to confirm and Esc to cancel.

```css
.select {
    position: relative;
    display: inline-block;
    min-width: 120px;
}
.selectTrigger {
    /* same as Input: border 1.5px solid @border-color-light, radius 12px */
    /* background rgb(247,243,223), hover/focus switches to @border-color-hover */
}
.selectDropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 240px;
    overflow-y: auto;
    background: #fffcef;
    border: 1.5px solid @border-color-light;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12);
    z-index: 1000;
}
.selectOption {
    padding: 8px 12px;
    cursor: pointer;
    color: @text-color-body;
}
.selectOption.isActive { background: @primary-color-bg; color: @primary-color; }
.selectOption.isSelected { font-weight: 600; }
```

> Full interaction behavior: roving keyboard focus, scroll-into-view for the selected option, and click-outside to close.
