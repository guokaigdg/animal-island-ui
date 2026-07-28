# 组件开发

这是新增组件或修改既有组件的端到端流程，只停留在结构层面：单个组件的 props 在 `skills/animal-island-ui-style/references/components/*.md`，单个组件的像素级 spec 在 [../design-system/components/](../design-system/components/)，两者都不要在这里重复一遍。

## 开发流程

1. 创建 `src/components/<ComponentName>/` 目录，包含：
    - `<ComponentName>.tsx` —— 组件实现
    - `<component>.module.less` —— 样式（文件名小写连字符，如 `button.module.less`）
    - `index.ts` —— 导出入口
    - `<ComponentName>.test.tsx` —— 单测，与组件同目录
2. 在 `src/index.ts` 中重新导出组件值与类型。
3. 注册 demo —— 四处，见 [Demo 注册](#demo-注册)。
4. 同步文档 —— 见 [文档同步](#文档同步)。
5. 提交前跑 `npm run ci`。

## 文件结构

```
src/components/MyComponent/
├── MyComponent.tsx          # 组件逻辑（必须设置 displayName）
├── myComponent.module.less  # CSS Modules 样式
└── index.ts                 # 唯一导出入口
```

本仓库每个组件还会在同目录下提供 `MyComponent.test.tsx`，把它当作必需结构的一部分，而不是可选项。

## 实现约定

- 函数组件用 `React.FC<Props>` 标注类型；props 接口命名为 `<Name>Props`，用 `export type` 导出。
- 默认值写在解构里，不使用 `defaultProps`。
- 类名拼接用 `classnames`（peerDependency）或 `[styles.a, cond && styles.b].filter(Boolean).join(' ')` 模式。
- 每个组件都要设置 `displayName`。
- props 继承对应原生元素属性，并 `Omit` 掉自己重定义的字段，例如 `extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>`。
- 每个 prop 上方写一行 JSDoc 注释，中文注释是本仓库的风格。
- 有状态组件同时支持受控（`value`）与非受控（`defaultValue`）两种用法。
- 样式遵循 [../design-system/design-rules.md](../design-system/design-rules.md) —— 交互态、焦点色、阴影、圆角与动效都在那里定义，不由单个组件自行决定。

## 代码骨架

`<ComponentName>.tsx`：

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

`index.ts`：

```ts
export { Foo } from './Foo';
export type { FooProps, FooSize } from './Foo';
```

## 桶文件导出

追加到 `src/index.ts`：

```ts
// 方式 A：组件用 default export
export { default as MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent/MyComponent';

// 方式 B：组件用 named export（如 Checkbox / CodeBlock / Select / Icon / Tabs 当前采用）
export { MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent';
```

两种写法在仓库中并存，新组件任选其一，只要 `src/index.ts` 能成功重新导出即可。值必须用 `export {}`、类型必须用 `export type {}` —— `isolatedModules` 要求这样拆分。

## 命名

- 组件文件与导出：PascalCase（`Button.tsx`、`Button`）。
- 样式文件：小写连字符（`button.module.less`、`back-top.module.less`）。
- CSS Module 类名：kebab-case（`.btn-primary`）；`localsConvention: 'camelCase'` 会同时暴露 `styles.btnPrimary`。
- 类型别名：PascalCase（`ButtonType`、`ButtonSize`）。

## Demo 页面

每个组件在 `demo/components/<ComponentName>/index.tsx` 有一个 demo 页，使用 default export。公共构件来自 `demo/tools`：`CodeBlock`、`ApiTable`（接收 `rows: ApiRow[]`）、`DemoTag`、`useIsMobile`，以及各个 section 的样式对象。

```tsx
import React from 'react';
import { MyComponent } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, sectionStyle, sectionTitleStyle } from '../../tools';

const MY_COMPONENT_API: ApiRow[] = [
    { prop: 'size', desc: '尺寸', type: `'small' | 'middle' | 'large'`, defaultVal: "'middle'" },
];

export default function MyComponentDemo() {
    return (
        <div>
            <section style={sectionStyle}>
                <div style={sectionTitleStyle}>基础用法</div>
                <MyComponent size="large">内容</MyComponent>
            </section>
            <CodeBlock code={`<MyComponent size="large">内容</MyComponent>`} />
            <ApiTable rows={MY_COMPONENT_API} />
        </div>
    );
}
```

Demo 站点面向中文用户，demo 文案保持中文，与周边页面一致。

## Demo 注册

一个 demo 页只有在四处都注册了 key 之后才可达。这四处是彼此独立的字面量，没有任何一处是从另一处推导出来的。

1. `demo/App.tsx` → `MENU_ITEMS`：在对应分类下加 `{ key, label }`，否则侧边栏没有入口。
2. `demo/pageInfo.ts` → `PAGE_INFO[key] = { title, desc }`：驱动主区域标题与移动端顶栏。
3. `demo/ComponentPage.tsx` → import demo 组件并添加 `PAGES[key]`：挂载页面主体。
4. `demo/HomePage.tsx` → `components` 数组：首页的卡片。

诊断提示：`PAGES[activeKey]` 与 `PAGE_INFO[activeKey]` 任一缺失时，`ComponentPage` 直接返回 `null`（`demo/ComponentPage.tsx:108`）。所以菜单项能高亮但主区域空白时，第一反应是查这个 key 在 `PAGES` 和 `PAGE_INFO` 里是否都存在，而不是查组件代码。`npm run check:docs` 不校验 demo 注册，这一步靠人工。

## 文档同步

| 改动类型                     | 必须同步                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| 新增 / 修改组件 API          | `skills/animal-island-ui-style/references/components/<category>.md` —— props 逐字抄源码        |
| 新增 / 修改组件样式          | `docs/design-system/components/<category>.md` 及其 `docs/zh-CN` 镜像                           |
| 视觉 token 或规则变化        | `docs/design-system/design-tokens.md` / `design-rules.md` 及其 `docs/zh-CN` 镜像                |
| 新增组件                     | 以上全部 + 四处 demo 注册点 + README 徽章（`npm run badges`）                                   |
| 改动 `docs/` 下任意英文文件  | `docs/zh-CN/` 下的对应文件                                                                     |

`npm run check:docs`（`scripts/check-docs-sync.mjs`，已挂在 `npm run ci` 上）强制校验：`src/components/` 下每个组件都被设计体系文档与 skill references 收录，skill 的组件 reference 文件不超过 200 行上限，以及 `docs/zh-CN/` 与 `docs/` 一一对应。任何漂移都会让构建失败。

## 自查清单

- [ ] props 接口从组件文件导出，每个 prop 都带 JSDoc 注释
- [ ] 有状态组件同时支持受控（`value`）与非受控（`defaultValue`）
- [ ] 样式符合 [../design-system/design-rules.md](../design-system/design-rules.md)（圆角、焦点、阴影、禁用态、hover/active 动效），引用 token 而非硬编码数值
- [ ] 组件已从 `src/index.ts` 导出，且值与类型分开写
- [ ] 已在 `demo/components/` 下创建 demo 页并完成四处注册
- [ ] 单测与组件同目录且全部通过，覆盖无障碍角色与键盘支持 —— 见 [testing.md](./testing.md)
- [ ] 按上表同步文档；组件数或覆盖率有变化时重跑 `npm run badges`
- [ ] `npm run ci` 全绿
