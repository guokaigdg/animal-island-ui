# Form components — props reference

Props/types below are copied from the library source. In an npm-installed project, the installed package's TypeScript declarations (`dist/types/index.d.ts`) are the ground truth — prefer exploring them when in doubt.

## Form

```ts
type FormLayout = 'horizontal' | 'vertical' | 'inline';
type FormLabelAlign = 'left' | 'right';
type FormSize = 'small' | 'middle' | 'large';
type RequiredMark = boolean | 'optional';
type NamePath = string | number | (string | number)[];

interface ColProps {
    span?: number; // default 24
    offset?: number; // default 0
}

interface FormProps<T = Record<string, unknown>>
    extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
    form?: FormInstance<T>; // controlled instance from useForm()
    initialValues?: Partial<T>;
    layout?: FormLayout; // default 'horizontal'
    labelAlign?: FormLabelAlign; // default 'right' (horizontal) / 'left' (vertical, inline)
    labelCol?: ColProps; // default { span: 6 }
    wrapperCol?: ColProps; // default { span: 18 }
    size?: FormSize; // default 'middle' — only scales label font-size
    disabled?: boolean; // default false — propagates to children via cloneElement
    colon?: boolean; // default true
    requiredMark?: RequiredMark; // default false
    onFinish?: (values: T) => void; // invoked after successful validateFields on submit
    onFinishFailed?: (info: ValidateInfo) => void;
    onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
    onReset?: (e: React.FormEvent<HTMLFormElement>) => void;
    children?: React.ReactNode;
}
```

```tsx
const [form] = useForm();

<Form
    form={form}
    initialValues={{ agree: false }}
    layout="horizontal"
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    onFinish={(values: { email: string; agree: boolean }) => console.log('submit', values)}
>
    <FormItem
        label="Email"
        name="email"
        rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' },
        ]}
    >
        <Input placeholder="you@example.com" allowClear />
    </FormItem>

    <FormItem label="Agree" name="agree" valuePropName="checked">
        <Switch />
    </FormItem>

    <FormItem wrapperCol={{ offset: 6, span: 18 }}>
        <Button type="primary" htmlType="submit" block>Submit</Button>
    </FormItem>
</Form>;
```

- **The API mirrors the conventional React form pattern** — `useForm`, `FormItem`, `initialValues`, `rules`, `onFinish`, `validateFields` all behave as expected.
- **Status colors intentionally diverge from the parchment palette.** Form uses conventional neutral status colors (`rgba(0,0,0,0.85)` text, `#ff4d4f` error, `#faad14` warning, `#52c41a` success, `#1677ff` validating). Do NOT recolor Form internals to `#725d42` etc.
- **`size` only scales the label font-size** (12 / 14 / 16 px). It does not resize the inner input — pass `size` to the inner `<Input size="large">` separately, or let it propagate from Form via cloneElement if the child supports it.
- **`disabled` propagates to children** via cloneElement when the child has no explicit `disabled` prop. Same for `size` and `status="error"`.
- **Horizontal layout uses a 24-column CSS Grid.** `labelCol` / `wrapperCol` map to `grid-column: start / span N`, with no column-gap between label and wrapper (otherwise the form overflows). Inline items stack label-over-control per item.
- **Default `labelCol` is `{ span: 6 }` and `wrapperCol` is `{ span: 18 }`.** To put a submit button flush-left under the inputs, use `<FormItem wrapperCol={{ offset: 6, span: 18 }}>` with no `name` (so it is not validated).

## FormItem

