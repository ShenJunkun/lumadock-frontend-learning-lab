# 99 待补充的学习模块

本文档列出当前项目作为前端学习项目尚未覆盖的重要技能，供后续扩展参考。

当前状态：P0、P1、P2 已完成。项目已经补齐 Tailwind 样式基础、Ant Design 组件库、ESLint/Prettier 工程规范、JWT Demo Auth 权限认证，以及稳定性、性能、工程交付和常见业务增强能力。

---

## 下一步推荐路线

P1 与 P2 已按拆分提交完成。后续建议进入 P3，用来理解更大型团队的工程组织方式。

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
| **CSS-in-JS**（了解即可）      | P3 了解：styled-components / emotion，主流项目会遇到                             |

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

P3 进阶：`pnpm workspaces` / `nx` / `turborepo`，了解大型项目的工程结构和模块边界划分。可以把项目拆成 `apps/web`、`apps/api`、`packages/ui`、`packages/api-client`。

---

## 优先级建议

```
P0（已完成）：Tailwind + Ant Design + ESLint/Prettier + JWT 权限认证
P1（已完成）：错误边界 + Toast/Notification + Skeleton + 路由懒加载 + Bundle 分析 + 环境变量 + CI/CD
P2（已完成）：暗黑模式 + 图片优化 + i18n + 数据可视化 + 虚拟列表 + MSW + A11y + 部署
P3（进阶架构）：CSS-in-JS 对比学习 + Monorepo + 微前端
```

## 下一轮最推荐实现：P3

如果继续推进，建议做 P3，并继续保持“一个功能一个 commit”：

1. `docs: compare css-in-js options`
2. `chore: plan monorepo package boundaries`
3. `feat: prototype shared ui package`
4. `docs: document microfrontend tradeoffs`

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
