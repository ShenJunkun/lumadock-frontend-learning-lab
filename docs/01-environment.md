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
