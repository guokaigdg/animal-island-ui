// CSS Modules 类型声明
declare module '*.module.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.less' {
    const content: string;
    export default content;
}

// 图片资源类型声明
declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export { src, ReactComponent };
    export default src;
}

// vite-plugin-svgr 的 ?react 后缀导入
declare module '*.svg?react' {
    const Component: React.FC<React.SVGProps<SVGSVGElement>>;
    export default Component;
}
