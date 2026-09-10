import React from 'react';
import { Icon, ICON_LIST, CoffeeIcon, ChatIcon, PlayIcon, CherryIcon, ImageIcon } from '../../../src';
import { ApiTable, ApiRow, sectionStyle, sectionTitleStyle, DemoTag, CodeBlock, labelStyle } from '../../tools';
import { islandGradient as customImage } from '../../gradients';

const ICON_API: ApiRow[] = [
    {
        prop: 'name',
        desc: '内置可爱图标名（共 101 个，如 Flower / Heart），与 icon / src 三选一',
        type: 'IconName',
        defaultVal: '-',
    },
    {
        prop: 'icon',
        desc: '任意内置图标组件（import { HeartIcon } from "..."）。与 name / src 三选一，优先级高于 name',
        type: 'IconComponent',
        defaultVal: '-',
    },
    {
        prop: 'src',
        desc: '自定义图片资源 URL（与 name / icon 三选一），用于彩色位图素材',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'size',
        desc: '图标尺寸',
        type: 'number | string',
        defaultVal: '24',
    },
    {
        prop: 'color',
        desc: '描边颜色（svg 模式）',
        type: 'string',
        defaultVal: 'currentColor',
    },
    {
        prop: 'strokeWidth',
        desc: '描边粗细（svg 模式）',
        type: 'number | string',
        defaultVal: '3.5',
    },
    {
        prop: 'bounce',
        desc: '弹跳动画',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'className',
        desc: '自定义类名',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'style',
        desc: '自定义样式',
        type: 'CSSProperties',
        defaultVal: '-',
    },
];

const ZH_NAMES: Record<string, string> = {
    Airplane: '飞机',
    Anchor: '锚',
    Apple: '苹果',
    Balloon: '气球',
    Bear: '小熊',
    Bee: '蜜蜂',
    Bell: '铃铛',
    Bicycle: '自行车',
    Bird: '小鸟',
    Book: '书本',
    Bookmark: '书签',
    Bulb: '灯泡',
    Butterfly: '蝴蝶',
    Cactus: '仙人掌',
    Cake: '蛋糕',
    Calendar: '日历',
    Camera: '相机',
    Candle: '蜡烛',
    Car: '汽车',
    Cart: '购物车',
    Cat: '小猫',
    Chat: '对话',
    Check: '勾选',
    Cherry: '樱桃',
    Clock: '时钟',
    Close: '关闭',
    Cloud: '云朵',
    Code: '代码',
    Coffee: '咖啡',
    Compass: '指南针',
    CreditCard: '信用卡',
    Dog: '小狗',
    Donut: '甜甜圈',
    Download: '下载',
    Edit: '编辑',
    Eye: '眼睛',
    File: '文件',
    Fish: '小鱼',
    Flag: '旗帜',
    Flame: '火焰',
    Flower: '花朵',
    Folder: '文件夹',
    Fox: '狐狸',
    Frog: '青蛙',
    Gift: '礼物',
    Globe: '地球',
    Headphones: '耳机',
    Heart: '爱心',
    Home: '小屋',
    Icecream: '冰淇淋',
    Image: '图片',
    Key: '钥匙',
    Ladybug: '瓢虫',
    Lamp: '台灯',
    Leaf: '叶子',
    Lemon: '柠檬',
    Location: '位置',
    Lock: '锁',
    Magnet: '磁铁',
    Mail: '邮件',
    Map: '地图',
    Mic: '麦克风',
    Moon: '月亮',
    Mushroom: '蘑菇',
    Music: '音乐',
    Owl: '猫头鹰',
    Paintbrush: '画笔',
    Pencil: '铅笔',
    Penguin: '企鹅',
    Phone: '电话',
    Play: '播放',
    Plus: '加号',
    Rabbit: '兔子',
    Rainbow: '彩虹',
    Refresh: '刷新',
    Rocket: '火箭',
    Sailboat: '帆船',
    Save: '保存',
    Search: '搜索',
    Settings: '设置',
    Share: '分享',
    ShoppingBag: '购物袋',
    Smile: '微笑',
    Snail: '蜗牛',
    Snowflake: '雪花',
    Star: '星星',
    Strawberry: '草莓',
    Sun: '太阳',
    Tag: '标签',
    Thermometer: '温度计',
    ThumbsUp: '点赞',
    Train: '火车',
    Trash: '垃圾桶',
    Tree: '大树',
    Trophy: '奖杯',
    Umbrella: '雨伞',
    Upload: '上传',
    User: '用户',
    Video: '视频',
    Watermelon: '西瓜',
    Wifi: '无线',
};

const IconDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Icon <DemoTag>built-in icons</DemoTag>
        </div>
        <div style={labelStyle}>基础用法（name 内置可爱图标）</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icon name="Flower" size={32} />
            <Icon name="Mic" size={32} />
            <Icon name="Star" size={32} />
            <Icon name="Sun" size={32} />
            <Icon name="Umbrella" size={32} />
            <Icon name="Wifi" size={32} />
            <Icon name="Map" size={32} />
            <Icon name="Camera" size={32} />
        </div>
        <div style={labelStyle}>icon 模式：库根导出的任意内置图标组件</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icon icon={CoffeeIcon} size={32} />
            <Icon icon={PlayIcon} size={32} />
            <Icon icon={CherryIcon} size={32} />
            <Icon icon={ImageIcon} size={32} />
            <Icon icon={ChatIcon} size={32} strokeWidth={3} />
        </div>
        <div style={labelStyle}>size 尺寸</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="Heart" size={16} />
            <Icon name="Heart" size={24} />
            <Icon name="Heart" size={32} />
            <Icon name="Heart" size={48} />
        </div>
        <div style={labelStyle}>bounce 弹跳动画（鼠标悬停查看效果）</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icon name="Location" size={32} bounce />
            <Icon name="Rabbit" size={32} bounce />
            <Icon name="Wifi" size={32} bounce />
        </div>
        <div style={labelStyle}>图标列表（全部 101 个）</div>
        <div
            style={{
                border: '1px solid #e8e2d6',
                borderRadius: 12,
                overflow: 'hidden',
                padding: '18px 16px',
                marginBottom: 20,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 14,
            }}
        >
            {ICON_LIST.map(({ name }) => (
                <div
                    key={name}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        padding: '14px 6px',
                        borderRadius: 10,
                        background: '#fff',
                        border: '1px solid transparent',
                        transition: 'transform 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.border = '1px solid #e8dec7';
                        e.currentTarget.style.background = '#faf7f0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.border = '1px solid transparent';
                        e.currentTarget.style.background = '#fff';
                    }}
                >
                    <Icon name={name} size={45} />
                    <span
                        style={{
                            fontSize: 11,
                            color: '#a0936e',
                            fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                        }}
                    >
                        {name}
                    </span>
                    <span style={{ fontSize: 13, color: '#725d42', fontWeight: 600 }}>{ZH_NAMES[name] ?? name}</span>
                </div>
            ))}
        </div>
        <div style={sectionTitleStyle}>
            Custom images <DemoTag>src mode</DemoTag>
        </div>
        <div style={labelStyle}>
            自定义图片通过 <code>src</code> 传入：消费者自行 <code>import</code> 任意图片资源，按需进 bundle。
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Icon src={customImage} size={48} bounce />
            <Icon src={customImage} size={64} />
        </div>
        <CodeBlock
            code={`import { Icon, HeartIcon } from 'animal-island-ui';
import myIcon from './my-icon.svg';

export default function App() {
    return (
        <>
            {/* 内置可爱图标（name 方式） */}
            <Icon name="Heart" size={32} />
            {/* 内置图标组件（icon 方式） */}
            <Icon icon={HeartIcon} size={32} color="#e05260" strokeWidth={3} />
            {/* 自定义图片 */}
            <Icon src={myIcon} size={48} />
        </>
    );
}`}
        />
        <ApiTable rows={ICON_API} />
    </div>
);

export default IconDemo;
