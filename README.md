# island-themed-ui

a cozy island-style UI 风格的 React 组件库，还原治愈海岛游戏 UI 的温暖质感。

TypeScript + Vite 构建，ESM / CJS 双格式，完整类型声明。

## 安装

```bash
npm install island-themed-ui
```

需要项目中已安装 React 17+：

```bash
npm install react react-dom
```

## 快速上手

```tsx
import { Button, Card, Switch } from 'island-themed-ui';

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
        </div>
    );
}
```

## 组件

### Button 按钮

5 种类型、3 种尺寸，支持 danger / ghost / loading / icon / block。

```tsx
<Button type="primary">Primary</Button>
<Button type="dashed" danger>Danger</Button>
<Button type="primary" loading>Loading</Button>
<Button type="primary" icon={<span>🔍</span>}>搜索</Button>
<Button type="primary" block>Block</Button>
```

| 属性     | 类型                                                     | 默认值      |
| -------- | -------------------------------------------------------- | ----------- |
| type     | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | `'default'` |
| size     | `'small' \| 'middle' \| 'large'`                         | `'middle'`  |
| danger   | `boolean`                                                | `false`     |
| ghost    | `boolean`                                                | `false`     |
| block    | `boolean`                                                | `false`     |
| loading  | `boolean`                                                | `false`     |
| disabled | `boolean`                                                | `false`     |
| icon     | `ReactNode`                                              | -           |
| htmlType | `'submit' \| 'reset' \| 'button'`                        | `'button'`  |

### Input 输入框

3 种尺寸，支持前后缀、一键清空、error / warning 校验状态。

```tsx
<Input placeholder="请输入" />
<Input placeholder="搜索" prefix="🔍" suffix="⏎" />
<Input placeholder="可清空" allowClear />
<Input placeholder="错误" status="error" />
<Input size="large" placeholder="大号输入框" />
```

| 属性       | 类型                             | 默认值     |
| ---------- | -------------------------------- | ---------- |
| size       | `'small' \| 'middle' \| 'large'` | `'middle'` |
| prefix     | `ReactNode`                      | -          |
| suffix     | `ReactNode`                      | -          |
| allowClear | `boolean`                        | `false`    |
| status     | `'error' \| 'warning'`           | -          |
| onClear    | `() => void`                     | -          |

### Switch 开关

支持受控 / 非受控、自定义文案、small 尺寸、loading 状态。

```tsx
<Switch defaultChecked />
<Switch checkedChildren="开" unCheckedChildren="关" />
<Switch size="small" />
<Switch loading />
```

| 属性              | 类型                         | 默认值      |
| ----------------- | ---------------------------- | ----------- |
| checked           | `boolean`                    | -           |
| defaultChecked    | `boolean`                    | `false`     |
| size              | `'small' \| 'default'`       | `'default'` |
| disabled          | `boolean`                    | `false`     |
| loading           | `boolean`                    | `false`     |
| checkedChildren   | `ReactNode`                  | -           |
| unCheckedChildren | `ReactNode`                  | -           |
| onChange          | `(checked: boolean) => void` | -           |

### Card 卡片

2 种类型、12 种 IslandPhone 背景颜色。

```tsx
<Card>默认卡片</Card>
<Card type="title">标题卡片</Card>
<Card color="app-blue">蓝色卡片</Card>
<Card type="title" color="purple">紫色标题卡片</Card>
```

| 属性      | 类型                                                                                                                                                                                            | 默认值      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| type      | `'default' \| 'title'`                                                                                                                                                                          | `'default'` |
| color     | `'default' \| 'app-pink' \| 'purple' \| 'app-blue' \| 'app-yellow' \| 'app-orange' \| 'app-teal' \| 'app-green' \| 'app-red' \| 'lime-green' \| 'yellow-green' \| 'brown' \| 'warm-peach-pink'` | `'default'` |
| className | `string`                                                                                                                                                                                        | -           |
| style     | `CSSProperties`                                                                                                                                                                                 | -           |
| onClick   | `MouseEventHandler`                                                                                                                                                                             | -           |

### Modal 弹窗

SVG clip-path 有机形状裁切，支持标题、自定义 Footer、ESC / 遮罩关闭。

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>打开</Button>
<Modal open={open} title="标题" onClose={() => setOpen(false)} onOk={() => setOpen(false)}>
  <p>弹窗内容</p>
</Modal>
```

| 属性         | 类型                | 默认值            |
| ------------ | ------------------- | ----------------- |
| open         | `boolean` (必填)    | -                 |
| title        | `ReactNode`         | -                 |
| width        | `number \| string`  | `520`             |
| maskClosable | `boolean`           | `true`            |
| closable     | `boolean`           | `true`            |
| footer       | `ReactNode \| null` | 默认确认/取消按钮 |
| onClose      | `() => void`        | -                 |
| onOk         | `() => void`        | -                 |

### Collapse 折叠面板

FAQ 风格，CSS Grid 平滑展开动画。

```tsx
<Collapse question="问题标题" answer={<p>答案内容</p>} />
<Collapse question="默认展开" answer={<p>答案</p>} defaultExpanded />
<Collapse question="已禁用" answer={<p>答案</p>} disabled />
```

| 属性            | 类型               | 默认值  |
| --------------- | ------------------ | ------- |
| question        | `ReactNode` (必填) | -       |
| answer          | `ReactNode` (必填) | -       |
| defaultExpanded | `boolean`          | `false` |
| disabled        | `boolean`          | `false` |

### Cursor 光标

包裹子元素，应用治愈海岛风格手指光标。

```tsx
<Cursor>
    <div>鼠标移入显示治愈海岛光标</div>
</Cursor>
```

### Divider 分割线

治愈海岛风格装饰性水平分割线。

```tsx
<Divider />
```

## 主题定制

通过覆盖 CSS 自定义属性实现运行时换肤，无需重新构建：

```css
:root {
    --animal-primary-color: #19c8b9;
    --animal-text-color: #827157;
    --animal-bg-color: #f8f8f0;
    --animal-border-color: #9f927d;
    --animal-font-family: 'M PLUS Rounded 1c', sans-serif;
    --animal-border-radius-base: 18px;
    --animal-height-base: 40px;
}
```

支持 40+ 设计令牌，覆盖颜色、字体、间距、圆角、阴影、动画、尺寸等维度。完整变量列表参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## License

MIT
