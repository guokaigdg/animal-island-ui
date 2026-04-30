import React, { useState, useCallback } from 'react';
import styles from './checkbox.module.less';
import classNames from 'classnames';

export type CheckboxSize = 'small' | 'middle' | 'large';

export interface CheckboxOption {
    /** 选项标签 */
    label: React.ReactNode;
    /** 选项值 */
    value: string | number;
    /** 是否禁用该选项 */
    disabled?: boolean;
}

export interface CheckboxProps {
    /** 选中的值列表（受控） */
    value?: Array<string | number>;
    /** 默认选中的值列表 */
    defaultValue?: Array<string | number>;
    /** 选项列表 */
    options: CheckboxOption[];
    /** 尺寸 */
    size?: CheckboxSize;
    /** 禁用全部 */
    disabled?: boolean;
    /** 布局方向 */
    direction?: 'horizontal' | 'vertical';
    /** 变化回调 */
    onChange?: (values: Array<string | number>) => void;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    value,
    defaultValue = [],
    options,
    size = 'middle',
    disabled = false,
    direction = 'horizontal',
    onChange,
    className,
    style,
}) => {
    const [innerValue, setInnerValue] = useState<Array<string | number>>(defaultValue);
    const isControlled = value !== undefined;
    const checkedValues = isControlled ? value! : innerValue;

    const handleChange = useCallback(
        (optValue: string | number, optDisabled?: boolean) => {
            if (disabled || optDisabled) return;
            const next = checkedValues.includes(optValue)
                ? checkedValues.filter((v) => v !== optValue)
                : [...checkedValues, optValue];
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
        },
        [disabled, checkedValues, isControlled, onChange]
    );

    return (
        <div
            className={classNames(
                styles.checkboxGroup,
                styles[direction],
                { [styles.groupDisabled]: disabled },
                className
            )}
            style={style}
        >
            {options.map((opt) => {
                const isChecked = checkedValues.includes(opt.value);
                const isDisabled = disabled || opt.disabled;
                return (
                    <label
                        key={String(opt.value)}
                        className={classNames(
                            styles.checkboxItem,
                            styles[size],
                            {
                                [styles.checked]: isChecked,
                                [styles.disabled]: isDisabled,
                            }
                        )}
                        onClick={() => handleChange(opt.value, opt.disabled)}
                    >
                        <span className={styles.box} role="checkbox" aria-checked={isChecked} tabIndex={isDisabled ? -1 : 0}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleChange(opt.value, opt.disabled);
                                }
                            }}
                        >
                            {isChecked && (
                                <span className={styles.checkmark}>✓</span>
                            )}
                        </span>
                        <span className={styles.label}>{opt.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

Checkbox.displayName = 'Checkbox';
