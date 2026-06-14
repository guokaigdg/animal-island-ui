import { useState, type ReactNode } from 'react';

// ============================================================================
// 受控组件工厂
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
    return <>{children({ value: v as TValue, onChange: setVAndNotify })}</>;
}
