import React, { useEffect, useCallback, useState, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import { Cursor } from '../Cursor';
import { Typewriter } from '../Typewriter';
import styles from './modal.module.less';

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

// Inline SVG clip-path — same organic blob shape as Dialog
const ClipDef: React.FC = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <clipPath id="animal-modal-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005" />
        </clipPath>
    </svg>
);

export interface ModalProps {
    /** 是否可见 */
    open: boolean;
    /** 标题 */
    title?: React.ReactNode;
    /** 宽度 */
    width?: number | string;
    /** 点击遮罩关闭 */
    maskClosable?: boolean;
    /** 底部按钮区域 */
    footer?: React.ReactNode | null;
    /** 关闭回调 */
    onClose?: () => void;
    /** 确认回调 */
    onOk?: () => void;
    /** 自定义内容 */
    children?: React.ReactNode;
    className?: string;
    /** 打字机每字间隔 (ms), 默认 80 */
    typeSpeed?: number;
    /** 是否启用打字机效果, 默认 true */
    typewriter?: boolean;
    /** 遮罩层自定义样式 */
    maskStyle?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    title,
    width = 520,
    maskClosable = true,
    footer,
    onClose,
    onOk,
    children,
    className,
    typeSpeed = 80,
    typewriter = true,
    maskStyle,
}) => {
    // 每次 open 变为 true 时重启打字机
    const [playKey, setPlayKey] = useState(0);
    useEffect(() => {
        if (open) setPlayKey((k) => k + 1);
    }, [open]);

    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // 打开时记录触发元素 + 把焦点送进对话框；关闭时归还焦点
    useEffect(() => {
        if (!open) return;
        previouslyFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
        // 等下一个 microtask，让对话框节点已经挂载且 createPortal 完成
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

    // 禁止滚动
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const handleMaskClick = useCallback(() => {
        if (maskClosable) onClose?.();
    }, [maskClosable, onClose]);

    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const idPrefix = `animal-modal-${useId().replace(/:/g, '')}`;
    const titleId = `${idPrefix}-title`;
    const bodyId = `${idPrefix}-body`;

    if (!open) return null;

    const defaultFooter = (
        <>
            <Button type="primary" onClick={onClose}>
                取消
            </Button>
            <Button type="primary" onClick={onOk}>
                确定
            </Button>
        </>
    );

    const modalContent = (
        <Cursor>
            <div className={styles.mask} style={maskStyle} onClick={handleMaskClick}>
                <div
                    ref={dialogRef}
                    className={[styles.modal, className].filter(Boolean).join(' ')}
                    style={{ width }}
                    onClick={handleContentClick}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    aria-describedby={bodyId}
                    tabIndex={-1}
                >
                    <ClipDef />
                    <div className={styles.modalClipped}>
                        {title && (
                            <div className={styles.header}>
                                {title && (
                                    <div className={styles.title} id={titleId}>
                                        {title}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.body} id={bodyId}>
                            {typewriter ? (
                                <Typewriter speed={typeSpeed} trigger={playKey}>
                                    {children}
                                </Typewriter>
                            ) : (
                                children
                            )}
                        </div>
                        {footer !== null && (
                            <div className={styles.footer}>{footer === undefined ? defaultFooter : footer}</div>
                        )}
                    </div>
                </div>
            </div>
        </Cursor>
    );

    return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';
