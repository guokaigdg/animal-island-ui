import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'naive-icons';
import styles from './calendar.module.less';

export type CalendarSize = 'small' | 'middle' | 'large';

export type CalendarColor = 'teal' | 'amber' | 'coral' | 'green' | 'purple';

/** 日历事项：同一天用同一个日期，跨天传不同的 start / end */
export interface CalendarEvent {
    /** 事项内容 */
    title: React.ReactNode;
    /** 开始日期：YYYY-MM-DD 字符串或 dayjs 对象 */
    start: string | Dayjs;
    /** 结束日期，省略时等同于 start；传入时渲染成跨天的连续事项条 */
    end?: string | Dayjs;
    /** 颜色，默认 teal */
    color?: CalendarColor;
    /** 是否在事项条首段展示起始时间 HH:mm（跨周续接段不重复展示） */
    showTime?: boolean;
    /** 挂载在事项上的业务数据，渲染回调里原样取回 */
    data?: unknown;
}

/** 单元格渲染回调的上下文 */
export interface CalendarCellInfo {
    /** 当前单元格类型，轻量版只支持 date */
    type: 'date';
    /** 单元格日期，YYYY-MM-DD */
    date: string;
    /** 该日所有事项（含跨天经过的事项） */
    events: CalendarEvent[];
    /** 默认渲染的日期数字节点；返回它即保留默认外观 */
    originNode: React.ReactNode;
}

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    /** 当前选中日期（受控），YYYY-MM-DD */
    value?: string;
    /** 默认选中日期（非受控），YYYY-MM-DD；不传时默认选中今天 */
    defaultValue?: string;
    /** 面板当前展示的月份（受控），YYYY-MM 或 YYYY-MM-DD */
    panelValue?: string;
    /** 默认展示的月份（非受控），YYYY-MM 或 YYYY-MM-DD；不传时跟随选中值 / 今天 */
    defaultPanelValue?: string;
    /** 日期变化回调（点选单元格或点击「今天」时触发） */
    onChange?: (date: string) => void;
    /** 面板月份变化回调（切换上/下月、上/下年时触发） */
    onPanelChange?: (month: string) => void;
    /** 事项列表，支持同一天多条与跨日期连续条 */
    events?: CalendarEvent[];
    /** 自定义事项内容，返回 null 时不渲染该事项 */
    eventRender?: (event: CalendarEvent) => React.ReactNode;
    /** 自定义日期数字，返回 null 时不渲染 */
    cellRender?: (info: CalendarCellInfo) => React.ReactNode;
    /** 禁用日期判断函数，返回 true 的日期不可选、不可拖拽创建 */
    disabledDate?: (date: Date) => boolean;
    /** 是否在事项条上展示起始时间，默认 true */
    showEventTime?: boolean;
    /** 是否允许鼠标拖拽跨日期创建事项（松手时通过 onEventCreate 回调） */
    draggableEvents?: boolean;
    /** 拖拽创建事项结束回调 */
    onEventCreate?: (start: string, end: string) => void;
    /** 尺寸：控制单元格高度、字号与事项密度，默认 middle */
    size?: CalendarSize;
    /** 主题色，默认 teal（与 DatePicker 选中色一致） */
    theme?: CalendarColor;
    /** 面板是否展示「今天」按钮，默认 true */
    showToday?: boolean;
    /** 面板是否展示上/下年切换按钮，默认 true */
    showYearSwitch?: boolean;
    /** 面板头部是否展示「年份 月份」标签，默认 true */
    showHeader?: boolean;
    /** 无可见标题时给面板一个无障碍标签 */
    'aria-label'?: string;
    /** 关联外部可见 label 的 id */
    'aria-labelledby'?: string;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/** 日期网格固定补满 6 周 × 7 天 */
const GRID_CELLS = 42;
const COLS = 7;
/** 日期网格的行数（6 周） */
const CELL_ROWS = GRID_CELLS / COLS;
/*
 * 尺寸表：与 calendar.module.less 的 @cell-height / @event-row-height / @day-number-size / 表头高度保持同步。
 * numberBand = 日期圆高度 + 上下留白，事项条从它下方开始排。
 */
