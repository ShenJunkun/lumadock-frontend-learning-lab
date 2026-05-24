# 14 前端教程子类与双语学习资源清单

整理时间：2026-05-24

这份文档把前端学习拆成若干“教程子类”，并尽量为每一类都提供中文和英文资源。你可以先用中文资源建立概念，再用英文官方文档确认术语和细节，最后回到本项目里做练习。

## 标记说明

| 标记 | 含义 | 使用建议 |
| --- | --- | --- |
| `中文官方` | 官方维护或官方站点提供的中文内容 | 优先阅读，适合做主线 |
| `英文官方` | 官方英文文档 | 最权威，适合查细节和最新 API |
| `中文社区` | 社区整理、博客、题库或非官方翻译 | 适合辅助理解、面试表达和查漏补缺 |
| `英文社区` | 英文社区教程、题库或实战平台 | 适合拓展视野和练习 |
| `项目内` | 本仓库已有文档或代码 | 用来把外部知识落到真实代码里 |

注意：

- 如果中文和英文内容冲突，以英文官方文档或源码为准。
- 中文镜像和翻译站适合降低入门门槛，但学习库 API 时仍建议对照英文官方文档。
- 不需要一次性读完所有资源。每个类别先选 1 个中文资源和 1 个英文官方资源就够了。

## 0. 总路线与学习地图

| 标记 | 资源 | 链接 | 适合用途 |
| --- | --- | --- | --- |
| `中文官方` | MDN 学习 Web 开发 | https://developer.mozilla.org/zh-CN/docs/Learn_web_development | HTML、CSS、JavaScript 和 Web 平台基础主线 |
| `英文官方` | MDN Learn Web Development | https://developer.mozilla.org/en-US/docs/Learn_web_development | 对照术语、补充英文原文和练习 |
| `英文社区` | Front-End Developer Handbook | https://frontendmasters.com/guides/front-end-handbook/2024/ | 了解现代前端工程师能力地图 |
| `英文社区` | roadmap.sh Frontend | https://roadmap.sh/frontend | 查漏补缺，避免遗漏大模块 |
| `项目内` | 本项目学习路线 | `docs/00-roadmap.md` | 把学习主题和当前代码库对应起来 |

建议用法：

1. 初学时用 MDN 中文做主线。
2. 每章读完后打开英文版核对关键词。
3. 遇到“不知道下一步学什么”时看 roadmap.sh。
4. 每学完一类，就回到本项目写一个小功能或测试。

## 1. HTML、CSS、JavaScript 基础

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | MDN 学习 Web 开发 | https://developer.mozilla.org/zh-CN/docs/Learn_web_development | 从零建立 Web 基础 |
| `英文官方` | MDN Learn Web Development | https://developer.mozilla.org/en-US/docs/Learn_web_development | 英文术语、挑战题和原文细节 |
| `中文官方` | MDN HTML 中文 | https://developer.mozilla.org/zh-CN/docs/Web/HTML | 语义标签、表单、文档结构 |
| `英文官方` | MDN HTML | https://developer.mozilla.org/en-US/docs/Web/HTML | HTML 标准参考 |
| `中文官方` | MDN CSS 中文 | https://developer.mozilla.org/zh-CN/docs/Web/CSS | 盒模型、选择器、布局、响应式 |
| `英文官方` | MDN CSS | https://developer.mozilla.org/en-US/docs/Web/CSS | CSS 属性和规范参考 |
| `中文官方` | MDN JavaScript 中文 | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript | JS 语法、对象、函数、异步 |
| `英文官方` | MDN JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript | JS 标准 API 和英文术语 |

本项目对应：

- `apps/web/index.html`
- `apps/web/src/styles/global.css`
- `docs/02-html-css-js-ts.md`
- `apps/web/src/exercises/js-ts/`

练习建议：

1. 用语义 HTML 重读 `AppShell`、`ProductCard`、`LeadForm`。
2. 在 `global.css` 找出盒模型、Grid、Flex、媒体查询的实际用法。
3. 做完 `apps/web/src/exercises/js-ts/` 里的 JS/TS 练习。

