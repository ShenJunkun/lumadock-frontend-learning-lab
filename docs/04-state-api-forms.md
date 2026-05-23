# 04 状态、API、表单与全局共享

这一章回答一个前端项目里很常见的问题：**有些信息只在一个组件里用，有些信息需要多个页面共享，它们分别应该放在哪里？**

在 React / TypeScript 项目中，“全局变量”并不是唯一答案。这个项目更推荐按数据来源和生命周期选择机制：局部状态、模块常量、Zustand、React Query、浏览器存储、环境变量、CSS 变量和 Provider 各自负责不同层次。

## 一句话总览

| 信息类型 | 放在哪里 | 项目例子 |
| --- | --- | --- |
| 只在一个组件内使用的交互状态 | `useState` / `useReducer` | 搜索词、当前选中的 lead、提交状态 |
| 由已有数据计算出来的临时结果 | `useMemo` 或普通变量 | 产品筛选结果、表格列配置、价格展示 |
| 多处复用但不会被用户改动的静态配置 | `export const` 模块常量 | 配置器选项、路由元信息、fallback 产品数据 |
| 多个组件都要读写的前端状态 | Zustand store | 配置器、登录态、语言和主题 |
| 从后端 API 读取的数据 | React Query | 产品列表、产品详情、统计数据、后台 leads |
| 刷新页面后还要保留的数据 | `localStorage` / `sessionStorage` | 登录 token、语言、主题、预约草稿 |
| 启动和构建配置 | Vite 环境变量 | `VITE_API_BASE_URL`、`VITE_ENABLE_MOCKS` |
| 全站样式 token | CSS 变量 / Ant Design theme | 背景色、文字色、暗黑模式、组件主题 |
| 给整棵组件树提供运行环境 | React Provider | QueryClient、Antd 配置、路由 |

简单判断：

- 只影响当前组件：先用局部状态。
- 多个组件都要修改：考虑 Zustand。
- 数据来自接口：优先 React Query。
- 只是固定配置：用模块导出，不要做成状态。
- 需要刷新后仍然保留：在状态更新时同步写入浏览器存储。
- 是接口地址、mock 开关这类部署配置：用 `.env`。

## 启动链路中的全局环境

前端入口是 `apps/web/src/main.tsx`。它做几件全局初始化：

```tsx
import { AppProviders } from "./components/AppProviders";
import "./i18n";
import "antd/dist/reset.css";
import "./styles/global.css";
```

这里的 `import "./styles/global.css"` 是副作用导入：不接收变量，只让 Vite 把全局 CSS 注入页面。`import "./i18n"` 也是类似思路，它初始化多语言运行时。

`main.tsx` 还会根据环境变量决定是否启用 mock：

```tsx
if (import.meta.env.VITE_ENABLE_MOCKS !== "true") {
  return;
}
```

最后它把 React 应用挂到 `index.html` 的 `#root`：

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>,
);
```

`AppProviders` 是这个项目的全局运行环境入口：

- `QueryClientProvider` 提供 React Query 缓存。
- `ConfigProvider` 提供 Ant Design 语言和主题。
- `AntdRuntimeApp` 提供 Ant Design message、modal、notification 的运行上下文。
- `BrowserRouter` 提供前端路由能力。
- `usePreferencesStore` 把语言、主题状态同步到 i18n、DOM 和 Ant Design。

所以可以这样记：

```text
index.html
  -> main.tsx
    -> AppProviders
      -> App
        -> AppShell
          -> pages
