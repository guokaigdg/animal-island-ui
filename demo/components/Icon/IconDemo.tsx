import React from 'react';
import * as Icons from 'naive-icons';
import { CodeBlock, sectionStyle, sectionTitleStyle, DemoTag, labelStyle, ApiTable } from '../../tools';

/** naive-icons 图标组件类型（1.1.0 起不再导出 IconComponent，这里复刻其 IconProps 形状） */
type IconComponent = React.ForwardRefExoticComponent<
    Omit<
        React.SVGProps<SVGSVGElement> & {
            size?: number | string;
            color?: string;
            strokeWidth?: number | string;
            fill?: string;
            title?: string;
        },
        'ref'
    > &
        React.RefAttributes<SVGSVGElement>
>;

/** naive-icons 所有图标组件，按导出顺序排列 */
const ALL_ICONS: IconComponent[] = (Object.entries(Icons) as Array<[string, unknown]>)
    .filter(([, value]) => typeof value === 'function' || (value !== null && typeof value === 'object'))
    .map(([, value]) => value as IconComponent);

const ZH_NAMES: Record<string, string> = {
    Airplane: '飞机',
    Anchor: '锚',
    Apple: '苹果',
    ArrowDown: '向下',
    ArrowLeft: '左箭头',
    ArrowRight: '右箭头',
    ArrowUp: '向上',
    Balloon: '气球',
    Bear: '小熊',
    Bee: '蜜蜂',
    Bell: '铃铛',
    Basketball: '篮球',
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
    ChevronDown: '下箭头',
    ChevronLeft: '左箭头',
    ChevronRight: '右箭头',
    ChevronUp: '上箭头',
    Clock: '时钟',
    Close: '关闭',
    Cloud: '云朵',
    Code: '代码',
    Coffee: '咖啡',
    Compass: '指南针',
    Copy: '复制',
    CreditCard: '信用卡',
    Dog: '小狗',
    Donut: '甜甜圈',
    Dumbbell: '哑铃',
    Download: '下载',
    Edit: '编辑',
    Ellipsis: '省略号',
    ExternalLink: '外链',
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
    Link: '链接',
    Location: '位置',
    Lock: '锁',
    Magnet: '磁铁',
    Mail: '邮件',
    Map: '地图',
    Menu: '菜单',
    Mic: '麦克风',
    Minus: '减号',
    Moon: '月亮',
    Mushroom: '蘑菇',
    Music: '音乐',
    Owl: '猫头鹰',
    Paintbrush: '画笔',
    Pencil: '铅笔',
    Penguin: '企鹅',
    Phone: '电话',
    Play: '播放',
    Pause: '暂停',
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
    Unlink: '断开链接',
    Upload: '上传',
    User: '用户',
    Video: '视频',
    WaterCup: '水杯',
    Watermelon: '西瓜',
    Wifi: '无线',
};

const fetchIconName = (IconCmp: IconComponent): string =>
    IconCmp.displayName?.replace(/Icon$/, '') ?? (IconCmp.name as string)?.replace(/Icon$/, '') ?? 'Unknown';

const INSTALL_CODE = `npm install naive-icons
yarn add naive-icons
pnpm add naive-icons`;

const USAGE_CODE = `import React from 'react';
import { FlowerIcon, HeartIcon } from 'naive-icons';

export default function App() {
    return (
        <>
            <CoffeeIcon />
            <FlowerIcon size={32} color="#e05260" strokeWidth={3} />
            <HeartIcon size={32} />
        </>
    );
}`;

const IconDemo: React.FC = () => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
            Icon <DemoTag>naive-icons</DemoTag>
        </div>
        <div style={labelStyle}>
            图标为独立 npm 包{' '}
            <a
                href="https://github.com/guokaigdg/naive-icons"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#725d42' }}
            >
                naive-icons
            </a>
            —— 手绘 naive folk art 风格的 SVG 图标库，150+ 个原创图标，为 React 与 TypeScript 打造。请先安装依赖：
        </div>

        <div style={{ marginBottom: 12 }}>
            <CodeBlock code={INSTALL_CODE} label="安装" />
        </div>

        <div style={labelStyle}>
            文档与完整示例参考{' '}
            <a
                href="https://github.com/guokaigdg/naive-icons"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#725d42' }}
            >
                https://github.com/guokaigdg/naive-icons
            </a>
        </div>

        <div style={labelStyle}>基础用法</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            <Icons.FlowerIcon size={32} />
            <Icons.MicIcon size={32} />
            <Icons.StarIcon size={32} />
            <Icons.SunIcon size={32} />
            <Icons.UmbrellaIcon size={32} />
            <Icons.WifiIcon size={32} />
            <Icons.MapIcon size={32} />
            <Icons.CameraIcon size={32} />
        </div>

        <div style={labelStyle}>size 尺寸</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icons.HeartIcon size={16} />
            <Icons.HeartIcon size={24} />
            <Icons.HeartIcon size={32} />
            <Icons.HeartIcon size={48} />
        </div>

        <div style={labelStyle}>color / strokeWidth 自定义</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Icons.CoffeeIcon size={32} color="#e05260" strokeWidth={3} />
            <Icons.CherryIcon size={32} color="#2a9d8f" strokeWidth={3} />
            <Icons.BulbIcon size={32} color="#e9c46a" strokeWidth={3} />
        </div>

        <div style={labelStyle}>全部图标</div>
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
            {ALL_ICONS.map((IconCmp, i) => {
                const name = fetchIconName(IconCmp);
                return (
                    <div
                        key={i}
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
                        <IconCmp size={45} />
                        <span
                            style={{
                                fontSize: 11,
                                color: '#a0936e',
                                fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                            }}
                        >
                            {name}Icon
                        </span>
                        <span style={{ fontSize: 13, color: '#725d42', fontWeight: 600 }}>
                            {ZH_NAMES[name] ?? name}
                        </span>
                    </div>
                );
            })}
        </div>

        <div style={labelStyle}>使用示例</div>
        <CodeBlock code={USAGE_CODE} />

        <ApiTable
            rows={[
                { prop: 'size', desc: '图标尺寸，宽高相等', type: 'number | string', defaultVal: '24' },
                { prop: 'color', desc: '描边颜色', type: 'string', defaultVal: 'currentColor' },
                { prop: 'strokeWidth', desc: '描边粗细', type: 'number | string', defaultVal: '3.5' },
                { prop: 'fill', desc: '填充色', type: 'string', defaultVal: 'none' },
                {
                    prop: 'title',
                    desc: '无障碍标题',
                    type: 'string',
                    defaultVal: '-',
                },
            ]}
        />
    </div>
);

export default IconDemo;
