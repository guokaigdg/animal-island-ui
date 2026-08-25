import React from 'react';
import { Card, Icon, Tag, type CardColor, type CardPattern, type IconName, type TagColor } from '../../../src';
import { sectionStyle, sectionTitleStyle, DemoTag, demoBodyStyle, textStyle, labelStyle } from '../../tools';

// ============================================
// Skill 介绍 — animal-island-ui-style
// ============================================

const INTRO_TAGS = ['React + TypeScript', '30 组件', '零运行时依赖', 'CC BY-NC 4.0'];

const WORKFLOW: { icon: IconName; pattern: CardPattern; title: string; desc: string }[] = [
    {
        icon: 'icon-shopping',
        pattern: 'app-blue',
        title: '安装技能',
        desc: 'skills CLI 一键装进代理的 skills 目录，或手动复制',
    },
    {
        icon: 'icon-map',
        pattern: 'app-orange',
        title: '读取入口',
        desc: '代理按需加载 SKILL.md —— 风格摘要、设计令牌与硬性规则',
    },
    {
        icon: 'icon-variant',
        pattern: 'app-yellow',
        title: '场景路由',
        desc: 'React 项目走 react-project.md，单文件 HTML 走 standalone-html.md',
    },
    {
        icon: 'icon-encyclopedia',
        pattern: 'app-teal',
        title: '查阅参考',
        desc: 'props、合法取值、默认值逐个对照 references/components/ 分类参考',
    },
    {
        icon: 'icon-design',
        pattern: 'brown',
        title: '输出页面',
        desc: '生成同风格页面：暖色羊皮纸、薄荷主色、胶囊与 3D 按钮质感',
    },
];

const SCENARIOS: { title: string; icon: IconName; color: CardColor; agents: string[]; desc: string; entry: string }[] =
    [
        {
            title: 'React 项目',
            icon: 'icon-design',
            color: 'app-teal',
            agents: ['Claude Code', 'Codex', 'Cursor'],
            desc: '在已安装 animal-island-ui npm 包的项目中，让 AI 按组件 API 与设计规范搭建页面',
            entry: 'references/react-project.md',
        },
        {
            title: '独立 HTML',
            icon: 'icon-map',
            color: 'app-yellow',
            agents: ['任意兼容代理'],
            desc: '无构建步骤，React 走 CDN + Babel 运行时，手写组件但镜像真实 API，输出单文件 index.html',
            entry: 'references/standalone-html.md',
        },
    ];

const CATALOG: { category: string; color: TagColor; components: string[]; reference: string }[] = [
    {
        category: 'General',
        color: 'app-teal',
        components: ['Button', 'Icon', 'Typewriter', 'Cursor'],
        reference: 'general.md',
    },
    {
        category: 'Layout',
        color: 'app-yellow',
        components: ['Card', 'Title', 'Divider', 'Collapse', 'Tabs'],
        reference: 'layout.md',
    },
    {
        category: 'Form controls',
        color: 'app-blue',
        components: ['Input', 'Switch', 'Checkbox', 'Radio', 'Select'],
        reference: 'form-controls.md',
    },
    {
        category: 'Form container',
        color: 'app-pink',
        components: ['Form', 'FormItem', 'useForm'],
        reference: 'Form.md',
    },
    {
        category: 'Overlays',
        color: 'purple',
        components: ['Modal', 'Drawer', 'Tooltip'],
        reference: 'overlays.md',
    },
    {
        category: 'Feedback',
        color: 'app-orange',
        components: ['Loading', 'Progress', 'Skeleton', 'BackTop'],
        reference: 'feedback.md',
    },
    {
        category: 'Notification',
        color: 'app-red',
        components: ['Notification'],
        reference: 'Notification.md',
    },
    {
        category: 'Data displays',
        color: 'app-green',
        components: ['Table', 'CodeBlock', 'Tag'],
        reference: 'data-display.md',
    },
    {
        category: 'Decorative',
        color: 'brown',
        components: ['Time', 'Phone', 'Footer', 'Wallet'],
        reference: 'decorative.md',
    },
];

