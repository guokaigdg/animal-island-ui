# Notification

源码：`src/components/Notification/NotificationPortal.tsx`（命令式 API + 全局 store + 容器） + `Notification.tsx`（单条视图） + `notification.module.less`。
**命令式组件**（类似 antd）：无 `<Notification>` JSX 元素，全部通过 `Notification.open / .success / .info / .warning / .error / .destroy` 触发；首次调用时在 `document.body` 挂一个根容器（`data-animal-notification-root`），后续 `useSyncExternalStore` 订阅 store 变化。SSR 安全（typeof document 守卫）。

## 命令式 API

```tsx
// 6 static methods, config can be a string (message only) or a full object
Notification.open({ message: '...', description: '...', type: 'info', position: 'top', duration: 4.5 });
Notification.success('Saved!');
Notification.error({ message: 'Network error', description: 'Please try again later' });
Notification.warning('Out of stock');
Notification.info('System notice');
Notification.destroy();        // close all
Notification.destroy('upload'); // close a specific key
```

## 根容器（视口层）

```css
.notificationRoot {
    position: fixed;
    inset: 0;
    pointer-events: none; /* the notifications themselves are pointer-events: auto, the root passes clicks through */
    z-index: 2000; /* above Modal(1000)/Drawer(1001) */
}

/* 6 fixed containers, each aligned to its position, stacking in an inner column */
.position-top, .position-topLeft, .position-topRight,
.position-bottom, .position-bottomLeft, .position-bottomRight {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
    max-width: calc(100vw - 32px);
}
.position-top       { top: 24px; left: 50%; transform: translateX(-50%); align-items: center; }
.position-topLeft   { top: 24px; left: 24px; align-items: flex-start; }
.position-topRight  { top: 24px; right: 24px; align-items: flex-end; }
.position-bottom       { bottom: 24px; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse; }
.position-bottomLeft   { bottom: 24px; left: 24px; align-items: flex-start; flex-direction: column-reverse; }
.position-bottomRight  { bottom: 24px; right: 24px; align-items: flex-end; flex-direction: column-reverse; }
```

> 顶部组（`top*`）从顶向下堆叠，新通知追加到队尾；底部组（`bottom*`）使用 `flex-direction: column-reverse` 让新通知出现在最下方。

## 单条卡片（精确值）

```css
.notification {
    pointer-events: auto;
    box-sizing: border-box;
    display: flex; align-items: flex-start; gap: 12px;
    width: 384px;
    max-width: calc(100vw - 48px);
    padding: 14px 16px;
    background: rgb(247, 243, 223);
    border: 2px solid #c4b89e; /* when no type is given */
    border-radius: 18px;
    box-shadow: 0 6px 18px rgba(61, 52, 40, 0.14);
    color: #725d42;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    will-change: transform, opacity;
}

/* the 4 types override border + shadow + icon background */
.type-success  { border-color: #6fba2c; box-shadow: 0 6px 18px rgba(111, 186, 44, 0.18); }
.type-success  .iconWrap { background: #e9f6d4; color: #5a9e1e; }
.type-info     { border-color: #19c8b9; box-shadow: 0 6px 18px rgba(25, 200, 185, 0.18); }
.type-info     .iconWrap { background: #e6f9f6; color: #11a89b; }
.type-warning  { border-color: #f5c31c; box-shadow: 0 6px 18px rgba(245, 195, 28, 0.20); }
.type-warning  .iconWrap { background: #fdf3c4; color: #b88a06; }
.type-error    { border-color: #e05a5a; box-shadow: 0 6px 18px rgba(224, 90, 90, 0.18); }
.type-error    .iconWrap { background: #fbe0e0; color: #c94444; }

/* when clickable (onClick provided) */
.clickable { cursor: pointer; }
.clickable:hover  { box-shadow: 0 10px 26px rgba(61, 52, 40, 0.18); transform: translateY(-1px); }
.clickable:focus-visible { outline: 2px solid #ffcc00; outline-offset: 2px; }
```

## 结构（单条）

```css
.iconWrap { /* 32×32 circle */
    flex: 0 0 auto;
    width: 32px; height: 32px;
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 18px; line-height: 1;
    user-select: none;
    /* colours injected by .type-* */
}
.body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.title       { font-size: 15px; font-weight: 700; line-height: 1.4; color: #794f27; letter-spacing: 0.01em; }
.description { font-size: 13px; font-weight: 500; line-height: 1.55; color: #8a7b66; letter-spacing: 0.01em; }
.btnSlot { flex: 0 0 auto; margin-left: 4px; }
.close { /* 22×22 round × button */
    width: 22px; height: 22px;
    color: rgba(114, 93, 66, 0.55);
    background: transparent;
    border-radius: 50%;
    font-size: 18px; line-height: 1;
    transition: all 0.15s ease;
}
.close:hover         { background: rgba(114, 93, 66, 0.12); color: rgba(114, 93, 66, 1); }
.close:focus-visible { outline: 2px solid #ffcc00; outline-offset: 2px; }
```

