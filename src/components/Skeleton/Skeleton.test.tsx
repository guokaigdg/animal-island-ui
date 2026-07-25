import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from './Skeleton';

describe('Skeleton', () => {
    it('variant=text 渲染默认骨架', () => {
        const { container } = render(<Skeleton variant="text" />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('variant=circle 渲染圆形', () => {
        const { container } = render(<Skeleton variant="circle" widthValue={44} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('variant=rect 渲染矩形', () => {
        const { container } = render(<Skeleton variant="rect" widthValue={200} heightValue={120} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('variant=paragraph 渲染多行', () => {
        const { container } = render(<Skeleton variant="paragraph" rows={3} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('loading=false 时渲染 children', () => {
        render(<Skeleton loading={false}>内容</Skeleton>);
        expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('active 类默认应用', () => {
        const { container } = render(<Skeleton variant="text" active />);
        expect(container.firstChild).toBeInTheDocument();
    });
});

describe('SkeletonButton', () => {
    it('渲染按钮骨架', () => {
        const { container } = render(<SkeletonButton />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('应用 size', () => {
        const { container } = render(<SkeletonButton size="large" />);
        expect(container.firstChild).toBeInTheDocument();
    });
});

describe('SkeletonInput', () => {
    it('渲染输入框骨架', () => {
        const { container } = render(<SkeletonInput />);
        expect(container.firstChild).toBeInTheDocument();
    });
});

describe('SkeletonAvatar', () => {
    it('渲染头像骨架', () => {
        const { container } = render(<SkeletonAvatar />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('shape=square 渲染方形', () => {
        const { container } = render(<SkeletonAvatar shape="square" />);
        expect(container.firstChild).toBeInTheDocument();
    });
});
