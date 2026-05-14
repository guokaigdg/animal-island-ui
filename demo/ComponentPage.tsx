import React, { useState } from 'react';
import { Button, Input, Switch, Modal, Card, Collapse, Divider, Typewriter, Tabs } from '../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    tagStyle,
    demoBodyStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
    demoDashedBoxStyle,
} from './tools';
import TimeDemo from './components/Time';
import PhoneDemo from './components/Phone';
import FooterDemo from './components/Footer';
import IconDemo from './components/Icon/IconDemo';
import TabsDemo from './components/Tabs';
import CheckboxDemo from './components/Checkbox';
import CodeBlockDemo from './components/CodeBlock';
import LoadingDemo from './components/Loading/LoadingDemo';
import type { TabItem } from '../src';

// ============================================
// Styles
// ============================================
const S = {
    pageDesc: {
        fontSize: 14,
        color: '#794f27',
        marginBottom: 20,
    } as React.CSSProperties,
    row: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
    col: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    } as React.CSSProperties,
    demoBox: {
        padding: 16,
        borderRadius: 18,
        fontWeight: 500,
        marginBottom: 20,
    } as React.CSSProperties,
};

// ============================================
// API data
// ============================================
const BUTTON_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '按钮类型',
        type: `'primary' | 'default' | 'dashed' | 'text' | 'link'`,
        defaultVal: "'default'",
    },
    {
        prop: 'size',
        desc: '按钮尺寸',
        type: `'small' | 'middle' | 'large'`,
        defaultVal: "'middle'",
    },
    {
        prop: 'danger',
        desc: '是否危险按钮',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'ghost',
        desc: '是否幽灵按钮（透明背景）',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'block',
        desc: '是否块级按钮',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'loading', desc: '加载状态', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'disabled',
        desc: '禁用状态',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'icon', desc: '图标', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'htmlType',
        desc: '原生 button type',
        type: `'submit' | 'reset' | 'button'`,
        defaultVal: "'button'",
    },
    { prop: 'children', desc: '按钮内容', type: 'ReactNode', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: '...',
        desc: '继承 React.ButtonHTMLAttributes',
        type: 'HTMLButtonElement',
        defaultVal: '-',
    },
];

const INPUT_API: ApiRow[] = [
    {
        prop: 'size',
        desc: '输入框尺寸',
        type: `'small' | 'middle' | 'large'`,
        defaultVal: "'middle'",
    },
    { prop: 'prefix', desc: '前缀图标', type: 'ReactNode', defaultVal: '-' },
    { prop: 'suffix', desc: '后缀图标', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'allowClear',
        desc: '允许清除',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'status',
        desc: '校验状态',
        type: `'error' | 'warning'`,
        defaultVal: '-',
    },
    {
        prop: 'shadow',
        desc: '是否显示阴影',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'onChange',
        desc: '值变化回调',
        type: 'ChangeEventHandler<HTMLInputElement>',
        defaultVal: '-',
    },
    { prop: 'onClear', desc: '清除回调', type: '() => void', defaultVal: '-' },
    {
        prop: '...',
        desc: '继承 React.InputHTMLAttributes',
        type: 'HTMLInputElement',
        defaultVal: '-',
    },
];

const SWITCH_API: ApiRow[] = [
    {
        prop: 'checked',
        desc: '是否选中（受控）',
        type: 'boolean',
        defaultVal: '-',
    },
    {
        prop: 'defaultChecked',
        desc: '默认是否选中',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'size',
        desc: '尺寸',
        type: `'small' | 'default'`,
        defaultVal: "'default'",
    },
    { prop: 'disabled', desc: '禁用', type: 'boolean', defaultVal: 'false' },
    { prop: 'loading', desc: '加载状态', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'checkedChildren',
        desc: '选中时文案',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'unCheckedChildren',
        desc: '未选中时文案',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'onChange',
        desc: '变化回调',
        type: '(checked: boolean) => void',
        defaultVal: '-',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
];

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
];

