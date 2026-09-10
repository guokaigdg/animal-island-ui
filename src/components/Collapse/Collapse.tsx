import React, { useState, useId } from 'react';
import { Icon } from '../Icon';
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

    const idPrefix = `animal-collapse-${useId().replace(/:/g, '')}`;
    const headerId = `${idPrefix}-header`;
    const panelId = `${idPrefix}-panel`;

    const handleClick = () => {
        if (!disabled) {
            setExpanded(!expanded);
        }
    };

    const cls = [styles.faqCard, expanded && styles.expanded, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cls} style={style}>
            <button
                type="button"
                id={headerId}
                className={styles.questionHeader}
                onClick={handleClick}
                disabled={disabled}
                aria-expanded={expanded}
                aria-controls={panelId}
            >
                <span className={styles.questionIcon} aria-hidden>
                    {expanded ? '−' : '+'}
                </span>
                <span className={styles.questionText}>{question}</span>
                <span className={styles.leafDecoration} aria-hidden>
                    <Icon name="Fish" size={20} color="currentColor" />
                </span>
            </button>
            <div className={styles.answerWrapper} id={panelId} role="region" aria-labelledby={headerId}>
                <div className={styles.answerContent}>{answer}</div>
            </div>
        </div>
    );
};

Collapse.displayName = 'Collapse';
