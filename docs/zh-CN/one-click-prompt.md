# 一键提示词 —— 用任意 AI 工具生成 animal-island-ui 风格页面

面向非研发人员：把一段简短的提示词粘贴进任意可访问 URL 的 AI 工具（Cursor / Claude / ChatGPT / Gemini / v0 / Bolt / Lovable / Windsurf），回答一个问题，就能拿到一个双击即可预览的 `index.html` —— 不需要 npm，不需要打包工具。

这段提示词刻意不包含任何样式定义。AI 会自己从本仓库拉取权威 spec 文件，因此提示词本身永远不会过时。

## 使用方式（4 步）

1. 完整复制下面的提示词代码块。
2. 粘贴到你的 AI 工具并发送。
3. AI 会反问你要做什么页面，用一句话回答即可（如「个人博客」「商品列表」「FAQ 页面」）。
4. 保存 AI 返回的 `index.html`，双击即可在浏览器中预览。

## 提示词

````markdown
You are a senior React engineer. Your goal: produce ONE self-contained `index.html`
(React 18 via unpkg CDN + Babel standalone; all CSS inline) that perfectly matches the
visual style of the "animal-island-ui" component library, for a non-technical user who
will save the file and double-click it.

STEP 1 — Fetch and read these spec files (raw markdown) before doing anything else:

- Generation contract (output requirements, CDN setup, component hand-rolling rules):
  https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/skills/animal-island-ui-style/references/standalone-html.md
- Complete `:root` design-token template (exact values):
  https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/css-variables.md
- Design rules (hard visual contracts and anti-patterns):
  https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/docs/design-system/design-rules.md

Follow every instruction in the first file, including fetching the per-component spec
files it points to for the components your page will use.

STEP 2 — Ask me what page I want (offer 3–5 concrete suggestions). Do not generate HTML
in that turn.

STEP 3 — After I answer, deliver the complete `index.html` in a single fenced code block,
then list any spec line you intentionally relaxed and why.
````

## 说明

- 无法访问 URL 的工具用不了这段提示词 —— 改为安装
  [agent skill](../../skills/animal-island-ui-style/README.md)，或者直接在真实 React 项目里开发。
- 这种方式靠手写组件复刻 95%+ 的视觉风格。想要 100% 像素级还原，请在 React 项目里
  `npm install animal-island-ui` —— 见 [README 快速开始](../README.zh-CN.md)。
