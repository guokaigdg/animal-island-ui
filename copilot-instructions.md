# animal-island-ui · GitHub Copilot Instructions

> 本文件是 GitHub Copilot（VS Code）在本仓库工作时的精简约束。完整版见 `.cursorrules`（Cursor 用户的规则全量）；本文档保留"最常踩坑"与"一改就崩"的硬规则，避免 Copilot 上下文超载时丢关键信息。

<!-- META
- 适用版本：v1.x（与 package.json 对齐）
- 维护者：guokaigdg
- 完整规则：`.cursorrules`（Cursor 详细版，16 节）
- 同步工具：`npm run check:docs`（`scripts/check-docs-sync.mjs`，已挂 `npm run ci`）—— 任何组件增删都会扫到漂移并 fail
- 配套文档：
  - `AI_USAGE.md` — 组件 API 手册（写代码查）
  - `skill/SKILL.md` — 像素级 CSS（调样式查）
  - `DESIGN_PROMPT.md` — 设计 token（喂外部 AI 工具）
  - `PROMPT.md` — 一键提示词（普通用户）
- 冲突优先级：源码 > .cursorrules > 本文件 > 通用经验
- 文档与源码冲突时以源码为准，并顺手修文档
-->

---

## 0. 速查表（开工前扫一眼）

| 维度       | 权威来源              |
| ---------- | --------------------- |
| 视觉硬规则 | §3 + `skill/SKILL.md` |
| 组件 API   | `AI_USAGE.md`         |
| 组件开发   | §4                    |
| 测试规范   | §5                    |
| 构建契约   | §6                    |
| 禁止事项   | §7                    |

### 0.1 优先读取顺序

按任务类型先读对应权威文件，避免凭记忆虚构 API：

- 写/改组件代码 → `AI_USAGE.md`（API）+ 同目录现有组件作模板
- 写/改组件样式 → `skill/SKILL.md`（像素级 CSS）+ `src/styles/variables.less`
- 改构建/产物 → `vite.config.ts`（含 6 个自定义插件及注释）
- 改测试 → `vitest.config.ts` + 同目录 `*.test.tsx` 作模板

### 0.2 冲突优先级（高 → 低）

1. 仓库源码（`*.tsx` / `*.module.less` / `*.config.ts`）
2. `.cursorrules`（Cursor 详细版）
3. 本文件
4. `AI_USAGE.md` / `skill/SKILL.md` 等文档
5. 通用经验

文档与源码冲突时以源码为准，并顺手修文档。

---

## 1. 项目速览

- **定位**：受《治愈系海岛风格》启发的 React + TypeScript UI 组件库
- **技术栈**：React 18 + TypeScript 5.7 + Vite 7 + Vitest 4 + Less Modules
- **零运行时依赖**：`dependencies: {}`（react / react-dom / classnames 均为 peerDeps）
- **包名**：`animal-island-ui`，License: CC BY-NC 4.0
- **设计语言**：温暖大地色 + 大圆角 pill + 3D 像素按键 + 柔和动效
- **风格调性**：避免开发者术语，面向用户友好表达（参考 user profile）

---

## 2. 常用命令

```bash
npm run dev          # 启动 Demo 开发服务器
npm run build        # 构建组件库产物 dist/
npm run build:demo   # 构建 Demo 站点 demo-dist/
npm run test         # vitest watch
npm run test:run     # vitest run（单次）
npm run test:cov     # 覆盖率 + json 输出
npm run lint         # eslint .
npm run format       # prettier --write .
npm run ci           # format:check + check:docs + lint + test:run + build（提 PR 前必过）
npm run badges       # 重新生成覆盖率徽章并同步 README.md + docs/README.zh-CN.md
```

### 改动后自查清单

每次提交改动前逐条确认，全部 ✅ 后才能输出 diff：

- [ ] `npm run lint && npm run test:run && npm run build` 全绿
- [ ] 新增/改组件 → 文档同步矩阵（§4.1）四份文档 + demo 三处同步
- [ ] 改了覆盖率/组件数 → `npm run badges` 同步 `README.md` + `docs/README.zh-CN.md`
- [ ] 没引入新运行时依赖（`dependencies` 保持 `{}`）
- [ ] 没破坏按需引入（`preserveModules` + `cssCodeSplit` 仍在）
- [ ] 视觉改动符合 §3 硬规则
- [ ] 提交前 `npm run ci` 通过

---

## 3. 视觉硬规则（违反即不合格）

