import React from 'react';
import { CodeBlock } from '../../../src';
import {
    labelStyle,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBoxStyle,
    CodeBlock as CodeBlockBase,
} from '../../tools';

const CODEBLOCK_API: ApiRow[] = [
    { prop: 'code', desc: '代码字符串', type: 'string', defaultVal: '-', required: true },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'copyable', desc: '是否显示复制按钮', type: 'boolean', defaultVal: 'true' },
    { prop: 'onCopy', desc: '复制成功回调', type: '(code: string) => void', defaultVal: '-' },
];

const CodeBlockDemo: React.FC = () => {
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                CodeBlock <DemoTag>代码高亮</DemoTag>
            </div>
            <div style={labelStyle}>基础用法</div>
            <div style={demoBoxStyle}>
                <CodeBlock
                    code={`import React from 'react';
import { Button } from 'animal-island-ui';

const App = () => (
    <Button type="primary">按钮</Button>
);

export default App;`}
                />
            </div>

            <div style={labelStyle}>关闭复制功能</div>
            <div style={demoBoxStyle}>
                <CodeBlock code="const copyButton = false;" copyable={false} />
            </div>

            <div style={labelStyle}>自定义样式</div>
            <div style={demoBoxStyle}>
                <CodeBlock
                    code={`import React from 'react';
import { CodeBlock } from 'animal-island-ui';

<CodeBlock
    code={codeString}
    style={{ borderRadius: 5, backgroundColor: '#242c46ff' }}
    className="custom-code"
/>`}
                    style={{ borderRadius: 5, backgroundColor: '#242c46ff' }}
                />
            </div>
            <CodeBlockBase
                code={`import React from 'react';
import { CodeBlock } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <CodeBlock code={'
                import React from 'react';
                import { Footer } from 'animal-island-ui';

                const App = () => {
                    return (
                        <div>
                            {/* 默认 size=24，101 个图标循环铺满 */}
                            <Footer />
                            {/* 自定义图标大小 */}
                            <Footer size={36} />
                        </div>
                    );
                };

                export default App;'}
            />
            {/* 自定义样式 */}
            <CodeBlock
                code={codeString}
                style={{ borderRadius: 5, backgroundColor: '#242c46ff' }}
                className="custom-code"
            />
        </div>
    );
};

export default App;`}
            />

            <ApiTable rows={CODEBLOCK_API} />
        </div>
    );
};

export default CodeBlockDemo;
