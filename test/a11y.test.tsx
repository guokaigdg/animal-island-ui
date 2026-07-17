/**
 * a11y 烟雾测试 —— 全组件 axe-core 自动检查
 * --------------------------------------------------------------------------
 * 设计目的：
 *   作为 28 个组件的"无障碍基线设施"，用 axe-core 跑一轮 WCAG 2.1 AA 自动化
 *   规则，把"我应该写 aria-label 但忘了"这类问题在 CI 里拦下来。
 *
 * 入口策略：
 *   - 单一文件 / 单点入口，每个组件一个 it() —— 加新组件只需加一个 case
 *   - 每个组件 render 一个"典型用法"快照，跑 axe()，断言 0 条违规
 *   - 用 portal 渲染的组件（Modal / Drawer / Notification）必须把 axe 根
 *     节点设为 document.body，否则 portal 输出（挂在 body 上、容器外）扫不到
 *
 * 不并入 npm run ci：
 *   28 个组件首次跑一定会有几十条违规（多是需要补 aria-label/aria-labelledby
 *   的契约缺口），目前单独跑 `npm run test:a11y`，等 Tier 1 契约层在
 *   28 个组件测试里就近补完后，再视情况并入 ci。
 *
 * 已知规则差异（在 axeOptions 中关闭）：
 *   - color-contrast          jsdom 不计算样式，永远不通过
 *   - landmark-one-main       单组件测试不构成完整页面
 *   - page-has-heading-one    单组件测试不构成完整页面
 *   - region                  portal 渲染内容不在主文档流
 *   - bypass                  单组件测试没有跳转链接
 *   - document-title          单组件测试无 title
 *   - html-has-lang           jsdom <html> 不带 lang
 *   - html-lang-valid         同上
 *   - meta-viewport           N/A
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import axe from 'axe-core';
import React from 'react';

// Loading 内部用 GSAP + SVG MotionPath，jsdom 不实现 SVGElement.getBBox，
// 真实环境下 startAnimation 会拿到一个空函数。a11y 烟雾只关心渲染后的 DOM 结构，
// 不关心动画，所以直接 mock 掉。
vi.mock('@/components/Loading/island/script.js', () => ({
    startAnimation: vi.fn(),
}));

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { CodeBlock } from '@/components/CodeBlock';
import { Collapse } from '@/components/Collapse';
import { Cursor } from '@/components/Cursor';
import { Divider } from '@/components/Divider';
import { Drawer } from '@/components/Drawer';
import { Footer } from '@/components/Footer';
import { Form, FormItem } from '@/components/Form';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';
import { Notification } from '@/components/Notification';
import { Phone } from '@/components/Phone';
import { Progress } from '@/components/Progress';
import { Radio } from '@/components/Radio';
import { Select } from '@/components/Select';
import { Switch } from '@/components/Switch';
import { Table } from '@/components/Table';
import { Tabs } from '@/components/Tabs';
import { Tag } from '@/components/Tag';
import { Time } from '@/components/Time';
import { Title } from '@/components/Title';
import { Tooltip } from '@/components/Tooltip';
import { Typewriter } from '@/components/Typewriter';
import { Wallet } from '@/components/Wallet';

afterEach(() => {
    cleanup();
    // 清掉 Notification 命令式 API 在 document.body 上挂的根节点
    Notification.destroy();
});

// ---------------------------------------------------------------------------
// axe 配置
// ---------------------------------------------------------------------------

/**
 * 对单组件测试不适用的全局规则（见文件头注释）
 * 不放在 setup.ts，因为只有本文件用 axe —— 避免污染其他 28 个测试
 */
const axeOptions: axe.RunOptions = {
    rules: {
        'color-contrast': { enabled: false },
        'landmark-one-main': { enabled: false },
        'page-has-heading-one': { enabled: false },
        region: { enabled: false },
        bypass: { enabled: false },
        'document-title': { enabled: false },
        'html-has-lang': { enabled: false },
        'html-lang-valid': { enabled: false },
        'meta-viewport': { enabled: false },
    },
};

/**
 * 把 axe 违规转成可读的多行字符串，断言失败时一眼能看明白哪个组件哪条规则挂了
 */
