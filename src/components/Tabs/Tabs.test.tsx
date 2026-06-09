import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { Tabs, type TabItem } from './Tabs';
import { setup, ControlledHost } from '@test/utils';
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
                {({ value, onChange: set }) => (
                    <Tabs items={items} activeKey={value} onChange={set} />
                )}
            </ControlledHost>,
        );
        await setup().click(screen.getByText('Cherry'));
        expect(screen.getByTestId('pane-c')).toBeInTheDocument();
    });

    it('active 项添加 active 类', () => {
        render(<Tabs items={items} defaultActiveKey="b" />);
        const btn = screen.getByText('Banana').closest('button')!;
        expect(btn).toHaveClass(styles.active);
    });
});
