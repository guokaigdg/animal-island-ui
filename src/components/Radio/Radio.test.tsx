import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Radio, type RadioOption, type RadioProps } from './Radio';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';
import styles from './radio.module.less';

const baseOptions: RadioOption[] = [
    { label: 'Apple', value: 'a' },
    { label: 'Banana', value: 'b' },
    { label: 'Cherry', value: 'c', disabled: true },
];

const makeSetup = (props: Partial<RadioProps> = {}) => {
    const onChange = vi.fn();
    const utils = render(<Radio options={baseOptions} onChange={onChange} {...props} />);
    const getInputs = () => screen.getAllByRole('radio') as HTMLInputElement[];
    return { onChange, getInputs, user: setup(), ...utils };
};

describe('Radio', () => {
    describe('rendering', () => {
        it('渲染所有选项 label 与对应 radio 输入', () => {
            const { getInputs } = makeSetup();
            expect(getInputs()).toHaveLength(baseOptions.length);
            baseOptions.forEach((o) => {
                expect(screen.getByText(String(o.label))).toBeInTheDocument();
            });
        });

        it('挂载在 role="radiogroup" 容器中', () => {
            makeSetup();
            const group = screen.getByRole('radiogroup');
            expect(within(group).getAllByRole('radio')).toHaveLength(baseOptions.length);
        });

        it('应用 className 与 style 到根节点', () => {
            makeSetup({ className: 'my-radio', style: { marginTop: 8 } });
            const group = screen.getByRole('radiogroup');
            expect(group).toHaveClass('my-radio');
            expect(group).toHaveStyle({ marginTop: '8px' });
        });

        it.each(['small', 'middle', 'large'] as const)('支持 size=%s', (size) => {
            makeSetup({ size });
            const labels = screen.getAllByText(/Apple|Banana|Cherry/).map((n) => n.closest('label')!);
            labels.forEach((l) => expect(l).toHaveClass(styles[size]));
        });

        it.each(['horizontal', 'vertical'] as const)('支持 direction=%s', (direction) => {
            makeSetup({ direction });
            expect(screen.getByRole('radiogroup')).toHaveClass(styles[direction]);
        });

        it('所有 input 共享同一 name（单选语义）', () => {
            const { getInputs } = makeSetup();
            const names = getInputs().map((i) => i.name);
            expect(new Set(names).size).toBe(1);
        });
    });

    describe('uncontrolled 模式', () => {
        it('使用 defaultValue 设置初始选中态', () => {
            const { getInputs } = makeSetup({ defaultValue: 'b' });
            const [a, b] = getInputs();
            expect(a).not.toBeChecked();
            expect(b).toBeChecked();
        });

        it('点击选项 → 选中并触发 onChange', async () => {
            const { user, onChange, getInputs } = makeSetup();
            await user.click(getInputs()[0]);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenLastCalledWith('a');
            expect(getInputs()[0]).toBeChecked();
        });

        it('再次点击其他项 → 替换上一选中', async () => {
            const { user, onChange, getInputs } = makeSetup({ defaultValue: 'a' });
            await user.click(getInputs()[1]);
            expect(onChange).toHaveBeenLastCalledWith('b');
            expect(getInputs()[1]).toBeChecked();
            expect(getInputs()[0]).not.toBeChecked();
        });
    });

    describe('controlled 模式', () => {
        it('value 受控，组件不会自更新', async () => {
            const onChange = vi.fn();
            render(<Radio options={baseOptions} value="" onChange={onChange} />);
            const inputs = screen.getAllByRole('radio') as HTMLInputElement[];
            await setup().click(inputs[0]);
            expect(onChange).toHaveBeenCalledWith('a');
            expect(inputs[0]).not.toBeChecked();
        });

        it('父级回写 value 后 UI 同步更新', async () => {
            const onChange = vi.fn();
            render(
                <ControlledHost<string | number, string | number> onChange={onChange}>
                    {({ value, onChange: set }) => <Radio options={baseOptions} value={value} onChange={set} />}
                </ControlledHost>
            );
            const inputs = screen.getAllByRole('radio') as HTMLInputElement[];
            await setup().click(inputs[1]);
            expect(onChange).toHaveBeenLastCalledWith('b');
            expect(inputs[1]).toBeChecked();
        });
    });

    describe('disabled 行为', () => {
        it('单选项 disabled：点击不触发 onChange', async () => {
            const { user, onChange, getInputs } = makeSetup();
            const cherry = getInputs()[2];
            expect(cherry).toBeDisabled();
            await user.click(cherry);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('group 级 disabled：所有项都被禁用', async () => {
            const { user, onChange, getInputs } = makeSetup({ disabled: true });
            getInputs().forEach((i) => expect(i).toBeDisabled());
            await user.click(getInputs()[0]);
            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByRole('radiogroup')).toHaveClass(styles.groupDisabled);
        });
    });

    describe('键盘可访问性', () => {
        it('ArrowRight 切换到下一启用项并触发 onChange', async () => {
            const { user, onChange, getInputs } = makeSetup({ defaultValue: 'a' });
            getInputs()[0].focus();
            await user.keyboard('{ArrowRight}');
            expect(onChange).toHaveBeenLastCalledWith('b');
            expect(getInputs()[1]).toBeChecked();
        });

        it('ArrowLeft 切换到上一启用项', async () => {
            const { user, onChange, getInputs } = makeSetup({ defaultValue: 'b' });
            getInputs()[1].focus();
            await user.keyboard('{ArrowLeft}');
            expect(onChange).toHaveBeenLastCalledWith('a');
        });

        it('Home/End 跳到首尾启用项', async () => {
            const { user, onChange, getInputs } = makeSetup({ defaultValue: 'a' });
            getInputs()[0].focus();
            await user.keyboard('{End}');
            // 'c' 被禁用，End 走 enabledIndices 的最后一个 = 'b'
            expect(onChange).toHaveBeenLastCalledWith('b');
            await user.keyboard('{Home}');
            expect(onChange).toHaveBeenLastCalledWith('a');
        });
    });
});

// vi 已被多处使用
