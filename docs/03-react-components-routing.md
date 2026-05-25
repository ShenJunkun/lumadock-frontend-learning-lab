# 03 React 组件与路由

## 入口组件

- `src/main.tsx` 挂载 React。
- `QueryClientProvider` 提供数据请求缓存。
- `BrowserRouter` 提供前端路由。
- `src/App.tsx` 定义页面路由。

本项目启动后的组件关系可以这样看：

```text
main.tsx
  -> AppProviders
       -> QueryClientProvider
       -> ConfigProvider
       -> BrowserRouter
            -> App
                 -> AppShell
                      -> Routes / Page
```

`AppProviders` 引用 `App`，是为了在应用外层集中放置全局运行环境：React Query 缓存、Ant Design 主题和语言、`BrowserRouter` 等。`App` 再引用 `AppShell`，是为了把“路由定义”和“页面骨架”分开：`App` 负责决定不同 path 渲染哪个页面，`AppShell` 负责 header、nav、main、footer 这些稳定布局。

这不是 Java 中常担心的循环依赖。当前依赖方向是单向的：

```text
AppProviders -> App -> AppShell
```

只要没有出现 `AppShell -> AppProviders` 或 `App -> AppProviders` 这样的反向 import，就不是循环模块依赖。可以把它理解成 Java 里 `main` 先创建一批外层上下文，再把真正的业务入口 `App` 放进去；而 `App` 内部再组合自己的布局和页面。

## React 先学概念

React 的核心不是“在 HTML 里写很多标签”，而是用组件描述界面，然后让 React 根据状态变化更新 DOM。初学时建议先抓住这些概念：

| 概念     | 先理解什么                                            | 本项目例子                                       |
| -------- | ----------------------------------------------------- | ------------------------------------------------ |
| 组件     | 一个返回 TSX 的函数，就是一块可复用界面               | `ProductCard`、`LeadForm`、`AppShell`            |
| props    | 父组件传给子组件的数据和回调                          | `ProductCard product={product}`                  |
| state    | 组件或页面内部会变化的数据                            | 配置器里的颜色、刻字、数量选择                   |
| render   | state 或 props 变化后，React 重新计算界面应该长什么样 | 点击配置按钮后选中态变化                         |
| 条件渲染 | 根据状态决定显示哪个组件                              | loading、error、empty、success 状态              |
| 列表渲染 | 用 `.map()` 把数组变成一组组件                        | 产品卡片列表                                     |
| key      | 帮 React 稳定识别列表里的每一项                       | `key={product.id}`                               |
| 事件处理 | 用 `onClick`、`onSubmit` 等响应用户操作               | 配置按钮、预约表单                               |
| hook     | 在函数组件里使用 React 能力和外部状态能力             | `useState`、`useMemo`、React Query hook          |
| 组件树   | 大组件包含小组件，最终形成页面结构                    | `AppProviders` -> `App` -> `Page` -> `Component` |

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

## 页面绘制和用户交互在哪里

本项目不是把所有 UI 和点击逻辑都写在一个文件里，而是按组件树分层：

```text
main.tsx
  -> AppProviders.tsx
    -> App.tsx
      -> AppShell.tsx
        -> pages/*
          -> components/*
```

每一层负责的事情不同：

| 文件或目录              | 主要负责                                                       | 典型代码                                                       |
| ----------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `apps/web/src/main.tsx` | 把 React 挂载到 `#root`，启动 mock 和 PWA 注册                 | `ReactDOM.createRoot(...).render(...)`                         |
| `AppProviders.tsx`      | 提供 React Query、Ant Design、Router、主题和语言等全局运行环境 | `<QueryClientProvider>`、`<ConfigProvider>`、`<BrowserRouter>` |
| `App.tsx`               | 定义 URL path 对应哪个页面                                     | `<Route path="/book" element={<BookingPage />} />`             |
| `AppShell.tsx`          | 画全站稳定外壳：页眉、导航、偏好选择、页脚                     | `<header>`、`<nav>`、`<main>{children}</main>`                 |
| `pages/*`               | 画具体页面，组合数据、状态和子组件                             | `BookingPage`、`CatalogPage`、`AdminPage`                      |
| `components/*`          | 画可复用 UI 和局部交互                                         | `LeadForm`、`ConfiguratorPanel`、`ProductCard`                 |

可以这样记：

- `App.tsx` 决定“当前 URL 该显示哪个页面”。
- `AppShell.tsx` 决定“每个页面外面稳定存在的导航和布局”。
- `pages/*` 决定“这个页面整体长什么样、用哪些数据和组件”。
- `components/*` 决定“按钮、表单、卡片、配置器这些局部 UI 怎么画、怎么响应操作”。

