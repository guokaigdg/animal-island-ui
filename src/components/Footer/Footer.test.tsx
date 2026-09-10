import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';
import styles from './footer.module.less';
import { ICON_LIST } from '../Icon';

describe('Footer', () => {
    it('渲染图标链容器', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.footer);
    });

    it('包含全部 101 个图标', () => {
        const { container } = render(<Footer />);
        const cycle = container.querySelector(`.${styles.cycle}`) as HTMLElement;
        const svgs = cycle.querySelectorAll('svg');
        expect(svgs.length).toBe(ICON_LIST.length);
    });

    it('默认 size=24 应用图标尺寸', () => {
        const { container } = render(<Footer />);
        const svg = container.querySelector('svg') as SVGElement;
        expect(svg).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('size 可配置', () => {
        const { container } = render(<Footer size={40} />);
        const svg = container.querySelector('svg') as SVGElement;
        expect(svg).toHaveStyle({ width: '40px', height: '40px' });
    });

    it('name 指定单一图标相连', () => {
        const { container } = render(<Footer name="Heart" />);
        const cycle = container.querySelector(`.${styles.cycle}`) as HTMLElement;
        const svgs = cycle.querySelectorAll('svg');
        expect(svgs.length).toBe(1);
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Footer className="x" style={{ marginTop: 8 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('x');
        expect(root).toHaveStyle({ marginTop: '8px' });
    });
});
