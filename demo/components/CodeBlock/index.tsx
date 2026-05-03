import React from 'react';
import { CodeBlock } from '../../../src';
import {
    labelStyle,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    tagStyle,
    demoBoxStyle,
    CodeBlock as CodeBlockBase,
} from '../../tools';

const CODEBLOCK_API: ApiRow[] = [
    { prop: 'code', desc: '代码字符串', type: 'string', defaultVal: '-', required: true },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
];

const CodeBlockDemo: React.FC = () => {
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                CodeBlock <span style={tagStyle}>代码高亮</span>
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
                            {/* sea 类型（默认） */}
                            <Footer type="sea" />
                            {/* tree 类型 */}
                            <Footer type="tree" />
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