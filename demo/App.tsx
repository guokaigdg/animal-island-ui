import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Cursor } from '../src';
import '../src/styles/index.less';
import backgroundStyles from '../src/components/Background/background.module.less';
import './fonts.css';
import HomePage from './HomePage';
import { PAGE_INFO } from './pageInfo';
import { useIsMobile } from './tools';
import logo from './assets/logo.png';

// Lazy-load ComponentPage so homepage does not pull in every demo on initial load
const ComponentPage = lazy(() => import('./ComponentPage'));

// ============================================
// Simple hash router
// ============================================
const useHash = () => {
    const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash.slice(1) || '/');
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    return { hash, navigate };
};

interface MenuItemChild {
    key: string;
    label: string;
    isNew?: boolean;
}

interface MenuItem {
    key: string;
    label: string;
    children?: MenuItemChild[];
}

// ============================================
// Menu config — 5 categories by function:
//   基础      → 无状态/纯展示 (Title, Button, Divider, Icon, Tag, Cursor, CodeBlock, Footer)
//   表单      → 数据录入/校验 (Input, Switch, Select, Checkbox, Radio, Form)
//   反馈      → 浮层/状态/异步反馈 (Notification, Modal, Drawer, Tooltip, Progress)
//   数据展示  → 容器/列表/排版 (Card, Collapse, Tabs, Table, Typewriter)
//   主题  → 业务复合/主题专属 (Countdown)
// ============================================
const MENU_ITEMS: MenuItem[] = [
    // 隐藏：暂不展示，恢复时取消注释
    {
        key: 'cat-guide',
        label: '── 指南 ──',
        children: [{ key: 'skill', label: 'Skill 介绍', isNew: true }],
    },
    {
        key: 'cat-basic',
        label: '── 基础 ──',
        children: [
            // 隐藏：暂不展示，恢复时取消注释
            { key: 'title', label: 'Title 标题', isNew: true },
            { key: 'button', label: 'Button 按钮' },
            { key: 'divider-comp', label: 'Divider 分割线' },
            { key: 'icon', label: 'Icon 图标', isNew: true },
            { key: 'tag', label: 'Tag 标签' },
            { key: 'cursor', label: 'Cursor 光标' },
            { key: 'codeblock', label: 'CodeBlock 代码高亮' },
            { key: 'background', label: 'Background 背景', isNew: true },
            { key: 'footer', label: 'Footer 页脚' },
        ],
    },
    {
        key: 'cat-form',
        label: '── 表单 ──',
        children: [
            { key: 'input', label: 'Input 输入框' },
            { key: 'switch', label: 'Switch 开关' },
            // 隐藏：暂不展示，恢复时取消注释
            { key: 'select', label: 'Select 选择器' },
            { key: 'date-picker', label: 'DatePicker 日期选择' },
            { key: 'time-picker', label: 'TimePicker 时间选择' },
            { key: 'checkbox', label: 'Checkbox 多选框' },
            { key: 'radio', label: 'Radio 单选框' },
            { key: 'form', label: 'Form 表单' },
        ],
    },
    {
        key: 'cat-feedback',
        label: '── 反馈 ──',
        children: [
            { key: 'notification', label: 'Notification 通知' },
            // 隐藏：暂不展示，恢复时取消注释
            { key: 'modal', label: 'Modal 弹窗' },
            { key: 'drawer', label: 'Drawer 抽屉' },
            { key: 'loading', label: 'Loading 加载' },
            { key: 'tooltip', label: 'Tooltip 气泡提示' },
            { key: 'progress', label: 'Progress 进度条' },
            { key: 'skeleton', label: 'Skeleton 骨架屏' },
            { key: 'backtop', label: 'BackTop 返回顶部' },
        ],
    },
    {
        key: 'cat-data-display',
        label: '── 数据展示 ──',
        children: [
            { key: 'card', label: 'Card 卡片' },
            // 隐藏：暂不展示，恢复时取消注释
            { key: 'collapse', label: 'Collapse 折叠面板' },
            { key: 'tabs', label: 'Tabs 标签页' },
            { key: 'table', label: 'Table 表格' },
            { key: 'pagination', label: 'Pagination 分页', isNew: true },
            { key: 'typewriter', label: 'Typewriter 打字机' },
            { key: 'image', label: 'Image 图片' },
            { key: 'carousel', label: 'Carousel 轮播图', isNew: true },
            { key: 'time', label: 'Time 时钟' },
            { key: 'countdown', label: 'Countdown 倒计时', isNew: true },
        ],
    },
];

