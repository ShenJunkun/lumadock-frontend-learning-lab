# 10 P5 更全面的前端技术

P5 继续补真实团队常见的横向能力：PWA / 离线体验、性能预算、安全隐私加固、视觉回归、设计系统和复杂状态建模。本阶段已经完成，后续进入 workspace、生产化和高级前端专项。

## 学习目标

| 模块 | 要学什么 | 验收方式 |
| --- | --- | --- |
| PWA / 离线能力 | manifest、离线页、生产环境 Service Worker 注册策略 | 单测验证注册策略，构建包含静态资源 |
| Web Vitals / 性能预算 | 用统一预算描述 LCP、CLS、INP 和 bundle 风险 | 单测验证预算评级和事件记录 |
| 安全与隐私加固 | CSP 学习、错误日志脱敏、敏感字段策略 | 单测验证错误报告不会泄漏 PII |
| 可视化回归测试 | 用 Playwright screenshot 做关键页面视觉保护 | 桌面和移动截图基线可稳定比对 |
| 设计系统深化 | 把 token 和基础组件沉到 `packages/ui` | Web 页面复用共享 UI 组件 |
| 状态建模 | 用 reducer 明确复杂流程状态 | 单测覆盖预约提交状态迁移 |

## PWA / 离线能力

PWA 的第一步不是缓存一切，而是建立明确的离线边界：

- `manifest.webmanifest` 描述应用名称、启动 URL、主题色和图标。
- `offline.html` 作为网络失败时的静态 fallback。
- `sw.js` 只缓存静态壳层和已有图片资产，不缓存 API 数据。
- 前端只在生产环境尝试注册 service worker，避免开发和 E2E 被旧缓存影响。

后续如果需要真实离线业务能力，再补 Workbox、缓存版本清理、API stale fallback 和安装提示。

## Web Vitals / 性能预算

P5 增加统一的性能预算模型，用来学习如何把“感觉有点慢”变成可讨论、可测试的阈值：

- LCP：`2500ms` 以内为 good，`4000ms` 以上为 poor。
- INP：`200ms` 以内为 good，`500ms` 以上为 poor。
- CLS：`0.1` 以内为 good，`0.25` 以上为 poor。
- JS bundle：`500KB` 以内为 good，`900KB` 以上为 poor。

当前实现不接外部 RUM 平台；`recordPerformanceMetric` 会复用本地 telemetry，把 metric、rating、unit 和 value 记录为脱敏事件。

## 安全与隐私加固

P5 增加安全和隐私学习基线，重点是让“记录错误”和“配置安全策略”都有明确边界：

- `securityPolicy` 记录 CSP、Referrer-Policy 和 X-Content-Type-Options 的学习基线。
- `privacyRedaction` 统一处理邮箱、Bearer token 和敏感字段脱敏。
- `errorReporting` 只把脱敏后的错误消息和上下文写入本地内存。
- `ErrorBoundary` 捕获渲染错误后写入本地错误报告，同时保留控制台错误，便于开发调试。

## 可视化回归测试

P5 增加 `visual.spec.ts`，用 Playwright screenshot 保护首页、产品列表、产品详情、预约页、登录页、后台页和 404 页。测试使用 MSW mock 数据、固定亮色主题、reduced motion，并隐藏 WebGL canvas，避免动画和硬件渲染差异影响截图。

截图基线覆盖 desktop 和 mobile 两个 Playwright project。更新基线时使用：

```powershell
npm.cmd run web:e2e -- e2e/visual.spec.ts --update-snapshots
```

## 设计系统深化

`packages/ui` 从教学原型扩展为轻量共享 UI 包，导出 `designTokens`、`Button`、`SurfaceCard`、`EmptyState`、`StatusBadge` 和 `LearningArchitecturePanel`。这些组件不读取路由、不请求 API、不依赖业务 store；Web 应用已经在后台页和空状态中消费共享组件。

## 状态建模

预约提交流程新增 `leadSubmissionReducer`，显式表达 `idle`、`submitting`、`success`、`error` 状态。`LeadForm` 仍然用 React Query 执行 mutation，但成功/失败 UI 和提交按钮文案由 reducer 状态驱动，避免多个布尔值互相组合。
