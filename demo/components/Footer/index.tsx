import React from 'react';
import { Footer as FooterComponent } from '../../../src';
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

const FooterDemo: React.FC = () => {
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Footer <span style={tagStyle}>底部装饰</span>
            </div>
            <div style={labelStyle}>
                Footer 组件 — 页面底部装饰图片，支持 sea（海）和 tree（树）两种类型，seamless
                默认为开启，背景无缝循环拼接；可显式传 false 关闭。
            </div>

            <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
                <div style={labelStyle}>tree 类型（默认）</div>
                <FooterComponent />
            </div>
            <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
                <div style={labelStyle}>sea 类型</div>
                <FooterComponent type="sea" />
            </div>

            <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
                <div style={labelStyle}>seamless 状态对比</div>
                <div style={compareBoxStyle}>
                    <div style={compareRowStyle}>
                        <div style={compareLabelStyle}>
                            开启 (默认) <code style={codePillStyle}>seamless</code>
                        </div>
                        <div style={compareColStyle}>
                            <FooterComponent type="tree" />
                            <FooterComponent type="sea" />
                        </div>
                    </div>
                    <div style={compareRowStyle}>
                        <div style={compareLabelStyle}>
                            关闭 <code style={codePillStyle}>seamless={'{false}'}</code>
                        </div>
                        <div style={compareColStyle}>
                            <FooterComponent type="tree" seamless={false} />
                            <FooterComponent type="sea" seamless={false} />
                        </div>
                    </div>
                </div>
            </div>

            <CodeBlock
                code={`import React from 'react';
import { Footer } from 'animal-island-ui';

const App = () => (
    <div>
        <Footer />                          {/* 默认 type=tree, seamless=true */}
        <Footer type="sea" />                {/* 换 sea 类型,seamless 仍默认 true */}
        <Footer type="sea" seamless={false} />{/* 显式关闭无缝拼接 */}
    </div>
);`}
            />
            <ApiTable rows={FOOTER_API} />
        </div>
    );
};

const compareBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
};

const compareRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
};

const compareColStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
};

const compareLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#6e5b3e',
};

const codePillStyle: React.CSSProperties = {
    background: '#fff5d6',
    color: '#8a6a25',
    padding: '1px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
};

const FOOTER_API: ApiRow[] = [
    { prop: 'type', desc: 'Footer 类型', type: "'sea' | 'tree'", defaultVal: "'tree'" },
    { prop: 'seamless', desc: '是否无缝拼接（背景循环平铺）', type: 'boolean', defaultVal: 'true' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default FooterDemo;
