import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'naive-icons';
import styles from './calendar.module.less';

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
}

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
    /** 当前选中日期（受控），YYYY-MM-DD */
    value?: string;
    /** 默认选中日期（非受控），YYYY-MM-DD；不传时默认选中今天 */
    defaultValue?: string;
    /** 面板当前展示的月份（受控），YYYY-MM 或 YYYY-MM-DD；传入后必须配合 onPanelChange 回写，否则面板无法翻月 */
    panelValue?: string;
    /** 默认展示的月份（非受控），YYYY-MM 或 YYYY-MM-DD；不传时跟随选中值 / 今天 */
    defaultPanelValue?: string;
    /** 日期变化回调（点选单元格或点击「今天」时触发） */
    onChange?: (date: string) => void;
    /** 面板月份变化回调（切换上/下月、上/下年、光标跨月时触发）；受控 panelValue 下必须回写 */
    onPanelChange?: (month: string) => void;
    /** 事项列表，支持同一天多条与跨日期连续条 */
    events?: CalendarEvent[];
    /** 是否在事项条上展示起始时间，默认 true */
    showEventTime?: boolean;
    /** 是否允许鼠标拖拽跨日期创建事项（松手时通过 onEventCreate 回调） */
    draggableEvents?: boolean;
    /** 拖拽创建事项结束回调 */
    onEventCreate?: (start: string, end: string) => void;
    /** 面板宽度，默认铺满父容器（数值按 px 处理）。行高、字号与事项密度都由实际宽度推导 */
    width?: number | string;
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
 * 布局基准：面板宽度 640px 时的度量，与 calendar.module.less 里的同名常量一一对应。
 * 组件按自身宽度算出缩放系数，事项条的纵向位置就是「基准值 × 系数」；CSS 那边用同一系数
 * 推导行高。单元格高度必须容得下「日期数字带 + 2 条事项行」：
 *   32 + 19 × 2 = 70 ≤ 86
 * 所以 2 条事项行整体落在单元格内，不会压到下一周的日期数字。
 */
const LAYOUT_BASE = {
    /** 基准面板宽度 */
    width: 750,
    /** 星期表头高度 */
    header: 32,
    /** 单元格高度 */
    cellHeight: 104,
    /** 单元格内「日期圆 + 上下留白」占用的高度，事项条从它下方开始排 */
    numberBand: 38,
    /** 单条事项行的高度 */
    eventRow: 22,
};

/** 缩放系数的上下限，避免极窄或极宽容器把面板拉变形 */
const MIN_SCALE = 0.6;
const MAX_SCALE = 2;
/** 每个单元格最多平铺 2 条事项，多出的折叠成 +N */
const MAX_EVENT_ROWS = 2;

