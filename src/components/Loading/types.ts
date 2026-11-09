import React from 'react';

/** 加载屏形态：'snow' 全屏落雪，'circle' 圆形扩散展开 */
export type LoadingType = 'snow' | 'circle';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 加载屏形态，默认 'snow'（全屏落雪）；'circle' 为圆形扩散展开的浮层 */
    type?: LoadingType;
    /** 'circle' 形态下是否显示帆船，默认 true；false 时只留遮罩背景 */
    showBoat?: boolean;
    /** 是否开启加载屏（true / false 控制开启关闭）；false 时渐变消失 */
    active?: boolean;
    /** 加载屏中央提示文字 */
    tip?: React.ReactNode;
    /** 延迟显示时间（毫秒），避免加载快速结束时闪烁；0 = 立即显示 */
    delay?: number;
    /** 渐变消失时长（秒）；'circle' 下用作圆形扩散展开的时长 */
    fadeDuration?: number;
    /** 全屏层级，默认 3000（高于 Notification 的 2000） */
    zIndex?: number;
}
