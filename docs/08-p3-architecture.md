# 08 P3 进阶架构学习

P3 的目标不是马上把项目改造成大型团队架构，而是在当前可运行项目里做一组可验证的教学原型：先理解样式方案、包边界、共享 UI 和微前端取舍，再决定是否进入完整迁移。

## CSS-in-JS 对比

当前项目默认保留 `Tailwind CSS + global.css + Antd token`：

- `Tailwind CSS` 负责局部布局、响应式间距和轻量状态样式。
- `global.css` 负责设计变量、页面骨架和复杂视觉效果。
- `Antd token` 负责组件库主题，让后台表格、弹窗、通知和表单保持统一。

常见 CSS-in-JS 方案可以作为团队项目中的备选能力理解：

| 方案 | 适合场景 | 在本项目中的策略 |
| --- | --- | --- |
| `styled-components` | 需要组件级样式封装、主题对象和运行时动态样式的业务组件库 | 了解即可，不作为默认依赖 |
| `emotion` | 需要 `css` prop、对象样式或与设计系统强绑定的 React 样式层 | 了解即可，不作为默认依赖 |
| `Antd token` | 已经使用 Ant Design，想统一组件库颜色、圆角、暗黑模式 | 继续使用 |
| `Tailwind + global.css` | 学习项目、产品页、响应式布局和可读的设计变量 | 继续作为默认样式体系 |

本轮不会新增 `styled-components` 或 `emotion` 运行时依赖。这样可以把 P3 学习重点放在架构取舍上，同时避免为了演示而增加不必要的 bundle 成本。

## Monorepo 包边界规划

P3 先规划了未来边界，并用轻量原型验证共享代码怎么被消费。P6 已把这个规划落地为 npm workspace。

当前代码是“同仓库、分应用、共享包”的 monorepo 结构，不是前端和后端代码混写：

- `apps/web` 承担浏览器端 React 应用、页面路由、交互状态、E2E 和前端构建。
- `apps/api` 承担 FastAPI 后端服务、数据库模型、接口实现和后端测试。
- `packages/ui` 承担可复用展示组件，不读取业务路由、store 或 API。
- `packages/api-client` 承担前端调用后端的 TypeScript client、Zod 契约和 DTO 类型，是前后端之间的边界层。

根目录 `package.json` 和 `apps/api/package.json` 里的 npm 脚本只是为了在 Windows 和 npm workspaces 下统一启动、测试和验证各个子项目；它不会改变后端仍由 Python/FastAPI 实现、前端仍由 React/Vite 实现的事实。

未来如果进入完整 monorepo 迁移，可以按下面职责拆分：

| 目标包 | 当前来源 | 职责 | 依赖方向 |
| --- | --- | --- | --- |
| `apps/web` | 原 `frontend/` | Vite React 应用、路由、页面、E2E 和前端构建脚本 | 可依赖 `packages/ui`、`packages/api-client` |
| `apps/api` | 原 `backend/` | FastAPI 应用、SQLite 模型、OpenAPI、后端测试 | 不依赖前端包 |
| `packages/ui` | P3/P5 共享 UI 原型 | 可复用展示组件、设计 token 映射和基础交互组件 | 不依赖业务页面或 API |
| `packages/api-client` | 原 `apps/web/src/api` 的契约和请求层 | API client、契约 schema 和请求错误类型 | 可被 `apps/web` 依赖 |

当前 workspace 使用 npm workspaces 管理 `apps/*` 和 `packages/*`，根目录脚本统一代理前端、后端和共享包验证。

## Shared UI package 原型

`packages/ui` 作为共享 UI 教学包，通过 workspace dependency 和 Vite alias 被 `apps/web` 消费：

- `packages/ui` 暴露纯展示组件，不读取路由、不请求 API、不依赖业务 store。
- `apps/web` 是唯一 Vite 应用，导入共享 UI 组件和共享 API client。
- `apps/web/tsconfig.json` 和 `apps/web/vite.config.ts` 负责把 workspace 包指向本地源码。
- `packages/ui` 保持纯展示边界，不读取路由、store 或 API。

## 微前端取舍

当前项目不引入微前端运行时。原因是 LumaDock 仍是单一产品应用，路由、登录态、主题 token、API client 和发布节奏都高度共享；强行拆成多个运行时应用会增加构建、部署、通信和故障兜底成本。

适合考虑微前端的条件：

- 多个团队需要独立发布前端子应用。
- 业务域可以清楚拆分，并能独立测试、监控和回滚。
- 共享鉴权、设计系统、错误边界、跨应用通信和 fallback 规则已经成熟。

后续学习路线可以先了解两类方案：

| 方案 | 适合场景 | 本项目策略 |
| --- | --- | --- |
| Module Federation | 多个 Vite/Webpack 应用之间做运行时模块组合 | 作为概念学习，不接入运行时 |
| single-spa | 多框架或多应用需要统一挂载、卸载和路由编排 | 作为概念学习，不接入运行时 |

P3 的结论是：先把共享代码边界和测试纪律练扎实，再决定是否引入微前端。对当前学习项目来说，`packages/ui` 原型已经足够展示大型工程的第一步拆分方式。
