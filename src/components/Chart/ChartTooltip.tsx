import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from './chart.module.less';

/** 提示位置使用绘图坐标，横向边界同时考虑局部滚动位置。 */
interface ChartTooltipProps {
    /** 无障碍关联标识 */
    id: string;
    /** 数据点横坐标 */
    x: number;
    /** 数据点纵坐标 */
    y: number;
    /** 绘图区高度 */
    height: number;
    /** 当前可视宽度 */
    viewportWidth: number;
    /** 锁定后才接收指针，防止悬浮提示抢先遮住待点击的数据点 */
    locked: boolean;
    /** 已格式化提示内容 */
    children: React.ReactNode;
}

/** 内容测量后自动避让边缘，长系列提示在面板内滚动。 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({ id, x, y, height, viewportWidth, locked, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const width = Math.min(260, Math.max(1, viewportWidth - 16));
    useLayoutEffect(() => {
        // 不能假设提示只有两行：聚合、多行名称和自定义内容都可能改变实际高度。
        const element = ref.current;
        if (!element) return;
        /** 内容变化后重新测量，限制提示始终位于绘图区内。 */
        const measure = () => setMeasuredHeight(element.getBoundingClientRect().height);
        measure();
        const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
        observer?.observe(element);
        return () => observer?.disconnect();
    }, [children, width]);
    // 视口不再滚动，横向始终以 0 为起点，夹在 8px 内边距之内。
    const preferredLeft = x + 16 + width <= viewportWidth - 8 ? x + 16 : x - width - 16;
    const left = Math.max(8, Math.min(preferredLeft, viewportWidth - width - 8));
    const top = Math.max(
        8,
        Math.min(height - measuredHeight - 8, y - measuredHeight - 14 >= 8 ? y - measuredHeight - 14 : y + 16)
    );
    if (children === null || children === undefined || children === false) return null;
    return (
        <div
            ref={ref}
            id={id}
            role="tooltip"
            className={[styles.tooltip, locked && styles.tooltipLocked].filter(Boolean).join(' ')}
            style={{ left, top, width, maxHeight: height - 16 }}
        >
            {children}
        </div>
    );
};

ChartTooltip.displayName = 'ChartTooltip';
