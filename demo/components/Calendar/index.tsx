import React, { useState } from 'react';
import { Calendar, type CalendarEvent } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const CALENDAR_API: ApiRow[] = [
    { prop: 'width', desc: '面板宽度，默认铺满父容器（数值按 px 处理）', type: 'number | string', defaultVal: '-' },
    { prop: 'value', desc: '当前选中日期（受控），YYYY-MM-DD', type: 'string', defaultVal: '-' },
    { prop: 'defaultValue', desc: '默认选中日期（非受控），YYYY-MM-DD', type: 'string', defaultVal: '今天' },
    { prop: 'panelValue', desc: '面板展示月份（受控），YYYY-MM 或 YYYY-MM-DD', type: 'string', defaultVal: '-' },
    { prop: 'defaultPanelValue', desc: '默认展示月份（非受控）', type: 'string', defaultVal: '选中值 / 今天' },
    { prop: 'onChange', desc: '日期变化回调', type: '(date: string) => void', defaultVal: '-' },
    { prop: 'onPanelChange', desc: '面板月份变化回调', type: '(month: string) => void', defaultVal: '-' },
    { prop: 'events', desc: '事项列表，支持同日多条与跨日期连续条', type: 'CalendarEvent[]', defaultVal: '[]' },
    { prop: 'showEventTime', desc: '是否展示事项起始时间（仅首段）', type: 'boolean', defaultVal: 'true' },
    { prop: 'draggableEvents', desc: '允许鼠标拖拽跨日期创建事项', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'onEventCreate',
        desc: '拖拽创建事项回调，返回起止日期',
        type: '(start: string, end: string) => void',
        defaultVal: '-',
    },
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
];

const S = {
    demoBox: {
        padding: 16,
        borderRadius: 18,
        fontWeight: 500,
        marginBottom: 20,
        background: '#faf8f3',
    } as React.CSSProperties,
    /* 把容器收到面板的实际宽度（约 antd full 日历卡片），避免卡片右侧留一大片空地 */
    calendarBox: {
        maxWidth: 780,
    } as React.CSSProperties,
    statusLine: {
        marginBottom: 8,
        fontSize: 13,
        color: '#a08060',
    } as React.CSSProperties,
};

const islandEvents: CalendarEvent[] = [
    { title: '每日签到', start: '2026-08-10 09:30', showTime: true },
    { title: '开荒新岛', start: '2026-08-10 14:00', showTime: true, color: 'green' },
    { title: '海岛丰收祭', start: '2026-08-12', end: '2026-08-18', color: 'amber' },
    { title: '钓鱼大赛', start: '2026-08-20', color: 'coral' },
    { title: '篝火晚会', start: '2026-08-24 20:00', showTime: true, color: 'purple' },
    { title: '摘果子', start: '2026-08-24' },
    { title: '浇花', start: '2026-08-24' },
];

/** 拖拽新建的事项按「事件一 / 事件二 …」依次命名 */
const CREATED_NAMES = ['事件一', '事件二', '事件三', '事件四', '事件五'];
const CREATED_COLORS = ['teal', 'amber', 'coral', 'green', 'purple'] as const;

const CalendarDemo: React.FC = () => {
    const [date, setDate] = useState('2026-08-10');
    const [panel, setPanel] = useState('2026-08');
    const [created, setCreated] = useState<CalendarEvent[]>([]);

    const handleEventCreate = (start: string, end: string) => {
        setCreated((prev) => [
            ...prev,
            {
                title: CREATED_NAMES[prev.length % CREATED_NAMES.length],
                start,
                end,
                color: CREATED_COLORS[prev.length % CREATED_COLORS.length],
            },
        ]);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Calendar <DemoTag>基础用法</DemoTag>
            </div>
            <div style={labelStyle}>基础</div>
            <div style={{ ...S.demoBox, ...S.calendarBox }}>
                <Calendar defaultValue="2026-08-10" events={islandEvents} />
            </div>

            <div style={labelStyle}>受控模式：点击日期选中</div>
            <div style={S.statusLine}>
                当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>{date}</span>
            </div>
            <div style={{ ...S.demoBox, ...S.calendarBox }}>
                <Calendar value={date} panelValue={panel} onChange={setDate} onPanelChange={setPanel} />
            </div>

            <div style={labelStyle}>拖拽跨日期创建事项（draggableEvents）</div>
            <div style={S.statusLine}>
                新建事项:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {created.length > 0
                        ? created.map((item) => `${String(item.title)}（${item.start} ~ ${item.end}）`).join('，')
                        : '在日期上按住并横向拖动'}
                </span>
            </div>
            <div style={{ ...S.demoBox, ...S.calendarBox }}>
                <Calendar
                    defaultValue="2026-08-10"
                    events={created}
                    draggableEvents
                    onEventCreate={handleEventCreate}
                />
            </div>

            <CodeBlock
                code={`import { Calendar } from 'animal-island-ui';

const events = [
    { title: '每日签到', start: '2026-08-10 09:30', showTime: true },
    { title: '海岛丰收祭', start: '2026-08-12', end: '2026-08-18', color: 'amber' },
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
