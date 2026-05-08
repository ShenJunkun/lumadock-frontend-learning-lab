# 06 测试、构建与 git

## 前端验证

```powershell
npm.cmd --prefix frontend run typecheck
npm.cmd --prefix frontend run test
npm.cmd --prefix frontend run build
```

测试覆盖：

- 路由渲染。
- API client 成功和错误分支。
- 表单 zod 校验。
- Zustand 配置器状态。

## 后端验证

```powershell
conda run -n frontend-product-lab pytest backend
```

测试覆盖：

- `GET /health`
- 产品列表
- 产品详情
- 404
- lead 创建
- 字段校验
- SQLite 持久化统计

## E2E

```powershell
npm.cmd --prefix frontend run test:e2e
```

Playwright 覆盖首页、目录、详情和预约提交流程。测试会 mock lead 提交接口，因此不依赖真实后端。
`test:e2e` 脚本会自动启动并关闭 Vite dev server。

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

本项目独立在 `D:\code\frontend-learning-product-lab`，不要提交到 RadarAgent。
