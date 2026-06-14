import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import styles from './select.module.less';

export type SelectOption = {
    key: string;
    label: string;
};

export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (key: string) => void;
    placeholder?: string;
    disabled?: boolean;
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
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}) => {
    const [open, setOpen] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const currentLabel = options.find((o) => o.key === value)?.label || placeholder;

    const idPrefix = `animal-select-${useId().replace(/:/g, '')}`;
    const listboxId = `${idPrefix}-listbox`;
    const optionId = (k: string) => `${idPrefix}-option-${k}`;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
                setMounted(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (open && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const dropdownHeight = options.length * 44 + 24;

            const newStyle: React.CSSProperties = {
                position: 'absolute',
            };

            if (rect.right + 200 > viewportWidth) {
                newStyle.right = '100%';
                newStyle.marginRight = '6px';
                newStyle.left = 'auto';
            } else {
                newStyle.left = '100%';
                newStyle.marginLeft = '6px';
                newStyle.right = 'auto';
            }

            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

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

            setDropdownStyle(newStyle);
            requestAnimationFrame(() => {
                setMounted(true);
            });
        } else if (!open) {
            setMounted(false);
        }
    }, [open, options.length]);

    // 打开时把 activeKey 落到当前选中项或第一项
    useEffect(() => {
        if (open) {
            setActiveKey(value || options[0]?.key || null);
        } else {
            setActiveKey(null);
        }
    }, [open, value, options]);

    const handleSelect = useCallback(
        (key: string) => {
            onChange(key);
            setOpen(false);
            setMounted(false);
            triggerRef.current?.focus();
        },
        [onChange]
    );

    const moveActive = (delta: 1 | -1) => {
        if (!options.length) return;
        const idx = options.findIndex((o) => o.key === activeKey);
        const nextIdx =
            idx < 0 ? (delta === 1 ? 0 : options.length - 1) : (idx + delta + options.length) % options.length;
        setActiveKey(options[nextIdx].key);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
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
            setOpen(false);
            setMounted(false);
            triggerRef.current?.focus();
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            moveActive(1);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            moveActive(-1);
        } else if (key === 'Home') {
            e.preventDefault();
            if (options[0]) setActiveKey(options[0].key);
        } else if (key === 'End') {
            e.preventDefault();
            if (options.length) setActiveKey(options[options.length - 1].key);
        } else if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            if (activeKey) handleSelect(activeKey);
        }
    };

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}
            onKeyDown={handleKeyDown}
        >
            <div
                ref={triggerRef}
                className={`${styles.trigger} ${open ? styles.open : ''}`}
                onClick={() => !disabled && setOpen(!open)}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? listboxId : undefined}
                aria-activedescendant={open && activeKey ? optionId(activeKey) : undefined}
                aria-disabled={disabled || undefined}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                tabIndex={disabled ? -1 : 0}
            >
                <span className={value ? styles.value : styles.placeholder}>{currentLabel}</span>
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
                    className={styles.dropdown}
                    style={dropdownStyle}
                    role="listbox"
                    id={listboxId}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                >
                    {options.map((option) => {
                        const selected = value === option.key;
                        return (
                            <div
                                key={option.key}
                                id={optionId(option.key)}
                                role="option"
                                aria-selected={selected}
                                className={`${styles.option} ${selected ? styles.active : ''} ${hoveredKey === option.key ? styles.hovered : ''}`}
                                onClick={() => handleSelect(option.key)}
                                onMouseEnter={() => {
                                    setHoveredKey(option.key);
                                    setActiveKey(option.key);
                                }}
                                onMouseLeave={() => setHoveredKey(null)}
                            >
                                <span className={styles.optionDot} aria-hidden />
                                {option.label}
                                {selected && <div className={styles.pillBar} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

Select.displayName = 'Select';
