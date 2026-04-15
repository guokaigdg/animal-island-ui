import React from 'react';
import { Card, Divider, Button, Switch, Collapse } from '../src';

// ============================================
// Syntax highlighting
// ============================================
const HL_TOKENS: { pattern: RegExp; style: React.CSSProperties }[] = [
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
            /\b(import|from|const|let|var|function|return|export|default|true|false|null|undefined)\b/g,
        style: { color: '#d4a0e0' },
    },
    { pattern: /\b(npm|yarn|pnpm)\b/g, style: { color: '#f0a870' } },
    {
        pattern: /(install|uninstall|run|add|remove)\b/g,
        style: { color: '#a8d4a0' },
    },
    { pattern: /(\{|\})/g, style: { color: '#d4b896' } },
    { pattern: /(=>)/g, style: { color: '#d4a0e0' } },
    { pattern: /(--[\w-]+)(?=\s*:)/g, style: { color: '#e8c87a' } },
    { pattern: /(:root)/g, style: { color: '#f0a870' } },
    { pattern: /(#[0-9a-fA-F]{3,8})\b/g, style: { color: '#8ab8e0' } },
];

const highlightCode = (code: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const lines = code.split('\n');
    lines.forEach((line, li) => {
        type Seg = { start: number; end: number; style: React.CSSProperties };
        const segs: Seg[] = [];
        for (const t of HL_TOKENS) {
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
        for (const seg of segs) {
            if (
                merged.length === 0 ||
                seg.start >= merged[merged.length - 1].end
            )
                merged.push(seg);
        }
        let idx = 0;
        for (const seg of merged) {
            if (seg.start > idx) parts.push(line.slice(idx, seg.start));
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
    <pre style={S.codeBox}>{highlightCode(code)}</pre>
);

// ============================================
// Styles
// ============================================
const S = {
    page: {
        width: '100%',
        minHeight: '100vh',
        overflowY: 'auto' as const,
    } as React.CSSProperties,

    // Hero
    hero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '60px 40px 40px',
        textAlign: 'center' as const,
    } as React.CSSProperties,
    heroLogo: {
        fontSize: 72,
        lineHeight: 1,
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as React.CSSProperties,
    heroTitle: {
        fontFamily: "'FOT-Seurat Pro', 'M PLUS Rounded 1c', sans-serif",
        fontSize: 50,
        fontWeight: 700,
        color: '#FFF9E6',
        textShadow: '0px 4px 1px rgba(0, 0, 0, 0.4)',
        margin: '0 0 12px',
    } as React.CSSProperties,
    heroVersion: {
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 10,
        background: '#e6f9f6',
        color: '#19c8b9',
        marginLeft: 8,
        verticalAlign: 'middle',
        textShadow: 'none',
    } as React.CSSProperties,
    heroSubtitle: {
        fontSize: 17,
        color: '#7c5734',
        lineHeight: 1.7,
        margin: '0 0 28px',
        maxWidth: 520,
    } as React.CSSProperties,
    heroActions: {
        display: 'flex',
        gap: 16,
        alignItems: 'center',
    } as React.CSSProperties,

    // Sections
    section: {
        padding: '48px 40px',
        maxWidth: 960,
        margin: '0 auto',
    } as React.CSSProperties,
    sectionTitle: {
        fontFamily: "'FOT-Seurat Pro', 'M PLUS Rounded 1c', sans-serif",
        fontSize: 24,
        fontWeight: 700,
        color: '#725d42',
        margin: '0 0 8px',
        textAlign: 'center' as const,
    } as React.CSSProperties,
    sectionDesc: {
        fontSize: 14,
        color: '#7c5734',
        textAlign: 'center' as const,
        marginBottom: 32,
    } as React.CSSProperties,

    // Features
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
    } as React.CSSProperties,
    featureCard: {
        padding: '24px 20px',
        textAlign: 'center' as const,
    } as React.CSSProperties,
    featureIcon: { fontSize: 32, marginBottom: 12 } as React.CSSProperties,
    featureTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: '#725d42',
        marginBottom: 6,
    } as React.CSSProperties,
    featureDesc: {
        fontSize: 13,
        color: '#7c5734',
        lineHeight: 1.6,
    } as React.CSSProperties,

    // Component grid
    compGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
    } as React.CSSProperties,
    compCard: {
        padding: '16px 20px',
        cursor: 'pointer',
    } as React.CSSProperties,
    compName: {
        fontSize: 15,
        fontWeight: 700,
        color: '#725d42',
        marginBottom: 4,
    } as React.CSSProperties,
    compDesc: {
        fontSize: 12,
        color: '#7c5734',
        lineHeight: 1.5,
    } as React.CSSProperties,

    // Code block
    codeBox: {
        maxWidth: 600,
        margin: '0 auto',
        padding: '20px 28px',
        background: '#2b2118',
        border: '1px solid #3d3028',
        borderRadius: 12,
        fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
        fontSize: 13,
        fontWeight: 600,
        color: '#e8d5bc',
        textAlign: 'left' as const,
        lineHeight: 1.8,
        whiteSpace: 'pre' as const,
        overflow: 'auto' as const,
    } as React.CSSProperties,

    // Footer
    footer: {
        padding: '32px 40px',
        textAlign: 'center' as const,
        fontSize: 12,
        color: '#7c5734',
        marginTop: 32,
    } as React.CSSProperties,
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 12,
    } as React.CSSProperties,
    footerLink: {
        fontSize: 13,
        color: '#7c5734',
        cursor: 'pointer',
    } as React.CSSProperties,
};

// ============================================
// Data
// ============================================
const features = [
    {
        icon: 'nook1.svg',
        title: '动森风格',
        desc: 'SVG 有机形状裁切，3D 按压按钮，还原 Animal Crossing 游戏 UI 质感',
    },
    {
        icon: 'AppIcons.svg',
        title: '8 个组件',
        desc: 'Button / Input / Switch / Modal / Card / Collapse / Cursor / Divider',
    },
    {
        icon: 'Property-Camera.svg',
        title: '主题定制',
        desc: '40+ CSS 自定义属性，运行时换肤无需重新构建',
    },
    {
        icon: 'Property-Recipes.svg',
        title: '开箱即用',
        desc: 'ESM + CJS 双格式输出，TypeScript 类型声明完整',
    },
];

const components = [
    {
        key: 'button',
        name: 'Button',
        desc: '5 种类型、3 种尺寸、加载/危险/幽灵模式',
    },
    { key: 'input', name: 'Input', desc: '前后缀、一键清空、校验状态' },
    {
        key: 'switch',
        name: 'Switch',
        desc: '受控/非受控、自定义文案、加载状态',
    },
    { key: 'modal', name: 'Modal', desc: 'SVG 有机形状弹窗、ESC 关闭' },
    { key: 'card', name: 'Card', desc: '默认/标题两种卡片风格' },
    { key: 'collapse', name: 'Collapse', desc: 'FAQ 折叠面板、平滑展开动画' },
    { key: 'cursor', name: 'Cursor', desc: '动森风格手指光标' },
    { key: 'divider-comp', name: 'Divider', desc: '装饰性水平分割线' },
];

// ============================================
// HomePage
// ============================================
interface HomePageProps {
    onNavigate?: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => (
    <div style={S.page}>
        {/* Hero */}
        <div style={S.hero}>
            <img
                src={
                    new URL('./img/animal_icon.svg', import.meta.url).href
                }
                style={{ width: 172, height: 172 }}
                alt="logo"
            />
            <h1 style={S.heroTitle}>
                Animal Crossing UI
                <span style={S.heroVersion}>v0.1.0</span>
            </h1>
            <p style={S.heroSubtitle}>
                Animal Crossing 风格的 React 组件库，基于 TypeScript + Vite 构建
                <br />让 Web 应用充满动森的温暖质感
            </p>
            <div style={S.heroActions}>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => onNavigate?.('/button')}
                >
                    开始使用 →
                </Button>
            </div>
        </div>

        {/* Features */}
        <div style={S.section}>
            <div style={S.sectionTitle}>特性</div>
            <div style={S.sectionDesc}>为什么选择 animal-crossing-ui</div>
            <div style={S.features}>
                {features.map((f) => (
                    <Card key={f.title} style={S.featureCard}>
                        <img
                            src={
                                new URL(
                                    `./img/nook-phone/${f.icon}`,
                                    import.meta.url
                                ).href
                            }
                            style={{ width: 42, height: 42 }}
                            alt={f.title}
                        />
                        <div style={S.featureTitle}>{f.title}</div>
                        <div style={S.featureDesc}>{f.desc}</div>
                    </Card>
                ))}
            </div>
        </div>

        <Divider style={{ width: 800, margin: '0 auto' }} />

        {/* Components */}
        <div style={S.section}>
            <div style={S.sectionTitle}>组件一览</div>
            <div style={S.sectionDesc}>点击卡片查看详细文档和在线演示</div>
            <div style={S.compGrid}>
                {components.map((c) => (
                    <Card
                        key={c.key}
                        style={S.compCard}
                        onClick={() => onNavigate?.(`/${c.key}`)}
                    >
                        <div style={S.compName}>{c.name}</div>
                        <div style={S.compDesc}>{c.desc}</div>
                    </Card>
                ))}
            </div>
        </div>

        <Divider style={{ width: 800, margin: '0 auto' }} />

        {/* Install */}
        <div style={S.section}>
            <div style={S.sectionTitle}>安装</div>
            <div style={S.sectionDesc}>一行命令即可安装</div>
            <CodeBlock
                code={`// 使用 npm 安装\nnpm install animal-crossing-ui`}
            />
        </div>

        <Divider style={{ width: 800, margin: '0 auto' }} />

        {/* Quick Start */}
        <div style={S.section}>
            <div style={S.sectionTitle}>快速上手</div>
            <div style={S.sectionDesc}>引入组件即可使用，样式自动加载</div>
            <CodeBlock
                code={`// 1. 引入组件\nimport { Button, Modal, Switch } from 'animal-crossing-ui';\n\nfunction App() {\n        return <Button type="primary">开始</Button>;\n}`}
            />
        </div>

        <Divider style={{ width: 800, margin: '0 auto' }} />

        {/* Theme */}
        <div style={S.section}>
            <div style={S.sectionTitle}>主题定制</div>
            <div style={S.sectionDesc}>
                通过覆盖 CSS 自定义属性实现运行时换肤，无需重新构建
            </div>
            <CodeBlock
                code={`/* 覆盖主题变量 */\n:root {\n        --animal-primary-color: #19c8b9;\n        --animal-text-color: #827157;\n        --animal-font-family: 'M PLUS Rounded 1c', sans-serif;\n        --animal-border-radius-base: 18px;\n        /* ... 40+ 设计令牌 */\n}`}
            />
        </div>

        {/* Footer */}
        <div style={S.footer}>
            <div style={S.footerLinks}>
                <span
                    style={S.footerLink}
                    onClick={() => onNavigate?.('/button')}
                >
                    组件文档
                </span>
                <span
                    style={S.footerLink}
                    onClick={() =>
                        window.open(
                            'https://github.com/guokaigdg/animal-crossing-ui',
                            '_blank'
                        )
                    }
                >
                    GitHub
                </span>
                <span style={S.footerLink} onClick={() => onNavigate?.('/')}>
                    首页
                </span>
            </div>
            <div>MIT License · React + TypeScript + Vite</div>
        </div>
    </div>
);

export default HomePage;
