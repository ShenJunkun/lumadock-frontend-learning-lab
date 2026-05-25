# 16 AppShell 逐段阅读指南

这篇文档专门用来读懂 `apps/web/src/components/AppShell.tsx`。重点回答几个初学时最容易混在一起的问题：

- `<header>`、`<nav>`、`<span>` 这些标签是谁提供的？
- `<NavLink>`、`<RouteFocus>`、`<Layers3>` 这些又是谁提供的？
- `isAuthenticated` 是什么，为什么它能控制“登录 / 退出 / 后台”显示？
- `navItems.map(...)` 是不是 `for` 循环？
- 当前文件哪里用了 Ant Design，哪里没有用？

## 先记一个判断规则

在 JSX 里，先看标签名首字母：

| 写法           | 通常代表                                             | 当前文件例子                                                          |
| -------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| 小写开头       | HTML / SVG 原生标签，最后会变成浏览器 DOM 元素       | `<div>`, `<a>`, `<header>`, `<nav>`, `<span>`, `<button>`, `<select>` |
| 大写开头       | React 组件，可能来自第三方库，也可能来自项目本地文件 | `<NavLink>`, `<RouteFocus>`, `<Layers3>`, `<Icon>`                    |
| 函数或对象调用 | 普通 JavaScript / TypeScript API，不是标签           | `message.success(...)`, `navigate("/")`, `logout()`                   |

所以 `AppShell.tsx` 不是“全部由 React 提供”。更准确地说：

- React 让我们用 JSX 写 UI。
- 小写标签来自 HTML 标准，由浏览器认识。
- 大写组件来自 React 生态库或项目本地代码。
- 样式来自 `className` 对应的 CSS。

## `span` 和 `Spin` 不一样

当前 `AppShell.tsx` 里出现的是 `<span>`，不是 `<spin>`，也不是 `<Spin>`。

| 名称     | 是否在当前 AppShell 使用 | 来源               | 作用                                                              |
| -------- | ------------------------ | ------------------ | ----------------------------------------------------------------- |
| `<span>` | 是                       | HTML 原生标签      | 行内文本容器，常用来包一小段文字或图标旁边的文字                  |
| `<spin>` | 否                       | 不是标准 HTML 标签 | 如果真的写小写 `<spin>`，浏览器会把它当未知自定义标签，不适合这里 |
| `<Spin>` | 否                       | Ant Design 组件    | 加载中组件，例如页面或卡片正在请求数据时显示转圈                  |

一句话记：小写 `<span>` 是 HTML；大写 `<Spin>` 才可能是 Ant Design 的 React 组件。

## 文件导入区在说什么

`AppShell.tsx` 顶部的 `import` 很像“来源清单”：

```tsx
import {
  CalendarDays,
  GraduationCap,
  Home,
  Layers3,
  LogIn,
  LogOut,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { message } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
```

可以这样读：

| 名称                                       | 来源               | 类型                    | 在 AppShell 里的作用                            |
| ------------------------------------------ | ------------------ | ----------------------- | ----------------------------------------------- |
| `Home`, `PackageSearch`, `CalendarDays` 等 | `lucide-react`     | 图标 React 组件         | 导航项左侧的小图标                              |
| `message`                                  | `antd`             | Ant Design 全局提示 API | 退出登录后弹出 `Logged out.`                    |
| `ReactNode`                                | `react`            | TypeScript 类型         | 说明 `children` 可以是任意 React 可渲染内容     |
| `useTranslation`                           | `react-i18next`    | Hook                    | 拿到翻译函数 `t(...)`                           |
| `NavLink`                                  | `react-router-dom` | 路由链接组件            | 点击后切换前端页面，并能知道当前链接是否 active |
| `useNavigate`                              | `react-router-dom` | Hook                    | 在代码里主动跳转，比如退出后回首页              |

后面的本地导入：

