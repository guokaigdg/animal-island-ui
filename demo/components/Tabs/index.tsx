import React, { useState } from 'react';
import { Tabs } from '../../../src';
import type { TabItem } from '../../../src';
import { labelStyle, ApiTable, CodeBlock, sectionStyle, sectionTitleStyle, tagStyle, demoBoxStyle } from '../../tools';

const TABS_API = [
    { prop: 'items', desc: '标签页配置列表', type: 'TabItem[]', defaultVal: '-', required: true },
    { prop: 'defaultActiveKey', desc: '默认激活的标签', type: 'string', defaultVal: '第一个标签' },
    { prop: 'activeKey', desc: '受控模式当前激活标签', type: 'string', defaultVal: '-' },
    { prop: 'onChange', desc: '标签切换回调', type: '(key: string) => void', defaultVal: '-' },
    { prop: 'shadow', desc: '是否显示选中状态阴影', type: 'boolean', defaultVal: 'true' },
    { prop: 'leafAnimation', desc: '是否启用叶子动画', type: 'boolean', defaultVal: 'true' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const TabsDemo: React.FC = () => {
    const [activeKey, setActiveKey] = useState('tab1');
    const items: TabItem[] = [
        {
            key: 'tab1',
            label: '岛屿概况',
            children: (
                <div>
                    <p style={{ marginBottom: 12 }}>这里是一座无人岛，环境优美，气候宜人。</p>
                    <p>可以钓鱼、捉虫、种植各种植物。</p>
                </div>
            ),
        },
        {
            key: 'tab2',
            label: '商店',
            children: (
                <div>
                    <p style={{ marginBottom: 12 }}>狸然超市营业中！</p>
                    <p>各种商品应有尽有，价格实惠。</p>
                </div>
            ),
        },
        {
            key: 'tab3',
            label: '服务台',
            children: (
                <div>
                    <p style={{ marginBottom: 12 }}>欢迎来到服务台！</p>
                    <p>可以办理各种服务业务。</p>
                </div>
            ),
        },
    ];

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Tab <span style={tagStyle}>基础用法</span>
            </div>
            <div style={labelStyle}>shadow 阴影控制</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={demoBoxStyle}>
                    <Tabs
                        items={[
                            { key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
                            { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> },
                        ]}
                        defaultActiveKey="a"
                    />
                </div>
                <div style={demoBoxStyle}>
                    <Tabs
                        items={[
                            { key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
                            { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> },
                        ]}
                        defaultActiveKey="a"
                        shadow={false}
                    />
                </div>
            </div>
            <div style={labelStyle}>非受控模式</div>
            <div style={demoBoxStyle}>
                <Tabs
                    items={[
                        { key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼、河童...</p> },
                        { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫、蜻蜓...</p> },
                        { key: 'c', label: '海洋生物', children: <p>海星、珊瑚、小丑鱼...</p> },
                    ]}
                    defaultActiveKey="a"
                />
            </div>
            <div style={labelStyle}>受控模式</div>
            <div style={demoBoxStyle}>
                <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: '#a08060' }}>
                当前选中:{' '}
                <span style={{ color: '#19c8b9', fontWeight: 600 }}>
                    {items.find((i) => i.key === activeKey)?.label}
                </span>
            </div>
            <div style={labelStyle}>leafAnimation 叶子动画控制</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={demoBoxStyle}>
                    <Tabs
                        items={[
                            { key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
                            { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> },
                        ]}
                        defaultActiveKey="a"
                        leafAnimation={true}
                    />
                    <div style={{ fontSize: 12, color: '#a0936e', marginTop: 8 }}>leafAnimation=true (默认)</div>
                </div>
                <div style={demoBoxStyle}>
                    <Tabs
                        items={[
                            { key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> },
                            { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> },
                        ]}
                        defaultActiveKey="a"
                        leafAnimation={false}
                    />
                    <div style={{ fontSize: 12, color: '#a0936e', marginTop: 8 }}>leafAnimation=false</div>
                </div>
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Tabs } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 非受控模式 */}
            <Tabs
                items={[
                    { key: 'tab1', label: '标签一', children: <p>内容一</p> },
                    { key: 'tab2', label: '标签二', children: <p>内容二</p> },
                ]}
                defaultActiveKey="tab1"
            />
            {/* 受控模式 */}
            <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />
        </div>
    );
};

export default App;`}
            />
            <ApiTable rows={TABS_API} />
        </div>
    );
};

export default TabsDemo;
