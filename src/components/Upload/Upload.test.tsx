import { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Upload, UploadFile } from './Upload';
import styles from './upload.module.less';

const makeFile = (name: string, type = 'text/plain', size = 1024) => new File(['x'.repeat(size)], name, { type });

// jsdom 没有 createObjectURL / revokeObjectURL（picture-card 预览依赖）
beforeEach(() => {
    Object.defineProperty(window.URL, 'createObjectURL', {
        configurable: true,
        writable: true,
        value: vi.fn(() => 'blob:mock-url'),
    });
    Object.defineProperty(window.URL, 'revokeObjectURL', {
        configurable: true,
        writable: true,
        value: vi.fn(),
    });
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

const pickFiles = (input: HTMLElement, files: File[]) => {
    fireEvent.change(input, { target: { files } });
};

// action / data 的函数形式会被 await（可能是异步签名），XHR 在微任务里才创建，
// 这类用例必须等一轮微任务再断言。
const pickFilesAsync = async (input: HTMLElement, files: File[]) => {
    await act(async () => {
        fireEvent.change(input, { target: { files } });
    });
};

const getInput = (container: HTMLElement) => container.querySelector(`.${styles.hiddenInput}`) as HTMLInputElement;

describe('Upload', () => {
    describe('trigger & picker', () => {
        it('renders the default trigger and forwards aria-label to it', () => {
            render(<Upload aria-label="上传头像" />);
            const trigger = screen.getByRole('button', { name: '上传头像' });
            expect(trigger).toBeInTheDocument();
            expect(trigger).toHaveTextContent('点击上传');
        });

        it('opens the hidden file input on trigger click', () => {
            const { container } = render(<Upload />);
            const input = getInput(container);
            const clickSpy = vi.spyOn(input, 'click');
            fireEvent.click(screen.getByRole('button', { name: '上传文件' }));
            expect(clickSpy).toHaveBeenCalledTimes(1);
        });

        it('disabled upload ignores trigger clicks', () => {
            const { container } = render(<Upload disabled />);
            const input = getInput(container);
            const clickSpy = vi.spyOn(input, 'click');
            fireEvent.click(screen.getByRole('button', { name: '上传文件' }));
            expect(clickSpy).not.toHaveBeenCalled();
        });

        it('renders drag zone when drag=true and supports drop', () => {
            const onChange = vi.fn();
            render(<Upload drag onChange={onChange} />);
            expect(screen.getByText('点击或拖拽文件到这里')).toBeInTheDocument();
            const zone = screen.getByRole('button', { name: '上传文件' });
            fireEvent.drop(zone, { dataTransfer: { files: [makeFile('drop.txt')] } });
            // onChange 至少触发两次：新增 + 模拟进度首跳；最后一次应包含 drop.txt
            const lastList = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList;
            expect(lastList.some((f) => f.name === 'drop.txt')).toBe(true);
        });

        it('renders custom children as the text trigger content', () => {
            render(<Upload>上传头像</Upload>);
            expect(screen.getByText('上传头像')).toBeInTheDocument();
            expect(screen.queryAllByText('点击上传').length).toBe(0);
        });

        it('renders custom children in the picture-card add tile', () => {
            render(
                <Upload listType="picture-card">
                    <em>＋</em>
                </Upload>
            );
            expect(screen.getByLabelText('上传文件')).toContainElement(screen.getByText('＋'));
        });

        it('renders custom children in the drag zone', () => {
            render(
                <Upload drag>
                    <strong>把文件拖到这里</strong>
                </Upload>
            );
            expect(screen.getByText('把文件拖到这里')).toBeInTheDocument();
            expect(screen.queryByText('点击或拖拽文件到这里')).not.toBeInTheDocument();
        });
    });

    describe('file list (text)', () => {
        it('adds a file with uploading status, then marks done after simulated progress', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.png', 'image/png', 2048)]);

            // 立即出现在列表中，状态 uploading
            expect(screen.getByText('a.png')).toBeInTheDocument();
            expect(screen.getByText('2.0 KB')).toBeInTheDocument();
            expect((onChange.mock.calls[0][0] as { fileList: UploadFile[] }).fileList).toHaveLength(1);

            // 模拟进度走完 → done
            await act(async () => {
                vi.advanceTimersByTime(3000);
            });
            const finalList = (onChange.mock.calls.at(-1)![0] as { fileList: Array<Record<string, unknown>> }).fileList;
            expect(finalList[0].status).toBe('done');
            expect(finalList[0].percent).toBe(100);
            expect(screen.getByLabelText('上传完成')).toBeInTheDocument();
        });

        it('multiple=true adds several files at once', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload multiple onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')]);
            expect((onChange.mock.calls[0][0] as { fileList: UploadFile[] }).fileList).toHaveLength(3);
        });

        it('truncates selections beyond maxCount, keeping the earliest ones', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload maxCount={2} multiple onChange={onChange} />);
            const input = getInput(container);
            pickFiles(input, [makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')]);
            // 超出的文件被截断，保留最早的两个（slice(0, maxCount)）
            const list = (onChange.mock.calls[0][0] as { fileList: Array<{ name: string }> }).fileList;
            expect(list).toHaveLength(2);
            expect(list.map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
        });

        it('beforeUpload=false skips the file entirely', async () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload beforeUpload={(file) => file.name !== 'blocked.txt'} onChange={onChange} />
            );
            // beforeUpload 走 await，需要 act 包裹让微任务落地
            await act(async () => {
                pickFiles(getInput(container), [makeFile('ok.txt'), makeFile('blocked.txt')]);
            });
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList;
            expect(list).toHaveLength(1);
            expect(list[0].name).toBe('ok.txt');
        });

        it('beforeUpload promise rejection skips the file', async () => {
            const onChange = vi.fn();
            // 组件会 console.error 记录钩子异常，避免测试输出噪音
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const { container } = render(
                <Upload
                    beforeUpload={async () => {
                        throw new Error('reject');
                    }}
                    onChange={onChange}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('x.txt')]);
            });
            expect(onChange).not.toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });

        it('beforeUpload returning a File uploads the transformed file', async () => {
            const onChange = vi.fn();
            const renamed = new File(['data'], 'renamed.txt', { type: 'text/plain' });
            const { container } = render(<Upload beforeUpload={() => renamed} onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('original.txt')]);
            });
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList;
            expect(list[0].name).toBe('renamed.txt');
        });

        it('beforeUpload async returning a File uploads the transformed file', async () => {
            const onChange = vi.fn();
            const renamed = new File(['data'], 'async-renamed.txt', { type: 'text/plain' });
            const { container } = render(
                <Upload multiple beforeUpload={async (f) => (f.name === 'a.txt' ? renamed : f)} onChange={onChange} />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.txt'), makeFile('b.txt')]);
            });
            const names = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList.map(
                (f) => f.name
            );
            expect(names).toContain('async-renamed.txt');
            expect(names).toContain('b.txt');
        });

        it('remove button deletes the item (and clears the simulated timer)', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            fireEvent.click(screen.getByLabelText('删除 a.txt'));
            expect((onChange.mock.calls.at(-1)![0] as { fileList: UploadFile[] }).fileList).toHaveLength(0);
        });

        it('onRemove=false prevents removal', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onRemove={() => false} onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('keep.txt')]);
            fireEvent.click(screen.getByLabelText('删除 keep.txt'));
            expect((onChange.mock.calls.at(-1)![0] as { fileList: UploadFile[] }).fileList).toHaveLength(1);
        });

        it('shows error state when customRequest reports onError', () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload customRequest={({ onError }) => onError(new Error('boom'))} onChange={onChange} />
            );
            pickFiles(getInput(container), [makeFile('bad.txt')]);
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ status: string }> }).fileList;
            expect(list[0].status).toBe('error');
            expect(screen.getByLabelText('上传失败')).toBeInTheDocument();
        });

        it('customRequest onProgress/onSuccess drive the status', () => {
            let api: { onProgress: (n: number) => void; onSuccess: () => void } | null = null;
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    customRequest={(options) => {
                        api = options;
                    }}
                    onChange={onChange}
                />
            );
            pickFiles(getInput(container), [makeFile('u.txt')]);
            act(() => api!.onProgress(40));
            const afterProgress = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ percent: number }> }).fileList;
            expect(afterProgress[0].percent).toBe(40);
            act(() => api!.onSuccess());
            const afterSuccess = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ status: string }> }).fileList;
            expect(afterSuccess[0].status).toBe('done');
        });
    });

    describe('controlled mode', () => {
        it('renders fileList from props and does not mutate it internally', () => {
            const controlled = [{ uid: 'u1', name: 'remote.png', status: 'done' as const, percent: 100 }];
            const onChange = vi.fn();
            render(<Upload fileList={controlled} onChange={onChange} />);
            expect(screen.getByText('remote.png')).toBeInTheDocument();
            expect(screen.getByLabelText('上传完成')).toBeInTheDocument();
            fireEvent.click(screen.getByLabelText('删除 remote.png'));
            // 受控模式下组件只通知，不自己改 state
            expect(onChange.mock.calls.at(-1)![0]).toMatchObject({ fileList: [] });
        });

        it('does not revoke the ObjectURL before the external list actually removes the file', async () => {
            const revoke = window.URL.revokeObjectURL as ReturnType<typeof vi.fn>;
            // 真实项目里消费方常先调接口、成功后再 setFileList（异步更新）
            const Host = () => {
                const [fileList, setFileList] = useState<UploadFile[]>([]);
                return (
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={(info) => {
                            setTimeout(() => setFileList(info.fileList), 0);
                        }}
                    />
                );
            };
            const { container } = render(<Host />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('p.png', 'image/png')]);
            });
            await act(async () => {
                vi.advanceTimersByTime(0);
            });
            expect(screen.getByLabelText('删除 p.png')).toBeInTheDocument();
            await act(async () => {
                fireEvent.click(screen.getByLabelText('删除 p.png'));
            });
            // 外部 fileList 还没更新，此时 revoke 会让仍渲染中的缩略图裂开
            expect(revoke).not.toHaveBeenCalled();
            await act(async () => {
                vi.advanceTimersByTime(0);
            });
            // 受控 diff 发现该项已被外部移除后补做释放
            expect(revoke).toHaveBeenCalledTimes(1);
        });
    });

    describe('picture-card', () => {
        it('renders tiles with object URL preview and an add tile', () => {
            const { container } = render(<Upload listType="picture-card" />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);

            const img = container.querySelector(`.${styles.cardImg}`) as HTMLImageElement;
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'blob:mock-url');
            expect(screen.getByLabelText('上传文件')).toBeInTheDocument(); // 添加块
        });

        it('keeps the add tile when maxCount reached (so it can replace the oldest)', () => {
            render(
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    defaultFileList={[{ uid: '1', name: 'x.png', status: 'done' }]}
                />
            );
            expect(screen.getByLabelText('上传文件')).toBeInTheDocument();
        });

        it('revokes the object URL on remove', () => {
            const { container } = render(<Upload listType="picture-card" />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            fireEvent.click(screen.getByLabelText('删除 pic.png'));
            expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
            expect(container.querySelector(`.${styles.cardImg}`)).not.toBeInTheDocument();
        });

        it('opens the built-in lightbox when clicking the card image (default preview, no onPreview)', () => {
            const { container } = render(<Upload listType="picture-card" />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            fireEvent.click(container.querySelector(`.${styles.cardImg}`) as HTMLImageElement);
            const dialog = screen.getByRole('dialog', { name: '预览 pic.png' });
            expect(dialog).toBeInTheDocument();
        });

        it('closes the built-in lightbox on Escape', () => {
            const { container } = render(<Upload listType="picture-card" />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            fireEvent.click(container.querySelector(`.${styles.cardImg}`) as HTMLImageElement);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('does not auto-open the lightbox for non-image files with no url', () => {
            const { container } = render(<Upload listType="picture-card" />);
            // 非图片但无法生成 url 时不渲染可预览卡片图片,点击不应弹灯箱
            pickFiles(getInput(container), [makeFile('doc.pdf', 'application/pdf')]);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    describe('listType="picture"', () => {
        it('renders an inline thumbnail img for image files', () => {
            const { container } = render(<Upload listType="picture" />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            const img = container.querySelector(`.${styles.textThumbImg}`) as HTMLImageElement;
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'blob:mock-url');
        });

        it('falls back to a file icon for non-image files', () => {
            const { container } = render(<Upload listType="picture" />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            expect(container.querySelector(`.${styles.textThumb}`)).toBeInTheDocument();
            expect(container.querySelector(`.${styles.textThumbImg}`)).not.toBeInTheDocument();
        });

        it('replaces the separate file icon with the thumbnail', () => {
            const { container } = render(<Upload listType="picture" />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            expect(container.querySelector(`.${styles.fileIcon}`)).not.toBeInTheDocument();
        });
    });

    describe('real upload (action)', () => {
        let latestXhr: {
            open: ReturnType<typeof vi.fn>;
            send: ReturnType<typeof vi.fn>;
            abort: ReturnType<typeof vi.fn>;
            setRequestHeader: ReturnType<typeof vi.fn>;
            withCredentials?: boolean;
            status: number;
            onload: (() => void) | null;
            onerror: (() => void) | null;
            onabort: (() => void) | null;
            upload: { onprogress: ((e: ProgressEvent) => void) | null };
            sentForm?: FormData | null;
        };
        class FakeXHR {
            open = vi.fn();
            send = vi.fn((body?: FormData) => {
                latestXhr.sentForm = body ?? null;
            });
            abort = vi.fn();
            setRequestHeader = vi.fn();
            status = 200;
            onload: (() => void) | null = null;
            onerror: (() => void) | null = null;
            onabort: (() => void) | null = null;
            upload: { onprogress: ((e: ProgressEvent) => void) | null } = { onprogress: null };
            constructor() {
                latestXhr = this as unknown as typeof latestXhr;
            }
        }
        beforeEach(() => {
            latestXhr = undefined!;
            vi.stubGlobal('XMLHttpRequest', FakeXHR);
        });
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('uses XHR FormData upload when action is provided', () => {
            const { container } = render(<Upload action="/api/upload" />);
            pickFiles(getInput(container), [makeFile('a.png', 'image/png')]);
            expect(latestXhr.open).toHaveBeenCalledWith('POST', '/api/upload', true);
            expect(latestXhr.send).toHaveBeenCalled();
        });

        it('supports function form for action (per-file URL)', async () => {
            const { container } = render(<Upload action={(file) => `/oss/${file.name}`} />);
            await pickFilesAsync(getInput(container), [makeFile('k.txt')]);
            expect(latestXhr.open).toHaveBeenCalledWith('POST', '/oss/k.txt', true);
        });

        it('supports function form for data (per-file signature)', async () => {
            const { container } = render(
                <Upload action="/api" data={(file) => ({ filename: file.name, sign: 'abc' })} />
            );
            await pickFilesAsync(getInput(container), [makeFile('v.txt')]);
            const form = latestXhr.sentForm as FormData;
            expect(form.get('filename')).toBe('v.txt');
            expect(form.get('sign')).toBe('abc');
        });

        it('awaits an async action (per-file signed URL) instead of sending a Promise', async () => {
            const { container } = render(<Upload action={() => Promise.resolve('/oss/signed')} />);
            await pickFilesAsync(getInput(container), [makeFile('s.txt')]);
            // 旧实现未 await，会把 Promise 当成地址（请求打到 "[object Promise]"）
            expect(latestXhr.open).toHaveBeenCalledWith('POST', '/oss/signed', true);
        });

        it('awaits async data fields before building FormData', async () => {
            const { container } = render(<Upload action="/api" data={() => Promise.resolve({ sign: 'async-sign' })} />);
            await pickFilesAsync(getInput(container), [makeFile('s.txt')]);
            expect((latestXhr.sentForm as FormData).get('sign')).toBe('async-sign');
        });

        it('marks error when the resolved action is empty (no silent 0% spin)', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload action={() => ''} onChange={onChange} />);
            await pickFilesAsync(getInput(container), [makeFile('e.txt')]);
            const last = (onChange.mock.calls.at(-1)![0] as { file: { status?: string } }).file;
            expect(last.status).toBe('error');
            expect(latestXhr).toBeUndefined();
            expect(screen.getByLabelText('上传失败')).toBeInTheDocument();
        });

        it('marks error when resolving action / data throws', async () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    onChange={onChange}
                    action={() => {
                        throw new Error('sign failed');
                    }}
                />
            );
            await pickFilesAsync(getInput(container), [makeFile('e.txt')]);
            const last = (onChange.mock.calls.at(-1)![0] as { file: { status?: string; error?: unknown } }).file;
            expect(last.status).toBe('error');
            expect(last.error).toBeInstanceOf(Error);
        });

        it('skips the request when the file is removed while resolving action', async () => {
            let resolveAction!: (url: string) => void;
            const { container } = render(
                <Upload
                    action={() =>
                        new Promise<string>((resolve) => {
                            resolveAction = resolve;
                        })
                    }
                />
            );
            pickFiles(getInput(container), [makeFile('late.txt')]);
            // 解析地址期间用户把文件删了 —— 恢复后不该再发请求，也不该把已删文件写回列表
            fireEvent.click(screen.getByLabelText('删除 late.txt'));
            await act(async () => {
                resolveAction('/api/late');
                await Promise.resolve();
            });
            expect(latestXhr).toBeUndefined();
            expect(screen.queryByText('late.txt')).not.toBeInTheDocument();
        });

        it('honors method / headers / withCredentials / data', () => {
            const { container } = render(
                <Upload
                    action="/api/upload"
                    method="PUT"
                    headers={{ Authorization: 'Bearer abc' }}
                    data={{ source: 'demo' }}
                    withCredentials
                />
            );
            pickFiles(getInput(container), [makeFile('a.txt')]);
            expect(latestXhr.withCredentials).toBe(true);
            expect(latestXhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer abc');
        });

        it('passes Blob/File data fields through FormData without stringifying', () => {
            const attachment = new File(['payload'], 'att.txt', { type: 'text/plain' });
            const blob = new Blob(['payload'], { type: 'text/plain' });
            const { container } = render(
                <Upload action="/api/upload" data={{ source: 'demo', attachment, extraBlob: blob }} />
            );
            pickFiles(getInput(container), [makeFile('a.txt')]);
            const form = latestXhr.sentForm as FormData;
            // 字符串仍被序列化
            expect(form.get('source')).toBe('demo');
            // File 原样透传(旧实现会被 String() 变成 '[object File]')
            expect(form.get('attachment')).toBe(attachment);
            // 裸 Blob 由 FormData 规范成 File,但绝不能被字符串化
            const storedBlob = form.get('extraBlob');
            expect(typeof storedBlob).not.toBe('string');
            expect(storedBlob).toBeInstanceOf(File);
            expect((storedBlob as File).size).toBe(blob.size);
        });

        it('maps progress and 2xx response to uploading/done', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload action="/api/upload" onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.png', 'image/png')]);
            const xhr = latestXhr;
            act(() => {
                xhr.upload.onprogress!({ lengthComputable: true, loaded: 50, total: 100 } as ProgressEvent);
            });
            let list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ percent: number; status: string }> })
                .fileList;
            expect(list[0].percent).toBe(50);
            expect(list[0].status).toBe('uploading');
            act(() => {
                xhr.status = 200;
                xhr.onload!();
            });
            list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ status: string }> }).fileList;
            expect(list[0].status).toBe('done');
            expect(screen.getByLabelText('上传完成')).toBeInTheDocument();
        });

        it('marks error on a non-2xx response', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload action="/api/upload" onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            act(() => {
                latestXhr.status = 500;
                latestXhr.onload!();
            });
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ status: string }> }).fileList;
            expect(list[0].status).toBe('error');
            expect(screen.getByLabelText('上传失败')).toBeInTheDocument();
        });

        it('aborts the in-flight request when the file is removed', () => {
            const { container } = render(<Upload action="/api/upload" />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            const xhr = latestXhr;
            fireEvent.click(screen.getByLabelText('删除 a.txt'));
            expect(xhr.abort).toHaveBeenCalled();
        });

        it('customRequest takes precedence over action', () => {
            let api: { onError: () => void } | null = null;
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    action="/api/upload"
                    customRequest={(options) => {
                        api = options;
                    }}
                    onChange={onChange}
                />
            );
            pickFiles(getInput(container), [makeFile('x.txt')]);
            expect(latestXhr).toBeUndefined();
            act(() => api!.onError());
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ status: string }> }).fileList;
            expect(list[0].status).toBe('error');
        });

        it('attaches the server response to file.response after a 2xx upload', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload action="/api/upload" onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            act(() => {
                latestXhr.response = 'ok';
                latestXhr.status = 200;
                latestXhr.onload!();
            });
            const info = onChange.mock.calls.at(-1)![0] as {
                file: { response?: unknown };
                fileList: Array<{ response?: unknown }>;
            };
            expect(info.file.response).toBe('ok');
            expect(info.fileList[0].response).toBe('ok');
        });

        it('attaches the error to file.error after a non-2xx upload', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload action="/api/upload" onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            act(() => {
                latestXhr.response = 'fail';
                latestXhr.status = 500;
                latestXhr.onload!();
            });
            const info = onChange.mock.calls.at(-1)![0] as {
                file: { error?: unknown };
                fileList: Array<{ error?: unknown }>;
            };
            expect(info.file.error).toBe('fail');
            expect(info.fileList[0].error).toBe('fail');
        });
    });

    describe('showUploadList', () => {
        it('hides the text list when showUploadList=false', () => {
            const { container } = render(<Upload showUploadList={false} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            expect(container.querySelector(`.${styles.textList}`)).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: '上传文件' })).toBeInTheDocument();
        });

        it('picture-card with showUploadList=false shows only the add tile', () => {
            const { container } = render(<Upload listType="picture-card" showUploadList={false} />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            expect(container.querySelector(`.${styles.card}`)).not.toBeInTheDocument();
            expect(screen.getByLabelText('上传文件')).toBeInTheDocument(); // add tile remains
        });

        it('showUploadList={ showRemoveIcon: false } hides the remove button', () => {
            render(<Upload showUploadList={{ showRemoveIcon: false }} />);
            pickFiles(document.body, [makeFile('a.txt')]);
            expect(screen.queryByLabelText('删除 a.txt')).not.toBeInTheDocument();
        });

        it('showUploadList={ showPreviewIcon: false } hides the preview eye for images', () => {
            render(<Upload showUploadList={{ showPreviewIcon: false }} onPreview={() => {}} />);
            pickFiles(document.body, [makeFile('pic.png', 'image/png')]);
            expect(screen.queryByLabelText('预览 pic.png')).not.toBeInTheDocument();
        });
    });

    describe('onPreview', () => {
        it('fires onPreview when the picture-card eye icon is clicked', () => {
            const onPreview = vi.fn();
            const { container } = render(<Upload listType="picture-card" onPreview={onPreview} />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            fireEvent.click(screen.getByLabelText('预览 pic.png'));
            expect(onPreview).toHaveBeenCalledTimes(1);
            expect(onPreview.mock.calls[0][0]).toMatchObject({ name: 'pic.png' });
        });

        it('fires onPreview via the eye button on a text-row image', () => {
            const onPreview = vi.fn();
            const { container } = render(<Upload onPreview={onPreview} />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            fireEvent.click(screen.getByLabelText('预览 pic.png'));
            expect(onPreview).toHaveBeenCalledTimes(1);
            expect(onPreview.mock.calls[0][0]).toMatchObject({ name: 'pic.png' });
        });

        it('opens the built-in lightbox from a text-row image when no onPreview is given', () => {
            const { container } = render(<Upload />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            fireEvent.click(screen.getByLabelText('预览 pic.png'));
            expect(screen.getByRole('dialog', { name: '预览 pic.png' })).toBeInTheDocument();
        });

        it('renders a preview eye on a picture-row image', () => {
            const { container } = render(<Upload listType="picture" onPreview={() => {}} />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            expect(screen.getByLabelText('预览 pic.png')).toBeInTheDocument();
        });

        it('does not render a preview eye for non-image files', () => {
            render(<Upload onPreview={() => {}} />);
            pickFiles(document.body, [makeFile('doc.pdf', 'application/pdf')]);
            expect(screen.queryByLabelText('预览 doc.pdf')).not.toBeInTheDocument();
        });
    });

    describe('onChange info shape + response/error', () => {
        it('passes { file, fileList } and surfaces the changed file', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            const info = onChange.mock.calls.at(-1)![0] as {
                file: { name: string };
                fileList: UploadFile[];
            };
            expect(info.file.name).toBe('a.txt');
            expect(info.fileList).toHaveLength(1);
        });

        it('customRequest onSuccess(response) attaches response to the file', () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload customRequest={({ onSuccess }) => onSuccess({ url: 'http://x/y.png' })} onChange={onChange} />
            );
            pickFiles(getInput(container), [makeFile('u.txt')]);
            const info = onChange.mock.calls.at(-1)![0] as {
                file: { response?: unknown };
            };
            expect(info.file.response).toEqual({ url: 'http://x/y.png' });
        });
    });

    describe('misc', () => {
        it('renders tip text below the trigger', () => {
            render(<Upload tip="单个文件不超过 5 MB" />);
            expect(screen.getByText('单个文件不超过 5 MB')).toBeInTheDocument();
        });

        it('renders tip text below the picture-card grid', () => {
            render(<Upload listType="picture-card" tip="最多 4 张" />);
            expect(screen.getByText('最多 4 张')).toBeInTheDocument();
        });

        it('maxCount reached: a new selection replaces the oldest file (text mode)', async () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    maxCount={1}
                    defaultFileList={[{ uid: '1', name: 'old.txt', status: 'done' as const }]}
                    onChange={onChange}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('new.txt')]);
            });
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList;
            expect(list).toHaveLength(1);
            expect(list[0].name).toBe('new.txt');
            expect(screen.queryByText('old.txt')).not.toBeInTheDocument();
            expect(screen.getByText('new.txt')).toBeInTheDocument();
        });

        it('maxCount>1 with room left: the new file is appended after the existing ones', async () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    maxCount={2}
                    defaultFileList={[{ uid: '1', name: 'old.txt', status: 'done' as const }]}
                    onChange={onChange}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('new.txt')]);
            });
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList;
            expect(list.map((f) => f.name)).toEqual(['old.txt', 'new.txt']);
            expect(screen.getByText('old.txt')).toBeInTheDocument();
            expect(screen.getByText('new.txt')).toBeInTheDocument();
        });

        it('maxCount>1 when full: the new file is dropped and onChange is not fired', async () => {
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    maxCount={2}
                    defaultFileList={[
                        { uid: '1', name: 'old1.txt', status: 'done' as const },
                        { uid: '2', name: 'old2.txt', status: 'done' as const },
                    ]}
                    onChange={onChange}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('new.txt')]);
            });
            // 已满员时新文件被丢弃，不进列表、不上报 onChange
            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByText('old1.txt')).toBeInTheDocument();
            expect(screen.getByText('old2.txt')).toBeInTheDocument();
            expect(screen.queryByText('new.txt')).not.toBeInTheDocument();
        });

        it('maxCount>1 when full: dropped files are not uploaded', async () => {
            const customRequest = vi.fn();
            const { container } = render(
                <Upload
                    maxCount={2}
                    customRequest={customRequest}
                    defaultFileList={[
                        { uid: '1', name: 'old1.txt', status: 'done' as const },
                        { uid: '2', name: 'old2.txt', status: 'done' as const },
                    ]}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('new.txt')]);
            });
            expect(customRequest).not.toHaveBeenCalled();
        });

        it('exposes originFileObj and thumbUrl (url stays the download/remote address)', () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            const info = onChange.mock.calls.at(-1)![0] as {
                file: { thumbUrl?: string; url?: string; originFileObj?: File };
            };
            expect(info.file.originFileObj).toBeInstanceOf(File);
            expect(info.file.originFileObj!.name).toBe('pic.png');
            // 自动生成的 ObjectURL 进入 thumbUrl，而非 url
            expect(info.file.thumbUrl).toBe('blob:mock-url');
            expect(info.file.url).toBeUndefined();
        });

        it('reports a removed file with status:"removed" via onChange', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onChange={onChange} />);
            pickFiles(getInput(container), [makeFile('a.txt')]);
            fireEvent.click(screen.getByLabelText('删除 a.txt'));
            const info = onChange.mock.calls.at(-1)![0] as { file: { status?: string } };
            expect(info.file.status).toBe('removed');
        });

        it('sets the webkitdirectory attribute when directory=true', () => {
            const { container } = render(<Upload directory />);
            expect(getInput(container).getAttribute('webkitdirectory')).not.toBeNull();
        });

        it('omits webkitdirectory when directory is not set', () => {
            const { container } = render(<Upload />);
            expect(getInput(container).getAttribute('webkitdirectory')).toBeNull();
        });
    });

    describe('regression: 资源释放与迟到的回调', () => {
        it('ignores a late customRequest callback after the file was removed (never reports an undefined file)', async () => {
            let succeed: (() => void) | null = null;
            const onChange = vi.fn();
            const { container } = render(
                <Upload
                    customRequest={({ onSuccess }) => {
                        succeed = () => onSuccess();
                    }}
                    onChange={onChange}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.txt')]);
            });
            await act(async () => {
                fireEvent.click(screen.getByLabelText('删除 a.txt'));
            });
            onChange.mockClear();
            await act(async () => {
                succeed!();
            });
            // 迟到的回调不得再上报 onChange，否则 info.file 会是 undefined（类型声明为非可选）
            expect(onChange).not.toHaveBeenCalled();
        });

        it('revokes the object URL when the consumer removes the file externally (controlled)', async () => {
            const onChange = vi.fn();
            const { container, rerender } = render(<Upload fileList={[]} onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            });
            const added = (onChange.mock.calls[0][0] as { fileList: UploadFile[] }).fileList;
            rerender(<Upload fileList={added} onChange={onChange} />);
            (window.URL.revokeObjectURL as ReturnType<typeof vi.fn>).mockClear();
            rerender(<Upload fileList={[]} onChange={onChange} />);
            expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
        });

        it('does not leak: revoke is not called for files that are still listed', async () => {
            const onChange = vi.fn();
            const { container, rerender } = render(<Upload fileList={[]} onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            });
            const added = (onChange.mock.calls[0][0] as { fileList: UploadFile[] }).fileList;
            rerender(<Upload fileList={added} onChange={onChange} />);
            expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
        });

        it('closes the built-in lightbox when its file is removed', async () => {
            const { container } = render(<Upload listType="picture-card" />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            });
            fireEvent.click(screen.getByAltText('pic.png'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await act(async () => {
                fireEvent.click(screen.getByLabelText('删除 pic.png'));
            });
            // 文件被删后 ObjectURL 已 revoke，弹层必须关闭而不是留着裂图
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('moves focus into the lightbox and returns it to the opener on close', async () => {
            const { container } = render(<Upload />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            });
            const opener = screen.getByLabelText('预览 pic.png');
            opener.focus();
            fireEvent.click(opener);
            expect(document.activeElement).toBe(screen.getByLabelText('关闭预览'));
            fireEvent.click(screen.getByLabelText('关闭预览'));
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(document.activeElement).toBe(opener);
        });

        it('traps Tab inside the lightbox and locks background scrolling', async () => {
            const { container } = render(<Upload />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('pic.png', 'image/png')]);
            });
            const opener = screen.getByLabelText('预览 pic.png');
            opener.focus();
            fireEvent.click(opener);
            const closeBtn = screen.getByLabelText('关闭预览');
            // 弹层里只有关闭按钮可聚焦：Tab / Shift+Tab 都应被拉回它，而不是跑到背景内容
            fireEvent.keyDown(document, { key: 'Tab' });
            expect(document.activeElement).toBe(closeBtn);
            fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
            expect(document.activeElement).toBe(closeBtn);
            expect(document.body.style.overflow).toBe('hidden');
            fireEvent.click(closeBtn);
            expect(document.body.style.overflow).not.toBe('hidden');
        });
    });

    describe('onExceed', () => {
        it('fires with the dropped files when maxCount>1 is already full', async () => {
            const onExceed = vi.fn();
            const { container } = render(
                <Upload
                    maxCount={2}
                    onExceed={onExceed}
                    defaultFileList={[
                        { uid: '1', name: 'old1.txt', status: 'done' as const },
                        { uid: '2', name: 'old2.txt', status: 'done' as const },
                    ]}
                />
            );
            const extra = makeFile('new.txt');
            await act(async () => {
                pickFiles(getInput(container), [extra]);
            });
            expect(onExceed).toHaveBeenCalledTimes(1);
            expect(onExceed.mock.calls[0][0]).toEqual([extra]);
        });

        it('fires for files left unprocessed when maxCount=1 with a multi-select', async () => {
            const onExceed = vi.fn();
            const { container } = render(<Upload multiple maxCount={1} onExceed={onExceed} />);
            const [first, ...rest] = [makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')];
            await act(async () => {
                pickFiles(getInput(container), [first, ...rest]);
            });
            // 旧实现在循环里直接 break，多余的 2 个文件被静默丢掉（既不进列表也不通知）
            expect(onExceed).toHaveBeenCalledTimes(1);
            expect(onExceed.mock.calls[0][0]).toEqual(rest);
            expect(screen.getByText('a.txt')).toBeInTheDocument();
        });

        it('does not fire for maxCount=1 replacement (the old file is replaced, not exceeded)', async () => {
            const onExceed = vi.fn();
            const { container } = render(
                <Upload
                    maxCount={1}
                    onExceed={onExceed}
                    defaultFileList={[{ uid: '1', name: 'old.txt', status: 'done' as const }]}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('new.txt')]);
            });
            expect(onExceed).not.toHaveBeenCalled();
        });
    });

    describe('边界值', () => {
        it('maxCount={0} is treated as unlimited instead of blocking every selection', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload maxCount={0} onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.txt')]);
            });
            expect((onChange.mock.calls.at(-1)![0] as { fileList: UploadFile[] }).fileList).toHaveLength(1);
        });

        it('disables the remove buttons when disabled', () => {
            render(<Upload disabled defaultFileList={[{ uid: '1', name: 'a.txt' }]} />);
            expect(screen.getByLabelText('删除 a.txt')).toBeDisabled();
        });

        it('keeps only the first file when multiple is false (drag can bypass the input limit)', async () => {
            const onChange = vi.fn();
            render(<Upload drag onChange={onChange} />);
            const zone = screen.getByRole('button', { name: '上传文件' });
            await act(async () => {
                fireEvent.drop(zone, { dataTransfer: { files: [makeFile('a.txt'), makeFile('b.txt')] } });
            });
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: UploadFile[] }).fileList;
            expect(list.map((f) => f.name)).toEqual(['a.txt']);
        });

        it('does not truncate a folder selection when directory is set (without multiple)', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload directory onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')]);
            });
            // 旧实现按 multiple=false 截断，选整个文件夹只会上传到第一个文件
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: UploadFile[] }).fileList;
            expect(list.map((f) => f.name)).toEqual(['a.txt', 'b.txt', 'c.txt']);
        });

        it('logs beforeUpload failures instead of silently dropping the file', async () => {
            const onChange = vi.fn();
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const { container } = render(
                <Upload
                    onChange={onChange}
                    beforeUpload={() => {
                        throw new Error('boom');
                    }}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.txt')]);
            });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][1]).toBeInstanceOf(Error);
            expect(onChange).not.toHaveBeenCalled();
            spy.mockRestore();
        });

        it('disables the preview buttons when disabled', async () => {
            render(
                <Upload
                    disabled
                    defaultFileList={[{ uid: '1', name: 'a.png', type: 'image/png', thumbUrl: 'blob:x' }]}
                />
            );
            const preview = screen.getByRole('button', { name: '预览 a.png' });
            expect(preview).toBeDisabled();
            // 旧实现预览按钮没接 disabled，禁用状态下仍能点开弹层
            fireEvent.click(preview);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('marks error when customRequest throws synchronously', async () => {
            const onChange = vi.fn();
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const { container } = render(
                <Upload
                    multiple
                    onChange={onChange}
                    customRequest={() => {
                        throw new Error('customRequest boom');
                    }}
                />
            );
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.txt'), makeFile('b.txt')]);
            });
            // 旧实现让异常冒泡成未捕获 rejection：两个文件都停在 uploading，后一个甚至不上传
            const list = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ status?: string }> }).fileList;
            expect(list.map((f) => f.status)).toEqual(['error', 'error']);
            expect(spy).toHaveBeenCalledTimes(2);
            spy.mockRestore();
        });

        it('filters dropped files by accept (the input attribute cannot police drag & drop)', async () => {
            const onChange = vi.fn();
            render(<Upload drag multiple accept="image/*" onChange={onChange} />);
            const zone = screen.getByRole('button', { name: '上传文件' });
            await act(async () => {
                fireEvent.drop(zone, {
                    dataTransfer: { files: [makeFile('a.txt'), makeFile('b.png', 'image/png')] },
                });
            });
            const names = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList.map(
                (f) => f.name
            );
            expect(names).toEqual(['b.png']);
        });

        it('accepts extension patterns and ignores files without a MIME type', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload multiple accept=".png,.jpg" onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [makeFile('a.png', 'image/png'), makeFile('b.pdf', 'application/pdf')]);
            });
            const names = (onChange.mock.calls.at(-1)![0] as { fileList: Array<{ name: string }> }).fileList.map(
                (f) => f.name
            );
            expect(names).toEqual(['a.png']);
        });

        it('logs and blocks when onRemove throws', async () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const onChange = vi.fn();
            render(
                <Upload
                    defaultFileList={[{ uid: '1', name: 'a.txt' }]}
                    onChange={onChange}
                    onRemove={() => {
                        throw new Error('remove boom');
                    }}
                />
            );
            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: '删除 a.txt' }));
            });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(screen.getByText('a.txt')).toBeInTheDocument();
            spy.mockRestore();
        });

        it('keeps the original File in originFileObj when beforeUpload transforms it', async () => {
            const onChange = vi.fn();
            const renamed = new File(['data'], 'renamed.txt', { type: 'text/plain' });
            const original = makeFile('original.txt');
            const { container } = render(<Upload beforeUpload={() => renamed} onChange={onChange} />);
            await act(async () => {
                pickFiles(getInput(container), [original]);
            });
            const info = onChange.mock.calls.at(-1)![0] as { file: { name: string; originFileObj?: File } };
            expect(info.file.name).toBe('renamed.txt'); // 上传的是转换后的
            expect(info.file.originFileObj).toBe(original); // originFileObj 仍是原始的
        });
    });
});
