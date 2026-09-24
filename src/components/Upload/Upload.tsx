import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UploadIcon, FileIcon, CheckIcon, CloseIcon, EyeIcon } from 'naive-icons';
import styles from './upload.module.less';

/** 单个文件的状态 */
export type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed';

/** 文件列表的展示形态 */
export type UploadListType = 'text' | 'picture' | 'picture-card';

/** 文件列表项（组件内部以 uid 追踪） */
export interface UploadFile {
    /** 唯一标识 */
    uid: string;
    /** 文件名 */
    name: string;
    /** 字节数 */
    size?: number;
    /** MIME 类型 */
    type?: string;
    /** 上传状态，默认 'uploading'；删除时经 onChange 上报为 'removed' */
    status?: UploadFileStatus;
    /** 上传进度 0–100 */
    percent?: number;
    /** 下载/服务端地址（语义上区别于缩略图）；由自定义/受控 fileList 或服务端提供 */
    url?: string;
    /** 缩略图地址（与本地上传时组件自动生成的 ObjectURL）；展示时优先于 url */
    thumbUrl?: string;
    /** 用户选择的原始 File 对象（beforeUpload 返回转换后的 File 时，这里仍是未转换的原始文件） */
    originFileObj?: File;
    /** 服务端返回（action XHR 的 response，或 customRequest 调 onSuccess(resp) 时传入） */
    response?: unknown;
    /** 失败信息（action XHR 出错，或 customRequest 调 onError(err) 时传入） */
    error?: unknown;
}

/** customRequest 收到的回调集合 */
export interface UploadCustomRequestOptions {
    file: File;
    /** 上报进度 0–100 */
    onProgress: (percent: number) => void;
    /** 标记成功，可附带服务端返回 */
    onSuccess: (response?: unknown) => void;
    /** 标记失败，可附带错误信息 */
    onError: (error?: unknown) => void;
}

/** onChange 回调收到的信息（file 为本次变化的文件，fileList 为最新列表） */
export interface UploadChangeParam {
    /** 本次发生变化的文件 */
    file: UploadFile;
    /** 最新文件列表（受控模式下以此为准） */
    fileList: UploadFile[];
    /** 进度事件（仅 XHR 上传进度跳变时携带） */
    event?: ProgressEvent;
}

/** 列表显隐配置（布尔形式等价 `{ showPreviewIcon: true, showRemoveIcon: true }`） */
export interface UploadShowUploadList {
    /** 是否显示预览图标（picture-card 下点击缩略图触发 onPreview），默认 true */
    showPreviewIcon?: boolean;
    /** 是否显示删除图标，默认 true */
    showRemoveIcon?: boolean;
}

export type UploadOnChange = (info: UploadChangeParam) => void;

