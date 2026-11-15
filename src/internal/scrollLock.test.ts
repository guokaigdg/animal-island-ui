import { afterEach, describe, expect, it } from 'vitest';
import { lockBodyScroll, unlockBodyScroll } from './scrollLock';

describe('scrollLock', () => {
    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('首次加锁记下原值并置为 hidden，全部释放后原样还原', () => {
        document.body.style.overflow = 'scroll';
        lockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        unlockBodyScroll();
        expect(document.body.style.overflow).toBe('scroll');
    });

    it('嵌套加锁：释放一次不解锁，全部释放才还原', () => {
        lockBodyScroll();
        lockBodyScroll();
        unlockBodyScroll();
        expect(document.body.style.overflow).toBe('hidden');
        unlockBodyScroll();
        expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('多余的释放不会把计数带成负数', () => {
        lockBodyScroll();
        unlockBodyScroll();
        unlockBodyScroll();
        expect(document.body.style.overflow).not.toBe('hidden');
    });
});
