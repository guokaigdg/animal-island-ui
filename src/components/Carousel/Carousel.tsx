import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './carousel.module.less';

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
    /** 轮播内容，每个直接子元素为一张 */
    children: React.ReactNode;
    /** 当前索引，传入时为受控模式 */
    activeIndex?: number;
    /** 非受控模式的初始索引 */
    defaultActiveIndex?: number;
    /** 切换后的回调 */
    onChange?: (index: number) => void;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 自动播放间隔，单位毫秒 */
    interval?: number;
    /** 是否首尾循环 */
    loop?: boolean;
    /** 是否显示左右箭头 */
    showArrows?: boolean;
    /** 是否显示圆点指示器 */
    showDots?: boolean;
    /** 鼠标悬停时是否暂停自动播放；键盘焦点进入时始终暂停 */
    pauseOnHover?: boolean;
}

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0));

export const Carousel: React.FC<CarouselProps> = ({
    children,
    activeIndex,
    defaultActiveIndex = 0,
    onChange,
    autoplay = false,
    interval = 3_000,
    loop = true,
    showArrows = true,
    showDots = true,
    pauseOnHover = true,
    className,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    'aria-label': ariaLabel = '轮播图',
    ...rest
}) => {
    const slides = useMemo(() => Children.toArray(children), [children]);
    const lastIndex = slides.length - 1;
    const [internalIndex, setInternalIndex] = useState(() => clamp(defaultActiveIndex, lastIndex));
    const [hoverPaused, setHoverPaused] = useState(false);
    const [focusPaused, setFocusPaused] = useState(false);
    const [rotationPaused, setRotationPaused] = useState(false);
    const currentIndex = clamp(activeIndex ?? internalIndex, lastIndex);
    const effectivePaused = hoverPaused || focusPaused || rotationPaused;

    const goTo = useCallback(
        (nextIndex: number) => {
            if (slides.length === 0) return;
            let normalized = nextIndex;
            if (loop) normalized = (nextIndex + slides.length) % slides.length;
            else normalized = clamp(nextIndex, lastIndex);
            if (normalized === currentIndex) return;
            if (activeIndex === undefined) setInternalIndex(normalized);
            onChange?.(normalized);
        },
        [activeIndex, currentIndex, lastIndex, loop, onChange, slides.length]
    );

    useEffect(() => {
        if (!autoplay || effectivePaused || slides.length < 2) return;
        const timer = window.setInterval(() => goTo(currentIndex + 1), Math.max(interval, 1_000));
        return () => window.clearInterval(timer);
    }, [autoplay, currentIndex, effectivePaused, goTo, interval, slides.length]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'ArrowLeft') goTo(currentIndex - 1);
        else if (event.key === 'ArrowRight') goTo(currentIndex + 1);
        else if (event.key === 'Home') goTo(0);
        else if (event.key === 'End') goTo(lastIndex);
        else return;
        event.preventDefault();
    };

    const classNames = [styles.carousel, className].filter(Boolean).join(' ');
    const hasControls = slides.length > 1;

    return (
        <section
            className={classNames}
            role="region"
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={(event) => {
                if (pauseOnHover) setHoverPaused(true);
                onMouseEnter?.(event);
            }}
            onMouseLeave={(event) => {
                setHoverPaused(false);
                onMouseLeave?.(event);
            }}
            onFocus={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(true);
                onFocus?.(event);
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
                onBlur?.(event);
            }}
            {...rest}
        >
            {hasControls && autoplay && (
                <button
                    type="button"
                    className={styles.rotationControl}
                    aria-label={effectivePaused ? '继续自动播放' : '暂停自动播放'}
                    onClick={() => {
                        if (effectivePaused) {
                            setHoverPaused(false);
                            setFocusPaused(false);
                            setRotationPaused(false);
                        } else {
                            setRotationPaused(true);
                        }
                    }}
                >
                    {effectivePaused ? '播放' : '暂停'}
                </button>
            )}
            <div className={styles.viewport}>
                {slides.map((slide, index) => {
                    const active = index === currentIndex;
                    return (
                        <div
                            key={index}
                            className={[styles.slide, active && styles.active].filter(Boolean).join(' ')}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`第 ${index + 1} 张，共 ${slides.length} 张`}
                            aria-hidden={!active}
                        >
                            {slide}
                        </div>
                    );
                })}
            </div>

            {hasControls && showArrows && (
                <>
                    <button
                        type="button"
                        className={[styles.arrow, styles.previous].join(' ')}
                        aria-label="上一张"
                        disabled={!loop && currentIndex === 0}
                        onClick={() => goTo(currentIndex - 1)}
                    />
                    <button
                        type="button"
                        className={[styles.arrow, styles.next].join(' ')}
                        aria-label="下一张"
                        disabled={!loop && currentIndex === lastIndex}
                        onClick={() => goTo(currentIndex + 1)}
                    />
                </>
            )}

            {hasControls && showDots && (
                <div className={styles.dots} role="group" aria-label="选择轮播页">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={[styles.dot, index === currentIndex && styles.dotActive]
                                .filter(Boolean)
                                .join(' ')}
                            aria-label={`转到第 ${index + 1} 张`}
                            aria-current={index === currentIndex ? 'true' : undefined}
                            onClick={() => goTo(index)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

Carousel.displayName = 'Carousel';
