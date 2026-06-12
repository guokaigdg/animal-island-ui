import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';
import styles from './footer.module.less';

describe('Footer', () => {
    it('默认 type=tree', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.footer);
        expect(root).toHaveClass(styles.tree);
    });

    it('type=sea 不带 tree 类（sea 由默认背景实现）', () => {
        const { container } = render(<Footer type="sea" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.footer);
        expect(root).not.toHaveClass(styles.tree);
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Footer className="x" style={{ height: 50 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('x');
        expect(root).toHaveStyle({ height: '50px' });
    });

    it('seamless=true 添加 seamless 类', () => {
        const { container } = render(<Footer seamless />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.seamless);
    });

    it('seamless=false 不添加 seamless 类', () => {
        const { container } = render(<Footer seamless={false} />);
        const root = container.firstChild as HTMLElement;
        expect(root).not.toHaveClass(styles.seamless);
    });
});
