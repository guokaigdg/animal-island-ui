import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Countdown } from './Countdown';
import styles from './countdown.module.less';

describe('Countdown', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-19T00:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('按指定格式渲染剩余时间', () => {
        render(<Countdown value={Date.now() + 65_000} format="HH:mm:ss" />);
        // 滚动数字条对 DOM 可见性断言不可用，读屏文本承载完整格式化值
        expect(screen.getByText('00:01:05')).toBeInTheDocument();
    });

    it('每秒更新并在归零时触发回调', () => {
        const onChange = vi.fn();
        const onFinish = vi.fn();
        render(<Countdown value={Date.now() + 2_000} onChange={onChange} onFinish={onFinish} />);

        act(() => vi.advanceTimersByTime(1_000));
        expect(screen.getByText('00:00:01')).toBeInTheDocument();
        act(() => vi.advanceTimersByTime(1_000));
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
        expect(onChange).toHaveBeenLastCalledWith(0);
        expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('支持 Date、天数格式和前缀', () => {
        render(
            <Countdown
                value={new Date(Date.now() + (24 * 60 * 60 + 2 * 60 * 60 + 3 * 60 + 4) * 1_000)}
                format="DD 天 HH:mm:ss"
                prefix="活动结束还有"
            />
        );
        expect(screen.getByText('活动结束还有')).toBeInTheDocument();
        expect(screen.getByText('01 天 02:03:04')).toBeInTheDocument();
    });

    it('过期时间稳定显示零且只完成一次', () => {
        const onFinish = vi.fn();
        const { rerender } = render(<Countdown value={Date.now() - 1_000} onFinish={onFinish} />);
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
        expect(onFinish).toHaveBeenCalledTimes(1);
        rerender(<Countdown value={Date.now() - 1_000} onFinish={() => onFinish()} />);
        act(() => vi.advanceTimersByTime(2_000));
        expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('数字条通过 translateY 滚动到当前数字', () => {
        const { container } = render(<Countdown value={Date.now() + 65_000} format="HH:mm:ss" />);
        const strips = container.querySelectorAll(`.${styles.digitStrip}`);
        expect(strips.length).toBe(6);
        // '00:01:05' → 初始 pos = 数字本身（20 面数字条，每面 5%）
        const transforms = Array.from(strips).map((s) => (s as HTMLElement).style.transform);
        expect(transforms).toEqual([
            'translateY(-0%)',
            'translateY(-0%)',
            'translateY(-0%)',
            'translateY(-5%)',
            'translateY(-0%)',
            'translateY(-25%)',
        ]);
        // 每个数字条包含 0-9 两轮共 20 个数字面
        expect(strips[0].children.length).toBe(20);
    });

    it('秒位 0→9 回绕时单向向下滚动', () => {
        // 60s 剩余显示 '00:01:00'，1 秒后 '00:00:59'：秒个位 0→9 回绕
        const { container } = render(<Countdown value={Date.now() + 60_000} format="mm:ss" />);
        act(() => vi.advanceTimersByTime(1_000));
        expect(screen.getByText('00:59')).toBeInTheDocument();
        const strips = container.querySelectorAll(`.${styles.digitStrip}`);
        // 秒个位 9：回绕后落在下一循环（pos ≥ 10），而非反向跳回第一循环
        const secondsOnes = strips[3] as HTMLElement;
        expect(secondsOnes.style.transform).toBe('translateY(-45%)');
    });

    it('应用尺寸、风格和自定义属性', () => {
        render(
            <Countdown
                value={Date.now() + 1_000}
                size="large"
                variant="island"
                className="custom"
                aria-label="出发倒计时"
            />
        );
        expect(screen.getByRole('timer')).toHaveClass(styles.large, styles.island, 'custom');
        expect(screen.getByRole('timer')).toHaveAccessibleName('出发倒计时');
    });

    it('bordered 默认无边框，开启后应用边框类', () => {
        const { rerender } = render(<Countdown value={Date.now() + 1_000} />);
        expect(screen.getByRole('timer')).not.toHaveClass(styles.bordered);
        rerender(<Countdown value={Date.now() + 1_000} bordered />);
        expect(screen.getByRole('timer')).toHaveClass(styles.bordered);
    });
});
