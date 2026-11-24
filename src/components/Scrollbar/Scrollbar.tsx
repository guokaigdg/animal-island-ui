import React from 'react';
import classNames from 'classnames';
import styles from './scrollbar.module.less';

export type ScrollbarDirection = 'vertical' | 'horizontal' | 'both';

export interface ScrollbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** 容器高度，数字按 px 处理，垂直滚动时最常用 */
    height?: number | string;
    /** 容器最大高度 */
    maxHeight?: number | string;
    /** 容器宽度，数字按 px 处理，水平滚动时最常用 */
    width?: number | string;
    /** 容器最大宽度 */
    maxWidth?: number | string;
    /** 滚动方向，默认 vertical；另一条轴会被裁掉而不是留着第二条滚动条 */
    direction?: ScrollbarDirection;
    /** 滑块颜色，默认取次级文字色；传 CSS 变量可跟随主题换肤 */
    thumbColor?: string;
    /** 滑块粗细（px），默认 8 —— 比系统经典滚动条更细 */
    thumbSize?: number;
    /** 是否显示轨道底色，默认 false（仅滑块可见） */
    showTrack?: boolean;
    /** 滚动区域内容 */
    children?: React.ReactNode;
}

export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
    (
        {
            height,
            maxHeight,
            width,
            maxWidth,
            direction = 'vertical',
            thumbColor,
            thumbSize = 8,
            showTrack = false,
            className,
            style,
            children,
            ...rest
        },
        ref
    ) => {
        const rootClassName = classNames(styles.scrollbar, styles[direction], showTrack && styles.showTrack, className);

        return (
            <div
                ref={ref}
                className={rootClassName}
                style={
                    {
                        height,
                        maxHeight,
                        width,
                        maxWidth,
                        '--animal-scrollbar-thumb': thumbColor,
                        '--animal-scrollbar-size': `${thumbSize}px`,
                        ...style,
                    } as React.CSSProperties
                }
                // 滚动区必须能被键盘聚焦，否则方向键滚动在旧版 Chrome / Safari 上失效
                tabIndex={0}
                {...rest}
            >
                {children}
            </div>
        );
    }
);

Scrollbar.displayName = 'Scrollbar';
