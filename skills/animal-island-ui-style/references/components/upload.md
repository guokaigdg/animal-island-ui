# Upload

File upload with a cream-capsule trigger (text mode) or a dashed drop zone (`drag`), plus a file list in two shapes: `text` rows and `picture-card` image tiles. Give it an `action` URL to upload via the built-in **XMLHttpRequest** (progress + cancel), or pass `customRequest` for full control. With neither, the component **simulates upload progress** with a timer (~1.5s to done), so UIs can be built before the real endpoint exists.

```ts
type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed';
type UploadListType = 'text' | 'picture' | 'picture-card';

interface UploadFile {
    uid: string;               // unique id, tracked internally
    name: string;
    size?: number;             // bytes
    type?: string;             // MIME
    status?: UploadFileStatus; // default 'uploading'; 'removed' reported via onChange on delete
    percent?: number;          // 0-100
    url?: string;              // download / remote address (set by you or the server)
    thumbUrl?: string;         // thumbnail; auto ObjectURL for image files, shown before url
    originFileObj?: File;      // the File the user picked; stays original if beforeUpload transforms it
    response?: unknown;        // action XHR response or customRequest onSuccess(resp)
    error?: unknown;           // action XHR error or customRequest onError(err)
}

interface UploadCustomRequestOptions {
    file: File;
    onProgress: (percent: number) => void;
    onSuccess: (response?: unknown) => void;
    onError: (error?: unknown) => void;
}

interface UploadProps {
    accept?: string;            // passthrough to <input accept>, and enforced for dropped files too
    multiple?: boolean;         // default false; extra files (e.g. dropped) are truncated to the first
    maxCount?: number;          // 1: replaces; >1: keep earliest N, drop extras; 0/negative = no limit
    disabled?: boolean;
    directory?: boolean;        // passthrough to webkitdirectory (folder picking)
    fileList?: UploadFile[];    // controlled
    defaultFileList?: UploadFile[];
    listType?: UploadListType;  // default 'text'
    showUploadList?: boolean | UploadShowUploadList; // default true
    onPreview?: (file: UploadFile) => void; // click preview (picture / picture-card thumb / text image)
    drag?: boolean;             // default false
    tip?: React.ReactNode;      // hint below the trigger
    children?: React.ReactNode; // custom trigger / add-tile content (replaces the icon+label)
    beforeUpload?: (file: File, fileList: File[]) => boolean | File | Promise<boolean | File>;
    customRequest?: (options: UploadCustomRequestOptions) => void; // takes precedence over action
    action?: string | ((file: File) => string | Promise<string>); // upload URL, or (async) per-file fn
    method?: 'POST' | 'PUT' | 'PATCH'; // default 'POST'
    headers?: Record<string, string>;  // custom request headers
    data?: Record<string, unknown> | ((file: File) => Record<string, unknown> | undefined | Promise<...>);
    name?: string;              // file field name, default 'file'
    withCredentials?: boolean;  // default false
    onChange?: UploadOnChange;  // fires on add / progress / done / remove
    onExceed?: (files: File[], fileList: UploadFile[]) => void; // files rejected for exceeding maxCount
    onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>;
    'aria-label'?: string;      // default '上传文件'
    className?: string;
    style?: React.CSSProperties;
}

interface UploadShowUploadList { showPreviewIcon?: boolean; showRemoveIcon?: boolean } // both default true
interface UploadChangeParam { file: UploadFile; fileList: UploadFile[]; event?: ProgressEvent }
type UploadOnChange = (info: UploadChangeParam) => void;
```

```tsx
import { Upload } from 'animal-island-ui';

// Basic — onChange returns { file, fileList, event? }
<Upload multiple accept="image/*,.pdf" onChange={({ file, fileList }) => console.log(file.name, fileList)} />

// Drag zone + count limit + per-file gate (false skips the file)
<Upload drag maxCount={3} beforeUpload={(file) => file.size <= 1024 * 1024} />

// Custom trigger / drag-zone content — pass children to replace the icon+label entirely
<Upload multiple>上传头像</Upload>
<Upload drag><div style={{ padding: 28 }}>把文件拖到这里</div></Upload>

// Picture cards (auto ObjectURL preview for images) + click-to-preview
<Upload listType="picture-card" accept="image/*" maxCount={4} onPreview={(f) => openLightbox(f.thumbUrl ?? f.url)} />

// Pure upload button — hide the built-in list, render it yourself
<Upload showUploadList={false} multiple accept="image/*" />

// Built-in XHR upload — set action, the component reports progress and aborts on removal
// after success, file.response holds the server's xhr.response
<Upload action="/api/upload" method="POST" data={{ source: 'demo' }} name="file" multiple />

// Per-file action & data (function form) — handy for OSS-style signed uploads
<Upload action={(f) => `/oss/${f.name}`} data={(f) => ({ sign: signFor(f) })} />

// Real upload with full control — map XHR progress/result onto the component
<Upload
    customRequest={({ file, onProgress, onSuccess, onError }) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.onprogress = (e) => onProgress((e.loaded / e.total) * 100);
        xhr.onload = () => (xhr.status < 400 ? onSuccess() : onError());
        const form = new FormData();
        form.append('file', file);
        xhr.send(form);
    }}
/>
```

Notes:

