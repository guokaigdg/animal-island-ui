import React, { useState } from 'react';
import { Tag, type TagColor } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    tagStyle,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const S = {
    row: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
};

const TAG_API: ApiRow[] = [
    { prop: 'children', desc: '标签内容', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'size',
        desc: '尺寸',
        type: `'small' | 'medium' | 'large'`,
        defaultVal: "'medium'",
    },
    {
        prop: 'variant',
        desc: '风格变体',
        type: `'solid' | 'outlined' | 'dashed'`,
        defaultVal: "'solid'",
    },
    {
        prop: 'color',
        desc: '颜色（与 Card 同款 13 色调色板）',
        type: `'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'`,
        defaultVal: "'default'",
    },
    { prop: 'closable', desc: '是否可关闭', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'onClose',
        desc: '关闭回调',
        type: '(e: MouseEvent) => void',
        defaultVal: '-',
    },
    {
        prop: 'onClick',
        desc: '点击回调（开启后标签可点击）',
        type: '(e: MouseEvent) => void',
        defaultVal: '-',
    },
    { prop: 'disabled', desc: '禁用', type: 'boolean', defaultVal: 'false' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

type ClosableItem = { name: string; color: TagColor };

const TagDemo: React.FC = () => {
    const [items, setItems] = useState<ClosableItem[]>([
        { name: 'Apple', color: 'app-pink' },
        { name: 'Banana', color: 'app-yellow' },
        { name: 'Grape', color: 'purple' },
        { name: 'Blueberry', color: 'app-blue' },
        { name: 'Mint', color: 'app-teal' },
        { name: 'Lime', color: 'lime-green' },
        { name: 'Orange', color: 'app-orange' },
    ]);
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Tag <span style={tagStyle}>3 variants</span> <span style={tagStyle}>16 colors</span>{' '}
                <span style={tagStyle}>3 sizes</span>
            </div>
            <div style={demoBodyStyle}>
                <div style={labelStyle}>variant 风格变体</div>
                <div style={S.row}>
                    <Tag variant="solid">solid</Tag>
                    <Tag variant="outlined" color="app-blue">
                        outlined
                    </Tag>
                    <Tag variant="dashed" color="app-orange">
                        dashed
                    </Tag>
                </div>

                <div style={labelStyle}>size 尺寸</div>
                <div style={S.row}>
                    <Tag size="small" color="app-blue">
                        small
                    </Tag>
                    <Tag size="medium" color="app-blue">
                        medium
                    </Tag>
                    <Tag size="large" color="app-blue">
                        large
                    </Tag>
                </div>

                <div style={labelStyle}>color 颜色（solid）</div>
                <div style={S.row}>
                    <Tag color="default">default</Tag>
                    <Tag color="app-pink">app-pink</Tag>
                    <Tag color="purple">purple</Tag>
                    <Tag color="app-blue">app-blue</Tag>
                    <Tag color="app-yellow">app-yellow</Tag>
                    <Tag color="app-orange">app-orange</Tag>
                    <Tag color="app-teal">app-teal</Tag>
                    <Tag color="app-green">app-green</Tag>
                    <Tag color="app-red">app-red</Tag>
                    <Tag color="lime-green">lime-green</Tag>
                    <Tag color="yellow-green">yellow-green</Tag>
                    <Tag color="brown">brown</Tag>
                    <Tag color="warm-peach-pink">warm-peach-pink</Tag>
                </div>

                <div style={labelStyle}>color 颜色（outlined）</div>
                <div style={S.row}>
                    <Tag variant="outlined" color="default">default</Tag>
                    <Tag variant="outlined" color="app-pink">app-pink</Tag>
                    <Tag variant="outlined" color="purple">purple</Tag>
                    <Tag variant="outlined" color="app-blue">app-blue</Tag>
                    <Tag variant="outlined" color="app-yellow">app-yellow</Tag>
                    <Tag variant="outlined" color="app-orange">app-orange</Tag>
                    <Tag variant="outlined" color="app-teal">app-teal</Tag>
                    <Tag variant="outlined" color="app-green">app-green</Tag>
                    <Tag variant="outlined" color="app-red">app-red</Tag>
                    <Tag variant="outlined" color="lime-green">lime-green</Tag>
                    <Tag variant="outlined" color="yellow-green">yellow-green</Tag>
                    <Tag variant="outlined" color="brown">brown</Tag>
                    <Tag variant="outlined" color="warm-peach-pink">warm-peach-pink</Tag>
                </div>

                <div style={labelStyle}>color 颜色（dashed）</div>
                <div style={S.row}>
                    <Tag variant="dashed" color="default">default</Tag>
                    <Tag variant="dashed" color="app-pink">app-pink</Tag>
                    <Tag variant="dashed" color="purple">purple</Tag>
                    <Tag variant="dashed" color="app-blue">app-blue</Tag>
                    <Tag variant="dashed" color="app-yellow">app-yellow</Tag>
                    <Tag variant="dashed" color="app-orange">app-orange</Tag>
                    <Tag variant="dashed" color="app-teal">app-teal</Tag>
                    <Tag variant="dashed" color="app-green">app-green</Tag>
                    <Tag variant="dashed" color="app-red">app-red</Tag>
                    <Tag variant="dashed" color="lime-green">lime-green</Tag>
                    <Tag variant="dashed" color="yellow-green">yellow-green</Tag>
                    <Tag variant="dashed" color="brown">brown</Tag>
                    <Tag variant="dashed" color="warm-peach-pink">warm-peach-pink</Tag>
                </div>

                <div style={labelStyle}>closable 可关闭</div>
                <div style={S.row}>
                    {items.map((it) => (
                        <Tag
                            key={it.name}
                            color={it.color}
                            closable
                            onClose={() => setItems(items.filter((x) => x.name !== it.name))}
                        >
                            {it.name}
                        </Tag>
                    ))}
                    {items.length === 0 && <span style={{ fontSize: 12, color: '#a0936e' }}>所有标签都已关闭</span>}
                </div>

                <div style={labelStyle}>onClick 可点击（hover + 键盘 Enter / Space 触发）</div>
                <div style={S.row}>
                    <Tag color="app-blue" onClick={() => alert('点了 Tag')}>
                        可点击
                    </Tag>
                    <Tag variant="outlined" color="app-green" onClick={() => alert('点了 outlined Tag')}>
                        outlined 可点击
                    </Tag>
                    <Tag color="brown" onClick={() => {}} disabled>
                        disabled
                    </Tag>
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Tag } from 'animal-island-ui';

const App = () => {
    const [items, setItems] = useState([
        { name: 'Apple', color: 'app-pink' },
        { name: 'Blueberry', color: 'app-blue' },
    ]);
    return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {/* 基础 */}
            <Tag>default</Tag>
            <Tag color="app-pink">app-pink</Tag>
            <Tag color="app-blue">app-blue</Tag>
            <Tag color="app-teal">app-teal</Tag>

            {/* 风格变体 */}
            <Tag variant="outlined" color="purple">outlined</Tag>
            <Tag variant="dashed" color="app-orange">dashed</Tag>

            {/* 尺寸 */}
            <Tag size="small">small</Tag>
            <Tag size="medium">medium</Tag>
            <Tag size="large">large</Tag>

            {/* 可关闭 */}
            {items.map(it => (
                <Tag
                    key={it.name}
                    color={it.color}
                    closable
                    onClose={() => setItems(items.filter(x => x.name !== it.name))}
                >
                    {it.name}
                </Tag>
            ))}

            {/* 可点击 */}
            <Tag color="app-blue" onClick={() => console.log('clicked')}>
                可点击
            </Tag>

            {/* 禁用 */}
            <Tag disabled>disabled</Tag>
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={TAG_API} />
        </div>
    );
};

export default TagDemo;
