import userEvent from '@testing-library/user-event';

// ============================================================================
// user-event 封装
// ============================================================================

export type UserEvent = ReturnType<typeof userEvent.setup>;

/**
 * 默认 setup 工厂 —— 创建 userEvent 实例并返回
 *
 * @example
 *   it('xxx', async () => {
 *       const user = setup();
 *       await user.click(btn);
 *   });
 */
export function setup(): UserEvent {
    return userEvent.setup();
}
