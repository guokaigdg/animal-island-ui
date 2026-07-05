import React from 'react';

/**
 * 进度条组件支持的尺寸
 *  - small:  12px 高度
 *  - middle: 20px 高度（默认）
 *  - large:  28px 高度
 */
export type ProgressSize = 'small' | 'middle' | 'large';

/**
 * 百分比文字位置
 *  - inside: 在 bar 内部（fill 段内右对齐，跟随 fill 移动；fill 过窄时退化为紧贴 track 末端）
 *  - right:  在 bar 右侧
 *  - top:    在 bar 上方
 */
export type ProgressInfoPosition = 'inside' | 'right' | 'top';

export interface ProgressProps {
    /** 当前百分比，0–100 */
    percent: number;
    /** 尺寸 */
    size?: ProgressSize;
    /** 是否显示百分比文字 */
    showInfo?: boolean;
    /** 百分比文字位置 */
    infoPosition?: ProgressInfoPosition;
    /** 自定义文字格式化（默认 `${percent}%`） */
    infoFormat?: (percent: number) => React.ReactNode;
    /** 进度条 fill 宽度动画时长（秒），0 = 不动画；不影响斜纹滚动 */
    duration?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}
