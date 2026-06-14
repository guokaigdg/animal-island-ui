import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './Form.module.less';
import { FormContext } from './context';
import { stringifyNamePath } from './types';
import type { FormItemProps, NamePath, Rules, StoreValue } from './types';

/**
 * 从原生 event 对象中取目标值。覆盖典型控件：
 *  - input / textarea：event.target.value
 *  - checkbox：event.target.checked（仅当 target.type === 'checkbox'）
 *  - 自定义组件：直接返回 event 本身
 */
function defaultGetValueFromEvent(event: unknown): StoreValue {
    if (event === null || event === undefined) return event;
    if (typeof event !== 'object') return event;
    const target = (event as { target?: { value?: unknown; checked?: unknown; type?: string } }).target;
    if (target && typeof target === 'object') {
        // checkbox / radio 用 checked
        if (target.type === 'checkbox' || target.type === 'radio') {
            if ('checked' in target) return target.checked;
        }
        // 普通 input/textarea：优先 value（即使没显式赋值，DOM 上也常带 checked 字段，不能靠 in 判断）
        if ('value' in target && target.value !== undefined) return target.value;
    }
    // 自定义组件可能直接传 value
    if ('value' in (event as Record<string, unknown>)) {
        return (event as { value: unknown }).value;
    }
    return event;
}

const prefixCls = 'island-form-item';

