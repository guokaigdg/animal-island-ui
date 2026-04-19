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
    const content: string;
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export { ReactComponent };
    export default content;
}

declare module '*.svg?url' {
    const src: string;
    export default src;
}

declare module '*.svg?raw' {
    const content: string;
    export default content;
}

declare module '*.svg?react' {
    const Component: React.FC<React.SVGProps<SVGSVGElement>>;
    export default Component;
}