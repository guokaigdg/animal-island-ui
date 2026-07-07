import React, { useState, useEffect } from 'react';
import { Card, Divider, Button, Switch, Collapse, Typewriter } from '../src';
import { useIsMobile } from './tools';

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
        pattern: /\b(import|from|const|let|var|function|return|export|default|true|false|null|undefined)\b/g,
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
                const s = m.index + (m[0] !== m[1] && m[1] ? m[0].indexOf(m[1]) : 0);
                const text = m[1] || m[0];
                segs.push({ start: s, end: s + text.length, style: t.style });
            }
        }
        segs.sort((a, b) => a.start - b.start);
        const merged: Seg[] = [];
        for (const seg of segs) {
            if (merged.length === 0 || seg.start >= merged[merged.length - 1].end) merged.push(seg);
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

const CodeBlock: React.FC<{ code: string }> = ({ code }) => <pre style={S.codeBox}>{highlightCode(code)}</pre>;

const FeatureCard: React.FC<{ feature: (typeof features)[0] }> = ({ feature }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Card
            style={{
                ...S.featureCard,
                transform: hovered ? 'translateY(-4px)' : 'none',
                boxShadow: hovered ? '0 8px 24px rgba(114, 93, 66, 0.15)' : 'none',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img
                src={new URL(`./img/island-phone/${feature.icon}`, import.meta.url).href}
                style={{
                    width: 42,
                    height: 42,
                    transform: hovered ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    animation: hovered ? 'iconBounce 0.4s ease forwards' : 'none',
                }}
                alt={feature.title}
            />
            <style>
                {`
                    @keyframes iconBounce {
                        0% { transform: scale(1) rotate(0deg); }
                        50% { transform: scale(1.2) rotate(-5deg); }
                        100% { transform: scale(1.1) rotate(-4deg); }
                    }
                `}
            </style>
            <div style={S.featureTitle}>{feature.title}</div>
            <div style={S.featureDesc}>{feature.desc}</div>
        </Card>
    );
};

// ============================================
// Styles
// ============================================
const S = {
    page: {
        width: '100%',
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
    } as React.CSSProperties,

    // Hero
    hero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '60px 40px 40px',
        position: 'relative',
    } as React.CSSProperties,
    heroContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 150,
        alignItems: 'center',
        maxWidth: 880,
        width: '100%',
    } as React.CSSProperties,
    heroContentMobile: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 32,
        alignItems: 'center',
        maxWidth: 880,
        width: '100%',
    } as React.CSSProperties,
    heroText: {
        textAlign: 'left' as const,
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
        fontFamily:
            "Nunito, 'Zen Maru Gothic', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        fontSize: 55,
        fontWeight: 800,
        lineHeight: 1.1,
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
        fontFamily:
            "Nunito, 'Zen Maru Gothic', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
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
        display: '-webkit-box' as const,
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis' as const,
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
        borderRadius: 20,
        fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
        fontSize: 13,
        fontWeight: 600,
        color: '#e8d5bc',
        textAlign: 'left' as const,
        lineHeight: 1.8,
        whiteSpace: 'pre' as const,
        overflow: 'auto' as const,
        tabSize: 4,
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
        gap: 20,
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
        icon: 'island1.svg',
        title: 'Animal风格',
        desc: 'SVG 有机形状裁切，3D 按压按钮，温暖质朴的自然 UI 质感',
    },
    {
        icon: 'Property-Shopping.svg',
        title: '28 个组件',
        desc: 'Button / Input / Switch / Modal / Form / Table / Title / Tooltip / Typewriter / Card / Collapse / Cursor / Divider / Time / Phone / Footer / Icon / Checkbox / Select / Tabs / CodeBlock / Loading / Radio / InvitationCard / Wallet / Tag / Notification / Progress',
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
        key: 'form',
        name: 'Form',
        desc: '校验规则 / useForm 命令式 / 三种布局',
    },
    {
        key: 'switch',
        name: 'Switch',
        desc: '受控/非受控、自定义文案、加载状态',
    },
    { key: 'checkbox', name: 'Checkbox', desc: '多选框组件，支持水平/垂直排列' },
    {
        key: 'select',
        name: 'Select',
        desc: '下拉选择器，支持搜索和禁用',
    },
    { key: 'tabs', name: 'Tabs', desc: '标签页组件，支持受控/非受控模式' },
    { key: 'modal', name: 'Modal', desc: 'SVG 有机形状弹窗、ESC 关闭' },
    { key: 'drawer', name: 'Drawer', desc: '下沉景深抽屉，四方向 + 背景下沉' },
    {
        key: 'notification',
        name: 'Notification',
        desc: '命令式通知，4 种 type × 6 个 position',
    },
    {
        key: 'progress',
        name: 'Progress',
        desc: '叶子填充进度条，5 种 status × 3 档 size',
    },
    {
        key: 'typewriter',
        name: 'Typewriter',
        desc: '逐字打字机效果，支持多行与富内容',
    },
    { key: 'card', name: 'Card', desc: '默认/标题两种卡片风格' },
    { key: 'collapse', name: 'Collapse', desc: 'FAQ 折叠面板、平滑展开动画' },
    { key: 'cursor', name: 'Cursor', desc: '自定义手指光标，支持多种尺寸' },
    { key: 'divider-comp', name: 'Divider', desc: '装饰性水平分割线' },
    { key: 'icon', name: 'Icon', desc: 'SVG 图标库' },
    { key: 'footer', name: 'Footer', desc: '页脚组件' },
    { key: 'time', name: 'Time', desc: '可爱风格时间显示' },
    { key: 'phone', name: 'Phone', desc: 'Phone 模拟器' },
    { key: 'codeblock', name: 'CodeBlock', desc: '代码语法高亮组件' },
    { key: 'loading', name: 'Loading', desc: '动物主题小岛加载动画' },
];

