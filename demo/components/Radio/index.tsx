import React, { useState } from 'react';
import { Radio } from '../../../src';
import {
    labelStyle,
    ApiTable,
    CodeBlock,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    tagStyle,
    demoBoxStyle,
} from '../../tools';

const RADIO_API: ApiRow[] = [
    { prop: 'options', desc: '选项列表', type: 'RadioOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '受控选中值', type: 'string | number', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中值', type: 'string | number', defaultVal: '-' },
    { prop: 'size', desc: '尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    { prop: 'disabled', desc: '禁用全部选项', type: 'boolean', defaultVal: 'false' },
    { prop: 'direction', desc: '排列方向', type: "'horizontal' | 'vertical'", defaultVal: "'horizontal'" },
    { prop: 'onChange', desc: '选中值变化回调', type: '(value: string | number) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

const seasonOptions = [
    { label: '🌸 春天', value: 'spring' },
    { label: '☀️ 夏天', value: 'summer' },
    { label: '🍁 秋天', value: 'autumn' },
    { label: '❄️ 冬天', value: 'winter' },
];

const fruitOptions = [
    { label: '🍎 苹果', value: 'apple' },
    { label: '🍊 橙子', value: 'orange' },
    { label: '🍑 桃子', value: 'peach' },
    { label: '🍐 梨子', value: 'pear', disabled: true },
    { label: '🍒 樱桃', value: 'cherry' },
];

const timeOptions = [
    { label: '🌅 早晨', value: 'morning' },
    { label: '🌞 中午', value: 'noon' },
    { label: '🌇 傍晚', value: 'evening' },
    { label: '🌙 深夜', value: 'night' },
];

const RadioDemo: React.FC = () => {
    const [selected1, setSelected1] = useState<string | number>('spring');
    const [selected2, setSelected2] = useState<string | number>('');
    const [selected3, setSelected3] = useState<string | number>('noon');

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Radio <span style={tagStyle}>单选框</span>
            </div>

            <div style={labelStyle}>水平排列（受控）— 支持方向键 ↑↓←→ 切换</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                已选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {seasonOptions.find((o) => o.value === selected1)?.label ?? '无'}
                </span>
            </div>
            <div style={demoBoxStyle}>
                <Radio options={seasonOptions} value={selected1} onChange={setSelected1} style={{ gap: 20 }} />
            </div>

            <div style={labelStyle}>垂直排列 + 含禁用选项</div>
            <div style={demoBoxStyle}>
                <Radio
                    options={fruitOptions}
                    value={selected2}
                    onChange={setSelected2}
                    direction="vertical"
                    style={{ gap: 12 }}
                />
            </div>

            <div style={labelStyle}>三种尺寸对比</div>
            <div style={demoBoxStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Radio options={timeOptions} defaultValue="morning" size="small" />
                    <Radio options={timeOptions} defaultValue="noon" size="middle" />
                    <Radio options={timeOptions} defaultValue="night" size="large" />
                </div>
            </div>

            <div style={labelStyle}>3D 按键感 — 点击体验下压反馈</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                已选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {timeOptions.find((o) => o.value === selected3)?.label ?? '无'}
                </span>
            </div>
            <div style={demoBoxStyle}>
                <Radio options={timeOptions} value={selected3} onChange={setSelected3} size="large" />
            </div>

            <div style={labelStyle}>全部禁用</div>
            <div style={demoBoxStyle}>
                <Radio options={seasonOptions} defaultValue="winter" disabled />
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Radio } from 'animal-island-ui';

const options = [
    { label: '🌸 春天', value: 'spring' },
    { label: '☀️ 夏天', value: 'summer' },
    { label: '🍁 秋天', value: 'autumn' },
    { label: '❄️ 冬天', value: 'winter' },
];

const App = () => {
    const [value, setValue] = useState('spring');
    return (
        <div>
            {/* 非受控 */}
            <Radio options={options} defaultValue="spring" />
            {/* 受控 */}
            <Radio options={options} value={value} onChange={setValue} />
            {/* 垂直排列 */}
            <Radio options={options} direction="vertical" />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={RADIO_API} />
        </div>
    );
};

export default RadioDemo;
