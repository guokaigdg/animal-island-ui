import React from 'react';
import { Icon, ICON_LIST } from '../../../src';
import { ApiTable, ApiRow, sectionStyle, sectionTitleStyle, DemoTag, CodeBlock, labelStyle } from '../../tools';
import customImage from '../../img/placeholder-island.svg';

const ICON_API: ApiRow[] = [
    {
        prop: 'name',
        desc: '内置图标名称（与 src 二选一）',
        type: 'IconName',
        defaultVal: '-',
    },
    {
        prop: 'src',
        desc: '自定义图标资源 URL（与 name 二选一），由消费者自行 import 传入',
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
            Icon <DemoTag>built-in icons</DemoTag>
        </div>
        <div style={labelStyle}>基础用法</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icon name="icon-left" size={32} />
            <Icon name="icon-right" size={32} />
            <Icon name="location" size={32} />
            <Icon name="page" size={32} />
            <Icon name="wifi" size={32} />
        </div>
        <div style={labelStyle}>size 尺寸</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="wifi" size={16} />
            <Icon name="wifi" size={24} />
            <Icon name="wifi" size={32} />
            <Icon name="wifi" size={48} />
        </div>
        <div style={labelStyle}>bounce 弹跳动画（鼠标悬停查看效果）</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="location" size={32} bounce />
            <Icon name="page" size={32} bounce />
            <Icon name="wifi" size={32} bounce />
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
            Custom images <DemoTag>src mode</DemoTag>
        </div>
        <div style={labelStyle}>
            自定义图片通过 <code>src</code> 传入：消费者自行 <code>import</code> 任意图片资源，按需进 bundle。
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon src={customImage} size={48} bounce />
            <Icon src={customImage} size={64} />
        </div>
        <CodeBlock
            code={`import { Icon } from 'animal-island-ui';
import myIcon from './my-icon.svg';

export default function App() {
    return <Icon src={myIcon} size={48} />;
}`}
        />
        <CodeBlock
            code={`import React from 'react';
import { Icon } from 'animal-island-ui';
import myIcon from './my-icon.svg';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Icon name="wifi" size={32} />
            {/* 弹跳动画 */}
            <Icon name="location" size={48} bounce />
            {/* 自定义图片 */}
            <Icon src={myIcon} size={48} />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={ICON_API} />
    </div>
);

export default IconDemo;
