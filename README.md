# LumaDock Frontend Learning Product Lab

LumaDock 是一个完全独立的前端学习产品项目，用来练习 React、TypeScript、Node.js 前端工程、动效、交互设计，以及一个小型 FastAPI + SQLite 后端。它不调用任何大模型 API，也不和 RadarAgent 的业务或仓库产生关系。

## 项目结构

这是一个 monorepo：前端、后端和共享包放在同一个仓库里统一管理，但运行时代码按职责分层，并不是把前后端业务逻辑写在同一个应用里。

```text
.
├── apps/
│   ├── web/               # Vite + React + TypeScript
│   └── api/               # FastAPI + SQLite REST API
├── packages/
│   ├── ui/                # Shared presentational UI primitives
│   └── api-client/        # Shared API client, schemas, and DTO types
├── docs/                  # 学习章节、运行手册、git 流程
├── package.json           # Windows 友好的聚合脚本
└── README.md
```

`apps/web` 是前端应用，`apps/api` 是 FastAPI 后端服务；`packages/ui` 提供共享展示组件，`packages/api-client` 只放前端调用后端所需的 TypeScript API client、Zod 契约和 DTO 类型。`apps/api/package.json` 只是为了让根目录 npm workspace 能统一代理 `api:dev` / `api:test` 脚本，不代表后端代码和前端代码混写。

## 默认端口

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8001`

## Demo 账号

- Admin: `admin@lumadock.local` / `admin123`
- Viewer: `viewer@lumadock.local` / `viewer123`

登录后访问 `/admin` 可以练习 JWT、路由守卫和角色权限。Admin 可以查看预约线索；Viewer 会看到无权限状态。

## 已覆盖能力

- P0：Tailwind、Ant Design、ESLint/Prettier、JWT Demo Auth。
- P1：ErrorBoundary、Antd message/notification、Skeleton、路由懒加载、bundle report、环境变量、GitHub Actions。
- P2：暗黑模式、响应式 WebP 图片、i18n、后台图表、虚拟列表、MSW、契约测试、A11y、git hooks、Vercel + Docker 部署配置。
- P8：Storybook 组件文档站、dnd-kit 配置优先级编排、SSR / Next.js 迁移评估。

## 环境准备

```powershell
conda create -n frontend-product-lab python=3.11 -y
conda run -n frontend-product-lab python -m pip install -r apps/api/requirements.txt
npm.cmd install
```

## 开发运行

后端：

```powershell
npm.cmd run api:dev
```

前端：

```powershell
npm.cmd run web:dev
```

前端 API 地址和 Mock 开关来自 `apps/web/.env.*`：

```text
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_ENABLE_MOCKS=false
```

如果想脱离后端开发，可临时把 `VITE_ENABLE_MOCKS=true` 后启动前端。

## 验证命令

```powershell
npm.cmd run web:typecheck
npm.cmd run web:lint
npm.cmd run web:format
npm.cmd run web:test
npm.cmd run web:build
npm.cmd run web:build:analyze
npm.cmd run web:e2e
npm.cmd run ui:typecheck
npm.cmd run ui:build-storybook
npm.cmd run api-client:typecheck
npm.cmd run api:test
```

Playwright E2E：

```powershell
npm.cmd run web:e2e
```

首次运行 Playwright 如果提示缺少浏览器，需要执行：

```powershell
npm.cmd --workspace @lumadock/web exec playwright install
```

## 部署演练

前端可用根目录 `vercel.json` 部署到 Vercel，并在 Vercel 环境变量中设置 `VITE_API_BASE_URL`。

后端可用 Docker Compose 本地演练：

```powershell
docker compose up --build
```

生产环境需要设置 `CORS_ORIGINS` 为前端域名，多个来源用英文逗号分隔。

## 学习路线

从 [docs/00-roadmap.md](docs/00-roadmap.md) 开始。已完成/待完成能力清单见 [docs/99-missing-modules.md](docs/99-missing-modules.md)。
