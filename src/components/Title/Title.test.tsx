import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Title } from './Title';
import styles from './title.module.less';

describe('Title', () => {
    it('渲染 children 文本', () => {
        const { container } = render(<Title>Hello</Title>);
        expect(container.textContent).toContain('Hello');
    });

    it('默认 size=middle 字号 20px', () => {
        const { container } = render(<Title>X</Title>);
        const layer = container.querySelector(`.${styles.layer}`) as HTMLElement;
        expect(layer).toHaveStyle({ fontSize: '20px' });
    });

    it('默认 variant=layer 渲染双层纸', () => {
        const { container } = render(<Title>X</Title>);
        expect(container.querySelector(`.${styles.layer}`)).toBeTruthy();
    });

    it('size=large 字号 28px', () => {
        const { container } = render(<Title size="large">X</Title>);
        const layer = container.querySelector(`.${styles.layer}`) as HTMLElement;
        expect(layer).toHaveStyle({ fontSize: '28px' });
    });

    it('color 非 default 时应用 color-${color}', () => {
        const { container } = render(<Title color="app-pink">X</Title>);
        const layer = container.querySelector(`.${styles.layer}`) as HTMLElement;
        expect(layer).toHaveClass(styles['color-app-pink']);
    });

    it('variant=layer 渲染双层纸结构', () => {
        const { container } = render(<Title variant="layer">Layer</Title>);
        const layer = container.querySelector(`.${styles.layer}`) as HTMLElement;
        expect(layer).toBeTruthy();
        expect(layer).toHaveStyle({ fontSize: '20px' });
        expect(layer.querySelector(`.${styles.layerFront}`)).toBeTruthy();
        expect(container.textContent).toContain('Layer');
    });

    it('variant=layer 应用 color 到 layer 元素', () => {
        const { container } = render(
            <Title variant="layer" color="app-pink">
                X
            </Title>
        );
        const layer = container.querySelector(`.${styles.layer}`) as HTMLElement;
        expect(layer).toHaveClass(styles['color-app-pink']);
    });

    it('variant=tab 渲染折角便签结构', () => {
        const { container } = render(<Title variant="tab">Tab</Title>);
        const tab = container.querySelector(`.${styles.tab}`) as HTMLElement;
        expect(tab).toBeTruthy();
        expect(tab).toHaveStyle({ fontSize: '20px' });
        expect(tab.querySelector(`.${styles.tabText}`)).toBeTruthy();
        expect(container.textContent).toContain('Tab');
    });

    it('variant=tab 应用 color 到 tab 元素', () => {
        const { container } = render(
            <Title variant="tab" color="lime-green">
                X
            </Title>
        );
        const tab = container.querySelector(`.${styles.tab}`) as HTMLElement;
        expect(tab).toHaveClass(styles['color-lime-green']);
    });

    it('应用 className 与 style 到根 span', () => {
        const { container } = render(
            <Title className="my-t" style={{ marginLeft: 4 }}>
                X
            </Title>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('my-t');
        expect(root).toHaveStyle({ marginLeft: '4px' });
    });
});
