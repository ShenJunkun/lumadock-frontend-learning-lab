# 99 待补充的学习模块

本文档列出当前项目作为前端学习项目尚未覆盖的重要技能，供后续扩展参考。

当前状态：P0、P1、P2、P3、P4 已完成，P5 正在补更全面的前端专项能力。项目已经补齐 Tailwind 样式基础、Ant Design 组件库、ESLint/Prettier 工程规范、JWT Demo Auth 权限认证，以及稳定性、性能、工程交付、常见业务增强、进阶架构学习和生产前端能力。

---

## 下一步推荐路线

P4 已按拆分提交完成：SEO/head、隐私友好 telemetry、React Query 数据预取和预约表单草稿恢复均已有文档与测试。当前进入 P5：PWA / 离线、Web Vitals / 性能预算、安全隐私加固，以及后续视觉回归、设计系统深化和状态建模。

### P1：产品稳定性与交付能力（已完成）

| 模块                 | 要做什么                                                                   | 验收标准                                              |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| **全局错误边界**     | 已增加 React `ErrorBoundary`，包住路由页面和关键产品展示区域               | 组件抛错时不白屏，显示可恢复的错误页                  |
| **Toast / 通知系统** | 已使用 Antd `message` / `notification` 统一成功、失败、权限提示            | 登录、退出、预约提交、后台加载失败都有一致反馈        |
| **Skeleton 骨架屏**  | 已用 Antd `Skeleton` 替换主要页面中的纯文字 Loading                        | 首页、产品列表、详情页、后台表格加载更自然            |
| **路由懒加载**       | 已用 `React.lazy` + `Suspense` 拆分页面                                    | `build:analyze` 可看到分包结果                        |
| **Bundle 分析**      | 已引入 `rollup-plugin-visualizer`                                          | `frontend/dist/bundle-report.html` 生成 bundle report |
| **环境变量管理**     | 已增加 `.env.development`、`.env.production`、`.env.example`、`.env.test`  | API 地址通过 `VITE_API_BASE_URL` 配置                 |
| **CI/CD**            | 已增加 GitHub Actions 跑 lint、format、typecheck、test、build、E2E、pytest | 每次 push / PR 自动验证                               |

---

## 一、CSS / 样式体系（重要）

| 缺失                           | 说明                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------- |
| **CSS Modules / Tailwind CSS** | P0 已选 Tailwind 作为局部布局和响应式工具类，`global.css` 保留设计变量与复杂视觉 |
| **响应式断点实践**             | P0 已补 Tailwind 默认断点和 `xs` 断点，复杂页面仍保留少量 `@media`               |
| **暗黑模式**                   | P2 已完成：增加 theme store、Antd dark algorithm、Tailwind dark class            |
| **CSS-in-JS**（了解即可）      | P3 已完成：对比 styled-components / emotion / Antd token / 当前样式体系          |

---

## 二、组件库

| 缺失                        | 说明                                                         |
| --------------------------- | ------------------------------------------------------------ |
| **antd / shadcn/ui / MUI**  | P0 已选 Ant Design，并接入 Table、Modal、Button、Result 示例 |
| **主题定制**                | P0 已通过 `ConfigProvider` 注入 LumaDock 主题 token          |
| **按需引入 / Tree-shaking** | P0 已使用 Antd v5 ESM 导入，后续可加 bundle 分析             |

推荐先学 `antd`（国内企业中后台），或 `shadcn/ui`（现代无样式组件，西方生态更主流）。

---

## 三、权限与认证（重要）

| 缺失              | 说明                                                                |
| ----------------- | ------------------------------------------------------------------- |
| **登录/注册流程** | P0 已选 JWT Demo Auth，包含登录接口、`/me` 和 localStorage 教学方案 |
| **路由守卫**      | P0 已补 `PrivateRoute` 和 `RoleRoute`                               |
| **权限控制**      | P0 已补 admin/viewer 角色，并新增 admin-only leads API              |

P0 已补 JWT Demo Auth、`/login`、`/admin`、admin/viewer 角色与路由守卫。

---

## 四、错误处理与用户体验（中等）

| 缺失                 | 说明                                                       |
| -------------------- | ---------------------------------------------------------- |
| **全局错误边界**     | P1 已完成：React `ErrorBoundary`，防止组件崩溃导致白屏     |
| **Toast / 通知系统** | P1 已完成：用 Antd `message` / `notification` 统一操作反馈 |
| **骨架屏 Skeleton**  | P1 已完成：用 Antd `Skeleton` 优化加载状态                 |
| **空状态页面**       | 已有基础 EmptyState，后台图表无数据使用 Antd `Empty`       |

---

## 五、性能优化（重要）

| 缺失                             | 说明                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| **代码分割 / 懒加载**            | P1 已完成：`React.lazy` + `Suspense` 按路由分包              |
| **图片优化**                     | P2 已完成：WebP 格式、`loading="lazy"`、响应式图片 `srcset`  |
| **memo / useMemo / useCallback** | P2 已覆盖：关键过滤、表格列和派生统计使用 memo/纯函数        |
| **虚拟列表**                     | P2 已完成：后台 Lead activity 使用 `@tanstack/react-virtual` |
| **Bundle 分析**                  | P1 已完成：`rollup-plugin-visualizer` 查看体积分布           |

---

## 六、工程化（重要）

