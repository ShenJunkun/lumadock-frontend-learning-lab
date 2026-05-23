# 03 React 组件与路由

## 入口组件

- `src/main.tsx` 挂载 React。
- `QueryClientProvider` 提供数据请求缓存。
- `BrowserRouter` 提供前端路由。
- `src/App.tsx` 定义页面路由。

## React 先学概念

React 的核心不是“在 HTML 里写很多标签”，而是用组件描述界面，然后让 React 根据状态变化更新 DOM。初学时建议先抓住这些概念：

| 概念 | 先理解什么 | 本项目例子 |
| --- | --- | --- |
| 组件 | 一个返回 TSX 的函数，就是一块可复用界面 | `ProductCard`、`LeadForm`、`AppShell` |
| props | 父组件传给子组件的数据和回调 | `ProductCard product={product}` |
| state | 组件或页面内部会变化的数据 | 配置器里的颜色、刻字、数量选择 |
| render | state 或 props 变化后，React 重新计算界面应该长什么样 | 点击配置按钮后选中态变化 |
| 条件渲染 | 根据状态决定显示哪个组件 | loading、error、empty、success 状态 |
| 列表渲染 | 用 `.map()` 把数组变成一组组件 | 产品卡片列表 |
| key | 帮 React 稳定识别列表里的每一项 | `key={product.id}` |
| 事件处理 | 用 `onClick`、`onSubmit` 等响应用户操作 | 配置按钮、预约表单 |
| hook | 在函数组件里使用 React 能力和外部状态能力 | `useState`、`useMemo`、React Query hook |
| 组件树 | 大组件包含小组件，最终形成页面结构 | `AppProviders` -> `App` -> `Page` -> `Component` |

读 React 代码时可以按这个顺序问：

1. 这个文件导出了哪个组件？
2. 这个组件接收哪些 props？
3. 它自己维护哪些 state？
4. 它根据哪些条件渲染不同 UI？
5. 用户操作会调用哪些事件函数？
6. 它还组合了哪些子组件？

把这六个问题问清楚，一个 React 组件通常就能读懂大半。

## 页面

- `/` 首页：Hero、滚动出现、3D 产品展示、产品卡片。
- `/products` 产品目录：搜索、加载、错误、空状态。
- `/products/:productId` 详情页：路由参数、规格、配置器。
- `/book` 预约页：产品选择、配置快照、表单提交。
- `/learn` 学习章节导航。
- `/login` 登录页：Antd Form 调用 JWT 登录接口。
- `/admin` 后台页：admin-only leads 表格。

## 组件拆分

组件放在 `src/components/`，页面放在 `src/pages/`。拆分原则是：页面负责组合和数据选择，组件负责可复用 UI。

## 组件库

项目使用 Ant Design 练习企业级组件库集成：

- `ConfigProvider` 在入口统一注入 LumaDock 主题 token。
- `AntdWorkbenchPreview` 展示 Table、Modal、Button、Result 的组合方式。
- 后续登录和后台页面复用 Antd Form、Table、Modal 和 Result。
- 产品视觉、复杂 3D 和页面骨架仍保留自定义 CSS/Tailwind，避免把整站做成默认后台模板。

## 路由守卫

- `PrivateRoute` 未登录时跳转 `/login`，并保留来源路径。
- `RoleRoute` 检查 `admin` / `viewer` 角色，不满足时显示 403。
- `/admin` 同时使用两层守卫，只允许 admin 查看预约线索。

练习建议：

1. 新增一个 `ComparisonTable` 组件。
2. 在目录页展示三个产品的端口和价格。
3. 给它加一个 Testing Library 测试。
