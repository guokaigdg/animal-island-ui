import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Tabs, type TabItem } from './Tabs';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';
import styles from './tabs.module.less';

const items: TabItem[] = [
    { key: 'a', label: 'Apple', children: <div data-testid="pane-a">PaneA</div> },
    { key: 'b', label: 'Banana', children: <div data-testid="pane-b">PaneB</div> },
    { key: 'c', label: 'Cherry', children: <div data-testid="pane-c">PaneC</div> },
];

describe('Tabs', () => {
    it('默认渲染第一个 tab 的内容', () => {
        render(<Tabs items={items} />);
        expect(screen.getByTestId('pane-a')).toBeInTheDocument();
        expect(screen.queryByTestId('pane-b')).not.toBeInTheDocument();
    });

    it('defaultActiveKey 设置初始 active', () => {
        render(<Tabs items={items} defaultActiveKey="b" />);
        expect(screen.getByTestId('pane-b')).toBeInTheDocument();
    });

    it('点击 tab 切换内容并触发 onChange', async () => {
        const onChange = vi.fn();
        render(<Tabs items={items} onChange={onChange} />);
        await setup().click(screen.getByText('Banana'));
        expect(onChange).toHaveBeenCalledWith('b');
        expect(screen.getByTestId('pane-b')).toBeInTheDocument();
    });

    it('受控 activeKey 不自更新', async () => {
        const onChange = vi.fn();
        render(<Tabs items={items} activeKey="a" onChange={onChange} />);
        await setup().click(screen.getByText('Banana'));
        expect(onChange).toHaveBeenCalledWith('b');
        expect(screen.getByTestId('pane-a')).toBeInTheDocument();
    });

    it('受控时父级回写 → UI 切换', async () => {
        render(
            <ControlledHost<string, string> initial="a">
                {({ value, onChange: set }) => <Tabs items={items} activeKey={value} onChange={set} />}
            </ControlledHost>
        );
        await setup().click(screen.getByText('Cherry'));
        expect(screen.getByTestId('pane-c')).toBeInTheDocument();
    });

    it('active 项添加 active 类', () => {
        render(<Tabs items={items} defaultActiveKey="b" />);
        const btn = screen.getByText('Banana').closest('button')!;
        expect(btn).toHaveClass(styles.active);
    });

    describe('a11y', () => {
        it('tablist / tab / tabpanel 角色 + aria-selected + aria-controls 双向关联', () => {
            render(<Tabs items={items} aria-label="水果" />);
            const tablist = screen.getByRole('tablist');
            expect(tablist).toHaveAttribute('aria-label', '水果');

            const tabs = screen.getAllByRole('tab');
            expect(tabs).toHaveLength(items.length);
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

            const panel = screen.getByRole('tabpanel');
            expect(panel).toHaveAttribute('aria-labelledby', tabs[0].id);
            expect(tabs[0]).toHaveAttribute('aria-controls', panel.id);
        });

        it('roving tabindex：仅 active tab 为 0，其余为 -1', () => {
            render(<Tabs items={items} defaultActiveKey="b" />);
            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('tabindex', '-1');
            expect(tabs[1]).toHaveAttribute('tabindex', '0');
            expect(tabs[2]).toHaveAttribute('tabindex', '-1');
        });

        it('ArrowRight / ArrowLeft 切换 tab 并迁移焦点', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<Tabs items={items} onChange={onChange} />);
            const tabs = screen.getAllByRole('tab');
            tabs[0].focus();
            await user.keyboard('{ArrowRight}');
            expect(onChange).toHaveBeenLastCalledWith('b');
            expect(tabs[1]).toHaveFocus();
            await user.keyboard('{ArrowLeft}');
            expect(onChange).toHaveBeenLastCalledWith('a');
            expect(tabs[0]).toHaveFocus();
        });

        it('ArrowLeft 在首项循环到末项；ArrowRight 在末项循环到首项', async () => {
            const user = userEvent.setup();
            render(<Tabs items={items} />);
            const tabs = screen.getAllByRole('tab');
            tabs[0].focus();
            await user.keyboard('{ArrowLeft}');
            expect(tabs[items.length - 1]).toHaveFocus();
            await user.keyboard('{ArrowRight}');
            expect(tabs[0]).toHaveFocus();
        });

        it('Home / End 跳到首尾项', async () => {
            const user = userEvent.setup();
            render(<Tabs items={items} defaultActiveKey="b" />);
            const tabs = screen.getAllByRole('tab');
            tabs[1].focus();
            await user.keyboard('{End}');
            expect(tabs[items.length - 1]).toHaveFocus();
            await user.keyboard('{Home}');
            expect(tabs[0]).toHaveFocus();
        });
    });
});
