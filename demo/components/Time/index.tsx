import React from 'react';
import { Time } from '../../../src';
import { ApiRow, ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const TIME_API: ApiRow[] = [
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义内联样式', type: 'React.CSSProperties', defaultVal: '-' },
    {
        prop: '...rest',
        desc: '其余 div 原生属性（id / aria-* 等）',
        type: 'React.HTMLAttributes<HTMLDivElement>',
        defaultVal: '-',
    },
];

const TimeDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Time <DemoTag>实时时钟</DemoTag>
        </div>

        <div style={labelStyle}>HUD 风格的实时时钟卡片，实时显示星期、月日与 HH:MM，每秒自动刷新。</div>
        <Time />

        <div style={labelStyle}>搭配 className 自定义：className 会合并到根节点，由使用方编写样式覆盖默认外观</div>
        <style>{`
            .my-time {
                background: linear-gradient(180deg, #fffdf4 0%, #e6f9f6 100%);
                border: 2px dashed var(--animal-primary-color, #19c8b9);
                border-radius: 24px;
            }
        `}</style>
        <Time className="my-time" aria-label="岛屿时间" />

        <CodeBlock
            code={`import { Time } from 'animal-island-ui';

<Time />
<Time className="my-time" aria-label="岛屿时间" />

/* 自定义外观由使用方提供 */
.my-time {
    background: linear-gradient(180deg, #fffdf4 0%, #e6f9f6 100%);
    border: 2px dashed var(--animal-primary-color, #19c8b9);
    border-radius: 24px;
}`}
        />
        <ApiTable rows={TIME_API} />
    </div>
);

export default TimeDemo;
