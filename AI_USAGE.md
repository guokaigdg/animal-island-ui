# animal-island-ui · AI Usage Guide (v0.9.5)

> **FOR AI CODE ASSISTANTS**: This file is the canonical, machine-readable reference for generating code that uses `animal-island-ui`. Prefer this file over any other source. Every prop / import / default below is copied verbatim from source. Do NOT invent props.

---

## 0. Setup (once per project)

```bash
npm install animal-island-ui
```

```ts
// app entry (main.tsx / _app.tsx / App.tsx)
import 'animal-island-ui/style'; // MUST import BEFORE any component usage
// Fonts (Nunito / Noto Sans SC) are auto-bundled via @fontsource.
```

```ts
// Peer requirements
react      >= 17.0.0
react-dom  >= 17.0.0
```

> Global aesthetics preset (warm-parchment + pill shapes + 3D button shadow) is applied via `animal-island-ui/style`. Design tokens (colors, radii, shadows) are baked into compiled CSS — they are NOT exposed as `--animal-*` custom properties for runtime override. If you need token consistency in surrounding code, copy the CSS-variable template from `skill/SKILL.md` § 5 (repo-only) and declare it yourself.

---

## 1. Full API (26 components + 3 companion exports: FormItem, useForm, ICON_LIST)

All named exports from `animal-island-ui`:

```ts
import {
    Button,
    Input,
    Switch,
    Modal,
    Drawer,
    Card,
    Title,
    Collapse,
    Cursor,
    Time,
    Phone,
    Footer,
    Divider,
    Typewriter,
    Tabs,
    Icon,
    Select,
    Checkbox,
    Radio,
    Tooltip,
    Loading,
    Table,
    CodeBlock,
    Form,
    FormItem,
    Wallet,
    Tag,
    Notification,
} from 'animal-island-ui';

// Companion hook (form instance factory)
import { useForm } from 'animal-island-ui';

// Runtime value export (icon catalogue — 10 entries)
import { ICON_LIST } from 'animal-island-ui';

import type {
    ButtonProps,
    ButtonType,
    ButtonSize,
    InputProps,
    InputSize,
    SwitchProps,
    SwitchSize,
    ModalProps,
    DrawerProps,
    DrawerPlacement,
    CardProps,
    CardType,
    CardColor,
    TitleProps,
    TitleSize,
    TitleColor,
    CollapseProps,
    CursorProps,
    TimeProps,
    PhoneProps,
    FooterProps,
    FooterType,
    DividerProps,
    TypewriterProps,
    TabsProps,
    TabItem,
    IconProps,
    IconName,
    SelectProps,
    SelectOption,
    CheckboxProps,
    CheckboxOption,
    CheckboxSize,
    RadioProps,
    RadioOption,
    RadioSize,
    TooltipProps,
    TooltipPlacement,
    TooltipTrigger,
    TooltipVariant,
    LoadingProps,
    TableProps,
    TableColumn,
    CodeBlockProps,
    FormProps,
    FormItemProps,
    FormItemLayout,
    FormLayout,
    FormSize,
    FormLabelAlign,
    FormInstance,
    ColProp,
    NamePath,
    RequiredMark,
    RuleObject,
    RuleRender,
    RuleType,
    Rules,
    FieldData,
    ValidateStatus,
    ValidateError,
    ValidateInfo,
    ScrollOptions,
    WalletProps,
    WalletSize,
    TagProps,
    TagSize,
    TagVariant,
    TagColor,
    NotificationStatic,
    NotificationConfig,
    NotificationType,
    NotificationPosition,
    NotificationPlacement,
    NotificationItem,
} from 'animal-island-ui';
```

> Section order below mirrors the import grouping above: related components are adjacent (Title after Card, Radio after Checkbox).

---

### 1.1 Button

```ts
type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
type ButtonSize = 'small' | 'middle' | 'large';
type ButtonHTMLType = 'submit' | 'reset' | 'button';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    type?: ButtonType; // default 'default'
    size?: ButtonSize; // default 'middle'
    danger?: boolean; // default false
    ghost?: boolean; // default false
    block?: boolean; // default false
    loading?: boolean; // default false — renders diagonal-stripe animation
    disabled?: boolean; // default false
    icon?: React.ReactNode;
    htmlType?: ButtonHTMLType; // default 'button'
    children?: React.ReactNode;
}
```

Canonical usage:

```tsx
<Button type="primary" onClick={save}>Save</Button>
<Button type="primary" danger loading>Deleting…</Button>
<Button type="dashed" icon={<PlusIcon />} size="large" block>Add</Button>
<Button type="text">Cancel</Button>
```

---

### 1.2 Input

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

---

### 1.3 Switch

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

---

### 1.4 Modal

```ts
interface ModalProps {
    open: boolean; // REQUIRED
    title?: React.ReactNode; // heading text — NOT the <Title> component (see § 1.6)
    width?: number | string; // default 520
    maskClosable?: boolean; // default true
    footer?: React.ReactNode | null; // null = hide footer
    onClose?: () => void;
    onOk?: () => void;
    children?: React.ReactNode;
    className?: string;
    typeSpeed?: number; // default 80 (ms/char for built-in typewriter)
    typewriter?: boolean; // default true — body plays typewriter on open
}
```

```tsx
const [open, setOpen] = useState(false);
<Modal
    open={open}
    title="Confirm"
    onClose={() => setOpen(false)}
    onOk={() => {
        submit();
        setOpen(false);
    }}
>
    Proceed to delete this island?
</Modal>;
```

Notes:

- Modal already ships the required SVG blob `<clipPath id="animal-modal-clip">` internally.
- To disable the typewriter animation for dynamic content: `typewriter={false}`.
- Custom footer: pass `footer={<><Button>...</Button></>}` or `footer={null}` to hide.
- `title` accepts a `ReactNode` — pass plain text. Do NOT pass `<Title>` here (see HARD RULE 24).

---

### 1.5 Card

```ts
type CardType = 'default' | 'dashed';

type CardColor =
    | 'default' // rgb(247,243,223) / #725d42 text
    | 'app-pink' // #f8a6b2 / #fff
    | 'purple' // #b77dee / #fff
    | 'app-blue' // #889df0 / #fff
    | 'app-yellow' // #f7cd67 / #725d42
    | 'app-orange' // #e59266 / #fff
    | 'app-teal' // #82d5bb / #fff
    | 'app-green' // #8ac68a / #fff
    | 'app-red' // #fc736d / #fff
    | 'lime-green' // #d1da49 / #3d5a1a
    | 'yellow-green' // #ecdf52 / #725d42
    | 'brown' // #9a835a / #fff
    | 'warm-peach-pink'; // #e18c6f / #fff

// Decorative pattern overlay — 'none' or any of the 13 CardColor values.
type CardPattern =
    | 'none'
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: CardType; // default 'default'
    color?: CardColor; // default 'default'
    pattern?: CardPattern; // default 'none'
    hoverable?: boolean; // default false (no hover); true → cursor pointer + translateY(-2px) on hover
    children?: React.ReactNode;
}
```