function formatViolations(violations: axe.Result[]): string {
    if (violations.length === 0) return '  (no violations)';
    return violations
        .map(
            (v) =>
                `  - [${v.impact ?? 'unknown'}] ${v.id}: ${v.help}\n` +
                v.nodes
                    .slice(0, 3)
                    .map((n) => `      target: ${n.target.join(' ')}\n      html: ${n.html.slice(0, 200)}`)
                    .join('\n')
        )
        .join('\n');
}

/**
 * 跑 axe —— 接收 RTL render 结果或 document.body（portal 组件用）
 * 用 throw new Error 列出所有违规而非首条就 expect 失败，方便 PR review 一眼定位
 */
async function expectNoA11yViolations(root: Element | Document, label: string): Promise<void> {
    const results = await axe.run(root, axeOptions);
    if (results.violations.length > 0) {
        throw new Error(
            `[a11y:${label}] ${results.violations.length} violation(s):\n${formatViolations(results.violations)}`
        );
    }
    expect(results.violations).toEqual([]);
}

/** 取 render container —— 简单组件用 */
function containerOf(r: RenderResult): HTMLElement {
    return r.container;
}

// ---------------------------------------------------------------------------
// 测试套件
// ---------------------------------------------------------------------------

describe('a11y smoke / 28 组件 axe-core 自动检查', () => {
    // -------- 交互触发器 --------

    it('Button', async () => {
        const r = render(<Button>确认</Button>);
        await expectNoA11yViolations(containerOf(r), 'Button');
    });

    it('Icon (无 aria-label 应有 violation，提示需要补)', async () => {
        // 故意不传 aria-label：第一次跑会暴露"图标裸用没名字"问题
        const r = render(<Icon name="icon-camera" />);
        await expectNoA11yViolations(containerOf(r), 'Icon');
    });

    it('Switch (带 aria-label)', async () => {
        const r = render(<Switch aria-label="启用通知" />);
        await expectNoA11yViolations(containerOf(r), 'Switch');
    });

    it('Radio (有可见 label)', async () => {
        const r = render(
            <Radio
                defaultValue="a"
                options={[
                    { label: '选项 A', value: 'a' },
                    { label: '选项 B', value: 'b' },
                ]}
            />
        );
        await expectNoA11yViolations(containerOf(r), 'Radio');
    });

    it('Checkbox (有可见 label)', async () => {
        const r = render(
            <Checkbox
                defaultValue={['a']}
                options={[
                    { label: '选项 A', value: 'a' },
                    { label: '选项 B', value: 'b' },
                ]}
            />
        );
        await expectNoA11yViolations(containerOf(r), 'Checkbox');
    });

    it('Tabs (有 label 列表)', async () => {
        const r = render(
            <Tabs
                items={[
                    { key: '1', label: '一', children: '内容一' },
                    { key: '2', label: '二', children: '内容二' },
                ]}
                aria-label="分类"
            />
        );
        await expectNoA11yViolations(containerOf(r), 'Tabs');
    });

    it('Collapse (有 question 文案)', async () => {
        const r = render(<Collapse question="什么是动物之森？" answer="一款 a game company Switch 模拟经营游戏。" />);
        await expectNoA11yViolations(containerOf(r), 'Collapse');
    });

    it('Tooltip (children 有可见文案)', async () => {
        const r = render(
            <Tooltip title="提示信息">
                <Button>悬停看我</Button>
            </Tooltip>
        );
        await expectNoA11yViolations(containerOf(r), 'Tooltip');
    });

    // -------- 表单字段 --------

    it('Input (无 label 应有 violation)', async () => {
        // 故意不传 label：第一次跑会暴露"输入框裸用没名字"问题
        const r = render(<Input placeholder="请输入" />);
        await expectNoA11yViolations(containerOf(r), 'Input');
    });

    it('Input (配 label htmlFor)', async () => {
        const r = render(
            <div>
                <label htmlFor="test-input">用户名</label>
                <Input id="test-input" />
            </div>
        );
        await expectNoA11yViolations(containerOf(r), 'Input+label');
    });

    it('Select (带 aria-label)', async () => {
        const r = render(
            <Select
                aria-label="选择水果"
                value="a"
                onChange={() => {}}
                options={[
                    { key: 'a', label: '苹果' },
                    { key: 'b', label: '香蕉' },
                ]}
            />
        );
        await expectNoA11yViolations(containerOf(r), 'Select');
    });

    it('Form (FormItem + label)', async () => {
        const r = render(
            <Form>
                <FormItem label="用户名" name="username">
                    <Input />
                </FormItem>
            </Form>
        );
        await expectNoA11yViolations(containerOf(r), 'Form');
    });

    // -------- 容器 / 遮罩 (portal → 用 document.body 扫) --------

    it('Modal (open + title)', async () => {
        render(
            <Modal open title="确认操作" onClose={() => {}}>
                <p>是否继续？</p>
            </Modal>
        );
        await expectNoA11yViolations(document.body, 'Modal');
    });

    it('Drawer (open + title)', async () => {
        render(
            <Drawer open title="侧边栏" onClose={() => {}}>
                <p>侧边栏内容</p>
            </Drawer>
        );
        await expectNoA11yViolations(document.body, 'Drawer');
    });

    it('Notification (success)', async () => {
        Notification.success({ message: '保存成功', description: '已写入云端' });
        await expectNoA11yViolations(document.body, 'Notification');
    });

    // -------- 装饰 / 展示 --------

    it('Card (有 children 文案)', async () => {
        const r = render(<Card>卡片内容</Card>);
        await expectNoA11yViolations(containerOf(r), 'Card');
    });

    it('Tag (有 children 文案)', async () => {
        const r = render(<Tag>标签</Tag>);
        await expectNoA11yViolations(containerOf(r), 'Tag');
    });

    it('Progress (带 aria-label)', async () => {
        const r = render(<Progress percent={42} aria-label="任务进度" />);
        await expectNoA11yViolations(containerOf(r), 'Progress');
    });

    it('Title (有 children 文案)', async () => {
        const r = render(<Title>标题文案</Title>);
        await expectNoA11yViolations(containerOf(r), 'Title');
    });

    it('Divider (纯装饰)', async () => {
        const r = render(<Divider />);
        await expectNoA11yViolations(containerOf(r), 'Divider');
    });

    it('Time (有日期文本)', async () => {
        const r = render(<Time />);
        await expectNoA11yViolations(containerOf(r), 'Time');
    });

    it('Typewriter (有 children 文本)', async () => {
        const r = render(<Typewriter>欢迎来到治愈海岛</Typewriter>);
        await expectNoA11yViolations(containerOf(r), 'Typewriter');
    });

    it('Phone (纯装饰)', async () => {
        const r = render(<Phone />);
        await expectNoA11yViolations(containerOf(r), 'Phone');
    });

    it('Wallet (有 value)', async () => {
        const r = render(<Wallet value={12345} />);
        await expectNoA11yViolations(containerOf(r), 'Wallet');
    });

    it('Footer (纯装饰)', async () => {
        const r = render(<Footer />);
        await expectNoA11yViolations(containerOf(r), 'Footer');
    });

    it('Cursor (包裹子元素)', async () => {
        const r = render(
            <Cursor>
                <div>内容</div>
            </Cursor>
        );
        await expectNoA11yViolations(containerOf(r), 'Cursor');
    });

    it('CodeBlock (有 code 文案)', async () => {
        const r = render(<CodeBlock code="const x = 1;" />);
        await expectNoA11yViolations(containerOf(r), 'CodeBlock');
    });

    it('Table (有 dataSource)', async () => {
        const r = render(
            <Table
                columns={[
                    { title: '姓名', dataIndex: 'name' },
                    { title: '年龄', dataIndex: 'age' },
                ]}
                dataSource={[
                    { key: '1', name: '小明', age: 18 },
                    { key: '2', name: '小红', age: 20 },
                ]}
            />
        );
        await expectNoA11yViolations(containerOf(r), 'Table');
    });

    it('Loading (纯装饰)', async () => {
        const r = render(<Loading active />);
        await expectNoA11yViolations(containerOf(r), 'Loading');
    });
});
