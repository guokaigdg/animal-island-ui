import React, { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);
    return isMobile;
};

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

export const highlightJSX = (code: string): React.ReactNode[] => {
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

export interface ApiRow {
    prop: string;
    desc: string;
    type: string;
    defaultVal?: string;
    required?: boolean;
}

export const sectionStyle: React.CSSProperties = {
    marginBottom: 36,
    padding: 24,
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #e8e2d6',
};

export const sectionTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: '#725d42',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
};

export const tagStyle: React.CSSProperties = {
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 20,
    background: '#f0e8d8',
    color: '#a08060',
    fontWeight: 500,
};

export const labelStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#a0936e',
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 500,
};

export const textStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#8a7b66',
    margin: 0,
};

export const demoBodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

export const demoBoxStyle: React.CSSProperties = {
    marginTop: 12,
    padding: 16,
    background: '#faf8f3',
    borderRadius: 12,
    border: '1px solid #e8e2d6',
};

export const demoDashedBoxStyle: React.CSSProperties = {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    background: 'rgb(250, 248, 242)',
    border: '1px dashed rgb(224, 216, 200)',
    borderRadius: 18,
};

export const codeBlockStyle: React.CSSProperties = {
    marginTop: 16,
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

export const codeLabelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: '#e7e4e0',
    marginBottom: 0,
    padding: '6px 12px',
    background: '#3d3028',
    borderRadius: '10px 10px 0 0',
    display: 'inline-block',
};

export const ApiTable: React.FC<{ rows: ApiRow[] }> = ({ rows }) => (
    <div style={{ marginTop: 24 }}>
        <div style={codeLabelStyle}>API</div>
        <div
            style={{
                background: '#2b2118',
                borderRadius: '0 20px 20px 20px',
                overflow: 'hidden',
            }}
        >
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 13,
                }}
            >
                <thead>
                    <tr
                        style={{
                            background: '#3d3028',
                            color: '#e8d5bc',
                        }}
                    >
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>属性</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>说明</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>类型</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>默认值</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            style={{
                                color: '#c8bba8',
                                borderTop: '1px solid #3d3028',
                            }}
                        >
                            <td style={{ padding: '10px 16px' }}>
                                <span style={{ color: '#e8c87a' }}>{row.prop}</span>
                                {row.required && <span style={{ color: '#f0a870', marginLeft: 4 }}>*</span>}
                            </td>
                            <td style={{ padding: '10px 16px' }}>{row.desc}</td>
                            <td style={{ padding: '10px 16px', color: '#d4a0e0' }}>{row.type}</td>
                            <td style={{ padding: '10px 16px', color: '#a8d4a0' }}>{row.defaultVal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div style={{ marginTop: 36 }}>
        <div style={codeLabelStyle}>使用示例</div>
        <pre
            style={{
                ...codeBlockStyle,
                marginTop: 0,
                borderRadius: '0 20px 20px 20px',
            }}
        >
            {highlightJSX(code)}
        </pre>
    </div>
);