import React from 'react';
import dayjs from 'dayjs';
import {
    axisTicks,
    CANDLE_FALLING,
    CANDLE_RISING,
    CHART_REFERENCE_WIDTH,
    extent,
    linePath,
    shortLabel,
    type ChartScene,
    type SceneContext,
    type DataPoint,
} from './geometry';

/** 绘制共用分类轴/数值轴的图表，保留零基线、缺测断点和正负堆叠。 */
export function cartesianScene({ props, points, width, height, format }: SceneContext): ChartScene {
    const {
        type = 'column',
        categories = [],
        series,
        showAxes = true,
        stacked = false,
        smooth = false,
        showLabels = false,
    } = props;
    const horizontal = type === 'bar';
    const numericX = ['scatter', 'bubble', 'time'].includes(type);
    // 窄画布按比例收缩边距；固定边距会在容器宽度接近 86px 时把绘图区压到零并反转分类顺序。
    const marginScale = Math.min(1, width / CHART_REFERENCE_WIDTH);
    const left = (horizontal ? 90 : 62) * marginScale,
        right = width - 24 * marginScale,
        top = 28,
        bottom = height - 44;
    const plotWidth = right - left,
        plotHeight = bottom - top;
    const groups = [...new Set(points.map((p) => p.seriesIndex))];
    const count = Math.max(categories.length, ...series.map((s) => s.data.length), 1);
    const sums = new Map<number, [number, number]>();
    const stackedBars = stacked && ['column', 'bar'].includes(type);
    points.forEach((p) => {
        const sum = sums.get(p.dataIndex) ?? [0, 0];
        sum[p.value < 0 ? 0 : 1] += p.value;
        sums.set(p.dataIndex, sum);
    });
    const values = stackedBars
        ? [...sums.values()].flat()
        : points.flatMap((p) => (p.candle ? [p.candle.low, p.candle.high] : [p.value]));
    const ticks = axisTicks(values, props.min, props.max);
    const low = ticks[0],
        high = ticks[ticks.length - 1];
    const maxBubbleSize = points.reduce((largest, point) => Math.max(largest, point.size), Number.MIN_VALUE);
    const [xLow, xHigh] = extent(
        points.map((p) => p.x),
        undefined,
        undefined,
        false
    );
    /** 将数值限制在用户指定轴范围内，防止越界图形盖住坐标文字。 */
    const ratio = (value: number) => Math.max(0, Math.min(1, (value - low) / (high - low)));
    /** 分类坐标保留缺测槽位；数值横轴严格按实际坐标间距排布。 */
    const xAt = (p: DataPoint) =>
        numericX
            ? left + ((p.x - xLow) / (xHigh - xLow)) * plotWidth
            : left + ((p.dataIndex + 0.5) / count) * plotWidth;
    /** 值域到纵坐标的映射。 */
    const yAt = (value: number) => bottom - ratio(value) * plotHeight;
    /** 横向条形图的数值映射。 */
    const barX = (value: number) => left + ratio(value) * plotWidth;
    const base = yAt(0);
    const scene: ChartScene = {
        background: [],
        marks: [],
        layers: [],
        plot: { left, right, top, bottom, horizontal },
    };
    const background: React.ReactNode[] = [];
    if (showAxes) {
        // 纵轴刻度右对齐画在 left-10，可用宽度就是 x 本身；按 11px 字号决定能放几个全角字符，
        // 放不下就截断并为省略号预留一个字符，连一个字符都放不下时不再画刻度文字。
        const tickMaxChars = horizontal ? 10 : Math.floor((left - 10) / 11);
        for (const [i, value] of ticks.entries()) {
            const x = left + ratio(value) * plotWidth,
                y = yAt(value);
            const raw = format(value),
                label = horizontal
                    ? shortLabel(raw, 10)
                    : Array.from(raw).length <= tickMaxChars
                      ? raw
                      : tickMaxChars > 1
                        ? shortLabel(raw, tickMaxChars - 1)
                        : '';
            background.push(
                <g key={`grid-${i}`} className="chart-grid">
                    <line
                        x1={horizontal ? x : left}
                        x2={horizontal ? x : right}
                        y1={horizontal ? top : y}
                        y2={horizontal ? bottom : y}
                    />
                    {label && (
                        <text
                            x={horizontal ? x : left - 10}
                            y={horizontal ? bottom + 23 : y + 4}
                            textAnchor={horizontal ? 'middle' : 'end'}
                        >
                            {label}
                        </text>
                    )}
                </g>
            );
        }
        if (low < 0 && high > 0)
            background.push(
                <line
                    key="zero"
                    className="chart-zero"
                    x1={horizontal ? barX(0) : left}
                    x2={horizontal ? barX(0) : right}
                    y1={horizontal ? top : base}
                    y2={horizontal ? bottom : base}
                />
            );
        if (numericX) {
            for (let i = 0; i <= 4; i++) {
                const value = xLow + ((xHigh - xLow) * i) / 4;
                const label =
                    props.xFormatter?.(value) ?? (type === 'time' ? dayjs(value).format('HH:mm') : format(value));
                background.push(
                    <text
                        key={`x-${i}`}
                        className="chart-axis-label"
                        x={left + (plotWidth * i) / 4}
                        y={bottom + 24}
                        textAnchor="middle"
                    >
                        {shortLabel(label, 10)}
                    </text>
                );
            }
        } else {
            const categoryMaxChars = horizontal ? Math.floor((left - 12) / 11) - 1 : 8;
            const step = Math.max(
                1,
                Math.ceil(
                    count / Math.max(2, Math.floor((horizontal ? plotHeight : plotWidth) / (horizontal ? 30 : 70)))
                )
            );
            for (let i = 0; i < count; i += step) {
                if (categoryMaxChars <= 0) continue;
                const label = categories[i] ?? points.find((p) => p.dataIndex === i)?.name ?? String(i + 1);
                background.push(
                    <text
                        key={`category-${i}`}
                        className="chart-axis-label"
                        x={horizontal ? left - 12 : left + ((i + 0.5) * plotWidth) / count}
                        y={horizontal ? top + ((i + 0.5) * plotHeight) / count + 4 : bottom + 24}
                        textAnchor={horizontal ? 'end' : 'middle'}
                    >
                        {shortLabel(label, categoryMaxChars)}
                    </text>
                );
            }
        }
    }
    const accumulated = new Map<number, [number, number]>();
    const columnGroups = groups.filter((i) => type !== 'mix' || (series[i].type ?? 'column') === 'column');
    groups.forEach((seriesIndex) => {
        const layer: React.ReactNode[] = [];
        const mode = type === 'mix' ? (series[seriesIndex].type ?? 'column') : type;
        const data = points
            .filter((p) => p.seriesIndex === seriesIndex)
            .sort((a, b) => (numericX ? a.x - b.x : a.dataIndex - b.dataIndex));
        if (['line', 'area', 'time'].includes(mode)) {
            const segments: DataPoint[][] = [];
            data.forEach((p) => {
                const segment = segments[segments.length - 1];
                // null/NaN 被过滤但原始下标仍在，因此分类折线在缺测处断开。
                if (!segment || (!numericX && p.dataIndex !== segment[segment.length - 1].dataIndex + 1))
                    segments.push([p]);
                else segment.push(p);
            });
            segments.forEach((segment, i) => {
                const coords = segment.map((p): [number, number] => [xAt(p), yAt(p.value)]);
                // 单个点连不成线段，路径只剩起点 M、不产生笔画；可见性由每个数据点自带的圆点保证。
                const path = linePath(coords, smooth);
                if (mode === 'area')
                    layer.push(
                        <path
                            key={`area-${seriesIndex}-${i}`}
                            d={`${path} L${coords[coords.length - 1][0]},${base} L${coords[0][0]},${base} Z`}
                            fill={data[0].color}
                            fillOpacity={0.18}
                        />
                    );
                layer.push(
                    <path
                        key={`line-${seriesIndex}-${i}`}
                        d={path}
                        fill="none"
                        stroke={data[0].color}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                );
            });
        }
        if (layer.length) scene.layers!.push({ seriesIndex, node: <>{layer}</> });
        data.forEach((p) => {
            const x = xAt(p),
                y = yAt(p.value);
            let node: React.ReactNode,
                anchorX = x,
                anchorY = y;
            if (['column', 'bar'].includes(mode)) {
                const slot = (horizontal ? plotHeight : plotWidth) / count;
                const groupCount = stackedBars ? 1 : Math.max(1, type === 'mix' ? columnGroups.length : groups.length);
                const groupIndex = stackedBars ? 0 : (type === 'mix' ? columnGroups : groups).indexOf(seriesIndex);
                const breadth = Math.max(1, Math.min(42, (slot * 0.7) / groupCount));
                const sumsBefore = accumulated.get(p.dataIndex) ?? [0, 0];
                const side = p.value < 0 ? 0 : 1;
                const start = stackedBars ? sumsBefore[side] : 0;
                const end = start + p.value;
                sumsBefore[side] = end;
                accumulated.set(p.dataIndex, sumsBefore);
                const offset = (groupIndex - (groupCount - 1) / 2) * breadth;
                if (horizontal) {
                    anchorX = barX(end);
                    anchorY = top + (p.dataIndex + 0.5) * slot + offset;
                    node = (
                        <rect
                            x={Math.min(barX(start), anchorX)}
                            y={anchorY - breadth * 0.43}
                            width={Math.abs(anchorX - barX(start))}
                            height={breadth * 0.86}
                            rx={stackedBars ? 2 : Math.min(9, breadth / 2)}
                            fill={p.color}
                        />
                    );
                } else {
                    anchorX = x + offset;
                    anchorY = yAt(end);
                    node = (
                        <rect
                            x={anchorX - breadth * 0.43}
                            y={Math.min(yAt(start), anchorY)}
                            width={breadth * 0.86}
                            height={Math.abs(yAt(start) - anchorY)}
                            rx={stackedBars ? 2 : Math.min(9, breadth / 2)}
                            fill={p.color}
                        />
                    );
                }
            } else if (mode === 'mount') {
                const half = (plotWidth / count) * 0.43;
                // 圆润模式在峰顶和山脚保持水平切线，峰顶仍精确落在原数值高度。
                const outline = smooth
                    ? `M${x - half},${base} C${x - half * 0.5},${base} ${x - half * 0.5},${y} ${x},${y} C${x + half * 0.5},${y} ${x + half * 0.5},${base} ${x + half},${base} Z`
                    : `M${x - half},${base} Q${x - half * 0.4},${base} ${x},${y} Q${x + half * 0.4},${base} ${x + half},${base} Z`;
                node = <path d={outline} fill={p.color} fillOpacity={0.75} stroke={p.color} strokeWidth={2} />;
            } else if (mode === 'candle' && p.candle) {
                const c = p.candle,
                    breadth = Math.max(2, Math.min(24, (plotWidth / count / groups.length) * 0.6));
                anchorX += (groups.indexOf(seriesIndex) - (groups.length - 1) / 2) * breadth;
                // 默认按涨跌配色；调用方显式指定系列色或单点色时覆盖，与图例色块保持一致。
                const color = p.customColor ?? (c.close >= c.open ? CANDLE_RISING : CANDLE_FALLING);
                node = (
                    <g>
                        <line
                            x1={anchorX}
                            x2={anchorX}
                            y1={yAt(c.high)}
                            y2={yAt(c.low)}
                            stroke={color}
                            strokeWidth={2}
                        />
                        <rect
                            x={anchorX - breadth / 2}
                            y={Math.min(yAt(c.open), yAt(c.close))}
                            width={breadth}
                            height={Math.max(2, Math.abs(yAt(c.open) - yAt(c.close)))}
                            rx={2}
                            fill={color}
                        />
                    </g>
                );
            } else {
                const radius = mode === 'bubble' ? Math.sqrt(p.size / maxBubbleSize) * 22 : mode === 'scatter' ? 6 : 4;
                node = (
                    <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={p.color}
                        fillOpacity={mode === 'bubble' ? 0.55 : 1}
                        stroke={mode === 'bubble' ? p.color : '#fffdf7'}
                        strokeWidth={2}
                    />
                );
            }
            scene.marks.push({
                key: `${seriesIndex}-${p.dataIndex}`,
                point: p,
                x: anchorX,
                y: anchorY,
                axisPosition: horizontal ? top + ((p.dataIndex + 0.5) * plotHeight) / count : x,
                node: (
                    <>
                        {node}
                        {showLabels && (
                            <text className="chart-value-label" x={anchorX} y={anchorY - 12} textAnchor="middle">
                                {shortLabel(format(p.value))}
                            </text>
                        )}
                    </>
                ),
            });
        });
    });
    scene.background = <>{background}</>;
    return scene;
}
