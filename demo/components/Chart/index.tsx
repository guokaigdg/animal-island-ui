import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Chart, type ChartType } from '../../../src';
import { ApiTable, CodeBlock, type ApiRow, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';
import { CHART_PAGES } from '../../chartPages';
import { exampleProps } from './data';
import { ChartInteractionDemo } from './ChartInteractionDemo';
import { ChartTypeSwitcher, type ChartSelection } from './ChartTypeSwitcher';
import { ChartGalleryDemo, ChartShowcaseDemo } from './ChartGalleryDemo';
import { MountCurveDemo } from './MountCurveDemo';
import styles from './demo.module.less';

/** 常用图表属性；全部类型复用同一套配置。 */
const API: ApiRow[] = [
    { prop: 'type', desc: '19 种类型，见左侧图表统计分类', type: 'ChartType', defaultVal: "'column'" },
    {
        prop: 'series',
        desc: '系列名称、data、颜色，mix 可配置系列 type',
        type: 'ChartSeries[]',
        defaultVal: '-',
        required: true,
    },
    { prop: 'categories', desc: '分类轴或雷达维度标签', type: 'string[]', defaultVal: '-' },
    { prop: 'title / description', desc: '图表标题与说明', type: 'ReactNode', defaultVal: '-' },
    { prop: 'height', desc: '绘图区高度，最小 180px', type: 'number', defaultVal: '300' },
    { prop: 'colors', desc: '自定义配色，系列色和单点色优先', type: 'string[]', defaultVal: '岛屿配色' },
    { prop: 'legend', desc: '可筛选和悬浮联动的图例', type: 'boolean', defaultVal: 'true' },
    {
        prop: 'tooltip',
        desc: '提示开关或配置对象，见下方参数',
        type: 'boolean | ChartTooltipOptions',
        defaultVal: 'true',
    },
    {
        prop: 'tooltip.trigger',
        desc: '同分类对比 / 单点提示，不支持分类的类型自动回退单点',
        type: "'axis' | 'item'",
        defaultVal: "'axis'",
    },
    {
        prop: 'tooltip.crosshair / showPercentage',
        desc: '坐标辅助线 / 占比及漏斗转化率',
        type: 'boolean',
        defaultVal: 'true',
    },
    {
        prop: 'tooltip.render',
        desc: '自定义提示，收到 type、name、items、locked；null 隐藏',
        type: '(context: ChartTooltipContext) => ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'highlight / selectable',
        desc: '悬浮高亮 / 点击锁定，方向键浏览数据，Esc 解除',
        type: 'boolean',
        defaultVal: 'true',
    },
    { prop: 'stacked', desc: '柱状、条状图正负值分别堆叠', type: 'boolean', defaultVal: 'false' },
    { prop: 'smooth', desc: '折线、面积、混合、时序图平滑连接；山峰图圆润峰顶', type: 'boolean', defaultVal: 'false' },
    { prop: 'showAxes / showLabels', desc: '坐标网格 / 数据标签', type: 'boolean', defaultVal: 'true / false' },
    { prop: 'min / max', desc: '值域；圆弧与仪表盘默认 0–100', type: 'number', defaultVal: '自动' },
    {
        prop: 'valueFormatter / xFormatter',
        desc: '数值 / 数值横轴格式化',
        type: '(value: number) => string',
        defaultVal: '-',
    },
    { prop: 'regions', desc: 'map 的平面轮廓，按 name 与数据关联', type: 'ChartMapRegion[]', defaultVal: '-' },
    {
        prop: 'loading / emptyText',
        desc: '加载状态 / 空态文案',
        type: 'boolean / ReactNode',
        defaultVal: 'false / 暂无数据',
    },
    { prop: 'animated', desc: '入场淡入，遵循减少动态效果设置', type: 'boolean', defaultVal: 'true' },
    {
        prop: 'onDataClick',
        desc: '点击、Enter 或 Space 触发，携带原数据与下标',
        type: '(event: ChartDataEvent) => void',
        defaultVal: '-',
    },
];

/** 每个图表类型的独立页面，保留本页操作状态及可直接复制的数据结构。 */
const ChartTypeDemo: React.FC<{ type: ChartType }> = ({ type }) => {
    const [alternate, setAlternate] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enhanced, setEnhanced] = useState(false);
    const [message, setMessage] = useState('点击图形查看数据；点击图例隐藏或恢复系列。');
    const page = CHART_PAGES.find((p) => p.type === type)!;
    const example = exampleProps(type, alternate);
    // 状态按钮只改变本页示例，不会改动其它图表或已有组件演示。
    const supportsStack = type === 'column' || type === 'bar';
    const supportsSmooth = ['line', 'area', 'mix', 'time'].includes(type);
    const code = JSON.stringify({ ...example, valueFormatter: undefined }, null, 4);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>{page.label} · 海岛统计</div>
            <p className={styles.note}>
                以下为虚构演示数据。{type === 'map' ? '地图为自绘岛屿分区，不代表真实行政区。' : page.desc}
            </p>
            {type === 'mount' && <MountCurveDemo />}
            <ChartGalleryDemo type={type} />
            <div style={labelStyle}>基础示例与状态切换</div>
            <div className={styles.controls}>
                <Button size="small" onClick={() => setAlternate(!alternate)}>
                    切换数据
                </Button>
                <Button size="small" onClick={() => setEmpty(!empty)}>
                    {empty ? '恢复数据' : '查看空态'}
                </Button>
                <Button size="small" onClick={() => setLoading(!loading)}>
                    {loading ? '结束加载' : '查看加载态'}
                </Button>
                {(supportsStack || supportsSmooth) && (
                    <Button size="small" onClick={() => setEnhanced(!enhanced)}>
                        {supportsStack ? (enhanced ? '切换分组' : '切换堆叠') : enhanced ? '切换直线' : '切换曲线'}
                    </Button>
                )}
            </div>
            <Chart
                {...example}
                series={empty ? [] : example.series}
                title={`岛屿${page.label}`}
                description={page.desc}
                stacked={supportsStack && enhanced}
                smooth={supportsSmooth && enhanced}
                loading={loading}
                height={320}
                onDataClick={(event) => setMessage(`${event.seriesName} / ${event.name}：${event.value}`)}
            />
            <p className={styles.note} role="status">
                {message}
            </p>
            {['column', 'bar', 'line', 'area'].includes(type) && (
                <>
                    <div style={labelStyle}>边界示例：负值、零值与缺测</div>
                    <Chart
                        type={type}
                        title="盈余与支出"
                        categories={['周一', '周二', '周三', '周四', '周五']}
                        series={[{ name: '净变化', data: [18, -12, null, 0, 26] }]}
                        height={240}
                    />
                </>
            )}
            <CodeBlock
                code={`import { Chart, type ChartProps } from 'animal-island-ui';\n\nconst chartProps: ChartProps = ${code};\n\n<Chart {...chartProps} />`}
            />
            <ChartInteractionDemo type={type} />
            <ApiTable rows={API} />
        </div>
    );
};
ChartTypeDemo.displayName = 'ChartTypeDemo';

