import React from 'react';
import styles from './button.module.less';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type ButtonSize = 'small' | 'middle' | 'large';
export type ButtonHTMLType = 'submit' | 'reset' | 'button';

export interface ButtonProps extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'type'
> {
    /** 按钮类型 */
    type?: ButtonType;
    /** 按钮尺寸 */
    size?: ButtonSize;
    /** 是否危险按钮 */
    danger?: boolean;
    /** 是否幽灵按钮（透明背景） */
    ghost?: boolean;
    /** 是否块级按钮 */
    block?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 禁用状态 */
    disabled?: boolean;
    /** 图标 */
    icon?: React.ReactNode;
    /** 原生 button type */
    htmlType?: ButtonHTMLType;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    type = 'default',
    size = 'middle',
    danger = false,
    ghost = false,
    block = false,
    loading = false,
    disabled = false,
    icon,
    htmlType = 'button',
    children,
    className,
    ...rest
}) => {
    const classNames = [
        styles.btn,
        styles[`btn-${type}`],
        styles[`btn-${size}`],
        danger && styles['btn-danger'],
        ghost && styles['btn-ghost'],
        block && styles['btn-block'],
        loading && styles['btn-loading'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={htmlType}
            className={classNames}
            disabled={disabled}
            {...rest}
        >
            {icon && !loading && (
                <span className={styles['btn-icon']}>{icon}</span>
            )}
            {children && <span>{children}</span>}
        </button>
    );
};

Button.displayName = 'Button';
