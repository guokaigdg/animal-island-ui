import React from 'react';
import { Scrollbar } from '../../../src';
import { ApiTable, ApiRow, CodeBlock, demoBoxStyle, sectionStyle, sectionTitleStyle, textStyle } from '../../tools';

const SCROLLBAR_API: ApiRow[] = [
    { prop: 'height', desc: '容器高度，数字按 px 处理', type: 'number | string', defaultVal: '-' },
    { prop: 'maxHeight', desc: '容器最大高度', type: 'number | string', defaultVal: '-' },
    { prop: 'width', desc: '容器宽度，数字按 px 处理', type: 'number | string', defaultVal: '-' },
    { prop: 'maxWidth', desc: '容器最大宽度', type: 'number | string', defaultVal: '-' },
    {
        prop: 'direction',
        desc: '滚动方向，另一条轴会被裁掉',
        type: `'vertical' | 'horizontal' | 'both'`,
        defaultVal: "'vertical'",
    },
    { prop: 'thumbColor', desc: '滑块颜色，传 CSS 变量可跟随主题', type: 'string', defaultVal: '-' },
    {
        prop: 'thumbSize',
        desc: '滑块粗细（px），默认 8 —— 比系统经典滚动条更细；0 隐藏滚动条',
        type: 'number',
        defaultVal: '8',
    },
    { prop: 'showTrack', desc: '是否显示轨道底色', type: 'boolean', defaultVal: 'false' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const ISLAND_ITEMS = [
    '拾贝 —— 退潮后留在沙滩上的小小纪念',
    '采果 —— 岛上的野生柑橘，酸甜刚刚好',
    '野餐 —— 灯塔下面那块被太阳晒暖的草地',
    '篝火晚会 —— 潮水退去后，木柴噼啪作响',
    '珊瑚岛 —— 退潮才能看见的那一小片浅礁',
    '水母 —— 透明的身体在夜里发出微弱的蓝',
    '章鱼 —— 藏在礁石缝里，八只手都不肯出来',
    '贝壳风铃 —— 风一吹，整间屋子都在响',
    '涨潮 —— 海水慢慢漫过昨天的脚印',
    '帆船 —— 停在海湾里，等一个顺风的下午',
    '灯塔 —— 每隔十二秒眨一次眼',
    '椰林 —— 风穿过叶子的声音',
];

const frameStyle: React.CSSProperties = {
    ...demoBoxStyle,
    marginTop: 0,
};

const rowStyle: React.CSSProperties = {
    padding: '9px 0',
    borderBottom: '1px dashed #e0d8c8',
    color: '#794f27',
    fontWeight: 500,
};

const hintStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#a0936e',
    marginTop: 8,
};

const columnStyle: React.CSSProperties = {
    flex: '1 1 260px',
    minWidth: 0,
};

const columnTitleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#8a7b66',
    marginBottom: 8,
};

