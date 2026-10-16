import React, { useState } from 'react';
import { Calendar, type CalendarEvent } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const CALENDAR_API: ApiRow[] = [
    { prop: 'value', desc: '当前选中日期（受控），YYYY-MM-DD', type: 'string', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中日期（非受控），YYYY-MM-DD', type: 'string', defaultVal: '今天' },
    { prop: 'panelValue', desc: '面板展示月份（受控），YYYY-MM 或 YYYY-MM-DD', type: 'string', defaultVal: '-' },
    { prop: 'defaultPanelValue', desc: '默认展示月份（非受控）', type: 'string', defaultVal: '选中值 / 今天' },
    { prop: 'onChange', desc: '日期变化回调', type: '(date: string) => void', defaultVal: '-' },
    { prop: 'onPanelChange', desc: '面板月份变化回调', type: '(month: string) => void', defaultVal: '-' },
    { prop: 'events', desc: '事项列表，支持同日多条与跨日期连续条', type: 'CalendarEvent[]', defaultVal: '[]' },
    {
        prop: 'eventRender',
        desc: '自定义事项内容，返回 null 时不渲染',
        type: '(event: CalendarEvent) => ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'cellRender',
        desc: '自定义日期数字，返回 null 时不渲染；info 含 date / events / originNode',
        type: '(info: CalendarCellInfo) => ReactNode',
        defaultVal: '-',
    },
    { prop: 'disabledDate', desc: '禁用日期判断函数', type: '(date: Date) => boolean', defaultVal: '-' },
    { prop: 'showEventTime', desc: '是否展示事项起始时间（仅首段）', type: 'boolean', defaultVal: 'true' },
    { prop: 'draggableEvents', desc: '允许鼠标拖拽跨日期创建事项', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'onEventCreate',
        desc: '拖拽创建事项回调，返回起止日期',
        type: '(start: string, end: string) => void',
        defaultVal: '-',
    },
    { prop: 'showToday', desc: '面板展示「今天」按钮', type: 'boolean', defaultVal: 'true' },
    { prop: 'showYearSwitch', desc: '面板展示上/下年切换', type: 'boolean', defaultVal: 'true' },
    { prop: 'showHeader', desc: '面板展示头部', type: 'boolean', defaultVal: 'true' },
];

const EVENT_API: ApiRow[] = [
    { prop: 'title', desc: '事项内容', type: 'ReactNode', required: true },
    {
        prop: 'start',
        desc: '开始日期，YYYY-MM-DD 或 dayjs 对象（带时间则展示 HH:mm）',
        type: 'string | Dayjs',
        required: true,
    },
    {
        prop: 'end',
        desc: '结束日期，省略时等同于 start；传入时渲染成跨天连续条',
        type: 'string | Dayjs',
        defaultVal: '-',
    },
    { prop: 'color', desc: '颜色', type: `'teal' | 'amber' | 'coral' | 'green' | 'purple'`, defaultVal: "'teal'" },
    { prop: 'showTime', desc: '是否展示起始时间', type: 'boolean', defaultVal: 'false' },
    { prop: 'data', desc: '业务数据，渲染回调里原样取回', type: 'unknown', defaultVal: '-' },
];

const S = {
    demoBox: {
        padding: 16,
        borderRadius: 18,
        fontWeight: 500,
        marginBottom: 20,
        background: '#faf8f3',
        maxWidth: 560,
    } as React.CSSProperties,
    statusLine: {
        marginBottom: 8,
        fontSize: 13,
        color: '#a08060',
    } as React.CSSProperties,
};

const disableWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const workEvents: CalendarEvent[] = [
    { title: '周会', start: '2026-08-10 09:30', showTime: true },
    { title: '需求评审', start: '2026-08-10 14:00', showTime: true, color: 'purple' },
    { title: '海岛团建', start: '2026-08-12', end: '2026-08-18', color: 'amber' },
    { title: '版本发布', start: '2026-08-20', color: 'coral' },
    { title: '用户访谈', start: '2026-08-24 10:00', showTime: true, color: 'green' },
    { title: '设计走查', start: '2026-08-24' },
    { title: '月度复盘', start: '2026-08-24' },
];

const CalendarDemo: React.FC = () => {
    const [date, setDate] = useState('2026-08-10');
    const [panel, setPanel] = useState('2026-08');
    const [created, setCreated] = useState<{ start: string; end: string }[]>([]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Calendar <DemoTag>基础用法</DemoTag>
            </div>
            <div style={labelStyle}>受控模式：点击日期选中</div>
            <div style={S.statusLine}>
                当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>{date}</span>
            </div>
            <div style={S.demoBox}>
                <Calendar value={date} panelValue={panel} onChange={setDate} onPanelChange={setPanel} />
            </div>

            <div style={labelStyle}>事项：同日多条、跨日期连续条、时间前缀</div>
            <div style={S.demoBox}>
                <Calendar panelValue="2026-08" defaultValue="2026-08-10" events={workEvents} />
            </div>

            <div style={labelStyle}>自定义事项内容（eventRender）与日期数字（cellRender）</div>
            <div style={S.demoBox}>
                <Calendar
                    panelValue="2026-08"
                    defaultValue="2026-08-10"
                    events={workEvents}
                    eventRender={(event) => <strong>#{String(event.title)}</strong>}
                    cellRender={({ date: cellDate, originNode }) =>
                        cellDate === '2026-08-10' ? <em style={{ color: '#e05a5a' }}>{originNode}</em> : originNode
                    }
                />
            </div>

            <div style={labelStyle}>禁用日期（周末不可选）与「今天」按钮开关</div>
            <div style={S.demoBox}>
                <Calendar panelValue="2026-08" disabledDate={disableWeekend} showToday={false} showYearSwitch={false} />
            </div>

            <div style={labelStyle}>拖拽跨日期创建事项（draggableEvents）</div>
            <div style={S.statusLine}>
                新建事项:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {created.length > 0
                        ? created.map((item) => `${item.start} ~ ${item.end}`).join('，')
                        : '在日期上按住并横向拖动'}
                </span>
            </div>
            <div style={S.demoBox}>
                <Calendar
                    panelValue="2026-08"
                    defaultValue="2026-08-10"
                    draggableEvents
                    onEventCreate={(start, end) => setCreated((prev) => [...prev, { start, end }])}
                />
            </div>

            <CodeBlock
                code={`import { Calendar } from 'animal-island-ui';

const events = [
    { title: '周会', start: '2026-08-10 09:30', showTime: true },
    { title: '海岛团建', start: '2026-08-12', end: '2026-08-18', color: 'amber' },
];

const App = () => (
    <Calendar
        defaultValue="2026-08-10"
        events={events}
        onChange={(date) => console.log(date)}
        onEventCreate={(start, end) => console.log(start, end)}
        draggableEvents
    />
);

export default App;`}
            />
            <ApiTable rows={CALENDAR_API} title="Calendar API" />
            <ApiTable rows={EVENT_API} title="CalendarEvent" />
        </div>
    );
};

export default CalendarDemo;
