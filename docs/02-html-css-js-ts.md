# 02 HTML / CSS / JS / TS

本章不是语法大全，而是按本项目中真实出现的代码，解释 HTML、CSS、JavaScript、TypeScript 和 TSX 的常见语法：它们长什么样、为什么这样用、修改时应该注意什么。

## HTML 入口

`apps/web/index.html` 只负责提供根节点和加载 `src/main.tsx`。真实界面由 React 管理。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>LumaDock Learning Lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

关键语法：

| 语法 | 作用 | 本项目为什么这样用 |
| --- | --- | --- |
| `<!doctype html>` | 告诉浏览器使用现代 HTML 标准模式 | 避免旧浏览器兼容模式导致样式计算异常 |
| `<html lang="zh-CN">` | 声明页面语言 | 帮助浏览器、搜索引擎和辅助技术理解内容语言 |
| `<meta charset="UTF-8" />` | 使用 UTF-8 编码 | 项目里有中文文档和界面文案，统一编码更稳 |
| `<meta name="viewport" ... />` | 控制移动端视口宽度 | 响应式布局必须有它，否则手机端会按桌面宽度缩放 |
| `<div id="root"></div>` | React 挂载点 | React 会把组件树渲染到这个节点里 |
| `<script type="module" src="/src/main.tsx">` | 以 ES Module 方式加载入口 | Vite 开发服务器会从这里启动前端模块图 |

这里没有直接写大量页面 HTML，是因为本项目采用 React。静态入口只负责准备容器，真实页面由 `apps/web/src/main.tsx` 和后续组件生成。

### 先理解这条启动链路

学习 Vite、React 和 ES Module 时，先不要把它们混成一个概念。它们在启动页面时各自负责一段：

```text
浏览器打开 index.html
  -> 看到 <script type="module" src="/src/main.tsx">
  -> 向 Vite 开发服务器请求 /src/main.tsx
  -> Vite 读取 main.tsx 里的 import
  -> Vite 转换 TS / TSX / CSS 等浏览器不能直接处理的内容
  -> ReactDOM 找到 <div id="root"></div>
  -> React 把组件树渲染到 root 节点里
```

把它对应到项目文件，就是这条更完整的链路：

```text
apps/web/index.html
  -> <div id="root"></div>
  -> <script type="module" src="/src/main.tsx"></script>

apps/web/src/main.tsx
  -> import 全局 CSS、i18n、PWA 注册逻辑
  -> 可选启动 MSW mock
  -> ReactDOM.createRoot(document.getElementById("root")!)
  -> render(<React.StrictMode><AppProviders /></React.StrictMode>)

apps/web/src/components/AppProviders.tsx
  -> QueryClientProvider 提供 React Query 缓存
  -> ConfigProvider 提供 Ant Design 主题和语言
  -> AntdRuntimeApp 提供 Ant Design message / modal 等运行时能力
  -> BrowserRouter 提供前端路由上下文
  -> 渲染 <App />

apps/web/src/App.tsx
  -> 读取当前 location
  -> 渲染 <AppShell>
  -> 放入路由元数据、telemetry、ErrorBoundary、Suspense
  -> 用 <Routes> / <Route> 定义每个 path 对应的页面

apps/web/src/components/AppShell.tsx
  -> 渲染 header、导航、main、footer
  -> 把 App.tsx 传入的 children 放进 <main>

apps/web/src/pages/*
  -> 具体页面组件，例如 HomePage、CatalogPage、ProductDetailPage
```

所以可以按两条线理解：

| 线索 | 关注点 | 对应文件 |
| --- | --- | --- |
| 浏览器加载线 | HTML 入口、Vite 模块加载、React 挂载到 `#root` | `index.html`、`main.tsx` |
| React 组件线 | Provider 外层环境、路由入口、布局骨架、具体页面 | `AppProviders.tsx`、`App.tsx`、`AppShell.tsx`、`pages/` |

一句话记忆：**`index.html` 提供容器，`main.tsx` 把 React 挂进去，`AppProviders` 准备全局环境，`App` 决定路由，`AppShell` 放公共布局，`pages` 渲染具体页面。**

核心概念可以按这个顺序掌握：

