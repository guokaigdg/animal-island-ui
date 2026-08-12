import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DatePicker } from './DatePicker';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';
import styles from './date-picker.module.less';

/** 面板带退场动效（0.2s），等待动画结束、面板真正卸载后再断言 */
const expectPanelClosed = async () => waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

describe('DatePicker', () => {
    describe('rendering', () => {
        it('渲染占位文本', () => {
            render(<DatePicker placeholder="选择生日" />);
            expect(screen.getByText('选择生日')).toBeInTheDocument();
        });

        it('按 format 展示受控值', () => {
            render(<DatePicker value="2026-08-10" format="YYYY年MM月DD日" />);
            expect(screen.getByText('2026年08月10日')).toBeInTheDocument();
        });

        it('非法 value 回退到占位文本', () => {
            render(<DatePicker value="not-a-date" />);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
        });

        it('应用 size / status 类', () => {
            render(<DatePicker size="large" status="error" />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveClass(styles['trigger-large']);
            expect(trigger).toHaveClass(styles['trigger-error']);
        });

        it('支持 aria-label 无障碍标签', () => {
            render(<DatePicker aria-label="选择生日" />);
            expect(screen.getByRole('combobox', { name: '选择生日' })).toBeInTheDocument();
        });
    });

    describe('展开与选择', () => {
        it('点击触发区展开面板，点击外部关闭', async () => {
            const user = setup();
            render(<DatePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.click(document.body);
            await expectPanelClosed();
        });

        it('点击弹窗内部空白区域不关闭面板', async () => {
            const user = setup();
            render(<DatePicker defaultValue="2026-08-10" />);
            await user.click(screen.getByRole('combobox'));
            // 点击面板本身（非交互空白区域）
            await user.click(screen.getByRole('dialog'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('点选日期仅更新待选值，点击确定后提交并关闭', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            // 点选后面板保持展开，onChange 未触发，触发区实时显示待选日期
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByText('2026-08-15')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('2026-08-15');
            await expectPanelClosed();
        });

        it('无待选值时确定仅关闭面板不回调', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('受控模式：选择后回调且不回写内部状态', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(
                <ControlledHost<string | null, string | null> initial="2026-08-10" onChange={onChange}>
                    {({ value, onChange: set }) => <DatePicker value={value ?? undefined} onChange={(v) => set(v)} />}
                </ControlledHost>
            );
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenLastCalledWith('2026-08-15');
        });

        it('受控 open 直接展开面板', () => {
            render(<DatePicker open aria-label="选择日期" />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    describe('disabled / clear', () => {
        it('disabled 禁用触发区且不可展开', async () => {
            const user = setup();
            render(<DatePicker disabled />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-disabled', 'true');
            expect(trigger.parentElement).toHaveClass(styles['wrapper-disabled']);
            await user.click(trigger);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('disabledDate 禁用周末日期且不可选中', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(
                <DatePicker
                    defaultValue="2026-08-01"
                    onChange={onChange}
                    disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
                />
            );
            await user.click(screen.getByRole('combobox'));
            // 2026-08-01 是周六，应被禁用
            const weekend = screen.getByRole('button', { name: '2026年8月1日' });
            expect(weekend).toHaveClass(styles.dayCellDisabled);
            expect(weekend).toBeDisabled();
            await user.click(weekend);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('allowClear 显示清除按钮，点击清空并触发 onChange(null)', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" allowClear onChange={onChange} />);
            const clear = screen.getByRole('button', { name: '清除日期' });
            await user.click(clear);
            expect(onChange).toHaveBeenCalledWith(null);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
            // 清空后清除按钮消失
            expect(screen.queryByRole('button', { name: '清除日期' })).not.toBeInTheDocument();
        });

        it('allowClear 在空值时不渲染清除按钮', () => {
            render(<DatePicker allowClear />);
            expect(screen.queryByRole('button', { name: '清除日期' })).not.toBeInTheDocument();
        });
    });

    describe('键盘交互', () => {
        it('Tab 聚焦后 Enter 展开、Esc 关闭', async () => {
            const user = setup();
            render(<DatePicker />);
            await user.tab();
            await user.keyboard('{Enter}');
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.keyboard('{Escape}');
            await expectPanelClosed();
        });

        it('方向键移动焦点日期，Enter 设为待选，确定提交', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowRight}');
            await user.keyboard('{Enter}'); // 设为待选日期
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('2026-08-11');
        });

        it('PageDown 切换到下个月视图', async () => {
            const user = setup();
            render(<DatePicker defaultValue="2026-08-10" />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{PageDown}');
            expect(screen.getByRole('button', { name: '2026年9月' })).toBeInTheDocument();
        });
    });

    describe('年 / 月 / 日视图切换', () => {
        it('点击标签进入年份选择，选中年份后进入月份选择，选中月份回到日期视图', async () => {
            const user = setup();
            render(<DatePicker defaultValue="2026-08-10" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月' }));
            await user.click(screen.getByRole('button', { name: '2028年' }));
            await user.click(screen.getByRole('button', { name: '3月' }));
            expect(screen.getByRole('button', { name: '2028年3月' })).toBeInTheDocument();
        });

        it('今天按钮：把今天设为待选日期，确定后提交', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-01-05" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '今天' }));
            // 点击今天后面板保持展开，onChange 未触发（仅设置待选日期）
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(onChange).not.toHaveBeenCalled();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('单日期模式圈出今天', async () => {
            const user = setup();
            const today = new Date();
            const fmt = (d: Date) =>
                `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
            render(<DatePicker defaultValue={fmt(today)} />);
            await user.click(screen.getByRole('combobox'));
            const todayCell = screen.getAllByRole('button', {
                name: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
            })[0];
            expect(todayCell).toHaveClass(styles.dayCellToday);
        });
    });

    describe('范围选择模式', () => {
        it('分栏展示开始与结束日期', () => {
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            expect(screen.getByText('2026-08-10')).toBeInTheDocument();
            expect(screen.getByText('2026-08-12')).toBeInTheDocument();
        });

        it('两次点选待选开始与结束日期，点击确定后提交并关闭', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            // 已确定开始日期：触发区实时显示开始日期，面板保持展开等待结束日期
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('2026-08-15')).toBeInTheDocument();
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: '2026年8月20日' }));
            // 结束日期已待选，onChange 仍未触发，面板保持展开
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(onChange).not.toHaveBeenCalled();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith(['2026-08-15', '2026-08-20']);
            await expectPanelClosed();
        });

        it('第二次点击早于开始日期时重置为新的开始日期', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '2026年8月10日' }));
            expect(onChange).not.toHaveBeenCalled();
            await user.click(screen.getByRole('button', { name: '2026年8月12日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith(['2026-08-10', '2026-08-12']);
        });

        it('范围模式只选开始未选结束时确定仅关闭', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('键盘回车依次待选开始与结束日期，确定后提交', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowRight}'); // 11
            await user.keyboard('{Enter}'); // 待选开始日期
            await user.keyboard('{ArrowRight}'); // 12
            await user.keyboard('{Enter}'); // 待选结束日期
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith(['2026-08-11', '2026-08-12']);
        });

        it('allowClear 清空范围', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} allowClear onChange={onChange} />);
            await user.click(screen.getByRole('button', { name: '清除日期' }));
            expect(onChange).toHaveBeenCalledWith(null);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
        });

        it('选中范围端点与区间应用高亮类', async () => {
            const user = setup();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('button', { name: '2026年8月10日' })).toHaveClass(styles.dayCellRangeStart);
            expect(screen.getByRole('button', { name: '2026年8月12日' })).toHaveClass(styles.dayCellRangeEnd);
            expect(screen.getByRole('button', { name: '2026年8月11日' })).toHaveClass(styles.dayCellInRange);
        });

        it('开始新选择时旧范围高亮让位', async () => {
            const user = setup();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            // 点击后进入新的选择阶段，旧范围 [10, 12] 的高亮消失
            expect(screen.getByRole('button', { name: '2026年8月12日' })).not.toHaveClass(styles.dayCellRangeEnd);
            expect(screen.getByRole('button', { name: '2026年8月15日' })).toHaveClass(styles.dayCellRangeStart);
        });

        it('正向悬停预览：开始日期到悬停日期区间高亮', async () => {
            const user = setup();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月10日' }));
            // 悬停 15 号：10 ~ 15 区间预览，15 号作为潜在终点
            await user.hover(screen.getByRole('button', { name: '2026年8月15日' }));
            expect(screen.getByRole('button', { name: '2026年8月10日' })).toHaveClass(styles.dayCellRangeStart);
            expect(screen.getByRole('button', { name: '2026年8月15日' })).toHaveClass(styles.dayCellRangeEnd);
            expect(screen.getByRole('button', { name: '2026年8月12日' })).toHaveClass(styles.dayCellInRange);
        });

        it('反向悬停预览：悬停早于开始日期的日期时反向高亮并重置潜在起点', async () => {
            const user = setup();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            // 悬停 10 号（早于开始日期）：10 ~ 15 反向预览，10 号成为新的潜在起点
            await user.hover(screen.getByRole('button', { name: '2026年8月10日' }));
            expect(screen.getByRole('button', { name: '2026年8月10日' })).toHaveClass(styles.dayCellRangeStart);
            expect(screen.getByRole('button', { name: '2026年8月15日' })).toHaveClass(styles.dayCellRangeEnd);
            expect(screen.getByRole('button', { name: '2026年8月12日' })).toHaveClass(styles.dayCellInRange);
            // 点击 10 号：成为新的开始日期，面板保持展开等待结束日期
            await user.click(screen.getByRole('button', { name: '2026年8月10日' }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '2026年8月10日' })).toHaveClass(styles.dayCellRangeStart);
            expect(screen.getByRole('button', { name: '2026年8月12日' })).not.toHaveClass(styles.dayCellRangeEnd);
        });

        it('范围模式不圈出今天', async () => {
            const user = setup();
            const today = new Date();
            const fmt = (d: Date) =>
                `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
            render(
                <DatePicker
                    range
                    defaultValue={[
                        fmt(today),
                        fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
                    ]}
                />
            );
            await user.click(screen.getByRole('combobox'));
            const todayCell = screen.getAllByRole('button', {
                name: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
            })[0];
            expect(todayCell).not.toHaveClass(styles.dayCellToday);
        });
    });
});
