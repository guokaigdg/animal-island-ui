// ============================================
// Notification 类型定义
// 命令式 API: Notification.success / error / warning / info / open / destroy
// 6 个 position: top / topLeft / topRight / bottom / bottomLeft / bottomRight
// 4 种 type: success / info / warning / error
// ============================================

import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type NotificationPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

export type NotificationPlacement = 'top' | 'bottom';

export interface NotificationConfig {
    /** 通知标题(必填) */
    message: ReactNode;
    /** 通知描述/正文,支持 ReactNode */
    description?: ReactNode;
    /** 自动关闭延时(秒),默认 4.5;传 0 不自动关闭 */
    duration?: number;
    /** 出现位置,默认 'top'(顶部居中) */
    position?: NotificationPosition;
    /** 类型 */
    type?: NotificationType;
    /** 自定义图标(优先级高于 type 默认图标) */
    icon?: ReactNode;
    /** 自定义操作按钮,渲染在关闭按钮左侧 */
    btn?: ReactNode;
    /** 唯一 key,显式指定后再次调用 open 同 key 会更新现有通知而不是新增 */
    key?: string;
    /** 关闭回调 */
    onClose?: () => void;
    /** 点击通知本体回调 */
    onClick?: () => void;
    /** 自定义关闭图标 */
    closeIcon?: ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
}

export interface NotificationItem extends NotificationConfig {
    /** 运行时唯一 key */
    key: string;
    /** 实际类型(已 fallback) */
    type: NotificationType;
    /** 实际 position(已 fallback) */
    position: NotificationPosition;
    /** placement 由 position 推导(用于出场动画方向) */
    placement: NotificationPlacement;
    /** 创建时间戳 */
    createdAt: number;
}
