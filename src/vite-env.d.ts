/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<object, object, unknown>;
    export default component;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*?raw' {
    const content: string;
    export default content;
}
