import React from 'react';
import styles from './card.module.less';

export type CardType = 'default' | 'title' | 'dashed';

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

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 卡片类型 */
    type?: CardType;
    /** 背景颜色类型 */
    color?: CardColor;
    /** 自定义内容 */
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    type = 'default',
    color = 'default',
    children,
    className,
    style,
    ...rest
}) => {
    const cls = [
        styles.card,
        type === 'title' && styles['card-title'],
        type === 'dashed' && styles['card-dashed'],
        color !== 'default' && styles[`card-${color}`],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={cls}
            style={style}
            {...rest}
        >
            {children}
        </div>
    );
};

Card.displayName = 'Card';
