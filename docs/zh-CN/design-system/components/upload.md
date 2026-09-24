# Upload 上传 —— 精确样式规范

Source: `src/components/Upload/Upload.tsx` + `upload.module.less`.

文件上传组件：text 形态为奶油胶囊触发钮（`drag` 时为虚线拖拽区），列表支持 `text` 文件行与 `picture-card` 图片卡片两种形态。传入 `action` 可用内置 XMLHttpRequest 真实上传（带进度、删除时中止）；或传 `customRequest` 完全自定义。两者皆不传时组件用定时器模拟上传进度（约 1.5s 走完），便于先搭 UI 再接真实接口。

## props

```ts
type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed';
type UploadListType = 'text' | 'picture' | 'picture-card';

interface UploadFile {
    uid: string;               // 唯一标识，组件内部以 uid 追踪
    name: string;
    size?: number;             // 字节
    type?: string;             // MIME
    status?: UploadFileStatus; // 默认 'uploading'；删除时经 onChange 上报为 'removed'
    percent?: number;          // 0-100
    url?: string;              // 下载 / 服务端地址（由你或服务端设置）
    thumbUrl?: string;         // 缩略图地址；图片文件自动生成的 ObjectURL，展示时优先于 url
    originFileObj?: File;      // 用户选择的原始 File；beforeUpload 返回转换后的 File 时，
                               // 这里仍是原始的（上传的是转换后的那个）
    response?: unknown;        // action XHR response，或 customRequest onSuccess(resp)
    error?: unknown;           // action XHR 出错，或 customRequest onError(err)
}

interface UploadCustomRequestOptions {
    file: File;
    onProgress: (percent: number) => void;
    onSuccess: (response?: unknown) => void;
    onError: (error?: unknown) => void;
}

interface UploadProps {
    accept?: string;            // 透传 <input accept>，拖拽进来的文件同样按它过滤
    multiple?: boolean;         // 默认 false；多选/拖入多个时只保留第一个
    maxCount?: number;          // =1：新文件替换当前的；>1：保留最早 N 个，超出的丢弃
                                // 0 / 负数视为不限量
    disabled?: boolean;
    directory?: boolean;        // 透传 webkitdirectory（整文件夹选择）
    fileList?: UploadFile[];    // 受控
    defaultFileList?: UploadFile[];
    listType?: UploadListType;  // 默认 'text'
    showUploadList?: boolean | UploadShowUploadList; // 默认 true
    onPreview?: (file: UploadFile) => void; // 点击预览（picture / picture-card 缩略图 / text 行图片）
    drag?: boolean;             // 默认 false
    tip?: React.ReactNode;
    children?: React.ReactNode; // 自定义触发区 / 拖拽区 / 添加块内容（替换默认图标+文字）
    beforeUpload?: (file: File, fileList: File[]) => boolean | File | Promise<boolean | File>; // false → 跳过；File → 上传转换后的文件
    customRequest?: (options: UploadCustomRequestOptions) => void; // 优先于 action
    action?: string | ((file: File) => string | Promise<string>); // 上传地址，或 (file) => 地址（可异步）
    method?: 'POST' | 'PUT' | 'PATCH'; // 默认 POST
    headers?: Record<string, string>;
    data?: Record<string, unknown> | ((file: File) => Record<string, unknown> | undefined | Promise<...>);
    name?: string;              // 文件字段名，默认 'file'
    withCredentials?: boolean;  // 默认 false
    onChange?: UploadOnChange;  // 新增/进度/完成/删除都会触发
    onExceed?: (files: File[], fileList: UploadFile[]) => void; // 因超出 maxCount 被拒绝的文件
    onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>; // false → 阻止删除
    'aria-label'?: string;      // 默认「上传文件」
    className?: string;
    style?: React.CSSProperties;
}

interface UploadShowUploadList {
    showPreviewIcon?: boolean; // 默认 true
    showRemoveIcon?: boolean;  // 默认 true
}

interface UploadChangeParam {
    file: UploadFile;          // 本次变化的文件
    fileList: UploadFile[];    // 最新列表
    event?: ProgressEvent;     // 仅 XHR 进度跳变时携带
}

type UploadOnChange = (info: UploadChangeParam) => void;
```

## 触发钮（text 形态，精确值）

与 Pagination 尺寸切换器 / DatePicker 触发器同一视觉语言：奶油胶囊 + 硬底阴影。

```less
.trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 0 18px;
    height: 36px;
    border: none;
    border-radius: 50px;
    background: #fffbe7;
    color: #794f27;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 3px 0 0 #c4b89e;
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease;
}
.trigger:hover:not(:disabled) { color: #19c8b9; transform: translateY(-1px); }
.trigger:active:not(:disabled) { transform: translateY(1px); box-shadow: 0 1px 0 0 #c4b89e; }
.trigger:disabled { cursor: not-allowed; box-shadow: 0 3px 0 0 #c4b89e; } /* token @text-muted */
.trigger:focus-visible { outline: 2px solid #f5c31c; outline-offset: 2px; }
```