| 概念 | 先理解什么 | 在本项目中看哪里 |
| --- | --- | --- |
| 浏览器入口 | 浏览器最先拿到的是 HTML，不是 React 组件 | `apps/web/index.html` |
| DOM 节点 | `<div id="root"></div>` 是真实页面里的容器 | `apps/web/index.html` |
| React 挂载 | `createRoot(...).render(...)` 让 React 接管某个 DOM 容器 | `apps/web/src/main.tsx` |
| 组件树 | 页面不是一整块字符串，而是由组件嵌套出来的树 | `AppProviders`、`App.tsx`、`pages/` |
| Vite dev server | 开发时帮浏览器找到源码、转换源码、处理热更新 | `npm.cmd run web:dev` |
| ES Module | `import` / `export` 让一个文件引用另一个文件 | `main.tsx` 的导入语句 |
| 模块图 | Vite 会从入口文件顺着每个 `import` 找到所有依赖 | 从 `main.tsx` 到组件、CSS、路由页面 |

一句话记忆：**Vite 负责把源码喂给浏览器，React 负责把组件变成界面，ES Module 负责把拆散的文件连接起来。**

### Vite、React 和 ES Module 的关系

React 是运行在浏览器里的 UI 库。你写的组件、props、state、事件处理，主要都属于 React 的学习范围。

Vite 是开发和构建工具。开发时它像一个本地服务器，浏览器请求 `/src/main.tsx` 时，Vite 会把 TypeScript、TSX、CSS import、第三方依赖等处理成浏览器能执行的模块。生产构建时，Vite 会调用底层打包能力，把模块整理成 `dist/` 里的静态文件。

ES Module 是 JavaScript 官方模块系统，也就是：

```ts
import React from "react";
import { AppProviders } from "./components/AppProviders";

export function Example() {
  return null;
}
```

它关心的是“文件和文件之间怎么引用”。浏览器原生支持 `<script type="module">`，Vite 正是利用这个入口，在开发时按需转换和发送模块。普通 `<script>` 不能直接使用这种模块导入方式。

初学时容易混淆的边界：

| 问题 | 归谁管 |
| --- | --- |
| 组件怎么写、状态怎么更新、点击后怎么重新渲染 | React |
| `import` / `export` 的语法和文件依赖关系 | ES Module |
| `.tsx` 怎么在浏览器运行、CSS import 怎么生效、保存后为什么自动刷新 | Vite |
| 最终页面插入到哪里 | `index.html` 的 `#root` + ReactDOM |

真正要背的不是工具名，而是这条边界：**React 不负责启动开发服务器，Vite 不负责决定组件状态，ES Module 不负责渲染页面。**

## CSS 学习点

`apps/web/src/styles/global.css` 覆盖全局设计变量和复杂产品视觉，Tailwind 负责局部布局、间距和响应式工具类。两者分工如下：

- `:root` 设计变量。
- sticky header 与响应式 nav。
- CSS grid 做 hero、产品卡片、详情页和预约页。
- `aspect-ratio` 固定图片卡片比例。
- `prefers-reduced-motion` 降低动画强度。
- 加载、错误、空状态的可复用样式。
- Tailwind 工具类用于新页面的小范围排版，例如 `LearnPage` 中的学习说明区。
- `tailwind.config.ts` 把 CSS 变量暴露为 `bg`、`surface`、`ink`、`muted`、`teal` 等主题色。

### CSS 变量

`apps/web/src/styles/global.css` 中的 `:root` 定义全局设计变量：

```css
:root {
  color-scheme: light;
  --bg: #f7f8fa;
  --surface: #ffffff;
  --ink: #151922;
  --muted: #5a6472;
  --line: #d9e0e3;
}
```

关键语法：

| 语法 | 作用 | 为什么使用 |
| --- | --- | --- |
| `:root` | 选择文档根节点 | 适合放全局主题变量 |
| `--bg` | 自定义属性，也叫 CSS 变量 | 让颜色、边框、阴影等设计 token 集中管理 |
| `var(--bg)` | 读取 CSS 变量 | 修改主题时不用逐个搜索硬编码颜色 |
| `color-scheme: light` | 告诉浏览器当前主题倾向 | 表单控件、滚动条等原生 UI 会更贴近主题 |

例如页面背景会使用变量：

```css
body {
  background: var(--bg);
  color: var(--ink);
}
```

这样后续做暗黑模式时，只要切换变量值，不需要重写每个组件。

### 类选择器和布局