// ============================================
// Shared styles
// ============================================
const S = {
    layout: {
        display: 'flex',
        height: '100dvh',
        overflow: 'hidden',
        fontFamily:
            "Nunito, 'Noto Sans SC', 'Zen Maru Gothic', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        // 波点壁纸（与首页 page 容器一致）：两层错位绿点 + 底色 #88c9a1
        background: `
            radial-gradient(circle, rgba(90, 160, 105, 0.4) 1.5px, transparent 1.5px) 0 0 / 28px 28px,
            radial-gradient(circle, rgba(110, 180, 125, 0.3) 1px, transparent 1px) 7px 7px / 14px 14px,
            #88c9a1
        `,
    } as React.CSSProperties,
    sidebar: {
        width: 220,
        minWidth: 220,
        // 拼色底部：雾蓝 #a2b0e7ff 色块，顶部为平滑正弦曲线（谷峰高 75px、谷底高 60px，较上版整体上移 20px），上部保持奶油色
        background:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='130' viewBox='0 0 220 130'%3E%3Cpath fill='%23a2b0e7ff' d='M0 70 Q55 40 110 70 T220 70 V130 H0 Z'/%3E%3C/svg%3E\") left bottom / 220px 130px no-repeat",
        backgroundColor: '#faf8f3',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: '12px 0 12px 12px',
        borderRadius: 16,
        border: '2px solid rgba(250, 250, 250, 1)',
        boxShadow: '0 4px 16px rgba(61, 52, 40, 0.10)',
        height: 'calc(100dvh - 20px)',
    } as React.CSSProperties,
    sidebarHeader: {
        padding: '20px 20px 12px',
        borderBottom: '1px solid #e8e2d6',
        fontWeight: 700,
        fontSize: 15,
        color: '#725d42',
        letterSpacing: -0.3,
        display: 'flex',
        alignItems: 'center',
    } as React.CSSProperties,
    menuList: {
        flex: 1,
        overflow: 'auto',
        // 底部留白避开拼色曲线区（谷峰高约 75px）
        padding: '8px 0 82px',
    } as React.CSSProperties,
    menuItem: (active: boolean) =>
        ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            margin: '1px 5px',
            height: 40,
            padding: '0 12px',
            fontFamily:
                "Nunito, 'Noto Sans SC', 'Zen Maru Gothic', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: 14,
            paddingLeft: 26,
            color: active ? '#fff' : '#8a7b66',
            background: active ? '#B7C6E5' : 'transparent',
            borderRadius: 12,
            borderRight: 'none',
            transition: 'all 0.15s',
        }) as React.CSSProperties,
    menuBadge: (active: boolean) =>
        ({
            flexShrink: 0,
            padding: '1px 7px',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 0.6,
            color: active ? '#fc736d' : '#fff',
            background: active ? '#fff' : 'linear-gradient(135deg, #fc736d, #f7825a)',
            borderRadius: 8,
            lineHeight: '14px',
            boxShadow: active ? '0 1px 0 rgba(114, 93, 66, 0.15)' : '0 1px 0 rgba(114, 93, 66, 0.25)',
            animation: 'menuBadgePulse 1.8s ease-in-out infinite',
        }) as React.CSSProperties,
    main: {
        flex: 1,
        overflow: 'auto',
        padding: '32px 40px',
    } as React.CSSProperties,
};

