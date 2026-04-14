import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import styles from './modal.module.less';

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
    /** 是否显示关闭按钮 */
    closable?: boolean;
    /** 底部按钮区域 */
    footer?: React.ReactNode | null;
    /** 关闭回调 */
    onClose?: () => void;
    /** 确认回调 */
    onOk?: () => void;
    /** 自定义内容 */
    children?: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    title,
    width = 520,
    maskClosable = true,
    closable = true,
    footer,
    onClose,
    onOk,
    children,
    className,
}) => {
    // ESC 关闭
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose?.();
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
        <div className={styles.mask} onClick={handleMaskClick}>
            <div
                className={[styles.modal, className].filter(Boolean).join(' ')}
                style={{ width }}
                onClick={handleContentClick}
                role="dialog"
                aria-modal="true"
            >
                <ClipDef />
                <div className={styles.modalClipped}>
                    {(title || closable) && (
                        <div className={styles.header}>
                            {title && (
                                <div className={styles.title}>{title}</div>
                            )}
                            {closable && (
                                <button
                                    className={styles.close}
                                    onClick={onClose}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}
                    <div className={styles.body}>{children}</div>
                    {footer !== null && (
                        <div className={styles.footer}>
                            {footer === undefined ? defaultFooter : footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';
