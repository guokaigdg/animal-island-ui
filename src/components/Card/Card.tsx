import React from 'react';
import styles from './card.module.less';

export type CardType = 'default' | 'dashed';

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

export type CardPattern =
    | 'none'
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
    /** 背景花纹类型 */
    pattern?: CardPattern;
    /** 自定义内容 */
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    type = 'default',
    color = 'default',
    pattern = 'none',
    children,
    className,
    style,
    ...rest
}) => {
    const cls = [
        styles.card,
        type === 'dashed' && styles['card-dashed'],
        color !== 'default' && styles[`card-${color}`],
        pattern !== 'none' && styles[`pattern-${pattern}`],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cls} style={style} {...rest}>
            {children}
        </div>
    );
};

Card.displayName = 'Card';