const RULE_GROUPS: { title: string; icon: IconName; color: TagColor; rules: string[] }[] = [
    {
        title: 'API 纪律',
        icon: 'icon-encyclopedia',
        color: 'app-red',
        rules: [
            '绝不编造 props —— 每个 prop 必须出现在组件参考或 TS 类型声明中。',
            'Select 仅受控（options + value + onChange 全必填）；受控 Input/Switch/Checkbox/Radio 也必须带 onChange。',
            '优先库组件而非裸 HTML：不出现原生 button / input / select / checkbox / radio。',
        ],
    },
    {
        title: '导入与工程',
        icon: 'icon-map',
        color: 'app-blue',
        rules: [
            "样式只导入一次：应用入口 `import 'animal-island-ui/style'`，否则组件无样式。",
            '只从包根与 style 入口导入 —— 禁止深路径导入。',
            '禁止用 className / style 覆盖组件颜色、圆角、阴影；自定义元素用 var(--animal-*) 令牌上色。',
        ],
    },
    {
        title: '色彩与字体',
        icon: 'icon-design',
        color: 'app-pink',
        rules: [
            '禁用纯黑（#000/#111）文字与冷灰（#fafafa/#f5f5f5）背景。',
            '禁用冷蓝焦点环 —— 焦点色为黄色（#ffcc00，输入框）或薄荷主色（按钮）。',
            '字体为 Nunito + Noto Sans SC；字重不低于 400；UI 文本不用等宽字体（CodeBlock 除外）。',
        ],
    },
    {
        title: '形状与质感',
        icon: 'icon-diy',
        color: 'app-yellow',
        rules: [
            '可交互元素圆角不得小于 12px；按钮与输入框为 50px 胶囊。',
            '3D 像素堆叠阴影只属于 primary / danger-primary 按钮；Card 无 box-shadow，Switch 无外阴影。',
            'Modal 必须保留 SVG 有机 blob 裁切；Title 是燕尾丝带，不是 blob / 胶囊 / 方块。',
        ],
    },
    {
        title: '图标与动效',
        icon: 'icon-camera',
        color: 'app-teal',
        rules: [
            '图标一律用 `<Icon name="..." />`（内置 10 个）—— 禁止 emoji、Unicode 符号（✓ ✕ →）、手写 SVG、第三方图标字体。',
            '动效使用 cubic-bezier(0.4, 0, 0.2, 1)，时长 0.15–0.35s。',
        ],
    },
];

const TOKEN_GROUPS: { label: string; tokens: string[] }[] = [
    {
        label: '主色 primary',
        tokens: [
            '--animal-primary-color',
            '--animal-primary-color-hover',
            '--animal-primary-color-active',
            '--animal-primary-color-bg',
        ],
    },
    {
        label: '状态色 status',
        tokens: ['--animal-success-color', '--animal-warning-color', '--animal-error-color'],
    },
    {
        label: '文字色 text',
        tokens: ['--animal-text-color', '--animal-text-color-secondary', '--animal-text-color-disabled'],
    },
    {
        label: '边框与背景 border / bg',
        tokens: [
            '--animal-border-color',
            '--animal-border-color-light',
            '--animal-bg-color',
            '--animal-bg-color-secondary',
        ],
    },
];

const TOKEN_TAG_GROUPS: { label: string; tokens: string[] }[] = [
    {
        label: '圆角',
        tokens: ['--animal-border-radius-sm', '--animal-border-radius-base', '--animal-border-radius-lg'],
    },
    {
        label: '间距',
        tokens: [
            '--animal-spacing-xs',
            '--animal-spacing-sm',
            '--animal-spacing-md',
            '--animal-spacing-lg',
            '--animal-spacing-xl',
        ],
    },
    { label: '阴影', tokens: ['--animal-shadow-sm', '--animal-shadow-base', '--animal-shadow-lg'] },
    {
        label: '字体',
        tokens: ['--animal-font-family', '--animal-font-size-sm', '--animal-font-size-base', '--animal-font-size-lg'],
    },
];