const CARD_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '卡片类型',
        type: `'default' | 'title' | 'dashed'`,
        defaultVal: "'default'",
    },
    {
        prop: 'color',
        desc: '背景颜色类型',
        type: `'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'`,
        defaultVal: "'default'",
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

const COLLAPSE_API: ApiRow[] = [
    {
        prop: 'question',
        desc: '问题标题',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'answer',
        desc: '答案内容',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'defaultExpanded',
        desc: '是否默认展开',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'disabled',
        desc: '是否禁用',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const CURSOR_API: ApiRow[] = [
    { prop: 'children', desc: '子元素', type: 'ReactNode', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const DIVIDER_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '分隔线类型',
        type: `'line-brown' | 'line-teal' | 'line-white' | 'line-yellow' | 'wave-yellow'`,
        defaultVal: "'line-brown'",
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

// ============================================
// Demo sections
// ============================================
const ButtonDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Button <span style={tagStyle}>6 types</span>
        </div>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>type 按钮类型</div>
            <div style={S.row}>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
            </div>
            <div style={labelStyle}>danger / ghost / loading / disabled 状态</div>
            <div style={S.row}>
                <Button type="primary" danger>
                    Danger
                </Button>
                <Button type="primary" ghost>
                    Ghost
                </Button>
                <Button type="primary" loading>
                    Loading
                </Button>
                <Button type="primary" disabled>
                    Disabled
                </Button>
            </div>
            <div style={labelStyle}>size 尺寸</div>
            <div style={S.row}>
                <Button type="primary" size="small">
                    Small
                </Button>
                <Button type="primary" size="middle">
                    Middle
                </Button>
                <Button type="primary" size="large">
                    Large
                </Button>
            </div>
            <div style={labelStyle}>icon 图标按钮</div>
            <div style={S.row}>
                <Button type="primary" icon={<span>🔍</span>}>
                    搜索
                </Button>
                <Button icon={<span>⭐</span>}>收藏</Button>
                <Button type="dashed" icon={<span>＋</span>}>
                    新增
                </Button>
            </div>
            <div style={labelStyle}>block 块级按钮</div>
            <div style={{ maxWidth: 360 }}>
                <Button type="primary" block>
                    Block Button
                </Button>
            </div>
            <div style={labelStyle}>danger 组合</div>
            <div style={S.row}>
                <Button type="primary" danger>
                    Primary Danger
                </Button>
                <Button danger>Default Danger</Button>
                <Button type="dashed" danger>
                    Dashed Danger
                </Button>
                <Button type="text" danger>
                    Text Danger
                </Button>
                <Button type="link" danger>
                    Link Danger
                </Button>
            </div>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Button } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* Primary */}
            <Button type="primary">Primary</Button>
            {/* Default */}
            <Button>Default</Button>
            {/* Dashed */}
            <Button type="dashed">Dashed</Button>
            {/* Text */}
            <Button type="text">Text</Button>
            {/* Link */}
            <Button type="link">Link</Button>
            {/* Danger */}
            <Button type="primary" danger>Danger</Button>
            {/* Ghost */}
            <Button type="primary" ghost>Ghost</Button>
            {/* Loading */}
            <Button type="primary" loading>Loading</Button>
            {/* Large */}
            <Button type="primary" size="large">Large</Button>
            {/* Icon */}
            <Button type="primary" icon={<span>🔍</span>}>搜索</Button>
            {/* Block */}
            <Button type="primary" block>Block</Button>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={BUTTON_API} />
    </div>
);

const InputDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Input <span style={tagStyle}>3 sizes</span>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>shadow 阴影控制</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="No shadow (default)" />
                    <Input placeholder="With shadow" shadow={true} />
                </div>
                <div style={labelStyle}>基础用法</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Basic input" />
                    <Input
                        placeholder="With clear"
                        allowClear
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClear={() => setInputValue('')}
                    />
                    <Input placeholder="Prefix & Suffix" prefix="🔍" suffix="⏎" />
                </div>
                <div style={labelStyle}>size 尺寸</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Small" size="small" />
                    <Input placeholder="Middle (default)" size="middle" />
                    <Input placeholder="Large" size="large" />
                </div>
                <div style={labelStyle}>status 校验状态</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Error status" status="error" />
                    <Input placeholder="Warning status" status="warning" />
                </div>
                <div style={labelStyle}>disabled 禁用</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Disabled" disabled />
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Input } from 'animal-island-ui';

const App = () => {
    const [val, setVal] = useState('');
    return (
        <div>
            {/* 基础输入框 */}
            <Input placeholder="Basic input" />
            {/* 带清除按钮 */}
            <Input placeholder="With clear" allowClear value={val} onChange={e => setVal(e.target.value)} />
            {/* 前后缀 */}
            <Input placeholder="Prefix" prefix="🔍" suffix="⏎" />
            {/* 小尺寸 */}
            <Input placeholder="Small" size="small" />
            {/* 大尺寸 */}
            <Input placeholder="Large" size="large" />
            {/* 错误状态 */}
            <Input placeholder="Error" status="error" />
            {/* 警告状态 */}
            <Input placeholder="Warning" status="warning" />
            {/* 有阴影 */}
            <Input placeholder="With shadow" shadow={true} />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={INPUT_API} />
        </div>
    );
};

const SwitchDemo: React.FC = () => {
    const [switchChecked, setSwitchChecked] = useState(false);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Switch <span style={tagStyle}>2 sizes</span>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>基础用法</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch checked={switchChecked} onChange={setSwitchChecked} />
                    <span style={{ fontSize: 13 }}>{switchChecked ? 'ON' : 'OFF'}</span>
                </div>
                <div style={labelStyle}>checkedChildren / unCheckedChildren 自定义文案</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
                </div>
                <div style={labelStyle}>size 尺寸</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch defaultChecked />
                    <Switch size="small" defaultChecked />
                </div>
                <div style={labelStyle}>disabled / loading 状态</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch disabled />
                    <Switch loading defaultChecked />
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Switch } from 'animal-island-ui';

const App = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div>
            {/* 受控模式 */}
            <Switch checked={checked} onChange={setChecked} />
            {/* 自定义文案 */}
            <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            {/* 小尺寸 */}
            <Switch size="small" defaultChecked />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={SWITCH_API} />
        </div>
    );
};

const CardDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Card <span style={tagStyle}>3 types</span> <span style={tagStyle}>13 colors</span>
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
            <div style={labelStyle}>type="title"</div>
            <div style={S.row}>
                <Card type="title">
                    <p>Title标题卡片</p>
                </Card>
                <Card type="title" style={{ maxWidth: 360, width: '100%' }}>
                    <p>
                        欢迎来到无人岛！在a game company 3DS《Animal Island: New Leaf》和《Animal Island: Happy Home
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
        </div>

        {/* ---- color variants ---- */}
        <div style={demoBodyStyle}>
            <div style={labelStyle}>color — IslandPhone 颜色</div>
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

        {/* ---- color + title ---- */}
        <div style={demoBodyStyle}>
            <div style={labelStyle}>color + type="title"</div>
            <div style={S.row}>
                <Card type="title" color="app-blue" style={{ width: 240 }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 15,
                            marginBottom: 6,
                        }}
                    >
                        蓝色标题卡片
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>type="title" + color="app-blue"</div>
                </Card>
                <Card type="title" color="app-green" style={{ width: 250 }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 15,
                            marginBottom: 6,
                        }}
                    >
                        绿色标题卡片
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>type="title" + color="app-green"</div>
                </Card>
                <Card type="title" color="purple" style={{ width: 240 }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 15,
                            marginBottom: 6,
                        }}
                    >
                        紫色标题卡片
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>type="title" + color="purple"</div>
                </Card>
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

            {/* 标题卡片 */}
            <Card type="title" style={{ width: 260 }}>
                标题卡片
            </Card>

            {/* 颜色变体 */}
            <Card color="app-blue">
                蓝色卡片
            </Card>
            <Card color="warm-peach-pink">
                暖桃粉卡片
            </Card>

            {/* 颜色 + 标题 组合 */}
            <Card type="title" color="purple">
                紫色标题卡片
            </Card>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={CARD_API} />
    </div>
);

const CollapseDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Collapse <span style={tagStyle}>FAQ</span>
        </div>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>基础用法</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse question="1個島嶼可以登錄多少名用戶?" answer={<p>1座島嶼最多可以容納8位居民（用戶）。</p>} />
                <Collapse
                    question="可以多少人一起玩?"
                    answer={<p>同住1個島的居民可以最多4人一起遊玩。透過通訊最多8人一起遊玩。</p>}
                />
            </div>
            <div style={labelStyle}>defaultExpanded 默认展开</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="这个问题默认展开"
                    answer={<p>答案已经展示出来了！可以点击收起。</p>}
                    defaultExpanded
                />
            </div>
            <div style={labelStyle}>disabled 禁用状态</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse question="这个问题已被禁用（无法展开）" answer={<p>这段文字不应该被看到。</p>} disabled />
            </div>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Collapse } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Collapse question="问题" answer={<p>回答内容</p>} />
            {/* 默认展开 */}
            <Collapse question="默认展开" answer={<p>答案</p>} defaultExpanded />
            {/* 禁用状态 */}
            <Collapse question="禁用" answer={<p>答案</p>} disabled />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={COLLAPSE_API} />
    </div>
);

const CursorDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Cursor <span style={tagStyle}>光标</span>
        </div>
        <p style={labelStyle}>
            Cursor 组件通过 CSS cursor 属性将子元素的鼠标光标替换为自定义手指图标，当前 Demo 全局已应用。
        </p>
        <CodeBlock
            code={`import React from 'react';
import { Cursor } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 光标组件 */}
            <Cursor>
                <div>鼠标移入此区域将显示自定义光标</div>
            </Cursor>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={CURSOR_API} />
    </div>
);

const ModalDemo: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [customFooterOpen, setCustomFooterOpen] = useState(false);
    const [noTypewriterOpen, setNoTypewriterOpen] = useState(false);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Modal <span style={tagStyle}>弹窗</span>
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
            </div>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onOk={() => setModalOpen(false)}
            >
                <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span>钓到<span style={{ color: '#FD9303' }}>石头</span>了!</span>
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
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={MODAL_API} />
        </div>
    );
};

const TypewriterDemo: React.FC = () => {
    const [replayKey, setReplayKey] = useState(0);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Typewriter <span style={tagStyle}>打字机</span>
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

const DividerDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Divider <span style={tagStyle}>5 types</span>
        </div>
        <div style={labelStyle}>line-brown</div>
        <Divider type="line-brown" />
        <div style={labelStyle}>line-teal</div>
        <Divider type="line-teal" />
        <div style={labelStyle}>line-white</div>
        <div style={{ background: '#333', padding: 10 }}>
            <Divider type="line-white" />
        </div>
        <div style={labelStyle}>line-yellow</div>
        <Divider type="line-yellow" />
        <div style={labelStyle}>wave-yellow</div>
        <Divider type="wave-yellow" />
        <CodeBlock
            code={`import React from 'react';
import { Divider } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* line-brown */}
            <Divider type="line-brown" />
            {/* line-teal */}
            <Divider type="line-teal" />
            {/* line-white */}
            <Divider type="line-white" />
            {/* line-yellow */}
            <Divider type="line-yellow" />
            {/* wave-yellow */}
            <Divider type="wave-yellow" />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={DIVIDER_API} />
    </div>
);

