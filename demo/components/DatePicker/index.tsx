import React, { useState } from 'react';
import { DatePicker } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const DATE_PICKER_API: ApiRow[] = [
    { prop: 'range', desc: '范围选择模式：联动选择开始日期与结束日期', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'picker',
        desc: '选择粒度：date 选择日期，month 选择月份（值为 YYYY-MM）',
        type: `'date' | 'month'`,
        defaultVal: "'date'",
    },
    {
        prop: 'value',
        desc: '当前选中值（受控）；日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束]，清空为 null',
        type: 'string | [string, string] | null',
        defaultVal: '-',
    },
    {
        prop: 'defaultValue',
        desc: '默认选中值（非受控）；日期模式为 YYYY-MM-DD，范围模式为 [开始, 结束]',
        type: 'string | [string, string]',
        defaultVal: '-',
    },
    {
        prop: 'onChange',
        desc: '值变化回调；日期模式返回 YYYY-MM-DD，范围模式返回 [开始, 结束]，清空返回 null',
        type: '(value: string | [string, string] | null) => void',
        defaultVal: '-',
    },
    { prop: 'placeholder', desc: '占位文本', type: 'string', defaultVal: '请选择日期' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'allowClear', desc: '允许一键清空', type: 'boolean', defaultVal: 'false' },
    { prop: 'size', desc: '尺寸', type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
    { prop: 'status', desc: '校验状态', type: `'error' | 'warning'`, defaultVal: '-' },
    { prop: 'format', desc: '展示格式，支持 YYYY / MM / DD / M / D', type: 'string', defaultVal: "'YYYY-MM-DD'" },
    { prop: 'disabledDate', desc: '禁用日期判断函数', type: '(date: Date) => boolean', defaultVal: '-' },
    { prop: 'open', desc: '受控展开状态', type: 'boolean', defaultVal: '-' },
    { prop: 'onOpenChange', desc: '展开状态变化回调', type: '(open: boolean) => void', defaultVal: '-' },
    { prop: 'showToday', desc: '面板底部显示「今天」快捷按钮', type: 'boolean', defaultVal: 'true' },
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

const disableWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const DatePickerDemo: React.FC = () => {
    const [value, setValue] = useState<string | null>('2026-08-10');
    const [rangeValue, setRangeValue] = useState<[string, string] | null>(['2026-08-10', '2026-08-20']);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                DatePicker <DemoTag>基础用法</DemoTag>
            </div>
            <div style={labelStyle}>受控模式</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>{value ?? '未选择'}</span>
            </div>
            <div style={S.demoBox}>
                <DatePicker value={value ?? undefined} onChange={setValue} />
            </div>
            <div style={labelStyle}>非受控默认值 + 自定义格式</div>
            <div style={S.demoBox}>
                <DatePicker defaultValue="2026-08-10" format="YYYY年MM月DD日" />
            </div>
            <div style={labelStyle}>允许清空 + 禁用日期（周末）</div>
            <div style={S.demoBox}>
                <DatePicker defaultValue="2026-08-01" allowClear disabledDate={disableWeekend} />
            </div>
            <div style={labelStyle}>三种尺寸</div>
            <div style={S.row}>
                <DatePicker size="small" defaultValue="2026-08-10" />
                <DatePicker size="middle" defaultValue="2026-08-10" />
                <DatePicker size="large" defaultValue="2026-08-10" />
            </div>
            <div style={labelStyle}>校验状态</div>
            <div style={S.row}>
                <DatePicker status="error" defaultValue="2026-08-10" />
                <DatePicker status="warning" defaultValue="2026-08-10" />
            </div>
            <div style={labelStyle}>禁用状态</div>
            <div style={S.demoBox}>
                <DatePicker disabled defaultValue="2026-08-10" />
            </div>
            <div style={labelStyle}>隐藏「今天」快捷按钮</div>
            <div style={S.demoBox}>
                <DatePicker showToday={false} />
            </div>
            <div style={labelStyle}>月份选择模式</div>
            <div style={S.demoBox}>
                <DatePicker picker="month" defaultValue="2026-08" />
            </div>
            <div style={labelStyle}>范围选择（开始日期 ~ 结束日期）</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                当前范围:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>{rangeValue?.join(' ~ ') ?? '未选择'}</span>
            </div>
            <div style={S.demoBox}>
                <DatePicker range value={rangeValue ?? undefined} onChange={setRangeValue} style={{ width: 300 }} />
            </div>
            <div style={labelStyle}>范围 + 清空 + 禁用周末</div>
            <div style={S.demoBox}>
                <DatePicker
                    range
                    defaultValue={['2026-08-01', '2026-08-15']}
                    allowClear
                    disabledDate={disableWeekend}
                    style={{ width: 300 }}
                />
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { DatePicker } from 'animal-island-ui';

const disableWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const App = () => {
    const [date, setDate] = useState('2026-08-10');
    const [range, setRange] = useState(['2026-08-10', '2026-08-20']);
    return (
        <div>
            {/* 受控模式 */}
            <DatePicker value={date} onChange={setDate} />
            {/* 非受控 + 自定义格式 */}
            <DatePicker defaultValue="2026-08-10" format="YYYY年MM月DD日" />
            {/* 清空 + 禁用周末 */}
            <DatePicker allowClear disabledDate={disableWeekend} />
            {/* 范围选择：开始日期 ~ 结束日期 */}
            <DatePicker range value={range} onChange={setRange} />
            {/* 禁用状态 */}
            <DatePicker disabled />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={DATE_PICKER_API} />
        </div>
    );
};

export default DatePickerDemo;
