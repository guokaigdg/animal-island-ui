import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { Icon } from '../Icon';
import styles from './image.module.less';

export type ImageColor =
    | 'white'
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

export interface ImageProps extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt' | 'width' | 'height' | 'onLoad' | 'onError'
> {
    /** 图片地址（必填） */
    src: string;
    /** 图片替代文本（无障碍）；留空表示装饰性图片 */
    alt?: string;
    /** 图片宽度 */
    width?: number | string;
    /** 图片高度 */
    height?: number | string;
    /** 背景颜色（Card pattern 同款底色，无花纹；'white' 为纯白，默认 white） */
    color?: ImageColor;
    /** 是否启用懒加载 */
    lazy?: boolean;
    /** 点击图片弹出大图预览 */
    preview?: boolean;
    /** 图片加载完成回调 */
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    /** 图片加载失败回调 */
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const Image: React.FC<ImageProps> = ({
    src,
    alt = '',
    width,
    height,
    color = 'white',
    lazy = false,
    preview = true,
    className,
    style,
    onLoad,
    onError,
    ...rest
}) => {
    // failed：主图加载失败时显示错误占位
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    // 大图预览开关
    const [previewOpen, setPreviewOpen] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const lastFocusedRef = useRef<HTMLElement | null>(null);

    // src 变化时重置加载状态
    useEffect(() => {
        setFailed(false);
        setLoaded(false);
    }, [src]);

    const handleLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            setLoaded(true);
            onLoad?.(e);
        },
        [onLoad]
    );

    const handleError = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            // 加载失败 → 错误占位
            setFailed(true);
            setLoaded(true);
            onError?.(e);
        },
        [onError]
    );

    // 预览打开：聚焦关闭按钮；ESC 关闭；Tab 圈定在遮罩内（遮罩里只有关闭按钮可聚焦）
    useEffect(() => {
        if (!previewOpen) return;
        closeBtnRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewOpen(false);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                closeBtnRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [previewOpen]);

    // 预览关闭后把焦点还给触发元素
    useEffect(() => {
        if (!previewOpen) {
            lastFocusedRef.current?.focus();
            lastFocusedRef.current = null;
        }
    }, [previewOpen]);

    const openPreview = () => {
        lastFocusedRef.current = document.activeElement as HTMLElement | null;
        setPreviewOpen(true);
    };

    if (failed) {
        return (
            <span
                className={classNames(
                    styles.image,
                    color !== 'white' && styles[`image-${color}`],
                    styles.error,
                    className
                )}
                style={{ width, height, ...style }}
                role="img"
                aria-label={alt || '图片加载失败'}
            >
                <Icon name="page" size={32} />
                <span>图片加载失败</span>
            </span>
        );
    }

    const frameCls = classNames(
        styles.image,
        color !== 'white' && styles[`image-${color}`],
        loaded && styles.loaded,
        preview && styles.preview,
        className
    );
    const frameStyle: React.CSSProperties = { width, height, ...style };

    const content = (
        <img
            src={src}
            alt={alt}
            loading={lazy ? 'lazy' : undefined}
            className={styles.img}
            onLoad={handleLoad}
            onError={handleError}
            {...rest}
        />
    );

    // 点击预览：相框升格为按钮（原生支持 Enter / Space），预览弹层经 Portal 挂到 body
    if (preview) {
        return (
            <>
                <button type="button" className={frameCls} style={frameStyle} onClick={openPreview}>
                    {content}
                </button>
                {createPortal(
                    previewOpen ? (
                        <div className={styles.mask} onClick={() => setPreviewOpen(false)}>
                            <div
                                className={styles.dialog}
                                role="dialog"
                                aria-modal="true"
                                aria-label={alt ? `查看图片：${alt}` : '图片预览'}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    ref={closeBtnRef}
                                    className={styles.closeBtn}
                                    aria-label="关闭预览"
                                    onClick={() => setPreviewOpen(false)}
                                >
                                    <span className={styles.closeMark} />
                                </button>
                                <img src={src} alt={alt} className={styles.previewImg} />
                            </div>
                        </div>
                    ) : null,
                    document.body
                )}
            </>
        );
    }

    return (
        <span className={frameCls} style={frameStyle}>
            {content}
        </span>
    );
};

Image.displayName = 'Image';
