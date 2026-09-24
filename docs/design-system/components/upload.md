# Upload — pixel spec

Source: `src/components/Upload/Upload.tsx` + `upload.module.less`.

File upload with a cream-capsule trigger (text mode) or a dashed drop zone (`drag`), plus a file list in two shapes: `text` rows and `picture-card` tiles. Without `customRequest` the component simulates upload progress with a timer (roughly 1.5s to done) so the UI can be wired up before a real endpoint exists.

## props

```ts
type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed';
type UploadListType = 'text' | 'picture' | 'picture-card';

interface UploadFile {
    uid: string;              // unique id, tracked internally
    name: string;
    size?: number;            // bytes
    type?: string;            // MIME
    status?: UploadFileStatus; // default 'uploading'; 'removed' reported via onChange on delete
    percent?: number;         // 0-100
    url?: string;             // download / remote address (set by you or the server)
    thumbUrl?: string;        // thumbnail address; auto-generated ObjectURL for image files,
                              // shown in preference to url
    originFileObj?: File;     // the File the user picked; stays the original even when
                              // beforeUpload returns a transformed File (that one is what gets uploaded)
    response?: unknown;       // action XHR response or customRequest onSuccess(resp)
    error?: unknown;          // action XHR error or customRequest onError(err)
}

interface UploadCustomRequestOptions {
    file: File;
    onProgress: (percent: number) => void;
    onSuccess: (response?: unknown) => void;
    onError: (error?: unknown) => void;
}

interface UploadProps {
    accept?: string;            // passthrough to <input accept>, and enforced for dropped files too
    multiple?: boolean;         // default false; extra files (e.g. dropped) are truncated to the first one
    maxCount?: number;          // 1: new file replaces the current one; >1: keep earliest N, drop extras
                                // 0 / negative = no limit
    disabled?: boolean;
    directory?: boolean;        // passthrough to webkitdirectory (folder picking)
    fileList?: UploadFile[];    // controlled
    defaultFileList?: UploadFile[];
    listType?: UploadListType;  // default 'text'
    showUploadList?: boolean | UploadShowUploadList; // default true
    onPreview?: (file: UploadFile) => void; // click preview (picture / picture-card thumb / text image)
    drag?: boolean;             // default false
    tip?: React.ReactNode;
    children?: React.ReactNode; // custom trigger / drag / add-tile content (replaces icon+label)
    beforeUpload?: (file: File, fileList: File[]) => boolean | File | Promise<boolean | File>; // false → skip; File → upload transformed
    customRequest?: (options: UploadCustomRequestOptions) => void; // takes precedence over action
    action?: string | ((file: File) => string | Promise<string>); // upload URL, or (async) per-file URL fn
    method?: 'POST' | 'PUT' | 'PATCH'; // default 'POST'
    headers?: Record<string, string>;
    data?: Record<string, unknown> | ((file: File) => Record<string, unknown> | undefined | Promise<...>);
    name?: string;              // file field name, default 'file'
    withCredentials?: boolean;  // default false
    onChange?: UploadOnChange;  // fires on add / progress / done / remove
    onExceed?: (files: File[], fileList: UploadFile[]) => void; // files rejected for exceeding maxCount
    onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>; // false → blocked
    'aria-label'?: string;      // default '上传文件'
    className?: string;
    style?: React.CSSProperties;
}

interface UploadShowUploadList {
    showPreviewIcon?: boolean; // default true
    showRemoveIcon?: boolean;  // default true
}

interface UploadChangeParam {
    file: UploadFile;          // the file that changed in this event
    fileList: UploadFile[];    // the latest list
    event?: ProgressEvent;     // only on XHR progress ticks
}

type UploadOnChange = (info: UploadChangeParam) => void;
```

## Trigger (text mode, exact values)

Same vocabulary as the Pagination size-changer / DatePicker trigger: cream capsule with a hard bottom shadow.

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

The trigger always keeps the `点击上传` label and stays clickable — reaching `maxCount` never disables the picker. Overflow is handled when merging the selection: `maxCount={1}` replaces the current file, `maxCount > 1` keeps the earliest `maxCount` files and silently drops the extra new ones.

