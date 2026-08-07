import React from 'react';
import { Image, type ImageColor } from '../../../src';
import { labelStyle, sectionStyle, sectionTitleStyle, DemoTag, ApiTable, ApiRow, CodeBlock } from '../../tools';
import xjbdao from '../../img/xjbdao.jpg';
import flower from '../../img/flower.jpg';

/** 治愈海岛风格随机图片池 */
const heroImages = [
    'https://placehold.co/640x400?text==island%20island%20landscape%20vibrant%20green%20grass%20blue%20sky%20cherry%20blossoms%20game%20style&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20museum%20interior%20warm%20lighting%20fossils%20art%20gallery&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20beach%20sunset%20palm%20trees%20coconut%20game%20cute&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20winter%20snow%20christmas%20lights%20cozy%20village&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20fishing%20river%20peaceful%20nature%20game&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20residents%20singing%20together%20happy%20game%20cute&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20campfire%20night%20starry%20sky%20cozy%20tent%20game%20style&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20flower%20garden%20tulips%20roses%20colorful%20hybrid%20flowers%20game&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20wooden%20bridge%20over%20river%20waterfall%20lush%20forest%20game&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20fruit%20orchard%20apple%20orange%20peach%20trees%20sunny%20game&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20lighthouse%20ocean%20cliff%20seagulls%20blue%20sky%20game%20cute&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20festival%20fireworks%20night%20sky%20lanterns%20celebration%20game&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20cafe%20interior%20cozy%20coffee%20wooden%20furniture%20warm%20game&image_size=landscape_16_9',
    'https://placehold.co/640x400?text==island%20hot%20air%20balloon%20sky%20adventure%20clouds%20colorful%20game&image_size=landscape_16_9',
];

/** Fisher-Yates 洗牌，返回打乱后的新数组 */
const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

/** 14 张图打乱后与 14 个颜色一一对应，不重复 */
const shuffledImages = shuffle(heroImages);

const IMAGE_COLORS: { color: ImageColor; label: string }[] = [
    { color: 'white', label: 'White 白色' },
    { color: 'default', label: 'Default 奶油色' },
    { color: 'app-pink', label: 'App Pink 应用粉' },
    { color: 'purple', label: 'Purple 紫色' },
    { color: 'app-blue', label: 'App Blue 应用蓝' },
    { color: 'app-yellow', label: 'App Yellow 应用黄' },
    { color: 'app-orange', label: 'App Orange 应用橙' },
    { color: 'app-teal', label: 'App Teal 应用青' },
    { color: 'app-green', label: 'App Green 应用绿' },
    { color: 'app-red', label: 'App Red 应用红' },
    { color: 'lime-green', label: 'Lime Green 青柠绿' },
    { color: 'yellow-green', label: 'Yellow-Green 黄绿色' },
    { color: 'brown', label: 'Brown 棕色' },
    { color: 'warm-peach-pink', label: 'Warm Peach Pink 暖桃粉' },
];

const IMAGE_API: ApiRow[] = [
    { prop: 'src', desc: '图片地址', type: 'string', defaultVal: '-', required: true },
    { prop: 'alt', desc: '图片替代文本（无障碍）；留空表示装饰性图片', type: 'string', defaultVal: "''" },
    { prop: 'width', desc: '图片宽度', type: 'number | string', defaultVal: '-' },
    { prop: 'height', desc: '图片高度', type: 'number | string', defaultVal: '-' },
    {
        prop: 'color',
        desc: '背景颜色（Card pattern 同款底色，无花纹；white 为纯白）',
        type: `'white' | 'default' | 'app-pink' | 'purple' | 'app-blue' | 'app-yellow' | 'app-orange' | 'app-teal' | 'app-green' | 'app-red' | 'lime-green' | 'yellow-green' | 'brown' | 'warm-peach-pink'`,
        defaultVal: "'white'",
    },
    { prop: 'lazy', desc: '是否启用懒加载', type: 'boolean', defaultVal: 'false' },
    {
        prop: 'preview',
        desc: '点击图片弹出大图预览（默认开启；支持 ESC / 点击遮罩 / 关闭按钮）',
        type: 'boolean',
        defaultVal: 'true',
    },
    { prop: 'onLoad', desc: '图片加载完成回调', type: '(e) => void', defaultVal: '-' },
    { prop: 'onError', desc: '图片加载失败回调', type: '(e) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

const ImageDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Image <DemoTag>10 props</DemoTag>
        </div>

        {/* 点击预览 */}
        <div style={labelStyle}>点击预览（preview 默认开启，点击图片弹出大图，ESC / 遮罩 / 关闭按钮均可关闭）</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Image src={xjbdao} alt="点击预览大图" width={330} height={200} preview />
        </div>

        {/* 基础用法 */}
        <div style={labelStyle}>基础用法（自定义宽高）</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Image src={xjbdao} alt="示例图片 1" width={330} height={200} />
            <Image src={flower} alt="示例图片 2" width={480} height={300} />
        </div>

        {/* 背景颜色 */}
        <div style={labelStyle}>背景颜色（color，Card pattern 同款底色，无花纹）</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {IMAGE_COLORS.map((c, i) => (
                <div key={c.color} style={{ textAlign: 'center' }}>
                    <Image src={shuffledImages[i]} alt={c.label} width={330} height={200} color={c.color} />
                    <div style={{ fontSize: 12, color: '#a0936e', marginTop: 6 }}>{c.label}</div>
                </div>
            ))}
        </div>

        {/* 懒加载 */}
        <div style={labelStyle}>懒加载（lazy，滚动到视口附近才加载）</div>
        <Image src={xjbdao} alt="懒加载图片" width={360} height={230} lazy />

        {/* 错误占位 */}
        <div style={labelStyle}>错误占位（加载失败时显示占位）</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Image src="./no-such-image.png" alt="加载失败" width={210} height={210} />
        </div>

        <CodeBlock
            code={`import React from 'react';
import { Image } from 'animal-island-ui';

const App = () => {
    return (
        <div>
            {/* 基础用法 */}
            <Image src="/photo.png" alt="岛屿风景" width={200} height={150} />

            {/* 懒加载 */}
            <Image src="/photo.png" alt="懒加载" width={240} height={150} lazy />

            {/* 点击预览：弹出大图 */}
            <Image src="/photo.png" alt="预览" width={200} height={130} preview />

            {/* 失败占位：加载失败显示内置占位 */}
            <Image src="/broken.png" alt="失败" width={140} height={140} />
        </div>
    );
};

export default App;`}
        />
        <ApiTable rows={IMAGE_API} />
    </div>
);

export default ImageDemo;
