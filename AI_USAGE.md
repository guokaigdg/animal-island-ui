# animal-island-ui · AI Usage Guide (v0.9.5)

> **FOR AI CODE ASSISTANTS**: This file is the canonical, machine-readable reference for generating code that uses `animal-island-ui`. Prefer this file over any other source. Every prop / import / default below is copied verbatim from source. Do NOT invent props.

---

## 0. Setup (once per project)

```bash
npm install animal-island-ui
```

```ts
// app entry (main.tsx / _app.tsx / App.tsx)
import 'animal-island-ui/style';          // MUST import BEFORE any component usage
// Fonts (Nunito / Noto Sans SC) are auto-bundled via @fontsource.
```

```ts
// Peer requirements
react      >= 17.0.0
react-dom  >= 17.0.0
```

> Global aesthetics preset (warm-parchment + pill shapes + 3D button shadow) is applied via `animal-island-ui/style`. Design tokens (colors, radii, shadows) are baked into compiled CSS — they are NOT exposed as `--animal-*` custom properties for runtime override. If you need token consistency in surrounding code, copy the CSS-variable template from `skill/SKILL.md` § 5 (repo-only) and declare it yourself.

---

## 1. Full API (24 named exports)

All named exports from `animal-island-ui`:

```ts
import {
  Button, Input, Switch, Modal, Card, Title,
  Collapse, Cursor, Time, Phone, Footer, Divider,
  Typewriter, Tabs, Icon, Select, Checkbox, Radio,
  Tooltip, Loading, Table, CodeBlock,
  InvitationCard, InvitationCardExportButton,
} from 'animal-island-ui';

// Runtime value export (icon catalogue — 10 entries)
import { ICON_LIST } from 'animal-island-ui';

import type {
  ButtonProps, ButtonType, ButtonSize,
  InputProps, InputSize,
  SwitchProps, SwitchSize,
  ModalProps,
  CardProps, CardType, CardColor,
  TitleProps, TitleSize, TitleColor,
  CollapseProps,
  CursorProps,
  TimeProps,
  PhoneProps,
  FooterProps, FooterType,
  DividerProps,
  TypewriterProps,
  TabsProps, TabItem,
  IconProps, IconName,
  SelectProps, SelectOption,
  CheckboxProps, CheckboxOption, CheckboxSize,
  RadioProps, RadioOption, RadioSize,
  TooltipProps, TooltipPlacement, TooltipTrigger, TooltipVariant,
  LoadingProps,
  TableProps, TableColumn,
  CodeBlockProps,
  InvitationCardProps, InvitationCardRef,
  InvitationCardExportButtonProps,
} from 'animal-island-ui';
```

> Section order below mirrors the import grouping above: related components are adjacent (Title after Card, Radio after Checkbox).

---

### 1.1 Button

```ts
type ButtonType     = 'primary' | 'default' | 'dashed' | 'text' | 'link';
type ButtonSize     = 'small' | 'middle' | 'large';
type ButtonHTMLType = 'submit' | 'reset' | 'button';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;          // default 'default'
  size?: ButtonSize;          // default 'middle'
  danger?: boolean;           // default false
  ghost?: boolean;            // default false
  block?: boolean;            // default false
  loading?: boolean;          // default false — renders diagonal-stripe animation
  disabled?: boolean;         // default false
  icon?: React.ReactNode;
  htmlType?: ButtonHTMLType;  // default 'button'
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
  size?: InputSize;                  // default 'middle'
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;              // default false
  status?: 'error' | 'warning';
  shadow?: boolean;                  // default false — when true, render the 3D pixel-stack shadow
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
  checked?: boolean;                  // controlled
  defaultChecked?: boolean;           // default false
  size?: SwitchSize;                  // default 'default'
  disabled?: boolean;                 // default false
  loading?: boolean;                  // default false
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
  open: boolean;                       // REQUIRED
  title?: React.ReactNode;             // heading text — NOT the <Title> component (see § 1.6)
  width?: number | string;             // default 520
  maskClosable?: boolean;              // default true
  footer?: React.ReactNode | null;     // null = hide footer
  onClose?: () => void;
  onOk?: () => void;
  children?: React.ReactNode;
  className?: string;
  typeSpeed?: number;                  // default 80 (ms/char for built-in typewriter)
  typewriter?: boolean;                // default true — body plays typewriter on open
}
```