### 导航交互

全站导航在 `AppShell.tsx`。页面跳转主要用 React Router 的 `NavLink`：

```tsx
<NavLink
  to="/products"
  className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
>
  <span>{t("shell.products")}</span>
</NavLink>
```

`to` 决定点击后去哪个路径；`isActive` 由 React Router 提供，用来给当前路由加选中样式。

退出登录是按钮点击事件：

```tsx
const handleLogout = () => {
  logout();
  void message.success("Logged out.");
  navigate("/");
};

<button type="button" onClick={handleLogout}>
  <span>{t("shell.logout")}</span>
</button>;
```

这里的顺序是：用户点击按钮 -> React 调用 `handleLogout` -> 清理 Zustand 登录态 -> 弹出 Ant Design message -> 跳转首页。

### 输入框和下拉框

输入框通常是“受控组件”：值来自 state，用户输入时用 `onChange` 更新 state。

`CatalogPage` 的搜索框：

```tsx
const [query, setQuery] = useState("");

<input
  value={query}
  placeholder="Search by name or category"
  onChange={(event) => setQuery(event.target.value)}
/>;
```

交互链路是：

```text
用户输入
  -> onChange 触发
  -> setQuery(...)
  -> CatalogPage 重新渲染
  -> filteredProducts 根据新 query 重新计算
  -> 页面显示新的产品列表
```

`BookingPage` 的产品下拉框也是同类模式：

```tsx
const [selectedId, setSelectedId] = useState(requestedProduct);

<select
  value={selectedProduct.id}
  onChange={(event) => setSelectedId(event.target.value)}
>
  {products.map((product) => (
    <option key={product.id} value={product.id}>
      {product.name}
    </option>
  ))}
</select>;
```

这里用户选择产品后，`selectedId` 变化，`selectedProduct` 重新计算，页面里的 3D 展示、产品摘要和 `LeadForm productId={selectedProduct.id}` 都会跟着更新。

### 按钮点击

配置器按钮在 `ConfiguratorPanel.tsx`。按钮点击后通常调用 Zustand action：

```tsx
<button
  className={`swatch-button${finish === option.id ? " is-selected" : ""}`}
  type="button"
  aria-pressed={finish === option.id}
  onClick={() => setFinish(option.id as FinishId)}
>
  <span>{option.label}</span>
</button>
```

交互链路是：

```text
用户点击颜色按钮
  -> onClick 执行 setFinish(...)
  -> configuratorStore 更新 finish
  -> 订阅 finish 的组件重新渲染
  -> 按钮选中态、价格估算、预约配置快照更新
```

如果按钮只影响当前组件内部状态，也可以用局部 `useState`。例如 `AntdWorkbenchPreview` 里点击按钮打开弹窗，就是 `setIsOpen(true)`。

### 表单提交

预约表单在 `LeadForm.tsx`。表单提交用的是 `onSubmit`：

```tsx
const onSubmit = handleSubmit(async (values) => {
  await mutation.mutateAsync({
    product_id: values.productId || productId,
    name: values.name,
    email: values.email,
    configuration: snapshot(),
  });
});

<form className="lead-form" onSubmit={onSubmit}>
  <button type="submit">Send request</button>
</form>;
```

这里有几层能力：

- `react-hook-form` 的 `handleSubmit` 负责收集字段、执行校验、把合法的 `values` 交给回调。
- `zodResolver(leadFormSchema)` 负责按 Zod schema 校验姓名、邮箱、同意项等字段。
- `useMutation` 负责提交 API 请求。
- 提交成功后清理 `sessionStorage` 草稿，失败时显示错误提示。

表单输入字段通过 `register(...)` 接入 React Hook Form：

```tsx
<input autoComplete="name" {...register("name")} />
<textarea rows={4} {...register("message")} />
```

这和普通 `useState` 控制输入框不同：字段值主要由 React Hook Form 管理，适合复杂表单和校验。

### 鼠标悬停、聚焦和预取

产品卡片的 `ProductCard` 接收父组件传入的回调：

```tsx
<ProductCard product={product} onIntent={handleProductIntent} />
```

父组件 `CatalogPage` 定义：

```tsx
const handleProductIntent = (productId: string) => {
  void prefetchProductDetail(queryClient, productId);
};
```

子组件在鼠标进入或聚焦时调用它：

```tsx
const handleIntent = () => onIntent?.(product.id);

<Link
  to={`/products/${product.id}`}
  onFocus={handleIntent}
  onMouseEnter={handleIntent}
>
```

这样用户还没点击详情页时，React Query 就可以提前预取产品详情，点击后页面更快。

