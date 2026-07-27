import React, { useState } from 'react';
import { Typewriter, Button } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    demoDashedBoxStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const TYPEWRITER_API: ApiRow[] = [
    {
        prop: 'children',
        desc: '需要逐字显示的内容，支持 ReactNode',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'speed',
        desc: '每字间隔 (ms)',
        type: 'number',
        defaultVal: '90',
    },
    {
        prop: 'trigger',
        desc: '值变化时重新播放',
        type: 'unknown',
        defaultVal: '-',
    },
    {
        prop: 'autoPlay',
        desc: '是否自动从头开始播放',
        type: 'boolean',
        defaultVal: 'true',
    },
    {
        prop: 'onDone',
        desc: '播放完成回调',
        type: '() => void',
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

const TypewriterDemo: React.FC = () => {
    const [replayKey, setReplayKey] = useState(0);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Typewriter <DemoTag>打字机</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div>
                    <div style={labelStyle}>基础用法</div>
                    <div style={{ ...demoDashedBoxStyle, marginBottom: 20 }}>
                        <Typewriter trigger={replayKey}>你好，欢迎来到动物岛！今天的天气真不错呢～</Typewriter>
                    </div>
                </div>

                <div>
                    <div style={labelStyle}>保留多行与富内容 (速度 40ms)</div>
                    <div
                        style={{
                            ...demoDashedBoxStyle,
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginBottom: 20,
                            gap: 8,
                        }}
                    >
                        <Typewriter speed={40} trigger={replayKey}>
                            <div>第一行：钓到石头了！</div>
                            <div>第二行：竟然连这种都能钓起来...</div>
                            <div style={{ color: '#FD9303', fontWeight: 700 }}>第三行：继续加油吧！</div>
                        </Typewriter>
                    </div>
                </div>

                <div style={S.row}>
                    <Button type="primary" onClick={() => setReplayKey((k) => k + 1)}>
                        重新播放
                    </Button>
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Typewriter } from 'animal-island-ui';

const App = () => {
    const [key, setKey] = useState(0);
    return (
        <>
            <Typewriter trigger={key}>
                你好，欢迎来到动物岛！
            </Typewriter>

            {/* 支持多行与内联样式 */}
            <Typewriter speed={40} trigger={key}>
                <div>第一行</div>
                <div style={{ color: 'orange' }}>第二行</div>
            </Typewriter>

            <button onClick={() => setKey(k => k + 1)} style={{ marginBottom: 20 }}>重新播放</button>
        </>
    );
};

export default App;`}
            />
            <ApiTable rows={TYPEWRITER_API} />
        </div>
    );
};

export default TypewriterDemo;