```tsx
const [open, setOpen] = useState(false);
<Modal
  open={open}
  title="Confirm"
  onClose={() => setOpen(false)}
  onOk={() => { submit(); setOpen(false); }}
>
  Proceed to delete this island?
</Modal>
```

Notes:
- Modal already ships the required SVG blob `<clipPath id="animal-modal-clip">` internally.
- To disable the typewriter animation for dynamic content: `typewriter={false}`.
- Custom footer: pass `footer={<><Button>...</Button></>}` or `footer={null}` to hide.
- `title` accepts a `ReactNode` — pass plain text. Do NOT pass `<Title>` here (see HARD RULE 24).

---

### 1.5 Card

```ts
type CardType  = 'default' | 'dashed';

type CardColor =
  | 'default'          // rgb(247,243,223) / #725d42 text
  | 'app-pink'         // #f8a6b2 / #fff
  | 'purple'           // #b77dee / #fff
  | 'app-blue'         // #889df0 / #fff
  | 'app-yellow'       // #f7cd67 / #725d42
  | 'app-orange'       // #e59266 / #fff
  | 'app-teal'         // #82d5bb / #fff
  | 'app-green'        // #8ac68a / #fff
  | 'app-red'          // #fc736d / #fff
  | 'lime-green'       // #d1da49 / #3d5a1a
  | 'yellow-green'     // #ecdf52 / #725d42
  | 'brown'            // #9a835a / #fff
  | 'warm-peach-pink'; // #e18c6f / #fff

// Decorative pattern overlay — 'none' or any of the 13 CardColor values.
type CardPattern =
  | 'none'
  | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow'
  | 'app-orange' | 'app-teal' | 'app-green' | 'app-red'
  | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CardType;        // default 'default'
  color?: CardColor;      // default 'default'
  pattern?: CardPattern;  // default 'none'
  children?: React.ReactNode;
}
```

```tsx
<Card>Default parchment card</Card>
<Card type="dashed">Draft / empty-state container</Card>
<Card color="app-yellow">Notification</Card>
<Card color="app-blue" pattern="app-pink">With decorative pattern overlay</Card>
```

> Need a chapter/section heading? Use the `<Title>` component (ribbon banner — see § 1.6). `Card type="title"` was removed.

---

### 1.6 Title

