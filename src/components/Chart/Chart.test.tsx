import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { setup } from '@test/utils';
import { Chart } from './Chart';
import { normalize, axisTicks, polar } from './geometry';
import { cartesianScene } from './Cartesian';
import { radarScene } from './Polar';
import { nearestMark, relatedMarks } from './interaction';
import type { ChartProps, ChartType } from './types';

/** 普通类型复用同一组数据，便于验证缺测不会改变原始下标。 */
const basicSeries = [{ name: '到访', data: [12, null, 25] }];

describe('Chart', () => {
    it('同分类提示聚合系列，锁定后悬浮其他点不改变读数，方向键解除锁定并切换', async () => {
        const user = setup();
        render(
            <Chart
                categories={['周一', '周二']}
                series={[
                    { name: '本周', data: [10, 20] },
                    { name: '上周', data: [8, 16] },
                ]}
            />
        );
        const monday = screen.getByRole('button', { name: '本周，周一，10' });
        const tuesday = screen.getByRole('button', { name: '本周，周二，20' });
        await user.click(monday);
        expect(screen.getByRole('tooltip')).toHaveTextContent('上周8');
        await user.hover(tuesday);
        expect(screen.getByRole('tooltip')).toHaveTextContent('周一');
        await user.keyboard('{ArrowRight}');
        expect(tuesday).toHaveFocus();
        expect(monday).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('tooltip')).toHaveTextContent('周二');
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('提示开关、比例口径及自定义内容保持一致，图例可全部恢复', async () => {
        const user = setup();
        const series = [
            {
                name: '区域',
                data: [
                    { name: '果园', value: 30 },
                    { name: '海岸', value: 70 },
                ],
            },
        ];
        const { rerender } = render(<Chart type="ring" series={series} />);
        await user.click(screen.getByRole('button', { name: '区域，果园，30' }));
        expect(screen.getByRole('tooltip')).toHaveTextContent('占比 30%');
        await user.click(screen.getByRole('button', { name: '海岸' }));
        await user.click(screen.getByRole('button', { name: '区域，果园，30' }));
        expect(screen.getByRole('tooltip')).toHaveTextContent('占比 100%');
        await user.click(screen.getByRole('button', { name: '果园' }));
        expect(screen.getByRole('status')).toHaveTextContent('所有图例已隐藏');
        await user.click(screen.getByRole('button', { name: '恢复全部图例' }));
        expect(screen.getByRole('button', { name: '海岸' })).toHaveAttribute('aria-pressed', 'true');
        rerender(
            <Chart
                type="ring"
                series={series}
                selectable={false}
                tooltip={{ render: ({ items }) => <span>自定义：{items[0].percentage}%</span> }}
            />
        );
        await user.hover(screen.getByRole('button', { name: '区域，海岸，70' }));
        expect(screen.getByRole('tooltip')).toHaveTextContent('自定义：70%');
        rerender(<Chart type="ring" series={series} tooltip={false} />);
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('时序按真实时间聚合，分类空白命中使用分类中心且不越出绘图区', () => {
        const props: ChartProps = {
            type: 'time',
            series: [
                {
                    name: '甲',
                    data: [
                        { x: 1000, y: 10 },
                        { x: 2000, y: 20 },
                    ],
                },
                { name: '乙', data: [{ x: 2000, y: 30 }] },
            ],
        };
        const scene = cartesianScene({ props, points: normalize(props), width: 640, height: 300, format: String });
        expect(relatedMarks(scene.marks, scene.marks[0], true)).toHaveLength(1);
        expect(relatedMarks(scene.marks, scene.marks[1], true).map((mark) => mark.point.value)).toEqual([20, 30]);
        expect(nearestMark(scene, scene.marks[0].x, scene.plot!.top + 1, true)?.point.x).toBe(1000);
        expect(nearestMark(scene, 0, 0, true)).toBeUndefined();
    });

    it('雷达空白按角度命中维度，零值和首尾角度保留归属，单项提示与圆外保持边界', () => {
        // 首维度全为零且存在缺测；按端点角度推断会把中心零值错误归给另一维度。
        const props: ChartProps = {
            type: 'radar',
            categories: ['甲', '乙', '丙', '丁'],
            max: 100,
            series: [
                { name: '本期', data: [0, 60, null, 50] },
                { name: '上期', data: [0, 70, 40, 55] },
            ],
        };
        const scene = radarScene({ props, points: normalize(props), width: 640, height: 300, format: String });
        const { cx, cy, radius } = scene.polarPlot!;
        const beforeTop = polar(cx, cy, radius * 0.9, -0.05);
        const afterTop = polar(cx, cy, radius * 0.9, 0.05);
        expect(nearestMark(scene, ...beforeTop, true)?.point.dataIndex).toBe(0);
        expect(nearestMark(scene, ...afterTop, true)?.point.dataIndex).toBe(0);
        const right = polar(cx, cy, radius * 0.95, Math.PI / 2);
        const active = nearestMark(scene, ...right, true)!;
        expect(active.point.dataIndex).toBe(1);
        expect(relatedMarks(scene.marks, active, true).map((mark) => mark.point.value)).toEqual([60, 70]);
        expect(nearestMark(scene, cx, cy + radius * 0.9, true)?.point.seriesName).toBe('上期');
        expect(nearestMark(scene, ...beforeTop, false)).toBeUndefined();
        expect(nearestMark(scene, cx + radius + 1, cy, true)).toBeUndefined();
        expect(nearestMark(scene, cx + radius * 0.9, cy + radius * 0.9, true)).toBeUndefined();
    });

    it.each<ChartType>(['column', 'bar', 'line', 'area', 'mount', 'mix', 'pie', 'ring', 'rose', 'funnel', 'word'])(
        '%s 保留有效数据和原始回调下标',
        async (type) => {
            const user = setup();
            const onDataClick = vi.fn();
            render(<Chart type={type} title="到访统计" series={basicSeries} onDataClick={onDataClick} />);
            const plot = screen.getByRole('group', { name: '到访统计' });
            expect(within(plot).getAllByRole('button')).toHaveLength(2);
            await user.click(within(plot).getByRole('button', { name: '到访，3，25' }));
            expect(onDataClick).toHaveBeenCalledWith(expect.objectContaining({ type, dataIndex: 2, value: 25 }));
        }
    );

    it('图例全部隐藏后可恢复，数据明细仍保留', async () => {
        const user = setup();
        render(<Chart title="到访统计" series={basicSeries} />);
        const toggle = screen.getByRole('button', { name: '到访' });
        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('status')).toHaveTextContent('所有图例已隐藏');
        expect(screen.getByText('查看数据（2）')).toBeInTheDocument();
        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-pressed', 'true');
        expect(within(screen.getByRole('group', { name: '到访统计' })).getAllByRole('button')).toHaveLength(2);
    });

    it('键盘 Enter 和 Space 激活数据点，Escape 关闭提示', async () => {
        const user = setup();
        const onDataClick = vi.fn();
        render(<Chart series={[{ name: '目标', data: [42] }]} onDataClick={onDataClick} />);
        await user.tab();
        expect(screen.getByRole('button', { name: '目标，1，42' })).toHaveFocus();
        expect(screen.getByRole('tooltip')).toHaveTextContent('42');
        await user.keyboard('{Home}{End}');
        expect(screen.getByRole('tooltip')).toHaveTextContent('42');
        await user.keyboard('{Enter} ');
        expect(onDataClick).toHaveBeenCalledTimes(2);
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('加载态与自定义空态不残留数据图形', () => {
        const { rerender } = render(<Chart series={basicSeries} loading />);
        expect(screen.getByRole('figure')).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByRole('status')).toHaveTextContent('正在整理数据');
        expect(screen.queryByRole('group')).not.toBeInTheDocument();
        rerender(<Chart series={[]} emptyText="尚无访客" />);
        expect(screen.getByRole('status')).toHaveTextContent('尚无访客');
        rerender(<Chart series={[]} emptyText={<section>自定义完整空态</section>} />);
        expect(screen.getByRole('status').querySelector('svg')).not.toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('自定义完整空态');
    });

    it('过滤无效输入和非法权重，不将 null 当作零值', () => {
        expect(
            normalize({ series: [{ name: '测量', data: [null, NaN, Infinity, 0, -4] }] }).map((p) => p.value)
        ).toEqual([0, -4]);
        const props: ChartProps = {
            type: 'bubble',
            series: [{ name: '测量', data: [{ x: 1 }, { x: 1, y: 2, size: 0 }, { x: 3, y: 4, size: 9 }] }],
        };
        expect(normalize(props)).toHaveLength(1);
        expect(normalize(props)[0]).toMatchObject({ dataIndex: 2, x: 3, value: 4, size: 9 });
    });

    it('分类折线在缺测处断开，零值仍可访问', () => {
        const { container } = render(<Chart type="line" series={[{ name: '测量', data: [4, 6, null, 0, 8] }]} />);
        const linePaths = container.querySelectorAll('path[stroke-linecap="round"]');
        expect(linePaths).toHaveLength(2);
        expect(linePaths[0].getAttribute('d')).toMatch(/^M.+ L/);
        expect(screen.getByRole('button', { name: '测量，4，0' })).toBeInTheDocument();
    });

    it('堆叠柱的正负值分别从零开始累计', () => {
        const { container } = render(
            <Chart
                stacked
                min={-20}
                max={20}
                series={[
                    { name: '甲', data: [10, -5] },
                    { name: '乙', data: [5, -10] },
                ]}
            />
        );
        const bars = Array.from(container.querySelectorAll('svg [role="button"] rect'));
        const heights = bars.map((bar) => Number(bar.getAttribute('height')));
        expect(heights[0]).toBeCloseTo(heights[2] * 2);
        expect(heights[3]).toBeCloseTo(heights[1] * 2);
        expect(Number(bars[2].getAttribute('y')) + heights[2]).toBeCloseTo(Number(bars[0].getAttribute('y')));
        expect(Number(bars[1].getAttribute('y')) + heights[1]).toBeCloseTo(Number(bars[3].getAttribute('y')));
    });

    it('数值坐标保留真实间隔，气泡面积与权重成正比', () => {
        const { container, rerender } = render(
            <Chart
                type="bubble"
                series={[
                    {
                        name: '活动',
                        data: [
                            { x: 0, y: 5, size: 1 },
                            { x: 10, y: 6, size: 4 },
                        ],
                    },
                ]}
            />
        );
        const circles = container.querySelectorAll('svg [role="button"] circle');
        expect(Number(circles[1].getAttribute('r')) / Number(circles[0].getAttribute('r'))).toBeCloseTo(2);
        rerender(
            <Chart
                type="time"
                series={[
                    {
                        name: '到访',
                        data: [
                            { x: 1000, y: 2 },
                            { x: 2000, y: 3 },
                            { x: 5000, y: 4 },
                        ],
                    },
                ]}
            />
        );
        const xs = Array.from(container.querySelectorAll('svg [role="button"] circle')).map((circle) =>
            Number(circle.getAttribute('cx'))
        );
        expect((xs[2] - xs[1]) / (xs[1] - xs[0])).toBeCloseTo(3);
    });

    it('散点提示保留横纵坐标和自定义格式', async () => {
        const user = setup();
        render(
            <Chart
                type="scatter"
                xFormatter={(v) => `${v}天`}
                valueFormatter={(v) => `${v}人`}
                series={[{ name: '访客', data: [{ x: 3, y: 8 }] }]}
            />
        );
        await user.click(screen.getByRole('button', { name: '访客，1，3天 · 8人' }));
        expect(screen.getByRole('tooltip')).toHaveTextContent('3天 · 8人');
    });

    it('单项环形仍有内环，零值饼图显示空态', () => {
        const { container, rerender } = render(<Chart type="ring" series={[{ name: '人数', data: [12] }]} />);
        const path = container.querySelector('svg [role="button"] path')!.getAttribute('d')!;
        // SVG 整圆首尾重合，需要外环与内环各两段圆弧。
        expect(path.match(/ A/g)).toHaveLength(4);
        expect(screen.getByText('合计')).toBeInTheDocument();
        rerender(<Chart type="pie" series={[{ name: '人数', data: [0, -4] }]} />);
        expect(screen.getByRole('status')).toHaveTextContent('暂无数据');
    });

    it('雷达缺测系列不补成零值多边形', () => {
        const { container } = render(
            <Chart type="radar" categories={['甲', '乙', '丙']} series={[{ name: '本期', data: [30, null, 60] }]} />
        );
        expect(container.querySelectorAll('polygon[stroke-width="2.5"]')).toHaveLength(0);
        expect(within(screen.getByRole('group', { name: '统计图表' })).getAllByRole('button')).toHaveLength(2);
    });

    it.each<ChartType>(['arcbar', 'gauge'])('%s 限制图形范围但提示仍保留实际值', async (type) => {
        const user = setup();
        render(<Chart type={type} series={[{ name: '目标', data: [150] }]} max={100} />);
        await user.click(screen.getByRole('button', { name: '目标，1，150' }));
        expect(screen.getByRole('tooltip')).toHaveTextContent('150');
    });

    it('K 线提示包含四个值，非法价格区间不绘制', async () => {
        const user = setup();
        render(
            <Chart
                type="candle"
                series={[
                    {
                        name: '集市',
                        data: [
                            { open: 4, close: 6, low: 3, high: 8 },
                            { open: 10, close: 6, low: 3, high: 8 },
                        ],
                    },
                ]}
            />
        );
        const marks = within(screen.getByRole('group', { name: '统计图表' })).getAllByRole('button');
        expect(marks).toHaveLength(1);
        await user.click(marks[0]);
        expect(screen.getByRole('tooltip')).toHaveTextContent('开 4 / 收 6 / 低 3 / 高 8');
    });

    it('地图按区域名关联，不按输入顺序配对', async () => {
        const user = setup();
        const onDataClick = vi.fn();
        render(
            <Chart
                type="map"
                onDataClick={onDataClick}
                series={[
                    {
                        name: '人数',
                        data: [
                            { name: '乙', value: 8 },
                            { name: '甲', value: 4 },
                        ],
                    },
                ]}
                regions={[
                    {
                        name: '甲',
                        polygons: [
                            [
                                [0, 0],
                                [1, 0],
                                [1, 1],
                            ],
                        ],
                    },
                    {
                        name: '乙',
                        polygons: [
                            [
                                [1, 0],
                                [2, 0],
                                [2, 1],
                            ],
                        ],
                    },
                ]}
            />
        );
        await user.click(screen.getByRole('button', { name: '人数，甲，4' }));
        expect(onDataClick).toHaveBeenCalledWith(expect.objectContaining({ name: '甲', dataIndex: 1, value: 4 }));
    });

    it('画布跟随窄容器宽度，不再按最小画布宽度撑出横向滚动', () => {
        // jsdom 没有布局宽度，mock 240px 复现此前按 280px 绘制、需要横向滚动的窄容器。
        const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get: () => 240,
        });
        try {
            const { container } = render(<Chart categories={['周一']} series={[{ name: '到访', data: [12] }]} />);
            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('width', '240');
            expect(svg).toHaveAttribute('viewBox', '0 0 240 300');
        } finally {
            if (original) Object.defineProperty(HTMLElement.prototype, 'clientWidth', original);
        }
    });

    it('自动刻度易读，同时尊重显式范围', () => {
        expect(axisTicks([32, 79])).toEqual([0, 20, 40, 60, 80]);
        expect(axisTicks([-12, 26])[0]).toBeLessThanOrEqual(-12);
        expect(axisTicks([32, 79], 10, 70)).toEqual([10, 25, 40, 55, 70]);
    });
});
