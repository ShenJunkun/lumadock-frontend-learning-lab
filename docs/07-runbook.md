# 07 Runbook

## 一次性安装

```powershell
conda create -n frontend-product-lab python=3.11 -y
conda run -n frontend-product-lab python -m pip install -r backend/requirements.txt
npm.cmd --prefix frontend install
```

复制或检查前端环境变量：

```powershell
Get-Content frontend/.env.example
```

## 本地开发

打开两个终端。

终端 1：

```powershell
conda run -n frontend-product-lab uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8001
```

终端 2：

```powershell
npm.cmd --prefix frontend run dev
```

如果只想运行前端并使用 Mock API：

```powershell
$env:VITE_ENABLE_MOCKS="true"
npm.cmd --prefix frontend run dev
```

## API 检查

```powershell
curl http://127.0.0.1:8001/health
curl http://127.0.0.1:8001/api/products
```

## 构建与部署演练

前端生产构建：

```powershell
npm.cmd --prefix frontend run build
npm.cmd --prefix frontend run build:analyze
```

后端 Docker：

```powershell
docker build -t lumadock-api ./backend
docker compose up --build
```

部署到真实前端域名时，把后端 `CORS_ORIGINS` 设置为该域名，例如：

```powershell
$env:CORS_ORIGINS="https://lumadock.example"
```

## 离线或网络失败

如果依赖安装失败：

1. 不删除源码。
2. 检查代理或网络。
3. 重新运行 install 命令。
4. 如果 npm 缓存损坏，可删除 `frontend/node_modules` 后重试。
