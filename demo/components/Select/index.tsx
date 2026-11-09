import React, { useState } from 'react';
import { Select } from '../../../src';
import type { SelectOption } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
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
    {
        prop: 'variant',
        desc: '下拉弹出方式：default 常规正下方（空间不足翻到正上方）、game 贴触发区侧边',
        type: `'default' | 'game'`,
        defaultVal: "'default'",
    },
    { prop: 'allowClear', desc: '允许一键清空', type: 'boolean', defaultVal: 'false' },
    { prop: 'onClear', desc: '清空回调', type: '() => void', defaultVal: '-' },
    { prop: 'clearAriaLabel', desc: '清除按钮的无障碍标签', type: 'string', defaultVal: "'清除'" },
    { prop: 'showSearch', desc: '允许在触发区内输入关键字过滤', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'filterOption',
        desc: '过滤规则：true 按 optionFilterProp 匹配、false 不过滤、函数则自行判定',
        type: 'boolean | ((inputValue, option) => boolean)',
        defaultVal: 'true',
    },
    {
        prop: 'optionFilterProp',
        desc: '参与匹配的字段',
        type: `'key' | 'label'`,
        defaultVal: "'label'",
    },
    { prop: 'onSearch', desc: '搜索词变化回调', type: '(value: string) => void', defaultVal: '-' },
    {
        prop: 'notFoundContent',
        desc: '无匹配选项时展示的内容',
        type: 'ReactNode',
        defaultVal: "'暂无数据'",
    },
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
    const [value5, setValue5] = useState('');
    const [value6, setValue6] = useState('fish3');
    const [value7, setValue7] = useState('flower4');
    const [value8, setValue8] = useState('');
    const [value9, setValue9] = useState('fruit2');
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
            <div style={labelStyle}>variant 弹出方式</div>
            <div style={{ ...S.demoBox, display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                    <DemoTag>default（默认）</DemoTag>
                    <div style={{ marginTop: 10 }}>
                        <Select options={fishOptions} value={value1} onChange={setValue1} />
                    </div>
                </div>
                <div>
                    <DemoTag>game</DemoTag>
                    <div style={{ marginTop: 10 }}>
                        <Select options={fruitOptions} value={value9} onChange={setValue9} variant="game" />
                    </div>
                </div>
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
                <Select
                    options={fruitOptions}
                    value={value4}
                    onChange={setValue4}
                    placeholder="请选择水果"
                    variant="game"
                />
            </div>
            <div style={labelStyle}>禁用状态</div>
            <div style={S.demoBox}>
                <Select options={flowerOptions} value={value3} onChange={setValue3} disabled />
            </div>
            <div style={labelStyle}>allowClear 一键清空</div>
            <div style={{ ...S.demoBox, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <Select options={fishOptions} value={value6} onChange={setValue6} allowClear />
                <Select
                    options={flowerOptions}
                    value={value7}
                    onChange={setValue7}
                    allowClear
                    clearAriaLabel="清除已选花朵"
                />
            </div>
            <div style={labelStyle}>showSearch 输入关键字过滤</div>
            <div style={{ ...S.demoBox, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <Select options={fishOptions} value={value5} onChange={setValue5} showSearch placeholder="搜索鱼类" />
                <Select options={fruitOptions} value={value8} onChange={setValue8} showSearch placeholder="搜索水果" />
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
            {/* 一键清空 */}
            <Select options={options} value={value} onChange={setValue} allowClear onClear={() => {}} />
            {/* 输入关键字过滤（默认按 label 匹配，大小写不敏感） */}
            <Select options={options} value={value} onChange={setValue} showSearch placeholder="搜索" />
            {/* 下拉弹出方式：default 常规正下方（默认）/ game 贴触发区侧边 */}
            <Select options={options} value={value} onChange={setValue} variant="game" />
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
