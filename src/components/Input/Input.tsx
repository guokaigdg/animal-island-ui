import React, { useState, useCallback } from 'react';
import styles from './input.module.less';

export type InputSize = 'small' | 'middle' | 'large';

export interface InputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix'
> {
    /** 输入框尺寸 */
    size?: InputSize;
    /** 前缀图标 */
    prefix?: React.ReactNode;
    /** 后缀图标 */
    suffix?: React.ReactNode;
    /** 允许清除 */
    allowClear?: boolean;
    /** 错误状态 */
    status?: 'error' | 'warning';
    /** 值变化回调 */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    /** 清除回调 */
    onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
    size = 'middle',
    prefix,
    suffix,
    allowClear = false,
    status,
    disabled = false,
    className,
    value,
    defaultValue,
    onChange,
    onClear,
    ...rest
}) => {
    const [innerValue, setInnerValue] = useState(defaultValue ?? '');
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : innerValue;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> =
        useCallback(
            (e) => {
                if (!isControlled) setInnerValue(e.target.value);
                onChange?.(e);
            },
            [isControlled, onChange]
        );

    const handleClear = useCallback(() => {
        if (!isControlled) setInnerValue('');
        onClear?.();
        // 触发 onChange 模拟清空
        const nativeEvent = new Event('input', { bubbles: true });
        const fakeTarget = { value: '' } as HTMLInputElement;
        onChange?.({
            target: fakeTarget,
            currentTarget: fakeTarget,
            nativeEvent,
        } as React.ChangeEvent<HTMLInputElement>);
    }, [isControlled, onChange, onClear]);

    const wrapperCls = [
        styles.wrapper,
        styles[`wrapper-${size}`],
        status && styles[`wrapper-${status}`],
        disabled && styles['wrapper-disabled'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={wrapperCls}>
            {prefix && <span className={styles.prefix}>{prefix}</span>}
            <input
                className={styles.input}
                disabled={disabled}
                value={currentValue}
                onChange={handleChange}
                {...rest}
            />
            {allowClear && currentValue && !disabled && (
                <span
                    className={styles.clear}
                    onClick={handleClear}
                    role="button"
                    tabIndex={-1}
                >
                    ×
                </span>
            )}
            {suffix && <span className={styles.suffix}>{suffix}</span>}
        </span>
    );
};

Input.displayName = 'Input';
