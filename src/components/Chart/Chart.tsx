import React, { useEffect, useRef, useState, useMemo, useCallback, useId } from 'react';
import dayjs from 'dayjs';
import { NoData } from '../NoData';
import { Button } from '../Button';
import { ChartTooltip } from './ChartTooltip';
import { interactionKey, nearestMark, relatedMarks, SHARED_TYPES } from './interaction';
import { cartesianScene } from './Cartesian';
import { gaugeScene, pieScene, radarScene } from './Polar';
import { funnelScene, mapScene, wordScene } from './Specialty';
import { AXIS_TYPES, ITEM_TYPES, CHART_COLORS, finite, normalize, type ChartMark, type SceneContext } from './geometry';
import type { ChartProps, ChartTooltipContext, ChartTooltipOptions } from './types';
import styles from './chart.module.less';

/** 默认数值格式化，保留小数信息并压缩过长坐标刻度。 */
function defaultFormat(value: number): string {
    // Intl 避免浮点尾数直接污染轴标签。
    return new Intl.NumberFormat('zh-CN', {
        maximumFractionDigits: 2,
        notation: Math.abs(value) >= 10000 ? 'compact' : 'standard',
    }).format(value);
}

/** 统一图表外壳：尺寸测量、图例、可聚焦数据点、提示、数据明细与空态。 */
export const Chart: React.FC<ChartProps> = ({
    type = 'column',
    series,
    categories,
    title,
    description,
    height = 300,
    colors = CHART_COLORS,
    legend = true,
    tooltip = true,
    highlight = true,
    selectable = true,
    stacked = false,
    smooth = false,
    showAxes = true,
    showLabels = false,
    min,
    max,
    valueFormatter = defaultFormat,
    xFormatter,
    regions,
    loading = false,
    emptyText = '暂无数据',
    animated = true,
    onDataClick,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
}) => {
    const viewport = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(640);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hidden, setHidden] = useState<string[]>([]);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [focusedKey, setFocusedKey] = useState<string | null>(null);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [legendFocus, setLegendFocus] = useState<string | null>(null);
    const marksRef = useRef(new Map<string, SVGGElement>());
    const pointerFrame = useRef<number | null>(null);
    const pendingPointer = useRef<{
        node: SVGSVGElement;
        x: number;
        y: number;
        key: string | null;
    } | null>(null);
    /** 丢弃未提交的悬停，避免离开、锁定或切换数据后旧帧重新弹出提示。 */
    const cancelPointer = useCallback(() => {
        // 事件结束后不再保留 DOM 节点；帧编号使用 null，兼容编号为零的实现。
        if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
        pointerFrame.current = null;
        pendingPointer.current = null;
    }, []);
    const tooltipId = useId();
    const tooltipOptions: ChartTooltipOptions = tooltip && typeof tooltip === 'object' ? tooltip : {};
    const shared = tooltipOptions.trigger !== 'item' && SHARED_TYPES.has(type);
    const itemLegend = ITEM_TYPES.has(type);
    const chartHeight = finite(height) ? Math.max(180, height) : 300;
    useEffect(() => {
        const node = viewport.current;
        if (!node) return;
        /** ResizeObserver 只影响绘图尺寸，不修改父容器，避免测量循环。 */
        const measure = () => {
            // 绘图宽度就是可见宽度；保留最小画布宽度会让窄容器多出横向滚动条。
            if (node.clientWidth > 0) {
                setWidth(node.clientWidth);
            }
        };
        measure();
        const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
        observer?.observe(node);
        window.addEventListener('resize', measure);
        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);
    const options = useMemo(
        () => ({
            type,
            series,
            categories,
            colors,
            stacked,
            smooth,
            showAxes,
            showLabels,
            min,
            max,
            regions,
            xFormatter,
        }),
        [type, series, categories, colors, stacked, smooth, showAxes, showLabels, min, max, regions, xFormatter]
    );
    const allPoints = useMemo(() => normalize(options), [options]);
    /** 按系列名或数据项身份维护图例状态，更新数据后不会误隐藏不同名称的系列。 */
    const legendKey = useCallback(
        (seriesIndex: number, name: string, index?: number) => {
            // 加入类型，防止切换图表种类时继承另一种图表的隐藏状态。
            return `${type}:${series[seriesIndex]?.name}:${itemLegend ? `${index}:${name}` : 'series'}`;
        },
        [type, series, itemLegend]
    );
    const entries = itemLegend
        ? allPoints.map((p) => ({ key: legendKey(p.seriesIndex, p.name, p.dataIndex), name: p.name, color: p.color }))
        : series.map((s, i) => ({
              key: legendKey(i, s.name),
              name: s.name,
              color: s.color ?? (colors.length ? colors : CHART_COLORS)[i % (colors.length || CHART_COLORS.length)],
          }));
    const visiblePoints = useMemo(
        () => allPoints.filter((p) => !hidden.includes(legendKey(p.seriesIndex, p.name, p.dataIndex))),
        [allPoints, hidden, legendKey]
    );
    const scene = useMemo(() => {
        // 提示焦点变化不会重新排布词云或重算全部图形。
        const context: SceneContext = {
            props: options,
            points: visiblePoints,
            width,
            height: chartHeight,
            format: valueFormatter,
        };
        return AXIS_TYPES.has(type)
            ? cartesianScene(context)
            : ['pie', 'ring', 'rose'].includes(type)
              ? pieScene(context)
              : type === 'radar'
                ? radarScene(context)
                : ['gauge', 'arcbar'].includes(type)
                  ? gaugeScene(context)
                  : type === 'funnel'
                    ? funnelScene(context)
                    : type === 'word'
                      ? wordScene(context)
                      : mapScene(context);
    }, [options, visiblePoints, width, chartHeight, valueFormatter, type]);
    const selected = selectable ? scene.marks.find((mark) => interactionKey(mark) === selectedKey) : undefined;
    const active = selected ?? scene.marks.find((mark) => interactionKey(mark) === (activeKey ?? focusedKey));
    const related = useMemo(() => (active ? relatedMarks(scene.marks, active, shared) : []), [scene, active, shared]);
    const relatedKeys = useMemo(() => new Set(related.map((mark) => mark.key)), [related]);
    useEffect(() => cancelPointer, [scene, loading, selectedKey, shared, cancelPointer]);
    /** 同一绘制帧只处理最后一次指针位置，命中及布局测量也随帧合并。 */
    const movePointer = (event: React.PointerEvent<SVGSVGElement>) => {
        if (event.pointerType === 'touch' || selected) return;
        const target = (event.target as Element).closest('[data-chart-mark]');
        pendingPointer.current = {
            node: event.currentTarget,
            x: event.clientX,
            y: event.clientY,
            key: target?.getAttribute('data-chart-mark') ?? null,
        };
        if (pointerFrame.current !== null) return;
        // 只保存事件数据，不把 React 事件对象带入下一帧。
        pointerFrame.current = requestAnimationFrame(() => {
            pointerFrame.current = null;
            const pointer = pendingPointer.current;
            pendingPointer.current = null;
            if (!pointer) return;
            let key = pointer.key;
            if (!key) {
                const bounds = pointer.node.getBoundingClientRect();
                const mark =
                    bounds.width > 0 && bounds.height > 0
                        ? nearestMark(
                              scene,
                              ((pointer.x - bounds.left) * width) / bounds.width,
                              ((pointer.y - bounds.top) * chartHeight) / bounds.height,
                              shared
                          )
                        : undefined;
                key = mark ? interactionKey(mark) : null;
            }
            setActiveKey((current) => (current === key ? current : key));
        });
    };
    const focusedLegend = entries.find((entry) => entry.key === legendFocus && !hidden.includes(entry.key));
    const validFocus = scene.marks.some((mark) => interactionKey(mark) === focusedKey);
    const hiddenCount = entries.filter((entry) => hidden.includes(entry.key)).length;
    useEffect(() => {
        // 隐藏、换图或异步数据删除当前点后取消锁定，恢复数据时不会意外复活旧选择。
        if (loading) {
            setActiveKey(null);
            setFocusedKey(null);
            setLegendFocus(null);
        }
        if (loading || !selectable || !scene.marks.some((mark) => interactionKey(mark) === selectedKey))
            setSelectedKey(null);
    }, [scene, loading, selectable, selectedKey]);
    const empty = !scene.marks.length;
    const allHidden = allPoints.length > 0 && !visiblePoints.length;
    const missingMap = type === 'map' && !regions?.length;
    const label = ariaLabel ?? (typeof title === 'string' ? title : '统计图表');
    /** 提示与屏幕阅读器使用同一份数值描述，保留二维坐标和 OHLC 信息。 */
    const describe = (mark: ChartMark) => {
        const p = mark.point;
        // K 线不能仅报收盘价，否则用户无法读取蜡烛的上下影线含义。
        if (p.candle)
            return `开 ${valueFormatter(p.candle.open)} / 收 ${valueFormatter(p.candle.close)} / 低 ${valueFormatter(p.candle.low)} / 高 ${valueFormatter(p.candle.high)}`;
        if (['scatter', 'bubble', 'time'].includes(type))
            return `${xFormatter?.(p.x) ?? (type === 'time' ? dayjs(p.x).format('YYYY-MM-DD HH:mm:ss') : valueFormatter(p.x))} · ${valueFormatter(p.value)}${type === 'bubble' ? ` · 权重 ${valueFormatter(p.size)}` : ''}`;
        return valueFormatter(p.value);
    };
    /** 清理临时和锁定状态，Escape、恢复图例与关闭按钮保持一致。 */
    const clearActive = () => {
        // 同时清理焦点对应的提示状态，防止解除锁定后旧提示立即出现。
        cancelPointer();
        setActiveKey(null);
        setFocusedKey(null);
        setSelectedKey(null);
    };
    /** 保持原数据点击回调，同时允许再次激活同一点解除锁定。 */
    const activate = (mark: ChartMark) => {
        const key = interactionKey(mark);
        // selection 不依赖 onDataClick，只有查看需求的图表也可以锁定读数。
        cancelPointer();
        setActiveKey(key);
        if (selectable) setSelectedKey(selectedKey === key ? null : key);
        onDataClick?.(mark.point);
    };
    /** 图例联动优先突出整个系列；读数时仅突出当前对比组。 */
    const muted = (mark: ChartMark) => {
        if (!highlight) return false;
        // 不把未匹配或已隐藏的图例当作激活对象，避免整个图面被淡化。
        if (focusedLegend)
            return legendKey(mark.point.seriesIndex, mark.point.name, mark.point.dataIndex) !== focusedLegend.key;
        return Boolean(active && !relatedKeys.has(mark.key));
    };
    const total = useMemo(() => scene.marks.reduce((sum, mark) => sum + Math.max(0, mark.point.value), 0), [scene]);
    const tooltipContext: ChartTooltipContext | undefined = active
        ? {
              type,
              name:
                  type === 'time'
                      ? (xFormatter?.(active.point.x) ?? dayjs(active.point.x).format('YYYY-MM-DD HH:mm:ss'))
                      : active.point.name,
              locked: Boolean(selected),
              items: related.map((mark) => {
                  const index = scene.marks.indexOf(mark);
                  const first = scene.marks[0]?.point.value ?? 0;
                  const previous = scene.marks[index - 1]?.point.value ?? 0;
                  const denominator = type === 'funnel' ? first : total;
                  return {
                      ...mark.point,
                      formattedValue: describe(mark),
                      percentage:
                          ['pie', 'ring', 'rose', 'funnel'].includes(type) && denominator > 0
                              ? (mark.point.value / denominator) * 100
                              : undefined,
                      conversion: type === 'funnel' && previous > 0 ? (mark.point.value / previous) * 100 : undefined,
                  };
              }),
          }
        : undefined;
    const tooltipContent =
        tooltipContext &&
        (tooltipOptions.render ? (
            tooltipOptions.render(tooltipContext)
        ) : (
            <>
                <div className={styles.tooltipTitle}>
                    <strong>{tooltipContext.name}</strong>
                    {selected && <span className={styles.locked}>已锁定</span>}
                </div>
                {tooltipContext.items.map((item) => (
                    <div className={styles.tooltipRow} key={`${item.seriesIndex}-${item.dataIndex}`}>
                        <span className={styles.swatch} style={{ background: item.color }} aria-hidden="true" />
                        <div className={styles.tooltipValue}>
                            <span>{item.seriesName}</span>
                            <strong>{item.formattedValue}</strong>
                            {tooltipOptions.showPercentage !== false && item.percentage !== undefined && (
                                <small>
                                    {type === 'funnel' ? '较首阶段' : '占比'} {defaultFormat(item.percentage)}%
                                </small>
                            )}
                            {tooltipOptions.showPercentage !== false && item.conversion !== undefined && (
                                <small>较上阶段 {defaultFormat(item.conversion)}%</small>
                            )}
                        </div>
                    </div>
                ))}
                {selectable && (
                    <div className={styles.tooltipHint}>{selected ? '再次点击或按 Esc 解除锁定' : '点击锁定读数'}</div>
                )}
            </>
        ));
    const hasTooltip = Boolean(
        tooltip && tooltipContent !== null && tooltipContent !== undefined && tooltipContent !== false
    );
    return (
        <div
            role="figure"
            {...rest}
            className={[styles.chart, animated && styles.animated, className].filter(Boolean).join(' ')}
            style={style}
            aria-label={label}
            aria-busy={loading || undefined}
            onKeyDown={(event) => {
                rest.onKeyDown?.(event);
                if (!event.defaultPrevented && event.key === 'Escape') clearActive();
            }}
        >
            {(title || description) && (
                <div className={styles.header}>
                    {title && <div className={styles.title}>{title}</div>}
                    {description && <div className={styles.description}>{description}</div>}
                </div>
            )}
            <div
                ref={viewport}
                className={styles.viewport}
                style={{ minHeight: chartHeight }}
                onScroll={(event) => setScrollLeft(event.currentTarget.scrollLeft)}
                onPointerLeave={() => {
                    cancelPointer();
                    setActiveKey(null);
                }}
            >
                {loading ? (
                    <div className={styles.state} style={{ height: chartHeight }} role="status">
                        正在整理数据…
                    </div>
                ) : (
                    <>
                        <svg
                            width={width}
                            height={chartHeight}
                            viewBox={`0 0 ${width} ${chartHeight}`}
                            className={styles.canvas}
                            role="group"
                            aria-label={label}
                            onPointerMove={movePointer}
                            onClick={(event) => {
                                if (!(event.target as Element).closest('[data-chart-mark]')) clearActive();
                            }}
                        >
                            <g aria-hidden="true">{!empty && scene.background}</g>
                            {scene.layers?.map((layer) => (
                                <g
                                    key={layer.seriesIndex}
                                    aria-hidden="true"
                                    className={[
                                        styles.layer,
                                        highlight &&
                                            focusedLegend &&
                                            legendKey(layer.seriesIndex, '') !== focusedLegend.key &&
                                            styles.muted,
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                >
                                    {layer.node}
                                </g>
                            ))}
                            {tooltip && tooltipOptions.crosshair !== false && active && scene.plot && (
                                <g className={styles.crosshair} aria-hidden="true">
                                    {scene.plot.horizontal ? (
                                        <line
                                            x1={scene.plot.left}
                                            x2={scene.plot.right}
                                            y1={active.axisPosition ?? active.y}
                                            y2={active.axisPosition ?? active.y}
                                        />
                                    ) : (
                                        <line
                                            x1={active.axisPosition ?? active.x}
                                            x2={active.axisPosition ?? active.x}
                                            y1={scene.plot.top}
                                            y2={scene.plot.bottom}
                                        />
                                    )}
                                    {!shared && !scene.plot.horizontal && (
                                        <line x1={scene.plot.left} x2={scene.plot.right} y1={active.y} y2={active.y} />
                                    )}
                                </g>
                            )}
                            {scene.marks.map((mark, index) => (
                                <g
                                    key={mark.key}
                                    ref={(node) => {
                                        if (node) marksRef.current.set(mark.key, node);
                                        else marksRef.current.delete(mark.key);
                                    }}
                                    className={[
                                        styles.mark,
                                        muted(mark) && styles.muted,
                                        highlight && active && relatedKeys.has(mark.key) && styles.markActive,
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    data-chart-mark={interactionKey(mark)}
                                    role="button"
                                    tabIndex={
                                        validFocus
                                            ? focusedKey === interactionKey(mark)
                                                ? 0
                                                : -1
                                            : index === 0
                                              ? 0
                                              : -1
                                    }
                                    aria-pressed={selectable ? selected === mark : undefined}
                                    aria-describedby={hasTooltip && active === mark ? tooltipId : undefined}
                                    aria-label={`${mark.point.seriesName}，${mark.point.name}，${describe(mark)}`}
                                    onPointerEnter={(event) => {
                                        cancelPointer();
                                        if (event.pointerType !== 'touch') setActiveKey(interactionKey(mark));
                                    }}
                                    onFocus={() => {
                                        cancelPointer();
                                        setActiveKey(null);
                                        setFocusedKey(interactionKey(mark));
                                    }}
                                    onBlur={() => setFocusedKey(null)}
                                    onClick={() => activate(mark)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            activate(mark);
                                        }
                                        if (
                                            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
                                                event.key
                                            )
                                        ) {
                                            event.preventDefault();
                                            clearActive();
                                            const next =
                                                event.key === 'Home'
                                                    ? 0
                                                    : event.key === 'End'
                                                      ? scene.marks.length - 1
                                                      : (index +
                                                            (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) +
                                                            scene.marks.length) %
                                                        scene.marks.length;
                                            marksRef.current.get(scene.marks[next].key)?.focus();
                                            // Home/End 可能仍停留在同一节点，此时浏览器不会再次触发 focus。
                                            setFocusedKey(interactionKey(scene.marks[next]));
                                        }
                                    }}
                                >
                                    {(mark.point.value === 0 ||
                                        ['line', 'area', 'mix', 'time', 'scatter', 'bubble', 'radar'].includes(
                                            type
                                        )) && (
                                        <ellipse
                                            cx={mark.x}
                                            cy={mark.y}
                                            rx={12}
                                            ry={12}
                                            fill="transparent"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {mark.node}
                                </g>
                            ))}
                            {highlight && active && (scene.plot || type === 'radar') && (
                                <g className={styles.indicators} aria-hidden="true">
                                    {related.map((mark) => (
                                        <circle
                                            key={mark.key}
                                            cx={mark.x}
                                            cy={mark.y}
                                            r={7}
                                            fill="var(--animal-bg-color, #f8f8f0)"
                                            stroke={mark.point.color}
                                            strokeWidth={2.5}
                                        />
                                    ))}
                                </g>
                            )}
                        </svg>
                        {empty && (
                            <div className={styles.empty} role="status">
                                {!allHidden && !missingMap && React.isValidElement(emptyText) ? (
                                    emptyText
                                ) : (
                                    <NoData
                                        size="small"
                                        title={
                                            allHidden ? '所有图例已隐藏' : missingMap ? '请提供地图区域轮廓' : emptyText
                                        }
                                        description={allHidden ? '恢复图例后，即可继续查看统计。' : undefined}
                                        extra={
                                            hiddenCount > 0 ? (
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setHidden([]);
                                                        clearActive();
                                                    }}
                                                >
                                                    恢复全部图例
                                                </Button>
                                            ) : undefined
                                        }
                                    />
                                )}
                            </div>
                        )}
                        {hasTooltip && active && (
                            <ChartTooltip
                                id={tooltipId}
                                x={active.x}
                                y={active.y}
                                height={chartHeight}
                                viewportWidth={width}
                                scrollLeft={scrollLeft}
                                locked={Boolean(selected)}
                            >
                                {tooltipContent}
                            </ChartTooltip>
                        )}
                    </>
                )}
            </div>
            {legend && entries.length > 0 && (
                <div className={styles.legend} aria-label="图例">
                    {entries.map((entry) => (
                        <button
                            type="button"
                            key={entry.key}
                            aria-pressed={!hidden.includes(entry.key)}
                            onPointerEnter={() => setLegendFocus(entry.key)}
                            onPointerLeave={() => setLegendFocus(null)}
                            onFocus={() => setLegendFocus(entry.key)}
                            onBlur={() => setLegendFocus(null)}
                            onClick={() => {
                                setHidden((values) =>
                                    values.includes(entry.key)
                                        ? values.filter((v) => v !== entry.key)
                                        : [...values, entry.key]
                                );
                                clearActive();
                            }}
                        >
                            <span className={styles.swatch} style={{ background: entry.color }} aria-hidden="true" />
                            {entry.name}
                        </button>
                    ))}
                    {hiddenCount > 0 && !empty && (
                        <button
                            type="button"
                            onClick={() => {
                                setHidden([]);
                                clearActive();
                            }}
                        >
                            恢复全部图例
                        </button>
                    )}
                </div>
            )}
            {!loading && selected && (
                <div className={styles.selection}>
                    <span>已锁定：{selected.point.name}</span>
                    <button type="button" onClick={clearActive}>
                        解除锁定
                    </button>
                </div>
            )}
            {!loading && allPoints.length > 0 && (
                <details className={styles.data}>
                    <summary>查看数据（{allPoints.length}）</summary>
                    <div className={styles.tableScroll}>
                        <table>
                            <caption>{label}数据明细</caption>
                            <thead>
                                <tr>
                                    <th scope="col">系列</th>
                                    <th scope="col">项目</th>
                                    <th scope="col">数值</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPoints.map((p) => (
                                    <tr key={`${p.seriesIndex}-${p.dataIndex}`}>
                                        <td>{p.seriesName}</td>
                                        <td>{p.name}</td>
                                        <td>{describe({ key: '', point: p, node: null, x: 0, y: 0 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            )}
            {type === 'word' && scene.marks.length < visiblePoints.filter((p) => p.value > 0).length && (
                <div className={styles.description}>部分词条未能放入当前绘图区，完整数值可展开查看数据。</div>
            )}
        </div>
    );
};

Chart.displayName = 'Chart';