// ============================================
// HomePage
// ============================================
interface HomePageProps {
    onNavigate?: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    const isMobile = useIsMobile();
    const [showScrollHint, setShowScrollHint] = useState(true);
    const pageRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (pageRef.current) {
            if (pageRef.current.scrollTop > 70) {
                setShowScrollHint(false);
            } else {
                setShowScrollHint(true);
            }
        }
    };

    return (
        <div ref={pageRef} style={{ ...S.page, overflow: 'auto' }} onScroll={handleScroll}>
            {/* Hero */}
            <div style={{ ...S.hero }}>
                <div style={isMobile ? S.heroContentMobile : S.heroContent}>
                    {isMobile && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={new URL('./img/animal_icon.png', import.meta.url).href}
                                style={{ width: 180, height: 112 }}
                                alt="logo"
                                decoding="async"
                            />
                        </div>
                    )}
                    <div style={isMobile ? { textAlign: 'center' as const } : S.heroText}>
                        <h1 style={{ ...S.heroTitle, fontSize: isMobile ? 37 : 60 }}>
                            {isMobile ? (
                                'Animal Island UI'
                            ) : (
                                <>
                                    Animal <br /> Island UI
                                </>
                            )}
                            <span style={S.heroVersion}>v1.0.0</span>
                        </h1>
                        <Typewriter speed={60}>
                            <p style={{ ...S.heroSubtitle, fontSize: isMobile ? 14 : 17 }}>
                                Animal 风格的 React 组件库，基于 TypeScript + Vite 构建，让 Web 应用充满温暖质感
                            </p>
                        </Typewriter>
                        <div style={{ ...S.heroActions, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                            <Button type="primary" size="large" onClick={() => onNavigate?.('/button')}>
                                开始使用 →
                            </Button>
                        </div>
                    </div>
                    {!isMobile && (
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={new URL('./img/animal_icon.png', import.meta.url).href}
                                style={{ width: 320, height: 200 }}
                                alt="logo"
                                decoding="async"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    animation: showScrollHint ? 'bounce 2s ease-in-out infinite' : 'none',
                    opacity: showScrollHint ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: showScrollHint ? 'auto' : 'none',
                }}
            >
                <span style={{ color: '#FFF9E6', fontSize: 12, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    向下滑动
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 5v14M5 12l7 7 7-7"
                        stroke="#FFF9E6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <style>{`
            @keyframes bounce {
                0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
                50% { transform: translateX(-50%) translateY(-8px); opacity: 0.7; }
            }
        `}</style>

            {/* Features */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>特性</div>
                <div style={S.sectionDesc}>为什么选择 animal-island-ui</div>
                <div style={S.features}>
                    {features.map((f) => (
                        <FeatureCard key={f.title} feature={f} />
                    ))}
                </div>
            </div>

            <Divider style={{ width: isMobile ? '90%' : 800, margin: '0 auto' }} />

            {/* Components */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>组件一览</div>
                <div style={S.sectionDesc}>点击卡片查看详细文档和在线演示</div>
                <div style={S.compGrid}>
                    {components.map((c) => (
                        <Card key={c.key} style={S.compCard} onClick={() => onNavigate?.(`/${c.key}`)}>
                            <div style={S.compName}>{c.name}</div>
                            <div style={S.compDesc}>{c.desc}</div>
                        </Card>
                    ))}
                </div>
            </div>

            <Divider style={{ width: isMobile ? '90%' : 800, margin: '0 auto' }} />

            {/* Install */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>安装</div>
                <div style={S.sectionDesc}>一行命令即可安装</div>
                <CodeBlock code={`// 使用 npm 安装\nnpm install animal-island-ui`} />
            </div>

            <Divider style={{ width: isMobile ? '90%' : 800, margin: '0 auto' }} />

            {/* Quick Start */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>快速上手</div>
                <div style={S.sectionDesc}>引入组件即可使用，样式自动加载</div>
                <CodeBlock
                    code={`// 1. 引入组件\nimport { Button, Modal, Switch } from 'animal-island-ui';\nimport 'animal-island-ui/style';\n\nfunction App() {\n    return <Button>开始</Button>;\n}`}
                />
            </div>

            <Divider style={{ width: isMobile ? '90%' : 800, margin: '0 auto' }} />

            {/* Theme */}
            <div style={{ ...S.section, padding: isMobile ? '32px 16px' : '48px 40px' }}>
                <div style={S.sectionTitle}>主题定制</div>
                <div style={S.sectionDesc}>通过覆盖 CSS 自定义属性实现运行时换肤，无需重新构建</div>
                <CodeBlock
                    code={`/* 覆盖主题变量 */\n:root {\n    --animal-primary-color: #19c8b9;\n    --animal-text-color: #827157;\n    --animal-font-family: 'Noto Sans SC', sans-serif;\n    --animal-border-radius-base: 18px;\n    /* ... 40+ 设计令牌 */\n}`}
                />
            </div>

            {/* Footer */}
            <div style={{ ...S.footer, padding: isMobile ? '24px 16px' : '32px 40px' }}>
                <div style={S.footerLinks}>
                    <span style={S.footerLink} onClick={() => onNavigate?.('/button')}>
                        组件文档
                    </span>
                    <span
                        style={S.footerLink}
                        onClick={() => window.open('https://github.com/guokaigdg/animal-island-ui', '_blank')}
                    >
                        GitHub
                    </span>
                </div>
                <div>MIT License · React + TypeScript + Vite</div>
            </div>
        </div>
    );
};

export default HomePage;
