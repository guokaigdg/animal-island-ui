import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TimePicker } from './TimePicker';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';
import styles from './time-picker.module.less';

/** 面板带退场动效（0.2s），等待动画结束、面板真正卸载后再断言 */
const expectPanelClosed = async () => waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

describe('TimePicker', () => {
    describe('rendering', () => {
        it('渲染占位文本', () => {
            render(<TimePicker placeholder="选择时间" />);
            expect(screen.getByText('选择时间')).toBeInTheDocument();
        });

        it('按 format 展示受控值', () => {
            render(<TimePicker value="09:08:07" format="HH时mm分" />);
            expect(screen.getByText('09时08分')).toBeInTheDocument();
        });

        it('非法 value 回退到占位文本', () => {
            render(<TimePicker value="not-a-time" />);
            expect(screen.getByText('请选择时间')).toBeInTheDocument();
        });

        it('应用 size / status 类', () => {
            render(<TimePicker size="large" status="error" />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveClass(styles['trigger-large']);
            expect(trigger).toHaveClass(styles['trigger-error']);
        });
    });

    describe('展开与选择', () => {
        it('点击触发区展开面板', async () => {
            const user = setup();
            render(<TimePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('点击弹窗内部空白区域不关闭面板', async () => {
            const user = setup();
            render(<TimePicker defaultValue="08:00:00" />);
            await user.click(screen.getByRole('combobox'));
            // 点击面板本身（非交互空白区域）
            await user.click(screen.getByRole('dialog'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('选择时分秒后点击确定提交并关闭', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="08:00:00" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '10 时' }));
            await user.click(screen.getByRole('button', { name: '30 分' }));
            await user.click(screen.getByRole('button', { name: '45 秒' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('10:30:45');
            await expectPanelClosed();
        });

        it('受控模式：确定后回调且不回写内部状态', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(
                <ControlledHost<string | null, string | null> initial="08:00:00" onChange={onChange}>
                    {({ value, onChange: set }) => <TimePicker value={value ?? undefined} onChange={(v) => set(v)} />}
                </ControlledHost>
            );
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '12 时' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenLastCalledWith('12:00:00');
        });

        it('值未变化时确定仅关闭面板不回调', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="08:00:00" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('此刻按钮设置当前时间', async () => {
            const user = setup();
            render(<TimePicker defaultValue="08:00:00" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '此刻' }));
            const now = new Date();
            const pad = (n: number) => `${n}`.padStart(2, '0');
            expect(
                screen.getByText(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
            ).toBeInTheDocument();
        });
    });

    describe('disabled / clear / 步进', () => {
        it('disabled 禁用且不可展开', async () => {
            const user = setup();
            render(<TimePicker disabled />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-disabled', 'true');
            await user.click(trigger);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('allowClear 显示清除按钮并清空', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="08:00:00" allowClear onChange={onChange} />);
            await user.click(screen.getByRole('button', { name: '清除时间' }));
            expect(onChange).toHaveBeenCalledWith(null);
            expect(screen.getByText('请选择时间')).toBeInTheDocument();
        });

        it('minuteStep 步进过滤分钟选项', async () => {
            const user = setup();
            render(<TimePicker minuteStep={15} />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('button', { name: '15 分' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: '10 分' })).not.toBeInTheDocument();
        });

        it('format 不含 ss 时不显示秒列且面板收窄', async () => {
            const user = setup();
            render(<TimePicker format="HH:mm" />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.queryByRole('button', { name: '45 秒' })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: '10 时' })).toBeInTheDocument();
            expect(screen.getByRole('dialog')).toHaveClass(styles.panelNoSeconds);
        });
    });

    describe('键盘交互', () => {
        it('Tab 聚焦后 Enter 展开、Esc 关闭', async () => {
            const user = setup();
            render(<TimePicker />);
            await user.tab();
            await user.keyboard('{Enter}');
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.keyboard('{Escape}');
            await expectPanelClosed();
        });

        it('面板内 Enter 提交待选时间（值未变化仅关闭）', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="08:00:00" onChange={onChange} />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{Enter}');
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });
    });
});
