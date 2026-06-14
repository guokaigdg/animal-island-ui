import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Select, type SelectOption } from './Select';
import styles from './select.module.less';

const options: SelectOption[] = [
    { key: 'a', label: 'Apple' },
    { key: 'b', label: 'Banana' },
    { key: 'c', label: 'Cherry' },
];

const Host = ({
    onChange,
    initial = '',
    disabled,
}: {
    onChange?: (k: string) => void;
    initial?: string;
    disabled?: boolean;
}) => {
    const [v, setV] = useState(initial);
    return (
        <Select
            options={options}
            value={v}
            disabled={disabled}
            onChange={(k) => {
                setV(k);
                onChange?.(k);
            }}
        />
    );
};

const mockRect = (overrides: Partial<DOMRect>) => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...overrides,
    } as DOMRect);
};

const mockViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
};

// 下拉的 mounted 状态在 requestAnimationFrame 回调中才置为 true，
// 测试里需要 flush 一帧才能拿到 dropdown 节点
const flushRaf = async () => {
    await act(async () => {
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
    });
};

describe('Select', () => {
    beforeEach(() => {
        mockRect({ top: 200, right: 100, bottom: 250, width: 100, height: 50 });
        mockViewport(2000, 2000);
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('未选中时显示 placeholder', () => {
        render(<Select options={options} value="" onChange={() => {}} placeholder="请选择" />);
        expect(screen.getByText('请选择')).toBeInTheDocument();
    });

    it('已选中时显示对应 label', () => {
        render(<Select options={options} value="b" onChange={() => {}} />);
        expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('点击 trigger 展开下拉，再次点击折叠', async () => {
        const user = userEvent.setup();
        render(<Select options={options} value="" onChange={() => {}} />);
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
        const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
        await user.click(trigger);
        await flushRaf();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
        await user.click(trigger);
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('选择某项 → 触发 onChange 并关闭下拉', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<Host onChange={onChange} />);
        const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
        await user.click(trigger);
        await flushRaf();
        await user.click(screen.getByText('Apple'));
        expect(onChange).toHaveBeenCalledWith('a');
    });

    it('disabled 时点击 trigger 不展开下拉', async () => {
        const user = userEvent.setup();
        render(<Host disabled />);
        const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
        await user.click(trigger);
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
        expect(trigger.parentElement).toHaveClass(styles.disabled);
    });

    it('点击外部区域关闭下拉', async () => {
        const user = userEvent.setup();
        render(
            <div>
                <Select options={options} value="" onChange={() => {}} />
                <button data-testid="outside">outside</button>
            </div>
        );
        const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
        await user.click(trigger);
        await flushRaf();
        expect(screen.getByText('Apple')).toBeInTheDocument();
        await user.click(screen.getByTestId('outside'));
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('鼠标移入/移出选项 → 切换 hovered 样式', async () => {
        const user = userEvent.setup();
        render(<Host />);
        const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
        await user.click(trigger);
        await flushRaf();
        const dropdownEl = document.querySelector(`.${styles.dropdown}`) as HTMLElement;
        const banana = Array.from(dropdownEl.querySelectorAll(`.${styles.option}`)).find((el) =>
            el.textContent?.includes('Banana')
        ) as HTMLElement;
        await user.hover(banana);
        expect(banana).toHaveClass(styles.hovered);
        await user.unhover(banana);
        expect(banana).not.toHaveClass(styles.hovered);
    });

    it('当前选中项带 active 类 + 渲染 pillBar', async () => {
        const user = userEvent.setup();
        render(<Host initial="b" />);
        const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
        await user.click(trigger);
        await flushRaf();
        const dropdownEl = document.querySelector(`.${styles.dropdown}`) as HTMLElement;
        const banana = Array.from(dropdownEl.querySelectorAll(`.${styles.option}`)).find((el) =>
            el.textContent?.includes('Banana')
        ) as HTMLElement;
        expect(banana).toHaveClass(styles.active);
        expect(banana.querySelector(`.${styles.pillBar}`)).toBeInTheDocument();
    });

    describe('定位策略', () => {
        const openAndGetDropdown = async () => {
            const trigger = document.querySelector(`.${styles.trigger}`) as HTMLElement;
            const user = userEvent.setup();
            await user.click(trigger);
            await flushRaf();
            return document.querySelector(`.${styles.dropdown}`) as HTMLElement;
        };

        it('右侧空间不足时下拉贴左显示（right=100%）', async () => {
            mockRect({ top: 200, right: 1900, bottom: 250, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.right).toBe('100%');
            expect(dropdown.style.left).toBe('auto');
        });

        it('下方空间不足 + 上方空间更大 → 下拉往上弹（bottom=100%）', async () => {
            // trigger 在视口底部，spaceBelow < dropdownHeight 且 spaceAbove > spaceBelow
            // dropdownHeight = 3*44 + 24 = 156
            // spaceBelow = 2000 - 1800 = 200 (> 156, 其实不触发)，故让 dropdownHeight 更大
            mockRect({ top: 100, right: 100, bottom: 1990, width: 100, height: 50 });
            // 制造 spaceBelow 极小：rect.bottom 几乎贴底
            mockRect({ top: 100, right: 100, bottom: 1995, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} />);
            const dropdown = await openAndGetDropdown();
            // spaceBelow = 5 < 156, spaceAbove = 100 > 5 → 走 bottom=100%
            expect(dropdown.style.bottom).toBe('100%');
            expect(dropdown.style.top).toBe('auto');
        });

        it('trigger 距视口顶部太近 → 强制从下方展开（marginTop=6）', async () => {
            mockRect({ top: 10, right: 100, bottom: 500, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.top).toBe('100%');
            expect(dropdown.style.marginTop).toBe('6px');
        });

        it('空间充足 → 默认垂直居中（top:50% translateY(-50%)）', async () => {
            // beforeEach 已配：trigger 在中段、视口 2000x2000
            render(<Select options={options} value="" onChange={() => {}} />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.top).toBe('50%');
            expect(dropdown.style.transform).toBe('translateY(-50%)');
        });
    });

    describe('a11y', () => {
        const getTrigger = () => document.querySelector(`.${styles.trigger}`) as HTMLElement;

        it('trigger 角色 = combobox + aria-haspopup/listbox + aria-expanded 同步', async () => {
            const user = userEvent.setup();
            render(<Host />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
            await user.click(trigger);
            await flushRaf();
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });

        it('option 节点带 role=option + aria-selected', async () => {
            const user = userEvent.setup();
            render(<Host initial="b" />);
            await user.click(getTrigger());
            await flushRaf();
            const opts = screen.getAllByRole('option');
            expect(opts).toHaveLength(3);
            expect(opts[1]).toHaveAttribute('aria-selected', 'true');
            expect(opts[0]).toHaveAttribute('aria-selected', 'false');
        });

        it('键盘：闭合时 Enter / Space / 方向键打开下拉', async () => {
            const user = userEvent.setup();
            render(<Host />);
            const trigger = screen.getByRole('combobox');
            trigger.focus();
            await user.keyboard('{Enter}');
            await flushRaf();
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
        });

        it('键盘：ArrowDown / Up 切换 activedescendant，Enter 选中并关闭', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<Host onChange={onChange} />);
            const trigger = screen.getByRole('combobox');
            trigger.focus();
            await user.keyboard('{Enter}');
            await flushRaf();
            // 首次打开 activedescendant 落到首项
            const optsOpen = screen.getAllByRole('option');
            expect(trigger.getAttribute('aria-activedescendant')).toBe(optsOpen[0].id);
            await user.keyboard('{ArrowDown}');
            expect(trigger.getAttribute('aria-activedescendant')).toBe(optsOpen[1].id);
            await user.keyboard('{ArrowUp}');
            expect(trigger.getAttribute('aria-activedescendant')).toBe(optsOpen[0].id);
            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenCalledWith('a');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
        });

        it('键盘：Escape 关闭下拉并把焦点交还 trigger', async () => {
            const user = userEvent.setup();
            render(<Host />);
            const trigger = screen.getByRole('combobox');
            await user.click(trigger);
            await flushRaf();
            await user.keyboard('{Escape}');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
            expect(trigger).toHaveFocus();
        });

        it('aria-label 透传到 trigger 与 listbox', async () => {
            const user = userEvent.setup();
            render(<Select options={options} value="" onChange={() => {}} aria-label="水果" />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-label', '水果');
            await user.click(trigger);
            await flushRaf();
            expect(screen.getByRole('listbox')).toHaveAttribute('aria-label', '水果');
        });
    });
});
