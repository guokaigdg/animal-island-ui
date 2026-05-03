import React from 'react';

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
    addPattern(/\b(React|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|createContext|createElement|cloneElement|Fragment|Suspense|lazy|memo|forwardRef|useId|FC|ReactNode|ReactElement|CSSProperties)\b/g, COLORS.react);
    addPattern(/\b(true|false)\b/g, COLORS.keyword);
    addPattern(/\b(null|undefined|void|NaN|Infinity)\b/gi, COLORS.keyword);
    addPattern(/\b\d+\.?\d*\b/g, COLORS.number);
    addPattern(/\b(import|from|as|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|throw|finally|new|typeof|instanceof|async|await|type|interface)\b/gi, COLORS.keyword);
    addPattern(/\b[A-Z][a-zA-Z0-9_$]*\b/g, COLORS.component);
    addPattern(/\b[a-z][a-zA-Z0-9_$]*\s*(?=\()/g, COLORS.func);
    addPattern(/\b[a-zA-Z_$][\w$]*\s*(?==)/g, COLORS.prop);
    addPattern(/>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:]/g, COLORS.operator);
    addPattern(/[{}[\]();,]/g, COLORS.operator);

    tokens.sort((a, b) => a.start - b.start);

    const result: React.ReactNode[] = [];
    let pos = 0;

    for (const token of tokens) {
        if (token.start < pos) continue;

        if (token.start > pos) {
            result.push(<span key={`t${pos}`} style={{ color: COLORS.default }}>{code.slice(pos, token.start)}</span>);
        }

        result.push(<span key={`s${token.start}`} style={{ color: token.color }}>{code.slice(token.start, token.end)}</span>);
        pos = token.end;
    }

    if (pos < code.length) {
        result.push(<span key={`e${pos}`} style={{ color: COLORS.default }}>{code.slice(pos)}</span>);
    }

    return result;
};

export interface CodeBlockProps {
    code: string;
    style?: React.CSSProperties;
    className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, style, className }) => (
    <pre style={{ ...codeBlockStyle, ...style }} className={className}>
        {highlightJSX(code)}
    </pre>
);