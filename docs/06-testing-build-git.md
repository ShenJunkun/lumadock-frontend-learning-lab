# 06 测试、构建与 git

## 前端验证

```powershell
npm.cmd run web:lint
npm.cmd run web:format
npm.cmd run web:typecheck
npm.cmd run web:test
npm.cmd run web:build
```

测试覆盖：

- 路由渲染。
- API client 成功和错误分支。
- Zod API contract schema。
- ErrorBoundary、Skeleton、Route focus、偏好设置。
- 表单 zod 校验。
- Zustand 配置器状态。

## 后端验证

```powershell
npm.cmd run api:test
```

测试覆盖：

- `GET /health`
- 产品列表
- 产品详情
- 404
- lead 创建
- 字段校验
- SQLite 持久化统计
- OpenAPI contract shape
- `CORS_ORIGINS` 环境变量解析

## E2E

```powershell
npm.cmd run web:e2e
```

Playwright 覆盖首页、目录、详情、预约提交、登录权限和基础 A11y。E2E 通过 `VITE_ENABLE_MOCKS=true` 启用 MSW，因此不依赖真实后端。
`test:e2e` 脚本会自动启动并关闭 Vite dev server。
E2E 也覆盖访客跳登录、admin 登录进入后台、viewer 被角色权限拦截。

## Bundle 分析

```powershell
npm.cmd run web:build:analyze
```

该命令会在 `apps/web/dist/bundle-report.html` 生成 `rollup-plugin-visualizer` 报告，用来观察 Antd、Three、Framer Motion、Recharts 等依赖体积。

## git 提交流程

推荐粒度：

```text
chore: scaffold independent learning project
docs: add frontend learning roadmap
feat(frontend): add responsive app shell and routing
feat(frontend): add animated product landing page
feat(frontend): add interactive product showcase
feat(frontend): add catalog and detail pages
feat(backend): add FastAPI product service
feat(frontend): connect API data layer
feat(frontend): add lead form validation
test: add frontend and backend coverage
docs: complete project tutorial and runbook
```

本项目独立在 `D:\code\frontend-learning-product-lab`，提交前确认目标仓库和当前分支。

## 代码规范

前端使用 ESLint 做 TypeScript、React Hooks 和 React Refresh 规则检查，Prettier 负责格式统一：

```powershell
npm.cmd run web:lint
npm.cmd --workspace @lumadock/web run lint:fix
npm.cmd run web:format
npm.cmd --workspace @lumadock/web run format
```

提交前可安装 git hook：

```powershell
npm.cmd run hooks:install
```

`pre-commit` 会通过 `lint-staged.config.mjs` 对暂存的前端代码和文档执行 ESLint/Prettier。