```

`AppProviders` 不是普通页面组件，它负责让整棵组件树拥有“全局能力”。

## 局部变量与局部状态

React 组件本质上是函数。函数内部普通变量每次渲染都会重新计算：

```tsx
const products = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
```

这种变量适合表达“当前这次渲染里临时算出来的值”，不适合保存用户操作后的长期状态。

需要在渲染之间保留的值，用 `useState`：

```tsx
const [query, setQuery] = useState("");
```

项目里的局部状态例子：

- `CatalogPage` 的搜索词 `query`。
- `BookingPage` 的当前产品 `selectedId`。
- `AdminPage` 的当前选中线索 `selectedLead`。
- `AntdWorkbenchPreview` 的弹窗开关 `isOpen`。
- `ConfiguratorPanel` 的拖拽提示 `priorityStatus`。

如果状态变化过程比较像一个小型状态机，可以用 `useReducer`。项目里的 `LeadForm` 用 reducer 管理提交中、成功、失败等状态，比多个 `useState` 更清晰。

`useMemo` 不是存状态，而是缓存计算结果：

```tsx
const filteredProducts = useMemo(() => {
  return products.filter((product) => product.name.includes(query));
}, [products, query]);
```

它适合“输入不变就不用重复计算”的派生数据，例如筛选后的产品、表格列配置、配置器优先级展示。

## 模块常量：可共享，但不是动态全局状态

如果一份数据是固定配置，可以直接用模块导出：

```tsx
export const finishOptions = [
  { id: "graphite", label: "Graphite", color: "#252a32", price: 0 },
  { id: "pearl", label: "Pearl", color: "#f2f3ef", price: 20 },
  { id: "cobalt", label: "Cobalt", color: "#525ddc", price: 34 },
] as const;
```

这类值在多个文件 import 时共享同一个模块定义，但它不应该被当作可变全局变量使用。

项目中适合模块常量的内容：

- 配置器选项：`finishOptions`、`standOptions`、`planOptions`。
- fallback 产品数据。
- 路由 metadata。
- feature flag 默认值。
- API query key 工厂。

`as const` 的作用是让 TypeScript 把值收窄成更精确的字面量类型。比如 `"graphite"` 会被当作具体值，而不是普通 `string`。这样可以从数据本身推导类型：

```tsx
export type FinishId = (typeof finishOptions)[number]["id"];
```

这能减少“配置数据和类型手写两遍”的重复。

## Zustand：项目里的全局客户端状态

这个项目用 Zustand 管理多个组件共享的前端状态。核心文件在 `apps/web/src/store/`：

- `configuratorStore.ts`：产品配置器状态。
- `preferencesStore.ts`：语言、主题和系统主题解析结果。
- `authStore.ts`：登录 token、用户信息和认证状态。

Zustand 的基本结构是：

```tsx
export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  finish: "graphite",
  setFinish: (finish) => set({ finish }),
  snapshot: () => {
    const state = get();
    return {
      finish: state.finish,
      estimate: state.estimate(),
    };
  },
}));
```

组件读取时使用 selector：

```tsx
const finish = useConfiguratorStore((state) => state.finish);
const setFinish = useConfiguratorStore((state) => state.setFinish);
```

selector 的好处是：组件只订阅自己关心的字段。`finish` 变化时，读取 `finish` 的组件会更新；无关字段变化时，组件不需要跟着重渲染。

### 配置器状态

`configuratorStore` 保存这些用户选择：

- `finish`
- `stand`
- `plan`
- `engraving`
- `priorityOrder`

它还提供两个派生能力：

- `estimate(basePrice)`：根据当前配置计算价格。
- `snapshot()`：把当前配置打包成预约提交需要的结构。

预约提交时，`LeadForm` 会读取 `snapshot()`，并把结果作为 lead 的 `configuration` 提交给后端。

### 偏好状态

`preferencesStore` 保存：

- `language`
- `themeMode`
- `resolvedTheme`

用户切换语言或主题时，store 会同步写入 `localStorage`。`AppProviders` 再监听 store，把变化应用到：

- i18n 当前语言。
- Ant Design `ConfigProvider`。
- `document.documentElement.dataset.theme`。
- Tailwind 暗黑模式 class。
- 浏览器原生 `color-scheme`。

这里体现了一个常见模式：**状态存在 store 里，副作用在合适的边界组件里执行。**

### 登录状态

`authStore` 保存：

- `token`
- `user`
- `isAuthenticated`

登录成功后，`setSession()` 会把 token 和用户信息写入 `localStorage`，然后更新 Zustand 状态。退出登录时，`logout()` 会清理存储并重置状态。

`authStore` 还把 token 提供给 API client：

```tsx
setAuthTokenProvider(() => useAuthStore.getState().token);
```

这样 `apiRequest` 发请求时，可以自动追加：

```text
Authorization: Bearer <token>
```

注意：这个项目把 token 放在 `localStorage`，是为了学习认证数据流。生产系统要认真评估 XSS、CSRF、httpOnly cookie、刷新 token 等安全策略。

## React Query：接口数据的共享缓存

React Query 负责“服务端数据”，也就是从 API 获取、缓存、刷新和处理加载状态的数据。

项目的全局 QueryClient 在 `apps/web/src/lib/queryClient.ts`：

```tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});
```

`AppProviders` 通过 `QueryClientProvider` 把它提供给整个应用：

```tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

