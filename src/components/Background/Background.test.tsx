import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Background } from './Background';
import styles from './background.module.less';

describe('Background', () => {
    it('默认 type=default：应用基础类与奶油色波点类', () => {
        const { container } = render(<Background />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass(styles.background);
        expect(root).toHaveClass(styles['bg-default']);
    });

    it('支持自定义 type=sprinkles', () => {
        const { container } = render(<Background type="sprinkles" />);
        expect(container.firstChild).toHaveClass(styles['bg-sprinkles']);
    });

    it('支持 type=grid（网格壁纸）', () => {
        const { container } = render(<Background type="grid" />);
        expect(container.firstChild).toHaveClass(styles['bg-grid']);
    });

    it('支持 type=dots-dark-green（深绿波点）与 dots-* 底色对应 Card pattern 系列', () => {
        const { container } = render(<Background type="dots-dark-green" />);
        expect(container.firstChild).toHaveClass(styles['bg-dots-dark-green']);
        const { container: color } = render(<Background type="dots-pink" />);
        expect(color.firstChild).toHaveClass(styles['bg-dots-pink']);
    });

    it('渲染 children 于背景之上', () => {
        render(
            <Background>
                <p>岛屿内容</p>
            </Background>
        );
        expect(screen.getByText('岛屿内容')).toBeInTheDocument();
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Background className="x" style={{ height: 100 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('x');
        expect(root).toHaveStyle({ height: '100px' });
    });
});