```tsx
<Card>Default parchment card (read-only, no hover)</Card>
<Card hoverable>Interactive card (hover lifts -2px, cursor pointer)</Card>
<Card type="dashed">Draft / empty-state container</Card>
<Card color="app-yellow">Notification</Card>
<Card color="app-blue" pattern="app-pink">With decorative pattern overlay</Card>
```

> Need a chapter/section heading? Use the `<Title>` component (ribbon banner — see § 1.6). `Card type="title"` was removed.

---

### 1.6 Title

```ts
type TitleSize = 'small' | 'middle' | 'large';
type TitleColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

interface TitleProps {
    children: React.ReactNode; // REQUIRED
    size?: TitleSize; // default 'middle'
    color?: TitleColor; // default 'default'
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Title>Chapter One</Title>
<Title size="large" color="app-yellow">Notification</Title>
```

> Replaces the previous `Card type="title"`. Renders an island-style ribbon banner (swallowtail clip-path ends + fold-shadow triangles + raised front). Uses the same 13 IslandPhone palette as `Card.color`; size scales the entire ribbon via `em` units (small 14px / middle 20px / large 28px base).
>
> **Not supported:** no `level` (`h1..h6`) — renders as inline-block `<div>`; no `bordered`; no `code` / `mark` / `underline` / `delete` modifiers (this is a decorative ribbon banner, NOT a generic typography-heading component).

---

### 1.7 Collapse

```ts
interface CollapseProps {
    question: React.ReactNode; // REQUIRED — header
    answer: React.ReactNode; // REQUIRED — body
    defaultExpanded?: boolean; // default false
    disabled?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Collapse question="What is Animal Island?" answer="A cozy React UI kit." />
<Collapse defaultExpanded question="FAQ #1" answer={<p>Long rich content…</p>} />
```

> Uses pure CSS grid-row transition — no JS height measurement, safe for SSR. Single panel only — no `accordion` / `items` group API; render multiple `<Collapse>` siblings if you need a list.

---

### 1.8 Cursor

```ts
interface CursorProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
```

Wrap the region where you want a game-style finger cursor:

```tsx
<Cursor>
    <App />
</Cursor>
```

> Applies `cursor: url(...) 4 0, auto !important` to `*` descendants. Do NOT nest multiple `<Cursor>`. `style` is for layout only — do not try to override the cursor URL via inline style.

---

### 1.9 Time

```ts
interface TimeProps {
    className?: string;
}
```

```tsx
<Time /> // auto-updates every second, shows weekday + date + clock
```

> No configurable props beyond `className` — it is a self-contained HUD widget. No `format`, no `value`, no timezone — uses the browser's local clock.

---

### 1.10 Phone (decorative IslandPhone)

```ts
interface PhoneProps {
    className?: string;
}
```

```tsx
<Phone />
```

> Fixed size 527×788px. A decorative showcase widget: 3×3 app grid + live AM/PM clock + blinking colon + hover icon bounce. Not configurable beyond `className` — no app slots, no badge API, no callback.

---

### 1.11 Footer

```ts
type FooterType = 'sea' | 'tree';

interface FooterProps {
    type?: FooterType; // default 'tree'
    seamless?: boolean; // default true (无缝拼接背景循环平铺)
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Footer />                        {/* forest silhouette, 80px tall — default */}
<Footer type="sea" />             {/* ocean wave */}
<Footer type="sea" seamless />    {/* ocean wave with seamless horizontal tiling */}
```

> `style` accepts layout properties only (margin / position). Don't try to recolor via `backgroundColor` — the asset is a fixed PNG/SVG.

---

### 1.12 Divider

```ts
type DividerType =
    | 'line-brown'
    | 'line-teal'
    | 'line-white'
    | 'line-yellow'
    | 'wave-yellow'
    | 'dashed-brown'
    | 'dashed-teal'
    | 'dashed-white'
    | 'dashed-yellow';

interface DividerProps {
    type?: DividerType; // default 'line-brown'
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Divider />
<Divider type="wave-yellow" />
```

> Height fixed 12px. Purely decorative background-image band. No `orientation` / `dashed` / `plain` / children — for a vertical separator, use a CSS `border-left` on adjacent elements.

---

### 1.13 Typewriter

```ts
interface TypewriterProps {
    children?: React.ReactNode; // ANY ReactNode — preserves element structure, classNames, inline styles
    speed?: number; // ms per char, default 90
    trigger?: unknown; // change this value to restart animation (e.g. modal openCount)
    autoPlay?: boolean; // default true (false = show full immediately)
    onDone?: () => void;
}
```

```tsx
<Typewriter speed={60} onDone={() => setStep(2)}>
  <p>Hello, <strong>traveler</strong>.</p>
  <p>Welcome to the island.</p>
</Typewriter>

// Restart on modal open:
<Typewriter trigger={openCount}>{dialogueText}</Typewriter>
```

> Renders NO wrapper element; zero layout impact. Recursively truncates ReactNode by char count while preserving tree structure.

---

### 1.14 Tabs

```ts
interface TabItem {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
}

interface TabsProps {
    items: TabItem[]; // REQUIRED
    defaultActiveKey?: string; // default: first tab
    activeKey?: string; // controlled mode
    onChange?: (key: string) => void;
    className?: string;
    style?: React.CSSProperties;
    leafAnimation?: boolean; // default true — active-tab leaf wiggle
}
```

```tsx
// Uncontrolled mode
<Tabs
    items={[
        { key: 'tab1', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
        { key: 'tab2', label: '昆虫', children: <p>蝴蝶、蜻蜓...</p> },
    ]}
    defaultActiveKey="tab1"
/>;

// Controlled mode
const [activeKey, setActiveKey] = useState('tab1');
<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />;
```

> Supports both controlled and uncontrolled modes. Smooth fade animation on tab switch.
>
> **Not supported:** no `tabPosition` (always top), no `type="card"` / `type="editable-card"`, no `tabBarExtraContent`, no closable tabs.

---

### 1.15 Icon

