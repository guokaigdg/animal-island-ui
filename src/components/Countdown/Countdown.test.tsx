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
        expect(screen.getByRole('timer')).toHaveTextContent('00:01:05');
    });

    it('每秒更新并在归零时触发回调', () => {
        const onChange = vi.fn();
        const onFinish = vi.fn();
        render(<Countdown value={Date.now() + 2_000} onChange={onChange} onFinish={onFinish} />);

        act(() => vi.advanceTimersByTime(1_000));
        expect(screen.getByRole('timer')).toHaveTextContent('00:00:01');
        act(() => vi.advanceTimersByTime(1_000));
        expect(screen.getByRole('timer')).toHaveTextContent('00:00:00');
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
        expect(screen.getByRole('timer')).toHaveTextContent('活动结束还有01 天 02:03:04');
    });

    it('过期时间稳定显示零且只完成一次', () => {
        const onFinish = vi.fn();
        const { rerender } = render(<Countdown value={Date.now() - 1_000} onFinish={onFinish} />);
        expect(screen.getByRole('timer')).toHaveTextContent('00:00:00');
        expect(onFinish).toHaveBeenCalledTimes(1);
        rerender(<Countdown value={Date.now() - 1_000} onFinish={() => onFinish()} />);
        act(() => vi.advanceTimersByTime(2_000));
        expect(onFinish).toHaveBeenCalledTimes(1);
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
});
