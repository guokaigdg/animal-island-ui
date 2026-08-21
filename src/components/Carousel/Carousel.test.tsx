import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setup } from '@test/utils';
import { Carousel } from './Carousel';

const slides = [<div key="1">海滩</div>, <div key="2">广场</div>, <div key="3">博物馆</div>];

describe('Carousel', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('默认展示第一张并提供完整轮播语义', () => {
        render(<Carousel aria-label="岛屿照片">{slides}</Carousel>);
        expect(screen.getByRole('region', { name: '岛屿照片' })).toHaveAttribute('aria-roledescription', 'carousel');
        expect(screen.getByRole('group', { name: '第 1 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');
        expect(document.querySelector('[aria-label="第 2 张，共 3 张"]')).toHaveAttribute('aria-hidden', 'true');
    });

    it('点击箭头和圆点切换并触发 onChange', async () => {
        const onChange = vi.fn();
        render(<Carousel onChange={onChange}>{slides}</Carousel>);
        const user = setup();

        await user.click(screen.getByRole('button', { name: '下一张' }));
        expect(onChange).toHaveBeenLastCalledWith(1);
        expect(screen.getByRole('group', { name: '第 2 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');

        await user.click(screen.getByRole('button', { name: '转到第 3 张' }));
        expect(onChange).toHaveBeenLastCalledWith(2);
    });

    it('受控 activeIndex 不自行改变', async () => {
        const onChange = vi.fn();
        render(
            <Carousel activeIndex={0} onChange={onChange}>
                {slides}
            </Carousel>
        );
        await setup().click(screen.getByRole('button', { name: '下一张' }));
        expect(onChange).toHaveBeenCalledWith(1);
        expect(screen.getByRole('group', { name: '第 1 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');
    });

    it('键盘方向键、Home 和 End 可导航', async () => {
        render(<Carousel>{slides}</Carousel>);
        const region = screen.getByRole('region');
        region.focus();
        const user = setup();
        await user.keyboard('{ArrowRight}');
        expect(screen.getByRole('group', { name: '第 2 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');
        await user.keyboard('{End}');
        expect(screen.getByRole('group', { name: '第 3 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');
        await user.keyboard('{Home}');
        expect(screen.getByRole('group', { name: '第 1 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');
    });

    it('autoplay 按间隔自动切换', () => {
        vi.useFakeTimers();
        const onChange = vi.fn();
        render(
            <Carousel autoplay interval={2_000} onChange={onChange}>
                {slides}
            </Carousel>
        );
        act(() => vi.advanceTimersByTime(2_000));
        expect(onChange).toHaveBeenCalledWith(1);
        expect(screen.getByRole('group', { name: '第 2 张，共 3 张' })).toHaveAttribute('aria-hidden', 'false');
    });

    it('焦点进入后暂停，并可从播放控制显式恢复', async () => {
        const onChange = vi.fn();
        let latestTimer: TimerHandler | undefined;
        vi.spyOn(window, 'setInterval').mockImplementation((handler: TimerHandler) => {
            latestTimer = handler;
            return 1;
        });
        vi.spyOn(window, 'clearInterval').mockImplementation(() => {
            latestTimer = undefined;
        });
        render(
            <Carousel autoplay interval={1_000} onChange={onChange}>
                {slides}
            </Carousel>
        );
        const user = setup();
        await user.tab();
        expect(screen.getByRole('region')).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('button', { name: '继续自动播放' })).toHaveTextContent('播放');
        expect(latestTimer).toBeUndefined();
        expect(onChange).not.toHaveBeenCalled();

        await user.keyboard('{Enter}');
        expect(screen.getByRole('button', { name: '暂停自动播放' })).toHaveTextContent('暂停');
        expect(latestTimer).toBeTypeOf('function');
        act(() => (latestTimer as () => void)());
        expect(onChange).toHaveBeenCalledWith(1);
    });

    it('非循环模式在边界禁用箭头', async () => {
        render(<Carousel loop={false}>{slides}</Carousel>);
        expect(screen.getByRole('button', { name: '上一张' })).toBeDisabled();
        await setup().click(screen.getByRole('button', { name: '转到第 3 张' }));
        expect(screen.getByRole('button', { name: '下一张' })).toBeDisabled();
    });

    it('可隐藏箭头和指示点，单张内容不渲染控制器', () => {
        const { rerender } = render(
            <Carousel showArrows={false} showDots={false}>
                {slides}
            </Carousel>
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();

        rerender(<Carousel>{slides[0]}</Carousel>);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
