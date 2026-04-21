# 🏝 Animal-Island-UI

<img src="docs/img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 65%; display: block; margin: 0 auto;" />

<br>
<p align="center">
    简体中文 | <a href="./docs/README.en.md">English</a>
</p>
一款风格参考《动物森友会》的 React UI 组件库，仅用于学习与技术交流。

## 介绍

本项目是基于 React + TypeScript 实现的轻量 UI 组件库，设计风格灵感来源于任天堂《集合啦！动物森友会》游戏界面，用于个人前端技术练习与组件化开发学习。

所有视觉元素、布局、图标、动画均为独立设计实现，未直接使用任何任天堂官方美术素材、代码或资源文件。


## 预览

- 在线预览 (PC 端) [animal-island-ui-pc](https://guokaigdg.github.io/animal-island-ui/#/)
- 在线预览（移动端）[animal-island-ui-mobile](https://guokaigdg.github.io/animal-island-ui/#/)

## 安装

```bash
npm install animal-island-ui
```



## 快速上手

```tsx
import { Button, Card, Switch, Time, Phone } from 'animal-island-ui';

function App() {
    return (
        <div>
            <Button type="primary">开始冒险</Button>
            <Card color="app-blue">
                <p>欢迎来到无人岛！</p>
            </Card>
            <Switch
                defaultChecked
                checkedChildren="开"
                unCheckedChildren="关"
            />
            <Time />
            <Phone />
        </div>
    );
}
```


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

<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: flex-start;">
  <div style="flex: 1; min-width: 300px; max-width: 30%;">
    <h4><a href="https://github.com/yunxinz/ac-site-template">ac-site-template</a>（动森主题个人网站模板）</h4>
    <img src="docs/img/ac-site-template.JPG" alt="ac-site-template" style="border-radius: 8px; width: 100%; display: block; margin-top: 10px;" />
  </div>
  <div style="flex: 1; min-width: 300px; max-width: 30%;">
    <h4><a href="https://github.com/xiaochong/hi-kid">HiKid</a>（儿童教育练习英语口语和听力）</h4>
    <img src="docs/img/hi-kid.JPG" alt="HiKid" style="border-radius: 8px; width: 100%; display: block; margin-top: 10px;" />
  </div>
</div>

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
