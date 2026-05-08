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

当前仓库继续保留 `frontend/`、`backend/` 和 `docs/` 顶层目录。P3 只先规划未来边界，并用轻量原型验证共享代码怎么被消费。

未来如果进入完整 monorepo 迁移，可以按下面职责拆分：

| 目标包 | 当前来源 | 职责 | 依赖方向 |
| --- | --- | --- | --- |
| `apps/web` | `frontend/` | Vite React 应用、路由、页面、E2E 和前端构建脚本 | 可依赖 `packages/ui`、`packages/api-client` |
| `apps/api` | `backend/` | FastAPI 应用、SQLite 模型、OpenAPI、后端测试 | 不依赖前端包 |
| `packages/ui` | 新增教学原型 | 可复用展示组件、设计 token 映射和基础交互组件 | 不依赖业务页面或 API |
| `packages/api-client` | `frontend/src/api` 的未来抽取目标 | 前端 API client、契约 schema 和请求错误类型 | 可被 `apps/web` 依赖 |

本轮默认策略是 `teaching-prototype`：先让 `packages/ui` 作为可运行样例存在，暂不引入 workspace 管理器，也不移动 `frontend/` 或 `backend/`。这样每个提交的 diff 都集中在一个学习点，后续再单独练习完整迁移。

## Shared UI package 原型

本轮新增 `packages/ui` 作为共享 UI 教学原型，并通过 `@lumadock/ui` alias 被 `frontend` 消费。它展示的是包边界，而不是完整 workspace：

- `packages/ui` 暴露纯展示组件，不读取路由、不请求 API、不依赖业务 store。
- `frontend` 仍然是唯一 Vite 应用，只在学习页导入共享组件。
- `frontend/tsconfig.json` 和 `frontend/vite.config.ts` 负责把 `@lumadock/ui` 指向本地源码。
- 后续完整迁移时，可以把这个 alias 替换为 workspace package 解析，并把 UI package 的构建、测试和发布规则单独补齐。
