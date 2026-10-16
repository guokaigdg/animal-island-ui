import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Calendar } from './Calendar';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';
import styles from './calendar.module.less';

const cell = (date: string) => document.querySelector(`[data-date="${date}"]`) as HTMLElement;

/** 用 userEvent 走一遍真实指针拖拽：按下 → 经过中间格子 → 在终点抬起 */
const drag = async (user: ReturnType<typeof setup>, from: string, to: string) => {
    const dates = [...document.querySelectorAll('[data-date]')].map((node) => (node as HTMLElement).dataset.date!);
    const fromIndex = dates.indexOf(from);
    const toIndex = dates.indexOf(to);
    const step = fromIndex <= toIndex ? 1 : -1;
    const path: string[] = [];
    for (let i = fromIndex; i !== toIndex + step; i += step) path.push(dates[i]);

    await user.pointer([
        { target: cell(path[0]), keys: '[MouseLeft>]' },
        ...path.slice(1).map((date) => ({ target: cell(date) })),
        { target: cell(path[path.length - 1]), keys: '[/MouseLeft]' },
    ]);
};

describe('Calendar', () => {
    describe('rendering', () => {
        it('渲染当前月份面板：年月标签 + 星期表头 + 42 个日期格', () => {
            render(<Calendar panelValue="2026-08-10" />);
            expect(screen.getByText('2026年8月')).toBeInTheDocument();
            expect(screen.getByRole('grid')).toBeInTheDocument();
            ['日', '一', '二', '三', '四', '五', '六'].forEach((weekday) => {
                expect(screen.getByRole('columnheader', { name: weekday })).toBeInTheDocument();
            });
            expect(document.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
        });

        it('面板固定补满 6 周，首尾带出上下月日期', () => {
            render(<Calendar panelValue="2026-08" />);
            expect(cell('2026-07-26')).toBeInTheDocument();
            expect(cell('2026-09-05')).toBeInTheDocument();
            expect(cell('2026-07-26').textContent).toContain('26');
        });

        it('默认选中今天，并按选中日期定位面板', () => {
            const today = dayjs();
            render(<Calendar />);
            expect(screen.getByText(`${today.year()}年${today.month() + 1}月`)).toBeInTheDocument();
            expect(cell(today.format('YYYY-MM-DD'))).toHaveAttribute('aria-selected', 'true');
        });

        it('非受控 defaultValue 选中指定日期', () => {
            render(<Calendar defaultValue="2026-08-10" panelValue="2026-08" />);
            expect(cell('2026-08-10')).toHaveAttribute('aria-selected', 'true');
            expect(cell('2026-08-11')).not.toHaveAttribute('aria-selected');
        });

        it('受控 value 驱动选中态', () => {
            const { rerender } = render(<Calendar value="2026-08-10" panelValue="2026-08" />);
            expect(cell('2026-08-10')).toHaveAttribute('aria-selected', 'true');
            rerender(<Calendar value="2026-08-20" panelValue="2026-08" />);
            expect(cell('2026-08-20')).toHaveAttribute('aria-selected', 'true');
            expect(cell('2026-08-10')).not.toHaveAttribute('aria-selected');
        });

        it('面板按自身宽度推导缩放系数，事项条随之定位', () => {
            // 7/26 是视图第一格：top = 表头 + 0 × 单元格 + 日期数字带
            const { container } = render(
                <Calendar panelValue="2026-08" width={750} events={[{ title: '晨会', start: '2026-07-26' }]} />
            );
            const root = container.firstElementChild as HTMLElement;
            // 750 正好是基准宽度，系数为 1；top = 表头 32 + 周序 0 + 数字带 38 + 半行 11
            expect(root.style.getPropertyValue('--animal-calendar-scale')).toBe('1');
            expect(
                (container.querySelector('[data-color]') as HTMLElement).style.getPropertyValue(
                    '--animal-calendar-bar-top'
                )
            ).toBe('81px');
        });

        it('系数随宽度线性放大，并被上下限夹住', () => {
            const { container, rerender } = render(<Calendar panelValue="2026-08" width={1125} />);
            const root = container.firstElementChild as HTMLElement;
            expect(root.style.getPropertyValue('--animal-calendar-scale')).toBe('1.5');

            rerender(<Calendar panelValue="2026-08" width={320} />);
            expect(root.style.getPropertyValue('--animal-calendar-scale')).toBe('0.6');

            rerender(<Calendar panelValue="2026-08" width={4000} />);
            expect(root.style.getPropertyValue('--animal-calendar-scale')).toBe('2');
        });

        it('同一周的第 2 条事项仍落在单元格内，不压到下一周', () => {
            // 回归：日期数字带 + 2 条事项行必须塞得进单元格（38 + 22 × 2 = 82 ≤ 104），
            // 否则第 2 行事项条会盖住下一周的日期数字
            render(
                <Calendar
                    panelValue="2026-08"
                    width={750}
                    events={[
                        { title: 'A', start: '2026-08-03' },
                        { title: 'B', start: '2026-08-03' },
                    ]}
                />
            );
            const tops = [...document.querySelectorAll('[data-color]')].map((bar) =>
                Number.parseFloat((bar as HTMLElement).style.getPropertyValue('--animal-calendar-bar-top'))
            );
            // 8/3 落在视图第 2 周：top = 表头 32 + 1 × 104 + 数字带 38 + (行序 + 0.5) × 22
            expect(tops).toEqual([185, 207]);
            // 最后一条的条底（top + 半行 + 半个条高）仍在单元格高 104 之内
            const lastRowBottom = 32 + 1 * 104 + 38 + 1.5 * 22 + 17 / 2;
            expect(lastRowBottom).toBeLessThan(32 + 2 * 104);
        });

        it('width 设面板宽度，且不覆盖调用方传入的 style.width', () => {
            const { container, rerender } = render(<Calendar panelValue="2026-08" width={900} />);
            expect(container.firstElementChild).toHaveStyle({ width: '900px' });

            rerender(<Calendar panelValue="2026-08" width={900} style={{ width: 600 }} />);
            expect(container.firstElementChild).toHaveStyle({ width: '600px' });
        });

        it('头部常显：年月标签、年/月箭头与「今天」都在', () => {
            render(<Calendar panelValue="2026-08" />);
            expect(screen.getByText('2026年8月')).toBeInTheDocument();
            expect(screen.getByLabelText('上一年')).toBeInTheDocument();
            expect(screen.getByLabelText('上个月')).toBeInTheDocument();
            expect(screen.getByLabelText('下个月')).toBeInTheDocument();
            expect(screen.getByLabelText('下一年')).toBeInTheDocument();
            expect(screen.getByText('今天')).toBeInTheDocument();
        });
    });

    describe('events', () => {
        it('同日事项渲染在对应单元格上方', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[
                        { title: '晨会', start: '2026-08-10' },
                        { title: '评审', start: '2026-08-10' },
                    ]}
                />
            );
            expect(screen.getByText('晨会')).toBeInTheDocument();
            expect(screen.getByText('评审')).toBeInTheDocument();
            expect(cell('2026-08-10')).toHaveAttribute('aria-label', '2026-08-10 2 项事项');
        });

        it('跨日期事项渲染成横跨多列的连续条', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[{ title: '海岛团建', start: '2026-08-12', end: '2026-08-18', color: 'amber' }]}
                />
            );
            // 8/12（周三）起，先跨到当周周六，共 4 格
            const bar = screen.getAllByText('海岛团建')[0];
            expect(bar).toHaveAttribute('data-color', 'amber');
            expect(bar).toHaveAttribute('data-span', 'true');
            // 8/12（周三）落在第 4 列，跨 4 列
            expect(bar.style.getPropertyValue('--animal-calendar-bar-left')).toBe('calc((100% / 7) * 3 + 4px)');
            expect(bar.style.getPropertyValue('--animal-calendar-bar-width')).toBe('calc((100% / 7) * 4 - 8px)');
        });

        it('跨日期条在周与周之间自行分段并各自收尾', () => {
            render(
                <Calendar panelValue="2026-08" events={[{ title: '长假', start: '2026-08-05', end: '2026-08-18' }]} />
            );
            const bars = Array.from(document.querySelectorAll('[data-span="true"]')) as HTMLElement[];
            // 8/5（周三）-8/8 收尾、8/9-8/15 整周、8/16-8/18 续接
            expect(bars).toHaveLength(3);
            expect(bars[0]).toHaveAttribute('data-end', 'true');
            expect(bars[0].style.getPropertyValue('--animal-calendar-bar-width')).toBe('calc((100% / 7) * 4 - 8px)');
            expect(bars[1]).toHaveAttribute('data-start', 'true');
            expect(bars[1]).toHaveAttribute('data-end', 'true');
            expect(bars[1].style.getPropertyValue('--animal-calendar-bar-left')).toBe('calc((100% / 7) * 0 + 4px)');
            expect(bars[1].style.getPropertyValue('--animal-calendar-bar-width')).toBe('calc((100% / 7) * 7 - 8px)');
            expect(bars[2]).toHaveAttribute('data-start', 'true');
            expect(bars[2].style.getPropertyValue('--animal-calendar-bar-width')).toBe('calc((100% / 7) * 3 - 8px)');
        });

        it('整周事项从周日铺到周六，两侧不留接缝', () => {
            render(
                <Calendar panelValue="2026-08" events={[{ title: '整周', start: '2026-08-09', end: '2026-08-15' }]} />
            );
            const bar = screen.getByText('整周');
            expect(bar.style.getPropertyValue('--animal-calendar-bar-width')).toBe('calc((100% / 7) * 7 - 8px)');
            expect(bar).toHaveAttribute('data-start', 'true');
            expect(bar).toHaveAttribute('data-end', 'true');
        });

        it('同一天事项超过 2 条时折叠成 +N', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[
                        { title: 'A', start: '2026-08-13' },
                        { title: 'B', start: '2026-08-13' },
                        { title: 'C', start: '2026-08-13' },
                        { title: 'D', start: '2026-08-13' },
                    ]}
                />
            );
            expect(cell('2026-08-13').textContent).toContain('+2');
            expect(cell('2026-08-13')).toHaveAttribute('aria-label', '2026-08-13 4 项事项');
        });

        it('showTime 的事项展示起始时间', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[{ title: '晨会', start: '2026-08-10 09:30', showTime: true }]}
                />
            );
            expect(screen.getByText('09:30')).toBeInTheDocument();
            expect(screen.getByText('晨会')).toBeInTheDocument();
        });

        it('showTime 设为 false 时只展示标题', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    showEventTime={false}
                    events={[{ title: '晨会', start: '2026-08-10 09:30', showTime: true }]}
                />
            );
            expect(screen.queryByText('09:30')).not.toBeInTheDocument();
            expect(screen.getByText('晨会')).toBeInTheDocument();
        });

        it('跨周事项只在首段展示时间，续接段只保留标题', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[{ title: '团建', start: '2026-08-05 08:00', end: '2026-08-18', showTime: true }]}
                />
            );
            const bars = Array.from(document.querySelectorAll('[data-span="true"]')).filter((node) =>
                node.classList.contains(styles.event)
            ) as HTMLElement[];
            expect(bars).toHaveLength(3);
            // 三个片段里只有首段带时间，续接段只保留标题
            const times = bars.flatMap((bar) =>
                Array.from(bar.querySelectorAll('span')).filter((span) => /^\d{2}:\d{2}$/.test(span.textContent ?? ''))
            );
            expect(times).toHaveLength(1);
            expect(times[0].textContent).toBe('08:00');
            expect(bars[0].textContent).toBe('08:00团建');
            expect(bars[1].textContent).toBe('团建');
            expect(bars[2].textContent).toBe('团建');
        });

        it('跨天事项不让同周日期整行折叠', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[
                        { title: '团建', start: '2026-08-12', end: '2026-08-18' },
                        { title: '晨会', start: '2026-08-13' },
                    ]}
                />
            );
            // 团建占第 0 行，晨会因此落在第 1 行而不是被折叠
            expect(screen.getByText('晨会')).toBeInTheDocument();
            expect(cell('2026-08-13').textContent).not.toContain('+');
        });
    });

    describe('interaction', () => {
        it('点击日期触发 onChange（非受控内部同步选中态）', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<Calendar panelValue="2026-08" onChange={onChange} />);
            await user.click(cell('2026-08-10'));
            expect(onChange).toHaveBeenCalledWith('2026-08-10');
            expect(cell('2026-08-10')).toHaveAttribute('aria-selected', 'true');
        });

        it('受控模式由父级回写 value', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(
                <ControlledHost<string, string> initial="2026-08-10" onChange={onChange}>
                    {({ value, onChange: setValue }) => (
                        <Calendar value={value} panelValue="2026-08" onChange={setValue} />
                    )}
                </ControlledHost>
            );
            await user.click(cell('2026-08-20'));
            expect(onChange).toHaveBeenCalledWith('2026-08-20');
            expect(cell('2026-08-20')).toHaveAttribute('aria-selected', 'true');
        });

        it('点击「今天」选中今天并跳转到今天所在月（非受控面板）', async () => {
            const user = setup();
            const onChange = vi.fn();
            const today = dayjs();
            render(<Calendar defaultPanelValue="2020-01" onChange={onChange} />);
            await user.click(screen.getByText('今天'));
            expect(onChange).toHaveBeenCalledWith(today.format('YYYY-MM-DD'));
            expect(screen.getByText(`${today.year()}年${today.month() + 1}月`)).toBeInTheDocument();
            expect(cell(today.format('YYYY-MM-DD'))).toHaveAttribute('aria-selected', 'true');
        });

        it('非受控面板自己翻月（上/下月与上/下年）', async () => {
            // 回归：goToMonth 曾在受控分支才写内部状态，导致不传 panelValue 时箭头点不动
            const user = setup();
            render(<Calendar defaultPanelValue="2026-08" defaultValue="2026-08-10" />);

            await user.click(screen.getByLabelText('下个月'));
            expect(screen.getByText('2026年9月')).toBeInTheDocument();

            await user.click(screen.getByLabelText('下一年'));
            expect(screen.getByText('2027年9月')).toBeInTheDocument();

            await user.click(screen.getByLabelText('上个月'));
            expect(screen.getByText('2027年8月')).toBeInTheDocument();

            await user.click(screen.getByLabelText('上一年'));
            expect(screen.getByText('2026年8月')).toBeInTheDocument();
        });

        it('受控面板下「今天」只更新 value，面板月份由父级决定', async () => {
            const user = setup();
            const onPanelChange = vi.fn();
            render(<Calendar panelValue="2020-01" onPanelChange={onPanelChange} />);
            await user.click(screen.getByText('今天'));
            expect(onPanelChange).toHaveBeenCalledWith(dayjs().format('YYYY-MM'));
            // 受控面板不会被内部状态改写
            expect(screen.getByText('2020年1月')).toBeInTheDocument();
        });

        it('点击上/下月与上/下年切换面板并回调 onPanelChange', async () => {
            const user = setup();
            const onPanelChange = vi.fn();
            render(
                <ControlledHost<string, string> initial="2026-08" onChange={onPanelChange}>
                    {({ value, onChange: setValue }) => <Calendar panelValue={value} onPanelChange={setValue} />}
                </ControlledHost>
            );

            await user.click(screen.getByLabelText('下个月'));
            expect(onPanelChange).toHaveBeenLastCalledWith('2026-09');
            expect(screen.getByText('2026年9月')).toBeInTheDocument();

            await user.click(screen.getByLabelText('上个月'));
            expect(screen.getByText('2026年8月')).toBeInTheDocument();

            await user.click(screen.getByLabelText('下一年'));
            expect(onPanelChange).toHaveBeenLastCalledWith('2027-08');
            expect(screen.getByText('2027年8月')).toBeInTheDocument();

            await user.click(screen.getByLabelText('上一年'));
            expect(screen.getByText('2026年8月')).toBeInTheDocument();
        });

        it('受控面板下点击日期会请求切换面板月份', async () => {
            const user = setup();
            const onPanelChange = vi.fn();
            render(<Calendar panelValue="2026-08" onPanelChange={onPanelChange} />);
            // 8 月视图的收尾格属于 9 月
            await user.click(cell('2026-09-01'));
            expect(onPanelChange).toHaveBeenCalledWith('2026-09');
        });
    });

    describe('keyboard', () => {
        it('只有一个日期格可 Tab 到达（roving tabindex）', () => {
            render(<Calendar panelValue="2026-08" defaultValue="2026-08-10" />);
            expect(document.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
            expect(cell('2026-08-10')).toHaveAttribute('tabindex', '0');
        });

        it('方向键移动光标并同步选中可聚焦态', async () => {
            const user = setup();
            render(<Calendar panelValue="2026-08" defaultValue="2026-08-10" />);
            cell('2026-08-10').focus();

            await user.keyboard('{ArrowRight}');
            expect(cell('2026-08-11')).toHaveAttribute('tabindex', '0');
            await user.keyboard('{ArrowDown}');
            expect(cell('2026-08-18')).toHaveAttribute('tabindex', '0');
            await user.keyboard('{ArrowUp}');
            expect(cell('2026-08-11')).toHaveAttribute('tabindex', '0');
            await user.keyboard('{ArrowLeft}');
            expect(cell('2026-08-10')).toHaveAttribute('tabindex', '0');
        });

        it('方向键移动后 DOM 焦点跟着走，Enter 选中新光标所在日期', async () => {
            // 回归：此前只改 tabIndex 不搬焦点，第二次 Enter 会落在旧格子上
            const user = setup();
            const onChange = vi.fn();
            render(<Calendar panelValue="2026-08" defaultValue="2026-08-10" onChange={onChange} />);
            cell('2026-08-10').focus();

            await user.keyboard('{ArrowRight}');
            expect(document.activeElement).toBe(cell('2026-08-11'));

            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenLastCalledWith('2026-08-11');

            await user.keyboard('{ArrowDown}');
            expect(document.activeElement).toBe(cell('2026-08-18'));
            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenLastCalledWith('2026-08-18');
        });

        it('Enter / 空格选中当前光标日期，且每次按键只回调一次', async () => {
            // 回归：格子与容器的 keydown 曾各触发一次选中
            const user = setup();
            const onChange = vi.fn();
            render(<Calendar panelValue="2026-08" defaultValue="2026-08-10" onChange={onChange} />);
            cell('2026-08-10').focus();

            await user.keyboard('{ArrowRight}');
            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenLastCalledWith('2026-08-11');

            await user.keyboard('{ArrowRight}');
            await user.keyboard(' ');
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenLastCalledWith('2026-08-12');
        });

        it('月内移动光标不翻月', async () => {
            // 回归：此前比较格子下标，几乎每次方向键都会触发 onPanelChange
            const user = setup();
            const onPanelChange = vi.fn();
            render(<Calendar panelValue="2026-08" defaultValue="2026-08-10" onPanelChange={onPanelChange} />);
            cell('2026-08-10').focus();

            await user.keyboard('{ArrowRight}');
            await user.keyboard('{ArrowDown}');
            await user.keyboard('{ArrowLeft}');
            expect(onPanelChange).not.toHaveBeenCalled();
        });

        it('光标跨到别月时面板跟随翻月', async () => {
            const user = setup();
            const onPanelChange = vi.fn();
            render(<Calendar panelValue="2026-08" defaultValue="2026-08-31" onPanelChange={onPanelChange} />);
            cell('2026-08-31').focus();

            await user.keyboard('{ArrowRight}');
            expect(onPanelChange).toHaveBeenCalledWith('2026-09');
        });

        it('PageUp / PageDown 翻月', async () => {
            const user = setup();
            const onPanelChange = vi.fn();
            render(
                <ControlledHost<string, string> initial="2026-08" onChange={onPanelChange}>
                    {({ value, onChange: setValue }) => <Calendar panelValue={value} onPanelChange={setValue} />}
                </ControlledHost>
            );
            cell('2026-08-10').focus();

            await user.keyboard('{PageDown}');
            expect(screen.getByText('2026年9月')).toBeInTheDocument();
            await user.keyboard('{PageUp}');
            expect(screen.getByText('2026年8月')).toBeInTheDocument();
            expect(onPanelChange).toHaveBeenLastCalledWith('2026-08');
        });
    });

    describe('drag to create', () => {
        it('默认关闭拖拽：按下并跨格不会创建事项', async () => {
            const user = setup();
            const onEventCreate = vi.fn();
            render(<Calendar panelValue="2026-08" onEventCreate={onEventCreate} />);
            await drag(user, '2026-08-10', '2026-08-13');
            expect(onEventCreate).not.toHaveBeenCalled();
        });

        it('开启 draggableEvents 后跨格拖拽回调起止日期', async () => {
            const user = setup();
            const onEventCreate = vi.fn();
            render(<Calendar panelValue="2026-08" draggableEvents onEventCreate={onEventCreate} />);
            await drag(user, '2026-08-10', '2026-08-12');
            expect(onEventCreate).toHaveBeenCalledWith('2026-08-10', '2026-08-12');
        });

        it('反向拖拽按时间先后输出起止日期', async () => {
            const user = setup();
            const onEventCreate = vi.fn();
            render(<Calendar panelValue="2026-08" draggableEvents onEventCreate={onEventCreate} />);
            await drag(user, '2026-08-14', '2026-08-11');
            expect(onEventCreate).toHaveBeenCalledWith('2026-08-11', '2026-08-14');
        });

        it('拖拽预览渲染为虚线事项条', async () => {
            const user = setup();
            render(<Calendar panelValue="2026-08" draggableEvents />);
            await user.pointer([{ target: cell('2026-08-10'), keys: '[MouseLeft>]' }, { target: cell('2026-08-12') }]);
            expect(document.querySelector('[data-preview="true"]')).toBeInTheDocument();
        });

        it('单击不创建事项，只切换选中', async () => {
            const user = setup();
            const onEventCreate = vi.fn();
            const onChange = vi.fn();
            render(<Calendar panelValue="2026-08" draggableEvents onEventCreate={onEventCreate} onChange={onChange} />);
            await user.click(cell('2026-08-10'));
            expect(onEventCreate).not.toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('2026-08-10');
        });

        it('视图外的事项不参与渲染，也不计入 +N 与格子提示', () => {
            render(
                <Calendar
                    panelValue="2026-08"
                    events={[
                        { title: '上季度总结', start: '2026-05-04', end: '2026-05-06' },
                        { title: '下季度规划', start: '2026-11-02' },
                        { title: '跨过整月', start: '2026-07-01', end: '2026-09-30' },
                    ]}
                />
            );
            expect(screen.queryByText('上季度总结')).not.toBeInTheDocument();
            expect(screen.queryByText('下季度规划')).not.toBeInTheDocument();
            // 跨过整月的事项在视图内可见，且首格提示只算它一条
            expect(screen.getAllByText('跨过整月')).toHaveLength(6);
            expect(cell('2026-07-26')).toHaveAttribute('aria-label', '2026-07-26 1 项事项');
            expect(cell('2026-07-26').textContent).not.toContain('+');
        });

        it('非法的 start 回退到今天，不会崩溃（今天不在 8 月视图内则不渲染）', () => {
            render(<Calendar panelValue="2026-08" events={[{ title: '坏数据', start: 'not-a-date' }]} />);
            expect(screen.getByRole('grid')).toBeInTheDocument();
            expect(screen.queryByText('坏数据')).not.toBeInTheDocument();
        });
    });
});
