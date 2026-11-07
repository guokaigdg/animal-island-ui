import React, { useState } from 'react';
import { FolderIcon } from 'naive-icons';
import { Button, Input, NoData, Table } from '../../../src';
import { ApiTable, CodeBlock, type ApiRow, sectionStyle, sectionTitleStyle } from '../../tools';
import { NoDataAppearanceDemo } from './NoDataAppearanceDemo';

/** 空状态公开属性与原生 div 属性兼容。 */
const API: ApiRow[] = [
    {
        prop: 'variant',
        desc: '默认 / 搜索无结果 / 简洁',
        type: "'default' | 'search' | 'simple'",
        defaultVal: "'default'",
    },
    { prop: 'size', desc: '尺寸', type: "'small' | 'medium' | 'large'", defaultVal: "'medium'" },
    { prop: 'title', desc: '标题，null 隐藏', type: 'ReactNode', defaultVal: '暂无数据 / 没有找到相关结果' },
    { prop: 'description', desc: '补充说明', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'icon',
        desc: '自定义装饰图标，null / false 隐藏',
        type: 'ReactNode',
        defaultVal: 'NoDataIcon / SearchIcon',
    },
    { prop: 'extra / children', desc: '操作区，extra 优先；推荐复用 Button', type: 'ReactNode', defaultVal: '-' },
    { prop: 'bordered', desc: '奶油背景与沙色虚线边框', type: 'boolean', defaultVal: 'false' },
];

/** 独立空态演示：默认、搜索恢复、表格嵌入与自定义内容均可直接复用。 */
const NoDataDemo: React.FC = () => {
    const [query, setQuery] = useState('星星');
    const [created, setCreated] = useState(false);
    const islands = ['薄荷岛', '蜜桃岛', '珊瑚岛'].filter((name) => name.includes(query));
    // 演示操作只维护本地数据，使恢复动作有真实结果，无需外部服务。
    return (
        <div>
            <NoDataAppearanceDemo />
            <section style={sectionStyle}>
                <div style={{ ...sectionTitleStyle, marginBottom: 20 }}>基础空态</div>
                <NoData description="这里还没有记录，新的故事可以从现在开始。" />
                <CodeBlock code={`<NoData description="这里还没有记录，新的故事可以从现在开始。" />`} />
            </section>
            <section style={sectionStyle}>
                <div style={{ ...sectionTitleStyle, marginBottom: 20 }}>搜索无结果与恢复</div>
                <Input
                    aria-label="搜索岛屿"
                    placeholder="搜索岛屿名称"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <div role="status" aria-live="polite" aria-atomic="true" style={{ marginTop: 12 }}>
                    {islands.length ? `找到 ${islands.length} 个岛屿` : `没有找到“${query}”相关的岛屿`}
                </div>
                {islands.length ? (
                    <ul aria-label="岛屿搜索结果">
                        {islands.map((name) => (
                            <li key={name}>{name}</li>
                        ))}
                    </ul>
                ) : (
                    <NoData
                        variant="search"
                        title={`没有找到“${query}”`}
                        description="试试其他名称，或清除条件查看全部岛屿。"
                        extra={<Button onClick={() => setQuery('')}>清除搜索</Button>}
                    />
                )}
                <CodeBlock
                    code={`<NoData variant="search" description="试试其他名称，或清除条件查看全部岛屿。"
    extra={<Button onClick={clearSearch}>清除搜索</Button>} />`}
                />
            </section>
            <section style={sectionStyle}>
                <div style={{ ...sectionTitleStyle, marginBottom: 20 }}>表格内的简洁空态</div>
                <Table
                    columns={[{ title: '岛屿手账', dataIndex: 'name' }]}
                    dataSource={created ? [{ key: '1', name: '第一篇海岛手账' }] : []}
                    emptyText={
                        <NoData variant="simple" size="small" icon={null} description="写下今天的第一件小事。">
                            <Button size="small" onClick={() => setCreated(true)}>
                                新建手账
                            </Button>
                        </NoData>
                    }
                />
                {created && (
                    <Button size="small" onClick={() => setCreated(false)} style={{ marginTop: 12 }}>
                        重新体验空态
                    </Button>
                )}
                <CodeBlock
                    code={`<Table columns={columns} dataSource={[]}
    emptyText={<NoData variant="simple" size="small" icon={null} description="写下今天的第一件小事。">
        <Button size="small" onClick={createNote}>新建手账</Button>
    </NoData>} />`}
                />
            </section>
            <section style={sectionStyle}>
                <div style={{ ...sectionTitleStyle, marginBottom: 20 }}>尺寸与自定义内容</div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                        gap: 20,
                    }}
                >
                    <NoData size="small" bordered title="小尺寸" description="适合列表与卡片内部" />
                    <NoData bordered title="标准尺寸" description="适合常规内容区" />
                    <NoData size="large" bordered title="大尺寸" description="适合整页空态" />
                </div>
                <NoData
                    icon={<FolderIcon color="currentColor" />}
                    title="收藏夹还是空的"
                    description="遇到喜欢的内容时，记得收藏到这里。"
                    style={{ marginTop: 24 }}
                />
                <NoData
                    icon={null}
                    title="仅文字提示"
                    description="图标、标题、说明和操作区都可以单独配置。"
                    style={{ marginTop: 24 }}
                />
                <CodeBlock
                    code={`<NoData size="large" bordered icon={<FolderIcon color="currentColor" />}
    title="收藏夹还是空的" description="遇到喜欢的内容时，记得收藏到这里。" />
<NoData icon={null} title="仅文字提示" />`}
                />
            </section>
            <ApiTable rows={API} />
        </div>
    );
};

NoDataDemo.displayName = 'NoDataDemo';
export default NoDataDemo;