项目大量使用类选择器，例如：

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

关键语法：

| 语法 | 作用 | 为什么使用 |
| --- | --- | --- |
| `.product-grid` | 选择 `class="product-grid"` 的元素 | 类名适合复用页面结构样式 |
| `display: grid` | 开启 CSS Grid 布局 | 产品卡片、详情页、表单这类二维布局更清晰 |
| `repeat(3, ...)` | 重复 3 列 | 比手写三次 `1fr` 更简洁 |
| `minmax(0, 1fr)` | 列最小为 0，最大均分剩余空间 | 避免内容太长把网格撑破 |

响应式时通过媒体查询改变列数：

```css
@media (max-width: 980px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
```

这表示桌面三列、平板两列、手机一列。项目把复杂响应式布局放在 `global.css` 中，是为了让产品页、详情页、预约页的结构更容易整体观察。

### 固定比例和图片裁切

产品卡片媒体区域使用：

```css
.product-card-media {
  aspect-ratio: 4 / 3;
  background: var(--surface-strong);
}

.product-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

`aspect-ratio` 固定卡片比例，避免图片加载前后页面跳动；`object-fit: cover` 让图片铺满容器，同时保持图片自身比例。

### 动画降级

项目支持用户系统的减少动态效果偏好：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

这里的 `*` 表示所有元素，`*::before` / `*::after` 表示伪元素。这样做是为了可访问性：如果用户系统设置了减少动画，页面就不要强迫用户观看大幅运动效果。

## 响应式断点

项目采用 Tailwind 默认断点，并额外增加 `xs: 420px`：

```text
xs  420px
sm  640px
md  768px
lg  1024px
xl  1280px
2xl 1536px
```

复杂布局仍可保留在 `global.css` 中，局部布局优先使用 Tailwind，例如 `grid gap-3 md:grid-cols-3`。

Tailwind 类名通常读作“属性缩写 + 值”：

| 类名 | 含义 |
| --- | --- |
| `grid` | `display: grid` |
| `gap-3` | 使用 Tailwind spacing scale 的间距 |
| `md:grid-cols-3` | 屏幕宽度达到 `md` 后使用三列 |
| `text-sm` | 小号字体 |
| `rounded-lg` | 较大的圆角 |

Tailwind 适合局部排版和快速组合；`global.css` 适合复杂、跨组件、需要稳定命名的产品布局。

## JavaScript / TypeScript 模块语法

项目使用 ES Module。常见写法来自 `apps/web/src/main.tsx`：

```ts
import React from "react";
import ReactDOM from "react-dom/client";