页面和组件通过 `useQuery` 使用它。例如 `src/api/products.ts` 会读取：

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/stats`

React Query 和 Zustand 的区别：

| 问题 | 推荐机制 |
| --- | --- |
| 产品列表从后端来，要缓存和重试 | React Query |
| 用户当前选择了哪种产品配置 | Zustand |
| 登录 token 要给 API client 用 | Zustand + `localStorage` |
| 表单输入框当前内容 | `react-hook-form` 或局部状态 |
| 产品详情接口失败时显示错误状态 | React Query |

不要把接口数据手动塞进 Zustand，除非它已经从“服务端数据”变成了明确的“客户端编辑草稿”。否则缓存失效、重复请求、错误重试、loading 状态都会越来越难维护。

## 浏览器存储：持久化，不是响应式状态

`localStorage` 和 `sessionStorage` 可以让数据在刷新后保留，但它们本身不是 React 状态。直接写入 storage 不会自动让组件重渲染。

项目里的模式是：

1. 初始化时从 storage 读取。
2. 用户操作时写入 storage。
3. 同时更新 React / Zustand 状态。
4. 组件订阅状态，而不是到处直接读 storage。

当前项目使用：

- `localStorage` 保存登录 session。
- `localStorage` 保存语言和主题偏好。
- `sessionStorage` 保存预约草稿。

一般判断：

- 跨浏览器标签页、长期保留：考虑 `localStorage`。
- 当前标签页临时保留，关闭后可丢失：考虑 `sessionStorage`。
- 只在当前组件活着时有意义：不要进 storage。

## 环境变量：部署配置

前端环境变量在 `apps/web/.env.*`：

```text
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_ENABLE_MOCKS=false
```

Vite 只会把 `VITE_` 开头的变量暴露给前端代码：

```tsx
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
```

环境变量适合：

- API base URL。
- 是否启用 MSW mock。
- feature flag 默认开关。
- 构建时注入的非敏感配置。

环境变量不适合：

- 用户登录 token。
- 数据库密码。
- 真正的后端密钥。

原因是前端代码会被打包发送到浏览器，用户可以看到最终产物。前端环境变量只能放“可以公开的配置”。

## CSS 变量与主题共享

全局视觉 token 放在 `apps/web/src/styles/global.css` 的 `:root` 里：

```css
:root {
  --bg: #f6f7f4;
  --surface: #ffffff;
  --ink: #17201f;
}
```

组件或页面可以通过 `var(...)` 读取：

```css
body {
  background: var(--bg);
  color: var(--ink);
}
```

这也是一种“全局共享”，但它共享的是样式 token，不是业务数据。主题切换时，`preferencesStore` 更新 `resolvedTheme`，`AppProviders` 调用 `applyDocumentTheme()`，最后通过 DOM attribute、class 和 Ant Design theme 共同影响页面外观。

CSS 变量适合：

- 颜色。
- 阴影。
- 边框。
- 设计 token。
- 暗黑模式中需要整体切换的视觉值。

CSS 变量不适合保存用户、接口数据或业务状态。

## 表单状态与提交流

`LeadForm` 使用三层机制：

- `react-hook-form` 管理输入值、触摸状态、错误状态。
- `zod` 定义字段校验规则。
- `@hookform/resolvers` 把 zod 接入 react-hook-form。

预约提交的大致流程：

1. 用户填写表单。
2. `react-hook-form` 收集字段。
3. `zod` 校验字段格式。
4. `LeadForm` 从 `configuratorStore.snapshot()` 读取配置器快照。
5. mutation 调用 API。
6. 成功或失败后更新提交状态。

表单输入通常不放进 Zustand。只有当表单草稿需要跨页面、跨组件或刷新后恢复时，才考虑单独抽成 store 或 storage 工具。项目里的预约草稿就是用 `sessionStorage` 按产品保存。

## JWT Demo Auth 数据流

后端提供本地学习用认证接口：

- `POST /api/auth/login`：用邮箱和密码换取 JWT。
- `GET /api/auth/me`：用 `Authorization: Bearer <token>` 获取当前用户。
- `GET /api/admin/leads`：需要 admin token，用于后台查看预约线索。

默认账号：

```text
admin@lumadock.local / admin123
viewer@lumadock.local / viewer123
```

权限约定：

- `admin` 可以访问后台 leads 列表。
- `viewer` 可以登录，但访问后台 leads 会得到 403。
- 未登录访问受保护接口会得到 401。

前端认证链路：

```text
LoginPage
  -> login API
  -> authStore.setSession()
  -> localStorage 写入 session
  -> api client token provider 读取 token
  -> PrivateRoute / RoleRoute 控制页面访问
```

相关组件：

- `PrivateRoute`：未登录时跳转 `/login`。
- `RoleRoute`：检查用户角色，不满足时展示 403 状态。
- `AppShell`：根据登录态显示登录、退出和后台入口。

## 选择机制的实用规则

新增一份数据时，可以按这个顺序问自己：

1. 它是不是接口返回的数据？
   是的话，优先 React Query。

2. 它是不是只属于一个组件？
   是的话，优先 `useState`、`useReducer` 或 `react-hook-form`。

3. 它是不是多个组件都要读写？
   是的话，考虑 Zustand。

4. 它刷新后还要保留吗？
   是的话，在 Zustand 或工具函数中同步 `localStorage` / `sessionStorage`。

5. 它是不是固定选项或配置？
   是的话，用 `export const` 模块常量。

6. 它是不是部署环境决定的？
   是的话，用 `VITE_` 环境变量。

7. 它是不是样式 token？
   是的话，用 CSS 变量或 Ant Design theme。

## 练习建议

1. 给配置器新增一个 `warranty` 选项，放进 `configuratorStore`，并让 `estimate()` 计算价格。
2. 给 `preferencesStore` 新增一个布局密度选项，例如 `comfortable` / `compact`，并写入 `localStorage`。
3. 给产品列表新增一个本地筛选条件，先用 `useState` 实现，不要急着放进 Zustand。
4. 给预约表单增加 `preferredDate` 字段，用 zod 要求日期不能早于今天。
5. 给一个 API hook 增加明确的 query key，并观察 React Query 如何复用缓存。

这章的重点不是记住某个库的 API，而是建立边界感：**不同信息有不同归属，状态共享应该服务于业务和维护性，而不是把所有东西都放进一个全局对象。**
