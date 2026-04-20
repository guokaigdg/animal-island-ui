import React from 'react';
import styles from './divider.module.less';

export type DividerType = 'line-brown' | 'line-teal' | 'line-white' | 'line-yellow' | 'wave-yellow';

export interface DividerProps {
    /** 分隔线类型 */
    type?: DividerType;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({ type = 'line-brown', className, style }) => {
    const cls = [styles.divider, styles[type], className].filter(Boolean).join(' ');
    return <div className={cls} style={style} />;
};

Divider.displayName = 'Divider';