import { AppProviders } from "./components/AppProviders";
import "./i18n";
import "antd/dist/reset.css";
import "./styles/global.css";
```

关键语法：

| 语法 | 作用 | 为什么使用 |
| --- | --- | --- |
| `import React from "react"` | 默认导入 | React 包默认导出可直接命名 |
| `import { AppProviders } from ...` | 命名导入 | 明确只导入模块暴露的某个成员 |
| `import "./styles/global.css"` | 副作用导入 | 不拿返回值，只让 Vite 把 CSS 注入页面 |
| `export function HomePage()` | 命名导出 | 方便其他文件按名称导入，也利于重构 |
| `export type Product` | 只导出类型 | TypeScript 编译后会移除类型，不增加运行时代码 |

在 `packages/api-client/src/client.ts` 里可以看到类型导入：

```ts
import type { Product, Stats } from "./types";
```

`import type` 只用于类型检查，编译到 JavaScript 后不会存在。这样可以避免把纯类型依赖变成运行时依赖。

### 命名导出和默认导出

命名导出和默认导出都是 JavaScript 的 ES Module 语法，不是 React 或 TypeScript 独有的能力。它们的共同点是：都把一个文件里的变量、函数、组件或类型暴露给其他文件使用。差别主要在“导入时怎么写”和“一个文件能导出几个”。

命名导出写法如下：

```ts
export function AdminPage() {
  return <div>Admin</div>;
}
```

导入时必须使用花括号，并且名字要和导出的名字一致：

```ts
import { AdminPage } from "./pages/AdminPage";
```

一个模块可以有多个命名导出：

```ts
export function AdminPage() {}
export function LoginPage() {}
export const adminTitle = "Admin";
```

默认导出写法如下：

```ts
export default function AdminPage() {
  return <div>Admin</div>;
}
```

导入时不使用花括号，导入方可以自己命名：

```ts
import AdminPage from "./pages/AdminPage";
import AnyName from "./pages/AdminPage";
```

一个模块只能有一个默认导出。它通常表示“这个文件最主要导出的东西”。页面组件、主类、主函数这类单一主体适合使用默认导出；工具函数集合、类型集合、多个同级组件则更适合命名导出。

对比表：

| 导出方式 | 导出写法 | 导入写法 | 数量限制 | 适合场景 |
| --- | --- | --- | --- | --- |
| 命名导出 | `export function AdminPage() {}` | `import { AdminPage } from "./pages/AdminPage"` | 一个文件可以有多个 | 多个工具函数、类型、组件并列导出 |
| 默认导出 | `export default AdminPage` | `import AdminPage from "./pages/AdminPage"` | 一个文件只能有一个 | 一个文件只有一个主要组件或主函数 |

本项目页面通常使用命名导出，例如 `AdminPage.tsx` 中暴露 `AdminPage`。普通同步导入时可以直接写：

```ts
import { AdminPage } from "./pages/AdminPage";
```

但 `React.lazy` 的接口约定要求动态导入最终得到一个带 `default` 字段的对象：

```ts
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })),
);
```

这里的 `module` 是动态 `import()` 加载后的模块对象，`module.AdminPage` 表示读取命名导出的 `AdminPage`。`({ default: module.AdminPage })` 则是把命名导出手动包装成 `React.lazy` 期待的默认导出形状。它的含义不是“改掉源文件的导出方式”，而是“在懒加载这一处，把 `AdminPage` 当作默认组件交给 React”。

如果源文件本身改成默认导出：

```ts
export default function AdminPage() {
  return <div>Admin</div>;
}
```

那么懒加载可以简化为：

```ts
const AdminPage = lazy(() => import("./pages/AdminPage"));
```

一句话记忆：**命名导出是按名字拿东西，默认导出是拿这个文件的主东西；`React.lazy` 只认最终对象里的 `default`。**

## JavaScript 常用语法

### `const`、`let` 和不可变思路

项目中优先使用 `const`：

```ts
const productsQuery = useProducts();
const products = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
```

`const` 表示变量绑定不会被重新赋值。它不能保证对象内容永远不变，但能减少“这个变量后来被改过吗”的心智负担。需要重新赋值时才用 `let`。

### 函数和返回值

普通函数例子来自 `packages/api-client/src/client.ts`：

```ts
function normalizeBaseUrl(baseUrl: string) {
  const normalized = baseUrl.trim().replace(/\/$/, "");
  if (!normalized) {
    throw new Error("A non-empty API base URL is required.");
  }
  return normalized;
}
```

这里用到：

| 语法 | 作用 |
| --- | --- |
| `baseUrl: string` | 参数必须是字符串 |
| `.trim()` | 去掉首尾空白 |
| `.replace(/\/$/, "")` | 用正则移除末尾 `/` |
| `if (!normalized)` | 如果为空字符串就进入分支 |
| `throw new Error(...)` | 主动抛错，阻止错误配置继续运行 |
| `return normalized` | 返回处理后的地址 |

为什么要移除末尾 `/`？因为请求地址是这样拼的：

```ts
`${normalizedBaseUrl}${path}`
```

如果基础地址保留末尾 `/`，而 `path` 又是 `/api/products`，就会得到 `//api/products`。

### `async` / `await` 和 Promise

API client 中请求后端使用异步函数：

```ts
async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await (fetchFn ?? fetch)(`${normalizedBaseUrl}${path}`, init);
  return (await response.json()) as T;
}
```

关键点：

| 语法 | 作用 |
| --- | --- |
| `async function` | 函数内部可以使用 `await`，返回值自动包成 Promise |
| `await fetch(...)` | 等 HTTP 请求完成 |
| `Promise<T>` | 表示这个异步函数最终会得到 `T` 类型的数据 |
| `init?: RequestInit` | `init` 是可选参数 |
| `fetchFn ?? fetch` | 如果传入自定义 `fetchFn` 就用它，否则用浏览器原生 `fetch` |

测试里可以传 `fetchFn`，避免真的访问网络；生产运行时则使用浏览器的 `fetch`。

### 展开语法和可选链

