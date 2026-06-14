import React from 'react';
import { Icon, ICON_LIST, ITEM_LIST, ITEM_COUNT } from '../../../src';
import { ApiTable, ApiRow, sectionStyle, sectionTitleStyle, tagStyle, CodeBlock, labelStyle } from '../../tools';

const ICON_API: ApiRow[] = [
    {
        prop: 'name',
        desc: '图标名称（与 item 二选一）',
        type: 'IconName',
        defaultVal: '-',
    },
    {
        prop: 'item',
        desc: '物品图标编号（与 name 二选一）',
        type: 'number',
        defaultVal: '-',
    },
    {
        prop: 'size',
        desc: '图标尺寸',
        type: 'number | string',
        defaultVal: '24',
    },
    {
        prop: 'bounce',
        desc: '弹跳动画',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'className',
        desc: '自定义类名',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const IconDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Icon <span style={tagStyle}>10 icons</span>
        </div>
        <div style={labelStyle}>基础用法</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icon name="icon-miles" size={32} />
            <Icon name="icon-camera" size={32} />
            <Icon name="icon-chat" size={32} />
            <Icon name="icon-design" size={32} />
            <Icon name="icon-map" size={32} />
        </div>
        <div style={labelStyle}>size 尺寸</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="icon-miles" size={16} />
            <Icon name="icon-miles" size={24} />
            <Icon name="icon-miles" size={32} />
            <Icon name="icon-miles" size={48} />
        </div>
        <div style={labelStyle}>bounce 弹跳动画（鼠标悬停查看效果）</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="icon-miles" size={32} bounce />
            <Icon name="icon-camera" size={32} bounce />
            <Icon name="icon-chat" size={32} bounce />
        </div>
        <div style={labelStyle}>图标列表</div>
        <div
            style={{
                border: '1px solid #e8e2d6',
                borderRadius: 12,
                overflow: 'hidden',
                padding: '5px 16px',
                marginBottom: 20,
            }}
        >
            {ICON_LIST.map((icon, index) => (
                <div
                    key={icon.name}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: '12px 5px',
                        borderBottom: index < ICON_LIST.length - 1 ? '1px dashed #f0e8d8' : 'none',
                        background: '#fff',
                    }}
                >
                    <Icon name={icon.name} size={32} />
                    <span style={{ fontSize: 14, color: '#725d42', fontFamily: 'inherit' }}>{icon.label}</span>
                    <span
                        style={{
                            marginLeft: 'auto',
                            fontSize: 12,
                            color: '#a0936e',
                            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                        }}
                    >
                        {icon.name}
                    </span>
                </div>
            ))}
        </div>
        <div style={sectionTitleStyle}>
            Items <span style={tagStyle}>{ITEM_COUNT} items</span>
        </div>
        <div style={labelStyle}>
            {ITEM_COUNT} 个物品图标。通过 <code>item</code> 编号引用。
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Icon item={1} size={48} bounce />
            <Icon item={5} size={48} bounce />
            <Icon item={20} size={48} bounce />
            <Icon item={100} size={48} bounce />
            <Icon item={200} size={48} bounce />
            <Icon item={300} size={48} bounce />
            <Icon item={400} size={48} bounce />
            <Icon item={ITEM_LIST[ITEM_LIST.length - 1]} size={48} bounce />
        </div>
        <div style={labelStyle}>全部 {ITEM_COUNT} 个物品</div>
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                gap: 8,
                padding: 12,
                background: '#fff',
                border: '1px solid #e8e2d6',
                borderRadius: 12,
                maxHeight: 550,
                overflowY: 'auto',
            }}
        >
            {ITEM_LIST.map((id) => (
                <div
                    key={id}
                    title={`item={${id}}`}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        padding: '10px 12px 4px 12px',
                        background: '#faf6ec',
                        borderRadius: 8,
                    }}
                >
                    <Icon item={id} size={40} />
                    <span
                        style={{
                            fontSize: 10,
                            color: '#a0936e',
                            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                        }}
                    >
                        {id}
                    </span>
                </div>
            ))}
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Icon } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Icon name="icon-miles" size={32} />
            {/* 弹跳动画 */}
            <Icon name="icon-camera" size={48} bounce />
            {/* 物品图标（来自 figma Items 设计稿） */}
            <Icon item={1} size={48} />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={ICON_API} />
    </div>
);

export default IconDemo;