export default function ScrollbarDemo() {
    return (
        <div>
            <section style={sectionStyle}>
                <div style={sectionTitleStyle}>基础用法</div>
                <div style={textStyle}>
                    滚动条是<strong>原生滚动条换了一层外观</strong> —— 惯性、键盘、触摸手势全部照旧，只替换轨道与滑块。
                    鼠标移入容器或滚动一下，滑块就会露出来；滚到边界后滚动也不会链式传给外层页面，滚轮被锁定在本容器内。
                </div>
                <Scrollbar height={220} style={frameStyle}>
                    {ISLAND_ITEMS.map((item) => (
                        <div key={item} style={rowStyle}>
                            {item}
                        </div>
                    ))}
                </Scrollbar>
                <div style={hintStyle}>↑ 可滚动 · 聚焦后用方向键滚动</div>
            </section>
            <CodeBlock
                code={`<Scrollbar height={220}>
    {items.map((item) => (
        <div key={item}>{item}</div>
    ))}
</Scrollbar>`}
            />

            <section style={sectionStyle}>
                <div style={sectionTitleStyle}>和原生滚动条对比</div>
                <div style={textStyle}>
                    左边是浏览器自带的滚动条，右边是组件包起来的同一个原生滚动区 —— 滚动行为完全一样，
                    区别在滚动条本身：左边是系统的灰白细杆，右边是岛国风的沙色圆角胶囊。
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={columnStyle}>
                        <div style={columnTitleStyle}>原生 overflow: auto</div>
                        <div
                            style={{
                                ...frameStyle,
                                height: 200,
                                overflow: 'auto',
                                // 不加这句，macOS 上原生滚动条是随滚动淡出的 overlay，静止时根本看不见
                                scrollbarWidth: 'thin',
                            }}
                        >
                            {ISLAND_ITEMS.map((item) => (
                                <div key={item} style={rowStyle}>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div style={hintStyle}>↑ 浏览器默认的灰白细杆</div>
                    </div>
                    <div style={columnStyle}>
                        <div style={columnTitleStyle}>Scrollbar 包裹</div>
                        <Scrollbar height={200} style={frameStyle}>
                            {ISLAND_ITEMS.map((item) => (
                                <div key={item} style={rowStyle}>
                                    {item}
                                </div>
                            ))}
                        </Scrollbar>
                        <div style={hintStyle}>↑ 岛国风的沙色胶囊</div>
                    </div>
                </div>
            </section>
            <CodeBlock
                code={`// 左边：原生
<div style={{ height: 200, overflow: 'auto' }}>…</div>

// 右边：组件
<Scrollbar height={200}>…</Scrollbar>`}
            />

            <section style={sectionStyle}>
                <div style={sectionTitleStyle}>滚动方向</div>
                <div style={textStyle}>
                    <code>direction</code> 决定哪条轴可以滚动，另一条轴会被彻底裁掉，而不是留着第二条滚动条。
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={columnStyle}>
                        <div style={columnTitleStyle}>vertical（默认）</div>
                        <Scrollbar height={150} style={frameStyle}>
                            {ISLAND_ITEMS.map((item) => (
                                <div key={item} style={rowStyle}>
                                    {item}
                                </div>
                            ))}
                        </Scrollbar>
                    </div>
                    <div style={columnStyle}>
                        <div style={columnTitleStyle}>horizontal</div>
                        <Scrollbar direction="horizontal" style={{ ...frameStyle, whiteSpace: 'nowrap' }}>
                            {ISLAND_ITEMS.map((item) => (
                                <span key={item} style={{ marginRight: 18 }}>
                                    {item}
                                </span>
                            ))}
                        </Scrollbar>
                    </div>
                </div>
            </section>
            <CodeBlock code={`<Scrollbar direction="horizontal">…</Scrollbar>`} />

            <section style={sectionStyle}>
                <div style={sectionTitleStyle}>轨道与滑块</div>
                <div style={textStyle}>
                    默认轨道是透明的，只留一根沙色滑块；滑块与轨道同宽，不使用透明边框，两端是对称的正半圆。
                    <code>showTrack</code> 给出轨道底色，
                    <code>thumbColor</code> 与 <code>thumbSize</code> 则改滑块本身 —— 传 CSS 变量就能跟随主题换肤。
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={columnStyle}>
                        <div style={columnTitleStyle}>showTrack</div>
                        <Scrollbar height={150} showTrack style={frameStyle}>
                            {ISLAND_ITEMS.map((item) => (
                                <div key={item} style={rowStyle}>
                                    {item}
                                </div>
                            ))}
                        </Scrollbar>
                    </div>
                    <div style={columnStyle}>
                        <div style={columnTitleStyle}>自定义滑块</div>
                        <Scrollbar
                            height={150}
                            thumbColor="var(--animal-primary-color, #19c8b9)"
                            thumbSize={8}
                            style={frameStyle}
                        >
                            {ISLAND_ITEMS.map((item) => (
                                <div key={item} style={rowStyle}>
                                    {item}
                                </div>
                            ))}
                        </Scrollbar>
                    </div>
                </div>
            </section>
            <CodeBlock
                code={`<Scrollbar height={150} showTrack>…</Scrollbar>
<Scrollbar height={150} thumbColor="var(--animal-primary-color)" thumbSize={8}>…</Scrollbar>`}
            />

            <ApiTable rows={SCROLLBAR_API} />
        </div>
    );
}
