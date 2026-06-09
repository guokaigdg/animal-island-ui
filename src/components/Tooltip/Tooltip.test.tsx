import { describe, it, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';
import styles from './tooltip.module.less';

describe('Tooltip', () => {
    it('默认隐藏：role="tooltip" 存在但 aria-hidden=true', () => {
        render(
            <Tooltip title="hi">
                <button>btn</button>
            </Tooltip>,
        );
        const tip = screen.getByRole('tooltip', { hidden: true });
        expect(tip).toHaveAttribute('aria-hidden', 'true');
        expect(tip).not.toHaveClass(styles.visible);
    });

    it('hover 触发显示，离开后隐藏', async () => {
        const user = userEvent.setup();
        render(
            <Tooltip title="hi" trigger="hover">
                <button>btn</button>
            </Tooltip>,
        );
        const trigger = screen.getByText('btn');
        const tip = screen.getByRole('tooltip', { hidden: true });
        await user.hover(trigger);
        expect(tip).toHaveClass(styles.visible);
        expect(tip).toHaveAttribute('aria-hidden', 'false');
        await user.unhover(trigger);
        // 100ms 隐藏防抖
        await act(async () => {
            await new Promise((r) => setTimeout(r, 150));
        });
        expect(tip).not.toHaveClass(styles.visible);
    });

    it('focus 触发显示', async () => {
        const user = userEvent.setup();
        render(
            <Tooltip title="hi" trigger="focus">
                <button>btn</button>
            </Tooltip>,
        );
        await user.tab();
        const tip = screen.getByRole('tooltip', { hidden: true });
        expect(tip).toHaveClass(styles.visible);
    });

    it('click 触发：再次点击关闭', async () => {
        const user = userEvent.setup();
        render(
            <Tooltip title="hi" trigger="click">
                <button>btn</button>
            </Tooltip>,
        );
        const trigger = screen.getByText('btn');
        const tip = screen.getByRole('tooltip', { hidden: true });
        await user.click(trigger);
        expect(tip).toHaveClass(styles.visible);
        await user.click(trigger);
        expect(tip).not.toHaveClass(styles.visible);
    });

    it('placement 类按位置应用', () => {
        render(
            <Tooltip title="hi" placement="bottom-start">
                <button>btn</button>
            </Tooltip>,
        );
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass(styles.bottom_start);
    });

    it('variant=island 应用 island 类', () => {
        render(
            <Tooltip title="hi" variant="island">
                <button>btn</button>
            </Tooltip>,
        );
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass(styles.island);
    });

    it('保留子元素自身的事件处理器', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <Tooltip title="hi" trigger="click">
                <button onClick={onClick}>btn</button>
            </Tooltip>,
        );
        await user.click(screen.getByText('btn'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
