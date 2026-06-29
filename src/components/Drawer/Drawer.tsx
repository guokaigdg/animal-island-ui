import React, { useEffect, useCallback, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Cursor } from '../Cursor';
import styles from './drawer.module.less';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
].join(',');

const getFocusable = (root: HTMLElement): HTMLElement[] => {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );
};

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
    /** 是否可见 */
    open: boolean;
    /** 标题 */
    title?: React.ReactNode;
    /** 弹出位置，默认 'right' */
    placement?: DrawerPlacement;
    /** 宽度（left / right 时生效），默认 378 */
    width?: number | string;
    /** 高度（top / bottom 时生效），默认 300 */
    height?: number | string;
    /** 点击遮罩关闭，默认 true */
    maskClosable?: boolean;
    /** 背景下沉景深效果，默认 true */
    pushBackground?: boolean;
    /** 底部区域，传 null 或不传则不渲染 */
    footer?: React.ReactNode | null;
    /** 关闭回调 */
    onClose?: () => void;
    /** 自定义内容 */
    children?: React.ReactNode;
    className?: string;
    /** 遮罩层自定义样式 */
    maskStyle?: React.CSSProperties;
}

/**
 * Drawer 下沉景深抽屉
 *
 * 抽屉本体始终在 DOM 中（参考 index.html 的下沉景深抽屉结构）：
 * - 关闭态由 placement 类（transform: translateX/Y(...)）定义，
 *   打开态由 panelOpen 覆盖（transform: none），浏览器能稳定捕获两端状态，
 *   transition 入场/退场自动反向播放。
 * - 关闭时用 aria-hidden 把抽屉排除在无障碍树之外，关闭状态下也保留 focus 行为兼容。
 * - 面板上加 inert={!open} 防止关闭时被 Tab 进入。
 */