```ts
type IconName =
    | 'icon-miles'
    | 'icon-camera'
    | 'icon-chat'
    | 'icon-encyclopedia'
    | 'icon-design'
    | 'icon-diy'
    | 'icon-helicopter'
    | 'icon-map'
    | 'icon-shopping'
    | 'icon-variant';

interface IconProps {
    name: IconName; // REQUIRED — one of the 10 built-in SVG icons
    size?: number | string; // default 24 — applied to width & height
    className?: string;
    style?: React.CSSProperties;
    bounce?: boolean; // default false — adds hover bounce animation
}

// Runtime catalogue for dynamic rendering / pickers (length = 10):
declare const ICON_LIST: { name: IconName; label: string }[];
```

```tsx
<Icon name="icon-camera" size={32} />
<Icon name="icon-chat" bounce />
{ICON_LIST.map(({ name, label }) => <Icon key={name} name={name} />)}
```

> Icons are rendered as `<span>` with a background-image SVG. Use `size` (number=px, string=any CSS length) — do NOT wrap in a sized div.

---

### 1.16 Select

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

Notes:

- **Controlled only.** `value` and `onChange` are required — there is no `defaultValue`.
- Dropdown auto-flips (top/bottom, left/right) based on viewport space.
- Click-outside to close is built-in.
- Does NOT accept `className` / `style` / custom `renderOption`; style via CSS targeting descendant `.wrapper`.
- **Not supported:** no `multiple`, no `mode="tags"`, no `showSearch`, no `loading`, no `allowClear`, no `optionLabelProp`, no `notFoundContent` (just hides).

---

### 1.17 Checkbox

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
// Uncontrolled
<Checkbox
  options={[
    { label: '🌊 海滩', value: 'beach' },
    { label: '🌳 森林', value: 'forest' },
    { label: '🦀 螃蟹', value: 'crab', disabled: true },
  ]}
  defaultValue={['beach']}
/>

// Controlled + vertical
const [values, setValues] = useState<Array<string | number>>([]);
<Checkbox
  options={options}
  value={values}
  onChange={setValues}
  direction="vertical"
  size="large"
/>

// Numeric values also allowed (string | number)
<Checkbox
  options={[
    { label: 'Weekday', value: 1 },
    { label: 'Weekend', value: 2 },
  ]}
  defaultValue={[1]}
/>
```

> Group-level `disabled` disables every item. Per-option `disabled` disables a single row. Checked box fills with `#19c8b9`. No indeterminate state, no standalone `<Checkbox.Single>` — group-only via `options`.

---

### 1.18 Radio

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

> Implements WAI-ARIA roving tabindex (Arrow / Home / End keyboard navigation). Single-select counterpart to `Checkbox`.
>
> **Not supported:** no `optionType="button"`, no `buttonStyle`, no indeterminate, no nested groups, no per-`<Radio>` standalone form (the API is group-only via `options`).

---

### 1.19 Tooltip

```ts
type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

type TooltipTrigger = 'hover' | 'focus' | 'click';
type TooltipVariant = 'default' | 'island';

interface TooltipProps {
    title: React.ReactNode; // REQUIRED — tooltip body
    children: React.ReactElement; // REQUIRED — single trigger element
    placement?: TooltipPlacement; // default 'top'
    trigger?: TooltipTrigger; // default 'hover'
    variant?: TooltipVariant; // default 'default'
    bordered?: boolean; // default true
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Tooltip title="Save your island"><Button type="primary">Save</Button></Tooltip>
<Tooltip title="More info" placement="right" trigger="click">
  <Icon name="icon-chat" />
</Tooltip>
<Tooltip title="Game-style bubble" variant="island"><span>?</span></Tooltip>
```

> `children` must be a SINGLE React element capable of receiving event/ref props (do not pass strings or fragments). `variant="island"` renders an organic SVG-clipped bubble matching the Modal silhouette.
>
> **Not supported:** no `open` / `defaultOpen` (uncontrolled visibility only — driven by `trigger`), no `onOpenChange`, no `mouseEnterDelay` / `mouseLeaveDelay`, no arrow toggle, no `getPopupContainer`, no `color`. The bubble color is fixed by `variant`.

---

### 1.20 Loading

```ts
interface LoadingProps {
    active?: boolean; // default true
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Loading />                  {/* full-bleed loading scene */}
<Loading active={isLoading} />
```

> Self-contained illustrated loading scene (no configurable content). When `active={false}`, the scene fades out via a CSS mask radius transition.
>
> **Not supported:** no `tip` / `text`, no `size`, no `spinning`, no `delay`, no `indicator`, no `children` (this is NOT a generic Spin-style wrapper — do not wrap content with it). Use it as a sibling overlay element controlled via `active`.

---

### 1.21 Table

```ts
interface TableColumn<T = Record<string, unknown>> {
    title: React.ReactNode;
    dataIndex?: keyof T;
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    style?: React.CSSProperties;
}

interface TableProps<T = Record<string, unknown>> {
    columns?: TableColumn<T>[]; // default []
    dataSource?: T[]; // default []
    rowKey?: string | ((record: T) => string); // default 'key'
    striped?: boolean; // default true
    showHeader?: boolean; // default true
    rowClassName?: string | ((record: T, index: number) => string);
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
    loading?: boolean; // default false
    emptyText?: React.ReactNode; // default '暂无数据'
    scroll?: { x?: number | string; y?: number | string };
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Table
    columns={[
        { title: '名称', dataIndex: 'name', width: 160 },
        { title: '价格', dataIndex: 'price', align: 'right' },
        { title: '操作', render: (_, r) => <Button size="small">买</Button> },
    ]}
    dataSource={items}
    rowKey="id"
/>
```

> **Not supported:** no `pagination` (paginate `dataSource` yourself), no built-in `sorter` / `filters` / column-search, no `rowSelection` / checkbox column, no `expandable` / nested rows, no `summary` row, no `bordered` toggle (always borderless), no virtual scroll. `scroll.x` / `scroll.y` only enable native overflow scrolling.

---

### 1.22 CodeBlock

```ts
interface CodeBlockProps {
    code: string; // REQUIRED — raw source string
    style?: React.CSSProperties; // merged on top of the dark preset
    className?: string;
}
```

```tsx
<CodeBlock code={`import { Button } from 'animal-island-ui';\n\n<Button type="primary">Go</Button>`} />

// Override theme
<CodeBlock
  code={src}
  style={{ borderRadius: 5, backgroundColor: '#242c46' }}
/>
```

> Renders a `<pre>` with built-in JSX/TS tokenizer. No `language` prop — always treated as JSX/TS. Default theme: bg `#2b2118`, border `1px solid #3d3028`, radius 20px, font-size 14, line-height 1.7. No copy button, no line numbers, no word-wrap.

---

