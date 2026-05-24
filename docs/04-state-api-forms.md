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

如果想查这些 import 背后的文档，可以按“包名”和“导入名”去找：

| import | 来自哪里 | 当前项目里负责什么 | 推荐文档入口 |
| --- | --- | --- | --- |
| `QueryClientProvider` | `@tanstack/react-query` | 把 `queryClient` 提供给整棵 React 树，让页面里的 `useQuery` / `useMutation` 能共享请求缓存 | [TanStack Query 中文文档](https://zh-hans.tanstack.dev/query/latest/docs/framework/react/overview) / [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview) |
| `App as AntdRuntimeApp` | `antd` | Ant Design 的运行时上下文，给 message、modal、notification 等全局反馈组件提供环境；改名是为了避免和项目自己的 `App` 重名 | [Ant Design App 包裹组件](https://ant.design/components/app-cn) |
| `ConfigProvider` | `antd` | 给 Ant Design 组件统一设置语言、主题、组件配置 | [Ant Design ConfigProvider](https://ant.design/components/config-provider-cn) |
| `enUS` / `zhCN` | `antd/locale/*` | Ant Design 内置语言包，配合 `ConfigProvider locale={...}` 使用 | [Ant Design 国际化](https://ant.design/docs/react/i18n-cn) |
| `useEffect` | `react` | 在状态变化后执行副作用，比如切换 i18n 语言、应用 DOM 主题、监听系统主题变化 | [React useEffect 中文文档](https://zh-hans.react.dev/reference/react/useEffect) |
| `BrowserRouter` | `react-router-dom` | 让应用使用浏览器地址栏和 history 实现前端路由 | [React Router BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter) |
| `App` | `../App` | 项目自己的主应用组件，真正包含路由、页面和页面外壳 | 本项目 `apps/web/src/App.tsx` |
| `i18n` | `../i18n` | 项目自己的 i18next 实例，`AppProviders` 会调用 `i18n.changeLanguage(language)` 切换语言 | [i18next API](https://www.i18next.com/overview/api) |
| `queryClient` | `../lib/queryClient` | 项目自己的 React Query client 配置，定义缓存、重试、窗口聚焦刷新等默认行为 | [TanStack Query QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient) |
| `applyDocumentTheme` | `../store/preferencesStore` | 项目自己的 DOM 主题应用函数，负责设置 `data-theme`、`dark` class 和 `color-scheme` | 本项目 `apps/web/src/store/preferencesStore.ts` |
| `usePreferencesStore` | `../store/preferencesStore` | 项目自己的 Zustand 偏好 store，保存语言、主题和系统主题解析结果 | [Zustand Docs](https://zustand.docs.pmnd.rs/) |
| `createAntdTheme` | `../theme/antdTheme` | 项目自己的 Ant Design theme 工厂，根据明暗主题生成组件 token | [Ant Design 定制主题](https://ant.design/docs/react/customize-theme-cn) |

这类 import 的查文档方法是：

1. 看到 `"react"`、`"antd"`、`"@tanstack/react-query"` 这种包名，先去对应库的官方文档。
2. 看到 `"../xxx"` 这种相对路径，先在项目里跳转到对应文件，因为它是本项目自己封装的模块。
3. 看到 `App as AntdRuntimeApp` 这种写法，说明导入时做了重命名：外部导出名叫 `App`，当前文件里为了避开重名，把它叫作 `AntdRuntimeApp`。

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

### Zustand 是什么

Zustand 是一个第三方 React 状态管理库，不是 React 官方提供的库。React 官方提供的是 `useState`、`useReducer`、`useContext`、`useSyncExternalStore` 这些基础能力；Zustand 在这些能力之上，提供了更轻量的全局 store 写法。

它的特点是：

- 不需要像 Redux 传统写法那样手写 action type、reducer、dispatch 流程。
- 不需要在组件树顶层额外包一个 Provider 才能使用 store。
- 组件可以用 selector 只订阅自己关心的状态片段。
- store 可以放状态，也可以放修改状态的方法。
- API 很小，适合教学项目、中小型应用和很多业务后台。

Zustand 在 React 生态里使用很多。判断“是否大量使用”可以看 npm 下载量、GitHub 活跃度、社区文章和公司项目案例。不过下载量只能代表生态热度，不等于每个项目都应该用它。本项目选择 Zustand，是因为它足够直观：文件少、样板代码少，很适合学习“客户端全局状态”的核心概念。

常见替代方案：

| 方案 | 更适合什么 | 和 Zustand 的区别 |
| --- | --- | --- |
| React `useState` / `useReducer` | 组件内部状态、局部交互 | 官方内置，最简单；但跨很多组件共享会变麻烦 |
| React Context | 主题、语言、当前用户这类低频变化的全局值 | 官方内置；频繁变化或大对象容易造成较多重渲染，需要额外拆分和优化 |
| Redux Toolkit | 大型应用、复杂状态流、强调可追踪 action、团队规范和 DevTools | 更成熟、更规范、生态很大；写法和概念比 Zustand 重一些 |
| Zustand | 中小型到较大型客户端状态、配置器、登录态、偏好设置 | 简洁、上手快、selector 订阅直接；复杂团队规范需要自己约定 |
| Jotai | 原子化状态，很多小状态彼此组合 | 状态模型是 atom，不是单一 store；细粒度强，但思维方式不同 |
| Valtio | 喜欢直接修改代理对象的写法 | 基于 Proxy，写法接近“直接改对象”；调试和团队约束风格不同 |
| MobX | 复杂可观察对象模型、面向对象风格状态 | 响应式能力强；需要理解 observable、action、computed 等概念 |
| XState | 明确状态机、复杂流程、状态跳转非常严格的业务 | 不是普通 store，而是状态机/状态图；适合流程复杂但学习成本更高 |
| React Query / TanStack Query | 服务端数据：请求、缓存、重试、失效、mutation | 不应该拿它替代 Zustand。它管 API 数据，Zustand 管客户端状态 |

本项目的判断方式是：

- 来自 API 的产品列表、详情、后台 leads：用 React Query。
- 用户当前选择的产品配置、语言、主题、登录状态：用 Zustand。
- 只在一个组件里短暂存在的输入和开关：用 `useState` / `useReducer`。
- 表单当前输入：优先交给 React Hook Form。

相关官方文档入口：

- [React 管理状态](https://zh-hans.react.dev/learn/managing-state)：React 官方的状态管理基础，包括 state、props、状态提升等。
- [React useContext](https://zh-hans.react.dev/reference/react/useContext)：React 官方 Context Hook。
- [Zustand Docs](https://zustand.docs.pmnd.rs/)：Zustand 官方文档。
- [Redux Toolkit](https://redux-toolkit.js.org/)：Redux 官方推荐的现代 Redux 写法。
- [TanStack Query](https://zh-hans.tanstack.dev/query/latest/docs/framework/react/overview)：服务端状态、请求缓存和 mutation。
- [Jotai Docs](https://jotai.org/docs)：原子化状态管理。
- [Valtio Docs](https://valtio.dev/)：Proxy 风格状态管理。
- [MobX Docs](https://mobx.js.org/README.html)：observable 风格状态管理。
- [XState Docs](https://stately.ai/docs)：状态机、状态图和 actor 模型。

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

### selector 和订阅机制

以 `AppProviders` 里的偏好读取为例：

```tsx
const language = usePreferencesStore((state) => state.language);
const resolvedTheme = usePreferencesStore((state) => state.resolvedTheme);
const themeMode = usePreferencesStore((state) => state.themeMode);
```

`(state) => state.language` 是 selector。它不是事件回调，而是“从完整 store state 里挑出一块值”的函数。可以拆成这样理解：

```tsx
const selectLanguage = (state: PreferencesState) => state.language;
const language = usePreferencesStore(selectLanguage);
```

Zustand 的核心机制可以简化成下面几步：

1. `create(...)` 创建一个 store，里面保存当前 state。
2. store 里面有一个 listeners 集合，用来保存所有订阅者。
3. 组件调用 `usePreferencesStore(selector)` 时，React 会通过 Zustand 订阅这个 store。
4. 调用 `set(...)` 修改 store 时，Zustand 会更新 state，然后通知 listeners。
5. React 收到通知后重新执行 selector，拿到新的 selected value。
6. 如果新旧 selected value 不一样，React 就重新渲染这个组件。

可以用伪代码理解：

```ts
let state = initialState;
const listeners = new Set<() => void>();

function set(partialState) {
  state = { ...state, ...partialState };
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
```

React 组件这一侧大概是：

```ts
const selectedValue = selector(store.getState());
store.subscribe(() => {
  const nextSelectedValue = selector(store.getState());
  // selected value 变化时，React 安排组件重新渲染。
});
```

真实实现会更严谨：Zustand React 版使用 React 的 `useSyncExternalStore` 连接外部 store。这个 Hook 是 React 官方提供的机制，用来让 React 组件安全地订阅外部状态源。

相关官方文档：

- [Zustand useStore](https://zustand.docs.pmnd.rs/reference/hooks/use-store)：说明 store hook 可以接收 selector，并返回 selector 从当前 state 中选出的数据。
- [Zustand Introduction](https://zustand.docs.pmnd.rs/getting-started/introduction)：介绍 `create`、`set`、store hook 和基础使用方式。
- [Zustand create API](https://zustand.docs.pmnd.rs/apis/create)：介绍 `create(...)` 如何创建绑定到 React 的 store hook。
- [React useSyncExternalStore 中文文档](https://zh-hans.react.dev/reference/react/useSyncExternalStore)：解释 React 如何订阅外部 store，并在 store 改变时重新读取快照、必要时重新渲染组件。

因此这句代码的含义是：

```tsx
const language = usePreferencesStore((state) => state.language);
```

“从偏好 store 里取出 `language`，并且当 `language` 这个选择结果变化时，让当前组件拿到新值并重新渲染。”

需要注意：selector 最好返回稳定的小值，比如字符串、数字、布尔值或 store 里的函数。如果 selector 每次都返回新对象：

```tsx
const preferences = usePreferencesStore((state) => ({
  language: state.language,
  themeMode: state.themeMode,
}));
```

这个对象每次执行都是新引用，更容易触发额外渲染。项目里更常见的写法是拆开订阅：

```tsx
const language = usePreferencesStore((state) => state.language);
const themeMode = usePreferencesStore((state) => state.themeMode);
```

### Zustand 订阅和 useEffect 的先后关系

Zustand 和 `useEffect` 都可能让人想到“订阅”，但它们订阅的对象不同：

| 机制 | 订阅谁 | 谁触发 | 目的 |
| --- | --- | --- | --- |
| Zustand selector | Zustand store 的状态片段 | `set(...)` 更新 store | 让组件拿到新状态并重新渲染 |
| `useEffect` 依赖数组 | 本次渲染里用到的依赖值 | React 渲染后比较依赖变化 | 在渲染完成后执行副作用 |
| `useEffect` 里的事件监听 | 浏览器、DOM、WebSocket、第三方库等外部系统 | 外部事件发生 | 把外部系统变化接进 React / store |
| `useEffect` cleanup | 上一次 effect 注册的外部资源 | 组件卸载或 effect 重跑前 | 移除监听器、定时器、连接等资源 |

所以这句不是 `useEffect` 在订阅 Zustand：

```tsx
useEffect(() => {
  void i18n.changeLanguage(language);
}, [language]);
```

真正订阅 Zustand 的是：

```tsx
const language = usePreferencesStore((state) => state.language);
```

`[language]` 只是告诉 React：“这个 effect 用到了 `language`，如果下一次渲染时 `language` 和上一次不同，渲染提交后再执行这个 effect。”

语言切换的顺序是：

```text
用户切换语言
  -> setLanguage("zh")
  -> Zustand 更新 language
  -> Zustand 通知订阅 language 的组件
  -> AppProviders 重新渲染并拿到新 language
  -> React 提交这次渲染
  -> useEffect 发现 [language] 变了
  -> i18n.changeLanguage("zh")
```

这类场景里，Zustand 状态更新在前，`useEffect` 在渲染后执行。

主题应用也是同样的顺序：

```text
Zustand 更新 resolvedTheme
  -> AppProviders 重新渲染
  -> React 提交渲染
  -> useEffect 发现 [resolvedTheme] 变了
  -> applyDocumentTheme(resolvedTheme)
  -> html 上的 data-theme、dark class、color-scheme 被更新
```

第三个 effect 更像一座桥，它先安装浏览器监听器：

```tsx
useEffect(() => {
  if (themeMode !== "system") {
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", refreshResolvedTheme);
  return () => mediaQuery.removeEventListener("change", refreshResolvedTheme);
}, [refreshResolvedTheme, themeMode]);
```

第一次进入 `system` 模式时：

```text
AppProviders 渲染，themeMode 是 "system"
  -> React 提交渲染
  -> useEffect 执行
  -> 注册 mediaQuery change 监听器
```

之后操作系统主题变化时：

```text
操作系统深浅色变化
  -> 浏览器触发 mediaQuery change 事件
  -> refreshResolvedTheme()
  -> Zustand 更新 resolvedTheme
  -> 订阅 resolvedTheme 的组件重新渲染
  -> applyDocumentTheme 的 effect 再把新主题同步到 DOM
```

因此可以这样记：

- 如果 effect 依赖 Zustand 状态，比如 `[language]`、`[resolvedTheme]`，通常是 Zustand 更新在前，React 渲染在中间，effect 在后。
- 如果 effect 注册外部监听器，比如 `mediaQuery.addEventListener(...)`，则是 effect 先把外部事件接进来；以后外部事件发生时，再推动 Zustand 更新。

相关学习资料：

- [React useEffect 中文文档](https://zh-hans.react.dev/reference/react/useEffect)：官方 API 说明，重点看依赖数组和 cleanup。
- [使用 Effect 进行同步](https://zh-hans.react.dev/learn/synchronizing-with-effects)：React 官方教程，解释 effect 为什么是“和外部系统同步”。
- [你可能不需要 Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)：React 官方教程，解释哪些逻辑应该在渲染或事件处理里完成，而不是写进 effect。
- [React useSyncExternalStore 中文文档](https://zh-hans.react.dev/reference/react/useSyncExternalStore)：React 官方说明外部 store 如何接入 React 渲染。
- [Zustand useStore](https://zustand.docs.pmnd.rs/reference/hooks/use-store)：Zustand 官方说明 selector 如何从 store 里选择状态。
- [Zustand create API](https://zustand.docs.pmnd.rs/apis/create)：Zustand 官方说明 `create(...)` 如何创建 store hook。

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

常见浏览器存储方式的区别：

| 方式 | 适合什么 | 和本项目的关系 |
| --- | --- | --- |
| Cookie / `document.cookie` | 小容量数据；浏览器会按域名、路径、过期时间等规则随请求自动发送；服务端可以设置 `HttpOnly` Cookie，让前端 JS 读不到 | 当前项目没有用 `document.cookie` 做业务存储。登录采用的是前端保存 token，再由 API client 放进 `Authorization` 请求头 |
| `localStorage` | 同源长期保存；关闭浏览器后还在；多个同源标签页可共享；只能存字符串 | 当前项目用它保存登录 session、语言和主题偏好 |
| `sessionStorage` | 当前标签页临时保存；刷新页面后还在，关闭标签页后清掉；只能存字符串 | 当前项目用它保存预约表单草稿 |
| IndexedDB | 异步浏览器数据库；容量更大；可以存结构化对象、Blob 和更复杂的离线数据 | 当前项目没有使用。以后如果要做大量离线数据、复杂缓存或本地队列，可以考虑它 |
| Cache Storage | Service Worker 使用的请求/响应缓存；常用于 PWA 离线资源，不适合当业务数据表 | 当前项目的 `public/sw.js` 用它缓存离线页面、manifest 和 hero 图片资源 |

当前项目的具体落点：

- `authStore` 用 `localStorage` 保存 `lumadock.auth`，登录成功时写入 token 和用户信息，退出登录时清理。
- `preferencesStore` 用 `localStorage` 保存 `lumadock.language` 和 `lumadock.theme`，再由 `AppProviders` 把语言、主题同步到 i18n、Ant Design 和 DOM。
- `bookingDrafts` 用 `sessionStorage` 保存 `lumadock.bookingDraft:<productId>`，让预约表单在当前标签页刷新后能恢复草稿，提交成功后再清理。
- `sw.js` 用 `caches` 保存静态资源和离线页，这是 PWA 资源缓存，不是用户业务数据。

一般判断：

- 跨浏览器标签页、长期保留：考虑 `localStorage`。
- 当前标签页临时保留，关闭后可丢失：考虑 `sessionStorage`。
- 只在当前组件活着时有意义：不要进 storage。
- 需要浏览器自动随请求发送、并希望服务端控制会话：考虑 Cookie，生产登录常见做法是服务端 session 或刷新 token 配合 `HttpOnly` Cookie，但要同时设计 CSRF 防护。
- 数据量大、结构复杂、需要离线队列或本地数据库能力：考虑 IndexedDB。

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
