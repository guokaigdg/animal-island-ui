import React, { useState } from 'react';
import { Select } from '../../../src';
import type { SelectOption } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    demoDashedBoxStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const SELECT_API: ApiRow[] = [
    { prop: 'options', desc: '选项列表', type: 'SelectOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '当前选中值', type: 'string', defaultVal: '-', required: true },
    { prop: 'onChange', desc: '选中变化回调', type: '(key: string) => void', defaultVal: '-', required: true },
    { prop: 'placeholder', desc: '占位文本', type: 'string', defaultVal: '请选择' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
];

const S = {
    row: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
    demoBox: {
        padding: 16,
        borderRadius: 18,
        fontWeight: 500,
        marginBottom: 20,
    } as React.CSSProperties,
};

const SelectDemo: React.FC = () => {
    const [value1, setValue1] = useState('fish1');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('flower2');
    const [value4, setValue4] = useState('');
    const fishOptions: SelectOption[] = [
        { key: 'fish1', label: '鲈鱼' },
        { key: 'fish2', label: '鲷鱼' },
        { key: 'fish3', label: '草鱼' },
        { key: 'fish4', label: '龙睛鱼' },
        { key: 'fish5', label: '神仙鱼' },
    ];
    const flowerOptions: SelectOption[] = [
        { key: 'flower1', label: '樱花' },
        { key: 'flower2', label: '玫瑰' },
        { key: 'flower3', label: '向日葵' },
        { key: 'flower4', label: '薰衣草' },
        { key: 'flower5', label: '郁金香' },
    ];
    const fruitOptions: SelectOption[] = [
        { key: 'fruit1', label: '草莓' },
        { key: 'fruit2', label: '蓝莓' },
        { key: 'fruit3', label: '桃子' },
        { key: 'fruit4', label: '樱桃' },
        { key: 'fruit5', label: '猕猴桃' },
    ];

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Select <DemoTag>基础用法</DemoTag>
            </div>
            <div style={labelStyle}>默认状态</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                当前选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {fishOptions.find((o) => o.key === value1)?.label}
                </span>
            </div>
            <div style={S.demoBox}>
                <Select options={fishOptions} value={value1} onChange={setValue1} />
            </div>
            <div style={labelStyle}>自定义占位文本</div>
            <div style={demoDashedBoxStyle}>
                <Select options={flowerOptions} value={value2} onChange={setValue2} placeholder="请选择花朵" />
                <Select options={fruitOptions} value={value4} onChange={setValue4} placeholder="请选择水果" />
            </div>
            <div style={labelStyle}>禁用状态</div>
            <div style={S.demoBox}>
                <Select options={flowerOptions} value={value3} onChange={setValue3} disabled />
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Select } from 'animal-island-ui';

const options = [
    { key: 'option1', label: '选项一' },
    { key: 'option2', label: '选项二' },
];

const App = () => {
    const [value, setValue] = useState('option1');
    return (
        <div>
            {/* 受控模式 */}
            <Select options={options} value={value} onChange={setValue} />
            {/* 占位文本 */}
            <Select options={options} placeholder="请选择" />
            {/* 禁用状态 */}
            <Select options={options} disabled />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={SELECT_API} />
        </div>
    );
};

export default SelectDemo;
