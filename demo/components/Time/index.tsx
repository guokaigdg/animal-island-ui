import React from 'react';
import { Time } from '../../../src';
import { ApiRow, ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const TIME_API: ApiRow[] = [
    { prop: 'weekdayFormat', desc: '星期格式（dayjs 核心 token）', type: 'string', defaultVal: "'dddd'" },
    {
        prop: 'dateFormat',
        desc: '月日格式（dayjs 核心 token）',
        type: 'string',
        defaultVal: "'MMM D'（zh-cn 下 'M月D日'）",
    },
    { prop: 'locale', desc: '日期行语言', type: `'en' | 'zh-cn'`, defaultVal: "'en'" },
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

        <div style={labelStyle}>中文日期：locale="zh-cn"（内置，无需额外注册）</div>
        <Time locale="zh-cn" />

        <div style={labelStyle}>用 dayjs token 定制星期与月日</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Time weekdayFormat="ddd" dateFormat="YYYY/MM/DD" />
            <Time locale="zh-cn" weekdayFormat="ddd" dateFormat="YYYY年M月D日" />
        </div>

        <div style={labelStyle}>
            搭配 className 自定义：className 合并到根节点，用 CSS 变量换色并覆盖背景、描边与字体
        </div>
        <style>{`
            .my-time {
                --animal-text-color: #fffdf4;
                --animal-text-color-disabled: #e0bd75;
                --animal-primary-color: #ffd166;
                --animal-primary-color-bg: #3d2a17;
                --animal-font-family: 'Noto Sans SC', 'Nunito', sans-serif;
                --animal-font-size-sm: 15px;

                background: linear-gradient(160deg, #0f4c46 0%, #137f74 55%, #19c8b9 100%);
                border: 2px dashed #ffd166;
                border-radius: 28px;
                padding: 24px 36px 18px;
                box-shadow: 0 14px 30px rgba(15, 76, 70, 0.28);
            }
        `}</style>
        <Time className="my-time" aria-label="岛屿时间" />

        <CodeBlock
            code={`import { Time } from 'animal-island-ui';

<Time />
<Time locale="zh-cn" />
<Time weekdayFormat="ddd" dateFormat="YYYY/MM/DD" />
<Time locale="zh-cn" weekdayFormat="ddd" dateFormat="YYYY年M月D日" />
<Time className="my-time" aria-label="岛屿时间" />`}
        />
        <div style={labelStyle}>自定义样式由使用方在 CSS 中提供</div>
        <CodeBlock
            code={`.my-time {
    /* 覆盖 Time 使用的设计变量：时钟/日期颜色、日期字号、字体 */
    --animal-text-color: #fffdf4;
    --animal-text-color-disabled: #e0bd75;
    --animal-primary-color: #ffd166;
    --animal-primary-color-bg: #3d2a17;
    --animal-font-family: 'Noto Sans SC', 'Nunito', sans-serif;
    --animal-font-size-sm: 15px;

    background: linear-gradient(160deg, #0f4c46 0%, #137f74 55%, #19c8b9 100%);
    border: 2px dashed #ffd166;
    border-radius: 28px;
    padding: 24px 36px 18px;
    box-shadow: 0 14px 30px rgba(15, 76, 70, 0.28);
}`}
        />
        <ApiTable rows={TIME_API} />
    </div>
);

export default TimeDemo;