// ============================================
// Shell / 目录树代码块 — 库的 CodeBlock 只做 JSX/TS 词法高亮，
// 不识别 shell 的 `#` 注释与目录树字符，这里提供演示页专用的轻量高亮
// ============================================
const SHELL_COLORS = {
    comment: '#6b5e50',
    string: '#a8d4a0',
    keyword: '#d4a0e0',
    file: '#80c0e0',
    command: '#61afef',
    option: '#e8c87a',
    tree: '#d4b896',
    default: '#e8d5bc',
};

const SHELL_TOKENS: { pattern: RegExp; color: string }[] = [
    // # 注释（含目录树行内注释）
    { pattern: /#.*$/, color: SHELL_COLORS.comment },
    // 目录树连接字符
    { pattern: /[├└]──|│/, color: SHELL_COLORS.tree },
    // 引号字符串
    { pattern: /'[^']*'|"[^"]*"/g, color: SHELL_COLORS.string },
    // 文件名（带扩展名）
    { pattern: /\b[\w.-]+\.(md|tsx?|less|css|json|html)\b/g, color: SHELL_COLORS.file },
    // 命令关键字
    { pattern: /\b(skills|add|cp|npm|npx|yarn|pnpm|install|uninstall|run|remove)\b/g, color: SHELL_COLORS.command },
    // 选项参数 --xxx / -x
    { pattern: /(?:\s|^)(--?[\w-]+)/g, color: SHELL_COLORS.option },
    // 家目录路径
    { pattern: /~\/[\w./-]*/g, color: SHELL_COLORS.string },
];

const highlightShell = (code: string): React.ReactNode[] => {
    const lines = code.split('\n');
    const parts: React.ReactNode[] = [];
    lines.forEach((line, li) => {
        type Seg = { start: number; end: number; color: string };
        const segs: Seg[] = [];
        for (const t of SHELL_TOKENS) {
            // 强制 g flag：缺少 g 时 exec 不会推进 lastIndex，会导致 while 死循环
            const re = new RegExp(
                t.pattern.source,
                t.pattern.flags.includes('g') ? t.pattern.flags : `${t.pattern.flags}g`
            );
            let m: RegExpExecArray | null;
            while ((m = re.exec(line)) !== null) {
                const rel = m[1] && m[0].includes(m[1]) ? m[0].indexOf(m[1]) : 0;
                const s = m.index + rel;
                const text = m[1] || m[0];
                segs.push({ start: s, end: s + text.length, color: t.color });
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
                <span key={`${li}-${seg.start}`} style={{ color: seg.color }}>
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

const shellBlockStyle: React.CSSProperties = {
    padding: '20px 24px',
    background: '#2b2118',
    border: '1px solid #3d3028',
    borderRadius: 20,
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    fontWeight: 600,
    color: '#e8d5bc',
    whiteSpace: 'pre' as const,
    overflow: 'auto' as const,
    tabSize: 4,
};

const ShellCode: React.FC<{ code: string }> = ({ code }) => <pre style={shellBlockStyle}>{highlightShell(code)}</pre>;

// ============================================
// 设计令牌色板 — 直接渲染 var(--animal-*) 真实取值
// ============================================
const Swatch: React.FC<{ token: string }> = ({ token }) => {
    const [value, setValue] = React.useState('');

    React.useEffect(() => {
        setValue(getComputedStyle(document.documentElement).getPropertyValue(token).trim());
    }, [token]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                width: 124,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    background: `var(${token})`,
                    border: '1px solid rgba(114, 93, 66, 0.18)',
                    boxShadow: 'inset 0 -3px 0 rgba(0, 0, 0, 0.08)',
                }}
            />
            <code style={{ fontSize: 10, color: '#725d42', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {token.replace('--animal-', '')}
            </code>
            <code style={{ fontSize: 10, color: '#a0936e', whiteSpace: 'nowrap' }}>{value || '—'}</code>
        </div>
    );
};

// ============================================
// 工作原理步骤卡
// ============================================
const StepCard: React.FC<{
    step: number;
    icon: IconName;
    pattern: CardPattern;
    title: string;
    desc: string;
    isLast: boolean;
}> = ({ step, icon, pattern, title, desc, isLast }) => (
    <div style={{ position: 'relative' }}>
        <Card pattern={pattern} style={{ padding: 18, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: '#82d5bb',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 800,
                        flexShrink: 0,
                        boxShadow: '0 2px 0 rgba(97, 158, 138, 0.6)',
                    }}
                >
                    {step}
                </span>
                <Icon name={icon} size={26} />
                <span style={{ fontSize: 15, fontWeight: 700, color: '#725d42' }}>{title}</span>
            </div>
            <p style={{ ...textStyle, lineHeight: 1.7, margin: 0 }}>{desc}</p>
        </Card>
        {!isLast && (
            <span
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: -13,
                    transform: 'translateY(-50%)',
                    color: '#a0936e',
                    fontSize: 15,
                    fontWeight: 800,
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            >
                ›
            </span>
        )}
    </div>
);

// ============================================
// 硬性规则分组卡
// ============================================
const RuleCard: React.FC<{ title: string; icon: IconName; color: TagColor; rules: string[] }> = ({
    title,
    icon,
    color,
    rules,
}) => (
    <Card type="dashed" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Icon name={icon} size={22} />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#725d42' }}>{title}</span>
            <Tag size="small" variant="soft" color={color}>
                {rules.length} 条
            </Tag>
        </div>
        <ul style={{ ...textStyle, paddingLeft: 18, lineHeight: 1.9, margin: 0 }}>
            {rules.map((rule, i) => (
                <li key={i} style={{ marginBottom: i < rules.length - 1 ? 6 : 0 }}>
                    {rule}
                </li>
            ))}
        </ul>
    </Card>
);

const SkillDemo: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ---- 简介 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    animal-island-ui-style <DemoTag>AI Skill</DemoTag>
                    <DemoTag>可安装</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={textStyle}>
                        一个可安装的编码助手技能，教会 AI 代理（Claude Code、Codex、Cursor 等兼容 SKILL.md
                        的代理）按动物之森风格搭建 UI：暖色调羊皮纸背景、大地色文字、薄荷主色、胶囊形状与 3D
                        游戏按钮质感。零运行时依赖、30+ 组件。
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                        {INTRO_TAGS.map((t) => (
                            <Tag key={t} size="small" variant="outlined">
                                {t}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- 工作原理 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    工作原理 <DemoTag>Workflow</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={{ ...textStyle, marginBottom: 14 }}>
                        技能是一个纯文本知识包，没有可执行代码 —— 代理在对话中按下面五步消费它：
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: 20,
                        }}
                    >
                        {WORKFLOW.map((s, i) => (
                            <StepCard
                                key={s.title}
                                step={i + 1}
                                icon={s.icon}
                                pattern={s.pattern}
                                title={s.title}
                                desc={s.desc}
                                isLast={i === WORKFLOW.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- 安装 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    安装 <DemoTag>Install</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={textStyle}>使用 skills CLI 一键安装，或手动把目录复制到代理的 skills 目录。</p>
                    <ShellCode
                        code={`# 方式一：skills CLI\nskills add guokaigdg/animal-island-ui\n\n# 方式二：手动复制到 Claude Code 的 skills 目录\n# cp -r animal-island-ui-style ~/.claude/skills/`}
                    />
                </div>
            </div>

            {/* ---- 目录结构 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    目录结构 <DemoTag>Layout</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <ShellCode
                        code={`animal-island-ui-style/\n├── SKILL.md                     # 入口：风格摘要、令牌、场景路由、硬性规则\n├── SKILL.zh-CN.md               # 中文翻译（人工审阅用，代理只读 SKILL.md）\n└── references/\n    ├── react-project.md         # 场景一：React 项目 + npm 包\n    ├── standalone-html.md       # 场景二：单文件 HTML，无构建\n    └── components/              # 按分类的 props 参考（9 个文件、30 个组件）`}
                    />
                </div>
            </div>

            {/* ---- 使用场景 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    两种使用场景 <DemoTag>Scenarios</DemoTag>
                </div>
                <div style={{ height: 10 }} />
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {SCENARIOS.map((s) => (
                            <Card key={s.title} color={s.color} style={{ padding: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <Icon name={s.icon} size={30} />
                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#725d42' }}>{s.title}</span>
                                </div>
                                <p style={{ ...textStyle, lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                                    {s.agents.map((a) => (
                                        <Tag key={a} size="small" variant="outlined" style={{ background: '#fff' }}>
                                            {a}
                                        </Tag>
                                    ))}
                                </div>
                                <code
                                    style={{
                                        fontSize: 12,
                                        color: '#6b5e50',
                                        background: '#fff',
                                        border: '1px solid #c4b89e',
                                        padding: '3px 10px',
                                        borderRadius: 8,
                                    }}
                                >
                                    {s.entry}
                                </code>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- 组件目录 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    组件目录 <DemoTag>30 Components</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={{ ...textStyle, marginBottom: 12 }}>
                        props 参考按分类放在 references/components/ 下（props、合法取值、默认值均直接取自源码）。
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {CATALOG.map((row) => (
                            <div
                                key={row.category}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 10,
                                    padding: '12px 16px',
                                    background: '#faf8f3',
                                    border: '1px solid #e8e2d6',
                                    borderRadius: 14,
                                }}
                            >
                                <Tag
                                    variant="soft"
                                    color={row.color}
                                    style={{ minWidth: 128, justifyContent: 'center' }}
                                >
                                    {row.category}
                                </Tag>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                                    {row.components.map((c) => (
                                        <Tag key={c} size="small" variant="outlined">
                                            {c}
                                        </Tag>
                                    ))}
                                </div>
                                <code
                                    style={{
                                        fontSize: 12,
                                        color: '#8a7b66',
                                        background: '#f0e8d8',
                                        padding: '2px 8px',
                                        borderRadius: 6,
                                    }}
                                >
                                    {row.reference}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- 设计令牌 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    设计令牌 <DemoTag>--animal-*</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={{ ...textStyle, marginBottom: 16 }}>
                        打包样式在 :root 上声明了运行时 CSS 自定义属性（前缀
                        --animal-*）。下面色板取的是当前页面真实令牌值 ——
                        消费者覆盖变量即可运行时换肤。精确清单见设计系统的 css-variables.md 与 design-tokens.md。
                    </p>
                    {TOKEN_GROUPS.map((group) => (
                        <div key={group.label} style={{ marginBottom: 18 }}>
                            <div style={labelStyle}>{group.label}</div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    gap: 20,
                                    overflowX: 'auto',
                                    paddingBottom: 4,
                                }}
                            >
                                {group.tokens.map((token) => (
                                    <Swatch key={token} token={token} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {TOKEN_TAG_GROUPS.map((group) => (
                        <div
                            key={group.label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 8,
                                marginBottom: 10,
                            }}
                        >
                            <span style={{ ...textStyle, fontWeight: 600, color: '#725d42', minWidth: 48 }}>
                                {group.label}
                            </span>
                            {group.tokens.map((token) => (
                                <Tag key={token} size="small" variant="soft">
                                    {token}
                                </Tag>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ---- 硬性规则 ---- */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>
                    硬性规则 <DemoTag>Hard Rules</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={{ ...textStyle, marginBottom: 14 }}>违反以下规则视为 bug，AI 不得越界：</p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {RULE_GROUPS.map((g) => (
                            <RuleCard key={g.title} title={g.title} icon={g.icon} color={g.color} rules={g.rules} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- 许可证 ---- */}
            <div style={{ ...sectionStyle, borderStyle: 'dashed' }}>
                <div style={sectionTitleStyle}>
                    许可证 <DemoTag>License</DemoTag>
                </div>
                <div style={{ ...demoBodyStyle, marginTop: 10 }}>
                    <p style={textStyle}>
                        本组件库与该技能均为 CC BY-NC 4.0 —— 仅限非商业使用。完整条款见仓库 LICENSE 文件。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SkillDemo;
