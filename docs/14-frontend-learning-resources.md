# 14 前端教程子类与学习资源清单

整理时间：2026-05-24

这份文档不是单纯收藏夹，而是把前端学习拆成若干“教程子类”。每一类都给出主资源、补充资源、适合学习的重点，以及可以在本项目里练习的位置。

使用原则：

- 每个阶段只选一个主资源精读，不要同时打开十几个教程。
- 官方文档优先，社区博客和题库用于补洞、复盘和面试准备。
- 学到一个概念后，尽量回到本项目里找对应代码，或者自己改一个小功能。
- 八股题不要孤立背，要和浏览器、JavaScript、React、工程化的真实机制连起来。

## 0. 总路线与索引

| 资源 | 链接 | 适合用途 |
| --- | --- | --- |
| MDN Learn Web Development | https://developer.mozilla.org/en-US/docs/Learn_web_development | HTML、CSS、JavaScript、Web 平台基础主线 |
| Front-End Developer Handbook | https://frontendmasters.com/guides/front-end-handbook/2024/ | 了解现代前端工程师完整能力地图 |
| roadmap.sh Frontend | https://roadmap.sh/frontend | 查漏补缺，不建议完全照单全收 |
| 本项目路线文档 | `docs/00-roadmap.md` | 把学习主题和当前代码库对应起来 |

建议用法：

1. 初学时用 MDN 做主线。
2. 遇到“我还缺哪些模块”时看 roadmap.sh。
3. 想了解行业能力边界时看 Front-End Handbook。
4. 每学完一类，就回到本项目写一个小功能或测试。

## 1. HTML、CSS、JavaScript 基础

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| MDN Learn Web Development | https://developer.mozilla.org/en-US/docs/Learn_web_development | Web 基础、语义 HTML、CSS 基础、JS 入门 |
| MDN HTML | https://developer.mozilla.org/en-US/docs/Web/HTML | 标签语义、表单、可访问性基础 |
| MDN CSS | https://developer.mozilla.org/en-US/docs/Web/CSS | 盒模型、选择器、布局、媒体查询 |
| MDN JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript | JS 语法、对象、函数、异步、标准 API |

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

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| 现代 JavaScript 教程 | https://zh.javascript.info/ | 变量、对象、原型、闭包、Promise、事件循环、DOM |
| 冴羽 JavaScript 深入系列 | https://github.com/mqyqingfeng/Blog | 执行上下文、作用域链、闭包、原型链、this |
| MDN JavaScript Guide | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide | 标准语法与 API 参考 |

优先级：

1. `zh.javascript.info` 适合作为系统教程。
2. 冴羽博客适合复盘“为什么”和面试表述。
3. MDN 适合查标准定义和边界行为。

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

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| MDN Web APIs | https://developer.mozilla.org/en-US/docs/Web/API | DOM、Fetch、Storage、History、Service Worker |
| MDN HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP | 请求方法、状态码、缓存、CORS、Cookie |
| Chrome DevTools Docs | https://developer.chrome.com/docs/devtools/ | Elements、Network、Performance、Lighthouse |
| web.dev Performance | https://web.dev/learn/performance/ | 关键渲染路径、资源加载、图片性能、Core Web Vitals |

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

## 4. CSS 布局、响应式与视觉系统

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| web.dev Learn CSS | https://web.dev/learn/css | 盒模型、级联、选择器、布局、颜色、动画 |
| MDN CSS Layout | https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout | Flex、Grid、定位、响应式布局 |
| Tailwind CSS Docs | https://tailwindcss.com/docs | Utility-first CSS、响应式、暗黑模式 |
| Ant Design Docs | https://ant.design/docs/react/introduce | 组件体系、主题 token、表单和反馈组件 |

本项目对应：

