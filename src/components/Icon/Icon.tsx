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
    name: IconName;
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
    bounce?: boolean;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    className,
    style,
    bounce = false,
    ...rest
}) => {
    return (
        <span
            className={`${styles.icon} ${styles[name]} ${bounce ? styles['icon-bounce'] : ''} ${className || ''}`}
            style={{
                width: size,
                height: size,
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
