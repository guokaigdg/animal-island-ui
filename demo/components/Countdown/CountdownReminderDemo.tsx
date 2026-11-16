import React, { useState } from 'react';
import { Button, Countdown, type CountdownReminderRule } from '../../../src';
import { labelStyle, textStyle } from '../../tools';

/** 数字下方的说明：比 labelStyle 小一档，不抢倒计时的视觉重心。 */
const captionStyle: React.CSSProperties = { ...textStyle, marginTop: 6, marginBottom: 0 };

/** 自定义规则不依赖顺序，展示与默认橙红配色不同的两档提醒。 */
const CUSTOM_REMINDERS: readonly CountdownReminderRule[] = [
    { seconds: 5, color: '#b25770' },
    { seconds: 20, color: '#9a6a38' },
];

const RESET_SECONDS = [60, 10, 5];

/** 提醒与抖动共用一条时间线：重置按钮直接跳到不同阶段，无需等待完整一分钟。 */
export const CountdownReminderDemo: React.FC = () => {
    // 初始从橙色阶段进入红色阶段；按钮可重置到阈值附近。
    const [deadline, setDeadline] = useState(() => Date.now() + 15_000);
    return (
        <section aria-label="倒计时颜色提醒演示">
            <div style={labelStyle}>颜色提醒</div>
            <p style={textStyle}>剩余 60 秒转橙、10 秒转红；最后 5 秒数字轻抖。</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
                {RESET_SECONDS.map((seconds) => (
                    <Button key={seconds} size="small" onClick={() => setDeadline(Date.now() + seconds * 1_000)}>
                        重置为 {seconds} 秒
                    </Button>
                ))}
                <Button size="small" onClick={() => setDeadline(Date.now())}>
                    归零
                </Button>
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                    <Countdown value={deadline} format="mm:ss" reminder bordered aria-label="默认提醒倒计时" />
                    <div style={captionStyle}>默认提醒：60 秒橙 / 10 秒红</div>
                </div>
                <div>
                    <Countdown value={deadline} format="mm:ss" reminder={false} aria-label="无提醒倒计时" />
                    <div style={captionStyle}>关闭提醒：保留原配色</div>
                </div>
                <div>
                    <Countdown
                        value={deadline}
                        format="mm:ss"
                        reminder={CUSTOM_REMINDERS}
                        variant="island"
                        bordered
                        aria-label="自定义提醒倒计时"
                    />
                    <div style={captionStyle}>自定义提醒：20 秒暖棕 / 5 秒莓红</div>
                </div>
                <div>
                    <Countdown
                        value={deadline}
                        format="mm:ss"
                        variant="island"
                        reminder
                        shake
                        bordered
                        aria-label="抖动提醒倒计时"
                    />
                    <div style={captionStyle}>抖动提醒：最后 5 秒轻抖</div>
                </div>
            </div>
        </section>
    );
};

CountdownReminderDemo.displayName = 'CountdownReminderDemo';
