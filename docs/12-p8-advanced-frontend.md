# 12 P8 高级前端专项

P8 的目标是选 1-2 个高级方向做深，而不是把所有复杂技术一次塞进主应用。本轮选择：

- Storybook / 组件文档站：让 `packages/ui` 可以脱离业务应用独立预览。
- 复杂交互：在产品配置器中加入 dnd-kit sortable 的配置优先级编排。
- Vue 并行实现：用 `apps/web-vue` 做框架迁移和对照学习实战。
- SSR / Next.js：补迁移评估文档，不创建新 app，不迁移主应用。

## Storybook 组件文档站

`packages/ui` 新增 React + Vite Storybook。组件文档站只服务共享 UI 包，不读取业务路由、Zustand store、React Query 或 API client。

新增脚本：

```powershell
npm.cmd run ui:storybook
npm.cmd run ui:build-storybook
```

当前 stories 覆盖：

| 组件                        | 覆盖重点                                         |
| --------------------------- | ------------------------------------------------ |
| `Button`                    | primary / secondary / ghost、disabled、icon slot |
| `StatusBadge`               | neutral / accent / success / warning 状态矩阵    |
| `EmptyState`                | 默认和紧凑场景                                   |
| `SurfaceCard`               | 组合内容和响应式 repeated item                   |
| `LearningArchitecturePanel` | workspace 边界说明和响应式网格                   |

Storybook 预览提供 light / dark theme toolbar 和 auto / mobile / tablet / desktop width toolbar。主题变量在 `packages/ui/.storybook/preview.css` 内定义，避免共享 UI 包反向依赖 `apps/web` 的全局样式。

## 复杂交互：配置优先级编排

产品配置器新增 `Setup priority` 列表，用来调整配置关注顺序。排序结果保存在 `useConfiguratorStore.priorityOrder`，并通过 `snapshot()` 写入预约提交的 `configuration`。

交互边界：

- 使用 dnd-kit 的 `DndContext`、`SortableContext`、pointer sensor 和 keyboard sensor。
- 使用 `sortableKeyboardCoordinates` 支持键盘拖拽模型。
- 每个条目保留 drag handle，同时提供上移 / 下移按钮，保证键盘和测试路径稳定。
- `normalizePriorityOrder` 会去掉重复或未知 id，并补齐缺失项，避免无效配置污染提交快照。

本轮没有做低代码表单编辑器，因为当前业务表单字段少、校验清楚，引入 schema-driven form 会比收益更重。后续只有当表单字段来源、条件显隐或多角色配置变复杂时，再抽象 schema 渲染层。

## Vue 并行实现：框架迁移与对照

P8 之后新增 `apps/web-vue` 和 `packages/ui-vue`，作为同一产品的 Vue 3 并行实现。它不是生产替换，也不切换部署主入口，而是用一套已经稳定的 React 产品作为基线，练习框架迁移时最重要的几件事：

- 路由保持一致：`/`、`/products`、`/products/:productId`、`/book`、`/learn`、`/login`、`/admin`、404。
- API 契约保持一致：继续通过 `@lumadock/api-client` 请求 FastAPI。
- 状态职责保持一致：React 版用 Zustand，Vue 版用 Pinia。
- 服务端数据职责保持一致：React Query 对照 Vue Query。
- 组件库职责保持一致：Ant Design 对照 Ant Design Vue，`packages/ui` 对照 `packages/ui-vue`。
- 3D 能力保持一致：React Three Fiber 对照原生 Three.js。
- 可见业务文案保持一致，只把描述框架的 `React` 替换为 `Vue`。

这类迁移练习最重要的是“不重新发明产品”。先固定业务、路由、数据和视觉，再比较框架差异，才能看清 Vue 的 SFC、模板指令、响应式系统、Pinia store、Vue Router guard 到底解决了哪些问题。

## SSR / Next.js 迁移评估

当前主应用继续保持 Vite SPA。原因：

| 维度     | 当前 SPA                                                                    | SSR / Next.js 迁移判断                                            |
| -------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| SEO      | P4 已补 route title 和 meta description，产品内容可通过前端渲染满足学习目标 | 如果未来需要搜索引擎抓取大量动态产品页，再评估 SSG                |
| 数据加载 | React Query + local fallback 已覆盖加载、错误、预取和 mock 开发             | SSR 会引入服务端认证、缓存、部署和数据安全边界                    |
| 部署     | Vercel 静态前端 + FastAPI 后端边界简单                                      | Next.js 会新增 Node/Edge runtime 选择和 server component 数据策略 |
| 学习收益 | 当前阶段更需要组件文档和复杂交互实战                                        | 迁移主应用会分散 P8 主线，并增加框架学习噪音                      |

如果未来启动 Next.js 原型，应保持边界清晰：

- 只建独立 prototype，不直接迁移 `apps/web`。
- 优先选择产品详情页做 SSG / SSR 对比。
- 不复用浏览器-only store 作为服务端数据源。
- 记录 server-side data access、缓存、鉴权和部署成本。

## 验收方式

```powershell
npm.cmd run web:lint
npm.cmd run web:typecheck
npm.cmd run web:test
npm.cmd run web:build
npm.cmd run web:e2e
npm.cmd run vue:lint
npm.cmd run vue:typecheck
npm.cmd run vue:test
npm.cmd run vue:build
npm.cmd run vue:e2e
npm.cmd run ui:typecheck
npm.cmd run ui:build-storybook
```

如视觉截图因为配置器新增排序区域发生合理变化，更新 Playwright snapshots 前必须人工确认桌面和移动端没有重叠、裁切或不可读文本。

## 本轮未做

- 不创建 Next.js app，也不迁移主应用。
- 不把 Vue 并行实现改成生产主入口；当前仍以 React 版作为对照基线。
- 不做 Module Federation 或 single-spa 原型，因为当前仍是单团队、单产品、共享发布节奏。
- 不推进 P9-P12。它们继续作为远期研究路线，等项目真的出现平台化、增长实验、多端或 AI 前端诉求时再启动。
