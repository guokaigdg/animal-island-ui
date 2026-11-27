import { describe, it, expect, vi, afterEach } from 'vitest';

/**
 * React 在服务端执行 useLayoutEffect 会打印告警。
 *
 * 这里在无 DOM 的环境下渲染一次，确认库内的布局副作用都退回 useEffect。
 * 断言前先重置模块注册表，让 hook 在 window 缺失时求值；
 * React 与 react-dom/server 也在重置后动态引入，保证是同一份实例。
 */
describe('useIsomorphicLayoutEffect', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('服务端渲染不触发 useLayoutEffect 告警', async () => {
        vi.stubGlobal('window', undefined);
        vi.resetModules();
        const React = (await import('react')).default;
        const { renderToString } = await import('react-dom/server');
        const { useIsomorphicLayoutEffect } = await import('./useIsomorphicLayoutEffect');
        const Probe = () => {
            useIsomorphicLayoutEffect(() => undefined, []);
            return React.createElement('span', null, 'probe');
        };
        const errors: string[] = [];
        const spy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
            errors.push(String(args[0]));
        });
        try {
            renderToString(React.createElement(Probe));
        } finally {
            spy.mockRestore();
        }
        expect(errors.filter((message) => message.includes('useLayoutEffect'))).toEqual([]);
    });
});
