import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Typewriter } from './Typewriter';

describe('Typewriter', () => {
    it('autoPlay=false 时直接显示全部文本', () => {
        render(<Typewriter autoPlay={false}>Hello</Typewriter>);
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('autoPlay=true 时按 speed 逐字显示', () => {
        vi.useFakeTimers();
        const { container } = render(
            <Typewriter speed={50} autoPlay>
                ABCD
            </Typewriter>
        );
        // 初始 0 字符
        expect(container.textContent).toBe('');
        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(container.textContent).toBe('A');
        act(() => {
            vi.advanceTimersByTime(150);
        });
        expect(container.textContent).toBe('ABCD');
        vi.useRealTimers();
    });

    it('完成后触发 onDone', () => {
        vi.useFakeTimers();
        const onDone = vi.fn();
        render(
            <Typewriter speed={20} autoPlay onDone={onDone}>
                AB
            </Typewriter>
        );
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(onDone).toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('保留嵌套元素的结构（如 <strong/>）', () => {
        render(
            <Typewriter autoPlay={false}>
                <strong data-testid="bold">Bold</strong>Tail
            </Typewriter>
        );
        expect(screen.getByTestId('bold')).toBeInTheDocument();
        expect(screen.getByTestId('bold')).toHaveTextContent('Bold');
    });

    it('trigger 变更后从头重放', () => {
        vi.useFakeTimers();
        const { rerender, container } = render(
            <Typewriter speed={20} trigger={1}>
                AB
            </Typewriter>
        );
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(container.textContent).toBe('AB');
        rerender(
            <Typewriter speed={20} trigger={2}>
                AB
            </Typewriter>
        );
        // 触发变更后重置为 0
        expect(container.textContent).toBe('');
        vi.useRealTimers();
    });
});
