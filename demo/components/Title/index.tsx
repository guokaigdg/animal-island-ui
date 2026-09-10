import React from 'react';
import { Title, type TitleColor } from '../../../src';
import {
    labelStyle,
    ApiTable,
    CodeBlock,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBoxStyle,
} from '../../tools';

const TITLE_API: ApiRow[] = [
    { prop: 'children', desc: '标题内容', type: 'ReactNode', defaultVal: '-', required: true },
    { prop: 'size', desc: '尺寸', type: "'small' | 'middle' | 'large'", defaultVal: "'middle'" },
    {
        prop: 'color',
        desc: '配色',
        type: "'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'",
        defaultVal: "'default'",
    },
    { prop: 'variant', desc: '标题样式', type: "'layer' | 'ribbon' | 'tab'", defaultVal: "'layer'" },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', defaultVal: '-' },
];

// 背景工厂：底色 + 错位圆点纹理，每个 section 用不同主题色
const acBox = (bg: string, dot1: string, dot2: string, border: string): React.CSSProperties => ({
    ...demoBoxStyle,
    padding: 40,
    // 底色作为 background 最后一层，避免 background 简写把 background-color 重置为透明
    background: `
        radial-gradient(circle, ${dot1} 1.5px, transparent 1.5px),
        radial-gradient(circle, ${dot2} 1px, transparent 1px),
        ${bg}
    `,
    backgroundSize: '28px 28px, 14px 14px, auto',
    backgroundPosition: '0 0, 7px 7px, 0 0',
    border: `1.5px solid ${border}`,
});

// 各 section 主题
const bgGreen = acBox('#e8f5d8', 'rgba(120,200,80,0.18)', 'rgba(180,230,120,0.12)', '#b8d890'); // 草地
const bgSky = acBox('#ddf0fa', 'rgba(80,170,230,0.15)', 'rgba(140,210,250,0.10)', '#90cce8'); // 天空
const bgSand = acBox('#fdf3d8', 'rgba(220,180,80,0.15)', 'rgba(240,210,120,0.10)', '#e8d090'); // 沙滩
const bgLavender = acBox('#ede8f8', 'rgba(160,120,230,0.15)', 'rgba(200,170,250,0.10)', '#c0a8e8'); // 薰衣草
const bgCoral = acBox('#fce8e0', 'rgba(240,120,90,0.15)', 'rgba(250,170,140,0.10)', '#e8b0a0'); // 珊瑚
const bgMint = acBox('#d8f5f0', 'rgba(60,190,170,0.18)', 'rgba(120,230,210,0.12)', '#88d8c8'); // 薄荷

// 配色变体：prop 值 + 展示文案 + 飘带正面色（与 title.module.less 的 --rf 一致）
const COLOR_VARIANTS: [TitleColor, string, string][] = [
    ['default', '默认绿', '#27d039'],
    ['app-pink', '粉色', '#f8a6b2'],
    ['purple', '紫色', '#b77dee'],
    ['app-blue', '蓝色', '#889df0'],
    ['app-yellow', '黄色', '#f7cd67'],
    ['app-orange', '橙色', '#e59266'],
    ['app-teal', '青色', '#82d5bb'],
    ['app-green', '绿色', '#8ac68a'],
    ['app-red', '红色', '#fc736d'],
    ['lime-green', '青柠', '#d1da49'],
    ['yellow-green', '黄绿', '#ecdf52'],
    ['brown', '棕色', '#9a835a'],
    ['warm-peach-pink', '暖桃粉', '#e18c6f'],
];

const TitleDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Title <DemoTag>标题</DemoTag>
        </div>

        <div style={labelStyle}>全部类型（随机取色）</div>
        <div style={{ ...bgSky, display: 'flex', flexWrap: 'wrap', gap: '32px 50px' }}>
            {(
                [
                    ['layer', '双层纸'],
                    ['ribbon', '飘带类型'],
                    ['tab', '折角便签'],
                ] as const
            ).map(([variant, text]) => (
                <Title
                    key={variant}
                    variant={variant}
                    color={COLOR_VARIANTS[Math.floor(Math.random() * COLOR_VARIANTS.length)][0]}
                >
                    {text}
                </Title>
            ))}
        </div>

        <div style={labelStyle}>配色变体（默认双层纸 Layer）</div>
        <div style={{ ...bgSand, display: 'flex', flexWrap: 'wrap', gap: '32px 50px' }}>
            {COLOR_VARIANTS.map(([color, label, ribbonColor]) => (
                <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <Title color={color}>{label}</Title>
                    <span
                        style={{
                            fontSize: 12,
                            color: ribbonColor,
                            fontWeight: 600,
                            fontFamily: "'Nunito', 'Noto Sans SC', sans-serif",
                        }}
                    >
                        {color}
                    </span>
                </div>
            ))}
        </div>

        <div style={labelStyle}>尺寸</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {(
                [
                    ['small', '小尺寸', bgCoral, '小标题'],
                    ['middle', '中尺寸（默认）', bgMint, '中等标题'],
                    ['large', '大尺寸', bgLavender, '大号标题'],
                ] as ['small' | 'middle' | 'large', string, React.CSSProperties, string][]
            ).map(([size, text, bg, title]) => (
                <div key={size} style={{ flex: '1 1 200px', minWidth: 180 }}>
                    <div style={labelStyle}>{text}</div>
                    <div style={bg}>
                        <Title size={size}>{title}</Title>
                    </div>
                </div>
            ))}
        </div>

        <div style={labelStyle}>支持英文与表情</div>
        <div style={bgSky}>
            <Title>🎮 LET&apos;S PLAY!</Title>
        </div>

        <div style={labelStyle}>飘带标题（variant="ribbon"）</div>
        <div style={bgGreen}>
            <Title variant="ribbon">飘带类型</Title>
        </div>

        <div style={labelStyle}>双层纸 Layer</div>
        <div style={bgGreen}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px 40px' }}>
                <Title variant="layer" color="app-yellow">
                    蜂蜜阳光
                </Title>
                <Title variant="layer" color="app-blue">
                    海风信箱
                </Title>
            </div>
        </div>

        <div style={labelStyle}>折角便签 Corner Tab</div>
        <div style={bgLavender}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px 40px' }}>
                <Title variant="tab" color="lime-green">
                    青柠苏打
                </Title>
                <Title variant="tab" color="brown">
                    热可可
                </Title>
            </div>
        </div>

        <CodeBlock
            code={`import { Title } from 'animal-island-ui';

const App = () => (
    <>
        <Title>飘带类型</Title>
        <Title size="small">小标题</Title>
        <Title size="large" color="app-pink">大号粉色</Title>
        <Title color="purple">紫色标题</Title>
        <Title variant="layer" color="app-yellow">双层纸</Title>
        <Title variant="tab" color="lime-green">折角便签</Title>
    </>
);

export default App;`}
        />
        <ApiTable rows={TITLE_API} />
    </div>
);

export default TitleDemo;
