import React, { useEffect, useState } from 'react';
import { Button, Progress } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    tagStyle,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const S = {
    barRow: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 14,
        maxWidth: 720,
        width: '100%',
    },
    controls: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap' as const,
        alignItems: 'center',
    } as React.CSSProperties,
    sliderRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    } as React.CSSProperties,
    sliderLabel: {
        minWidth: 56,
        fontSize: 13,
        color: '#725d42',
        fontWeight: 600,
    } as React.CSSProperties,
    input: {
        flex: 1,
        height: 28,
        padding: '0 12px',
        borderRadius: 14,
        border: '1.5px solid #c4b89e',
        background: 'rgb(247, 243, 223)',
        color: '#725d42',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        outline: 'none',
    } as React.CSSProperties,
};

const PROGRESS_API: ApiRow[] = [
    { prop: 'percent', desc: '当前百分比 (0-100,自动 clamp)', type: 'number', defaultVal: '-', required: true },
    { prop: 'size', desc: '尺寸', type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
    { prop: 'showInfo', desc: '是否显示百分比文字', type: 'boolean', defaultVal: 'true' },
    { prop: 'infoPosition', desc: '百分比文字位置', type: `'inside' | 'right' | 'top'`, defaultVal: "'inside'" },
    { prop: 'infoFormat', desc: '自定义文字格式化', type: '(percent: number) => ReactNode', defaultVal: '${percent}%' },
    { prop: 'duration', desc: 'fill 宽度动画时长(秒),0 = 不动画;不影响斜纹滚动', type: 'number', defaultVal: '0.6' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const ProgressDemo: React.FC = () => {
    // 动态滑块控制 percent
    const [pct, setPct] = useState(45);
    // 模拟上传进度
    const [uploadPct, setUploadPct] = useState(0);
    const [uploading, setUploading] = useState(false);
    // 模拟采集经验
    const [expPct, setExpPct] = useState(72);
    // 自定义格式化: 6/10 任务
    const taskPct = 6;

    useEffect(() => {
        if (!uploading) return;
        const id = window.setInterval(() => {
            setUploadPct((p) => {
                if (p >= 100) {
                    window.setTimeout(() => {
                        setUploading(false);
                        setUploadPct(0);
                    }, 600);
                    return 100;
                }
                return p + 5;
            });
        }, 220);
        return () => window.clearInterval(id);
    }, [uploading]);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Progress <span style={tagStyle}>进度条</span> <span style={tagStyle}>斜纹滚动</span>
            </div>
            <div style={demoBodyStyle}>
                {/* ---- 1. 基础 ---- */}
                <div style={labelStyle}>基础用法</div>
                <div style={S.barRow}>
                    <Progress percent={25} />
                    <Progress percent={50} />
                    <Progress percent={100} />
                </div>

                {/* ---- 2. 尺寸 ---- */}
                <div style={labelStyle}>size — 三档尺寸</div>
                <div style={S.barRow}>
                    <Progress percent={50} size="small" />
                    <Progress percent={50} size="middle" />
                    <Progress percent={50} size="large" />
                </div>

                {/* ---- 3. 文字位置 ---- */}
                <div style={labelStyle}>infoPosition — 百分比文字位置</div>
                <div style={S.barRow}>
                    <Progress percent={pct} infoPosition="inside" />
                    <Progress percent={pct} infoPosition="right" />
                    <Progress percent={pct} infoPosition="top" />
                </div>

                {/* ---- 4. 受控滑块 ---- */}
                <div style={labelStyle}>受控 — 滑块驱动 percent (0–100,自动 clamp)</div>
                <div style={S.sliderRow}>
                    <span style={S.sliderLabel}>percent:</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={pct}
                        onChange={(e) => setPct(parseInt(e.target.value, 10))}
                        style={{ flex: 1 }}
                    />
                    <span style={{ minWidth: 48, textAlign: 'right', fontWeight: 700, color: '#19c8b9' }}>{pct}%</span>
                </div>
                <Progress percent={pct} infoPosition="right" />

                {/* ---- 5. 经典场景: 上传/经验/任务 ---- */}
                <div style={labelStyle}>经典场景 — 上传 / 经验 / 任务</div>
                <div style={S.barRow}>
                    {/* 上传进度 */}
                    <div>
                        <div style={{ fontSize: 12, color: '#9f927d', marginBottom: 4, fontWeight: 600 }}>
                            岛屿截图上传
                        </div>
                        <Progress
                            percent={uploadPct}
                            infoFormat={(p: number) => (p >= 100 ? '上传完成 ✓' : `${Math.round(p)}%`)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Button
                                size="small"
                                type="primary"
                                disabled={uploading}
                                onClick={() => {
                                    setUploadPct(0);
                                    setUploading(true);
                                }}
                            >
                                {uploading ? '上传中…' : '开始上传'}
                            </Button>
                        </div>
                    </div>

                    {/* 岛屿经验 */}
                    <div>
                        <div style={{ fontSize: 12, color: '#9f927d', marginBottom: 4, fontWeight: 600 }}>
                            岛屿评价经验
                        </div>
                        <Progress
                            percent={expPct}
                            infoFormat={(p: number) => `${Math.round((p / 100) * 5000)} / 5000 星`}
                        />
                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <Button size="small" onClick={() => setExpPct((p) => Math.max(0, p - 10))}>
                                −10
                            </Button>
                            <Button size="small" onClick={() => setExpPct((p) => Math.min(100, p + 10))}>
                                +10
                            </Button>
                        </div>
                    </div>

                    {/* 任务进度 (自定义格式化) */}
                    <div>
                        <div style={{ fontSize: 12, color: '#9f927d', marginBottom: 4, fontWeight: 600 }}>
                            今日 DIY 任务
                        </div>
                        <Progress
                            percent={taskPct}
                            infoPosition="right"
                            infoFormat={(p: number) => `${Math.round((p / 100) * 10)} / 10`}
                        />
                    </div>
                </div>

                {/* ---- 6. 关闭 fill 宽度动画 ---- */}
                <div style={labelStyle}>duration=0 — 关闭 fill 宽度动画(斜纹滚动不受影响)</div>
                <Progress percent={pct} duration={0} infoPosition="right" />

                {/* ---- 7. 无文字 ---- */}
                <div style={labelStyle}>showInfo=false — 只渲染条,不带文字</div>
                <div style={S.barRow}>
                    <Progress percent={33} showInfo={false} size="small" />
                    <Progress percent={66} showInfo={false} size="middle" />
                    <Progress percent={100} showInfo={false} size="large" />
                </div>
            </div>

            <CodeBlock
                code={`import React, { useState } from 'react';
import { Progress, Button } from 'animal-island-ui';

const App = () => {
    const [pct, setPct] = useState(45);
    return (
        <>
            {/* 基础 - 斜纹滚动 fill */}
            <Progress percent={pct} />

            {/* 尺寸 */}
            <Progress percent={50} size="small" />
            <Progress percent={50} size="large" />

            {/* 文字位置 */}
            <Progress percent={pct} infoPosition="inside" />
            <Progress percent={pct} infoPosition="right" />
            <Progress percent={pct} infoPosition="top" />

            {/* 自定义格式化 (例如: 5/10 任务) */}
            <Progress
                percent={50}
                infoFormat={p => \`\${Math.round(p/10)}/10\`}
            />

            {/* 关闭 fill 宽度动画 */}
            <Progress percent={pct} duration={0} />

            {/* 无文字 */}
            <Progress percent={75} showInfo={false} />
        </>
    );
};

export default App;`}
            />
            <ApiTable rows={PROGRESS_API} />
        </div>
    );
};

export default ProgressDemo;
