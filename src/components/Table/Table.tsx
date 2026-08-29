import React, { HTMLAttributes, useState } from 'react';
import { Pagination, type PaginationProps } from '../Pagination';
import styles from './table.module.less';

export interface TableColumn<T = Record<string, unknown>> {
    title: React.ReactNode;
    dataIndex?: keyof T;
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    style?: React.CSSProperties;
}

export interface TableProps {
    columns?: TableColumn[];
    dataSource?: Record<string, unknown>[];
    rowKey?: string | ((record: Record<string, unknown>) => string);
    striped?: boolean;
    showHeader?: boolean;
    rowClassName?: string | ((record: Record<string, unknown>, index: number) => string);
    onRow?: (record: Record<string, unknown>, index: number) => HTMLAttributes<HTMLTableRowElement>;
    loading?: boolean;
    emptyText?: React.ReactNode;
    scroll?: {
        x?: number | string;
        y?: number | string;
    };
    /** 分页配置；传入对象开启客户端分页，false 或缺省不分页（total 由 Table 内部按数据量计算，无需传入） */
    pagination?: false | Omit<PaginationProps, 'total'>;
    className?: string;
    style?: React.CSSProperties;
}

export const Table: React.FC<TableProps> = ({
    columns = [],
    dataSource = [],
    rowKey = 'key',
    striped = true,
    showHeader = true,
    rowClassName,
    onRow,
    loading = false,
    emptyText = '暂无数据',
    scroll,
    pagination,
    className,
    style,
}) => {
    // 分页状态：pagination.current / pagination.pageSize 受控时优先，否则走内部状态（初值取 default*）
    const paginated = pagination !== false && pagination !== undefined;
    const [innerPage, setInnerPage] = useState(() => (paginated ? (pagination.defaultCurrent ?? 1) : 1));
    const [innerPageSize, setInnerPageSize] = useState(() => (paginated ? (pagination.defaultPageSize ?? 10) : 10));
    const pageSize = paginated ? (pagination.pageSize ?? innerPageSize) : dataSource.length;
    const pageCount = Math.max(1, Math.ceil(dataSource.length / Math.max(1, pageSize)));
    const currentPage = paginated ? Math.min(pagination.current ?? innerPage, pageCount) : 1;
    const pageData = paginated ? dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize) : dataSource;
    const getRowKey = (record: Record<string, unknown>, index: number): string => {
        if (typeof rowKey === 'function') {
            return rowKey(record);
        }
        return (record[rowKey] as string) || String(index);
    };

    const getRowClassName = (record: Record<string, unknown>, index: number): string => {
        const classNames: string[] = [styles.row];
        if (striped && index % 2 === 1) {
            classNames.push(styles.striped);
        }
        if (rowClassName) {
            if (typeof rowClassName === 'function') {
                classNames.push(rowClassName(record, index));
            } else {
                classNames.push(rowClassName);
            }
        }
        return classNames.join(' ');
    };

    const renderCell = (column: TableColumn, record: Record<string, unknown>, index: number) => {
        const value = column.dataIndex ? record[column.dataIndex as string] : undefined;
        if (column.render) {
            return column.render(value, record, index);
        }
        return value as React.ReactNode;
    };

    const tableCls = [styles.table, loading && styles.loading, className].filter(Boolean).join(' ');

    const tableWrapperCls = [styles.wrapper, scroll && styles.scrollable].filter(Boolean).join(' ');

    return (
        <div className={tableWrapperCls} style={style}>
            <table className={tableCls}>
                {showHeader && (
                    <thead className={styles.thead}>
                        <tr className={styles.headerRow}>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={styles.headerCell}
                                    style={{
                                        width: column.width,
                                        textAlign: column.align || 'left',
                                        ...column.style,
                                    }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody className={styles.tbody}>
                    {dataSource.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.emptyCell}>
                                <div className={styles.emptyContent}>
                                    <svg className={styles.emptyIcon} viewBox="0 0 24 24" width="48" height="48">
                                        <path
                                            fill="currentColor"
                                            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
                                        />
                                    </svg>
                                    <span>{emptyText}</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        pageData.map((record, index) => (
                            <tr
                                key={getRowKey(record, index)}
                                className={getRowClassName(record, index)}
                                {...onRow?.(record, index)}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={styles.cell}
                                        style={{
                                            textAlign: column.align || 'left',
                                            ...column.style,
                                        }}
                                    >
                                        {renderCell(column, record, index)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {paginated && (
                <div className={styles.paginationWrapper}>
                    <Pagination
                        {...pagination}
                        total={dataSource.length}
                        current={currentPage}
                        pageSize={pageSize}
                        onChange={(page, size) => {
                            if (pagination.current === undefined) setInnerPage(page);
                            if (pagination.pageSize === undefined) setInnerPageSize(size);
                            pagination.onChange?.(page, size);
                        }}
                    />
                </div>
            )}
            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}>
                        <svg viewBox="0 0 50 50" width="40" height="40">
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="31.4 31.4"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

Table.displayName = 'Table';
