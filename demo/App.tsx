import React, { useState } from "react";
import {
    // 基础 UI
    Button,
    Input,
    Switch,
    Modal,
    Card,
    Collapse,
    Cursor,
    Divider
} from "../src";
import "../src/styles/index.less";

// ============================================
// Menu config
// ============================================
const MENU_ITEMS = [
    { key: "cat-basic", label: "── 基础组件 ──" },
    { key: "button", label: "Button 按钮" },
    { key: "input", label: "Input 输入框" },
    { key: "switch", label: "Switch 开关" },
    { key: "card", label: "Card 卡片" },
    { key: "collapse", label: "Collapse 折叠面板" },
    { key: "cursor", label: "Cursor 光标" },
    { key: "modal", label: "Modal 弹窗" },
    { key: "divider-comp", label: "Divider 分割线" }
];

// ============================================
// Styles
// ============================================
const S = {
    layout: {
        display: "flex",
        height: "100vh",
        fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
        background: `url(${new URL("./img/content_bg_pc.jpg", import.meta.url).href}) center fixed`,
        color: "#794f27"
    } as React.CSSProperties,
    sidebar: {
        width: 220,
        minWidth: 220,
        background: "#fffcf5",
        borderRight: "1px solid #e8e2d6",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    } as React.CSSProperties,
    sidebarHeader: {
        padding: "20px 16px 12px",
        borderBottom: "1px solid #e8e2d6",
        fontWeight: 700,
        fontSize: 15,
        color: "#725d42",
        letterSpacing: -0.3
    } as React.CSSProperties,
    menuList: {
        flex: 1,
        overflow: "auto",
        padding: "8px 0"
    } as React.CSSProperties,
    menuItem: (active: boolean) =>
        ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: active ? 600 : 400,
            color: active ? "#725d42" : "#8a7b66",
            background: active ? "#f0e8d8" : "transparent",
            borderRight: active ? "3px solid #d4a574" : "3px solid transparent",
            transition: "all 0.15s"
        }) as React.CSSProperties,
    main: {
        flex: 1,
        overflow: "auto",
        padding: "32px 40px"
    } as React.CSSProperties,
    pageTitle: {
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 8,
        color: "#794f27"
    } as React.CSSProperties,
    pageDesc: {
        fontSize: 13,
        color: "#794f27",
        marginBottom: 32
    } as React.CSSProperties,
    section: {
        marginBottom: 36,
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e8e2d6"
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: 15,
        fontWeight: 600,
        marginBottom: 16,
        color: "#725d42",
        display: "flex",
        alignItems: "center",
        gap: 8
    } as React.CSSProperties,
    tag: {
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 10,
        background: "#f0e8d8",
        color: "#a08060",
        fontWeight: 500
    } as React.CSSProperties,
    row: {
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "flex-start"
    } as React.CSSProperties,
    col: {
        display: "flex",
        flexDirection: "column",
        gap: 12
    } as React.CSSProperties,
    label: {
        fontSize: 11,
        color: "#a0936e",
        marginBottom: 4,
        fontWeight: 500
    } as React.CSSProperties,
    demoBox: {
        padding: 16,
        background: "#faf8f2",
        borderRadius: 8,
        border: "1px dashed #e0d8c8"
    } as React.CSSProperties,
    codeBlock: {
        marginTop: 16,
        padding: "20px 24px",
        background: "#2b2118",
        border: "1px solid #3d3028",
        borderRadius: 10,
        fontSize: 14,
        lineHeight: 1.7,
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontWeight: 600,
        color: "#e8d5bc",
        whiteSpace: "pre",
        overflow: "auto",
        tabSize: 4
    } as React.CSSProperties,
    codeLabel: {
        fontSize: 12,
        fontWeight: 600,
        color: "#e7e4e0",
        marginBottom: 0,
        padding: "6px 12px",
        background: "#3d3028",
        borderRadius: "10px 10px 0 0",
        display: "inline-block"
    } as React.CSSProperties,
    scaledBox: (scale = 0.25) =>
        ({
            transform: `scale(${scale})`,
            transformOrigin: "top left"
        }) as React.CSSProperties
};