export interface UploadProps {
    /** 接受的文件类型，透传给 <input accept>，如 "image/*" 或 ".pdf,.png" */
    accept?: string;
    /** 是否支持多选 */
    multiple?: boolean;
    /**
     * 最多上传的文件数。语义如下：
     * - `1`：新文件替换已有的那个（头像 / 单文件场景）
     * - `>1`：保留最早的 N 个，超出的新文件直接丢弃且不触发 onChange（改用 onExceed 通知）
     * 触发区 / 添加块始终可点，由消费方决定是否自行隐藏。
     * `0` 或负数视为未设置（不限量）。
     */
    maxCount?: number;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否按目录选择上传（透传 webkitdirectory，浏览器支持整文件夹选择） */
    directory?: boolean;
    /** 文件列表（受控）；传入后列表完全由外部驱动 */
    fileList?: UploadFile[];
    /** 默认文件列表（非受控） */
    defaultFileList?: UploadFile[];
    /** 列表形态：text 文件行 / picture 带行内缩略图 / picture-card 图片卡片，默认 'text' */
    listType?: UploadListType;
    /** 是否展示文件列表，或传入对象分别控制预览/删除图标，默认 true */
    showUploadList?: boolean | UploadShowUploadList;
    /** 点击预览（picture-card 缩略图或 picture/text 行图片的预览图标）时触发 */
    onPreview?: (file: UploadFile) => void;
    /** 是否开启拖拽上传区域 */
    drag?: boolean;
    /** 触发区下方的提示文字 */
    tip?: React.ReactNode;
    /** 自定义触发区内容（text / drag）；picture-card 下自定义添加块图标 */
    children?: React.ReactNode;
    /** 上传前的钩子；返回 false（或 Promise<false>）则跳过该文件，返回 File（或 Promise<File>）则改为上传该转换后的文件 */
    beforeUpload?: (file: File, fileList: File[]) => boolean | File | Promise<boolean | File>;
    /** 自定义上传实现；优先级高于 action（若同时提供则优先 customRequest） */
    customRequest?: (options: UploadCustomRequestOptions) => void;
    /**
     * 上传地址；提供时用原生 XMLHttpRequest 真实上传（优先级低于 customRequest）。
     * 也接受 (file) => 地址 或异步 (file) => Promise<地址> 的形式（便于每文件取 OSS 直传签名）。
     * 解析结果为空字符串时该文件标记为 error，不会静默停在 uploading。
     */
    action?: string | ((file: File) => string | Promise<string>);
    /** 请求方法，默认 POST */
    method?: 'POST' | 'PUT' | 'PATCH';
    /** 追加到请求的自定义请求头 */
    headers?: Record<string, string>;
    /** 随文件一起提交的附加表单字段；也接受 (file) => 字段 或异步 (file) => Promise<字段> 的形式 */
    data?:
        | Record<string, unknown>
        | ((file: File) => Record<string, unknown> | undefined | Promise<Record<string, unknown> | undefined>);
    /** 文件字段名，默认 'file' */
    name?: string;
    /** 是否携带跨域凭证（withCredentials） */
    withCredentials?: boolean;
    /** 列表变化回调（新增/进度/完成/删除都会触发），参数为 { file, fileList, event? } */
    onChange?: UploadOnChange;
    /**
     * 选中的文件超出 maxCount 被丢弃时触发（组件自身静默丢弃，用它提示用户「已达上限」）。
     * 参数为被丢弃的原始 File 列表与当前文件列表。仅在 maxCount > 1 的丢弃分支触发，
     * maxCount === 1 属于替换语义，不触发。
     */
    onExceed?: (files: File[], fileList: UploadFile[]) => void;
    /** 删除前的钩子；返回 false（或 Promise<false>）则阻止删除 */
    onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>;
    /** 无可见说明时的无障碍标签（默认「上传文件」） */
    'aria-label'?: string;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

let uidSeed = 0;
const genUid = () => `animal-upload-${Date.now().toString(36)}-${(uidSeed += 1)}`;

const clampPercent = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * 按 accept 校验单个文件（拖拽进来的文件不受 <input accept> 约束，必须自己过滤）。
 * 规则同浏览器：`.ext` 比扩展名、`image/*` 比主类型、`image/png` 精确比 MIME。
 */
const matchAccept = (file: File, accept?: string): boolean => {
    if (!accept) return true;
    const patterns = accept
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (patterns.length === 0) return true;
    const name = (file.name || '').toLowerCase();
    const mime = (file.type || '').toLowerCase();
    // 部分系统拖进来的文件没有 MIME 信息，此时只按扩展名判断，避免误杀
    if (!mime) return patterns.some((p) => p.startsWith('.') && name.endsWith(p));
    const baseMime = mime.replace(/\/.*$/, '');
    return patterns.some((p) => {
        if (p.startsWith('.')) return name.endsWith(p);
        if (p.endsWith('/*')) return baseMime === p.replace(/\/.*$/, '');
        return mime === p;
    });
};

/** 字节数格式化为 B / KB / MB */
const formatFileSize = (size?: number): string => {
    if (size === undefined || size === null || Number.isNaN(size)) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const Upload: React.FC<UploadProps> = ({
    accept,
    multiple = false,
    maxCount,
    disabled = false,
    directory = false,
    fileList,
    defaultFileList,
    listType = 'text',
    showUploadList = true,
    onPreview,
    drag = false,
    tip,
    children,
    beforeUpload,
    customRequest,
    action,
    method = 'POST',
    headers,
    data,
    name,
    withCredentials,
    onChange,
    onExceed,
    onRemove,
    'aria-label': ariaLabel,
    className,
    style,
}) => {
    const listVisible = showUploadList !== false;
    const showRemoveIcon = typeof showUploadList === 'object' ? showUploadList.showRemoveIcon !== false : true;
    const showPreviewIcon = typeof showUploadList === 'object' ? showUploadList.showPreviewIcon !== false : true;
    const [innerList, setInnerList] = useState<UploadFile[]>(defaultFileList ?? []);
    const isControlled = fileList !== undefined;
    const list = isControlled ? fileList! : innerList;
    const listRef = useRef(list);
    listRef.current = list;

    const inputRef = useRef<HTMLInputElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const previewLayerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const dragDepth = useRef(0);
    const [previewTarget, setPreviewTarget] = useState<UploadFile | null>(null);

    // uid -> 模拟上传定时器 / 组件生成的 ObjectURL（卸载与删除时清理）
    const timersRef = useRef<Map<string, number>>(new Map());
    const blobUrlsRef = useRef<Map<string, string>>(new Map());
    const xhrRef = useRef<Map<string, XMLHttpRequest>>(new Map());

    // 图片文件（有可预览地址）默认自带 onPreview：未传 onPreview 时组件内置大图预览弹层。
    // 缩略图优先取 thumbUrl，回退到 url（下载/服务端地址）。
    const previewSrc = (file: UploadFile) => file.thumbUrl ?? file.url;
    const isImage = (file: UploadFile) =>
        Boolean(file.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(file.name || ''));
    const canPreview = (file: UploadFile) => Boolean(previewSrc(file)) && isImage(file);

    const openPreview = useCallback(
        (file: UploadFile) => {
            if (onPreview) {
                onPreview(file);
                return;
            }
            if (previewSrc(file)) setPreviewTarget(file);
        },
        [onPreview]
    );

    // 预览目标若已从列表移除（被删除 / 被替换），它的 ObjectURL 已被 revoke，
    // 继续展示会裂图 —— 这里直接关闭弹层。
    useEffect(() => {
        if (!previewTarget) return;
        if (!list.some((f) => f.uid === previewTarget.uid)) setPreviewTarget(null);
    }, [list, previewTarget]);

    useEffect(() => {
        if (!previewTarget) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewTarget(null);
                return;
            }
            // 焦点陷阱：modal 打开时 Tab 不该跑到背景内容上，在弹层内循环
            if (e.key !== 'Tab') return;
            const focusables = Array.from(
                previewLayerRef.current?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
                ) ?? []
            );
            if (focusables.length === 0) {
                e.preventDefault();
                closeBtnRef.current?.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && (active === first || active === previewLayerRef.current)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        // 打开期间锁住背景滚动（关闭时恢复原值，避免覆盖消费方自己的样式）
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        // 打开时把焦点移入弹层，关闭后归还给触发元素
        const opener = document.activeElement as HTMLElement | null;
        closeBtnRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            opener?.focus?.();
        };
    }, [previewTarget]);

