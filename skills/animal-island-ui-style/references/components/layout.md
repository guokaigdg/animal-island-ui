# Layout components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Card

```ts
type CardType = 'default' | 'dashed';

type CardColor =
    | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal'
    | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink';

// Decorative pattern overlay — 'none' plus the same 13 values as CardColor.
type CardPattern = 'none' | CardColor;

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
    className?: string;
    style?: React.CSSProperties;
}
```

```tsx
<Title>Chapter One</Title>
<Title size="large" color="app-yellow">Notification</Title>
```

Renders an island-style ribbon banner (swallowtail clip-path ends + fold-shadow triangles + raised front). Uses the same 13 island palette as `Card.color`; `size` scales the whole ribbon via `em` units (small 14px / middle 20px / large 28px base).

**Not supported:** no `level` (`h1..h6`) — renders as an inline-block `<div>`; no `bordered`; no `code` / `mark` / `underline` / `delete` modifiers (this is a decorative ribbon banner, NOT a generic typography-heading component).

## Divider

```ts
type DividerType =
    | 'line-brown'
    | 'line-teal'
    | 'line-white'
    | 'line-yellow'
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
<Divider type="dashed-teal" />
```

Height fixed at 12px. Purely decorative band drawn with CSS gradients only (conic-gradient zigzag for `line-*`, linear-gradient dashes for `dashed-*`) — no image assets. No `orientation` / `dashed` / `plain` / children — for a vertical separator, use a CSS `border-left` on adjacent elements.

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
