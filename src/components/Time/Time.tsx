import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// dayjs 随本包一起打包，宿主应用注册的 locale 落不到这个实例上，所以内置 zh-cn。
// 以默认导入取对象、再传给 .locale()，而不是裸副作用导入：包声明了 sideEffects: false，
// 裸导入在消费者构建里可能被当成无副作用模块摇掉。
// 子路径必须带 .js：dayjs 没有 exports 字段，Node 的 ESM 解析器不做扩展名补全，
// `dayjs/locale/zh-cn` 在纯 Node / Next.js 下会 ERR_MODULE_NOT_FOUND，整个包加载不了。
import zhCn from 'dayjs/locale/zh-cn.js';
import styles from './time.module.less';

export type TimeLocale = 'en' | 'zh-cn';

/** 展示变体：default 时钟卡片（时间 + 日期胶囊）/ game 时间-分割线-日期+周几的竖排 */
export type TimeVariant = 'default' | 'game';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 展示变体，默认 default；game 为竖排 HUD 结构 */
    variant?: TimeVariant;
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
    variant = 'default',
    weekdayFormat = 'dddd',
    dateFormat,
    locale = 'en',
    className,
    ...rest
}) => {
    // 初始为 null：服务端与客户端首帧都渲染 "--:--"，挂载后再写入真实时间。
    // 若在 useState 初始化时读取 new Date()，跨分钟 hydrate 会导致文本不一致。
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        const tick = () => setNow(new Date());
        tick();
        const timer = window.setInterval(tick, 1_000);
        return () => window.clearInterval(timer);
    }, []);

    const classNames = [styles.time, variant === 'game' && styles.game, className].filter(Boolean).join(' ');
    const local = now ? (locale === 'zh-cn' ? dayjs(now).locale(zhCn) : dayjs(now)) : null;
    const weekday = local ? local.format(weekdayFormat) : '';
    const monthDay = local ? local.format(dateFormat ?? getDefaultDateFormat(locale)) : '';
    const hour = now ? pad(now.getHours()) : '--';
    const minute = now ? pad(now.getMinutes()) : '--';

    // game 变体：竖排 HUD —— 时间 / 分割线 / 月日 + 周几胶囊
    if (variant === 'game') {
        return (
            <div className={classNames} role="timer" aria-live="off" {...rest}>
                <div className={styles.clock}>
                    {hour}
                    <span className={styles.colon}>:</span>
                    {minute}
                </div>
                <div className={styles.divider} aria-hidden="true" />
                <div className={styles.gameDate}>
                    <span className={styles.gameMonthDay}>{monthDay}</span>
                    <span className={styles.gameWeekday}>{weekday}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames} role="timer" aria-live="off" {...rest}>
            <div className={styles.clock}>
                {hour}
                <span className={styles.colon}>:</span>
                {minute}
            </div>
            <div className={styles.date}>
                <span className={styles.weekday}>{weekday}</span>
                <span className={styles.dot} aria-hidden="true">
                    ·
                </span>
                <span className={styles.monthDay}>{monthDay}</span>
            </div>
        </div>
    );
};

Time.displayName = 'Time';
