import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { setup } from '@test/utils';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
    it('渲染 code 内容到 pre 元素', () => {
        const code = "const a = 'hello';";
        const { container } = render(<CodeBlock code={code} />);
        const pre = container.querySelector('pre');
        expect(pre).toBeInTheDocument();
        expect(pre?.textContent).toContain('const');
        expect(pre?.textContent).toContain('hello');
    });

    it('应用 className 与 style', () => {
        const { container } = render(
            <CodeBlock code="x" className="cb" style={{ borderRadius: 4, width: '50%', marginLeft: 12 }} />
        );
        const pre = container.querySelector('pre') as HTMLElement;
        expect(pre).toHaveClass('cb');
        expect(pre).toHaveStyle({ borderRadius: '4px' });
        expect(pre.parentElement).toHaveStyle({ width: '50%', marginLeft: '12px' });
        expect(pre).toHaveStyle({ width: '100%' });
    });

    it('为代码片段产生多个高亮 span', () => {
        const { container } = render(<CodeBlock code="function foo() { return 1; }" />);
        const pre = container.querySelector('pre')!;
        expect(pre.querySelectorAll('span').length).toBeGreaterThan(0);
    });

    it('识别块注释 /* ... */', () => {
        const { container } = render(<CodeBlock code="/* block comment */ x" />);
        const pre = container.querySelector('pre')!;
        // 至少有一个非空的高亮 span
        expect(pre.querySelectorAll('span[style*="color"]').length).toBeGreaterThan(0);
    });

    it('识别 JSX 标签 <MyComp />', () => {
        const { container } = render(<CodeBlock code="<MyComp />" />);
        const pre = container.querySelector('pre')!;
        expect(pre.textContent).toContain('MyComp');
    });

    it('空 code 不挂掉', () => {
        const { container } = render(<CodeBlock code="" />);
        expect(container.querySelector('pre')).toBeInTheDocument();
    });

    it('默认可复制代码并显示成功反馈', async () => {
        const user = setup();
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
        const onCopy = vi.fn();
        render(<CodeBlock code="const island = true;" onCopy={onCopy} />);

        await user.click(screen.getByRole('button', { name: '复制代码' }));
        expect(writeText).toHaveBeenCalledWith('const island = true;');
        expect(onCopy).toHaveBeenCalledWith('const island = true;');
        expect(screen.getByRole('button', { name: '代码已复制' })).toHaveTextContent('已复制');
    });

    it('复制失败时给出反馈', async () => {
        const user = setup();
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
        });
        render(<CodeBlock code="x" />);
        await user.click(screen.getByRole('button', { name: '复制代码' }));
        await waitFor(() => expect(screen.getByRole('button', { name: '代码复制失败' })).toHaveTextContent('复制失败'));
    });

    it('Clipboard API 不可用时使用兼容复制方案', async () => {
        const user = setup();
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
        const execCommand = vi.fn().mockReturnValue(true);
        Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
        render(<CodeBlock code="fallback" />);

        await user.click(screen.getByRole('button', { name: '复制代码' }));
        expect(execCommand).toHaveBeenCalledWith('copy');
        expect(document.querySelector('textarea')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: '代码已复制' })).toBeInTheDocument();
    });

    it('兼容复制方案抛错时仍清理临时元素', async () => {
        const user = setup();
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
        Object.defineProperty(document, 'execCommand', {
            configurable: true,
            value: vi.fn(() => {
                throw new Error('blocked');
            }),
        });
        render(<CodeBlock code="fallback" />);

        await user.click(screen.getByRole('button', { name: '复制代码' }));
        expect(document.querySelector('textarea')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: '代码复制失败' })).toBeInTheDocument();
    });

    it('copyable=false 时隐藏复制按钮', () => {
        render(<CodeBlock code="x" copyable={false} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
