import type React from 'react';

// ============================================
// 字段名路径
// ============================================

/** 字段名路径 —— 支持点号分隔的嵌套字段（"user.name"）或数组 */
export type NamePath = string | number | (string | number)[];

/** 字段值（任意类型） */
export type StoreValue = unknown;

/** 内部统一转为字符串 path，便于 Map 存储 */
export function stringifyNamePath(name: NamePath): string {
    if (typeof name === 'string') return name;
    if (typeof name === 'number') return String(name);
    return name.map((n) => String(n)).join('.');
}

// ============================================
// 校验规则
// ============================================

export type RuleType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'email'
    | 'url'
    | 'date';

export interface RuleObject {
    /** 必填 */
    required?: boolean;
    /** 提示文本（验证失败时显示） */
    message?: string;
    /** 字符串/数组最小长度/最小值 */
    min?: number;
    /** 字符串/数组最大长度/最大值 */
    max?: number;
    /** 字符串/数组精确长度 */
    len?: number;
    /** 正则 */
    pattern?: RegExp;
    /** 空白字符也算校验失败（搭配 required） */
    whitespace?: boolean;
    /** 值类型 */
    type?: RuleType;
    /** 自定义校验器，可返回 Promise（异步） */
    validator?: (rule: RuleObject, value: unknown) => Promise<void | string> | void | string;
}

export type RuleRender = RuleObject | ((form: FormInstance) => RuleObject);
export type Rules = RuleRender[];

// ============================================
// 校验错误
// ============================================

export interface ValidateError {
    name: NamePath;
    errors: string[];
}

export interface ValidateInfo {
    values: Record<string, unknown>;
    errorFields: ValidateError[];
    outOfDate: boolean;
}

// ============================================
// 字段元数据
// ============================================

export interface FieldData {
    name: NamePath;
    value?: unknown;
    errors?: string[];
    touched?: boolean;
    validating?: boolean;
}

// ============================================
// Form 实例（命令式 API）
// ============================================

export interface FormInstance<T = Record<string, unknown>> {
    /** 取单个字段值 */
    getFieldValue: (name: NamePath) => unknown;
    /** 取所有/指定字段值 */
    getFieldsValue: (nameList?: NamePath[] | true) => T;
    /** 设置单个字段值（不触发校验） */
    setFieldValue: (name: NamePath, value: unknown) => void;
    /** 批量设置字段值 */
    setFieldsValue: (values: Partial<T>) => void;
    /** 重置字段（值回到 initialValues，错误清空） */
    resetFields: (nameList?: NamePath[]) => void;
    /** 校验指定字段（默认全部），reject 时为错误信息 */
    validateFields: (nameList?: NamePath[]) => Promise<T>;
    /** 提交（先校验，触发 onFinish 或 onFinishFailed） */
    submit: () => void;
    /** 批量更新字段状态（错误、值、touched、validating） */
    setFields: (fields: FieldData[]) => void;
    /** 是否被用户操作过 */
    isFieldTouched: (name: NamePath) => boolean;
    /** 是否正在校验中 */
    isFieldValidating: (name: NamePath) => boolean;
    /** 取字段错误 */
    getFieldError: (name: NamePath) => string[] | undefined;
    /** 滚动到字段（占位，scrollIntoBehavior 留给消费者） */
    scrollToField: (name: NamePath, options?: ScrollOptions) => void;
}

export interface ScrollOptions {
    behavior?: 'auto' | 'smooth';
    block?: 'start' | 'center' | 'end' | 'nearest';
    inline?: 'start' | 'center' | 'end' | 'nearest';
}

// ============================================
// Form 布局
// ============================================

export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export type FormLabelAlign = 'left' | 'right';
export type FormSize = 'small' | 'middle' | 'large';
export type RequiredMark = boolean | 'optional';

export interface ColProps {
    span?: number;
    offset?: number;
}

export interface FormProps<T = Record<string, unknown>> extends Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    'onSubmit' | 'children'
> {
    /** 受控 form 实例（Form.useForm() 产出） */
    form?: FormInstance<T>;
    /** 初始值 */
    initialValues?: Partial<T>;
    /** 布局方向 */
    layout?: FormLayout;
    /** label 对齐 */
    labelAlign?: FormLabelAlign;
    /** label 网格 */
    labelCol?: ColProps;
    /** 输入控件网格 */
    wrapperCol?: ColProps;
    /** 全局尺寸 */
    size?: FormSize;
    /** 全局禁用 */
    disabled?: boolean;
    /** label 后是否显示冒号 */
    colon?: boolean;
    /** 必填星号显示策略 */
    requiredMark?: RequiredMark;
    /** 校验通过 */
    onFinish?: (values: T) => void;
    /** 校验失败 */
    onFinishFailed?: (info: ValidateInfo) => void;
    /** 任意字段值变化 */
    onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
    /** reset 回调 */
    onReset?: (e: React.FormEvent<HTMLFormElement>) => void;
    children?: React.ReactNode;
}

// ============================================
// Form.Item
// ============================================

export type FormItemLayout = 'horizontal' | 'vertical';
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | '';

export interface FormItemProps {
    /** 字段名，必传（无 name 的 FormItem 仅作展示） */
    name?: NamePath;
    /** label 文本 */
    label?: React.ReactNode;
    /** 校验规则 */
    rules?: Rules;
    /** 是否必填（仅显示星号，校验仍以 rules.required 为准） */
    required?: boolean;
    /** 关联字段：依赖字段值变化时重置本字段错误 */
    dependencies?: NamePath[];
    /** 子节点接收的 value prop 名，默认 'value' */
    valuePropName?: string;
    /** 子节点接收的 change 事件 prop 名，默认 'onChange' */
    trigger?: string;
    /** 自定义从事件对象取值 */
    getValueFromEvent?: (event: unknown) => unknown;
    /** 设置前的标准化处理 */
    normalize?: (value: unknown, prevValue: unknown, prevAllValues: Record<string, unknown>) => unknown;
    /** 隐藏字段（不渲染、不参与布局） */
    hidden?: boolean;
    /** 显示校验状态图标 */
    hasFeedback?: boolean;
    /** 手动指定校验状态（覆盖 rules 推断） */
    validateStatus?: ValidateStatus;
    /** 帮助文本（错误时显示错误，否则显示 help） */
    help?: React.ReactNode;
    /** 不渲染外层 label/wrapper，仅包 children */
    noStyle?: boolean;
    /** 覆盖父级 labelCol */
    labelCol?: ColProps;
    /** 覆盖父级 wrapperCol */
    wrapperCol?: ColProps;
    /** 覆盖父级 colon */
    colon?: boolean;
    /** 覆盖父级 requiredMark */
    requiredMark?: RequiredMark;
    /** 覆盖父级 layout */
    layout?: FormItemLayout;
    /** 字段初始值（仅在挂载时生效一次） */
    initialValue?: StoreValue;
    /** 额外 className */
    className?: string;
    /** 子节点：通常是受控控件；无 name 时允许传入纯文本 */
    children?: React.ReactNode;
}