export const FormItem: React.FC<FormItemProps> = (props) => {
    const {
        name,
        label,
        rules = [],
        required = false,
        valuePropName = 'value',
        trigger = 'onChange',
        getValueFromEvent = defaultGetValueFromEvent,
        normalize,
        hidden = false,
        hasFeedback = false,
        validateStatus,
        help,
        noStyle = false,
        labelCol,
        wrapperCol,
        colon,
        requiredMark,
        layout: itemLayout,
        className,
        children,
    } = props;

    const ctx = useContext(FormContext);
    if (!ctx) {
        throw new Error('Form.Item must be used inside <Form> or <Form.Provider>');
    }

    const {
        form,
        prefixCls: formPrefixCls,
        layout: ctxLayout,
        labelAlign,
        labelCol: ctxLabelCol,
        wrapperCol: ctxWrapperCol,
        size,
        disabled: ctxDisabled,
        colon: ctxColon,
        requiredMark: ctxRequiredMark,
    } = ctx;

    // 字段在 form 中的字符串 key
    const fieldKey = useMemo(() => (name !== undefined ? stringifyNamePath(name) : null), [name]);

    // 订阅触发器（每次 form 状态变化时 setState 重新渲染）
    const [, setTick] = useState(0);
    const notify = useCallback(() => setTick((t) => t + 1), []);

    // 注册 / 注销 —— 只在 fieldKey 变化时注册/注销
    useEffect(() => {
        if (!fieldKey) return;
        const formAny = form as unknown as {
            __store?: {
                registerField: (n: NamePath, rules: Rules, initialValue: unknown, notify: () => void) => void;
                unregisterField: (n: NamePath) => void;
                updateRules: (n: NamePath, rules: Rules) => void;
            };
        };
        const store = formAny.__store;
        if (!store) return;
        store.registerField(name!, rules, undefined, notify);
        return () => store.unregisterField(fieldKey);
        // rules 变化通过下方独立 effect 更新，避免重新注册
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, fieldKey, name, notify]);

    // rules 变化时同步到已注册的字段元数据
    useEffect(() => {
        if (!fieldKey) return;
        const formAny = form as unknown as {
            __store?: {
                updateRules: (n: NamePath, rules: Rules) => void;
            };
        };
        formAny.__store?.updateRules?.(fieldKey, rules);
    }, [rules, fieldKey, form]);

    if (hidden) return null;

    // 当前字段值
    const value = fieldKey ? form.getFieldValue(name as never) : undefined;
    // 当前字段错误
    const errors = fieldKey ? form.getFieldError(name as never) : undefined;
    const isValidating = fieldKey ? form.isFieldValidating(name as never) : false;
    const touched = fieldKey ? form.isFieldTouched(name as never) : false;

    // 推算 validateStatus
    const computedStatus = validateStatus ?? (isValidating ? 'validating' : errors?.[0] ? 'error' : '');
    // 显示的错误（help 优先，否则取第一条）
    const displayError = touched && errors?.[0] ? errors[0] : undefined;
    const showHelp = displayError ?? help;

    // 必填星号判定
    const mergedRequiredMark = requiredMark ?? ctxRequiredMark;
    const isRequired = required || rules.some((r) => (typeof r === 'object' ? r.required : false));
    const showRequiredMark = isRequired && mergedRequiredMark !== false;

    // 处理子元素：克隆并注入 value / onChange
    const childIsElement = React.isValidElement(children);
    const childProps: Record<string, unknown> = childIsElement ? { ...(children.props as object) } : {};
    if (fieldKey && childIsElement) {
        childProps[valuePropName] = value;
        const userTrigger = childProps[trigger];
        childProps[trigger] = (event: unknown) => {
            // 先调用用户的 trigger（保留链式回调）
            if (typeof userTrigger === 'function') {
                (userTrigger as (e: unknown) => void)(event);
            }
            // 取值
            const rawValue = getValueFromEvent(event);
            const prevValue = form.getFieldValue(name as never);
            const finalValue = normalize ? normalize(rawValue, prevValue, form.getFieldsValue(true)) : rawValue;
            form.setFieldValue(name as never, finalValue);
        };
    }

    // disabled 透传
    if (ctxDisabled && childProps.disabled === undefined) {
        childProps.disabled = true;
    }
    // size 透传（如果有 child 支持）
    if (childProps.size === undefined) {
        childProps.size = size;
    }
    // status 透传
    if (childProps.status === undefined && computedStatus === 'error') {
        childProps.status = 'error';
    }

    const renderChildren = fieldKey && childIsElement ? React.cloneElement(children, childProps) : children;

    // 布局：inline 模式下 FormItem 退化为 vertical（每个 item 独占一行）
    const itemLayoutTyped = (itemLayout ?? ctxLayout) as 'horizontal' | 'vertical' | 'inline';
    const layout: 'horizontal' | 'vertical' | 'inline' = itemLayoutTyped === 'inline' ? 'vertical' : itemLayoutTyped;
    const mergedLabelCol = labelCol ?? ctxLabelCol;
    const mergedWrapperCol = wrapperCol ?? ctxWrapperCol;
    const showColon = colon ?? ctxColon;

    // CSS Grid 模板：form-item 是 24 列 grid，label 占 labelCol.span，wrapper 接在 label 后面
    const buildGridStyle = (col: { span?: number; offset?: number } | undefined, startCol = 1): React.CSSProperties => {
        if (!col) return {};
        const span = col.span ?? 24;
        const offset = col.offset ?? 0;
        return {
            gridColumn: `${startCol + offset} / span ${span}`,
        };
    };

    // wrapper 的起始列 = label 结束列 + 1（即 labelCol.span + labelCol.offset + 1）
    const labelEndCol = (mergedLabelCol?.span ?? 0) + (mergedLabelCol?.offset ?? 0);
    const labelColStyle = buildGridStyle(mergedLabelCol, 1);
    const wrapperColStyle = buildGridStyle(mergedWrapperCol, labelEndCol + 1);

    const rootCls = classNames(
        formPrefixCls ? styles[`${formPrefixCls}-item`] : styles[prefixCls],
        styles[`${prefixCls}-${layout}`],
        styles[`${prefixCls}-${size}`],
        {
            [styles[`${prefixCls}-has-error`]]: computedStatus === 'error',
            [styles[`${prefixCls}-has-warning`]]: computedStatus === 'warning',
            [styles[`${prefixCls}-has-success`]]: computedStatus === 'success',
            [styles[`${prefixCls}-is-validating`]]: computedStatus === 'validating',
            [styles[`${prefixCls}-required`]]: showRequiredMark,
        },
        className
    );

    const labelNode =
        label !== undefined ? (
            <label
                htmlFor={fieldKey ?? undefined}
                className={classNames(styles[`${prefixCls}-label`], {
                    [styles[`${prefixCls}-label-required`]]: showRequiredMark,
                    [styles[`${prefixCls}-label-colon`]]: showColon && label !== '',
                })}
                style={{ ...labelColStyle, textAlign: labelAlign }}
            >
                {label}
            </label>
        ) : null;

    const helpNode =
        showHelp !== undefined ? (
            <div
                className={classNames(styles[`${prefixCls}-explain`], {
                    [styles[`${prefixCls}-explain-error`]]: computedStatus === 'error',
                })}
            >
                {hasFeedback && computedStatus === 'error' ? (
                    <span className={styles[`${prefixCls}-feedback-icon`]}>✕</span>
                ) : null}
                {showHelp}
            </div>
        ) : null;

    if (noStyle) {
        return (
            <>
                {renderChildren}
                {helpNode}
            </>
        );
    }

    // layout 在此只能是 'horizontal' | 'vertical'（'inline' 已在前面折叠成 'vertical'）
    return (
        <div className={rootCls} data-field-name={fieldKey ?? undefined}>
            {labelNode}
            <div className={styles[`${prefixCls}-control`]} style={wrapperColStyle}>
                <div className={styles[`${prefixCls}-control-input`]}>{renderChildren}</div>
                {helpNode}
            </div>
        </div>
    );
};