    // 统一提交入口：非受控更新内部 state，受控只通知（列表由外部回传）。
    // ref 必须在 commit 内同步更新：同一次事件里紧接着的 patchFile（如模拟进度首跳）
    // 才能读到包含新文件的列表，否则会读到旧列表把新文件「抹掉」。
    // changed 为本次变化的文件；event 仅 XHR 进度跳变时携带。
    // notify=false 时只更新列表不上报 onChange（maxCount 满员丢弃新文件的场景）。
    const commit = useCallback(
        (next: UploadFile[], changed?: UploadFile, event?: ProgressEvent, notify = true) => {
            listRef.current = next;
            if (!isControlled) setInnerList(next);
            if (notify) onChange?.({ file: changed ?? next[0], fileList: next, event });
        },
        [isControlled, onChange]
    );

    // 停止单个文件的传输（模拟进度定时器 / 真实 XHR），但保留 ObjectURL。
    // 受控模式下删除只走到这里：外部 fileList 可能异步才更新，提前 revoke 会让中间帧裂图，
    // URL 的释放交给受控 diff（外部真正移除后）或组件卸载。
    const stopTransfer = useCallback((uid: string) => {
        const timer = timersRef.current.get(uid);
        if (timer !== undefined) {
            window.clearInterval(timer);
            timersRef.current.delete(uid);
        }
        const xhr = xhrRef.current.get(uid);
        if (xhr) {
            xhr.abort();
            xhrRef.current.delete(uid);
        }
    }, []);

