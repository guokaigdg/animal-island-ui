import React, { useState } from 'react';
import { Button, Input, Switch, Modal, Card, Collapse, Divider } from '../src';
import TimeDemo from './components/Time';
import PhoneDemo from './components/Phone';
import FooterDemo from './components/Footer';

// ============================================
// Styles
// ============================================
const S = {
    pageTitle: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 8,
        color: '#794f27',
    } as React.CSSProperties,
    pageDesc: {
        fontSize: 13,
        color: '#794f27',
        marginBottom: 32,
    } as React.CSSProperties,
    section: {
        marginBottom: 36,
        padding: 24,
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e8e2d6',
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: 15,
        fontWeight: 600,
        marginBottom: 16,
        color: '#725d42',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    } as React.CSSProperties,
    tag: {
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 10,
        background: '#f0e8d8',
        color: '#a08060',
        fontWeight: 500,
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
    label: {
        fontSize: 11,
        color: '#a0936e',
        marginBottom: 4,
        fontWeight: 500,
    } as React.CSSProperties,
    demoBox: {
        padding: 16,
        background: '#faf8f2',
        borderRadius: 8,
        border: '1px dashed #e0d8c8',
    } as React.CSSProperties,
    codeBlock: {
        marginTop: 16,
        padding: '20px 24px',
        background: '#2b2118',
        border: '1px solid #3d3028',
        borderRadius: 20,
        fontSize: 14,
        lineHeight: 1.7,
        fontFamily:
            "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontWeight: 600,
        color: '#e8d5bc',
        whiteSpace: 'pre',
        overflow: 'auto',
        tabSize: 4,
    } as React.CSSProperties,
    codeLabel: {
        fontSize: 14,
        fontWeight: 600,
        color: '#e7e4e0',
        marginBottom: 0,
        padding: '6px 12px',
        background: '#3d3028',
        borderRadius: '10px 10px 0 0',
        display: 'inline-block',
    } as React.CSSProperties,
    // 统一 Demo 分组容器：纵向排列 + 统一间距（修改此处即可全局生效）
    demoBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
    } as React.CSSProperties,
};

// ============================================
// Code block helper — syntax highlighting
// ============================================
const highlightJSX = (code: string): React.ReactNode[] => {
    const tokens: { pattern: RegExp; style: React.CSSProperties }[] = [
        {
            pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
            style: { color: '#6b5e50', fontStyle: 'italic', fontWeight: 400 },
        },
        {
            pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
            style: { color: '#a8d4a0' },
        },
        { pattern: /(<\/?[\w.]+|\/?>)/g, style: { color: '#f0a870' } },
        {
            pattern:
                /\b(import|from|const|let|var|function|return|export|default|useState|true|false|null|undefined)\b/g,
            style: { color: '#d4a0e0' },
        },
        { pattern: /\s([a-zA-Z][\w-]*)(?==)/g, style: { color: '#e8c87a' } },
        { pattern: /(\{|\})/g, style: { color: '#d4b896' } },
        { pattern: /(=>)/g, style: { color: '#d4a0e0' } },
    ];

    const parts: React.ReactNode[] = [];
    const lines = code.trim().split('\n');
    lines.forEach((line, li) => {
        type Seg = { start: number; end: number; style: React.CSSProperties };
        const segs: Seg[] = [];
        for (const t of tokens) {
            const re = new RegExp(t.pattern.source, t.pattern.flags);
            let m: RegExpExecArray | null;
            while ((m = re.exec(line)) !== null) {
                const s =
                    m.index + (m[0] !== m[1] && m[1] ? m[0].indexOf(m[1]) : 0);
                const text = m[1] || m[0];
                segs.push({ start: s, end: s + text.length, style: t.style });
            }
        }
        segs.sort((a, b) => a.start - b.start);
        const merged: Seg[] = [];
        for (const s of segs) {
            if (
                merged.length === 0 ||
                s.start >= merged[merged.length - 1].end
            ) {
                merged.push(s);
            }
        }
        let idx = 0;
        for (const seg of merged) {
            if (seg.start > idx) {
                parts.push(line.slice(idx, seg.start));
            }
            parts.push(
                <span key={`${li}-${seg.start}`} style={seg.style}>
                    {line.slice(seg.start, seg.end)}
                </span>
            );
            idx = seg.end;
        }
        if (idx < line.length) parts.push(line.slice(idx));
        if (li < lines.length - 1) parts.push('\n');
    });
    return parts;
};

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div style={{ marginTop: 36 }}>
        <div style={S.codeLabel}>使用示例</div>
        <pre
            style={{
                ...S.codeBlock,
                marginTop: 0,
                borderRadius: '0 20px 20px 20px',
            }}
        >
            {highlightJSX(code)}
        </pre>
    </div>
);

