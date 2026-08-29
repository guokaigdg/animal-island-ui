import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import styles from './pagination.module.less';

describe('Pagination', () => {
    it('渲染页码序列与导航语义', () => {
        render(<Pagination total={50} pageSize={10} />);
        const nav = screen.getByRole('navigation', { name: '分页' });
        expect(nav).toBeInTheDocument();
        [1, 2, 3, 4, 5].forEach((p) => {
            expect(screen.getByRole('button', { name: String(p) })).toBeInTheDocument();
        });
    });

    it('当前页高亮并标记 aria-current', () => {
        render(<Pagination total={50} pageSize={10} defaultCurrent={2} />);
        const active = screen.getByRole('button', { name: '2' });
        expect(active).toHaveClass(styles.active);
        expect(active).toHaveAttribute('aria-current', 'page');
    });

    it('variant 默认 orange，teal 可切换配色类', () => {
        render(<Pagination total={50} pageSize={10} />);
        const nav = screen.getByRole('navigation', { name: '分页' });
        expect(nav).toHaveClass(styles.orange);
        expect(nav).not.toHaveClass(styles.teal);
    });

    it('variant="teal" 应用 teal 配色类', () => {
        render(<Pagination total={50} pageSize={10} variant="teal" />);
        expect(screen.getByRole('navigation', { name: '分页' })).toHaveClass(styles.teal);
    });

    it('页数超过 7 页时两端显示省略号', () => {
        render(<Pagination total={100} pageSize={10} defaultCurrent={5} />);
        // 第 5 / 10 页：左右各一个省略号
        expect(screen.getAllByText('···')).toHaveLength(2);
        // 首尾页始终可见
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });

    it('点击页码触发 onChange', () => {
        const onChange = vi.fn();
        render(<Pagination total={50} pageSize={10} defaultCurrent={1} onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: '3' }));
        expect(onChange).toHaveBeenCalledWith(3, 10);
    });

    it('首页禁用上一页，末页禁用下一页', () => {
        const first = render(<Pagination total={50} pageSize={10} defaultCurrent={1} />);
        expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
        expect(screen.getByRole('button', { name: '下一页' })).toBeEnabled();
        first.unmount();

        render(<Pagination total={50} pageSize={10} defaultCurrent={5} />);
        expect(screen.getByRole('button', { name: '上一页' })).toBeEnabled();
        expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
    });

    it('showTotal 显示总条数', () => {
        render(<Pagination total={123} pageSize={10} showTotal />);
        expect(screen.getByText('共 123 条')).toBeInTheDocument();
    });

    it('受控模式：外部 current 不变时点击不跳页', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Pagination total={50} pageSize={10} current={1} onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: '2' }));
        expect(onChange).toHaveBeenCalledWith(2, 10);
        // 受控：未重渲染时高亮仍在第 1 页
        expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
        rerender(<Pagination total={50} pageSize={10} current={2} onChange={onChange} />);
        expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    });

    it('showSizeChanger 切换每页条数并回调 onShowSizeChange', () => {
        const onShowSizeChange = vi.fn();
        const onChange = vi.fn();
        render(
            <Pagination
                total={100}
                pageSize={10}
                current={10}
                showSizeChanger
                pageSizeOptions={[10, 20, 50]}
                onShowSizeChange={onShowSizeChange}
                onChange={onChange}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: '每页 10 条' }));
        fireEvent.click(screen.getByText('20 条/页'));
        // 100 条 / 20 条 = 5 页，原第 10 页收敛到第 5 页
        expect(onShowSizeChange).toHaveBeenCalledWith(5, 20);
        expect(onChange).toHaveBeenCalledWith(5, 20);
    });

    it('showQuickJumper 输入页码回车跳页，超界收敛', () => {
        const onChange = vi.fn();
        render(<Pagination total={100} pageSize={10} defaultCurrent={1} showQuickJumper onChange={onChange} />);
        const input = screen.getByRole('textbox', { name: '跳转到指定页' });
        fireEvent.change(input, { target: { value: '99' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith(10, 10);
        expect(input).toHaveValue('');
    });

    it('disabled 禁用全部交互', () => {
        render(<Pagination total={50} pageSize={10} defaultCurrent={2} disabled />);
        expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
        expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
        expect(screen.getByRole('button', { name: '3' })).toBeDisabled();
    });
});