```ts
type FormItemLayout = 'horizontal' | 'vertical';
type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | '';

interface FormItemProps {
    name?: NamePath; // omit for display-only item (no field registration)
    label?: React.ReactNode;
    rules?: Rules;
    required?: boolean; // shows * (when requiredMark is on); validation still comes from rules.required
    dependencies?: NamePath[]; // revalidate this field when listed fields change
    valuePropName?: string; // default 'value' — prop injected into child
    trigger?: string; // default 'onChange' — event prop name on child
    getValueFromEvent?: (event: unknown) => unknown;
    normalize?: (value: unknown, prevValue: unknown, prevAllValues: Record<string, unknown>) => unknown;
    hidden?: boolean; // default false — render nothing (still registered)
    hasFeedback?: boolean; // default false — show ✕ icon on error
    validateStatus?: ValidateStatus; // override inferred status
    help?: React.ReactNode; // shown when no error
    noStyle?: boolean; // default false — skip label/wrapper shell, only clone children
    labelCol?: ColProps; // override parent
    wrapperCol?: ColProps; // override parent
    colon?: boolean; // override parent
    requiredMark?: RequiredMark; // override parent
    layout?: FormItemLayout; // override parent
    initialValue?: unknown; // applied once on mount
    className?: string;
    children?: React.ReactNode; // single controlled element — value/onChange injected
}
```

- **FormItem injects `value` / `onChange`** (or your custom `valuePropName` / `trigger`) into its child via `React.cloneElement`. The child must accept these props — most animal-island-ui inputs do. For checkbox / switch children use `valuePropName="checked"`.
- **FormItem must be rendered inside `<Form>`** (or `<Form.Provider>`), otherwise it throws at runtime.
- **`required` only controls the `*` mark visibility** (and only when `requiredMark !== false`); actual validation is driven by `rules: [{ required: true }]`.

## useForm

```ts
// Hook: factory for form instances
declare function useForm<T = Record<string, unknown>>(): [FormInstance<T>];

interface FormInstance<T = Record<string, unknown>> {
    getFieldValue: (name: NamePath) => unknown;
    getFieldsValue: (nameList?: NamePath[] | true) => T;
    setFieldValue: (name: NamePath, value: unknown) => void;
    setFieldsValue: (values: Partial<T>) => void;
    resetFields: (nameList?: NamePath[]) => void; // back to initialValues, clears errors
    validateFields: (nameList?: NamePath[]) => Promise<T>; // rejects with ValidateInfo on error
    submit: () => void; // validate → onFinish / onFinishFailed
    setFields: (fields: FieldData[]) => void;
    isFieldTouched: (name: NamePath) => boolean;
    isFieldValidating: (name: NamePath) => boolean;
    getFieldError: (name: NamePath) => string[] | undefined;
    scrollToField: (name: NamePath, options?: ScrollOptions) => void;
}

interface ScrollOptions {
    behavior?: 'auto' | 'smooth';
    block?: 'start' | 'center' | 'end' | 'nearest';
    inline?: 'start' | 'center' | 'end' | 'nearest';
}
```

```tsx
// Imperative validate / reset / set
const values = await form.validateFields();
form.resetFields();
form.setFieldValue('email', 'kai@example.com');
```

## Validation types (`rules`)

```ts
type RuleType = 'string' | 'number' | 'boolean' | 'integer' | 'float' | 'array' | 'object'
    | 'email' | 'url' | 'date';

interface RuleObject {
    required?: boolean;
    message?: string; // error message on failure
    min?: number; // min length / min value
    max?: number; // max length / max value
    len?: number; // exact length
    pattern?: RegExp;
    whitespace?: boolean; // treat whitespace as invalid (with required)
    type?: RuleType;
    validator?: (rule: RuleObject, value: unknown) => Promise<void | string> | void | string;
}

type RuleRender = RuleObject | ((form: FormInstance) => RuleObject);
type Rules = RuleRender[];

interface ValidateError {
    name: NamePath;
    errors: string[];
}

interface ValidateInfo {
    values: Record<string, unknown>;
    errorFields: ValidateError[];
    outOfDate: boolean;
}

interface FieldData {
    name: NamePath;
    value?: unknown;
    errors?: string[];
    touched?: boolean;
    validating?: boolean;
}
```
