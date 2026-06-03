import React from 'react';
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

// 物品图标：400+ 个独立物品图。
// 通过 Vite import.meta.glob 在构建期收集为 URL 字典，避免在 less 中维护数百条规则。
const itemModules = import.meta.glob<string>('../../assets/img/icons/items/item-*.png', {
    eager: true,
    query: '?url',
    import: 'default',
});

const ITEM_URL_MAP: Record<number, string> = (() => {
    const map: Record<number, string> = {};
    for (const path in itemModules) {
        const match = /item-(\d+)\.png$/.exec(path);
        if (match) {
            map[Number(match[1])] = itemModules[path];
        }
    }
    return map;
})();

export const ITEM_COUNT = Object.keys(ITEM_URL_MAP).length;

/** 物品图标编号列表（1 ~ ITEM_COUNT），按自上而下、自左而右排序 */
export const ITEM_LIST: number[] = Object.keys(ITEM_URL_MAP)
    .map(Number)
    .sort((a, b) => a - b);

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

export const Icon: React.FC<IconProps> = ({
    name,
    item,
    size = 24,
    className,
    style,
    bounce = false,
    ...rest
}) => {
    const itemUrl =
        typeof item === 'number' ? ITEM_URL_MAP[item] : undefined;

    const cls = [
        styles.icon,
        name ? styles[name] : '',
        bounce ? styles['icon-bounce'] : '',
        className || '',
    ]
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
