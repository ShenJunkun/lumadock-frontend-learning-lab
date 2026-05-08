# LumaDock Frontend Learning Product Lab

LumaDock 是一个完全独立的前端学习产品项目，用来练习 React、TypeScript、Node.js 前端工程、动效、交互设计，以及一个小型 FastAPI + SQLite 后端。它不调用任何大模型 API，也不和 RadarAgent 的业务或仓库产生关系。

## 项目结构

```text
.
├── frontend/              # Vite + React + TypeScript
├── backend/               # FastAPI + SQLite REST API
├── docs/                  # 学习章节、运行手册、git 流程
├── package.json           # Windows 友好的聚合脚本
└── README.md
```

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

## 环境准备

```powershell
conda create -n frontend-product-lab python=3.11 -y
conda run -n frontend-product-lab python -m pip install -r backend/requirements.txt
npm.cmd --prefix frontend install
```

## 开发运行

后端：

```powershell
conda run -n frontend-product-lab uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8001
```

前端：

```powershell
npm.cmd --prefix frontend run dev
```

前端 API 地址和 Mock 开关来自 `frontend/.env.*`：

```text
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_ENABLE_MOCKS=false
```

如果想脱离后端开发，可临时把 `VITE_ENABLE_MOCKS=true` 后启动前端。

## 验证命令

```powershell
npm.cmd --prefix frontend run typecheck
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run format:check
npm.cmd --prefix frontend run test
npm.cmd --prefix frontend run build
npm.cmd --prefix frontend run build:analyze
npm.cmd --prefix frontend run test:e2e
conda run -n frontend-product-lab pytest backend
```

Playwright E2E：

```powershell
npm.cmd --prefix frontend run test:e2e
```

首次运行 Playwright 如果提示缺少浏览器，需要执行：

```powershell
npm.cmd --prefix frontend exec playwright install
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