| 缺失                                 | 说明                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| **ESLint + Prettier**                | P0 已补 `lint`、`lint:fix`、`format`、`format:check`                               |
| **Git Hooks（husky + lint-staged）** | P2 已完成：提交前自动执行 lint / format                                            |
| **环境变量管理**                     | P1 已完成：`.env.development` / `.env.production` 区分接口地址                     |
| **CI/CD**                            | P1 已完成：GitHub Actions 自动跑 lint、format、typecheck、test、build、E2E、pytest |
| **部署**                             | P2 已完成：Vercel 部署前端，Docker Compose 演练后端                                |

---

## 七、国际化 i18n（中等）

P2 已完成：`react-i18next` 多语言支持。首次跟随浏览器语言，手动切换后持久化，并与 Antd `ConfigProvider` locale 联动。

---

## 八、数据可视化（加分项）

P2 已完成：使用 `recharts` 在 `/admin` 增加 leads 趋势、产品预约占比、配置偏好统计。

---

## 九、API Mock 与前端独立开发（建议补）

| 缺失                        | 说明                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| **MSW Mock Service Worker** | P2 已完成：mock 产品、登录、后台 leads API，让前端脱离后端也能开发和测试  |
| **契约测试**                | P2 已完成：前端 Zod schema + 后端 OpenAPI shape 测试，避免 API shape 漂移 |

---

## 十、可访问性 A11y（建议补）

| 缺失           | 说明                                                     |
| -------------- | -------------------------------------------------------- |
| **键盘导航**   | P2 已完成：增加 skip link，并保留 Antd/原生控件键盘能力  |
| **焦点管理**   | P2 已完成：路由切换聚焦主内容，表单错误使用 RHF 自动聚焦 |
| **颜色对比度** | P2 已完成：增加 axe E2E 扫描，亮色/暗色变量按对比度调整  |

---

## 十一、微前端 / Monorepo（进阶）

P3 已完成：当前保留 `frontend/` 与 `backend/` 主目录不迁移，新增 `packages/ui` 教学原型，并在文档中规划未来 `apps/web`、`apps/api`、`packages/ui`、`packages/api-client` 边界。

微前端已完成取舍记录：当前项目不接入 Module Federation 或 single-spa，因为单一产品应用的路由、鉴权、主题和发布节奏仍高度共享。后续只有在多团队独立发布、业务域可独立回滚、共享治理成熟时再考虑引入。

---

## 十二、P4 生产前端能力（进行中）

| 模块 | 说明 | 状态 |
| --- | --- | --- |
| **SEO / Head 元数据** | 按 route 设置 `document.title` 和 meta description，覆盖核心页面与 404 | 已完成 |
| **隐私友好 telemetry** | 本地记录 page view 与关键业务事件，避免采集姓名、邮箱等 PII | 已完成 |
| **数据预取** | 用 React Query 在 hover/focus 等 intent 交互时预取详情数据 | 已完成 |
| **表单草稿恢复** | 用 `sessionStorage` 保存预约草稿，提交成功后清理 | 已完成 |

P4 目标不是接入复杂平台，而是先理解生产前端常见的“非业务主流程”能力：SEO、可观测性、数据体验和表单韧性。详细实现记录见 `docs/09-p4-production-readiness.md`。

---

## 优先级建议

```
P0（已完成）：Tailwind + Ant Design + ESLint/Prettier + JWT 权限认证
P1（已完成）：错误边界 + Toast/Notification + Skeleton + 路由懒加载 + Bundle 分析 + 环境变量 + CI/CD
P2（已完成）：暗黑模式 + 图片优化 + i18n + 数据可视化 + 虚拟列表 + MSW + A11y + 部署
P3（已完成）：CSS-in-JS 对比学习 + Monorepo 边界 + shared UI 原型 + 微前端取舍
P4（已完成）：SEO/head + telemetry + 数据预取 + 表单草稿恢复
P5（进行中）：PWA/离线 + 性能预算 + 安全隐私 + 视觉回归 + 设计系统深化 + 状态建模
```

## 后续可选路线：P5 更全面的前端技术

P5 建议按主题继续拆分，每个主题仍保持文档和测试。详细实现记录见 `docs/10-p5-frontend-mastery.md`。

| 模块 | 说明 | 状态 |
| --- | --- | --- |
| **PWA / 离线能力** | Service Worker 缓存静态壳层、`manifest.webmanifest`、离线 fallback | 已完成 |
| **Web Vitals / 性能预算** | 记录 LCP、CLS、INP，给 bundle 和页面性能设预算 | 已完成 |
| **安全与隐私加固** | CSP 学习、表单敏感字段策略、错误日志脱敏、依赖审计 | 已完成 |
| **可视化回归测试** | 用 Playwright screenshot 做关键页面视觉保护 | 待完成 |
| **设计系统深化** | 把 token、组件状态、暗黑模式和文档示例进一步沉到 `packages/ui` | 待完成 |
| **状态建模** | 用 reducer 或 state machine 明确复杂流程状态，避免隐式布尔组合 | 待完成 |

## 后续可选路线：完整 workspace 迁移

如果继续推进，可以单独做一次完整 workspace 迁移，并继续保持“一个功能一个 commit”：

1. `chore: add workspace package manager config`
2. `refactor: move web app into apps web`
3. `refactor: move api into apps api`
4. `chore: split shared api client package`

每个功能都应同步更新文档和测试。最终验证仍使用：

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run format:check
npm.cmd --prefix frontend run typecheck
npm.cmd --prefix frontend run test
npm.cmd --prefix frontend run build
npm.cmd --prefix frontend run build:analyze
npm.cmd --prefix frontend run test:e2e
conda run -n frontend-product-lab pytest backend
```
