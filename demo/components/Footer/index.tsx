import React from 'react';
import { Footer as FooterComponent } from '../../../src';
import { CodeBlock, ApiTable, ApiRow, sectionStyle, sectionTitleStyle, tagStyle, demoBodyStyle } from '../../tools';

const FooterDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Footer <span style={tagStyle}>底部装饰</span>
        </div>
        <p style={{ fontSize: 13, color: '#8a7b66', marginTop: 20, marginBottom: 30 }}>
            Footer 组件 — 页面底部装饰图片，支持 sea（海）和 tree（树）两种类型。
        </p>
        <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
            <div style={{ marginBottom: 20, color: '#8a7b66', fontSize: 14 }}>sea 类型（默认）</div>
            <FooterComponent type="sea" />
        </div>
        <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
            <div style={{ marginBottom: 20, color: '#8a7b66', fontSize: 14 }}>tree 类型</div>
            <FooterComponent type="tree" />
        </div>
        <CodeBlock
            code={`import { Footer } from 'animal-island-ui';

const App = () => (
    <>
        <Footer type="sea" />
        <Footer type="tree" />
    </>
);`}
        />
        <ApiTable rows={FOOTER_API} />
    </div>
);

const FOOTER_API: ApiRow[] = [
    { prop: 'type', desc: 'Footer 类型', type: 'FooterType', defaultVal: 'sea' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default FooterDemo;
