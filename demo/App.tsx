import React, { useState, useEffect, useCallback } from 'react';
import { Cursor } from '../src';
import '../src/styles/index.less';
import HomePage from './HomePage';
import ComponentPage, { PAGE_INFO } from './ComponentPage';

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

// ============================================
// Menu config
// ============================================
const MENU_ITEMS = [
    { key: 'cat-basic', label: '── 基础组件 ──' },
    { key: 'button', label: 'Button 按钮' },
    { key: 'input', label: 'Input 输入框' },
    { key: 'switch', label: 'Switch 开关' },
    { key: 'card', label: 'Card 卡片' },
    { key: 'collapse', label: 'Collapse 折叠面板' },
    { key: 'cursor', label: 'Cursor 光标' },
    { key: 'modal', label: 'Modal 弹窗' },
    { key: 'divider-comp', label: 'Divider 分割线' },
];

// ============================================
// Shared styles
// ============================================
const S = {
    layout: {
        display: 'flex',
        height: '100vh',
        fontFamily: "'Inter', 'Roboto', system-ui, sans-serif",
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
            margin: '1px 4px',
            height: 40,
            padding: '0 16px',
            fontFamily: "'FOT-Seurat Pro'",
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: 14,
            paddingLeft: 26,
            color: active ? '#fff' : '#8a7b66',
            background: active ? '#B7C6E5' : 'transparent',
            borderRadius: 12,
            borderRight: 'none',
            transition: 'all 0.15s',
            // cursor: 'pointer',
        }) as React.CSSProperties,
    main: {
        flex: 1,
        overflow: 'auto',
        padding: '32px 40px',
    } as React.CSSProperties,
};

// ============================================
// App
// ============================================
const App: React.FC = () => {
    const { hash, navigate } = useHash();

    // Parse route: "/" → home, "/button" → button component
    const activeKey =
        hash.startsWith('/') && hash.length > 1 ? hash.slice(1) : 'home';
    const isHomePage = activeKey === 'home';

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
                    <aside style={S.sidebar}>
                        <div
                            style={S.sidebarHeader}
                            onClick={() => navigate('/')}
                        >
                            <img
                                src={
                                    new URL(
                                        './img/nook-phone/nook1.svg',
                                        import.meta.url
                                    ).href
                                }
                                style={{ width: 24, height: 24, marginRight: 8 }}
                                alt="nook"
                            />
                            集合啦！動物森友會
                        </div>
                        <nav style={S.menuList}>
                            {MENU_ITEMS.map((item) => {
                                if (item.key.startsWith('cat-')) {
                                    return (
                                        <div
                                            key={item.key}
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
                                    );
                                }
                                return (
                                    <div
                                        key={item.key}
                                        style={S.menuItem(
                                            activeKey === item.key
                                        )}
                                        onClick={() => navigate(`/${item.key}`)}
                                        onMouseEnter={(e) => {
                                            if (activeKey !== item.key)
                                                e.currentTarget.style.background =
                                                    '#d6dff0';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeKey !== item.key)
                                                e.currentTarget.style.background =
                                                    'transparent';
                                        }}
                                    >
                                        <span
                                            style={{
                                                color:
                                                    activeKey === item.key
                                                        ? '#fff'
                                                        : '#8a7b66',
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </nav>
                    </aside>

                    <main
                        style={{ ...S.main, position: 'relative', zIndex: 1 }}
                    >
                        <ComponentPage activeKey={activeKey} />
                    </main>

                    <img
                        src={
                            new URL('./img/guide-bg-line.webp', import.meta.url)
                                .href
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
                </div>
            )}
        </Cursor>
    );
};

export default App;