// ============================================
// SelectDemo
// ============================================
import { Select } from '../src';
import type { SelectOption } from '../src';

const SELECT_API = [
    { prop: 'options', desc: '选项列表', type: 'SelectOption[]', defaultVal: '-', required: true },
    { prop: 'value', desc: '当前选中值', type: 'string', defaultVal: '-', required: true },
    { prop: 'onChange', desc: '选中变化回调', type: '(key: string) => void', defaultVal: '-', required: true },
    { prop: 'placeholder', desc: '占位文本', type: 'string', defaultVal: '请选择' },
    { prop: 'disabled', desc: '禁用状态', type: 'boolean', defaultVal: 'false' },
];

const SelectDemo: React.FC = () => {
    const [value1, setValue1] = useState('fish1');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('flower2');
    const [value4, setValue4] = useState('');
    const fishOptions: SelectOption[] = [
        { key: 'fish1', label: '鲈鱼' },
        { key: 'fish2', label: '鲷鱼' },
        { key: 'fish3', label: '草鱼' },
        { key: 'fish4', label: '龙睛鱼' },
        { key: 'fish5', label: '神仙鱼' },
    ];
    const flowerOptions: SelectOption[] = [
        { key: 'flower1', label: '樱花' },
        { key: 'flower2', label: '玫瑰' },
        { key: 'flower3', label: '向日葵' },
        { key: 'flower4', label: '薰衣草' },
        { key: 'flower5', label: '郁金香' },
    ];
    const fruitOptions: SelectOption[] = [
        { key: 'fruit1', label: '草莓' },
        { key: 'fruit2', label: '蓝莓' },
        { key: 'fruit3', label: '桃子' },
        { key: 'fruit4', label: '樱桃' },
        { key: 'fruit5', label: '猕猴桃' },
    ];

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Select <span style={tagStyle}>基础用法</span>
            </div>
            <div style={labelStyle}>默认状态</div>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#a08060' }}>
                当前选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {fishOptions.find((o) => o.key === value1)?.label}
                </span>
            </div>
            <div style={S.demoBox}>
                <Select options={fishOptions} value={value1} onChange={setValue1} />
            </div>
            <div style={labelStyle}>自定义占位文本</div>
            <div style={demoDashedBoxStyle}>
                <Select options={flowerOptions} value={value2} onChange={setValue2} placeholder="请选择花朵" />
                <Select options={fruitOptions} value={value4} onChange={setValue4} placeholder="请选择水果" />
            </div>
            <div style={labelStyle}>禁用状态</div>
            <div style={S.demoBox}>
                <Select options={flowerOptions} value={value3} onChange={setValue3} disabled />
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Select } from 'animal-island-ui';

const options = [
    { key: 'option1', label: '选项一' },
    { key: 'option2', label: '选项二' },
];

const App = () => {
    const [value, setValue] = useState('option1');
    return (
        <div>
            {/* 受控模式 */}
            <Select options={options} value={value} onChange={setValue} />
            {/* 占位文本 */}
            <Select options={options} placeholder="请选择" />
            {/* 禁用状态 */}
            <Select options={options} disabled />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={SELECT_API} />
        </div>
    );
};

