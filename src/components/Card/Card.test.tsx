import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
