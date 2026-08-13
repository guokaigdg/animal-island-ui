import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Cursor, Loading } from '../src';
import '../src/styles/index.less';
import './fonts.css';
import HomePage from './HomePage';
import { PAGE_INFO } from './pageInfo';
import { useIsMobile } from './tools';

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
//   反馈      → 浮层/状态/异步反馈 (Notification, Modal, Drawer, Tooltip, Loading, Progress)
//   数据展示  → 容器/列表/排版 (Card, Collapse, Tabs, Table, Typewriter)
//   主题  → 业务复合/主题专属 (Wallet, Time, Phone, Wedding)
// ============================================
const MENU_ITEMS: MenuItem[] = [
    {
        key: 'cat-basic',
        label: '── 基础 ──',
        children: [
            { key: 'title', label: 'Title 标题', isNew: true },
            { key: 'button', label: 'Button 按钮' },
            { key: 'divider-comp', label: 'Divider 分割线' },
            { key: 'icon', label: 'Icon 图标' },
            { key: 'tag', label: 'Tag 标签' },
            { key: 'cursor', label: 'Cursor 光标' },
            { key: 'codeblock', label: 'CodeBlock 代码高亮' },
            { key: 'footer', label: 'Footer 页脚' },
        ],
    },
    {
        key: 'cat-form',
        label: '── 表单 ──',
        children: [
            { key: 'input', label: 'Input 输入框' },
            { key: 'switch', label: 'Switch 开关' },
            { key: 'select', label: 'Select 选择器' },
            { key: 'date-picker', label: 'DatePicker 日期选择' },
            { key: 'time-picker', label: 'TimePicker 时间选择' },
            { key: 'checkbox', label: 'Checkbox 多选框' },
            { key: 'radio', label: 'Radio 单选框' },
            { key: 'form', label: 'Form 表单', isNew: true },
        ],
    },
    {
        key: 'cat-feedback',
        label: '── 反馈 ──',
        children: [
            { key: 'notification', label: 'Notification 通知', isNew: true },
            { key: 'modal', label: 'Modal 弹窗' },
            { key: 'drawer', label: 'Drawer 抽屉', isNew: true },
            { key: 'tooltip', label: 'Tooltip 气泡提示' },
            { key: 'loading', label: 'Loading 加载', isNew: true },
            { key: 'progress', label: 'Progress 进度条' },
            { key: 'skeleton', label: 'Skeleton 骨架屏' },
            { key: 'backtop', label: 'BackTop 返回顶部', isNew: true },
        ],
    },
    {
        key: 'cat-data-display',
        label: '── 数据展示 ──',
        children: [
            { key: 'card', label: 'Card 卡片' },
            { key: 'collapse', label: 'Collapse 折叠面板' },
            { key: 'tabs', label: 'Tabs 标签页' },
            { key: 'table', label: 'Table 表格' },
            { key: 'typewriter', label: 'Typewriter 打字机' },
            { key: 'image', label: 'Image 图片', isNew: true },
        ],
    },
    {
        key: 'cat-animal',
        label: '── 主题 ──',
        children: [
            { key: 'wallet', label: 'Wallet 钱包', isNew: true },
            { key: 'time', label: 'Time 时间' },
            { key: 'phone', label: 'Phone 手机' },
            { key: 'wedding-invitation', label: 'Wedding 婚礼请柬', isNew: true },
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
        background: `url(${new URL('./img/content_bg_pc.jpg', import.meta.url).href}) center / auto repeat`,
    } as React.CSSProperties,
    sidebar: {
        width: 220,
        minWidth: 220,
        background: `url(${new URL('./img/menu_bg.svg', import.meta.url).href}) center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: '12px 0 12px 12px',
        borderRadius: 16,
        border: '2px solid rgba(250, 250, 250, 1)',
        boxShadow: '0 4px 16px rgba(61, 52, 40, 0.10)',
        height: 'calc(100dvh - 20px)',
    } as React.CSSProperties,
    homeBg: {
        background: `url(${new URL('./img/home_bg.webp', import.meta.url).href}) 0 0 / auto repeat, #7DC395`,
        animation: 'bgScroll 80s linear infinite',
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
        padding: '8px 0',
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
                src={new URL('./img/island-phone/island1.svg', import.meta.url).href}
                style={{ width: 24, height: 24, marginRight: 8 }}
                alt="island"
            />
            集合啦！Animal
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
                                    style={S.menuItem(activeKey === child.key)}
                                    onClick={() => onNavigate(`/${child.key}`)}
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
    const [loadingActive, setLoadingActive] = useState(false);
    const [loadingMounted, setLoadingMounted] = useState(false);
    const mainRef = React.useRef<HTMLElement>(null);

    const activeKey = hash.startsWith('/') && hash.length > 1 ? hash.slice(1) : 'home';
    const isHomePage = activeKey === 'home';

    // Close drawer when switching to desktop
    useEffect(() => {
        if (!isMobile) setDrawerOpen(false);
    }, [isMobile]);

    // Close drawer when route changes + scroll main to top
    useEffect(() => {
        setDrawerOpen(false);
        mainRef.current?.scrollTo({ top: 0 });
    }, [activeKey]);

    const handleNavigate = useCallback(
        (path: string) => {
            navigate(path);
            setDrawerOpen(false);
        },
        [navigate]
    );

    // 首页跳转到组件页时显示 2s Loading 覆盖层
    const handleHomeNavigate = useCallback(
        (path: string) => {
            setLoadingMounted(true);
            setLoadingActive(true);
            navigate(path);
            // 2s 后开始关闭，再多留 1.5s 给关闭扩散动画后卸载
            window.setTimeout(() => setLoadingActive(false), 2000);
            window.setTimeout(() => setLoadingMounted(false), 3500);
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
            `}</style>
            {isHomePage ? (
                /* Home page — full screen, no sidebar */
                <div
                    style={{
                        ...S.layout,
                        ...S.homeBg,
                        justifyContent: 'center',
                    }}
                >
                    <HomePage onNavigate={handleHomeNavigate} />
                </div>
            ) : (
                /* Component page — with sidebar */
                <div style={S.layout}>
                    {/* Desktop sidebar */}
                    {!isMobile && (
                        <aside style={S.sidebar}>
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

                    {!isMobile && (
                        <img
                            src={new URL('./img/guide-bg-line.webp', import.meta.url).href}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style={{
                                position: 'fixed',
                                left: 220,
                                right: 0,
                                bottom: 0,
                                width: 'calc(100% - 220px)',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }}
                        />
                    )}
                </div>
            )}
            {/* 首页跳转组件页的过场 Loading，全屏覆盖 */}
            {loadingMounted && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        pointerEvents: loadingActive ? 'auto' : 'none',
                    }}
                >
                    <Loading active={loadingActive} />
                </div>
            )}
        </Cursor>
    );
};

export default App;
