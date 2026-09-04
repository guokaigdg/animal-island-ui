import React from 'react';
import { Carousel } from '../../../src';
import { ApiRow, ApiTable, CodeBlock, DemoTag, labelStyle, sectionStyle, sectionTitleStyle } from '../../tools';
import { islandPlaceholder, flowersPlaceholder, sceneryPlaceholder } from '../../placeholders';

const CAROUSEL_API: ApiRow[] = [
    { prop: 'children', desc: '每个直接子元素为一张', type: 'ReactNode', defaultVal: '-', required: true },
    { prop: 'activeIndex', desc: '当前索引（受控）', type: 'number', defaultVal: '-' },
    { prop: 'defaultActiveIndex', desc: '初始索引', type: 'number', defaultVal: '0' },
    { prop: 'onChange', desc: '切换回调', type: '(index: number) => void', defaultVal: '-' },
    { prop: 'autoplay', desc: '自动播放', type: 'boolean', defaultVal: 'false' },
    { prop: 'interval', desc: '自动播放间隔（ms）', type: 'number', defaultVal: '3000' },
    { prop: 'loop', desc: '首尾循环', type: 'boolean', defaultVal: 'true' },
    { prop: 'showArrows', desc: '显示箭头', type: 'boolean', defaultVal: 'true' },
    { prop: 'showDots', desc: '显示圆点', type: 'boolean', defaultVal: 'true' },
    { prop: 'pauseOnHover', desc: '悬停或聚焦时暂停', type: 'boolean', defaultVal: 'true' },
];

const slides = [
    { src: islandPlaceholder, title: '海岛晨光', desc: '晨雾散去，海面泛起层层波光。' },
    { src: flowersPlaceholder, title: '花园漫步', desc: '在盛开的花丛间享受午后时光。' },
    { src: sceneryPlaceholder, title: '远山如黛', desc: '远山与天空在暮色中相融。' },
];

const CarouselDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Carousel <DemoTag>轮播图</DemoTag> <DemoTag>键盘可用</DemoTag>
        </div>

        <div style={labelStyle}>自动播放（悬停或聚焦时暂停）</div>
        <Carousel autoplay interval={3500} aria-label="岛屿风景" style={{ maxWidth: 760 }}>
            {slides.map((slide) => (
                <div
                    key={slide.title}
                    style={{
                        minHeight: 360,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 28,
                        boxSizing: 'border-box',
                        color: '#fff9e3',
                        background: `url(${slide.src}) center / cover`,
                    }}
                >
                    <div style={{ padding: '14px 18px', background: 'rgba(43,33,24,.72)', borderRadius: 12 }}>
                        <div style={{ fontSize: 26, fontWeight: 900 }}>{slide.title}</div>
                        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600 }}>{slide.desc}</div>
                    </div>
                </div>
            ))}
        </Carousel>

        <CodeBlock
            code={`import { Carousel } from 'animal-island-ui';

<Carousel autoplay interval={3500} aria-label="岛屿照片">
    <img src="/beach.jpg" alt="海滩" />
    <img src="/plaza.jpg" alt="广场" />
    <img src="/museum.jpg" alt="博物馆" />
</Carousel>`}
        />
        <ApiTable rows={CAROUSEL_API} />
    </div>
);

export default CarouselDemo;