请求头合并使用了对象展开：

```ts
headers: {
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  "Content-Type": "application/json",
  ...init?.headers,
},
```

这里的意思是：

- 如果有 token，就加入 `Authorization` 请求头。
- 永远加入 JSON 请求头。
- 如果调用方额外传了 `init.headers`，再合并进来。

`init?.headers` 是可选链。`init` 可能是 `undefined`，直接写 `init.headers` 会报错；写成 `init?.headers` 表示“有 init 时读取 headers，没有就返回 undefined”。

### 模板字符串

项目里经常用反引号拼字符串：

```ts
`/api/products/${productId}`
```

`${productId}` 会把变量插入字符串。相比字符串相加，模板字符串对 URL、className、提示文案更直观。

## TypeScript 学习点

`packages/api-client/src/types.ts` 定义产品、统计、认证和预约提交类型。前端请求和组件都依赖这些类型，能在构建前发现字段拼写错误。

### `type` 定义对象形状

```ts
export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  features: string[];
  specs: Record<string, string>;
};
```

关键语法：

| 语法 | 作用 |
| --- | --- |
| `type Product = ...` | 给一组类型规则起名字 |
| `id: string` | `id` 字段必须是字符串 |
| `price: number` | `price` 字段必须是数字 |
| `features: string[]` | `features` 是字符串数组 |
| `Record<string, string>` | 对象的 key 和 value 都是字符串 |

组件里写 `product: Product` 后，TypeScript 会提醒你不能把 `product.price` 当字符串用，也不能访问不存在的字段。

### 联合类型

```ts
export type UserRole = "admin" | "viewer";
```

这表示角色只能是 `"admin"` 或 `"viewer"`。比普通 `string` 更安全，因为 `"superuser"` 这类未定义角色会在类型检查阶段暴露出来。

### 可选字段和 null

```ts
export type LeadPayload = {
  product_id?: string;
  company?: string;
  configuration: Record<string, unknown>;
};

export type LeadResponse = {
  company: string | null;
  product_id: string | null;
};
```

`?` 表示提交时可以不传这个字段；`string | null` 表示后端响应里字段一定存在，但值可能是 `null`。这两者语义不同：

- `company?: string`：对象里可以没有 `company`。
- `company: string | null`：对象里有 `company`，但可能为空值。

### `unknown` 比 `any` 更安全

```ts
configuration: Record<string, unknown>;
```

`unknown` 表示“现在还不知道具体类型”。它比 `any` 更安全，因为你不能随便对 `unknown` 调用方法，必须先判断或解析。预约配置是动态对象，所以这里不强行写死所有字段。

### `as const` 和从数据推导类型

`apps/web/src/store/configuratorStore.ts` 中有：

```ts
export const finishOptions = [
  { id: "graphite", label: "Graphite", color: "#252a32", price: 0 },
  { id: "pearl", label: "Pearl", color: "#f2f3ef", price: 20 },
  { id: "cobalt", label: "Cobalt", color: "#525ddc", price: 34 },
] as const;

export type FinishId = (typeof finishOptions)[number]["id"];
```

这里非常适合学习 TypeScript：

| 语法 | 作用 |
| --- | --- |
| `as const` | 把数组和对象里的值收窄成字面量类型 |
| `typeof finishOptions` | 在类型层面读取变量的类型 |
| `[number]` | 取得数组中任意一项的类型 |
| `["id"]` | 取得每一项的 `id` 字段类型 |

最终 `FinishId` 会变成：

```ts
type FinishId = "graphite" | "pearl" | "cobalt";
```

这样 `setFinish("red")` 会直接类型报错。好处是选项数据和类型来自同一份数组，不容易忘记同步。

### 泛型

`priceFor` 使用了泛型：

```ts
function priceFor<T extends { id: string; price: number }>(items: readonly T[], id: string) {
  return items.find((item) => item.id === id)?.price ?? 0;
}
```

`T extends { id: string; price: number }` 表示：传进来的数组元素可以有更多字段，但至少必须有 `id` 和 `price`。这样 `finishOptions`、`standOptions`、`planOptions` 都可以共用这个函数。

`?.price ?? 0` 的意思是：如果找到了选项就取价格，如果没找到就用 `0` 兜底。

### class 和自定义错误

```ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

关键语法：

| 语法 | 作用 |
| --- | --- |
| `class ApiError extends Error` | 创建一个继承原生 Error 的错误类型 |
| `constructor(...)` | 创建对象时执行的初始化函数 |
| `public status: number` | TypeScript 参数属性，自动创建 `this.status` |
| `super(message)` | 调用父类 Error 的构造函数 |
| `this.name = "ApiError"` | 让错误名称更清晰 |

这样 UI 层可以区分普通错误和带 HTTP 状态码的 API 错误。

### Zod 契约解析

`packages/api-client/src/contracts.ts` 中用 Zod 描述后端响应：

```ts
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  features: z.array(z.string()),
});
```

TypeScript 只能在编译时检查本地代码；后端真实返回的数据要到运行时才知道。Zod 的作用是运行时解析：

```ts
ProductSchema.parse(await apiRequest<unknown>("/api/products/id"))
```

这里先把远端响应当作 `unknown`，再交给 schema 验证。如果后端字段类型变错，前端会得到明确的解析错误，而不是在页面深处随机崩掉。

## React / TSX 学习点

React 组件使用 TSX。TSX 看起来像 HTML，但本质是 JavaScript 表达式。

### 组件和 props

`apps/web/src/components/ProductCard.tsx` 中：

```tsx
type ProductCardProps = {
  onIntent?: (productId: string) => void;
  product: Product;
};

export function ProductCard({ onIntent, product }: ProductCardProps) {
  const handleIntent = () => onIntent?.(product.id);

  return (
    <Link className="product-card" to={`/products/${product.id}`} onFocus={handleIntent}>
      <h3>{product.name}</h3>
      <p>{product.tagline}</p>
    </Link>
  );
}
```

关键语法：

| 语法 | 作用 |
| --- | --- |
| `ProductCardProps` | 定义组件接收哪些 props |
| `{ onIntent, product }` | 参数解构，直接取出 props 字段 |
| `onIntent?: (...) => void` | 可选回调函数 |
| `onIntent?.(product.id)` | 如果传了回调就调用，没传就跳过 |
| `className` | TSX 里写 CSS class 要用 `className` |
| `{product.name}` | 在 JSX 中插入 JavaScript 表达式 |
| ``to={`/products/${product.id}`}`` | 用模板字符串生成路由地址 |

为什么 `img` 的 `alt` 有时是空字符串？在 `ProductCard` 中图片是装饰性缩略图，卡片文字已经表达了产品名称；空 `alt` 可以避免读屏器重复朗读。

### 条件渲染

`apps/web/src/pages/HomePage.tsx` 中：

```tsx
{productsQuery.isLoading && (
  <LoadingState title="Loading catalog" message="Checking the local API." />
)}

