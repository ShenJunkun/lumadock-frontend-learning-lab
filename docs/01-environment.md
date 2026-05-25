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
- `apps/web-vue` 是 Vite + Vue 3 并行前端应用，用来复刻同一套 UI 和业务功能。
- `apps/api` 是 FastAPI + SQLite 后端服务。
- `packages/ui` 是 React 版前端共享 UI 组件包。
- `packages/ui-vue` 是 Vue 版前端共享 UI 组件包。
- `packages/api-client` 是前端调用后端用的 TypeScript API client 和类型契约。

因此 `npm.cmd run api:dev` 只是通过根目录 workspace 脚本启动 Python 后端，后端业务代码仍然在 `apps/api/app` 下，不和前端页面代码混写。

### 多个 package.json 的关系

这个项目使用的是 JavaScript / TypeScript / Node.js 生态里常见的 monorepo + npm workspaces 管理方式。monorepo 的意思是：一个 Git 仓库里同时放多个应用和共享包；npm workspaces 的作用是：让 npm 能识别这些子目录里的包，并在根目录统一安装依赖、统一执行脚本。

当前仓库的关系是：

```text
根目录 package.json
  ├─ apps/web/package.json             前端应用 @lumadock/web
  ├─ apps/web-vue/package.json         Vue 并行应用 @lumadock/web-vue
  ├─ apps/api/package.json             后端服务 @lumadock/api 的 npm 启动壳
  ├─ packages/ui/package.json          共享 UI 组件包 @lumadock/ui
  ├─ packages/ui-vue/package.json      Vue 共享 UI 组件包 @lumadock/ui-vue
  └─ packages/api-client/package.json  共享 API client 包 @lumadock/api-client
```

根目录 `package.json` 是总入口，核心职责有三个：

- 用 `workspaces` 声明哪些目录属于这个 monorepo。
- 用聚合脚本把命令转发到对应子包，例如 `api:dev`、`web:dev`、`ui:typecheck`。
- 放少量跨项目共用的开发依赖和 Node 版本要求。

各子目录的 `package.json` 是自己的局部说明书：

- `apps/web/package.json` 描述 Vite + React 前端应用，包含 `vite`、`react`、测试、构建、lint 等前端依赖和脚本。
- `apps/web-vue/package.json` 描述 Vite + Vue 3 并行应用，包含 `vue`、`vue-router`、`pinia`、`@tanstack/vue-query`、`ant-design-vue`、测试、构建、lint 等依赖和脚本。
- `apps/api/package.json` 不是说后端由 Node.js 实现，它只是把 Python 后端的启动和测试命令接入 npm workspace。真正的后端代码仍然是 `apps/api/app` 下的 FastAPI，Python 依赖仍然在 `apps/api/requirements.txt` 和 `apps/api/pyproject.toml` 里。
- `packages/ui/package.json` 描述共享 UI 组件包，前端应用可以通过 `@lumadock/ui` 引用它。
- `packages/ui-vue/package.json` 描述 Vue 共享 UI 组件包，Vue 应用可以通过 `@lumadock/ui-vue` 引用它。
- `packages/api-client/package.json` 描述共享 API client 和类型契约，前端应用可以通过 `@lumadock/api-client` 调用后端接口。

所以多个 `package.json` 不是互相冲突的重复文件，而是一个总入口加多个子包说明。根目录负责“调度全局”，子包负责“管理自己”。

### 为什么根目录命令能启动服务

Windows 下执行的是 `npm.cmd`，它是 Node.js 安装时提供给 PowerShell/cmd 使用的 npm 命令入口。执行 `npm.cmd run <script>` 时，npm 会读取当前目录的 `package.json`，找到同名脚本并执行。

根目录 `package.json` 里声明了 workspaces：

```json
["apps/web", "apps/web-vue", "apps/api", "packages/*"]
```

所以 npm 知道 `apps/web/package.json` 里的包名是 `@lumadock/web`，`apps/web-vue/package.json` 里的包名是 `@lumadock/web-vue`，`apps/api/package.json` 里的包名是 `@lumadock/api`。根目录脚本再把命令转发到对应 workspace：

```json
{
  "api:dev": "npm --workspace @lumadock/api run dev",
  "web:dev": "npm --workspace @lumadock/web run dev",
  "vue:dev": "npm --workspace @lumadock/web-vue run dev"
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

### React 前端启动链路

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

### Vue 前端启动链路

```text
npm.cmd run vue:dev
  -> 根目录 package.json 的 vue:dev
  -> npm --workspace @lumadock/web-vue run dev
  -> apps/web-vue/package.json 的 dev
  -> vite --host 127.0.0.1 --port 5174
```

Vue 并行应用和 React 应用使用同一个后端、同一个 `packages/api-client`、同一组业务数据和 public/PWA 资源。不同点在于入口链路：

- Vite 读取 `apps/web-vue/vite.config.ts`，加载 Vue 插件、路径 alias、dev server host/port 等配置。
- Vite 从 `apps/web-vue/index.html` 进入应用，再加载 `apps/web-vue/src/main.ts`。
- `main.ts` 安装 Pinia、Vue Query、Vue Router、Ant Design Vue、vue-i18n，并注册 PWA。
- `apps/web-vue/.env.development` 同样提供 `VITE_API_BASE_URL=http://127.0.0.1:8001`。

完整运行关系是：浏览器访问 `http://127.0.0.1:5174` 的 Vue Vite 前端；Vue 页面通过 `packages/api-client` 请求 `http://127.0.0.1:8001`；FastAPI 路由处理请求并读写 SQLite；响应返回后由 Vue 渲染页面。

后端：

```powershell
npm.cmd run api:dev
```

前端：

```powershell
npm.cmd run web:dev
```

浏览器打开 `http://127.0.0.1:5173`。

Vue 前端：

```powershell
npm.cmd run vue:dev
```

浏览器打开 `http://127.0.0.1:5174`。React 版和 Vue 版可以同时启动，端口不会冲突。

## 常见问题

- 如果前端提示 API unavailable，说明后端没有运行；页面会继续使用 fallback 产品数据。
- 如果 React 版 Playwright 提示缺少浏览器，执行 `npm.cmd --workspace @lumadock/web exec playwright install`。
- 如果 Vue 版 Playwright 提示缺少浏览器，执行 `npm.cmd --workspace @lumadock/web-vue exec playwright install`。
- 如果依赖下载失败，保留源码后重试 install 命令即可。
