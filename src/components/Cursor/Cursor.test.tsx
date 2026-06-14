import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Cursor } from './Cursor';

describe('Cursor', () => {
    it('渲染 children 并包含 animal-cursor 类', () => {
        const { container, getByTestId } = render(
            <Cursor>
                <span data-testid="child">child</span>
            </Cursor>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('animal-cursor');
        expect(getByTestId('child')).toBeInTheDocument();
    });

    it('forceAll=true（默认）应用 animal-cursor--force', () => {
        const { container } = render(<Cursor>x</Cursor>);
        expect(container.firstChild).toHaveClass('animal-cursor--force');
    });

    it('forceAll=false 应用 animal-cursor--scoped', () => {
        const { container } = render(<Cursor forceAll={false}>x</Cursor>);
        expect(container.firstChild).toHaveClass('animal-cursor--scoped');
    });

    it('应用 className 与 style', () => {
        const { container } = render(
            <Cursor className="extra" style={{ padding: 4 }}>
                x
            </Cursor>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('extra');
        expect(root).toHaveStyle({ padding: '4px' });
    });
});
