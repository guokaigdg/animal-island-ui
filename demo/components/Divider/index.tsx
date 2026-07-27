import React from 'react';
import { Divider } from '../../../src';
import { labelStyle, sectionStyle, sectionTitleStyle, DemoTag, ApiTable, ApiRow, CodeBlock } from '../../tools';

const DIVIDER_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '分隔线类型',
        type: `'line-brown' | 'line-teal' | 'line-white' | 'line-yellow' | 'wave-yellow'`,
        defaultVal: "'line-brown'",
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const DividerDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Divider <DemoTag>9 types</DemoTag>
        </div>
        <div style={labelStyle}>line-brown（实线棕色）</div>
        <Divider type="line-brown" />
        <div style={labelStyle}>line-teal（实线青色）</div>
        <Divider type="line-teal" />
        <div style={labelStyle}>line-white（实线白色）</div>
        <div style={{ background: '#333', padding: 10 }}>
            <Divider type="line-white" />
        </div>
        <div style={labelStyle}>line-yellow（实线黄色）</div>
        <Divider type="line-yellow" />
        <div style={labelStyle}>wave-yellow（波浪线黄色）</div>
        <Divider type="wave-yellow" />
        <div style={labelStyle}>dashed-brown（虚线棕色）</div>
        <Divider type="dashed-brown" />
        <div style={labelStyle}>dashed-teal（虚线青色）</div>
        <Divider type="dashed-teal" />
        <div style={labelStyle}>dashed-white（虚线白色）</div>
        <div style={{ background: '#333', padding: 10 }}>
            <Divider type="dashed-white" />
        </div>
        <div style={labelStyle}>dashed-yellow（虚线黄色）</div>
        <Divider type="dashed-yellow" />
        <CodeBlock
            code={`import React from 'react';
import { Divider } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 实线类型 */}
            <Divider type="line-brown" />
            <Divider type="line-teal" />
            <Divider type="line-white" />
            <Divider type="line-yellow" />
            {/* 波浪线 */}
            <Divider type="wave-yellow" />
            {/* 虚线类型 */}
            <Divider type="dashed-brown" />
            <Divider type="dashed-teal" />
            <Divider type="dashed-white" />
            <Divider type="dashed-yellow" />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={DIVIDER_API} />
    </div>
);

export default DividerDemo;
