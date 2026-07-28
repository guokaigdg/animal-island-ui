# 表单控件 —— 精确样式规范

可交互录入类控件 Input、Switch、Checkbox、Radio、Select 的像素级样式规范。

## Input

> ⚠️ **`shadow` prop 默认 `false`**：默认无阴影，下表的 `box-shadow` 仅在 `<Input shadow />` 显式开启时生效。status (error/warning) 阴影与 focus 黄色光晕不受此 prop 控制。

| 属性                             | small               | middle              | large               |
| -------------------------------- | ------------------- | ------------------- | ------------------- |
| height                           | 32px                | 40px                | 48px                |
| padding                          | `0 14px`            | `0 18px`            | `0 22px`            |
| font-size                        | 12px                | 14px                | 16px                |
| border-radius                    | 40px                | 50px                | 50px                |
| border-width                     | 2.5px               | 2.5px               | **3px**             |
| box-shadow（仅 `shadow={true}`） | `0 2px 0 0 #d4c9b4` | `0 3px 0 0 #d4c9b4` | `0 4px 0 0 #d4c9b4` |

**精确颜色值：**

```css
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
/* 默认无 box-shadow；shadow={true} 时按上表中号取 0 3px 0 0 #d4c9b4 */

/* 文字 */
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

**clear 按钮：**

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

**默认尺寸：**

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
transform: translateY(-50%); /* 垂直居中 */
background: rgb(247, 243, 223);
border: 2.5px solid #c4b89e;
border-radius: 50%;
/* handle 无 outer box-shadow，仅靠 border 与 track inset 阴影分层 */

/* 开启态 */
background: #86d67a;
border-color: #6fba2c;
box-shadow: inset 0 2px 4px rgba(90, 158, 30, 0.2);
/* handle 开启后 */
left: calc(100% - 24px);
border-color: #6fba2c;

/* focus-visible */
outline: 2px solid #ffcc00;
outline-offset: 2px;

/* disabled */
opacity: 0.5;
```

**small 尺寸：**

```css
min-width: 38px;
height: 20px;
border-width: 2.5px;
/* handle —— 与默认尺寸同样的扁平处理：无 outer box-shadow */
width: 14px;
height: 14px;
top: 50%;
transform: translateY(-50%);
left: 1px;
/* 开启 handle left */
left: calc(100% - 16px);
```

**inner 文字（checkedChildren/unCheckedChildren）：**

```css
font-size: 11px;
font-weight: 700;
color: #fff;
line-height: 1;
letter-spacing: 0.02em;
text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
padding: 0 8px 0 28px; /* 未开启 */
padding: 0 28px 0 8px; /* 开启 */
/* small 版 */
padding: 0 6px 0 20px;
font-size: 9px;
```

**loading spinner：**

```css
width: 11px;
height: 11px;
border: 2px solid #6fba2c;
border-right-color: transparent;
border-radius: 50%;
animation: animal-spin 0.6s linear infinite;
/* 关闭态 */
border-color: #a89878;
@keyframes animal-spin {
    to {
        transform: rotate(360deg);
    }
}
```

## Checkbox

Props：

| name           | type                             | default        | 说明                                         |
| -------------- | -------------------------------- | -------------- | -------------------------------------------- |
| `options`      | `CheckboxOption[]`               | —              | **必填**；每项 `{ label, value, disabled? }` |
| `value`        | `Array<string \| number>`        | —              | 受控选中值                                   |
| `defaultValue` | `Array<string \| number>`        | `[]`           | 非受控默认值                                 |
| `size`         | `'small' \| 'middle' \| 'large'` | `'middle'`     | 尺寸                                         |
| `disabled`     | `boolean`                        | `false`        | 禁用全部项                                   |
| `direction`    | `'horizontal' \| 'vertical'`     | `'horizontal'` | 排列方向                                     |
| `onChange`     | `(values) => void`               | —              | 选中值变化                                   |

**尺寸表（box 是圆形；对勾是内联 SVG，不是文字字符）：**

| 属性               | small   | middle      | large   |
| ------------------ | ------- | ----------- | ------- |
| box 宽高           | 18×18px | **22×22px** | 28×28px |
| 对勾 SVG 宽高      | 10×9px  | 12×11px     | 15×14px |
| 标签 font-size     | 12px    | 14px        | 16px    |

**精确样式：**

