import React from "react";
import styles from "./divider.module.less";

export interface DividerProps {
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({ className, style }) => {
    const cls = [styles.divider, className].filter(Boolean).join(" ");

    return <div className={cls} style={style} />;
};

Divider.displayName = "Divider";
