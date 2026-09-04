import React from 'react';
import { Heart, Star, Sun, Umbrella } from 'lucide-react';
import { Icon, ICON_LIST } from '../../../src';
import { ApiTable, ApiRow, sectionStyle, sectionTitleStyle, DemoTag, CodeBlock, labelStyle } from '../../tools';
import { islandGradient as customImage } from '../../gradients';

const ICON_API: ApiRow[] = [
    {
        prop: 'name',
        desc: '内置语义图标名（与 icon / src 三选一），映射到 lucide 图标',
        type: 'IconName',
        defaultVal: '-',
    },
    {
        prop: 'icon',
        desc: '任意 lucide-react 图标组件（与 name / src 三选一），优先级高于 name',
        type: 'LucideIcon',
        defaultVal: '-',
    },
    {
        prop: 'src',
        desc: '自定义图片资源 URL（与 name / icon 三选一），用于彩色位图素材',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'size',
        desc: '图标尺寸',
        type: 'number | string',
        defaultVal: '24',
    },
    {
        prop: 'color',
        desc: '描边颜色（lucide 模式）',
        type: 'string',
        defaultVal: 'currentColor',
    },
    {
        prop: 'strokeWidth',
        desc: '描边粗细（lucide 模式）',
        type: 'number | string',
        defaultVal: '2',
    },
    {
        prop: 'bounce',
        desc: '弹跳动画',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'className',
        desc: '自定义类名',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const IconDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Icon <DemoTag>lucide icons</DemoTag>
        </div>
        <div style={labelStyle}>基础用法（name 内置语义名）</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icon name="icon-left" size={32} />
            <Icon name="icon-right" size={32} />
            <Icon name="location" size={32} />
            <Icon name="page" size={32} />
            <Icon name="wifi" size={32} />
            <Icon name="icon-shopping" size={32} />
            <Icon name="icon-chat" size={32} />
            <Icon name="icon-map" size={32} />
            <Icon name="icon-camera" size={32} />
        </div>
        <div style={labelStyle}>
            icon 模式：lucide-react 的任意图标（<a href="https://lucide.dev/icons/">lucide.dev/icons</a>）
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icon icon={Heart} size={32} color="#e05260" />
            <Icon icon={Star} size={32} color="#f5b942" />
            <Icon icon={Sun} size={32} color="#f59e2d" />
            <Icon icon={Umbrella} size={32} color="#5aa9c4" />
            <Icon icon={Heart} size={32} color="#e05260" strokeWidth={3.5} />
        </div>
        <div style={labelStyle}>size 尺寸</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="wifi" size={16} />
            <Icon name="wifi" size={24} />
            <Icon name="wifi" size={32} />
            <Icon name="wifi" size={48} />
        </div>
        <div style={labelStyle}>bounce 弹跳动画（鼠标悬停查看效果）</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="location" size={32} bounce />
            <Icon name="page" size={32} bounce />
            <Icon name="wifi" size={32} bounce />
        </div>
        <div style={labelStyle}>图标列表</div>
        <div
            style={{
                border: '1px solid #e8e2d6',
                borderRadius: 12,
                overflow: 'hidden',
                padding: '5px 16px',
                marginBottom: 20,
            }}
        >
            {ICON_LIST.map((icon, index) => (
                <div
                    key={icon.name}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: '12px 5px',
                        borderBottom: index < ICON_LIST.length - 1 ? '1px dashed #f0e8d8' : 'none',
                        background: '#fff',
                    }}
                >
                    <Icon name={icon.name} size={32} />
                    <span style={{ fontSize: 14, color: '#725d42', fontFamily: 'inherit' }}>{icon.label}</span>
                    <span
                        style={{
                            marginLeft: 'auto',
                            fontSize: 12,
                            color: '#a0936e',
                            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                        }}
                    >
                        {icon.name}
                    </span>
                </div>
            ))}
        </div>
        <div style={sectionTitleStyle}>
            Custom images <DemoTag>src mode</DemoTag>
        </div>
        <div style={labelStyle}>
            自定义图片通过 <code>src</code> 传入：消费者自行 <code>import</code> 任意图片资源，按需进 bundle。
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon src={customImage} size={48} bounce />
            <Icon src={customImage} size={64} />
        </div>
        <CodeBlock
            code={`import { Icon } from 'animal-island-ui';
import { Heart } from 'lucide-react';
import myIcon from './my-icon.svg';

export default function App() {
    return (
        <>
            {/* 内置语义名 */}
            <Icon name="wifi" size={32} />
            {/* 任意 lucide 图标 */}
            <Icon icon={Heart} size={32} color="#e05260" strokeWidth={3} />
            {/* 自定义图片 */}
            <Icon src={myIcon} size={48} />
        </>
    );
}`}
        />
        <ApiTable rows={ICON_API} />
    </div>
);

export default IconDemo;
