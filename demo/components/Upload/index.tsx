import React, { useRef, useState } from 'react';
import { UploadIcon } from 'naive-icons';
import { Upload, Modal, Notification, type UploadFile } from '../../../src';
import {
    CodeBlock,
    ApiTable,
    ApiRow,
    sectionStyle,
    sectionTitleStyle,
    DemoTag,
    demoBodyStyle,
    labelStyle,
} from '../../tools';

const S = {
    block: {
        maxWidth: 720,
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 12,
    },
};

const UPLOAD_API: ApiRow[] = [
    {
        prop: 'accept',
        desc: '接受的文件类型,透传 input[accept];拖拽进来的文件同样按它过滤',
        type: 'string',
        defaultVal: '-',
    },
    {
        prop: 'multiple',
        desc: '是否支持多选;false 时拖入多个也只保留第一个(directory 选择文件夹不截断)',
        type: 'boolean',
        defaultVal: 'false',
    },
    {
        prop: 'maxCount',
        desc: '最多上传文件数;=1 时新文件替换当前的,>1 时保留最早 N 个、超出的丢弃',
        type: 'number',
        defaultVal: '-',
    },
    { prop: 'disabled', desc: '是否禁用', type: 'boolean', defaultVal: 'false' },
    { prop: 'fileList', desc: '文件列表(受控)', type: 'UploadFile[]', defaultVal: '-' },
    { prop: 'defaultFileList', desc: '默认文件列表(非受控)', type: 'UploadFile[]', defaultVal: '[]' },
    { prop: 'listType', desc: '列表形态', type: `'text' | 'picture' | 'picture-card'`, defaultVal: "'text'" },
    {
        prop: 'showUploadList',
        desc: '是否展示文件列表,或 { showPreviewIcon, showRemoveIcon } 分别控制',
        type: 'boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean }',
        defaultVal: 'true',
    },
    {
        prop: 'onPreview',
        desc: '点击预览(picture / picture-card 缩略图或 text 行图片)时触发',
        type: '(file: UploadFile) => void',
        defaultVal: '-',
    },
    { prop: 'drag', desc: '是否开启拖拽上传区域', type: 'boolean', defaultVal: 'false' },
    { prop: 'tip', desc: '触发区下方提示文字', type: 'ReactNode', defaultVal: '-' },
    {
        prop: 'children',
        desc: '自定义触发区内容(text/drag)或 picture-card 添加块图标',
        type: 'ReactNode',
        defaultVal: '-',
    },
    {
        prop: 'beforeUpload',
        desc: '上传前钩子,返回 false 跳过该文件(钩子抛错也会跳过并打印错误)',
        type: '(file, fileList) => boolean | File | Promise<boolean | File>',
        defaultVal: '-',
    },
    {
        prop: 'customRequest',
        desc: '自定义上传实现,优先级高于 action;同步抛错时该文件标记失败',
        type: '(options: UploadCustomRequestOptions) => void',
        defaultVal: '-',
    },
    {
        prop: 'action',
        desc: '上传地址,提供时用原生 XHR 真实上传;也支持 (file) => 地址(可异步),解析为空则标记失败',
        type: 'string | ((file: File) => string | Promise<string>)',
        defaultVal: '-',
    },
    { prop: 'method', desc: '请求方法', type: `'POST' | 'PUT' | 'PATCH'`, defaultVal: "'POST'" },
    { prop: 'headers', desc: '自定义请求头', type: 'Record<string, string>', defaultVal: '-' },
    {
        prop: 'data',
        desc: '随文件提交的附加表单字段;支持 (file) => 字段(可异步)',
        type: 'Record<string, unknown> | ((file: File) => ... )',
        defaultVal: '-',
    },
    { prop: 'name', desc: '文件字段名', type: 'string', defaultVal: "'file'" },
    { prop: 'withCredentials', desc: '是否携带跨域凭证', type: 'boolean', defaultVal: 'false' },
    { prop: 'onChange', desc: '列表变化回调', type: '(info: { file, fileList, event? }) => void', defaultVal: '-' },
    {
        prop: 'onExceed',
        desc: '选中文件超出 maxCount 被拒绝时触发(含压根未处理的);maxCount=1 顶掉旧文件的替换不触发',
        type: '(files: File[], fileList: UploadFile[]) => void',
        defaultVal: '-',
    },
    {
        prop: 'onRemove',
        desc: '删除前钩子,返回 false 阻止删除(钩子抛错同样阻止并打印日志)',
        type: '(file: UploadFile) => boolean | void | Promise<boolean | void>',
        defaultVal: '-',
    },
    { prop: 'className / style / aria-label', desc: '通用属性', type: '-', defaultVal: '-' },
];

const uploaded: UploadFile[] = [
    { uid: 'island-1', name: '海岛全景.png', size: 2_400_000, type: 'image/png', status: 'done', percent: 100 },
    { uid: 'island-2', name: '露营清单.pdf', size: 512_000, type: 'application/pdf', status: 'done', percent: 100 },
];

