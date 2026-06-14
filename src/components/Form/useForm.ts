import { useRef } from 'react';
import { runRule } from './validators';
import type { FieldData, FormInstance, NamePath, RuleObject, Rules, ScrollOptions, ValidateError } from './types';
import { stringifyNamePath } from './types';

// ============================================
// 字段元数据 + 订阅
// ============================================

interface FieldMeta {
    /** 字符串化的字段名（Map key） */
    key: string;
    /** 校验规则（render 函数已 resolve） */
    rules: Rules;
    /** 初始值快照（用于 resetFields） */
    initialValue: unknown;
    /** 是否已设置过 initialValue（避免覆盖） */
    initialSet: boolean;
    /** 字段所属 Form 触发 onValuesChange 时用：当前值 */
    currentValue: unknown;
    /** FormItem 订阅通知 */
    notify: () => void;
}

// ============================================
// 内部 store 创建
// ============================================

interface FormStore {
    registerField: (name: NamePath, rules: Rules, initialValue: unknown, notify: () => void) => void;
    unregisterField: (name: NamePath) => void;
    /** 当前是否已有该字段（用于 FormItem 初始化时避免覆盖 setFieldsValue） */
    hasField: (name: NamePath) => boolean;
    /** 更新字段的 rules（不重新注册） */
    updateRules: (name: NamePath, rules: Rules) => void;
    /** 通知所有已注册字段重新渲染 */
    notifyAll: () => void;
    /** 遍历字段元数据 */
    forEachField: (cb: (meta: { key: string; rules: Rules; notify: () => void }) => void) => void;
}

function createFormStore(): FormStore {
    const fields = new Map<string, FieldMeta>();

    const notifyAll = (): void => {
        fields.forEach((meta) => {
            try {
                meta.notify();
            } catch {
                // 单个 FormItem 通知失败不影响其他字段
            }
        });
    };

    const forEachField = (cb: (meta: { key: string; rules: Rules; notify: () => void }) => void): void => {
        fields.forEach((meta) => {
            cb({ key: meta.key, rules: meta.rules, notify: meta.notify });
        });
    };

    return {
        registerField(name, rules, initialValue, notify) {
            const key = stringifyNamePath(name);
            if (!fields.has(key)) {
                fields.set(key, {
                    key,
                    rules,
                    initialValue,
                    initialSet: initialValue !== undefined,
                    currentValue: initialValue,
                    notify,
                });
            } else {
                // 已存在：仅更新 rules 和 notify
                const meta = fields.get(key);
                if (meta) {
                    meta.rules = rules;
                    meta.notify = notify;
                }
            }
        },
        unregisterField(name) {
            fields.delete(stringifyNamePath(name));
        },
        hasField(name) {
            return fields.has(stringifyNamePath(name));
        },
        updateRules(name, rules) {
            const key = stringifyNamePath(name);
            const meta = fields.get(key);
            if (meta) {
                meta.rules = rules;
            }
        },
        notifyAll,
        forEachField,
    };
}

// ============================================
// Form 实例创建
// ============================================

interface FormOptions {
    initialValues?: Record<string, unknown>;
    onValuesChange?: (changed: Record<string, unknown>, all: Record<string, unknown>) => void;
    onFinish?: (values: Record<string, unknown>) => void;
    onFinishFailed?: (info: {
        values: Record<string, unknown>;
        errorFields: ValidateError[];
        outOfDate: boolean;
    }) => void;
    /** 提交回调：Form 触发 submit 时调用（先校验） */
    submit: () => void;
}

