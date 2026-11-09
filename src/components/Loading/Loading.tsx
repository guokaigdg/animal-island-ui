import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LoadingProps } from './types';
import { Sailboat } from './Sailboat';
import styles from './loading.module.less';

const FLAKE_COUNT = 50;

/** 遮罩半径由 JS 计算后写进 CSS 变量，自定义属性必须注册才能被 transition 插值 */
type MaskStyle = React.CSSProperties & {
    '--animal-loading-mask-duration'?: string;
    '--animal-loading-mask-r'?: string;
};

export const Loading: React.FC<LoadingProps> = ({
    type = 'snow',
    showBoat = true,
    active = true,
    tip,
    delay = 0,
    fadeDuration = 0.6,
    zIndex = 3000,
    className,
    style,
    ...rest
}) => {
    const isCircle = type === 'circle';
    // shown：雪花屏已显示（含淡出阶段）；exiting：正在渐变消失
    // 初值直接由 props 推导：若从 false 起步，要等 effect 跑完才置 true，
    // 首帧会漏出遮罩底下的内容 —— 挂载瞬间就 active 的场景（页面级 Loading）
    // 会看到内容闪一下再被盖住。
    const [shown, setShown] = useState(active && delay === 0);
    const [exiting, setExiting] = useState(false);
    const [maskRadius, setMaskRadius] = useState(0);
    // ref 与 state 同步，供 effect 读取而无需将其纳入依赖
    const shownRef = useRef(false);
    const showTimerRef = useRef<number>(undefined);
    const hideTimerRef = useRef<number>(undefined);
    const rootRef = useRef<HTMLDivElement>(null);

    // 生成 50 片雪花：随机尺寸（1–6px）、水平位置（0–100%）与下落时长（6–12s）；
    // 负延迟让每片雪花从周期中段开始，首屏即有分布，无需等待飘满
    const flakes = useMemo(
        () =>
            Array.from({ length: FLAKE_COUNT }, () => {
                const size = Math.random() * 5 + 1;
                const duration = Math.random() * 6 + 6;
                return {
                    width: size,
                    height: size,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${-Math.random() * duration}s`,
                };
            }),
        []
    );

    useEffect(() => {
        window.clearTimeout(showTimerRef.current);

        if (active) {
            // 淡出途中恢复开启：取消卸载计时，立即回到不透明
            window.clearTimeout(hideTimerRef.current);
            setExiting(false);
            if (delay === 0) {
                shownRef.current = true;
                setShown(true);
            } else {
                showTimerRef.current = window.setTimeout(() => {
                    shownRef.current = true;
                    setShown(true);
                }, delay);
            }
            return () => window.clearTimeout(showTimerRef.current);
        }

        // active=false：只有显示过才进入渐变消失
        if (shownRef.current) {
            setExiting(true);
            hideTimerRef.current = window.setTimeout(() => {
                shownRef.current = false;
                setShown(false);
                setExiting(false);
            }, fadeDuration * 1000);
        }
    }, [active, delay, fadeDuration]);

    // 圆形扩散展开的半径：需完全覆盖容器对角线，否则四角会残留一圈
    // 单独一个 effect 而非并入上面的退出分支 —— 半径在 .masking 类挂上之后才写入，
    // 这样自定义属性一定是从 0 变化到目标值，transition 才会真正插值
    useEffect(() => {
        if (!exiting || !isCircle) {
            setMaskRadius(0);
            return;
        }
        const rect = rootRef.current?.getBoundingClientRect();
        const width = rect?.width || window.innerWidth;
        const height = rect?.height || window.innerHeight;
        setMaskRadius(Math.ceil(Math.hypot(width, height) / 2) + 50);
    }, [exiting, isCircle]);

    // 卸载时清理计时器
    useEffect(
        () => () => {
            window.clearTimeout(showTimerRef.current);
            window.clearTimeout(hideTimerRef.current);
        },
        []
    );

    if (!shown) return null;

    const rootCls = [
        styles.loading,
        isCircle && styles.circle,
        exiting && (isCircle ? styles.masking : styles.exiting),
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const rootStyle: MaskStyle = {
        zIndex,
        ...(isCircle ? { '--animal-loading-mask-duration': `${fadeDuration}s` } : {}),
        ...(isCircle ? { '--animal-loading-mask-r': `${maskRadius}px` } : {}),
        ...(exiting && !isCircle ? { transitionDuration: `${fadeDuration}s` } : {}),
        ...style,
    };

    const caption = tip ? <div className={styles.tip}>{tip}</div> : <span className={styles.srOnly}>加载中</span>;

    return (
        <div ref={rootRef} className={rootCls} style={rootStyle} role="status" {...rest}>
            {isCircle ? (
                <>
                    {showBoat && (
                        <div className={styles.sailboatScene} aria-hidden="true">
                            <Sailboat />
                        </div>
                    )}
                    {caption}
                </>
            ) : (
                <>
                    <div className={styles.snow} aria-hidden="true">
                        {flakes.map((flakeStyle, i) => (
                            <span key={i} className={styles.flake} style={flakeStyle} />
                        ))}
                    </div>
                    <span className={styles.vignette} aria-hidden="true" />
                    {caption}
                </>
            )}
        </div>
    );
};

Loading.displayName = 'Loading';