export const Drawer: React.FC<DrawerProps> = ({
    open,
    title,
    placement = 'right',
    width = 378,
    height = 300,
    maskClosable = true,
    pushBackground = true,
    footer,
    onClose,
    children,
    className,
    maskStyle,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    // 用于在退场时延迟一帧恢复元素的原始 transition（让 transform 恢复能套用我们设的过渡）
    const restoreTransitionRafRef = useRef<number | null>(null);

    // 打开时记录触发元素 + 把焦点送进抽屉；关闭时归还焦点
    useEffect(() => {
        if (!open) return;
        previouslyFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
        const id = window.setTimeout(() => {
            const dialog = dialogRef.current;
            if (!dialog) return;
            const focusables = getFocusable(dialog);
            (focusables[0] ?? dialog).focus();
        }, 0);
        return () => {
            window.clearTimeout(id);
            previouslyFocusedRef.current?.focus?.();
        };
    }, [open]);

    // ESC 关闭 + Tab/Shift+Tab 焦点陷阱
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose?.();
                return;
            }
            if (e.key !== 'Tab') return;
            const dialog = dialogRef.current;
            if (!dialog) return;
            const focusables = getFocusable(dialog);
            if (focusables.length === 0) {
                e.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;
            if (e.shiftKey) {
                if (active === first || !dialog.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last || !dialog.contains(active)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // 禁止滚动：与 open 同步，关闭时立刻还原（参考中开关类即释放滚动）
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
        return undefined;
    }, [open]);

    // 背景下沉景深效果：对 body 直接子元素中非 fixed 的内容施加 transform + filter + borderRadius + overflow
    // 数值与时序对齐 index.html "下沉景深抽屉" 参考：
    //   transform: scale(0.94)
    //   filter: blur(1px)
    //   border-radius: 14px / overflow: hidden
    //   transition: transform/filter/border-radius 0.36s cubic-bezier(0.2, 0, 0.2, 1) / ease
    useEffect(() => {
        if (!open || !pushBackground) return;

        // 取消上次清理时可能未完成的恢复 transition 的 rAF（处理快速重新打开抽屉的场景）
        if (restoreTransitionRafRef.current !== null) {
            cancelAnimationFrame(restoreTransitionRafRef.current);
            restoreTransitionRafRef.current = null;
        }

        const pushed: Array<{
            el: HTMLElement;
            transform: string;
            filter: string;
            borderRadius: string;
            overflow: string;
            transition: string;
        }> = [];

        const candidates = Array.from(document.body.children).filter((el): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            // 跳过脚本/样式/无脚本标签
            const tag = el.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return false;
            // 跳过显式标记忽略的元素
            if (el.hasAttribute('data-animal-drawer-ignore')) return false;
            // 跳过本组件 portal 输出（Cursor 包裹器非 fixed，但其内部的 mask/panel 是 fixed，
            // 若对其施加 transform 会成为 fixed 后代的包含块，破坏视口定位）
            if (el.hasAttribute('data-animal-drawer-portal')) return false;
            // 跳过 fixed 定位（遮罩、面板、其他 portal 均为 fixed，自动排除）
            return getComputedStyle(el).position !== 'fixed';
        });

        candidates.forEach((el) => {
            pushed.push({
                el,
                transform: el.style.transform,
                filter: el.style.filter,
                borderRadius: el.style.borderRadius,
                overflow: el.style.overflow,
                transition: el.style.transition,
            });
            el.style.transition =
                'transform 0.36s cubic-bezier(0.2, 0, 0.2, 1), filter 0.36s ease, border-radius 0.36s ease';
        });

        const rafId = requestAnimationFrame(() => {
            pushed.forEach(({ el }) => {
                el.style.transform = 'scale(0.94)';
                el.style.filter = 'blur(1px)';
                el.style.borderRadius = '14px';
                el.style.overflow = 'hidden';
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            // 取消可能未完成的恢复 transition 的 rAF（effect 重新打开抽屉时）
            if (restoreTransitionRafRef.current !== null) {
                cancelAnimationFrame(restoreTransitionRafRef.current);
                restoreTransitionRafRef.current = null;
            }
            // 先恢复 transform/filter/borderRadius/overflow，但保留我们设的 transition，让背景能平滑恢复
            pushed.forEach(({ el, transform, filter, borderRadius, overflow }) => {
                el.style.transform = transform;
                el.style.filter = filter;
                el.style.borderRadius = borderRadius;
                el.style.overflow = overflow;
            });
            // 下一帧再恢复原始 transition，避免和上面的样式写入被合批导致 transition 失效
            restoreTransitionRafRef.current = requestAnimationFrame(() => {
                pushed.forEach(({ el, transition }) => {
                    el.style.transition = transition;
                });
                restoreTransitionRafRef.current = null;
            });
        };
    }, [open, pushBackground]);

    const handleMaskClick = useCallback(() => {
        if (maskClosable) onClose?.();
    }, [maskClosable, onClose]);

    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const idPrefix = `animal-drawer-${useId().replace(/:/g, '')}`;
    const titleId = `${idPrefix}-title`;

    // 始终在 DOM 中渲染：关闭态由 placement 类（transform: translateX/Y(...)）定义，
    // 打开态由 .panelOpen 覆盖（transform: none），CSS transition 入场/退场自动反向播放。
    // 关闭时通过 inert + aria-hidden 把抽屉从无障碍树和 Tab 顺序中排除。
    const inertProps = !open ? ({ inert: '' } as Record<string, string>) : {};

    const panelClass = [
        styles.panel,
        placement === 'left' && styles.panelLeft,
        placement === 'right' && styles.panelRight,
        placement === 'top' && styles.panelTop,
        placement === 'bottom' && styles.panelBottom,
        open && styles.panelOpen,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const panelStyle: React.CSSProperties = {};
    if (placement === 'left' || placement === 'right') {
        panelStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
        panelStyle.height = typeof height === 'number' ? `${height}px` : height;
    }

    const drawerContent = (
        <div data-animal-drawer-portal>
            <Cursor>
                <div
                    className={[styles.mask, open && styles.maskOpen].filter(Boolean).join(' ')}
                    style={maskStyle}
                    onClick={handleMaskClick}
                    aria-hidden={!open}
                >
                    <div
                        ref={dialogRef}
                        className={panelClass}
                        style={panelStyle}
                        onClick={handleContentClick}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        aria-hidden={!open}
                        tabIndex={-1}
                        {...inertProps}
                    >
                        {title && (
                            <div className={styles.header}>
                                <div className={styles.title} id={titleId}>
                                    {title}
                                </div>
                                <button type="button" className={styles.close} onClick={onClose} aria-label="关闭">
                                    ×
                                </button>
                            </div>
                        )}
                        <div className={styles.body}>{children}</div>
                        {footer && <div className={styles.footer}>{footer}</div>}
                    </div>
                </div>
            </Cursor>
        </div>
    );

    return createPortal(drawerContent, document.body);
};

Drawer.displayName = 'Drawer';