## Drag zone (`drag`)

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
.dragActive { border-color: #19c8b9; background: #e6f9f6; color: #19c8b9; }  /* while dragging over */
```

The zone carries the arrow-up icon at 1.5× scale and the caption `点击或拖拽文件到这里`. Drag state uses an enter/leave depth counter so child elements moving in/out do not flicker the highlight.

## Text list

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
.fileSize { font-size: 11px; color: #c4b89e; }              /* B / KB / MB via formatFileSize */
.statusDone { color: #6fba2c; }                              /* ✓ icon */
.statusError { color: #e05a5a; }                             /* ⚠ icon */
.spinner { width: 12px; height: 12px; border-radius: 50%;
           border: 2px solid #e6f9f6; border-top-color: #19c8b9;
           animation: animal-upload-spin 0.8s linear infinite; }
.percent { font-size: 11px; font-weight: 700; color: #19c8b9; font-variant-numeric: tabular-nums; }
.removeBtn { width: 18px; height: 18px; border-radius: 50%;
             background: rgba(0, 0, 0, 0.06); }
.removeBtn:hover { background: rgba(0, 0, 0, 0.14); color: #e05a5a; }
```

Row anatomy: file icon · name (ellipsis) · size · status (spinner+% / ✓ / ⚠) · remove `×`.

## Picture-card list

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
            background: rgba(15, 12, 8, 0.55); color: #fff; }   /* uploading percent / error icon */
.cardRemove { position: absolute; top: 4px; right: 4px; width: 18px; height: 18px;
              border-radius: 50%; background: rgba(0, 0, 0, 0.45); color: #fff;
              opacity: 0; transition: opacity 0.15s ease; }
.card:hover .cardRemove { opacity: 1; }
.cardAdd { width: 84px; height: 84px; }                        /* always rendered, even when maxCount is reached */
.cardAddBtn { width: 100%; height: 100%; border: 2px dashed #c4b89e; border-radius: 16px;
              background: transparent; color: #c4b89e; }
.cardAddBtn:hover { border-color: #19c8b9; color: #19c8b9; background: #e6f9f6; }
```

## Key interaction details

- **Hidden `<input type="file">`** drives selection; `value` is reset after every change so picking the same file twice re-triggers `onChange`.
- **`beforeUpload` gates every file individually** (called per file with the full selection as second argument). `false`, a rejected promise, or a thrown error skips that file — it never enters the list (a thrown / rejected hook is also logged with `console.error`, so a silently missing file is debuggable). Returning a `File` (or `Promise<File>`) uploads that transformed file instead of the original, enabling upload-time rewriting.
- **`multiple={false}` (the default) keeps only the first file of a selection.** The hidden input already enforces single picking, but a drag-and-drop payload can carry several files, so the component truncates it — otherwise the single-file contract would be silently violated. `directory` counts as multi-select: a folder selection is never truncated to its first file.
- **Default upload is a simulation**: an interval bumps `percent` by 12–20 every 220ms until 100, then sets `status: 'done'`. `customRequest` replaces it entirely; `onProgress` / `onSuccess` / `onError` map onto `percent` / `done` / `error`. `onSuccess(response)` / `onError(error)` attach the value to `file.response` / `file.error`. If `customRequest` throws synchronously the file is marked `error` (and the failure logged) instead of the exception bubbling out and stranding it at `uploading`.
- **`accept` is enforced for dropped files too.** The attribute only constrains the file picker, so drag-and-drop payloads are filtered by the same rules (`.ext`, `image/*`, exact MIME); files without a MIME type are matched by extension only, so an odd file is never silently rejected.
- **`onChange` fires on every list mutation** (add, each progress tick, done/error, remove) with `{ file, fileList, event? }` — `file` is the item that changed, `fileList` is the latest array. When controlled, treat `fileList` as the single source of truth. A removal reports `file.status === 'removed'` (the file is already absent from `fileList`) so you can, e.g., trigger a server-side delete. After a successful `action` upload, `file.response` holds the server's `xhr.response`; on failure `file.error` is set. Every item also exposes `originFileObj` (the native `File`) and, for image files, an auto-generated `thumbUrl` (ObjectURL) — separate from `url` (download / remote address).
- **`showUploadList`** hides the built-in list when `false` (the trigger / picture-card add tile remain, so it becomes a pure upload button). Pass `{ showPreviewIcon: false }` or `{ showRemoveIcon: false }` to hide just one of the per-item icons.
- **`onPreview`** fires when a preview affordance is clicked: a hover eye icon on `picture-card` thumbnails (with a `url`/`thumbUrl`), or an eye icon on `text` / `picture` rows whose `type` is an image. It is suppressed when `showUploadList` disables preview icons.
- **`listType="picture"`** is the text list with an inline thumbnail per row (an `<img>` fed by `thumbUrl ?? url`, otherwise a file icon). It is the in-between of `text` and `picture-card`.
- **Controlled mode**: with `fileList` set, the component renders exactly that array and only reports changes; it never mutates internal state. It diffs the incoming array and releases the timers / XHR / ObjectURL of any item you remove yourself, so externally dropped images do not leak. Callbacks that arrive late for a file that is no longer in the list (`customRequest` resolving after a removal) are ignored rather than reported with a bogus `file`.
- **`onRemove` returning `false` (or rejecting/throwing) blocks the removal** — a thrown hook is logged with `console.error` so a no-op delete button is debuggable. Removing clears any pending simulated timer, aborts the in-flight XHR, and revokes the ObjectURL the component created for that file; all timers and URLs are cleaned up on unmount. When controlled, the ObjectURL is *not* revoked at remove time — the external `fileList` may only drop the item after an async round trip, and revoking first would leave a broken thumbnail on screen; the controlled diff releases it as soon as the item actually disappears.
- **`maxCount`** follows these semantics. `maxCount={1}` replaces: the new file takes the single slot and the previous one is dropped. `maxCount > 1` keeps the *earliest* `maxCount` files — once the list is full, newly selected files are discarded and never enter the list, and `onChange` is not fired for them. Use **`onExceed(files, fileList)`** to tell the user why nothing happened: it fires for both files that entered the list and were pushed out, and files that were never processed because the limit was already reached (e.g. three files picked under `maxCount={1}` — one is kept, the other two are reported). It never fires for the `maxCount={1}` replacement of an *older* file, which is a replace, not an excess. `0` or a negative value is treated as no limit. The trigger / add tile stay active in all cases; hiding them is left to the consumer. Dropped files still get their timers/XHR aborted and their ObjectURLs revoked.
- **`action` / `data` also accept function forms** (`(file) => ...`), sync or async, resolved per file — an OSS direct-upload signature fetched over the network is the typical case, and the result is awaited before the request is built. If the resolved `action` is empty (or resolving it throws), the file is marked `error` instead of hanging at `uploading` / `0%`. `directory` passes `webkitdirectory` through to the hidden input for whole-folder picking.
- **a11y**: the trigger / drag zone / add tile are real focusable elements labelled `aria-label` (default `上传文件`); each remove and preview button is labelled `删除 <name>` / `预览 <name>` (and is `disabled` when the whole upload is disabled); uploading status is announced via `aria-label="上传中 N%"` on the status icon; the drag zone is `role="button"` with Enter/Space support. The built-in preview layer is `role="dialog" aria-modal="true"`, closes on Escape or backdrop click, moves focus to its close button on open, keeps Tab inside while it is open, locks background scrolling, and returns focus to the opener on close.
- **Built-in preview layer** shows `thumbUrl ?? url` in a full-screen overlay. If the file disappears from the list while it is open (removed or replaced), the layer closes itself instead of leaving a broken image.
- `prefers-reduced-motion: reduce` stops the spinner and disables the hover/press transitions.
- Sizes render through an internal `formatFileSize` helper (`B / KB / MB` with one decimal); it is not part of the public API.
