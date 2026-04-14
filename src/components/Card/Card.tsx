import React from 'react';
import styles from './card.module.less';

export type CardType = 'default' | 'title';

export type CardColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface CardProps {
    /** 卡片类型 */
    type?: CardType;
    /** 背景颜色类型 */
    color?: CardColor;
    /** 自定义内容 */
    children?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 点击事件 */
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({
    type = 'default',
    color = 'default',
    children,
    className,
    style,
    onClick,
}) => {
    const cls = [
        styles.card,
        type === 'title' && styles['card-title'],
        color !== 'default' && styles[`card-${color}`],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cls} style={style} onClick={onClick}>
            {children}
        </div>
    );
};

Card.displayName = 'Card';
