import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './divider.module.less';

export type DividerType = 'dashed-brown' | 'thin' | 'hairline' | 'wave-yellow' | 'squiggle';

/** 单图标相连分割线可用的图标名（复用内置 101 图标） */
export type DividerIconName = IconName;

export interface DividerProps {
    /** 分隔线类型（type 与 icon 二选一，icon 优先） */
    type?: DividerType;
    /** 指定单一图标名；传入时渲染「图标 + 连接线」循环相连的装饰分割线，铺满整行 */
    icon?: DividerIconName;
    /** 图标大小（px），同 Icon 默认 24 */
    iconSize?: number;
    /** 图标间距（px），即相邻图标之间的连接线长度，默认 8（紧密相连） */
    iconGap?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
    type = 'dashed-brown',
    icon,
    iconSize = 24,
    iconGap = 8,
    className,
    style,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [cycles, setCycles] = useState(1);
    // 单个周期 = 图标 + 连接线宽度，按容器宽度重复拼接铺满
    const cycleWidth = iconSize + iconGap;

    useEffect(() => {
        if (!icon) return undefined;
        const el = ref.current;
        if (!el) return undefined;
        const update = () => {
            setCycles(Math.max(1, Math.floor(el.clientWidth / cycleWidth)));
        };
        update();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }
        return undefined;
    }, [icon, cycleWidth]);

    if (icon) {
        return (
            <div ref={ref} className={classNames(styles.iconDivider, className)} style={style} aria-hidden="true">
                {Array.from({ length: cycles }).map((_, c) => (
                    <div key={c} className={styles.iconCycle} {...(c > 0 ? { 'aria-hidden': true } : {})}>
                        <Icon name={icon} size={iconSize} />
                        {c < cycles - 1 && (
                            <span className={styles.iconGap} style={{ width: iconGap }}>
                                <span className={styles.iconLine} />
                            </span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    const cls = [styles.divider, styles[type], className].filter(Boolean).join(' ');
    return <div className={cls} style={style} />;
};

Divider.displayName = 'Divider';
