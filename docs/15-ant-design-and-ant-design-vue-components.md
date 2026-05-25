# 15 Ant Design 与 Ant Design Vue 组件清单与项目用法

本项目在 `apps/web/package.json` 中使用 `antd@^6.3.7`，当前锁定安装版本是 `6.3.7`。Vue 并行应用在 `apps/web-vue/package.json` 中使用 `ant-design-vue@^4.2.6`。Ant Design 在这个项目里主要负责两件事：

1. 提供成熟的业务组件，例如表单、表格、弹窗、结果页和加载骨架。
2. 提供全局 UI 运行环境，例如主题、语言包、`message` 和 `notification`。

## Ant Design 提供哪些组件

下面按常见使用场景整理。这个清单来自本项目已安装的 `antd@6.3.7` 导出入口。

| 类别       | 组件或 API                                                                                                                                                                                                               | 主要作用                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 基础与布局 | `Button`, `FloatButton`, `Typography`, `Divider`, `Flex`, `Grid`, `Row`, `Col`, `Layout`, `Space`, `Splitter`                                                                                                            | 搭页面骨架、排版、按钮和基础操作区                                 |
| 导航       | `Affix`, `Anchor`, `BackTop`, `Breadcrumb`, `Dropdown`, `Menu`, `Pagination`, `Steps`, `Tabs`                                                                                                                            | 页面跳转、页内定位、分页、步骤流和多视图切换                       |
| 数据录入   | `AutoComplete`, `Cascader`, `Checkbox`, `ColorPicker`, `DatePicker`, `Form`, `Input`, `InputNumber`, `Mentions`, `Radio`, `Rate`, `Select`, `Slider`, `Switch`, `TimePicker`, `Transfer`, `TreeSelect`, `Upload`         | 收集用户输入，处理校验、选择、上传和复杂表单场景                   |
| 数据展示   | `Avatar`, `Badge`, `Calendar`, `Card`, `Carousel`, `Collapse`, `Descriptions`, `Empty`, `Image`, `List`, `Masonry`, `Popover`, `QRCode`, `Segmented`, `Statistic`, `Table`, `Tag`, `Timeline`, `Tooltip`, `Tour`, `Tree` | 展示结构化数据、状态标签、空状态、详情信息和提示信息               |
| 反馈       | `Alert`, `Drawer`, `message`, `Modal`, `notification`, `Popconfirm`, `Progress`, `Result`, `Skeleton`, `Spin`                                                                                                            | 告诉用户当前发生了什么，例如成功、失败、加载中、确认操作和异常结果 |
| 全局与配置 | `App`, `ConfigProvider`, `Watermark`, `theme`, `version`                                                                                                                                                                 | 提供主题、语言、全局反馈上下文、水印和版本信息                     |

## 本项目实际用了哪些

