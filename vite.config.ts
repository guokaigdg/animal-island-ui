import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react(), svgr()],
    css: {
        modules: {
            // 生成类名格式：animail-[组件名]__[类名]
            generateScopedName: "animail-[local]-[hash:base64:5]",
            localsConvention: "camelCase"
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "${resolve(__dirname, "src/styles/variables.less")}";`
            }
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            fileName: (format) => `${format === "es" ? "es" : "cjs"}/index.${format === "es" ? "js" : "cjs"}`
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM"
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith(".css")) return "index.css";
                    return assetInfo.name!;
                }
            }
        },
        cssCodeSplit: false
    }
});
