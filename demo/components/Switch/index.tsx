import React, { useState } from 'react';
import { Switch } from '../../../src';
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

const SWITCH_API: ApiRow[] = [
    {
        prop: 'checked',
        desc: '是否选中（受控）',
        type: 'boolean',
        defaultVal: '-',
    },
    {
        prop: 'defaultChecked',
        desc: '默认是否选中',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'size',
        desc: '尺寸',
        type: `'small' | 'default'`,
        defaultVal: "'default'",
    },
    { prop: 'disabled', desc: '禁用', type: 'boolean', defaultVal: 'false' },
    { prop: 'loading', desc: '加载状态', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'checkedChildren',
        desc: '选中时文案',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'unCheckedChildren',
        desc: '未选中时文案',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'onChange',
        desc: '变化回调',
        type: '(checked: boolean) => void',
        defaultVal: '-',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
];

const SwitchDemo: React.FC = () => {
    const [switchChecked, setSwitchChecked] = useState(false);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Switch <DemoTag>2 sizes</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>基础用法</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch checked={switchChecked} onChange={setSwitchChecked} />
                    <span style={{ fontSize: 13 }}>{switchChecked ? 'ON' : 'OFF'}</span>
                </div>
                <div style={labelStyle}>checkedChildren / unCheckedChildren 自定义文案</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
                    <Switch defaultChecked checkedChildren="☀️" unCheckedChildren="🌙" />
                </div>
                <div style={labelStyle}>size 尺寸</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch defaultChecked />
                    <Switch size="small" defaultChecked />
                </div>
                <div style={labelStyle}>disabled / loading 状态</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch disabled />
                    <Switch loading defaultChecked />
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Switch } from 'animal-island-ui';

const App = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div>
            {/* 受控模式 */}
            <Switch checked={checked} onChange={setChecked} />
            {/* 自定义文案 */}
            <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            {/* 小尺寸 */}
            <Switch size="small" defaultChecked />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={SWITCH_API} />
        </div>
    );
};

export default SwitchDemo;