- **Visual language**: the trigger is the DatePicker/Pagination cream capsule (`#fffbe7`, `border-radius: 50px`, hard bottom shadow `0 3px 0 0 #c4b89e`, hover lifts 1px and turns teal); the drag zone is a `2px dashed #c4b89e`, `border-radius: 20px` panel on `#fffdf7` that turns teal + `#e6f9f6` while dragging; focus rings are the standard gold `2px solid #f5c31c`.
- **`children` customizes every trigger shape** — in `text`/`drag` mode it replaces the icon+label inside the trigger/drop zone; in `picture-card` mode it replaces the add-tile `UploadIcon`. Omit it to use the default cream-capsule trigger.
- **Upload strategy**: with `action` the component runs a native `XMLHttpRequest` — `FormData` (file under `name`, default `file`; extra `data` fields appended), `method`/`headers`/`withCredentials` honoured, `upload.onprogress` maps onto `percent`, and `onload` (2xx→`done`, else→`error`) / `onerror` finalize it. Removing a file or unmounting aborts the in-flight request. `customRequest` takes precedence over `action`; with neither, an interval simulates progress by 12–20 every 220ms to 100 then marks `done`. A `customRequest` that throws synchronously marks the file `error` (logged) instead of stranding it at `uploading`.
- **`accept` also filters dropped files** (the attribute only constrains the picker) by `.ext` / `image/*` / exact MIME; files with no MIME are matched by extension only.
- **`beforeUpload` runs per file** (second arg = the full selection). `false`, a rejected promise, or a thrown error skips that file — it never enters the list (thrown/rejected hooks are also `console.error`-logged). Returning a `File` (or `Promise<File>`) uploads that transformed file instead of the original.
- **`multiple={false}` (default) keeps only the first file** — a drag payload can carry several files the hidden input would never allow. `directory` counts as multi-select (folders are never truncated).
- **`onChange` fires on every mutation** (add, each progress tick, done/error, remove) with `{ file, fileList, event? }`. `file` is the item that changed; `fileList` is the latest array. In controlled mode (`fileList` prop) the component renders exactly that array and only reports changes. A removal reports `file.status === 'removed'` (already absent from `fileList`), e.g. to trigger a server-side delete. After a successful `action` upload, `file.response` holds the server's `xhr.response`; `file.error` is set on failure. `customRequest`'s `onSuccess(resp)`/`onError(err)` attach to the same fields. Every item exposes `originFileObj` (native `File`) and, for image files, an auto `thumbUrl` (ObjectURL) separate from `url`.
- **`showUploadList`** `false` hides the built-in list (trigger / picture-card add tile stay), turning it into a pure upload button; `{ showPreviewIcon: false }` / `{ showRemoveIcon: false }` hide just one icon.
- **`onPreview`** fires on the hover eye icon of a `picture-card`/`picture` thumbnail (with `url`/`thumbUrl`) or the eye icon on a `text` image row.
- **`listType="picture"`** is the text list with an inline thumbnail per row (image fed by `thumbUrl ?? url` → `<img>`, else file icon).
- **`onRemove` returning `false` blocks removal** (rejecting/throwing also blocks, and a throw is logged). Removal clears the file's pending timer, aborts an in-flight XHR, and revokes its ObjectURL; everything is cleaned up on unmount. Controlled mode defers the revoke to the diff (the external `fileList` may drop the item only after an async round trip).
- **`maxCount`**: `1` = the new file replaces the current one; `>1` = keep the earliest `maxCount` files and drop the extra new ones (they never enter the list and fire no `onChange`) — use **`onExceed(files, fileList)`** to tell the user why; it also fires for files never processed because the limit was reached (3 picked under `1` → 2 reported). It never fires for the `1` replacement of an older file. `0`/negative = no limit. Trigger/add tile stay active; dropped files still get timers/XHR aborted and ObjectURLs revoked.
- **Controlled mode diffs the incoming `fileList`** and releases timers/XHR/ObjectURL for items you remove yourself, so externally dropped images do not leak. Late callbacks for a file that is gone (e.g. `customRequest` resolving after removal) are ignored rather than reported with a bogus `file`.
- **`action` / `data` accept function forms** (`(file) => ...`, per-file), sync or async — the result is awaited before the request is built (async OSS signing). An empty resolved `action` (or a throw while resolving) marks the file `error` instead of hanging at `uploading`/`0%`. `directory` passes `webkitdirectory` through for whole-folder picking.
- **Text row anatomy**: file icon · name (ellipsis) · size (`B/KB/MB`) · status (spinner+% / green ✓ `#6fba2c` / red ⚠ `#e05a5a`) · round `×` remove button. Rows are `12px` rounded `#fffdf7` cards with `#e8dcc8` borders, hover `#e6f9f6`; error rows get a red border + `#fdeeee` background.
- **Picture card**: `84×84` tiles, `16px` radius; images fill via `object-fit: cover`; uploading/error states overlay a `rgba(15,12,8,.55)` mask with the spinner + percent; the remove button appears on hover.
- **a11y**: trigger/drag zone/add tile are real focusable elements with `aria-label` (default `上传文件`); remove and preview buttons are labelled `删除 <name>` / `预览 <name>` and both disable with the component; uploading is announced as `上传中 N%`; the drag zone is `role="button"` with Enter/Space support. The preview layer is `role="dialog" aria-modal="true"`, closes on Escape/backdrop, focuses its close button on open, traps Tab and locks background scroll while open, restores focus on close; it also auto-closes if its file leaves the list.
- `prefers-reduced-motion: reduce` stops the spinner and hover/press transitions.
