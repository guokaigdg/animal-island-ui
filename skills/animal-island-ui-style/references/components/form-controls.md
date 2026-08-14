# Form control components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Input

```ts
type InputSize = 'small' | 'middle' | 'large';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    size?: InputSize; // default 'middle'
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean; // default false
    status?: 'error' | 'warning';
    shadow?: boolean; // default false — when true, render the 3D pixel-stack shadow
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onClear?: () => void;
}
```

```tsx
<Input placeholder="Your name" allowClear size="large" prefix={<SearchIcon />} value={q} onChange={e => setQ(e.target.value)} status="error" disabled />
```

## Switch

```ts
type SwitchSize = 'small' | 'default';

interface SwitchProps {
    checked?: boolean; // controlled
    defaultChecked?: boolean; // default false
    size?: SwitchSize; // default 'default'
    disabled?: boolean; // default false
    loading?: boolean; // default false
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    onChange?: (checked: boolean) => void;
    className?: string;
}
```

```tsx
<Switch defaultChecked onChange={v => console.log(v)} />
<Switch size="small" checkedChildren="ON" unCheckedChildren="OFF" loading disabled />
```

## Checkbox

```ts
type CheckboxSize = 'small' | 'middle' | 'large';

interface CheckboxOption {
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean; // disable this option only
}

interface CheckboxProps {
    options: CheckboxOption[]; // REQUIRED
    value?: Array<string | number>; // controlled
    defaultValue?: Array<string | number>; // default []
    size?: CheckboxSize; // default 'middle'
    disabled?: boolean; // default false — disables all
    direction?: 'horizontal' | 'vertical'; // default 'horizontal'
    onChange?: (values: Array<string | number>) => void;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Checkbox options={[{ label: '🌊 海滩', value: 'beach' }, { label: '🌳 森林', value: 'forest' }, { label: '🦀 螃蟹', value: 'crab', disabled: true }]} defaultValue={['beach']} />
<Checkbox options={options} value={values} onChange={setValues} direction="vertical" size="large" />
```

Group-level `disabled` disables every item; per-option `disabled` disables a single row. A checked box fills with `#19c8b9`. No indeterminate state, no standalone `<Checkbox.Single>` — group-only via `options`.

## Radio

```ts
type RadioSize = 'small' | 'middle' | 'large';

interface RadioOption {
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean;
}

interface RadioProps {
    options: RadioOption[]; // REQUIRED
    value?: string | number; // controlled
    defaultValue?: string | number; // uncontrolled
    size?: RadioSize; // default 'middle'
    disabled?: boolean; // default false — disables all
    direction?: 'horizontal' | 'vertical'; // default 'horizontal'
    onChange?: (value: string | number) => void;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
const [v, setV] = useState<string | number>('zh');
<Radio value={v} onChange={setV} options={[{ label: '中文', value: 'zh' }, { label: 'English', value: 'en' }, { label: '日本語', value: 'ja', disabled: true }]} />;
```

Implements WAI-ARIA roving tabindex (Arrow / Home / End keyboard navigation). Single-select counterpart to `Checkbox`. **Not supported:** no `optionType="button"` / `buttonStyle` / indeterminate / nested groups / standalone per-`<Radio>` (group-only via `options`).

## Select

```ts
type SelectOption = { key: string; label: string };

interface SelectProps {
    options: SelectOption[]; // REQUIRED
    value: string; // REQUIRED — controlled-only
    onChange: (key: string) => void; // REQUIRED
    placeholder?: string; // default '请选择'
    disabled?: boolean; // default false
}
```

```tsx
const [lang, setLang] = useState('zh');
<Select value={lang} onChange={setLang} options={[{ key: 'zh', label: '简体中文' }, { key: 'en', label: 'English' }, { key: 'ja', label: '日本語' }]} placeholder="Choose language" />;
```

- **Controlled only** — `value` / `onChange` required, no `defaultValue`. Dropdown auto-flips (top/bottom, left/right); click-outside closes. No `className` / `style` / `renderOption`; style via the descendant `.wrapper`. **Not supported:** no `multiple` / `tags` / `showSearch` / `loading` / `allowClear` / `optionLabelProp` / `notFoundContent`.

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
    format?: string; // default 'YYYY-MM-DD'; tokens YYYY / MM / DD / M / D
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

Calendar popup date picker. The value is a plain `YYYY-MM-DD` string — no date library, zero runtime deps. Click the year-month label to switch to year / month selection; `disabledDate` disables any date (weekends etc.); `range` renders two linked month panels for a start & end date. Picking sets a pending value shown live in the trigger; `确定` commits and closes, Esc / click-outside discards. Keyboard: Enter/Space/ArrowDown opens, arrows move the focus date, Enter sets the pending date, Esc closes, PageUp/PageDown flips months.

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
