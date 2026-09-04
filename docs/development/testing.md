# Testing

Unit tests run through Vitest in jsdom; accessibility smoke tests run through a second Vitest config. Both are part of
`npm run ci`.

## Configuration

- **Vitest 4 requires a standalone `vitest.config.ts`.** Do not move test configuration into `vite.config.ts` — Vitest 4
  silently ignores an embedded `test` block.
- `globals: true` — `describe` / `it` / `expect` are available without imports.
- `environment: 'jsdom'`, `setupFiles: './test/setup.ts'` (registers `@testing-library/jest-dom/vitest`).
- `css: true` — CSS Modules are really compiled during tests, so `styles['x']` resolves to the hashed class name the
  build produces.
- `include: ['src/**/*.{test,spec}.{ts,tsx}']`; the `@` and `@test` aliases mirror the build config.
- Shared helpers: `test/utils.tsx` (`setup()` wraps `userEvent`) and `test/components.tsx`.
- `vitest.a11y.config.ts` is a separate config whose only difference is `include: ['test/a11y.test.tsx']`, so the a11y
  suite stays out of `npm run test:run`.

## Coverage

- `include: ['src/components/**/*.{ts,tsx}']`
- `exclude: ['**/*.d.ts', '**/index.ts', 'src/components/Icon/**']` — barrel files and the purely presentational Icon
  set are a deliberate trade-off, not an oversight.
- Thresholds: statements 85, branches 75, functions 85, lines 85. Every component should sit at 90% or above.

## Conventions

- The test file lives next to the component: `<ComponentName>.test.tsx`.
- Use `render` / `screen` from `@testing-library/react`, and drive interactions with `userEvent` via `setup()` from
  `@test/utils`. Do not use `fireEvent`.
- Assert class names through `styles['btn-primary']`, never a hardcoded literal — the real class name is hashed.
- Write test descriptions in Chinese, matching the rest of the suite.
- Cover: rendering, prop-to-class-name mapping, interaction callbacks, the disabled state, and ARIA roles.
- Interactive components must also cover keyboard interaction (Tab / Enter / Space / Esc / arrows) and the roles
  prescribed by [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/).

## Accessibility

`npm run test:a11y` runs `test/a11y.test.tsx`, an axe-core sweep with one `it()` per component asserting zero
violations against WCAG 2.1 AA. Adding a component means adding a case there.

- Components that render through a portal (Modal, Drawer, Notification) must pass `document.body` as the axe root;
  their output is mounted outside the render container and is otherwise invisible to the scan.
- Rules that jsdom cannot satisfy are disabled in the shared `axeOptions` (`color-contrast`, `landmark-one-main`,
  `page-has-heading-one`, `region`, `bypass`, `document-title`, `html-has-lang`, `html-lang-valid`, `meta-viewport`) —
  see the header comment in `test/a11y.test.tsx` before adding to that list.
- Overlays keep focus inside themselves: `src/components/Modal/Modal.tsx` implements a Tab / Shift+Tab focus trap and
  restores focus on close. New interactive components must not introduce focus escapes.

## Imperative Components

Components with an antd-style imperative API (Notification) have no JSX element to render, so
`render(<Notification />)` asserts nothing. Trigger them and wait for the container instead:

```tsx
act(() => Notification.success('x'));
await waitFor(() => expect(document.querySelector('...')).toBeInTheDocument());
```

CI does not force unit-test coverage on imperative components, but their demo page must work.

## Test Skeleton

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { Foo } from './Foo';
import styles from './component.module.less';

describe('Foo', () => {
    it('渲染 children', () => {
        render(<Foo>x</Foo>);
        expect(screen.getByText('x')).toBeInTheDocument();
    });

    it('应用 size 类名', () => {
        render(<Foo size="large">x</Foo>);
        expect(screen.getByText('x')).toHaveClass(styles['foo-large']);
    });

    it('点击触发 onClick', async () => {
        const user = setup();
        const onClick = vi.fn();
        render(<Foo onClick={onClick}>x</Foo>);
        await user.click(screen.getByText('x'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 禁用且阻止点击', async () => {
        const user = setup();
        const onClick = vi.fn();
        render(
            <Foo disabled onClick={onClick}>
                x
            </Foo>
        );
        await user.click(screen.getByText('x'));
        expect(onClick).not.toHaveBeenCalled();
    });
});
```
