import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
        const { container } = render(<CodeBlock code="x" className="cb" style={{ borderRadius: 4 }} />);
        const pre = container.querySelector('pre') as HTMLElement;
        expect(pre).toHaveClass('cb');
        expect(pre).toHaveStyle({ borderRadius: '4px' });
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
});
