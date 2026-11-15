/**
 * 页面滚动锁。Modal / Drawer / Upload 大图预览可以同时打开（抽屉里预览图片、
 * 弹窗里再开抽屉），所以用计数决定何时恢复；恢复时写回进入前的原值而不是 ''，
 * 否则会抹掉消费方自己设置过的 body overflow。
 */
let holders = 0;
let previousOverflow = '';

export function lockBodyScroll(): void {
    if (holders === 0) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    holders += 1;
}

export function unlockBodyScroll(): void {
    if (holders === 0) return;
    holders -= 1;
    if (holders === 0) {
        document.body.style.overflow = previousOverflow;
    }
}
