import React from 'react';
import {
    BookOpen,
    Camera,
    ChevronLeft,
    ChevronRight,
    FileText,
    Hammer,
    Map,
    MapPin,
    MessageCircle,
    Palette,
    Shuffle,
    ShoppingCart,
    Wifi,
    type LucideIcon,
} from 'lucide-react';
import styles from './icon.module.less';

export type IconName =
    | 'icon-left'
    | 'icon-right'
    | 'location'
    | 'page'
    | 'wifi'
    | 'icon-shopping'
    | 'icon-chat'
    | 'icon-variant'
    | 'icon-encyclopedia'
    | 'icon-design'
    | 'icon-map'
    | 'icon-diy'
    | 'icon-camera';

/** 内置语义图标：均渲染 lucide-react 图标（https://lucide.dev/icons/） */
const BUILTIN_ICONS: Record<IconName, LucideIcon> = {
    'icon-left': ChevronLeft,
    'icon-right': ChevronRight,
    location: MapPin,
    page: FileText,
    wifi: Wifi,
    'icon-shopping': ShoppingCart,
    'icon-chat': MessageCircle,
    'icon-variant': Shuffle,
    'icon-encyclopedia': BookOpen,
    'icon-design': Palette,
    'icon-map': Map,
    'icon-diy': Hammer,
    'icon-camera': Camera,
};

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    /** 内置具名图标。与 icon / src 二选一 */
    name?: IconName;
    /** 任意 lucide-react 图标组件（import { Heart } from 'lucide-react'）。与 name / src 二选一 */
    icon?: LucideIcon;
    /** 自定义图标资源 URL。与 name / icon 二选一，用于彩色位图等非矢量场景 */
    src?: string;
    size?: number | string;
    /** 描边颜色（lucide 模式），默认继承 currentColor */
    color?: string;
    /** 描边粗细（lucide 模式），默认 2 */
    strokeWidth?: number | string;
    bounce?: boolean;
}

export const Icon: React.FC<IconProps> = ({
    name,
    icon,
    src,
    size = 24,
    color,
    strokeWidth,
    className,
    style,
    bounce = false,
    ...rest
}) => {
    const cls = [styles.icon, name ? styles[name] : '', bounce ? styles['icon-bounce'] : '', className || '']
        .filter(Boolean)
        .join(' ');

    const LucideCmp = icon ?? (name ? BUILTIN_ICONS[name] : undefined);

    if (LucideCmp) {
        const labeled = Boolean(rest['aria-label']);
        return (
            <LucideCmp
                className={cls}
                color={color}
                strokeWidth={strokeWidth}
                style={{ width: size, height: size, ...style }}
                aria-hidden={labeled ? undefined : true}
                role={labeled ? 'img' : undefined}
                {...(rest as React.SVGProps<SVGSVGElement>)}
            />
        );
    }

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
    { name: 'icon-shopping', label: 'Shopping' },
    { name: 'icon-chat', label: 'Chat' },
    { name: 'icon-variant', label: 'Variant' },
    { name: 'icon-encyclopedia', label: 'Encyclopedia' },
    { name: 'icon-design', label: 'Design' },
    { name: 'icon-map', label: 'Map' },
    { name: 'icon-diy', label: 'DIY' },
    { name: 'icon-camera', label: 'Camera' },
] as const satisfies ReadonlyArray<{ name: IconName; label: string }>;
