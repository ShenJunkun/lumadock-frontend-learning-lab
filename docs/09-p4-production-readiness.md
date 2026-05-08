# 09 P4 生产前端能力

P4 用来补齐真实产品前端里经常遇到、但不一定属于业务主流程的生产能力。本轮仍保持教学项目的边界：不新增外部依赖，不接第三方平台，每个能力都要有文档和测试。

## 学习目标

| 模块 | 要学什么 | 验收方式 |
| --- | --- | --- |
| SEO / Head 元数据 | 根据路由维护 `document.title` 和 meta description | Vitest 验证不同 pathname 写入正确 head 信息 |
| 前端 telemetry | 用统一事件模型记录 page view 和关键业务动作，同时避开 PII | Vitest 验证事件内容和隐私边界 |
| 数据预取 | 用 React Query 在用户表达 intent 时预取详情数据 | Vitest 验证 query key 和预取调用 |
| 表单草稿恢复 | 用 `sessionStorage` 保存当前 tab 的预约草稿，提交后清理 | Vitest 验证草稿读写、隔离和恢复 |

## SEO / Head 元数据

单页应用默认不会自动替每个 route 更新 head 信息。P4 增加轻量 route metadata 管理：

- 每个核心页面都有明确 title 和 description。
- 产品详情使用统一 detail fallback metadata，不依赖异步数据才能先写 head。
- 未匹配路径使用 Not Found metadata。
- 该实现只操作浏览器本地 head，不引入额外 head 管理库。

## 隐私友好 telemetry

P4 增加轻量本地 telemetry，用来学习“统一事件模型”和“隐私边界”，不接第三方分析平台，也不发送网络请求。

- 路由切换记录 `route_view`，payload 只包含 pathname。
- 预约提交成功记录 `booking_submit_succeeded`，失败记录 `booking_submit_failed`。
- 表单 telemetry 只记录 `productId`，不记录姓名、邮箱、公司、角色或留言。
- 测试可通过 `getTelemetryEvents()` 读取本地内存事件，并用 `clearTelemetryEvents()` 清理。

## 数据预取

P4 增加 React Query 详情预取，让用户在目录页表达 intent 时提前加载详情数据：

- `productQueryKeys` 统一维护产品列表、详情和统计 query key。
- `prefetchProductDetail` 负责把指定产品详情写入 React Query cache。
- `ProductCard` 在 hover 和 focus 时发出 intent，兼顾鼠标和键盘用户。
- 目录页只编排预取行为，详情页仍沿用原来的 `useProduct` 数据读取。

## 表单草稿恢复

预约表单使用 `sessionStorage` 保存当前浏览器 tab 的草稿，避免用户刷新页面或临时离开时丢失内容。

- 草稿按 `productId` 隔离，切换产品不会串用另一个产品的表单内容。
- 空表单不会写入 storage，避免留下无意义数据。
- 草稿只保存在 session 级别，不做长期持久化。
- 提交成功后立即清理当前产品草稿。
