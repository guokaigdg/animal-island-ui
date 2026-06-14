import React from 'react';
import classNames from 'classnames';
import styles from './title.module.less';

export type TitleSize = 'small' | 'middle' | 'large';

export type TitleColor =
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

export interface TitleProps {
    /** 标题内容 */
    children: React.ReactNode;
    /** 尺寸 */
    size?: TitleSize;
    /** 配色，与 Card 同名色板 */
    color?: TitleColor;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

const SIZE_MAP: Record<TitleSize, number> = {
    small: 14,
    middle: 20,
    large: 28,
};

const Ribbon: React.FC<{ children: React.ReactNode; fontSize: number; color?: TitleColor }> = ({
    children,
    fontSize,
    color,
}) => (
    <span
        className={classNames(styles.ribbon, color && color !== 'default' && styles[`color-${color}`])}
        style={{ fontSize: `${fontSize}px` }}
    >
        <span className={classNames(styles.ribbonBack, styles.ribbonBackLeft)} aria-hidden />
        <span className={classNames(styles.ribbonBack, styles.ribbonBackRight)} aria-hidden />
        <span className={classNames(styles.ribbonFold, styles.ribbonFoldLeft)} aria-hidden />
        <span className={classNames(styles.ribbonFold, styles.ribbonFoldRight)} aria-hidden />
        <span className={styles.ribbonFront} aria-hidden />
        <span className={styles.ribbonText}>{children}</span>
    </span>
);

export const Title: React.FC<TitleProps> = ({ children, size = 'middle', color = 'default', className, style }) => {
    return (
        <span className={classNames(styles.title, className)} style={style}>
            <Ribbon fontSize={SIZE_MAP[size]} color={color}>
                {children}
            </Ribbon>
        </span>
    );
};

Title.displayName = 'Title';
