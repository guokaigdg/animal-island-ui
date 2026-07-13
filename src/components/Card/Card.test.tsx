import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';
import styles from './card.module.less';

describe('Card', () => {
    it('渲染 children', () => {
        render(
            <Card>
                <span data-testid="c">hi</span>
            </Card>
        );
        expect(screen.getByTestId('c')).toBeInTheDocument();
    });

    it('默认不带类型/颜色/花纹相关类', () => {
        const { container } = render(<Card>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.card);
        expect(root).not.toHaveClass(styles['card-dashed']);
    });

    it('type=dashed 应用对应类', () => {
        const { container } = render(<Card type="dashed">x</Card>);
        expect(container.firstChild).toHaveClass(styles['card-dashed']);
    });

    it('color 非 default 时应用 card-${color}', () => {
        const { container } = render(<Card color="app-pink">x</Card>);
        expect(container.firstChild).toHaveClass(styles['card-app-pink']);
    });

    it('pattern 非 none 时应用 pattern-${pattern}', () => {
        const { container } = render(<Card pattern="purple">x</Card>);
        expect(container.firstChild).toHaveClass(styles['pattern-purple']);
    });

    it('透传原生 div 属性（onClick / className / style）', () => {
        const { container } = render(
            <Card className="extra" style={{ marginTop: 5 }} data-testid="root">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('extra');
        expect(root).toHaveStyle({ marginTop: '5px' });
        expect(root).toHaveAttribute('data-testid', 'root');
    });

    // ---------- 补充测试 ----------

    it('type=default 显式不应用 card-dashed', () => {
        const { container } = render(<Card type="default">x</Card>);
        expect(container.firstChild).not.toHaveClass(styles['card-dashed']);
    });

    it('color=default 显式不应用任何 card-${color} 类', () => {
        const { container } = render(<Card color="default">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root).not.toHaveClass(styles['card-app-pink']);
        expect(root).not.toHaveClass(styles['card-purple']);
    });

    it('pattern=none 显式不应用任何 pattern-${pattern} 类', () => {
        const { container } = render(<Card pattern="none">x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root).not.toHaveClass(styles['pattern-app-pink']);
        expect(root).not.toHaveClass(styles['pattern-default']);
    });

    it('color 全部 12 种枚举都生成对应 class', () => {
        const colors = [
            'app-pink',
            'purple',
            'app-blue',
            'app-yellow',
            'app-orange',
            'app-teal',
            'app-green',
            'app-red',
            'lime-green',
            'yellow-green',
            'brown',
            'warm-peach-pink',
        ] as const;
        for (const c of colors) {
            const { container, unmount } = render(<Card color={c}>x</Card>);
            expect(container.firstChild).toHaveClass(styles[`card-${c}`]);
            unmount();
        }
    });

    it('pattern 全部 13 种枚举（none 之外的）都生成对应 class', () => {
        const patterns = [
            'default',
            'app-pink',
            'purple',
            'app-blue',
            'app-yellow',
            'app-orange',
            'app-teal',
            'app-green',
            'app-red',
            'lime-green',
            'yellow-green',
            'brown',
            'warm-peach-pink',
        ] as const;
        for (const p of patterns) {
            const { container, unmount } = render(<Card pattern={p}>x</Card>);
            expect(container.firstChild).toHaveClass(styles[`pattern-${p}`]);
            unmount();
        }
    });

    it('type + color + pattern 三者组合时同时应用对应 class', () => {
        const { container } = render(
            <Card type="dashed" color="app-pink" pattern="purple">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles['card-dashed']);
        expect(root).toHaveClass(styles['card-app-pink']);
        expect(root).toHaveClass(styles['pattern-purple']);
    });

    it('children 为空字符串时正常渲染根 div', () => {
        const { container } = render(<Card>{''}</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('DIV');
        expect(root).toHaveClass(styles.card);
    });

    it('children 为数字 / 字符串 / 节点均可', () => {
        const { rerender, container } = render(<Card>{42}</Card>);
        expect(container.firstChild?.textContent).toBe('42');
        rerender(<Card>plain text</Card>);
        expect(container.firstChild?.textContent).toBe('plain text');
        rerender(
            <Card>
                <em data-testid="e">em</em>
            </Card>
        );
        expect(screen.getByTestId('e')).toBeInTheDocument();
    });

    it('onClick 在 Card 上被点击时触发', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        const { container } = render(<Card onClick={onClick}>x</Card>);
        await user.click(container.firstChild as HTMLElement);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('aria-* / data-* 透传', () => {
        const { container } = render(
            <Card aria-label="card" data-testid="card-root" role="region">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('aria-label', 'card');
        expect(root).toHaveAttribute('data-testid', 'card-root');
        expect(root).toHaveAttribute('role', 'region');
    });

    // ---------- hoverable prop (default false, opt-in) ----------

    it('默认 (不传 hoverable) 不应用 card-hoverable 类', () => {
        const { container } = render(<Card>x</Card>);
        expect(container.firstChild).not.toHaveClass(styles['card-hoverable']);
    });

    it('hoverable={false} 显式不应用 card-hoverable 类', () => {
        const { container } = render(<Card hoverable={false}>x</Card>);
        expect(container.firstChild).not.toHaveClass(styles['card-hoverable']);
    });

    it('hoverable={true} 应用 card-hoverable 类', () => {
        const { container } = render(<Card hoverable={true}>x</Card>);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles['card-hoverable']);
        expect(root).toHaveClass(styles.card);
    });

    it('hoverable 与 type / color / pattern 自由组合', () => {
        const { container } = render(
            <Card type="dashed" color="app-pink" pattern="purple" hoverable>
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles['card-hoverable']);
        expect(root).toHaveClass(styles['card-dashed']);
        expect(root).toHaveClass(styles['card-app-pink']);
        expect(root).toHaveClass(styles['pattern-purple']);
    });

    it('className 透传仍然生效,且与 hoverable 共存', () => {
        const { container } = render(
            <Card hoverable className="my-card" data-testid="h">
                x
            </Card>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('my-card');
        expect(root).toHaveClass(styles['card-hoverable']);
    });
});
