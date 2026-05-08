# 10 P5 更全面的前端技术

P5 继续补真实团队常见的横向能力：PWA / 离线体验、性能预算、安全隐私加固，以及后续可继续深化的视觉回归、设计系统和复杂状态建模。

## 学习目标

| 模块 | 要学什么 | 验收方式 |
| --- | --- | --- |
| PWA / 离线能力 | manifest、离线页、生产环境 Service Worker 注册策略 | 单测验证注册策略，构建包含静态资源 |
| Web Vitals / 性能预算 | 用统一预算描述 LCP、CLS、INP 和 bundle 风险 | 单测验证预算评级和事件记录 |
| 安全与隐私加固 | CSP 学习、错误日志脱敏、敏感字段策略 | 单测验证错误报告不会泄漏 PII |

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