const SIZE_METRICS: Record<CalendarSize, { cellHeight: number; numberBand: number; eventRow: number; header: number }> =
    {
        // numberBand 取 32：日期圆 28px 上下各留 2px，随后接第一条事项行；
        // 两条事项行（32 + 2 × 20/23/26）都留在单元格内，不会压到下一周的日期
        small: { cellHeight: 74, numberBand: 32, eventRow: 20, header: 28 },
        middle: { cellHeight: 86, numberBand: 32, eventRow: 23, header: 32 },
        large: { cellHeight: 100, numberBand: 32, eventRow: 26, header: 32 },
    };
/** 每个单元格最多平铺 2 条事项，多出的折叠成 +N */
const MAX_EVENT_ROWS = 2;

const toDateKey = (date: Dayjs) => date.format('YYYY-MM-DD');

/** 拖拽预览事项的标记，只用于渲染时区分「已有事项」与「正在拖拽的临时条」 */
const PREVIEW_FLAG = '__animal-calendar-preview__';

/** 解析字符串 / dayjs 输入，非法输入返回 null */
const parseDate = (value: string | Dayjs | null | undefined): Dayjs | null => {
    if (!value) return null;
    const parsed = dayjs.isDayjs(value) ? value : dayjs(value);
    return parsed.isValid() ? parsed : null;
};

/** YYYY-MM / YYYY-M 这类只到月份的输入，补成当月 1 日 */
const parseMonthValue = (value: string | null | undefined): Dayjs | null => {
    if (!value) return null;
    const parsed = /^\d{4}-\d{1,2}$/.test(value) ? dayjs(`${value}-01`) : dayjs(value);
    return parsed.isValid() ? parsed : null;
};

/** 视图起点：本月 1 日所在周的周日 */
const gridStartOf = (month: Dayjs) => {
    const first = month.date(1);
    return first.subtract(first.day(), 'day');
};

/** 日期在 42 格网格中的下标，早于视图或超出视图时夹取到边界 */
const cellIndexOf = (date: Dayjs, gridStart: Dayjs) => {
    const index = date.startOf('day').diff(gridStart.startOf('day'), 'day');
    return Math.min(GRID_CELLS - 1, Math.max(0, index));
};

/** 一段跨天事项在某一周里的可见片段：所在格子、跨列数、事项行 */
interface EventSegment {
    event: CalendarEvent;
    /** 片段起点在网格中的线性下标 */
    index: number;
    /** 片段终点在网格中的线性下标（同一周内，保证跨列数不超过 7） */
    endIndex: number;
    /** 是否为跨周后的续接片段（时间只在本周内的首片展示一次） */
    continuation: boolean;
    /** 片段占用的列数 */
    span: number;
    /** 第几行事项（0..MAX_EVENT_ROWS-1） */
    row: number;
}

interface EventLayout {
    /** 事项片段，供叠加层渲染 */
    segments: EventSegment[];
    /** 每个格子的事项总数，用于 +N 折叠 */
    counts: number[];
}

/**
 * 把事项映射到网格：跨天事项按自然日逐格铺开，并按周切成不超过 7 列的片段；
 * 同一天多条则依次占用事项行。结果与视图月份无关，因此拖拽预览（临时事项）也能复用同一套布局。
 */
