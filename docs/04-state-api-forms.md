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

