/** 抖动提醒的阈值、节奏和幅度，时间单位为毫秒，距离单位为 px，角度单位为度。 */
export interface CountdownShakeOptions {
    /** 开始抖动的剩余秒数，默认 5；非正数关闭 */
    seconds?: number;
    /** 加强阶段的剩余秒数，默认 3；0 关闭加强 */
    urgentSeconds?: number;
    /** 普通阶段周期，默认 1000ms，最小 16ms */
    duration?: number;
    /** 加强阶段周期，默认 650ms，最小 16ms */
    urgentDuration?: number;
    /** 普通阶段水平位移，默认 1.5px */
    distance?: number;
    /** 加强阶段水平位移，默认 2.5px */
    urgentDistance?: number;
    /** 普通阶段旋转角度，默认 0.6 度 */
    rotation?: number;
    /** 加强阶段旋转角度，默认 0.9 度 */
    urgentRotation?: number;
    /** CSS 缓动函数，默认沿用组件库令牌 */
    easing?: string;
}

/** 缺省使用组件库缓动，调用方可以按场景覆盖。 */
const DEFAULT_EASING = 'var(--animal-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))';

/** 归一化数值配置，忽略非有限数，越界值钳制到可绘制范围。 */
function numberOption(value: number | undefined, fallback: number, min = 0, max = 60_000): number {
    // 对外配置进入 CSS 或定时器前先处理 NaN/Infinity，防止生成无效动效。
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
}

/** 合并抖动配置，兼容原来的布尔值与秒数简写。 */
export function resolveShake(value: boolean | number | CountdownShakeOptions) {
    const options: CountdownShakeOptions = value && typeof value === 'object' ? value : {};
    // 非有限的秒数简写沿用旧行为：关闭提醒，不回退到默认阈值。
    const seconds =
        typeof value === 'number'
            ? Number.isFinite(value)
                ? Math.max(0, value)
                : 0
            : value
              ? numberOption(options.seconds, 5)
              : 0;
    return {
        seconds,
        urgentSeconds: numberOption(options.urgentSeconds, 3),
        duration: numberOption(options.duration, 1000, 16),
        urgentDuration: numberOption(options.urgentDuration, 650, 16),
        distance: numberOption(options.distance, 1.5),
        urgentDistance: numberOption(options.urgentDistance, 2.5),
        rotation: numberOption(options.rotation, 0.6, 0, 360),
        urgentRotation: numberOption(options.urgentRotation, 0.9, 0, 360),
        easing: options.easing?.trim() || DEFAULT_EASING,
    };
}
