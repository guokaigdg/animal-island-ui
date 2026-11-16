import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Wave } from '../../internal/Wave';
import { ProgressSize, ProgressProps, ProgressVariant } from './types';
import styles from './progress.module.less';
import { sweetCorner, coffeeBreak } from '../../assets/image/sceneImages';
// 同 sceneImages：走 new URL 而不是 import，避免产物里出现 Node 解析不了的 SVG 依赖
const forestGrove = new URL('../../assets/image/forest-grove.svg', import.meta.url).href;
const starryCamp = new URL('../../assets/image/starry-camp.svg', import.meta.url).href;

const VARIANT_BG: Record<ProgressVariant, string> = {
    'sweet-corner': sweetCorner,
    'forest-grove': forestGrove,
    'starry-camp': starryCamp,
    'coffee-break': coffeeBreak,
};

const SIZE_CLASS: Record<ProgressSize, string> = {
    small: styles['size-small']!,
    middle: styles['size-middle']!,
    large: styles['size-large']!,
};

export const Progress: React.FC<ProgressProps> = ({
    percent,
    size = 'middle',
    variant,
    color,
    wave = false,
    animated = true,
    showInfo = true,
    infoFormat,
    duration = 0.6,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}) => {
    const safePercent = useMemo(() => {
        if (typeof percent !== 'number' || Number.isNaN(percent)) return 0;
        return Math.max(0, Math.min(100, percent));
    }, [percent]);

    const renderedInfo = useMemo(() => {
        if (infoFormat) return infoFormat(safePercent);
        return `${Math.round(safePercent)}%`;
    }, [infoFormat, safePercent]);

    // track 宽度（px）：图片按整条轨道宽度铺满（取上部），fill 只显示左侧进度宽的部分 = 从左揭开
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [trackW, setTrackW] = useState(0);
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        if (typeof ResizeObserver === 'undefined') {
            setTrackW(el.clientWidth);
            return;
        }
        const ro = new ResizeObserver((entries) => {
            setTrackW(entries[0]?.contentRect?.width ?? el.clientWidth);
        });
        ro.observe(el);
        setTrackW(el.clientWidth);
        return () => ro.disconnect();
    }, []);

    const inlineFillStyle: React.CSSProperties = {
        width: `${safePercent}%`,
        transitionDuration: `${duration}s`,
        // 场景图优先；自定义色用透明高光叠色，避免被默认薄荷渐变覆盖。
        ...(variant
            ? {
                  backgroundImage: `url(${VARIANT_BG[variant]})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left top',
                  backgroundSize: trackW > 0 ? `${trackW}px auto` : '100% auto',
              }
            : color
              ? {
                    backgroundColor: color,
                    backgroundImage:
                        'linear-gradient(180deg, rgba(255,255,255,0.24), transparent 60%, rgba(61,52,40,0.08))',
                }
              : {}),
    };

    // 百分比文字固定显示在进度条右侧
    const cls = classNames(styles.progress, className);
    const trackCls = classNames(styles.track, SIZE_CLASS[size]);
    const fillCls = classNames(styles.fill, duration === 0 && styles.noTransition);

    const ariaValueText = typeof renderedInfo === 'string' ? renderedInfo : undefined;

    return (
        <div
            className={cls}
            style={style}
            role="progressbar"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(safePercent)}
            aria-valuetext={ariaValueText}
        >
            <div className={styles.row}>
                <div className={trackCls} ref={trackRef}>
                    <div className={fillCls} style={inlineFillStyle}>
                        {wave && <Wave animated={animated && safePercent > 0 && safePercent < 100} />}
                    </div>
                </div>
                {showInfo && <div className={classNames(styles.info, styles.right)}>{renderedInfo}</div>}
            </div>
        </div>
    );
};

Progress.displayName = 'Progress';
