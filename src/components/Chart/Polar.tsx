import React from 'react';
import {
    arc,
    CHART_REFERENCE_WIDTH,
    extent,
    polar,
    sector,
    shortLabel,
    type ChartScene,
    type SceneContext,
} from './geometry';

/** 饼、环形、玫瑰图采用同一扇区模型，零值不生成虚假的面积。 */
export function pieScene({ props, points, width, height, format }: SceneContext): ChartScene {
    const { type = 'pie', showLabels = false } = props;
    const data = points.filter((p) => p.value > 0);
    const total = data.reduce((sum, p) => sum + p.value, 0);
    const radius = Math.max(20, Math.min(width / 2 - 70, height / 2 - 26));
    // 标签画在外圈之外 15px，半径公式已为左右各留 (width/2 - radius) 的空间；
    // 按最坏角度估算画布余量，装不下就截断或整条隐藏，避免文字被 viewBox 裁掉。
    const LABEL_FONT_SIZE = 12;
    const labelRoom = Math.max(0, width / 2 - radius - 15),
        labelMaxChars = Math.min(7, Math.floor(labelRoom / LABEL_FONT_SIZE) - 1);
    const cx = width / 2,
        cy = height / 2;
    let angle = 0;
    const max = data.reduce((largest, point) => Math.max(largest, point.value), 0) || 1;
    const marks = data.map((p) => {
        // 玫瑰图等角分区，半径按平方根缩放，使面积表达数值。
        const end = angle + Math.PI * 2 * (type === 'rose' ? 1 / data.length : p.value / total);
        const outer = type === 'rose' ? radius * Math.sqrt(p.value / max) : radius;
        const inner = type === 'ring' ? radius * 0.66 : 0;
        const center = (angle + end) / 2;
        const [x, y] = polar(cx, cy, (inner + outer) / 2, center);
        const label = polar(cx, cy, outer + 15, center);
        const node = (
            <>
                <path
                    d={sector(cx, cy, outer, Math.min(inner, outer * 0.9), angle, end)}
                    fill={p.color}
                    stroke="#fffdf7"
                    strokeWidth={3}
                    strokeLinejoin="round"
                />
                {showLabels && labelMaxChars > 0 && (
                    <text
                        className="chart-value-label"
                        x={label[0]}
                        y={label[1]}
                        textAnchor={label[0] < cx ? 'end' : 'start'}
                    >
                        {shortLabel(p.name, labelMaxChars)}
                    </text>
                )}
            </>
        );
        angle = end;
        return { key: `slice-${p.dataIndex}`, point: p, x, y, node };
    });
    return {
        marks,
        background:
            type === 'ring' && total > 0 ? (
                <g className="chart-center">
                    <text
                        x={cx}
                        y={cy - 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="chart-center-value"
                    >
                        {shortLabel(format(total), 12)}
                    </text>
                    <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="central">
                        合计
                    </text>
                </g>
            ) : null,
    };
}

/** 雷达图按全系列共同范围绘制，不把不同指标分别归一化而扭曲比较。 */
export function radarScene({ props, points, width, height }: SceneContext): ChartScene {
    const count = Math.max(props.categories?.length ?? 0, ...props.series.map((s) => s.data.length));
    if (count < 3) return { background: null, marks: [] };
    // 维度名居中于半径外 20px；按 11px 字号和省略号估算可用字符数，避免窄画布裁切。
    const LABEL_GAP = 20;
    const FONT_SIZE = 11;
    const cx = width / 2,
        cy = height / 2,
        // 半径随窄画布收缩，但至少为维度名预留 64px（间距、半宽与内边距）。
        horizontalInset = Math.max(64, 72 * Math.min(1, width / CHART_REFERENCE_WIDTH)),
        radius = Math.max(1, Math.min(width / 2 - horizontalInset, height / 2 - 40)),
        // 连一个字符加省略号都放不下时不画标签，避免文字被 SVG 裁切。
        labelMaxChars = Math.min(7, Math.floor((width / 2 - radius - LABEL_GAP) / (FONT_SIZE / 2)) - 1);
    const [low, high] = extent(
        points.map((p) => p.value),
        props.min ?? 0,
        props.max
    );
    /** 在共同雷达值域上定位每个指标。 */
    const at = (index: number, value: number) =>
        polar(cx, cy, radius * Math.max(0, Math.min(1, (value - low) / (high - low))), (Math.PI * 2 * index) / count);
    const background: React.ReactNode[] = [];
    const layers: NonNullable<ChartScene['layers']> = [];
    for (let level = 1; level <= 4; level++)
        background.push(
            <polygon
                key={`ring-${level}`}
                points={Array.from({ length: count }, (_, i) =>
                    polar(cx, cy, (radius * level) / 4, (Math.PI * 2 * i) / count).join(',')
                ).join(' ')}
                className="chart-radar-grid"
            />
        );
    for (let i = 0; i < count; i++) {
        const [x, y] = polar(cx, cy, radius, (Math.PI * 2 * i) / count);
        const [lx, ly] = polar(cx, cy, radius + LABEL_GAP, (Math.PI * 2 * i) / count);
        background.push(
            <g key={`axis-${i}`}>
                <line x1={cx} y1={cy} x2={x} y2={y} className="chart-grid-line" />
                {labelMaxChars > 0 && (
                    <text x={lx} y={ly + 4} textAnchor="middle" className="chart-axis-label">
                        {shortLabel(
                            props.categories?.[i] ?? points.find((p) => p.dataIndex === i)?.name ?? String(i + 1),
                            labelMaxChars
                        )}
                    </text>
                )}
            </g>
        );
    }
    [...new Set(points.map((p) => p.seriesIndex))].forEach((seriesIndex) => {
        const data = points.filter((p) => p.seriesIndex === seriesIndex);
        // 不完整雷达系列只显示已有点，避免把缺测误画为零值面积。
        if (data.length === count)
            layers.push({
                seriesIndex,
                node: (
                    <polygon
                        points={data.map((p) => at(p.dataIndex, p.value).join(',')).join(' ')}
                        fill={data[0].color}
                        fillOpacity={0.16}
                        stroke={data[0].color}
                        strokeWidth={2.5}
                    />
                ),
            });
    });
    return {
        background: <>{background}</>,
        layers,
        polarPlot: { cx, cy, radius, count },
        marks: points.map((p) => {
            const [x, y] = at(p.dataIndex, p.value);
            return {
                key: `${p.seriesIndex}-${p.dataIndex}`,
                point: p,
                x,
                y,
                node: <circle cx={x} cy={y} r={5} fill={p.color} stroke="#fffdf7" strokeWidth={2} />,
            };
        }),
    };
}

/** 圆弧进度与仪表盘共享范围钳制，显示原始数值但指示器不越界。 */
export function gaugeScene({ props, points, width, height, format }: SceneContext): ChartScene {
    const gauge = props.type === 'gauge';
    // 每系列第一项代表当前读数；圆弧可并排多系列，仪表盘只使用首个可见系列。
    const data = points
        .filter((p, i) => points.findIndex((item) => item.seriesIndex === p.seriesIndex) === i)
        .slice(0, gauge ? 1 : undefined);
    const [low, high] = extent([], props.min ?? 0, props.max ?? 100);
    const background: React.ReactNode[] = [];
    const marks = data.map((p, i) => {
        const space = width / Math.max(1, data.length);
        const cx = space * (i + 0.5),
            cy = height / 2 + 20;
        const radius = Math.max(20, Math.min(space / 2 - 22, height / 2 - 38));
        const start = -Math.PI * 0.75,
            end = Math.PI * 0.75;
        const fraction = Math.max(0, Math.min(1, (p.value - low) / (high - low)));
        background.push(
            <path
                key={`track-${i}`}
                d={arc(cx, cy, radius, start, end)}
                fill="none"
                stroke="#eae2ce"
                strokeWidth={gauge ? 18 : 14}
                strokeLinecap="round"
            />
        );
        if (gauge) {
            // 极窄容器下半径会被压到下限 20px，内侧刻度线与指针长度会变成负数而画到对面；空间不够时省略刻度线，指针保底 6px。
            const hasTickRoom = radius >= 34;
            if (hasTickRoom) {
                for (let tick = 0; tick <= 8; tick++) {
                    const angle = start + ((end - start) * tick) / 8;
                    const a = polar(cx, cy, radius - 20, angle),
                        b = polar(cx, cy, radius - 27, angle);
                    background.push(
                        <line
                            key={`tick-${tick}`}
                            x1={a[0]}
                            y1={a[1]}
                            x2={b[0]}
                            y2={b[1]}
                            stroke="#b6a184"
                            strokeWidth={2}
                        />
                    );
                }
            }
            [low, (low + high) / 2, high].forEach((value, index) => {
                const [x, y] = polar(cx, cy, radius + 16, start + ((end - start) * index) / 2);
                background.push(
                    <text key={`scale-${index}`} x={x} y={y + 4} textAnchor="middle" className="chart-axis-label">
                        {shortLabel(format(value), 8)}
                    </text>
                );
            });
        }
        const needle = polar(cx, cy, Math.max(6, radius - 34), start + fraction * (end - start));
        return {
            key: `gauge-${p.seriesIndex}`,
            point: p,
            x: cx,
            y: cy,
            node: (
                <g>
                    {fraction > 0 && (
                        <path
                            d={arc(cx, cy, radius, start, start + fraction * (end - start))}
                            fill="none"
                            stroke={p.color}
                            strokeWidth={gauge ? 18 : 14}
                            strokeLinecap="round"
                        />
                    )}
                    {gauge && (
                        <>
                            <line
                                x1={cx}
                                y1={cy}
                                x2={needle[0]}
                                y2={needle[1]}
                                stroke="#725d42"
                                strokeWidth={4}
                                strokeLinecap="round"
                            />
                            <circle cx={cx} cy={cy} r={7} fill="#725d42" />
                        </>
                    )}
                    <text x={cx} y={cy + (gauge ? 38 : 0)} textAnchor="middle" className="chart-center-value">
                        {shortLabel(format(p.value), 10)}
                    </text>
                    <text x={cx} y={cy + (gauge ? 59 : 26)} textAnchor="middle" className="chart-axis-label">
                        {shortLabel(p.seriesName, 12)}
                    </text>
                </g>
            ),
        };
    });
    return { background: <>{background}</>, marks };
}
