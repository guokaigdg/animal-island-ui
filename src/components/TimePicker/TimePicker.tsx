import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from './time-picker.module.less';

export type TimePickerSize = 'small' | 'middle' | 'large';

export type TimePickerStatus = 'error' | 'warning';

/** 时分秒对象 */
export type TimePart = { h: number; m: number; s: number };

export interface TimePickerProps {
    /** 当前选中时间（受控），格式 HH:mm:ss */
    value?: string;
    /** 默认选中时间（非受控），格式 HH:mm:ss */
    defaultValue?: string;
    /** 值变化回调，清空时返回 null */
    onChange?: (value: string | null) => void;
    /** 占位文本 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否允许一键清空 */
    allowClear?: boolean;
    /** 尺寸 */
    size?: TimePickerSize;
    /** 校验状态 */
    status?: TimePickerStatus;
    /** 展示格式，支持 HH / mm / ss 占位符，默认 HH:mm:ss；包含 ss 时面板显示秒列 */
    format?: string;
    /** 小时步进（默认 1） */
    hourStep?: number;
    /** 分钟步进（默认 1） */
    minuteStep?: number;
    /** 秒步进（默认 1） */
    secondStep?: number;
    /** 受控展开状态 */
    open?: boolean;
    /** 展开状态变化回调 */
    onOpenChange?: (open: boolean) => void;
    /** 对外暴露的无障碍标签（无可见 label 时使用） */
    'aria-label'?: string;
    /** 关联外部可见 label 的 id */
    'aria-labelledby'?: string;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

const pad2 = (n: number) => `${n}`.padStart(2, '0');

/** 将 HH:mm:ss 字符串解析为时分秒对象，非法输入返回 null */
const parseTime = (value: string | null | undefined): TimePart | null => {
    if (!value) return null;
    const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value);
    if (!match) return null;
    const part: TimePart = { h: Number(match[1]), m: Number(match[2]), s: Number(match[3] ?? 0) };
    return part.h > 23 || part.m > 59 || part.s > 59 ? null : part;
};

/** 将时分秒序列化为 HH:mm:ss */
const toValue = (part: TimePart) => `${pad2(part.h)}:${pad2(part.m)}:${pad2(part.s)}`;

/** 按模板格式化时间，支持 HH / mm / ss 占位符 */
const formatTime = (part: TimePart, format: string) =>
    format.replace('HH', pad2(part.h)).replace('mm', pad2(part.m)).replace('ss', pad2(part.s));

/** 面板是否展示秒列：format 包含 ss */
const hasSeconds = (format: string) => format.includes('ss');

/** 关闭退场动画时长，与 .panel 的 0.2s 过渡保持一致，动画结束后再卸载面板 */
const CLOSE_ANIMATION_MS = 200;

