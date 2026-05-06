# animal-island-ui · AI Usage Guide (v0.7.7)

> **FOR AI CODE ASSISTANTS**: This file is the canonical, machine-readable reference for generating code that uses `animal-island-ui`. Prefer this file over any other source. Every prop / import / default below is copied verbatim from source. Do NOT invent props.

---

## 0. Setup (once per project)

```bash
npm install animal-island-ui
```

```ts
// app entry (main.tsx / _app.tsx / App.tsx)
import 'animal-island-ui/style';          // MUST import BEFORE any component usage
// Fonts (Nunito / Noto Sans SC / Zen Maru Gothic) are auto-bundled via @fontsource.
```

```ts
// Peer requirements
react      >= 17.0.0
react-dom  >= 17.0.0
```

> Global aesthetics preset (warm-parchment + pill shapes + 3D button shadow) is applied via `animal-island-ui/style`. After import, regular HTML elements inherit `@font-family`, `--animal-*` tokens are NOT exposed globally — import Less variables from source only when extending.

---

## 1. Full API (17 components)

All named exports from `animal-island-ui`:

```ts
import {
  Button, Input, Switch, Modal, Card, Collapse,
  Cursor, Time, Phone, Footer, Divider, Typewriter,
  Icon, Select, Tabs, Checkbox, CodeBlock,
} from 'animal-island-ui';

// Runtime value export (icon catalogue — 10 entries)
import { ICON_LIST } from 'animal-island-ui';

import type {
  ButtonProps, ButtonType, ButtonSize,
  InputProps, InputSize,
  SwitchProps, SwitchSize,
  ModalProps,
  CardProps, CardType, CardColor,
  CollapseProps,
  CursorProps,
  TimeProps,
  PhoneProps,
  FooterProps, FooterType,
  DividerProps,
  TypewriterProps,
  IconProps, IconName,
  SelectProps, SelectOption,
  TabsProps, TabItem,
  CheckboxProps, CheckboxOption, CheckboxSize,
  CodeBlockProps,
} from 'animal-island-ui';
```

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
  title?: React.ReactNode;
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

---

### 1.5 Card

```ts
type CardType  = 'default' | 'title' | 'dashed';

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

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CardType;     // default 'default'
  color?: CardColor;   // default 'default'
  children?: React.ReactNode;
}
```

```tsx
<Card>Default parchment card</Card>
<Card type="title">Chapter One</Card>
<Card type="dashed">Draft / empty-state container</Card>
<Card color="app-yellow">Notification</Card>
```

---

### 1.6 Collapse

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

> Uses pure CSS grid-row transition — no JS height measurement, safe for SSR.

---

### 1.7 Cursor

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

> Applies `cursor: url(...) 4 0, auto !important` to `*` descendants. Do NOT nest multiple `<Cursor>`.

---

### 1.8 Time

```ts
interface TimeProps {
  className?: string;
}
```

```tsx
<Time />   // auto-updates every second, shows weekday + date + clock
```

No configurable props — it is a self-contained HUD widget.

---

### 1.9 Phone (decorative IslandPhone)

```ts
interface PhoneProps {
  className?: string;
}
```

```tsx
<Phone />
```

> Fixed size 527×788px. A decorative showcase widget: 3×3 app grid + live AM/PM clock + blinking colon + hover icon bounce. Not configurable beyond className.

---

### 1.10 Footer

```ts
type FooterType = 'sea' | 'tree';

interface FooterProps {
  type?: FooterType;          // default 'tree'
  className?: string;
  style?: React.CSSProperties;
}
```

```tsx
<Footer />              {/* forest silhouette, 60px tall — default */}
<Footer type="sea" />   {/* ocean wave, 80px tall */}
```

---

### 1.11 Divider

```ts
type DividerType = 'line-brown' | 'line-teal' | 'line-white' | 'line-yellow' | 'wave-yellow';

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

> Height is fixed 12px. Purely decorative background-image band.

---

### 1.12 Typewriter

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

### 1.13 Tabs

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

---

### 1.14 Icon

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

### 1.15 Select

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

---

### 1.16 Checkbox

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

> Group-level `disabled` disables every item. Per-option `disabled` disables a single row. Checked box fills with `#19c8b9`. No indeterminate state.

---

### 1.17 CodeBlock

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

> Renders a `<pre>` with built-in JSX/TS tokenizer. No language prop — always treated as JSX/TS. Not intended for non-JS languages. Default theme: bg `#2b2118`, border `1px solid #3d3028`, radius 20px, font-size 14, line-height 1.7.

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
  <h1>FAQ</h1>
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
7. **Card `color`** must be one of the 13 listed `CardColor` values. Do not pass hex codes. `type` is `'default' | 'title' | 'dashed'` — no other values.
8. **Divider / Footer / Phone / Time / Cursor** accept no style-modifying props beyond `className` (and `type` where listed). For custom color/size, wrap/override via CSS targeting `className`.
9. **Typewriter emits no wrapper element.** Do not rely on a DOM node to style it — style the children instead.
10. **Icon `name` must be one of the 10 `IconName` values.** Do not pass arbitrary strings, URLs, or React nodes — only the built-in catalogue is supported.
11. **Select is controlled-only.** `options`, `value`, `onChange` are ALL required. Never omit `onChange` or pass `defaultValue`.
12. **Checkbox `size`** is `'small' | 'middle' | 'large'` (aligned with Button/Input — NOT with Switch). `options` is required; values can be `string | number`. No indeterminate state.
13. **CodeBlock** only highlights JSX/TS — do not pass Python/SQL/shell expecting language-specific coloring. There is no `language` prop.
14. **Do NOT import from deep paths** (`animal-island-ui/lib/...`, `animal-island-ui/src/...`). Only the package root and `animal-island-ui/style` are public.
15. **TypeScript**: always import types from the package root, not from internal files.
16. **Controlled vs uncontrolled**: `Switch`/`Input`/`Checkbox` support both. If you pass `checked`/`value`, you must also pass `onChange`.
17. **Design tokens (colors, radii, shadows) are NOT exposed as CSS custom properties.** To match the design elsewhere, hard-code values from `SKILL.md` / `DESIGN_PROMPT.md`.
18. **Never use `style={{ borderRadius: 0 }}` or force sharp corners on any interactive element** — it breaks the design language.
19. **Never override the 3D bottom shadow on Button/Input/Switch** — it is the core identity.

---

## 4. Where to read more

Shipped inside the npm package (available under `node_modules/animal-island-ui/`):

- `AI_USAGE.md` — this file (AI-optimized API reference for all 17 components)
- `README.md` — project overview & screenshots
- `dist/types/index.d.ts` — machine-readable TypeScript types for every exported component / prop / enum

Repo-only (NOT published to npm — read on GitHub):

- `skill/SKILL.md` — exhaustive style spec, every hex / px / keyframe for each of the 17 components
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
import { Cursor, Button, Card, Input, Footer } from 'animal-island-ui';

export default function App() {
  return (
    <Cursor>
      <main style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
        <Card type="title">Animal Island</Card>
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
