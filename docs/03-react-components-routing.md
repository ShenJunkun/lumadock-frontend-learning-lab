# 03 React 组件与路由

## 入口组件

- `src/main.tsx` 挂载 React。
- `QueryClientProvider` 提供数据请求缓存。
- `BrowserRouter` 提供前端路由。
- `src/App.tsx` 定义页面路由。

## 页面

- `/` 首页：Hero、滚动出现、3D 产品展示、产品卡片。
- `/products` 产品目录：搜索、加载、错误、空状态。
- `/products/:productId` 详情页：路由参数、规格、配置器。
- `/book` 预约页：产品选择、配置快照、表单提交。
- `/learn` 学习章节导航。

## 组件拆分

组件放在 `src/components/`，页面放在 `src/pages/`。拆分原则是：页面负责组合和数据选择，组件负责可复用 UI。

练习建议：

1. 新增一个 `ComparisonTable` 组件。
2. 在目录页展示三个产品的端口和价格。
3. 给它加一个 Testing Library 测试。

