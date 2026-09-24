import React from 'react';

/**
 * 进度条组件支持的尺寸
 *  - small:  14px 高度
 *  - middle: 24px 高度（默认）
 *  - large:  32px 高度
 */
export type ProgressSize = 'small' | 'middle' | 'large';

/**
 * 进度条 fill 背景场景图
 *  - sweet-corner: 甜点店角（默认）
 *  - forest-grove: 森林树丛
 *  - starry-camp:  星空露营
 *  - coffee-break: 咖啡时光
 */
export type ProgressVariant = 'sweet-corner' | 'forest-grove' | 'starry-camp' | 'coffee-break';

export interface ProgressProps {
    /** 当前百分比，0–100 */
    percent: number;
    /** 尺寸 */
    size?: ProgressSize;
    /** 是否显示百分比文字（显示在进度条右侧） */
    showInfo?: boolean;
    /** fill 背景场景图；不传时为纯色 fill（`#19c8b9`） */
    variant?: ProgressVariant;
    /** 自定义文字格式化（默认 `${percent}%`） */
    infoFormat?: (percent: number) => React.ReactNode;
    /** 进度条 fill 宽度动画时长（秒），0 = 不动画；不影响斜纹滚动 */
    duration?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 无可见标题时给 progressbar 一个无障碍标签（WCAG aria-progressbar-name 必需） */
    'aria-label'?: string;
    /** 关联外部可见标题的 id */
    'aria-labelledby'?: string;
}
