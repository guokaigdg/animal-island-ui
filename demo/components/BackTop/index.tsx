import React, { useEffect, useCallback } from 'react';
import { BackTop, Card } from '../../../src';
import type { CardPattern } from '../../../src/components/Card';
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

const BACKTOP_API: ApiRow[] = [
    { prop: 'visibilityHeight', desc: '滚动多少 px 后显示', type: 'number', defaultVal: '400' },
    {
        prop: 'target',
        desc: '滚动容器函数，默认 window',
        type: '() => HTMLElement | Window',
        defaultVal: '() => window',
    },
    { prop: 'duration', desc: '滚动动画时长(ms)', type: 'number', defaultVal: '300' },
    { prop: 'onClick', desc: '点击回调', type: '(e) => void', defaultVal: '-' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

// 50 位动物岛民数据
const PATTERNS: CardPattern[] = [
    'default',
    'app-pink',
    'purple',
    'app-blue',
    'app-yellow',
    'app-orange',
    'app-teal',
    'app-green',
    'app-red',
    'lime-green',
    'yellow-green',
    'brown',
    'warm-peach-pink',
];

const RESIDENTS = [
    { name: '小润', romanized: 'Xiaorun', species: '松鼠', hobby: '园艺', desc: '热爱园艺的小松鼠，每天在广场上唱歌' },
    { name: '阿诚', romanized: 'Acheng', species: '猫', hobby: '钓鱼', desc: '喜欢钓鱼的蓝色猫，经常在河边发呆' },
    { name: '莉莉安', romanized: 'Lilian', species: '兔子', hobby: '烹饪', desc: '性格开朗的小兔子，总是带着胡萝卜' },
    { name: '熊大叔', romanized: 'Xiongda', species: '熊', hobby: '阅读', desc: '爱读书的棕熊，知识渊博但有点害羞' },
    { name: '茉莉', romanized: 'Moli', species: '猫', hobby: '捉虫', desc: '最喜欢的活动是捉虫和收集贝壳' },
    { name: '茶茶', romanized: 'Chacha', species: '鸭子', hobby: '唱歌', desc: '嗓音甜美的小鸭子，岛上的明星歌手' },
    { name: '铁蛋', romanized: 'Tiedan', species: '鸡', hobby: '健身', desc: '热爱运动的公鸡，每天早晨第一个起床' },
    { name: '雪花', romanized: 'Xuehua', species: '企鹅', hobby: '滑雪', desc: '从南极来的小企鹅，喜欢在雪地里打滚' },
    { name: '小八', romanized: 'Xiaoba', species: '章鱼', hobby: '绘画', desc: '多才多艺的小章鱼，触手就是画笔' },
    { name: '胖胖', romanized: 'Pangpang', species: '猪', hobby: '美食', desc: '岛上的美食家，知道每一种水果的味道' },
    { name: '鹿鹿', romanized: 'Lulu', species: '鹿', hobby: '花卉', desc: '优雅的小鹿，头上总是别着一朵花' },
    { name: '米米', romanized: 'Mimi', species: '老鼠', hobby: '收集', desc: '喜欢收集各种坚果的小老鼠' },
    { name: '弗雷德', romanized: 'Frede', species: '狼', hobby: '天文', desc: '夜晚观测星空的狼，知道每颗星星的名字' },
    { name: '贝蒂', romanized: 'Beidi', species: '绵羊', hobby: '编织', desc: '心灵手巧的小绵羊，用羊毛织围巾' },
    { name: '大壮', romanized: 'Dazhuang', species: '牛', hobby: '农耕', desc: '勤劳的奶牛，经营岛上最大的菜园' },
    { name: '跳跳', romanized: 'Tiaotiao', species: '青蛙', hobby: '跳跃', desc: '蹦蹦跳跳的小青蛙，雨后最爱唱歌' },
    { name: '妮妮', romanized: 'Nini', species: '仓鼠', hobby: '园艺', desc: '在花丛中安家的小仓鼠，笑容超治愈' },
    { name: '船长', romanized: 'Chuanzhang', species: '狗', hobby: '航海', desc: '梦想成为航海家的狗狗，每天都在看海' },
    { name: '小霞', romanized: 'Xiaoxia', species: '火烈鸟', hobby: '跳舞', desc: '舞姿优美的火烈鸟，岛上舞蹈老师' },
    { name: '墨墨', romanized: 'Momo', species: '乌贼', hobby: '书法', desc: '爱好书法的乌贼，墨水从不缺' },
    { name: '糖糖', romanized: 'Tangtang', species: '猫熊', hobby: '甜品', desc: '爱做甜品的小熊猫，竹叶蛋糕是招牌' },
    { name: '小武', romanized: 'Xiaowu', species: '猴子', hobby: '探险', desc: '身手敏捷的小猴子，岛上探险队长' },
    { name: '艾琳', romanized: 'Ailin', species: '考拉', hobby: '睡觉', desc: '总是在树上打盹的考拉，懒洋洋的很可爱' },
    { name: '尖尖', romanized: 'Jianjian', species: '刺猬', hobby: '缝纫', desc: '背着小针线的刺猬，缝补一切破洞' },
    { name: '泡泡', romanized: 'Paopao', species: '河马', hobby: '游泳', desc: '爱吹泡泡的河马，泳池里的开心果' },
    { name: '弯弯', romanized: 'Wanwan', species: '鸵鸟', hobby: '跑步', desc: '跑得飞快的鸵鸟，岛上快递员' },
    { name: '胡胡', romanized: 'Huhu', species: '狐狸', hobby: '魔术', desc: '会变魔术的小狐狸，口袋里总有惊喜' },
    { name: '雪莉', romanized: 'Xueli', species: '北极熊', hobby: '冰雕', desc: '擅长冰雕的北极熊，作品栩栩如生' },
    { name: '雷雷', romanized: 'Leilei', species: '大象', hobby: '音乐', desc: '用长鼻子吹口琴的大象，岛上的音乐家' },
    {
        name: '小花',
        romanized: 'Xiaohua',
        species: '长颈鹿',
        hobby: '摄影',
        desc: '个子最高的长颈鹿，拍日出最美的角度',
    },
    { name: '冲儿', romanized: 'Chonger', species: '鲨鱼', hobby: '冲浪', desc: '爱冲浪的鲨鱼，浪花上的舞者' },
    { name: '妮可', romanized: 'Nike', species: '猫', hobby: '时尚', desc: '爱打扮的猫咪，每天换不同的蝴蝶结' },
    { name: '帕克', romanized: 'Pake', species: '企鹅', hobby: '钓鱼', desc: '很会钓鱼的企鹅，冰钓冠军' },
    { name: '春春', romanized: 'Chunchun', species: '鸟', hobby: '园艺', desc: '把鸟巢装饰成花园的小鸟，很有品味' },
    { name: '憨憨', romanized: 'Hanhan', species: '熊', hobby: '蜂蜜', desc: '最喜欢蜂蜜的憨熊，笑容让人安心' },
    { name: '悠悠', romanized: 'Youyou', species: '水獭', hobby: '游泳', desc: '在水面画圈圈的水獭，优雅又悠闲' },
    { name: '小桔', romanized: 'Xiaoju', species: '猫', hobby: '烘焙', desc: '橙黄色的橘子猫，做的曲奇超好吃' },
    { name: '蹦蹦', romanized: 'Bengbeng', species: '袋鼠', hobby: '拳击', desc: '跳得最高的袋鼠，拳击高手' },
    { name: '梦梦', romanized: 'Mengmeng', species: '羊驼', hobby: '绘画', desc: '毛茸茸的羊驼，画风软萌可爱' },
    { name: '达达', romanized: 'Dada', species: '马', hobby: '赛跑', desc: '跑起来像风的马，岛上运动健将' },
    { name: '贝拉', romanized: 'Beila', species: '蝴蝶', hobby: '采蜜', desc: '翅膀像彩虹的蝴蝶，岛上最受欢迎的访客' },
    { name: '鼓鼓', romanized: 'Gugu', species: '河豚', hobby: '气球', desc: '生气就鼓成球的河豚，可爱又好笑' },
    { name: '云云', romanized: 'Yunyun', species: '羊', hobby: '观云', desc: '喜欢躺在山坡上看云的绵羊' },
    { name: '叮叮', romanized: 'Dingding', species: '蜜蜂', hobby: '酿造', desc: '勤劳的小蜜蜂，酿的蜂蜜甜到心里' },
    { name: '洛奇', romanized: 'Luoqi', species: '狮子', hobby: '雕塑', desc: '用爪子雕塑的狮子，作品充满力量' },
    { name: '点点', romanized: 'Diandian', species: '瓢虫', hobby: '旅行', desc: '背着斑点壳旅行的瓢虫，见过很多岛' },
    { name: '圆圆', romanized: 'Yuanyuan', species: '海豹', hobby: '顶球', desc: '圆滚滚的小海豹，顶球是拿手好戏' },
    { name: '叶子', romanized: 'Yezi', species: '树懒', hobby: '瑜伽', desc: '做瑜伽都慢吞吞的树懒，治愈人心' },
    { name: '派派', romanized: 'Paipai', species: '土拨鼠', hobby: '挖洞', desc: '喜欢挖地道的小土拨鼠，地下迷宫大师' },
    { name: '晴天', romanized: 'Qingtian', species: '天竺鼠', hobby: '种花', desc: '头顶一朵向日葵的天竺鼠，微笑天使' },
];

const BackTopDemo: React.FC = () => {
    const getTarget = useCallback(() => {
        return document.querySelector('main') || window;
    }, []);

    useEffect(() => {
        // 延迟到 DOM 渲染完成后自动滚动到底部
        const timer = setTimeout(() => {
            const el = document.querySelector('main');
            if (el) {
                el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                BackTop <DemoTag>返回顶部</DemoTag> <DemoTag>徽章图形</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                <div style={{ fontSize: 14, color: '#9f927d', marginBottom: 16, lineHeight: 1.6 }}>
                    页面已自动滚动到底部，点击右下角的徽章图标返回顶部。
                    <br />
                    <code style={{ background: '#f0e8d8', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>
                        visibilityHeight=400
                    </code>{' '}
                    意味着滚动超过 400px 后图标出现。
                </div>

                {/* ---- 动物岛民列表 ---- */}
                <div style={labelStyle}>动物岛民列表 — 共 50 位</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {RESIDENTS.map((resident, i) => (
                        <Card
                            key={resident.name}
                            pattern={PATTERNS[i % PATTERNS.length]}
                            style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: 14 }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.45)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: '#725d42',
                                    flexShrink: 0,
                                    backdropFilter: 'blur(2px)',
                                }}
                            >
                                {resident.romanized.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    {resident.name}
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 400,
                                            opacity: 0.65,
                                            background: 'rgba(255,255,255,0.35)',
                                            padding: '1px 8px',
                                            borderRadius: 8,
                                        }}
                                    >
                                        {resident.species} · {resident.hobby}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        opacity: 0.75,
                                        marginTop: 2,
                                        color: 'inherit',
                                    }}
                                >
                                    {resident.desc}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <BackTop target={getTarget} visibilityHeight={400} />

            <CodeBlock
                code={`import { BackTop } from 'animal-island-ui';

// 基础用法 — 右下角 Island 袋返回顶部
<BackTop visibilityHeight={400} />

// 自定义动画时长
<BackTop duration={800} />

// 容器内滚动
<BackTop target={() => ref.current!} visibilityHeight={200} />`}
            />
            <ApiTable rows={BACKTOP_API} />
        </div>
    );
};

export default BackTopDemo;
