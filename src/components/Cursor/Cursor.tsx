import React from 'react';
import './cursor.css';

export type CursorType = 'default' | 'raindrop';

export interface CursorProps {
    /** 子元素 */
    children?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /**
     * 光标风格，默认 `'default'`。
     * - `default`：手指箭头
     * - `raindrop`：蓝色雨滴
     */
    type?: CursorType;
    /**
     * 是否对所有后代元素强制覆盖光标。默认 `true`。
     * - `true`：全覆盖，所有后代（含 a/button 等交互元素）统一使用自定义光标
     * - `false`：仅容器自身设置自定义光标，交互元素保留 `pointer`、文本输入保留 `text`、禁用态保留 `not-allowed`
     */
    forceAll?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ type = 'default', children, className, style, forceAll = true }) => {
    const cls = [
        'animal-cursor',
        forceAll ? 'animal-cursor--force' : 'animal-cursor--scoped',
        type === 'raindrop' && 'animal-cursor--raindrop',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (
        <div className={cls} style={style}>
            {children}
        </div>
    );
};

Cursor.displayName = 'Cursor';
