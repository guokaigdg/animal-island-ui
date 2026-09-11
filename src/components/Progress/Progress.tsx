import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { ProgressSize, ProgressProps, ProgressVariant } from './types';
import styles from './progress.module.less';
import sweetCorner from '../../assets/image/Progress/sweet-corner.svg';
import forestGrove from '../../assets/image/Progress/forest-grove.svg';
import starryCamp from '../../assets/image/Progress/starry-camp.svg';
import coffeeBreak from '../../assets/image/Progress/coffee-break.svg';

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

// fill 末端留出文字宽度的阈值（避免 fill 太窄时文字外溢到 track 上被白色看不清）
const INSIDE_MIN_FILL = 18;

export const Progress: React.FC<ProgressProps> = ({
    percent,
    size = 'middle',
    variant = 'sweet-corner',
    showInfo = true,
    infoPosition = 'inside',
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
        // 图片宽度固定为整条轨道宽度（取上部，不拉伸变形）；fill 自身 overflow hidden 按进度宽度裁剪左侧 = 从左揭开
        backgroundImage: `url(${VARIANT_BG[variant]})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left top',
        backgroundSize: trackW > 0 ? `${trackW}px auto` : '100% auto',
    };

    // inside 模式：fill 过窄时把文字退到 track 末端右侧（避免白色文字落在沙土色 track 上看不清）
    const isInside = showInfo && infoPosition === 'inside';
    const infoInsideVisible = isInside && safePercent >= INSIDE_MIN_FILL;

    const cls = classNames(styles.progress, className);
    const trackCls = classNames(styles.track, SIZE_CLASS[size]);
    const fillCls = classNames(styles.fill, duration === 0 && styles.noTransition);
    const bodyCls = classNames(styles.body, infoPosition === 'top' ? '' : styles.noGap);

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
            {infoPosition === 'top' ? (
                <div className={bodyCls}>
                    {showInfo && <div className={classNames(styles.info, styles.top)}>{renderedInfo}</div>}
                    <div className={trackCls} ref={trackRef}>
                        <div className={fillCls} style={inlineFillStyle}>
                            {infoInsideVisible && <span className={styles.infoInside}>{renderedInfo}</span>}
                        </div>
                        {isInside && !infoInsideVisible && (
                            <span className={styles.infoInside} style={{ color: '#725d42' }}>
                                {renderedInfo}
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.row}>
                    <div className={trackCls} ref={trackRef}>
                        <div className={fillCls} style={inlineFillStyle}>
                            {infoInsideVisible && <span className={styles.infoInside}>{renderedInfo}</span>}
                        </div>
                        {isInside && !infoInsideVisible && (
                            <span className={styles.infoInside} style={{ color: '#725d42' }}>
                                {renderedInfo}
                            </span>
                        )}
                    </div>
                    {showInfo && infoPosition === 'right' && (
                        <div className={classNames(styles.info, styles.right)}>{renderedInfo}</div>
                    )}
                </div>
            )}
        </div>
    );
};

Progress.displayName = 'Progress';
