import React, { useEffect, useRef, useState } from 'react';
import styles from './code-block.module.less';

const COLORS = {
    comment: '#6b5e50',
    string: '#a8d4a0',
    keyword: '#d4a0e0',
    react: '#e06c75',
    component: '#80c0e0',
    func: '#61afef',
    prop: '#e8c87a',
    jsx: '#f0a870',
    operator: '#d4b896',
    number: '#a8d4a0',
    default: '#e8d5bc',
};

const codeBlockStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: '100%',
    margin: 0,
    padding: '20px 24px',
    background: '#2b2118',
    border: '1px solid #3d3028',
    borderRadius: 20,
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    fontWeight: 600,
    color: '#e8d5bc',
    whiteSpace: 'pre' as const,
    overflow: 'auto' as const,
    tabSize: 4,
};

const highlightJSX = (code: string): React.ReactNode[] => {
    const tokens: { start: number; end: number; color: string }[] = [];

    const addPattern = (regex: RegExp, color: string) => {
        let match;
        const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        while ((match = re.exec(code)) !== null) {
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                color,
            });
        }
    };

    addPattern(/\/\*[\s\S]*?\*\//g, COLORS.comment);
    addPattern(/\/\/.*$/gm, COLORS.comment);
    addPattern(/`[^`]*`/g, COLORS.string);
    addPattern(/"[^"]*"/g, COLORS.string);
    addPattern(/'[^']*'/g, COLORS.string);
    addPattern(/<\/?[A-Z][\w.$]*/g, COLORS.jsx);
    addPattern(/<\/?[a-z][\w-]*/g, COLORS.jsx);
    addPattern(/\/?>/g, COLORS.jsx);
    addPattern(
        /\b(React|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|createContext|createElement|cloneElement|Fragment|Suspense|lazy|memo|forwardRef|useId|FC|ReactNode|ReactElement|CSSProperties)\b/g,
        COLORS.react
    );
    addPattern(/\b(true|false)\b/g, COLORS.keyword);
    addPattern(/\b(null|undefined|void|NaN|Infinity)\b/gi, COLORS.keyword);
    addPattern(/\b\d+\.?\d*\b/g, COLORS.number);
    addPattern(
        /\b(import|from|as|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|throw|finally|new|typeof|instanceof|async|await|type|interface)\b/gi,
        COLORS.keyword
    );
    addPattern(/\b[A-Z][a-zA-Z0-9_$]*\b/g, COLORS.component);
    addPattern(/\b[a-z][a-zA-Z0-9_$]*\s*(?=\()/g, COLORS.func);
    addPattern(/\b[a-zA-Z_$][\w$]*\s*(?==)/g, COLORS.prop);
    addPattern(/>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:]/g, COLORS.operator);
    addPattern(/[{}[\]();,]/g, COLORS.operator);

    tokens.sort((a, b) => a.start - b.start);

    return renderTokens(code, tokens);
};

// 将 (start/end/color) token 列表合并为带颜色的 React 节点
interface HighlightToken {
    start: number;
    end: number;
    color: string;
    italic?: boolean;
}

const renderTokens = (code: string, tokens: HighlightToken[]): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let pos = 0;

    for (const token of tokens) {
        if (token.start < pos) continue;

        if (token.start > pos) {
            result.push(
                <span key={`t${pos}`} style={{ color: COLORS.default }}>
                    {code.slice(pos, token.start)}
                </span>
            );
        }

        result.push(
            <span
                key={`s${token.start}`}
                style={{
                    color: token.color,
                    fontStyle: token.italic ? 'italic' : undefined,
                    fontWeight: token.italic ? 400 : undefined,
                }}
            >
                {code.slice(token.start, token.end)}
            </span>
        );
        pos = token.end;
    }

    if (pos < code.length) {
        result.push(
            <span key={`e${pos}`} style={{ color: COLORS.default }}>
                {code.slice(pos)}
            </span>
        );
    }

    return result;
};

// Shell 命令高亮：行首命令名（jsx 橙）、子命令（string 绿）、flag（operator 棕）、注释（斜体淡色），包名/参数保持默认色
const highlightShell = (code: string): React.ReactNode[] => {
    const tokens: HighlightToken[] = [];

    const addPattern = (regex: RegExp, color: string, italic = false) => {
        let match;
        const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        while ((match = re.exec(code)) !== null) {
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                color,
                italic,
            });
        }
    };

    addPattern(/\/\/.*$/gm, COLORS.comment, true);
    addPattern(/^\s*(npm|yarn|pnpm|npx|node|git|cd|ls|mkdir|rm|cp|mv)\b/gm, COLORS.jsx);
    addPattern(
        /(?<=\s)(install|add|remove|uninstall|run|start|dev|build|test|lint|publish|init|create|exec|global|link|upgrade|update|clone|commit|push|pull|checkout|branch|merge|rebase|status|log|diff)\b/g,
        COLORS.string
    );
    addPattern(/(?<=\s)(-{1,2}[\w-]+)/g, COLORS.operator);

    tokens.sort((a, b) => a.start - b.start);

    return renderTokens(code, tokens);
};

const looksLikeShell = (code: string): boolean => /^\s*(npm|yarn|pnpm|npx|node|git|cd|ls|mkdir|rm|cp|mv)\b/m.test(code);

export interface CodeBlockProps {
    /** 要高亮的 JSX / TypeScript 源码 */
    code: string;
    /** 自定义 pre 样式 */
    style?: React.CSSProperties;
    /** 自定义 pre 类名 */
    className?: string;
    /** 是否显示复制按钮，默认 true */
    copyable?: boolean;
    /** 复制成功后的回调 */
    onCopy?: (code: string) => void;
}

type CopyStatus = 'idle' | 'copied' | 'error';

const COPY_STATUS_CONTENT: Record<CopyStatus, { text: string; label: string }> = {
    idle: { text: '复制', label: '复制代码' },
    copied: { text: '已复制', label: '代码已复制' },
    error: { text: '复制失败', label: '代码复制失败' },
};

const copyText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    try {
        textarea.select();
        const copied = document.execCommand('copy');
        if (!copied) throw new Error('Copy command failed');
    } finally {
        textarea.remove();
    }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, style, className, copyable = true, onCopy }) => {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
    const resetTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const handleCopy = async () => {
        window.clearTimeout(resetTimer.current);
        try {
            await copyText(code);
            setCopyStatus('copied');
            onCopy?.(code);
        } catch {
            setCopyStatus('error');
        }
        resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 2_000);
    };

    const buttonContent = COPY_STATUS_CONTENT[copyStatus];
    const copyButtonSpacing = copyable && style?.padding === undefined && style?.paddingRight === undefined;
    const { width, minWidth, maxWidth, margin, marginTop, marginRight, marginBottom, marginLeft, ...preStyle } =
        style ?? {};
    const wrapperStyle: React.CSSProperties = {
        width,
        minWidth,
        maxWidth,
        margin,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
    };

    return (
        <div className={styles.wrapper} style={wrapperStyle}>
            <pre
                style={{ ...codeBlockStyle, ...(copyButtonSpacing ? { paddingRight: 96 } : null), ...preStyle }}
                className={className}
            >
                {looksLikeShell(code) ? highlightShell(code) : highlightJSX(code)}
            </pre>
            {copyable && (
                <button
                    type="button"
                    className={styles.copyButton}
                    aria-label={buttonContent.label}
                    onClick={handleCopy}
                >
                    {buttonContent.text}
                </button>
            )}
        </div>
    );
};

CodeBlock.displayName = 'CodeBlock';
