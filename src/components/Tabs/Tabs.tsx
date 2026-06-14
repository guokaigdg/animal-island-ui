import React, { useState, useId, useRef, useCallback } from 'react';
import styles from './tabs.module.less';
import leafIcon from '../../assets/img/icons/icon-leaf.png';

export interface TabItem {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
}

export interface TabsProps {
    items: TabItem[];
    defaultActiveKey?: string;
    activeKey?: string;
    onChange?: (key: string) => void;
    className?: string;
    style?: React.CSSProperties;
    leafAnimation?: boolean;
    shadow?: boolean;
    /** 无可见标题时给 tablist 一个无障碍标签 */
    'aria-label'?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    items,
    defaultActiveKey,
    activeKey,
    onChange,
    className,
    style,
    leafAnimation = true,
    shadow = true,
    'aria-label': ariaLabel,
}) => {
    const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || items[0]?.key);

    const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;

    // tablist 内每个 tab 的稳定 id 前缀，用于 aria-controls / aria-labelledby 双向关联
    const idPrefix = `animal-tabs-${useId().replace(/:/g, '')}`;
    const tabId = (k: string) => `${idPrefix}-tab-${k}`;
    const panelId = (k: string) => `${idPrefix}-panel-${k}`;

    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const handleTabClick = useCallback(
        (key: string) => {
            if (activeKey === undefined) {
                setInternalActiveKey(key);
            }
            onChange?.(key);
        },
        [activeKey, onChange]
    );

    const focusTab = (key: string) => {
        tabRefs.current.get(key)?.focus();
    };

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const { key } = e;
            if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') {
                return;
            }
            e.preventDefault();
            const idx = items.findIndex((i) => i.key === currentActiveKey);
            if (idx < 0) return;
            let nextIdx = idx;
            if (key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
            else if (key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
            else if (key === 'Home') nextIdx = 0;
            else if (key === 'End') nextIdx = items.length - 1;
            const nextKey = items[nextIdx].key;
            handleTabClick(nextKey);
            focusTab(nextKey);
        },
        [items, currentActiveKey, handleTabClick]
    );

    const activeItem = items.find((item) => item.key === currentActiveKey);

    const cls = [styles.tabs, className].filter(Boolean).join(' ');

    return (
        <div className={cls} style={style}>
            <div
                className={styles.tabList}
                role="tablist"
                aria-label={ariaLabel}
                aria-orientation="horizontal"
                onKeyDown={handleKeyDown}
            >
                {items.map((item) => {
                    const isActive = item.key === currentActiveKey;
                    return (
                        <button
                            key={item.key}
                            ref={(el) => {
                                if (el) tabRefs.current.set(item.key, el);
                                else tabRefs.current.delete(item.key);
                            }}
                            id={tabId(item.key)}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={panelId(item.key)}
                            tabIndex={isActive ? 0 : -1}
                            className={`${styles.tabItem} ${isActive ? styles.active : ''} ${isActive && shadow ? styles['active-shadow'] : ''}`}
                            onClick={() => handleTabClick(item.key)}
                        >
                            <span className={styles.tabIcon} aria-hidden>
                                {isActive ? '●' : '○'}
                            </span>
                            <span className={styles.tabLabel}>{item.label}</span>
                            {isActive && (
                                <img
                                    src={leafIcon}
                                    alt=""
                                    className={`${styles.tabLeaf} ${leafAnimation ? '' : styles.tabLeafStatic}`}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
            <div
                className={styles.tabContent}
                role="tabpanel"
                id={activeItem ? panelId(activeItem.key) : undefined}
                aria-labelledby={activeItem ? tabId(activeItem.key) : undefined}
                tabIndex={0}
            >
                <div className={styles.tabContentInner}>{activeItem?.children}</div>
            </div>
        </div>
    );
};

Tabs.displayName = 'Tabs';
