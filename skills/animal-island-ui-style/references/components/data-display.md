# Data display components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Table

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

## CodeBlock

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
<CodeBlock code={src} style={{ borderRadius: 5, backgroundColor: '#242c46' }} />
```

> Renders a `<pre>` with built-in JSX/TS tokenizer. No `language` prop — always treated as JSX/TS. Default theme: bg `#2b2118`, border `1px solid #3d3028`, radius 20px, font-size 14, line-height 1.7. No copy button, no line numbers, no word-wrap.

## Tag

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

## Image

```ts
type ImageColor =
    | 'white'
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

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height' | 'onLoad' | 'onError'> {
    src: string; // REQUIRED
    alt?: string; // default '' — empty means decorative
    width?: number | string;
    height?: number | string;
    color?: ImageColor; // default 'white' — plain #fff; others are the Card pattern base colours (pastel, no dots)
    lazy?: boolean; // default false — maps to native loading="lazy"
    preview?: boolean; // default true — click opens a lightbox (ESC / mask / close button)
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}
```

```tsx
<Image src="/photo.png" alt="岛屿风景" width={200} height={150} />
<Image src="/photo.png" alt="纯白" color="white" />
<Image src="/photo.png" alt="粉色" color="app-pink" />
<Image src="/photo.png" alt="懒加载" lazy />
<Image src="/photo.png" alt="预览" width={200} height={130} preview />
<Image src="/broken.png" alt="失败" width={140} height={140} />
```

> Renders a `<img>` in a fixed mat frame (`#fff` plain background for `color="white"`; every other `color` is the Card `pattern` base colour — soft pastel, no dotted overlay — 12px padding so the image sits inset, 8px rounded corners, `0 8px 14px 0 rgba(0,0,0,0.08)` shadow, no border, `overflow: hidden` + `line-height: 0`). `width`/`height` apply to the frame while the image fills it at 100%. The image stays hidden (`opacity: 0`) until `onLoad` fades it in; on error it renders a built-in placeholder (`role="img"` + `aria-label`). With `preview` (on by default), the frame becomes a `<button>` and clicking opens a portaled lightbox (`role="dialog"` + `aria-modal`, name from `alt`) — close via ESC, the mask, or the top-right close button; focus is moved to the close button on open and restored on close.
