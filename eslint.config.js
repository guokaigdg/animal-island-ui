import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
    // 忽略构建产物与依赖
    {
        ignores: [
            'dist/**',
            'demo-dist/**',
            'coverage/**',
            'node_modules/**',
            'scripts/**',
            '*.config.js',
            '*.config.ts',
            // 第三方压缩库 + 对应声明文件（来自 Loading/island/）
            '**/*.min.js',
            '**/*.min.d.ts',
            '**/island/**',
        ],
    },

    // 基础规则：浏览器侧 + Node 侧共享
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // 业务源码
    {
        files: ['src/**/*.{ts,tsx}', 'demo/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            // React Hooks 规则
            ...reactHooks.configs.recommended.rules,

            // Vite HMR
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            // TypeScript 严格化（与 tsconfig strict 对齐）
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-function': 'off',

            // 通用代码质量
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prefer-const': 'warn',
            eqeqeq: ['error', 'always'],
        },
    },

    // 测试文件放宽
    {
        files: ['**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': 'off',
        },
    },

    // 演示站点 —— 不进 npm 产物，规则放宽以保持 demo 代码简洁
    {
        files: ['demo/**/*.{ts,tsx}'],
        rules: {
            'react-refresh/only-export-components': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-console': 'off',
        },
    }
);