```tsx
import { useAuthStore } from "../store/authStore";
import { RouteFocus } from "./RouteFocus";
import {
  languageOptions,
  themeModeOptions,
  usePreferencesStore,
  type LanguageId,
  type ThemeMode,
} from "../store/preferencesStore";
```

| 名称                      | 来源                   | 作用                                   |
| ------------------------- | ---------------------- | -------------------------------------- |
| `useAuthStore`            | 项目本地 Zustand store | 读取登录态，执行退出登录               |
| `RouteFocus`              | 项目本地组件           | 路由变化后处理焦点，改善键盘和读屏体验 |
| `languageOptions`         | 项目本地偏好配置       | 语言下拉框选项                         |
| `themeModeOptions`        | 项目本地偏好配置       | 主题下拉框选项                         |
| `usePreferencesStore`     | 项目本地 Zustand store | 读取和更新语言、主题                   |
| `LanguageId`, `ThemeMode` | TypeScript 类型        | 告诉 TS 下拉框值只能是合法语言或主题   |

## `children` 是什么

```tsx
type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  // ...
}
```

`AppShell` 是一个“外壳组件”。它自己画顶部导航、页脚和页面骨架，中间的页面内容由父组件传进来。

在 `App.tsx` 里，它的使用方式是：

```tsx
<AppShell>
  <RouteMetadataManager />
  <RouteTelemetryRecorder />
  <ErrorBoundary>
    <Suspense>
      <Routes>{/* 不同路由页面 */}</Routes>
    </Suspense>
  </ErrorBoundary>
</AppShell>
```

夹在 `<AppShell>...</AppShell>` 中间的所有内容，会变成 `AppShell` 的 `children`。所以 `AppShell` 里面这段：

```tsx
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

意思是：把当前页面内容放进 `<main>` 主内容区域。

## `navItems` 是导航配置表

```tsx
const navItems = [
  { to: "/", labelKey: "shell.home", icon: Home, end: true },
  { to: "/products", labelKey: "shell.products", icon: PackageSearch },
  { to: "/book", labelKey: "shell.book", icon: CalendarDays },
  { to: "/learn", labelKey: "shell.learn", icon: GraduationCap },
];
```

它不是 JSX，也不是按钮。它只是一个数组，每一项描述一个导航入口：

| 字段       | 意思                           | 例子                      |
| ---------- | ------------------------------ | ------------------------- |
| `to`       | 点击后去哪个 URL path          | `"/products"`             |
| `labelKey` | 去 `resources.ts` 查翻译的 key | `"shell.products"`        |
| `icon`     | 使用哪个 lucide 图标组件       | `PackageSearch`           |
| `end`      | React Router 的精确匹配开关    | 首页 `/` 需要 `end: true` |

这样写的好处是：导航项数据集中在一起。如果以后要加一个 `/about`，只需要往数组里加一项，而不是复制一整段 `<NavLink>`。

## `navItems.map(...)` 是列表渲染

```tsx
{
  navItems.map((item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
      >
        <Icon size={17} aria-hidden="true" />
        <span>{t(item.labelKey)}</span>
      </NavLink>
    );
  });
}
```

`.map()` 不是传统 `for` 循环，但它承担了“把数组逐项处理”的工作。这里可以按这个过程理解：

```text
navItems 第 1 项 首页
  -> 生成一个 <NavLink to="/">

navItems 第 2 项 产品目录
  -> 生成一个 <NavLink to="/products">

navItems 第 3 项 预约
  -> 生成一个 <NavLink to="/book">

navItems 第 4 项 学习章节
  -> 生成一个 <NavLink to="/learn">
