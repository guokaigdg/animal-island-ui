import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Collapse } from './Collapse';
import styles from './collapse.module.less';

describe('Collapse', () => {
    it('默认折叠：button aria-expanded=false 且显示 +', () => {
        render(<Collapse question="Q" answer="A" />);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('aria-expanded', 'false');
        expect(btn).toHaveTextContent('+');
    });

    it('defaultExpanded=true 初始展开', () => {
        render(<Collapse question="Q" answer="A" defaultExpanded />);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('aria-expanded', 'true');
        expect(btn).toHaveTextContent('−');
    });

    it('点击切换展开状态', async () => {
        const user = userEvent.setup();
        render(<Collapse question="Q" answer="A" />);
        const btn = screen.getByRole('button');
        await user.click(btn);
        expect(btn).toHaveAttribute('aria-expanded', 'true');
        await user.click(btn);
        expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it('始终渲染 question 与 answer 内容', () => {
        render(<Collapse question="My question" answer={<span data-testid="ans">Answer</span>} />);
        expect(screen.getByText('My question')).toBeInTheDocument();
        expect(screen.getByTestId('ans')).toBeInTheDocument();
    });

    it('disabled 时按钮被禁用，点击无效', async () => {
        const user = userEvent.setup();
        render(<Collapse question="Q" answer="A" disabled />);
        const btn = screen.getByRole('button');
        expect(btn).toBeDisabled();
        await user.click(btn);
        expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Collapse question="Q" answer="A" className="my-c" style={{ marginTop: 4 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('my-c');
        expect(root).toHaveStyle({ marginTop: '4px' });
        expect(root).toHaveClass(styles.faqCard);
    });

    it('受控用法：父级控制展开（通过重新挂载验证 defaultExpanded 切换）', async () => {
        const user = userEvent.setup();
        const Host = () => {
            const [open, setOpen] = useState(false);
            return (
                <div>
                    <button data-testid="ext" onClick={() => setOpen((v) => !v)}>
                        toggle
                    </button>
                    <Collapse key={String(open)} question="Q" answer="A" defaultExpanded={open} />
                </div>
            );
        };
        render(<Host />);
        await user.click(screen.getByTestId('ext'));
        expect(screen.getByRole('button', { name: /Q/ })).toHaveAttribute('aria-expanded', 'true');
    });

    describe('a11y', () => {
        it('header.aria-controls 与 panel.id 双向关联，panel 通过 region 暴露', () => {
            render(<Collapse question="Q" answer="A" />);
            const btn = screen.getByRole('button');
            const panel = screen.getByRole('region');
            expect(btn.getAttribute('aria-controls')).toBe(panel.id);
            expect(panel.getAttribute('aria-labelledby')).toBe(btn.id);
            expect(panel.id).toMatch(/^animal-collapse-/);
        });
    });
});
