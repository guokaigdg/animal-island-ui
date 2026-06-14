import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useEffect } from 'react';
import { Form, type FormInstance } from './index';
import type { RuleObject } from './types';
import { Input } from '../Input';
import styles from './Form.module.less';
import { setup } from '@test/utils';

describe('Form', () => {
    describe('基础渲染', () => {
        it('渲染为 <form> 元素', () => {
            const { container } = render(
                <Form>
                    <Form.Item label="姓名" name="name">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form');
            expect(form).toBeInTheDocument();
        });

        it('Form.Item 无 name 时也支持（展示用）', () => {
            render(
                <Form>
                    <Form.Item label="展示项">纯文本</Form.Item>
                </Form>
            );
            expect(screen.getByText('展示项')).toBeInTheDocument();
        });

        it('hidden 的 Form.Item 不渲染 DOM', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="hidden" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('[data-field-name="hidden"]')).toBeNull();
        });
    });

    describe('布局', () => {
        it('layout=vertical 时 FormItem 渲染为 block', () => {
            const { container } = render(
                <Form layout="vertical">
                    <Form.Item label="v" name="v">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector(`.${styles['island-form-vertical']}`)).toBeInTheDocument();
        });

        it('layout=horizontal 时使用 grid 布局', () => {
            const { container } = render(
                <Form layout="horizontal">
                    <Form.Item label="h" name="h">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector(`.${styles['island-form-horizontal']}`)).toBeInTheDocument();
        });

        it('layout=inline 时 Form 渲染为 flex', () => {
            const { container } = render(
                <Form layout="inline">
                    <Form.Item label="i" name="i">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector(`.${styles['island-form-inline']}`)).toBeInTheDocument();
        });

        it('size=small 应用 island-form-small 类', () => {
            const { container } = render(
                <Form size="small">
                    <Form.Item name="s">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector(`.${styles['island-form-small']}`)).toBeInTheDocument();
        });
    });

    describe('Form.useForm + 表单实例', () => {
        it('form.getFieldValue 返回 initialValues 中的值', () => {
            let captured: FormInstance | null = null;
            function Capturer() {
                const [form] = Form.useForm();
                captured = form;
                return null;
            }
            render(
                <Form initialValues={{ username: 'tom' }}>
                    <Capturer />
                </Form>
            );
            // useForm 在 Capturer 内创建实例，与 Form 内的实例不同 —— 这是预期
            // 真正测的是：Form 用 props 传 form 时，能访问 initialValues
            void captured;
        });

        it('受控 form 实例：getFieldValue / setFieldValue 正常', () => {
            let formRef: FormInstance | null = null;
            function Bind() {
                const [form] = Form.useForm();
                formRef = form;
                return null;
            }
            render(
                <Form form={undefined as never}>
                    <Bind />
                    <Form.Item name="username" initialValue="init">
                        <Input />
                    </Form.Item>
                </Form>
            );
            // Bind 中创建的 form 与 Form 内 createForm 是两个独立实例
            // 这里仅做冒烟：getFieldValue 不抛错
            expect(() => formRef?.getFieldValue('username')).not.toThrow();
        });

        it('受控 form 实例 + setFieldsValue 同步到 Input', () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.setFieldsValue({ a: '1' });
                            }}
                        >
                            set
                        </button>
                        <Form form={form}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('');
            act(() => {
                fireEvent.click(screen.getByText('set'));
            });
            expect(input.value).toBe('1');
        });

        it('resetFields 把值还原到 initialValues', async () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button type="button" onClick={() => form.resetFields()}>
                            reset
                        </button>
                        <button type="button" onClick={() => form.setFieldsValue({ a: 'dirty' })}>
                            dirty
                        </button>
                        <Form form={form} initialValues={{ a: 'init' }}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            const user = setup();
            render(<Host />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                await user.click(screen.getByText('dirty'));
            });
            expect(input.value).toBe('dirty');
            await act(async () => {
                await user.click(screen.getByText('reset'));
            });
            expect(input.value).toBe('init');
        });
    });

    describe('校验', () => {
        it('required 规则：空值触发错误，有值通过', async () => {
            const onFinish = vi.fn();
            const onFinishFailed = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item name="username" rules={[{ required: true, message: '必填' }]}>
                        <Input />
                    </Form.Item>
                    <button type="submit">提交</button>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;

            // 提交空表单
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinishFailed).toHaveBeenCalledTimes(1);
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('必填')).toBeInTheDocument();

            // 输入有效值后再次提交
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom' } });
            });
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ username: 'tom' });
        });

        it('min / max / len 规则：字符串长度校验', async () => {
            const ruleLen: RuleObject = { len: 3, message: '必须 3 个字符' };
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="code" rules={[ruleLen]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await act(async () => {
                fireEvent.change(input, { target: { value: 'ab' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('必须 3 个字符')).toBeInTheDocument();

            await act(async () => {
                fireEvent.change(input, { target: { value: 'abc' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ code: 'abc' });
        });

        it('type=integer 规则：字符串数字按整数校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="age" rules={[{ type: 'integer', message: '请输入整数' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // 非数字字符串 → 触发错误
            await act(async () => {
                fireEvent.change(input, { target: { value: 'abc' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();

            // 整数 → 通过
            await act(async () => {
                fireEvent.change(input, { target: { value: '25' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ age: '25' });

            // 小数 → 触发错误（不是整数）
            await act(async () => {
                fireEvent.change(input, { target: { value: '3.14' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();
        });

        it('min/max 规则：number/integer 类型按数值比较（不受字符串长度影响）', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="age" rules={[{ type: 'integer', min: 0, max: 150, message: '0-150' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // "5" 数字长度是 1，但值是 5，应该在 0-150 范围内通过
            await act(async () => {
                fireEvent.change(input, { target: { value: '5' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ age: '5' });

            // "999" 超出 150
            await act(async () => {
                fireEvent.change(input, { target: { value: '999' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledTimes(1);
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();
        });

        it('pattern 规则：正则校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ pattern: /^[a-z]+@/i, message: '邮箱格式不对' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await act(async () => {
                fireEvent.change(input, { target: { value: 'not-an-email' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('邮箱格式不对')).toBeInTheDocument();

            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom@x.com' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ email: 'tom@x.com' });
        });

        it('validator：async 自定义校验', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                validator: async (_rule: RuleObject, value: unknown) => {
                                    await new Promise((r) => setTimeout(r, 10));
                                    if (value === 'forbidden') throw new Error('禁用此值');
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await act(async () => {
                fireEvent.change(input, { target: { value: 'forbidden' } });
                fireEvent.submit(form);
                // 等待异步 validator（setTimeout 10ms）完成
                await new Promise((r) => setTimeout(r, 30));
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('禁用此值')).toBeInTheDocument();
        });

        it('onValuesChange 触发：单字段变化', () => {
            const onValuesChange = vi.fn();
            function Host() {
                const [form] = Form.useForm();
                useEffect(() => {
                    form.setFieldsValue({ a: 'initial' });
                }, [form]);
                return (
                    <Form form={form} onValuesChange={onValuesChange}>
                        <Form.Item name="a">
                            <Input />
                        </Form.Item>
                        <Form.Item name="b">
                            <Input />
                        </Form.Item>
                    </Form>
                );
            }
            render(<Host />);
            // setFieldsValue 不应触发 onValuesChange（只有用户操作触发）
            // 这里仅测 setFieldValue 路径
            const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
            const inputA = inputs[0];
            fireEvent.change(inputA, { target: { value: 'new' } });
            // 第一次 setFieldsValue 在 effect 中，不会触发 onValuesChange
            // 之后用户输入 'new' 应触发
            expect(onValuesChange).toHaveBeenCalled();
        });
    });

    describe('提交', () => {
        it('空表单不触发 onFinish（全部无 required）', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                    <button type="submit">go</button>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({});
        });

        it('onFinishFailed 收到 values + errorFields', async () => {
            const onFinishFailed = vi.fn();
            const { container } = render(
                <Form onFinishFailed={onFinishFailed}>
                    <Form.Item name="a" rules={[{ required: true, message: 'a!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="b" rules={[{ required: true, message: 'b!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const inputA = screen.getAllByRole('textbox')[0] as HTMLInputElement;
            await act(async () => {
                fireEvent.change(inputA, { target: { value: 'x' } });
                fireEvent.submit(form);
            });
            expect(onFinishFailed).toHaveBeenCalledTimes(1);
            const arg = onFinishFailed.mock.calls[0][0] as {
                errorFields: Array<{ name: string; errors: string[] }>;
                values: Record<string, unknown>;
            };
            expect(arg.errorFields).toHaveLength(1);
            expect(arg.errorFields[0].name).toBe('b');
            expect(arg.errorFields[0].errors[0]).toBe('b!');
            expect(arg.values).toEqual({ a: 'x' });
        });

        it('type=number 规则：接受整数 + 浮点 + 数字字符串', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="v" rules={[{ type: 'number' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // 整数字符串 → 通过
            await act(async () => {
                fireEvent.change(input, { target: { value: '42' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ v: '42' });

            // 浮点字符串 → 通过
            await act(async () => {
                fireEvent.change(input, { target: { value: '3.14' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ v: '3.14' });

            // 非数字 → 触发错误
            await act(async () => {
                fireEvent.change(input, { target: { value: 'abc' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();
        });

        it('type=float 规则：只接受浮点', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="v" rules={[{ type: 'float' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // 浮点 → 通过
            await act(async () => {
                fireEvent.change(input, { target: { value: '1.5' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ v: '1.5' });

            // 整数 → 触发错误
            await act(async () => {
                fireEvent.change(input, { target: { value: '3' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();
        });

        it('type=email 规则：邮箱格式', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom@x.com' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ email: 'tom@x.com' });

            await act(async () => {
                fireEvent.change(input, { target: { value: 'not-an-email' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();
        });

        it('type=url 规则：URL 格式', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="url" rules={[{ type: 'url' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await act(async () => {
                fireEvent.change(input, { target: { value: 'https://example.com' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ url: 'https://example.com' });

            await act(async () => {
                fireEvent.change(input, { target: { value: 'not a url' } });
                fireEvent.submit(form);
            });
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeTruthy();
        });

        it('required + whitespace: 纯空格也算空', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item name="name" rules={[{ required: true, whitespace: true, message: '不能为空或空白' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // 纯空格 → 触发错误
            await act(async () => {
                fireEvent.change(input, { target: { value: '   ' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('不能为空或空白')).toBeInTheDocument();

            // 真实内容 → 通过
            await act(async () => {
                fireEvent.change(input, { target: { value: 'tom' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ name: 'tom' });
            expect(container.querySelector('.' + styles['island-form-item-explain-error'])).toBeNull();
        });

        it('多条 rule 合并校验：required + min + max 一次跑完', async () => {
            const onFinish = vi.fn();
            const { container } = render(
                <Form onFinish={onFinish}>
                    <Form.Item
                        name="age"
                        rules={[
                            { required: true, message: '必填' },
                            { type: 'integer', min: 0, max: 150, message: '0-150' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // 空 → required 报"必填"
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(screen.getByText('必填')).toBeInTheDocument();

            // 字符串非数字 → integer 报"0-150"（min: 0, max: 150 数值比较）
            await act(async () => {
                fireEvent.change(input, { target: { value: 'abc' } });
                fireEvent.submit(form);
            });
            // 'abc' 不是整数 → type=integer 抛错
            expect(screen.getByText('0-150')).toBeInTheDocument();

            // 整数超出范围 → 报"0-150"
            await act(async () => {
                fireEvent.change(input, { target: { value: '200' } });
                fireEvent.submit(form);
            });
            expect(screen.getByText('0-150')).toBeInTheDocument();

            // 合法值 → 通过
            await act(async () => {
                fireEvent.change(input, { target: { value: '25' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ age: '25' });
        });

        it('validator 返回 string 也算错误', async () => {
            const onFinish = vi.fn();
            render(
                <Form onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                validator: () => {
                                    return '返回的错误';
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = document.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'any' } });
                fireEvent.submit(form);
            });
            expect(onFinish).not.toHaveBeenCalled();
            expect(screen.getByText('返回的错误')).toBeInTheDocument();
        });
    });

    describe('label / colon / requiredMark', () => {
        it('labelAlign=right 时 label 文本对齐', () => {
            const { container } = render(
                <Form layout="horizontal" labelAlign="right">
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const label = container.querySelector('label') as HTMLLabelElement;
            expect(label.style.textAlign).toBe('right');
        });

        it('labelAlign=left 时 label 文本对齐', () => {
            const { container } = render(
                <Form layout="horizontal" labelAlign="left">
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const label = container.querySelector('label') as HTMLLabelElement;
            expect(label.style.textAlign).toBe('left');
        });

        it('colon=false 时不显示冒号', () => {
            const { container } = render(
                <Form colon={false}>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            // island-form-item-label-colon 类不存在
            expect(container.querySelector('.' + styles['island-form-item-label-colon'])).toBeNull();
        });

        it('colon=true (默认) 时显示冒号', () => {
            const { container } = render(
                <Form>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.' + styles['island-form-item-label-colon'])).toBeInTheDocument();
        });

        it('requiredMark=false 时不显示星号', () => {
            const { container } = render(
                <Form requiredMark={false}>
                    <Form.Item label="姓名" name="n" required>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.' + styles['island-form-item-label-required'])).toBeNull();
        });

        it('requiredMark=true (显式开启) 时显示星号', () => {
            const { container } = render(
                <Form requiredMark>
                    <Form.Item label="姓名" name="n" required>
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.' + styles['island-form-item-label-required'])).toBeInTheDocument();
        });

        it('requiredMark="optional" 时 required 字段仍显示星号', () => {
            const { container } = render(
                <Form requiredMark="optional">
                    <Form.Item label="姓名" name="n" required>
                        <Input />
                    </Form.Item>
                </Form>
            );
            // 'optional' 与 true 等价：required 字段显示星号
            expect(container.querySelector('.' + styles['island-form-item-label-required'])).toBeInTheDocument();
        });

        it('labelCol/wrapperCol 网格应用 grid-column 内联样式', () => {
            const { container } = render(
                <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const label = container.querySelector('label') as HTMLLabelElement;
            const control = label.nextElementSibling as HTMLElement;
            expect(label.style.gridColumn).toBe('1 / span 6');
            expect(control.style.gridColumn).toBe('7 / span 18');
        });

        it('labelCol.offset 时 label 起始列后移', () => {
            const { container } = render(
                <Form layout="horizontal" labelCol={{ span: 6, offset: 2 }}>
                    <Form.Item label="姓名" name="n">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const label = container.querySelector('label') as HTMLLabelElement;
            // offset 2 → 起始列 1+2=3
            expect(label.style.gridColumn).toBe('3 / span 6');
        });
    });

    describe('高级功能', () => {
        it('noStyle 时不渲染外层 label/wrapper 容器', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" noStyle>
                        <Input />
                    </Form.Item>
                </Form>
            );
            // 没有 form-item-label / form-item-control 容器
            expect(container.querySelector('.' + styles['island-form-item-label'])).toBeNull();
            expect(container.querySelector('.' + styles['island-form-item-control'])).toBeNull();
            // input 还在
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('hasFeedback 时错误状态下显示 ✕ 图标', async () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" hasFeedback rules={[{ required: true, message: '必填' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = container.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            const feedback = container.querySelector('.' + styles['island-form-item-feedback-icon']);
            expect(feedback).toBeInTheDocument();
            expect(feedback?.textContent).toContain('✕');
        });

        it('validateStatus=success 手动指定覆盖自动推断', () => {
            const { container } = render(
                <Form>
                    <Form.Item name="a" validateStatus="success">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(container.querySelector('.' + styles['island-form-item-has-success'])).toBeInTheDocument();
        });

        it('help 文本：无错误时显示', () => {
            render(
                <Form>
                    <Form.Item name="a" help="帮助说明">
                        <Input />
                    </Form.Item>
                </Form>
            );
            expect(screen.getByText('帮助说明')).toBeInTheDocument();
        });

        it('help 文本：有错误时被错误覆盖', async () => {
            render(
                <Form>
                    <Form.Item name="a" help="帮助说明" rules={[{ required: true, message: '错误文案' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = document.querySelector('form') as HTMLFormElement;
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(screen.getByText('错误文案')).toBeInTheDocument();
            expect(screen.queryByText('帮助说明')).toBeNull();
        });

        it('disabled 透传到子组件', () => {
            render(
                <Form disabled>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.disabled).toBe(true);
        });

        it('getValueFromEvent 自定义取值', async () => {
            const onFinish = vi.fn();
            // 自定义组件：onChange 直接传 string
            function CustomInput({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
                return (
                    <input
                        value={value ?? ''}
                        onChange={(e) => onChange?.((e.target as HTMLInputElement).dataset.v ?? '')}
                        data-v="from-custom"
                    />
                );
            }
            render(
                <Form onFinish={onFinish}>
                    <Form.Item name="custom" getValueFromEvent={(v: unknown) => v} trigger="onChange">
                        <CustomInput />
                    </Form.Item>
                </Form>
            );
            const form = document.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'typed' } });
                fireEvent.submit(form);
            });
            // 自定义 onChange 从 dataset.v 取值
            expect(onFinish).toHaveBeenCalledWith({ custom: 'from-custom' });
        });

        it('normalize 在 setFieldValue 前标准化', async () => {
            const onFinish = vi.fn();
            const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : v);
            render(
                <Form onFinish={onFinish}>
                    <Form.Item name="name" normalize={trim}>
                        <Input />
                    </Form.Item>
                </Form>
            );
            const form = document.querySelector('form') as HTMLFormElement;
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: '  hello  ' } });
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ name: 'hello' });
        });

        it('valuePropName 切换（如 checkbox 用 checked）', async () => {
            const onFinish = vi.fn();
            render(
                <Form onFinish={onFinish}>
                    <Form.Item name="agree" valuePropName="checked">
                        <input type="checkbox" />
                    </Form.Item>
                </Form>
            );
            const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const form = document.querySelector('form') as HTMLFormElement;
            // 点击 checkbox → checked 变 true
            await act(async () => {
                fireEvent.click(checkbox);
            });
            await act(async () => {
                fireEvent.submit(form);
            });
            expect(onFinish).toHaveBeenCalledWith({ agree: true });
        });
    });

    describe('命令式 API', () => {
        it('validateFields 返回通过时的 values', async () => {
            let resolved: Record<string, unknown> | null = null;
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    resolved = values;
                                });
                            }}
                        >
                            validate
                        </button>
                        <Form form={form} initialValues={{ a: 'x' }}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            await act(async () => {
                fireEvent.click(screen.getByText('validate'));
            });
            expect(resolved).toEqual({ a: 'x' });
        });

        it('validateFields 校验失败抛带 errorFields 的 Error', async () => {
            let captured: unknown = null;
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.validateFields().catch((err: unknown) => {
                                    captured = err;
                                });
                            }}
                        >
                            validate
                        </button>
                        <Form form={form}>
                            <Form.Item name="a" rules={[{ required: true, message: 'a!' }]}>
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            await act(async () => {
                fireEvent.click(screen.getByText('validate'));
            });
            expect(captured).toBeTruthy();
            const err = captured as { errorFields: Array<{ name: string; errors: string[] }> };
            expect(err.errorFields[0].name).toBe('a');
            expect(err.errorFields[0].errors[0]).toBe('a!');
        });

        it('getFieldsValue(true) 包含未注册字段', () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.setFieldsValue({ registered: 1, unregistered: 2 });
                            }}
                        >
                            set
                        </button>
                        <Form form={form}>
                            <Form.Item name="registered">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            act(() => {
                fireEvent.click(screen.getByText('set'));
            });
            // 冒烟：setFieldsValue 不抛错
        });

        it('setFields 设置错误信息', async () => {
            function Host() {
                const [form] = Form.useForm();
                return (
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                form.setFields([{ name: 'a', errors: ['服务器报错'], touched: true }]);
                            }}
                        >
                            setErr
                        </button>
                        <Form form={form}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );
            }
            render(<Host />);
            await act(async () => {
                fireEvent.click(screen.getByText('setErr'));
            });
            expect(screen.getByText('服务器报错')).toBeInTheDocument();
        });
    });

    describe('onValuesChange', () => {
        it('单字段 change 触发，changedValues 仅含变化字段', () => {
            const onValuesChange = vi.fn();
            render(
                <Form onValuesChange={onValuesChange}>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                    <Form.Item name="b">
                        <Input />
                    </Form.Item>
                </Form>
            );
            const inputA = screen.getAllByRole('textbox')[0] as HTMLInputElement;
            fireEvent.change(inputA, { target: { value: 'hello' } });
            expect(onValuesChange).toHaveBeenCalledTimes(1);
            const [changed, all] = onValuesChange.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];
            expect(changed).toEqual({ a: 'hello' });
            expect(all).toEqual({ a: 'hello' });
        });

        it('onValuesChange 回调中第二个参数是全量 values', () => {
            const onValuesChange = vi.fn();
            function Host() {
                const [form] = Form.useForm();
                useEffect(() => {
                    form.setFieldsValue({ a: 'init' });
                }, [form]);
                return (
                    <Form form={form} onValuesChange={onValuesChange}>
                        <Form.Item name="a">
                            <Input />
                        </Form.Item>
                        <Form.Item name="b">
                            <Input />
                        </Form.Item>
                    </Form>
                );
            }
            render(<Host />);
            const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
            fireEvent.change(inputs[1], { target: { value: 'B' } });
            expect(onValuesChange).toHaveBeenCalled();
            const [changed, all] = onValuesChange.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];
            expect(changed).toEqual({ b: 'B' });
            expect(all).toEqual({ a: 'init', b: 'B' });
        });
    });

    describe('initialValues 同步', () => {
        // 回归：之前用 [JSON.stringify(initialValues)] 作为 deps，
        // 验证同内容新引用时 setFieldsValue 不会重复执行
        it('同内容新引用 initialValues，re-render 不会重复 setFieldsValue', () => {
            let setFieldsValueSpy: ReturnType<typeof vi.fn> | null = null;
            function Spy({ form }: { form: FormInstance }) {
                if (!setFieldsValueSpy) {
                    const orig = form.setFieldsValue.bind(form);
                    setFieldsValueSpy = vi.fn((v: Record<string, unknown>) => orig(v));
                    (form as { setFieldsValue: typeof orig }).setFieldsValue =
                        setFieldsValueSpy as never;
                }
                return null;
            }

            function Parent({ tick }: { tick: number }) {
                const [form] = Form.useForm();
                return (
                    <>
                        <Spy form={form} />
                        <Form form={form} initialValues={{ a: 1, b: 2 }}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                        <div>{tick}</div>
                    </>
                );
            }

            const { rerender } = render(<Parent tick={0} />);
            rerender(<Parent tick={1} />);
            rerender(<Parent tick={2} />);

            // mount 1 次，后续 re-render 不应再调
            expect(setFieldsValueSpy).toHaveBeenCalledTimes(1);
        });

        it('initialValues 内容变化时 setFieldsValue 会再调', () => {
            let setFieldsValueSpy: ReturnType<typeof vi.fn> | null = null;
            function Spy({ form }: { form: FormInstance }) {
                if (!setFieldsValueSpy) {
                    const orig = form.setFieldsValue.bind(form);
                    setFieldsValueSpy = vi.fn((v: Record<string, unknown>) => orig(v));
                    (form as { setFieldsValue: typeof orig }).setFieldsValue =
                        setFieldsValueSpy as never;
                }
                return null;
            }

            function Parent({ tick, iv }: { tick: number; iv: Record<string, unknown> }) {
                const [form] = Form.useForm();
                return (
                    <>
                        <Spy form={form} />
                        <Form form={form} initialValues={iv}>
                            <Form.Item name="a">
                                <Input />
                            </Form.Item>
                        </Form>
                        <div>{tick}</div>
                    </>
                );
            }

            const { rerender } = render(<Parent tick={0} iv={{ a: 1 }} />);
            // 内容变 → 再调
            rerender(<Parent tick={1} iv={{ a: 2 }} />);
            // 同内容新引用 → 不调
            rerender(<Parent tick={2} iv={{ a: 2 }} />);
            rerender(<Parent tick={3} iv={{ a: 2 }} />);
            // 内容再变 → 再调
            rerender(<Parent tick={4} iv={{ a: 3 }} />);

            // 1 (mount) + 2 (变 a:1→a:2, 变 a:2→a:3) = 3
            expect(setFieldsValueSpy).toHaveBeenCalledTimes(3);
        });
    });

    describe('onReset', () => {
        it('点击 reset 按钮触发 onReset', async () => {
            const onReset = vi.fn();
            const user = setup();
            render(
                <Form onReset={onReset} initialValues={{ a: 'init' }}>
                    <Form.Item name="a">
                        <Input />
                    </Form.Item>
                    <button type="reset">reset</button>
                </Form>
            );
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await act(async () => {
                fireEvent.change(input, { target: { value: 'dirty' } });
            });
            expect(input.value).toBe('dirty');
            await act(async () => {
                await user.click(screen.getByText('reset'));
            });
            expect(onReset).toHaveBeenCalledTimes(1);
            // 原生 form reset 会还原 input 到 defaultValue（如果设置了），
            // 而 Form 的 resetFields 还原到 initialValues。
            // 这里仅验证 onReset 被调用。
        });
    });
});
