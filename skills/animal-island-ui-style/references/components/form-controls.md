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
<Input placeholder="Your name" allowClear />
<Input size="large" prefix={<SearchIcon />} value={q} onChange={e => setQ(e.target.value)} />
<Input status="error" suffix="@gmail.com" />
<Input disabled value="locked" />
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
<Switch size="small" checkedChildren="ON" unCheckedChildren="OFF" />
<Switch loading disabled />
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
// Uncontrolled — string values
<Checkbox
  options={[
    { label: '🌊 海滩', value: 'beach' },
    { label: '🌳 森林', value: 'forest' },
    { label: '🦀 螃蟹', value: 'crab', disabled: true },
  ]}
  defaultValue={['beach']}
/>

// Controlled + vertical (numeric values are equally valid: string | number)
const [values, setValues] = useState<Array<string | number>>([]);
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
<Radio
    value={v}
    onChange={setV}
    options={[
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' },
        { label: '日本語', value: 'ja', disabled: true },
    ]}
/>;
```

Implements WAI-ARIA roving tabindex (Arrow / Home / End keyboard navigation). Single-select counterpart to `Checkbox`.

**Not supported:** no `optionType="button"`, no `buttonStyle`, no indeterminate, no nested groups, no per-`<Radio>` standalone form (the API is group-only via `options`).

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
<Select
    value={lang}
    onChange={setLang}
    options={[
        { key: 'zh', label: '简体中文' },
        { key: 'en', label: 'English' },
        { key: 'ja', label: '日本語' },
    ]}
    placeholder="Choose language"
/>;
```

- **Controlled only.** `value` and `onChange` are required — there is no `defaultValue`.
- Dropdown auto-flips (top/bottom, left/right) based on viewport space; click-outside to close is built in.
- Does NOT accept `className` / `style` / a custom `renderOption`; style it via CSS targeting the descendant `.wrapper`.
- **Not supported:** no `multiple`, no `mode="tags"`, no `showSearch`, no `loading`, no `allowClear`, no `optionLabelProp`, no `notFoundContent` (just hides).
