# Component Development

This is the end-to-end workflow for adding a component or changing an existing one. It stays at the structural level:
individual component props live in `skills/animal-island-ui-style/references/components/*.md`, and individual component
pixel specs live in [../design-system/components/](../design-system/components/). Never duplicate either here.

## Workflow

1. Create `src/components/<ComponentName>/` containing:
    - `<ComponentName>.tsx` — implementation
    - `<component>.module.less` — styles (lowercase-hyphen filename, e.g. `button.module.less`)
    - `index.ts` — export entry
    - `<ComponentName>.test.tsx` — unit test, colocated
2. Re-export the value and the types from `src/index.ts`.
3. Register the demo — four places, see [Demo registration](#demo-registration).
4. Sync documentation — see [Documentation sync](#documentation-sync).
5. Run `npm run ci` before committing.

## File Layout

```
src/components/MyComponent/
├── MyComponent.tsx          # component logic (must set displayName)
├── myComponent.module.less  # CSS Modules styles
└── index.ts                 # single export entry
```

Every component in this repository also ships `MyComponent.test.tsx` in the same directory; treat it as part of the
required layout rather than an optional extra.

## Implementation Conventions

- Function components typed as `React.FC<Props>`; the props interface is named `<Name>Props` and exported with
  `export type`.
- Default values go in the destructuring pattern. Do not use `defaultProps`.
- Compose class names with `classnames` (a peerDependency) or the
  `[styles.a, cond && styles.b].filter(Boolean).join(' ')` pattern.
- Set `displayName` on every component.
- Extend the matching native element attributes and `Omit` the fields you redefine, e.g.
  `extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>`.
- JSDoc each prop on the line above it. Chinese comments are the house style.
- Stateful components support both controlled (`value`) and uncontrolled (`defaultValue`) usage.
- Styles follow [../design-system/design-rules.md](../design-system/design-rules.md) — interaction states, focus colors,
  shadows, radii, and motion are defined there, not decided per component.

## Code Skeleton

`<ComponentName>.tsx`:

```tsx
import React from 'react';
import styles from './component.module.less';

export type FooSize = 'small' | 'middle' | 'large';

export interface FooProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    /** 尺寸 */
    size?: FooSize;
    /** 禁用 */
    disabled?: boolean;
    children?: React.ReactNode;
}

export const Foo: React.FC<FooProps> = ({ size = 'middle', disabled = false, className, children, ...rest }) => {
    const classNames = [styles.foo, styles[`foo-${size}`], disabled && styles['foo-disabled'], className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} aria-disabled={disabled || undefined} {...rest}>
            {children}
        </div>
    );
};

Foo.displayName = 'Foo';
```

`index.ts`:

```ts
export { Foo } from './Foo';
export type { FooProps, FooSize } from './Foo';
```

## Barrel Export

Append to `src/index.ts`:

```ts
// 方式 A：组件用 default export
export { default as MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent/MyComponent';

// 方式 B：组件用 named export（如 Checkbox / CodeBlock / Select / Icon / Tabs 当前采用）
export { MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent';
```

Both styles coexist in the repository; pick either one for a new component as long as `src/index.ts` re-exports it
successfully. Values must use `export {}` and types must use `export type {}` — `isolatedModules` requires the split.

## Naming

- Component files and exports: PascalCase (`Button.tsx`, `Button`).
- Style files: lowercase with hyphens (`button.module.less`, `back-top.module.less`).
- CSS Module class names: kebab-case (`.btn-primary`); `localsConvention: 'camelCase'` also exposes them as
  `styles.btnPrimary`.
- Type aliases: PascalCase (`ButtonType`, `ButtonSize`).

## Demo Page

Each component gets a demo at `demo/components/<ComponentName>/index.tsx` with a default export. Shared building blocks
come from `demo/tools`: `CodeBlock`, `ApiTable` (takes `rows: ApiRow[]`), `DemoTag`, `useIsMobile`, and the section
style objects.

```tsx
import React from 'react';
import { MyComponent } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, sectionStyle, sectionTitleStyle } from '../../tools';

const MY_COMPONENT_API: ApiRow[] = [
    { prop: 'size', desc: '尺寸', type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
];

export default function MyComponentDemo() {
    return (
        <div>
            <section style={sectionStyle}>
                <div style={sectionTitleStyle}>基础用法</div>
                <MyComponent size="large">内容</MyComponent>
            </section>
            <CodeBlock code={`<MyComponent size="large">内容</MyComponent>`} />
            <ApiTable rows={MY_COMPONENT_API} />
        </div>
    );
}
```

The demo site is Chinese-facing; keep demo copy in Chinese to match the surrounding pages.

## Demo Registration

A demo page is only reachable once its key is registered in all four places. They are independent literals — nothing
derives one from another.

1. `demo/App.tsx` → `MENU_ITEMS`: add `{ key, label }` under the right category, otherwise the sidebar has no entry.
2. `demo/pageInfo.ts` → `PAGE_INFO[key] = { title, desc }`: drives the main-area heading and the mobile top bar.
3. `demo/ComponentPage.tsx` → import the demo component and add `PAGES[key]`: mounts the page body.
4. `demo/HomePage.tsx` → the `components` array: the card on the home page.

Diagnostic tip: `ComponentPage` returns `null` when either `PAGES[activeKey]` or `PAGE_INFO[activeKey]` is missing
(`demo/ComponentPage.tsx:108`). So if the menu item highlights but the main area stays blank, the first thing to check
is whether the key exists in both `PAGES` and `PAGE_INFO` — not the component code. `npm run check:docs` does not cover
demo registration; this check is manual.

## Documentation Sync

| Change                                | Must sync                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Component API added or changed        | `skills/animal-island-ui-style/references/components/<category>.md` — props copied verbatim from source |
| Component style added or changed      | `docs/design-system/components/<category>.md` + its `docs/zh-CN` mirror                                 |
| Visual token or rule changed          | `docs/design-system/design-tokens.md` / `design-rules.md` + their `docs/zh-CN` mirrors                  |
| New component                         | all of the above + the four demo registration points + README badges (`npm run badges`)                 |
| Any change to an English `docs/` file | the matching file under `docs/zh-CN/`                                                                   |

`npm run check:docs` (`scripts/check-docs-sync.mjs`, wired into `npm run ci`) enforces that every component in
`src/components/` is covered in the design-system docs and the skill references, that skill component reference files
stay within their 200-line cap, and that `docs/zh-CN/` mirrors `docs/`. Any drift fails the build.

## Checklist

- [ ] Props interface exported from the component file, every prop carrying a JSDoc comment
- [ ] Stateful component supports both controlled (`value`) and uncontrolled (`defaultValue`) modes
- [ ] Styles conform to [../design-system/design-rules.md](../design-system/design-rules.md) (radii, focus, shadows,
      disabled state, hover/active motion) and reference tokens instead of hardcoded values
- [ ] Component exported from `src/index.ts` with the value/type split
- [ ] Demo page created under `demo/components/` and registered in all four places
- [ ] Unit tests colocated and passing, accessibility roles and keyboard support covered — see
      [testing.md](./testing.md)
- [ ] Documentation synced per the matrix above, `npm run badges` re-run if component count or coverage changed
- [ ] `npm run ci` green
