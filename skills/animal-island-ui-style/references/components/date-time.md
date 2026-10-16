# Date & time pickers — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## DatePicker

```ts
type DatePickerSize = 'small' | 'middle' | 'large';
type DatePickerStatus = 'error' | 'warning';
type DatePickerValue = string | [string, string] | null; // null = cleared

interface DatePickerProps {
    range?: boolean; // default false — pick a start & end date
    value?: DatePickerValue; // string for date mode, [start, end] for range
    defaultValue?: string | [string, string]; // uncontrolled
    onChange?: (value: DatePickerValue) => void; // null when cleared
    placeholder?: string; // default '请选择日期'
    disabled?: boolean; // default false
    allowClear?: boolean; // default false
    size?: DatePickerSize; // default 'middle'
    status?: DatePickerStatus;
    format?: string; // default 'YYYY-MM-DD'; core dayjs tokens (YYYY / MM / DD / M / D / HH / mm / ss / ddd); plugin tokens such as Q need that plugin registered
    disabledDate?: (date: Date) => boolean;
    picker?: 'date' | 'month'; // default 'date' — 'month' opens the month grid and commits YYYY-MM
    open?: boolean; // controlled open state
    onOpenChange?: (open: boolean) => void;
    showToday?: boolean; // default true
    'aria-label'?: string; 'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<DatePicker value={date} onChange={setDate} allowClear />
<DatePicker range value={range} onChange={setRange} disabledDate={d => d.getDay() === 0} />
```

Calendar popup date picker. The value is a plain `YYYY-MM-DD` string; the panel's date arithmetic runs on `dayjs`, and strict parsing rejects impossible dates such as `2026-02-30` instead of rolling them over. `format` takes core dayjs tokens — plugin-owned tokens such as `Q` render literally, since only `customParseFormat` is registered. Click the year-month label to switch to year / month selection; `disabledDate` disables any date (weekends etc., it always receives a native `Date`); `range` renders two linked month panels for a start & end date. Picking sets a pending value shown live in the trigger; `确定` commits and closes, Esc / click-outside discards. Keyboard: Enter/Space/ArrowDown opens, arrows move the focus date, Enter sets the pending date, Esc closes, PageUp/PageDown flips months.

## TimePicker

```ts
type TimePickerSize = 'small' | 'middle' | 'large';
type TimePickerStatus = 'error' | 'warning';
type TimePart = { h: number; m: number; s: number };

interface TimePickerProps {
    value?: string; // controlled, HH:mm:ss
    defaultValue?: string; // uncontrolled
    onChange?: (value: string | null) => void; // null when cleared
    placeholder?: string; // default '请选择时间'
    disabled?: boolean; // default false
    allowClear?: boolean; // default false
    size?: TimePickerSize; // default 'middle'
    status?: TimePickerStatus;
    format?: string; // default 'HH:mm:ss'; tokens HH / mm / ss; ss shows the seconds column
    hourStep?: number; // default 1
    minuteStep?: number; // default 1
    secondStep?: number; // default 1
    open?: boolean; // controlled open state
    onOpenChange?: (open: boolean) => void;
    'aria-label'?: string; 'aria-labelledby'?: string;
    className?: string;
    style?: React.CSSProperties;
}
```
```tsx
<TimePicker value={time} onChange={setTime} minuteStep={15} allowClear />
```

Time popup picker with hour / minute / second scroll columns; picking updates the pending value live in the trigger; `此刻` sets the current time, `确定` commits (`onChange`) and closes; Esc / click-outside discard. Enter/Space opens, Enter confirms, Esc closes.
