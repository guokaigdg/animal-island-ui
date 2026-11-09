import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Loading } from './Loading';
import styles from './loading.module.less';

describe('Loading', () => {
    describe('渲染', () => {
        it('默认渲染全屏落雪 role=status 与兜底读屏文案', () => {
            render(<Loading />);
            const status = screen.getByRole('status');
            expect(status).toBeInTheDocument();
            expect(status).toHaveClass(styles.loading);
            expect(status.textContent).toBe('加载中');
        });

        it('雪花层与暗角均为 aria-hidden，雪花数量为 50', () => {
            const { container } = render(<Loading />);
            const snow = container.querySelector(`.${styles.snow}`) as HTMLElement;
            expect(snow).toBeInTheDocument();
            expect(snow).toHaveAttribute('aria-hidden', 'true');
            const flakes = snow.querySelectorAll<HTMLElement>(`.${styles.flake}`);
            expect(flakes).toHaveLength(50);
            const vignette = container.querySelector(`.${styles.vignette}`) as HTMLElement;
            expect(vignette).toHaveAttribute('aria-hidden', 'true');
        });

        it('每片雪花内联尺寸在 1–6px 且带负延迟（首屏即有分布）', () => {
            const { container } = render(<Loading />);
            const flakes = Array.from(container.querySelectorAll<HTMLElement>(`.${styles.flake}`));
            for (const flake of flakes) {
                const size = parseFloat(flake.style.width);
                expect(size).toBeGreaterThanOrEqual(1);
                expect(size).toBeLessThanOrEqual(6);
                expect(parseFloat(flake.style.animationDelay)).toBeLessThanOrEqual(0);
            }
        });

        it('tip 渲染为中央提示文字并替代默认读屏文案', () => {
            render(<Loading tip="正在连接岛屿" />);
            expect(screen.getByText('正在连接岛屿')).toHaveClass(styles.tip);
            expect(screen.queryByText('加载中')).not.toBeInTheDocument();
        });

        it('active=false 初始不渲染任何内容', () => {
            const { container } = render(<Loading active={false} />);
            expect(container.firstChild).toBeNull();
        });

        it('首帧即渲染遮罩，不等 effect（避免底层内容闪一下）', () => {
            // 用服务端渲染取「首次渲染」的输出：effect 在这里不会跑，
            // 若遮罩靠 effect 才置位，这段 HTML 里就没有它
            const html = renderToString(<Loading tip="正在加载" />);
            expect(html).toContain('role="status"');
            expect(html).toContain('正在加载');
        });

        it('circle 形态没有进入淡入动画（首帧即完全不透明）', () => {
            render(<Loading type="circle" />);
            const status = screen.getByRole('status');
            // 淡入的那 0.2s 遮罩是透明的，底下已经铺好的内容会透出来
            expect(getComputedStyle(status).animationName).toBe('none');
            expect(getComputedStyle(status).opacity).toBe('1');
        });

        it('delay>0 时首帧不渲染，等延迟到了再出现', () => {
            const html = renderToString(<Loading delay={300} />);
            expect(html).not.toContain('role="status"');
        });

        it('active=false 时服务端渲染同样为空', () => {
            const html = renderToString(<Loading active={false} />);
            expect(html).not.toContain('role="status"');
        });

        it('zIndex 默认 3000，可通过 prop 覆盖', () => {
            const { container, rerender } = render(<Loading />);
            expect(container.firstChild).toHaveStyle({ zIndex: '3000' });
            rerender(<Loading zIndex={5000} />);
            expect(container.firstChild).toHaveStyle({ zIndex: '5000' });
        });

        it('透传 className 与 style 到根元素', () => {
            const { container } = render(<Loading className="custom-class" data-scope="snow" />);
            expect(container.firstChild).toHaveClass('custom-class');
            expect(container.firstChild).toHaveAttribute('data-scope', 'snow');
        });

        it('style 与组件内建样式合并（zIndex 不会被传入的 style 覆盖掉）', () => {
            const { container } = render(<Loading style={{ backgroundColor: 'red' }} />);
            const root = container.firstChild as HTMLElement;
            expect(root.style.zIndex).toBe('3000');
            expect(root.style.backgroundColor).toBe('red');
        });
    });

    describe('圆形展开形态', () => {
        it('type=circle 渲染帆船场景，不渲染雪花层', () => {
            const { container } = render(<Loading type="circle" />);
            expect(container.querySelector(`.${styles.snow}`)).toBeNull();
            expect(container.querySelector(`.${styles.sailboatScene}`)).toBeInTheDocument();
            expect(container.querySelector('svg')).toBeInTheDocument();
        });

        it('默认形态仍是落雪', () => {
            const { container } = render(<Loading />);
            expect(container.querySelector(`.${styles.snow}`)).toBeInTheDocument();
            expect(container.querySelector(`.${styles.sailboatScene}`)).toBeNull();
            expect(container.firstChild).toHaveClass(styles.loading);
        });

        it('帆船场景为装饰性内容，aria-hidden', () => {
            const { container } = render(<Loading type="circle" />);
            const scene = container.querySelector(`.${styles.sailboatScene}`) as HTMLElement;
            expect(scene).toHaveAttribute('aria-hidden', 'true');
        });

        it('circle 形态下 tip 仍然渲染在根元素内', () => {
            render(<Loading type="circle" tip="正在驶向岛屿…" />);
            expect(screen.getByText('正在驶向岛屿…')).toHaveClass(styles.tip);
            expect(screen.queryByText('加载中')).not.toBeInTheDocument();
        });

        it('circle 形态的波浪层铺满画布宽度所需的份数（4 段平铺）', () => {
            const { container } = render(<Loading type="circle" />);
            const uses = container.querySelectorAll('svg use');
            expect(uses).toHaveLength(4);
        });

        it('帆船停在右下角（离右 20px、离下 30px）', () => {
            const { container } = render(<Loading type="circle" />);
            const scene = container.querySelector(`.${styles.sailboatScene}`) as HTMLElement;
            const cs = getComputedStyle(scene);
            expect(cs.position).toBe('absolute');
            expect(cs.right).toBe('20px');
            expect(cs.bottom).toBe('30px');
        });

        it('showBoat=false 时不渲染帆船，但保留遮罩与提示文字', () => {
            const { container } = render(<Loading type="circle" showBoat={false} tip="加载中" />);
            expect(container.querySelector(`.${styles.sailboatScene}`)).toBeNull();
            expect(container.querySelector('svg')).toBeNull();
            expect(screen.getByText('加载中')).toHaveClass(styles.tip);
        });

        it('showBoat=false 不影响圆形展开：active→false 仍加 masking 类', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading type="circle" showBoat={false} />);
            rerender(<Loading type="circle" showBoat={false} active={false} />);
            const status = screen.getByRole('status');
            expect(status).toHaveClass(styles.masking);
            expect(status).not.toHaveClass(styles.exiting);
            vi.useRealTimers();
        });

        it('多个实例的 <use> 引用目标互不相同（不会串扰）', () => {
            const { container } = render(
                <>
                    <Loading type="circle" />
                    <Loading type="circle" />
                </>
            );
            const ids = Array.from(container.querySelectorAll('svg use')).map((u) => u.getAttribute('href'));
            // 同一实例的 4 段平铺共用一个引用目标，两个实例各一个 —— 目标不同才不会互相覆盖
            expect(ids).toHaveLength(8);
            expect(new Set(ids).size).toBe(2);
        });
    });

    describe('圆形扩散展开', () => {
        afterEach(() => {
            vi.useRealTimers();
        });

        it('active→false 后加 masking 类而非 exiting 类', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading type="circle" />);
            rerender(<Loading type="circle" active={false} />);
            const status = screen.getByRole('status');
            expect(status).toHaveClass(styles.masking);
            expect(status).not.toHaveClass(styles.exiting);
        });

        it('遮罩半径写成内联 CSS 变量，过渡时长取自 fadeDuration', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading type="circle" fadeDuration={1.2} />);
            rerender(<Loading type="circle" fadeDuration={1.2} active={false} />);
            const status = screen.getByRole('status') as HTMLElement;
            expect(status.style.getPropertyValue('--animal-loading-mask-duration')).toBe('1.2s');
            expect(parseFloat(status.style.getPropertyValue('--animal-loading-mask-r'))).toBeGreaterThan(0);
        });

        it('展开走完后卸载', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading type="circle" fadeDuration={0.6} />);
            rerender(<Loading type="circle" fadeDuration={0.6} active={false} />);
            expect(screen.getByRole('status')).toBeInTheDocument();
            act(() => vi.advanceTimersByTime(600));
            expect(screen.queryByRole('status')).toBeNull();
        });

        it('展开途中恢复 active：遮罩半径归零，下次关闭仍能重新展开', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading type="circle" fadeDuration={0.6} />);
            rerender(<Loading type="circle" fadeDuration={0.6} active={false} />);
            act(() => vi.advanceTimersByTime(300));
            rerender(<Loading type="circle" fadeDuration={0.6} active />);
            const status = screen.getByRole('status') as HTMLElement;
            expect(status).not.toHaveClass(styles.masking);
            expect(status.style.getPropertyValue('--animal-loading-mask-r')).toBe('0px');

            // 再次关闭时半径要重新写成目标值，而不是停留在 0
            rerender(<Loading type="circle" fadeDuration={0.6} active={false} />);
            expect(parseFloat(status.style.getPropertyValue('--animal-loading-mask-r'))).toBeGreaterThan(0);
        });
    });

    describe('delay 延迟显示', () => {
        afterEach(() => {
            vi.useRealTimers();
        });

        it('delay 时间内不渲染，到时后出现', () => {
            vi.useFakeTimers();
            const { container } = render(<Loading delay={300} />);
            expect(container.firstChild).toBeNull();
            act(() => vi.advanceTimersByTime(300));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('delay=0 立即显示', () => {
            render(<Loading delay={0} />);
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('active 切换为 true 时重新计时', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading delay={300} active={false} />);
            rerender(<Loading delay={300} active />);
            expect(screen.queryByRole('status')).toBeNull();
            act(() => vi.advanceTimersByTime(299));
            expect(screen.queryByRole('status')).toBeNull();
            act(() => vi.advanceTimersByTime(1));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });

    describe('渐变消失', () => {
        afterEach(() => {
            vi.useRealTimers();
        });

        it('active→false 后保持挂载并加 exiting 类（淡出中）', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading />);
            rerender(<Loading active={false} />);
            const status = screen.getByRole('status');
            expect(status).toBeInTheDocument();
            expect(status).toHaveClass(styles.exiting);
        });

        it('exiting 时根元素以 fadeDuration 作为 transition-duration', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading fadeDuration={1.5} />);
            rerender(<Loading fadeDuration={1.5} active={false} />);
            const status = screen.getByRole('status') as HTMLElement;
            expect(status.style.transitionDuration).toBe('1.5s');
        });

        it('fadeDuration 走完后卸载雪花屏', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading fadeDuration={0.6} />);
            rerender(<Loading fadeDuration={0.6} active={false} />);
            expect(screen.getByRole('status')).toBeInTheDocument();
            act(() => vi.advanceTimersByTime(600));
            expect(screen.queryByRole('status')).toBeNull();
        });

        it('淡出途中恢复 active：立即取消卸载并回到不透明', () => {
            vi.useFakeTimers();
            const { rerender } = render(<Loading fadeDuration={0.6} />);
            rerender(<Loading fadeDuration={0.6} active={false} />);
            // 淡出到一半时恢复开启
            act(() => vi.advanceTimersByTime(300));
            rerender(<Loading fadeDuration={0.6} active />);
            const status = screen.getByRole('status');
            expect(status).toBeInTheDocument();
            expect(status).not.toHaveClass(styles.exiting);
            // 恢复后不再有任何计时器将其卸载
            act(() => vi.advanceTimersByTime(5_000));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });
});
