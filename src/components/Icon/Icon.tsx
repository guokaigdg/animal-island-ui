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

export interface IconProps {
    /** 内置具名图标。与 src 二选一 */
    name?: IconName;
    /**
     * 自定义图标资源 URL。与 name 二选一。
     * 物品图标等大图资源不再随库打包，由消费者自行 import 后传入：
     * `import item from 'xxx/item-001.png'; <Icon src={item} />`
     */
    src?: string;
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
    bounce?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, src, size = 24, className, style, bounce = false, ...rest }) => {
    const cls = [styles.icon, name ? styles[name] : '', bounce ? styles['icon-bounce'] : '', className || '']
        .filter(Boolean)
        .join(' ');

    return (
        <span
            className={cls}
            style={{
                width: size,
                height: size,
                ...(src ? { backgroundImage: `url(${src})` } : null),
                ...style,
            }}
            {...rest}
        />
    );
};

export const ICON_LIST = [
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
] as const satisfies ReadonlyArray<{ name: IconName; label: string }>;
