import { createContext } from 'react';
import type { ColProps, FormInstance, FormLabelAlign, FormLayout, FormSize, RequiredMark } from './types';

export interface FormContextValue {
    /** Form 实例（提供注册、校验、命令式 API） */
    form: FormInstance;
    /** 字段名前缀 CSS class */
    prefixCls: string;
    /** 布局方向 */
    layout: FormLayout;
    /** label 对齐 */
    labelAlign: FormLabelAlign;
    /** label 网格 */
    labelCol?: ColProps;
    /** wrapper 网格 */
    wrapperCol?: ColProps;
    /** 全局尺寸 */
    size: FormSize;
    /** 全局禁用 */
    disabled: boolean;
    /** 是否显示冒号 */
    colon: boolean;
    /** 必填星号策略 */
    requiredMark: RequiredMark;
}

export const FormContext = createContext<FormContextValue | null>(null);
