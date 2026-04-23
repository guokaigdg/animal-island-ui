import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 去掉 fontsource CSS 里的 woff 备份，只保留 woff2。
 * 现代浏览器（Chrome 36+/Firefox 39+/Safari 10+/Edge 14+）100% 支持 woff2。
 * 产物 dist/files/ 体积可进一步降低 ~40%。
 */
function stripWoffFallbackPlugin(): Plugin {
    return {
        name: 'strip-woff-fallback',
        enforce: 'pre',
        transform(code, id) {
            if (!id.includes('@fontsource')) return null;
            if (!id.endsWith('.css') && !/\.css\?/.test(id)) return null;
            const transformed = code.replace(
                /,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\)/g,
                '',
            );
            return transformed === code ? null : { code: transformed, map: null };
        },
        // libAssetsPlugin 会独立扫描源 CSS 并 emit 所有 url() 引用的文件（包括被我们剥掉的 woff），
        // 在 bundle 阶段删除未被最终 CSS 引用的 woff 孤儿文件。
        generateBundle(_, bundle) {
            for (const key of Object.keys(bundle)) {
                const asset = bundle[key];
                if (asset.type === 'asset' && /\.woff$/i.test(key)) {
                    delete bundle[key];
                }
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        svgr(),
        stripWoffFallbackPlugin(),
        // lib 模式下 Vite 会强制内联所有资源，本插件绕过该限制，把字体等作为独立文件输出
        libAssetsPlugin({
            outputPath: 'files',
            name: '[name].[contenthash:8].[ext]',
            limit: 0,
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    css: {
        modules: {
            // 生成类名格式：animal-[类名]-[hash]
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
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: (format) =>
                `${format === 'es' ? 'es' : 'cjs'}/index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) return 'index.css';
                    return assetInfo.name!;
                },
            },
        },
        cssCodeSplit: false,
    },
});
