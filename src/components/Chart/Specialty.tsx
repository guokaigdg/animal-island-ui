import React from 'react';
import { CHART_REFERENCE_WIDTH, extent, finite, shortLabel, type ChartScene, type SceneContext } from './geometry';

/** 漏斗保留输入阶段顺序，宽度按数值比例计算，不强制重排成递减序列。 */
export function funnelScene({ props, points, width, height, format }: SceneContext): ChartScene {
    const max = Math.max(0, ...points.map((p) => p.value));
    if (!max) return { background: null, marks: [] };
    const step = (height - 40) / Math.max(1, points.length);
    const span = width * 0.7;
    return {
        background: null,
        marks: points.map((p, i) => {
            const upper = (p.value / max) * span;
            const lower = p.value === 0 ? 0 : ((points[i + 1]?.value ?? p.value * 0.75) / max) * span;
            const y = 20 + i * step,
                cx = width / 2;
            // 阶段之间留出奶油色间隔，数值标签使用独立文字而不依赖面积猜测。
            return {
                key: `funnel-${p.dataIndex}`,
                point: p,
                x: cx,
                y: y + step / 2,
                node: (
                    <g>
                        <path
                            d={`M${cx - upper / 2},${y} H${cx + upper / 2} L${cx + lower / 2},${y + step - 5} H${cx - lower / 2} Z`}
                            fill={p.color}
                            fillOpacity={0.55}
                            stroke={p.color}
                            strokeWidth={1.5}
                            strokeLinejoin="round"
                        />
                        <text x={cx} y={y + step / 2 + 4} textAnchor="middle" className="chart-value-label">
                            {shortLabel(p.name, 12)}
                            {props.showLabels !== false ? ` · ${format(p.value)}` : ''}
                        </text>
                    </g>
                ),
            };
        }),
    };
}

/** 词云采用确定性的矩形避碰布局，SSR 与客户端不会因随机数出现不同图形。 */
export function wordScene({ points, width, height }: SceneContext): ChartScene {
    const boxes: { x: number; y: number; w: number; h: number }[] = [];
    const max = Math.max(1, ...points.map((p) => p.value));
    const marks: ChartScene['marks'] = [];
    [...points]
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value)
        .forEach((p) => {
            const text = shortLabel(p.name, 16);
            const units = Array.from(text).reduce((sum, char) => sum + (char.codePointAt(0)! > 127 ? 1 : 0.7), 0);
            let fontSize = Math.min(44, 14 + Math.sqrt(p.value / max) * 30, (width - 30) / Math.max(1, units));
            let box: { x: number; y: number; w: number; h: number } | undefined;
            // 逐级缩小以适配窄屏；无法容纳的词仍保留在“查看数据”内。
            while (fontSize >= 12 && !box) {
                const w = units * fontSize + 12,
                    h = fontSize * 1.5;
                for (let i = 0; i < 1200; i++) {
                    const angle = i * 0.55,
                        radius = 4.2 * Math.sqrt(i);
                    const x = width / 2 + Math.cos(angle) * radius * 2 - w / 2;
                    const y = height / 2 + Math.sin(angle) * radius - h / 2;
                    if (x < 10 || x + w > width - 10 || y < 10 || y + h > height - 10) continue;
                    if (boxes.some((b) => x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y)) continue;
                    box = { x, y, w, h };
                    break;
                }
                if (!box) fontSize -= 3;
            }
            if (!box) return;
            boxes.push(box);
            const x = box.x + box.w / 2,
                y = box.y + box.h / 2;
            marks.push({
                key: `word-${p.dataIndex}`,
                point: p,
                x,
                y,
                node: (
                    <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={p.color}
                        fontSize={fontSize}
                        fontWeight={800}
                    >
                        {text}
                    </text>
                ),
            });
        });
    return { background: null, marks };
}

/** 将调用方提供的平面地图轮廓等比例适配；不请求或附带任何行政区边界。 */
export function mapScene({ props, points, width, height }: SceneContext): ChartScene {
    const regions = (props.regions ?? [])
        .map((region) => ({
            ...region,
            polygons: region.polygons.filter(
                (ring) => ring.length >= 3 && ring.every(([x, y]) => finite(x) && finite(y))
            ),
        }))
        .filter((region) => region.polygons.length);
    const coordinates = regions.flatMap((region) => region.polygons.flat());
    if (!coordinates.length) return { background: null, marks: [] };
    const [xMin, xMax] = extent(
        coordinates.map((p) => p[0]),
        undefined,
        undefined,
        false
    );
    const [yMin, yMax] = extent(
        coordinates.map((p) => p[1]),
        undefined,
        undefined,
        false
    );
    // 四周留白随容器收缩；固定 48px 留白在容器窄于 48px 时会让缩放系数变负，地区左右镜像。
    const marginScale = Math.min(1, width / CHART_REFERENCE_WIDTH);
    const scale = Math.max(
        0,
        Math.min((width - 48 * marginScale) / (xMax - xMin || 1), (height - 40) / (yMax - yMin || 1))
    );
    /** 平面坐标纵轴朝上，与 SVG 的纵轴方向相反。 */
    const project = ([x, y]: readonly [number, number]) => [
        width / 2 + (x - (xMin + xMax) / 2) * scale,
        height / 2 - (y - (yMin + yMax) / 2) * scale,
    ];
    const [low, high] = extent(points.map((p) => p.value));
    const background: React.ReactNode[] = [];
    const marks: ChartScene['marks'] = [];
    regions.forEach((region, i) => {
        const polygons = region.polygons.map((ring) => ring.map(project));
        const path = polygons
            .map((ring) => ring.map((p, index) => `${index ? 'L' : 'M'}${p.join(',')}`).join(' ') + ' Z')
            .join(' ');
        const vertices = polygons.flat();
        const x = vertices.reduce((sum, p) => sum + p[0], 0) / vertices.length;
        const y = vertices.reduce((sum, p) => sum + p[1], 0) / vertices.length;
        const point = points.find((p) => p.name === region.name);
        const node = (
            <g>
                <path
                    d={path}
                    fill={point?.color ?? '#eae2ce'}
                    fillOpacity={point ? 0.3 + Math.max(0, Math.min(1, (point.value - low) / (high - low))) * 0.65 : 1}
                    fillRule="evenodd"
                    stroke="#fffdf7"
                    strokeWidth={3}
                    strokeLinejoin="round"
                />
                {props.showLabels && (
                    <text x={x} y={y} textAnchor="middle" className="chart-value-label">
                        {shortLabel(region.name, 8)}
                    </text>
                )}
            </g>
        );
        if (point) marks.push({ key: `region-${i}`, point, x, y, node });
        else
            background.push(
                <g key={`empty-region-${i}`}>
                    {node}
                    <title>{region.name}：暂无数据</title>
                </g>
            );
    });
    return { background: <>{background}</>, marks };
}
