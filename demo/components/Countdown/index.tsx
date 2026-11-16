import React, { useState } from 'react';
import { CountdownReminderDemo } from './CountdownReminderDemo';
import { Button, Countdown, Notification } from '../../../src';
import { ApiRow, ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';

const COUNTDOWN_API: ApiRow[] = [
    { prop: 'value', desc: '结束时间', type: 'number | Date', defaultVal: '-', required: true },
    { prop: 'format', desc: 'DD / HH / mm / ss 格式模板', type: 'string', defaultVal: "'HH:mm:ss'" },
    { prop: 'prefix', desc: '倒计时前的说明内容', type: 'ReactNode', defaultVal: '-' },
    { prop: 'size', desc: '尺寸', type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
    { prop: 'variant', desc: '显示风格', type: `'default' | 'island'`, defaultVal: "'default'" },
    { prop: 'bordered', desc: '数字块是否带边框', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'reminder',
        desc: 'true 开启默认提醒（60 秒橙色 / 10 秒红色），数组自定义秒数与颜色',
        type: 'boolean | readonly CountdownReminderRule[]',
        defaultVal: 'false',
    },
    {
        prop: 'shake',
        desc: '兼容布尔值与秒数；对象自定义阈值、加强阶段、速度、幅度与缓动',
        type: 'boolean | number | CountdownShakeOptions',
        defaultVal: 'false',
    },
    { prop: 'onChange', desc: '剩余毫秒变化回调', type: '(remaining: number) => void', defaultVal: '-' },
    { prop: 'onFinish', desc: '归零回调', type: '() => void', defaultVal: '-' },
];

const CountdownDemo: React.FC = () => {
    const [deadline, setDeadline] = useState(() => Date.now() + 90_061_000);
    const reset = () => setDeadline(Date.now() + 90_061_000);

    const [shortDeadline, setShortDeadline] = useState(() => Date.now() + 5_000);
    const [finished, setFinished] = useState(false);
    const restartShort = () => {
        setFinished(false);
        setShortDeadline(Date.now() + 10_000);
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Countdown <DemoTag>倒计时</DemoTag> <DemoTag>实时更新</DemoTag>
            </div>

            <div style={labelStyle}>活动倒计时</div>
            <Countdown value={deadline} format="DD 天 HH:mm:ss" prefix="烟火大会开始还有" variant="island" />
            <div style={{ marginTop: 16 }}>
                <Button size="small" onClick={reset}>
                    重新计时
                </Button>
            </div>

            <div style={labelStyle}>default 风格</div>
            <Countdown value={deadline} format="DD 天 HH:mm:ss" prefix="活动结束还有" />

            <div style={labelStyle}>无边框 / 带边框</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <Countdown value={deadline} format="HH:mm:ss" />
                <Countdown value={deadline} format="HH:mm:ss" bordered />
                <Countdown value={deadline} format="HH:mm:ss" variant="island" />
                <Countdown value={deadline} format="HH:mm:ss" variant="island" bordered />
            </div>

            <div style={labelStyle}>onFinish 回调</div>
            <Countdown
                value={shortDeadline}
                prefix={finished ? '已结束' : '商店关门还有'}
                onFinish={() => {
                    setFinished(true);
                    Notification.success('倒计时结束，商店已关门');
                }}
            />
            <div style={{ marginTop: 16 }}>
                <Button size="small" onClick={restartShort}>
                    再来 10 秒
                </Button>
            </div>

            <CountdownReminderDemo />

            <div style={labelStyle}>尺寸</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Countdown value={deadline} size="small" />
                <Countdown value={deadline} size="middle" />
                <Countdown value={deadline} size="large" />
            </div>

            <CodeBlock
                code={`import { Countdown } from 'animal-island-ui';

<Countdown
    value={Date.now() + 24 * 60 * 60 * 1000}
    format="DD 天 HH:mm:ss"
    prefix="活动结束还有"
    variant="island"
    onFinish={() => console.log('倒计时结束')}
/>

// 颜色提醒：默认 60 秒橙 / 10 秒红，数组可替换全部规则
<Countdown value={deadline} reminder />

// 最后 5 秒抖动，可与颜色提醒叠加
<Countdown value={deadline} reminder shake />`}
            />
            <ApiTable rows={COUNTDOWN_API} />
        </div>
    );
};

export default CountdownDemo;
