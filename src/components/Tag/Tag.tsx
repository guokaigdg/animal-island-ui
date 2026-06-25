import React, { useCallback } from 'react';
import classNames from 'classnames';
import styles from './tag.module.less';

export type TagSize = 'small' | 'medium' | 'large';

export type TagVariant = 'solid' | 'outlined' | 'dashed';

export type TagColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface TagProps {
    /** 标签内容 */
    children?: React.ReactNode;
    /** 尺寸 */
    size?: TagSize;
    /** 风格变体：solid 填充、outlined 描边、dashed 虚线 */
    variant?: TagVariant;
    /** 颜色 */
    color?: TagColor;
    /** 是否可关闭 */
    closable?: boolean;
    /** 关闭回调 */
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    /** 点击回调，开启后标签可点击 */
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    /** 禁用状态 */
    disabled?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

const SIZE_CLASS: Record<TagSize, string> = {
    small: styles['size-small'],
    medium: styles['size-medium'],
    large: styles['size-large'],
};

const VARIANT_CLASS: Record<TagVariant, string> = {
    solid: styles['variant-solid'],
    outlined: styles['variant-outlined'],
    dashed: styles['variant-dashed'],
};

const COLOR_CLASS = (color: TagColor, variant: TagVariant): string => {
    if (color === 'default') return '';
    if (variant === 'solid') return styles[`color-${color}-solid`] || styles[`color-${color}`];
    return styles[`color-${color}-${variant}`] || styles[`color-${color}`];
};

export const Tag: React.FC<TagProps> = ({
    children,
    size = 'medium',
    variant = 'solid',
    color = 'default',
    closable = false,
    onClose,
    onClick,
    disabled = false,
    className,
    style,
}) => {
    const handleClose = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            if (disabled) return;
            onClose?.(e);
        },
        [disabled, onClose]
    );

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (disabled) return;
            onClick?.(e);
        },
        [disabled, onClick]
    );

    const isInteractive = !!onClick && !disabled;

    const cls = classNames(
        styles.tag,
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        COLOR_CLASS(color, variant),
        disabled && styles['is-disabled'],
        isInteractive && styles['is-clickable'],
        className
    );

    const TagBody = (
        <>
            <span className={styles.text}>{children}</span>
            {closable && (
                <button
                    type="button"
                    className={styles.close}
                    aria-label="close"
                    onClick={handleClose}
                    disabled={disabled}
                >
                    ×
                </button>
            )}
        </>
    );

    if (isInteractive) {
        return (
            <span
                className={cls}
                style={style}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(e as unknown as React.MouseEvent<HTMLElement>);
                    }
                }}
            >
                {TagBody}
            </span>
        );
    }

    return (
        <span className={cls} style={style}>
            {TagBody}
        </span>
    );
};

Tag.displayName = 'Tag';
