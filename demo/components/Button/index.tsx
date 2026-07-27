import React from 'react';
import { Button } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const BUTTON_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '按钮类型',
        type: `'primary' | 'default' | 'dashed' | 'text' | 'link'`,
        defaultVal: "'default'",
    },
    {
        prop: 'size',
        desc: '按钮尺寸',
        type: `'small' | 'middle' | 'large'`,
        defaultVal: "'middle'",
    },
    {
        prop: 'danger',
        desc: '是否危险按钮',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'ghost',
        desc: '是否幽灵按钮（透明背景）',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'block',
        desc: '是否块级按钮',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'loading', desc: '加载状态', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'disabled',
        desc: '禁用状态',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'icon', desc: '图标', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'htmlType',
        desc: '原生 button type',
        type: `'submit' | 'reset' | 'button'`,
        defaultVal: "'button'",
    },
    { prop: 'children', desc: '按钮内容', type: 'ReactNode', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: '...',
        desc: '继承 React.ButtonHTMLAttributes',
        type: 'HTMLButtonElement',
        defaultVal: '-',
    },
];

const S = {
    row: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    } as React.CSSProperties,
};

const ButtonDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Button <DemoTag>6 types</DemoTag>
        </div>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>type 按钮类型</div>
            <div style={S.row}>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
            </div>
            <div style={labelStyle}>danger / ghost / loading / disabled 状态</div>
            <div style={S.row}>
                <Button type="primary" danger>
                    Danger
                </Button>
                <Button type="primary" ghost>
                    Ghost
                </Button>
                <Button type="primary" loading>
                    Loading
                </Button>
                <Button type="primary" disabled>
                    Disabled
                </Button>
            </div>
            <div style={labelStyle}>size 尺寸</div>
            <div style={S.row}>
                <Button type="primary" size="small">
                    Small
                </Button>
                <Button type="primary" size="middle">
                    Middle
                </Button>
                <Button type="primary" size="large">
                    Large
                </Button>
            </div>
            <div style={labelStyle}>icon 图标按钮</div>
            <div style={S.row}>
                <Button type="primary" icon={<span>🔍</span>}>
                    搜索
                </Button>
                <Button icon={<span>⭐</span>}>收藏</Button>
                <Button type="dashed" icon={<span>＋</span>}>
                    新增
                </Button>
            </div>
            <div style={labelStyle}>block 块级按钮</div>
            <div style={{ maxWidth: 360 }}>
                <Button type="primary" block>
                    Block Button
                </Button>
            </div>
            <div style={labelStyle}>danger 组合</div>
            <div style={S.row}>
                <Button type="primary" danger>
                    Primary Danger
                </Button>
                <Button danger>Default Danger</Button>
                <Button type="dashed" danger>
                    Dashed Danger
                </Button>
                <Button type="text" danger>
                    Text Danger
                </Button>
                <Button type="link" danger>
                    Link Danger
                </Button>
            </div>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Button } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* Primary */}
            <Button type="primary">Primary</Button>
            {/* Default */}
            <Button>Default</Button>
            {/* Dashed */}
            <Button type="dashed">Dashed</Button>
            {/* Text */}
            <Button type="text">Text</Button>
            {/* Link */}
            <Button type="link">Link</Button>
            {/* Danger */}
            <Button type="primary" danger>Danger</Button>
            {/* Ghost */}
            <Button type="primary" ghost>Ghost</Button>
            {/* Loading */}
            <Button type="primary" loading>Loading</Button>
            {/* Large */}
            <Button type="primary" size="large">Large</Button>
            {/* Icon */}
            <Button type="primary" icon={<span>🔍</span>}>搜索</Button>
            {/* Block */}
            <Button type="primary" block>Block</Button>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={BUTTON_API} />
    </div>
);

export default ButtonDemo;
