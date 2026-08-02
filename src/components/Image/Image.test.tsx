import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { setup } from '@test/utils';
import { Image } from './Image';
import styles from './image.module.less';

describe('Image', () => {
    it('渲染 img 并透传 src / alt', () => {
        render(<Image src="photo.png" alt="岛屿风景" />);
        const img = screen.getByRole('img', { name: '岛屿风景' });
        expect(img).toHaveAttribute('src', 'photo.png');
    });

    it('默认相框类名（圆角与边框来自样式表）', () => {
        const { container } = render(<Image src="photo.png" alt="x" />);
        const frame = container.firstChild as HTMLElement;
        expect(frame).toHaveClass(styles.image);
    });

    it('width / height 生效', () => {
        const { container } = render(<Image src="photo.png" alt="x" width={200} height={120} />);
        const frame = container.firstChild as HTMLElement;
        expect(frame).toHaveStyle({ width: '200px', height: '120px' });
    });

    it('color 应用对应调色板类名（非 white 时）', () => {
        const { container } = render(<Image src="photo.png" alt="x" color="app-pink" />);
        expect(container.firstChild).toHaveClass(styles['image-app-pink']);
    });

    it('未传 color 或 color=white 时不添加调色板类（默认白色）', () => {
        const { container } = render(<Image src="photo.png" alt="x" />);
        expect(container.firstChild).not.toHaveClass(styles['image-app-pink']);
        expect(container.firstChild).not.toHaveClass(styles['image-default']);
        const { container: white } = render(<Image src="photo.png" alt="x" color="white" />);
        expect(white.firstChild).not.toHaveClass(styles['image-default']);
    });

    it('color=default 应用奶油色类', () => {
        const { container } = render(<Image src="photo.png" alt="x" color="default" />);
        expect(container.firstChild).toHaveClass(styles['image-default']);
    });

    it('lazy 映射为原生 loading="lazy"', () => {
        render(<Image src="photo.png" alt="x" lazy />);
        expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
    });

    it('onLoad 触发后应用加载完成类', () => {
        const onLoad = vi.fn();
        const { container } = render(<Image src="photo.png" alt="x" onLoad={onLoad} />);
        fireEvent.load(screen.getByRole('img'));
        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(container.firstChild).toHaveClass(styles.loaded);
    });

    it('onError：加载失败时显示错误占位', () => {
        const onError = vi.fn();
        const { container } = render(<Image src="broken.png" alt="坏图" onError={onError} />);
        fireEvent.error(screen.getByRole('img'));
        expect(onError).toHaveBeenCalledTimes(1);
        expect(container.firstChild).toHaveClass(styles.error);
        expect(screen.getByText('图片加载失败')).toBeInTheDocument();
        expect(container.firstChild).toHaveAttribute('aria-label', '坏图');
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Image src="photo.png" alt="x" className="my-img" style={{ margin: 4 }} />);
        expect(container.firstChild).toHaveClass('my-img');
        expect(container.firstChild).toHaveStyle({ margin: '4px' });
    });

    it('preview 默认开启：未传 preview 也可点击预览', async () => {
        const user = setup();
        render(<Image src="photo.png" alt="默认预览" />);
        await user.click(screen.getByRole('button', { name: /默认预览/ }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('preview：点击图片打开大图预览', async () => {
        const user = setup();
        render(<Image src="photo.png" alt="预览图" preview />);
        await user.click(screen.getByRole('button', { name: /预览图/ }));
        expect(screen.getByRole('dialog', { name: /查看图片：预览图/ })).toBeInTheDocument();
    });

    it('preview：点击关闭按钮关闭预览', async () => {
        const user = setup();
        render(<Image src="photo.png" alt="预览图" preview />);
        await user.click(screen.getByRole('button', { name: /预览图/ }));
        await user.click(screen.getByRole('button', { name: '关闭预览' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('preview：按 ESC 关闭预览', async () => {
        const user = setup();
        render(<Image src="photo.png" alt="预览图" preview />);
        await user.click(screen.getByRole('button', { name: /预览图/ }));
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('preview：点击遮罩空白处关闭预览', async () => {
        const user = setup();
        render(<Image src="photo.png" alt="预览图" preview />);
        await user.click(screen.getByRole('button', { name: /预览图/ }));
        await user.click(screen.getByRole('dialog').parentElement as HTMLElement);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('preview：加载失败时不渲染预览按钮', () => {
        render(<Image src="broken.png" alt="坏图" preview />);
        fireEvent.error(screen.getByRole('img'));
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('图片加载失败')).toBeInTheDocument();
    });
});
