# 🏝 Animal-Island-UI

<div align="center">
    <img src="docs/img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />
</div>
<div align="center">
A React UI component library inspired by a cozy island-style UI
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
    <img src="https://img.shields.io/badge/tests-366%20✓-brightgreen?style=flat-square" alt="Tests">
    <img src="https://img.shields.io/badge/components-28-blue?style=flat-square" alt="Components">
    <img src="https://img.shields.io/badge/a11y-WAI--ARIA%20APG-brightgreen?style=flat-square" alt="Accessibility">
</div>
<br/>
<div align="center">
    <a href="https://hellogithub.com/repository/guokaigdg/animal-island-ui" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=98ecff41d142466d8d72694a6fadf9e9&claim_uid=pyGqTPIRMdo7fBS&theme=neutral" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</div>

<br/>
<p align="center">
    English | <a href="./docs/README.zh-CN.md">简体中文</a>
</p>

## Introduction

This project is a lightweight UI component library built with React + TypeScript. The design style is inspired by a game company's "a cozy island-style UI" game interface, created for personal front-end technical practice and component development learning.

All visual elements, layouts, icons, and animations are independently designed and implemented, without directly using any official a game company art materials, code, or resource files.

## 🎉 Vue Version

- [animal-island-ui](https://github.com/guokaigdg/animal-island-ui)

## Preview

- Online Preview (PC) [animal-island-ui-pc](https://guokaigdg.github.io/animal-island-ui/#/)
- Online Preview (Mobile) [animal-island-ui-mobile](https://guokaigdg.github.io/animal-island-ui/#/)

## 🚀 Use AI to Generate animal-island-ui Pages (No Coding Needed)

Non-developer and don't want to write code yourself? Use [`PROMPT.md`](./PROMPT.md) — no npm, no build step.

**4 steps:**

1. Copy [`PROMPT.md`](./PROMPT.md) in full.
2. Paste into any AI tool (Cursor / Claude / ChatGPT / Gemini / DeepSeek) and send.
3. The AI asks what page you want — reply in one phrase (e.g. "personal blog", "product list", "FAQ").
4. Save the `index.html` it returns and double-click to preview.

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

Complete reference for different scenarios:

| Document                                 | Purpose                                                                                                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`PROMPT.md`](./PROMPT.md)               | 🚀 One-click prompt for non-developers — paste into Cursor / Claude / ChatGPT / v0 / Bolt / Lovable / Windsurf to generate animal-island-ui-styled React pages. |
| [`AI_USAGE.md`](./AI_USAGE.md)           | AI code assistant handbook - all component props, types and defaults word-for-word, 19 hard rules and copy-paste boilerplate, no invented APIs.                 |
| [`DESIGN_PROMPT.md`](./DESIGN_PROMPT.md) | Visual-style prompts for v0 / Figma AI / Midjourney / DALL-E, including color palette, fonts, size tables, Modal clip-path and prohibition list.                |
| [`skill/SKILL.md`](./skill/SKILL.md)     | Pixel-perfect style specification Skill - design tokens, all component CSS, Demo layout values, CSS variable templates and new component development checklist. |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)   | Contributing Guide                                                                                                                                              |

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

## Usage Cases

<table>
<tr valign="top">
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/animal-island-new-tab.png" alt="animal-island-new-tab" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://ashleycry.github.io/AnimalIslandNewTab/">Animal Island New Tab</a><br/><sub>a cozy island-style UI style new tab page</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/ac-site-template.png" alt="ac-site-template" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/yunxinz/ac-site-template">ac-site-template</a><br/><sub>a cozy island-style UI themed personal website template</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/hi-kid.png" alt="HiKid" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/xiaochong/hi-kid">HiKid</a><br/><sub>English learning app for children</sub>
  </td>
</tr>
<tr valign="top">
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/android-ui.png" alt="android-ui" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/liuyuhong0324/AnimalIslandUI">AnimalIslandUI</a><br/><sub>a cozy island-style UI style Android UI library</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/itbug-shop.png" alt="ItbugShop" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://itbug.shop/">ItbugShop</a><br/><sub>Liang Diandian's Blog</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/KidsMathQuest.jpeg" alt="KidsMathQuest" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/bk4ice/KidsMathQuest">KidsMathQuest</a><br/><sub>Math practice for elementary school</sub>
  </td>
</tr>
<tr valign="top">
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/flutter-ui.jpeg" alt="animal_island_flutter" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/ohmangocat/animal_island_flutter">animal_island_flutter</a><br/><sub>a cozy island-style UI style Flutter UI library</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/case-animal-blog.png" alt="animal-island-blog" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/guokaigdg/animal-island-blog">animal-island-blog</a><br/><sub>a cozy island-style UI style blog</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/island-life-journal.png" alt="island-life-journal" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/TIUCSIB/animal-island-blog">Island Life Journal</a><br/><sub>Island Life Photo Journal</sub>
  </td>
</tr>
<tr>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/island-themed-BGM-Player.png" alt="island-themed-BGM-Player" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/skyboooox/island-themed-Player">a cozy island-style UI BGM Player</a><br/><sub>ambience clock + hourly music</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/animal-island-ui-taro-port.png" alt="animal-island-ui-taro-port" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/Gospelion/animal-island-ui-taro-port">animal-island-ui-taro-port</a><br/><sub>Taro & WeChat Mini Program</sub>
  </td>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/portal-os-preview.png" alt="portal-os" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/guowenju/portal-os">portal-os</a><br/><sub>Animal desktop blog</sub>
  </td>
</tr>
<tr>
  <td align="center" width="33%">
    <br/>
    <img src="docs/img/awesome-splatoon3.png" alt="Awesome-splatoon3" style="border-radius: 8px; width: 90%; display: block; margin: 8px auto 0;" />
    <br/><a href="https://github.com/961853266hyt/awesome-splatoon3">Awesome-splatoon3</a><br/><sub>Splatoon 3 resource station</sub>
  </td>
</tr>
</table>

## Notes

- This project is intended for personal learning, research, and non-commercial demonstration only. Any form of commercial use, resale, or profit-making activities is prohibited.
- Not to be used in any commercial product, enterprise project, external service, or paid template.
- Users are solely responsible for any risks arising from the use of this component library.

## Copyright and Disclaimer

- This project is not an official a game company product and has no association, authorization, or cooperation with a game company
- The game name included in the project name is only a descriptive reference to the style and does not constitute trademark use or brand association.
- All interface styles are merely design inspiration references and do not constitute reproduction or infringement of the original work.
- If the copyright holder believes that related content is suspected of infringement, they can contact via email, and I will make rectifications or deletions immediately.

## Contact

For any questions or copyright-related communications, please contact via Issue or email.

## License

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** — see the [LICENSE](LICENSE) file for the full text.

- **Commercial use**: **PROHIBITED**.
- **Permitted (non-commercial)**: personal learning, research, evaluation, testing, and non-commercial display.
- **Attribution required**: must retain the original copyright notice and license declaration.
- The author is not responsible for any legal issues or losses caused by the use of this library.
