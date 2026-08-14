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
| box-shadow (only `shadow={true}`) | `0 2px 0 0 #d4c9b4` | `0 3px 0 0 #d4c9b4` | `0 4px 0 0 #d4c9b4` |

**Exact color values:**

```css
background: #fffbe7;
/* no border; the total height is the token height (32/40/48px), with the space the border used to occupy now belonging to the content */
/* no box-shadow by default; with shadow={true} the middle size takes 0 3px 0 0 #d4c9b4 from the table above */

/* text */
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
border: 2.5px solid #c4b89e;
border-radius: 50%;
/* the handle has no outer box-shadow; layering relies on the border plus the track inset shadow */

/* checked state */
background: #86d67a;
border-color: #6fba2c;
box-shadow: inset 0 2px 4px rgba(90, 158, 30, 0.2);
/* handle once checked */
left: calc(100% - 24px);
border-color: #6fba2c;

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
border-width: 2.5px;
/* handle — same flat treatment as the default size: no outer box-shadow */
width: 14px;
height: 14px;
top: 50%;
transform: translateY(-50%);
left: 1px;
/* checked handle left */
left: calc(100% - 16px);
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

**Size table (the box is a circle; the check is an inline SVG, not a glyph):**

| Property                    | small   | middle      | large   |
| --------------------------- | ------- | ----------- | ------- |
| box width × height          | 18×18px | **22×22px** | 28×28px |
| check SVG width × height    | 10×9px  | 12×11px     | 15×14px |
| label font-size             | 12px    | 14px        | 16px    |

**Exact styles:**

```css
/* group */
display: flex; flex-wrap: wrap;
gap: 16px;
/* vertical */ flex-direction: column;

/* item */
display: inline-flex; align-items: center;
gap: 8px;
cursor: pointer; user-select: none; position: relative;

/* box — the native input itself, restyled as a circle */
appearance: none;
width: var(--cbx-size);   /* 18 / 22 / 28px by size */
height: var(--cbx-size);
border: 2px solid #c4b89e;
border-radius: 50%;
background: rgb(247, 243, 223);
transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);

/* box focus-visible */
outline: 2px solid #f5c31c; /* @focus-yellow (= @warning-color) */
outline-offset: 2px;

/* checked box */
background: #19c8b9;   /* @primary-color, applied via .checked .cbx input */
border-color: #50b9ab; /* @primary-color-active, on input:checked */

