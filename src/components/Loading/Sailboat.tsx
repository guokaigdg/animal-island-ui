import React, { useId } from 'react';
import styles from './sailboat.module.less';

/**
 * naive-icons 的 sailboat 图标（MIT），逐路径复制到这里而不是直接用 `SailboatIcon`：
 * 底部那条波浪线需要单独成层做横向滚动，图标组件不暴露内部路径。
 */
const WAVE_PATH =
    'M4.85 43.15 C 8.68 41.24 10.59 45.07 14.42 43.15 C 18.25 41.24 20.17 45.07 24 43.15 C 27.83 41.24 29.75 45.07 33.58 43.15 C 37.41 41.24 39.32 45.07 43.15 43.15';

/**
 * 波浪路径横跨 4.85 → 43.15，且 4 段完全等长（每段 9.575），因此整条路径的波形
 * 以 9.575 为周期、38.3 为整周期。路径本身从 x=4.85 起画，把整条平移 -4.85 让
 * 第 0 份正好从画布原点开始，再按 38.3 铺开。
 */
const WAVE_TILE = 38.3;
const WAVE_ORIGIN = -4.85;
const WAVE_OFFSETS = [-2, -1, 0, 1].map((k) => WAVE_ORIGIN + k * WAVE_TILE);

/**
 * 露出的波浪只取中间 3 个波形周期（28.74 单位），比船身窄一截。
 * 窗口用 clipPath 硬切，不做渐变淡出。
 *
 * 线宽同步收细到 1.9 —— 波浪变短后若沿用原来的 2.5，会从一道水纹变成一条粗带子。
 */
const WAVE_WIN_X = 9.63;
const WAVE_WIN_W = 28.74;
const WAVE_STROKE = 1.9;
/** 每个窗口宽度滚一次，2s 走完 */
const WAVE_SCROLL = WAVE_WIN_W;
/** 波浪整体下沉一点，让船身与水面之间留出一道空隙（船底在 y=39.32，波峰在 41.24） */
const WAVE_DROP = 1.2;
/**
 * 船身单独缩小，缩放支点取船底中心 (24, 39.32) —— 船底留在原处、水面不动，
 * 只是船变小了；波浪完全不受影响。
 */
const BOAT_SCALE = 0.8;
const BOAT_PIVOT_X = 24;
const BOAT_PIVOT_Y = 39.32;

export const Sailboat: React.FC = () => {
    // 同一页面可能渲染多个帆船，<use> 与裁剪区的引用目标必须逐实例唯一
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const waveId = `animal-loading-wave-${uid}`;
    const clipId = `animal-loading-wave-clip-${uid}`;

    return (
        <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.svg}
            role="presentation"
        >
            <defs>
                <path id={waveId} d={WAVE_PATH} stroke="#2A9D8F" strokeWidth={WAVE_STROKE} fill="none" />
                <clipPath id={clipId}>
                    <rect x={WAVE_WIN_X} y="0" width={WAVE_WIN_W} height="48" />
                </clipPath>
            </defs>

            <g
                transform={`translate(${BOAT_PIVOT_X} ${BOAT_PIVOT_Y}) scale(${BOAT_SCALE}) translate(${-BOAT_PIVOT_X} ${-BOAT_PIVOT_Y})`}
            >
                <g className={styles.boat}>
                    <path d="M22.08 9.64 L 22.08 27.83 L 9.64 27.83 Z" fill="#E76F51" />
                    <path d="M25.92 6.76 L 25.92 27.83 L 39.32 27.83 Z" fill="#FAEDCD" />
                    <path d="M24 4.85 L 24 29.75" stroke="#2A2A2A" strokeWidth="3" />
                    <path d="M7.72 31.66 L 40.28 31.66 L 35.49 39.32 L 12.51 39.32 Z" fill="#8B5E3C" />
                    <circle cx="29.75" cy="17.3" r="1.53" fill="#E76F51" stroke="none" />
                </g>
            </g>

            <g clipPath={`url(#${clipId})`}>
                <g transform={`translate(0 ${WAVE_DROP})`}>
                    <g
                        className={styles.waveTrack}
                        // 滚动距离由 TS 常量下发，LESS 侧只读不写，避免两处数字对不上
                        style={{ '--animal-sailboat-wave-scroll': `${WAVE_SCROLL}px` } as React.CSSProperties}
                    >
                        {WAVE_OFFSETS.map((offset) => (
                            <use key={offset} href={`#${waveId}`} transform={`translate(${offset} 0)`} />
                        ))}
                    </g>
                </g>
            </g>
        </svg>
    );
};

Sailboat.displayName = 'Sailboat';
