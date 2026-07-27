import React from 'react';
import { Card } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const CARD_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '卡片类型',
        type: `'default' | 'dashed'`,
        defaultVal: "'default'",
    },
    {
        prop: 'color',
        desc: '背景颜色类型',
        type: `'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'`,
        defaultVal: "'default'",
    },
    {
        prop: 'pattern',
        desc: '背景花纹类型',
        type: `'none' | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'`,
        defaultVal: "'none'",
    },
    {
        prop: 'children',
        desc: '自定义内容',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: '...',
        desc: '继承 React.HTMLAttributes',
        type: 'HTMLDivElement',
        defaultVal: '-',
    },
];

const S = {
    row: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
};

const CardDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Card <DemoTag>2 types</DemoTag> <DemoTag>13 colors</DemoTag> <DemoTag>14 patterns</DemoTag>
        </div>

        {/* ---- type ---- */}
        <div style={demoBodyStyle}>
            <div style={labelStyle}>type="default"</div>
            <div style={S.row}>
                <Card>
                    <p>基础卡片</p>
                </Card>
                <Card style={{ maxWidth: 560, width: '100%' }}>
                    <p>
                        在a game company 3DS《Animal Island: New Leaf》和《Animal Island: Happy Home
                        Designer》中製作的「我的設計」QR
                        Code，以智慧型裝置讀取就能通過狸端機入口站下載至《集合啦！療癒系海島》。
                    </p>
                </Card>
            </div>
            <div style={labelStyle}>type="dashed"</div>
            <div style={S.row}>
                <Card type="dashed">
                    <p>虚线边框卡片</p>
                </Card>
                <Card type="dashed" style={{ maxWidth: 360, width: '100%' }}>
                    <p>欢迎来到无人岛！虚线边框适合用于轻量提示或次要信息展示。</p>
                </Card>
            </div>
            <div style={labelStyle}>hoverable 启用 hover(默认关闭)</div>
            <div style={S.row}>
                <Card hoverable style={{ width: 260 }}>
                    <p>鼠标移上来看看 ↑</p>
                </Card>
            </div>
        </div>
        {/* ---- pattern ---- */}
        <div style={{ ...demoBodyStyle, gap: 24 }}>
            <div style={labelStyle}>pattern — 风格花纹</div>
            <div style={S.row}>
                <Card pattern="default" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>default</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>默认奶油色</div>
                </Card>
                <Card pattern="app-pink" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-pink</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用粉</div>
                </Card>
                <Card pattern="purple" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>purple</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>紫色</div>
                </Card>
                <Card pattern="app-blue" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-blue</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用蓝</div>
                </Card>
                <Card pattern="app-yellow" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-yellow</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用黄</div>
                </Card>
                <Card pattern="app-orange" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-orange</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用橙</div>
                </Card>
                <Card pattern="app-teal" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-teal</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用青</div>
                </Card>
                <Card pattern="app-green" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-green</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用绿</div>
                </Card>
                <Card pattern="app-red" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>app-red</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>应用红</div>
                </Card>
                <Card pattern="lime-green" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>lime-green</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>青柠绿</div>
                </Card>
                <Card pattern="yellow-green" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>yellow-green</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>黄绿色</div>
                </Card>
                <Card pattern="brown" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>brown</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>棕色</div>
                </Card>
                <Card pattern="warm-peach-pink" style={{ width: 170 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>warm-peach-pink</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>暖桃粉</div>
                </Card>
            </div>
        </div>

        {/* ---- color variants ---- */}
        <div style={demoBodyStyle}>
            <div style={labelStyle}>color</div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: 16,
                    marginBottom: 24,
                }}
            >
                {(
                    [
                        ['default', 'Default', '默认奶油色'],
                        ['app-pink', 'App Pink', '应用粉'],
                        ['purple', 'Purple', '紫色'],
                        ['app-blue', 'App Blue', '应用蓝'],
                        ['app-yellow', 'App Yellow', '应用黄'],
                        ['app-orange', 'App Orange', '应用橙'],
                        ['app-teal', 'App Teal', '应用青'],
                        ['app-green', 'App Green', '应用绿'],
                        ['app-red', 'App Red', '应用红'],
                        ['lime-green', 'Lime Green', '青柠绿'],
                        ['yellow-green', 'Yellow-Green', '黄绿色'],
                        ['brown', 'Brown', '棕色'],
                        ['warm-peach-pink', 'Warm Peach Pink', '暖桃粉'],
                    ] as const
                ).map(([color, en, cn]) => (
                    <Card key={color} color={color as any} style={{ padding: '16px 20px' }}>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 14,
                                marginBottom: 4,
                            }}
                        >
                            {en}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.85 }}>{cn}</div>
                    </Card>
                ))}
            </div>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Card } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 基础卡片 */}
            <Card style={{ width: 260 }}>
                基础卡片
            </Card>

            {/* 虚线卡片 */}
            <Card type="dashed" style={{ width: 260 }}>
                虚线卡片
            </Card>

            {/* 颜色变体 */}
            <Card color="app-blue">
                蓝色卡片
            </Card>
            <Card color="warm-peach-pink">
                暖桃粉卡片
            </Card>

            {/* 花纹 */}
            <Card pattern="default">
                默认花纹卡片
            </Card>

            {/* 启用 hover(默认关闭,显式传 hoverable 才上浮) */}
            <Card hoverable style={{ width: 260 }}>
                鼠标移上来看看 ↑
            </Card>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={CARD_API} />
    </div>
);

export default CardDemo;