这些是本库的视觉契约。❌/✅ 反例下沉到 `skill/SKILL.md` §1.5，写代码前对照着改。

1. **禁纯黑文字**（`#000` / `#111`）。用 `#794f27` / `#725d42` / `#8a7b66` / `#9f927d`
2. **禁冷蓝焦点环**（`#0066ff` 等）。Input/Switch/Checkbox `#ffcc00`，Radio `#f5c31c`，Button `#19c8b9`
3. **禁 0px 圆角的交互元素**，最小 12px。按钮/输入框 50px（pill），卡片 20px，Tooltip 16px
4. **禁冷灰背景**（`#fafafa` / `#f5f5f5`）。用 `#f8f8f0`（主背景）或 `rgb(247,243,223)`（内容区）
5. **3D 像素堆叠阴影 `0 5px 0 0 #bdaea0` 仅用于 primary / danger+primary 按钮**。default / dashed / text / link 按钮只用软高程 `0 2px 4px 0 rgba(61,52,40,0.06)`
6. **Input 默认无阴影**，`shadow` prop 默认 `false`；只有显式 `shadow={true}` 才加 `0 3px 0 0 #d4c9b4`。状态（error/warning）阴影不受 `shadow` 控制
7. **Switch 无外阴影**，handle 扁圆 + 2.5px border + 无 box-shadow，`translateY(-50%)` 居中
8. **Card 无 box-shadow**，仅 hover `translateY(-2px)` 浮起；pattern 变体加 1.5px 同色调边框
9. **Modal 必须用 SVG blob clip-path**（`#animal-modal-clip`），不可换圆角矩形
10. **Title 是 swallowtail 飘带**（clip-path + 折角三角阴影 + 3deg 透视），`<Card type="title">` 已废弃，统一用 `<Title>`
11. **字体**：`Nunito, 'Noto Sans SC'`（构建时已剥掉 woff 备份，仅留 woff2）。禁止系统等宽字体用于 UI 文字（CodeBlock 除外）
12. **字重**：正文 500、按钮/标题 600-700、Time 数字 / Title 飘带 900、placeholder 400。任何位置不得低于 400
13. **动效缓动**：`cubic-bezier(0.4, 0, 0.2, 1)`，时长 0.15-0.35s
14. **Radio** 是高圆化方形（border-radius 12/14/16px），不是正圆；内含 SVG 对勾

精确数值（尺寸/色值/keyframe）查 `skill/SKILL.md`，组件 API 查 `AI_USAGE.md`。

---

## 4. 组件开发

### 4.1 新增组件流程

1. `src/components/<Name>/` 下创建四个文件：
    - `<Name>.tsx`（PascalCase）
    - `<name>.module.less`（小写连字符）
    - `index.ts`（导出入口）
    - `<Name>.test.tsx`（与组件同目录）
2. `src/index.ts` 桶文件导出（值用 `export {}`，类型用 `export type {}`，与 `isolatedModules` 一致）
3. **Demo 三处同步**（缺一不可）：
    - `demo/pageInfo.ts`（移动端顶栏）
    - `demo/ComponentPage.tsx` 内部 `PAGE_INFO` + `PAGES`（主区域标题 + 组件挂载）
    - `demo/HomePage.tsx` 的 `components` 列表（首页卡片）
4. **文档同步矩阵**（改组件必做）：

| 改动类型          | 必须同步的文件                                                                                                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 新增/改组件 API   | `AI_USAGE.md`（props/类型/默认值，逐字抄源码，禁止虚构）                                                                                                                                                                                              |
| 新增/改组件样式   | `skill/SKILL.md`（像素级 CSS，与 `*.module.less` 100% 对齐）                                                                                                                                                                                          |
| 视觉风格变化      | `DESIGN_PROMPT.md`（色板/尺寸/形状）                                                                                                                                                                                                                  |
| 新增组件          | `PROMPT.md`（追加 `### 组件名` spec 段落，self-contained）                                                                                                                                                                                            |
| 组件数/覆盖率变化 | `README.md` + `docs/README.zh-CN.md` 徽章（跑 `npm run badges` 自动同步）                                                                                                                                                                             |
| 新增/改组件 demo  | 三处必须同步：① `demo/pageInfo.ts`（移动端顶栏）② `demo/ComponentPage.tsx` 的 `PAGE_INFO` + `PAGES`（主区域标题 + 组件挂载）③ `demo/HomePage.tsx` 的 `components` 列表（首页卡片）—— 缺任意一处都会出现「菜单能选中但主区域空白」或「首页没这个卡片」 |