// ============================================
// API Table
// ============================================
interface ApiRow {
    prop: string;
    desc: string;
    type: string;
    defaultVal?: string;
    required?: boolean;
}

const ApiTable: React.FC<{ rows: ApiRow[] }> = ({ rows }) => (
    <div style={{ marginTop: 24 }}>
        <div style={S.codeLabel}>API</div>
        <div
            style={{
                overflow: 'auto',
                borderRadius: '0 20px 20px 20px',
                border: '1px solid #3d3028',
            }}
        >
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 13,
                    background: '#2b2118',
                }}
            >
                <thead>
                    <tr style={{ borderBottom: '1px solid #3d3028' }}>
                        {['属性', '说明', '类型', '默认值'].map((h) => (
                            <th
                                key={h}
                                style={{
                                    padding: '10px 16px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    color: '#e7e4e0',
                                    background: '#352a20',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr
                            key={r.prop}
                            style={{
                                borderBottom:
                                    i < rows.length - 1
                                        ? '1px solid #3d3028'
                                        : 'none',
                            }}
                        >
                            <td
                                style={{
                                    padding: '8px 16px',
                                    color: '#f0a870',
                                    fontFamily:
                                        "'SF Mono', 'Fira Code', Consolas, monospace",
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {r.prop}
                                {r.required && (
                                    <span
                                        style={{
                                            color: '#e06060',
                                            marginLeft: 2,
                                        }}
                                    >
                                        *
                                    </span>
                                )}
                            </td>
                            <td
                                style={{
                                    padding: '8px 16px',
                                    color: '#d4b896',
                                }}
                            >
                                {r.desc}
                            </td>
                            <td
                                style={{
                                    padding: '8px 16px',
                                    color: '#a8d4a0',
                                    fontFamily:
                                        "'SF Mono', 'Fira Code', Consolas, monospace",
                                    fontSize: 12,
                                }}
                            >
                                {r.type}
                            </td>
                            <td
                                style={{
                                    padding: '8px 16px',
                                    color: '#8ab8e0',
                                    fontFamily:
                                        "'SF Mono', 'Fira Code', Consolas, monospace",
                                    fontSize: 12,
                                }}
                            >
                                {r.defaultVal ?? '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

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
        prop: 'closable',
        desc: '是否显示关闭按钮',
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
];

const CARD_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '卡片类型',
        type: `'default' | 'title'`,
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
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Button <span style={S.tag}>6 types</span>
        </div>
        <div style={S.demoBody}>
            <div style={S.label}>type 按钮类型</div>
            <div style={S.row}>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
            </div>
            <div style={S.label}>danger / ghost / loading / disabled 状态</div>
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
            <div style={S.label}>size 尺寸</div>
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
            <div style={S.label}>icon 图标按钮</div>
            <div style={S.row}>
                <Button type="primary" icon={<span>🔍</span>}>
                    搜索
                </Button>
                <Button icon={<span>⭐</span>}>收藏</Button>
                <Button type="dashed" icon={<span>＋</span>}>
                    新增
                </Button>
            </div>
            <div style={S.label}>block 块级按钮</div>
            <div style={{ maxWidth: 360 }}>
                <Button type="primary" block>
                    Block Button
                </Button>
            </div>
            <div style={S.label}>danger 组合</div>
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
            code={`import { Button } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
            <Button type="primary" danger>Danger</Button>
            <Button type="primary" ghost>Ghost</Button>
            <Button type="primary" loading>Loading</Button>
            <Button type="primary" size="large">Large</Button>
            <Button type="primary" icon={<span>🔍</span>}>搜索</Button>
            <Button type="primary" block>Block</Button>
        </div>
    );
};`} />
        <ApiTable rows={BUTTON_API} />
    </div>
);

const InputDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    return (
        <div style={S.section}>
            <div style={S.sectionTitle}>
                Input <span style={S.tag}>3 sizes</span>
            </div>
            <div style={S.demoBody}>
                <div style={S.label}>基础用法</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Basic input" />
                    <Input
                        placeholder="With clear"
                        allowClear
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClear={() => setInputValue('')}
                    />
                    <Input
                        placeholder="Prefix & Suffix"
                        prefix="🔍"
                        suffix="⏎"
                    />
                </div>
                <div style={S.label}>size 尺寸</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Small" size="small" />
                    <Input placeholder="Middle (default)" size="middle" />
                    <Input placeholder="Large" size="large" />
                </div>
                <div style={S.label}>status 校验状态</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Error status" status="error" />
                    <Input placeholder="Warning status" status="warning" />
                </div>
                <div style={S.label}>disabled 禁用</div>
                <div style={{ ...(S.col as any), maxWidth: 360, gap: 12 }}>
                    <Input placeholder="Disabled" disabled />
                </div>
            </div>
            <CodeBlock
                code={`import { Input } from 'animal-island-ui';

const App = () => {
    const [val, setVal] = useState('');
    return (
        <div>
            <Input placeholder="Basic input" />
            <Input placeholder="With clear" allowClear value={val} onChange={e => setVal(e.target.value)} />
            <Input placeholder="Prefix" prefix="🔍" suffix="⏎" />
            <Input placeholder="Small" size="small" />
            <Input placeholder="Large" size="large" />
            <Input placeholder="Error" status="error" />
            <Input placeholder="Warning" status="warning" />
        </div>
    );
};`} />
            <ApiTable rows={INPUT_API} />
        </div>
    );
};

const SwitchDemo: React.FC = () => {
    const [switchChecked, setSwitchChecked] = useState(false);
    return (
        <div style={S.section}>
            <div style={S.sectionTitle}>
                Switch <span style={S.tag}>2 sizes</span>
            </div>
            <div style={S.demoBody}>
                <div style={S.label}>基础用法</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch
                        checked={switchChecked}
                        onChange={setSwitchChecked}
                    />
                    <span style={{ fontSize: 13 }}>
                        {switchChecked ? 'ON' : 'OFF'}
                    </span>
                </div>
                <div style={S.label}>
                    checkedChildren / unCheckedChildren 自定义文案
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch
                        defaultChecked
                        checkedChildren="开"
                        unCheckedChildren="关"
                    />
                </div>
                <div style={S.label}>size 尺寸</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch defaultChecked />
                    <Switch size="small" defaultChecked />
                </div>
                <div style={S.label}>disabled / loading 状态</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Switch disabled />
                    <Switch loading defaultChecked />
                </div>
            </div>
            <CodeBlock
                code={`import { Switch } from 'animal-island-ui';

const App = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div>
            <Switch checked={checked} onChange={setChecked} />
            <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            <Switch size="small" defaultChecked />
        </div>
    );
};`} />
            <ApiTable rows={SWITCH_API} />
        </div>
    );
};

const CardDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Card <span style={S.tag}>2 types</span>{' '}
            <span style={S.tag}>13 colors</span>
        </div>

        {/* ---- type ---- */}
        <div style={S.demoBody}>
            <div style={S.label}>type="default"</div>
            <div style={S.row}>
                <Card>
                    <p style={{ margin: 0, fontSize: 13 }}>基础卡片</p>
                </Card>
                <Card style={{ maxWidth: 560, width: '100%' }}>
                    <p style={{ margin: 0, fontSize: 13 }}>
                        在Nintendo 3DS《Animal Island: New Leaf》和《Animal
                        Island: Happy Home Designer》中製作的「我的設計」QR
                        Code，以智慧型裝置讀取就能通過狸端機入口站下載至《集合啦！動物森友會》。
                    </p>
                </Card>
            </div>
            <div style={S.label}>type="title"</div>
            <div style={S.row}>
                <Card type="title">
                    <p style={{ margin: 0, fontSize: 13 }}>Title标题卡片</p>
                </Card>
                <Card type="title" style={{ maxWidth: 360, width: '100%' }}>
                    <p style={{ margin: 0, fontSize: 13 }}>
                        欢迎来到无人岛！在Nintendo 3DS《Animal Island: New
                        Leaf》和《Animal Island: Happy Home
                        Designer》中製作的「我的設計」QR
                        Code，以智慧型裝置讀取就能通過狸端機入口站下載至《集合啦！動物森友會》。
                    </p>
                </Card>
            </div>
        </div>

        {/* ---- color variants ---- */}
        <div style={S.demoBody}>
            <div style={S.label}>color — NookPhone 颜色</div>
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
                    <Card
                        key={color}
                        color={color as any}
                        style={{ padding: '16px 20px' }}
                    >
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
        <div style={S.demoBody}>
            <div style={S.label}>color + type="title"</div>
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
                    <div style={{ fontSize: 12, opacity: 0.85 }}>
                        type="title" + color="app-blue"
                    </div>
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
                    <div style={{ fontSize: 12, opacity: 0.85 }}>
                        type="title" + color="app-green"
                    </div>
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
                    <div style={{ fontSize: 12, opacity: 0.85 }}>
                        type="title" + color="purple"
                    </div>
                </Card>
            </div>
        </div>

        <CodeBlock
            code={`import { Card } from 'animal-island-ui';

const App = () => (
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
);`} />
        <ApiTable rows={CARD_API} />
    </div>
);

const CollapseDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Collapse <span style={S.tag}>FAQ</span>
        </div>
        <div style={S.demoBody}>
            <div style={S.label}>基础用法</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="1個島嶼可以登錄多少名用戶?"
                    answer={<p>1座島嶼最多可以容納8位居民（用戶）。</p>}
                />
                <Collapse
                    question="可以多少人一起玩?"
                    answer={
                        <p>
                            同住1個島的居民可以最多4人一起遊玩。透過通訊最多8人一起遊玩。
                        </p>
                    }
                />
            </div>
            <div style={S.label}>defaultExpanded 默认展开</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="这个问题默认展开"
                    answer={<p>答案已经展示出来了！可以点击收起。</p>}
                    defaultExpanded
                />
            </div>
            <div style={S.label}>disabled 禁用状态</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="这个问题已被禁用（无法展开）"
                    answer={<p>这段文字不应该被看到。</p>}
                    disabled
                />
            </div>
        </div>
        <CodeBlock
            code={`import { Collapse } from 'animal-island-ui';

const App = () => (
    <div>
        <Collapse question="问题" answer={<p>回答内容</p>} />
        <Collapse question="默认展开" answer={<p>答案</p>} defaultExpanded />
        <Collapse question="禁用" answer={<p>答案</p>} disabled />
    </div>
);`} />
        <ApiTable rows={COLLAPSE_API} />
    </div>
);

const CursorDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Cursor <span style={S.tag}>光标</span>
        </div>
        <p style={{ fontSize: 13, color: '#8a7b66' }}>
            Cursor 组件通过 CSS cursor
            属性将子元素的鼠标光标替换为自定义手指图标，当前 Demo 全局已应用。
        </p>
        <CodeBlock
            code={`import { Cursor } from 'animal-island-ui';

const App = () => (
    <Cursor>
        <div>鼠标移入此区域将显示自定义光标</div>
    </Cursor>
);`} />
        <ApiTable rows={CURSOR_API} />
    </div>
);

const ModalDemo: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [customFooterOpen, setCustomFooterOpen] = useState(false);
    return (
        <div style={S.section}>
            <div style={S.sectionTitle}>
                Modal <span style={S.tag}>弹窗</span>
            </div>
            <div style={S.demoBody}>
                <div style={S.label}>基础弹窗</div>
                <div style={S.row}>
                    <Button type="primary" onClick={() => setModalOpen(true)}>
                        基础 Modal
                    </Button>
                    <Button onClick={() => setTitleModalOpen(true)}>
                        带标题 Modal
                    </Button>
                    <Button
                        type="dashed"
                        onClick={() => setCustomFooterOpen(true)}
                    >
                        自定义 Footer
                    </Button>
                </div>
            </div>
            <Modal
                open={modalOpen}
                closable={false}
                onClose={() => setModalOpen(false)}
                onOk={() => setModalOpen(false)}
            >
                <span>钓到石头了!</span>
                <span>竟然连这种都能钓起来......</span>
            </Modal>
            <Modal
                open={titleModalOpen}
                title="博物馆捐赠"
                onClose={() => setTitleModalOpen(false)}
                onOk={() => setTitleModalOpen(false)}
            >
                <p style={{ margin: 0 }}>
                    是否将这条鱼捐赠给博物馆？傅达会非常高兴的！
                </p>
            </Modal>
            <Modal
                open={customFooterOpen}
                title="确认操作"
                onClose={() => setCustomFooterOpen(false)}
                footer={
                    <>
                        <Button onClick={() => setCustomFooterOpen(false)}>
                            再想想
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={() => setCustomFooterOpen(false)}
                        >
                            确认搬家
                        </Button>
                    </>
                }
            >
                <p style={{ margin: 0 }}>
                    确定要让这位居民搬走吗？这个操作不可撤销。
                </p>
            </Modal>
            <CodeBlock
                code={`import { Button, Modal } from 'animal-island-ui';

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
        </div>
    );
};`} />
            <ApiTable rows={MODAL_API} />
        </div>
    );
};

const DividerDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Divider <span style={S.tag}>5 types</span>
        </div>
        <p>line-brown</p>
        <Divider type="line-brown" />
        <p>line-teal</p>
        <Divider type="line-teal" />
        <p>line-white</p>
        <div style={{ background: '#333', padding: 10 }}>
            <Divider type="line-white" />
        </div>
        <p>line-yellow</p>
        <Divider type="line-yellow" />
        <p>wave-yellow</p>
        <Divider type="wave-yellow" />
        <CodeBlock
            code={`import { Divider } from 'animal-island-ui';

const App = () => (
    <div>
        <Divider type="line-brown" />
        <Divider type="line-teal" />
        <Divider type="line-white" />
        <Divider type="line-yellow" />
        <Divider type="wave-yellow" />
    </div>
);`} />
        <ApiTable rows={DIVIDER_API} />
    </div>
);

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
        desc: '卡片容器组件 — 支持 default / title 两种类型，12 种 NookPhone 背景颜色',
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
        desc: '动森风格手机界面，包含对话框和背包功能',
    },
    footer: {
        title: 'Footer 底部装饰',
        desc: '页面底部装饰图片，支持树和海两种类型',
    },
    modal: {
        title: 'Modal 弹窗',
        desc: '模态弹窗组件 — SVG 有机形状裁切、支持标题、关闭按钮、自定义 Footer、ESC / 遮罩关闭',
    },
    'divider-comp': {
        title: 'Divider 分割线',
        desc: '分割线组件 — 装饰性分割线',
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
    'divider-comp': DividerDemo,
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
            <Card
                type="title"
                style={{ marginBottom: 8, width: 'fit-content' }}
            >
                <span style={{ fontSize: 24, fontWeight: 700 }}>
                    {info.title}
                </span>
            </Card>
            <div style={S.pageDesc}>{info.desc}</div>
            <Page />
        </>
    );
};

export default ComponentPage;
