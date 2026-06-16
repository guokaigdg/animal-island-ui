import React from 'react';
import { Icon, ICON_LIST } from '../../../src';
import { ApiTable, ApiRow, sectionStyle, sectionTitleStyle, tagStyle, CodeBlock, labelStyle } from '../../tools';

// 模拟真实消费者：只用到一个物品图标时，直接静态 import 那一个 PNG。
import singleItem from '../../../src/assets/img/icons/items/item-001.png';

// item PNG 不再随库打包，由消费者按需 import。Demo 侧本地 glob 演示用法。
const itemModules = import.meta.glob('../../../src/assets/img/icons/items/item-*.png', {
    query: '?url',
    import: 'default',
    eager: true,
}) as Record<string, string>;
const ITEM_SRCS: string[] = Object.entries(itemModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
const ITEM_COUNT = ITEM_SRCS.length;

const ICON_API: ApiRow[] = [
    {
        prop: 'name',
        desc: '图标名称（与 item 二选一）',
        type: 'IconName',
        defaultVal: '-',
    },
    {
        prop: 'src',
        desc: '自定义图标资源 URL（与 name 二选一），物品图标等需消费者自行 import 传入',
        type: 'string',
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
            只用一个物品图标（最常见场景）：静态 <code>import</code> 那一个 PNG，按需进 bundle。
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon src={singleItem} size={48} bounce />
        </div>
        <CodeBlock
            code={`import { Icon } from 'animal-island-ui';
// 物品图标随库发布在 items/ 子路径下，按需 import —— 只有它会进 bundle
import item001 from 'animal-island-ui/items/item-001.png';

export default function App() {
    return <Icon src={item001} size={48} />;
}`}
        />
        <div style={labelStyle}>
            {ITEM_COUNT} 个物品图标。这些图随库发布在 <code>animal-island-ui/items/</code> 子路径下，由消费者按需{' '}
            <code>import</code> 后通过 <code>src</code> 传入，仅被引用的图片才进 bundle。
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Icon src={ITEM_SRCS[0]} size={48} bounce />
            <Icon src={ITEM_SRCS[4]} size={48} bounce />
            <Icon src={ITEM_SRCS[19]} size={48} bounce />
            <Icon src={ITEM_SRCS[99]} size={48} bounce />
            <Icon src={ITEM_SRCS[199]} size={48} bounce />
            <Icon src={ITEM_SRCS[299]} size={48} bounce />
            <Icon src={ITEM_SRCS[399]} size={48} bounce />
            <Icon src={ITEM_SRCS[ITEM_SRCS.length - 1]} size={48} bounce />
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
            {ITEM_SRCS.map((src, idx) => (
                <div
                    key={src}
                    title={`item-${String(idx + 1).padStart(3, '0')}.png`}
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
                    <Icon src={src} size={40} />
                    <span
                        style={{
                            fontSize: 10,
                            color: '#a0936e',
                            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                        }}
                    >
                        {idx + 1}
                    </span>
                </div>
            ))}
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Icon } from 'animal-island-ui';
// 物品图标随库发布在 items/ 子路径下，按需 import
import item001 from 'animal-island-ui/items/item-001.png';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Icon name="icon-miles" size={32} />
            {/* 弹跳动画 */}
            <Icon name="icon-camera" size={48} bounce />
            {/* 物品图标 */}
            <Icon src={item001} size={48} />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={ICON_API} />
    </div>
);

export default IconDemo;
