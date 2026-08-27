import React from 'react';
import styles from './skill.module.less';

// ============================================
// Shell / 目录树代码块
// 库的 CodeBlock 只做 JSX/TS 词法高亮，不识别 shell 的 `#` 注释与目录树字符，
// 这里提供演示页专用的轻量高亮，配色沿用 CodeBlock 的深色主题
// ============================================

const COLORS = {
    comment: '#6b5e50',
    string: '#a8d4a0',
    file: '#80c0e0',
    command: '#61afef',
    option: '#e8c87a',
    tree: '#d4b896',
};

const TOKENS: { pattern: RegExp; color: string }[] = [
    // # 注释（含目录树行内注释）
    { pattern: /#.*$/, color: COLORS.comment },
    // 目录树连接字符
    { pattern: /[├└]──|│/, color: COLORS.tree },
    // 引号字符串
    { pattern: /'[^']*'|"[^"]*"/g, color: COLORS.string },
    // 文件名（带扩展名）
    { pattern: /\b[\w.-]+\.(md|tsx?|less|css|json|html)\b/g, color: COLORS.file },
    // 命令关键字
    { pattern: /\b(skills|add|cp|npm|npx|yarn|pnpm|install|uninstall|run|remove)\b/g, color: COLORS.command },
    // 选项参数 --xxx / -x
    { pattern: /(?:\s|^)(--?[\w-]+)/g, color: COLORS.option },
    // 家目录路径
    { pattern: /~\/[\w./-]*/g, color: COLORS.string },
];

interface Segment {
    start: number;
    end: number;
    color: string;
}

/** 收集单行内所有命中片段，按起点排序后丢弃重叠部分 */
const matchLine = (line: string): Segment[] => {
    const segments: Segment[] = [];

    for (const token of TOKENS) {
        // 强制 g flag：缺少 g 时 exec 不会推进 lastIndex，会导致 while 死循环
        const re = new RegExp(
            token.pattern.source,
            token.pattern.flags.includes('g') ? token.pattern.flags : `${token.pattern.flags}g`
        );
        let match: RegExpExecArray | null;
        while ((match = re.exec(line)) !== null) {
            // 带捕获组的规则（如选项参数）只高亮捕获到的那段
            const text = match[1] || match[0];
            const offset = match[1] && match[0].includes(match[1]) ? match[0].indexOf(match[1]) : 0;
            const start = match.index + offset;
            segments.push({ start, end: start + text.length, color: token.color });
        }
    }

    segments.sort((a, b) => a.start - b.start);

    return segments.reduce<Segment[]>((kept, seg) => {
        if (kept.length === 0 || seg.start >= kept[kept.length - 1].end) kept.push(seg);
        return kept;
    }, []);
};

const highlight = (code: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];

    code.split('\n').forEach((line, lineIndex) => {
        let cursor = 0;
        for (const seg of matchLine(line)) {
            if (seg.start > cursor) nodes.push(line.slice(cursor, seg.start));
            nodes.push(
                <span key={`${lineIndex}-${seg.start}`} style={{ color: seg.color }}>
                    {line.slice(seg.start, seg.end)}
                </span>
            );
            cursor = seg.end;
        }
        if (cursor < line.length) nodes.push(line.slice(cursor));
        nodes.push('\n');
    });

    return nodes;
};

const ShellCode: React.FC<{ code: string }> = ({ code }) => (
    <pre className={styles.shell}>{highlight(code.trim())}</pre>
);

export default ShellCode;