- `apps/web/src/styles/global.css`
- `apps/web/tailwind.config.ts`
- `apps/web/src/theme/antdTheme.ts`
- `packages/ui/src/designTokens.ts`
- `docs/08-p3-architecture.md`

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

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html | 类型系统主线、泛型、联合类型、类型缩小 |
| TypeScript Everyday Types | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html | 常用类型写法 |
| TypeScript Narrowing | https://www.typescriptlang.org/docs/handbook/2/narrowing.html | 类型收窄、类型守卫 |

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

## 6. React 主线

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| React Learn | https://react.dev/learn | 组件、props、state、列表、事件、状态共享 |
| Thinking in React | https://react.dev/learn/thinking-in-react | 从 UI 拆组件、设计状态位置 |
| React Reference | https://react.dev/reference/react | Hook API、组件 API、规则细节 |
| React TypeScript Cheatsheets | https://react-typescript-cheatsheet.netlify.app/ | React + TypeScript 常见写法 |

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

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| Vue 官方 Guide | https://vuejs.org/guide/introduction.html | 响应式、模板、组件、Composition API |
| Vue Tutorial | https://vuejs.org/tutorial/ | 交互式入门 |
| Pinia Docs | https://pinia.vuejs.org/ | Vue 状态管理 |

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

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| TanStack Query Docs | https://tanstack.com/query/latest/docs/framework/react/overview | server state、query key、缓存、失效、mutation |
| Zustand Docs | https://zustand.docs.pmnd.rs/ | client state、store、selector、持久化 |
| React Hook Form Docs | https://react-hook-form.com/get-started | 表单状态、校验、性能 |
| Zod Docs | https://zod.dev/ | schema 校验、类型推导 |

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

## 9. 工程化、构建与包管理

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| Vite Guide | https://vite.dev/guide/ | dev server、index.html 入口、生产构建、环境变量 |
| npm Workspaces | https://docs.npmjs.com/cli/v10/using-npm/workspaces | monorepo 包管理 |
| ESLint Docs | https://eslint.org/docs/latest/ | lint 规则、代码质量 |
| Prettier Docs | https://prettier.io/docs/en/ | 格式化与团队风格一致性 |
| Vitest Docs | https://vitest.dev/guide/ | Vite 生态测试框架 |

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

## 10. 测试、组件文档与质量保障

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| Testing Library React | https://testing-library.com/docs/react-testing-library/intro/ | 从用户视角测试组件 |
| user-event Docs | https://testing-library.com/docs/user-event/intro/ | 模拟真实用户交互 |
| Playwright Docs | https://playwright.dev/docs/intro | E2E、定位器、截图、浏览器测试 |
| Storybook Docs | https://storybook.js.org/docs/get-started/install | 组件 stories、交互状态、设计系统文档 |

本项目对应：

- `apps/web/src/**/*.test.tsx`
- `apps/web/e2e/`
- `packages/ui/src/*.stories.tsx`
- `docs/06-testing-build-git.md`

学习顺序：

1. 先学 Testing Library，理解“用户能看到什么、能点击什么”。
2. 再学 Playwright，覆盖登录、预约、后台等完整路径。
3. 最后学 Storybook，把共享 UI 组件的状态沉淀成文档。

## 11. 性能、调试与可访问性

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| web.dev Learn Performance | https://web.dev/learn/performance/ | 关键渲染路径、资源加载、图片优化、性能指标 |
| Chrome DevTools Performance | https://developer.chrome.com/docs/devtools/performance/overview | Performance 面板、CPU profile、Core Web Vitals |
| MDN Accessibility | https://developer.mozilla.org/en-US/docs/Learn/Accessibility | 语义 HTML、键盘访问、屏幕阅读器基础 |
| web.dev Learn Accessibility | https://web.dev/learn/accessibility | 可访问性实践和检查清单 |

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

## 12. 面试八股与手写题

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| BigFrontEnd | https://bigfrontend.dev/ | Promise、防抖、节流、深拷贝、组件题 |
| GreatFrontEnd | https://www.greatfrontend.com/ | JavaScript、React、CSS、前端系统设计面试 |
| 冴羽 Blog | https://github.com/mqyqingfeng/Blog | JS 原理面试表达 |
| Daily Interview Question | https://github.com/Advanced-Frontend/Daily-Interview-Question | 高频题讨论和答案对比 |
| fe-interview | https://github.com/haizlin/fe-interview | 每日题库，适合碎片复习 |

