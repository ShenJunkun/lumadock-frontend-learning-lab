# 00 学习路线

这个仓库是一个独立的产品展示与预约平台练习项目。目标不是做真实商业系统，而是把前端工程常见能力串起来：页面结构、响应式 CSS、React 组件、路由、状态、API、表单校验、动画、测试、构建和 git 工作流。

## 推荐顺序

1. 环境搭建：Node、npm.cmd、conda、FastAPI。
2. 静态页面：HTML 语义、CSS 布局、图片资源、响应式约束。
3. TypeScript：产品类型、API 返回值、表单类型。
4. React：组件拆分、props、状态、路由页面。
5. 数据层：React Query 请求 FastAPI，失败时展示加载、错误、空状态。
6. 状态管理：Zustand 保存配置器选择。
7. 表单：react-hook-form + zod 做预约字段校验。
8. 动画与 3D：Framer Motion 滚动出现，React Three Fiber 做轻量产品模型。
9. 权限认证：JWT 登录、localStorage token、路由守卫、admin/viewer 角色。
10. 测试：Vitest、Testing Library、Playwright、pytest。
11. 构建与提交：lint、format、typecheck、test、build、git commit。

## 项目边界

- 不调用大模型 API。
- 不连接 RadarAgent。
- 不把代码提交到其他仓库。
- 数据只保存在本地 SQLite。
