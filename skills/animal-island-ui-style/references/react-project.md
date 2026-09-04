# React project usage

Scenario: a real React project where `animal-island-ui` is (or can be) installed from npm.
For a no-build single HTML file, use [standalone-html.md](standalone-html.md) instead.

## Setup (once per project)

```bash
npm install animal-island-ui
```

```ts
// app entry (main.tsx / _app.tsx / App.tsx)
import 'animal-island-ui/style'; // MUST be imported before any component renders
// Fonts (Nunito / Noto Sans SC) are bundled via @fontsource — no Google Fonts link needed.
```

Peer requirements: `react >= 17`, `react-dom >= 17` (plus `classnames` as a peer dependency).
The build supports per-component tree-shaking — import from the package root only.

## Explore the real API before writing code

The installed package ships complete TypeScript declarations. They are the ground truth
for props, legal values, and defaults — prefer them over any document:

- Resolve the package's type entry from its `package.json` (`types` / `exports`), then read
  the exported component and prop types.
- The [components/](components/) reference files in this skill are quick per-category
  summaries of the same API — convenient, but the declarations win on any conflict.

## Minimal boilerplate

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

## Common recipes

Confirm dialog:

```tsx
<Modal open={open} title="Delete save file?" onClose={close}
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

FAQ page:

```tsx
<Cursor>
    <Title size="large">FAQ</Title>
    <Divider type="dashed-teal" />
    {faqs.map((f) => (
        <Collapse key={f.id} question={f.q} answer={f.a} />
    ))}
    <Footer type="sea" />
</Cursor>
```

Game-style intro:

```tsx
<Modal open={open} onClose={close} typewriter typeSpeed={60}>
    Welcome to Animal Island! Press <strong>OK</strong> to begin.
</Modal>
```

## Styling app-specific UI around the components

- Use the runtime tokens: `color: var(--animal-text-color)`, `background: var(--animal-bg-color)`,
  `border-radius: var(--animal-border-radius-lg)` etc., so custom layout stays on-palette.
- Theme by overriding `--animal-*` custom properties after `import 'animal-island-ui/style'`.
- Pixel-exact values (exact hex/px/keyframes, per-component CSS) live in the canonical
  design system:
  [design-tokens.md](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-tokens.md) ·
  [design-rules.md](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-rules.md) ·
  [components/](https://github.com/guokaigdg/animal-island-ui/tree/main/docs/design-system/components)

## Scenario-specific rules

- One `import 'animal-island-ui/style'` at the entry — never per component file.
- No deep imports (`animal-island-ui/lib/...`, `animal-island-ui/src/...`); public surface is
  the package root, `animal-island-ui/style`, and `animal-island-ui/items/*`.
- Import types from the package root (`import type { ButtonProps } from 'animal-island-ui'`).
- All hard rules from [SKILL.md](../SKILL.md) apply.
