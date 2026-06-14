import React, { useState, useRef, useCallback, useEffect, useId } from 'react';
import styles from './tooltip.module.less';
import classNames from 'classnames';

export type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

export type TooltipTrigger = 'hover' | 'focus' | 'click';

/** default 标准矩形；island 治愈海岛不规则有机气泡（与 Modal 同款 clip-path） */
export type TooltipVariant = 'default' | 'island';

const ISLAND_CLIP_PATH =
    'M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005';

const ISLAND_BG = 'rgb(247, 243, 223)';
const ISLAND_STROKE = '#c4b89e';

const IslandClipDef: React.FC<{ id: string }> = ({ id }) => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={ISLAND_CLIP_PATH} />
        </clipPath>
    </svg>
);

/** SVG 沿有机路径 fill + stroke，边框贴合不规则轮廓 */
const IslandShapeSvg: React.FC = () => (
    <svg className={styles.islandSvg} viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
        <path
            d={ISLAND_CLIP_PATH}
            fill={ISLAND_BG}
            stroke={ISLAND_STROKE}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
        />
    </svg>
);

export interface TooltipProps {
    /** 提示内容，支持多行（可用 \n 或 <br/> 换行） */
    title: React.ReactNode;
    /** 位置 */
    placement?: TooltipPlacement;
    /** 触发方式 */
    trigger?: TooltipTrigger;
    /** 视觉风格：default 标准矩形 / island 治愈海岛有机气泡 */
    variant?: TooltipVariant;
    /** 是否显示边框（含箭头描边）；island 开启后 SVG 沿有机路径描边 */
    bordered?: boolean;
    /** 子元素（触发器） */
    children: React.ReactElement;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
    title,
    placement = 'top',
    trigger = 'hover',
    variant = 'default',
    bordered = true,
    children,
    className,
    style,
}) => {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const rawId = useId().replace(/:/g, '');
    const clipId = `animal-tooltip-clip-${rawId}`;
    const tooltipId = `animal-tooltip-${rawId}`;

    const show = useCallback(() => {
        clearTimeout(timerRef.current);
        setVisible(true);
    }, []);

    const hide = useCallback(() => {
        timerRef.current = setTimeout(() => setVisible(false), 100);
    }, []);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const child = React.Children.only(children);

    // 用结构化类型描述子元素可能带的鼠标 / 焦点 / 点击回调
    const childProps = child.props as {
        onMouseEnter?: React.MouseEventHandler;
        onMouseLeave?: React.MouseEventHandler;
        onFocus?: React.FocusEventHandler;
        onBlur?: React.FocusEventHandler;
        onClick?: React.MouseEventHandler;
    };

    const triggerProps: Record<string, unknown> = {
        // 让屏幕阅读器在 trigger 获取焦点 / hover 描述时能读出 tooltip 内容
        // 仅在显示时生效，避免隐藏 tooltip 仍被读到
        'aria-describedby': visible
            ? [(child.props as { 'aria-describedby'?: string })['aria-describedby'], tooltipId]
                  .filter(Boolean)
                  .join(' ')
            : (child.props as { 'aria-describedby'?: string })['aria-describedby'],
    };

    if (trigger === 'hover') {
        triggerProps.onMouseEnter = (e: React.MouseEvent) => {
            show();
            childProps.onMouseEnter?.(e);
        };
        triggerProps.onMouseLeave = (e: React.MouseEvent) => {
            hide();
            childProps.onMouseLeave?.(e);
        };
    } else if (trigger === 'focus') {
        triggerProps.onFocus = (e: React.FocusEvent) => {
            show();
            childProps.onFocus?.(e);
        };
        triggerProps.onBlur = (e: React.FocusEvent) => {
            hide();
            childProps.onBlur?.(e);
        };
    } else if (trigger === 'click') {
        triggerProps.onClick = (e: React.MouseEvent) => {
            setVisible((v) => !v);
            childProps.onClick?.(e);
        };
    }

    const placementClass = styles[placement.replace(/-/g, '_')];
    const isIsland = variant === 'island';

    return (
        <div className={classNames(styles.tooltipWrapper, className)} style={style}>
            {React.cloneElement(child, triggerProps)}
            <div
                className={classNames(
                    styles.tooltip,
                    placementClass,
                    isIsland && styles.island,
                    bordered ? styles.bordered : styles.borderless,
                    { [styles.visible]: visible }
                )}
                role="tooltip"
                id={tooltipId}
                aria-hidden={!visible}
                onMouseEnter={trigger === 'hover' ? show : undefined}
                onMouseLeave={trigger === 'hover' ? hide : undefined}
            >
                {isIsland ? (
                    <>
                        <div className={styles.islandBody}>
                            <IslandClipDef id={clipId} />
                            {bordered && <IslandShapeSvg />}
                            <div className={styles.islandContent} style={{ clipPath: `url(#${clipId})` }}>
                                <div className={styles.content}>{title}</div>
                            </div>
                        </div>
                        <span className={styles.tail} aria-hidden />
                    </>
                ) : (
                    <div className={styles.content}>{title}</div>
                )}
            </div>
        </div>
    );
};

Tooltip.displayName = 'Tooltip';
