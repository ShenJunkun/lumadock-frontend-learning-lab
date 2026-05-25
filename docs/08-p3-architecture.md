# 08 P3 进阶架构学习

P3 的目标不是马上把项目改造成大型团队架构，而是在当前可运行项目里做一组可验证的教学原型：先理解样式方案、包边界、共享 UI 和微前端取舍，再决定是否进入完整迁移。

## CSS-in-JS 对比

当前项目默认保留 `Tailwind CSS + global.css + Antd token`：

- `Tailwind CSS` 负责局部布局、响应式间距和轻量状态样式。
- `global.css` 负责设计变量、页面骨架和复杂视觉效果。
- `Antd token` 负责组件库主题，让后台表格、弹窗、通知和表单保持统一。

常见 CSS-in-JS 方案可以作为团队项目中的备选能力理解：

| 方案                    | 适合场景                                                   | 在本项目中的策略         |
| ----------------------- | ---------------------------------------------------------- | ------------------------ |
| `styled-components`     | 需要组件级样式封装、主题对象和运行时动态样式的业务组件库   | 了解即可，不作为默认依赖 |
| `emotion`               | 需要 `css` prop、对象样式或与设计系统强绑定的 React 样式层 | 了解即可，不作为默认依赖 |
| `Antd token`            | 已经使用 Ant Design，想统一组件库颜色、圆角、暗黑模式      | 继续使用                 |
| `Tailwind + global.css` | 学习项目、产品页、响应式布局和可读的设计变量               | 继续作为默认样式体系     |

本轮不会新增 `styled-components` 或 `emotion` 运行时依赖。这样可以把 P3 学习重点放在架构取舍上，同时避免为了演示而增加不必要的 bundle 成本。

## Monorepo 包边界规划

P3 先规划了未来边界，并用轻量原型验证共享代码怎么被消费。P6 已把这个规划落地为 npm workspace。

当前代码是“同仓库、分应用、共享包”的 monorepo 结构，不是前端和后端代码混写：

- `apps/web` 承担浏览器端 React 应用、页面路由、交互状态、E2E 和前端构建。
- `apps/web-vue` 承担浏览器端 Vue 3 并行应用，用同一套业务契约复刻 React UI 和功能。
- `apps/api` 承担 FastAPI 后端服务、数据库模型、接口实现和后端测试。
- `packages/ui` 承担 React 可复用展示组件，不读取业务路由、store 或 API。
- `packages/ui-vue` 承担 Vue 可复用展示组件，和 React UI 包保持命名、token 和视觉语义对应。
- `packages/api-client` 承担前端调用后端的 TypeScript client、Zod 契约和 DTO 类型，是前后端之间的边界层。

根目录 `package.json` 和 `apps/api/package.json` 里的 npm 脚本只是为了在 Windows 和 npm workspaces 下统一启动、测试和验证各个子项目；它不会改变后端仍由 Python/FastAPI 实现、浏览器前端由 React/Vite 主应用和 Vue/Vite 并行应用共同演示的事实。

未来如果进入完整 monorepo 迁移，可以按下面职责拆分：

| 目标包                | 当前来源                             | 职责                                              | 依赖方向                                        |
| --------------------- | ------------------------------------ | ------------------------------------------------- | ----------------------------------------------- |
| `apps/web`            | 原 `frontend/`                       | Vite React 应用、路由、页面、E2E 和前端构建脚本   | 可依赖 `packages/ui`、`packages/api-client`     |
| `apps/web-vue`        | Vue 并行实现                         | Vite Vue 3 应用、路由、页面、E2E 和前端构建脚本   | 可依赖 `packages/ui-vue`、`packages/api-client` |
| `apps/api`            | 原 `backend/`                        | FastAPI 应用、SQLite 模型、OpenAPI、后端测试      | 不依赖前端包                                    |
| `packages/ui`         | P3/P5 共享 UI 原型                   | 可复用展示组件、设计 token 映射和基础交互组件     | 不依赖业务页面或 API                            |
| `packages/ui-vue`     | Vue 共享 UI 原型                     | Vue 可复用展示组件、设计 token 映射和基础交互组件 | 不依赖业务页面或 API                            |
| `packages/api-client` | 原 `apps/web/src/api` 的契约和请求层 | API client、契约 schema 和请求错误类型            | 可被 `apps/web` 和 `apps/web-vue` 依赖          |

当前 workspace 使用 npm workspaces 管理 `apps/*` 和 `packages/*`，根目录脚本统一代理前端、后端和共享包验证。

## Shared UI package 原型

`packages/ui` 作为 React 共享 UI 教学包，通过 workspace dependency 和 Vite alias 被 `apps/web` 消费：

- `packages/ui` 暴露纯展示组件，不读取路由、不请求 API、不依赖业务 store。
- `apps/web` 是 React Vite 应用，导入 React 共享 UI 组件和共享 API client。
- `apps/web/tsconfig.json` 和 `apps/web/vite.config.ts` 负责把 workspace 包指向本地源码。
- `packages/ui` 保持纯展示边界，不读取路由、store 或 API。

