import React from 'react';
import { Chart, CodeBlock, type ChartType } from '../../../src';
import { CHART_PAGES } from '../../chartPages';
import { cartesianExamples } from './gallery-cartesian';
import { polarExamples } from './gallery-polar';
import { specialtyExamples } from './gallery-specialty';
import type { ChartGalleryExample } from './gallery-shared';
import styles from './gallery.module.less';

/** 每种类型都必须提供独立样式，类型映射防止新增路由遗漏示例。 */
const EXAMPLES: Record<ChartType, readonly ChartGalleryExample[]> = {
    ...cartesianExamples,
    ...polarExamples,
    ...specialtyExamples,
};

/** 从实际绘制配置生成独立可复制的代码，保留格式化函数。 */
function exampleCode(example: ChartGalleryExample): string {
    const { valueFormatter, xFormatter, ...props } = example.props;
    const data = JSON.stringify(props, null, 4);
    // 示例格式化函数均为不依赖外部变量的纯函数，复制后无需额外声明。
    const functions = Object.entries({ valueFormatter, xFormatter })
        .filter(([, format]) => format !== undefined)
        .map(([name, format]) => `    ${name}: ${format!.toString().replace(/\n/g, '\n    ')}`);
    const config = functions.length ? `${data.slice(0, -2)},\n${functions.join(',\n')}\n}` : data;
    return `import { Chart, type ChartProps } from 'animal-island-ui';\n\nconst chartProps: ChartProps = ${config};\n\n<Chart {...chartProps} />`;
}

/** 一个真实可交互的样式示例，代码按需展开，避免长代码挤占展示区域。 */
const ChartGalleryItem: React.FC<{ example: ChartGalleryExample; linked?: boolean }> = ({
    example,
    linked = false,
}) => {
    const page = CHART_PAGES.find((item) => item.type === example.props.type)!;
    // 图例、锁定及数据明细都由独立 Chart 实例管理，不与相邻示例共享状态。
    return (
        <article className={styles.item} aria-label={`${example.props.title}示例`}>
            <Chart {...example.props} />
            <div className={styles.actions}>
                <details className={styles.code}>
                    <summary>查看配置</summary>
                    <CodeBlock code={exampleCode(example)} />
                </details>
                {linked && <a href={`#/chart-${page.type}`}>更多{page.label}示例</a>}
            </div>
        </article>
    );
};
ChartGalleryItem.displayName = 'ChartGalleryItem';

/** 在原有基础演示前追加样式图集，桌面并排对比、窄屏自然折行。 */
export const ChartGalleryDemo: React.FC<{ type: ChartType }> = ({ type }) => {
    const examples = EXAMPLES[type];
    // 使用同一份配置绘制和展示代码，避免示例画面与复制结果不一致。
    return (
        <section className={styles.gallery} aria-label="图表样式与场景示例">
            <header className={styles.header}>
                <h2>样式与场景</h2>
                <p>
                    {examples.length} 种独立示例，比较配色、布局和数据表达；悬浮读数，点击图例筛选，展开配置即可复用。
                </p>
            </header>
            <div className={styles.grid}>
                {examples.map((example) => (
                    <ChartGalleryItem key={example.id} example={example} />
                ))}
            </div>
        </section>
    );
};
ChartGalleryDemo.displayName = 'ChartGalleryDemo';

/** 总览精选不同表达方式，将详细样式入口放在对应图表旁。 */
export const ChartShowcaseDemo: React.FC = () => {
    // 精选与类型页共用配置，后续调整示例时总览会同步更新。
    const picks = [
        EXAMPLES.column[0],
        EXAMPLES.line[0],
        EXAMPLES.ring[0],
        EXAMPLES.bar[2],
        EXAMPLES.radar[2],
        EXAMPLES.bubble[1],
        EXAMPLES.funnel[0],
        EXAMPLES.map[2],
    ];
    return (
        <section className={styles.gallery} aria-label="图表样式精选">
            <header className={styles.header}>
                <h2>图表样式精选</h2>
                <p>从趋势、构成到分布与转化。每种图表另有 4 组样式示例，所有数据与地图均为虚构演示。</p>
            </header>
            <div className={styles.grid}>
                {picks.map((example) => (
                    <ChartGalleryItem key={`${example.props.type}-${example.id}`} example={example} linked />
                ))}
            </div>
        </section>
    );
};
ChartShowcaseDemo.displayName = 'ChartShowcaseDemo';
