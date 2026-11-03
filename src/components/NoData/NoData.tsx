import React from 'react';
import { NoDataIcon, SearchIcon } from 'naive-icons';
import styles from './no-data.module.less';

/** 空态尺寸，适用于表格单元、卡片与整块内容区。 */
export type NoDataSize = 'small' | 'medium' | 'large';
/** 默认空数据、搜索无结果与简洁空态。 */
export type NoDataVariant = 'default' | 'search' | 'simple';

/** 海岛风格空态；操作区直接复用业务按钮，不内置请求或加载逻辑。 */
export interface NoDataProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    /** 展示风格，默认 default */
    variant?: NoDataVariant;
    /** 尺寸，默认 medium */
    size?: NoDataSize;
    /** 标题，默认“暂无数据”，search 默认“没有找到相关结果”；null 隐藏 */
    title?: React.ReactNode;
    /** 说明内容，默认不显示 */
    description?: React.ReactNode;
    /** 自定义装饰图标；null 或 false 隐藏图标 */
    icon?: React.ReactNode;
    /** 操作区，推荐放置 Button；优先于 children */
    extra?: React.ReactNode;
    /** 操作区的简写 */
    children?: React.ReactNode;
    /** 显示奶油色背景与沙色虚线边框，默认 false */
    bordered?: boolean;
}

/** 空纸箱与搜索图标直接采用 naive-icons 的原生造型和配色。 */
const NoDataArtwork: React.FC<{ variant: NoDataVariant }> = ({ variant }) => {
    // 保留图标库内部的粗描边与实色填充，不覆盖 SVG 子节点或额外叠加底托。
    return variant === 'search' ? (
        <SearchIcon className={styles.sceneIcon} />
    ) : (
        <NoDataIcon className={styles.sceneIcon} />
    );
};

NoDataArtwork.displayName = 'NoDataArtwork';

/** 海岛风空态；装饰与可读文字分离，保留自定义图标和操作区。 */
export const NoData: React.FC<NoDataProps> = ({
    variant = 'default',
    size = 'medium',
    title,
    description,
    icon,
    extra,
    children,
    bordered = false,
    className,
    ...rest
}) => {
    // 只有 undefined 采用默认内容，null/false 保留调用方主动隐藏的意图。
    const heading = title === undefined ? (variant === 'search' ? '没有找到相关结果' : '暂无数据') : title;
    const graphic = icon === undefined ? <NoDataArtwork variant={variant} /> : icon;
    const actions = extra === undefined ? children : extra;
    return (
        <div
            className={[styles.noData, styles[size], styles[variant], bordered && styles.bordered, className]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {graphic !== null && graphic !== false && (
                <div
                    className={[styles.artwork, icon !== undefined && styles.customArtwork].filter(Boolean).join(' ')}
                    aria-hidden="true"
                >
                    {icon === undefined ? graphic : <span className={styles.symbol}>{graphic}</span>}
                </div>
            )}
            {heading !== null && heading !== false && <div className={styles.title}>{heading}</div>}
            {description !== null && description !== undefined && description !== false && (
                <div className={styles.description}>{description}</div>
            )}
            {actions !== null && actions !== undefined && actions !== false && (
                <div className={styles.actions}>{actions}</div>
            )}
        </div>
    );
};

NoData.displayName = 'NoData';