## 入场 / 退场动画（按 placement 分方向）

```css
.placement-top    { animation: animal-notification-slide-from-top 0.25s cubic-bezier(0.4,0,0.2,1) both; }
.placement-top.leaving    { animation: animal-notification-slide-out-top 0.25s cubic-bezier(0.4,0,0.2,1) both; }
.placement-bottom { animation: animal-notification-rise-from-bottom 0.25s cubic-bezier(0.4,0,0.2,1) both; }
.placement-bottom.leaving { animation: animal-notification-sink-out-bottom 0.25s cubic-bezier(0.4,0,0.2,1) both; }

/* top 方向：从 -16px 滑入，离场向上滑出 */
@keyframes animal-notification-slide-from-top {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes animal-notification-slide-out-top {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-16px); }
}
/* bottom 方向：从 +16px 升入，离场向下沉出 */
@keyframes animal-notification-rise-from-bottom {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes animal-notification-sink-out-bottom {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(16px); }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
    .placement-top, .placement-bottom,
    .placement-top.leaving, .placement-bottom.leaving {
        animation-duration: 0.01s;
    }
}
```

## 关键实现要点

- 全局 store（module-level `storeItems`）+ `useSyncExternalStore`，React 组件订阅后通过 `setState` 触发 re-render。
- 单条 `NotificationView` 内部维护 `leaving` 状态：用户点击 × 或 duration 到期 → 设置 `leaving=true` → 250ms 退场动画结束 → 回调 `onRemove` 从 store 删除并触发 `item.onClose`。
- 显式 `key` 时，`open` 会先 `findIndex` 现有 key，存在则替换 store 中的 item（用 `next[idx] = item`），否则追加。适合上传进度等流式更新场景。
- **注意**：用户点 × 关闭后 key 已在 store 中消失，下次同 key `open` 会被当作"新增"再次弹出。需要在调用方用闭包 `dismissed` 标志来抑制"用户已关掉又被弹回来"的场景。**关键**：`dismissed` 必须"点 × 瞬间"置 `true`，不能只放在 `onClose` 里 —— `onClose` 要等 250ms 退场动画结束，期间同 key `open` 仍会把 leaving 态的通知原地更新复活。正确做法：在 `closeIcon` 的 `onClick` 里同步置位（先于父 button 的 handleCloseClick），`onClose` 里再置一次作兜底（参考 `demo/components/Notification/index.tsx`）。
- **`destroy()` 也会同步触发 `onClose`**：与"点 × / duration 到期"契约一致,被移除项的 `onClose` 立即调用(无 250ms 退场动画)。这样在 onClose 里设的闭包标志位能跨所有关闭路径统一生效 —— 用户点 "destroy 关闭全部" 后,后续排队的同 key open 也会被 `dismissed` 拦截。
- `Notification(config)` 直接调用等价于 `Notification.open(config)`（type='info'）。所有方法共享 `open` 路径，仅 type 不同。
- 注意类型导出：`Notification` 是值（API 函数对象），`NotificationStatic` 是其类型；项目 barrel `src/index.ts` 已分别导出，避免与浏览器全局 `Notification` 构造器同名冲突。
- 关闭按钮的 `click` 内部 `stopPropagation`，不会冒泡到通知本体触发 `onClick`。
- 提供 `onClick` 时整个 `<div>` 升格为 `role="button" tabIndex={0}`，支持 Enter / Space 键盘触发。

## Props 完整签名

```ts
type NotificationType = 'success' | 'info' | 'warning' | 'error';
type NotificationPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
type NotificationPlacement = 'top' | 'bottom';

interface NotificationConfig {
    message: ReactNode;              // required
    description?: ReactNode;
    duration?: number;               // default 4.5 seconds, 0 disables auto-close
    position?: NotificationPosition; // default 'top' (top centre)
    type?: NotificationType;
    icon?: ReactNode;                // overrides the type default icon
    btn?: ReactNode;                 // custom action button
    key?: string;                    // calling again with the same key updates the existing notification
    onClose?: () => void;            // fires when the leave animation ends
    onClick?: () => void;            // fires when the notification body is clicked
    closeIcon?: ReactNode;
    className?: string;
    style?: CSSProperties;
}
```
