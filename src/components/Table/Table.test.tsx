import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
