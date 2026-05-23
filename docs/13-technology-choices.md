# 13 技术选型对比

这篇文档用来解释几个容易混在一起的概念：React Web、React Native、Vue3、uni-app、Flutter，以及全栈学习时常见的后端和数据库路线。

## 当前项目用的是什么

本项目不是 React Native，也不是 Vue3 / uni-app。当前技术栈是：

```text
前端：React + TypeScript + Vite
后端：FastAPI + SQLite
工程管理：npm workspaces monorepo
```

它是一个运行在浏览器里的 React Web 项目。启动前端后，通过浏览器访问：

```text
http://127.0.0.1:5173
```

判断它是 React Web 的几个明显信号：

- `apps/web/package.json` 里有 `react`、`react-dom`、`vite`。
- `apps/web/index.html` 是浏览器入口。
- 页面代码使用浏览器里的 HTML 标签和 CSS，例如 `div`、`section`、`button`、`img`。
- 最终构建产物是 HTML、CSS、JavaScript 静态资源。

## React Web 和 React Native

React 是一种组件化 UI 开发思想。React Web 和 React Native 都使用 React，但运行环境完全不同。

```text
React Web
  运行环境：Chrome、Edge、Safari、Firefox 等浏览器
  访问方式：http://example.com 或 http://127.0.0.1:5173
  页面元素：HTML DOM，例如 div、button、img、form
  样式方式：CSS、Tailwind、Ant Design 等
  常见工具：Vite、Next.js、React Router
  打包产物：HTML + CSS + JavaScript
```

```text
React Native
  运行环境：iOS / Android 原生 App
  访问方式：安装 App，或用模拟器/真机运行
  页面元素：原生组件，例如 View、Text、Image、Pressable、ScrollView
  样式方式：StyleSheet、NativeWind 等
  常见工具：Metro、Expo、React Native CLI
  打包产物：APK、AAB、IPA
```

所以更准确的说法是：

```text
React Web 是用 React 做浏览器网页和 Web App。
React Native 是用 React 做 iOS / Android 原生 App。
```

本项目属于第一种：React Web。

## Vue3 和 uni-app

Vue3 是另一个主流前端框架，常用于浏览器里的 Web App。它和 React Web 处在同一类位置：

```text
React Web：React + TypeScript + Vite / Next.js
Vue Web：Vue3 + TypeScript + Vite / Nuxt
```

uni-app 是基于 Vue 语法的跨端框架。它的目标是用一套主代码发布到多个端：

```text
H5 网页
微信小程序
支付宝小程序
App
其他小程序平台
```

在国内业务场景里，如果小程序很重要，Vue3 + uni-app 是常见路线。

## Flutter

Flutter 是 Google 推出的跨平台 UI 框架，使用 Dart 语言。它主要适合做：

```text
iOS App
Android App
桌面端应用
部分 Web 场景
```

Flutter 的强项是 UI 一致性强、移动端体验好，但它不是传统 React/Vue Web 生态的一部分。做普通官网、后台管理系统、SEO 页面时，React/Vue Web 通常更自然。

## 跨平台是什么意思

跨平台不是“完全一套代码无差别跑所有地方”，而是：

```text
一套主代码
+ 多平台编译或运行
+ 少量平台适配
```

实际项目里常见的是 70% 到 90% 的代码复用，剩下部分根据平台单独处理。

原因是浏览器、手机 App、小程序的底层环境不同：

```text
浏览器
  HTML、CSS、DOM、URL、SEO、鼠标键盘、浏览器缓存

手机 App
  原生组件、系统权限、推送、相机、定位、蓝牙、App 生命周期

小程序
  平台组件、平台 API、包体积限制、审核规则、开放能力限制
```

比如“选择图片”这个功能，在不同平台底层并不一样：

```text
浏览器：input type="file"
React Native：调用 iOS / Android 相册权限
微信小程序：wx.chooseMedia
uni-app：uni.chooseImage，再由框架适配不同平台
```

框架可以统一一部分写法，但不能消除所有平台差异。

## 三种跨平台路线对比

```text
React Native
  适合：iOS / Android App
  语言：JavaScript / TypeScript + React
  优点：移动 App 体验好，原生能力强，React 用户迁移自然
  不主打：小程序、传统浏览器网站
```

```text
uni-app
  适合：H5 + 小程序 + App 多端业务
  语言：Vue
  优点：国内多端业务性价比高，尤其适合小程序生态
  限制：复杂原生体验和极致性能场景需要额外适配
```

```text
Flutter
  适合：iOS / Android App，也可做桌面端和部分 Web
  语言：Dart
  优点：UI 一致性强，移动端性能和体验好
  限制：与传统 React/Vue Web 生态不是同一条路线
```

## 为什么淘宝这类产品不是简单一套代码

像淘宝这种同时有网页、iOS App、Android App、小程序的大型产品，通常不会是完全一套代码，也不会是完全互不相干的多套代码。更现实的结构是：

```text
核心接口和数据模型：尽量共用
业务规则和设计规范：尽量共用
Web 页面：单独写
iOS / Android App：原生或跨平台技术单独适配
活动页、H5、小程序页面：可能复用一部分
```

原因是不同端的用户体验差异很大：

- Web 端更重视浏览器、SEO、URL、多窗口、鼠标键盘、大屏布局。
- App 端更重视触摸手势、推送、扫码、支付、定位、相册、离线缓存。
- 小程序端要遵守平台组件、包体积、审核规则和开放 API 限制。

大项目更关心每个平台的体验，所以会复用底层能力，但 UI 和端侧代码通常会分开。

## 全栈路线怎么选

如果目标是通用就业和长期成长，性价比较高的主线是：

```text
React 或 Vue3
+ Spring Boot
+ MySQL 或 PostgreSQL
+ Docker
```

进阶再加：

```text
Redis
登录权限
文件上传
支付或消息
定时任务
Linux / Nginx / CI/CD
```

小项目一开始不一定需要 Redis、微服务、Kubernetes、消息队列。更重要的是先打通主链路：

```text
页面
  -> 调接口
  -> 后端 Controller / Router
  -> Service
  -> 数据库
  -> 登录权限
  -> Docker 部署
```

如果你偏国际化 SaaS、复杂前端、组件工程，可以优先选：

```text
React + TypeScript
```

如果你偏国内业务系统、小程序生态、快速交付，可以优先选：

```text
Vue3 + TypeScript
```

如果后面要做跨平台：

```text
React 路线：React Web + React Native
Vue 路线：Vue3 Web + uni-app
```

本项目现在选择 React Web + FastAPI，是为了先把现代前端工程、API 调用、状态管理、测试、构建和部署这些基础能力练扎实。它不是最终唯一答案，而是一条适合前端学习的起点路线。
