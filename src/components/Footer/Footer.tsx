import React from 'react';
import styles from './footer.module.less';

export type FooterType = 'sea' | 'tree';

export interface FooterProps {
    /** Footer 类型 */
    type?: FooterType;
    /** 无缝拼接 */
    seamless?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({ type = 'tree', seamless = false, className, style }) => {
    const cls = [styles.footer, styles[type], seamless && styles.seamless, className].filter(Boolean).join(' ');
    return <div className={cls} style={style} />;
};

Footer.displayName = 'Footer';
