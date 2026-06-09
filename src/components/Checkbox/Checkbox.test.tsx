import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox, type CheckboxOption, type CheckboxProps } from './Checkbox';
import styles from './checkbox.module.less';

const baseOptions: CheckboxOption[] = [
    { label: 'Apple', value: 'a' },
    { label: 'Banana', value: 'b' },
    { label: 'Cherry', value: 'c', disabled: true },
];

const setup = (props: Partial<CheckboxProps> = {}) => {
    const onChange = vi.fn();
    const utils = render(<Checkbox options={baseOptions} onChange={onChange} {...props} />);
    const getInputs = () => screen.getAllByRole('checkbox') as HTMLInputElement[];
    return { onChange, getInputs, user: userEvent.setup(), ...utils };
};

/** 受控包装：用于验证组件在父级 state 驱动下的同步行为。 */
const ControlledHost = ({
    initial = [],
    onChange,
    ...rest
}: { initial?: Array<string | number>; onChange?: (v: Array<string | number>) => void } & Omit<
    CheckboxProps,
    'value' | 'defaultValue' | 'onChange' | 'options'
> &
    Partial<Pick<CheckboxProps, 'options'>>) => {
    const [val, setVal] = useState<Array<string | number>>(initial);
    return (
        <Checkbox
            options={baseOptions}
            {...rest}
            value={val}
            onChange={(v) => {
                setVal(v);
                onChange?.(v);
            }}
        />
    );
};

describe('Checkbox', () => {
    describe('rendering', () => {
        it('渲染所有选项的 label 与对应 checkbox 输入', () => {
            const { getInputs } = setup();
            expect(getInputs()).toHaveLength(baseOptions.length);
            baseOptions.forEach((o) => {
                expect(screen.getByText(String(o.label))).toBeInTheDocument();
            });
        });

        it('挂载在 role="group" 容器中以保证可访问性', () => {
            setup();
            const group = screen.getByRole('group');
            expect(within(group).getAllByRole('checkbox')).toHaveLength(baseOptions.length);
        });

        it('应用 className 与 style 到根节点', () => {
            setup({ className: 'my-cbx', style: { marginTop: 8 } });
            const group = screen.getByRole('group');
            expect(group).toHaveClass('my-cbx');
            expect(group).toHaveStyle({ marginTop: '8px' });
        });

        it.each(['small', 'middle', 'large'] as const)('支持 size=%s', (size) => {
            setup({ size });
            const labels = screen.getAllByText(/Apple|Banana|Cherry/).map((n) => n.closest('label')!);
            labels.forEach((l) => expect(l).toHaveClass(styles[size]));
        });

        it.each(['horizontal', 'vertical'] as const)('支持 direction=%s', (direction) => {
            setup({ direction });
            expect(screen.getByRole('group')).toHaveClass(styles[direction]);
        });

        it('每个 input 拥有稳定且互不冲突的 id', () => {
            const { getInputs } = setup();
            const ids = getInputs().map((i) => i.id);
            expect(new Set(ids).size).toBe(ids.length);
            ids.forEach((id) => expect(id).toMatch(/^animal-cbx-/));
        });
    });

    describe('uncontrolled 模式', () => {
        it('使用 defaultValue 设置初始选中态', () => {
            const { getInputs } = setup({ defaultValue: ['a'] });
            const [a, b, c] = getInputs();
            expect(a).toBeChecked();
            expect(b).not.toBeChecked();
            expect(c).not.toBeChecked();
        });

        it('点击未选中项 → 添加到选中集合并触发 onChange', async () => {
            const { user, onChange, getInputs } = setup({ defaultValue: ['a'] });
            await user.click(getInputs()[1]);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
            expect(getInputs()[1]).toBeChecked();
        });

        it('点击已选中项 → 从集合中移除', async () => {
            const { user, onChange, getInputs } = setup({ defaultValue: ['a', 'b'] });
            await user.click(getInputs()[0]);
            expect(onChange).toHaveBeenLastCalledWith(['b']);
            expect(getInputs()[0]).not.toBeChecked();
        });

        it('defaultValue 为空时也能正常切换', async () => {
            const { user, onChange, getInputs } = setup();
            await user.click(getInputs()[0]);
            expect(onChange).toHaveBeenLastCalledWith(['a']);
        });
    });

    describe('controlled 模式', () => {
        it('value 为受控值，组件不会自更新', async () => {
            const onChange = vi.fn();
            render(<Checkbox options={baseOptions} value={[]} onChange={onChange} />);
            const inputs = screen.getAllByRole('checkbox') as HTMLInputElement[];

            await userEvent.click(inputs[0]);
            expect(onChange).toHaveBeenCalledWith(['a']);
            // 父级未回写 value，UI 必须保持未选中
            expect(inputs[0]).not.toBeChecked();
        });

        it('父级回写 value 后 UI 同步更新', async () => {
            const onChange = vi.fn();
            render(<ControlledHost onChange={onChange} />);
            const inputs = screen.getAllByRole('checkbox') as HTMLInputElement[];

            await userEvent.click(inputs[0]);
            expect(onChange).toHaveBeenLastCalledWith(['a']);
            expect(inputs[0]).toBeChecked();

            await userEvent.click(inputs[1]);
            expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
            expect(inputs[1]).toBeChecked();

            await userEvent.click(inputs[0]);
            expect(onChange).toHaveBeenLastCalledWith(['b']);
            expect(inputs[0]).not.toBeChecked();
        });

        it('受控模式下传入 defaultValue 应被忽略', () => {
            render(<Checkbox options={baseOptions} value={['b']} defaultValue={['a']} />);
            const inputs = screen.getAllByRole('checkbox') as HTMLInputElement[];
            expect(inputs[0]).not.toBeChecked();
            expect(inputs[1]).toBeChecked();
        });
    });

    describe('disabled 行为', () => {
        it('单选项 disabled：点击不触发 onChange，且 input 不可交互', async () => {
            const { user, onChange, getInputs } = setup();
            const cherry = getInputs()[2];
            expect(cherry).toBeDisabled();
            await user.click(cherry);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('group 级 disabled：所有项都被禁用且回调不触发', async () => {
            const { user, onChange, getInputs } = setup({ disabled: true });
            getInputs().forEach((i) => expect(i).toBeDisabled());
            await user.click(getInputs()[0]);
            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByRole('group')).toHaveClass(styles.groupDisabled);
        });

        it('group 级 disabled 优先级高于 option.disabled=false', async () => {
            const { user, onChange, getInputs } = setup({
                options: [{ label: 'Solo', value: 's' }],
                disabled: true,
            });
            await user.click(getInputs()[0]);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('键盘可访问性', () => {
        it('Tab 可聚焦到 input；Space 触发切换', async () => {
            const { user, onChange, getInputs } = setup();
            await user.tab();
            const [first] = getInputs();
            expect(first).toHaveFocus();
            await user.keyboard(' ');
            expect(onChange).toHaveBeenLastCalledWith(['a']);
        });
    });

    describe('value 类型兼容', () => {
        it('支持 number 类型 value', async () => {
            const { user, onChange } = setup({
                options: [
                    { label: 'One', value: 1 },
                    { label: 'Two', value: 2 },
                ],
                defaultValue: [1],
            });
            const inputs = screen.getAllByRole('checkbox') as HTMLInputElement[];
            expect(inputs[0]).toBeChecked();
            await user.click(inputs[1]);
            expect(onChange).toHaveBeenLastCalledWith([1, 2]);
        });
    });
});