```

React 可以渲染数组，所以 `.map(...)` 返回的一组 `<NavLink>` 会显示成一排导航入口。

### 为什么要写 `const Icon = item.icon`

`item.icon` 里存的是组件，比如 `Home` 或 `PackageSearch`。React 组件在 JSX 里必须用大写开头，所以这里先把它放进大写变量 `Icon`：

```tsx
const Icon = item.icon;
```

然后就能写：

```tsx
<Icon size={17} aria-hidden="true" />
```

如果写成 `<item.icon />`，JSX 语法不会按你期望的方式工作。

### 为什么要写 `key={item.to}`

React 渲染列表时需要 `key` 来稳定识别每一项。这里每个 `to` 都是唯一路径，所以适合当 key。

不要随手用数组下标当 key，特别是列表以后可能新增、删除或排序时，容易造成 UI 状态错位。

## `<NavLink>` 是谁提供的

`<NavLink>` 来自 `react-router-dom`：

```tsx
import { NavLink, useNavigate } from "react-router-dom";
```

它不是 HTML 原生标签，也不是 React 内置标签。它是 React Router 提供的 React 组件。

`NavLink` 和普通 `<a>` 的区别：

| 写法                       | 适合什么                         | 当前项目用法                            |
| -------------------------- | -------------------------------- | --------------------------------------- |
| `<a href="/products">`     | 跳到普通网页、外部链接、下载链接 | skip link 用 `<a href="#main-content">` |
| `<NavLink to="/products">` | 单页应用内部路由跳转             | 顶部导航                                |

`NavLink` 的优势是它知道当前路由是否匹配自己。这里：

```tsx
className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
```

意思是：

- 当前页面就是这个链接对应的页面：class 变成 `"nav-link is-active"`。
- 当前页面不是这个链接：class 只是 `"nav-link"`。

CSS 会根据 `.is-active` 显示高亮状态。

## `<header>`、`<nav>`、`<main>`、`<footer>` 是 HTML 语义标签

这些不是 React Router，也不是 Ant Design。它们是 HTML 标准标签：

| 标签       | 来源 | 当前作用                              |
| ---------- | ---- | ------------------------------------- |
| `<div>`    | HTML | 普通容器                              |
| `<a>`      | HTML | 跳转链接；这里的 skip link 跳到主内容 |
| `<header>` | HTML | 页面头部区域                          |
| `<nav>`    | HTML | 导航区域                              |
| `<main>`   | HTML | 页面主要内容区域                      |
| `<footer>` | HTML | 页脚区域                              |
| `<span>`   | HTML | 行内文本容器                          |
| `<button>` | HTML | 可点击按钮                            |
| `<label>`  | HTML | 表单控件说明                          |
| `<select>` | HTML | 下拉选择框                            |
| `<option>` | HTML | 下拉框选项                            |

React 中写这些标签时，其实是在 JSX 里描述 DOM。最后浏览器里仍然会变成真正的 HTML 元素。

## `isAuthenticated` 是从哪里来的

```tsx
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const logout = useAuthStore((state) => state.logout);
```

`useAuthStore` 是项目用 Zustand 创建的认证状态 store。它的源文件是 `apps/web/src/store/authStore.ts`。

里面维护了这些状态：

| 字段              | 意思                                |
| ----------------- | ----------------------------------- |
| `token`           | 当前登录 token，没有登录时是 `null` |
| `user`            | 当前用户信息，没有登录时是 `null`   |
| `isAuthenticated` | 是否已经登录                        |
| `setSession(...)` | 登录成功后保存 token 和用户信息     |
| `logout()`        | 退出登录，清理本地存储和状态        |

这句：

```tsx
useAuthStore((state) => state.isAuthenticated);
```

可以理解成：从全局登录状态里只订阅 `isAuthenticated` 这一小块。它变化时，`AppShell` 会重新渲染。

## `isAuthenticated && (...)` 是条件渲染

```tsx
{
  isAuthenticated && (
    <NavLink to="/admin">
      <ShieldCheck size={17} aria-hidden="true" />
      <span>{t("shell.admin")}</span>
    </NavLink>
  );
}
```

这个写法的意思是：

- `isAuthenticated` 为 `true`：显示后台入口。
- `isAuthenticated` 为 `false`：不显示任何东西。

它是 React 里常见的条件渲染写法。

## 三元表达式控制登录 / 退出

```tsx
{
  !isAuthenticated ? (
    <NavLink to="/login">
      <LogIn size={17} aria-hidden="true" />
      <span>{t("shell.login")}</span>
    </NavLink>
  ) : (
    <button
      className="nav-link nav-button"
      type="button"
      onClick={handleLogout}
    >
      <LogOut size={17} aria-hidden="true" />
      <span>{t("shell.logout")}</span>
    </button>
  );
}
```

这是 JavaScript 的三元表达式：

```text
条件 ? 条件为 true 时显示 : 条件为 false 时显示
```

放到当前代码里就是：

```text
如果没有登录
  -> 显示登录链接
