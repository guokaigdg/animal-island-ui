import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserIcon } from 'naive-icons';
import { useIsomorphicLayoutEffect } from '../../internal/useIsomorphicLayoutEffect';
import styles from './avatar.module.less';

export type AvatarShape = 'circle' | 'square';

export type AvatarSize = 'small' | 'middle' | 'large';

const PRESET_SIZE: Record<AvatarSize, number> = {
    small: 32,
    middle: 40,
    large: 48,
};

// 各预设尺寸对应的文字字号（px），自定义数字尺寸按 0.4 倍换算
const PRESET_FONT: Record<AvatarSize, number> = {
    small: 14,
    middle: 16,
    large: 20,
};

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onError'> {
    /** 形状：circle 圆形 / square 圆角方形 */
    shape?: AvatarShape;
    /** 尺寸：预设 small / middle / large，或任意像素数值 */
    size?: number | AvatarSize;
    /** 图片地址；加载失败自动回退到 icon / 文字 */
    src?: string;
    /** 图片替代文本（无障碍）；仅图片头像生效 */
    alt?: string;
    /** 图标占位：src 为空或加载失败时展示；未传时默认使用用户图标 */
    icon?: React.ReactNode;
    /** 文字/图标与头像边界的间距（px），文字过宽时按比例自动缩小字号 */
    gap?: number;
    /** 图片加载失败回调；返回 false 可阻止回退到占位内容 */
    onError?: () => boolean;
    /** 头像内容：文字作为文字头像；传入 naive-icons 图标组件时创建图标头像 */
    children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> & { Group: React.FC<AvatarGroupProps> } = ({
    shape = 'circle',
    size = 'middle',
    src,
    alt,
    icon,
    gap = 4,
    onError,
    children,
    className,
    style,
    ...rest
}) => {
    // isImgLoaded：图片是否加载成功；false → 显示占位（icon 或文字）
    const [isImgLoaded, setIsImgLoaded] = useState(!!src && typeof src !== 'string');
    // scale：文字/图标缩放比，超宽时由 gap 计算
    const [scale, setScale] = useState(1);
    const textRef = useRef<HTMLSpanElement | null>(null);

    // src 变化时重置图片加载状态
    useEffect(() => {
        setIsImgLoaded(!!src);
    }, [src]);

    // 图片加载失败：询问 onError，默认回退到占位内容
    const handleImgError = useCallback(() => {
        const canRetry = onError?.();
        if (canRetry !== false) {
            setIsImgLoaded(false);
        }
    }, [onError]);

    const px = typeof size === 'number' ? size : PRESET_SIZE[size];
    const fontPx = typeof size === 'number' ? Math.max(12, Math.round(px * 0.4)) : PRESET_FONT[size];

    // 文字/图标超宽时按 available = px - gap*2 等比缩小字号
    useIsomorphicLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;
        const textWidth = el.offsetWidth;
        const available = px - gap * 2;
        setScale(textWidth > available && available > 0 ? available / textWidth : 1);
    }, [children, icon, gap, px]);

    const hasImage = !!src && isImgLoaded;
    // naive-icons 图标组件元素（type 为函数组件）→ 图标头像；字符串/数字 → 文字头像
    const firstChild = React.Children.toArray(children)[0];
    const isIconChild = React.isValidElement(firstChild) && typeof firstChild.type === 'function';
    const hasTextContent = React.Children.count(children) > 0 && !isIconChild;

    const cls = classNames(
        styles.avatar,
        shape === 'square' && styles['shape-square'],
        !hasImage && styles.placeholder,
        className
    );

    const sizeStyle: React.CSSProperties = {
        width: px,
        height: px,
        lineHeight: `${px}px`,
        fontSize: scale > 1 ? undefined : fontPx,
        ...style,
    };

    // 有图：img 铺满；无图：图标头像（icon → 图标 children → 默认用户图标）或文字头像（测量缩放）
    let content: React.ReactNode;
    if (hasImage) {
        content = <img className={styles.img} src={src} alt={alt ?? ''} onError={handleImgError} />;
    } else if (icon || isIconChild || !hasTextContent) {
        const iconNode = icon ?? (isIconChild ? firstChild : null) ?? (
            <UserIcon size={Math.round(px * 0.5)} aria-hidden="true" />
        );
        content = <span className={styles.string}>{iconNode}</span>;
    } else {
        content = (
            <span className={styles.string} ref={textRef} style={scale > 1 ? { fontSize: fontPx * scale } : undefined}>
                {children}
            </span>
        );
    }

    return (
        <span
            className={cls}
            style={sizeStyle}
            role={!hasImage && !hasTextContent ? 'img' : undefined}
            aria-label={!hasImage && !hasTextContent ? 'avatar' : undefined}
            {...rest}
        >
            {content}
        </span>
    );
};

Avatar.displayName = 'Avatar';

// ============================================
// Avatar.Group —— 头像组
// ============================================

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 最多显示的头像数量，超出部分折叠为 "+N" */
    maxCount?: number;
    /** 折叠 "+N" 头像的自定义样式 */
    maxStyle?: React.CSSProperties;
    /** 传递给子 Avatar 的尺寸（子级未显式指定时生效） */
    size?: number | AvatarSize;
    /** 传递给子 Avatar 的形状 */
    shape?: AvatarShape;
    /** 头像组内头像间距（px） */
    gap?: number;
    children?: React.ReactNode;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    maxCount,
    maxStyle,
    size,
    shape,
    gap = 8,
    className,
    children,
    style,
    ...rest
}) => {
    const kids = React.Children.toArray(children) as React.ReactElement[];

    let shown = kids;
    let restCount = 0;
    if (maxCount && maxCount > 0 && kids.length > maxCount) {
        shown = kids.slice(0, maxCount);
        restCount = kids.length - maxCount;
    }

    // 把组级 size / shape 注入未显式指定的子 Avatar
    const decorated = shown.map((kid) => {
        if (!React.isValidElement(kid)) return kid;
        const props = kid.props as Partial<AvatarProps>;
        const cloneProps: Partial<AvatarProps> = {};
        if (size !== undefined && props.size === undefined) cloneProps.size = size;
        if (shape !== undefined && props.shape === undefined) cloneProps.shape = shape;
        return Object.keys(cloneProps).length ? React.cloneElement(kid, cloneProps) : kid;
    });

    return (
        <div
            className={classNames(styles.group, className)}
            style={{ '--avatar-group-gap': `${gap}px`, ...style } as React.CSSProperties}
            {...rest}
        >
            {decorated}
            {restCount > 0 && (
                <span className={classNames(styles.avatar, styles.placeholder, styles['group-more'])} style={maxStyle}>
                    +{restCount}
                </span>
            )}
        </div>
    );
};

AvatarGroup.displayName = 'AvatarGroup';

// 兼容用法：Avatar.Group 也可经静态属性访问
Avatar.Group = AvatarGroup;
