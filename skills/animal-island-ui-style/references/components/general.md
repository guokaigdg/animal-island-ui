# General components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Button

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

```tsx
<Button type="primary" onClick={save}>Save</Button>
<Button type="primary" danger loading>Deleting…</Button>
<Button type="dashed" icon={<PlusIcon />} size="large" block>Add</Button>
<Button type="text">Cancel</Button>
```

## Icon (+ `ICON_LIST`)

```ts
import { Heart, type LucideIcon } from 'lucide-react';

type IconName =
    | 'icon-left'
    | 'icon-right'
    | 'location'
    | 'page'
    | 'wifi'
    | 'icon-shopping'
    | 'icon-chat'
    | 'icon-variant'
    | 'icon-encyclopedia'
    | 'icon-design'
    | 'icon-map'
    | 'icon-diy'
    | 'icon-camera';

interface IconProps {
    name?: IconName; // one of the 13 built-in semantic names (lucide icons)
    icon?: LucideIcon; // any lucide-react icon component — takes precedence over `name`
    src?: string; // any image URL for raster assets — renders a background-image span
    size?: number | string; // default 24 — applied to width & height
    color?: string; // lucide stroke color, default currentColor
    strokeWidth?: number | string; // lucide stroke weight, default 2
    className?: string;
    style?: React.CSSProperties;
    bounce?: boolean; // default false — adds hover bounce animation
}

// Runtime catalogue for dynamic rendering / pickers (length = 13):
declare const ICON_LIST: { name: IconName; label: string }[];
```

```tsx
<Icon name="wifi" size={32} />
<Icon icon={Heart} size={32} color="#c44" />
{ICON_LIST.map(({ name, label }) => <Icon key={name} name={name} />)}
```

Built on [lucide-react](https://lucide.dev/icons/) — stroke-based SVGs that scale cleanly. Use `size` (number = px, string = any CSS length); do NOT wrap in a sized div.

## Typewriter

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

Renders NO wrapper element; zero layout impact. Recursively truncates the ReactNode by char count while preserving tree structure.

## Cursor

```ts
interface CursorProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    type?: 'default' | 'raindrop'; // default 'default' — finger arrow / blue raindrop
    forceAll?: boolean; // default true — force the custom cursor on every descendant
}
```

Wrap the region where you want a game-style finger cursor:

```tsx
<Cursor>
    <App />
</Cursor>

{/* or a blue raindrop cursor */}
<Cursor type="raindrop">
    <App />
</Cursor>
```

With `forceAll` (default `true`) every descendant gets the custom cursor via `cursor: url(...) !important` (hotspot `6 4` for the arrow, `16 6` for the raindrop). Set `forceAll={false}` for scoped mode: only the container shows the custom cursor while links/buttons keep `pointer`, text inputs keep `text`, and disabled elements keep `not-allowed`. Do NOT nest multiple `<Cursor>`. `style` is for layout only — do not try to override the cursor URL via inline style.
