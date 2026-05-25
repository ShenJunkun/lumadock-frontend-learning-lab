# 00 学习路线

这个仓库是一个独立的产品展示与预约平台练习项目。目标不是做真实商业系统，而是把前端工程常见能力串起来：页面结构、响应式 CSS、React / Vue 组件、路由、状态、API、表单校验、动画、测试、构建和 git 工作流。

## 推荐顺序

1. 环境搭建：Node、npm.cmd、conda、FastAPI。
2. 静态页面：HTML 语义、CSS 布局、图片资源、响应式约束。
3. TypeScript：产品类型、API 返回值、表单类型。
4. React 主线：组件拆分、props、状态、路由页面；Vue 对照：SFC、template、props、Vue Router 页面。
5. 数据层：React Query / Vue Query 请求 FastAPI，失败时展示加载、错误、空状态。
6. 状态管理：Zustand / Pinia 保存配置器、登录、语言和主题选择。
7. 表单：React 版用 react-hook-form + zod；Vue 版用 reactive state + zod 做预约字段校验。
8. 动画与 3D：React 版用 Framer Motion 和 React Three Fiber；Vue 版用原生 Three.js 复刻产品模型。
9. 权限认证：JWT 登录、localStorage token、路由守卫、admin/viewer 角色。
10. 测试：Vitest、Testing Library、Playwright、pytest。
11. 构建与提交：`web:*`、`vue:*`、lint、format、typecheck、test、build、git commit。
12. 技术选型：理解 React Web、React Native、Vue3、uni-app、Flutter 和全栈路线的取舍，见 [13 技术选型对比](13-technology-choices.md)。

读 React 页面骨架时，可以配合 [16 AppShell 逐段阅读指南](16-appshell-reading-guide.md) 学习 JSX 标签来源、React Router 导航、登录态条件渲染和 Ant Design 使用边界。读 Vue 并行实现时，重点对照 `apps/web-vue`：`App.vue` 里的 `<RouterView />`、组件里的 `<template>` / `<script setup>`、Pinia store、Vue Router 守卫、Vue Query hook，以及 `packages/ui-vue` 中和 `packages/ui` 对应的共享组件。

## 项目边界

- 不调用大模型 API。
- 不把代码提交到其他仓库。
- 数据只保存在本地 SQLite。
