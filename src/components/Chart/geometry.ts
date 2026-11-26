import type React from 'react';
import type { ChartDataEvent, ChartProps, ChartCandle, ChartDatum } from './types';

/** 默认岛屿数据色，与 Card/Tag 的薄荷、蜜桃、草绿、紫、黄保持同色系。 */
export const CHART_COLORS = ['#19b7a7', '#e59266', '#8ac68a', '#b38ad3', '#e4b84f', '#7e9fc4', '#dc8c9e', '#9a835a'];
/** 边距设计的参考画布宽度；更窄时按比例收缩，避免绘图区宽度或雷达半径归零。 */
export const CHART_REFERENCE_WIDTH = 280;
/** K 线默认涨跌配色；调用方显式指定系列色或单点色时两者都被覆盖。 */
export const CANDLE_RISING = '#dc7367';
export const CANDLE_FALLING = '#3b9d85';
/** 以数据项为图例的类型，其余类型以系列为图例。 */
export const ITEM_TYPES = new Set(['pie', 'ring', 'rose', 'funnel', 'word', 'map']);
/** 采用笛卡尔坐标轴的类型。 */
export const AXIS_TYPES = new Set([
    'column',
    'bar',
    'line',
    'area',
    'mount',
    'mix',
    'scatter',
    'bubble',
    'candle',
    'time',
]);

/** 标准化后的数据点，保留原下标用于回调及分类轴缺测占位。 */
export interface DataPoint extends ChartDataEvent {
    /** 图形填充色 */
    color: string;
    /** 调用方显式指定的系列色或单点色；未指定时为空，由图形自行决定默认配色 */
    customColor?: string;
    /** 横坐标 */
    x: number;
    /** 气泡权重 */
    size: number;
    /** K 线完整数据 */
    candle?: ChartCandle;
}
/** 可聚焦的数据图形及对应提示位置（SVG 坐标）。 */
export interface ChartMark {
    /** 稳定标识 */
    key: string;
    /** 图形 */
    node: React.ReactNode;
    /** 原始数据 */
    point: DataPoint;
    /** 提示横坐标 */
    x: number;
    /** 提示纵坐标 */
    y: number;
    /** 分类中心或时间坐标，用于整列/整行命中，不受分组柱偏移影响 */
    axisPosition?: number;
}
/** 各图形渲染器共用的上下文。 */
export interface SceneContext {
    /** 公开配置 */
    props: ChartProps;
    /** 可见有效数据 */
    points: DataPoint[];
    /** 绘图区宽度 */
    width: number;
    /** 绘图区高度 */
    height: number;
    /** 数值文本格式化 */
    format: (value: number) => string;
}
/** 图形场景，辅助线与数据点分离以保持正确的交互语义。 */
export interface ChartScene {
    /** 网格、坐标、装饰线等不参与交互的内容 */
    background: React.ReactNode;
    /** 数据图形 */
    marks: ChartMark[];
    /** 同系列的折线、面积或雷达填充，用于图例联动 */
    layers?: { seriesIndex: number; node: React.ReactNode }[];
    /** 坐标绘图区；辅助线与指针命中共用同一边界 */
    plot?: { left: number; right: number; top: number; bottom: number; horizontal: boolean };
    /** 雷达圆形命中边界与维度数量；独立于笛卡尔辅助线区域 */
    polarPlot?: { cx: number; cy: number; radius: number; count: number };
}

/** 只接受真正的有限数，避免把空字符串和 null 当作零。 */
export function finite(value: unknown): value is number {
    // 所有几何计算在入口过滤 NaN/Infinity。
    return typeof value === 'number' && Number.isFinite(value);
}

/** 将输入标准化；无效点保留原下标，但不参与绘制和数值范围计算。 */
export function normalize(props: ChartProps): DataPoint[] {
    const { type = 'column', series, categories = [], colors = CHART_COLORS } = props;
    const palette = colors.length ? colors : CHART_COLORS;
    const points: DataPoint[] = [];
    series.forEach((entry, seriesIndex) =>
        entry.data.forEach((datum: ChartDatum, dataIndex) => {
            if (datum === null) return;
            const object = typeof datum === 'object' ? datum : undefined;
            const candle = object && 'open' in object ? object : undefined;
            const point = object && !('open' in object) ? object : undefined;
            const value = typeof datum === 'number' ? datum : (candle?.close ?? point?.value ?? point?.y);
            const x = point?.x ?? dataIndex;
            // OHLC 的范围必须自洽；坐标型图表不把缺失 x/y 静默补成序号或零。
            if (!finite(value) || !finite(x)) return;
            if (['scatter', 'bubble', 'time'].includes(type) && (!finite(point?.x) || !finite(point?.y))) return;
            if (type === 'bubble' && point?.size !== undefined && (!finite(point.size) || point.size <= 0)) return;
            if (
                type === 'candle' &&
                (!candle ||
                    ![candle.open, candle.close, candle.low, candle.high].every(finite) ||
                    candle.low > Math.min(candle.open, candle.close) ||
                    candle.high < Math.max(candle.open, candle.close))
            )
                return;
            if (((ITEM_TYPES.has(type) && type !== 'map') || type === 'radar') && value < 0) return;
            const customColor = point?.color ?? entry.color;
            points.push({
                type,
                seriesIndex,
                dataIndex,
                seriesName: entry.name,
                name: object?.name ?? categories[dataIndex] ?? String(dataIndex + 1),
                value: ['scatter', 'bubble', 'time'].includes(type) ? point!.y! : value,
                datum,
                color:
                    customColor ??
                    // K 线图例与高亮圆环只有一个颜色位，默认取上涨色，与默认涨跌配色同系。
                    (type === 'candle'
                        ? CANDLE_RISING
                        : palette[(ITEM_TYPES.has(type) ? dataIndex : seriesIndex) % palette.length]),
                customColor,
                x,
                size: finite(point?.size) && point.size > 0 ? point.size : 1,
                candle,
            });
        })
    );
    return ITEM_TYPES.has(type) ? points.filter((point) => point.seriesIndex === 0) : points;
}

