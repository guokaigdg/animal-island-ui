import React from 'react';
import classNames from 'classnames';
import { CHART_PAGES } from '../../chartPages';
import type { ChartType } from '../../../src';
import styles from './demo.module.less';

/** 全部类型，或指定的一种类型。 */
export type ChartSelection = ChartType | 'all';

interface ChartTypeSwitcherProps {
    /** 当前选中的类型 */
    value: ChartSelection;
    /** 选择某个类型 */
    onSelect: (type: ChartSelection) => void;
}

/** 合并页顶部的类型切换条：切换后只展示当前类型的演示。 */
export const ChartTypeSwitcher = React.forwardRef<HTMLElement, ChartTypeSwitcherProps>(({ value, onSelect }, ref) => (
    <nav ref={ref} className={styles.switcher} aria-label="图表类型切换">
        <button
            type="button"
            className={classNames(styles.switcherButton, value === 'all' && styles.switcherButtonActive)}
            aria-current={value === 'all' ? 'true' : undefined}
            onClick={() => onSelect('all')}
        >
            全部
        </button>
        {CHART_PAGES.map((page) => (
            <button
                key={page.type}
                type="button"
                title={`${page.englishLabel} ${page.label}`}
                className={classNames(styles.switcherButton, value === page.type && styles.switcherButtonActive)}
                aria-current={value === page.type ? 'true' : undefined}
                onClick={() => onSelect(page.type)}
            >
                {page.label}
            </button>
        ))}
    </nav>
));
ChartTypeSwitcher.displayName = 'ChartTypeSwitcher';
