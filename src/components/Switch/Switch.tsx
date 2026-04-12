import React, { useState, useCallback } from "react";
import styles from "./switch.module.less";

export type SwitchSize = "small" | "default";

export interface SwitchProps {
    /** 是否选中（受控） */
    checked?: boolean;
    /** 默认是否选中 */
    defaultChecked?: boolean;
    /** 尺寸 */
    size?: SwitchSize;
    /** 禁用 */
    disabled?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 选中时文案 */
    checkedChildren?: React.ReactNode;
    /** 未选中时文案 */
    unCheckedChildren?: React.ReactNode;
    /** 变化回调 */
    onChange?: (checked: boolean) => void;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    checked,
    defaultChecked = false,
    size = "default",
    disabled = false,
    loading = false,
    checkedChildren,
    unCheckedChildren,
    onChange,
    className
}) => {
    const [innerChecked, setInnerChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : innerChecked;

    const handleClick = useCallback(() => {
        if (disabled || loading) return;
        const next = !isChecked;
        if (!isControlled) setInnerChecked(next);
        onChange?.(next);
    }, [disabled, loading, isChecked, isControlled, onChange]);

    const cls = [
        styles.switch,
        styles[`switch-${size}`],
        isChecked && styles["switch-checked"],
        disabled && styles["switch-disabled"],
        loading && styles["switch-loading"],
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            className={cls}
            onClick={handleClick}
            disabled={disabled}
        >
            <span className={styles.handle}>{loading && <span className={styles.spinner} />}</span>
            <span className={styles.inner}>{isChecked ? checkedChildren : unCheckedChildren}</span>
        </button>
    );
};

Switch.displayName = "Switch";
