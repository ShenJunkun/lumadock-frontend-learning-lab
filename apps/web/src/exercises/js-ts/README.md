# JS / TS 练习

这些练习对应 `docs/02-html-css-js-ts.md` 中的 JavaScript / TypeScript 语法点。每个练习都有两个文件：

- `*.ts`：你要修改的练习文件。
- `*.test.ts`：自动检查文件，不需要修改。

检查文件使用 Vitest，但默认会跳过。练习时先设置 `RUN_EXERCISES=true`，再单独运行指定文件即可。这样不会影响项目已有的 `npm.cmd run web:test`。

## 运行方式

在仓库根目录运行：

```powershell
$env:RUN_EXERCISES='true'; npm.cmd --workspace @lumadock/web exec vitest run src/exercises/js-ts/01-modules.test.ts
$env:RUN_EXERCISES='true'; npm.cmd --workspace @lumadock/web exec vitest run src/exercises/js-ts/02-js-basics.test.ts
$env:RUN_EXERCISES='true'; npm.cmd --workspace @lumadock/web exec vitest run src/exercises/js-ts/03-types.test.ts
$env:RUN_EXERCISES='true'; npm.cmd --workspace @lumadock/web exec vitest run src/exercises/js-ts/04-spread-and-optional.test.ts
$env:RUN_EXERCISES='true'; npm.cmd --workspace @lumadock/web exec vitest run src/exercises/js-ts/05-async.test.ts
```

一次跑完全部练习：

```powershell
$env:RUN_EXERCISES='true'; npm.cmd --workspace @lumadock/web exec vitest run src/exercises/js-ts
```

如果测试失败，先读失败信息，再回到对应的 `.ts` 文件完成 TODO。

## 练习目标

| 文件                        | 练习点                                                        |
| --------------------------- | ------------------------------------------------------------- |
| `01-modules.ts`             | `export`、命名导出、类型导出、模板字符串、字符串处理          |
| `02-js-basics.ts`           | `const`、数组 `.map()` / `.filter()`、三元表达式、模板字符串  |
| `03-types.ts`               | `type`、联合类型、可选字段、`null`、`Record<string, unknown>` |
| `04-spread-and-optional.ts` | 对象展开、可选链 `?.`、空值合并 `??`                          |
| `05-async.ts`               | `async` / `await`、`Promise<T>`、泛型、错误 fallback          |
