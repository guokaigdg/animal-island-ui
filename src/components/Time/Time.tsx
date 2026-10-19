import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// dayjs 随本包一起打包，宿主应用注册的 locale 落不到这个实例上，所以内置 zh-cn。
// 以默认导入取对象、再传给 .locale()，而不是裸副作用导入：包声明了 sideEffects: false，
// 裸导入在消费者构建里可能被当成无副作用模块摇掉。
import zhCn from 'dayjs/locale/zh-cn';
import styles from './time.module.less';

export type TimeLocale = 'en' | 'zh-cn';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 星期格式，支持 dayjs 核心 token（dddd / ddd / dd 等），默认 dddd */
    weekdayFormat?: string;
    /** 月日格式，支持 dayjs 核心 token（YYYY / MMM / M / D / dddd 等），默认 MMM D，zh-cn 下默认 M月D日 */
    dateFormat?: string;
    /** 日期行语言，决定 dddd / MMM 输出的语言名，默认 en */
    locale?: TimeLocale;
}

/** 日期格式的语言默认值：中文习惯「6月8日」，英文「Jun 8」 */
const getDefaultDateFormat = (locale: TimeLocale) => (locale === 'zh-cn' ? 'M月D日' : 'MMM D');

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * 实时时钟卡片：
 * 上方 HH:MM 时钟每秒刷新，冒号按秒闪烁；
 * 下方主色胶囊显示星期与月日，挂载时淡入。星期与月日可分别用 dayjs format 定制。
 */
export const Time: React.FC<TimeProps> = ({
    weekdayFormat = 'dddd',
    dateFormat,
    locale = 'en',
    className,
    ...rest
}) => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1_000);
        return () => window.clearInterval(timer);
    }, []);

    const classNames = [styles.time, className].filter(Boolean).join(' ');
    const local = locale === 'zh-cn' ? dayjs(now).locale(zhCn) : dayjs(now);

    return (
        <div className={classNames} role="timer" aria-live="off" {...rest}>
            <div className={styles.clock}>
                {pad(now.getHours())}
                <span className={styles.colon}>:</span>
                {pad(now.getMinutes())}
            </div>
            <div className={styles.date}>
                <span className={styles.weekday}>{local.format(weekdayFormat)}</span>
                <span className={styles.dot} aria-hidden="true">
                    ·
                </span>
                <span className={styles.monthDay}>{local.format(dateFormat ?? getDefaultDateFormat(locale))}</span>
            </div>
        </div>
    );
};

Time.displayName = 'Time';