## 2. JavaScript 核心与异步机制

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文社区` | 现代 JavaScript 教程中文版 | https://zh.javascript.info/ | JS 核心、原型、闭包、Promise、事件循环、DOM |
| `英文社区` | The Modern JavaScript Tutorial | https://javascript.info/ | 对照英文术语和原文示例 |
| `中文社区` | 冴羽 JavaScript 深入系列 | https://github.com/mqyqingfeng/Blog | 执行上下文、作用域链、闭包、原型链、this |
| `中文官方` | MDN JavaScript 中文 | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript | 标准语法和 API 查询 |
| `英文官方` | MDN JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript | 标准英文参考 |

优先级：

1. 用 `zh.javascript.info` 做系统教程。
2. 用冴羽博客复盘“为什么”和面试表达。
3. 用 MDN 查标准定义和边界行为。
4. 遇到术语时记录中英文对照，例如闭包 `closure`、原型链 `prototype chain`、事件循环 `event loop`。

本项目对应：

- `docs/02-html-css-js-ts.md`
- `apps/web/src/exercises/js-ts/02-js-basics.ts`
- `apps/web/src/exercises/js-ts/05-async.ts`
- `apps/web/src/api/client.ts`

重点问题：

- `const` 和对象可变性的区别。
- 闭包为什么能保存状态。
- Promise、microtask、macrotask、async/await 的执行顺序。
- 浏览器主线程为什么不能被长任务阻塞。

## 3. 浏览器原理、网络与安全

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | MDN Web API 中文 | https://developer.mozilla.org/zh-CN/docs/Web/API | DOM、Fetch、Storage、History、Service Worker |
| `英文官方` | MDN Web APIs | https://developer.mozilla.org/en-US/docs/Web/API | Web 平台 API 原文参考 |
| `中文官方` | MDN HTTP 中文 | https://developer.mozilla.org/zh-CN/docs/Web/HTTP | 请求方法、状态码、缓存、CORS、Cookie |
| `英文官方` | MDN HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP | HTTP 标准概念和英文术语 |
| `英文官方` | Chrome DevTools Docs | https://developer.chrome.com/docs/devtools/ | Elements、Network、Performance、Lighthouse |
| `英文官方` | web.dev Learn Performance | https://web.dev/learn/performance/ | 关键渲染路径、资源加载、图片性能、Core Web Vitals |

本项目对应：

- `apps/web/src/api/client.ts`
- `apps/web/src/lib/pwa.ts`
- `apps/web/public/sw.js`
- `apps/web/src/lib/securityPolicy.ts`
- `docs/09-p4-production-readiness.md`

重点问题：

- 从输入 URL 到页面展示发生了什么。
- 浏览器如何解析 HTML、CSS、JS。
- 重排、重绘、合成层分别是什么。
- CORS、XSS、CSRF、JWT 存储的风险边界。
- `localStorage`、`sessionStorage`、Cookie 的差异。

术语对照：

| 中文 | 英文 |
| --- | --- |
| 重排 | reflow / layout |
| 重绘 | repaint |
| 合成 | compositing |
| 同源策略 | same-origin policy |
| 跨域资源共享 | CORS |
| 内容安全策略 | Content Security Policy / CSP |

## 4. CSS 布局、响应式与视觉系统

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | MDN CSS 中文 | https://developer.mozilla.org/zh-CN/docs/Web/CSS | CSS 基础、属性、选择器、布局 |
| `英文官方` | MDN CSS | https://developer.mozilla.org/en-US/docs/Web/CSS | CSS 原文参考 |
| `英文官方` | web.dev Learn CSS | https://web.dev/learn/css | 盒模型、级联、选择器、布局、颜色、动画 |
| `英文官方` | Tailwind CSS Docs | https://tailwindcss.com/docs | Utility-first CSS、响应式、暗黑模式 |
| `中文社区` | Tailwind CSS 中文镜像 | https://tailwind.nodejs.cn/docs/installation/using-vite | Tailwind 入门辅助阅读 |
| `中文官方` | Ant Design React 中文文档 | https://ant.design/docs/react/introduce-cn | 组件体系、主题 token、表单和反馈组件 |
| `英文官方` | Ant Design React Docs | https://ant.design/docs/react/introduce | 英文 API 和组件说明 |

本项目对应：

- `apps/web/src/styles/global.css`
- `apps/web/tailwind.config.ts`
- `apps/web/src/theme/antdTheme.ts`
- `packages/ui/src/designTokens.ts`
- `docs/08-p3-architecture.md`
- `docs/15-antd-components.md`

重点问题：

- 什么时候用 Tailwind，什么时候写 `global.css`。
- CSS 变量和 Ant Design token 如何一起工作。
- Flex 和 Grid 的使用边界。
- 暗黑模式如何从状态同步到 DOM 和组件库。

练习建议：

1. 给一个页面增加移动端布局优化。
2. 在 `global.css` 新增一个 CSS 变量，并通过 Tailwind config 暴露。
3. 改一个 Ant Design token，观察按钮、表单、卡片的变化。

## 5. TypeScript 与类型建模

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `英文官方` | TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html | 类型系统主线、泛型、联合类型、类型缩小 |
| `英文官方` | TypeScript Everyday Types | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html | 常用类型写法 |
| `英文官方` | TypeScript Narrowing | https://www.typescriptlang.org/docs/handbook/2/narrowing.html | 类型收窄、类型守卫 |
| `中文社区` | TypeScript 入门教程 | https://ts.xcatliu.com/ | 中文入门辅助，适合先建立直觉 |
| `中文社区` | TypeScript 中文手册 | https://typescript.bootcss.com/ | 中文参考，注意和英文官方核对版本 |

本项目对应：

- `packages/api-client/src/types.ts`
- `packages/api-client/src/contracts.ts`
- `apps/web/src/store/configuratorStore.ts`
- `apps/web/src/components/leadFormSchema.ts`
- `apps/web/src/exercises/js-ts/03-types.ts`

重点问题：

- `type` 和 `interface` 的使用场景。
- `as const` 如何从配置数据推导字面量类型。
- Zod schema 和 TypeScript 类型如何互相配合。
- API DTO、表单数据、组件 props 为什么要分层。

术语对照：

| 中文 | 英文 |
| --- | --- |
| 联合类型 | union type |
| 类型收窄 | narrowing |
| 泛型 | generics |
| 类型守卫 | type guard |
| 字面量类型 | literal type |

## 6. React 主线

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | React 中文文档：快速入门 | https://zh-hans.react.dev/learn | 组件、props、state、事件、状态共享 |
| `英文官方` | React Learn | https://react.dev/learn | React 主线教程原文 |
| `中文官方` | React 中文文档：React 哲学 | https://zh-hans.react.dev/learn/thinking-in-react | 从 UI 拆组件、设计状态位置 |
| `英文官方` | Thinking in React | https://react.dev/learn/thinking-in-react | 对照英文术语和状态设计表达 |
| `英文官方` | React Reference | https://react.dev/reference/react | Hook API、组件 API、规则细节 |
| `英文社区` | React TypeScript Cheatsheets | https://react-typescript-cheatsheet.netlify.app/ | React + TypeScript 常见写法 |

本项目对应：

- `apps/web/src/main.tsx`
- `apps/web/src/components/AppProviders.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/components/`
- `apps/web/src/pages/`
- `docs/03-react-components-routing.md`

重点问题：

- 组件为什么必须是纯渲染函数。
- props 和 state 的边界。
- 状态应该放在哪一层。
- `useEffect` 适合处理什么副作用，哪些场景不需要 effect。
- 路由、Provider、ErrorBoundary 如何包住页面。

练习建议：

1. 给 `CatalogPage` 增加一个本地筛选条件。
2. 把一个复杂页面拆成更小的展示组件。
3. 给一个组件补测试，验证 props 和用户交互。

## 7. Vue 对照学习

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | Vue 中文文档 | https://cn.vuejs.org/guide/introduction.html | 响应式、模板、组件、Composition API |
| `英文官方` | Vue Guide | https://vuejs.org/guide/introduction.html | Vue 原文文档 |
| `中文官方` | Vue 交互式教程 | https://cn.vuejs.org/tutorial/ | 中文交互式入门 |
| `英文官方` | Vue Tutorial | https://vuejs.org/tutorial/ | 英文交互式入门 |
| `中文官方` | Pinia 中文文档 | https://pinia.vuejs.org/zh/ | Vue 状态管理 |
| `英文官方` | Pinia Docs | https://pinia.vuejs.org/ | Pinia 原文文档 |

为什么 React 项目也建议看一点 Vue：

- 对比 React 的“函数组件 + Hooks”和 Vue 的“模板 + 响应式系统”。
- 理解不同框架如何解决同一类问题：状态、组件通信、渲染更新。
- 面试中经常会问“React 和 Vue 的响应式有什么区别”。

不用深学到源码，先掌握：

- `ref` / `reactive`
- `computed`
- `watch`
- 组件 props / emits
- Composition API

## 8. 状态、API、表单

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | TanStack Query 中文文档 | https://zh-hans.tanstack.dev/query/latest/docs/framework/react/overview | server state、query key、缓存、失效、mutation |
| `英文官方` | TanStack Query Docs | https://tanstack.com/query/latest/docs/framework/react/overview | React Query 原文和最新 API |
| `英文官方` | Zustand Docs | https://zustand.docs.pmnd.rs/ | client state、store、selector、持久化 |
| `中文社区` | Zustand 中文辅助文档 | https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand | Zustand 概念辅助阅读，注意它也覆盖 zustand-vue |
| `英文官方` | React Hook Form Docs | https://react-hook-form.com/get-started | 表单状态、校验、性能 |
| `中文社区` | React Hook Form 中文文档 | https://react-hook-form.nodejs.cn/get-started | 表单 API 中文辅助 |
| `英文官方` | Zod Docs | https://zod.dev/ | schema 校验、类型推导 |
| `中文社区` | Zod 中文文档 | https://zod.nodejs.cn/ | Zod 中文辅助阅读 |

本项目对应：

- `docs/04-state-api-forms.md`
- `apps/web/src/lib/queryClient.ts`
- `apps/web/src/api/products.ts`
- `apps/web/src/store/`
- `apps/web/src/components/LeadForm.tsx`
- `apps/web/src/components/leadFormSchema.ts`

重点问题：

- 服务端状态和客户端状态为什么要分开。
- React Query 为什么不等同于 Zustand。
- 表单输入为什么通常不放进全局 store。
- token、主题、语言为什么需要持久化。

术语对照：

| 中文 | 英文 |
| --- | --- |
| 服务端状态 | server state |
| 客户端状态 | client state |
| 查询键 | query key |
| 缓存失效 | invalidation |
| 乐观更新 | optimistic update |
| 表单解析器 | resolver |

## 9. 工程化、构建与包管理

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `中文官方` | Vite 官方中文文档 | https://cn.vite.dev/guide/ | dev server、index.html 入口、生产构建、环境变量 |
| `英文官方` | Vite Guide | https://vite.dev/guide/ | Vite 原文和最新说明 |
| `英文官方` | npm Workspaces | https://docs.npmjs.com/cli/v10/using-npm/workspaces | monorepo 包管理 |
| `英文官方` | ESLint Docs | https://eslint.org/docs/latest/ | lint 规则、代码质量 |
| `英文官方` | Prettier Docs | https://prettier.io/docs/en/ | 格式化与团队风格一致性 |
| `中文官方` | Vitest 中文文档 | https://cn.vitest.dev/guide/ | Vite 生态测试框架 |
| `英文官方` | Vitest Docs | https://vitest.dev/guide/ | Vitest 原文文档 |

本项目对应：

- `package.json`
- `apps/web/package.json`
- `apps/web/vite.config.ts`
- `apps/web/.env.example`
- `tsconfig.base.json`
- `docs/01-environment.md`
- `docs/06-testing-build-git.md`

重点问题：

- npm workspace 如何让 `apps/web` 使用 `packages/ui`。
- Vite 为什么把 `index.html` 当入口。
- `.env.development`、`.env.production`、`.env.test` 的边界。
- lint、format、typecheck、test、build 分别解决什么问题。

术语对照：

| 中文 | 英文 |
| --- | --- |
| 工作区 | workspace |
| 构建 | build |
| 开发服务器 | dev server |
| 环境变量 | environment variable |
| 类型检查 | type checking |

## 10. 测试、组件文档与质量保障

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `英文官方` | Testing Library React | https://testing-library.com/docs/react-testing-library/intro/ | 从用户视角测试组件 |
| `英文官方` | user-event Docs | https://testing-library.com/docs/user-event/intro/ | 模拟真实用户交互 |
| `英文官方` | Playwright Docs | https://playwright.dev/docs/intro | E2E、定位器、截图、浏览器测试 |
| `中文社区` | Playwright 中文网 | https://playwright.nodejs.cn/docs/intro | Playwright 中文辅助阅读 |
| `英文官方` | Storybook Docs | https://storybook.js.org/docs/get-started/install | 组件 stories、交互状态、设计系统文档 |
| `中文官方` | Vitest 中文文档 | https://cn.vitest.dev/guide/ | 单元测试、断言、mock、覆盖率 |
| `英文官方` | Vitest Docs | https://vitest.dev/guide/ | Vitest 原文文档 |

本项目对应：

- `apps/web/src/**/*.test.tsx`
- `apps/web/e2e/`
- `packages/ui/src/*.stories.tsx`
- `docs/06-testing-build-git.md`

学习顺序：

1. 先学 Testing Library，理解“用户能看到什么、能点击什么”。
2. 再学 Playwright，覆盖登录、预约、后台等完整路径。
3. 最后学 Storybook，把共享 UI 组件的状态沉淀成文档。

术语对照：

| 中文 | 英文 |
| --- | --- |
| 单元测试 | unit test |
| 集成测试 | integration test |
| 端到端测试 | end-to-end test / E2E |
| 定位器 | locator |
| 断言 | assertion |
| 快照 | snapshot |

## 11. 性能、调试与可访问性

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `英文官方` | web.dev Learn Performance | https://web.dev/learn/performance/ | 关键渲染路径、资源加载、图片优化、性能指标 |
| `英文官方` | Chrome DevTools Performance | https://developer.chrome.com/docs/devtools/performance/overview | Performance 面板、CPU profile、Core Web Vitals |
| `中文官方` | MDN 无障碍中文 | https://developer.mozilla.org/zh-CN/docs/Learn/Accessibility | 语义 HTML、键盘访问、屏幕阅读器基础 |
| `英文官方` | MDN Accessibility | https://developer.mozilla.org/en-US/docs/Learn/Accessibility | 可访问性英文原文 |
| `英文官方` | web.dev Learn Accessibility | https://web.dev/learn/accessibility | 可访问性实践和检查清单 |

本项目对应：

- `apps/web/scripts/build-analyze.mjs`
- `apps/web/e2e/visual.spec.ts`
- `apps/web/src/components/ResponsiveProductImage.tsx`
- `apps/web/src/components/VirtualLeadList.tsx`
- `docs/09-p4-production-readiness.md`

重点问题：

- LCP、CLS、INP 分别衡量什么。
- 图片为什么要做 WebP、多尺寸和懒加载。
- 虚拟列表解决什么性能问题。
- 为什么按钮、表单、导航必须能被键盘和辅助技术理解。

术语对照：

| 中文 | 英文 |
| --- | --- |
| 最大内容绘制 | Largest Contentful Paint / LCP |
| 累积布局偏移 | Cumulative Layout Shift / CLS |
| 与下一次绘制的交互 | Interaction to Next Paint / INP |
| 可访问性 | accessibility / a11y |
| 屏幕阅读器 | screen reader |

## 12. 面试八股与手写题

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `英文社区` | BigFrontEnd | https://bigfrontend.dev/ | Promise、防抖、节流、深拷贝、组件题 |
| `英文社区` | GreatFrontEnd | https://www.greatfrontend.com/ | JavaScript、React、CSS、前端系统设计面试 |
| `中文社区` | 冴羽 Blog | https://github.com/mqyqingfeng/Blog | JS 原理面试表达 |
| `中文社区` | Daily Interview Question | https://github.com/Advanced-Frontend/Daily-Interview-Question | 高频题讨论和答案对比 |
| `中文社区` | fe-interview | https://github.com/haizlin/fe-interview | 每日题库，适合碎片复习 |

不要一开始就刷题。建议顺序：

1. 先用 `zh.javascript.info` 和 MDN 建基础。
2. 再用 BigFrontEnd 练手写题。
3. 用社区题库查漏补缺。
4. 最后把答案整理成自己的语言，并补英文关键词。

常见手写题主题：

- `Promise`
- `debounce` / `throttle`
- `deepClone`
- `EventEmitter`
- `flatten`
- `memoize`
- `LRU cache`
- `useDebounce`
- 简易 `useState` / `useEffect` 思路题

术语对照：

| 中文 | 英文 |
| --- | --- |
| 防抖 | debounce |
| 节流 | throttle |
| 深拷贝 | deep clone |
| 发布订阅 | publish-subscribe |
| 最近最少使用缓存 | LRU cache |

## 13. 项目实战与设计还原

| 标记 | 资源 | 链接 | 推荐学习点 |
| --- | --- | --- | --- |
| `英文社区` | Frontend Mentor | https://www.frontendmentor.io/ | 根据设计稿还原页面和交互 |
| `英文社区` | CodePen | https://codepen.io/ | CSS、动画、小交互实验 |
| `英文社区` | StackBlitz | https://stackblitz.com/ | 在线跑 Vite、React、Vue demo |
| `中文社区` | 掘金前端 | https://juejin.cn/frontend | 中文项目经验和专题文章 |
| `中文社区` | SegmentFault 前端 | https://segmentfault.com/channel/frontend | 中文问题讨论和文章 |

本项目练习方向：

1. 页面实战：新增一个产品比较页。
2. 表单实战：给预约表单增加日期、预算、备注字段。
3. 状态实战：给配置器增加 `warranty` 或 `layout density`。
4. API 实战：新增一个后端接口和前端 React Query hook。
5. 测试实战：给新增功能补 Vitest 和 Playwright。

## 14. 建议学习路径

### 第一阶段：Web 基础

目标：能看懂 HTML、CSS、JS 文件如何组成页面。

中文主线：

- MDN 学习 Web 开发：https://developer.mozilla.org/zh-CN/docs/Learn_web_development
- 本项目 `docs/02-html-css-js-ts.md`
- 本项目 `apps/web/src/exercises/js-ts/`

英文对照：

- MDN Learn Web Development：https://developer.mozilla.org/en-US/docs/Learn_web_development
- MDN JavaScript：https://developer.mozilla.org/en-US/docs/Web/JavaScript

产出：

- 能解释 `main.tsx` 做了什么。
- 能改一个页面布局。
- 能写基础 JS 函数并通过测试。

### 第二阶段：React 与项目结构

目标：能在本项目里新增页面、组件和路由。

中文主线：

- React 中文文档：https://zh-hans.react.dev/learn
- 本项目 `docs/03-react-components-routing.md`

英文对照：

- React Learn：https://react.dev/learn
- React Reference：https://react.dev/reference/react

产出：

- 新增一个页面路由。
- 拆出一个可复用组件。
- 给组件加 props 类型和测试。

### 第三阶段：状态、API、表单

目标：能理解真实前端应用的数据流。

中文主线：

- 本项目 `docs/04-state-api-forms.md`
- TanStack Query 中文文档：https://zh-hans.tanstack.dev/query/latest/docs/framework/react/overview
- React Hook Form 中文文档：https://react-hook-form.nodejs.cn/get-started
- Zod 中文文档：https://zod.nodejs.cn/

英文对照：

- TanStack Query Docs：https://tanstack.com/query/latest/docs/framework/react/overview
- Zustand Docs：https://zustand.docs.pmnd.rs/
- React Hook Form Docs：https://react-hook-form.com/get-started
- Zod Docs：https://zod.dev/

产出：

- 新增一个 store 字段。
- 新增一个 API hook。
- 新增一个表单字段和校验。

### 第四阶段：工程化、测试、性能

目标：能把功能做得可维护、可验证、可上线。

中文主线：

- Vite 官方中文文档：https://cn.vite.dev/guide/
- Vitest 中文文档：https://cn.vitest.dev/guide/
- Playwright 中文网：https://playwright.nodejs.cn/docs/intro

英文对照：

- Vite Guide：https://vite.dev/guide/
- Testing Library：https://testing-library.com/docs/react-testing-library/intro/
- Playwright Docs：https://playwright.dev/docs/intro
- web.dev Learn Performance：https://web.dev/learn/performance/
- Chrome DevTools Docs：https://developer.chrome.com/docs/devtools/

产出：

- 跑通 `typecheck`、`lint`、`test`、`build`。
- 写一个端到端测试。
- 用 Performance 面板分析一次页面。

### 第五阶段：八股和源码拓展

目标：把实践过的东西整理成可表达的原理。

中文主线：

- 现代 JavaScript 教程中文版：https://zh.javascript.info/
- 冴羽 Blog：https://github.com/mqyqingfeng/Blog
- Daily Interview Question：https://github.com/Advanced-Frontend/Daily-Interview-Question

英文对照：

- The Modern JavaScript Tutorial：https://javascript.info/
- BigFrontEnd：https://bigfrontend.dev/
- GreatFrontEnd：https://www.greatfrontend.com/

产出：

- 每周整理 5 个问题：概念、例子、项目对应代码、面试表达、英文关键词。
- 每周手写 3 个函数，并补测试。

## 15. 最小推荐组合

如果只保留一套最小高质量组合，可以这样选：

| 方向 | 中文主资源 | 英文对照 |
| --- | --- | --- |
| Web 基础 | MDN 学习 Web 开发 | MDN Learn Web Development |
| JavaScript 深入 | 现代 JavaScript 教程中文版 | The Modern JavaScript Tutorial |
| React | React 中文文档 | React Learn |
| TypeScript | TypeScript 入门教程 | TypeScript Handbook |
| 状态和 API | 本项目 `docs/04-state-api-forms.md` + TanStack Query 中文文档 | TanStack Query Docs + Zustand Docs |
| CSS | MDN CSS 中文 + Ant Design 中文文档 | MDN CSS + web.dev Learn CSS |
| 工程化 | Vite 中文文档 + Vitest 中文文档 | Vite Guide + npm Workspaces |
| 测试 | Playwright 中文网 + Vitest 中文文档 | Testing Library + Playwright Docs |
| 性能 | MDN 无障碍中文 + 项目性能文档 | web.dev Learn Performance + Chrome DevTools |
| 面试手写 | 冴羽 Blog + Daily Interview Question | BigFrontEnd + GreatFrontEnd |

学习前端最怕“收藏了很多，但没有把知识落到项目里”。这个仓库已经覆盖了 React、TypeScript、Vite、React Query、Zustand、表单、测试、构建、PWA 和性能优化。建议把外部教程当地图，把本项目当训练场。
