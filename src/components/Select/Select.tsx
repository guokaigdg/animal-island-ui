import React, { useState, useRef, useEffect, useId, useCallback, useMemo } from 'react';
import { CloseIcon } from 'naive-icons';
import styles from './select.module.less';

export type SelectOption = {
    key: string;
    label: string;
};

export type SelectVariant = 'default' | 'game';

export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (key: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** 下拉弹出方式：default 常规正下方展开（空间不足翻到正上方）；game 贴触发区侧边弹出 */
    variant?: SelectVariant;
    /** 允许一键清空当前选中值 */
    allowClear?: boolean;
    /** 清空后的回调 */
    onClear?: () => void;
    /** 清除按钮的无障碍标签，默认"清除" */
    clearAriaLabel?: string;
    /** 允许在触发区内输入关键字过滤选项 */
    showSearch?: boolean;
    /** 过滤规则：true 按 optionFilterProp 匹配、false 不过滤、传函数则自行判定 */
    filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean);
    /** filterOption 为 true 时参与匹配的字段，默认 'label' */
    optionFilterProp?: 'key' | 'label';
    /** 搜索词变化回调 */
    onSearch?: (value: string) => void;
    /** 无匹配选项时展示的内容，默认"暂无数据" */
    notFoundContent?: React.ReactNode;
    /** 对外暴露的无障碍标签（无可见 label 时使用） */
    'aria-label'?: string;
    /** 关联外部可见 label 的 id */
    'aria-labelledby'?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = '请选择',
    disabled = false,
    variant = 'default',
    allowClear = false,
    onClear,
    clearAriaLabel = '清除',
    showSearch = false,
    filterOption = true,
    optionFilterProp = 'label',
    onSearch,
    notFoundContent = '暂无数据',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}) => {
    const [open, setOpen] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    // null = 没有在搜索（输入框回显选中项），string = 用户正在搜索（空串就是要显示空查询）
    const [searchValue, setSearchValue] = useState<string | null>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    // 悬停状态：清除按钮仅在悬停（含聚焦触发的悬停）时显示
    const [hovered, setHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const currentLabel = options.find((o) => o.key === value)?.label || placeholder;
    // 输入框在非搜索状态下的回显：有选中值显示 label，否则留空让 placeholder 生效
    const labelForInput = value ? currentLabel : '';

    const idPrefix = `animal-select-${useId().replace(/:/g, '')}`;
    const listboxId = `${idPrefix}-listbox`;
    const optionId = (k: string) => `${idPrefix}-option-${k}`;

    // 关键字过滤；未搜索或搜索词为空时展示全部选项
    const filteredOptions = useMemo(() => {
        if (!showSearch || !filterOption || !searchValue) return options;
        const matcher =
            typeof filterOption === 'function'
                ? filterOption
                : (inputValue: string, option: SelectOption) =>
                      option[optionFilterProp].toLowerCase().includes(inputValue.toLowerCase());
        return options.filter((option) => matcher(searchValue, option));
    }, [options, showSearch, filterOption, optionFilterProp, searchValue]);

    const closeDropdown = useCallback(() => {
        setOpen(false);
        setMounted(false);
        // 收起时把被重置掉的查询告知消费者，避免外部按 onSearch 维护的结果集留在旧值上
        if (searchValue) onSearch?.('');
        setSearchValue(null);
    }, [searchValue, onSearch]);

    const focusTrigger = useCallback(() => {
        if (showSearch) searchRef.current?.focus();
        else triggerRef.current?.focus();
    }, [showSearch]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, closeDropdown]);

    useEffect(() => {
        if (open && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const dropdownHeight = options.length * 44 + 24;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            const newStyle: React.CSSProperties = {
                position: 'absolute',
            };

            if (variant === 'game') {
                if (rect.right + 200 > viewportWidth) {
                    newStyle.right = '100%';
                    newStyle.marginRight = '6px';
                    newStyle.left = 'auto';
                } else {
                    newStyle.left = '100%';
                    newStyle.marginLeft = '6px';
                    newStyle.right = 'auto';
                }

                if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                    newStyle.top = 'auto';
                    newStyle.bottom = '100%';
                    newStyle.marginBottom = '6px';
                    delete newStyle.transform;
                } else if (spaceBelow < dropdownHeight) {
                    newStyle.top = '100%';
                    newStyle.marginTop = '6px';
                    newStyle.bottom = 'auto';
                    delete newStyle.transform;
                } else if (rect.top < dropdownHeight) {
                    newStyle.top = '100%';
                    newStyle.marginTop = '6px';
                    newStyle.bottom = 'auto';
                    delete newStyle.transform;
                } else {
                    newStyle.top = '50%';
                    newStyle.transform = 'translateY(-50%)';
                    newStyle.bottom = 'auto';
                }
            } else {
                // 面板宽度随内容变化且未知，用 50% + translateX(-50%) 实现相对触发区水平居中
                newStyle.left = '50%';
                newStyle.right = 'auto';
                newStyle.transform = 'translateX(-50%)';

                if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                    newStyle.top = 'auto';
                    newStyle.bottom = '100%';
                    newStyle.marginBottom = '6px';
                } else {
                    newStyle.top = '100%';
                    newStyle.bottom = 'auto';
                    newStyle.marginTop = '6px';
                }
            }

            setDropdownStyle(newStyle);
            requestAnimationFrame(() => {
                setMounted(true);
            });
        } else if (!open) {
            setMounted(false);
        }
    }, [open, options.length, variant]);

    // default 变体按内容宽度居中展开，挂载后确认没有越过视口左右边缘，越界就改为贴该侧对齐
    useEffect(() => {
        if (!open || !mounted || variant !== 'default' || !dropdownRef.current) return;
        const rect = dropdownRef.current.getBoundingClientRect();
        if (rect.left < 0) {
            setDropdownStyle((prev) => ({ ...prev, left: 0, transform: 'none' }));
        } else if (rect.right > window.innerWidth) {
            setDropdownStyle((prev) => ({ ...prev, left: 'auto', right: 0, transform: 'none' }));
        }
    }, [open, mounted, variant]);

    // 输入框里显示 label 时（刚展开，或选中后 label 回填到已聚焦的输入框）只聚焦，不做全选，
    // 让回显文字保持未选中状态（不做高亮）
    useEffect(() => {
        if (!showSearch) return;
        const input = searchRef.current;
        if (!input) return;
        if (searchValue !== null) {
            if (open) input.focus();
            return;
        }
        if (open) {
            input.focus();
        }
    }, [open, showSearch, searchValue, value]);

    // 收起时清空高亮；展开或过滤结果变化时，把高亮落到当前选中项或第一个可见项
    useEffect(() => {
        if (!open) {
            setActiveKey(null);
            return;
        }
        setActiveKey((prev) => {
            if (filteredOptions.some((o) => o.key === prev)) return prev;
            return filteredOptions.find((o) => o.key === value)?.key ?? filteredOptions[0]?.key ?? null;
        });
    }, [open, value, filteredOptions]);

    const handleSelect = useCallback(
        (key: string) => {
            onChange(key);
            closeDropdown();
            focusTrigger();
        },
        [onChange, closeDropdown, focusTrigger]
    );

    const moveActive = (delta: 1 | -1) => {
        if (!filteredOptions.length) return;
        const idx = filteredOptions.findIndex((o) => o.key === activeKey);
        const nextIdx =
            idx < 0
                ? delta === 1
                    ? 0
                    : filteredOptions.length - 1
                : (idx + delta + filteredOptions.length) % filteredOptions.length;
        setActiveKey(filteredOptions[nextIdx].key);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        // 只接管 trigger 与搜索框的按键；清除按钮等子元素保留自身 Enter/Space 行为
        const fromControl = e.target === triggerRef.current || e.target === searchRef.current;
        if (!fromControl) return;
        const { key } = e;
        if (!open) {
            if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        if (key === 'Escape') {
            e.preventDefault();
            // 有搜索词时先清空搜索词，再按一次才关闭
            if (showSearch && searchValue) {
                setSearchValue(null);
                onSearch?.('');
                return;
            }
            closeDropdown();
            focusTrigger();
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            moveActive(1);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            moveActive(-1);
        } else if (key === 'Home') {
            e.preventDefault();
            if (filteredOptions[0]) setActiveKey(filteredOptions[0].key);
        } else if (key === 'End') {
            e.preventDefault();
            if (filteredOptions.length) setActiveKey(filteredOptions[filteredOptions.length - 1].key);
        } else if (key === 'Enter' || (key === ' ' && !showSearch)) {
            // 空格在搜索模式下属于正常输入，只有非搜索模式才当作确认
            e.preventDefault();
            if (activeKey && filteredOptions.some((o) => o.key === activeKey)) handleSelect(activeKey);
        }
    };

    const showClear = allowClear && Boolean(value) && !disabled && hovered;

    const comboboxA11y: React.AriaAttributes = {
        'aria-haspopup': 'listbox',
        'aria-expanded': open,
        'aria-controls': open ? listboxId : undefined,
        'aria-activedescendant': open && activeKey ? optionId(activeKey) : undefined,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
    };

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                ref={triggerRef}
                className={`${styles.trigger} ${open ? styles.open : ''}`}
                onClick={(e) => {
                    if (disabled) return;
                    // 点搜索框内部只是为了移动光标，不应该把已展开的下拉收起来
                    if (e.target === searchRef.current && open) return;
                    if (open) closeDropdown();
                    else setOpen(true);
                }}
                role={showSearch ? undefined : 'combobox'}
                tabIndex={showSearch || disabled ? undefined : 0}
                aria-disabled={showSearch ? undefined : disabled || undefined}
                {...(showSearch ? {} : comboboxA11y)}
            >
                {showSearch ? (
                    <input
                        ref={searchRef}
                        className={styles.searchInput}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-disabled={disabled || undefined}
                        {...comboboxA11y}
                        value={open ? (searchValue ?? labelForInput) : labelForInput}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete="off"
                        onChange={(e) => {
                            const next = e.target.value;
                            // 输入框此刻显示的是选中的 label（尚无搜索词）时，输入应作为新的查询词，
                            // 去掉 label 前缀而非在 label 后面追加
                            const editingLabel =
                                searchValue === null &&
                                Boolean(value) &&
                                labelForInput !== '' &&
                                next.startsWith(labelForInput);
                            const query = editingLabel ? next.slice(labelForInput.length) : next;
                            setSearchValue(query);
                            onSearch?.(query);
                            // 闭合时直接输入的第一个字符即开始搜索
                            if (!open) setOpen(true);
                        }}
                    />
                ) : (
                    <span className={value ? styles.value : styles.placeholder}>{currentLabel}</span>
                )}
                {showClear && (
                    <button
                        type="button"
                        className={styles.clear}
                        aria-label={clearAriaLabel}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                            onClear?.();
                            // 值清空后按钮自身会卸载，把焦点交给 trigger 免得键盘用户掉焦点
                            focusTrigger();
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <CloseIcon size={12} />
                    </button>
                )}
                <span className={styles.arrow} aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
            {open && mounted && (
                <div
                    ref={dropdownRef}
                    className={styles.dropdown}
                    style={dropdownStyle}
                    role="listbox"
                    id={listboxId}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                >
                    {/* listbox 必须包含 option（aria-required-children），所以空态渲染成禁用的 option */}
                    {filteredOptions.length === 0 ? (
                        <div className={styles.notFound} role="option" aria-disabled="true" aria-selected="false">
                            {notFoundContent}
                        </div>
                    ) : (
                        filteredOptions.map((option) => {
                            const selected = value === option.key;
                            return (
                                <div
                                    key={option.key}
                                    id={optionId(option.key)}
                                    role="option"
                                    aria-selected={selected}
                                    className={`${styles.option} ${selected ? styles.active : ''}`}
                                    onClick={() => handleSelect(option.key)}
                                    onMouseEnter={() => {
                                        setActiveKey(option.key);
                                    }}
                                >
                                    <span className={styles.optionDot} aria-hidden />
                                    {option.label}
                                    {selected && <div className={styles.pillBar} />}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

Select.displayName = 'Select';