/** 类型总览保留基础示例，并提供样式精选和各图表类型的完整演示入口。 */
export const ChartOverviewDemo: React.FC = () => {
    // 总览只使用轻量数据，详细示例由各类型段落承载。
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>岛屿统计手账</div>
            <p className={styles.note}>19 种统计图形，共用岛屿配色、数据提示、图例筛选和键盘操作。以下均为演示数据。</p>
            <ChartShowcaseDemo />
            <div style={labelStyle}>基础概览</div>
            <div className={styles.overview}>
                <Chart {...exampleProps('area')} title="一周到访趋势" smooth height={280} />
                <Chart {...exampleProps('ring')} title="岛屿分区占比" height={280} />
            </div>
            <Chart
                {...exampleProps('column')}
                title="每日活动参与"
                description="点击图例可单独查看一组数据"
                height={280}
            />
        </div>
    );
};
ChartOverviewDemo.displayName = 'ChartOverviewDemo';

/** 从路由读取当前选择：#/chart-column 选中该类型，其余（#/charts）回到全部。 */
function readSelection(): ChartSelection {
    const match = /^#\/chart-([a-z]+)$/.exec(window.location.hash);
    return match ? (match[1] as ChartType) : 'all';
}

/** 全部图表类型合并在同一页，总览在前、各类型段落依次排开。 */
export const ChartAllDemo: React.FC = () => {
    const [selected, setSelected] = useState<ChartSelection>(readSelection);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onHashChange = () => setSelected(readSelection());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    // 切换走 hash 路由，页面标题与深链同步更新。
    const handleSelect = useCallback((type: ChartSelection) => {
        window.location.hash = type === 'all' ? '#/charts' : `#/chart-${type}`;
    }, []);

    return (
        <div ref={containerRef}>
            <ChartTypeSwitcher value={selected} onSelect={handleSelect} />
            {selected === 'all' ? <ChartOverviewDemo /> : <ChartTypeDemo type={selected} />}
        </div>
    );
};
ChartAllDemo.displayName = 'ChartAllDemo';

/** 深链沿用合并页：#/chart-column 定位到对应段落，而非另开一个页面。 */
export const CHART_DEMO_PAGES: Record<string, React.FC> = Object.fromEntries(
    CHART_PAGES.map((page) => [`chart-${page.type}`, ChartAllDemo])
);
