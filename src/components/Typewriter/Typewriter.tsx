import React, { useEffect, useState, useRef, useMemo } from 'react';

export interface TypewriterProps {
    /** 需要逐字显示的内容，支持 ReactNode，保留原有元素结构/换行/样式 */
    children?: React.ReactNode;
    /** 每字间隔 (ms), 默认 90 */
    speed?: number;
    /**
     * 外部触发重新播放。值变化即重启动画。
     * 常见用法是把弹窗的 open 次数或一个递增的 key 传进来。
     */
    trigger?: unknown;
    /** 是否自动从头开始播放，默认 true；设为 false 可直接显示全部 */
    autoPlay?: boolean;
    /** 播放完成回调 */
    onDone?: () => void;
}

/**
 * 递归计算 ReactNode 中的纯文本总长度（用于驱动打字机进度）
 */
const countText = (node: React.ReactNode): number => {
    if (node == null || typeof node === 'boolean') return 0;
    if (typeof node === 'string' || typeof node === 'number') return String(node).length;
    if (Array.isArray(node)) return node.reduce<number>((s, n) => s + countText(n), 0);
    if (React.isValidElement(node)) {
        return countText((node.props as { children?: React.ReactNode }).children);
    }
    return 0;
};

interface RenderState {
    remaining: number;
    stopped: boolean;
}

/**
 * 按剩余可显字符数裁剪 ReactNode，保留原有的元素结构 / 换行 / 样式。
 */
const renderTruncated = (
    node: React.ReactNode,
    state: RenderState,
    keyPrefix = 'tw'
): React.ReactNode => {
    if (state.stopped) return null;
    if (node == null || typeof node === 'boolean') return null;

    if (typeof node === 'string' || typeof node === 'number') {
        const text = String(node);
        if (state.remaining >= text.length) {
            state.remaining -= text.length;
            return text;
        }
        const shown = text.slice(0, state.remaining);
        state.remaining = 0;
        state.stopped = true;
        return shown;
    }

    if (Array.isArray(node)) {
        return node.map((child, i) => (
            <React.Fragment key={`${keyPrefix}-${i}`}>
                {renderTruncated(child, state, `${keyPrefix}-${i}`)}
            </React.Fragment>
        ));
    }

    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        const childContent = renderTruncated(props.children, state, keyPrefix);
        return React.cloneElement(node, undefined, childContent);
    }

    return null;
};

/**
 * Typewriter 打字机组件
 * - 按字符逐个显示，保留原 children 的元素结构、换行和样式
 * - 不引入任何外层包裹元素，对布局 / 字号 / 颜色 / 字体均零影响
 */
export const Typewriter: React.FC<TypewriterProps> = ({
    children,
    speed = 90,
    trigger,
    autoPlay = true,
    onDone,
}) => {
    const total = useMemo(() => countText(children), [children]);
    const [count, setCount] = useState(autoPlay ? 0 : total);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        if (!autoPlay) {
            setCount(total);
            return;
        }
        setCount(0);
        if (total === 0) return;
        timerRef.current = window.setInterval(() => {
            setCount((c) => {
                if (c >= total) {
                    if (timerRef.current) window.clearInterval(timerRef.current);
                    return c;
                }
                return c + 1;
            });
        }, speed);
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [total, speed, trigger, autoPlay]);

    useEffect(() => {
        if (total > 0 && count >= total) onDone?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, total]);

    const state: RenderState = { remaining: count, stopped: false };
    return <>{renderTruncated(children, state)}</>;
};

Typewriter.displayName = 'Typewriter';