不要一开始就刷题。建议顺序：

1. 先用 `zh.javascript.info` 和 MDN 建基础。
2. 再用 BigFrontEnd 练手写题。
3. 用社区题库查漏补缺。
4. 最后把答案整理成自己的语言。

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

## 13. 项目实战与设计还原

| 资源 | 链接 | 推荐学习点 |
| --- | --- | --- |
| Frontend Mentor | https://www.frontendmentor.io/ | 根据设计稿还原页面和交互 |
| CodePen | https://codepen.io/ | CSS、动画、小交互实验 |
| StackBlitz | https://stackblitz.com/ | 在线跑 Vite、React、Vue demo |

本项目练习方向：

1. 页面实战：新增一个产品比较页。
2. 表单实战：给预约表单增加日期、预算、备注字段。
3. 状态实战：给配置器增加 `warranty` 或 `layout density`。
4. API 实战：新增一个后端接口和前端 React Query hook。
5. 测试实战：给新增功能补 Vitest 和 Playwright。

## 14. 建议学习路径

### 第一阶段：Web 基础

目标：能看懂 HTML、CSS、JS 文件如何组成页面。

学习：

- MDN Learn Web Development
- `docs/02-html-css-js-ts.md`
- `apps/web/src/exercises/js-ts/`

产出：

- 能解释 `main.tsx` 做了什么。
- 能改一个页面布局。
- 能写基础 JS 函数并通过测试。

### 第二阶段：React 与项目结构

目标：能在本项目里新增页面、组件和路由。

学习：

- React Learn
- `docs/03-react-components-routing.md`
- `apps/web/src/components/`
- `apps/web/src/pages/`

产出：

- 新增一个页面路由。
- 拆出一个可复用组件。
- 给组件加 props 类型和测试。

### 第三阶段：状态、API、表单

目标：能理解真实前端应用的数据流。

学习：

- `docs/04-state-api-forms.md`
- TanStack Query Docs
- Zustand Docs
- React Hook Form + Zod

产出：

- 新增一个 store 字段。
- 新增一个 API hook。
- 新增一个表单字段和校验。

### 第四阶段：工程化、测试、性能

目标：能把功能做得可维护、可验证、可上线。

学习：

- Vite Guide
- Testing Library
- Playwright
- web.dev Performance
- Chrome DevTools Docs

产出：

- 跑通 `typecheck`、`lint`、`test`、`build`。
- 写一个端到端测试。
- 用 Performance 面板分析一次页面。

### 第五阶段：八股和源码拓展

目标：把实践过的东西整理成可表达的原理。

学习：

- 现代 JavaScript 教程
- 冴羽 Blog
- BigFrontEnd
- Daily Interview Question

产出：

- 每周整理 5 个问题：概念、例子、项目对应代码、面试表达。
- 每周手写 3 个函数，并补测试。

## 15. 我的推荐组合

如果只保留一套最小高质量组合：

| 方向 | 主资源 |
| --- | --- |
| Web 基础 | MDN Learn Web Development |
| JavaScript 深入 | 现代 JavaScript 教程 |
| React | React Learn |
| TypeScript | TypeScript Handbook |
| 状态和 API | 本项目 `docs/04-state-api-forms.md` + TanStack Query Docs |
| CSS | web.dev Learn CSS |
| 性能 | web.dev Learn Performance + Chrome DevTools |
| 测试 | Testing Library + Playwright |
| 面试手写 | BigFrontEnd |

学习前端最怕“收藏了很多，但没有把知识落到项目里”。这个仓库已经覆盖了 React、TypeScript、Vite、React Query、Zustand、表单、测试、构建、PWA 和性能优化。建议把外部教程当地图，把本项目当训练场。
