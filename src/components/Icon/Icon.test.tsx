import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, ICON_LIST } from './Icon';
import styles from './icon.module.less';

describe('Icon', () => {
    it('name 模式应用对应 className', () => {
        const { container } = render(<Icon name="icon-miles" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.icon);
        expect(root).toHaveClass(styles['icon-miles']);
    });

    it('size 应用为内联 width/height', () => {
        const { container } = render(<Icon name="icon-camera" size={32} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveStyle({ width: '32px', height: '32px' });
    });

    it('支持字符串 size（如 100%）', () => {
        const { container } = render(<Icon name="icon-camera" size="100%" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveStyle({ width: '100%' });
    });

    it('bounce=true 应用 icon-bounce', () => {
        const { container } = render(<Icon name="icon-camera" bounce />);
        expect(container.firstChild).toHaveClass(styles['icon-bounce']);
    });

    it('应用自定义 className 与 style', () => {
        const { container } = render(<Icon name="icon-camera" className="extra" style={{ opacity: 0.5 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('extra');
        expect(root).toHaveStyle({ opacity: '0.5' });
    });

    it('ICON_LIST 包含所有具名图标', () => {
        const names = ICON_LIST.map((i) => i.name);
        expect(names).toContain('icon-miles');
        expect(names.length).toBeGreaterThan(0);
    });
});
