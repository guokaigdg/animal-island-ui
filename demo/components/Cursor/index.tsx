import React from 'react';
import { Cursor } from '../../../src';
import {
    labelStyle,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    demoDashedBoxStyle,
    ApiTable,
    ApiRow,
    CodeBlock,
} from '../../tools';

const CURSOR_API: ApiRow[] = [
    {
        prop: 'type',
        desc: '光标风格：default 手指箭头（默认）/ raindrop 蓝色雨滴',
        type: `'default' | 'raindrop'`,
        defaultVal: "'default'",
    },
    {
        prop: 'forceAll',
        desc: '是否对所有后代元素强制覆盖光标。true 全覆盖；false 仅容器自身设置自定义光标，交互元素保留 pointer/text/not-allowed',
        type: 'boolean',
        defaultVal: 'true',
    },
    { prop: 'children', desc: '子元素', type: 'ReactNode', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const CursorDemo: React.FC = () => (
    <div className="demo-raindrop-zone" style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Cursor <DemoTag>光标</DemoTag>
        </div>
        <p style={labelStyle}>
            Cursor 组件通过 CSS cursor 属性将子元素的鼠标光标替换为自定义图标，提供 <code>default</code>
            （手指箭头）与 <code>raindrop</code>（蓝色雨滴）两种风格。 默认 <code>forceAll=true</code>
            全覆盖所有后代；设置 <code>forceAll=false</code> 可保留 a/button 的 pointer 和输入框的 text 语义。
        </p>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>type="default"（默认）：手指箭头</div>
            <Cursor>
                <div style={{ ...demoDashedBoxStyle, padding: 24, textAlign: 'center' }}>
                    鼠标移入此区域将显示自定义光标
                </div>
            </Cursor>
            <div style={labelStyle}>type="raindrop"：蓝色雨滴</div>
            <Cursor type="raindrop">
                <div style={{ ...demoDashedBoxStyle, padding: 24, textAlign: 'center' }}>
                    鼠标移入此区域将显示雨滴光标
                </div>
            </Cursor>
            <div style={labelStyle}>forceAll=false：保留原生光标语义</div>
            <Cursor forceAll={false}>
                <div
                    style={{
                        ...demoDashedBoxStyle,
                        padding: 24,
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <div>鼠标移入此区域，交互元素恢复语义光标</div>
                    <div
                        style={{
                            display: 'flex',
                            gap: 16,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>
                            链接 (pointer)
                        </a>
                        <button type="button">按钮 (pointer)</button>
                        <button type="button" disabled>
                            禁用 (not-allowed)
                        </button>
                        <input type="text" placeholder="输入框 (text)" style={{ padding: '4px 8px' }} />
                        <span style={{ userSelect: 'text' }}>可选中文本 (默认)</span>
                    </div>
                </div>
            </Cursor>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Cursor } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 默认：手指箭头，forceAll=true 全覆盖所有后代 */}
            <Cursor>
                <div>鼠标移入此区域将显示自定义光标</div>
            </Cursor>

            {/* type="raindrop"：蓝色雨滴光标 */}
            <Cursor type="raindrop">
                <div>鼠标移入此区域将显示雨滴光标</div>
            </Cursor>

            {/* forceAll=false：保留交互语义（a/button 仍是 pointer，input 仍是 text） */}
            <Cursor forceAll={false}>
                <a href="#">链接保留 pointer</a>
                <button>按钮保留 pointer</button>
                <input type="text" placeholder="输入框保留 text" />
            </Cursor>
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={CURSOR_API} />
    </div>
);

export default CursorDemo;
