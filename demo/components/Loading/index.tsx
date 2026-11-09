import React, { useEffect, useRef, useState } from 'react';
import { Loading, LoadingType, Button } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const LOADING_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '加载屏形态：snow 全屏落雪 / circle 圆形扩散展开',
        type: "'snow' | 'circle'",
        defaultVal: "'snow'",
    },
    {
        prop: 'showBoat',
        desc: 'circle 形态下是否显示帆船；false 时只留遮罩背景',
        type: 'boolean',
        defaultVal: 'true',
    },
    { prop: 'active', desc: 'true / false 控制开启关闭；false 时落雪渐变消失', type: 'boolean', defaultVal: 'true' },
    { prop: 'tip', desc: '中央提示文字', type: 'ReactNode', defaultVal: '-' },
    { prop: 'delay', desc: '延迟显示时间（毫秒），避免加载快速结束时闪烁', type: 'number', defaultVal: '0' },
    {
        prop: 'fadeDuration',
        desc: '渐变消失时长（秒）；circle 下为圆形扩散展开的时长',
        type: 'number',
        defaultVal: '0.6',
    },
    { prop: 'zIndex', desc: '全屏层级（默认 3000，高于 Notification 的 2000）', type: 'number', defaultVal: '3000' },
    { prop: 'className / style / aria-*', desc: '透传到根元素', type: '-', defaultVal: '-' },
];

const LoadingDemo: React.FC = () => {
    const [active, setActive] = useState(false);
    const [type, setType] = useState<LoadingType>('snow');
    const [showBoat, setShowBoat] = useState(true);
    const [tip, setTip] = useState<string | undefined>();
    const [delay, setDelay] = useState(0);
    const timerRef = useRef<number>(undefined);

    useEffect(() => () => window.clearTimeout(timerRef.current), []);

    // 播放一次：2.4s 后自动关闭，随后落雪渐变消失
    const play = (opts?: { tip?: string; delay?: number; type?: LoadingType; showBoat?: boolean }) => {
        window.clearTimeout(timerRef.current);
        setTip(opts?.tip);
        setDelay(opts?.delay ?? 0);
        setType(opts?.type ?? 'snow');
        setShowBoat(opts?.showBoat ?? true);
        setActive(true);
        timerRef.current = window.setTimeout(() => setActive(false), 2400);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Loading <DemoTag>全屏落雪</DemoTag> <DemoTag>圆形扩散展开</DemoTag> <DemoTag>渐变消失</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>
                    形态切换 — type='snow' 是全屏落雪，type='circle'
                    关闭时从中心圆形扩散展开，右下角有一艘随波逐流的帆船
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                    <Button onClick={() => play({ type: 'snow' })}>落雪型</Button>
                    <Button onClick={() => play({ type: 'circle' })}>圆形展开型</Button>
                    <Button onClick={() => play({ type: 'circle', tip: '正在驶向岛屿…' })}>
                        圆形展开型 · 带提示文字
                    </Button>
                    <Button onClick={() => play({ type: 'circle', showBoat: false })}>圆形展开型 · 不显示帆船</Button>
                </div>

                <div style={labelStyle}>基础播放 — 点击后全屏落雪覆盖 2.4s，结束时渐变消失</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                    <Button onClick={() => play()}>纯落雪</Button>
                    <Button onClick={() => play({ tip: '正在连接岛屿…' })}>带提示文字</Button>
                    <Button onClick={() => play({ tip: '等雪停…', delay: 300 })}>delay 300ms</Button>
                    <Button onClick={() => play({ tip: '慢速渐隐' })}>fadeDuration 1.2s</Button>
                </div>

                <div style={labelStyle}>
                    delay 防闪烁 — 快速结束时（600ms 模拟加载）无 delay 的落雪会闪一下，delay 300ms 的几乎不出现
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                    <Button
                        onClick={() => {
                            window.clearTimeout(timerRef.current);
                            setTip('无 delay');
                            setDelay(0);
                            setType('snow');
                            setActive(true);
                            timerRef.current = window.setTimeout(() => setActive(false), 600);
                        }}
                    >
                        模拟 600ms 加载（无 delay）
                    </Button>
                    <Button
                        onClick={() => {
                            window.clearTimeout(timerRef.current);
                            setTip('delay 300ms');
                            setDelay(300);
                            setType('snow');
                            setActive(true);
                            timerRef.current = window.setTimeout(() => setActive(false), 600);
                        }}
                    >
                        模拟 600ms 加载（delay 300ms）
                    </Button>
                </div>
            </div>

            <CodeBlock
                code={`import { Loading } from 'animal-island-ui';

// 全屏落雪（默认形态）
<Loading active={active} />

// 圆形扩散展开，右下角带一艘帆船
<Loading active={active} type="circle" tip="正在驶向岛屿…" />

// 只要圆形展开，不要帆船
<Loading active={active} type="circle" showBoat={false} />

// 中央提示文字
<Loading active={active} tip="正在连接岛屿…" />

// 延迟显示：加载快速结束时避免落雪闪烁
<Loading active={active} delay={300} />

// 慢速渐隐 + 自定义层级
<Loading active={active} fadeDuration={1.2} zIndex={5000} />`}
            />
            <ApiTable rows={LOADING_API} />

            <Loading
                active={active}
                type={type}
                showBoat={showBoat}
                tip={tip}
                delay={delay}
                fadeDuration={tip === '慢速渐隐' ? 1.2 : 0.6}
                zIndex={3000}
            />
        </div>
    );
};

export default LoadingDemo;
