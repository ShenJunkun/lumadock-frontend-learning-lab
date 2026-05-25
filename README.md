# 🚀 LumaDock Frontend Learning Product Lab

LumaDock 是一个用于练习现代前端工程的产品展示与预约平台。它用一个虚构的桌面扩展坞产品作为业务外壳，把 React、Vue、TypeScript、Vite、组件化、路由、状态管理、接口请求、表单、动画、测试、构建和部署流程串成一个完整项目。

项目包含一个小型本地后端：FastAPI + SQLite。前端会请求本地 API，也可以在后端不可用时使用 fallback 数据继续开发。

## ✨ 项目定位

这个仓库不是单纯的静态页面，也不是纯后端 API。它更像一个“前端学习用的全栈产品样板”：

- 🖥️ 产品官网：首页、产品列表、产品详情、预约页面。
- 🧩 前端工程：React 主应用 + Vue 并行实现，覆盖 TypeScript、Vite、路由、查询缓存和状态管理。
- 🎨 交互体验：响应式布局、暗黑模式、i18n、动画、3D 产品预览。
- 🔐 本地后端：FastAPI、SQLite、JWT Demo Auth、Admin 页面。
- 🧪 工程质量：ESLint、Prettier、Vitest、Playwright、pytest、Storybook。

## 🧱 技术栈

```text
Frontend  → React + Vue + TypeScript + Vite
Backend   → FastAPI + SQLite
UI        → Tailwind CSS + Ant Design + Shared UI package
State     → React Query + Zustand / Vue Query + Pinia
Testing   → Vitest + Testing Library + Playwright + pytest
Monorepo  → npm workspaces
Deploy    → Vercel config + Docker Compose demo
```

## 📁 项目结构

这是一个 monorepo：前端、后端和共享包放在同一个仓库里统一管理，但运行时代码按职责分层。

```text
.
├── apps/
│   ├── web/               # Vite + React + TypeScript
│   ├── web-vue/           # Vite + Vue + TypeScript parity app
│   └── api/               # FastAPI + SQLite REST API
├── packages/
│   ├── ui/                # Shared presentational UI primitives
│   └── api-client/        # Shared API client, schemas, and DTO types
├── docs/                  # 学习章节、运行手册、技术选型说明
├── package.json           # npm workspace 聚合脚本
└── README.md              # GitHub 入口文档
```

`apps/web` 是 React 前端应用，`apps/web-vue` 是同 UI/功能的 Vue 并行实现，`apps/api` 是 FastAPI 后端服务。`packages/ui` 和 `packages/ui-vue` 分别提供 React/Vue 共享展示组件，`packages/api-client` 放前端调用后端所需的 TypeScript API client、Zod 契约和 DTO 类型。

仓库里的多个 `package.json` 使用的是 JavaScript / TypeScript / Node.js 生态常见的 npm workspaces 管理方式。根目录 `package.json` 负责声明 workspace、统一安装依赖和转发脚本；各子项目的 `package.json` 描述自己的包名、依赖和可执行脚本。更完整的关系说明见 [docs/01-environment.md](docs/01-environment.md)。

## 🌐 默认端口

- 🧭 React Frontend: `http://127.0.0.1:5173`
- 🧭 Vue Frontend: `http://127.0.0.1:5174`
- 🔌 Backend: `http://127.0.0.1:8001`

## 🔐 Demo 账号

- 👑 Admin: `admin@lumadock.local` / `admin123`
- 👀 Viewer: `viewer@lumadock.local` / `viewer123`

登录后访问 `/admin` 可以练习 JWT、路由守卫和角色权限。Admin 可以查看预约线索；Viewer 会看到无权限状态。

## ✅ 已覆盖能力

- P0：Tailwind、Ant Design、ESLint/Prettier、JWT Demo Auth。
- P1：ErrorBoundary、Antd message/notification、Skeleton、路由懒加载、bundle report、环境变量、GitHub Actions。
- P2：暗黑模式、响应式 WebP 图片、i18n、后台图表、虚拟列表、MSW、契约测试、A11y、git hooks、Vercel + Docker 部署配置。
- P8：Storybook 组件文档站、dnd-kit 配置优先级编排、SSR / Next.js 迁移评估。

