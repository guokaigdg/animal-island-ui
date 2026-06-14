import Form from './Form';

export { Form } from './Form';
export { useForm } from './useForm';
export { FormItem } from './FormItem';
export type { FormProviderProps } from './Form';

export type {
    ColProps,
    FieldData,
    FormInstance,
    FormItemLayout,
    FormItemProps,
    FormLabelAlign,
    FormLayout,
    FormProps,
    FormSize,
    NamePath,
    RequiredMark,
    RuleObject,
    RuleRender,
    RuleType,
    Rules,
    ScrollOptions,
    StoreValue,
    ValidateError,
    ValidateInfo,
    ValidateStatus,
} from './types';

// 兼容 `import Form from 'animal-island-ui'` 默认导入后使用 Form.Item
export default Form;
