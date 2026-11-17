import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import styles from './countdown.module.less';
import { resolveShake, type CountdownShakeOptions } from './motion';

export type CountdownSize = 'small' | 'middle' | 'large';
export type CountdownVariant = 'default' | 'island';

/** 倒计时提醒规则，按显示的剩余秒数匹配阈值。 */
export interface CountdownReminderRule {
    /** 剩余秒数小于等于此值时生效，须为非负有限数；多档命中时取最小阈值 */
    seconds: number;
    /** 数字、分隔符与已开启数字块边框的颜色，支持 CSS 颜色或变量 */
    color: string;
}

export interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
    /** 结束时间，可以传时间戳或 Date */
    value: number | Date;
    /** 输出格式，支持 DD、HH、mm、ss，默认 HH:mm:ss */
    format?: string;
    /** 倒计时前的说明内容 */
    prefix?: React.ReactNode;
    /** 尺寸 */
    size?: CountdownSize;
    /** 显示风格 */
    variant?: CountdownVariant;
    /** 数字块是否带边框，默认无 */
    bordered?: boolean;
    /** 提醒配置：默认 false；true 使用 60 秒橙色 / 10 秒红色，数组完全替换默认规则 */
    reminder?: boolean | readonly CountdownReminderRule[];
    /** 抖动提醒，默认 false；兼容 true / 秒数简写，对象自定义阈值、节奏、位移、旋转及缓动 */
    shake?: boolean | number | CountdownShakeOptions;
    /** 剩余毫秒变化时触发 */
    onChange?: (remaining: number) => void;
    /** 倒计时归零时触发 */
    onFinish?: () => void;
}

const toTimestamp = (value: number | Date) => (value instanceof Date ? value.getTime() : value);

const pad = (value: number) => String(value).padStart(2, '0');

/** 开启提醒时的默认配色，橙色保持暖色调，红色沿用错误色令牌。 */
const DEFAULT_REMINDERS: readonly CountdownReminderRule[] = [
    { seconds: 60, color: '#c77c34' },
    { seconds: 10, color: 'var(--animal-error-color, #e05a5a)' },
];

/** 从任意顺序的规则中取最小命中阈值，不排序或修改调用方的数组。 */
const getReminderColor = (seconds: number, rules: readonly CountdownReminderRule[]): string | undefined => {
    let matched: CountdownReminderRule | undefined;
    for (const rule of rules) {
        // 排除无效规则；同阈值保留首项，使重复配置有确定的优先级。
        if (!Number.isFinite(rule.seconds) || rule.seconds < 0 || !rule.color.trim()) continue;
        if (seconds <= rule.seconds && (!matched || rule.seconds < matched.seconds)) matched = rule;
    }
    return matched?.color;
};

type TimePart = { kind: 'token'; token: 'DD' | 'HH' | 'mm' | 'ss' } | { kind: 'literal'; text: string };

/** 将格式模板解析为 token / 字面量序列，字面量（":"、"天" 等）原样渲染为分隔符 */
const parseFormat = (format: string): TimePart[] => {
    const parts: TimePart[] = [];
    const re = /DD|HH|mm|ss/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(format)) !== null) {
        if (m.index > last) parts.push({ kind: 'literal', text: format.slice(last, m.index) });
        parts.push({ kind: 'token', token: m[0] as 'DD' | 'HH' | 'mm' | 'ss' });
        last = m.index + m[0].length;
    }
    if (last < format.length) parts.push({ kind: 'literal', text: format.slice(last) });
    return parts;
};

/** 把剩余秒数（已向上取整）拆成天/时/分/秒；格式含 DD 时小时不进位到天 */
const splitSeconds = (totalSeconds: number, format: string) => {
    const days = Math.floor(totalSeconds / 86_400);
    const hasDays = format.includes('DD');
    const hours = hasDays ? Math.floor((totalSeconds % 86_400) / 3_600) : Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;
    return { DD: pad(days), HH: pad(hours), mm: pad(minutes), ss: pad(seconds) } as const;
};