## 🛠️ 环境准备

```powershell
conda create -n frontend-product-lab python=3.11 -y
conda run -n frontend-product-lab python -m pip install -r apps/api/requirements.txt
npm.cmd install
```

## ▶️ 开发运行

这两个命令需要在仓库根目录执行。根目录 `package.json` 通过 npm workspaces 把命令分发给对应子项目：

- `npm.cmd run api:dev` → 根脚本 `api:dev` → `npm --workspace @lumadock/api run dev` → `apps/api/package.json` 的 `dev` 脚本。
- `npm.cmd run web:dev` → 根脚本 `web:dev` → `npm --workspace @lumadock/web run dev` → `apps/web/package.json` 的 `dev` 脚本。

后端：

```powershell
npm.cmd run api:dev
```

后端 workspace 的 `dev` 脚本会执行：

```powershell
conda run -n frontend-product-lab uvicorn app.main:app --app-dir . --reload --host 127.0.0.1 --port 8001
```

这会用 `frontend-product-lab` 这个 conda 环境启动 Uvicorn。Uvicorn 会导入 `apps/api/app/main.py` 里的 `app` 这个 FastAPI 实例，初始化 SQLite 数据库和种子数据，然后在 `http://127.0.0.1:8001` 提供 REST API。

前端：

```powershell
npm.cmd run web:dev
```

前端 workspace 的 `dev` 脚本会执行 `vite --host 127.0.0.1 --port 5173`。Vite 读取 `apps/web/vite.config.ts`、`apps/web/index.html` 和 `apps/web/src/main.tsx`，启动 React 开发服务器，并通过 `apps/web/.env.development` 里的 `VITE_API_BASE_URL=http://127.0.0.1:8001` 调用本地后端。

Vue 并行前端：

```powershell
npm.cmd run vue:dev
```

Vue workspace 的 `dev` 脚本会执行 `vite --host 127.0.0.1 --port 5174`。它读取 `apps/web-vue/vite.config.ts`、`apps/web-vue/index.html` 和 `apps/web-vue/src/main.ts`，使用同一个 FastAPI 后端和同一套 API client。

## ⚙️ 前端环境变量

前端 API 地址和 Mock 开关来自 `apps/web/.env.*`：

```text
VITE_API_BASE_URL=http://127.0.0.1:8001
VITE_ENABLE_MOCKS=false
```

如果想脱离后端开发，可临时把 `VITE_ENABLE_MOCKS=true` 后启动前端。

## 🧪 验证命令

```powershell
npm.cmd run web:typecheck
npm.cmd run web:lint
npm.cmd run web:format
npm.cmd run web:test
npm.cmd run web:build
npm.cmd run web:build:analyze
npm.cmd run web:e2e
npm.cmd run vue:typecheck
npm.cmd run vue:lint
npm.cmd run vue:format
npm.cmd run vue:test
npm.cmd run vue:build
npm.cmd run vue:build:analyze
npm.cmd run vue:e2e
npm.cmd run ui:typecheck
npm.cmd --workspace @lumadock/ui-vue run typecheck
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

## 🚢 部署演练

前端可用根目录 `vercel.json` 部署到 Vercel，并在 Vercel 环境变量中设置 `VITE_API_BASE_URL`。

后端可用 Docker Compose 本地演练：

```powershell
docker compose up --build
```

生产环境需要设置 `CORS_ORIGINS` 为前端域名，多个来源用英文逗号分隔。

## 📚 学习路线

- 🧭 从 [docs/00-roadmap.md](docs/00-roadmap.md) 开始。
- 🧱 环境、workspace 和启动链路见 [docs/01-environment.md](docs/01-environment.md)。
- 🧠 React Web / React Native / uni-app / Flutter 的区别见 [docs/13-technology-choices.md](docs/13-technology-choices.md)。
- 🗺️ 已完成/待完成能力清单见 [docs/99-missing-modules.md](docs/99-missing-modules.md)。
