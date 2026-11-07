import React from 'react';
import { NoData } from '../../../src';
import { sectionStyle, sectionTitleStyle } from '../../tools';

/** 空纸箱与搜索两种原生图标的独立预览，原有尺寸、文案和操作演示继续保留。 */
export const NoDataAppearanceDemo: React.FC = () => {
    // 并排展示常用空态，窄屏自然换行，便于直接比较两种图形的区别。
    return (
        <section style={sectionStyle} aria-label="naive-icons 原生图标空态预览">
            <div style={{ ...sectionTitleStyle, marginBottom: 20 }}>naive-icons 原生图标空态</div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: 24,
                }}
            >
                <NoData bordered title="这里还是空白的一页" description="记录下一件小事，让海岛的故事慢慢展开。" />
                <NoData
                    variant="search"
                    bordered
                    title="暂时没有找到"
                    description="换个关键词试试，也许会有新的发现。"
                />
            </div>
        </section>
    );
};

NoDataAppearanceDemo.displayName = 'NoDataAppearanceDemo';
