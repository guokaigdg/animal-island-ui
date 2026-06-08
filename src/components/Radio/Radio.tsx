import React, { useState, useCallback, useRef, useMemo, useEffect, useId } from 'react';
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

    const reactId = useId();
    const idBase = `animal-radio-${reactId.replace(/:/g, '')}`;
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // 当前聚焦的索引（用于 roving tabindex）
    const [focusedIndex, setFocusedIndex] = useState<number>(() => {
        const idx = options.findIndex((o) => o.value === checkedValue);
        return idx >= 0 ? idx : 0;
    });

    // 选中值变化时，把 roving 焦点同步到选中项
    useEffect(() => {
        const idx = options.findIndex((o) => o.value === checkedValue);
        if (idx >= 0) setFocusedIndex(idx);
        // 故意不依赖 options，避免父组件未 memo 时打断键盘导航
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedValue]);

    // 获取所有可用（未禁用）选项的索引
    const enabledIndices = useMemo(() => {
        return options
            .map((opt, idx) => ({ opt, idx }))
            .filter(({ opt }) => !disabled && !opt.disabled)
            .map(({ idx }) => idx);
    }, [options, disabled]);

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

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (enabledIndices.length === 0) return;

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
                inputRefs.current[nextIdx]?.focus();
            }
        },
        [enabledIndices, currentEnabledPos, options, handleChange]
    );

    return (
        <div
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
                const inputId = `${idBase}-${idx}`;

                return (
                    <label
                        key={String(opt.value)}
                        className={classNames(styles.radioItem, styles[size], {
                            [styles.checked]: isChecked,
                            [styles.disabled]: isDisabled,
                        })}
                    >
                        <span className={styles.cbx}>
                            <input
                                id={inputId}
                                ref={(el) => {
                                    inputRefs.current[idx] = el;
                                }}
                                type="radio"
                                name={idBase}
                                checked={isChecked}
                                disabled={isDisabled}
                                tabIndex={isFocusable ? 0 : -1}
                                onChange={() => handleChange(opt.value, opt.disabled)}
                                onFocus={() => {
                                    if (!isDisabled) setFocusedIndex(idx);
                                }}
                            />
                            <span className={styles.splash} aria-hidden="true" />
                            <svg className={styles.check} fill="none" viewBox="0 0 15 14" height={14} width={15}>
                                <path d="M2 8.36364L6.23077 12L13 2" />
                            </svg>
                        </span>
                        <span className={styles.label}>{opt.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

Radio.displayName = 'Radio';
