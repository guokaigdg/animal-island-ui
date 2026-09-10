import React from 'react';
import { Background } from '../../../src';
import type { BackgroundType } from '../../../src';
import { labelStyle, sectionStyle, sectionTitleStyle, DemoTag, ApiTable, ApiRow, CodeBlock } from '../../tools';

// 彩蛋：hover 预览块 → 整个 demo 站点壁纸同步切换为该图案；移开还原
const dispatchPageBg = (type: BackgroundType | 'reset') => () =>
    window.dispatchEvent(new CustomEvent('demo-bg-easter-egg', { detail: type }));

const BACKGROUND_TYPE_UNION =
    "'default' | 'grid' | 'dots-dark-green' | 'sprinkles' | 'dots-pink' | 'dots-purple' | 'dots-blue' | 'dots-yellow' | 'dots-orange' | 'dots-teal' | 'dots-green' | 'dots-red' | 'dots-lime-green' | 'dots-yellow-green' | 'dots-brown' | 'dots-warm-peach-pink'";

const BACKGROUND_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '背景图案类型（dots-* 底色与 Card pattern-* 系列一致）',
        type: BACKGROUND_TYPE_UNION,
        defaultVal: "'default'",
    },
    { prop: 'children', desc: '子内容，渲染在图案背景之上', type: 'ReactNode', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
    { prop: '...rest', desc: '透传其余 div 原生属性', type: 'HTMLAttributes', defaultVal: '-' },
];

const previewBox: React.CSSProperties = {
    display: 'grid',
    placeItems: 'center',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    color: '#725d42',
    fontWeight: 600,
    fontSize: 15,
};

// 全部 16 种类型（type / 中文名 / 文字色），dots-* 底色对应 Card pattern-* 系列，文字色与 Card pattern 系列保持一致
const CARD_COLORS: ReadonlyArray<[BackgroundType, string, string]> = [
    ['default', '奶油色波点（默认）', '#725d42'],
    ['grid', '网格', '#725d42'],
    ['dots-dark-green', '深绿波点', '#3a6b3a'],
    ['sprinkles', '彩色针糖', '#725d42'],
    ['dots-pink', '应用粉', '#a85565'],
    ['dots-purple', '紫色', '#6a3a9a'],
    ['dots-blue', '应用蓝', '#4a5a8a'],
    ['dots-yellow', '应用黄', '#7a6528'],
    ['dots-orange', '应用橙', '#8a4a2a'],
    ['dots-teal', '应用青', '#2a6b5a'],
    ['dots-green', '应用绿', '#3a6b3a'],
    ['dots-red', '应用红', '#9a3a3a'],
    ['dots-lime-green', '青柠绿', '#5a6b28'],
    ['dots-yellow-green', '黄绿色', '#6a5a28'],
    ['dots-brown', '棕色', '#5a4a2a'],
    ['dots-warm-peach-pink', '暖桃粉', '#8a4a2a'],
];

const BackgroundDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Background <DemoTag>16 types · Card pattern base · zero image assets</DemoTag>
        </div>
        <div style={labelStyle}>全部类型（dots-* 底色对应 Card pattern-* 系列，hover 预览整站壁纸）</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {CARD_COLORS.map(([type, cn, color]) => (
                <Background
                    key={type}
                    type={type}
                    style={{
                        width: type === 'sprinkles' ? 348 : 168,
                        height: 120,
                        borderRadius: 14,
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 600,
                        color,
                    }}
                    onMouseEnter={dispatchPageBg(type)}
                    onMouseLeave={dispatchPageBg('reset')}
                >
                    <span style={{ textAlign: 'center', lineHeight: 1.5 }}>
                        <span style={{ display: 'block', fontSize: 14 }}>{type}</span>
                        <span style={{ display: 'block', fontSize: 12, opacity: 0.85 }}>{cn}</span>
                    </span>
                </Background>
            ))}
        </div>
        <div style={{ ...labelStyle, marginTop: 24 }}>承载内容（children 渲染在图案之上）</div>
        <Background type="sprinkles" style={{ ...previewBox, padding: 24 }}>
            <span>卡片内容、表单、图表都可以放在这里</span>
        </Background>
        <CodeBlock
            code={`import React from 'react';
import { Background } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 奶油色波点壁纸（默认） */}
            <Background style={{ height: 200 }} />

            {/* 网格壁纸 */}
            <Background type="grid" style={{ height: 200 }} />

            {/* 深绿波点壁纸 */}
            <Background type="dots-dark-green" style={{ height: 200 }} />

            {/* 彩色针糖壁纸 */}
            <Background type="sprinkles" style={{ height: 200 }} />

            {/* 底色对应 Card pattern-* 系列壁纸 */}
            <Background type="dots-blue" style={{ height: 200 }} />

            {/* 作为内容区块的背景容器 */}
            <Background type="sprinkles" style={{ minHeight: 200, padding: 24 }}>
                <p>内容渲染在图案背景之上</p>
            </Background>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={BACKGROUND_API} />
    </div>
);

export default BackgroundDemo;