// ============================================
// Code block helper — syntax highlighting
// ============================================
const highlightJSX = (code: string): React.ReactNode[] => {
    const tokens: { pattern: RegExp; style: React.CSSProperties }[] = [
        // comments
        { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, style: { color: "#6b5e50", fontStyle: "italic", fontWeight: 400 } },
        // strings (single/double/backtick)
        { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, style: { color: "#a8d4a0" } },
        // JSX tags  < />
        { pattern: /(<\/?[\w.]+|\/?>)/g, style: { color: "#f0a870" } },
        // keywords
        {
            pattern:
                /\b(import|from|const|let|var|function|return|export|default|useState|true|false|null|undefined)\b/g,
            style: { color: "#d4a0e0" }
        },
        // JSX attribute names
        { pattern: /\s([a-zA-Z][\w-]*)(?==)/g, style: { color: "#e8c87a" } },
        // braces in JSX expressions
        { pattern: /(\{|\})/g, style: { color: "#d4b896" } },
        // arrow functions
        { pattern: /(=>)/g, style: { color: "#d4a0e0" } }
    ];

    // Simple approach: apply regex replacements in order via spans
    const parts: React.ReactNode[] = [];
    const lines = code.trim().split("\n");
    lines.forEach((line, li) => {
        // Tokenize each line
        type Seg = { start: number; end: number; style: React.CSSProperties };
        const segs: Seg[] = [];
        for (const t of tokens) {
            const re = new RegExp(t.pattern.source, t.pattern.flags);
            let m: RegExpExecArray | null;
            while ((m = re.exec(line)) !== null) {
                const s = m.index + (m[0] !== m[1] && m[1] ? m[0].indexOf(m[1]) : 0);
                const text = m[1] || m[0];
                segs.push({ start: s, end: s + text.length, style: t.style });
            }
        }
        // Sort by start, dedup overlapping (first wins)
        segs.sort((a, b) => a.start - b.start);
        const merged: Seg[] = [];
        for (const s of segs) {
            if (merged.length === 0 || s.start >= merged[merged.length - 1].end) {
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
        if (li < lines.length - 1) parts.push("\n");
    });
    return parts;
};

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div style={{ marginTop: 16 }}>
        <div style={S.codeLabel}>使用示例</div>
        <pre style={{ ...S.codeBlock, marginTop: 0, borderRadius: "0 10px 10px 10px" }}>{highlightJSX(code)}</pre>
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
        <div style={{ overflow: "auto", borderRadius: "0 10px 10px 10px", border: "1px solid #3d3028" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#2b2118" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid #3d3028" }}>
                        {["属性", "说明", "类型", "默认值"].map((h) => (
                            <th
                                key={h}
                                style={{
                                    padding: "10px 16px",
                                    textAlign: "left",
                                    fontWeight: 600,
                                    color: "#e7e4e0",
                                    background: "#352a20",
                                    whiteSpace: "nowrap"
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
                                borderBottom: i < rows.length - 1 ? "1px solid #3d3028" : "none"
                            }}
                        >
                            <td
                                style={{
                                    padding: "8px 16px",
                                    color: "#f0a870",
                                    fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {r.prop}
                                {r.required && <span style={{ color: "#e06060", marginLeft: 2 }}>*</span>}
                            </td>
                            <td style={{ padding: "8px 16px", color: "#d4b896" }}>{r.desc}</td>
                            <td
                                style={{
                                    padding: "8px 16px",
                                    color: "#a8d4a0",
                                    fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                                    fontSize: 12
                                }}
                            >
                                {r.type}
                            </td>
                            <td
                                style={{
                                    padding: "8px 16px",
                                    color: "#8ab8e0",
                                    fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                                    fontSize: 12
                                }}
                            >
                                {r.defaultVal ?? "-"}
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
        prop: "type",
        desc: "按钮类型",
        type: `'primary' | 'default' | 'dashed' | 'text' | 'link'`,
        defaultVal: "'default'"
    },
    { prop: "size", desc: "按钮尺寸", type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
    { prop: "danger", desc: "是否危险按钮", type: "boolean", defaultVal: "false" },
    { prop: "ghost", desc: "是否幽灵按钮（透明背景）", type: "boolean", defaultVal: "false" },
    { prop: "block", desc: "是否块级按钮", type: "boolean", defaultVal: "false" },
    { prop: "loading", desc: "加载状态", type: "boolean", defaultVal: "false" },
    { prop: "disabled", desc: "禁用状态", type: "boolean", defaultVal: "false" },
    { prop: "icon", desc: "图标", type: "ReactNode", defaultVal: "-" },
    { prop: "htmlType", desc: "原生 button type", type: `'submit' | 'reset' | 'button'`, defaultVal: "'button'" },
    { prop: "children", desc: "按钮内容", type: "ReactNode", defaultVal: "-" },
    { prop: "...", desc: "继承 React.ButtonHTMLAttributes", type: "HTMLButtonElement", defaultVal: "-" }
];

const INPUT_API: ApiRow[] = [
    { prop: "size", desc: "输入框尺寸", type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
    { prop: "prefix", desc: "前缀图标", type: "ReactNode", defaultVal: "-" },
    { prop: "suffix", desc: "后缀图标", type: "ReactNode", defaultVal: "-" },
    { prop: "allowClear", desc: "允许清除", type: "boolean", defaultVal: "false" },
    { prop: "status", desc: "校验状态", type: `'error' | 'warning'`, defaultVal: "-" },
    { prop: "onChange", desc: "值变化回调", type: "ChangeEventHandler<HTMLInputElement>", defaultVal: "-" },
    { prop: "onClear", desc: "清除回调", type: "() => void", defaultVal: "-" },
    { prop: "...", desc: "继承 React.InputHTMLAttributes", type: "HTMLInputElement", defaultVal: "-" }
];

const SWITCH_API: ApiRow[] = [
    { prop: "checked", desc: "是否选中（受控）", type: "boolean", defaultVal: "-" },
    { prop: "defaultChecked", desc: "默认是否选中", type: "boolean", defaultVal: "false" },
    { prop: "size", desc: "尺寸", type: `'small' | 'default'`, defaultVal: "'default'" },
    { prop: "disabled", desc: "禁用", type: "boolean", defaultVal: "false" },
    { prop: "loading", desc: "加载状态", type: "boolean", defaultVal: "false" },
    { prop: "checkedChildren", desc: "选中时文案", type: "ReactNode", defaultVal: "-" },
    { prop: "unCheckedChildren", desc: "未选中时文案", type: "ReactNode", defaultVal: "-" },
    { prop: "onChange", desc: "变化回调", type: "(checked: boolean) => void", defaultVal: "-" }
];

const MODAL_API: ApiRow[] = [
    { prop: "open", desc: "是否可见", type: "boolean", defaultVal: "-", required: true },
    { prop: "title", desc: "标题", type: "ReactNode", defaultVal: "-" },
    { prop: "width", desc: "宽度", type: "number | string", defaultVal: "520" },
    { prop: "maskClosable", desc: "点击遮罩关闭", type: "boolean", defaultVal: "true" },
    { prop: "closable", desc: "是否显示关闭按钮", type: "boolean", defaultVal: "true" },
    { prop: "footer", desc: "底部按钮区域，传 null 则不显示", type: "ReactNode | null", defaultVal: "默认按钮" },
    { prop: "onClose", desc: "关闭回调", type: "() => void", defaultVal: "-" },
    { prop: "onOk", desc: "确认回调", type: "() => void", defaultVal: "-" },
    { prop: "children", desc: "自定义内容", type: "ReactNode", defaultVal: "-" }
];

const CARD_API: ApiRow[] = [
    { prop: "type", desc: "卡片类型", type: `'default' | 'title'`, defaultVal: "'default'" },
    { prop: "children", desc: "自定义内容", type: "ReactNode", defaultVal: "-" },
    { prop: "className", desc: "自定义类名", type: "string", defaultVal: "-" },
    { prop: "style", desc: "自定义样式", type: "CSSProperties", defaultVal: "-" }
];

const COLLAPSE_API: ApiRow[] = [
    { prop: "question", desc: "问题标题", type: "ReactNode", defaultVal: "-", required: true },
    { prop: "answer", desc: "答案内容", type: "ReactNode", defaultVal: "-", required: true },
    { prop: "defaultExpanded", desc: "是否默认展开", type: "boolean", defaultVal: "false" },
    { prop: "disabled", desc: "是否禁用", type: "boolean", defaultVal: "false" },
    { prop: "className", desc: "自定义类名", type: "string", defaultVal: "-" },
    { prop: "style", desc: "自定义样式", type: "CSSProperties", defaultVal: "-" }
];

const CURSOR_API: ApiRow[] = [
    { prop: "children", desc: "子元素", type: "ReactNode", defaultVal: "-" },
    { prop: "className", desc: "自定义类名", type: "string", defaultVal: "-" },
    { prop: "style", desc: "自定义样式", type: "CSSProperties", defaultVal: "-" }
];

const DIVIDER_API: ApiRow[] = [
    { prop: "className", desc: "自定义类名", type: "string", defaultVal: "-" },
    { prop: "style", desc: "自定义样式", type: "CSSProperties", defaultVal: "-" }
];

// ============================================
// Demo sections
// ============================================
const ButtonDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Button <span style={S.tag}>5 types</span>
        </div>
        <div style={{ ...S.row, marginBottom: 12 }}>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
        </div>
        <div style={{ ...S.row, marginBottom: 12 }}>
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
        <CodeBlock
            code={`import { Button } from 'animail-crossing-ui';

const App = () => {
    return (
        <div>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="primary" danger>Danger</Button>
            <Button type="primary" size="large">Large</Button>
        </div>
    );
};`}
        />
        <ApiTable rows={BUTTON_API} />
    </div>
);

const InputDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    return (
        <div style={S.section}>
            <div style={S.sectionTitle}>Input</div>
            <div style={{ ...(S.col as any), maxWidth: 360 }}>
                <Input placeholder="Basic input" />
                <Input
                    placeholder="With clear"
                    allowClear
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClear={() => setInputValue("")}
                />
                <Input placeholder="Prefix & Suffix" prefix="🔍" suffix="⏎" />
                <Input placeholder="Error" status="error" />
                <Input placeholder="Disabled" disabled />
            </div>
            <CodeBlock
                code={`import { Input } from 'animail-crossing-ui';

const App = () => {
    const [val, setVal] = useState('');
    return (
        <div>
            <Input placeholder="Basic input" />
            <Input placeholder="With clear" allowClear value={val} onChange={e => setVal(e.target.value)} />
            <Input placeholder="Error" status="error" />
        </div>
    );
};`}
            />
            <ApiTable rows={INPUT_API} />
        </div>
    );
};

const SwitchDemo: React.FC = () => {
    const [switchChecked, setSwitchChecked] = useState(false);
    return (
        <div style={S.section}>
            <div style={S.sectionTitle}>Switch</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Switch checked={switchChecked} onChange={setSwitchChecked} />
                <span style={{ fontSize: 13 }}>{switchChecked ? "ON" : "OFF"}</span>
                <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
                <Switch size="small" defaultChecked />
                <Switch disabled />
                <Switch loading defaultChecked />
            </div>
            <CodeBlock
                code={`import { Switch } from 'animail-crossing-ui';

const App = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div>
            <Switch checked={checked} onChange={setChecked} />
            <Switch defaultChecked checkedChildren="开" unCheckedChildren="关" />
            <Switch size="small" defaultChecked />
        </div>
    );
};`}
            />
            <ApiTable rows={SWITCH_API} />
        </div>
    );
};

const CardDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>
            Card <span style={S.tag}>2 types</span>
        </div>
        <div style={{ ...S.col, gap: 16 }}>
            <div style={S.label}>type="default"</div>
            <div style={S.row}>
                <Card >
                    <p style={{ margin: 0, fontSize: 13 }}>基础卡片</p>
                </Card>
                <Card style={{ width: 560 }}>
                    <p style={{ margin: 0, fontSize: 13 }}>
                        在a game company 3DS《a cozy island-style UI: New Leaf》和《a cozy island-style UI: Happy Home
                        Designer》中製作的「我的設計」QR
                        Code，以智慧型裝置讀取就能通過狸端機入口站下載至《集合啦！療癒系海島》。
                    </p>
                </Card>
            </div>
            <div style={S.label}>type="title"</div>
            <div style={S.row}>
                <Card >
                    <p style={{ margin: 0, fontSize: 13 }}>Title标题卡片</p>
                </Card>
                <Card type="title" style={{ width: 360 }}>
                    <p style={{ margin: 0, fontSize: 13 }}>
                        欢迎来到无人岛！在a game company 3DS《a cozy island-style UI: New Leaf》和《a cozy island-style UI: Happy Home
                        Designer》中製作的「我的設計」QR
                        Code，以智慧型裝置讀取就能通過狸端機入口站下載至《集合啦！療癒系海島》。
                    </p>
                </Card>
            </div>
        </div>
        <CodeBlock
            code={`import { Card } from 'animail-crossing-ui';

const App = () => (
    <div>
        <Card style={{ width: 260 }}>
            <p>基础卡片</p>
        </Card>
        <Card type="title" style={{ width: 260 }}>
            <p>标题卡片</p>
        </Card>
    </div>
);`}
        />
        <ApiTable rows={CARD_API} />
    </div>
);

const CollapseDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>Collapse</div>
        <div style={{ maxWidth: 720 }}>
            <Collapse question="1個島嶼可以登錄多少名用戶?" answer={<p>1座島嶼最多可以容納8位居民（用戶）。</p>} />
            <Collapse
                question="可以多少人一起玩?"
                answer={<p>同住1個島的居民可以最多4人一起遊玩。透過通訊最多8人一起遊玩。</p>}
            />
        </div>
        <CodeBlock
            code={`import { Collapse } from 'animail-crossing-ui';

const App = () => (
    <Collapse question="问题" answer={<p>回答内容</p>} />
);`}
        />
        <ApiTable rows={COLLAPSE_API} />
    </div>
);

const CursorDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>Cursor</div>
        <p style={{ fontSize: 13, color: "#8a7b66" }}>
            Cursor 组件通过 CSS cursor 属性将子元素的鼠标光标替换为治愈海岛风格手指图标，当前 Demo 全局已应用。
        </p>
        <CodeBlock
            code={`import { Cursor } from 'animail-crossing-ui';

const App = () => (
    <Cursor>
        <div>鼠标移入此区域将显示治愈海岛风格光标</div>
    </Cursor>
);`}
        />
        <ApiTable rows={CURSOR_API} />
    </div>
);

const ModalDemo: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div style={S.section}>
            <div style={S.sectionTitle}>Modal</div>
            <Button type="primary" onClick={() => setModalOpen(true)}>
                打开 Modal
            </Button>
            <Modal
                open={modalOpen}
                closable={false}
                onClose={() => setModalOpen(false)}
                onOk={() => setModalOpen(false)}
            >
                <span>钓到石头了!</span>
                <span>竟然连这种都能钓起来......</span>
            </Modal>
            <CodeBlock
                code={`import { Button, Modal } from 'animail-crossing-ui';

const App = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button type="primary" onClick={() => setOpen(true)}>打开 Modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} onOk={() => setOpen(false)}>
                <p>Modal 内容</p>
            </Modal>
        </div>
    );
};`}
            />
            <ApiTable rows={MODAL_API} />
        </div>
    );
};

const DividerDemo: React.FC = () => (
    <div style={S.section}>
        <div style={S.sectionTitle}>Divider</div>
        <p>默认分割线</p>
        <Divider />
        <p>下方内容</p>
        <CodeBlock
            code={`import { Divider } from 'animail-crossing-ui';

const App = () => (
    <div>
        <p>上方内容</p>
        <Divider />
        <p>下方内容</p>
    </div>
);`}
        />
        <ApiTable rows={DIVIDER_API} />
    </div>
);

// ============================================
// Page title map
// ============================================
const PAGE_INFO: Record<string, { title: string; desc: string }> = {
    button: {
        title: "Button 按钮",
        desc: "按钮组件 — 支持 primary / dashed / text / link 等类型，danger / ghost / loading / disabled 状态，三种尺寸"
    },
    input: { title: "Input 输入框", desc: "输入框组件 — 支持 clearable、prefix / suffix、error 状态、disabled" },
    switch: { title: "Switch 开关", desc: "开关组件 — 支持受控 / 非受控、自定义文案、small 尺寸、loading 状态" },
    card: { title: "Card 卡片", desc: "卡片容器组件 — 支持标题、extra 操作区、hoverable 效果" },
    collapse: { title: "Collapse 折叠面板", desc: "折叠面板组件 — 支持展开/收起、禁用状态、默认展开" },
    cursor: { title: "Cursor 光标", desc: "光标组件 — 治愈海岛风格手指光标，支持自定义尺寸、点击动画" },
    modal: { title: "Modal 弹窗", desc: "模态弹窗组件 — 支持 ESC / 遮罩关闭、自定义底部按钮" },
    "divider-comp": { title: "Divider 分割线", desc: "分割线组件 — 使用治愈海岛风格装饰分割线图片" }
};

const PAGES: Record<string, React.FC> = {
    button: ButtonDemo,
    input: InputDemo,
    switch: SwitchDemo,
    card: CardDemo,
    collapse: CollapseDemo,
    cursor: CursorDemo,
    modal: ModalDemo,
    "divider-comp": DividerDemo
};

// ============================================
// App
// ============================================
const App: React.FC = () => {
    const [active, setActive] = useState("button");
    const Page = PAGES[active];
    const info = PAGE_INFO[active];

    return (
        <Cursor>
            <div style={S.layout}>
                {/* Sidebar */}
                <aside style={S.sidebar}>
                    <div style={S.sidebarHeader}>🌲 集合啦！療癒系海島</div>
                    <nav style={S.menuList}>
                        {MENU_ITEMS.map((item) => {
                            if (item.key.startsWith("cat-")) {
                                return (
                                    <div
                                        key={item.key}
                                        style={{
                                            padding: "12px 16px 4px",
                                            fontSize: 11,
                                            color: "#a0936e",
                                            fontWeight: 600,
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={item.key}
                                    style={S.menuItem(active === item.key)}
                                    onClick={() => setActive(item.key)}
                                    onMouseEnter={(e) => {
                                        if (active !== item.key) e.currentTarget.style.background = "#f8f4e8";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (active !== item.key) e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    <span>{item.label}</span>
                                </div>
                            );
                        })}
                    </nav>
                    <div
                        style={{ padding: "12px 16px", borderTop: "1px solid #e8e2d6", fontSize: 11, color: "#a0936e" }}
                    >
                        {Object.keys(PAGES).reduce((sum) => sum, 0) ? `${MENU_ITEMS.length} 组 · 8 组件` : ""}
                    </div>
                </aside>

                {/* Main content */}
                <main style={{ ...S.main, position: "relative", zIndex: 1 }}>
                    <Card type="title" style={{ marginBottom: 8, width: "fit-content" }}>
                        <span style={{ fontSize: 24, fontWeight: 700 }}>{info.title}</span>
                    </Card>
                    <div style={S.pageDesc}>{info.desc}</div>
                    <Page />
                </main>

                {/* 装饰底线 */}
                <img
                    src={new URL("./img/guide-bg-line.webp", import.meta.url).href}
                    style={{
                        position: "fixed",
                        left: 220,
                        right: 0,
                        bottom: 0,
                        width: "calc(100% - 220px)",
                        pointerEvents: "none",
                        zIndex: 0
                    }}
                />
            </div>
        </Cursor>
    );
};

export default App;
