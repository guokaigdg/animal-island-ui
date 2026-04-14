import React, { useState } from 'react';
import styles from './collapse.module.less';

export interface CollapseProps {
    /** 问题标题 */
    question: React.ReactNode;
    /** 答案内容 */
    answer: React.ReactNode;
    /** 是否默认展开 */
    defaultExpanded?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Collapse: React.FC<CollapseProps> = ({
    question,
    answer,
    defaultExpanded = false,
    disabled = false,
    className,
    style,
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const handleClick = () => {
        if (!disabled) {
            setExpanded(!expanded);
        }
    };

    const cls = [
        styles.faqCard,
        expanded && styles.expanded,
        disabled && styles.disabled,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cls} style={style}>
            <button
                className={styles.questionHeader}
                onClick={handleClick}
                disabled={disabled}
                aria-expanded={expanded}
            >
                <span className={styles.questionIcon}>
                    {expanded ? '−' : '+'}
                </span>
                <span className={styles.questionText}>{question}</span>
                <span className={styles.leafDecoration}>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                            fill="currentColor"
                            d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
                        />
                    </svg>
                </span>
            </button>
            <div className={styles.answerWrapper}>
                <div className={styles.answerContent}>{answer}</div>
            </div>
        </div>
    );
};

Collapse.displayName = 'Collapse';
