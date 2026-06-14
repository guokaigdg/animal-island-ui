import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from './Modal';

describe('Modal', () => {
    it('open=false 不渲染', () => {
        render(<Modal open={false}>content</Modal>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('open=true 通过 portal 渲染到 body 且包含 role="dialog"', () => {
        render(
            <Modal open title="标题" typewriter={false}>
                <p data-testid="body">body content</p>
            </Modal>
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(screen.getByText('标题')).toBeInTheDocument();
        expect(screen.getByTestId('body')).toBeInTheDocument();
    });

    it('点击遮罩触发 onClose（默认 maskClosable）', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const { container: _container } = render(
            <Modal open onClose={onClose} typewriter={false}>
                content
            </Modal>
        );
        // mask 在 portal 里，不在 container；通过 dialog 父级找
        const dialog = screen.getByRole('dialog');
        const mask = dialog.parentElement!;
        await user.click(mask);
        expect(onClose).toHaveBeenCalled();
    });

    it('maskClosable=false 时点击遮罩不触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Modal open maskClosable={false} onClose={onClose} typewriter={false}>
                content
            </Modal>
        );
        const mask = screen.getByRole('dialog').parentElement!;
        await user.click(mask);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('点击对话框内容不冒泡触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Modal open onClose={onClose} typewriter={false}>
                <p>inside</p>
            </Modal>
        );
        await user.click(screen.getByText('inside'));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('Esc 触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Modal open onClose={onClose} typewriter={false}>
                content
            </Modal>
        );
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalled();
    });

    it('默认 footer 渲染取消/确定，回调正确', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onOk = vi.fn();
        render(
            <Modal open onClose={onClose} onOk={onOk} typewriter={false}>
                body
            </Modal>
        );
        await user.click(screen.getByText('取消'));
        expect(onClose).toHaveBeenCalled();
        await user.click(screen.getByText('确定'));
        expect(onOk).toHaveBeenCalled();
    });

    it('footer={null} 不渲染默认按钮', () => {
        render(
            <Modal open footer={null} typewriter={false}>
                body
            </Modal>
        );
        expect(screen.queryByText('取消')).not.toBeInTheDocument();
        expect(screen.queryByText('确定')).not.toBeInTheDocument();
    });

    it('width 应用到 dialog 节点', () => {
        render(
            <Modal open width={400} typewriter={false}>
                body
            </Modal>
        );
        expect(screen.getByRole('dialog')).toHaveStyle({ width: '400px' });
    });

    describe('a11y', () => {
        it('aria-labelledby / aria-describedby 关联 title 与 body', () => {
            render(
                <Modal open title="嗨标题" typewriter={false}>
                    <p>嗨内容</p>
                </Modal>
            );
            const dialog = screen.getByRole('dialog');
            const labelledBy = dialog.getAttribute('aria-labelledby');
            const describedBy = dialog.getAttribute('aria-describedby');
            expect(labelledBy).toBeTruthy();
            expect(describedBy).toBeTruthy();
            expect(document.getElementById(labelledBy!)).toHaveTextContent('嗨标题');
            expect(document.getElementById(describedBy!)).toHaveTextContent('嗨内容');
        });

        it('无 title 时 aria-labelledby 缺省', () => {
            render(
                <Modal open typewriter={false}>
                    body
                </Modal>
            );
            expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
        });

        it('打开时焦点送进对话框（落到第一个可聚焦元素）', async () => {
            const Host = () => {
                const [open, setOpen] = useState(false);
                return (
                    <>
                        <button data-testid="trigger" onClick={() => setOpen(true)}>
                            open
                        </button>
                        <Modal open={open} onClose={() => setOpen(false)} typewriter={false}>
                            <button data-testid="inside">inside</button>
                        </Modal>
                    </>
                );
            };
            const user = userEvent.setup();
            render(<Host />);
            await user.click(screen.getByTestId('trigger'));
            // 等待 setTimeout(0) 把焦点搬进对话框
            await waitFor(() => {
                expect(screen.getByTestId('inside')).toHaveFocus();
            });
        });

        it('关闭时焦点归还触发元素', async () => {
            const Host = () => {
                const [open, setOpen] = useState(false);
                return (
                    <>
                        <button data-testid="trigger" onClick={() => setOpen(true)}>
                            open
                        </button>
                        <Modal open={open} onClose={() => setOpen(false)} typewriter={false}>
                            <button data-testid="inside">inside</button>
                        </Modal>
                    </>
                );
            };
            const user = userEvent.setup();
            render(<Host />);
            const trigger = screen.getByTestId('trigger');
            await user.click(trigger);
            await waitFor(() => {
                expect(screen.getByTestId('inside')).toHaveFocus();
            });
            await user.keyboard('{Escape}');
            await waitFor(() => {
                expect(trigger).toHaveFocus();
            });
        });

        it('Tab 焦点陷阱：末尾元素 Tab 回到第一个', async () => {
            const user = userEvent.setup();
            render(
                <Modal open typewriter={false} footer={null}>
                    <button data-testid="b1">b1</button>
                    <button data-testid="b2">b2</button>
                </Modal>
            );
            await waitFor(() => {
                expect(screen.getByTestId('b1')).toHaveFocus();
            });
            await user.tab();
            expect(screen.getByTestId('b2')).toHaveFocus();
            await user.tab();
            // 末尾再 Tab 应陷阱回首项
            expect(screen.getByTestId('b1')).toHaveFocus();
        });

        it('Shift+Tab 焦点陷阱：首项 Shift+Tab 回到末尾', async () => {
            const user = userEvent.setup();
            render(
                <Modal open typewriter={false} footer={null}>
                    <button data-testid="b1">b1</button>
                    <button data-testid="b2">b2</button>
                </Modal>
            );
            await waitFor(() => {
                expect(screen.getByTestId('b1')).toHaveFocus();
            });
            await user.tab({ shift: true });
            expect(screen.getByTestId('b2')).toHaveFocus();
        });
    });
});