const layoutEvents = (events: CalendarEvent[], gridStart: Dayjs, today: Dayjs): EventLayout => {
    const segments: EventSegment[] = [];
    const counts = new Array<number>(GRID_CELLS).fill(0);
    const rows = Array.from({ length: GRID_CELLS }, () => new Array<boolean>(MAX_EVENT_ROWS).fill(false));

    const sorted = [...events]
        .map((event) => ({
            event,
            start: parseDate(event.start) ?? today.startOf('day'),
            end: parseDate(event.end) ?? parseDate(event.start) ?? today.startOf('day'),
        }))
        .sort((a, b) => a.start.valueOf() - b.start.valueOf());

    for (const { event, start, end } of sorted) {
        const last = end.isBefore(start, 'day') ? start : end;
        const from = cellIndexOf(start, gridStart);
        const to = cellIndexOf(last, gridStart);

        // 完全落在 42 格视图（上下月补位）之外的事项不参与计数与渲染
        if (last.isBefore(gridStart, 'day')) continue;
        if (!start.isBefore(gridStart.add(GRID_CELLS, 'day'), 'day')) continue;

        // 统计事项经过的每一格，用于 +N 折叠
        for (let i = from; i <= to; i += 1) counts[i] += 1;

        for (let row = 0; row < CELL_ROWS; row += 1) {
            const rowStart = row * COLS;
            const rowEnd = rowStart + COLS - 1;
            if (to < rowStart || from > rowEnd) continue;
            // 按周切断：片段左右两端都不能越过所在行的边界
            const segFrom = Math.max(from, rowStart);
            const segTo = Math.min(to, rowEnd);
            const span = segTo - segFrom + 1;

            // 从第一行开始找一段连续空闲的格子，放不下则整个片段折叠进 +N
            let placed = -1;
            for (let r = 0; r < MAX_EVENT_ROWS; r += 1) {
                let free = true;
                for (let i = segFrom; i <= segTo; i += 1) {
                    if (rows[i][r]) {
                        free = false;
                        break;
                    }
                }
                if (free) {
                    placed = r;
                    break;
                }
            }
            if (placed < 0) continue;

            for (let i = segFrom; i <= segTo; i += 1) rows[i][placed] = true;
            segments.push({
                event,
                index: segFrom,
                endIndex: segTo,
                // 首片就是事项本身的起始格时才算首段：跨周续接段与「早于视图」的截断段都不重复展示时间
                continuation: !start.isSame(gridStart.add(segFrom, 'day'), 'day'),
                span,
                row: placed,
            });
        }
    }

    return { segments, counts };
};

/** 事项默认文案：起始时间只在首段展示一次，跨周续接段与整段截断段都只保留标题 */
const eventLabel = (event: CalendarEvent, firstSegment: boolean, showTime: boolean) => {
    const start = parseDate(event.start);
    if (!showTime || !event.showTime || !start || !firstSegment) return event.title;
    return (
        <>
            <span className={styles.eventTime}>{start.format('HH:mm')}</span>
            <span className={styles.eventTitle}>{event.title}</span>
        </>
    );
};