// ============================================
// Page info & mapping
// ============================================
export const PAGE_INFO: Record<string, { title: string; desc: string }> = {
    button: {
        title: 'Button 按钮',
        desc: '按钮组件 — 支持 primary / dashed / text / link 等类型，danger / ghost / loading / disabled 状态，icon 图标，block 块级，三种尺寸',
    },
    input: {
        title: 'Input 输入框',
        desc: '输入框组件 — 支持三种尺寸、clearable 清除、prefix / suffix 前后缀、error / warning 校验状态、disabled 禁用',
    },
    switch: {
        title: 'Switch 开关',
        desc: '开关组件 — 支持受控 / 非受控、自定义文案、small 尺寸、loading 状态',
    },
    card: {
        title: 'Card 卡片',
        desc: '卡片容器组件 — 支持 default / title 两种类型，12 种 IslandPhone 背景颜色',
    },
    collapse: {
        title: 'Collapse 折叠面板',
        desc: '折叠面板组件 — 支持展开/收起、默认展开、禁用状态',
    },
    cursor: {
        title: 'Cursor 光标',
        desc: '光标组件 — 自定义手指光标，支持自定义尺寸、点击动画',
    },
    time: {
        title: 'Time 时间',
        desc: '经典 HUD 风格的时间显示组件，实时更新时间',
    },
    phone: {
        title: 'Phone 手机',
        desc: '治愈海岛风格手机界面，包含对话框和背包功能',
    },
    footer: {
        title: 'Footer 底部装饰',
        desc: '页面底部装饰图片，支持树和海两种类型',
    },
    modal: {
        title: 'Modal 弹窗',
        desc: '模态弹窗组件 — SVG 有机形状裁切、支持标题、关闭按钮、自定义 Footer、ESC / 遮罩关闭',
    },
    typewriter: {
        title: 'Typewriter 打字机',
        desc: '打字机组件 — 按字符逐个显示文本，支持多行与 ReactNode 富内容，不改变原有样式',
    },
    'divider-comp': {
        title: 'Divider 分割线',
        desc: '分割线组件 — 装饰性分割线',
    },
    icon: {
        title: 'Icon 图标',
        desc: '图标组件 — 治愈海岛风格图标集，包含 10 个可爱图标，支持自定义尺寸',
    },
    select: {
        title: 'Select 选择器',
        desc: '下拉选择器组件 — 支持自定义选项列表，高亮当前选中项',
    },
    tabs: {
        title: 'Tabs 标签页',
        desc: '标签页组件 — 支持受控/非受控模式切换',
    },
    checkbox: {
        title: 'Checkbox 多选框',
        desc: '多选框组件 — 支持受控/非受控、水平/垂直排列、三种尺寸、禁用单项或全部禁用',
    },
    codeblock: {
        title: 'CodeBlock 代码高亮',
        desc: '代码高亮组件 — 语法高亮显示，支持自定义样式和类名',
    },
    loading: {
        title: 'Loading 加载',
        desc: '治愈海岛风格小岛 Loading 动画组件，支持自定义样式和类名',
    },
};

const PAGES: Record<string, React.FC> = {
    button: ButtonDemo,
    input: InputDemo,
    switch: SwitchDemo,
    card: CardDemo,
    collapse: CollapseDemo,
    cursor: CursorDemo,
    time: TimeDemo,
    phone: PhoneDemo,
    footer: FooterDemo,
    modal: ModalDemo,
    typewriter: TypewriterDemo,
    'divider-comp': DividerDemo,
    icon: IconDemo,
    select: SelectDemo,
    tabs: TabsDemo,
    checkbox: CheckboxDemo,
    codeblock: CodeBlockDemo,
    loading: LoadingDemo,
};

// ============================================
// ComponentPage
// ============================================
interface ComponentPageProps {
    activeKey: string;
}

const ComponentPage: React.FC<ComponentPageProps> = ({ activeKey }) => {
    const Page = PAGES[activeKey];
    const info = PAGE_INFO[activeKey];

    if (!Page || !info) return null;

    return (
        <>
            <div
                style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#794f27',
                    marginBottom: 12,
                    lineHeight: 1.4,
                }}
            >
                {info.title}
            </div>
            <div style={{ ...S.pageDesc, minHeight: 40 }}>
                <Typewriter key={activeKey} trigger={activeKey} speed={30}>
                    {info.desc}
                </Typewriter>
            </div>
            <Page />
        </>
    );
};

export default ComponentPage;
