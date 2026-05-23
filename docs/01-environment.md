# 01 环境搭建

## Node 和 npm

Windows 下优先使用 `npm.cmd`：

```powershell
node --version
npm.cmd --version
npm.cmd install
```

## Python 和 conda

后端使用 Python 3.11：

```powershell
conda create -n frontend-product-lab python=3.11 -y
conda run -n frontend-product-lab python -m pip install -r apps/api/requirements.txt
```

## 启动服务

本仓库是 monorepo，前端和后端放在同一个仓库中统一安装依赖、统一运行脚本，但代码边界是分开的：

- `apps/web` 是 Vite + React 前端应用。
- `apps/api` 是 FastAPI + SQLite 后端服务。
- `packages/ui` 是前端共享 UI 组件包。
- `packages/api-client` 是前端调用后端用的 TypeScript API client 和类型契约。

因此 `npm.cmd run api:dev` 只是通过根目录 workspace 脚本启动 Python 后端，后端业务代码仍然在 `apps/api/app` 下，不和前端页面代码混写。

### 为什么根目录命令能启动服务

Windows 下执行的是 `npm.cmd`，它是 Node.js 安装时提供给 PowerShell/cmd 使用的 npm 命令入口。执行 `npm.cmd run <script>` 时，npm 会读取当前目录的 `package.json`，找到同名脚本并执行。

根目录 `package.json` 里声明了 workspaces：

```json
[
  "apps/web",
  "apps/api",
  "packages/*"
]
```

所以 npm 知道 `apps/web/package.json` 里的包名是 `@lumadock/web`，`apps/api/package.json` 里的包名是 `@lumadock/api`。根目录脚本再把命令转发到对应 workspace：

```json
{
  "api:dev": "npm --workspace @lumadock/api run dev",
  "web:dev": "npm --workspace @lumadock/web run dev"
}
```

### 后端启动链路

```text
npm.cmd run api:dev
  -> 根目录 package.json 的 api:dev
  -> npm --workspace @lumadock/api run dev
  -> apps/api/package.json 的 dev
  -> conda run -n frontend-product-lab uvicorn app.main:app --app-dir . --reload --host 127.0.0.1 --port 8001
```

这一串命令做了几件事：

- `npm --workspace @lumadock/api run dev` 让 npm 进入 `apps/api` 这个 workspace 执行脚本。
- `conda run -n frontend-product-lab ...` 使用已安装 FastAPI、Uvicorn、SQLAlchemy 等依赖的 Python 环境。
- `uvicorn app.main:app` 导入 `apps/api/app/main.py`，找到里面名为 `app` 的 FastAPI 实例。
- `--app-dir .` 让 Uvicorn 以 `apps/api` 作为应用导入目录。
- `--reload` 开启开发模式热重载，Python 文件变化后会自动重启服务。
- `--host 127.0.0.1 --port 8001` 把后端服务监听在 `http://127.0.0.1:8001`。

FastAPI 应用启动时会执行 `lifespan`：初始化 SQLite 表结构、写入 demo 产品和用户数据，然后注册认证、后台管理和产品等 REST API 路由。默认数据库文件是 `apps/api/lumadock.db`。

### 前端启动链路

```text
npm.cmd run web:dev
  -> 根目录 package.json 的 web:dev
  -> npm --workspace @lumadock/web run dev
  -> apps/web/package.json 的 dev
  -> vite --host 127.0.0.1 --port 5173
```

这一串命令做了几件事：

- `npm --workspace @lumadock/web run dev` 让 npm 进入 `apps/web` 这个 workspace 执行脚本。
- npm 会把可执行依赖加入脚本的 `PATH`，所以脚本里可以直接写 `vite`。
- Vite 读取 `apps/web/vite.config.ts`，加载 React 插件、路径 alias、dev server host/port 等配置。
- Vite 从 `apps/web/index.html` 进入前端应用，再加载 `apps/web/src/main.tsx` 和后续 React 代码。
- `apps/web/.env.development` 提供 `VITE_API_BASE_URL=http://127.0.0.1:8001`，前端的 API client 会用这个地址请求本地 FastAPI。

完整运行关系是：浏览器访问 `http://127.0.0.1:5173` 的 Vite 前端；前端通过 `packages/api-client` 发起 `fetch` 请求到 `http://127.0.0.1:8001`；FastAPI 路由处理请求并读写 SQLite；响应返回前端后由 React 渲染页面。

后端：

```powershell
npm.cmd run api:dev
```

前端：

```powershell
npm.cmd run web:dev
```

浏览器打开 `http://127.0.0.1:5173`。

## 常见问题

- 如果前端提示 API unavailable，说明后端没有运行；页面会继续使用 fallback 产品数据。
- 如果 Playwright 提示缺少浏览器，执行 `npm.cmd --workspace @lumadock/web exec playwright install`。
- 如果依赖下载失败，保留源码后重试 install 命令即可。
