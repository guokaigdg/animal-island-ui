import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input, type InputProps } from './Input';
import { setup, ControlledHost } from '@test/utils';
import styles from './input.module.less';

const makeSetup = (props: Partial<InputProps> = {}) => {
    const onChange = vi.fn();
    const utils = render(<Input onChange={onChange} {...props} />);
    const getInput = () => screen.getByRole('textbox') as HTMLInputElement;
    return { onChange, getInput, user: setup(), ...utils };
};

describe('Input', () => {
    describe('rendering', () => {
        it('渲染基础 textbox', () => {
            makeSetup();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('应用 size 类', () => {
            makeSetup({ size: 'large' });
            expect(screen.getByRole('textbox').parentElement).toHaveClass(styles['wrapper-large']);
        });

        it('status=error 应用错误类', () => {
            makeSetup({ status: 'error' });
            expect(screen.getByRole('textbox').parentElement).toHaveClass(styles['wrapper-error']);
        });

        it('渲染 prefix / suffix', () => {
            makeSetup({
                prefix: <span data-testid="prefix">P</span>,
                suffix: <span data-testid="suffix">S</span>,
            });
            expect(screen.getByTestId('prefix')).toBeInTheDocument();
            expect(screen.getByTestId('suffix')).toBeInTheDocument();
        });
    });

    describe('uncontrolled', () => {
        it('defaultValue 设定初始值', () => {
            makeSetup({ defaultValue: 'hello' });
            expect(screen.getByRole('textbox')).toHaveValue('hello');
        });

        it('输入触发 onChange 且更新值', async () => {
            const { user, onChange, getInput } = makeSetup();
            await user.type(getInput(), 'ab');
            expect(onChange).toHaveBeenCalled();
            expect(getInput()).toHaveValue('ab');
        });
    });

    describe('controlled', () => {
        it('value 受控生效', async () => {
            const onChange = vi.fn();
            render(
                <ControlledHost<string, string> initial="" onChange={onChange}>
                    {({ value, onChange: set }) => <Input value={value} onChange={(e) => set(e.target.value)} />}
                </ControlledHost>
            );
            await setup().type(screen.getByRole('textbox'), 'x');
            expect(onChange).toHaveBeenLastCalledWith('x');
            expect(screen.getByRole('textbox')).toHaveValue('x');
        });
    });

    describe('disabled / clear', () => {
        it('disabled 时不可输入且 wrapper 加禁用类', async () => {
            const { user, onChange } = makeSetup({ disabled: true, defaultValue: 'a' });
            const input = screen.getByRole('textbox');
            expect(input).toBeDisabled();
            await user.type(input, 'b');
            expect(onChange).not.toHaveBeenCalled();
            expect(input.parentElement).toHaveClass(styles['wrapper-disabled']);
        });

        it('allowClear 显示清除按钮，点击后清空并触发 onClear/onChange', async () => {
            const onClear = vi.fn();
            const onChange = vi.fn();
            render(<Input allowClear defaultValue="abc" onChange={onChange} onClear={onClear} />);
            const clear = screen.getByRole('button');
            await setup().click(clear);
            expect(onClear).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalled();
            expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
        });

        it('allowClear 在空值时不渲染清除按钮', () => {
            render(<Input allowClear />);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('清除按钮支持键盘聚焦与 Enter 触发', async () => {
            const onClear = vi.fn();
            render(<Input allowClear defaultValue="abc" onClear={onClear} />);
            const clear = screen.getByRole('button', { name: /清除/ });
            // 原生 button：可被 Tab 键聚焦
            clear.focus();
            expect(clear).toHaveFocus();
            await setup().keyboard('{Enter}');
            expect(onClear).toHaveBeenCalled();
        });

        it('清除按钮自定义 clearAriaLabel', () => {
            render(<Input allowClear defaultValue="abc" clearAriaLabel="Clear" />);
            expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
        });
    });
});
