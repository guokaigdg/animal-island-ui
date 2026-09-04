# animal-island-ui style（中文对照，仅供人工 review）

> 本文件是 [SKILL.md](SKILL.md) 的中文翻译，仅用于人工阅读与 review；Agent 只读取英文的 SKILL.md。frontmatter 以英文版为准。

## 名称与触发条件（对应 frontmatter）

- name: `animal-island-ui-style`
- 触发：用 animal-island-ui 风格（治愈系海岛风格、温馨圆润的游戏感 UI）构建 React 界面时使用。场景：(1) 在 React 项目中使用 animal-island-ui npm 包开发页面或组件；(2) 无构建步骤、生成单个自包含 HTML 页面；(3) 用户提出「治愈系海岛风格」「animal island 风格」或可爱圆润的游戏感 UI

## 正文对照

animal-island-ui 是采用原创治愈系海岛风格设计的 React + TypeScript 组件库 —— 30 个组件、零运行时依赖、CC BY-NC 4.0（仅限非商业使用）

源码与设计规范定义：https://github.com/guokaigdg/animal-island-ui

### 先选场景

| 场景 | 入口 |
| --- | --- |
| React 项目 —— 已安装（或可安装）`animal-island-ui` npm 包 | [references/react-project.md](references/react-project.md) |
| 单个自包含 HTML 文件 —— 无 npm、无打包工具，React 走 CDN + Babel 运行时转译 | [references/standalone-html.md](references/standalone-html.md) |

两个场景共用下方的组件目录与硬规则

### 一段话说清风格

温暖羊皮纸底色（`--animal-bg`）、大地棕文字（绝不用纯黑）、薄荷青绿主色、大圆角 pill 形（按钮和输入框是 50px pill；交互元素圆角最小 12px）、3D「游戏按键」堆叠阴影仅用于 primary 按钮、圆体 Nunito + Noto Sans SC 字体（正文字重 500，标题 600–900）、`cubic-bezier(0.4, 0, 0.2, 1)` 柔和动效（0.15–0.35s），几何形（燕尾飘带 Title、胶囊 Wallet）与有机形（SVG blob 裁切的 Modal）并存

### Design Tokens

库的样式文件会在 `:root` 上声明运行时 CSS 自定义属性（前缀 `--animal-*`），由编译期 token 映射而来。分组：主色/状态色（含 hover/active/bg 变体）、文字色、背景、边框、圆角、间距、阴影、字体族/字号、动效时长/缓动、控件高度

使用时机：

- 给库组件旁边的布局容器、自定义元素、页面装饰写样式时，用 `var(--animal-*)` 而非裸 hex，保持自定义 UI 在色板内
- 主题定制：在 `import 'animal-island-ui/style'` 之后覆盖 `--animal-*` 变量
- 不依赖库自行实现风格（单文件 HTML）：完整的 `:root` 模板（含精确值）在设计系统的
  [css-variables.md](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/css-variables.md)

token 具体值刻意不在 skill 内重复。精确定义（每个 hex/px/ms）见
[design-tokens.md](https://github.com/guokaigdg/animal-island-ui/blob/main/docs/design-system/design-tokens.md)；
逐组件像素级 CSS（阴影、keyframe、clip-path）见
[design-system/components/](https://github.com/guokaigdg/animal-island-ui/tree/main/docs/design-system/components)

### 组件目录

props 参考按大类分组在 `references/components/` 下（props、合法取值、默认值，逐字来自源码）：

| 大类 | 组件 | 参考文件 |
| --- | --- | --- |
| 通用 | Button, Icon, Typewriter, Cursor | [general.md](references/components/general.md) |
| 布局 | Card, Title, Divider, Collapse, Tabs | [layout.md](references/components/layout.md) |
| 表单控件 | Input, Switch, Checkbox, Radio, Select | [form-controls.md](references/components/form-controls.md) |
| 表单容器 | Form (+ FormItem, useForm) | [Form.md](references/components/Form.md) |
| 浮层 | Modal, Drawer, Tooltip | [overlays.md](references/components/overlays.md) |
| 反馈 | Loading, Progress, Skeleton, BackTop | [feedback.md](references/components/feedback.md) |
| 通知 | Notification（命令式 API） | [Notification.md](references/components/Notification.md) |
| 数据展示 | Table, CodeBlock, Tag | [data-display.md](references/components/data-display.md) |
| 装饰 | Time, Phone, Footer, Wallet | [decorative.md](references/components/decorative.md) |

### 硬规则（违反即 bug）

1. 不虚构 props。用到的每个 prop 必须出现在组件参考里（已安装项目中以包内 TypeScript 声明为最终事实）
2. 样式在应用入口只 import 一次：`import 'animal-island-ui/style'`，缺失则组件无样式
3. 不用纯黑（`#000`/`#111`）文字，不用冷灰（`#fafafa`/`#f5f5f5`）背景
4. 不用冷蓝焦点环。焦点色是黄色（输入类 `#ffcc00`）或薄荷主色（按钮）
5. 交互元素圆角不小于 12px；按钮和输入框是 50px pill
6. 3D 堆叠阴影仅属于 primary / danger-primary 按钮。Card 无 box-shadow，Switch 无外阴影，Input 阴影是 opt-in（`shadow={true}`）
7. Modal 必须保留 SVG blob clip-path，不可换圆角矩形；Title 是燕尾飘带，不是 blob/pill/普通块（`Card type="title"` 已不存在）
8. 字体 Nunito + Noto Sans SC；字重不低于 400；UI 文字不用等宽字体（CodeBlock 除外）
9. 动效统一 `cubic-bezier(0.4, 0, 0.2, 1)`，时长 0.15–0.35s
10. 图标只用 `<Icon name="..." />`（10 个内置名字）—— 不用 emoji、Unicode 符号（✓ ✕ →）、手写 SVG 或第三方图标库
11. Select 仅受控（`options` + `value` + `onChange` 都必填）；受控的 `Input`/`Switch`/`Checkbox`/`Radio` 也要配 `onChange`
12. 优先用库组件而非裸 HTML：可见 UI 不允许原生 `<button>`、`<input>`、`<select>`、原生 checkbox/radio
13. 只从包根和 `animal-island-ui/style` 导入，不做深路径导入
14. 自定义元素用 `var(--animal-*)` token 上色，不硬编码颜色；不用 `className`/`style` 覆盖组件的颜色、圆角、阴影
