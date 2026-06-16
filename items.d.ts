// 物品图标子路径资源的类型声明。
// 供消费者 `import url from 'animal-island-ui/items/item-001.png'` 时获得 string 类型。
declare module 'animal-island-ui/items/*.png' {
    const src: string;
    export default src;
}