{productsQuery.isError && (
  <ErrorState
    title="Using local fallback data"
    message="Start the backend on port 8001 to switch this section to SQLite-backed data."
  />
)}
```

`condition && <Component />` 是 React 常见写法：条件为真时渲染组件，条件为假时什么也不渲染。

产品列表使用三元表达式：

```tsx
{productsQuery.isLoading && !productsQuery.data ? (
  <ProductGridSkeleton label="Loading featured products" />
) : (
  <div className="product-grid">
    {products.slice(0, 3).map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}
```

关键点：

- `? :` 适合二选一渲染。
- `.map(...)` 把数组转换成组件数组。
- `key={product.id}` 帮助 React 稳定追踪每个列表项。

### 事件处理

配置器里的按钮：

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

关键语法：

| 语法 | 作用 |
| --- | --- |
| `onClick={() => ...}` | 点击时执行函数 |
| `type="button"` | 避免按钮在表单中默认提交 |
| `aria-pressed` | 告诉辅助技术这是可切换状态 |
| 条件 className | 根据状态追加 `is-selected` |
| `option.id as FinishId` | 告诉 TS 这里的 id 属于合法选项 |

项目优先用原生 `button`，因为它天然支持键盘聚焦、Enter/Space 触发和禁用状态。

### Hook

配置器中有 React hook：

```ts
const [priorityStatus, setPriorityStatus] = useState("Configuration priority ready.");

const priorityValues = useMemo(
  () => ({
    engraving: engraving ? "Included" : "Standard",
    finish: finishOptions.find((option) => option.id === finish)?.label ?? finish,
  }),
  [engraving, finish],
);
```

`useState` 保存组件内部状态；`useMemo` 缓存计算结果，依赖数组变化时才重新计算。这里的 `priorityValues` 会随着配置选择变化更新，但不会在无关渲染中重复做查找。

### 路由和懒加载

`apps/web/src/App.tsx` 中：

```tsx
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
```

`lazy` + 动态 `import()` 会把页面拆成单独 chunk。用户没访问某个页面时，不必一开始就下载它。

```tsx
<Suspense fallback={<RouteSkeleton />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products/:productId" element={<ProductDetailPage />} />
  </Routes>
</Suspense>
```

`Suspense` 在懒加载页面还没下载完时显示骨架屏；`/products/:productId` 中的 `:productId` 是动态路由参数。

## API 请求和数据缓存

`apps/web/src/api/products.ts` 把 API client 包成 React Query hook：

```ts
export const productQueryKeys = {
  detail: (productId: string) => ["products", productId] as const,
  list: () => ["products"] as const,
  stats: () => ["stats"] as const,
};

export function useProducts() {
  return useQuery({
    queryFn: getProducts,
    queryKey: productQueryKeys.list(),
  });
}
```

为什么这样写：

- `queryKey` 是缓存 key，同一个 key 会复用缓存。
- `as const` 让 key 变成只读元组，类型更精确。
- `queryFn` 单独写成 `getProducts`，组件不用知道底层请求细节。
- 页面只关心 `data`、`isLoading`、`isError` 等状态。

## 可访问性相关语法

项目中经常出现 `aria-*`：

```tsx
<button aria-label={`Move ${label} earlier`} disabled={isFirst}>
  <ArrowUp size={15} aria-hidden="true" />
</button>

<span className="visually-hidden" aria-live="polite">
  {priorityStatus}
</span>
```

含义：

| 语法 | 作用 |
| --- | --- |
| `aria-label` | 给只有图标的按钮提供可读名称 |
| `aria-hidden="true"` | 告诉辅助技术忽略装饰性图标 |
| `aria-live="polite"` | 内容变化时温和播报，不打断当前朗读 |
| `disabled` | 禁用按钮，同时让键盘和读屏器知道它不可操作 |

这类语法不改变视觉效果，但会显著影响键盘用户和读屏器用户的体验。

## 关键字速查

| 关键字 / 语法 | 所属 | 简单解释 | 项目例子 |
| --- | --- | --- | --- |
| `import` | JS/TS | 导入模块 | `import { useProducts } from "../api/products"` |
| `export` | JS/TS | 导出变量、函数或类型 | `export function ProductCard(...)` |
| `type` | TS | 定义类型别名 | `type ProductCardProps = ...` |
| `as const` | TS | 收窄为字面量只读类型 | `finishOptions` |
| `extends` | TS/JS | 继承或泛型约束 | `ApiError extends Error` |
| `async` | JS | 声明异步函数 | `async function apiRequest<T>` |
| `await` | JS | 等待 Promise 完成 | `await response.json()` |
| `throw` | JS | 抛出错误 | `throw new ApiError(...)` |
| `return` | JS | 返回函数结果 | `return normalized` |
| `const` | JS | 声明不重新赋值的变量 | `const productsQuery = useProducts()` |
| `?.` | JS/TS | 可选链 | `init?.headers` |
| `??` | JS/TS | 空值合并 | `price ?? 0` |
| `...` | JS/TS | 展开对象或数组 | `{ ...init?.headers }` |
| `map` | JS | 把数组转换成新数组 | `products.map(...)` |
| `className` | TSX | 设置 CSS class | `<Link className="product-card">` |
| `aria-*` | HTML/TSX | 辅助技术语义 | `aria-label`, `aria-live` |

练习建议：

1. 先完成 `apps/web/src/exercises/js-ts/` 里的小练习，按该目录 `README.md` 的命令逐个运行 `.check.ts` 文件。
2. 给 `Product` 增加一个 `availability` 字段。
3. 在后端 schema、seed、前端卡片中同步使用它。
4. 运行 `npm.cmd run web:typecheck`。
5. 尝试给 `ProductCard` 增加一个 `aria-label`，观察 Testing Library 或 Playwright 是否更容易定位元素。
6. 在 `global.css` 新增一个 CSS 变量，并在一个组件样式中用 `var(...)` 引用它。
