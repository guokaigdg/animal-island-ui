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
| box-shadow（仅 `shadow={true}`） | `0 2px 0 0 #d4c9b4` | `0 3px 0 0 #d4c9b4` | `0 4px 0 0 #d4c9b4` |

**精确颜色值：**

```css
background: #fffbe7;
/* 无边框；总高度即 token 高度（32/40/48px），原边框占用的空间并入内容区 */
/* 默认无 box-shadow；shadow={true} 时按上表中号取 0 3px 0 0 #d4c9b4 */

/* 文字 */
color: #8a7b66;
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
box-shadow: 0 3px 0 0 #c4b89e;

/* focus */
box-shadow:
    0 3px 0 0 #e0b800,
    0 0 0 3px rgba(255, 204, 0, 0.15);

/* disabled */
background: #ece8dc;
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
    /* border 2px solid #e8dcc8，radius 12px */
    /* 背景 #fff，hover 时 border-color 切为 #d4c4a8、背景切为 #fffdf7 */
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

## DatePicker

日历弹层日期选择器；值为纯 `YYYY-MM-DD` 字符串（不依赖日期库，零运行时依赖）。触发区沿用 Input 视觉规格，
弹层为奶油色卡片，支持 月 / 年 / 日 三级视图切换。

**触发区（对齐 Input）：**

| 属性        | small | middle | large |
| ----------- | ----- | ------ | ----- |
| 高度        | 32px  | 40px   | 48px  |
| 内边距      | `0 14px` | `0 18px` | `0 22px` |
| 字号        | 12px  | 14px   | 16px  |
| 圆角        | 40px  | 50px   | 50px  |

```css
background: #fffbe7;      /* 无边框，同 Input */
/* hover */ box-shadow: 0 3px 0 0 #c4b89e;
/* 展开/聚焦 */ box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
/* error */ box-shadow: 0 3px 0 0 #c94444;
/* warning */ box-shadow: 0 3px 0 0 #dba90e;
/* disabled */ background: #ece8dc; box-shadow: none; opacity: 0.6;
```

**弹出面板：**

```css
width: 280px;
padding: 14px 14px 16px;
background: #fffdf7;
border: 1.5px solid #e8dcc8;
border-radius: 20px;
box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12);
/* 入场：淡入 + 6px 上滑，0.2s cubic-bezier(0.4, 0, 0.2, 1) */
/* 退场：同款 0.2s 过渡反向播放，动画结束后才卸载面板 */
```

**头部导航按钮**（`上一年` / `上个月` / `下个月` / `下一年`）：26×26px、无边框、`#a0936e`，hover 为 `rgba(114, 93, 66, 0.1)`
背景 + `#19c8b9` 前景，圆角 8px。**年-月标签按钮**：14px / 700 / `#725d42`，hover 青色浅底。

**日期格**（42 格 = 6 周，含上/下月补位日期）：

```css
width: 32px; height: 32px; border-radius: 50%;   /* 圆形 */
color: #725d42; font-size: 13px; font-weight: 500;
/* hover */ background: #e6f9f6; color: #19c8b9;
/* 范围模式 hover */ background: #ffd54f; color: #725d42; /* 与选中同色系（琥珀） */
/* 今天（仅单日期模式；范围模式不圈出今天） */ box-shadow: inset 0 0 0 1.5px #19c8b9; color: #19c8b9; font-weight: 700;
/* 选中 */ background: #19c8b9; color: #fff; font-weight: 700;
/* 相邻月 */ color: #c4b89e; font-weight: 400;
/* 禁用（disabledDate） */ color: #d4c9b4; cursor: not-allowed;
```

**月份 / 年份格**（3×4 网格）：高 36px、圆角 12px，配色同日期格。

**底部** —— `今天`（仅单日期模式，可用 `showToday` 关闭；跳转到今天并将其设为待选日期）13px / 700 / `#8a7b66`，
hover 背景 `rgba(114, 93, 66, 0.1)` + `#725d42` 文字，上边框 `1px solid #f0e8d8`；`确定`（`#8a7b66` 底、`#fff` 字、
12px / 700，hover `#796c5a`）经 `onChange` 提交待选值并以 0.2s 退场动效关闭。