`packages/ui-vue` 是 Vue 版共享 UI 包，被 `apps/web-vue` 通过 `@lumadock/ui-vue` 消费。它提供 Vue 组件版的 `SurfaceCard`、`StatusBadge`、`EmptyState`、`LearningArchitecturePanel` 和 `designTokens`。两个 UI 包共享设计语义，但不强行共享组件源码：React 版保留 TSX 组件模型，Vue 版保留 SFC / Vue component 模型。

### workspace 包引用机制

`apps/web/src` 中不会直接写很长的相对路径去找 `packages/ui/src/Button.tsx`，而是把共享 UI 包当成一个内部 npm 包使用：

```ts
import { EmptyState, StatusBadge, SurfaceCard } from "@lumadock/ui";
```

这套机制由几层一起完成：

| 层                    | 文件                       | 作用                                                                                |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------------- |
| workspace 依赖声明    | `apps/web/package.json`    | 声明 `@lumadock/ui` 是 Web 应用依赖，版本写 `"*"` 表示使用当前 workspace 里的本地包 |
| Vite 运行时解析       | `apps/web/vite.config.ts`  | 把 `@lumadock/ui` alias 到 `../../packages/ui/src/index.ts`，开发和构建时读取源码   |
| TypeScript / IDE 解析 | `apps/web/tsconfig.json`   | 用 `paths` 告诉类型检查和编辑器跳转：`@lumadock/ui` 对应 `packages/ui/src/index.ts` |
| 共享包出口            | `packages/ui/src/index.ts` | 统一 re-export `Button`、`EmptyState`、`StatusBadge`、`SurfaceCard` 等组件          |
| 具体组件源码          | `packages/ui/src/*.tsx`    | 真正实现按钮、卡片、空状态和 badge                                                  |

所以一次导入的实际路径可以理解成：

```text
apps/web/src/pages/AdminPage.tsx
  import { StatusBadge, SurfaceCard } from "@lumadock/ui"
    -> Vite / TypeScript 解析 @lumadock/ui
    -> packages/ui/src/index.ts
    -> packages/ui/src/StatusBadge.tsx
    -> packages/ui/src/SurfaceCard.tsx
```

`packages/ui/src/index.ts` 在这里是“门面文件”或“桶文件”：外部只从一个入口导入共享组件，内部文件怎么拆分由 `packages/ui` 自己管理。这样做的好处是：

- Web 应用不用知道共享包内部文件结构。
- 组件移动或重命名时，优先只改 `packages/ui/src/index.ts`。
- Vite 可以直接编译 TypeScript 源码，不需要先单独构建 `packages/ui`。
- TypeScript 能正确补全类型，也能从 `@lumadock/ui` 跳转到真实源码。

需要注意的是，Vite alias 和 TypeScript `paths` 解决的是不同阶段的问题：Vite 管浏览器运行和打包，TypeScript 管类型检查和编辑器理解。两边都配置，是为了让“能运行”和“能类型检查/跳转”保持一致。

Vue 版的导入链路完全对应：

```ts
import { EmptyState, StatusBadge, SurfaceCard } from "@lumadock/ui-vue";
```

```text
apps/web-vue/src/pages/AdminPage.vue
  import { StatusBadge, SurfaceCard } from "@lumadock/ui-vue"
    -> Vite / TypeScript 解析 @lumadock/ui-vue
    -> packages/ui-vue/src/index.ts
    -> packages/ui-vue/src/StatusBadge.ts 或同名组件实现
```

这就是双框架并行实现的包边界：业务契约和设计 token 尽量共享，框架组件分包维护，避免让 React 组件反向牵制 Vue，也避免让 Vue SFC 进入 React 应用构建链路。

## 微前端取舍

当前项目不引入微前端运行时。原因是 LumaDock 仍是单一产品应用，路由、登录态、主题 token、API client 和发布节奏都高度共享；强行拆成多个运行时应用会增加构建、部署、通信和故障兜底成本。

适合考虑微前端的条件：

- 多个团队需要独立发布前端子应用。
- 业务域可以清楚拆分，并能独立测试、监控和回滚。
- 共享鉴权、设计系统、错误边界、跨应用通信和 fallback 规则已经成熟。

后续学习路线可以先了解两类方案：

| 方案              | 适合场景                                   | 本项目策略                 |
| ----------------- | ------------------------------------------ | -------------------------- |
| Module Federation | 多个 Vite/Webpack 应用之间做运行时模块组合 | 作为概念学习，不接入运行时 |
| single-spa        | 多框架或多应用需要统一挂载、卸载和路由编排 | 作为概念学习，不接入运行时 |

P3 的结论是：先把共享代码边界和测试纪律练扎实，再决定是否引入微前端。对当前学习项目来说，`packages/ui` 和 `packages/ui-vue` 已经足够展示大型工程的第一步拆分方式。