### 1.23 Form

```ts
type FormLayout = 'horizontal' | 'vertical' | 'inline';
type FormLabelAlign = 'left' | 'right';
type FormSize = 'small' | 'middle' | 'large';
type RequiredMark = boolean | 'optional';

interface ColProps {
    span?: number; // default 24
    offset?: number; // default 0
}

type NamePath = string | number | (string | number)[];

type RuleType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'email'
    | 'url'
    | 'date';

interface RuleObject {
    required?: boolean;
    message?: string; // error message on failure
    min?: number; // min length / min value
    max?: number; // max length / max value
    len?: number; // exact length
    pattern?: RegExp;
    whitespace?: boolean; // treat whitespace as invalid (with required)
    type?: RuleType;
    validator?: (rule: RuleObject, value: unknown) => Promise<void | string> | void | string;
}

type RuleRender = RuleObject | ((form: FormInstance) => RuleObject);
type Rules = RuleRender[];

interface ValidateError {
    name: NamePath;
    errors: string[];
}

interface ValidateInfo {
    values: Record<string, unknown>;
    errorFields: ValidateError[];
    outOfDate: boolean;
}

interface FieldData {
    name: NamePath;
    value?: unknown;
    errors?: string[];
    touched?: boolean;
    validating?: boolean;
}

interface FormInstance<T = Record<string, unknown>> {
    getFieldValue: (name: NamePath) => unknown;
    getFieldsValue: (nameList?: NamePath[] | true) => T;
    setFieldValue: (name: NamePath, value: unknown) => void;
    setFieldsValue: (values: Partial<T>) => void;
    resetFields: (nameList?: NamePath[]) => void; // back to initialValues, clears errors
    validateFields: (nameList?: NamePath[]) => Promise<T>; // rejects with ValidateInfo on error
    submit: () => void; // validate → onFinish / onFinishFailed
    setFields: (fields: FieldData[]) => void;
    isFieldTouched: (name: NamePath) => boolean;
    isFieldValidating: (name: NamePath) => boolean;
    getFieldError: (name: NamePath) => string[] | undefined;
    scrollToField: (name: NamePath, options?: ScrollOptions) => void;
}

interface ScrollOptions {
    behavior?: 'auto' | 'smooth';
    block?: 'start' | 'center' | 'end' | 'nearest';
    inline?: 'start' | 'center' | 'end' | 'nearest';
}

interface FormProps<T = Record<string, unknown>> extends Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    'onSubmit' | 'children'
> {
    form?: FormInstance<T>; // controlled instance from Form.useForm()
    initialValues?: Partial<T>;
    layout?: FormLayout; // default 'horizontal'
    labelAlign?: FormLabelAlign; // default 'right' (horizontal) / 'left' (vertical, inline)
    labelCol?: ColProps; // default { span: 6 }
    wrapperCol?: ColProps; // default { span: 18 }
    size?: FormSize; // default 'middle' — only scales label font-size
    disabled?: boolean; // default false — propagates to children via cloneElement
    colon?: boolean; // default true
    requiredMark?: RequiredMark; // default false
    onFinish?: (values: T) => void; // invoked after successful validateFields on submit
    onFinishFailed?: (info: ValidateInfo) => void;
    onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
    onReset?: (e: React.FormEvent<HTMLFormElement>) => void;
    children?: React.ReactNode;
}

// Hook: factory for form instances
declare function useForm<T = Record<string, unknown>>(): [FormInstance<T>];

// FormItem
type FormItemLayout = 'horizontal' | 'vertical';
type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | '';

interface FormItemProps {
    name?: NamePath; // omit for display-only item (no field registration)
    label?: React.ReactNode;
    rules?: Rules;
    required?: boolean; // shows * (when requiredMark is on); validation still comes from rules.required
    dependencies?: NamePath[]; // revalidate this field when listed fields change
    valuePropName?: string; // default 'value' — prop injected into child
    trigger?: string; // default 'onChange' — event prop name on child
    getValueFromEvent?: (event: unknown) => unknown;
    normalize?: (value: unknown, prevValue: unknown, prevAllValues: Record<string, unknown>) => unknown;
    hidden?: boolean; // default false — render nothing (still registered)
    hasFeedback?: boolean; // default false — show ✕ icon on error
    validateStatus?: ValidateStatus; // override inferred status
    help?: React.ReactNode; // shown when no error
    noStyle?: boolean; // default false — skip label/wrapper shell, only clone children
    labelCol?: ColProps; // override parent
    wrapperCol?: ColProps; // override parent
    colon?: boolean; // override parent
    requiredMark?: RequiredMark; // override parent
    layout?: FormItemLayout; // override parent
    initialValue?: unknown; // applied once on mount
    className?: string;
    children?: React.ReactNode; // single controlled element — value/onChange injected
}
```

```tsx
// Controlled form with submit + validation
const [form] = useForm();

function onFinish(values: { email: string; agree: boolean }) {
    console.log('submit', values);
}

<Form
    form={form}
    initialValues={{ agree: false }}
    layout="horizontal"
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    onFinish={onFinish}
>
    <FormItem
        label="Email"
        name="email"
        rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' },
        ]}
    >
        <Input placeholder="you@example.com" allowClear />
    </FormItem>

    <FormItem label="Agree" name="agree" valuePropName="checked">
        <Switch />
    </FormItem>

    <FormItem wrapperCol={{ offset: 6, span: 18 }}>
        <Button type="primary" htmlType="submit" block>
            Submit
        </Button>
    </FormItem>
</Form>;

// Imperative validate / reset
const values = await form.validateFields();
form.resetFields();
form.setFieldValue('email', 'kai@example.com');
```

Notes:

- **API mirrors the conventional React form pattern.** Familiar concepts (`Form.useForm`, `Form.Item`, `initialValues`, `rules`, `onFinish`, `validateFields`) all work.
- **FormItem injects `value` / `onChange` (or your custom `valuePropName` / `trigger`) into its child via `React.cloneElement`.** The child must accept these props (most animal-island-ui inputs do). For checkbox/switch use `valuePropName="checked"`.
- **FormItem must be inside `<Form>`** (or `<Form.Provider>`), otherwise throws at runtime.
- **Status colors intentionally diverge from the parchment palette** — Form uses conventional neutral status colors (`rgba(0,0,0,0.85)` text, `#ff4d4f` error, `#faad14` warning, `#52c41a` success, `#1677ff` validating). Do NOT recolor Form internals to `#725d42` etc. — see `skill/SKILL.md` § Form.
- **`required` only controls the `*` mark visibility** (and only when `requiredMark !== false`); actual validation is driven by `rules: [{ required: true }]`.
- **`size` only scales label font-size** (12/14/16 px). It does not resize the inner input — pass `size` to the inner `<Input size="large">` separately, or it will be propagated from Form via cloneElement if the child supports it.
- **`disabled` propagates to children** via cloneElement if the child has no explicit `disabled` prop. Same for `size` and `status="error"`.
- **horizontal layout uses a 24-column CSS Grid.** `labelCol` / `wrapperCol` map to `grid-column: start / span N`. No column-gap between label and wrapper (otherwise the form overflows). Inline items stack label-over-control per item.
- **Default `labelCol` is `{ span: 6 }`, `wrapperCol` is `{ span: 18 }`.** To put a submit button flush-left under inputs, use `<FormItem wrapperCol={{ offset: 6, span: 18 }}>` with no `name` (no validation).

