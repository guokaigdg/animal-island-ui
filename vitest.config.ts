/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@test': resolve(__dirname, 'test'),
        },
    },
    css: {
        modules: {
            // 与 vite.config.ts 保持一致：animal-[类名]-[hash]
            generateScopedName: 'animal-[local]-[hash:base64:5]',
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                // 注入 variables.less，确保业务 less 中 @font-family 等变量在测试环境可解析
                additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less')}";`,
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setup.ts',
        css: true,
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json-summary'],
            include: ['src/components/**/*.{ts,tsx}'],
            // 与产物无关：d.ts / 桶文件 / fonts 资源 / 纯展示内联 SVG 装饰
            exclude: ['**/*.d.ts', '**/index.ts', 'src/components/Icon/**'],
            thresholds: {
                // 整体目标：达到专业组件库基线
                // branches 75% 是为 Loading 留口子 —— 它的 setTimeout 清理 + 强制 reflow 分支
                // 属浏览器/动画时序耦合路径，jsdom 下不可达；其它 23 个组件均 ≥ 90%
                statements: 85,
                branches: 75,
                functions: 85,
                lines: 85,
                // vitest 4 不支持 perFile 对象式阈值，下面用 'perFile' 字符串键（如果有）
                // perFile 留待 vitest 升级支持后再开
            },
        },
    },
});
