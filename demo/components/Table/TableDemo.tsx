import React, { useState } from 'react';
import { Table, Button } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    tagStyle,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const TableDemo: React.FC = () => {
    const [striped, setStriped] = useState(true);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '岛民',
            dataIndex: 'name',
            width: 120,
        },
        {
            title: '年龄',
            dataIndex: 'age',
            width: 80,
            align: 'center' as const,
        },
        {
            title: '岛屿',
            dataIndex: 'island',
        },
        {
            title: '喜欢的水果',
            dataIndex: 'fruit',
        },
        {
            title: '爱好',
            dataIndex: 'hobby',
            render: (value: unknown) => {
                const hobby = value as string;
                const tagStyles: Record<string, { bg: string; color: string }> = {
                    音乐: { bg: 'rgba(147, 112, 219, 0.15)', color: '#9370db' },
                    运动: { bg: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' },
                    唱歌: { bg: 'rgba(255, 99, 71, 0.15)', color: '#ff6347' },
                    钓鱼: { bg: 'rgba(30, 144, 255, 0.15)', color: '#1e90ff' },
                    画画: { bg: 'rgba(255, 105, 180, 0.15)', color: '#ff69b4' },
                };
                const style = tagStyles[hobby] || { bg: 'rgba(25, 200, 185, 0.15)', color: '#19c8b9' };
                return (
                    <span
                        style={{
                            padding: '4px 12px',
                            background: style.bg,
                            borderRadius: 20,
                            color: style.color,
                            fontWeight: 600,
                            fontSize: 12,
                        }}
                    >
                        {hobby}
                    </span>
                );
            },
        },
    ];

    const dataSource = [
        { key: '1', name: '豆狸', age: 26, island: '彩虹岛', fruit: '苹果', hobby: '音乐' },
        { key: '2', name: '粒狸', age: 24, island: '彩虹岛', fruit: '橘子', hobby: '运动' },
        { key: '3', name: '西施惠', age: 28, island: '好评岛', fruit: '樱桃', hobby: '唱歌' },
        { key: '4', name: '喻哥', age: 30, island: '无人岛', fruit: '梨', hobby: '钓鱼' },
        { key: '5', name: '小润', age: 22, island: '摸鱼岛', fruit: '桃子', hobby: '画画' },
    ] as Record<string, unknown>[];

    const handleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Table <span style={tagStyle}>表格</span>
            </div>
            <div style={labelStyle}>数据表格组件，支持斑马纹、边框、加载状态等常用功能。</div>

            <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Button type={striped ? 'primary' : 'default'} onClick={() => setStriped(!striped)}>
                    斑马纹 {striped ? '✓' : '✗'}
                </Button>
                <Button type="primary" onClick={handleLoading} disabled={loading}>
                    {loading ? '加载中...' : '模拟加载'}
                </Button>
            </div>

            <div style={{ ...demoBodyStyle, padding: 0, overflow: 'hidden' }}>
                <Table columns={columns} dataSource={dataSource} striped={striped} loading={loading} />
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Table } from 'animal-island-ui';

interface Person {
    key: string;
    name: string;
    age: number;
    island: string;
    fruit: string;
    hobby: string;
}

const columns = [
    {
        title: '岛民',
        dataIndex: 'name',
        width: 120,
    },
    {
        title: '年龄',
        dataIndex: 'age',
        width: 80,
        align: 'center',
    },
    {
        title: '岛屿',
        dataIndex: 'island',
    },
    {
        title: '喜欢的水果',
        dataIndex: 'fruit',
    },
    {
        title: '爱好',
        dataIndex: 'hobby',
        render: (value) => (
            <span style={{
                padding: '4px 12px',
                background: 'rgba(25, 200, 185, 0.15)',
                borderRadius: 20,
                color: '#19c8b9',
            }}>
                {value}
            </span>
        ),
    },
];

const data = [
    { key: '1', name: '豆狸', age: 26, island: '彩虹岛', fruit: '苹果', hobby: '音乐' },
    { key: '2', name: '粒狸', age: 24, island: '彩虹岛', fruit: '橘子', hobby: '运动' },
    { key: '3', name: '西施惠', age: 28, island: '好评岛', fruit: '樱桃', hobby: '唱歌' },
];

const App = () => {
    const [striped, setStriped] = useState(true);

    return (
        <Table
            columns={columns}
            dataSource={data}
            striped={striped}
        />
    );
};`}
            />
            <ApiTable rows={TABLE_API} />
        </div>
    );
};

const TABLE_API: ApiRow[] = [
    { prop: 'columns', desc: '表格列配置', type: 'TableColumn[]', defaultVal: '[]' },
    { prop: 'dataSource', desc: '表格数据源', type: 'T[]', defaultVal: '[]' },
    { prop: 'rowKey', desc: '行唯一标识字段名或函数', type: 'string | (record) => string', defaultVal: 'key' },
    { prop: 'striped', desc: '是否显示斑马纹', type: 'boolean', defaultVal: 'true' },
    { prop: 'showHeader', desc: '是否显示表头', type: 'boolean', defaultVal: 'true' },
    { prop: 'loading', desc: '加载状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'emptyText', desc: '空数据显示文本', type: 'ReactNode', defaultVal: '暂无数据' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default TableDemo;
