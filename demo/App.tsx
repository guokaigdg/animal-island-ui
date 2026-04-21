import React, { useState, useEffect, useCallback } from 'react';
import { Cursor } from '../src';
import '../src/styles/index.less';
import HomePage from './HomePage';
import ComponentPage, { PAGE_INFO } from './ComponentPage';
import { useIsMobile } from './tools';

// ============================================
// Simple hash router
// ============================================
const useHash = () => {
    const [hash, setHash] = useState(
        () => window.location.hash.slice(1) || '/'
    );

    useEffect(() => {
        const onHashChange = () =>
            setHash(window.location.hash.slice(1) || '/');
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
}

interface MenuItem {
    key: string;
    label: string;
    children?: MenuItemChild[];
}

// ============================================
// Menu config
// ============================================
const MENU_ITEMS: MenuItem[] = [
    {
        key: 'cat-basic',
        label: '── 基础组件 ──',
        children: [
            { key: 'button', label: 'Button 按钮' },
            { key: 'input', label: 'Input 输入框' },
            { key: 'switch', label: 'Switch 开关' },
            { key: 'card', label: 'Card 卡片' },
            { key: 'collapse', label: 'Collapse 折叠面板' },
            { key: 'cursor', label: 'Cursor 光标' },
            { key: 'modal', label: 'Modal 弹窗' },
            { key: 'divider-comp', label: 'Divider 分割线' },
            { key: 'footer', label: 'Footer 页脚' },
        ],
    },
    {
        key: 'cat-complex',
        label: '── 复杂组件 ──',
        children: [
            { key: 'time', label: 'Time 时间' },
            { key: 'phone', label: 'Phone 手机' },
        ],
    },
];

// ============================================
// Shared styles
// ============================================
const S = {
    layout: {
        display: 'flex',
        height: '100vh',
        fontFamily: "Nunito, 'Zen Maru Gothic', 'M PLUS Rounded 1c', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        background: `url(${new URL('./img/content_bg_pc.jpg', import.meta.url).href}) center fixed`,
    } as React.CSSProperties,
    sidebar: {
        width: 220,
        minWidth: 220,
        background: `url(${new URL('./img/menu_bg.svg', import.meta.url).href}) center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    } as React.CSSProperties,
    sidebarHeader: {
        padding: '20px 16px 12px',
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
            margin: '1px 5px',
            height: 40,
            padding: '0 16px',
            fontFamily: "Nunito, 'Zen Maru Gothic', 'M PLUS Rounded 1c', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
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
                src={new URL('./img/nook-phone/nook1.svg', import.meta.url).href}
                style={{ width: 24, height: 24, marginRight: 8 }}
                alt="nook"
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
                                        if (activeKey !== child.key)
                                            e.currentTarget.style.background = '#d6dff0';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeKey !== child.key)
                                            e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span
                                        style={{
                                            color: activeKey === child.key ? '#fff' : '#8a7b66',
                                        }}
                                    >
                                        {child.label}
                                    </span>
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
                            if (activeKey !== item.key)
                                e.currentTarget.style.background = '#d6dff0';
                        }}
                        onMouseLeave={(e) => {
                            if (activeKey !== item.key)
                                e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span style={{ color: activeKey === item.key ? '#fff' : '#8a7b66' }}>
                            {item.label}
                        </span>
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

    const activeKey =
        hash.startsWith('/') && hash.length > 1 ? hash.slice(1) : 'home';
    const isHomePage = activeKey === 'home';

    // Close drawer when switching to desktop
    useEffect(() => {
        if (!isMobile) setDrawerOpen(false);
    }, [isMobile]);

    // Close drawer when route changes
    useEffect(() => {
        setDrawerOpen(false);
    }, [activeKey]);

    const handleNavigate = useCallback(
        (path: string) => {
            navigate(path);
            setDrawerOpen(false);
        },
        [navigate]
    );

    return (
        <Cursor>
            {isHomePage ? (
                /* Home page — full screen, no sidebar */
                <div
                    style={{
                        ...S.layout,
                        background: `url(${new URL('./img/home_bg.svg', import.meta.url).href}) center/cover no-repeat, #7DC395`,
                        justifyContent: 'center',
                    }}
                >
                    <HomePage onNavigate={navigate} />
                </div>
            ) : (
                /* Component page — with sidebar */
                <div style={S.layout}>
                    {/* Desktop sidebar */}
                    {!isMobile && (
                        <aside style={S.sidebar}>
                            <SidebarContent
                                activeKey={activeKey}
                                onNavigate={handleNavigate}
                            />
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
                                <SidebarContent
                                    activeKey={activeKey}
                                    onNavigate={handleNavigate}
                                />
                            </aside>
                        </>
                    )}

                    <main
                        style={{
                            ...S.main,
                            position: 'relative',
                            zIndex: 1,
                            padding: isMobile ? '16px' : '32px 40px',
                            paddingTop: isMobile ? 68 : 32,
                        }}
                    >
                        <ComponentPage activeKey={activeKey} />
                    </main>

                    {!isMobile && (
                        <img
                            src={
                                new URL('./img/guide-bg-line.webp', import.meta.url).href
                            }
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
        </Cursor>
    );
};

export default App;
