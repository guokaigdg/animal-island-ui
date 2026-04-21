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

export const highlightJSX = (code: string): React.ReactNode[] => {
    const tokens: { pattern: RegExp; style: React.CSSProperties }[] = [
        {
            pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
            style: { color: '#6b5e50', fontStyle: 'italic', fontWeight: 400 },
        },
        {
            pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
            style: { color: '#a8d4a0' },
        },
        { pattern: /(<\/?[\w.]+|\/?>)/g, style: { color: '#f0a870' } },
        {
            pattern:
                /\b(import|from|const|let|var|function|return|export|default|useState|true|false|null|undefined)\b/g,
            style: { color: '#d4a0e0' },
        },
        { pattern: /\s([a-zA-Z][\w-]*)(?==)/g, style: { color: '#e8c87a' } },
        { pattern: /(\{|\})/g, style: { color: '#d4b896' } },
        { pattern: /(=>)/g, style: { color: '#d4a0e0' } },
    ];

    const parts: { text: string; style?: React.CSSProperties }[] = [{ text: code }];

    for (const { pattern, style } of tokens) {
        parts.forEach((part, i) => {
            if (part.style) return;
            const matches = part.text.matchAll(new RegExp(pattern.source, pattern.flags));
            const result: { text: string; style?: React.CSSProperties }[] = [];
            let lastIndex = 0;
            for (const match of matches) {
                if (match.index !== undefined) {
                    if (match.index > lastIndex) {
                        result.push({ text: part.text.slice(lastIndex, match.index) });
                    }
                    result.push({ text: match[0], style });
                    lastIndex = match.index + match[0].length;
                }
            }
            if (lastIndex < part.text.length) {
                result.push({ text: part.text.slice(lastIndex) });
            }
            parts.splice(i, 1, ...result);
        });
    }

    return parts.map((part, i) => (
        <span key={i} style={part.style}>
            {part.text}
        </span>
    ));
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
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 16,
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

export const demoBodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    alignItems: 'flex-start',
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