const toDateKey = (date: Dayjs) => date.format('YYYY-MM-DD');

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
    showEventTime = true,
    draggableEvents = false,
    onEventCreate,
    width,
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
    const wrapperRef = useRef<HTMLDivElement>(null);
    /**
     * 方向键 / PageUp / PageDown 之后需要把 DOM 焦点搬到新的光标格子。
     * 用 ref 标记「这次是键盘移动」，避免首次渲染或程序化赋值时抢焦点。
     */
    const pendingFocusRef = useRef(false);
    /** 面板实际宽度：优先用显式 width，否则量自身盒子，量不到时退回基准宽度 */
    const [measuredWidth, setMeasuredWidth] = useState(0);

    useEffect(() => {
        const node = wrapperRef.current;
        if (!node || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver((entries) => {
            const next = entries[0]?.contentRect.width ?? 0;
            if (next > 0) setMeasuredWidth(next);
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const numericWidth = typeof width === 'number' ? width : 0;
    const effectiveWidth = numericWidth || measuredWidth || LAYOUT_BASE.width;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, effectiveWidth / LAYOUT_BASE.width));
    const metrics = {
        header: LAYOUT_BASE.header * scale,
        cellHeight: LAYOUT_BASE.cellHeight * scale,
        numberBand: LAYOUT_BASE.numberBand * scale,
        eventRow: LAYOUT_BASE.eventRow * scale,
    };

    // 受控 value 变化后，把 roving tabindex 的光标同步到新的选中日期
    useEffect(() => {
        const next = parseDate(selectedValue);
        if (next) setFocusDate(next);
    }, [selectedValue]);

    /*
     * 非受控时，只有「选中值本身发生变化」才把视图跟过去（受控面板由 panelValue 决定，这里不动）。
     * 必须用上一次的选中值做对比：箭头翻月会让 monthKey 改变而 selectedValue 不变，
     * 若无条件按 selectedValue 同步，就会把刚翻过去的月份又拽回来。
     */
    const lastSelectedRef = useRef(selectedValue);
    useEffect(() => {
        if (lastSelectedRef.current === selectedValue) return;
        lastSelectedRef.current = selectedValue;
        if (isPanelControlled) return;
        const next = parseDate(selectedValue);
        if (next && next.format('YYYY-MM') !== monthKey) setInnerPanel(next);
    }, [isPanelControlled, selectedValue, monthKey]);

    const goToMonth = useCallback(
        (month: Dayjs, focus?: Dayjs) => {
            // 非受控时面板自己翻月；受控时只通知父级，由父级回写 panelValue
            if (!isPanelControlled) setInnerPanel(month);
            onPanelChange?.(month.format('YYYY-MM'));
            if (focus) setFocusDate(focus);
        },
        [isPanelControlled, onPanelChange]
    );

    // 上下月：同时把键盘光标带到目标月的同一天
    // 光标变化后（且确实来自键盘移动）把焦点交到对应格子，保持 roving tabindex 与真实焦点一致
    useEffect(() => {
        if (!pendingFocusRef.current) return;
        pendingFocusRef.current = false;
        const node = wrapperRef.current?.querySelector<HTMLElement>(`[data-date="${focusKey}"]`);
        node?.focus();
    }, [focusKey, monthKey]);

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
            const next = toDateKey(date);
            setFocusDate(date);
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
            // 选中的日期不在当前视图时，面板跟随翻月（点选上下月补位格 / 跨月拖拽都适用）
            if (date.format('YYYY-MM') !== monthKey) {
                const month = date.date(1);
                if (!isPanelControlled) setInnerPanel(month);
                onPanelChange?.(month.format('YYYY-MM'));
            }
        },
        [isControlled, onChange, isPanelControlled, monthKey, onPanelChange]
    );

    const dragPreview = useMemo(() => {
        if (!dragging || !dragAnchor || !dragHead) return null;
        const from = dragAnchor.isBefore(dragHead, 'day') ? dragAnchor : dragHead;
        const to = dragAnchor.isBefore(dragHead, 'day') ? dragHead : dragAnchor;
        return { from, to };
    }, [dragging, dragAnchor, dragHead]);

    // 拖拽预览以临时事项的形式参与同一套布局，因此跨天条会自动避开已有事项。
    // 预览条的引用固定在一个 memo 里，渲染时用它比对即可区分预览与真实事项。
    const previewEvent = useMemo<CalendarEvent | null>(
        () => (dragPreview ? { title: '', start: dragPreview.from, end: dragPreview.to, color: 'teal' } : null),
        [dragPreview]
    );
    const layoutEventsSource = useMemo<CalendarEvent[]>(
        () => (previewEvent ? [...events, previewEvent] : events),
        [events, previewEvent]
    );

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
            pendingFocusRef.current = true;
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
            pendingFocusRef.current = true;
            setFocusDate(next);
            // 光标移到别的月份时，面板跟随翻月（同月内的移动不动面板）
            if (!next.isSame(viewMonth, 'month')) {
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
        if (!draggableEvents) return;
        setDragging(true);
        setDragAnchor(date);
        setDragHead(date);
    };

    const extendDragAt = (index: number) => {
        if (!dragging) return;
        setDragHead(gridStart.add(index, 'day'));
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
                aria-label={label}
                data-date={cellKey}
                className={[
                    styles.cell,
                    outside && styles.cellOutside,
                    selected && styles.cellSelected,
                    isToday && styles.cellToday,
                ]
                    .filter(Boolean)
                    .join(' ')}
                onClick={() => selectDate(cell)}
                onMouseDown={() => startDragAt(index)}
                onMouseEnter={() => extendDragAt(index)}
            >
                <span className={styles.cellInner}>
                    <span className={styles.dayNumber}>{cell.date()}</span>
                    {extra > 0 && <span className={styles.more}>+{extra}</span>}
                </span>
            </td>
        );
    };

    const gridRows = Array.from({ length: GRID_CELLS / COLS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => gridStart.add(row * COLS + col, 'day'))
    );

    const calendarClass = [styles.calendar, className].filter(Boolean).join(' ');

    return (
        <div
            ref={wrapperRef}
            className={calendarClass}
            data-draggable={draggableEvents ? 'true' : undefined}
            style={{ width, '--animal-calendar-scale': scale, ...style } as React.CSSProperties}
            {...rest}
        >
            <div className={styles.header}>
                <div className={styles.headerGroup}>
                    <button type="button" className={styles.navBtn} aria-label="上一年" onClick={() => shiftYear(-1)}>
                        <ChevronLeftIcon className={styles.navIcon} size={14} strokeWidth={2.6} />
                    </button>
                    <button type="button" className={styles.navBtn} aria-label="上个月" onClick={() => shiftMonth(-1)}>
                        <ChevronLeftIcon className={styles.navIcon} size={16} strokeWidth={2.6} />
                    </button>
                </div>
                <span className={styles.monthLabel}>
                    <CalendarIcon className={styles.monthIcon} size={16} strokeWidth={2.4} />
                    {viewMonth.year()}年{viewMonth.month() + 1}月
                </span>
                <div className={styles.headerGroup}>
                    <button type="button" className={styles.todayBtn} onClick={() => selectDate(today)}>
                        今天
                    </button>
                    <button type="button" className={styles.navBtn} aria-label="下个月" onClick={() => shiftMonth(1)}>
                        <ChevronRightIcon className={styles.navIcon} size={16} strokeWidth={2.6} />
                    </button>
                    <button type="button" className={styles.navBtn} aria-label="下一年" onClick={() => shiftYear(1)}>
                        <ChevronRightIcon className={styles.navIcon} size={14} strokeWidth={2.6} />
                    </button>
                </div>
            </div>
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
                            const content = eventLabel(segment.event, !segment.continuation, showEventTime);
                            const col = (segment.index % COLS) + 1;
                            const colSpan = segment.span;
                            const palette = segment.event.color ?? 'teal';
                            return (
                                <div
                                    key={`${monthKey}-evt-${segment.index}-${segment.row}-${i}`}
                                    data-color={palette}
                                    data-span={segment.span > 1 ? 'true' : undefined}
                                    data-start={segment.index % COLS === 0 ? 'true' : undefined}
                                    data-end={segment.endIndex % COLS === COLS - 1 ? 'true' : undefined}
                                    data-preview={segment.event === previewEvent ? 'true' : undefined}
                                    className={styles.event}
                                    style={{
                                        // 事项条绝对定位到所属周的日期数字下方，横向与日期圆共用一条内容轨道。
                                        // 纵向 = 表头 + 周序 × 单元格高 + 日期数字带 + 事项行序 × 行高，
                                        // 再靠 CSS 的 translateY(-50%) 把条在行内居中
                                        ['--animal-calendar-bar-top' as string]: `${
                                            metrics.header +
                                            Math.floor(segment.index / COLS) * metrics.cellHeight +
                                            metrics.numberBand +
                                            (segment.row + 0.5) * metrics.eventRow
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
