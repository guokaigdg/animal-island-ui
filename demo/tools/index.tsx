import React, { useState, useEffect } from 'react';
import { CodeBlock as CodeBlockBase } from '../../src';

export const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);
    return isMobile;
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

const codeLabelStyle: React.CSSProperties = {
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

        <CodeBlockBase
            style={{
                marginTop: 0,
                borderRadius: '0 20px 20px 20px',
            }}
            code={code} />
    </div>
);