import React from 'react';
import { Button, Notification, type NotificationPosition } from '../../../src';
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
    row: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
};

const NOTIFICATION_API: ApiRow[] = [
    { prop: 'message', desc: '通知标题(必填)', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'description',
        desc: '通知描述/正文,支持 ReactNode 富内容',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'type',
        desc: '通知类型(决定默认图标与配色)',
        type: `'success' | 'info' | 'warning' | 'error'`,
        defaultVal: '由调用方法决定',
    },
    {
        prop: 'position',
        desc: '出现位置',
        type: `'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'`,
        defaultVal: "'top'",
    },
    {
        prop: 'duration',
        desc: '自动关闭延时(秒);传 0 关闭自动关闭',
        type: 'number',
        defaultVal: '4.5',
    },
    { prop: 'icon', desc: '自定义图标', type: 'ReactNode', defaultVal: '按 type 默认' },
    {
        prop: 'btn',
        desc: '自定义操作按钮,渲染在关闭按钮左侧',
        type: 'ReactNode',
        defaultVal: '-',
    },
    { prop: 'key', desc: '唯一 key,同 key 二次调用会更新现有通知', type: 'string', defaultVal: '自动生成' },
    { prop: 'onClose', desc: '关闭回调(动画结束触发)', type: '() => void', defaultVal: '-' },
    { prop: 'onClick', desc: '点击通知本体回调', type: '() => void', defaultVal: '-' },
    { prop: 'closeIcon', desc: '自定义关闭图标', type: 'ReactNode', defaultVal: "'×'" },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const STATIC_API: ApiRow[] = [
    {
        prop: 'Notification.open(config)',
        desc: '打开通知,type 默认 info',
        type: '(config | string) => void',
        defaultVal: '-',
    },
    { prop: 'Notification.success(config)', desc: '成功通知', type: '(config | string) => void', defaultVal: '-' },
    { prop: 'Notification.info(config)', desc: '信息通知', type: '(config | string) => void', defaultVal: '-' },
    { prop: 'Notification.warning(config)', desc: '警告通知', type: '(config | string) => void', defaultVal: '-' },
    { prop: 'Notification.error(config)', desc: '错误通知', type: '(config | string) => void', defaultVal: '-' },
    { prop: 'Notification.destroy()', desc: '关闭全部通知', type: '() => void', defaultVal: '-' },
    { prop: 'Notification.destroy(key)', desc: '关闭指定 key 的通知', type: '(key: string) => void', defaultVal: '-' },
    {
        prop: 'Notification(config)',
        desc: '默认调用,等价于 Notification.open(config)',
        type: '(config | string) => void',
        defaultVal: '-',
    },
];

const POSITIONS: { value: NotificationPosition; label: string }[] = [
    { value: 'top', label: 'top(顶部居中)' },
    { value: 'topLeft', label: 'topLeft(左上)' },
    { value: 'topRight', label: 'topRight(右上)' },
    { value: 'bottom', label: 'bottom(底部居中)' },
    { value: 'bottomLeft', label: 'bottomLeft(左下)' },
    { value: 'bottomRight', label: 'bottomRight(右下)' },
];

const NotificationDemo: React.FC = () => {
    const showAt = (position: NotificationPosition) => {
        Notification.open({
            message: `位置: ${position}`,
            description: '点击通知本体或操作按钮可以触发 onClick。',
            position,
            duration: 3,
        });
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Notification <span style={tagStyle}>命令式</span> <span style={tagStyle}>4 types</span>{' '}
                <span style={tagStyle}>6 positions</span>
            </div>
            <p style={{ ...labelStyle, marginBottom: 12, color: '#7c5734' }}>
                Notification 沿用 antd 风格的命令式 API — 在任意位置调用 <code>Notification.success(...)</code>{' '}
                即可触发,组件会自动挂到 body 根容器。
            </p>

            <div style={demoBodyStyle}>
                <div style={labelStyle}>4 种 type + 字符串简写</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => Notification.success('保存成功!')}>
                        success 字符串
                    </Button>
                    <Button onClick={() => Notification.info('这是一条普通提示')}>info 字符串</Button>
                    <Button onClick={() => Notification.warning('库存不足,请补充')}>warning 字符串</Button>
                    <Button type="primary" danger onClick={() => Notification.error('网络请求失败')}>
                        error 字符串
                    </Button>
                </div>

                <div style={labelStyle}>带 description 描述</div>
                <div style={S.row}>
                    <Button
                        type="primary"
                        onClick={() =>
                            Notification.success({
                                message: '岛屿升级成功',
                                description: '岛屿评价 +1,新访客即将到来。',
                            })
                        }
                    >
                        升级成功
                    </Button>
                    <Button
                        onClick={() =>
                            Notification.info({
                                message: '系统通知',
                                description: '今天有流星雨,记得晚上 8 点去海滩许愿。',
                            })
                        }
                    >
                        系统通知
                    </Button>
                    <Button
                        onClick={() =>
                            Notification.warning({
                                message: '果实快过期',
                                description: '桃子和梨还有 1 天就过期,记得吃掉。',
                            })
                        }
                    >
                        库存警告
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() =>
                            Notification.error({
                                message: '连接失败',
                                description: '与服务器断开连接,请检查网络后重试。',
                            })
                        }
                    >
                        错误详情
                    </Button>
                </div>

                <div style={labelStyle}>6 个 position</div>
                <div style={S.row}>
                    {POSITIONS.map((p) => (
                        <Button key={p.value} onClick={() => showAt(p.value)}>
                            {p.label}
                        </Button>
                    ))}
                </div>

                <div style={labelStyle}>duration 控制自动关闭(秒)</div>
                <div style={S.row}>
                    <Button onClick={() => Notification.info({ message: '5 秒后关闭', duration: 5 })}>
                        duration=5
                    </Button>
                    <Button onClick={() => Notification.info({ message: '停留 10 秒', duration: 10 })}>
                        duration=10
                    </Button>
                    <Button onClick={() => Notification.info({ message: '永不自动关闭(手动 × 关闭)', duration: 0 })}>
                        duration=0(不自动关闭)
                    </Button>
                </div>

                <div style={labelStyle}>onClick / onClose 回调</div>
                <div style={S.row}>
                    <Button
                        type="primary"
                        onClick={() =>
                            Notification.success({
                                message: '点击我',
                                description: '点击通知本体可触发 onClick',
                                onClick: () => alert('通知被点击了!'),
                            })
                        }
                    >
                        onClick 可点击
                    </Button>
                    <Button
                        onClick={() =>
                            Notification.info({
                                message: '观察 console',
                                description: '关闭时会调用 onClose',
                                duration: 2,
                                onClose: () => console.log('Notification closed'),
                            })
                        }
                    >
                        onClose
                    </Button>
                </div>

                <div style={labelStyle}>btn 自定义操作按钮</div>
                <div style={S.row}>
                    <Button
                        type="primary"
                        onClick={() =>
                            Notification.open({
                                message: '收到邻居的礼物',
                                description: '是否接受?',
                                btn: (
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => {
                                            Notification.success('已接受礼物');
                                        }}
                                    >
                                        接受
                                    </Button>
                                ),
                                duration: 0,
                            })
                        }
                    >
                        带 btn 的常驻通知
                    </Button>
                </div>

                <div style={labelStyle}>custom icon / closeIcon</div>
                <div style={S.row}>
                    <Button
                        onClick={() =>
                            Notification.info({
                                message: '自定义 icon',
                                description: '替换默认 type 图标',
                                icon: <span style={{ fontSize: 18 }}>🌿</span>,
                            })
                        }
                    >
                        自定义 icon
                    </Button>
                    <Button
                        onClick={() =>
                            Notification.info({
                                message: '自定义关闭按钮',
                                description: '× 替换为文字',
                                closeIcon: <span style={{ fontSize: 11, fontWeight: 700 }}>CLOSE</span>,
                            })
                        }
                    >
                        自定义 closeIcon
                    </Button>
                </div>

                <div style={labelStyle}>key 更新现有通知(用户关闭后停止后续状态)</div>
                <div style={S.row}>
                    <Button
                        type="primary"
                        onClick={() => {
                            // 同 key 走"原地更新"分支(NotificationPortal L115-124)
                            // 关键:dismissed 必须"点 × 瞬间"置 true,不能等 onClose 退场动画结束 (250ms)
                            // —— 否则在 (click, 退场结束) 区间内排队的 setTimeout 仍会触发 open,
                            // 而那条 0% 还留在 store 里(只是 leaving 态),50% / 100% 就会被同 key "复活"。
                            // closeIcon onClick 同步触发,先于父 button 的 handleCloseClick,setLeaving 之前就把 dismissed 置位。
                            const uploadKey = 'upload';
                            let dismissed = false;
                            const markDismissed = () => {
                                dismissed = true;
                            };
                            const open = (percent: number, type: 'info' | 'success' = 'info', duration = 0) => {
                                if (dismissed) return;
                                Notification.info({
                                    message: percent === 100 ? `上传完成 ${percent}%` : `上传中... ${percent}%`,
                                    key: uploadKey,
                                    type,
                                    duration,
                                    closeIcon: (
                                        <span
                                            onClick={markDismissed}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            ×
                                        </span>
                                    ),
                                    onClose: () => {
                                        dismissed = true;
                                    },
                                });
                            };
                            open(0);
                            setTimeout(() => open(50), 300);
                            setTimeout(() => open(100, 'success', 3), 600);
                        }}
                    >
                        模拟上传进度
                    </Button>
                </div>

                <div style={labelStyle}>destroy 全局控制</div>
                <div style={S.row}>
                    <Button
                        onClick={() => {
                            Notification.info('通知 1');
                            Notification.success('通知 2');
                            Notification.warning('通知 3');
                        }}
                    >
                        弹出 3 条
                    </Button>
                    <Button type="primary" danger onClick={() => Notification.destroy()}>
                        destroy 关闭全部
                    </Button>
                    <Button onClick={() => Notification.destroy('upload')}>destroy('upload') 关闭指定 key</Button>
                </div>
            </div>

            <CodeBlock
                code={`import React from 'react';
import { Notification, Button } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 字符串简写 */}
            <Button onClick={() => Notification.success('保存成功!')}>success 字符串</Button>
            <Button onClick={() => Notification.error('网络请求失败')}>error 字符串</Button>

            {/* 对象 config: 带 description */}
            <Button
                onClick={() =>
                    Notification.success({
                        message: '岛屿升级成功',
                        description: '岛屿评价 +1,新访客即将到来。',
                    })
                }
            >
                升级成功
            </Button>

            {/* 自定义 position (6 个可选) */}
            <Button
                onClick={() =>
                    Notification.warning({
                        message: '顶部居中',
                        position: 'top', // 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'
                    })
                }
            >
                顶部居中
            </Button>

            {/* duration 与 onClose */}
            <Button
                onClick={() =>
                    Notification.info({
                        message: '5 秒后关闭',
                        duration: 5,
                        onClose: () => console.log('closed'),
                    })
                }
            >
                5 秒后关闭
            </Button>
            <Button
                onClick={() =>
                    Notification.info({
                        message: '永不自动关闭',
                        duration: 0,
                    })
                }
            >
                永不自动关闭
            </Button>

            {/* btn 自定义操作按钮 */}
            <Button
                onClick={() =>
                    Notification.open({
                        message: '收到邻居的礼物',
                        description: '是否接受?',
                        btn: <Button size="small" type="primary" onClick={() => Notification.success('已接受礼物')}>接受</Button>,
                        duration: 0,
                    })
                }
            >
                弹出常驻通知
            </Button>

            {/* key 原地更新 + dismissed 闭包 + closeIcon 即时置位:用户点 × 瞬间就停止后续状态。
                关键:不能等 onClose(那个要等 250ms 退场动画),否则在 (click, 退场结束) 区间内
                排队的 setTimeout 仍会触发 open,把 leaving 态的通知"复活"。closeIcon onClick
                同步触发,先于父 button 的 handleCloseClick,setLeaving 之前就把 dismissed 置位。 */}
            <Button
                onClick={() => {
                    const uploadKey = 'upload';
                    let dismissed = false;
                    const markDismissed = () => { dismissed = true; };
                    const open = (percent, type = 'info', duration = 0) => {
                        if (dismissed) return;
                        Notification.info({
                            message: percent === 100 ? \`上传完成 \${percent}%\` : \`上传中... \${percent}%\`,
                            key: uploadKey,
                            type,
                            duration,
                            closeIcon: <span onClick={markDismissed} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer' }}>×</span>,
                            onClose: () => { dismissed = true; },
                        });
                    };
                    open(0);
                    setTimeout(() => open(50), 300);
                    setTimeout(() => open(100, 'success', 3), 600);
                }}
            >
                模拟上传进度
            </Button>

            {/* destroy 全局控制 */}
            <Button onClick={() => Notification.destroy()}>关闭全部</Button>
            <Button onClick={() => Notification.destroy('upload')}>关闭指定 key</Button>
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={NOTIFICATION_API} />
            <div style={{ ...labelStyle, marginTop: 16, color: '#794f27', fontWeight: 700 }}>静态方法</div>
            <ApiTable rows={STATIC_API} />
        </div>
    );
};

export default NotificationDemo;
