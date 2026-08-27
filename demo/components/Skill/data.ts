import type { CardColor, CardProps, IconName, TagColor } from '../../../src';

// ============================================
// Skill 介绍页数据 —— 事实来源：
//   skills/animal-island-ui-style/SKILL.md、README.md
// 改技能内容时同步此处
// ============================================

export const INTRO_TAGS = ['React + TypeScript', '30 个组件', '零运行时依赖', 'CC BY-NC 4.0'];

export interface QuickStep {
    title: string;
    desc: string;
    code?: string;
}

/** 快速开始 —— 用户视角的三步 */
export const QUICK_STEPS: QuickStep[] = [
    {
        title: '安装技能',
        desc: '用 skills CLI 一键安装；或手动把 animal-island-ui-style/ 目录复制到代理的 skills 位置。',
        code: `# 方式一：skills CLI（推荐）\nskills add guokaigdg/animal-island-ui\n\n# 方式二：手动复制到 Claude Code 的 skills 目录\n# cp -r animal-island-ui-style ~/.claude/skills/`,
    },
    {
        title: '正常提需求',
        desc: '无需记住任何指令。描述里出现「动物之森风格」「animal island 风格」或指定用 animal-island-ui 搭页面时，代理会自动加载技能。',
        code: `# 对话里直接说即可\n用 animal-island-ui 做一个岛民档案页：头像卡、里程进度、装备清单\n做一个动物之森风格的单文件 HTML 落地页，不要构建步骤`,
    },
    {
        title: '按规则验收',
        desc: '产出必须满足技能里的硬性规则：只用库组件与 var(--animal-*) 令牌、无纯黑文字、无冷蓝焦点环、图标只用 <Icon />。不满足即视为 bug，可直接让代理按规则自查。',
    },
];

export interface WorkflowStep {
    icon: IconName;
    pattern: CardProps['pattern'];
    title: string;
    desc: string;
}

/** 工作原理 —— 代理视角的五步 */
export const WORKFLOW: WorkflowStep[] = [
    {
        icon: 'icon-shopping',
        pattern: 'app-blue',
        title: '装载',
        desc: '技能是纯文本知识包，没有可执行代码，安装后躺在代理的 skills 目录里',
    },
    {
        icon: 'icon-chat',
        pattern: 'app-orange',
        title: '触发',
        desc: '代理按 SKILL.md 的 description 匹配当前对话，命中才加载正文，不占用日常上下文',
    },
    {
        icon: 'icon-variant',
        pattern: 'app-yellow',
        title: '路由',
        desc: 'React 项目读 react-project.md，单文件 HTML 读 standalone-html.md',
    },
    {
        icon: 'icon-encyclopedia',
        pattern: 'app-teal',
        title: '对照 API',
        desc: 'props、合法取值、默认值逐个查 references/components/，杜绝凭印象编造',
    },
    {
        icon: 'icon-design',
        pattern: 'brown',
        title: '产出',
        desc: '按令牌与硬性规则落地：暖色羊皮纸、薄荷主色、胶囊形状与 3D 按钮质感',
    },
];

export interface Scenario {
    title: string;
    icon: IconName;
    color: CardColor;
    agents: string[];
    desc: string;
    entry: string;
}

export const SCENARIOS: Scenario[] = [
    {
        title: 'React 项目',
        icon: 'icon-design',
        color: 'app-teal',
        agents: ['Claude Code', 'Codex', 'Cursor'],
        desc: '已安装 animal-island-ui npm 包的工程：代理以包内 TypeScript 声明为准搭页面，并用 --animal-* 令牌做主题。',
        entry: 'references/react-project.md',
    },
    {
        title: '独立 HTML',
        icon: 'icon-map',
        color: 'app-yellow',
        agents: ['任意兼容代理'],
        desc: '无 npm、无打包器：React 走 CDN + Babel 运行时，手写组件但镜像真实 API，产出单个 index.html。',
        entry: 'references/standalone-html.md',
    },
];

export const SKILL_TREE = `animal-island-ui-style/
├── SKILL.md                     # 入口：风格摘要、令牌、场景路由、硬性规则
├── SKILL.zh-CN.md               # 中文翻译（人工审阅用，代理只读 SKILL.md）
└── references/
    ├── react-project.md         # 场景一：React 项目 + npm 包
    ├── standalone-html.md       # 场景二：单文件 HTML，无构建
    └── components/              # 按分类的 props 参考（9 个文件、30 个组件）`;

export interface CatalogRow {
    category: string;
    color: TagColor;
    components: string[];
    reference: string;
}

export const CATALOG: CatalogRow[] = [
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
    { category: 'Overlays', color: 'purple', components: ['Modal', 'Drawer', 'Tooltip'], reference: 'overlays.md' },
    {
        category: 'Feedback',
        color: 'app-orange',
        components: ['Loading', 'Progress', 'Skeleton', 'BackTop'],
        reference: 'feedback.md',
    },
    { category: 'Notification', color: 'app-red', components: ['Notification'], reference: 'Notification.md' },
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

export interface RuleGroup {
    title: string;
    icon: IconName;
    color: TagColor;
    rules: string[];
}

export const RULE_GROUPS: RuleGroup[] = [
    {
        title: 'API 纪律',
        icon: 'icon-encyclopedia',
        color: 'app-red',
        rules: [
            '绝不编造 props —— 每个 prop 必须出现在组件参考或包内 TS 声明中。',
            'Select 仅受控（options + value + onChange 全必填）；受控 Input / Switch / Checkbox / Radio 也必须带 onChange。',
            '优先库组件而非裸 HTML：不出现可见的原生 button / input / select / checkbox / radio。',
        ],
    },
    {
        title: '导入与工程',
        icon: 'icon-map',
        color: 'app-blue',
        rules: [
            "样式只导入一次：应用入口 `import 'animal-island-ui/style'`，否则组件无样式。",
            '只从包根与 style 入口导入 —— 禁止深路径导入。',
            '禁止用 className / style 覆盖组件的颜色、圆角、阴影；自定义元素用 var(--animal-*) 令牌上色。',
        ],
    },
    {
        title: '色彩与字体',
        icon: 'icon-design',
        color: 'app-pink',
        rules: [
            '禁用纯黑（#000 / #111）文字与冷灰（#fafafa / #f5f5f5）背景。',
            '禁用冷蓝焦点环 —— 焦点色为黄色（输入框）或薄荷主色（按钮）。',
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
            '图标一律用 <Icon name="..." />（内置 10 个）—— 禁止 emoji、Unicode 符号、手写 SVG、第三方图标字体。',
            '动效使用 cubic-bezier(0.4, 0, 0.2, 1)，时长 0.15–0.35s。',
        ],
    },
];

export interface TokenGroup {
    label: string;
    tokens: string[];
}

/** 有颜色的令牌 —— 渲染成色板 */
export const COLOR_TOKEN_GROUPS: TokenGroup[] = [
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

/** 非颜色令牌 —— 只列名字 */
export const SCALE_TOKEN_GROUPS: TokenGroup[] = [
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
