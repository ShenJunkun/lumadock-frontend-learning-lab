# 02 HTML / CSS / JS / TS

## HTML 入口

`frontend/index.html` 只负责提供根节点和加载 `src/main.tsx`。真实界面由 React 管理。

## CSS 学习点

`frontend/src/styles/global.css` 覆盖这些主题：

- `:root` 设计变量。
- sticky header 与响应式 nav。
- CSS grid 做 hero、产品卡片、详情页和预约页。
- `aspect-ratio` 固定图片卡片比例。
- `prefers-reduced-motion` 降低动画强度。
- 加载、错误、空状态的可复用样式。

## TypeScript 学习点

`frontend/src/types/product.ts` 定义产品、统计和预约提交类型。前端请求和组件都依赖这些类型，能在构建前发现字段拼写错误。

练习建议：

1. 给 `Product` 增加一个 `availability` 字段。
2. 在后端 schema、seed、前端卡片中同步使用它。
3. 运行 `npm.cmd --prefix frontend run typecheck`。

