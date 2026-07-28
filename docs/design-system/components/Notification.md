# Notification

Source: `src/components/Notification/NotificationPortal.tsx` (imperative API + global store + container) + `Notification.tsx` (single-item view) + `notification.module.less`.
**An imperative component** (like antd): there is no `<Notification>` JSX element — everything is triggered through `Notification.open / .success / .info / .warning / .error / .destroy`. The first call mounts a root container on `document.body` (`data-animal-notification-root`); afterwards `useSyncExternalStore` subscribes to store changes. SSR-safe (guarded by `typeof document`).

## Imperative API

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

## Root container (viewport layer)

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

> The top group (`top*`) stacks downwards from the top and appends new notifications to the end of the queue; the bottom group (`bottom*`) uses `flex-direction: column-reverse` so new notifications appear at the bottom.

## Single card (exact values)

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

## Structure (single item)

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

## Enter / leave animation (direction follows placement)

```css
.placement-top    { animation: animal-notification-slide-from-top 0.25s cubic-bezier(0.4,0,0.2,1) both; }
.placement-top.leaving    { animation: animal-notification-slide-out-top 0.25s cubic-bezier(0.4,0,0.2,1) both; }
.placement-bottom { animation: animal-notification-rise-from-bottom 0.25s cubic-bezier(0.4,0,0.2,1) both; }
.placement-bottom.leaving { animation: animal-notification-sink-out-bottom 0.25s cubic-bezier(0.4,0,0.2,1) both; }

/* top: enter sliding down from -16px, leave sliding back up */
@keyframes animal-notification-slide-from-top {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes animal-notification-slide-out-top {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-16px); }
}
/* bottom: enter rising up from +16px, leave sinking back down */
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

## Key implementation notes

- A global store (module-level `storeItems`) plus `useSyncExternalStore`; once subscribed, React components re-render through `setState`.
- Each `NotificationView` keeps its own `leaving` state: the user clicks × or the duration expires → `leaving=true` → the 250ms leave animation finishes → the `onRemove` callback deletes it from the store and fires `item.onClose`.
- With an explicit `key`, `open` first runs `findIndex` on existing keys; if found it replaces the item in the store (`next[idx] = item`), otherwise it appends. This suits streaming updates such as upload progress.
- **Caution**: once the user closes an item with ×, its key is gone from the store, so the next `open` with the same key is treated as "new" and pops up again. Callers need a closure `dismissed` flag to suppress the "user closed it and it came back" case. **Crucially**, `dismissed` must be set to `true` at the instant × is clicked, not only inside `onClose` — `onClose` waits for the 250ms leave animation, and during that window an `open` with the same key will revive the leaving notification in place. The correct approach is to set it synchronously in the `closeIcon` `onClick` (ahead of the parent button's `handleCloseClick`), and set it again in `onClose` as a fallback (see `demo/components/Notification/index.tsx`).
- **`destroy()` also fires `onClose` synchronously**: consistent with the "click × / duration expiry" contract, the removed item's `onClose` is called immediately (with no 250ms leave animation). This makes a closure flag set inside `onClose` effective across every close path — after the user hits "destroy all", subsequent queued `open` calls with the same key are also blocked by `dismissed`.
- Calling `Notification(config)` directly is equivalent to `Notification.open(config)` (type='info'). All methods share the `open` path and differ only in type.
- Note the type exports: `Notification` is a value (an API function object) and `NotificationStatic` is its type; the project barrel `src/index.ts` exports them separately to avoid colliding with the browser's global `Notification` constructor.
- The close button's `click` calls `stopPropagation` internally, so it never bubbles to the notification body and triggers `onClick`.
- When `onClick` is provided, the whole `<div>` is promoted to `role="button" tabIndex={0}` and responds to Enter / Space.

## Props (full signature)

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