/* check mark — an inline SVG whose single <path> is drawn on with a dash transition */
.check {
    position: absolute; top: 50%; left: 50%;
    width: var(--cbx-check-w);  /* 10 / 12 / 15px by size */
    height: var(--cbx-check-h); /*  9 / 11 / 14px by size */
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

/* splash burst on check — six dots flying outward then fading */
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
/* checked label */ color: #794f27;

/* disabled (single option or whole group) */
cursor: not-allowed;
opacity: 0.55;
/* box */ background: #f0ece2; border-color: #d4c9b4;
/* check */ stroke: #c4b89e;
/* splash */ animation: none;
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
    /* border 2px solid #e8dcc8, radius 12px */
    /* background #fff, hover switches border-color to #d4c4a8 and background to #fffdf7 */
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

## DatePicker

Calendar popup date selector; value is a plain `YYYY-MM-DD` string (no date library, zero runtime deps). The trigger
follows the Input visual spec; the popup panel is a cream card with month/year/date three-level switching.

**Trigger (matches Input):**

| Property    | small | middle | large |
| ----------- | ----- | ------ | ----- |
| height      | 32px  | 40px   | 48px  |
| padding     | `0 14px` | `0 18px` | `0 22px` |
| font-size   | 12px  | 14px   | 16px  |
| border-radius | 40px | 50px   | 50px  |

```css
background: #fffbe7;      /* no border, same as Input */
/* hover */ box-shadow: 0 3px 0 0 #c4b89e;
/* open/focus */ box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
/* error */ box-shadow: 0 3px 0 0 #c94444;
/* warning */ box-shadow: 0 3px 0 0 #dba90e;
/* disabled */ background: #ece8dc; box-shadow: none; opacity: 0.6;
```

**Popup panel:**

```css
width: 280px;
padding: 14px 14px 16px;
background: #fffdf7;
border: 1.5px solid #e8dcc8;
border-radius: 20px;
box-shadow: 0 6px 18px rgba(61, 52, 40, 0.12);
/* entrance: fade + 6px slide-up, 0.2s cubic-bezier(0.4, 0, 0.2, 1) */
/* exit: the same 0.2s transition plays reversed; the panel unmounts only after the animation finishes */
```

**Header nav buttons** (`上一年` / `上个月` / `下个月` / `下一年`): 26×26px, no border, `#a0936e`, hover `rgba(114, 93, 66, 0.1)`
background + `#19c8b9` color, radius 8px. **Year-month label button**: 14px / 700 / `#725d42`, hover teal tint.

**Day cells** (42 = 6 weeks, prev/next month days included):

```css
width: 32px; height: 32px; border-radius: 50%;   /* circle */
color: #725d42; font-size: 13px; font-weight: 500;
/* hover */ background: #e6f9f6; color: #19c8b9;
/* range-mode hover */ background: #ffd54f; color: #725d42; /* amber family, matching the selection */
/* today (single-date mode only; range mode does not circle today) */ box-shadow: inset 0 0 0 1.5px #19c8b9; color: #19c8b9; font-weight: 700;
/* selected */ background: #19c8b9; color: #fff; font-weight: 700;
/* outside month */ color: #c4b89e; font-weight: 400;
/* disabled (disabledDate) */ color: #d4c9b4; cursor: not-allowed;
```

**Month / year cells** (3×4 grid): height 36px, border-radius 12px, same color set as day cells.

**Footer** — `今天` (single-date mode only, optional via `showToday`; jumps to today and sets it as the pending date)
13px / 700 / `#8a7b66`, hover `rgba(114, 93, 66, 0.1)` with `#725d42` text, top border `1px solid #f0e8d8`; `确定`
(`#8a7b66` background, `#fff` text, 12px / 700, hover `#796c5a`) commits the pending selection via `onChange` and
closes with the 0.2s exit animation.

**Interaction:** picking a date only sets the pending value (shown live in the trigger); `确定` commits and closes,
Esc / click-outside discards. Keyboard Enter/Space/ArrowDown opens, arrows move the focus date, Enter sets the pending
date, PageUp/PageDown flips months; the panel flips upward when there is no space below the trigger.

**Month picker (`picker="month"`)** — the panel opens directly on the 12-month grid (no day cells); clicking a month
sets the pending value and `确定` commits `YYYY-MM` (the `format` defaults to `YYYY-MM`); the year label still switches
to year navigation and back.

**Range mode (`range`)** — two linked month panels (left = the start month, right = the following month); the first
click sets the pending start date, the second sets the pending end date (both commit on `确定`); a second click earlier
than the start resets the start; the trigger splits into two columns (`开始 | 结束`) separated by a 1px vertical divider
(`#e8dcc8`, 16px tall), mirroring a
check-in / check-out control. The panel width becomes 600px (two 280px panels + 12px gap). Every date inside the
effective range (start, end, and everything in between) renders as an orange circle:

```css
/* in-range cells (selected range, or hover preview while picking the end) */
background: #ffc107; color: #fff; border-radius: 50%;
/* in-range hover */ background: #e5a200;
/* start / end endpoints */ background: #ffb400; color: #fff; font-weight: 700; border-radius: 50%; border: 1px solid #fff;
```

**Range selection** — the selected dates are light-amber circles (`#ffc107` background with `#fff` white text and
`border-radius: 50%`); hovering deepens the background to `#e5a200`. The start and end cells are `#ffb400` with `#fff`
white text and additionally carry a 1px white border. Cells are fixed 32×32 and centered in their grid track
(`justify-self: center`), so the fill is a perfect circle. There is no continuous band background — each selected date
is its own circle.

**Hover preview while picking the end date** — once the start date is picked, hovering previews the pending range and
the old range highlight gives way: hovering a later date highlights `[start, hover]` with the hovered date as the
pending end; hovering an earlier date highlights `[hover, start]` in reverse, marking the hovered date as the new
pending start (clicking it resets the start). This follows the mainstream range-picker interaction model.

## TimePicker

Time popup selector; value is a plain `HH:mm:ss` string (no date library, zero runtime deps). The trigger follows the
Input visual spec (cream pill, no border); the panel holds three scrollable columns (时 / 分 / 秒) plus a footer.

**Trigger (matches Input):**

| Property    | small | middle | large |
| ----------- | ----- | ------ | ----- |
| height      | 32px  | 40px   | 48px  |
| padding     | `0 14px` | `0 18px` | `0 22px` |
| font-size   | 12px  | 14px   | 16px  |
| border-radius | 40px | 50px   | 50px  |

```css
background: #fffbe7;      /* no border, same as Input */
/* hover */ box-shadow: 0 3px 0 0 #c4b89e;
/* open/focus */ box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
/* error */ box-shadow: 0 3px 0 0 #c94444;
/* warning */ box-shadow: 0 3px 0 0 #dba90e;
/* disabled */ background: #ece8dc; box-shadow: none; opacity: 0.6;
```

**Panel** (248px wide, narrowing to 172px when `format` omits `ss`): three columns titled 时 / 分 / 秒 (`format`
without `ss` hides the seconds column); each column is a scrollable list of pill options (28px tall, radius 16px):

```css
/* option */ color: #725d42; border-radius: 16px;
/* option hover */ background: #ffd54f; color: #725d42;
/* selected option */ background: #ffb400; color: #fff; font-weight: 700;
```

**Footer** — `此刻` (sets the pending value to the current time) + `确定` (commits via `onChange` and closes with the
0.2s exit animation). Picking a column value updates the trigger live; Esc / click-outside discards the pending value.

**Interaction:** keyboard Enter/Space/ArrowDown opens, Enter confirms, Esc closes; `hourStep` / `minuteStep` /
`secondStep` filter the column options.
