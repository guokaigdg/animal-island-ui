import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import styles from './button.module.less';

describe('Button', () => {
    it('渲染 children 文案', () => {
        render(<Button>OK</Button>);
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('应用 type / size / 状态相关类', () => {
        render(
            <Button type="primary" size="large" danger ghost block loading>
                OK
            </Button>
        );
        const btn = screen.getByRole('button');
        expect(btn).toHaveClass(styles['btn-primary']);
        expect(btn).toHaveClass(styles['btn-large']);
        expect(btn).toHaveClass(styles['btn-danger']);
        expect(btn).toHaveClass(styles['btn-ghost']);
        expect(btn).toHaveClass(styles['btn-block']);
        expect(btn).toHaveClass(styles['btn-loading']);
    });

    it('htmlType 默认 button，可改为 submit', () => {
        const { rerender } = render(<Button>x</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        rerender(<Button htmlType="submit">x</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('disabled 禁用且阻止点击回调', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                x
            </Button>
        );
        const btn = screen.getByRole('button');
        expect(btn).toBeDisabled();
        await user.click(btn);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('点击触发 onClick', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>x</Button>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('icon 在非 loading 时渲染，loading 时不渲染图标', () => {
        const { rerender } = render(<Button icon={<i data-testid="ic" />}>x</Button>);
        expect(screen.getByTestId('ic')).toBeInTheDocument();
        rerender(
            <Button icon={<i data-testid="ic" />} loading>
                x
            </Button>
        );
        expect(screen.queryByTestId('ic')).not.toBeInTheDocument();
    });
});
