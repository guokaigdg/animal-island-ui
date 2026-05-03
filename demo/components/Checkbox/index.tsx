import React, { useState } from 'react';
import { Checkbox } from '../../../src';
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

const CHECKBOX_API: ApiRow[] = [
    { prop: 'options', desc: '选项列表', type: 'CheckboxOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '受控选中值列表', type: 'Array<string | number>', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中值列表', type: 'Array<string | number>', defaultVal: '[]' },
    { prop: 'size', desc: '尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    { prop: 'disabled', desc: '禁用全部选项', type: 'boolean', defaultVal: 'false' },
    { prop: 'direction', desc: '排列方向', type: "'horizontal' | 'vertical'", defaultVal: "'horizontal'" },
    { prop: 'onChange', desc: '选中值变化回调', type: '(values: Array<string | number>) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

const islandOptions = [
    { label: '🌊 海滩', value: 'beach' },
    { label: '🌳 森林', value: 'forest' },
    { label: '🌸 花园', value: 'garden' },
    { label: '🏡 村庄', value: 'village' },
];

const critterOptions = [
    { label: '🦋 蝴蝶', value: 'butterfly' },
    { label: '🐟 鲈鱼', value: 'bass' },
    { label: '🦀 螃蟹', value: 'crab', disabled: true },
    { label: '🐛 毛毛虫', value: 'caterpillar' },
    { label: '🌊 水母', value: 'jellyfish' },
];

const CheckboxDemo: React.FC = () => {
    const [selected1, setSelected1] = useState<Array<string | number>>(['beach', 'garden']);
    const [selected2, setSelected2] = useState<Array<string | number>>([]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Checkbox <span style={tagStyle}>基础用法</span>
            </div>

            <div style={labelStyle}>默认水平排列（受控）</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                已选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {selected1.length > 0
                        ? islandOptions
                              .filter((o) => selected1.includes(o.value))
                              .map((o) => o.label)
                              .join('、')
                        : '无'}
                </span>
            </div>
            <div style={demoBoxStyle}>
                <Checkbox options={islandOptions} value={selected1} onChange={setSelected1} style={{ gap: 20 }} />
            </div>

            <div style={labelStyle}>垂直排列 + 含禁用选项</div>
            <div style={demoBoxStyle}>
                <Checkbox
                    options={critterOptions}
                    value={selected2}
                    onChange={setSelected2}
                    direction="vertical"
                    style={{ gap: 12 }}
                />
            </div>

            <div style={labelStyle}>小尺寸</div>
            <div style={demoBoxStyle}>
                <Checkbox options={islandOptions} defaultValue={['forest']} size="small" />
            </div>

            <div style={labelStyle}>大尺寸</div>
            <div style={demoBoxStyle}>
                <Checkbox options={islandOptions.slice(0, 3)} defaultValue={['beach']} size="large" />
            </div>

            <div style={labelStyle}>全部禁用</div>
            <div style={demoBoxStyle}>
                <Checkbox options={islandOptions} defaultValue={['garden', 'village']} disabled />
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Checkbox } from 'animal-island-ui';

const options = [
    { label: '🌊 海滩', value: 'beach' },
    { label: '🌳 森林', value: 'forest' },
    { label: '🌸 花园', value: 'garden' },
];

const App = () => {
    return (
        <div>
            {/* 非受控 */}
            <Checkbox options={options} defaultValue={['beach']} />
            {/* 受控 */}
            <Checkbox options={options} value={values} onChange={setValues} />
            {/* 垂直排列 */}
            <Checkbox options={options} direction="vertical" />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={CHECKBOX_API} />
        </div>
    );
};

export default CheckboxDemo;
