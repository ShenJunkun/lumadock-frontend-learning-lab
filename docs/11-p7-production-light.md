# 11 P7 真实生产化能力（轻实现）

P7 的目标是把教学项目和真实生产系统之间的差距写清楚，并给出最小可运行的本地模型。本阶段不接真实 Sentry、OpenTelemetry、身份提供商或数据库迁移平台；先保留 adapter、feature flag 和 runbook 边界。

## 已落地内容

| 模块 | 当前实现 | 后续真实接入点 |
| --- | --- | --- |
| 错误监控 adapter | `apps/web/src/lib/errorReporting.ts` 导出 `ErrorMonitoringAdapter`、内存实现和 `setErrorMonitoringAdapter` | 增加 Sentry 或 OpenTelemetry adapter，在初始化时替换默认内存实现 |
| 隐私脱敏边界 | 错误报告继续复用 P5 的 `redactSensitiveText`，发送前移除邮箱、Bearer token 和敏感字段 | 真实 adapter 只能接收脱敏后的 message/context |
| Feature flags | `VITE_FEATURE_ADMIN_INSIGHTS` 控制后台 insights 面板，默认开启 | 后续可由远程配置服务下发，保留本地 env fallback |
| 发布 runbook | 本文和 `docs/07-runbook.md` 记录 preview/staging/production、回滚、排障、鉴权、迁移和备份策略 | 接真实平台后补平台命令和责任人 |

## 错误监控接入策略

当前 `reportClientError` 的职责是统一脱敏和封装错误事件，默认写入内存 adapter，测试可以读取本地事件。真实接入时不要让业务组件直接调用 Sentry SDK 或 OpenTelemetry exporter，而是在应用启动处替换 adapter：

```ts
setErrorMonitoringAdapter(createSentryAdapter({ dsn, environment }));
```

真实 adapter 必须遵守这些边界：

- 只接收 `reportClientError` 传入的脱敏事件。
- 不上传表单姓名、邮箱、公司、留言、token、cookie 或完整 URL query。
- preview/staging/production 使用不同 environment。
- 监控平台采样率、release version 和 source map 上传策略单独配置，不混进业务组件。

## Feature Flags

本地 feature flag 模型位于 `apps/web/src/lib/featureFlags.ts`。当前示例：

```powershell
$env:VITE_FEATURE_ADMIN_INSIGHTS="false"
npm.cmd run web:dev
```

默认值保守写在 `defaultFeatureFlags`，环境变量只做覆盖。真实远程配置接入时建议：

- 远程配置失败时回退到本地默认值。
- 新功能默认关闭，成熟后再把默认值改为开启。
- 每个 flag 都要有 owner、创建日期和计划删除日期。
- 回滚优先使用配置关闭，代码回滚作为第二选择。

## 环境策略

| 环境 | 目的 | 配置策略 | 发布要求 |
| --- | --- | --- | --- |
| preview | 每个 PR 或临时分支的验证环境 | Mock 或隔离 API，feature flag 可按 PR 调整 | 通过 lint、typecheck、unit、build，必要时跑 E2E |
| staging | 接近生产的集成验证 | 使用 staging API、staging auth、staging monitoring | 发布前跑完整验证和人工 smoke test |
| production | 用户访问环境 | 只使用生产 API、生产 auth、生产 monitoring，关闭调试 mock | 需要 release note、回滚路径和监控观察窗口 |

## 发布检查清单

发布前：

- `npm.cmd run verify`
- `npm.cmd run web:e2e`
- 确认 `VITE_API_BASE_URL` 指向目标环境。
- 确认 `VITE_ENABLE_MOCKS=false`。
- 确认新 feature flag 的默认值、覆盖值和回滚策略。
- 确认后端 `CORS_ORIGINS` 包含目标前端域名。

发布后：

- 打开首页、产品列表、详情、预约、登录、后台和 404。
- 提交一次预约测试数据。
- 检查错误报告、后端日志和 API health。
- 在观察窗口内保留上一个稳定版本的回滚方式。

## 排障路径

1. 从用户看到的页面和时间点开始，记录 route、操作和环境。
2. 在前端错误监控中查找对应 release/environment 的错误事件。
3. 如果是 API 错误，检查浏览器 Network 中的接口路径和状态码。
4. 用后端日志按时间窗口查找相同接口。
5. 判断是配置问题、前端异常、后端异常还是数据问题。
6. 如果影响核心流程，先关闭对应 feature flag 或回滚发布，再继续定位。

## 真实鉴权策略

当前 JWT Demo Auth 适合学习路由守卫和角色裁剪，但不等于生产鉴权。生产方案建议按风险选择：

- 小型内部工具：服务端 session + HttpOnly cookie，CSRF 防护清楚。
- 面向外部用户：OIDC / OAuth 身份提供商，前端只处理登录跳转和会话状态。
- 需要移动端或多客户端：refresh token rotation、短期 access token 和设备管理。

无论选择哪种方案，后端必须做最终权限校验；前端权限只用于界面裁剪和体验提示。

## 数据库迁移与备份演练

当前 API 使用 SQLite 学习数据持久化。真实上线前需要补迁移工具和备份恢复流程：

- 迁移工具：Alembic 或目标数据库生态的迁移系统。
- 每个 schema 变更都有 forward migration 和 rollback 说明。
- 发布前在 staging 还原一份生产脱敏备份后演练迁移。
- 发布前备份，发布后验证关键查询和写入。
- 定期做恢复演练，确认备份不是只存在而不可用。

## 本轮未完成

- 未接真实 Sentry 或 OpenTelemetry，只保留 adapter 边界。
- 未接真实身份提供商、session 服务或 refresh token rotation。
- 未接真实数据库迁移平台，只补策略和演练 runbook。
- 未接远程配置服务，feature flag 仍由本地 env 控制。
- P8 的 Storybook / 组件文档站和复杂交互实战尚未实施，见 `docs/99-missing-modules.md` 的 P8 记录。
