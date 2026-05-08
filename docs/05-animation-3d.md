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

## 视觉素材

`frontend/public/assets/lumadock-hero.png` 是项目本地静态素材。应用运行时不会调用任何 AI 服务。

