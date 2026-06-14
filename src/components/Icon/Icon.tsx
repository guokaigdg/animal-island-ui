import React, { useState, useEffect } from 'react';
import styles from './icon.module.less';

export type IconName =
    | 'icon-miles'
    | 'icon-camera'
    | 'icon-chat'
    | 'icon-encyclopedia'
    | 'icon-design'
    | 'icon-diy'
    | 'icon-helicopter'
    | 'icon-map'
    | 'icon-shopping'
    | 'icon-variant';

// 懒加载器：调用时才发起 chunk 请求
// —— 488 个 PNG 不再随 Icon.js 一同进 bundle
// 用 Object.keys 同步拿到文件路径列表（不触发任何 import）
const itemLoaders = import.meta.glob<string>('../../assets/img/icons/items/item-*.png', {
    query: '?url',
    import: 'default',
});
const itemKeys = Object.keys(itemLoaders);

const itemNumberToPath: Record<number, string> = {};
for (const path of itemKeys) {
    const m = /item-(\d+)\.png$/.exec(path);
    if (m) itemNumberToPath[Number(m[1])] = path;
}

export const ITEM_COUNT = Object.keys(itemNumberToPath).length;

/** 物品图标编号列表（1 ~ ITEM_COUNT），按自上而下、自左而右排序 */
export const ITEM_LIST: number[] = Object.keys(itemNumberToPath)
    .map(Number)
    .sort((a, b) => a - b);

const urlCache = new Map<number, string>();

/**
 * 解析 item 图标的 URL 字符串。命中缓存同步返回；未命中则异步加载并缓存。
 * 业务侧可在 hover / 滚动等时机预热，避开首次 render 的空白闪烁。
 */
export async function resolveItemUrl(item: number): Promise<string | undefined> {
    const cached = urlCache.get(item);
    if (cached) return cached;
    const path = itemNumberToPath[item];
    if (!path) return undefined;
    const loader = itemLoaders[path];
    if (!loader) return undefined;
    const url = await loader();
    urlCache.set(item, url);
    return url;
}

export interface IconProps {
    /** 内置具名图标。与 item 二选一 */
    name?: IconName;
    /** 物品图标编号（1 ~ ITEM_COUNT），来自 figma "Items" 设计稿。与 name 二选一 */
    item?: number;
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
    bounce?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, item, size = 24, className, style, bounce = false, ...rest }) => {
    // 同步读缓存：二次渲染时立即拿到 URL，零延迟
    const [itemUrl, setItemUrl] = useState<string | undefined>(() =>
        typeof item === 'number' ? urlCache.get(item) : undefined
    );

    useEffect(() => {
        if (typeof item !== 'number') {
            setItemUrl(undefined);
            return;
        }
        const cached = urlCache.get(item);
        if (cached) {
            setItemUrl(cached);
            return;
        }
        let cancelled = false;
        resolveItemUrl(item).then((url) => {
            if (!cancelled) setItemUrl(url ?? undefined);
        });
        return () => {
            cancelled = true;
        };
    }, [item]);

    const cls = [styles.icon, name ? styles[name] : '', bounce ? styles['icon-bounce'] : '', className || '']
        .filter(Boolean)
        .join(' ');

    return (
        <span
            className={cls}
            style={{
                width: size,
                height: size,
                ...(itemUrl ? { backgroundImage: `url(${itemUrl})` } : null),
                ...style,
            }}
            {...rest}
        />
    );
};

export const ICON_LIST: { name: IconName; label: string }[] = [
    { name: 'icon-miles', label: 'IslandMiles' },
    { name: 'icon-camera', label: 'Camera' },
    { name: 'icon-chat', label: 'Chat' },
    { name: 'icon-encyclopedia', label: 'Encyclopedia' },
    { name: 'icon-design', label: 'Design' },
    { name: 'icon-diy', label: 'DIY' },
    { name: 'icon-helicopter', label: 'Helicopter' },
    { name: 'icon-map', label: 'Map' },
    { name: 'icon-shopping', label: 'Shopping' },
    { name: 'icon-variant', label: 'Variant' },
];