// ============================================
// Sidebar content (shared between desktop & mobile drawer)
// ============================================
const SidebarContent: React.FC<{
    activeKey: string;
    onNavigate: (path: string) => void;
}> = ({ activeKey, onNavigate }) => (
    <>
        <div style={S.sidebarHeader} onClick={() => onNavigate('/')}>
            <img
                src={logo}
                alt="Animal Island UI logo"
                style={{ width: 25, height: 25, borderRadius: 8, marginRight: 8 }}
            />
            Animal Island UI
        </div>
        <nav style={S.menuList}>
            {MENU_ITEMS.map((item) => {
                if (item.children) {
                    return (
                        <div key={item.key}>
                            <div
                                style={{
                                    padding: '12px 16px 4px',
                                    fontSize: 11,
                                    color: '#a0936e',
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                }}
                            >
                                {item.label}
                            </div>
                            {item.children.map((child) => (
                                <div
                                    key={child.key}
                                    className={child.key === 'cursor' ? 'demo-raindrop-hover' : undefined}
                                    style={S.menuItem(activeKey === child.key)}
                                    onClick={() => {
                                        onNavigate(`/${child.key}`);
                                        // 彩蛋：点击 Background 菜单项 → 整页壁纸切换为 sprinkles（彩色针糖）
                                        if (child.key === 'background') {
                                            window.dispatchEvent(
                                                new CustomEvent('demo-bg-easter-egg', { detail: 'sprinkles' })
                                            );
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeKey !== child.key) e.currentTarget.style.background = '#d6dff0';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeKey !== child.key) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span
                                        style={{
                                            color: activeKey === child.key ? '#fff' : '#8a7b66',
                                        }}
                                    >
                                        {child.label}
                                    </span>
                                    {child.isNew && <span style={S.menuBadge(activeKey === child.key)}>NEW</span>}
                                </div>
                            ))}
                        </div>
                    );
                }
                return (
                    <div
                        key={item.key}
                        style={S.menuItem(activeKey === item.key)}
                        onClick={() => onNavigate(`/${item.key}`)}
                        onMouseEnter={(e) => {
                            if (activeKey !== item.key) e.currentTarget.style.background = '#d6dff0';
                        }}
                        onMouseLeave={(e) => {
                            if (activeKey !== item.key) e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span style={{ color: activeKey === item.key ? '#fff' : '#8a7b66' }}>{item.label}</span>
                    </div>
                );
            })}
        </nav>
    </>
);

// ============================================
// App
// ============================================
const App: React.FC = () => {
    const { hash, navigate } = useHash();
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const mainRef = React.useRef<HTMLElement>(null);

    const activeKey = hash.startsWith('/') && hash.length > 1 ? hash.slice(1) : 'home';
    const isHomePage = activeKey === 'home';

    // 彩蛋：整页壁纸切换（Background 预览块 / 菜单项 hover、点击触发）
    // 覆盖层方案：默认壁纸常驻，彩蛋壁纸以 opacity 淡入淡出覆盖，避免背景硬切闪烁
    const [pageBg, setPageBg] = useState<string | null>(null);
    const [eggOn, setEggOn] = useState(false);
    const eggTimer = React.useRef<number | undefined>(undefined);

    const fadeOutEgg = useCallback(() => {
        setEggOn(false);
        window.clearTimeout(eggTimer.current);
        eggTimer.current = window.setTimeout(() => setPageBg(null), 480);
    }, []);

    useEffect(() => {
        const onEgg = (e: Event) => {
            const type = (e as CustomEvent<string>).detail;
            if (type === 'reset') {
                fadeOutEgg();
            } else {
                window.clearTimeout(eggTimer.current);
                setPageBg(type);
                setEggOn(true);
            }
        };
        window.addEventListener('demo-bg-easter-egg', onEgg);
        return () => {
            window.removeEventListener('demo-bg-easter-egg', onEgg);
            window.clearTimeout(eggTimer.current);
        };
    }, [fadeOutEgg]);

    // Close drawer when switching to desktop
    useEffect(() => {
        if (!isMobile) setDrawerOpen(false);
    }, [isMobile]);

    // Close drawer when route changes + scroll main to top
    useEffect(() => {
        setDrawerOpen(false);
        mainRef.current?.scrollTo({ top: 0 });
    }, [activeKey]);

    // 彩蛋壁纸：离开 Background 页时淡出还原（页内保留，供菜单点击 / 预览块 hover 彩蛋使用）
    useEffect(() => {
        if (activeKey !== 'background') fadeOutEgg();
    }, [activeKey, fadeOutEgg]);

    const handleNavigate = useCallback(
        (path: string) => {
            navigate(path);
            setDrawerOpen(false);
        },
        [navigate]
    );

    return (
        <Cursor>
            <style>{`
                @keyframes bgScroll {
                    0% { background-position: 100% 0%; }
                    100% { background-position: 0% 100%; }
                }
                @keyframes menuBadgePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                /* 体验彩蛋：hover 侧边栏 Cursor 菜单项 → 蓝色雨滴光标（与 type="raindrop" 一致） */
                .demo-raindrop-hover:hover,
                .demo-raindrop-hover:hover * {
                    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 6s-9 12-9 16a9 9 0 0 0 18 0c0-4-9-16-9-16z' fill='%2374ccff' stroke='%232e86ab' stroke-width='1.5'/%3E%3Cellipse cx='12.5' cy='19' rx='2' ry='3.2' fill='%23dff4ff' transform='rotate(-18 12.5 19)'/%3E%3C/svg%3E") 16 6, default !important;
                }
                /* 体验彩蛋：Cursor 演示页展示区 ambient 雨滴光标（预览框内部保留各自演示的光标） */
                div.demo-raindrop-zone,
                .demo-raindrop-zone *:not(.animal-cursor, .animal-cursor *) {
                    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 6s-9 12-9 16a9 9 0 0 0 18 0c0-4-9-16-9-16z' fill='%2374ccff' stroke='%232e86ab' stroke-width='1.5'/%3E%3Cellipse cx='12.5' cy='19' rx='2' ry='3.2' fill='%23dff4ff' transform='rotate(-18 12.5 19)'/%3E%3C/svg%3E") 16 6, default !important;
                }
            `}</style>
            {isHomePage ? (
                /* Home page — full screen, no sidebar */
                <div
                    style={{
                        ...S.layout,
                        justifyContent: 'center',
                    }}
                >
                    <HomePage onNavigate={handleNavigate} />
                </div>
            ) : (
                /* Component page — with sidebar */
                <div style={{ ...S.layout, position: 'relative' }}>
                    {/* 彩蛋壁纸覆盖层：opacity 淡入淡出，覆盖默认绿波点壁纸 */}
                    <div
                        aria-hidden
                        className={pageBg ? backgroundStyles[`bg-${pageBg}`] : undefined}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: eggOn ? 1 : 0,
                            transition: 'opacity 0.45s ease',
                            pointerEvents: 'none',
                        }}
                    />
                    {/* Desktop sidebar */}
                    {!isMobile && (
                        <aside style={{ ...S.sidebar, position: 'relative' }}>
                            <SidebarContent activeKey={activeKey} onNavigate={handleNavigate} />
                        </aside>
                    )}

                    {/* Mobile top bar */}
                    {isMobile && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 52,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 12px',
                                background: 'rgba(255,252,244,0.92)',
                                backdropFilter: 'blur(8px)',
                                borderBottom: '1px solid #e8e2d6',
                                zIndex: 50,
                                fontFamily: S.layout.fontFamily,
                            }}
                        >
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 20,
                                    color: '#725d42',
                                    padding: '4px 8px',
                                    borderRadius: 8,
                                    lineHeight: 1,
                                }}
                            >
                                ←
                            </button>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: '#725d42',
                                }}
                            >
                                {PAGE_INFO[activeKey]?.title ?? '组件文档'}
                            </span>
                            <button
                                onClick={() => setDrawerOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 20,
                                    color: '#725d42',
                                    padding: '4px 8px',
                                    borderRadius: 8,
                                    lineHeight: 1,
                                }}
                            >
                                ☰
                            </button>
                        </div>
                    )}

                    {/* Mobile drawer overlay */}
                    {isMobile && drawerOpen && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.35)',
                                    zIndex: 98,
                                }}
                                onClick={() => setDrawerOpen(false)}
                            />
                            <aside
                                style={{
                                    ...S.sidebar,
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 240,
                                    zIndex: 99,
                                    boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
                                }}
                            >
                                <SidebarContent activeKey={activeKey} onNavigate={handleNavigate} />
                            </aside>
                        </>
                    )}

                    <main
                        ref={mainRef}
                        style={{
                            ...S.main,
                            position: 'relative',
                            zIndex: 1,
                            padding: isMobile ? '16px' : '32px 40px',
                            paddingTop: isMobile ? 68 : 32,
                        }}
                    >
                        <Suspense fallback={null}>
                            <ComponentPage activeKey={activeKey} />
                        </Suspense>
                    </main>
                </div>
            )}
        </Cursor>
    );
};

export default App;
