import React, { useState } from 'react';
import { TimePicker } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const TIME_PICKER_API: ApiRow[] = [
    { prop: 'value', desc: '当前选中时间（受控），格式 HH:mm:ss', type: 'string', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中时间（非受控）', type: 'string', defaultVal: '-' },
    { prop: 'onChange', desc: '值变化回调，清空时返回 null', type: '(value: string | null) => void', defaultVal: '-' },
    { prop: 'placeholder', desc: '占位文本', type: 'string', defaultVal: '请选择时间' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
    { prop: 'allowClear', desc: '允许一键清空', type: 'boolean', defaultVal: 'false' },
    { prop: 'size', desc: '尺寸', type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
    { prop: 'status', desc: '校验状态', type: `'error' | 'warning'`, defaultVal: '-' },
    { prop: 'format', desc: '展示格式，支持 HH / mm / ss；含 ss 时显示秒列', type: 'string', defaultVal: "'HH:mm:ss'" },
    { prop: 'hourStep', desc: '小时步进', type: 'number', defaultVal: '1' },
    { prop: 'minuteStep', desc: '分钟步进', type: 'number', defaultVal: '1' },
    { prop: 'secondStep', desc: '秒步进', type: 'number', defaultVal: '1' },
    { prop: 'open', desc: '受控展开状态', type: 'boolean', defaultVal: '-' },
    { prop: 'onOpenChange', desc: '展开状态变化回调', type: '(open: boolean) => void', defaultVal: '-' },
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

const TimePickerDemo: React.FC = () => {
    const [value, setValue] = useState<string | null>('09:30:00');

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                TimePicker <DemoTag>基础用法</DemoTag>
            </div>
            <div style={labelStyle}>受控模式</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>{value ?? '未选择'}</span>
            </div>
            <div style={S.demoBox}>
                <TimePicker value={value ?? undefined} onChange={setValue} />
            </div>
            <div style={labelStyle}>非受控默认值 + 自定义格式（不含秒）</div>
            <div style={S.demoBox}>
                <TimePicker defaultValue="14:30:00" format="HH:mm" />
            </div>
            <div style={labelStyle}>分钟步进（15 分钟一档）</div>
            <div style={S.demoBox}>
                <TimePicker minuteStep={15} defaultValue="09:30:00" />
            </div>
            <div style={labelStyle}>允许清空</div>
            <div style={S.demoBox}>
                <TimePicker defaultValue="09:30:00" allowClear />
            </div>
            <div style={labelStyle}>三种尺寸</div>
            <div style={S.row}>
                <TimePicker size="small" defaultValue="09:30:00" />
                <TimePicker size="middle" defaultValue="09:30:00" />
                <TimePicker size="large" defaultValue="09:30:00" />
            </div>
            <div style={labelStyle}>校验状态</div>
            <div style={S.row}>
                <TimePicker status="error" defaultValue="09:30:00" />
                <TimePicker status="warning" defaultValue="09:30:00" />
            </div>
            <div style={labelStyle}>禁用状态</div>
            <div style={S.demoBox}>
                <TimePicker disabled defaultValue="09:30:00" />
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { TimePicker } from 'animal-island-ui';

const App = () => {
    const [time, setTime] = useState('09:30:00');
    return (
        <div>
            {/* 受控模式 */}
            <TimePicker value={time} onChange={setTime} />
            {/* 非受控 + 自定义格式（不含秒） */}
            <TimePicker defaultValue="14:30:00" format="HH:mm" />
            {/* 分钟步进 */}
            <TimePicker minuteStep={15} />
            {/* 清空 + 禁用 */}
            <TimePicker allowClear />
            <TimePicker disabled />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={TIME_PICKER_API} />
        </div>
    );
};

export default TimePickerDemo;
