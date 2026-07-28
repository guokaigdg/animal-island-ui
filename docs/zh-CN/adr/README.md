# 架构决策记录

本目录记录 `animal-island-ui` 背后承重的技术决策 —— 那些约束后续改动的决定，而非对当前代码的描述。每条记录说明是什么处境逼出了这个选择、选择本身是什么，以及项目为此接受了哪些后果。

记录一旦被接受就不可变更。不再成立的决策由新记录取代（supersede），而不是就地修改。

| ADR                                       | 标题             | 摘要                                                                                                    |
| ----------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| [0001](0001-zero-runtime-dependencies.md) | 零运行时依赖     | 包不声明任何 `dependencies`；React、React DOM 与 `classnames` 是 peer dependencies，构建时保持 external。 |
| [0002](0002-dual-design-token-system.md)  | 双层设计 token   | 需要参与计算的值用 Less 编译期变量，消费者可能重新定制主题的值用 `--animal-*` CSS 自定义属性。            |
| [0003](0003-vite-library-mode-build.md)   | Vite library 构建 | ES + CJS 双格式输出，配合 `preserveModules` 与拆分后的 CSS，消费者只带走自己 import 的组件。             |
| [0004](0004-docs-sync-automation.md)      | 文档同步自动化   | 组件在设计体系文档与 skill references 中的收录情况由机器校验，并在 CI 中强制执行。                        |

延伸阅读：[设计体系](../design-system/) 是视觉契约，[开发文档](../development/) 是日常流程。
