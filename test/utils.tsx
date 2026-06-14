import { useState, type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';

/**
 * 工具集说明
 * ----------------------------------------------------------------------------
 * 这些 helpers 解决测试中重复出现的两类问题：
 *
 * 1) 受控组件验证
 *    - `ControlledHost`  维护自身 state 并回写到子组件的 `value/checked`，
 *      用来验证"父级回写后 UI 同步"这条关键交互路径。
 *    - `createControlled`  高阶工厂：传入组件名 + value/checked 的 setter，
 *      自动产出对应的 ControlledHost —— 配合 setup() 使用。
 *
 * 2) 异步等待与 DOM 工具
 *    - `flushRaf`        useEffect 里 setState 走的 requestAnimationFrame，
 *                        jsdom 下需要手动 flush 一帧才能拿到新挂载的节点
 *    - `getByClass`      按 CSS Module hash 类名查询节点（vitest css:true 启用后可用）
 *    - `setup`           user-event 实例 + 常用 query 聚合
 */

// ============================================================================
// 1) 受控组件工厂
// ============================================================================

export type ControlledChildren<TValue, TChange> = (props: {
    value: TValue;
    onChange: (next: TChange) => void;
}) => ReactNode;

export type ControlledRenderProps<TValue, TChange> = {
    children: ControlledChildren<TValue, TChange>;
    initial?: TValue;
    onChange?: (next: TChange) => void;
};

/**
 * 通用受控宿主 —— 把父级 state 透传给被测组件的 value/onChange
 *
 * @example
 *   <ControlledHost<boolean>
 *       initial={false}
 *       onChange={onChangeSpy}
 *   >{({ value, onChange }) => <Switch checked={value} onChange={onChange} />}</ControlledHost>
 */
export function ControlledHost<TValue, TChange>({
    children,
    initial,
    onChange,
}: ControlledRenderProps<TValue, TChange>) {
    const [v, setV] = useState<TValue | undefined>(initial);
    const setVAndNotify = (next: TChange) => {
        setV(next as unknown as TValue);
        onChange?.(next);
    };
    return (
        <>
            {children({
                value: v as TValue,
                onChange: setVAndNotify,
            })}
        </>
    );
}

// ============================================================================
// 2) 异步 / DOM 工具
// ============================================================================

/**
 * 等待一帧 requestAnimationFrame，jsdom 下用来 flush useEffect 里 rAF 的 setState
 */
export async function flushRaf(): Promise<void> {
    await act(async () => {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
}

/**
 * 按 CSS Module hash 类名查询第一个匹配节点。
 * vitest.config 中 `css: true` 启用后，`styles.foo` 才是可用的类名 hash。
 *
 * @example
 *   const trigger = getByClass(styles.trigger);
 */
export function getByClass(className: string, container: HTMLElement = document.body): HTMLElement {
    const el = container.querySelector(`.${className}`);
    if (!el) {
        throw new Error(`[getByClass] 找不到 .${className}`);
    }
    return el as HTMLElement;
}

/** 在指定容器内按 class 名查询全部节点 */
export function getAllByClass(className: string, container: HTMLElement = document.body): HTMLElement[] {
    return Array.from(container.querySelectorAll(`.${className}`)) as HTMLElement[];
}

/** 按文本内容在指定 class 名容器内查询元素（避免与 trigger label 撞名） */
export function getByTextInContainer(
    text: string,
    containerClass: string,
    container: HTMLElement = document.body
): HTMLElement {
    const root = container.querySelector(`.${containerClass}`) as HTMLElement;
    if (!root) throw new Error(`[getByTextInContainer] 找不到 .${containerClass}`);
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('*')).filter(
        (el) => el.textContent?.includes(text) && el.children.length === 0
    );
    if (!nodes.length) {
        throw new Error(`[getByTextInContainer] 在 .${containerClass} 内找不到含 "${text}" 的文本节点`);
    }
    return nodes[0];
}

// ============================================================================
// 3) user-event 封装
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

// ============================================================================
// 4) render 封装（占位，目前只 re-export，方便后续统一 wrapper 注入）
// ============================================================================

export function renderWithWrapper(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
    return render(ui, options);
}
