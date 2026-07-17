/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * a11y 烟雾测试专用配置
 * 独立于 vitest.config.ts，避免把 test/a11y.test.tsx 纳入 npm run test:run / ci
 *
 * 与主配置唯一差异：
 *   - include 只指向 test/a11y.test.tsx
 * 其余（@ alias、jsdom、less 预处理、setup.ts）完全复用主配置，保持一致
 */
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
            generateScopedName: 'animal-[local]-[hash:base64:5]',
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less')}";`,
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setup.ts',
        css: true,
        include: ['test/a11y.test.tsx'],
    },
});
