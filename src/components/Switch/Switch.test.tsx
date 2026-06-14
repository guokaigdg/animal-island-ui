import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { Switch, type SwitchProps } from './Switch';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';
import styles from './switch.module.less';

const makeSetup = (props: Partial<SwitchProps> = {}) => {
    const onChange = vi.fn();
    const utils = render(<Switch onChange={onChange} {...props} />);
    const getSwitch = () => screen.getByRole('switch') as HTMLButtonElement;
    return { onChange, getSwitch, user: setup(), ...utils };
};

describe('Switch', () => {
    describe('rendering', () => {
        it('挂载为 role="switch" button', () => {
            const { getSwitch } = makeSetup();
            expect(getSwitch()).toBeInTheDocument();
            expect(getSwitch()).toHaveAttribute('aria-checked', 'false');
        });

        it('应用 className', () => {
            makeSetup({ className: 'my-sw' });
            expect(screen.getByRole('switch')).toHaveClass('my-sw');
        });

        it('size=small 应用对应类', () => {
            makeSetup({ size: 'small' });
            expect(screen.getByRole('switch')).toHaveClass(styles['switch-small']);
        });

        it('checkedChildren / unCheckedChildren 按状态显示', () => {
            const { rerender } = render(<Switch checked={false} checkedChildren="ON" unCheckedChildren="OFF" />);
            expect(screen.getByText('OFF')).toBeInTheDocument();
            rerender(<Switch checked checkedChildren="ON" unCheckedChildren="OFF" />);
            expect(screen.getByText('ON')).toBeInTheDocument();
        });
    });

    describe('uncontrolled', () => {
        it('defaultChecked=true 初始选中', () => {
            makeSetup({ defaultChecked: true });
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        });

        it('点击切换并触发 onChange', async () => {
            const { user, onChange, getSwitch } = makeSetup();
            await user.click(getSwitch());
            expect(onChange).toHaveBeenCalledWith(true);
            expect(getSwitch()).toHaveAttribute('aria-checked', 'true');
            await user.click(getSwitch());
            expect(onChange).toHaveBeenLastCalledWith(false);
        });
    });

    describe('controlled', () => {
        it('checked 受控时不自更新', async () => {
            const onChange = vi.fn();
            render(<Switch checked={false} onChange={onChange} />);
            await setup().click(screen.getByRole('switch'));
            expect(onChange).toHaveBeenCalledWith(true);
            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
        });

        it('父级回写后 UI 同步', async () => {
            const onChange = vi.fn();
            render(
                <ControlledHost<boolean, boolean> onChange={onChange}>
                    {({ value, onChange: set }) => <Switch checked={value} onChange={set} />}
                </ControlledHost>
            );
            const sw = screen.getByRole('switch');
            await setup().click(sw);
            expect(onChange).toHaveBeenLastCalledWith(true);
            expect(sw).toHaveAttribute('aria-checked', 'true');
        });
    });

    describe('disabled / loading', () => {
        it('disabled 时点击不触发 onChange', async () => {
            const { user, onChange, getSwitch } = makeSetup({ disabled: true });
            expect(getSwitch()).toBeDisabled();
            await user.click(getSwitch());
            expect(onChange).not.toHaveBeenCalled();
        });

        it('loading 时点击不触发 onChange', async () => {
            // loading 态 CSS 设了 pointer-events:none —— 用 fireEvent 绕开 user-event 的拦截
            const { onChange, getSwitch } = makeSetup({ loading: true });
            fireEvent.click(getSwitch());
            expect(onChange).not.toHaveBeenCalled();
            expect(getSwitch()).toHaveClass(styles['switch-loading']);
        });
    });

    describe('a11y', () => {
        it('Space 键 toggle', async () => {
            const { user, onChange, getSwitch } = makeSetup();
            getSwitch().focus();
            await user.keyboard(' ');
            expect(onChange).toHaveBeenLastCalledWith(true);
            await user.keyboard(' ');
            expect(onChange).toHaveBeenLastCalledWith(false);
        });

        it('Enter 键 toggle', async () => {
            const { user, onChange, getSwitch } = makeSetup();
            getSwitch().focus();
            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenLastCalledWith(true);
        });

        it('disabled / loading 时键盘不响应', async () => {
            const { user, onChange, getSwitch } = makeSetup({ disabled: true });
            getSwitch().focus();
            await user.keyboard(' ');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('aria-label 透传', () => {
            render(<Switch aria-label="深色模式" />);
            expect(screen.getByRole('switch')).toHaveAttribute('aria-label', '深色模式');
        });
    });
});
