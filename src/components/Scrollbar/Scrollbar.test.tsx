import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Scrollbar } from './Scrollbar';
import styles from './scrollbar.module.less';

describe('Scrollbar', () => {
    describe('rendering', () => {
        it('渲染滚动区与子内容', () => {
            render(<Scrollbar>内容</Scrollbar>);
            expect(screen.getByText('内容')).toBeInTheDocument();
        });

        it('默认应用 vertical 方向类', () => {
            const { container } = render(<Scrollbar>x</Scrollbar>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass(styles.scrollbar);
            expect(root).toHaveClass(styles.vertical);
        });

        it('滚动区可聚焦，方向键才能滚动', () => {
            const { container } = render(<Scrollbar>x</Scrollbar>);
            expect(container.firstChild).toHaveAttribute('tabindex', '0');
        });

        it('支持 className 与 style', () => {
            const { container } = render(
                <Scrollbar className="x" style={{ marginLeft: 4 }}>
                    t
                </Scrollbar>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('x');
            expect(root).toHaveStyle({ marginLeft: '4px' });
        });
    });

    describe('direction', () => {
        it('direction=horizontal 应用对应类', () => {
            const { container } = render(<Scrollbar direction="horizontal">x</Scrollbar>);
            expect(container.firstChild).toHaveClass(styles.horizontal);
        });

        it('direction=both 应用对应类', () => {
            const { container } = render(<Scrollbar direction="both">x</Scrollbar>);
            expect(container.firstChild).toHaveClass(styles.both);
        });

        it('只应用一个方向类', () => {
            const { container } = render(<Scrollbar direction="horizontal">x</Scrollbar>);
            const root = container.firstChild as HTMLElement;
            expect(root).not.toHaveClass(styles.vertical);
            expect(root).not.toHaveClass(styles.both);
        });
    });

    describe('size', () => {
        it('尺寸透传到 style', () => {
            const { container } = render(
                <Scrollbar height={200} maxHeight={300} width={100} maxWidth={150}>
                    x
                </Scrollbar>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveStyle({ height: '200px', maxHeight: '300px', width: '100px', maxWidth: '150px' });
        });

        it('字符串尺寸原样透传', () => {
            const { container } = render(<Scrollbar height="50vh">x</Scrollbar>);
            expect(container.firstChild).toHaveStyle({ height: '50vh' });
        });
    });

    describe('appearance', () => {
        it('默认不显示轨道', () => {
            const { container } = render(<Scrollbar>x</Scrollbar>);
            expect(container.firstChild).not.toHaveClass(styles.showTrack);
        });

        it('showTrack 应用对应类', () => {
            const { container } = render(<Scrollbar showTrack>x</Scrollbar>);
            expect(container.firstChild).toHaveClass(styles.showTrack);
        });

        it('thumbColor 与 thumbSize 写入 CSS 变量', () => {
            const { container } = render(
                <Scrollbar thumbColor="#123456" thumbSize={14}>
                    x
                </Scrollbar>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveStyle({
                '--animal-scrollbar-thumb': '#123456',
                '--animal-scrollbar-size': '14px',
            });
        });

        it('默认滑块粗细为 8px（比系统经典滚动条更细）', () => {
            const { container } = render(<Scrollbar>x</Scrollbar>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveStyle({ '--animal-scrollbar-size': '8px' });
        });

        it('传 thumbSize 才覆盖宽度', () => {
            const { container } = render(<Scrollbar thumbSize={16}>x</Scrollbar>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveStyle({ '--animal-scrollbar-size': '16px' });
        });

        it('thumbSize=0 隐藏滚动条并应用 hidden 类', () => {
            const { container } = render(<Scrollbar thumbSize={0}>x</Scrollbar>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveStyle({ '--animal-scrollbar-size': '0px' });
            expect(root).toHaveClass(styles.hidden);
        });

        it('thumbSize 为负数时按 0 处理，而不是回退成系统滚动条', () => {
            const { container, rerender } = render(<Scrollbar thumbSize={-5}>x</Scrollbar>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveStyle({ '--animal-scrollbar-size': '0px' });
            expect(root).toHaveClass(styles.hidden);
            // 不会在 rerender 后残留
            rerender(<Scrollbar thumbSize={8}>x</Scrollbar>);
            expect(container.firstChild).not.toHaveClass(styles.hidden);
        });

        it('thumbSize 非有限值时回落到默认值', () => {
            [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].forEach((thumbSize) => {
                const { container } = render(<Scrollbar thumbSize={thumbSize}>x</Scrollbar>);
                const root = container.firstChild as HTMLElement;
                expect(root).toHaveStyle({ '--animal-scrollbar-size': '8px' });
                expect(root).not.toHaveClass(styles.hidden);
            });
        });

        it('默认与正数 thumbSize 不应用 hidden 类', () => {
            const { container } = render(<Scrollbar>x</Scrollbar>);
            expect(container.firstChild).not.toHaveClass(styles.hidden);
        });
    });

    describe('ref', () => {
        it('转发 ref 到根滚动容器', () => {
            const ref = createRef<HTMLDivElement>();
            const { container } = render(<Scrollbar ref={ref}>x</Scrollbar>);
            expect(ref.current).toBe(container.firstChild);
        });

        it('可通过 ref 读写 scrollTop，且不产生函数组件 ref 警告', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            const ref = createRef<HTMLDivElement>();
            render(<Scrollbar ref={ref}>x</Scrollbar>);
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();

            expect(ref.current).not.toBeNull();
            if (!ref.current) return;
            ref.current.scrollTop = 12;
            expect(ref.current.scrollTop).toBe(12);
        });
    });
});
