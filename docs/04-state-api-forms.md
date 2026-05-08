# 04 状态、API 与表单

## React Query

`src/api/products.ts` 使用 `useQuery` 读取：

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/stats`

如果后端未启动，页面展示错误状态并使用 `fallbackProducts` 保持可浏览。

## Zustand

`src/store/configuratorStore.ts` 保存配置器状态：

- finish
- stand
- plan
- engraving
- estimate
- snapshot

预约提交时，`snapshot()` 会成为 lead 的 `configuration`。

## 表单校验

`LeadForm` 使用：

- `react-hook-form` 管理输入。
- `zod` 定义校验规则。
- `@hookform/resolvers` 连接两者。

练习建议：

1. 给表单增加 `preferredDate`。
2. zod 中要求它不能早于今天。
3. 后端 `LeadCreate` 和数据库模型同步新增字段。
4. 加 pytest 和 Vitest 测试。

## JWT Demo Auth

后端提供本地学习用认证接口：

- `POST /api/auth/login` 用邮箱和密码换取 JWT。
- `GET /api/auth/me` 用 `Authorization: Bearer <token>` 获取当前用户。
- `GET /api/admin/leads` 需要 admin token，用于后台查看预约线索。

默认账号：

```text
admin@lumadock.local / admin123
viewer@lumadock.local / viewer123
```

本项目会在前端把 token 存入 `localStorage`，这是为了直观学习前端认证数据流；生产系统通常要进一步评估 httpOnly cookie、CSRF、防 XSS 和 token 刷新策略。

权限约定：

- `admin` 可以访问后台 leads 列表。
- `viewer` 可以登录，但访问后台 leads 会得到 403。
- 未登录访问受保护接口会得到 401。

前端认证数据流：

- `authStore` 保存 `token`、`user` 和 `isAuthenticated`。
- `apiRequest` 通过 token provider 自动追加 `Authorization` 请求头。
- `PrivateRoute` 负责未登录跳转 `/login`。
- `RoleRoute` 负责角色检查和 403 状态展示。
