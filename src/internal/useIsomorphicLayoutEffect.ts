import { useEffect, useLayoutEffect, type DependencyList, type EffectCallback } from 'react';

/**
 * 服务端渲染时退回 `useEffect`。
 *
 * React 在服务端执行 `useLayoutEffect` 会打印 “useLayoutEffect does nothing on the server”
 * 告警，并提示首帧与预期 UI 不一致 —— Next.js 等 SSR 框架下每个用到布局副作用的组件都会中招。
 * 客户端仍用 `useLayoutEffect`：绘制前完成测量，消除首帧按占位尺寸绘制后的闪烁。
 *
 * 按调用时判断而非模块加载时判断：同一份产物在服务端与客户端各自求值，两边都能选对实现。
 */
export function useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList): void {
    const useHook = typeof window === 'undefined' ? useEffect : useLayoutEffect;
    useHook(effect, deps);
}