**交互：** 点选日期仅更新待选值（触发区实时显示）；`确定` 提交并关闭，Esc / 点击外部丢弃待选。键盘 Enter/空格/
下箭头展开，方向键移动焦点日期，Enter 设为待选，PageUp/PageDown 切换月份；下方空间不足时面板向上翻转。

**月份选择（`picker="month"`）** —— 面板直接打开 12 个月网格（无日期格）；点击月份设为待选值，`确定` 提交
`YYYY-MM`（`format` 默认 `YYYY-MM`）；年份标签仍可切换年份视图并返回。

**范围模式（`range`）** —— 左右联动双面板（左侧为开始月份，右侧为下一月）；第一次点击确定待选开始日期，第二次点击
确定待选结束日期（两者均在 `确定` 时提交）；第二次点击早于开始日期时重置为新的开始日期；触发区分为两栏显示
（`开始 | 结束`），中间以 1px 竖向
分隔线（`#e8dcc8`，高 16px）隔开，类似入住 / 退房控件。面板宽度变为 600px（两个 280px 面板 + 12px 间距）；
有效范围内的每个日期（开始、结束及中间所有日期）均以橙色圆呈现：

```css
/* 区间内（已选范围，或选择结束日期时的悬停预览） */
background: #ffc107; color: #fff; border-radius: 50%;
/* 区间内 hover */ background: #e5a200;
/* 起止端点 */ background: #ffb400; color: #fff; font-weight: 700; border-radius: 50%; border: 1px solid #fff;
```

**范围选中** —— 选中日期均以浅琥珀色圆呈现（`#ffc107` 底 + `#fff` 白色文字，`border-radius: 50%`）；
hover 背景加深为 `#e5a200`。起止端点使用 `#ffb400`，配 `#fff` 白色文字并带 1px 白色描边。日期格固定 32×32 并在
网格轨道中居中（`justify-self: center`），保证填充为正圆而非椭圆。无连续色带背景，每个选中日期独立成圆。

**选择结束日期时的悬停预览** —— 确定开始日期后，悬停会实时预览待选区间，且旧范围高亮让位：悬停晚于开始日期的日期时
高亮 `[开始, 悬停]`，悬停日期作为潜在终点；悬停早于开始日期的日期时反向高亮 `[悬停, 开始]`，把悬停日期作为新的
潜在起点（点击即重置开始日期）。与主流范围选择器的交互模型一致。

## TimePicker

时间弹出选择器；值为纯 `HH:mm:ss` 字符串（不依赖日期库，零运行时依赖）。触发区沿用 Input 视觉规格（奶油胶囊、
无边框）；面板为 时 / 分 / 秒 三列滚选 + 底部按钮。

**触发区（对齐 Input）：**

| 属性        | small | middle | large |
| ----------- | ----- | ------ | ----- |
| 高度        | 32px  | 40px   | 48px  |
| 内边距      | `0 14px` | `0 18px` | `0 22px` |
| 字号        | 12px  | 14px   | 16px  |
| 圆角        | 40px  | 50px   | 50px  |

```css
background: #fffbe7;      /* 无边框，同 Input */
/* hover */ box-shadow: 0 3px 0 0 #c4b89e;
/* 展开/聚焦 */ box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
/* error */ box-shadow: 0 3px 0 0 #c94444;
/* warning */ box-shadow: 0 3px 0 0 #dba90e;
/* disabled */ background: #ece8dc; box-shadow: none; opacity: 0.6;
```

**面板**（宽 248px，`format` 不含 `ss` 时收窄至 172px）：时 / 分 / 秒 三列（`format` 不含 `ss` 时隐藏秒列）；
每列为可滚动列表，选项为胶囊（高 28px、圆角 16px）：

```css
/* 选项 */ color: #725d42; border-radius: 16px;
/* 选项 hover */ background: #ffd54f; color: #725d42;
/* 选中选项 */ background: #ffb400; color: #fff; font-weight: 700;
```

**底部** —— `此刻`（待选值设为当前时间）+ `确定`（经 `onChange` 提交并以 0.2s 退场动效关闭）。点选某列数值时
触发区实时更新；Esc / 点击外部丢弃待选值。

**交互：** 键盘 Enter/空格/下箭头展开，Enter 确认，Esc 关闭；`hourStep` / `minuteStep` / `secondStep` 过滤列选项。
