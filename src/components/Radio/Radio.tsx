import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import styles from './radio.module.less';
import classNames from 'classnames';

export type RadioSize = 'small' | 'middle' | 'large';

export interface RadioOption {
    /** 选项标签 */
    label: React.ReactNode;
    /** 选项值 */
    value: string | number;
    /** 是否禁用该选项 */
    disabled?: boolean;
}

export interface RadioProps {
    /** 选中的值（受控） */
    value?: string | number;
    /** 默认选中的值 */
    defaultValue?: string | number;
    /** 选项列表 */
    options: RadioOption[];
    /** 尺寸 */
    size?: RadioSize;
    /** 禁用全部 */
    disabled?: boolean;
    /** 布局方向 */
    direction?: 'horizontal' | 'vertical';
    /** 变化回调 */
    onChange?: (value: string | number) => void;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Radio: React.FC<RadioProps> = ({
    value,
    defaultValue,
    options,
    size = 'middle',
    disabled = false,
    direction = 'horizontal',
    onChange,
    className,
    style,
}) => {
    const [innerValue, setInnerValue] = useState<string | number | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const checkedValue = isControlled ? value : innerValue;

    const groupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const idx = options.findIndex((o) => o.value === checkedValue);
        if (idx >= 0) setFocusedIndex(idx);
    }, [checkedValue, options]);

    // 当前聚焦的索引（用于 roving tabindex）
    const [focusedIndex, setFocusedIndex] = useState<number>(() => {
        const idx = options.findIndex((o) => o.value === checkedValue);
        return idx >= 0 ? idx : 0;
    });

    // 获取所有可用（未禁用）选项的索引
    const enabledIndices = useMemo(() => {
        return options
            .map((opt, idx) => ({ opt, idx }))
            .filter(({ opt }) => !disabled && !opt.disabled)
            .map(({ idx }) => idx);
    }, [options, disabled]);

    // 找到当前可用项在 enabledIndices 中的位置
    const currentEnabledPos = useMemo(() => {
        return enabledIndices.indexOf(focusedIndex);
    }, [enabledIndices, focusedIndex]);

    const handleChange = useCallback(
        (optValue: string | number, optDisabled?: boolean) => {
            if (disabled || optDisabled) return;
            if (!isControlled) setInnerValue(optValue);
            onChange?.(optValue);
        },
        [disabled, isControlled, onChange]
    );

    // 方向键导航：移动到下一个/上一个可用选项并选中
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (enabledIndices.length === 0) return;

            const isHorizontal = direction === 'horizontal';
            let nextPos = -1;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    nextPos = (currentEnabledPos + 1) % enabledIndices.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    nextPos = (currentEnabledPos - 1 + enabledIndices.length) % enabledIndices.length;
                    break;
                case 'Home':
                    e.preventDefault();
                    nextPos = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    nextPos = enabledIndices.length - 1;
                    break;
                default:
                    return;
            }

            if (nextPos >= 0) {
                const nextIdx = enabledIndices[nextPos];
                setFocusedIndex(nextIdx);
                handleChange(options[nextIdx].value, options[nextIdx].disabled);

                // 聚焦到对应的 radio circle
                const circles = groupRef.current?.querySelectorAll('[data-radio-circle]');
                (circles?.[nextIdx] as HTMLElement)?.focus();
            }
        },
        [direction, enabledIndices, currentEnabledPos, options, handleChange]
    );

    return (
        <div
            ref={groupRef}
            className={classNames(
                styles.radioGroup,
                styles[direction],
                { [styles.groupDisabled]: disabled },
                className
            )}
            style={style}
            role="radiogroup"
            onKeyDown={handleKeyDown}
        >
            {options.map((opt, idx) => {
                const isChecked = checkedValue === opt.value;
                const isDisabled = disabled || opt.disabled;
                const isFocusable = idx === focusedIndex && !isDisabled;

                return (
                    <label
                        key={String(opt.value)}
                        className={classNames(
                            styles.radioItem,
                            styles[size],
                            {
                                [styles.checked]: isChecked,
                                [styles.disabled]: isDisabled,
                            }
                        )}
                        onClick={() => {
                            if (!isDisabled) {
                                setFocusedIndex(idx);
                                handleChange(opt.value, opt.disabled);
                            }
                        }}
                    >
                        <span
                            className={styles.circle}
                            data-radio-circle
                            role="radio"
                            aria-checked={isChecked}
                            aria-disabled={isDisabled || undefined}
                            tabIndex={isFocusable ? 0 : -1}
                            onFocus={() => {
                                if (!isDisabled) setFocusedIndex(idx);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    handleChange(opt.value, opt.disabled);
                                }
                            }}
                        >
                            {isChecked && <span className={styles.dot} />}
                        </span>
                        <span className={styles.label}>{opt.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

Radio.displayName = 'Radio';