export const Calendar: React.FC<CalendarProps> = ({
    value,
    defaultValue,
    panelValue,
    defaultPanelValue,
    onChange,
    onPanelChange,
    events = [],
    eventRender,
    cellRender,
    disabledDate,
    showEventTime = true,
    draggableEvents = false,
    onEventCreate,
    size = 'middle',
    theme = 'teal',
    showToday = true,
    showYearSwitch = true,
    showHeader = true,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    style,
    onMouseLeave,
    ...rest
}) => {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<string>(() => defaultValue ?? toDateKey(dayjs()));
    const selectedValue = isControlled ? value : innerValue;

    const isPanelControlled = panelValue !== undefined;
    const [innerPanel, setInnerPanel] = useState<Dayjs>(
        () => parseMonthValue(defaultPanelValue) ?? parseDate(defaultValue) ?? dayjs()
    );
    const viewMonth = isPanelControlled ? (parseMonthValue(panelValue) ?? dayjs()) : innerPanel;

    const [focusDate, setFocusDate] = useState<Dayjs>(() => parseDate(selectedValue) ?? dayjs());
    const [dragging, setDragging] = useState(false);
    const [dragAnchor, setDragAnchor] = useState<Dayjs | null>(null);
    const [dragHead, setDragHead] = useState<Dayjs | null>(null);

    const today = dayjs();
    const focusKey = toDateKey(focusDate);
    const monthKey = viewMonth.format('YYYY-MM');
    const gridStart = gridStartOf(viewMonth);
    const selectedKey = selectedValue ?? '';
    const metrics = SIZE_METRICS[size];

    // 受控 value 变化后，把 roving tabindex 的光标同步到新的选中日期
    useEffect(() => {
        const next = parseDate(selectedValue);
        if (next) setFocusDate(next);
    }, [selectedValue]);

    // 受控且与当前视图不在同一个月时，跟随 value 切换面板月份
    useEffect(() => {
        if (!isPanelControlled) return;
        const next = parseDate(selectedValue);
        if (next && next.format('YYYY-MM') !== monthKey) setInnerPanel(next);
    }, [isPanelControlled, selectedValue, monthKey]);

    const goToMonth = useCallback(
        (month: Dayjs, focus?: Dayjs) => {
            if (isPanelControlled) setInnerPanel(month);
            onPanelChange?.(month.format('YYYY-MM'));
            if (focus) setFocusDate(focus);
        },
        [isPanelControlled, onPanelChange]
    );

    // 上下月：同时把键盘光标带到目标月的同一天
    const shiftMonth = useCallback(
        (delta: number) => {
            const next = viewMonth.add(delta, 'month').date(1);
            goToMonth(next, next.date(Math.min(focusDate.date(), next.daysInMonth())));
        },
        [viewMonth, focusDate, goToMonth]
    );

    const shiftYear = useCallback(
        (delta: number) => {
            const next = viewMonth.add(delta, 'year').date(1);
            goToMonth(next, next.date(Math.min(focusDate.date(), next.daysInMonth())));
        },
        [viewMonth, focusDate, goToMonth]
    );

    const selectDate = useCallback(
        (date: Dayjs) => {
            if (disabledDate?.(date.toDate())) return;
            const next = toDateKey(date);
            setFocusDate(date);
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
            // 选中的日期不在当前视图时，面板跟随翻月（跨月拖拽 / 程序化赋值也适用）
            const current = isPanelControlled ? parseMonthValue(panelValue) : innerPanel;
            if (current && date.format('YYYY-MM') !== current.format('YYYY-MM')) {
                const month = date.date(1);
                if (!isPanelControlled) setInnerPanel(month);
                onPanelChange?.(month.format('YYYY-MM'));
            }
        },
        [disabledDate, isControlled, onChange, isPanelControlled, panelValue, innerPanel, onPanelChange]
    );

    const dragPreview = useMemo(() => {
        if (!dragging || !dragAnchor || !dragHead) return null;
        const from = dragAnchor.isBefore(dragHead, 'day') ? dragAnchor : dragHead;
        const to = dragAnchor.isBefore(dragHead, 'day') ? dragHead : dragAnchor;
        return { from, to };
    }, [dragging, dragAnchor, dragHead]);

    // 拖拽预览以临时事项的形式参与同一套布局，因此跨天条会自动避开已有事项
    const layoutEventsSource = useMemo<CalendarEvent[]>(() => {
        if (!dragPreview) return events;
        return [
            ...events,
            { title: '', start: dragPreview.from, end: dragPreview.to, color: theme, data: PREVIEW_FLAG },
        ];
    }, [events, dragPreview, theme]);

    const layout = useMemo(
        () => layoutEvents(layoutEventsSource, gridStart, today.startOf('day')),
        [layoutEventsSource, gridStart, today]
    );

    // 每个格子经过的所有事项：跨天事项在它经过的每一格都计入（用于 aria-label 与单元格提示）
    const eventsByCell = useMemo(() => {
        const map = new Map<number, CalendarEvent[]>();
        const gridEnd = gridStart.add(GRID_CELLS, 'day');
        for (const event of events) {
            const start = parseDate(event.start) ?? today.startOf('day');
            const declaredEnd = parseDate(event.end);
            const end = !declaredEnd || declaredEnd.isBefore(start, 'day') ? start : declaredEnd;
            // 与 layoutEvents 保持同一套可见性判断，避免视图外的事项被算进格子提示
            if (end.isBefore(gridStart, 'day') || !start.isBefore(gridEnd, 'day')) continue;
            const from = cellIndexOf(start, gridStart);
            const to = cellIndexOf(end, gridStart);
            for (let i = from; i <= to; i += 1) {
                const list = map.get(i) ?? [];
                list.push(event);
                map.set(i, list);
            }
        }
        return map;
    }, [events, gridStart, today]);

    // 叠加层：包含拖拽预览条（预览条不参与 +N 统计）
    const overlaySegments = layout.segments;

    /** 折叠提示：本格事项总数 - 实际画出来的事项条数 */
    const overflowCounts = useMemo(() => {
        const drawn = new Array<number>(GRID_CELLS).fill(0);
        for (const segment of layout.segments) {
            if (segment.event.data === PREVIEW_FLAG) continue;
            for (let i = 0; i < segment.span; i += 1) {
                const at = segment.index + i;
                if (at < GRID_CELLS) drawn[at] += 1;
            }
        }
        return layout.counts.map((count, i) => count - drawn[i]);
    }, [layout]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;
        if (key === 'PageUp' || key === 'PageDown') {
            event.preventDefault();
            shiftMonth(key === 'PageUp' ? -1 : 1);
            return;
        }
        const delta =
            key === 'ArrowLeft'
                ? -1
                : key === 'ArrowRight'
                  ? 1
                  : key === 'ArrowUp'
                    ? -COLS
                    : key === 'ArrowDown'
                      ? COLS
                      : 0;
        if (delta !== 0) {
            event.preventDefault();
            const next = focusDate.add(delta, 'day');
            setFocusDate(next);
            // 光标移出当前月份视图时，面板跟随翻月
            if (cellIndexOf(next, gridStart) !== cellIndexOf(focusDate, gridStart)) {
                const month = next.date(1);
                if (!isPanelControlled) setInnerPanel(month);
                onPanelChange?.(month.format('YYYY-MM'));
            }
            return;
        }
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            selectDate(focusDate);
        }
    };

    const startDragAt = (index: number) => {
        const date = gridStart.add(index, 'day');
        if (!draggableEvents || disabledDate?.(date.toDate())) return;
        setDragging(true);
        setDragAnchor(date);
        setDragHead(date);
    };

    const extendDragAt = (index: number) => {
        if (!dragging) return;
        const date = gridStart.add(index, 'day');
        if (disabledDate?.(date.toDate())) return;
        setDragHead(date);
    };

    const finishDrag = () => {
        if (!dragging) return;
        const anchor = dragAnchor;
        const head = dragHead;
        setDragging(false);
        setDragAnchor(null);
        setDragHead(null);
        if (!anchor || !head) return;
        const from = anchor.isBefore(head, 'day') ? anchor : head;
        const to = anchor.isBefore(head, 'day') ? head : anchor;
        // 单击（起止同一天）只当作选中，不创建事项
        if (from.isSame(to, 'day')) return;
        onEventCreate?.(toDateKey(from), toDateKey(to));
    };

    // 指针在面板之外抬起时也要收尾，否则拖拽态会一直保留
    useEffect(() => {
        if (!dragging) return;
        const stop = () => {
            setDragging(false);
            setDragAnchor(null);
            setDragHead(null);
        };
        document.addEventListener('pointerup', stop);
        document.addEventListener('pointercancel', stop);
        return () => {
            document.removeEventListener('pointerup', stop);
            document.removeEventListener('pointercancel', stop);
        };
    }, [dragging]);

    const renderCell = (cell: Dayjs, index: number) => {
        const cellKey = toDateKey(cell);
        const outside = cell.month() !== viewMonth.month();
        const disabled = disabledDate?.(cell.toDate()) === true;
        const selected = cellKey === selectedKey;
        const isToday = cell.isSame(today, 'day');
        const extra = overflowCounts[index];
        const dayEvents = eventsByCell.get(index) ?? [];
        const isFocusable = cellKey === focusKey;

        const label = dayEvents.length > 0 ? `${cellKey} ${dayEvents.length} 项事项` : cellKey;

        return (
            <td
                key={`${monthKey}-cell-${cellKey}`}
                role="gridcell"
                tabIndex={isFocusable ? 0 : -1}
                aria-selected={selected || undefined}
                aria-disabled={disabled || undefined}
                aria-label={label}
                data-date={cellKey}
                className={[
                    styles.cell,
                    outside && styles.cellOutside,
                    selected && styles.cellSelected,
                    isToday && styles.cellToday,
                    disabled && styles.cellDisabled,
                ]
                    .filter(Boolean)
                    .join(' ')}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectDate(cell);
                    }
                }}
                onClick={() => selectDate(cell)}
                onMouseDown={() => startDragAt(index)}
                onMouseEnter={() => extendDragAt(index)}
            >
                <span className={styles.cellInner}>
                    <span className={styles.dayNumber}>
                        {cellRender
                            ? cellRender({
                                  type: 'date',
                                  date: cellKey,
                                  events: dayEvents,
                                  originNode: cell.date(),
                              })
                            : cell.date()}
                    </span>
                    {extra > 0 && <span className={styles.more}>+{extra}</span>}
                </span>
            </td>
        );
    };

    const gridRows = Array.from({ length: GRID_CELLS / COLS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => gridStart.add(row * COLS + col, 'day'))
    );

    const calendarClass = [styles.calendar, styles[`calendar-${size}`], className].filter(Boolean).join(' ');

    return (
        <div
            className={calendarClass}
            data-theme={theme}
            data-draggable={draggableEvents ? 'true' : undefined}
            style={style}
            {...rest}
        >
            {showHeader && (
                <div className={styles.header}>
                    <div className={styles.headerGroup}>
                        {showYearSwitch && (
                            <button
                                type="button"
                                className={styles.navBtn}
                                aria-label="上一年"
                                onClick={() => shiftYear(-1)}
                            >
                                <ChevronLeftIcon className={styles.navIcon} size={14} strokeWidth={2.6} />
                            </button>
                        )}
                        <button
                            type="button"
                            className={styles.navBtn}
                            aria-label="上个月"
                            onClick={() => shiftMonth(-1)}
                        >
                            <ChevronLeftIcon className={styles.navIcon} size={16} strokeWidth={2.6} />
                        </button>
                    </div>
                    <span className={styles.monthLabel}>
                        <CalendarIcon className={styles.monthIcon} size={16} strokeWidth={2.4} />
                        {viewMonth.year()}年{viewMonth.month() + 1}月
                    </span>
                    <div className={styles.headerGroup}>
                        {showToday && (
                            <button type="button" className={styles.todayBtn} onClick={() => selectDate(today)}>
                                今天
                            </button>
                        )}
                        <button
                            type="button"
                            className={styles.navBtn}
                            aria-label="下个月"
                            onClick={() => shiftMonth(1)}
                        >
                            <ChevronRightIcon className={styles.navIcon} size={16} strokeWidth={2.6} />
                        </button>
                        {showYearSwitch && (
                            <button
                                type="button"
                                className={styles.navBtn}
                                aria-label="下一年"
                                onClick={() => shiftYear(1)}
                            >
                                <ChevronRightIcon className={styles.navIcon} size={14} strokeWidth={2.6} />
                            </button>
                        )}
                    </div>
                </div>
            )}
            <div
                className={styles.body}
                onKeyDown={handleKeyDown}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                onMouseLeave={onMouseLeave}
            >
                {' '}
                <table role="grid" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className={styles.table}>
                    <thead>
                        <tr role="row">
                            {WEEKDAYS.map((weekday) => (
                                <th key={weekday} role="columnheader" scope="col" className={styles.weekCell}>
                                    {weekday}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {gridRows.map((row, rowIndex) => (
                            <tr role="row" key={`${monthKey}-row-${rowIndex}`}>
                                {row.map((cell, colIndex) => renderCell(cell, rowIndex * COLS + colIndex))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {overlaySegments.length > 0 && (
                    <div className={styles.eventsLayer} aria-hidden>
                        {overlaySegments.map((segment, i) => {
                            const custom = eventRender?.(segment.event);
                            const content = custom ?? eventLabel(segment.event, !segment.continuation, showEventTime);
                            if (content === null || content === undefined) return null;
                            const col = (segment.index % COLS) + 1;
                            const colSpan = segment.span;
                            const palette = segment.event.color ?? theme;
                            return (
                                <div
                                    key={`${monthKey}-evt-${segment.index}-${segment.row}-${i}`}
                                    data-color={palette}
                                    data-span={segment.span > 1 ? 'true' : undefined}
                                    data-start={segment.index % COLS === 0 ? 'true' : undefined}
                                    data-end={segment.endIndex % COLS === COLS - 1 ? 'true' : undefined}
                                    data-preview={segment.event.data === PREVIEW_FLAG ? 'true' : undefined}
                                    className={styles.event}
                                    style={{
                                        // 事项条绝对定位到所属周的日期数字下方，横向与日期圆共用一条内容轨道
                                        ['--animal-calendar-bar-top' as string]: `${
                                            metrics.header +
                                            (segment.index / COLS) * metrics.cellHeight +
                                            metrics.numberBand +
                                            segment.row * metrics.eventRow
                                        }px`,
                                        ['--animal-calendar-bar-left' as string]: `calc((100% / 7) * ${col - 1} + 4px)`,
                                        ['--animal-calendar-bar-width' as string]: `calc((100% / 7) * ${colSpan} - 8px)`,
                                    }}
                                >
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

Calendar.displayName = 'Calendar';
