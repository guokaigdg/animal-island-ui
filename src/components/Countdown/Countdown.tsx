import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './countdown.module.less';

export type CountdownSize = 'small' | 'middle' | 'large';
export type CountdownVariant = 'default' | 'island';

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
    /** 剩余毫秒变化时触发 */
    onChange?: (remaining: number) => void;
    /** 倒计时归零时触发 */
    onFinish?: () => void;
}

const toTimestamp = (value: number | Date) => (value instanceof Date ? value.getTime() : value);

const pad = (value: number) => String(value).padStart(2, '0');

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

const splitRemaining = (remaining: number, format: string) => {
    const totalSeconds = Math.ceil(remaining / 1_000);
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
    onChange,
    onFinish,
    className,
    ...rest
}) => {
    const getRemaining = useCallback(() => Math.max(0, toTimestamp(value) - Date.now()), [value]);
    const [remaining, setRemaining] = useState(getRemaining);
    const finishedRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const onFinishRef = useRef(onFinish);

    onChangeRef.current = onChange;
    onFinishRef.current = onFinish;

    useEffect(() => {
        finishedRef.current = false;

        const update = () => {
            const next = getRemaining();
            setRemaining(next);
            onChangeRef.current?.(next);

            if (next === 0 && !finishedRef.current) {
                finishedRef.current = true;
                onFinishRef.current?.();
            }
            return next;
        };

        if (update() === 0) return;
        const timer = window.setInterval(update, 250);
        return () => window.clearInterval(timer);
    }, [getRemaining]);

    const classNames = [styles.countdown, styles[size], styles[variant], bordered && styles.bordered, className]
        .filter(Boolean)
        .join(' ');
    const parts = parseFormat(format);
    const digits = splitRemaining(remaining, format);
    // 读屏文本：滚动数字条对辅助技术隐藏，用完整格式化串代替
    const readable = parts.map((part) => (part.kind === 'token' ? digits[part.token] : part.text)).join('');

    return (
        <div className={classNames} role="timer" aria-live="off" {...rest}>
            {prefix !== undefined && <span className={styles.prefix}>{prefix}</span>}
            <span className={styles.group} aria-hidden="true">
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
            <span className={styles.srOnly}>{readable}</span>
        </div>
    );
};

Countdown.displayName = 'Countdown';