> 新增组件后跑 `npm run check:docs` 会自动检测 4 份文档是否收录，漂移会 fail。Demo 三处同步目前无自动化检测，需手动核对。最简核对：菜单点击后若主区域空白，第一反应是查 `ComponentPage.tsx` 内部 `PAGE_INFO` 漏没漏这个 key，不是查组件代码。

### 4.2 组件实现约定

- 函数组件 + `React.FC<Props>`，props 接口命名 `<Name>Props`
- 默认值写在解构里，不用 `defaultProps`
- 类名拼接：`classnames` 或 `[styles.a, cond && styles.b].filter(Boolean).join(' ')`
- 设置 `displayName`
- props 继承原生元素属性 + `Omit` 冲突字段，例如 `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>`
- JSDoc 注释用中文，写在 props 字段上方

### 4.3 命名规范

- 组件文件、导出：PascalCase（`Button.tsx`、`Button`）
- 样式文件：小写连字符（`button.module.less`）
- CSS Module 类名：kebab-case（`.btn-primary`），通过 `localsConvention: 'camelCase'` 可用 `styles.btnPrimary`
- 类型别名：PascalCase（`ButtonType`、`ButtonSize`）

### 4.4 组件代码骨架

```tsx
import React from 'react';
import styles from './component.module.less';

export type FooSize = 'small' | 'middle' | 'large';

export interface FooProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    /** 尺寸 */
    size?: FooSize;
    /** 禁用 */
    disabled?: boolean;
    children?: React.ReactNode;
}

export const Foo: React.FC<FooProps> = ({ size = 'middle', disabled = false, className, children, ...rest }) => {
    const classNames = [styles.foo, styles[`foo-${size}`], disabled && styles['foo-disabled'], className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} aria-disabled={disabled || undefined} {...rest}>
            {children}
        </div>
    );
};

Foo.displayName = 'Foo';
```

---

## 5. 测试规范

### 5.1 配置要点

- **Vitest 4 必须用独立 `vitest.config.ts`**，不要把 test 配置塞进 `vite.config.ts`（Vitest 4 静默忽略内嵌 test 块）
- `globals: true`（`describe` / `it` / `expect` 全局可用）
- `environment: 'jsdom'`，`setupFiles: './test/setup.ts'`（已注册 `@testing-library/jest-dom/vitest`）
- `css: true`（CSS Module 在测试中真实解析类名）
- 测试公共工具在 `test/utils.tsx`（`setup()` 封装 userEvent）、`test/components.tsx`

### 5.2 写测试约定

- 测试文件与组件同目录：`<ComponentName>.test.tsx`
- 用 `@testing-library/react` 的 `render` / `screen`，**用 `userEvent`（通过 `setup()`）模拟交互，不要用 `fireEvent`**
- 断言类名用 `styles['btn-primary']` 引用 CSS Module 哈希后的真实类名，**不要硬编码字面量**
- 描述用中文
- 覆盖：渲染、props 类名、交互回调、禁用态、a11y 角色、键盘交互（Tab/Enter/Space/Esc/箭头）
- 交互组件按 [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) 补齐角色 + 键盘支持
- 命令式组件（如 Notification）：用 `act(() => Notification.success('x'))` 触发，再 `waitFor` 容器挂载。**不能用 `render(<Notification />)`**

### 5.3 测试骨架

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setup } from '@test/utils';
import { Foo } from './Foo';
import styles from './component.module.less';

