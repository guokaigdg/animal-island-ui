import React from 'react';
import { Collapse } from '../../../src';
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

const COLLAPSE_API: ApiRow[] = [
    {
        prop: 'question',
        desc: '问题标题',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'answer',
        desc: '答案内容',
        type: 'ReactNode',
        defaultVal: '-',
        required: true,
    },
    {
        prop: 'defaultExpanded',
        desc: '是否默认展开',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'disabled',
        desc: '是否禁用',
        type: 'boolean',
        defaultVal: 'false',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const CollapseDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Collapse <DemoTag>FAQ</DemoTag>
        </div>
        <div style={demoBodyStyle}>
            <div style={labelStyle}>基础用法</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse question="1個島嶼可以登錄多少名用戶?" answer={<p>1座島嶼最多可以容納8位居民（用戶）。</p>} />
                <Collapse
                    question="可以多少人一起玩?"
                    answer={<p>同住1個島的居民可以最多4人一起遊玩。透過通訊最多8人一起遊玩。</p>}
                />
            </div>
            <div style={labelStyle}>defaultExpanded 默认展开</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse
                    question="这个问题默认展开"
                    answer={<p>答案已经展示出来了！可以点击收起。</p>}
                    defaultExpanded
                />
            </div>
            <div style={labelStyle}>disabled 禁用状态</div>
            <div style={{ maxWidth: 720 }}>
                <Collapse question="这个问题已被禁用（无法展开）" answer={<p>这段文字不应该被看到。</p>} disabled />
            </div>
        </div>
        <CodeBlock
            code={`import React from 'react';
import { Collapse } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Collapse question="问题" answer={<p>回答内容</p>} />
            {/* 默认展开 */}
            <Collapse question="默认展开" answer={<p>答案</p>} defaultExpanded />
            {/* 禁用状态 */}
            <Collapse question="禁用" answer={<p>答案</p>} disabled />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={COLLAPSE_API} />
    </div>
);

export default CollapseDemo;
