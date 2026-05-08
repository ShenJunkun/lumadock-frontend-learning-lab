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
