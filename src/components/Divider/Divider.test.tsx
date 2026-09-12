import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './Divider';
import styles from './divider.module.less';

describe('Divider', () => {
    it('默认 type=dashed-brown：仅应用基础 divider 类（dashed-brown 由默认背景实现）', () => {
        const { container } = render(<Divider />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.divider);
    });

    it('支持 thin 细线 type', () => {
        const { container } = render(<Divider type="thin" />);
        expect(container.firstChild).toHaveClass(styles['thin']);
    });

    it('支持 hairline 1px 虚线 type', () => {
        const { container } = render(<Divider type="hairline" />);
        expect(container.firstChild).toHaveClass(styles['hairline']);
    });

    it('支持 wave-yellow 波浪线 type', () => {
        const { container } = render(<Divider type="wave-yellow" />);
        expect(container.firstChild).toHaveClass(styles['wave-yellow']);
    });

    it('支持 squiggle 波浪线 type', () => {
        const { container } = render(<Divider type="squiggle" />);
        expect(container.firstChild).toHaveClass(styles['squiggle']);
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Divider className="x" style={{ width: 100 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('x');
        expect(root).toHaveStyle({ width: '100px' });
    });

    it('icon 模式下渲染图标相连分割线', () => {
        // jsdom 中容器宽度为 0，mock clientWidth 让 cycles > 1，出现居中连接线
        const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get: () => 400,
        });
        const { container } = render(<Divider icon="Fish" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.iconDivider);
        expect(root.querySelector('svg')).toBeTruthy();
        expect(container.querySelector(`.${styles.iconLine}`)).toBeTruthy();
        if (original) Object.defineProperty(HTMLElement.prototype, 'clientWidth', original);
    });
});