const UploadDemo: React.FC = () => {
    const [cardFiles, setCardFiles] = useState<UploadFile[]>([]);
    const [pickedFiles, setPickedFiles] = useState<UploadFile[]>([]);
    const [pictureFiles, setPictureFiles] = useState<UploadFile[]>([]);
    const [lightboxFile, setLightboxFile] = useState<UploadFile | null>(null);
    const lastPickedCount = useRef(pickedFiles.length);

    // onChange 会在进度更新等多次触发;按数量变化去重,仅提示一次(避免一次上传弹多条)
    const collectPicked = (info: { fileList: UploadFile[] }) => {
        const files = info.fileList;
        setPickedFiles(files);
        if (files.length !== lastPickedCount.current) {
            lastPickedCount.current = files.length;
            Notification.open({ type: 'info', message: `列表变化:当前 ${files.length} 个文件` });
        }
    };

    // 示例 4:数量上限 / 类型的拦截提示,均使用 warning 类型
    const LIMIT_COUNT = 3;
    const ALLOWED_TYPE = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i;
    const existingCount = useRef(0);

    const guardUpload = (file: File): boolean => {
        if (!ALLOWED_TYPE.test(file.name)) {
            Notification.open({ type: 'warning', message: `${file.name} 不是支持的图片类型,已拦截` });
            return false;
        }
        if (existingCount.current >= LIMIT_COUNT) {
            Notification.open({ type: 'warning', message: `${file.name} 已达数量上限(${LIMIT_COUNT} 个),已拦截` });
            return false;
        }
        if (file.size > 1024 * 1024) {
            Notification.open({ type: 'warning', message: `${file.name} 超过 1 MB,已拦截` });
            return false;
        }
        return true;
    };

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Upload <DemoTag>上传</DemoTag> <DemoTag>拖拽</DemoTag> <DemoTag>模拟进度</DemoTag>
            </div>
            <div style={demoBodyStyle}>
                {/* ---- 1. 基础 ---- */}
                <div style={labelStyle}>基础用法 — 点击上传(默认模拟上传进度)</div>
                <div style={S.block}>
                    <Upload tip="未接入 customRequest 时,组件会用定时器模拟上传进度,方便联调 UI" />
                </div>

                {/* ---- 2. 默认列表 ---- */}
                <div style={labelStyle}>defaultFileList — 预置已完成文件 + onChange 收集</div>
                <div style={S.block}>
                    <Upload
                        multiple
                        accept="image/*,.pdf"
                        defaultFileList={uploaded}
                        tip="支持多选,accept 限定图片与 PDF"
                        onChange={collectPicked}
                    />
                </div>

                {/* ---- 3. 拖拽 ---- */}
                <div style={labelStyle}>drag — 拖拽上传区域</div>
                <div style={S.block}>
                    <Upload drag multiple tip="点击或把文件拖进虚线框均可" />
                </div>

                {/* ---- 4. maxCount + beforeUpload ---- */}
                <div style={labelStyle}>maxCount + beforeUpload — 数量上限与类型拦截</div>
                <div style={S.block}>
                    <Upload
                        drag
                        multiple
                        maxCount={LIMIT_COUNT}
                        beforeUpload={guardUpload}
                        onChange={(info) => {
                            existingCount.current = info.fileList.length;
                        }}
                        tip={`最多 ${LIMIT_COUNT} 个图片文件;类型/数量上限/大小拦截均以 warning 提示(可拖一张非图片试试)`}
                    />
                </div>

                {/* ---- 5. picture-card ---- */}
                <div style={labelStyle}>listType="picture-card" — 图片卡片 + 预览</div>
                <div style={S.block}>
                    <Upload
                        listType="picture-card"
                        accept="image/*"
                        multiple
                        maxCount={4}
                        fileList={cardFiles}
                        onChange={(info) => setCardFiles(info.fileList)}
                        onExceed={(files) =>
                            Notification.open({
                                type: 'warning',
                                message: `${files.length} 个文件超出上限(最多 4 张),已忽略`,
                            })
                        }
                        tip="最多 4 张;满员后新选择的文件会被丢弃,用 onExceed 给出提示"
                    />
                </div>

                {/* ---- 6. customRequest ---- */}
                <div style={labelStyle}>customRequest — 接入真实上传(示例为慢速模拟)</div>
                <div style={S.block}>
                    <Upload
                        customRequest={({ file, onProgress, onSuccess }) => {
                            let pct = 0;
                            const timer = window.setInterval(() => {
                                pct += 8;
                                onProgress(Math.min(100, pct));
                                if (pct >= 100) {
                                    window.clearInterval(timer);
                                    onSuccess();
                                    Notification.open({ type: 'success', message: `${file.name} 上传完成` });
                                }
                            }, 300);
                        }}
                        tip="真实项目中也可直接把接口地址交给 action,由组件内置 XHR 处理进度"
                    />
                </div>

                {/* ---- 7. action ---- */}
                <div style={labelStyle}>action — 内置 XHR 真实上传(带进度与取消)</div>
                <div style={S.block}>
                    <Upload
                        action="https://httpbin.org/post"
                        method="POST"
                        data={{ source: 'demo' }}
                        name="file"
                        multiple
                        tip="设置 action 后组件用原生 XMLHttpRequest 上传并自动上报进度;删除文件会中止请求"
                    />
                </div>

                {/* ---- 8. children ---- */}
                <div style={labelStyle}>children — 自定义触发区内容</div>
                <div style={S.block}>
                    <Upload multiple tip="用 children 完全自定义触发按钮">
                        <span
                            style={{
                                fontFamily: 'Nunito',
                                fontWeight: 700,
                                fontSize: 13,
                                padding: '8px 16px',
                                borderRadius: 50,
                                background: '#f8f8f0',
                                color: '#794f27',
                                display: 'inline-flex',
                                gap: 8,
                                alignItems: 'center',
                            }}
                        >
                            点击上传头像
                        </span>
                    </Upload>
                    <Upload drag multiple tip="也适用于拖拽区域">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                                padding: '28px 0',
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontFamily: 'Nunito',
                                    fontWeight: 700,
                                    color: '#794f27',
                                    fontSize: 18,
                                }}
                            >
                                <UploadIcon size={22} />
                                拖拽上传
                            </span>
                            <span>把文件拖进这片空地</span>
                        </div>
                    </Upload>
                </div>
            </div>

            {/* ---- 9. showUploadList=false ---- */}
            <div style={labelStyle}>showUploadList=false — 纯上传按钮(隐藏列表)</div>
            <div style={S.block}>
                <Upload
                    showUploadList={false}
                    multiple
                    accept="image/*,.pdf"
                    tip="列表由外部自行渲染时,关闭内置列表只保留触发钮"
                />
            </div>

            {/* ---- 10. onPreview ---- */}
            <div style={labelStyle}>onPreview — 点击缩略图直接预览大图</div>
            <div style={S.block}>
                <Upload
                    listType="picture-card"
                    accept="image/*"
                    multiple
                    maxCount={4}
                    fileList={cardFiles}
                    onChange={(info) => setCardFiles(info.fileList)}
                    onPreview={(file) => setLightboxFile(file)}
                    tip="鼠标悬停图片出现眼睛图标;点击直接打开预览大图"
                />
                <Modal
                    open={!!lightboxFile}
                    title={lightboxFile?.name}
                    footer={null}
                    variant="default"
                    typewriter={false}
                    width={560}
                    onClose={() => setLightboxFile(null)}
                >
                    {lightboxFile?.thumbUrl || lightboxFile?.url ? (
                        <img
                            src={lightboxFile.thumbUrl ?? lightboxFile.url}
                            alt={lightboxFile.name}
                            style={{
                                display: 'block',
                                maxWidth: '100%',
                                maxHeight: '68vh',
                                margin: '0 auto',
                                borderRadius: 12,
                            }}
                        />
                    ) : (
                        <p style={{ textAlign: 'center', color: '#9f927d' }}>该文件暂无可预览的图片</p>
                    )}
                </Modal>
            </div>

            {/* ---- 11. listType="picture" ---- */}
            <div style={labelStyle}>listType="picture" — 行内缩略图</div>
            <div style={S.block}>
                <Upload
                    listType="picture"
                    accept="image/*"
                    multiple
                    maxCount={4}
                    fileList={pictureFiles}
                    onChange={(info) => setPictureFiles(info.fileList)}
                    tip="text 形态但每条带缩略图,图片文件自动生成预览"
                />
            </div>

            <CodeBlock
                code={`import { Upload } from 'animal-island-ui';

// 基础:onChange 回传 { file, fileList, event? }
<Upload
    multiple
    accept="image/*,.pdf"
    onChange={({ file, fileList }) => {
        console.log('changed:', file.name, 'total:', fileList.length);
        console.log('server response:', file.response);
    }}
/>

// 拖拽 + 数量上限 + 类型拦截
<Upload
    drag
    maxCount={3}
    beforeUpload={file => file.size <= 1024 * 1024}
/>

// 图片卡片(picture-card)+ 点击预览
<Upload
    listType="picture-card"
    accept="image/*"
    maxCount={4}
    onPreview={file => openLightbox(file.thumbUrl ?? file.url)}
/>

// 仅保留触发钮(列表自行渲染)
<Upload showUploadList={false} multiple accept="image/*" />

// 自定义上传
<Upload
    customRequest={({ file, onProgress, onSuccess, onError }) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.onprogress = e => onProgress((e.loaded / e.total) * 100);
        xhr.onload = () => (xhr.status < 400 ? onSuccess() : onError());
        const form = new FormData();
        form.append('file', file);
        xhr.send(form);
    }}
/>

// 内置 XHR 真实上传:交给 action 即可,组件上报进度并在删除时中止
// 成功后 file.response 携带服务端返回(见 onChange 的 info.file.response)
<Upload
    action="/api/upload"
    method="POST"
    data={{ source: 'demo' }}
    name="file"
    multiple
/>

// 行内缩略图(picture):图片文件自动生成预览
<Upload listType="picture" accept="image/*" maxCount={4} />`}
            />
            <ApiTable rows={UPLOAD_API} />
        </div>
    );
};

export default UploadDemo;
