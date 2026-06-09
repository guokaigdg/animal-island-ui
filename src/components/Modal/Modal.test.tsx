import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
            </Modal>,
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
        const { container } = render(
            <Modal open onClose={onClose} typewriter={false}>
                content
            </Modal>,
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
            </Modal>,
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
            </Modal>,
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
            </Modal>,
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
            </Modal>,
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
            </Modal>,
        );
        expect(screen.queryByText('取消')).not.toBeInTheDocument();
        expect(screen.queryByText('确定')).not.toBeInTheDocument();
    });

    it('width 应用到 dialog 节点', () => {
        render(
            <Modal open width={400} typewriter={false}>
                body
            </Modal>,
        );
        expect(screen.getByRole('dialog')).toHaveStyle({ width: '400px' });
    });
});
