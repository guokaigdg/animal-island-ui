import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Drawer } from './Drawer';
import styles from './drawer.module.less';

describe('Drawer', () => {
    it('open=false 时 dialog 不在无障碍树（aria-hidden=true）', () => {
        render(<Drawer open={false}>content</Drawer>);
        // 抽屉始终在 DOM 中，关闭时 dialog 标 aria-hidden="true" 排除出无障碍树
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('open=true 通过 portal 渲染到 body 且包含 role="dialog" + aria-modal', () => {
        render(
            <Drawer open title="标题">
                <p data-testid="body">body content</p>
            </Drawer>
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
        render(
            <Drawer open onClose={onClose}>
                content
            </Drawer>
        );
        const mask = screen.getByRole('dialog').parentElement!;
        await user.click(mask);
        expect(onClose).toHaveBeenCalled();
    });

    it('maskClosable=false 时点击遮罩不触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Drawer open maskClosable={false} onClose={onClose}>
                content
            </Drawer>
        );
        const mask = screen.getByRole('dialog').parentElement!;
        await user.click(mask);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('点击抽屉内容不冒泡触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Drawer open onClose={onClose}>
                <p>inside</p>
            </Drawer>
        );
        await user.click(screen.getByText('inside'));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('Esc 触发 onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Drawer open onClose={onClose}>
                content
            </Drawer>
        );
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalled();
    });

    it('placement 应用对应方向类名', () => {
        const { rerender } = render(
            <Drawer open placement="left">
                x
            </Drawer>
        );
        expect(screen.getByRole('dialog')).toHaveClass(styles.panelLeft);

        rerender(
            <Drawer open placement="top">
                x
            </Drawer>
        );
        expect(screen.getByRole('dialog')).toHaveClass(styles.panelTop);

        rerender(
            <Drawer open placement="bottom">
                x
            </Drawer>
        );
        expect(screen.getByRole('dialog')).toHaveClass(styles.panelBottom);
    });

    it('width 应用到面板（right placement）', () => {
        render(
            <Drawer open width={400}>
                body
            </Drawer>
        );
        expect(screen.getByRole('dialog')).toHaveStyle({ width: '400px' });
    });

    it('height 应用到面板（bottom placement）', () => {
        render(
            <Drawer open placement="bottom" height={250}>
                body
            </Drawer>
        );
        expect(screen.getByRole('dialog')).toHaveStyle({ height: '250px' });
    });

    it('默认 pushBackground 下沉 body 非固定子元素', async () => {
        const content = document.createElement('div');
        content.textContent = 'page content';
        document.body.appendChild(content);
        render(
            <Drawer open>
                <p>drawer</p>
            </Drawer>
        );
        // transform 通过 requestAnimationFrame 异步应用
        await waitFor(() => {
            expect(content.style.transform).toBe('scale(0.94)');
        });
        expect(content.style.filter).toBe('blur(1px)');
        expect(content.style.borderRadius).toBe('14px');
        expect(content.style.overflow).toBe('hidden');
        // 回归：portal 包裹器自身不能被下沉（否则 transform 会破坏内部 fixed 面板定位）
        const portalWrapper = document.querySelector('[data-animal-drawer-portal]') as HTMLElement;
        expect(portalWrapper).toBeTruthy();
        expect(portalWrapper.style.transform).toBe('');
        document.body.removeChild(content);
    });

    it('pushBackground=false 不下沉背景', () => {
        const content = document.createElement('div');
        content.textContent = 'page content';
        document.body.appendChild(content);
        render(
            <Drawer open pushBackground={false}>
                <p>drawer</p>
            </Drawer>
        );
        expect(content.style.transform).toBe('');
        document.body.removeChild(content);
    });

    it('关闭后恢复背景元素原始样式', async () => {
        const content = document.createElement('div');
        content.textContent = 'page content';
        document.body.appendChild(content);
        const { rerender } = render(
            <Drawer open>
                <p>drawer</p>
            </Drawer>
        );
        await waitFor(() => {
            expect(content.style.transform).toBe('scale(0.94)');
        });
        rerender(
            <Drawer open={false}>
                <p>drawer</p>
            </Drawer>
        );
        expect(content.style.transform).toBe('');
        expect(content.style.filter).toBe('');
        expect(content.style.borderRadius).toBe('');
        expect(content.style.overflow).toBe('');
        document.body.removeChild(content);
    });

    it('footer 传入时渲染', () => {
        render(
            <Drawer open footer={<button>ok</button>}>
                body
            </Drawer>
        );
        expect(screen.getByText('ok')).toBeInTheDocument();
    });

    it('默认不渲染 footer', () => {
        render(<Drawer open>body</Drawer>);
        // body 存在，无 footer 容器（footer 类名为空）
        expect(screen.getByRole('dialog').querySelector(`.${styles.footer}`)).toBeNull();
    });

    describe('a11y', () => {
        it('aria-labelledby 关联 title', () => {
            render(
                <Drawer open title="嗨标题">
                    <p>嗨内容</p>
                </Drawer>
            );
            const dialog = screen.getByRole('dialog');
            const labelledBy = dialog.getAttribute('aria-labelledby');
            expect(labelledBy).toBeTruthy();
            expect(document.getElementById(labelledBy!)).toHaveTextContent('嗨标题');
        });

        it('无 title 时 aria-labelledby 缺省', () => {
            render(<Drawer open>body</Drawer>);
            expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
        });

        it('关闭按钮 aria-label="关闭" 且触发 onClose', async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            render(
                <Drawer open title="t" onClose={onClose}>
                    body
                </Drawer>
            );
            const closeBtn = screen.getByLabelText('关闭');
            expect(closeBtn).toBeInTheDocument();
            await user.click(closeBtn);
            expect(onClose).toHaveBeenCalled();
        });

        it('打开时焦点送进抽屉（落到第一个可聚焦元素）', async () => {
            const Host = () => {
                const [open, setOpen] = useState(false);
                return (
                    <>
                        <button data-testid="trigger" onClick={() => setOpen(true)}>
                            open
                        </button>
                        <Drawer open={open} onClose={() => setOpen(false)}>
                            <button data-testid="inside">inside</button>
                        </Drawer>
                    </>
                );
            };
            const user = userEvent.setup();
            render(<Host />);
            await user.click(screen.getByTestId('trigger'));
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
                        <Drawer open={open} onClose={() => setOpen(false)}>
                            <button data-testid="inside">inside</button>
                        </Drawer>
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
                <Drawer open title="t">
                    <button data-testid="b1">b1</button>
                    <button data-testid="b2">b2</button>
                </Drawer>
            );
            // 关闭按钮是第一个可聚焦元素
            await waitFor(() => {
                expect(screen.getByLabelText('关闭')).toHaveFocus();
            });
            await user.tab();
            expect(screen.getByTestId('b1')).toHaveFocus();
            await user.tab();
            expect(screen.getByTestId('b2')).toHaveFocus();
            await user.tab();
            // 末尾再 Tab 应陷阱回首项（关闭按钮）
            expect(screen.getByLabelText('关闭')).toHaveFocus();
        });

        it('Shift+Tab 焦点陷阱：首项 Shift+Tab 回到末尾', async () => {
            const user = userEvent.setup();
            render(
                <Drawer open title="t">
                    <button data-testid="b1">b1</button>
                    <button data-testid="b2">b2</button>
                </Drawer>
            );
            await waitFor(() => {
                expect(screen.getByLabelText('关闭')).toHaveFocus();
            });
            await user.tab({ shift: true });
            expect(screen.getByTestId('b2')).toHaveFocus();
        });
    });
});
