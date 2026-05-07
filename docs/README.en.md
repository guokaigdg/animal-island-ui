# 🏝 Animal-Island-UI


<div align="center">
    <img src="img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />    
</div>
<div align="center">
    A React UI component library inspired by a cozy island-style UI
</div>
<br/>
<div align="center">
    <a href="https://github.com/guokaigdg/animal-island-ui/stargazers"><img src="https://img.shields.io/github/stars/guokaigdg/animal-island-ui?style=flat-square" alt="Stars"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="LICENSE"><img src="https://img.shields.io/npm/dm/animal-island-ui.svg?style=flat-square" alt=""></a>
    <a href="https://github.com/guokaigdg/animal-island-ui/releases"><img src="https://img.shields.io/github/v/tag/guokaigdg/animal-island-ui?label=version&style=flat-square" alt="Version"></a>
</div>
<br/>
<div align="center">
    <a href="https://hellogithub.com/repository/guokaigdg/animal-island-ui" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=98ecff41d142466d8d72694a6fadf9e9&claim_uid=pyGqTPIRMdo7fBS&theme=neutral" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</div>

<br/>
<p align="center">
    <a href="../README.md">中文</a> | English
</p>


## Introduction

This project is a lightweight UI component library built with React + TypeScript. The design style is inspired by a game company's "a cozy island-style UI" game interface, created for personal front-end technical practice and component development learning.

All visual elements, layouts, icons, and animations are independently designed and implemented, without directly using any official a game company art materials, code, or resource files.


## Preview

- Online Preview (PC) [animal-island-ui-pc](https://guokaigdg.github.io/animal-island-ui/#/)
- Online Preview (Mobile) [animal-island-ui-mobile](https://guokaigdg.github.io/animal-island-ui/#/)

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
            <Card color="app-blue">
                Welcome to the deserted island!
            </Card>
        </div>
    );
}
```

## Documentation

Complete reference for different scenarios:

| Document | Purpose |
|---|---|
| [`AI_USAGE.md`](../AI_USAGE.md) | AI code assistant handbook - all component props, types and defaults word-for-word, 17 hard rules and copy-paste boilerplate, no invented APIs. |
| [`DESIGN_PROMPT.md`](../DESIGN_PROMPT.md) | One-click reproduction prompts for v0 / Figma AI / Midjourney / DALL-E, including color palette, fonts, size tables, Modal clip-path and prohibition list. |
| [`skill/SKILL.md`](../skill/SKILL.md) | Pixel-perfect style specification Skill - design tokens, all component CSS, Demo layout values, CSS variable templates and new component development checklist. |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Contributing Guide |


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

|<a href="https://github.com/yunxinz/ac-site-template">ac-site-template</a> (a cozy island-style UI themed personal website template)  |  <a href="https://github.com/xiaochong/hi-kid">HiKid</a> (English learning app for children) | 
| --- | --- | 
|  <img src="img/ac-site-template.png" alt="ac-site-template" style="border-radius: 8px; width: 90%; display: block; margin: 0 auto;" /> | <img src="img/hi-kid.png" alt="HiKid" style="border-radius: 8px; width: 90%; display: block; margin: 0 auto;" />| 



## Notes

- This project is for personal learning, research, and non-commercial demonstration only. Any form of commercial use, resale, or profit-making activities is prohibited.
- Not for use in any commercial products, enterprise projects, external services, or paid templates.
- Users are solely responsible for any risks arising from the use of this component library.

## Copyright and Disclaimer

- This project is not an official a game company product and has no association, authorization, or cooperation with a game company
- The game name included in the project name is only a descriptive reference to the style and does not constitute trademark use or brand association.
- All interface styles are merely design inspiration references and do not constitute reproduction or infringement of the original work.
- If the copyright holder believes that related content is suspected of infringement, they can contact via email, and I will make rectifications or deletions immediately.

## Contact

For any questions or copyright-related communications, please contact via Issue or email.

## License

MIT
For learning purposes only.
This project is released under the MIT open-source license, for learning use only. The author is not responsible for any legal issues or losses caused by the use of this library.