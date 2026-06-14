import React, { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import styles from './Form.module.less';
import { FormContext, type FormContextValue } from './context';
import { useForm } from './useForm';
import { FormItem } from './FormItem';
import type { FormInstance, FormProps } from './types';

const prefixCls = 'island-form';

/**
 * 表单容器组件。
 *
 * - 监听原生 onSubmit：阻止默认提交后调用 form.submit()（先校验，触发 onFinish / onFinishFailed）
 * - 通过 FormContext 向 Form.Item 注入 form 实例、布局配置
 * - form 实例的 onValuesChange / onFinish / onFinishFailed 通过 ref 绑定，
 *   避免每次 props 变化重建实例
 */
function FormInner<T extends Record<string, unknown>>(
    props: FormProps<T>,
    ref: React.Ref<HTMLFormElement>
): React.ReactElement {
    const {
        form: formProp,
        initialValues,
        layout = 'horizontal',
        labelAlign = layout === 'horizontal' ? 'right' : 'left',
        labelCol,
        wrapperCol,
        size = 'middle',
        disabled = false,
        colon = true,
        requiredMark = false,
        onFinish,
        onFinishFailed,
        onValuesChange,
        onReset,
        className,
        children,
        ...rest
    } = props;

    // 是否用户传入 form 实例
    const isControlledForm = formProp !== undefined;
    // 总是用 useForm 兜底创建，传入则复用
    const [defaultForm] = useForm<T>();
    const formInstance = (isControlledForm ? formProp : defaultForm) as FormInstance<T>;

    // 用 ref 锁定最新回调，避免 form 实例重新创建
    const callbacksRef = useRef({ onFinish, onFinishFailed, onValuesChange });
    useEffect(() => {
        callbacksRef.current = { onFinish, onFinishFailed, onValuesChange };
    }, [onFinish, onFinishFailed, onValuesChange]);

    // 把 ref 上的回调桥接到 form 实例的隐式订阅
    useEffect(() => {
        const formAny = formInstance as unknown as {
            __bindCallbacks?: (c: typeof callbacksRef.current) => void;
        };
        if (typeof formAny.__bindCallbacks === 'function') {
            formAny.__bindCallbacks(callbacksRef.current);
        }
    }, [formInstance, onFinish, onFinishFailed, onValuesChange]);

    // 注入初始值：仅当 initialValues 内容（深比较）真正变化时同步给 form，
    // 避免父组件因其它状态 re-render 时用新引用、同内容对象把用户输入清空。
    // 用 ref 缓存上次的序列化结果，JSON.stringify 仅在 effect 实际触发时计算一次。
    const lastInitialKeyRef = useRef<string | undefined>(undefined);
    useEffect(() => {
        if (!initialValues) return;
        const key = JSON.stringify(initialValues);
        if (key === lastInitialKeyRef.current) return;
        lastInitialKeyRef.current = key;
        formInstance.setFieldsValue(initialValues as T);
    }, [initialValues, formInstance]);

    const ctxValue = useMemo<FormContextValue>(
        () => ({
            form: formInstance as unknown as FormContextValue['form'],
            prefixCls,
            layout,
            labelAlign,
            labelCol,
            wrapperCol,
            size,
            disabled,
            colon,
            requiredMark,
        }),
        [formInstance, layout, labelAlign, labelCol, wrapperCol, size, disabled, colon, requiredMark]
    );

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 实际提交逻辑：通过校验后调用 onFinish，否则 onFinishFailed
        formInstance.validateFields().then(
            (values) => {
                callbacksRef.current.onFinish?.(values as T);
            },
            (err: Error & { errorFields?: unknown[]; values?: unknown }) => {
                if (err && Array.isArray(err.errorFields)) {
                    callbacksRef.current.onFinishFailed?.({
                        values: (err.values ?? {}) as T,
                        errorFields: err.errorFields as never,
                        outOfDate: false,
                    });
                }
            }
        );
    };

    const handleReset: React.FormEventHandler<HTMLFormElement> = (e) => {
        // 由原生 <button type="reset"> 触发，e.preventDefault 阻止清空已注册的初始值
        e.preventDefault();
        formInstance.resetFields();
        onReset?.(e);
    };

    const cls = classNames(
        styles[prefixCls],
        styles[`${prefixCls}-${layout}`],
        styles[`${prefixCls}-${size}`],
        {
            [styles[`${prefixCls}-disabled`]]: disabled,
        },
        className
    );

    return (
        <FormContext.Provider value={ctxValue}>
            <form ref={ref} className={cls} onSubmit={handleSubmit} onReset={handleReset} {...rest}>
                {children}
            </form>
        </FormContext.Provider>
    );
}

type FormComponent = ((
    props: FormProps<Record<string, unknown>> & { ref?: React.Ref<HTMLFormElement> }
) => React.ReactElement) & {
    Item: typeof FormItem;
    useForm: typeof useForm;
    Provider: typeof FormProvider;
    displayName?: string;
};

/** 透传 ref 渲染 <form> 的主组件 */
export const Form = React.forwardRef(FormInner) as unknown as FormComponent;
Form.displayName = 'Form';

// ============================================
// 静态方法
// ============================================

/** 创建 form 实例（等价于 Form.useForm()） */
Form.useForm = useForm;

// ============================================
// Form.Provider：在表单树外层注入 form 实例，供嵌套组件读值
// ============================================

export interface FormProviderProps {
    form: FormInstance;
    children: React.ReactNode;
}

function FormProviderInner({ form, children }: FormProviderProps): React.ReactElement {
    const ctxValue = useMemo<FormContextValue>(
        () => ({
            form,
            prefixCls,
            layout: 'vertical',
            labelAlign: 'left',
            size: 'middle',
            disabled: false,
            colon: true,
            requiredMark: false,
        }),
        [form]
    );
    return <FormContext.Provider value={ctxValue}>{children}</FormContext.Provider>;
}

const FormProvider = FormProviderInner as unknown as React.FC<FormProviderProps>;
FormProvider.displayName = 'FormProvider';

// 把 Form.Item 挂上
Form.Item = FormItem;
Form.Provider = FormProvider;

// 默认导出：方便 `import Form from './Form'` 后使用 Form.Item
export default Form;
