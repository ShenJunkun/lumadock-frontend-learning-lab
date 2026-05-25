# 05 动画与 3D

## Framer Motion

`ScrollReveal` 组件用 `whileInView` 实现滚动出现。它会读取 `useReducedMotion()`，当系统偏好减少动效时，不播放位移动画。

可练习的动效：

- 页面进入淡入。
- 产品卡片 hover。
- 表单提交成功提示。
- 配置器切换时的价格变化。

## React Three Fiber

`ProductScene` 用 Three.js primitives 搭出一个轻量 LumaDock 模型：

- 主体：`boxGeometry`
- 灯带：emissive material
- 端口：小矩形块
- 动画：`useFrame`

不需要复杂模型文件，也能练习 3D 场景、相机、灯光和渲染容器。

## Vue 版 Three.js 对照

React 版用 React Three Fiber 把 Three.js 场景写成 React 组件树，例如用 `useFrame` 跟随渲染帧更新模型。Vue 并行应用没有额外引入 Vue 版 3D 封装，而是在 `ProductScene.vue` 里直接使用原生 Three.js：

- `onMounted` 创建 `Scene`、`PerspectiveCamera`、`WebGLRenderer`、灯光和 mesh。
- `requestAnimationFrame` 驱动旋转和渲染循环。
- `onBeforeUnmount` 停止动画、移除监听器并释放 renderer / geometry / material。
- reduced-motion 开启时减少或停止连续运动，保持和 React 版一致的可访问性取舍。

这两个版本的学习重点不同：

| React 版                                          | Vue 版                                                   |
| ------------------------------------------------- | -------------------------------------------------------- |
| 学习 React Three Fiber 如何把 Three.js 声明成组件 | 学习 Three.js 原生生命周期和资源清理                     |
| `useFrame` 连接渲染循环                           | `requestAnimationFrame` 手动连接渲染循环                 |
| React 负责挂载和卸载组件                          | Vue `onMounted` / `onBeforeUnmount` 管理 canvas 生命周期 |
| 适合练习 React 生态 3D 写法                       | 适合理解框架之外的 Three.js 基础模型                     |

## 视觉素材

`apps/web/public/assets/lumadock-hero.png` 是项目本地静态素材。应用运行时不会调用任何 AI 服务。
