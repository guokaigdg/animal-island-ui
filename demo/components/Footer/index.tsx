import React from 'react';
import { Footer as FooterComponent } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const FooterDemo: React.FC = () => {
    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Footer <DemoTag>底部装饰</DemoTag>
            </div>
            <div style={labelStyle}>
                Footer 组件 — 由全部 101 个内置 Icon 组成的连续图标链，紧贴相连、按容器宽度循环铺满，图标大小同 Icon
                默认 24px。
            </div>

            <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
                <FooterComponent />
            </div>

            <div style={labelStyle}>自定义图标大小</div>
            <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
                <FooterComponent size={36} />
            </div>

            <div style={labelStyle}>单一图标相连</div>
            <div style={{ ...demoBodyStyle, padding: '40px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    <FooterComponent name="Heart" />
                    <FooterComponent name="Flower" />
                    <FooterComponent name="Star" />
                    <FooterComponent name="Moon" />
                    <FooterComponent name="Sun" />
                    <FooterComponent name="Cloud" />
                    <FooterComponent name="Rainbow" />
                    <FooterComponent name="Butterfly" />
                    <FooterComponent name="Fish" />
                    <FooterComponent name="Sailboat" />
                    <FooterComponent name="Umbrella" />
                </div>
            </div>

            <CodeBlock
                code={`import React from 'react';
import { Footer } from 'animal-island-ui';

const App = () => (
    <div>
        <Footer />                    {/* 默认 size=24，101 个图标循环铺满 */}
        <Footer size={36} />          {/* 自定义图标大小 */}
        <Footer name="Heart" />       {/* 单一图标相连 */}
        <Footer name="Flower" />      {/* 单一图标相连 */}
        <Footer name="Star" />        {/* 单一图标相连 */}
        <Footer name="Moon" />        {/* 单一图标相连 */}
        <Footer name="Sun" />         {/* 单一图标相连 */}
        <Footer name="Cloud" />       {/* 单一图标相连 */}
        <Footer name="Rainbow" />     {/* 单一图标相连 */}
        <Footer name="Butterfly" />   {/* 单一图标相连 */}
        <Footer name="Fish" />        {/* 单一图标相连 */}
        <Footer name="Sailboat" />    {/* 单一图标相连 */}
        <Footer name="Umbrella" />    {/* 单一图标相连 */}
    </div>
);`}
            />
            <ApiTable rows={FOOTER_API} />
        </div>
    );
};

const FOOTER_API: ApiRow[] = [
    { prop: 'size', desc: '图标大小（px），同 Icon 默认 24', type: 'number', defaultVal: '24' },
    {
        prop: 'name',
        desc: '指定单一图标名（共 101 个）；传入时整条链仅用该图标相连铺满',
        type: 'IconName',
        defaultVal: '-',
    },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default FooterDemo;
