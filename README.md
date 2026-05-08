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

## 验证命令

```powershell
npm.cmd --prefix frontend run typecheck
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run format:check
npm.cmd --prefix frontend run test
npm.cmd --prefix frontend run build
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

## 学习路线

从 [docs/00-roadmap.md](docs/00-roadmap.md) 开始，按章节完成环境、HTML/CSS/JS/TS、React 组件、路由、状态、API、表单、动画、测试、构建和 git 提交流程。