export const TimePicker: React.FC<TimePickerProps> = ({
    value,
    defaultValue,
    onChange,
    placeholder = '请选择时间',
    disabled = false,
    allowClear = false,
    size = 'middle',
    status,
    format = 'HH:mm:ss',
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    open: openProp,
    onOpenChange,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    style,
}) => {
    const [innerValue, setInnerValue] = useState<string | null>(defaultValue ?? null);
    const [innerOpen, setInnerOpen] = useState(false);
    const [pending, setPending] = useState<TimePart | null>(() => parseTime(defaultValue));
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const closingRef = useRef(false);
    const closeTimerRef = useRef<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);
    const secondListRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value ?? null) : innerValue;
    const parsed = parseTime(currentValue);
    const open = openProp !== undefined ? openProp : innerOpen;

    const idPrefix = `animal-time-picker-${useId().replace(/:/g, '')}`;
    const panelId = `${idPrefix}-panel`;

    // 打开面板时重置待选值所用到的当前值引用，避免值变化本身触发重置
    const valueRef = useRef(currentValue);
    useEffect(() => {
        valueRef.current = currentValue;
    }, [currentValue]);

    const setOpen = useCallback(
        (next: boolean) => {
            if (openProp === undefined) setInnerOpen(next);
            onOpenChange?.(next);
        },
        [openProp, onOpenChange]
    );

    // 统一关闭入口：先播放退场动效，动画结束后再卸载面板
    const closePanel = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        closeTimerRef.current = window.setTimeout(() => {
            closingRef.current = false;
            setClosing(false);
            setOpen(false);
            setMounted(false);
        }, CLOSE_ANIMATION_MS);
    }, [setOpen]);

    // 组件卸载时清理未触发的关闭定时器
    useEffect(
        () => () => {
            if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
        },
        []
    );

    // 每次展开：待选值重置为当前值，定位面板并把选中项滚动到列中央
    useEffect(() => {
        if (!open) return;
        if (closeTimerRef.current !== null) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        closingRef.current = false;
        setClosing(false);
        const part = parseTime(valueRef.current) ?? { h: 0, m: 0, s: 0 };
        setPending(part);
        // 条目高 28px + 间距 10px
        const itemHeight = 38;
        const center = (list: HTMLDivElement | null, unit: number, step: number) => {
            if (!list) return;
            const index = Math.floor(unit / Math.max(1, step));
            list.scrollTop = index * itemHeight - list.clientHeight / 2 + itemHeight / 2;
        };
        center(hourListRef.current, part.h, hourStep);
        center(minuteListRef.current, part.m, minuteStep);
        if (hasSeconds(format)) center(secondListRef.current, part.s, secondStep);
    }, [open, format, hourStep, minuteStep, secondStep]);

    // 点击面板外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                closePanel();
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closePanel]);

    // 面板定位：优先向下展开，下方空间不足且上方更宽裕时向上翻转
    useEffect(() => {
        if (open && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const panelHeight = 320;
            const newStyle: React.CSSProperties = { position: 'absolute', left: 0 };
            if (rect.bottom + panelHeight > viewportHeight && rect.top > viewportHeight - rect.bottom) {
                newStyle.bottom = '100%';
                newStyle.marginBottom = '6px';
            } else {
                newStyle.top = '100%';
                newStyle.marginTop = '6px';
            }
            // 右侧空间不足时右对齐
            if (rect.left + 260 > window.innerWidth) {
                newStyle.right = 0;
                newStyle.left = 'auto';
            }
            setPanelStyle(newStyle);
            requestAnimationFrame(() => setMounted(true));
        } else if (!open) {
            setMounted(false);
        }
    }, [open]);

    // 点击某列数值：更新待选时间（触发区实时显示）
    const pickUnit = (part: TimePart) => setPending(part);

    // 此刻：待选时间设为当前时间
    const setNow = () => {
        const now = new Date();
        setPending({ h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() });
    };

    // 确定：值有变化时提交，随后关闭面板
    const confirmTime = () => {
        if (!pending) return;
        const next = toValue(pending);
        if (next !== currentValue) {
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
        }
        closePanel();
        triggerRef.current?.focus();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isControlled) setInnerValue(null);
        onChange?.(null);
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        const { key } = e;
        if (!open) {
            if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        if (key === 'Escape') {
            e.preventDefault();
            closePanel();
            triggerRef.current?.focus();
        } else if (key === 'Enter') {
            e.preventDefault();
            confirmTime();
        }
    };

    const base = pending ?? { h: 0, m: 0, s: 0 };
    const hours = Array.from({ length: 24 }, (_, i) => i).filter((h) => h % Math.max(1, hourStep) === 0);
    const minutes = Array.from({ length: 60 }, (_, i) => i).filter((m) => m % Math.max(1, minuteStep) === 0);
    const seconds = hasSeconds(format)
        ? Array.from({ length: 60 }, (_, i) => i).filter((s) => s % Math.max(1, secondStep) === 0)
        : [];

    const triggerCls = [
        styles.trigger,
        styles[`trigger-${size}`],
        status && styles[`trigger-${status}`],
        open && styles['trigger-open'],
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={wrapperRef}
            className={[styles.wrapper, disabled && styles['wrapper-disabled'], className].filter(Boolean).join(' ')}
            style={style}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
                // 仅当焦点明确移出 wrapper（如 Tab 到外部元素）时关闭；
                // 点击面板空白区域（relatedTarget 为 null）不关闭，外部点击由 mousedown 监听处理
                if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
                    closePanel();
                }
            }}
        >
            <div
                ref={triggerRef}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={open ? panelId : undefined}
                aria-disabled={disabled || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                tabIndex={disabled ? -1 : 0}
                className={triggerCls}
                onClick={() => !disabled && !closing && setOpen(!open)}
            >
                <span className={currentValue ? styles.value : styles.placeholder}>
                    {open && pending ? formatTime(pending, format) : parsed ? formatTime(parsed, format) : placeholder}
                </span>
                {allowClear && currentValue && !disabled && (
                    <button
                        type="button"
                        className={styles.clear}
                        aria-label="清除时间"
                        onClick={handleClear}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        ×
                    </button>
                )}
                <span className={styles.clockIcon} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M7 4.2V7l2 1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                </span>
            </div>
            {open && (
                <div
                    id={panelId}
                    role="dialog"
                    aria-label="选择时间"
                    className={`${styles.panel} ${!hasSeconds(format) ? styles.panelNoSeconds : ''} ${
                        closing ? styles.panelClosing : mounted ? styles.panelVisible : ''
                    }`}
                    style={panelStyle}
                >
                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <div className={styles.columnTitle}>时</div>
                            <div ref={hourListRef} className={styles.columnList}>
                                {hours.map((h) => (
                                    <button
                                        key={h}
                                        type="button"
                                        className={`${styles.option} ${base.h === h ? styles.optionSelected : ''}`}
                                        aria-label={`${h} 时`}
                                        onClick={() => pickUnit({ ...base, h })}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {pad2(h)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.columnTitle}>分</div>
                            <div ref={minuteListRef} className={styles.columnList}>
                                {minutes.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        className={`${styles.option} ${base.m === m ? styles.optionSelected : ''}`}
                                        aria-label={`${m} 分`}
                                        onClick={() => pickUnit({ ...base, m })}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {pad2(m)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {seconds.length > 0 && (
                            <div className={styles.column}>
                                <div className={styles.columnTitle}>秒</div>
                                <div ref={secondListRef} className={styles.columnList}>
                                    {seconds.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`${styles.option} ${base.s === s ? styles.optionSelected : ''}`}
                                            aria-label={`${s} 秒`}
                                            onClick={() => pickUnit({ ...base, s })}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {pad2(s)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.footerBtn}
                            onClick={setNow}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            此刻
                        </button>
                        <button
                            type="button"
                            className={styles.confirmBtn}
                            onClick={confirmTime}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            确定
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

TimePicker.displayName = 'TimePicker';
