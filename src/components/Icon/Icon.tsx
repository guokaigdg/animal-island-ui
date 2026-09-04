import React from 'react';
import styles from './icon.module.less';

export type IconName = 'icon-left' | 'icon-right' | 'location' | 'page' | 'wifi';

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
    { name: 'icon-left', label: 'Left' },
    { name: 'icon-right', label: 'Right' },
    { name: 'location', label: 'Location' },
    { name: 'page', label: 'Page' },
    { name: 'wifi', label: 'WiFi' },
] as const satisfies ReadonlyArray<{ name: IconName; label: string }>;
