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

    it('src 模式设置 backgroundImage', () => {
        const { container } = render(<Icon src="/foo/item-001.png" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveStyle({ backgroundImage: 'url(/foo/item-001.png)' });
    });

    it('未传 size 时默认 24px', () => {
        const { container } = render(<Icon name="icon-miles" />);
        expect(container.firstChild).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('既无 name 也无 src 时只有基础 icon 类、无 backgroundImage', () => {
        const { container } = render(<Icon />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.icon);
        expect(root.style.backgroundImage).toBe('');
    });

    it('未传 src 时不设置 backgroundImage', () => {
        const { container } = render(<Icon name="icon-camera" />);
        const root = container.firstChild as HTMLElement;
        expect(root.style.backgroundImage).toBe('');
    });

    it('bounce 默认 false，不应用 icon-bounce', () => {
        const { container } = render(<Icon name="icon-camera" />);
        expect(container.firstChild).not.toHaveClass(styles['icon-bounce']);
    });

    it('同时传入 name 与 src：应用 name 类并设置 backgroundImage', () => {
        const { container } = render(<Icon name="icon-map" src="/foo/item-001.png" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles['icon-map']);
        expect(root).toHaveStyle({ backgroundImage: 'url(/foo/item-001.png)' });
    });

    it('透传未知属性到根节点（如 data-* / aria-label）', () => {
        const { container } = render(<Icon name="icon-miles" data-testid="my-icon" aria-label="里程" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('data-testid', 'my-icon');
        expect(root).toHaveAttribute('aria-label', '里程');
        // a11y 契约：aria-label 必须作为可访问名被屏幕阅读器读出
        expect(root).toHaveAccessibleName('里程');
    });

    it('style 可覆盖默认的 width/height', () => {
        const { container } = render(<Icon name="icon-miles" size={32} style={{ width: 50 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveStyle({ width: '50px', height: '32px' });
    });

    it('为每个具名图标渲染对应的 className', () => {
        ICON_LIST.forEach(({ name }) => {
            const { container } = render(<Icon name={name} />);
            expect(container.firstChild).toHaveClass(styles[name]);
        });
    });

    it('ICON_LIST 含全部 10 个具名图标且无重复', () => {
        const names = ICON_LIST.map((i) => i.name);
        expect(names).toEqual([
            'icon-miles',
            'icon-camera',
            'icon-chat',
            'icon-encyclopedia',
            'icon-design',
            'icon-diy',
            'icon-helicopter',
            'icon-map',
            'icon-shopping',
            'icon-variant',
        ]);
        expect(new Set(names).size).toBe(names.length);
    });

    it('ICON_LIST 每项都带非空 label', () => {
        ICON_LIST.forEach(({ label }) => {
            expect(typeof label).toBe('string');
            expect(label.length).toBeGreaterThan(0);
        });
    });
});
