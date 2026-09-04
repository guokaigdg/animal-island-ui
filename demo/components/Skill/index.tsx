import React from 'react';
import { Tag } from '../../../src';
import {
    CATALOG,
    COLOR_TOKEN_GROUPS,
    INTRO_TAGS,
    QUICK_STEPS,
    RULE_GROUPS,
    SCALE_TOKEN_GROUPS,
    SCENARIOS,
    SKILL_TREE,
    WORKFLOW,
} from './data';
import { CatalogItem, ColorTokenGroup, RuleCard, ScaleTokenGroup, ScenarioCard, Section, StepCard } from './parts';
import ShellCode from './ShellCode';
import styles from './skill.module.less';

// ============================================
// Skill 介绍 —— animal-island-ui-style
// 章节顺序按阅读动线：是什么 → 怎么用 → 怎么工作 → 用在哪 → 有什么 → 边界
// ============================================
const SkillDemo: React.FC = () => (
    <div className={styles.page}>
        <Section title="animal-island-ui-style" tags={['AI Skill', '可安装']}>
            <p className={styles.lead}>
                一个可安装的编码助手技能，教会 AI 代理（Claude Code、Codex、Cursor 等兼容 SKILL.md
                的代理）按治愈系海岛风格搭建 UI：暖色羊皮纸背景、大地色文字、薄荷主色、胶囊形状与 3D
                游戏按钮质感。它只是知识，不是代码 —— 约束代理「怎么写」，不改变你的工程结构。
            </p>
            <div className={styles.tagRow}>
                {INTRO_TAGS.map((tag) => (
                    <Tag key={tag} size="small" variant="outlined">
                        {tag}
                    </Tag>
                ))}
            </div>
        </Section>

        <Section title="快速开始" tags={['3 步']}>
            <ol className={styles.quickList}>
                {QUICK_STEPS.map((step, i) => (
                    <li key={step.title} className={styles.quickItem}>
                        <span className={styles.index}>{i + 1}</span>
                        <div className={styles.quickBody}>
                            <div className={styles.quickTitle}>{step.title}</div>
                            <p className={styles.cardDesc}>{step.desc}</p>
                            {step.code && <ShellCode code={step.code} />}
                        </div>
                    </li>
                ))}
            </ol>
        </Section>

        <Section title="工作原理" tags={['Workflow']}>
            <p className={`${styles.lead} ${styles.leadSpaced}`}>
                技能是一个纯文本知识包，没有可执行代码，也不会常驻上下文 —— 代理按下面五步按需消费它：
            </p>
            <div className={styles.stepGrid}>
                {WORKFLOW.map((step, i) => (
                    <StepCard key={step.title} step={step} index={i} />
                ))}
            </div>
        </Section>

        <Section title="两种使用场景" tags={['Scenarios']}>
            <p className={`${styles.lead} ${styles.leadSpaced}`}>
                代理先判断场景，再读对应入口；两个场景共用组件目录与硬性规则。
            </p>
            <div className={styles.scenarioGrid}>
                {SCENARIOS.map((scenario) => (
                    <ScenarioCard key={scenario.title} scenario={scenario} />
                ))}
            </div>
        </Section>

        <Section title="目录结构" tags={['Layout']}>
            <ShellCode code={SKILL_TREE} />
        </Section>

        <Section title="组件目录" tags={['30 Components']}>
            <p className={`${styles.lead} ${styles.leadSpaced}`}>
                props 参考按分类放在 references/components/ 下，props、合法取值与默认值均直接取自源码。
            </p>
            <div className={styles.catalogList}>
                {CATALOG.map((row) => (
                    <CatalogItem key={row.category} row={row} />
                ))}
            </div>
        </Section>

        <Section title="设计令牌" tags={['--animal-*']}>
            <p className={`${styles.lead} ${styles.leadSpaced}`}>
                打包样式在 :root 上声明了运行时 CSS 自定义属性（前缀 --animal-*）。下面色板取的是当前页面真实令牌值 ——
                消费者覆盖变量即可运行时换肤。精确清单见设计系统的 css-variables.md 与 design-tokens.md。
            </p>
            {COLOR_TOKEN_GROUPS.map((group) => (
                <ColorTokenGroup key={group.label} group={group} />
            ))}
            {SCALE_TOKEN_GROUPS.map((group) => (
                <ScaleTokenGroup key={group.label} group={group} />
            ))}
        </Section>

        <Section title="硬性规则" tags={['Hard Rules']}>
            <p className={`${styles.lead} ${styles.leadSpaced}`}>违反以下规则视为 bug，代理不得越界：</p>
            <div className={styles.ruleGrid}>
                {RULE_GROUPS.map((group) => (
                    <RuleCard key={group.title} group={group} />
                ))}
            </div>
        </Section>

        <Section title="许可证" tags={['License']} dashed>
            <p className={styles.lead}>
                本组件库与该技能均为 CC BY-NC 4.0 —— 仅限非商业使用。完整条款见仓库 LICENSE 文件。
            </p>
        </Section>
    </div>
);

export default SkillDemo;
