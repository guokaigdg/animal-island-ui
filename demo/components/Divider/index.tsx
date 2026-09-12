import React from 'react';
import { Divider } from '../../../src';
import { labelStyle, sectionStyle, sectionTitleStyle, DemoTag, ApiTable, ApiRow, CodeBlock } from '../../tools';

const DIVIDER_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '分隔线类型',
        type: `'dashed-brown' | 'thin' | 'hairline' | 'wave-yellow' | 'squiggle'`,
        defaultVal: "'dashed-brown'",
    },
    {
        prop: 'icon',
        desc: '指定单一图标名，渲染「图标 + 连接线」相连分割线（与 type 二选一，icon 优先）',
        type: `IconName（如 'Fish'）`,
        defaultVal: '-',
    },
    { prop: 'iconSize', desc: '图标大小（px）', type: 'number', defaultVal: '24' },
    { prop: 'iconGap', desc: '图标间距（px），即连接线长度', type: 'number', defaultVal: '8' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const ICON_DEMO_NAMES = [
    'Bee',
    'Fish',
    'Flower',
    'Watermelon',
    'Star',
    'Rainbow',
    'Cloud',
    'Cactus',
    'Cake',
    'Coffee',
] as const;

const DividerDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Divider <DemoTag>5 types + icon divider · pure CSS</DemoTag>
        </div>
        <div style={labelStyle}>dashed-brown（虚线棕色，默认）</div>
        <Divider type="dashed-brown" />
        <div style={labelStyle}>thin（1px 细线）</div>
        <Divider type="thin" />
        <div style={labelStyle}>hairline（1px 细密虚线）</div>
        <Divider type="hairline" />
        <div style={labelStyle}>wave-yellow（黄色波浪线）</div>
        <Divider type="wave-yellow" />
        <div style={labelStyle}>squiggle（主题青色波浪线）</div>
        <Divider type="squiggle" />
        <div style={labelStyle}>icon（单图标相连分割线）</div>
        {ICON_DEMO_NAMES.map((name) => (
            <div key={name} style={{ marginBottom: 16 }}>
                <Divider icon={name} />
            </div>
        ))}
        <CodeBlock
            code={`import React from 'react';
import { Divider } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 虚线（linear-gradient 绘制） */}
            <Divider type="dashed-brown" />

            {/* 1px 细线 */}
            <Divider type="thin" />
            <Divider type="hairline" />

            {/* 黄色波浪线 */}
            <Divider type="wave-yellow" />

            {/* 主题青色波浪线 */}
            <Divider type="squiggle" />

            {/* 单图标相连：图标 + 居中短连接线循环铺满 */}
            <Divider icon="Fish" />
            <Divider icon="Star" />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={DIVIDER_API} />
    </div>
);

export default DividerDemo;