| 组件/API                | 使用位置                                                                                | 在项目里的作用                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Alert`                 | `apps/web/src/pages/LoginPage.tsx`                                                      | 登录页展示 Demo 账号提示，以及登录失败后的错误提示。它适合放在页面内，作为用户可以直接看到的状态说明。                                                                               |
| `App as AntdRuntimeApp` | `apps/web/src/components/AppProviders.tsx`                                              | Ant Design 的运行时上下文。它包住应用后，`message`、`notification`、`modal` 这类全局反馈能拿到统一主题和上下文。项目里重命名为 `AntdRuntimeApp`，避免和本项目自己的 `App` 组件重名。 |
| `Button`                | `LoginPage.tsx`, `AdminPage.tsx`, `ErrorBoundary.tsx`, `AntdWorkbenchPreview.tsx`       | 承载明确操作，例如提交登录、查看线索、关闭弹窗、错误后重试、打开预览弹窗。按钮的主题色和高度由 `antdTheme.ts` 统一配置。                                                             |
| `ConfigProvider`        | `apps/web/src/components/AppProviders.tsx`                                              | 给所有 antd 组件统一注入语言包和主题 token。这里会根据偏好状态切换 `zhCN` / `enUS` 和亮暗主题。                                                                                      |
| `Descriptions`          | `apps/web/src/pages/AdminPage.tsx`                                                      | 在线索详情弹窗里按“字段名 + 字段值”展示 email、company、role、product、message 和 configuration。适合详情页或只读信息面板。                                                          |
| `Empty`                 | `apps/web/src/components/AdminInsights.tsx`                                             | 后台图表没有线索数据时显示空状态，避免图表区域空白。                                                                                                                                 |
| `Form`                  | `apps/web/src/pages/LoginPage.tsx`                                                      | 管理登录表单的字段、校验和提交。项目里使用 `Form.Item` 配置 Email / Password 的必填规则，并通过 `onFinish` 触发登录请求。                                                            |
| `Input`                 | `apps/web/src/pages/LoginPage.tsx`                                                      | 登录页的文本输入框。普通 `Input` 输入邮箱，`Input.Password` 输入密码并提供密码控件行为。                                                                                             |
| `message`               | `LoginPage.tsx`, `LeadForm.tsx`, `AppShell.tsx`                                         | 显示短暂的轻量反馈，例如登录成功、登录失败、预约提交成功、预约提交失败和退出登录。它适合“操作刚完成”的即时提示。                                                                     |
| `Modal`                 | `apps/web/src/pages/AdminPage.tsx`, `apps/web/src/components/AntdWorkbenchPreview.tsx`  | 展示临时对话框。后台页用于查看某条预约线索详情，组件预览页用于演示 antd 弹窗与主题是否接通。                                                                                         |
| `notification`          | `apps/web/src/pages/AdminPage.tsx`, `apps/web/src/components/AuthRoutes.tsx`            | 显示更醒目的全局通知。项目里用于后台 API 不可用、角色无权限这类需要用户注意的状态。                                                                                                  |
| `Result`                | `AdminPage.tsx`, `AuthRoutes.tsx`, `ErrorBoundary.tsx`, `AntdWorkbenchPreview.tsx`      | 展示完整结果状态页或状态块，例如 403 无权限、后台 API 不可用、渲染错误兜底、预览成功状态。                                                                                           |
| `Skeleton`              | `apps/web/src/components/SkeletonStates.tsx`, `apps/web/src/components/StateBlocks.tsx` | 数据加载时显示占位骨架。它让页面在等待产品、详情、预约页、后台表格或路由懒加载时保持稳定结构，减少空白闪烁。                                                                         |
| `Table`                 | `apps/web/src/pages/AdminPage.tsx`, `apps/web/src/components/AntdWorkbenchPreview.tsx`  | 展示结构化列表数据。后台页用它展示预约线索，支持列配置、分页、横向滚动和空状态文本。                                                                                                 |
| `Tag`                   | `apps/web/src/components/AntdWorkbenchPreview.tsx`                                      | 在组件预览表格中展示 lead 状态，例如 `new`、`qualified`、`scheduled`，用颜色帮助快速识别状态。                                                                                       |
| `theme`                 | `apps/web/src/theme/antdTheme.ts`                                                       | 读取 antd 内置的 `defaultAlgorithm` 和 `darkAlgorithm`，让项目的亮暗主题切换和 antd 组件保持一致。                                                                                   |
| `ThemeConfig`           | `apps/web/src/theme/antdTheme.ts`                                                       | TypeScript 类型，用来约束 `createAntdTheme()` 返回的主题配置，减少 token 字段写错的风险。                                                                                            |
| `ColumnsType`           | `AdminPage.tsx`, `AntdWorkbenchPreview.tsx`                                             | antd Table 的列配置类型。它让 `columns` 中的 `dataIndex`、`render` 和行数据类型保持一致。                                                                                            |
| `zhCN` / `enUS`         | `apps/web/src/components/AppProviders.tsx`                                              | antd 内置语言包。项目根据偏好 store 中的语言状态切换中文或英文组件文案。                                                                                                             |
| `antd/dist/reset.css`   | `apps/web/src/main.tsx`                                                                 | antd 的基础样式重置。它让 antd 组件在不同浏览器中拥有一致的默认样式基础。                                                                                                            |

## 它们分别解决什么问题

### 表单与登录

登录页用 `Alert`、`Form`、`Input`、`Button` 和 `message` 组成一个完整认证入口：

- `Alert` 负责把 Demo 账号和错误状态留在页面里。
- `Form` 负责字段组织、必填校验和提交回调。
- `Input` / `Input.Password` 负责收集邮箱和密码。
- `Button` 负责提交，并通过 `loading` 显示请求中的状态。
- `message` 负责登录成功或失败后的短反馈。

### 后台数据管理

后台页用 `Table`、`Modal`、`Descriptions`、`Result`、`Skeleton`、`notification` 和 `Button` 组织管理界面：

- `Table` 用于展示预约线索列表。
- `Button` 用于触发行级操作，例如查看详情。
- `Modal` 承载详情弹窗。
- `Descriptions` 让详情信息按字段整齐展示。
- `Skeleton` 在数据加载时保持页面结构。
- `notification` 在 API 不可用时给出全局提醒。
- `Result` 在后台 API 不可用时展示页面级兜底。

### 权限与错误兜底

路由守卫和错误边界主要用 `Result`、`notification` 和 `Button`：

- `Result status="403"` 展示无权限页面。
- `notification.warning(...)` 告诉用户当前账号角色不满足要求。
- `Result status="error"` 展示渲染错误兜底，避免整页白屏。
- `Button` 提供错误后的重试入口。

### 加载、空状态和预览

加载和空状态用 `Skeleton`、`Empty`、`Result` 和 `Tag`：

- `Skeleton` 用于产品列表、产品详情、预约页、后台表格和路由懒加载。
- `Empty` 用于后台图表没有数据时的空状态。
- `Result` 用于组件预览里的成功状态说明。
- `Tag` 用于在表格中表达状态值。

### 主题和国际化

全局配置由 `ConfigProvider`、`App`、`theme`、`ThemeConfig`、`zhCN` 和 `enUS` 串起来：

- `ConfigProvider` 接收 `locale` 和 `theme`，把语言和主题传给所有 antd 组件。
- `AntdRuntimeApp` 让全局反馈组件也能吃到同一套运行上下文。
- `theme.defaultAlgorithm` / `theme.darkAlgorithm` 对齐 antd 的亮暗主题算法。
- `ThemeConfig` 约束项目自己的主题配置。
- `zhCN` / `enUS` 让 antd 内置文案跟随项目语言切换。

## 怎么判断该不该用 antd

这个项目同时有 Tailwind、`global.css`、`@lumadock/ui` 和 antd。可以按下面的边界判断：

| 场景                               | 优先选择                | 原因                                         |
| ---------------------------------- | ----------------------- | -------------------------------------------- |
| 复杂表单、表格、弹窗、通知、结果页 | antd                    | 交互和可访问性细节多，成熟组件能减少重复实现 |
| 产品官网的营销布局、复杂响应式排版 | Tailwind + `global.css` | 更容易保持品牌视觉和页面结构自由度           |
| 跨应用复用的轻量展示组件           | `@lumadock/ui`          | 保持业务无关、样式稳定，可进入 Storybook     |
| 全局主题 token、亮暗主题联动       | CSS 变量 + antd theme   | 原生页面样式和 antd 组件需要一起换肤         |

一句话记忆：**antd / Ant Design Vue 负责复杂业务组件和全局反馈，Tailwind / CSS 负责页面排版和品牌外观，`@lumadock/ui` / `@lumadock/ui-vue` 负责项目自己的可复用展示组件。**

## Ant Design Vue 对照

Vue 并行应用用 `ant-design-vue` 复刻登录、后台和工作台类组件体验。它和 React antd 的设计语言接近，但 API 形态会跟随 Vue：

| React antd                                  | Ant Design Vue                                | 主要差异                                                            |
| ------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| `<ConfigProvider locale={...} theme={...}>` | `app.use(Antd)` + `ConfigProvider` / 全局配置 | Vue 版通常在 `main.ts` 安装插件，局部主题和语言仍可通过配置组件传入 |
| `message.success(...)`                      | `message.success(...)`                        | 反馈 API 名称相近，但导入来自 `ant-design-vue`                      |
| `<Form onFinish={...}>`                     | `<a-form @finish="...">` 或 `Form` 组件       | React 用 JSX props；Vue 用模板事件、`v-model` 和响应式对象          |
| `<Input.Password />`                        | `<a-input-password />` 或导入组件             | Vue 模板里常用 kebab-case 组件名                                    |
| `Table columns={columns}`                   | `<a-table :columns="columns" />`              | Vue 动态 props 用 `:`，插槽定制更常见                               |
| `<Modal open={isOpen} onCancel={...}>`      | `<a-modal v-model:open="isOpen" />`           | Vue 版常用 `v-model:open` 做双向绑定                                |
| `<Result status="403" />`                   | `<a-result status="403" />`                   | 组件语义一致，模板写法不同                                          |

读 Vue 版时，优先关注这些差异：

- React 组件属性是 `propName={value}`；Vue 动态属性是 `:prop-name="value"`。
- React 事件是 `onClick={handler}`；Vue 事件是 `@click="handler"`。
- React 表单常把字段交给 antd Form 或 React Hook Form；Vue 版更常用 `reactive` 对象、`v-model` 和 Zod 组合。
- React antd 的图标来自 `@ant-design/icons-react` 或 lucide-react；Vue 版对应 `@ant-design/icons-vue` 或 `lucide-vue-next`。
- 两个组件库都适合复杂表单、表格、弹窗、结果页、message 和 notification；产品营销布局仍然优先使用自定义 CSS 和共享 UI 包。

项目内对应路径：

- React antd：`apps/web/src/pages/LoginPage.tsx`、`apps/web/src/pages/AdminPage.tsx`、`apps/web/src/components/AppProviders.tsx`
- Ant Design Vue：`apps/web-vue/src/pages/LoginPage.vue`、`apps/web-vue/src/pages/AdminPage.vue`、`apps/web-vue/src/main.ts`
