import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { Select, type SelectOption } from './Select';
import styles from './select.module.less';

// 清除按钮仅悬停时显示：把指针悬停到 Select 外壳以触发显示
const hoverSelect = () => {
    fireEvent.mouseEnter(document.querySelector(`.${styles.wrapper}`) as HTMLElement);
};

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
        const weightBefore = getComputedStyle(banana).fontWeight;
        await user.hover(banana);
        const weightAfter = getComputedStyle(banana).fontWeight;
        expect(weightAfter).toBe('700');
        expect(weightBefore).not.toBe(weightAfter);
        await user.unhover(banana);
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

        it('default：默认在触发区正下方居中展开，宽度按内容自适应', async () => {
            render(<Select options={options} value="" onChange={() => {}} />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.top).toBe('100%');
            expect(dropdown.style.marginTop).toBe('6px');
            expect(dropdown.style.left).toBe('50%');
            expect(dropdown.style.transform).toBe('translateX(-50%)');
            expect(dropdown.style.minWidth).toBe('');
        });

        it('default：下方空间不足且上方更宽裕时翻到正上方', async () => {
            // trigger 贴着视口底部：spaceBelow = 5 < 156，spaceAbove = 1900 > 5
            mockRect({ top: 1900, right: 100, bottom: 1995, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.bottom).toBe('100%');
            expect(dropdown.style.top).toBe('auto');
            expect(dropdown.style.marginBottom).toBe('6px');
        });

        it('game：空间充足时贴在触发区右侧并垂直居中', async () => {
            // beforeEach 已配：trigger 在中段、视口 2000x2000
            render(<Select options={options} value="" onChange={() => {}} variant="game" />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.left).toBe('100%');
            expect(dropdown.style.top).toBe('50%');
            expect(dropdown.style.transform).toBe('translateY(-50%)');
        });

        it('game：右侧空间不足时下拉贴左显示（right=100%）', async () => {
            mockRect({ top: 200, right: 1900, bottom: 250, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} variant="game" />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.right).toBe('100%');
            expect(dropdown.style.left).toBe('auto');
        });

        it('game：下方空间不足 + 上方空间更大 → 下拉往上弹（bottom=100%）', async () => {
            // trigger 在视口底部，spaceBelow < dropdownHeight 且 spaceAbove > spaceBelow
            // dropdownHeight = 3*44 + 24 = 156
            mockRect({ top: 1900, right: 100, bottom: 1995, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} variant="game" />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.bottom).toBe('100%');
            expect(dropdown.style.top).toBe('auto');
        });

        it('game：trigger 距视口顶部太近 → 强制从下方展开（marginTop=6）', async () => {
            mockRect({ top: 10, right: 100, bottom: 500, width: 100, height: 50 });
            mockViewport(2000, 2000);
            render(<Select options={options} value="" onChange={() => {}} variant="game" />);
            const dropdown = await openAndGetDropdown();
            expect(dropdown.style.top).toBe('100%');
            expect(dropdown.style.marginTop).toBe('6px');
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
            // a11y 契约：aria-label 透传到 trigger 后，可被 toHaveAccessibleName 识别
            expect(trigger).toHaveAccessibleName('水果');
            await user.click(trigger);
            await flushRaf();
            // a11y 契约：aria-label 同时透传到 listbox，屏幕阅读器可读出名字
            expect(screen.getByRole('listbox')).toHaveAccessibleName('水果');
        });
    });

    describe('allowClear', () => {
        it('有值时渲染清除按钮，点击后触发 onChange("") 与 onClear', async () => {
            const user = userEvent.setup();
            const calls: string[] = [];
            render(
                <Select
                    options={options}
                    value="b"
                    onChange={() => calls.push('change')}
                    onClear={() => calls.push('clear')}
                    allowClear
                />
            );
            hoverSelect();
            await user.click(screen.getByRole('button', { name: '清除' }));
            expect(calls).toEqual(['change', 'clear']);
        });

        it('allowClear 默认关闭', () => {
            render(<Select options={options} value="b" onChange={() => {}} />);
            expect(screen.queryByRole('button', { name: '清除' })).not.toBeInTheDocument();
        });

        it('值为空或 disabled 时不渲染清除按钮', () => {
            const { rerender } = render(<Select options={options} value="" onChange={() => {}} allowClear />);
            expect(screen.queryByRole('button', { name: '清除' })).not.toBeInTheDocument();
            rerender(<Select options={options} value="b" onChange={() => {}} allowClear disabled />);
            expect(screen.queryByRole('button', { name: '清除' })).not.toBeInTheDocument();
        });

        it('clearAriaLabel 可自定义', () => {
            render(<Select options={options} value="b" onChange={() => {}} allowClear clearAriaLabel="Clear fruit" />);
            hoverSelect();
            expect(screen.getByRole('button', { name: 'Clear fruit' })).toBeInTheDocument();
        });

        it('点击清除不会展开下拉', async () => {
            const user = userEvent.setup();
            render(<Select options={options} value="b" onChange={() => {}} allowClear />);
            hoverSelect();
            await user.click(screen.getByRole('button', { name: '清除' }));
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });

        it('清除按钮可用键盘 Enter 触发（不被外层按键处理抢走）', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<Select options={options} value="b" onChange={onChange} allowClear />);
            hoverSelect();
            screen.getByRole('button', { name: '清除' }).focus();
            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenCalledWith('');
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });

        it('清除后焦点落到 trigger：清除按钮随值清空而卸载，键盘用户不该掉焦点', async () => {
            const user = userEvent.setup();
            const ClearHost = () => {
                const [v, setV] = useState('b');
                return <Select options={options} value={v} onChange={setV} allowClear />;
            };
            render(<ClearHost />);
            hoverSelect();
            screen.getByRole('button', { name: '清除' }).focus();
            await user.keyboard('{Enter}');
            // 值已清空 → 按钮卸载
            expect(screen.queryByRole('button', { name: '清除' })).not.toBeInTheDocument();
            expect(document.querySelector(`.${styles.trigger}`)).toHaveFocus();
        });

        it('选中回显后鼠标移开，清除按钮仍然消失（焦点被交回 trigger，不应让它常驻）', async () => {
            const user = userEvent.setup();
            const Host = () => {
                const [v, setV] = useState('');
                return <Select options={options} value={v} onChange={setV} allowClear />;
            };
            render(<Host />);
            await user.click(document.querySelector(`.${styles.trigger}`) as HTMLElement);
            await flushRaf();
            await user.click(screen.getAllByRole('option')[1]);
            // 选中后 handleSelect 会把焦点交回 trigger，此刻悬停仍在 → 按钮可见
            expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument();
            fireEvent.mouseLeave(document.querySelector(`.${styles.wrapper}`) as HTMLElement);
            expect(screen.queryByRole('button', { name: '清除' })).not.toBeInTheDocument();
        });
    });

    describe('showSearch', () => {
        type SearchHostProps = {
            onChange?: (k: string) => void;
            onSearch?: (v: string) => void;
            initial?: string;
            disabled?: boolean;
            allowClear?: boolean;
            optionFilterProp?: 'key' | 'label';
            filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean);
            notFoundContent?: ReactNode;
            items?: SelectOption[];
            'aria-label'?: string;
        };

        const SearchHost = ({
            onChange,
            onSearch,
            initial = '',
            disabled,
            items = options,
            ...rest
        }: SearchHostProps) => {
            const [v, setV] = useState(initial);
            return (
                <Select
                    options={items}
                    value={v}
                    disabled={disabled}
                    showSearch
                    onSearch={onSearch}
                    onChange={(k) => {
                        setV(k);
                        onChange?.(k);
                    }}
                    {...rest}
                />
            );
        };

        const codedOptions: SelectOption[] = [
            { key: 'zh', label: '简体中文' },
            { key: 'en', label: 'English' },
            { key: 'ja', label: '日本語' },
        ];

        const getInput = () => screen.getByRole('combobox') as HTMLInputElement;

        // 用键盘展开，避免 userEvent.click 的开关语义干扰（点输入框不收起的用例单独覆盖）
        const openSearch = async () => {
            const user = userEvent.setup();
            getInput().focus();
            await user.keyboard('{ArrowDown}');
            await flushRaf();
            return user;
        };

        // 跳过 click：真实流程是「先展开、再打字」，多出来的这次 click 会把展开时选中的文本塌缩成光标，
        // 从而让「直接输入即可替换 label」变成追加。点击输入框本身的行为由专门的用例覆盖。
        const typeSearch = (user: ReturnType<typeof userEvent.setup>, text: string) =>
            user.type(getInput(), text, { skipClick: true });

        const visibleOptions = () => screen.queryAllByRole('option').map((el) => el.textContent);

        it('role=combobox 落在 input 上，trigger 不再是 combobox', async () => {
            render(<SearchHost aria-label="水果" />);
            const input = getInput();
            expect(input.tagName).toBe('INPUT');
            expect(input).toHaveAttribute('aria-haspopup', 'listbox');
            expect(input).toHaveAttribute('aria-expanded', 'false');
            expect(input).toHaveAccessibleName('水果');
            expect(document.querySelector(`.${styles.trigger}`)).not.toHaveAttribute('role');
            await openSearch();
            expect(input).toHaveAttribute('aria-expanded', 'true');
            expect(input.getAttribute('aria-controls')).toBe(screen.getByRole('listbox').id);
        });

        it('展开时输入框获得焦点', async () => {
            render(<SearchHost />);
            await openSearch();
            expect(getInput()).toHaveFocus();
        });

        it('默认按 label 做大小写不敏感的子串匹配', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            await typeSearch(user, 'an');
            expect(visibleOptions()).toHaveLength(1);
            expect(screen.getByRole('option')).toHaveTextContent('Banana');
        });

        it('匹配大小写不敏感', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            await typeSearch(user, 'CHERRY');
            expect(visibleOptions()).toHaveLength(1);
            expect(screen.getByRole('option')).toHaveTextContent('Cherry');
        });

        it('optionFilterProp="key" 时改为按 key 过滤', async () => {
            render(<SearchHost items={codedOptions} optionFilterProp="key" />);
            const user = await openSearch();
            await typeSearch(user, 'zh');
            expect(visibleOptions()).toHaveLength(1);
            expect(screen.getByRole('option')).toHaveTextContent('简体中文');
        });

        it('optionFilterProp 默认 label：key 命中而 label 不命中时应搜不到', async () => {
            render(<SearchHost items={codedOptions} />);
            const user = await openSearch();
            await typeSearch(user, 'zh');
            expect(screen.queryByRole('option', { name: '简体中文' })).not.toBeInTheDocument();
            // 空态渲染成 aria-disabled 的 option，listbox 才能满足 aria-required-children
            const empty = screen.getByRole('option');
            expect(empty).toHaveTextContent('暂无数据');
            expect(empty).toHaveAttribute('aria-disabled', 'true');
        });

        it('filterOption=false 时不过滤', async () => {
            render(<SearchHost filterOption={false} />);
            const user = await openSearch();
            await typeSearch(user, 'zzz');
            expect(visibleOptions()).toHaveLength(3);
        });

        it('filterOption 传函数时按自定义规则过滤', async () => {
            render(<SearchHost filterOption={(inputValue, option) => option.key === inputValue} />);
            const user = await openSearch();
            await typeSearch(user, 'b');
            expect(visibleOptions()).toHaveLength(1);
            expect(screen.getByRole('option')).toHaveTextContent('Banana');
        });

        it('无匹配时展示 notFoundContent，默认"暂无数据"', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            await typeSearch(user, 'zzz');
            expect(screen.getByText('暂无数据')).toBeInTheDocument();
        });

        it('notFoundContent 可自定义', async () => {
            render(<SearchHost notFoundContent={<span>没有匹配项</span>} />);
            const user = await openSearch();
            await typeSearch(user, 'zzz');
            expect(screen.getByText('没有匹配项')).toBeInTheDocument();
        });

        it('onSearch 每次输入都会回调', async () => {
            const onSearch = vi.fn();
            render(<SearchHost onSearch={onSearch} />);
            const user = await openSearch();
            await typeSearch(user, 'ba');
            expect(onSearch).toHaveBeenLastCalledWith('ba');
        });

        it('键盘在过滤后的结果集内导航并选中', async () => {
            const onChange = vi.fn();
            render(<SearchHost onChange={onChange} />);
            const user = await openSearch();
            const input = getInput();
            await typeSearch(user, 'a');
            // 'a' 命中 Apple 与 Banana，Cherry 被过滤掉
            const opts = screen.getAllByRole('option');
            expect(opts).toHaveLength(2);
            expect(input.getAttribute('aria-activedescendant')).toBe(opts[0].id);
            await user.keyboard('{ArrowDown}');
            expect(input.getAttribute('aria-activedescendant')).toBe(opts[1].id);
            await user.keyboard('{Enter}');
            expect(onChange).toHaveBeenCalledWith('b');
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });

        it('空格在搜索模式下是普通输入，不会确认选中', async () => {
            const onChange = vi.fn();
            const onSearch = vi.fn();
            render(<SearchHost onChange={onChange} onSearch={onSearch} />);
            const user = await openSearch();
            const input = getInput();
            await typeSearch(user, 'a b');
            expect(input).toHaveValue('a b');
            expect(onSearch).toHaveBeenLastCalledWith('a b');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('Esc 先清空搜索词，再按一次才关闭', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            await typeSearch(user, 'ban');
            await user.keyboard('{Escape}');
            expect(screen.getByRole('listbox')).toBeInTheDocument();
            expect(visibleOptions()).toHaveLength(3);
            await user.keyboard('{Escape}');
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });

        it('选中后关闭并重置搜索词', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            await typeSearch(user, 'ban');
            await user.click(screen.getByRole('option'));
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            // 收起后输入框回显选中项的 label，而不是残留搜索词
            expect(getInput()).toHaveValue('Banana');
        });

        it('展开时会选中已有文本，直接输入即可替换', async () => {
            render(<SearchHost initial="a" />);
            const user = await openSearch();
            const input = getInput();
            expect(input).toHaveValue('Apple');
            await typeSearch(user, 'c');
            expect(input).toHaveValue('c');
            expect(screen.getByRole('option')).toHaveTextContent('Cherry');
        });

        it('disabled 时不渲染清除按钮、输入框禁用且点击不展开', async () => {
            const user = userEvent.setup();
            render(<SearchHost initial="b" disabled allowClear />);
            expect(screen.queryByRole('button', { name: '清除' })).not.toBeInTheDocument();
            expect(getInput()).toBeDisabled();
            await user.click(getInput());
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        });

        it('下拉已展开时点击输入框内部不会收起（移动光标不该丢搜索词）', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            await typeSearch(user, 'ban');
            await user.click(getInput());
            expect(screen.getByRole('listbox')).toBeInTheDocument();
            expect(getInput()).toHaveValue('ban');
        });

        it('把查询删空后输入框保持为空、不回显 label，并重新展示全部选项', async () => {
            render(<SearchHost initial="a" />);
            const user = await openSearch();
            const input = getInput();
            await typeSearch(user, 'ban');
            expect(visibleOptions()).toHaveLength(1);
            await user.clear(input);
            expect(input).toHaveValue('');
            expect(visibleOptions()).toHaveLength(3);
        });

        it('收起状态下直接输入即可打开并开始搜索', async () => {
            render(<SearchHost />);
            const user = userEvent.setup();
            const input = getInput();
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            input.focus();
            await user.type(input, 'ban', { skipClick: true });
            await flushRaf();
            expect(input).toHaveValue('ban');
            expect(screen.getByRole('option')).toHaveTextContent('Banana');
        });

        it('收起时把被重置掉的非空搜索词回调为 onSearch("")', async () => {
            const onSearch = vi.fn();
            render(<SearchHost onSearch={onSearch} />);
            const user = await openSearch();
            await typeSearch(user, 'ban');
            await user.click(screen.getByRole('option'));
            expect(onSearch).toHaveBeenLastCalledWith('');
        });

        it('查询本来就是空时收起不会多调一次 onSearch', async () => {
            const onSearch = vi.fn();
            const user = userEvent.setup();
            render(
                <div>
                    <SearchHost onSearch={onSearch} />
                    <button data-testid="outside">outside</button>
                </div>
            );
            getInput().focus();
            await user.keyboard('{ArrowDown}');
            await flushRaf();
            await user.click(screen.getByTestId('outside'));
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            expect(onSearch).not.toHaveBeenCalled();
        });

        it('搜索选中后继续输入是新的查询，不会把 label 编辑进去', async () => {
            render(<SearchHost />);
            const user = await openSearch();
            const input = getInput();
            await typeSearch(user, 'ban');
            await user.keyboard('{Enter}');
            expect(input).toHaveValue('Banana');
            // 此时输入框仍然聚焦，直接继续输入应当开始新查询
            await typeSearch(user, 'c');
            await flushRaf();
            expect(input).toHaveValue('c');
            expect(screen.getByRole('option')).toHaveTextContent('Cherry');
        });

        it('清除后焦点落到搜索框', async () => {
            const user = userEvent.setup();
            const ClearSearchHost = () => {
                const [v, setV] = useState('b');
                return <Select options={options} value={v} onChange={setV} showSearch allowClear />;
            };
            render(<ClearSearchHost />);
            hoverSelect();
            screen.getByRole('button', { name: '清除' }).focus();
            await user.keyboard('{Enter}');
            expect(getInput()).toHaveFocus();
        });
    });
});
