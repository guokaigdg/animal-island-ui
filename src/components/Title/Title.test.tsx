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
        const ribbon = container.querySelector(`.${styles.ribbon}`) as HTMLElement;
        expect(ribbon).toHaveStyle({ fontSize: '20px' });
    });

    it('size=large 字号 28px', () => {
        const { container } = render(<Title size="large">X</Title>);
        const ribbon = container.querySelector(`.${styles.ribbon}`) as HTMLElement;
        expect(ribbon).toHaveStyle({ fontSize: '28px' });
    });

    it('color 非 default 时应用 color-${color}', () => {
        const { container } = render(<Title color="app-pink">X</Title>);
        const ribbon = container.querySelector(`.${styles.ribbon}`) as HTMLElement;
        expect(ribbon).toHaveClass(styles['color-app-pink']);
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