---

### 1.24 Wallet

```ts
type WalletSize = 'small' | 'medium' | 'large';

interface WalletProps {
    value?: number | string; // default '00,000' — numbers auto-formatted with thousandSeparator
    icon?: React.ReactNode; // default built-in Island bag PNG (item-022.png)
    size?: WalletSize; // default 'medium'
    thousandSeparator?: string; // default ',' — pass '' to disable grouping
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Wallet value={12345} />
<Wallet value="9,999,999" size="large" />
<Wallet value={-1500} thousandSeparator="." size="small" />
<Wallet value={8888} icon={<span>💰</span>} />
```

> Decorative currency display — Island-bag-style olive-yellow pill with the bag icon overlapping 70% above. Three sizes: small (96×32 pill / 38px bag / 12px text), medium default (132×42 / 50px / 17px), large (176×54 / 66px / 22px).
>
> **Value formatting:** `number` → thousand-grouped with `thousandSeparator`; `string` → rendered as-is; `undefined`/`null` → `00,000`. Negative numbers prefix `-`.
>
> **`icon` replaces the entire bag slot** (a single ReactNode in an absolutely-positioned 50×50 px container). Default is the built-in `assets/img/icons/items/item-022.png` rendered via the `Icon` component's hidden `src` prop.

---

### 1.25 Drawer

```ts
type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

interface DrawerProps {
    open: boolean; // REQUIRED
    title?: React.ReactNode; // heading text — plain text, NOT <Title>
    placement?: DrawerPlacement; // default 'right'
    width?: number | string; // for left/right, default 378
    height?: number | string; // for top/bottom, default 300
    maskClosable?: boolean; // default true
    pushBackground?: boolean; // default true — signature depth effect (background sinks)
    footer?: React.ReactNode | null; // null / undefined = no footer rendered
    onClose?: () => void;
    children?: React.ReactNode;
    className?: string;
    maskStyle?: React.CSSProperties;
}
```

```tsx
const [open, setOpen] = useState(false);
<Button type="primary" onClick={() => setOpen(true)}>
    打开抽屉
</Button>
<Drawer open={open} title="岛屿设置" onClose={() => setOpen(false)}>
    打开时背景内容会下沉 + 缩放 + 降亮，突出抽屉主体，形成景深层次。
</Drawer>
```

Notes:

- `pushBackground` (default `true`) is the signature effect: when open, all non-fixed direct children of `document.body` are translated `translateY(24px) scale(0.96)` with `brightness(0.85)`, making the drawer float above a "sunken" page. Fixed-position elements (other overlays, portals) are auto-excluded. Set `pushBackground={false}` for a normal flat-mask drawer.
- The mask uses a light black `rgba(0,0,0,0.18)` (lighter than Modal's 0.35) so the sunken background remains visible — this is what makes the depth readable.
- Drawer has NO built-in typewriter (unlike Modal). Pass any content directly.
- Default footer is **none** (unlike Modal's 取消/确定). Pass `footer={<><Button>...</Button></>}` for confirm-style actions.
- A close × button is rendered in the header when `title` is provided. Esc / mask click also close.
- a11y: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on title, focus trap + focus restore (same pattern as Modal).

---

### 1.26 Tag

```ts
type TagSize = 'small' | 'medium' | 'large';
type TagVariant = 'solid' | 'outlined' | 'dashed';
type TagColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

interface TagProps {
    children?: React.ReactNode;
    size?: TagSize; // default 'medium'
    variant?: TagVariant; // default 'solid'
    color?: TagColor; // default 'default'
    closable?: boolean; // default false
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void; // enables clickable + keyboard a11y
    disabled?: boolean; // default false
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Tag>默认标签</Tag>
<Tag color="app-pink" variant="solid">已选</Tag>
<Tag color="app-teal" variant="outlined">草稿</Tag>
<Tag color="warm-peach-pink" variant="dashed" size="small">限时</Tag>
<Tag closable onClose={(e) => console.log('closed')}>可关闭</Tag>
<Tag color="app-blue" onClick={() => alert('clicked')}>可点击</Tag>
<Tag disabled>禁用</Tag>
```

Notes:

- **Color palette exactly matches `Card`** — 12 brand colors + 1 default. `solid` uses the saturated color as background with white text; `outlined` and `dashed` use the same color for text + border on a transparent background. `color="default"` renders the parchment-pill neutral (`rgb(247,243,223)` bg, `#8f734f` text) — use it for plain chips.
- **3 sizes** (driven by CSS class `size-{size}`): small 24px / medium 29px / large 34px. All have `border-radius: 999px` (full capsule), `font-weight: 600`, and 1.5px transparent border (reserves space so outlined/dashed don't shift layout).
- **`closable` renders a × button** with `aria-label="close"` and a 16×16 circle background `rgba(0,0,0,0.08)` (hover `0.18`). Close click is `stopPropagation`'d, so it will NOT trigger the parent `onClick`.
- **`onClick` upgrades the tag to a button** (`role="button"`, `tabIndex={0}`) — supports Enter and Space keys. Without `onClick` the tag is a plain `<span>`. Hover/active states add `translateY(-1px)` lift + `box-shadow 0 2px 6px rgba(61,52,40,0.12)`. Focus ring is `2px solid var(--animal-focus-yellow, #f5c31c)`.
- **`disabled`** sets `opacity: 0.5` and `pointer-events: none` on the whole tag, AND disables the close button (which gets a separate `cursor: not-allowed`).
- a11y: when clickable, the tag is a button. Close button is reachable via Tab. All interactive states have visible focus styles.

---

### 1.27 Notification (imperative)

Notification is **NOT a JSX component** — it's a static-method API (à la antd). Calling `Notification.success({...})` mounts a portal under `document.body`, renders the toast, and auto-unmounts after `duration` seconds. There is no `<Notification>` element to put in your tree.

```ts
type NotificationType = 'success' | 'info' | 'warning' | 'error';
type NotificationPosition =
    | 'top' // top-center (DEFAULT)
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight';

interface NotificationConfig {
    message: React.ReactNode; // REQUIRED
    description?: React.ReactNode;
    duration?: number; // seconds; default 4.5; pass 0 to disable auto-close
    position?: NotificationPosition; // default 'top'
    type?: NotificationType; // default depends on the called method
    icon?: React.ReactNode; // overrides the default type icon
    btn?: React.ReactNode; // action button rendered left of the close ×
    key?: string; // explicit key — re-calling with same key UPDATES the existing toast instead of adding a new one (use for progress / live updates)
    onClose?: () => void; // fires after the leave animation completes
    onClick?: () => void; // fires when the toast body is clicked (also makes it keyboard-activatable: Enter / Space)
    closeIcon?: React.ReactNode; // replaces the default ×
    className?: string;
    style?: React.CSSProperties;
}

interface NotificationStatic {
    (config: NotificationConfig | string): void; // direct call → type 'info'
    open: (config: NotificationConfig | string) => void;
    success: (config: NotificationConfig | string) => void;
    info: (config: NotificationConfig | string) => void;
    warning: (config: NotificationConfig | string) => void;
    error: (config: NotificationConfig | string) => void;
    destroy: (key?: string) => void; // no arg → close ALL toasts
}
```

```tsx
import { Notification, Button } from 'animal-island-ui';

// 1) String shortcut
Notification.success('保存成功!');
Notification.error('网络请求失败');

// 2) Object form with description
Notification.info({
    message: '系统通知',
    description: '今天有流星雨,记得晚上 8 点去海滩许愿。',
});

// 3) Six positions
Notification.warning({ message: '顶部居中', position: 'top' });
Notification.warning({ message: '右下角', position: 'bottomRight' });

// 4) Manual dismiss / no auto-close
Notification.info({ message: '常驻通知', duration: 0, btn: <Button size="small">接受</Button> });

// 5) Live update via shared key (e.g. upload progress)
//    同 key 走"原地更新"分支;闭包 dismissed 跟踪用户是否主动关闭。
//    关键:dismissed 必须"点 × 瞬间"置 true,不能等 onClose 退场动画结束 (250ms),
//    否则在 (click, 退场结束) 区间内排队的 setTimeout 仍会触发 open,
//    把 leaving 态的同 key 通知原地更新复活。closeIcon 的 onClick 同步触发,
//    先于父 button 的 handleCloseClick,setLeaving 之前就把 dismissed 置位。
{
    const uploadKey = 'upload';
    let dismissed = false;
    const markDismissed = () => { dismissed = true; };
    const open = (percent, type = 'info', duration = 0) => {
        if (dismissed) return;
        Notification.info({
            message: percent === 100 ? `上传完成 ${percent}%` : `上传中... ${percent}%`,
            key: uploadKey,
            type,
            duration,
            closeIcon: <span onClick={markDismissed}>×</span>,
            onClose: () => { dismissed = true; },
        });
    };
    open(0);
    setTimeout(() => open(50), 300);
    setTimeout(() => open(100, 'success', 3), 600);
}

// 6) Clickable toast
Notification.success({
    message: '点击我',
    description: '点击通知本体可触发 onClick',
    onClick: () => console.log('clicked'),
});

// 7) Global destroy
Notification.destroy(); // close all
Notification.destroy('upload'); // close by key
```

Notes:

- **Imperative only.** There is no `<Notification>` JSX element — do not try to use one. All interaction goes through the static methods.
- **`config` accepts a plain string** as shorthand for `{ message: <string> }`. The other 12 fields are dropped in that case.
- **Default position is `top` (top-center)**. Pass `position` to use one of the 6 slots. Top/bottom placement groups are independent — toasts at the same position stack vertically, with the latest on top (for `top*`) or bottom (for `bottom*`).
- **Default `duration` is 4.5s.** Pass `0` to disable auto-close (toast persists until the user clicks × or `destroy` is called). The leave animation is `~250ms`.
- **Re-calling with the same `key` UPDATES** the in-place toast (used for upload progress / streaming status). Without `key`, each call appends a new toast.
- **User-dismissed toasts re-create on the next same-key call** (the `key` no longer exists in the store after close). If you want the dismiss to suppress future updates — typical for upload progress — gate subsequent calls behind a closure flag set inside `onClose` **AND** a `closeIcon` `onClick` that sets the same flag synchronously. The `onClose` path alone fires only after the 250ms leave animation, leaving a race window where queued `setTimeout` calls can still re-create the toast (see example 5).
- **`Notification.destroy()`** with no argument closes every active toast. With a `key` argument it closes only that one. Both paths fire `onClose` for each removed item (synchronously, with no leave animation) — this is the same contract as the user-click and duration-expire paths, so closure-based suppression flags (e.g. `dismissed` in upload progress) work consistently across all three close paths.
- **`onClick` upgrades the toast to a button** (`role="button"`, `tabIndex={0}`) — Enter / Space trigger `onClick`. The close × button has its own `stopPropagation` so it won't fire `onClick` on the parent.
- **Type determines default icon + accent color**: success = green `#6fba2c`, info = mint `#19c8b9`, warning = yellow `#f5c31c`, error = red `#e05a5a`. Pass `icon` to override.
- **Lifecycle**: first call lazily creates a single React root on `document.body` (`data-animal-notification-root`); the root stays mounted between toasts and re-renders on every store change via `useSyncExternalStore`. There is exactly one root per page regardless of toast count.
- **No CSS import required separately** — the root + per-type styles are bundled with the component. `import 'animal-island-ui/style'` is still required for the rest of the library.

---

### 1.28 Progress

A horizontal progress bar whose fill reuses the **Button loading** stripe pattern. The track uses the **page background** color (`#f8f8f0`, same as `--animal-bg`) so the bar visually blends into the parchment page; a very light `#e8dcc8` border + soft inner dent provide just enough structural definition without visual weight. The fill is a teal `-45°` striped ribbon (`#0ec4b6` / `#01b0a7`) that scrolls infinitely from right to left, just like the Button's loading state. The percent label can be displayed **inside the fill** (default, white), **to the right**, or **on top** of the bar.

```ts
type ProgressSize = 'small' | 'middle' | 'large';
type ProgressInfoPosition = 'inside' | 'right' | 'top';

interface ProgressProps {
    percent: number; // REQUIRED, 0-100, clamped; non-integer rounded for aria
    size?: ProgressSize; // default 'middle' (small=12px, middle=20px, large=28px)
    showInfo?: boolean; // default true
    infoPosition?: ProgressInfoPosition; // default 'inside'
    infoFormat?: (percent: number) => React.ReactNode; // default `${percent}%`
    duration?: number; // fill WIDTH transition in seconds; 0 disables; default 0.6 — does NOT affect stripe scroll
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
import { Progress } from 'animal-island-ui';

// 1) Basic — 25 / 50 / 75 / 100
<Progress percent={50} />

// 2) Sizes
<Progress percent={50} size="small" />
<Progress percent={50} size="large" />

// 3) Label position
<Progress percent={45} infoPosition="inside" /> {/* default — text floats with fill */}
<Progress percent={45} infoPosition="right" /> {/* text on the right side */}
<Progress percent={45} infoPosition="top" /> {/* text above the bar */}

// 4) Custom format (e.g. "5/10 任务")
<Progress
    percent={50}
    infoFormat={(p) => `${Math.round(p / 10)} / 10`}
/>

// 5) No fill-width animation (stripe scroll keeps going)
<Progress percent={pct} duration={0} />

// 6) Hide the percent label
<Progress percent={66} showInfo={false} />
```

Notes:

- **Always provide `percent`.** Out-of-range values are clamped to `[0, 100]`. NaN is treated as `0`. The aria value is rounded.
- **Default `infoPosition="inside"`** — the label rides at the right edge of the fill. If `percent < 18`, the label is **automatically moved outside** the fill (track-end, dark text) to keep white text readable on the sandy track. This is the only "magic" behavior; everything else is purely declarative.
- **Fill color is fixed** (the same teal stripe as `Button` loading) — there is no `status` / `strokeColor` / `leafAnimated` prop. The intent is to keep a single, recognizable "in-progress" visual across the library.
- **Two independent animations**:
  1. Fill **width** transitions on `percent` change (`duration` prop, default 0.6s, set `0` to disable). Uses `cubic-bezier(0.4, 0, 0.2, 1)`.
  2. Stripe **background-position** scrolls infinitely from `0 0` to `-28.28px 0` over 1s linear (matches Button loading 1:1). Disabled only under `prefers-reduced-motion: reduce`.
- **Accessibility**: the root has `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<rounded percent>`, and `aria-valuetext` set to the rendered text when it's a string.

---

### 1.29 BackTop

A floating back-to-top button that appears in the bottom-right corner after scrolling past a threshold. The default icon is a Island bag PNG (base64-embedded). Clicking triggers a smooth scroll to the top with an easeInOutQuad animation.

```ts
interface BackTopProps {
    target?: () => HTMLElement | Window; // default () => window
    visibilityHeight?: number;           // default 400 (px)
    duration?: number;                   // scroll animation ms, default 300
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
import { BackTop } from 'animal-island-ui';

// Default — Island bag icon, 400px threshold, smooth scroll
<BackTop />

// Custom container
<div ref={ref} style={{ height: 300, overflow: 'auto' }}>
    <BackTop target={() => ref.current!} visibilityHeight={200} />
</div>

// Longer animation
<BackTop duration={800} />
```

Notes:
- **Default target is `window`** — works out of the box for page-level scrolling. Pass `target` for a custom scroll container.
- **Mobile responsive**: icon shrinks from 120px to 80px under 768px viewport.
- **A11y**: `role="button"`, `tabIndex={0}`, `aria-label="返回顶部"`. Enter/Space trigger the scroll.

---

### 1.30 Skeleton

Loading placeholder that renders gray/beige blocks with a shimmer animation. Supports multiple variants: `text`, `circle`, `rect`, and `paragraph`. When `loading` is `false`, children are rendered directly.

```ts
type SkeletonVariant = 'text' | 'circle' | 'rect' | 'paragraph';

interface SkeletonProps {
    loading?: boolean;           // default true
    variant?: SkeletonVariant;   // default 'text'
    active?: boolean;            // shimmer animation, default true
    rows?: number;               // for 'paragraph', default 3
    width?: number | string;     // for 'text'/'circle'/'rect'
    rowWidths?: (number | string)[]; // for 'paragraph', per-line widths
    widthValue?: number | string;    // for 'circle'/'rect'
    heightValue?: number | string;   // for 'circle'/'rect'
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;  // rendered when loading=false
}

// Sub-components
interface SkeletonButtonProps { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonInputProps  { size?: 'small' | 'middle' | 'large'; active?: boolean; }
interface SkeletonAvatarProps { size?: 'small' | 'middle' | 'large'; shape?: 'circle' | 'square'; active?: boolean; }
```

```tsx
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from 'animal-island-ui';

// Text / circle / rect / paragraph
<Skeleton variant="text" width="80%" />
<Skeleton variant="circle" widthValue={44} />
<Skeleton variant="rect" widthValue={200} heightValue={120} />
<Skeleton variant="paragraph" rows={4} />

// Sub-components
<SkeletonButton size="middle" />
<SkeletonInput size="large" />
<SkeletonAvatar size="small" shape="square" />

// loading mode
<Skeleton loading={fetching}>
    <div>Content loaded</div>
</Skeleton>
```

Notes:
- **Shimmer**: a warm-ivory `linear-gradient(90deg, transparent, rgba(255,252,235,0.18), rgba(255,252,242,0.55), ...)` sweeps left-to-right over 1.6s.
- **Shapes**: `circle` is 50% rounded; `rect` uses 18px radius; `text` uses 12px radius (matching the "no sharp corners" rule).
- **All sub-components** (`SkeletonButton`, `SkeletonInput`, `SkeletonAvatar`) share the same `active` shimmer and light-beige background.
- **A11y**: the skeleton root is marked `aria-hidden` to hide it from screen readers when `loading=true`.

---

## 2. Common Recipes

### 2.1 Form row

```tsx
<Card>
    <label>Email</label>
    <Input size="large" type="email" allowClear status={invalid ? 'error' : undefined} />
    <Switch checkedChildren="Subscribe" unCheckedChildren="Off" />
    <Button type="primary" htmlType="submit" block>
        Submit
    </Button>
</Card>
```

### 2.2 Confirm dialog

```tsx
<Modal
    open={open}
    title="Delete save file?"
    onClose={close}
    onOk={() => {
        remove();
        close();
    }}
    footer={
        <>
            <Button onClick={close}>Cancel</Button>
            <Button
                type="primary"
                danger
                onClick={() => {
                    remove();
                    close();
                }}
            >
                Delete
            </Button>
        </>
    }
>
    This cannot be undone.
</Modal>
```

### 2.3 FAQ page

```tsx
<Cursor>
    <Title size="large">FAQ</Title>
    <Divider type="wave-yellow" />
    {faqs.map((f) => (
        <Collapse key={f.id} question={f.q} answer={f.a} />
    ))}
    <Footer type="sea" />
</Cursor>
```

### 2.4 Game-style intro

```tsx
<Modal open={open} onClose={close} typewriter typeSpeed={60}>
    Welcome to Animal Island! Press <strong>OK</strong> to begin.
</Modal>
```

---

## 3. HARD RULES for AI code generation

Follow these strictly; violations are bugs:

1. **Import style only once**: `import 'animal-island-ui/style';` at app entry. Do not re-import per component.
2. **Do NOT invent props.** Every prop used must appear verbatim in section 1. No `variant`, `shape`, `rounded`, `theme`, `color="primary"` etc. unless listed.
3. **`Modal.open` is required**; always provide a matching `onClose` or the dialog cannot be dismissed by user.
4. **`Collapse.question` and `Collapse.answer` are required.**
5. **Button `type`** values are `primary | default | dashed | text | link` — NOT `secondary`, `outline`, `ghost`. Use `ghost` prop for ghost styling.
6. **Switch `size`** is `'small' | 'default'` (NOT `'middle' | 'large'`). Diverges from Button/Input sizing.
7. **Card `color`** must be one of the 13 listed `CardColor` values. Do not pass hex codes. `type` is `'default' | 'dashed'` ONLY — `'title'` was removed; use `<Title>` (§ 1.6) instead. `pattern` accepts `'none'` or any of the 13 `CardColor` values.
8. **Divider / Footer / Phone / Time / Cursor have NO design-token props** (no `color`, `size`, `theme`, etc.) beyond what's listed in §§ 1.8–1.12. `className` and `style` are accepted only for layout adjustments (margin, position, opacity); never use them to override colors / radii / shadows — recolor via CSS targeting the className instead.
9. **Typewriter emits no wrapper element.** Do not rely on a DOM node to style it — style the children instead.
10. **Icon `name` must be one of the 10 `IconName` values.** Do not pass arbitrary strings, URLs, or React nodes — only the built-in catalogue is supported.
11. **Select is controlled-only.** `options`, `value`, `onChange` are ALL required. Never omit `onChange` or pass `defaultValue`.
12. **Checkbox `size`** is `'small' | 'middle' | 'large'` (aligned with Button/Input — NOT with Switch). `options` is required; values can be `string | number`. No indeterminate state.
13. **CodeBlock** only highlights JSX/TS — do not pass Python/SQL/shell expecting language-specific coloring. There is no `language` prop.
14. **Do NOT import from deep paths** (`animal-island-ui/lib/...`, `animal-island-ui/src/...`). Only the package root and `animal-island-ui/style` are public.
15. **TypeScript**: always import types from the package root, not from internal files.
16. **Controlled vs uncontrolled**: `Switch`/`Input`/`Checkbox`/`Radio` support both. If you pass `checked`/`value`, you must also pass `onChange`.
17. **Design tokens (colors, radii, shadows) are NOT exposed as CSS custom properties.** To match the design elsewhere, hard-code values from `SKILL.md` / `DESIGN_PROMPT.md`.
18. **Never use `style={{ borderRadius: 0 }}` or force sharp corners on any interactive element** — it breaks the design language.
19. **Never override the 3D bottom shadow on Button(primary/danger-primary)** — it is the core identity. Switch uses an inset shadow on the track only (no outer 3D shadow). Input's 3D shadow is opt-in via `shadow={true}` and defaults to off; do not force it on.
20. **Tooltip `children` must be a single React element** that accepts event/ref props — never a string, fragment, or array. Use a `<span>` wrapper if you need to tooltip raw text.
21. **Radio is single-select; values are `string | number`.** Mirrors `Checkbox` API (options, size, direction) but `value` / `onChange` are scalars, not arrays.
22. **Loading takes no content props** — it's a self-contained scene. Use `active` to fade in/out, do not pass `children`.
23. **Title replaces `Card type="title"`.** Use `<Title size color>` for chapter/section headings (ribbon banner with swallowtail clip-path); do not try to recreate it on a `Card`.
24. **Watch the `title` prop collision.** `<Modal title=…>` takes a `ReactNode` for its internal heading slot — this is NOT the `<Title>` component (§ 1.6). When you mean the ribbon-banner component, write `<Title>...</Title>` as a child. Do not pass a `<Title>` element to `Modal.title` (it works but doubles up font weight) — pass plain text instead.

25. **Do NOT use emoji as UI icons.** Never replace UI icons with emoji (🌊 🎨 🌳 ✨ 🚀 etc.) — emoji rendering varies across platforms (color temperature, style, weight) and cannot guarantee visual consistency. Use the built-in `<Icon>` component instead.

26. **Always prefer `<Icon>` for icons.** Do NOT use Unicode symbols (✓ ✕ ✗ → ←), raw inline SVG, or third-party icon libraries. `<Icon>` supports 10 built-in icons via `<Icon name="..." />` (see § 1.15). If the icon you need is not in the built-in list, use CSS/HTML decorative elements instead — never hard-code SVG.

---

## 4. Where to read more

Shipped inside the npm package (available under `node_modules/animal-island-ui/`):

- `AI_USAGE.md` — this file (AI-optimized API reference for all 24 components + 3 companion exports FormItem / useForm / ICON_LIST)
- `README.md` — project overview & screenshots
- `dist/types/index.d.ts` — machine-readable TypeScript types for every exported component / prop / enum

Repo-only (NOT published to npm — read on GitHub):

- `skill/SKILL.md` — exhaustive style spec, every hex / px / keyframe for each component
- `DESIGN_PROMPT.md` — prompts for v0 / Figma AI / MJ / DALL-E
- GitHub: https://github.com/guokaigdg/animal-island-ui

**When to use which:** API shape / legal prop values → this file. Pixel-exact CSS (sizes, shadows, animations) → `SKILL.md`. Feeding another design AI → `DESIGN_PROMPT.md`.

---

## 5. Minimal boilerplate (copy-paste-ready)

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'animal-island-ui/style';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

```tsx
// App.tsx
import { Cursor, Button, Card, Input, Footer, Title } from 'animal-island-ui';

export default function App() {
    return (
        <Cursor>
            <main style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
                <Title size="large">Animal Island</Title>
                <Card>
                    <Input placeholder="What's on your mind?" allowClear />
                    <Button type="primary" block style={{ marginTop: 16 }}>
                        Post
                    </Button>
                </Card>
            </main>
            <Footer type="sea" />
        </Cursor>
    );
}
```