否则
  -> 显示退出按钮
```

为什么“登录”用 `<NavLink>`，“退出”用 `<button>`？

| 操作 | 使用元素                          | 原因                                           |
| ---- | --------------------------------- | ---------------------------------------------- |
| 登录 | `<NavLink to="/login">`           | 它的本质是去登录页                             |
| 退出 | `<button onClick={handleLogout}>` | 它的本质是执行动作：清理登录态、弹提示、跳首页 |

## `handleLogout` 做了什么

```tsx
const handleLogout = () => {
  logout();
  void message.success("Logged out.");
  navigate("/");
};
```

按执行顺序看：

1. `logout()`：调用 Zustand action，清理登录状态。
2. `message.success("Logged out.")`：调用 Ant Design 的全局提示。
3. `navigate("/")`：调用 React Router 的编程式跳转，回到首页。

这里的 `void` 主要是告诉 TypeScript / ESLint：这个异步提示调用的返回值我不需要等待。

## `useTranslation` 和 `t(...)`

```tsx
const { t } = useTranslation();
```

`useTranslation` 来自 `react-i18next`。它给组件一个 `t` 函数，用来根据当前语言查文案。

例如：

```tsx
<span>{t("shell.logout")}</span>
```

会去 `apps/web/src/i18n/resources.ts` 找：

```ts
shell: {
  logout: "Logout",
}
```

或中文：

```ts
shell: {
  logout: "退出",
}
```

所以 `AppShell` 不直接写死所有导航文字，而是写翻译 key。

## 语言和主题下拉框

语言选择：

```tsx
<select
  className="preference-select"
  aria-label={t("shell.language")}
  value={language}
  onChange={(event) => setLanguage(event.target.value as LanguageId)}
>
  {languageOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.label}
    </option>
  ))}
</select>
```

主题选择：

```tsx
<select
  className="preference-select"
  aria-label={t("shell.theme")}
  value={themeMode}
  onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
>
  {themeModeOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {t(option.labelKey)}
    </option>
  ))}
