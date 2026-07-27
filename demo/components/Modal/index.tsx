import React, { useState } from 'react';
import { Button, Modal } from '../../../src';
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

const MODAL_API: ApiRow[] = [
    {
        prop: 'open',
        desc: '是否可见',
        type: 'boolean',
        defaultVal: '-',
        required: true,
    },
    { prop: 'title', desc: '标题', type: 'ReactNode', defaultVal: '-' },
    { prop: 'width', desc: '宽度', type: 'number | string', defaultVal: '520' },
    {
        prop: 'maskClosable',
        desc: '点击遮罩关闭',
        type: 'boolean',
        defaultVal: 'true',
    },
    {
        prop: 'footer',
        desc: '底部按钮区域，传 null 则不显示',
        type: 'ReactNode | null',
        defaultVal: '默认按钮',
    },
    { prop: 'onClose', desc: '关闭回调', type: '() => void', defaultVal: '-' },
    { prop: 'onOk', desc: '确认回调', type: '() => void', defaultVal: '-' },
    {
        prop: 'children',
        desc: '自定义内容',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'className',
        desc: '自定义类名',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'typeSpeed',
        desc: '打字机每字间隔 (ms)',
        type: 'number',
        defaultVal: '80',
    },
    {
        prop: 'typewriter',
        desc: '是否启用打字机效果',
        type: 'boolean',
        defaultVal: 'true',
    },
    {
        prop: 'maskStyle',
        desc: '遮罩层自定义样式',
        type: 'CSSProperties',
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

const ModalDemo: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [customFooterOpen, setCustomFooterOpen] = useState(false);
    const [noTypewriterOpen, setNoTypewriterOpen] = useState(false);
    const [lightMaskOpen, setLightMaskOpen] = useState(false);
    const [darkMaskOpen, setDarkMaskOpen] = useState(false);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Modal <DemoTag>弹窗</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>基础弹窗</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setModalOpen(true)}>
                        基础 Modal
                    </Button>
                    <Button onClick={() => setTitleModalOpen(true)}>带标题 Modal</Button>
                    <Button type="dashed" onClick={() => setCustomFooterOpen(true)}>
                        自定义 Footer
                    </Button>
                </div>
                <div style={labelStyle}>关闭打字机效果</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setNoTypewriterOpen(true)}>
                        关闭打字机效果
                    </Button>
                </div>
                <div style={labelStyle}>自定义遮罩样式</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setLightMaskOpen(true)}>
                        浅色遮罩
                    </Button>
                    <Button type="primary" onClick={() => setDarkMaskOpen(true)}>
                        深色遮罩
                    </Button>
                </div>
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} onOk={() => setModalOpen(false)}>
                <div
                    style={{
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <span>
                        钓到<span style={{ color: '#FD9303' }}>石头</span>了!
                    </span>
                    <span>竟然连这种都能钓起来...</span>
                </div>
            </Modal>
            <Modal
                open={titleModalOpen}
                title="博物馆捐赠"
                onClose={() => setTitleModalOpen(false)}
                onOk={() => setTitleModalOpen(false)}
            >
                是否愿意将这条鱼捐赠给博物馆呢？傅达会好好照顾它的！这可是博物馆的新展品哦~
            </Modal>
            <Modal
                open={customFooterOpen}
                title="确认操作"
                onClose={() => setCustomFooterOpen(false)}
                footer={
                    <>
                        <Button onClick={() => setCustomFooterOpen(false)}>再想想</Button>
                        <Button type="primary" danger onClick={() => setCustomFooterOpen(false)}>
                            确认搬家
                        </Button>
                    </>
                }
            >
                确定要让这位居民搬走吗？这个操作不可撤销。
            </Modal>
            <Modal
                open={noTypewriterOpen}
                title="天气预报"
                onClose={() => setNoTypewriterOpen(false)}
                onOk={() => setNoTypewriterOpen(false)}
                typewriter={false}
            >
                明天天气晴朗，气温 20-28°C，适合外出活动！
            </Modal>
            <Modal
                open={lightMaskOpen}
                title="浅色遮罩"
                onClose={() => setLightMaskOpen(false)}
                onOk={() => setLightMaskOpen(false)}
                maskStyle={{ background: 'rgba(0, 0, 0, 0.08)' }}
            >
                这是一个浅色遮罩的弹窗，遮罩几乎透明。
            </Modal>
            <Modal
                open={darkMaskOpen}
                title="深色遮罩"
                onClose={() => setDarkMaskOpen(false)}
                onOk={() => setDarkMaskOpen(false)}
                maskStyle={{ background: 'rgba(0, 0, 0, 0.75)' }}
            >
                这是一个深色遮罩的弹窗，背景更暗、聚焦感更强。
            </Modal>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Button, Modal } from 'animal-island-ui';

const App = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button type="primary" onClick={() => setOpen(true)}>打开 Modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} onOk={() => setOpen(false)}>
                Modal 内容
            </Modal>

            {/* 带标题 */}
            <Modal open={open} title="标题" onClose={() => setOpen(false)}>
                内容
            </Modal>

            {/* 自定义 Footer */}
            <Modal open={open} title="确认" footer={<Button>自定义按钮</Button>}>
                内容
            </Modal>

            {/* 无 Footer */}
            <Modal open={open} footer={null}>
                无底部按钮
            </Modal>

            {/* 关闭打字机效果 */}
            <Modal open={open} typewriter={false}>
                直接显示全部内容
            </Modal>

            {/* 自定义遮罩样式 */}
            <Modal open={open} maskStyle={{ background: 'rgba(0, 0, 0, 0.08)' }}>
                浅色遮罩
            </Modal>
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={MODAL_API} />
        </div>
    );
};

export default ModalDemo;
