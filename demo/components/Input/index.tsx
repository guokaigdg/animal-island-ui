import React, { useState } from 'react';
import { Input } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const INPUT_API: ApiRow[] = [
    {
        prop: 'size',
        desc: '输入框尺寸',
        type: `'small' | 'middle' | 'large'`,
        defaultVal: "'middle'",
    },
    { prop: 'prefix', desc: '前缀图标', type: 'ReactNode', defaultVal: '-' },
    { prop: 'suffix', desc: '后缀图标', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'allowClear',
        desc: '允许清除',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'status',
        desc: '校验状态',
        type: `'error' | 'warning'`,
        defaultVal: '-',
    },
    {
        prop: 'shadow',
        desc: '是否显示阴影',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'onChange',
        desc: '值变化回调',
        type: 'ChangeEventHandler<HTMLInputElement>',
        defaultVal: '-',
    },
    { prop: 'onClear', desc: '清除回调', type: '() => void', defaultVal: '-' },
    {
        prop: '...',
        desc: '继承 React.InputHTMLAttributes',
        type: 'HTMLInputElement',
        defaultVal: '-',
    },
];

const S = {
    col: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    } as React.CSSProperties,
};

const InputDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Input <DemoTag>3 sizes</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>shadow 阴影控制</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="No shadow (default)" />
                    <Input placeholder="With shadow" shadow={true} />
                </div>
                <div style={labelStyle}>基础用法</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Basic input" />
                    <Input
                        placeholder="With clear"
                        allowClear
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClear={() => setInputValue('')}
                    />
                    <Input placeholder="Prefix & Suffix" prefix="🔍" suffix="⏎" />
                </div>
                <div style={labelStyle}>size 尺寸</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Small" size="small" />
                    <Input placeholder="Middle (default)" size="middle" />
                    <Input placeholder="Large" size="large" />
                </div>
                <div style={labelStyle}>status 校验状态</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Error status" status="error" />
                    <Input placeholder="Warning status" status="warning" />
                </div>
                <div style={labelStyle}>disabled 禁用</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Disabled" disabled />
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Input } from 'animal-island-ui';

const App = () => {
    const [val, setVal] = useState('');
    return (
        <div>
            {/* 基础输入框 */}
            <Input placeholder="Basic input" />
            {/* 带清除按钮 */}
            <Input placeholder="With clear" allowClear value={val} onChange={e => setVal(e.target.value)} />
            {/* 前后缀 */}
            <Input placeholder="Prefix" prefix="🔍" suffix="⏎" />
            {/* 小尺寸 */}
            <Input placeholder="Small" size="small" />
            {/* 大尺寸 */}
            <Input placeholder="Large" size="large" />
            {/* 错误状态 */}
            <Input placeholder="Error" status="error" />
            {/* 警告状态 */}
            <Input placeholder="Warning" status="warning" />
            {/* 有阴影 */}
            <Input placeholder="With shadow" shadow={true} />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={INPUT_API} />
        </div>
    );
};

export default InputDemo;
