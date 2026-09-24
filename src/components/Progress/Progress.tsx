import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { ProgressSize, ProgressProps, ProgressVariant } from './types';
import styles from './progress.module.less';
import sweetCorner from '../../assets/image/sweet-corner.svg';
import forestGrove from '../../assets/image/forest-grove.svg';
import starryCamp from '../../assets/image/starry-camp.svg';
import coffeeBreak from '../../assets/image/coffee-break.svg';

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
        // 传入 variant 时用场景图铺满（从左揭开）；未传时用纯色 fill
        ...(variant
            ? {
                  backgroundImage: `url(${VARIANT_BG[variant]})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left top',
                  backgroundSize: trackW > 0 ? `${trackW}px auto` : '100% auto',
              }
            : { backgroundColor: '#19c8b9' }),
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
                    <div className={fillCls} style={inlineFillStyle} />
                </div>
                {showInfo && <div className={classNames(styles.info, styles.right)}>{renderedInfo}</div>}
            </div>
        </div>
    );
};

Progress.displayName = 'Progress';
