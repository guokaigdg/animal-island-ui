# 🏝 Animal-Island-UI

<img src="../docs/img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 65%; display: block; margin: 0 auto;" />

<br>
<p align="center">
    <a href="../README.md">中文</a> | English
</p>
A React UI component library inspired by "Animal Crossing: New Horizons", for learning and technical exchange only.

## Introduction

This project is a lightweight UI component library built with React + TypeScript. The design style is inspired by Nintendo's "Animal Crossing: New Horizons" game interface, created for personal front-end technical practice and component development learning.

All visual elements, layouts, icons, and animations are independently designed and implemented, without directly using any official Nintendo art materials, code, or resource files.


## Preview

- Online Preview (PC) [animal-island-ui-pc](https://guokaigdg.github.io/animal-island-ui/#/)
- Online Preview (Mobile) [animal-island-ui-mobile](https://guokaigdg.github.io/animal-island-ui/#/)

## Installation

```bash
npm install animal-island-ui
```



## Quick Start

```tsx
import { Button, Card, Switch, Time, Phone } from 'animal-island-ui';

function App() {
    return (
        <div>
            <Button type="primary">Start Adventure</Button>
            <Card color="app-blue">
                <p>Welcome to the deserted island!</p>
            </Card>
            <Switch
                defaultChecked
                checkedChildren="On"
                unCheckedChildren="Off"
            />
            <Time />
            <Phone />
        </div>
    );
}
```

## Usage Cases

<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: flex-start;">
  <div style="flex: 1; min-width: 300px; max-width: 30%;">
    <h4><a href="https://github.com/yunxinz/ac-site-template">ac-site-template</a></h4>
    <p>An Animal Crossing-themed personal website template</p>
    <img src="img/ac-site-template.JPG" alt="ac-site-template" style="border-radius: 8px; width: 100%; display: block; margin-top: 10px;" />
  </div>
  <div style="flex: 1; min-width: 300px; max-width: 30%;">
    <h4><a href="https://github.com/xiaochong/hi-kid">HiKid</a></h4>
    <p>A children's education-related project</p>
    <img src="img/hi-kid.JPG" alt="HiKid" style="border-radius: 8px; width: 100%; display: block; margin-top: 10px;" />
  </div>
</div>

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

- This project is for personal learning, research, and non-commercial demonstration only. Any form of commercial use, resale, or profit-making activities is prohibited.
- Not for use in any commercial products, enterprise projects, external services, or paid templates.
- Users are solely responsible for any risks arising from the use of this component library.

## Copyright and Disclaimer

- This project is not an official Nintendo product and has no association, authorization, or cooperation with Nintendo Co., Ltd.
- The game name included in the project name is only a descriptive reference to the style and does not constitute trademark use or brand association.
- All interface styles are merely design inspiration references and do not constitute reproduction or infringement of the original work.
- If the copyright holder believes that related content is suspected of infringement, they can contact via email, and I will make rectifications or deletions immediately.

## Contact

For any questions or copyright-related communications, please contact via Issue or email.

## License

MIT
For learning purposes only.
This project is released under the MIT open-source license, for learning use only. The author is not responsible for any legal issues or losses caused by the use of this library.