# 测试

单测跑在 jsdom 上的 Vitest 里，无障碍冒烟测试跑在第二份 Vitest 配置里。两者都是 `npm run ci` 的一部分。

## 配置

- **Vitest 4 必须用独立的 `vitest.config.ts`。** 不要把测试配置搬进 `vite.config.ts` —— Vitest 4 会静默忽略内嵌的 `test` 块。
- `globals: true` —— `describe` / `it` / `expect` 无需 import 即可使用。
- `environment: 'jsdom'`，`setupFiles: './test/setup.ts'`（注册 `@testing-library/jest-dom/vitest`）。
- `css: true` —— CSS Modules 在测试中真实编译，`styles['x']` 解析出的就是构建产出的哈希类名。
- `include: ['src/**/*.{test,spec}.{ts,tsx}']`；`@` 与 `@test` 别名与构建配置保持一致。
- 公共工具：`test/utils.tsx`（`setup()` 封装 `userEvent`）与 `test/components.tsx`。
- `vitest.a11y.config.ts` 是独立配置，唯一区别是 `include: ['test/a11y.test.tsx']`，让 a11y 用例不进 `npm run test:run`。

## 覆盖率

- `include: ['src/components/**/*.{ts,tsx}']`
- `exclude: ['**/*.d.ts', '**/index.ts', 'src/components/Icon/**']` —— 桶文件与纯展示性的 Icon 集合是有意的取舍，不是遗漏。
- 阈值：statements 85、branches 75、functions 85、lines 85。branches 调低是为了给 Loading 的浏览器时序分支留口子（`setTimeout` 清理与强制 reflow 路径在 jsdom 中不可达），其余组件都应在 90% 以上。

## 编写约定

- 测试文件与组件同目录：`<ComponentName>.test.tsx`。
- 用 `@testing-library/react` 的 `render` / `screen`，交互通过 `@test/utils` 的 `setup()` 拿到 `userEvent` 来驱动。不要用 `fireEvent`。
- 断言类名用 `styles['btn-primary']`，绝不硬编码字面量 —— 真实类名是哈希过的。
- 测试描述用中文，与整套用例保持一致。
- 覆盖：渲染、props 到类名的映射、交互回调、禁用态、ARIA 角色。
- 交互组件还必须覆盖键盘交互（Tab / Enter / Space / Esc / 方向键）与 [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) 规定的角色。

## 无障碍

`npm run test:a11y` 运行 `test/a11y.test.tsx`：一轮 axe-core 扫描，每个组件一个 `it()`，断言在 WCAG 2.1 AA 下零违规。新增组件就要在那里补一个用例。

- 通过 portal 渲染的组件（Modal、Drawer、Notification）必须把 `document.body` 作为 axe 的根节点；它们的产物挂载在 render 容器之外，否则扫描不到。
- jsdom 无法满足的规则已在公共 `axeOptions` 中关闭（`color-contrast`、`landmark-one-main`、`page-has-heading-one`、`region`、`bypass`、`document-title`、`html-has-lang`、`html-lang-valid`、`meta-viewport`）—— 往这个列表里加规则前，先看 `test/a11y.test.tsx` 顶部的注释。
- 浮层必须把焦点关在自己内部：`src/components/Modal/Modal.tsx` 实现了 Tab / Shift+Tab 焦点陷阱并在关闭时恢复焦点。新增的交互组件不要引入新的焦点逃逸。

## 命令式组件

带 antd 风格命令式 API 的组件（Notification）没有可渲染的 JSX 元素，`render(<Notification />)` 断言不了任何东西。改为触发它，然后等待容器出现：

```tsx
act(() => Notification.success('x'));
await waitFor(() => expect(document.querySelector('...')).toBeInTheDocument());
```

CI 不强制命令式组件的单测覆盖率，但它们的 demo 页必须能跑通。

## 测试骨架

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
