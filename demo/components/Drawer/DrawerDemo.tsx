import React, { useState } from 'react';
import { Button } from '../../../src';
import { Drawer } from '../../../src/components/Drawer';
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
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
};

const DRAWER_API: ApiRow[] = [
    {
        prop: 'open',
        desc: '是否可见',
        type: 'boolean',
        defaultVal: '-',
        required: true,
    },
    { prop: 'title', desc: '标题', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'placement',
        desc: '弹出位置',
        type: "'left' | 'right' | 'top' | 'bottom'",
        defaultVal: "'right'",
    },
    { prop: 'width', desc: '宽度（left / right 时生效）', type: 'number | string', defaultVal: '378' },
    { prop: 'height', desc: '高度（top / bottom 时生效）', type: 'number | string', defaultVal: '300' },
    {
        prop: 'maskClosable',
        desc: '点击遮罩关闭',
        type: 'boolean',
        defaultVal: 'true',
    },
    {
        prop: 'pushBackground',
        desc: '背景下沉景深效果',
        type: 'boolean',
        defaultVal: 'true',
    },
    {
        prop: 'footer',
        desc: '底部区域，传 null 或不传则不渲染',
        type: 'ReactNode | null',
        defaultVal: '-',
    },
    { prop: 'onClose', desc: '关闭回调', type: '() => void', defaultVal: '-' },
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
        prop: 'maskStyle',
        desc: '遮罩层自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const DrawerDemo: React.FC = () => {
    const [rightOpen, setRightOpen] = useState(false);
    const [leftOpen, setLeftOpen] = useState(false);
    const [topOpen, setTopOpen] = useState(false);
    const [bottomOpen, setBottomOpen] = useState(false);
    const [noPushOpen, setNoPushOpen] = useState(false);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Drawer <span style={tagStyle}>下沉景深抽屉</span>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>四个方向</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setRightOpen(true)}>
                        右侧抽屉
                    </Button>
                    <Button type="primary" onClick={() => setLeftOpen(true)}>
                        左侧抽屉
                    </Button>
                    <Button type="primary" onClick={() => setTopOpen(true)}>
                        顶部抽屉
                    </Button>
                    <Button type="primary" onClick={() => setBottomOpen(true)}>
                        底部抽屉
                    </Button>
                </div>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>关闭景深</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setNoPushOpen(true)}>
                        关闭景深
                    </Button>
                </div>
            </div>
            <Drawer open={rightOpen} title="岛屿设置" onClose={() => setRightOpen(false)}>
                <p>打开时背景内容会下沉并降亮，突出抽屉主体，形成景深层次。</p>
                <p>适合放置设置项、详情面板等较长的辅助内容。</p>
            </Drawer>
            <Drawer
                open={leftOpen}
                placement="left"
                title="居民名单"
                onClose={() => setLeftOpen(false)}
                footer={
                    <>
                        <Button onClick={() => setLeftOpen(false)}>取消</Button>
                        <Button onClick={() => setLeftOpen(false)}>确定</Button>
                    </>
                }
            >
                <p>左侧滑入的抽屉，背景同样下沉。可放置导航或筛选条件。</p>
            </Drawer>
            <Drawer open={bottomOpen} placement="bottom" title="快捷操作" onClose={() => setBottomOpen(false)}>
                <p>从底部弹出的抽屉，适合放置快捷操作菜单。</p>
            </Drawer>
            <Drawer open={topOpen} placement="top" title="通知公告" onClose={() => setTopOpen(false)}>
                <p>从顶部下滑的抽屉，适合放置通知、公告或全局提示。</p>
            </Drawer>
            <Drawer open={noPushOpen} pushBackground={false} title="无景深" onClose={() => setNoPushOpen(false)}>
                <p>pushBackground=&#123;false&#125; 时退化为普通遮罩抽屉，背景不下沉。</p>
            </Drawer>
            <CodeBlock
                code={`const App = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                打开抽屉
            </Button>
            <Drawer open={open} title="岛屿设置" onClose={() => setOpen(false)}>
                <p>背景会下沉，突出抽屉主体。</p>
            </Drawer>
        </>
    );
};

export default App;`}
            />
            <ApiTable rows={DRAWER_API} />
        </div>
    );
};

export default DrawerDemo;
