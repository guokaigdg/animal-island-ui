import React from 'react';
import './cursor.css';

export interface CursorProps {
    /** 子元素 */
    children?: React.ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Cursor: React.FC<CursorProps> = ({ children, className, style }) => {
    return (
        <div
            className={`animal-cursor${className ? ` ${className}` : ''}`}
            style={style}
        >
            {children}
        </div>
    );
};

Cursor.displayName = 'Cursor';
