import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Time } from './Time';
import styles from './time.module.less';

describe('Time', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // 本地时间字符串（不带 Z）：周一 Jun 8 09:30，各时区断言一致
        vi.setSystemTime(new Date('2026-06-08T09:30:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('渲染当前星期、月日与 HH:MM', () => {
        const { container } = render(<Time />);
        expect(screen.getByText('Monday')).toBeInTheDocument();
        expect(screen.getByText('Jun 8')).toBeInTheDocument();
        // HH 与 MM 是裸文本节点（与冒号 span 混排），用 clock 元素整体断言
        expect(container.querySelector(`.${styles.clock}`)).toHaveTextContent('09:30');
        expect(screen.getByText(':')).toBeInTheDocument();
    });

    it('locale="zh-cn" 渲染中文星期与月日', () => {
        render(<Time locale="zh-cn" />);
        expect(screen.getByText('星期一')).toBeInTheDocument();
        expect(screen.getByText('6月8日')).toBeInTheDocument();
    });

    it('weekdayFormat / dateFormat 按 dayjs token 输出', () => {
        render(<Time weekdayFormat="ddd" dateFormat="YYYY/MM/DD" />);
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('2026/06/08')).toBeInTheDocument();
    });

    it('自定义 dateFormat 与 zh-cn 语言组合', () => {
        render(<Time locale="zh-cn" dateFormat="YYYY年M月D日" />);
        expect(screen.getByText('2026年6月8日')).toBeInTheDocument();
    });

    it('每秒刷新，跨分钟后更新显示', () => {
        const { container } = render(<Time />);
        act(() => vi.advanceTimersByTime(60_000));
        const clock = container.querySelector(`.${styles.clock}`);
        expect(clock).toHaveTextContent('09:31');
        expect(clock).not.toHaveTextContent('09:30');
    });

    it('卸载时清除定时器', () => {
        const { unmount } = render(<Time />);
        expect(vi.getTimerCount()).toBe(1);
        unmount();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('应用 className 与原生属性透传', () => {
        render(<Time className="my-time" aria-label="岛屿时间" id="island-clock" />);
        const el = screen.getByRole('timer');
        expect(el).toHaveClass(styles.time, 'my-time');
        expect(el).toHaveAccessibleName('岛屿时间');
        expect(el).toHaveAttribute('id', 'island-clock');
    });
});