```ts
type TitleSize  = 'small' | 'middle' | 'large';
type TitleColor =
  | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow'
  | 'app-orange' | 'app-teal' | 'app-green' | 'app-red'
  | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

interface TitleProps {
  children: React.ReactNode;        // REQUIRED
  size?: TitleSize;                 // default 'middle'
  color?: TitleColor;               // default 'default'
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
> **Not supported:** no `level` (`h1..h6`) — renders as inline-block `<div>`; no `bordered`; no `code` / `mark` / `underline` / `delete` modifiers (this is NOT antd's `Typography.Title`).

---

### 1.7 Collapse

```ts
interface CollapseProps {
  question: React.ReactNode;   // REQUIRED — header
  answer: React.ReactNode;     // REQUIRED — body
  defaultExpanded?: boolean;   // default false
  disabled?: boolean;          // default false
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
<Time />   // auto-updates every second, shows weekday + date + clock
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
  type?: FooterType;          // default 'tree'
  seamless?: boolean;         // default false
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
type DividerType = 'line-brown' | 'line-teal' | 'line-white' | 'line-yellow' | 'wave-yellow'
                 | 'dashed-brown' | 'dashed-teal' | 'dashed-white' | 'dashed-yellow';

interface DividerProps {
  type?: DividerType;         // default 'line-brown'
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
  children?: React.ReactNode;   // ANY ReactNode — preserves element structure, classNames, inline styles
  speed?: number;                // ms per char, default 90
  trigger?: unknown;             // change this value to restart animation (e.g. modal openCount)
  autoPlay?: boolean;            // default true (false = show full immediately)
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
  items: TabItem[];           // REQUIRED
  defaultActiveKey?: string;  // default: first tab
  activeKey?: string;         // controlled mode
  onChange?: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  leafAnimation?: boolean;    // default true — active-tab leaf wiggle
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
/>

// Controlled mode
const [activeKey, setActiveKey] = useState('tab1');
<Tabs
  items={items}
  activeKey={activeKey}
  onChange={setActiveKey}
/>
```

> Supports both controlled and uncontrolled modes. Smooth fade animation on tab switch.
>
> **Not supported:** no `tabPosition` (always top), no `type="card"` / `type="editable-card"`, no `tabBarExtraContent`, no closable tabs.

---

### 1.15 Icon

```ts
type IconName =
  | 'icon-miles' | 'icon-camera' | 'icon-chat' | 'icon-encyclopedia'
  | 'icon-design' | 'icon-diy'    | 'icon-helicopter'
  | 'icon-map'   | 'icon-shopping' | 'icon-variant';

interface IconProps {
  name: IconName;                // REQUIRED — one of the 10 built-in SVG icons
  size?: number | string;        // default 24 — applied to width & height
  className?: string;
  style?: React.CSSProperties;
  bounce?: boolean;              // default false — adds hover bounce animation
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
  options: SelectOption[];                 // REQUIRED
  value: string;                           // REQUIRED — controlled-only
  onChange: (key: string) => void;         // REQUIRED
  placeholder?: string;                    // default '请选择'
  disabled?: boolean;                      // default false
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
/>
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
  disabled?: boolean;         // disable this option only
}

interface CheckboxProps {
  options: CheckboxOption[];                        // REQUIRED
  value?: Array<string | number>;                   // controlled
  defaultValue?: Array<string | number>;            // default []
  size?: CheckboxSize;                              // default 'middle'
  disabled?: boolean;                               // default false — disables all
  direction?: 'horizontal' | 'vertical';            // default 'horizontal'
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
  options: RadioOption[];                              // REQUIRED
  value?: string | number;                             // controlled
  defaultValue?: string | number;                      // uncontrolled
  size?: RadioSize;                                    // default 'middle'
  disabled?: boolean;                                  // default false — disables all
  direction?: 'horizontal' | 'vertical';               // default 'horizontal'
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
/>
```

> Implements WAI-ARIA roving tabindex (Arrow / Home / End keyboard navigation). Single-select counterpart to `Checkbox`.
>
> **Not supported:** no `optionType="button"`, no `buttonStyle`, no indeterminate, no nested groups, no per-`<Radio>` standalone form (the API is group-only via `options`).

---

### 1.19 Tooltip

```ts
type TooltipPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

type TooltipTrigger = 'hover' | 'focus' | 'click';
type TooltipVariant = 'default' | 'island';

interface TooltipProps {
  title: React.ReactNode;            // REQUIRED — tooltip body
  children: React.ReactElement;      // REQUIRED — single trigger element
  placement?: TooltipPlacement;      // default 'top'
  trigger?: TooltipTrigger;          // default 'hover'
  variant?: TooltipVariant;          // default 'default'
  bordered?: boolean;                // default true
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
  active?: boolean;             // default true
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
> **Not supported:** no `tip` / `text`, no `size`, no `spinning`, no `delay`, no `indicator`, no `children` (this is NOT antd's `Spin` — do not wrap content with it). Use it as a sibling overlay element controlled via `active`.

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
  columns?: TableColumn<T>[];                         // default []
  dataSource?: T[];                                   // default []
  rowKey?: string | ((record: T) => string);          // default 'key'
  striped?: boolean;                                  // default true
  showHeader?: boolean;                               // default true
  rowClassName?: string | ((record: T, index: number) => string);
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  loading?: boolean;                                  // default false
  emptyText?: React.ReactNode;                        // default '暂无数据'
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
  code: string;                // REQUIRED — raw source string
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

### 1.23 InvitationCard

```ts
interface InvitationCardRef {
  exportAsImage: (filename?: string) => Promise<void>;
  getElement: () => HTMLDivElement | null;
}

interface InvitationCardProps {
  groomName?: string;          // default '小狸'
  brideName?: string;          // default '小兔'
  date?: string;               // default '2026.06.15'
  weekday?: string;            // default '星期六'
  time?: string;               // default '10:00 AM'
  venue?: string;              // default '彩虹岛 · 樱花广场'
  address?: string;            // default '动物之森 · 无人岛 · K.K. 演奏台前'
  title?: React.ReactNode;     // default 'Wedding Invitation' — heading slot, NOT the <Title> component
  subtitle?: React.ReactNode;  // default <img/> built-in subtitle
  message?: React.ReactNode;   // default bilingual blessing text
  showLotteryNumber?: boolean; // default true
  lotteryNumber?: string;      // default '0001'
  lotteryLabel?: React.ReactNode;  // default 'LUCKY NUMBER'
  lotteryHint?: React.ReactNode;   // default bilingual hint
  className?: string;
  style?: React.CSSProperties;
}

// Companion export button
interface InvitationCardExportButtonProps extends ButtonProps {
  invitationRef: React.RefObject<InvitationCardRef>;
  filename?: string;           // default 'wedding-invitation.png'
}
```

```tsx
const ref = useRef<InvitationCardRef>(null);
<InvitationCard ref={ref} groomName="Kai" brideName="Lily" />
<InvitationCardExportButton invitationRef={ref}>导出 PNG</InvitationCardExportButton>
```

> `InvitationCard` is a `forwardRef` component. PNG export uses `modern-screenshot` with custom font injection. The companion export button accepts all `ButtonProps`. The `title` prop is plain heading text — NOT the `<Title>` ribbon component.

---

## 2. Common Recipes

### 2.1 Form row

```tsx
<Card>
  <label>Email</label>
  <Input size="large" type="email" allowClear status={invalid ? 'error' : undefined} />
  <Switch checkedChildren="Subscribe" unCheckedChildren="Off" />
  <Button type="primary" htmlType="submit" block>Submit</Button>
</Card>
```

### 2.2 Confirm dialog

```tsx
<Modal
  open={open}
  title="Delete save file?"
  onClose={close}
  onOk={() => { remove(); close(); }}
  footer={
    <>
      <Button onClick={close}>Cancel</Button>
      <Button type="primary" danger onClick={() => { remove(); close(); }}>Delete</Button>
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
  {faqs.map(f => <Collapse key={f.id} question={f.q} answer={f.a} />)}
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
24. **Watch the `title` prop collision.** `<Modal title=…>` and `<InvitationCard title=…>` both take a `ReactNode` for their internal heading slot — this is NOT the `<Title>` component (§ 1.6). When you mean the ribbon-banner component, write `<Title>...</Title>` as a child. Do not pass a `<Title>` element to `Modal.title` (it works but doubles up font weight) — pass plain text instead.

---

## 4. Where to read more

Shipped inside the npm package (available under `node_modules/animal-island-ui/`):

- `AI_USAGE.md` — this file (AI-optimized API reference for all 24 named exports — 23 components + 1 companion export button)
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
          <Button type="primary" block style={{ marginTop: 16 }}>Post</Button>
        </Card>
      </main>
      <Footer type="sea" />
    </Cursor>
  );
}
```
