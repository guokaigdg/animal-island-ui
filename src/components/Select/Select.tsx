import React, { useState, useRef, useEffect } from 'react';
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
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = '请选择',
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);
    const currentLabel = options.find((o) => o.key === value)?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
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
        }
    }, [open, options.length]);

    const handleSelect = (key: string) => {
        onChange(key);
        setOpen(false);
    };

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}
        >
            <div
                className={`${styles.trigger} ${open ? styles.open : ''}`}
                onClick={() => !disabled && setOpen(!open)}
            >
                <span className={value ? styles.value : styles.placeholder}>
                    {currentLabel}
                </span>
                <span className={styles.arrow}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </div>
            {open && (
                <div className={styles.dropdown} style={dropdownStyle}>
                    {options.map((option) => (
                        <div
                            key={option.key}
                            className={`${styles.option} ${value === option.key ? styles.active : ''} ${hoveredKey === option.key ? styles.hovered : ''}`}
                            onClick={() => handleSelect(option.key)}
                            onMouseEnter={() => setHoveredKey(option.key)}
                            onMouseLeave={() => setHoveredKey(null)}
                        >
                            <span className={styles.optionDot} />
                            {option.label}
                            {value === option.key && <div className={styles.pillBar} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Select.displayName = 'Select';