describe('Foo', () => {
    it('渲染 children', () => {
        render(<Foo>x</Foo>);
        expect(screen.getByText('x')).toBeInTheDocument();
    });

    it('点击触发 onClick', async () => {
        const user = setup();
        const onClick = vi.fn();
        render(<Foo onClick={onClick}>x</Foo>);
        await user.click(screen.getByText('x'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
```

---

## 6. 构建契约（改 `vite.config.ts` 前必读）

`vite.config.ts` 含 6 个自定义插件实现按需引入，改动构建逻辑时必须保持以下契约，否则破坏消费者 tree-shaking：

- **双输出**：ES（`dist/es/`）+ CJS（`dist/cjs/`），均 `preserveModules` + `preserveModulesRoot: 'src'`。**不要关 preserveModules**
- **external 不打包**：`react` / `react-dom` / `react/jsx-runtime` / `classnames`（peerDeps）
- **cssCodeSplit: true** + 自研 `injectImportedCssPlugin`：组件 CSS 随 JS 自动回填。**不要关 cssCodeSplit**
- **资源不内联**：`@laynezh/vite-plugin-lib-assets` 把字体/图片输出到 `dist/files/`；`copyItemAssetsPlugin` 拷全部 item PNG 到 `dist/items/`
- **全局样式入口**：`emitGlobalStyleEntryPlugin` 聚合 `dist/index.css`（供 `animal-island-ui/style`）
- **字体只留 woff2**：`stripWoffFallbackPlugin` 剥掉 woff 备份，降体积 ~40%

`package.json` 的 `exports` / `sideEffects: false` / `files` 已配好按需引入，不要破坏。库零运行时依赖（`dependencies: {}`）。

---

## 7. 禁止事项清单

> 只列**在别处没有提及**的禁止项。已分散到 §3 / §4 / §5 / §6 的禁止项不再重复。

- ❌ 在 `vite.config.ts` 内嵌 vitest `test` 块（Vitest 4 静默忽略，改 `vitest.config.ts`）
- ❌ 在组件 `.module.less` 写全局选择器（`body` / `:root` 等），全局样式放 `src/styles/`
- ❌ 硬编码 CSS Module 类名字面量做断言（必须用 `styles['xxx']`）
- ❌ 虚构组件 API；写消费侧代码前查 `AI_USAGE.md`，写样式前查 `skill/SKILL.md`
- ❌ 提交 `dist/` / `demo-dist/` / `coverage/`
- ❌ 引入新运行时依赖（`dependencies` 保持 `{}`）
- ❌ 破坏按需引入（`preserveModules` + `cssCodeSplit` 仍在）

---

## 8. 已知踩坑（高频）

- **双 PAGE_INFO 同步**：`demo/pageInfo.ts`（移动端顶栏 PAGE_INFO）和 `demo/ComponentPage.tsx` 内部 `PAGE_INFO`（主区域 PAGE_INFO + `PAGES` 映射）是**两份独立的常量对象**——`pageInfo.ts` 删了主区域白屏、`ComponentPage.tsx` 删了移动端顶栏无标题。**菜单点击后若主区域空白，第一反应是查 `ComponentPage.tsx` 内部 `PAGE_INFO` 漏没漏这个 key**，不是查组件代码
- **命令式组件**（Notification 这类 antd 风格 API）无 JSX 元素，测试不能用 `render(<Notification />)` 断言；用 `act(() => Notification.success('x'))` 触发，再 `waitFor` 容器挂载
- **DOM-to-PNG 导出**（html-to-image / modern-screenshot）时，Chromium 不读 `document.fonts`，需把 `@font-face` 作为 `<style>` 子节点塞进截图根节点
- **字符串批量替换**用脚本时注意：`String.replace` 不可变、回调里 `changed` flag 会逃逸、`[^>]*` 跨引号不匹配、vitest json 必须 `--outputFile` 指定路径

---

## 9. 提交与协作

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/)：`feat:` / `fix:` / `docs:` / `refactor:` / `chore:` / `test:`
- 基于 `main` 分支开发，PR 描述改动内容与动机
- **提 PR 前 `npm run ci` 必须通过**（format:check + check:docs + lint + test:run + build + test:a11y 全绿）
- 改动覆盖率或组件数后跑 `npm run badges` 同步 README 徽章（README.md + docs/README.zh-CN.md）
- **AI 协作**：审计/优化类任务先标 P0（必改）vs 建议，让用户决定，不要一次性平铺所有建议动手改

---

## 10. 详细文档指针

| 文档                                                                      | 用途                                         |
| ------------------------------------------------------------------------- | -------------------------------------------- |
| [`.cursorrules`](.cursorrules)                                            | Cursor 用户的完整规则（16 节，本文件的母版） |
| [`AI_USAGE.md`](AI_USAGE.md)                                              | 组件 API 手册（写代码优先查）                |
| [`skill/SKILL.md`](skill/SKILL.md)                                        | 像素级 CSS（调样式查）                       |
| [`DESIGN_PROMPT.md`](DESIGN_PROMPT.md)                                    | 设计 token（喂外部 AI 工具）                 |
| [`PROMPT.md`](PROMPT.md)                                                  | 一键提示词（普通用户）                       |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)                                      | 贡献流程                                     |
| [`README.md`](README.md) / [`docs/README.zh-CN.md`](docs/README.zh-CN.md) | 项目说明                                     |