### 拖拽和复杂交互

配置器里的优先级排序使用 `@dnd-kit`。核心事件是：

```tsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handlePriorityDragEnd}
>
```

`handlePriorityDragEnd` 会根据拖拽结果计算新的顺序，然后写回 Zustand：

```tsx
const nextOrder = arrayMove(priorityOrder, oldIndex, newIndex);
setPriorityOrder(nextOrder);
```

复杂交互通常会拆成三层：

1. 外部库负责识别拖拽、键盘、鼠标等底层事件。
2. 当前组件把事件结果转成业务含义，例如“把 profile 从第 3 位移动到第 1 位”。
3. Zustand 或局部 state 保存新结果，触发 UI 重新渲染。

### 读事件代码的顺序

看到按钮、输入框、表单时，可以按这个顺序读：

1. 找 JSX 上的事件属性：`onClick`、`onChange`、`onSubmit`、`onMouseEnter`、`onFocus`。
2. 跳到事件函数定义：例如 `handleLogout`、`handleProductIntent`、`onSubmit`。
3. 看事件函数改了什么状态：`useState`、Zustand action、React Hook Form、React Query mutation。
4. 看状态变化后哪些 JSX 依赖这个值：`value={...}`、`className={...}`、条件渲染、列表渲染。
5. 如果调用了 API，再去 `apps/web/src/api/` 看请求函数。

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

## Vue 组件与路由对照

Vue 并行应用在 `apps/web-vue`，目标不是替换 React 主线，而是用 Vue 3 复刻同一套产品 UI 和业务流程。读代码时可以把它当成“同题不同解”：

| React 版                     | Vue 版                                                | 对应关系                                                                                          |
| ---------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `main.tsx`                   | `main.ts`                                             | 挂载应用，安装全局插件                                                                            |
| `AppProviders.tsx`           | `main.ts` + `App.vue`                                 | React 用 Provider 包树；Vue 用 `app.use(...)` 安装 Pinia、Router、Vue Query、Ant Design Vue、i18n |
| `App.tsx`                    | `router/index.ts` + `App.vue`                         | React 在 JSX 里写 `<Routes>`；Vue 在路由表里声明 routes，并用 `<RouterView />` 渲染当前页面       |
| `AppShell.tsx` 的 `children` | `AppShell.vue` 的 `<slot />`                          | 外壳组件固定 header/nav/footer，中间内容由父级传入                                                |
| `NavLink`                    | `RouterLink`                                          | 都用于单页应用内部跳转，并能表达当前路由高亮                                                      |
| Zustand store hook           | Pinia store                                           | 都保存登录、偏好、配置器等客户端状态                                                              |
| `useQuery` / `useMutation`   | `useQuery` / `useMutation` from `@tanstack/vue-query` | 都处理服务端数据、缓存、loading/error 状态                                                        |

Vue 单文件组件通常长这样：

```vue
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <section>
    <h1>{{ title }}</h1>
  </section>
</template>
```

可以先抓住几个和 React 最常对照的点：

- React 用 JSX 表达 UI；Vue 用 `<template>` 表达 UI，动态值写成 `{{ value }}`。
- React 的 props 是函数参数；Vue `<script setup>` 里常用 `defineProps(...)` 声明 props。
- React 条件渲染常用 `&&` / `? :`；Vue 模板里常用 `v-if` / `v-else`。
- React 列表渲染常用 `.map(...)`；Vue 模板里常用 `v-for`，同样需要稳定的 `:key`。
- React 事件写 `onClick={handler}`；Vue 事件写 `@click="handler"`。
- React 表单值常用 `value` + `onChange` 或 React Hook Form；Vue 常用 `v-model` 或 reactive state。
- React Router 用组件包裹路由；Vue Router 用 `createRouter(...)` 创建路由实例，并可以用 `beforeEach` 做全局守卫。

当前 Vue 路由仍然保持同一组页面：

- `/` 首页。
- `/products` 产品目录。
- `/products/:productId` 产品详情。
- `/book` 预约。
- `/learn` 学习章节。
- `/login` 登录。
- `/admin` 后台。
- 未匹配路径进入 404。

Vue 版的登录守卫同样沿用产品规则：未登录访问后台会跳到 `/login`；登录但角色是 `viewer` 时显示无权限状态。区别是实现位置从 React 的 `PrivateRoute` / `RoleRoute` 组件，变成 Vue Router 的 route meta 和守卫逻辑。

练习建议：

1. 新增一个 `ComparisonTable` 组件。
2. 在目录页展示三个产品的端口和价格。
3. 给它加一个 Testing Library 测试。