function createFormInstance(options: FormOptions): FormInstance {
    const store = new Map<string, unknown>();
    const initialStore = new Map<string, unknown>();
    const errorsStore = new Map<string, string[]>();
    const touchedSet = new Set<string>();
    const validatingSet = new Set<string>();
    const fieldStore = createFormStore();

    // 初始值写入
    if (options.initialValues) {
        Object.keys(options.initialValues).forEach((k) => {
            store.set(k, options.initialValues?.[k]);
            initialStore.set(k, options.initialValues?.[k]);
        });
    }

    function getFieldValue(name: NamePath): unknown {
        return store.get(stringifyNamePath(name));
    }

    function getFieldsValue(nameList?: NamePath[] | true): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        if (nameList === true || !nameList) {
            store.forEach((v, k) => {
                result[k] = v;
            });
        } else {
            nameList.forEach((n) => {
                const k = stringifyNamePath(n);
                if (store.has(k)) result[k] = store.get(k);
            });
        }
        return result;
    }

    function setFieldValue(name: NamePath, value: unknown): void {
        const key = stringifyNamePath(name);
        const prev = store.get(key);
        store.set(key, value);
        touchedSet.add(key);
        // 通知对应 FormItem
        fieldStore.forEachField((meta) => {
            if (meta.key === key) meta.notify();
        });
        if (prev !== value) {
            options.onValuesChange?.({ [key]: value }, getFieldsValue(true));
        }
    }

    function setFieldsValue(values: Record<string, unknown>): void {
        Object.keys(values).forEach((k) => {
            store.set(k, values[k]);
            // 首次写入时同步到 initialStore（resetFields 用）
            if (!initialStore.has(k)) {
                initialStore.set(k, values[k]);
            }
        });
        // 通知所有字段
        fieldStore.notifyAll();
    }

    function resetFields(nameList?: NamePath[]): void {
        const keys = nameList ? nameList.map(stringifyNamePath) : Array.from(store.keys());
        keys.forEach((k) => {
            // 还原到 initialStore 记录的值；没有记录则清空
            store.set(k, initialStore.get(k));
            errorsStore.delete(k);
            touchedSet.delete(k);
        });
        fieldStore.notifyAll();
    }

    function isFieldTouched(name: NamePath): boolean {
        return touchedSet.has(stringifyNamePath(name));
    }

    function isFieldValidating(name: NamePath): boolean {
        return validatingSet.has(stringifyNamePath(name));
    }

    function getFieldError(name: NamePath): string[] | undefined {
        return errorsStore.get(stringifyNamePath(name));
    }

    function setFields(fields: FieldData[]): void {
        fields.forEach((f) => {
            const key = stringifyNamePath(f.name);
            if (f.value !== undefined) store.set(key, f.value);
            if (f.errors !== undefined) {
                if (f.errors.length === 0) errorsStore.delete(key);
                else errorsStore.set(key, f.errors);
            }
            if (f.touched) touchedSet.add(key);
            if (f.validating) validatingSet.add(key);
            else validatingSet.delete(key);
        });
        fieldStore.notifyAll();
    }

    async function validateFields(nameList?: NamePath[]): Promise<Record<string, unknown>> {
        const targetMetas: { key: string; rules: Rules }[] = [];
        fieldStore.forEachField((meta) => {
            if (!nameList || nameList.some((n) => stringifyNamePath(n) === meta.key)) {
                targetMetas.push({ key: meta.key, rules: meta.rules });
            }
        });

        // 标记 validating
        targetMetas.forEach((m) => validatingSet.add(m.key));
        fieldStore.notifyAll();

        const errorFields: ValidateError[] = [];
        await Promise.all(
            targetMetas.map(async (meta) => {
                const value = store.get(meta.key);
                const ruleList = meta.rules;
                const errs: string[] = [];
                for (const r of ruleList) {
                    const rule: RuleObject = typeof r === 'function' ? r(formInstance) : r;
                    try {
                        await runRule(rule, value);
                    } catch (e) {
                        errs.push(e instanceof Error ? e.message : String(e));
                    }
                }
                if (errs.length > 0) {
                    errorsStore.set(meta.key, errs);
                    touchedSet.add(meta.key);
                    errorFields.push({ name: meta.key, errors: errs });
                } else {
                    errorsStore.delete(meta.key);
                }
            })
        );

        targetMetas.forEach((m) => validatingSet.delete(m.key));
        fieldStore.notifyAll();

        if (errorFields.length > 0) {
            const err = new Error('Validation failed') as Error & {
                errorFields: ValidateError[];
                values: Record<string, unknown>;
            };
            err.errorFields = errorFields;
            err.values = getFieldsValue(true);
            throw err;
        }
        return getFieldsValue(true);
    }

    function submit(): void {
        validateFields()
            .then((values) => {
                options.onFinish?.(values);
            })
            .catch((err: Error & { errorFields?: ValidateError[]; values?: Record<string, unknown> }) => {
                if (err && err.errorFields && err.values !== undefined) {
                    options.onFinishFailed?.({
                        values: err.values,
                        errorFields: err.errorFields,
                        outOfDate: false,
                    });
                }
            });
    }

    /**
     * 由 <Form> 注入最新回调引用，避免 options 闭包过期。
     * 也用于支持受控 form（form 实例由 useForm 创建，Form 组件后续桥接 onFinish 等）。
     */
    function bindCallbacks(c: {
        onFinish?: (values: Record<string, unknown>) => void;
        onFinishFailed?: (info: {
            values: Record<string, unknown>;
            errorFields: ValidateError[];
            outOfDate: boolean;
        }) => void;
        onValuesChange?: (changed: Record<string, unknown>, all: Record<string, unknown>) => void;
    }): void {
        if (c.onFinish) options.onFinish = c.onFinish;
        if (c.onFinishFailed) options.onFinishFailed = c.onFinishFailed;
        if (c.onValuesChange) options.onValuesChange = c.onValuesChange;
    }

    function scrollToField(name: NamePath, _options?: ScrollOptions): void {
        // 占位：实际滚动交给消费者，组件库不强耦合 DOM API
        const key = stringifyNamePath(name);
        // 找到对应 FormItem 渲染的 DOM 元素（通过 data-field-name 属性）
        if (typeof document !== 'undefined') {
            const el = document.querySelector(`[data-field-name="${key}"]`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    const formInstance: FormInstance = {
        getFieldValue,
        getFieldsValue,
        setFieldValue,
        setFieldsValue,
        resetFields,
        validateFields,
        submit,
        setFields,
        isFieldTouched,
        isFieldValidating,
        getFieldError,
        scrollToField,
    };

    // 暴露内部 store 给 FormItem 使用（避免循环依赖，靠一个特殊 prop）
    (formInstance as unknown as { __store: FormStore }).__store = fieldStore;
    // 暴露 bind 钩子供 <Form> 注入回调
    (formInstance as unknown as { __bindCallbacks: typeof bindCallbacks }).__bindCallbacks = bindCallbacks;

    return formInstance;
}

// ============================================
// useForm hook
// ============================================

export function useForm<T = Record<string, unknown>>(options?: Omit<FormOptions, 'submit'>): [FormInstance<T>] {
    const formRef = useRef<FormInstance<T> | null>(null);
    if (!formRef.current) {
        // 首次渲染创建实例；submit 由 Form 组件绑定
        const inst = createFormInstance({
            ...(options as FormOptions | undefined),
            submit: () => inst.submit(),
        });
        formRef.current = inst as unknown as FormInstance<T>;
    }
    return [formRef.current as FormInstance<T>];
}
