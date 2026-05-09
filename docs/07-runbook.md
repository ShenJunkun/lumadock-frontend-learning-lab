# 07 Runbook

## 一次性安装

```powershell
conda create -n frontend-product-lab python=3.11 -y
conda run -n frontend-product-lab python -m pip install -r apps/api/requirements.txt
npm.cmd install
```

复制或检查前端环境变量：

```powershell
Get-Content apps/web/.env.example
```

常用前端环境变量：

| 变量 | 用途 | 默认建议 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Web app 访问 API 的基础地址 | 本地 `http://127.0.0.1:8001` |
| `VITE_ENABLE_MOCKS` | 是否启用 MSW mock API | 本地按需开启，生产必须为 `false` |
| `VITE_FEATURE_ADMIN_INSIGHTS` | 是否显示后台 insights 面板 | 默认 `true`，需要回滚时可设为 `false` |

## 本地开发

打开两个终端。

终端 1：

```powershell
npm.cmd run api:dev
```

终端 2：

```powershell
npm.cmd run web:dev
```

如果只想运行前端并使用 Mock API：

```powershell
$env:VITE_ENABLE_MOCKS="true"
npm.cmd run web:dev
```

## API 检查

```powershell
curl http://127.0.0.1:8001/health
curl http://127.0.0.1:8001/api/products
```

## 构建与部署演练

前端生产构建：

```powershell
npm.cmd run web:build
npm.cmd run web:build:analyze
```

后端 Docker：

```powershell
docker build -t lumadock-api ./apps/api
docker compose up --build
```

部署到真实前端域名时，把后端 `CORS_ORIGINS` 设置为该域名，例如：

```powershell
$env:CORS_ORIGINS="https://lumadock.example"
```

## Preview / Staging / Production

| 环境 | 用途 | 必查项 |
| --- | --- | --- |
| Preview | PR 或临时分支验证 | lint、typecheck、unit、build，必要时跑 E2E |
| Staging | 接近生产的发布前演练 | staging API、staging auth、staging monitoring、人工 smoke test |
| Production | 用户访问环境 | mock 关闭、release note、回滚路径、发布后观察窗口 |

发布前至少执行：

```powershell
npm.cmd run verify
npm.cmd run web:e2e
```

如果发布后后台 insights 面板出现问题，可先关闭 feature flag：

```powershell
$env:VITE_FEATURE_ADMIN_INSIGHTS="false"
npm.cmd run web:build
```

## 生产排障入口

1. 先确认环境和版本：preview、staging 还是 production。
2. 查看前端错误报告；当前项目使用本地 adapter，真实接入点见 `docs/11-p7-production-light.md`。
3. 如果是接口问题，检查 Network 状态码、API 路径和后端 `/health`。
4. 如果影响核心流程，优先关闭相关 feature flag 或回滚，再继续定位。

## 鉴权与数据演进提醒

当前 JWT 和 SQLite 都是教学实现。真实上线前需要补：

- 服务端 session、OIDC/OAuth 或 refresh token rotation 等生产鉴权方案。
- 后端最终权限校验，前端只做界面裁剪。
- 数据库迁移工具、发布前备份和恢复演练。

## 离线或网络失败

如果依赖安装失败：

1. 不删除源码。
2. 检查代理或网络。
3. 重新运行 install 命令。
4. 如果 npm 缓存损坏，可删除 `node_modules` 后重试。