const DIGIT_FACES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/**
 * 单个数字位：纵向数字条（0-9 两轮共 20 面），translateY 滚动到当前数字。
 * 所有变化都向下滚动（新数字从顶部进入）；到 0 后回绕时瞬移到下一循环的同数字位置，
 * 再继续向下滚，保证方向永远一致（里程表式单向滚动）。
 */
const DigitRoll = ({ digit }: { digit: string }) => {
    const stripRef = useRef<HTMLSpanElement>(null);
    // pos 为 20 面数字条上的索引，pos % 10 即显示的数字
    const posRef = useRef(Number(digit));
    const prevDigit = useRef(digit);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        const prev = Number(prevDigit.current);
        const next = Number(digit);
        prevDigit.current = digit;
        if (prev === next) return;

        // 向下滚动的步数：减 1 走 1 步，0→9 回绕也走 1 步
        const delta = (prev - next + 10) % 10;
        let from = posRef.current;
        let target = from - delta;

        if (target < 0) {
            // 跨循环回绕：先关过渡瞬移到同数字的下一循环位置（视觉无变化），再向下滚动
            from += 10;
            target = from - delta;
            el.style.transition = 'none';
            el.style.transform = `translateY(-${from * 5}%)`;
            void el.offsetHeight; // 强制回流，让瞬移先生效
            el.style.transition = '';
        }

        posRef.current = target;
        el.style.transform = `translateY(-${target * 5}%)`;
    }, [digit]);

    return (
        <span className={styles.digitCell}>
            <span
                ref={stripRef}
                className={styles.digitStrip}
                style={{ transform: `translateY(-${posRef.current * 5}%)` }}
            >
                {[...DIGIT_FACES, ...DIGIT_FACES].map((face, i) => (
                    <span key={i} className={styles.digitFace}>
                        {face}
                    </span>
                ))}
            </span>
        </span>
    );
};

