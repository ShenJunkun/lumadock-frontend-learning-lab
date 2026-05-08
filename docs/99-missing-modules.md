# 99 待补充的学习模块

本文档列出当前项目作为前端学习项目尚未覆盖的重要技能，供后续扩展参考。

当前状态：P0 已完成。项目已经补齐 Tailwind 样式基础、Ant Design 组件库、ESLint/Prettier 工程规范，以及 JWT Demo Auth 权限认证。

---

## 一、CSS / 样式体系（重要）

| 缺失 | 说明 |
|---|---|
| **CSS Modules / Tailwind CSS** | P0 已选 Tailwind 作为局部布局和响应式工具类，`global.css` 保留设计变量与复杂视觉 |
| **响应式断点实践** | P0 已补 Tailwind 默认断点和 `xs` 断点，复杂页面仍保留少量 `@media` |
| **暗黑模式** | `color-scheme` 只设了 `light`，没有 dark mode 切换逻辑 |
| **CSS-in-JS**（了解即可）| styled-components / emotion，主流项目会遇到 |

---

## 二、组件库

| 缺失 | 说明 |
|---|---|
| **antd / shadcn/ui / MUI** | P0 已选 Ant Design，并接入 Table、Modal、Button、Result 示例 |
| **主题定制** | P0 已通过 `ConfigProvider` 注入 LumaDock 主题 token |
| **按需引入 / Tree-shaking** | P0 已使用 Antd v5 ESM 导入，后续可加 bundle 分析 |

推荐先学 `antd`（国内企业中后台），或 `shadcn/ui`（现代无样式组件，西方生态更主流）。

---

## 三、权限与认证（重要）

| 缺失 | 说明 |
|---|---|
| **登录/注册流程** | P0 已选 JWT Demo Auth，包含登录接口、`/me` 和 localStorage 教学方案 |
| **路由守卫** | P0 已补 `PrivateRoute` 和 `RoleRoute` |
| **权限控制** | P0 已补 admin/viewer 角色，并新增 admin-only leads API |

P0 已补 JWT Demo Auth、`/login`、`/admin`、admin/viewer 角色与路由守卫。

---

## 四、错误处理与用户体验（中等）

| 缺失 | 说明 |
|---|---|
| **全局错误边界** | React `ErrorBoundary`，防止组件崩溃导致白屏 |
| **Toast / 通知系统** | 操作结果反馈（成功/失败提示），可用 `react-hot-toast` 或 antd `message` |
| **骨架屏 Skeleton** | 加载状态的更好实现，替代纯文字 "Loading..." |
| **空状态页面** | 无数据时的引导 UI |

---

## 五、性能优化（重要）

| 缺失 | 说明 |
|---|---|
| **代码分割 / 懒加载** | `React.lazy` + `Suspense` 按路由分包，减少首屏体积 |
| **图片优化** | WebP 格式、`loading="lazy"`、响应式图片 `srcset` |
| **memo / useMemo / useCallback** | 避免不必要重渲染的实践 |
| **虚拟列表** | 大数据量列表渲染，可用 `@tanstack/react-virtual` |
| **Bundle 分析** | `rollup-plugin-visualizer` 查看打包体积分布 |

---

## 六、工程化（重要）

| 缺失 | 说明 |
|---|---|
| **ESLint + Prettier** | P0 已补 `lint`、`lint:fix`、`format`、`format:check` |
| **Git Hooks（husky + lint-staged）** | 提交前自动执行 lint / typecheck |
| **环境变量管理** | `.env.development` / `.env.production` 区分接口地址 |
| **CI/CD** | GitHub Actions 自动跑 typecheck + test + build |
| **部署** | Vercel / Nginx 部署前端，Railway / 容器部署后端 |

---

## 七、国际化 i18n（中等）

`react-i18next` 多语言支持，国内大厂项目几乎必备，涉及文案提取、语言切换、日期/数字格式化。

---

## 八、数据可视化（加分项）

`recharts` / `echarts-for-react` 做图表，管理后台必用技能。

---

## 九、微前端 / Monorepo（进阶）

`pnpm workspaces` / `nx` / `turborepo`，了解大型项目的工程结构和模块边界划分。

---

## 优先级建议

```
P0（已完成）：Tailwind + Ant Design + ESLint/Prettier + JWT 权限认证
P1（下一步建议）：错误边界 + Toast + 懒加载 + 环境变量 + CI/CD
P2（进阶，有余力）：i18n + 数据可视化 + 虚拟列表 + 微前端/Monorepo
```
