import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Icon, ICON_LIST } from '../Icon';
import type { IconName } from '../Icon';
import styles from './footer.module.less';

export interface FooterProps {
    /** 图标大小（px），同 Icon 默认 24 */
    size?: number;
    /** 指定单一图标名（共 101 个，如 Heart）；传入时整条链仅用该图标相连铺满，缺省则按全部 101 个图标序列相连 */
    name?: IconName;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

/** 全部 101 个内置图标名，按注册表顺序组成一条连续图标链 */
const FULL_NAMES: IconName[] = ICON_LIST.map((item) => item.name);

export const Footer: React.FC<FooterProps> = ({ size = 24, name, className, style }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [cycles, setCycles] = useState(1);
    // 单个周期 = 图标序列并排的宽度；按容器宽度重复拼接铺满
    const iconNames = name ? [name] : FULL_NAMES;
    const cycleWidth = iconNames.length * size;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => {
            setCycles(Math.max(1, Math.ceil(el.clientWidth / cycleWidth) + 1));
        };
        update();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }
        return undefined;
    }, [cycleWidth]);

    return (
        <div ref={ref} className={classNames(styles.footer, className)} style={style}>
            {Array.from({ length: cycles }).map((_, c) => (
                <div key={c} className={styles.cycle} {...(c > 0 ? { 'aria-hidden': true } : {})}>
                    {iconNames.map((iconName) => (
                        <Icon key={iconName} name={iconName} size={size} />
                    ))}
                </div>
            ))}
        </div>
    );
};

Footer.displayName = 'Footer';
