import React from "react";
import styles from "./card.module.less";

export type CardType = "default" | "title";

export interface CardProps {
    /** 卡片类型 */
    type?: CardType;
    /** 自定义内容 */
    children?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    type = "default",
    children,
    className,
    style
}) => {
    const cls = [styles.card, type === "title" && styles["card-title"], className].filter(Boolean).join(" ");

    return (
        <div className={cls} style={style}>
            {children}
        </div>
    );
};

Card.displayName = "Card";