/** 可读数值范围；负数保留，常量或全零数据扩展为非零跨度。 */
export function extent(values: number[], min?: number, max?: number, zero = true): [number, number] {
    let low = zero || !values.length ? 0 : values[0];
    let high = low;
    values.forEach((value) => {
        low = Math.min(low, value);
        high = Math.max(high, value);
    });
    // 指定边界只有顺序有效时才采纳，避免坐标轴反转或除零。
    if (finite(min)) low = min;
    if (finite(max)) high = max;
    if (high <= low) {
        high = low + Math.max(1, Math.abs(low) * 0.1);
    }
    return [low, high];
}

/** 自动数值轴采用易读刻度；两端都显式时等分，只给一边时另一边仍取易读步长。 */
export function axisTicks(values: number[], min?: number, max?: number): number[] {
    if (finite(min) && finite(max)) {
        const [low, high] = extent(values, min, max);
        return Array.from({ length: 5 }, (_, i) => low + ((high - low) * i) / 4);
    }
    // 显式的边界并入自动范围，刻度不会落到调用方指定的范围之外。
    const [low, high] = extent(values, min, max);
    // 采用 1/2/2.5/5 的十进制步长，避免自动轴出现 19.75 一类无意义刻度。
    const target = (high - low) / 4;
    const magnitude = 10 ** Math.floor(Math.log10(target));
    const step = ([1, 2, 2.5, 5, 10].find((value) => value * magnitude >= target) ?? 10) * magnitude;
    // 自动的一端向外取整到步长；显式的一端不能被向外扩展，只能向内收。
    const start = finite(min) ? Math.ceil(low / step - 1e-9) : Math.floor(low / step);
    const end = finite(max) ? Math.floor(high / step + 1e-9) : Math.ceil(high / step);
    const ticks = Array.from({ length: Math.max(0, end - start + 1) }, (_, i) =>
        Number(((start + i) * step).toPrecision(12))
    );
    // 显式边界不在步长网格上时（如 min=5、步长 10）保留为首个/末个刻度，范围与调用方指定的一致。
    if (finite(min) && (ticks[0] ?? low) > low + 1e-9) ticks.unshift(low);
    if (finite(max) && (ticks[ticks.length - 1] ?? high) < high - 1e-9) ticks.push(high);
    return ticks;
}

/** 截断长标签；完整名称仍保留在数据提示与无障碍名称内。 */
export function shortLabel(text: string, max = 9): string {
    // 按 Unicode 字符截断，避免拆开代理对。
    const letters = Array.from(text);
    return letters.length > max ? letters.slice(0, max).join('') + '…' : text;
}

/** 把角度投影为以十二点方向为起点的坐标。 */
export function polar(cx: number, cy: number, radius: number, angle: number): [number, number] {
    // angle 使用弧度，顺时针为正。
    return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)];
}

/** 圆弧路径；完整圆拆为两段，避免 SVG 首尾相同导致整圆消失。 */
export function arc(cx: number, cy: number, radius: number, start: number, end: number): string {
    const a = polar(cx, cy, radius, start);
    const mid = polar(cx, cy, radius, (start + end) / 2);
    const b = polar(cx, cy, radius, end);
    // 每段不超过半圈，仪表盘及满进度圆环都可复用。
    return `M${a.join(',')} A${radius},${radius} 0 0 1 ${mid.join(',')} A${radius},${radius} 0 0 1 ${b.join(',')}`;
}

/** 闭合扇区/环形扇区，支持单项占满整个圆。 */
export function sector(cx: number, cy: number, outer: number, inner: number, start: number, end: number): string {
    const a = polar(cx, cy, inner, end);
    const b = polar(cx, cy, inner, (start + end) / 2);
    const c = polar(cx, cy, inner, start);
    // 内环反向绕行，与外环组成可正确填充的轮廓。
    return (
        arc(cx, cy, outer, start, end) +
        (inner > 0
            ? ` L${a.join(',')} A${inner},${inner} 0 0 0 ${b.join(',')} A${inner},${inner} 0 0 0 ${c.join(',')} Z`
            : ` L${cx},${cy} Z`)
    );
}

/** 生成直线或横向控制点曲线；控制点的 y 不越过相邻端点。 */
export function linePath(points: [number, number][], smooth = false): string {
    // 每一段缺测在调用处拆开，不能跨缺测自动连线。
    return points
        .map(([x, y], i) =>
            i === 0
                ? `M${x},${y}`
                : smooth
                  ? `C${(points[i - 1][0] + x) / 2},${points[i - 1][1]} ${(points[i - 1][0] + x) / 2},${y} ${x},${y}`
                  : `L${x},${y}`
        )
        .join(' ');
}