export const Countdown: React.FC<CountdownProps> = ({
    value,
    format = 'HH:mm:ss',
    prefix,
    size = 'middle',
    variant = 'default',
    bordered = false,
    reminder = false,
    shake = false,
    onChange,
    onFinish,
    className,
    style,
    ...rest
}) => {
    // 同一截止时间的 Date 对象即使重建，也不能重新触发本轮完成反馈。
    const deadline = toTimestamp(value);
    // 距离结束时刻还剩多少毫秒；dayjs 的 diff 负责跨时区/跨夏令时的真实时间差
    const getRemaining = useCallback(() => Math.max(0, dayjs(deadline).diff(dayjs())), [deadline]);
    const [remaining, setRemaining] = useState(0);
    // 服务端与客户端首帧都渲染占位符，挂载后再写入真实剩余时间，
    // 否则两端 `Date.now()` 相差几百毫秒就会触发 hydration mismatch。
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<HTMLDivElement>(null);
    const [motionVisible, setMotionVisible] = useState(false);
    const shakeOptions = resolveShake(shake);
    const finishedRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const onFinishRef = useRef(onFinish);

    onChangeRef.current = onChange;
    onFinishRef.current = onFinish;

    useEffect(() => {
        setMounted(true);
        finishedRef.current = false;
        let timer: number | undefined;

        const update = () => {
            const next = getRemaining();
            setRemaining(next);
            onChangeRef.current?.(next);

            if (next === 0) {
                if (!finishedRef.current) {
                    finishedRef.current = true;
                    onFinishRef.current?.();
                }
                // 归零后清除定时器，避免 setInterval 空转（远端 5a002e0 修复）
                if (timer !== undefined) {
                    window.clearInterval(timer);
                    timer = undefined;
                }
            }
            return next;
        };

        if (update() > 0) {
            timer = window.setInterval(update, 250);
        }

        return () => {
            if (timer !== undefined) {
                window.clearInterval(timer);
            }
        };
    }, [getRemaining, deadline]);

    // 使用与数字显示一致的向上取整秒数，避免还显示 11 秒时提前进入 10 秒提醒。
    // 挂载前为 null，不触发提醒/抖动配色，保证占位符不呈现错误状态。
    const remainingSeconds = mounted ? Math.ceil(remaining / 1_000) : null;
    const reminderColor =
        remainingSeconds === null
            ? undefined
            : getReminderColor(remainingSeconds, reminder === true ? DEFAULT_REMINDERS : reminder || []);
    // 与显示秒数共用阈值；零值和非正配置不会触发抖动，重置截止时间后可重新进入提醒。
    const shaking = remainingSeconds !== null && remainingSeconds > 0 && remainingSeconds <= shakeOptions.seconds;
    const urgent = remainingSeconds !== null && shaking && remainingSeconds <= shakeOptions.urgentSeconds;
    useEffect(() => {
        const element = timerRef.current;
        if (!element || !shaking) return;
        let visible = typeof IntersectionObserver === 'undefined';
        /** 合并视口与页面可见性，后台或离屏时暂停抖动。 */
        const update = () => {
            // 页面恢复时仍需尊重视口位置，避免隐藏在滚动区域外的组件继续播放。
            setMotionVisible(visible && !document.hidden);
        };
        const observer =
            typeof IntersectionObserver === 'undefined'
                ? undefined
                : new IntersectionObserver(([entry]) => {
                      visible = entry?.isIntersecting ?? false;
                      update();
                  });
        observer?.observe(element);
        document.addEventListener('visibilitychange', update);
        update();
        return () => {
            observer?.disconnect();
            document.removeEventListener('visibilitychange', update);
        };
    }, [shaking]);
    const classNames = [
        styles.countdown,
        styles[size],
        styles[variant],
        bordered && styles.bordered,
        reminderColor && styles.reminding,
        shaking && styles.shaking,
        urgent && styles.urgent,
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const parts = parseFormat(format);
    const digits = splitSeconds(remainingSeconds ?? 0, format);
    // 读屏文本：滚动数字条对辅助技术隐藏，用完整格式化串代替
    const readable = parts.map((part) => (part.kind === 'token' ? digits[part.token] : part.text)).join('');
    // 挂载前使用与格式等宽的占位串，保证 SSR 与客户端首帧完全一致
    const placeholder = format.replace(/DD|HH|mm|ss/g, '--');

    return (
        <div
            ref={timerRef}
            className={classNames}
            style={
                {
                    ...style,
                    '--animal-countdown-reminder-color': reminderColor,
                    '--countdown-shake-duration': `${shakeOptions.duration}ms`,
                    '--countdown-shake-distance': `${shakeOptions.distance}px`,
                    '--countdown-shake-angle': `${shakeOptions.rotation}deg`,
                    '--countdown-urgent-duration': `${shakeOptions.urgentDuration}ms`,
                    '--countdown-urgent-distance': `${shakeOptions.urgentDistance}px`,
                    '--countdown-urgent-angle': `${shakeOptions.urgentRotation}deg`,
                    '--countdown-shake-easing': shakeOptions.easing,
                } as React.CSSProperties
            }
            role="timer"
            aria-live="off"
            {...rest}
        >
            {prefix !== undefined && <span className={styles.prefix}>{prefix}</span>}
            {mounted ? (
                <span
                    aria-hidden="true"
                    className={styles.group}
                    style={shaking ? { animationPlayState: motionVisible ? 'running' : 'paused' } : undefined}
                >
                    {parts.map((part, i) =>
                        part.kind === 'token' ? (
                            <span key={`${part.token}-${i}`} className={styles.unit}>
                                {digits[part.token].split('').map((d, j) => (
                                    <DigitRoll key={`${part.token}-${j}`} digit={d} />
                                ))}
                            </span>
                        ) : (
                            <span key={`sep-${i}`} className={/[:：]/.test(part.text) ? styles.colon : styles.sep}>
                                {part.text}
                            </span>
                        )
                    )}
                </span>
            ) : (
                <span aria-hidden="true" className={styles.group}>
                    {placeholder}
                </span>
            )}
            <span className={styles.srOnly}>{mounted ? readable : placeholder}</span>
        </div>
    );
};

Countdown.displayName = 'Countdown';
