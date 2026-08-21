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
    /** 剩余毫秒变化时触发 */
    onChange?: (remaining: number) => void;
    /** 倒计时归零时触发 */
    onFinish?: () => void;
}

const toTimestamp = (value: number | Date) => (value instanceof Date ? value.getTime() : value);

const pad = (value: number) => String(value).padStart(2, '0');

const formatRemaining = (remaining: number, format: string) => {
    const totalSeconds = Math.ceil(remaining / 1_000);
    const days = Math.floor(totalSeconds / 86_400);
    const hasDays = format.includes('DD');
    const hours = hasDays ? Math.floor((totalSeconds % 86_400) / 3_600) : Math.floor(totalSeconds / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    return format
        .replace(/DD/g, pad(days))
        .replace(/HH/g, pad(hours))
        .replace(/mm/g, pad(minutes))
        .replace(/ss/g, pad(seconds));
};

export const Countdown: React.FC<CountdownProps> = ({
    value,
    format = 'HH:mm:ss',
    prefix,
    size = 'middle',
    variant = 'default',
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

    const classNames = [styles.countdown, styles[size], styles[variant], className].filter(Boolean).join(' ');

    return (
        <div className={classNames} role="timer" aria-live="off" {...rest}>
            {prefix !== undefined && <span className={styles.prefix}>{prefix}</span>}
            <span className={styles.value}>{formatRemaining(remaining, format)}</span>
        </div>
    );
};

Countdown.displayName = 'Countdown';