触发钮恒为「点击上传」且始终可点 —— 达到 `maxCount` 时组件不会禁用文件选择器。超限在合并本次选择时处理：`maxCount={1}` 替换当前文件，`maxCount > 1` 保留最早的 `maxCount` 个，超出的新文件直接丢弃。

## 拖拽区（`drag`）

```less
.dragZone {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; padding: 28px 20px;
    border: 2px dashed #c4b89e;      /* @border-strong */
    border-radius: 20px;
    background: #fffdf7;             /* @cream-deep */
    color: #9f927d;                  /* @text-secondary */
    cursor: pointer; user-select: none;
    transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}
.dragZone:hover { border-color: #19c8b9; color: #19c8b9; }
.dragActive { border-color: #19c8b9; background: #e6f9f6; color: #19c8b9; }  /* 拖拽悬停时 */
```

拖拽区内容为 1.5× 放大的向上箭头图标与文案「点击或拖拽文件到这里」。高亮状态用 enter/leave 深度计数器维护，避免子元素进出导致闪烁。

## 文件行列表（text）

```less
.textItem {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 12px;
    border-radius: 12px;
    background: #fffdf7;
    border: 1.5px solid #e8dcc8;
    font-size: 13px;
    transition: background 0.15s ease, border-color 0.15s ease;
}
.textItem:hover { background: #e6f9f6; }
.itemError { border-color: #e05a5a; background: #fdeeee; }
.fileSize { font-size: 11px; color: #c4b89e; }              /* B / KB / MB，经 formatFileSize 格式化 */
.statusDone { color: #6fba2c; }                              /* ✓ 图标 */
.statusError { color: #e05a5a; }                             /* ⚠ 图标 */
.spinner { width: 12px; height: 12px; border-radius: 50%;
           border: 2px solid #e6f9f6; border-top-color: #19c8b9;
           animation: animal-upload-spin 0.8s linear infinite; }
.percent { font-size: 11px; font-weight: 700; color: #19c8b9; font-variant-numeric: tabular-nums; }
.removeBtn { width: 18px; height: 18px; border-radius: 50%;
             background: rgba(0, 0, 0, 0.06); }
.removeBtn:hover { background: rgba(0, 0, 0, 0.14); color: #e05a5a; }
```

行内结构：文件图标 · 文件名（超出省略）· 大小 · 状态（转圈+百分比 / ✓ / ⚠）· 删除 `×`。

## 图片卡片列表（picture-card）

```less
.card {
    position: relative;
    width: 84px; height: 84px;
    border-radius: 16px;
    border: 1.5px solid #e8dcc8;
    background: #fffdf7;
    overflow: hidden;
}
.cardDone { border-color: #c4b89e; }
.cardError { border-color: #e05a5a; }
.cardImg { width: 100%; height: 100%; object-fit: cover; }
.cardMask { position: absolute; inset: 0; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 4px;
            background: rgba(15, 12, 8, 0.55); color: #fff; }   /* 上传中百分比 / 失败图标 */
.cardRemove { position: absolute; top: 4px; right: 4px; width: 18px; height: 18px;
              border-radius: 50%; background: rgba(0, 0, 0, 0.45); color: #fff;
              opacity: 0; transition: opacity 0.15s ease; }
.card:hover .cardRemove { opacity: 1; }
.cardAdd { width: 84px; height: 84px; }                        /* 始终渲染，满员时也不隐藏 */
.cardAddBtn { width: 100%; height: 100%; border: 2px dashed #c4b89e; border-radius: 16px;
              background: transparent; color: #c4b89e; }
.cardAddBtn:hover { border-color: #19c8b9; color: #19c8b9; background: #e6f9f6; }
```

## 关键交互细节