```css
/* group */
display: flex; flex-wrap: wrap;
gap: 16px;
/* vertical */ flex-direction: column;

/* item */
display: inline-flex; align-items: center;
gap: 8px;
cursor: pointer; user-select: none; position: relative;

/* box —— 原生 input 本体，restyle 成圆形 */
appearance: none;
width: var(--cbx-size);   /* 按尺寸 18 / 22 / 28px */
height: var(--cbx-size);
border: 2px solid #c4b89e;
border-radius: 50%;
background: rgb(247, 243, 223);
transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);

/* box focus-visible */
outline: 2px solid #f5c31c; /* @focus-yellow (= @warning-color) */
outline-offset: 2px;

/* 选中 box */
background: #19c8b9;   /* @primary-color，经 .checked .cbx input 应用 */
border-color: #50b9ab; /* @primary-color-active，作用于 input:checked */

/* 对勾 —— 内联 SVG，单个 <path> 以 dash 过渡画出 */
.check {
    position: absolute; top: 50%; left: 50%;
    width: var(--cbx-check-w);  /* 按尺寸 10 / 12 / 15px */
    height: var(--cbx-check-h); /* 按尺寸  9 / 11 / 14px */
    transform: translate(-50%, -54%);
}
.check path {
    stroke: #fff; stroke-width: 3;
    stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 19; stroke-dashoffset: 19;
    transition: stroke-dashoffset 0.3s ease;
    transition-delay: 0.2s;
}
input:checked ~ .check path { stroke-dashoffset: 0; }

/* 选中 splash 迸溅 —— 六个圆点向外飞散后淡出 */
input:checked ~ .splash { animation: animal-cbx-splash 0.6s ease forwards; }
@keyframes animal-cbx-splash {
    40% {
        background: #19c8b9; /* @splash-color = @primary-color */
        box-shadow:
            0 -18px 0 -8px #19c8b9, 16px -8px 0 -8px #19c8b9, 16px 8px 0 -8px #19c8b9,
            0 18px 0 -8px #19c8b9, -16px 8px 0 -8px #19c8b9, -16px -8px 0 -8px #19c8b9;
    }
    100% {
        background: #19c8b9;
        box-shadow:
            0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent, 32px 16px 0 -10px transparent,
            0 36px 0 -10px transparent, -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
}

/* label */
color: #725d42; font-weight: 500;
letter-spacing: 0.01em;
/* 选中 label */ color: #794f27;

/* 禁用（单项或整组）*/
cursor: not-allowed;
opacity: 0.55;
/* box */ background: #f0ece2; border-color: #d4c9b4;
/* 对勾 */ stroke: #c4b89e;
/* splash */ animation: none;
```

## Radio

| 属性            | small   | middle  | large                        |
| --------------- | ------- | ------- | ---------------------------- |
| 外盒尺寸        | 18×18px | 22×22px | 28×28px                      |
| 圆角            | 12px    | 14px    | 16px（**重圆方形，非正圆**） |
| 边框宽          | 2px     | 2px     | 2px                          |
| 内勾尺寸        | 10×10px | 12×12px | 16px font-size               |
| label font-size | 12px    | 14px    | 16px                         |

```css
/* 默认（未选） */
background: rgb(247, 243, 223);
border: 2px solid #c4b89e;

/* hover */
border-color: #19c8b9;
transform: translateY(-1px);

/* checked */
background: #19c8b9; /* @primary-color */
border-color: #11a89b; /* @primary-color-active */
/* 内白色勾 pop 动画 */
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
/* 时长 0.15s ease（@motion-duration-fast） */

/* label */
color: #725d42;
font-weight: 500;
letter-spacing: 0.01em;
/* checked label */
color: #794f27;

/* focus-visible */
outline: 2px solid #f5c31c; /* 注意：Radio 用 @focus-yellow=#f5c31c，而非 Checkbox/Input 的 #ffcc00 */
outline-offset: 2px;

/* disabled */
opacity: 0.55;
cursor: not-allowed;
background: #f0ece2;
border-color: #d4c9b4;
/* label */
color: #c4b89e;

/* group 布局 */
/* horizontal */
display: flex;
gap: 12px;
/* vertical */
display: flex;
flex-direction: column;
gap: 8px;
```

## Select

受控下拉选择器，hover/click 展开下拉面板，选项支持键盘 ↑/↓ 导航 + Enter 确认 + Esc 取消。

```css
.select {
    position: relative;
    display: inline-block;
    min-width: 120px;
}
.selectTrigger {
    /* 与 Input 同款：border 1.5px solid @border-color-light，radius 12px */
    /* 背景 rgb(247,243,223)，hover/focus 切换到 @border-color-hover */
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

> 完整交互行为：键盘 roving、滚动到选中项、点击外部关闭。
