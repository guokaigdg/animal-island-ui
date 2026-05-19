# 🏝 Animal-Island-UI

<div align="center">
    <img src="docs/img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />    
</div>
<div align="center">
一款参考《治愈系海岛》风格的 React UI 组件库
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
    简体中文 | <a href="./docs/README.en.md">English</a>
</p>

## 介绍

本项目是基于 React + TypeScript 实现的轻量 UI 组件库，设计风格灵感来源于任天堂《治愈系海岛风格》游戏界面，用于个人前端技术练习与组件化开发学习。

所有视觉元素、布局、图标、动画均为独立设计实现，未直接使用任何任天堂官方美术素材、代码或资源文件。

## 🎉 vue 版本

- [animal-island-ui](https://github.com/guokaigdg/animal-island-ui)

## 预览

- 在线预览 (PC 端) [animal-island-ui-pc](https://guokaigdg.github.io/animal-island-ui/#/)
- 在线预览（移动端）[animal-island-ui-mobile](https://guokaigdg.github.io/animal-island-ui/#/)

## 安装

```bash
npm install animal-island-ui
```

## 快速上手

> ⚠️ **重要**: 请务必导入样式文件 `import 'animal-island-ui/style'`，否则组件将没有样式与字体!

```tsx
import { Button, Card } from 'animal-island-ui';
import 'animal-island-ui/style';

function App() {
    return (
        <div>
            <Button type="primary">开始冒险</Button>
            <Card color="app-blue">欢迎来到无人岛！</Card>
        </div>
    );
}
```

## 文档

面向不同场景的完整参考：

| 文档                                     | 用途                                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`AI_USAGE.md`](./AI_USAGE.md)           | 面向 AI 代码助手的使用手册，逐字收录全部组件 props、类型与默认值，附 19 条硬性规则与可复制样板，杜绝臆造 API。 |
| [`DESIGN_PROMPT.md`](./DESIGN_PROMPT.md) | 一键复刻提示词，适配 v0 / Figma AI / Midjourney / DALL-E，含色板、字体、尺寸表、Modal clip-path 与禁用清单。   |
| [`skill/SKILL.md`](./skill/SKILL.md)     | 像素级样式规范 Skill，覆盖设计 token、全部组件精确 CSS、Demo 布局数值、CSS 变量模板与新组件开发 Checklist。    |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)   | 贡献指南                                                                                                       |

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/guokaigdg/animal-island-ui.git
cd animal-island-ui

# 安装依赖
npm install

# 启动 Demo 开发服务器
npm run dev

# 构建组件库
npm run build

# 构建 Demo 站点
npm run build:demo
```

## 案例

| <a href="https://github.com/yunxinz/ac-site-template">ac-site-template</a>（治愈海岛主题个人网站模板）                                          | <a href="https://github.com/xiaochong/hi-kid">HiKid</a>（儿童教育练习英语口语和听力）                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="docs/img/ac-site-template.png" alt="ac-site-template" style="border-radius: 8px; width: 90%; display: block; margin: 0 auto;" />  | <img src="docs/img/hi-kid.png" alt="HiKid" style="border-radius: 8px; width: 90%; display: block; margin: 0 auto;" />                |
| <a href="https://github.com/guokaigdg/animal-island-blog">animal-island-blog</a>（治愈海岛风格博客）                                            | <a href="https://github.com/liuyuhong0324/AnimalIslandUI">AnimalIslandUI</a>（一款治愈海岛风格的安卓UI库）                               |
| <img src="docs/img/case-animal-blog.png" alt="ac-site-template" style="border-radius: 8px; width: 100%; display: block; margin: 0 auto;" /> | <img src="docs/img/android-ui.png" alt="ac-site-template" style="border-radius: 8px; width: 90%; display: block; margin: 0 auto;" /> |

## 注意事项

- 本项目仅用于个人学习、研究与非商业展示，禁止任何形式的商业使用、二次售卖或盈利行为。
- 不用于任何商业产品、企业项目、对外服务或付费模板。
- 使用本组件库产生的任何风险由使用者自行承担。

## 版权与免责声明

- 本项目并非任天堂官方产品，与任天堂株式会社无任何关联、授权或合作关系。
- 项目名称中包含的游戏名称仅为风格描述性引用，不构成商标使用或品牌关联。
- 所有界面风格仅为设计灵感参考，不构成对原作品的复制或侵权。
- 若版权方认为相关内容存在侵权嫌疑，可通过邮箱联系，本人将在第一时间进行整改或删除处理。

## 联系方式

如有问题或版权相关沟通，请通过 Issue 或邮件联系。

## License

MIT
本项目基于 MIT 开源协议发布，仅限学习使用，作者不对因使用本库导致的任何法律问题或损失承担责任。
