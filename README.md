# 🏝 Animal-Island-UI

<div align="center">
A React UI component library with a cozy island-style design
</div>
<br/>
<div align="center">
    <a href="https://github.com/guokaigdg/animal-island-ui/stargazers"><img src="https://img.shields.io/github/stars/guokaigdg/animal-island-ui?style=flat-square" alt="Stars"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-CC--BY--NC--4.0-orange.svg?style=flat-square" alt="License: CC BY-NC 4.0"></a>
    <a href="LICENSE"><img src="https://img.shields.io/npm/dm/animal-island-ui.svg?style=flat-square" alt=""></a>
    <a href="https://github.com/guokaigdg/animal-island-ui/releases"><img src="https://img.shields.io/github/v/tag/guokaigdg/animal-island-ui?label=version&style=flat-square" alt="Version"></a>
    <a href="https://gitcode.com/guokaigdg/animal-island-ui"><img src="https://gitcode.com/guokaigdg/animal-island-ui/star/badge.svg" alt="Stars"></a>
    <br/>
    <a href="./coverage/badges/coverage.json"><img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/guokaigdg/animal-island-ui/main/coverage/badges/coverage.json&style=flat-square" alt="Coverage"></a>
    <img src="https://img.shields.io/badge/tests-475%20✓-brightgreen?style=flat-square" alt="Tests">
    <img src="https://img.shields.io/badge/components-36-blue?style=flat-square" alt="Components">
    <img src="https://img.shields.io/badge/a11y-WAI--ARIA%20APG-brightgreen?style=flat-square" alt="Accessibility">
</div>
<br/>
<div align="center">
    <a href="https://trendshift.io/repositories/34594?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-34594" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/34594/daily?language=TypeScript" alt="guokaigdg%2Fanimal-island-ui | Trendshift" width="250" height="55"/></a>
    <a href="https://hellogithub.com/repository/guokaigdg/animal-island-ui" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=98ecff41d142466d8d72694a6fadf9e9&claim_uid=pyGqTPIRMdo7fBS&theme=neutral" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</div>

<br/>
<p align="center">
    English | <a href="./docs/README.zh-CN.md">简体中文</a>
</p>

## Introduction

This project is a lightweight UI component library built with React + TypeScript. It features an original, cozy island-style design language, created for personal front-end technical practice and component development learning.

All visual elements, layouts, icons, and animations are independently designed and implemented from scratch.

## 🎉 Vue Version

- [animal-island-ui](https://github.com/guokaigdg/animal-island-ui)

## Preview

- Online Preview (PC) [animal-island-ui-pc](https://guokaigdg.github.io/animal-island-ui/#/)
- Online Preview (Mobile) [animal-island-ui-mobile](https://guokaigdg.github.io/animal-island-ui/#/)

## 🚀 Use AI to Generate animal-island-ui Pages (No Coding Needed)

Non-developer and don't want to write code yourself? Use the
[one-click prompt](./docs/one-click-prompt.md) — no npm, no build step.

**4 steps:**

1. Copy the prompt block from [`docs/one-click-prompt.md`](./docs/one-click-prompt.md).
2. Paste into any AI tool that can fetch URLs (Cursor / Claude / ChatGPT / Gemini / v0 / Bolt) and send.
3. The AI asks what page you want — reply in one phrase (e.g. "personal blog", "product list", "FAQ").
4. Save the `index.html` it returns and double-click to preview.

Using an AI coding agent (Claude Code / Codex / Cursor)? Install the
[animal-island-ui-style skill](./skills/animal-island-ui-style/README.md) instead:

```bash
skills add guokaigdg/animal-island-ui
```

## Installation

```bash
npm install animal-island-ui
```

## Quick Start

> ⚠️ **Important**: Please make sure to import the styles with `import 'animal-island-ui/style'`, otherwise the components will have no styles or fonts!

```tsx
import { Button, Card } from 'animal-island-ui';
import 'animal-island-ui/style';

function App() {
    return (
        <div>
            <Button type="primary">Start Adventure</Button>
            <Card color="app-blue">Welcome to the deserted island!</Card>
        </div>
    );
}
```

## Documentation

Routed by audience and scenario (English primary; Chinese mirrors under [`docs/zh-CN/`](./docs/zh-CN/)):

| Document                                                                      | Purpose                                                                                                                                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/design-system/`](./docs/design-system/README.md)                       | 🎨 Canonical design definition (single source of truth) — tokens, design rules, pixel-exact per-component specs, CSS variable template.                       |
| [`skills/animal-island-ui-style/`](./skills/animal-island-ui-style/README.md) | 🤖 Installable Agent skill (`skills add guokaigdg/animal-island-ui`) — React project usage + standalone-HTML generation, with per-component props references. |
| [`docs/one-click-prompt.md`](./docs/one-click-prompt.md)                      | 🚀 One-click prompt for non-developers — paste one bootstrap prompt, the AI fetches the specs itself and returns a ready `index.html`.                        |
| [`docs/design-prompts.md`](./docs/design-prompts.md)                          | Prompts for design/image tools (v0 / Figma AI / Midjourney / DALL-E), linking to the canonical spec files.                                                    |
| [`docs/development/`](./docs/development/README.md)                           | Development guide for this repository — structure, component development, coding standards, testing, build contract.                                          |
| [`docs/adr/`](./docs/adr/README.md)                                           | Architecture decision records.                                                                                                                                |
| [`AGENTS.md`](./AGENTS.md)                                                    | Entry point for coding agents working in this repository.                                                                                                     |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)                                        | Contributing guide.                                                                                                                                           |

## Local Development

```bash
# Clone the repository
git clone https://github.com/guokaigdg/animal-island-ui.git
cd animal-island-ui

# Install dependencies
npm install

# Start Demo development server
npm run dev

# Build component library
npm run build

# Build Demo site
npm run build:demo
```

## Notes

- This project is intended for personal learning, research, and non-commercial demonstration only. Any form of commercial use, resale, or profit-making activities is prohibited.
- Not to be used in any commercial product, enterprise project, external service, or paid template.
- Users are solely responsible for any risks arising from the use of this component library.

## Copyright and Disclaimer

- This is an independently created open-source project. It is not an official product of any game company and has no association, authorization, or cooperation with any company or its products.
- All visual assets (icons, illustrations, animations) in this repository are original works created for this project.
- If the copyright holder believes that related content is suspected of infringement, they can contact via email, and I will make rectifications or deletions immediately.

## Contact

For any questions or copyright-related communications, please contact via Issue or email.

## Keep the Island Running

If this project has been helpful to you, consider buying the developer's cat a can of tuna — meowsters are the real fuel that keeps the island running.

[Sponsor this Island](https://guokaigdg.github.io/home/payment.html)

## License

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** — see the [LICENSE](LICENSE) file for the full text.

- **Commercial use**: **PROHIBITED**.
- **Permitted (non-commercial)**: personal learning, research, evaluation, testing, and non-commercial display.
- **Attribution required**: must retain the original copyright notice and license declaration.
- The author is not responsible for any legal issues or losses caused by the use of this library.
