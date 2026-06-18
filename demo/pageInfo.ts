// 独立的轻量页面元信息，供 App 等场景静态导入，避免拉入整个 ComponentPage bundle
export interface ComponentNavItem {
    key: string;
    label: string;
    isNew?: boolean;
}

export interface ComponentNavSection {
    key: string;
    label: string;
    children: ComponentNavItem[];
}

export const COMPONENT_NAV_SECTIONS: ComponentNavSection[] = [
    {
        key: 'cat-basic',
        label: '── 基础组件 ──',
        children: [
            { key: 'title', label: 'Title 标题', isNew: true },
            { key: 'button', label: 'Button 按钮' },
            { key: 'input', label: 'Input 输入框' },
            { key: 'switch', label: 'Switch 开关' },
            { key: 'card', label: 'Card 卡片' },
            { key: 'collapse', label: 'Collapse 折叠面板' },
            { key: 'cursor', label: 'Cursor 光标' },
            { key: 'modal', label: 'Modal 弹窗' },
            { key: 'typewriter', label: 'Typewriter 打字机' },
            { key: 'divider-comp', label: 'Divider 分割线' },
            { key: 'icon', label: 'Icon 图标' },
            { key: 'select', label: 'Select 选择器' },
            { key: 'checkbox', label: 'Checkbox 多选框' },
            { key: 'radio', label: 'Radio 单选框' },
            { key: 'tooltip', label: 'Tooltip 气泡提示' },
            { key: 'tabs', label: 'Tabs 标签页' },
            { key: 'footer', label: 'Footer 页脚' },
            { key: 'codeblock', label: 'CodeBlock 代码高亮' },
            { key: 'loading', label: 'Loading 加载', isNew: true },
            { key: 'table', label: 'Table 表格' },
            { key: 'form', label: 'Form 表单', isNew: true },
        ],
    },
    {
        key: 'cat-complex',
        label: '── 复杂组件 ──',
        children: [
            { key: 'wallet', label: 'Wallet 钱包', isNew: true },
            { key: 'time', label: 'Time 时间' },
            { key: 'phone', label: 'Phone 手机' },
            { key: 'wedding-invitation', label: 'Wedding 婚礼请柬', isNew: true },
        ],
    },
];

export const COMPONENT_NAV_ITEMS = COMPONENT_NAV_SECTIONS.flatMap((section) => section.children);

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
        desc: '卡片容器组件 — 支持 default / title 两种类型，13 种背景颜色',
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
        desc: '图标组件 — 动森风格图标集，包含 10 个可爱图标，支持自定义尺寸',
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
    radio: {
        title: 'Radio 单选框',
        desc: '单选框组件 — 支持受控/非受控、水平/垂直排列、三种尺寸、禁用单项或全部禁用',
    },
    tooltip: {
        title: 'Tooltip 气泡提示',
        desc: '气泡提示组件 — 支持 12 个方向、hover/click/focus 三种触发，default/island 两种风格，bordered 边框可配置',
    },
    title: {
        title: 'Title 标题',
        desc: '装饰性标题组件 — cloud 云朵 / ribbon 飘带 两种风格，三种尺寸，适用于游戏化页面、活动 Banner 与场景分组',
    },
    codeblock: {
        title: 'CodeBlock 代码高亮',
        desc: '代码高亮组件 — 语法高亮显示，支持自定义样式和类名',
    },
    loading: {
        title: 'Loading 加载',
        desc: '动森风格小岛 Loading 动画组件，支持自定义样式和类名',
    },
    table: {
        title: 'Table 表格',
        desc: '数据表格组件，支持斑马纹、边框、加载状态等常用功能',
    },
    'wedding-invitation': {
        title: 'WeddingInvitation 婚礼请柬',
        desc: '动森风格婚礼请柬，叶子边角 + 飘散花瓣 + 心跳爱心 + 吉祥物头像',
    },
    wallet: {
        title: 'Wallet 钱包',
        desc: '动森风格金币展示 — 奶油描边胶囊 + 上凸钱袋图标，支持千分位、自定义图标与三种尺寸',
    },
    form: {
        title: 'Form 表单',
        desc: '表单组件 — 支持 useForm 命令式实例、多种校验规则、三种布局（horizontal / vertical / inline）、labelCol / wrapperCol 网格',
    },
};