- **隐藏的 `<input type="file">`** 负责文件选择；每次 change 后重置 `value`，同一文件可重复选择。
- **`beforeUpload` 逐个文件把关**（每个文件调用一次，第二个参数是本次完整选择）。返回 `false`、Promise reject 或抛错都会跳过该文件 —— 不会进入列表（钩子抛错 / reject 时还会 `console.error` 记录，避免「选了文件却毫无反应」无从排查）。返回 `File`（或 `Promise<File>`）时上传该转换后的文件而非原始文件，实现「上传前加工」。
- **`multiple={false}`（默认）只保留所选的第一个文件。** 隐藏 input 本身已限制单选，但拖拽可以带进多个文件，组件在这里截断，否则单文件约定会被静默打破。`directory`（整文件夹选择）视为多选 —— 文件夹不会被截断成第一个文件。
- **默认上传是模拟实现**：定时器每 220ms 让 `percent` 增 12–20，到 100 后置 `status: 'done'`。传入 `customRequest` 后完全替换；`onProgress` / `onSuccess` / `onError` 分别映射到 `percent` / `done` / `error`；`onSuccess(response)` / `onError(error)` 会把返回值挂到 `file.response` / `file.error`。`customRequest` 同步抛错时该文件被标记为 `error` 并打印日志，不会让异常冒泡、把文件永久留在 `uploading`。
- **`accept` 对拖拽同样生效。** 该属性只约束文件选择框，拖拽带进来的文件由组件按同规则过滤（`.ext`、`image/*`、精确 MIME）；没有 MIME 信息的文件只按扩展名判断，避免被误杀。
- **`onChange` 在每次列表变化时触发**（新增、每次进度跳变、完成/失败、删除），参数为 `{ file, fileList, event? }` —— `file` 是本次变化的文件，`fileList` 是最新数组；受控使用时应将 `fileList` 视为唯一数据源。删除时本次 `file.status === 'removed'`（该文件已不在 `fileList` 中），便于联动服务端删除。`action` 上传成功后 `file.response` 保存服务端 `xhr.response`，失败则 `file.error` 被赋值。每个条目还暴露 `originFileObj`（原生 File）与图片文件自动生成的 `thumbUrl`（ObjectURL）——与 `url`（下载/服务端地址）语义分离。
- **`showUploadList`** 设为 `false` 时隐藏内置列表（触发钮 / picture-card 添加块保留，相当于纯上传按钮）；传入 `{ showPreviewIcon: false }` 或 `{ showRemoveIcon: false }` 可只隐藏对应图标。
- **`onPreview`** 在点击预览入口时触发：picture-card 缩略图（带 `url`/`thumbUrl`）悬停出现的眼睛图标，或 `text` / `picture` 行中图片类型文件的眼睛图标；`showUploadList` 关闭预览图标时一并隐藏。
- **`listType="picture"`** 是带行内缩略图的 text 列表（文件有 `thumbUrl ?? url` 时渲染 `<img>`，否则显示文件图标），介于 `text` 与 `picture-card` 之间。
- **受控模式**：传入 `fileList` 后组件完全按该数组渲染，只上报变化，不维护内部 state。组件会对传入数组做 diff，释放你自行移除项所占用的定时器 / XHR / ObjectURL，因此外部直接删掉图片不会泄漏。文件已不在列表时到达的迟到回调（`customRequest` 在删除后才 resolve）会被忽略，不会带着一个错误的 `file` 上报。
- **`onRemove` 返回 `false`（或 reject / 抛错）会阻止删除**，钩子抛错时还会 `console.error` 记录（否则按钮点了没反应无从排查）。删除时会清掉该文件的模拟定时器、中止进行中的 XHR，并 revoke 组件为它生成的 ObjectURL；卸载时统一清理全部定时器与 URL。受控模式下删除当刻**不** revoke —— 外部 `fileList` 可能要等异步请求回来才移除该项，提前 revoke 会让仍在渲染的缩略图裂开；释放交给受控 diff 在该项真正消失时补做。
- **`maxCount`** 语义如下。`maxCount={1}` 为替换：新文件占用唯一的位置，旧文件被移出。`maxCount > 1` 保留**最早**的 `maxCount` 个 —— 列表已满时新选择的文件会被丢弃、不进列表，且不为它们触发 `onChange`；此时改用 **`onExceed(files, fileList)`** 告知用户「已达上限」：进了列表又被顶掉的文件、以及因已达上限而压根没被处理的文件都会通知（例如 `maxCount={1}` 时一次选 3 个 —— 保留 1 个，另外 2 个走 `onExceed`）；`maxCount={1}` 顶掉**旧**文件属于替换语义，不触发。`0` 或负数视为不限量。触发钮 / 添加块都保持可点，是否需要隐藏由消费方决定；被丢弃项的定时器 / XHR / ObjectURL 仍会清理。
- **`action` / `data` 也支持函数形式**（`(file) => ...` 按文件解析），同步异步皆可 —— 异步取 OSS 直传签名是典型场景，组件会 await 结果后再构建请求。若解析出的 `action` 为空（或解析过程抛错），该文件被标记为 `error`，而不是永远停在 `uploading` / `0%`。`directory` 会将 `webkitdirectory` 透传给隐藏 input，支持整文件夹选择。
- **无障碍**：触发钮 / 拖拽区 / 添加块都是真实可聚焦元素，`aria-label` 默认「上传文件」；删除 / 预览按钮标签分别为「删除 <文件名>」「预览 <文件名>」，整体 `disabled` 时二者都置为 `disabled`；上传中状态通过状态图标的 `aria-label="上传中 N%"` 播报；拖拽区为 `role="button"` 并支持 Enter / Space。内置预览层为 `role="dialog" aria-modal="true"`，ESC 或点遮罩关闭，打开时焦点移到关闭按钮、期间把 Tab 锁在弹层内并锁定背景滚动、关闭后归还焦点给触发元素。
- **内置预览层**展示 `thumbUrl ?? url` 的全屏大图。打开期间若该文件从列表消失（被删除或被替换），弹层会自行关闭，而不是留着一张裂图。
- `prefers-reduced-motion: reduce` 下停止转圈动画并关闭悬停/按压过渡。
- 文件大小经内部的 `formatFileSize` 辅助函数渲染（`B / KB / MB`，保留一位小数）；该函数不对外导出。
