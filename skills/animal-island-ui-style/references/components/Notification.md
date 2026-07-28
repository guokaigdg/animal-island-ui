# Notification (imperative) — API reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

Notification is **NOT a JSX component** — it's a static-method API (à la antd). Calling `Notification.success({...})` mounts a portal under `document.body`, renders the toast, and auto-unmounts after `duration` seconds. There is no `<Notification>` element to put in your tree.

## Types

```ts
type NotificationType = 'success' | 'info' | 'warning' | 'error';
type NotificationPosition =
    | 'top' // top-center (DEFAULT)
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight';

interface NotificationConfig {
    message: React.ReactNode; // REQUIRED
    description?: React.ReactNode;
    duration?: number; // seconds; default 4.5; pass 0 to disable auto-close
    position?: NotificationPosition; // default 'top'
    type?: NotificationType; // default depends on the called method
    icon?: React.ReactNode; // overrides the default type icon
    btn?: React.ReactNode; // action button rendered left of the close ×
    key?: string; // explicit key — re-calling with same key UPDATES the existing toast instead of adding a new one (use for progress / live updates)
    onClose?: () => void; // fires after the leave animation completes
    onClick?: () => void; // fires when the toast body is clicked (also makes it keyboard-activatable: Enter / Space)
    closeIcon?: React.ReactNode; // replaces the default ×
    className?: string;
    style?: React.CSSProperties;
}

interface NotificationStatic {
    (config: NotificationConfig | string): void; // direct call → type 'info'
    open: (config: NotificationConfig | string) => void;
    success: (config: NotificationConfig | string) => void;
    info: (config: NotificationConfig | string) => void;
    warning: (config: NotificationConfig | string) => void;
    error: (config: NotificationConfig | string) => void;
    destroy: (key?: string) => void; // no arg → close ALL toasts
}
```

## Usage

```tsx
import { Notification, Button } from 'animal-island-ui';

// String shortcut
Notification.success('保存成功!');
Notification.error('网络请求失败');

// Object form with description
Notification.info({
    message: '系统通知',
    description: '今天有流星雨,记得晚上 8 点去海滩许愿。',
});

// Positions
Notification.warning({ message: '顶部居中', position: 'top' });
Notification.warning({ message: '右下角', position: 'bottomRight' });

// Manual dismiss / no auto-close, with an action button
Notification.info({ message: '常驻通知', duration: 0, btn: <Button size="small">接受</Button> });

// Clickable toast
Notification.success({ message: '点击我', onClick: () => console.log('clicked') });

// Global destroy
Notification.destroy(); // close all
Notification.destroy('upload'); // close by key
```

Live update via shared key (e.g. upload progress). 同 key 走"原地更新"分支;闭包 `dismissed` 跟踪用户是否主动关闭。关键:`dismissed` 必须"点 × 瞬间"置 true,不能等 `onClose` 退场动画结束 (250ms),否则在 (click, 退场结束) 区间内排队的 `setTimeout` 仍会触发 open,把 leaving 态的同 key 通知原地更新复活。`closeIcon` 的 `onClick` 同步触发,先于父 button 的 `handleCloseClick`,`setLeaving` 之前就把 `dismissed` 置位。

```tsx
const uploadKey = 'upload';
let dismissed = false;
const markDismissed = () => { dismissed = true; };
const open = (percent, type = 'info', duration = 0) => {
    if (dismissed) return;
    Notification.info({
        message: percent === 100 ? `上传完成 ${percent}%` : `上传中... ${percent}%`,
        key: uploadKey,
        type,
        duration,
        closeIcon: <span onClick={markDismissed}>×</span>,
        onClose: () => { dismissed = true; },
    });
};
open(0);
setTimeout(() => open(50), 300);
setTimeout(() => open(100, 'success', 3), 600);
```

## Behavior

- **Imperative only.** There is no `<Notification>` JSX element — do not try to use one. All interaction goes through the static methods.
- **`config` accepts a plain string** as shorthand for `{ message: <string> }`. The other 12 fields are dropped in that case.
- **Default position is `top` (top-center)**. Pass `position` to use one of the 6 slots. Top/bottom placement groups are independent — toasts at the same position stack vertically, with the latest on top (for `top*`) or bottom (for `bottom*`).
- **Default `duration` is 4.5s.** Pass `0` to disable auto-close (toast persists until the user clicks × or `destroy` is called). The leave animation is `~250ms`.
- **Re-calling with the same `key` UPDATES** the in-place toast (used for upload progress / streaming status). Without `key`, each call appends a new toast.
- **User-dismissed toasts re-create on the next same-key call** (the `key` no longer exists in the store after close). If you want the dismiss to suppress future updates — typical for upload progress — gate subsequent calls behind a closure flag set inside `onClose` **AND** a `closeIcon` `onClick` that sets the same flag synchronously. The `onClose` path alone fires only after the 250ms leave animation, leaving a race window where queued `setTimeout` calls can still re-create the toast.
- **`Notification.destroy()`** with no argument closes every active toast. With a `key` argument it closes only that one. Both paths fire `onClose` for each removed item (synchronously, with no leave animation) — this is the same contract as the user-click and duration-expire paths, so closure-based suppression flags work consistently across all three close paths.
- **`onClick` upgrades the toast to a button** (`role="button"`, `tabIndex={0}`) — Enter / Space trigger `onClick`. The close × button has its own `stopPropagation` so it won't fire `onClick` on the parent.
- **Type determines default icon + accent color**: success = green `#6fba2c`, info = mint `#19c8b9`, warning = yellow `#f5c31c`, error = red `#e05a5a`. Pass `icon` to override.
- **Lifecycle**: first call lazily creates a single React root on `document.body` (`data-animal-notification-root`); the root stays mounted between toasts and re-renders on every store change via `useSyncExternalStore`. There is exactly one root per page regardless of toast count.
- **No CSS import required separately** — the root + per-type styles are bundled with the component. `import 'animal-island-ui/style'` is still required for the rest of the library.