    // 停止传输并释放组件生成的 ObjectURL。
    // 非受控删除、被 maxCount 丢弃、受控下被外部移除、组件卸载都会走这里。
    const releaseFile = useCallback(
        (uid: string) => {
            stopTransfer(uid);
            const blobUrl = blobUrlsRef.current.get(uid);
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
                blobUrlsRef.current.delete(uid);
            }
        },
        [stopTransfer]
    );

    const patchFile = useCallback(
        (uid: string, patch: Partial<UploadFile>, event?: ProgressEvent) => {
            // 文件已不在列表（被删除、被丢弃、受控下被外部移除）时忽略迟到的回调：
            // 否则会误报 onChange，且 file 会兜底成 undefined 让消费方崩溃。
            if (!listRef.current.some((f) => f.uid === uid)) return;
            const next = listRef.current.map((f) => (f.uid === uid ? { ...f, ...patch } : f));
            const changed = next.find((f) => f.uid === uid);
            commit(next, changed, event);
        },
        [commit]
    );

    const clearTimers = useCallback(() => {
        timersRef.current.forEach((t) => window.clearInterval(t));
        timersRef.current.clear();
        xhrRef.current.forEach((xhr) => xhr.abort());
        xhrRef.current.clear();
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    // 受控模式下外部直接移除列表项时组件无从感知，这里 diff 一次补做资源清理，
    // 否则该文件的 ObjectURL 会一直泄漏到组件卸载（被移除图片的 blob 无法回收）。
    const prevUidsRef = useRef<string[]>([]);
    useEffect(() => {
        const uids = list.map((f) => f.uid);
        if (!isControlled) {
            prevUidsRef.current = uids;
            return;
        }
        const currentUids = new Set(uids);
        prevUidsRef.current.forEach((uid) => {
            if (!currentUids.has(uid)) releaseFile(uid);
        });
        prevUidsRef.current = uids;
    }, [list, isControlled, releaseFile]);

    // 默认上传实现：定时器模拟进度（每 220ms 增 12%–20%，走完后置 done）
    const simulateUpload = useCallback(
        (uid: string) => {
            patchFile(uid, { percent: 6 });
            const timer = window.setInterval(() => {
                const current = listRef.current.find((f) => f.uid === uid);
                const next = (current?.percent ?? 0) + 12 + Math.round(Math.random() * 8);
                if (next >= 100) {
                    window.clearInterval(timer);
                    timersRef.current.delete(uid);
                    patchFile(uid, { percent: 100, status: 'done' });
                } else {
                    patchFile(uid, { percent: next });
                }
            }, 220);
            timersRef.current.set(uid, timer);
        },
        [patchFile]
    );

    // 真实上传实现：action 存在时用 XMLHttpRequest 提交 FormData，支持进度与取消。
    // action / data 支持同步与异步 (file) => ... 函数形式，便于每文件差异化（如异步取 OSS 直传签名）。
    const startRealUpload = useCallback(
        async (file: File, uid: string) => {
            // 函数形式必须 await：返回 Promise（异步签名）时不 await 会把 Promise 当成地址，
            // 请求会打到 "[object Promise]"。解析失败同样不能让文件静默停在 uploading。
            let resolvedAction: string;
            let resolvedData: Record<string, unknown> | undefined;
            try {
                resolvedAction = (typeof action === 'function' ? await action(file) : action) ?? '';
                resolvedData = typeof data === 'function' ? await data(file) : data;
            } catch (err) {
                patchFile(uid, { status: 'error', percent: 100, error: err });
                return;
            }
            // 解析期间文件可能已被删除 / 被丢弃，此时不该再发请求
            if (!listRef.current.some((f) => f.uid === uid)) return;
            // 地址为空（如签名接口返回空）时标记失败，否则文件会永久停在 uploading 0%
            if (!resolvedAction) {
                patchFile(uid, {
                    status: 'error',
                    percent: 100,
                    error: new Error('upload action is empty'),
                });
                return;
            }
            const xhr = new XMLHttpRequest();
            xhrRef.current.set(uid, xhr);

            const form = new FormData();
            form.append(name ?? 'file', file, file.name);
            if (resolvedData) {
                Object.entries(resolvedData).forEach(([key, value]) => {
                    // Blob / File 直接透传，避免被 String() 序列化破坏（其余值转为字符串）
                    if (value instanceof Blob) {
                        form.append(key, value);
                    } else {
                        form.append(key, String(value));
                    }
                });
            }

            xhr.open(method, resolvedAction, true);
            if (withCredentials) xhr.withCredentials = true;
            if (headers) {
                Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
            }

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    patchFile(uid, { status: 'uploading', percent: clampPercent((e.loaded / e.total) * 100) }, e);
                }
            };
            xhr.onload = () => {
                xhrRef.current.delete(uid);
                const ok = xhr.status >= 200 && xhr.status < 300;
                patchFile(
                    uid,
                    ok
                        ? { status: 'done', percent: 100, response: xhr.response }
                        : { status: 'error', percent: 100, error: xhr.response }
                );
            };
            xhr.onerror = () => {
                xhrRef.current.delete(uid);
                patchFile(uid, { status: 'error', percent: 100, error: new Error('network error') });
            };
            xhr.onabort = () => {
                xhrRef.current.delete(uid);
            };
            xhr.send(form);
        },
        [action, data, headers, method, name, withCredentials, patchFile]
    );

    const runRequest = useCallback(
        (file: File, uid: string) => {
            if (customRequest) {
                try {
                    customRequest({
                        file,
                        onProgress: (pct) => patchFile(uid, { percent: clampPercent(pct), status: 'uploading' }),
                        onSuccess: (response) => patchFile(uid, { status: 'done', percent: 100, response }),
                        onError: (error) => patchFile(uid, { status: 'error', percent: 100, error }),
                    });
                } catch (err) {
                    // 同步抛错时不让它冒泡成未捕获的 rejection（会中断同批其他文件），
                    // 直接把该文件标记为失败
                    console.error('[Upload] customRequest threw:', err);
                    patchFile(uid, { status: 'error', percent: 100, error: err });
                }
            } else if (action) {
                void startRealUpload(file, uid);
            } else {
                simulateUpload(uid);
            }
        },
        [customRequest, action, startRealUpload, patchFile, simulateUpload]
    );

    const handleFiles = useCallback(
        async (rawFiles: File[]) => {
            if (disabled || rawFiles.length === 0) return;
            // multiple=false 时只取第一个：<input multiple={false}> 管不到拖拽进来的文件，
            // 拖入多个必须在这里截断，否则单选语义会被绕过。
            // directory（整文件夹选择）视为多选 —— 截断会让用户只上传到文件夹里的第一个文件。
            const truncated = multiple || directory ? rawFiles : rawFiles.slice(0, 1);
            // 拖拽同样绕不过 accept：<input accept> 只约束文件选择框，drop 进来的要自己过滤
            const rawFilesIn = truncated.filter((f) => matchAccept(f, accept));
            if (rawFilesIn.length === 0) return;
            // 0 / 负数视为未设置（否则 `added.length >= 0` 会让组件永远加不进文件）
            const limit = maxCount && maxCount > 0 ? maxCount : undefined;

            const added: UploadFile[] = [];
            const requests: Array<[File, string]> = [];
            // 因达到 maxCount 而压根没被处理的文件（循环 break 掉的），也要通知消费方
            let overflow: File[] = [];
            // uid -> 用户选择的原始 File（beforeUpload 可能返回转换后的文件，通知时回传原始的）
            const rawByUid = new Map<string, File>();

            for (let i = 0; i < rawFilesIn.length; i += 1) {
                const file = rawFilesIn[i];
                if (limit !== undefined && added.length >= limit) {
                    overflow = rawFilesIn.slice(i);
                    break;
                }
                let uploadFile: File = file;
                if (beforeUpload) {
                    try {
                        const res = await beforeUpload(file, rawFilesIn);
                        if (res === false) continue;
                        if (res instanceof File) uploadFile = res;
                    } catch (err) {
                        // 钩子自身抛错时不静默吞掉：否则用户选了文件却毫无反应，无从排查
                        console.error('[Upload] beforeUpload threw, file skipped:', err);
                        continue;
                    }
                }
                const uid = genUid();
                const item: UploadFile = {
                    uid,
                    name: uploadFile.name,
                    size: uploadFile.size,
                    type: uploadFile.type,
                    status: 'uploading',
                    percent: 0,
                    // 保留用户选择的原始文件：beforeUpload 转换过的话，上传的是转换后的那个
                    originFileObj: file,
                };
                // 缩略图地址：图片文件自动生成 ObjectURL（text/picture 行预览与 picture-card 缩略图共用），
                // 存入 thumbUrl，与 url（下载/服务端地址）语义分离。
                if (uploadFile.type.startsWith('image/')) {
                    const url = URL.createObjectURL(uploadFile);
                    blobUrlsRef.current.set(uid, url);
                    item.thumbUrl = url;
                }
                added.push(item);
                requests.push([uploadFile, uid]);
                rawByUid.set(uid, file);
            }

            if (added.length === 0 && overflow.length === 0) return;
            const current = listRef.current;
            // maxCount 语义如下：
            // - 未设置：直接追加
            // - === 1：新文件替换已有的那个（slice(-1)）
            // - > 1：保留最早的 N 个，超出的新文件直接丢弃（slice(0, N)），且不触发 onChange
            let dropped: UploadFile[] = [];
            let next: UploadFile[];
            if (limit === undefined) {
                next = [...current, ...added];
            } else if (limit === 1) {
                const merged = [...current, ...added];
                next = merged.slice(-1);
                dropped = merged.slice(0, merged.length - 1);
            } else {
                const merged = [...current, ...added];
                next = merged.slice(0, limit);
                dropped = merged.slice(limit);
            }
            // 清理被丢弃项的定时器 / XHR / ObjectURL
            dropped.forEach((f) => releaseFile(f.uid));
            // 只保留下来的文件才发起上传；全部新文件都被丢弃时不上报 onChange。
            const keptUids = new Set(next.map((f) => f.uid));
            const keptAdded = added.filter((f) => keptUids.has(f.uid));
            // 超上限被丢弃的新文件：用 onExceed 通知，否则消费方无从知晓用户选了文件却被拒。
            // 两类来源：进了列表又被顶掉的（dropped ∩ added），以及因已达上限压根没处理的（overflow）。
            // maxCount === 1 是替换语义，被顶掉的「旧」文件不算超限，故按「是否本次新增」过滤。
            const addedUids = new Set(added.map((f) => f.uid));
            const exceedFiles = [
                ...dropped.filter((f) => addedUids.has(f.uid)).map((f) => rawByUid.get(f.uid)),
                ...overflow,
            ].filter((f): f is File => Boolean(f));
            if (exceedFiles.length > 0) onExceed?.(exceedFiles, next);
            // 一个新文件都没留下时不改列表（避免用同一个数组引用触发无意义的重渲染）
            if (added.length > 0) {
                commit(next, keptAdded[keptAdded.length - 1], undefined, keptAdded.length > 0);
                requests.filter(([, uid]) => keptUids.has(uid)).forEach(([file, uid]) => runRequest(file, uid));
            }
        },
        [accept, beforeUpload, commit, directory, disabled, maxCount, multiple, onExceed, releaseFile, runRequest]
    );

    const handleRemove = useCallback(
        async (file: UploadFile) => {
            if (disabled) return;
            if (onRemove) {
                let ok: boolean | void;
                try {
                    ok = await onRemove(file);
                } catch (err) {
                    console.error('[Upload] onRemove threw, removal blocked:', err);
                    ok = false;
                }
                if (ok === false) return;
            }
            // 受控模式下只停止传输，不在这里释放 ObjectURL：外部 fileList 可能异步才移除该项，
            // 提前 revoke 会让中间帧的 <img> 指向已失效地址（裂图）。释放交给受控 diff。
            // 非受控模式列表由组件自己更新，可直接释放。
            if (isControlled) {
                stopTransfer(file.uid);
            } else {
                releaseFile(file.uid);
            }
            // 删除时以 status:'removed' 上报本次变化（便于消费方联动服务端删除）
            const removedFile: UploadFile = { ...file, status: 'removed' };
            commit(
                listRef.current.filter((f) => f.uid !== file.uid),
                removedFile
            );
        },
        [commit, disabled, isControlled, onRemove, releaseFile, stopTransfer]
    );

    const openFilePicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    // ---------- 拖拽：depth 计数避免子元素进出造成的闪烁 ----------
    const onDragEnter = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragging(false);
        }
    };
    const onDragOver = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
    };
    const onDrop = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        void handleFiles(Array.from(e.dataTransfer?.files ?? []));
    };

    const wrapperCls = [styles.upload, styles[`list-${listType}`], disabled && styles.disabled, className]
        .filter(Boolean)
        .join(' ');

    const renderStatus = (file: UploadFile) => {
        const status = file.status ?? 'uploading';
        if (status === 'done') {
            return (
                <span className={`${styles.statusIcon} ${styles.statusDone}`} aria-label="上传完成">
                    <CheckIcon size={16} />
                </span>
            );
        }
        if (status === 'error') {
            return (
                <span className={`${styles.statusIcon} ${styles.statusError}`} aria-label="上传失败">
                    <CloseIcon size={16} />
                </span>
            );
        }
        // 'removed' 只在 onChange 里上报，受控列表若仍保留该项就不该显示转圈
        if (status === 'removed') return null;
        return (
            <span className={styles.statusIcon} aria-label={`上传中 ${clampPercent(file.percent ?? 0)}%`}>
                <span className={styles.spinner} aria-hidden="true" />
                <span className={styles.percent}>{clampPercent(file.percent ?? 0)}%</span>
            </span>
        );
    };

    const renderTextList = () => (
        <ul className={styles.textList}>
            {list.map((file) => (
                <li key={file.uid} className={`${styles.textItem} ${file.status === 'error' ? styles.itemError : ''}`}>
                    {listType === 'picture' ? (
                        <span className={styles.textThumb}>
                            {previewSrc(file) ? (
                                <img className={styles.textThumbImg} src={previewSrc(file)} alt={file.name} />
                            ) : (
                                <FileIcon size={18} />
                            )}
                        </span>
                    ) : (
                        <span className={styles.fileIcon}>
                            <FileIcon size={15} />
                        </span>
                    )}
                    <span className={styles.fileName} title={file.name}>
                        {file.name}
                    </span>
                    {file.size !== undefined && file.size !== null && (
                        <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                    )}
                    {renderStatus(file)}
                    {showPreviewIcon && canPreview(file) && (
                        <button
                            type="button"
                            className={styles.previewBtn}
                            aria-label={`预览 ${file.name}`}
                            disabled={disabled}
                            onClick={() => openPreview(file)}
                        >
                            <EyeIcon size={16} />
                        </button>
                    )}
                    {showRemoveIcon && (
                        <button
                            type="button"
                            className={styles.removeBtn}
                            aria-label={`删除 ${file.name}`}
                            disabled={disabled}
                            onClick={() => void handleRemove(file)}
                        >
                            <CloseIcon size={16} />
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );

    const renderPictureList = () => (
        <ul className={styles.cardList}>
            {listVisible &&
                list.map((file) => {
                    const status = file.status ?? 'uploading';
                    return (
                        <li
                            key={file.uid}
                            className={[
                                styles.card,
                                status === 'error' && styles.cardError,
                                status === 'done' && styles.cardDone,
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {previewSrc(file) ? (
                                <img
                                    className={`${styles.cardImg} ${canPreview(file) ? styles.cardImgPreviewable : ''}`}
                                    src={previewSrc(file)}
                                    alt={file.name}
                                    onClick={showPreviewIcon && canPreview(file) ? () => openPreview(file) : undefined}
                                />
                            ) : (
                                <span className={styles.cardFileIcon}>
                                    <FileIcon size={15} />
                                </span>
                            )}
                            {status === 'uploading' && (
                                <span className={styles.cardMask}>
                                    <span className={styles.spinner} aria-hidden="true" />
                                    <span className={styles.percent}>{clampPercent(file.percent ?? 0)}%</span>
                                </span>
                            )}
                            {status === 'error' && (
                                <span className={styles.cardMask}>
                                    <CloseIcon size={22} color="#e05a5a" />
                                </span>
                            )}
                            {showPreviewIcon && canPreview(file) && (
                                <button
                                    type="button"
                                    className={styles.cardPreview}
                                    aria-label={`预览 ${file.name}`}
                                    disabled={disabled}
                                    onClick={() => openPreview(file)}
                                >
                                    <EyeIcon size={18} />
                                </button>
                            )}
                            {showRemoveIcon && (
                                <button
                                    type="button"
                                    className={styles.cardRemove}
                                    aria-label={`删除 ${file.name}`}
                                    disabled={disabled}
                                    onClick={() => void handleRemove(file)}
                                >
                                    <CloseIcon size={16} />
                                </button>
                            )}
                        </li>
                    );
                })}
            {/* 添加块始终保留：maxCount=1 时点击可替换，>1 满员时新文件会被丢弃 */}
            <li className={styles.cardAdd}>
                <button
                    type="button"
                    className={styles.cardAddBtn}
                    aria-label={ariaLabel ?? '上传文件'}
                    onClick={openFilePicker}
                    disabled={disabled}
                >
                    {children ?? <UploadIcon size={28} />}
                </button>
            </li>
        </ul>
    );

    return (
        <div className={wrapperCls} style={style}>
            <input
                ref={inputRef}
                className={styles.hiddenInput}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                {...(directory ? ({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>) : {})}
                onChange={(e) => {
                    void handleFiles(Array.from(e.target.files ?? []));
                    e.target.value = '';
                }}
            />

            {listType === 'picture-card' ? (
                <>
                    {renderPictureList()}
                    {tip && <div className={styles.tip}>{tip}</div>}
                </>
            ) : (
                <>
                    {drag ? (
                        <div
                            role="button"
                            tabIndex={disabled ? -1 : 0}
                            aria-label={ariaLabel ?? '上传文件'}
                            aria-disabled={disabled || undefined}
                            className={[styles.dragZone, dragging && styles.dragActive].filter(Boolean).join(' ')}
                            onClick={openFilePicker}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openFilePicker();
                                }
                            }}
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        >
                            {children ?? (
                                <>
                                    <span className={styles.dragIcon}>
                                        <UploadIcon size={16} />
                                    </span>
                                    <span className={styles.dragText}>点击或拖拽文件到这里</span>
                                </>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={children ? styles.triggerCustom : styles.trigger}
                            aria-label={ariaLabel ?? '上传文件'}
                            onClick={openFilePicker}
                            disabled={disabled}
                        >
                            {children ?? (
                                <>
                                    <UploadIcon size={18} />
                                    <span>点击上传</span>
                                </>
                            )}
                        </button>
                    )}
                    {tip && <div className={styles.tip}>{tip}</div>}
                    {listVisible && list.length > 0 && renderTextList()}
                </>
            )}

            {previewTarget && (
                <div
                    ref={previewLayerRef}
                    className={styles.previewLayer}
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    aria-label={`预览 ${previewTarget.name}`}
                    onClick={() => setPreviewTarget(null)}
                >
                    <img
                        className={styles.previewImg}
                        src={previewSrc(previewTarget)}
                        alt={previewTarget.name}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        ref={closeBtnRef}
                        type="button"
                        className={styles.previewClose}
                        aria-label="关闭预览"
                        onClick={() => setPreviewTarget(null)}
                    >
                        <CloseIcon size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

Upload.displayName = 'Upload';