</select>
```

这里用的是 HTML 原生 `<select>` 和 `<option>`，不是 Ant Design 的 `<Select>`。

这种写法叫“受控组件”：

- `value={language}`：当前值由 React/Zustand 状态控制。
- `onChange={...}`：用户选择新值时，写回 Zustand。
- Zustand 更新后，组件重新渲染，下拉框显示新值。

## 为什么这里没有用 Ant Design 的 Button / Select

当前文件只从 Ant Design 引入了：

```tsx
import { message } from "antd";
```

也就是说，`AppShell` 里没有使用 `<Button>`、`<Select>`、`<Spin>`。

可能的取舍是：

| 场景            | 当前选择                     | 原因                                       |
| --------------- | ---------------------------- | ------------------------------------------ |
| 顶部导航链接    | `NavLink` + 自定义 CSS       | 需要和 React Router 的 active 状态紧密结合 |
| 退出登录        | 原生 `<button>` + 自定义 CSS | 行为简单，需要和导航链接视觉统一           |
| 语言 / 主题选择 | 原生 `<select>`              | 选项少，语义清晰，移动端和键盘行为天然可用 |
| 退出提示        | Ant Design `message`         | 全局短反馈适合交给成熟组件库               |

Ant Design 在项目里不是不用，而是用在更复杂的地方：登录表单、后台表格、弹窗、结果页、骨架屏、全局通知等。`AppShell` 的顶部导航更像品牌和布局区域，保留自定义 CSS 更灵活。

## `aria-*` 和无障碍相关属性

`AppShell` 里有一些看起来不太像普通 HTML 的属性：

| 写法                               | 作用                                         |
| ---------------------------------- | -------------------------------------------- |
| `aria-label="Primary"`             | 给导航区域一个读屏器可读的名字               |
| `aria-label={t("shell.language")}` | 给没有可见文字的下拉框提供说明               |
| `aria-hidden="true"`               | 图标只是装饰，不让读屏器重复读               |
| `className="visually-hidden"`      | 视觉上隐藏，但保留给读屏器                   |
| `tabIndex={-1}`                    | 让主内容区域可以被程序聚焦，配合跳转焦点管理 |

这些不是某个库专有，而是 Web 无障碍和 DOM 属性的一部分。React 允许你在 JSX 中写它们。

## AppShell 的渲染结构

可以把最终结构简化成这样：

```text
<div class="app-shell">
  <a class="skip-link">Skip to content</a>
  <RouteFocus />

  <header class="site-header">
    <NavLink class="brand">LumaDock</NavLink>

    <nav class="site-nav">
      navItems 生成的导航链接
      如果已登录，显示后台入口
      如果未登录，显示登录链接
      如果已登录，显示退出按钮
      语言下拉框
      主题下拉框
    </nav>
  </header>

  <main id="main-content">
    当前路由页面内容 children
  </main>

  <footer class="site-footer">
    页脚文字
  </footer>
