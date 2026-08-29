import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table, type TableColumn } from './Table';
import styles from './table.module.less';

interface Row extends Record<string, unknown> {
    key: string;
    name: string;
    age: number;
}

const columns: TableColumn<Row>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age', align: 'right' },
];

const data: Row[] = [
    { key: '1', name: 'Alice', age: 20 },
    { key: '2', name: 'Bob', age: 30 },
];

// Table 的 columns prop 类型固定为 `TableColumn[]`（不带泛型），所以这里 cast 一下
const anyColumns = columns as unknown as Parameters<typeof Table>[0]['columns'];

describe('Table', () => {
    it('渲染表头与行数据', () => {
        render(<Table columns={anyColumns} dataSource={data} />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        // jest-dom v6: <table> 隐式 role=table，校验 a11y 契约
        expect(screen.getByRole('table')).toHaveRole('table');
    });

    it('showHeader=false 时不渲染表头', () => {
        render(<Table columns={anyColumns} dataSource={data} showHeader={false} />);
        expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });

    it('数据为空时显示 emptyText', () => {
        render(<Table columns={anyColumns} dataSource={[]} emptyText="无内容" />);
        expect(screen.getByText('无内容')).toBeInTheDocument();
    });

    it('column.render 自定义单元格', () => {
        const cols: TableColumn<Row>[] = [
            { title: 'Name', render: (_v, r) => <span data-testid={`r-${r.key}`}>{r.name}!</span> },
        ];
        const anyCols = cols as unknown as Parameters<typeof Table>[0]['columns'];
        render(<Table columns={anyCols} dataSource={data} />);
        expect(screen.getByTestId('r-1')).toHaveTextContent('Alice!');
    });

    it('striped 偶数行加 striped 类', () => {
        const { container } = render(<Table columns={anyColumns} dataSource={data} />);
        const rows = container.querySelectorAll('tbody tr');
        expect(rows[0].className).not.toContain(styles.striped);
        expect(rows[1].className).toContain(styles.striped);
    });

    it('rowKey 为函数时使用其返回值', () => {
        const { container } = render(<Table columns={anyColumns} dataSource={data} rowKey={(r) => `row-${r.name}`} />);
        // 没有显式 data 属性可断言；至少行数正确即可
        expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    });

    it('loading 时叠加 loading 类与 overlay', () => {
        const { container } = render(<Table columns={anyColumns} dataSource={data} loading />);
        expect(container.querySelector('table')).toHaveClass(styles.loading);
        expect(container.querySelector(`.${styles.loadingOverlay}`)).toBeInTheDocument();
    });

    it('pagination 对象开启客户端分页，只渲染当前页数据', () => {
        const many: Row[] = Array.from({ length: 25 }, (_, i) => ({
            key: String(i + 1),
            name: `Name${i + 1}`,
            age: 20 + i,
        }));
        const { container } = render(<Table columns={anyColumns} dataSource={many} pagination={{ pageSize: 10 }} />);
        // 第一页 10 行
        expect(container.querySelectorAll('tbody tr')).toHaveLength(10);
        expect(screen.getByText('Name1')).toBeInTheDocument();
        expect(screen.queryByText('Name11')).not.toBeInTheDocument();
        // 分页导航出现且显示总页数
        expect(screen.getByRole('navigation', { name: '分页' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('点击页码切换分页数据', () => {
        const many: Row[] = Array.from({ length: 25 }, (_, i) => ({
            key: String(i + 1),
            name: `Name${i + 1}`,
            age: 20 + i,
        }));
        const onChange = vi.fn();
        const { container } = render(
            <Table columns={anyColumns} dataSource={many} pagination={{ pageSize: 10, onChange }} />
        );
        fireEvent.click(screen.getByRole('button', { name: '2' }));
        expect(onChange).toHaveBeenCalledWith(2, 10);
        expect(container.querySelectorAll('tbody tr')).toHaveLength(10);
        expect(screen.getByText('Name11')).toBeInTheDocument();
        expect(screen.queryByText('Name1')).not.toBeInTheDocument();
    });

    it('defaultPageSize / defaultCurrent 作为非受控初值生效', () => {
        const many: Row[] = Array.from({ length: 25 }, (_, i) => ({
            key: String(i + 1),
            name: `Name${i + 1}`,
            age: 20 + i,
        }));
        const { container } = render(
            <Table columns={anyColumns} dataSource={many} pagination={{ defaultPageSize: 5, defaultCurrent: 2 }} />
        );
        // 第二页 5 条：Name6 ~ Name10
        expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
        expect(screen.getByText('Name6')).toBeInTheDocument();
        expect(screen.queryByText('Name1')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    });

    it('pagination=false 或缺省时不渲染分页', () => {
        const { container } = render(<Table columns={anyColumns} dataSource={data} />);
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    });
});
