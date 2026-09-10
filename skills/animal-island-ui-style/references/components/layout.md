# Layout components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Card

```ts
type CardType = 'default' | 'dashed';

type CardColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';
type CardPattern = 'none' | CardColor; // decorative overlay; same 13 values as CardColor

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: CardType; // default 'default'
    color?: CardColor; // default 'default'
    pattern?: CardPattern; // default 'none'
    hoverable?: boolean; // default false (no hover); true → cursor pointer + translateY(-2px) on hover
    children?: React.ReactNode;
}
```

Color → background / text: `default` rgb(247,243,223) / #725d42, `app-pink` #f8a6b2 / #fff, `purple` #b77dee / #fff, `app-blue` #889df0 / #fff, `app-yellow` #f7cd67 / #725d42, `app-orange` #e59266 / #fff, `app-teal` #82d5bb / #fff, `app-green` #8ac68a / #fff, `app-red` #fc736d / #fff, `lime-green` #d1da49 / #3d5a1a, `yellow-green` #ecdf52 / #725d42, `brown` #9a835a / #fff, `warm-peach-pink` #e18c6f / #fff.

```tsx
<Card>Default parchment card (read-only, no hover)</Card>
<Card hoverable>Interactive card (hover lifts -2px, cursor pointer)</Card>
<Card type="dashed">Draft / empty-state container</Card>
<Card color="app-yellow">Notification</Card>
<Card color="app-blue" pattern="app-pink">With decorative pattern overlay</Card>
```

Need a chapter/section heading? Use `<Title>` (ribbon banner). `Card type="title"` does not exist.

## Title

```ts
type TitleSize = 'small' | 'middle' | 'large';

type TitleColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

interface TitleProps {
    children: React.ReactNode; // REQUIRED
    size?: TitleSize; // default 'middle'
    color?: TitleColor; // default 'default'
    variant?: 'layer' | 'ribbon' | 'tab'; // default 'layer'
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Title>Chapter One</Title>
<Title size="large" color="app-yellow">Notification</Title>
<Title variant="layer" color="app-blue">Layer note</Title>
<Title variant="tab" color="lime-green">Corner tab</Title>
```

Renders an island-style ribbon banner (swallowtail clip-path ends + fold-shadow triangles + raised front). Uses the same 13 island palette as `Card.color`; `size` scales the whole ribbon via `em` units (small 14px / middle 20px / large 28px base). `variant` picks a same-family decoration that shares the `--rf / --rb / --rk / --rt` palette: `layer` (default, double-layer note: back sheet offset upper-left), `ribbon` (banner), or `tab` (corner tab: 135° gradient corner cut + dark fold triangle); every `.color-*` override applies equally to all three.

**Not supported:** no `level` (`h1..h6`) — renders as an inline-block `<div>`; no `bordered`; no `code` / `mark` / `underline` / `delete` modifiers (this is a decorative banner, NOT a generic typography-heading component).

## Divider

```ts
type DividerType =
    | 'dashed-brown'
    | 'dashed-teal'
    | 'dashed-white'
    | 'dashed-yellow';

interface DividerProps {
    type?: DividerType; // default 'dashed-brown'
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Divider />
<Divider type="dashed-teal" />
```

Height fixed at 12px. Purely decorative dashed rule drawn with `linear-gradient` (12px rhythm, 50% on / 50% off) — no image assets. No `orientation` / `dashed` / `plain` / children — for a vertical separator, use a CSS `border-left` on adjacent elements.

## Background

```ts
type BackgroundType = 'default' | 'dots-dark-green' | 'sprinkles'
    | 'dots-pink' | 'dots-purple' | 'dots-blue' | 'dots-yellow' | 'dots-orange' | 'dots-teal'
    | 'dots-green' | 'dots-red' | 'dots-lime-green' | 'dots-yellow-green' | 'dots-brown' | 'dots-warm-peach-pink';

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: BackgroundType; // default 'default'
    children?: React.ReactNode;
}
```

```tsx
<Background style={{ height: 200 }} />
<Background type="dots-dark-green" style={{ height: 200 }} />
<Background type="sprinkles" style={{ minHeight: 200, padding: 24 }}>
    <p>Content renders above the pattern</p>
</Background>
```

Full-bleed decorative wallpaper with zero image assets: `default` is cream `rgb(247,243,223)` with beige polka dots; `dots-dark-green` is a two-layer offset polka-dot pattern on green `#bfe3bf`; `sprinkles` scatters 6-color cylindrical candy sprinkles (capsule rods with highlight shading) on frosting `#fdf3e3` — three mutually-prime inline-SVG tiles make the scatter read as random with no visible repeat; the other 12 `dots-*` types are pastel polka wallpapers whose base color matches Card's `pattern-*` series (`dots-pink`, `dots-purple`, `dots-blue`, `dots-yellow`, `dots-orange`, `dots-teal`, `dots-green`, `dots-red`, `dots-lime-green`, `dots-yellow-green`, `dots-brown`, `dots-warm-peach-pink`). No fixed height — set `height` / `min-height` via `style`.

## Collapse

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

Uses a pure CSS grid-row transition — no JS height measurement, safe for SSR. Single panel only — no `accordion` / `items` group API; render multiple `<Collapse>` siblings if you need a list.

## Tabs

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
// Uncontrolled
<Tabs
    items={[
        { key: 'tab1', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
        { key: 'tab2', label: '昆虫', children: <p>蝴蝶、蜻蜓...</p> },
    ]}
    defaultActiveKey="tab1"
/>;

// Controlled
const [activeKey, setActiveKey] = useState('tab1');
<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />;
```

Supports both controlled and uncontrolled modes, with a smooth fade animation on tab switch.

**Not supported:** no `tabPosition` (always top), no `type="card"` / `type="editable-card"`, no `tabBarExtraContent`, no closable tabs.

## Carousel

```ts
interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
    children: React.ReactNode; // REQUIRED; each direct child is one slide
    activeIndex?: number;
    defaultActiveIndex?: number; // default 0
    onChange?: (index: number) => void;
    autoplay?: boolean; // default false
    interval?: number; // default 3000
    loop?: boolean; // default true
    showArrows?: boolean; // default true
    showDots?: boolean; // default true
    pauseOnHover?: boolean; // default true; focus also pauses
}
```

```tsx
<Carousel autoplay aria-label="岛屿照片">
    <img src="/beach.jpg" alt="海滩" />
    <img src="/plaza.jpg" alt="广场" />
</Carousel>
```

Supports controlled/uncontrolled indexes, CSS fade transitions, looping, arrows, dots and ArrowLeft/ArrowRight/Home/End navigation. Autoplay automatically renders a pause/resume control and pauses on hover/focus. Set a useful `aria-label`; every slide receives a position/count label automatically.
