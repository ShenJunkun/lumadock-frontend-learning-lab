# 17 Vue 组件与路由

Vue 并行应用在 `apps/web-vue`，目标不是替换 React 主线，而是用 Vue 3 复刻同一套产品 UI 和业务流程。读代码时可以把它当成“同题不同解”。

## 入口组件

Vue 版入口链路可以这样看：

```text
main.ts
  -> createApp(App)
       -> app.use(router)
       -> app.use(createPinia())
       -> app.use(VueQueryPlugin)
       -> app.use(Antd)
       -> App.vue
            -> AppShell
                 -> RouterView / Page
```

React 版把 Provider 写成 JSX 组件树；Vue 版在 `main.ts` 里通过 `app.use(...)` 安装插件。两者目标相同：让页面组件能使用路由、状态、请求缓存、组件库和国际化能力。

## React 与 Vue 对照

| React 版                     | Vue 版                                                | 对应关系                                                                                          |
| ---------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `main.tsx`                   | `main.ts`                                             | 挂载应用，安装全局插件                                                                            |
| `AppProviders.tsx`           | `main.ts` + `App.vue`                                 | React 用 Provider 包树；Vue 用 `app.use(...)` 安装 Pinia、Router、Vue Query、Ant Design Vue、i18n |
| `App.tsx`                    | `router/index.ts` + `App.vue`                         | React 在 JSX 里写 `<Routes>`；Vue 在路由表里声明 routes，并用 `<RouterView />` 渲染当前页面       |
| `AppShell.tsx` 的 `children` | `AppShell.vue` 的 `<slot />`                          | 外壳组件固定 header/nav/footer，中间内容由父级传入                                                |
| `NavLink`                    | `RouterLink`                                          | 都用于单页应用内部跳转，并能表达当前路由高亮                                                      |
| Zustand store hook           | Pinia store                                           | 都保存登录、偏好、配置器等客户端状态                                                              |
| `useQuery` / `useMutation`   | `useQuery` / `useMutation` from `@tanstack/vue-query` | 都处理服务端数据、缓存、loading/error 状态                                                        |

## 单文件组件

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

## 页面路由

当前 Vue 路由保持同一组页面：

- `/` 首页。
- `/products` 产品目录。
- `/products/:productId` 产品详情。
- `/book` 预约。
- `/learn` 学习章节。
- `/login` 登录。
- `/admin` 后台。
- 未匹配路径进入 404。

Vue 版的登录守卫同样沿用产品规则：未登录访问后台会跳到 `/login`；登录但角色是 `viewer` 时显示无权限状态。区别是实现位置从 React 的 `PrivateRoute` / `RoleRoute` 组件，变成 Vue Router 的 route meta 和守卫逻辑。

## 练习建议

1. 新增一个 `ComparisonTable` 组件。
2. 在目录页展示三个产品的端口和价格。
3. 给它加一个 Testing Library 测试。