</div>
```

## 读这个文件的推荐顺序

1. 先看 `import`，确认每个名字来自哪里。
2. 看 `navItems`，理解导航数据结构。
3. 看 `AppShell` 函数开头的 hooks，确认组件读了哪些状态。
4. 看 `handleLogout`，理解退出事件。
5. 看 `return (...)`，从外到内读布局。
6. 看到 `{...}` 时停一下，因为这是 JSX 里嵌入 JavaScript。
7. 看到 `.map(...)` 时，把它理解成“数组生成一组 JSX”。
8. 看到 `&&` 或 `? :` 时，把它理解成“根据条件决定显示什么”。

## 相关中英文学习文档

下面优先列官方文档。个别库没有官方中文文档时，会标明“中文辅助”，学习时以英文官方为准。

### HTML / DOM 标签

| 主题          | 中文                                                                                                 | 英文                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| HTML 元素总表 | [MDN HTML 元素参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)                       | [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)       |
| `<nav>`       | [MDN `<nav>` 中文](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/nav)         | [MDN `<nav>` English](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav)           |
| HTML 表单     | [MDN HTML 表单中文](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms) | [MDN HTML forms English](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms) |
| 无障碍基础    | [MDN 无障碍中文](https://developer.mozilla.org/zh-CN/docs/Learn/Accessibility)                       | [MDN Accessibility English](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)                 |

### React / JSX

| 主题              | 中文                                                                                | 英文                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| JSX               | [使用 JSX 书写标签语言](https://zh-hans.react.dev/learn/writing-markup-with-jsx)    | [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)                 |
| 组件和 props      | [将 Props 传递给组件](https://zh-hans.react.dev/learn/passing-props-to-a-component) | [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)       |
| 条件渲染          | [条件渲染](https://zh-hans.react.dev/learn/conditional-rendering)                   | [Conditional Rendering](https://react.dev/learn/conditional-rendering)                     |
| 列表渲染和 key    | [渲染列表](https://zh-hans.react.dev/learn/rendering-lists)                         | [Rendering Lists](https://react.dev/learn/rendering-lists)                                 |
| 常见 DOM 组件属性 | 暂无完整中文对应页，可先看英文                                                      | [Common components, e.g. `<div>`](https://react.dev/reference/react-dom/components/common) |

### React Router

| 主题          | 中文                                                                    | 英文                                                                            |
| ------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 导航概念      | [React Router 中文文档，辅助阅读](https://www.reactrouter.cn/docs/api/) | [React Router Navigating](https://reactrouter.com/start/declarative/navigating) |
| `NavLink`     | [React Router 中文文档，辅助阅读](https://www.reactrouter.cn/docs/api/) | [React Router NavLink](https://reactrouter.com/api/components/NavLink/)         |
| `useNavigate` | [React Router 中文文档，辅助阅读](https://www.reactrouter.cn/docs/api/) | [React Router useNavigate](https://reactrouter.com/api/hooks/useNavigate)       |

注意：本项目使用 `react-router-dom@^7.0.0`。React Router 中文资料很多停留在 v6，适合辅助理解概念；具体 API 细节建议以英文官方文档为准。

### Ant Design

| 主题                      | 中文                                                                                | 英文                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `message` 全局提示        | [Ant Design Message 中文](https://ant.design/components/message-cn/)                | [Ant Design Message English](https://ant.design/components/message/)                |
| `Button` 按钮             | [Ant Design Button 中文](https://ant.design/components/button-cn/)                  | [Ant Design Button English](https://ant.design/components/button/)                  |
| `Select` 选择器           | [Ant Design Select 中文](https://ant.design/components/select-cn/)                  | [Ant Design Select English](https://ant.design/components/select/)                  |
| `Spin` 加载中             | [Ant Design Spin 中文](https://ant.design/components/spin-cn/)                      | [Ant Design Spin English](https://ant.design/components/spin/)                      |
| `ConfigProvider` 全局配置 | [Ant Design ConfigProvider 中文](https://ant.design/components/config-provider-cn/) | [Ant Design ConfigProvider English](https://ant.design/components/config-provider/) |

### i18n / 状态 / 图标

| 主题                           | 中文                                                                           | 英文                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `react-i18next useTranslation` | 暂无官方中文页，建议结合项目代码学习                                           | [react-i18next useTranslation](https://react.i18next.com/latest/usetranslation-hook) |
| `i18next` API                  | 暂无官方中文页，建议结合项目代码学习                                           | [i18next API](https://www.i18next.com/overview/api)                                  |
| Zustand                        | 暂无官方中文页，建议结合项目 `docs/04-state-api-forms.md` 学习                 | [Zustand Docs](https://zustand.docs.pmnd.rs/)                                        |
| Lucide React                   | [Lucide React 中文辅助](https://lucide.cndocs.org/guide/packages/lucide-react) | [Lucide React Guide](https://lucide.dev/guide/packages/lucide-react)                 |

## 对照当前项目再练一遍

建议按这个顺序在 IDE 里跳转：

1. `apps/web/src/components/AppShell.tsx`：读本文对应的主文件。
2. `apps/web/src/store/authStore.ts`：看 `isAuthenticated` 和 `logout()` 从哪里来。
3. `apps/web/src/store/preferencesStore.ts`：看语言、主题下拉框的选项和状态。
4. `apps/web/src/i18n/resources.ts`：看 `t("shell.xxx")` 对应的中英文文案。
5. `apps/web/src/components/AppProviders.tsx`：看语言和主题如何同步到 i18n、Ant Design 和 DOM。
6. `apps/web/src/App.tsx`：看 `AppShell` 如何包住所有路由页面。

读完后，可以做一个小练习：给 `navItems` 新增一个临时导航项，例如 `/learn` 旁边加 `/about`。你会发现只要数据结构对了，`.map(...)` 会自动帮你生成新的导航链接。
