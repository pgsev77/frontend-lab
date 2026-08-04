# TypeScript 与类型系统（TypeScript & Type System）

> JS 是动态弱类型，灵活但大型项目易出错。TypeScript 给 JS 加了静态类型，让一大类 bug 在编译时就被发现。现代前端项目，TS 已是事实标准。

## 是什么

TypeScript（TS）是 JS 的超集，给 JS 加了**静态类型系统**。代码写 TS，编译时移除类型变成 JS 运行。核心价值：**在代码运行前，用类型捕获一类错误**。

一句话边界：**TS 是"开发时的安全网"，编译后类型被擦除，运行时还是 JS。**

## 为什么：TS 解决什么

### 动态类型的痛
JS 运行时才发现错误：`user.naem`（拼错）要等运行时才报 undefined；`fetchUser()` 返回什么要查文档或猜。大型项目里，这类错误多且难追踪。

### TS 的承诺
- **编译时捕错**：`user.naem` 直接红线（属性不存在）。
- **类型即文档**：函数签名 `(id: number) => Promise<User>` 一眼说明输入输出，不用查文档。
- **类型即契约**：API、组件 props、状态都有类型约束，改动时编译器告诉你哪里受影响。
- **IDE 智能提示**：基于类型精准补全、跳转、重命名。

> 这些价值随项目规模放大——小脚本 JS 够用，大型项目 TS 是必需。

## 怎么用：核心实践

### strict 模式 ★
开启 `strict: true`，启用所有严格类型检查（noImplicitAny、strictNullChecks 等）。这是 TS 价值的前提——不 strict 等于半放弃类型安全。
- `strictNullChecks`：强制处理 null/undefined，挡住"可能为空"的错误（最常见的运行时错）。
- `noImplicitAny`：禁止隐式 any，逼你写清类型。

### 类型推导 vs 显式标注
TS 能推导的不用写：
```
const count = 0          // 推导为 number，不用写 :number
function add(a: number, b: number) { return a + b }   // 返回值推导，不用写
```
**该写标注的地方**：函数/组件的公共接口（props、API 返回、导出函数）——这些是契约，显式标注让契约清晰。呼应当前[01-2 组件 API](../01-2-componentization/component-api.md)。

### 类型贯穿（API → Hook → 组件）★
让类型从数据源贯穿到 UI，一处定义处处复用：
```
// API 层定义响应类型
type User = { id: number; name: string }
async function getUser(id: number): Promise<User> {...}

// Hook 层继承
function useUser(id: number) {
  const { data } = useQuery(['user', id], () => getUser(id))
  return data   // 类型是 User | undefined，自动推导
}

// 组件层
function UserCard({ user }: { user: User }) {...}   // 同一个 User 类型
```
一处改 User 类型，所有用到的地方编译器都检查。这是 TS 最大的工程价值之一。呼应当前[01-6 数据架构](../01-6-data-fetching/fetch-architecture.md)。

### 类型与运行时的鸿沟 ★ 重要认知
**TS 类型只在编译时存在，运行时被擦除。** 所以：
```
// TS 类型不能保证运行时数据真的符合
interface User { id: number; name: string }
const data = await fetch('/api/user').then(r => r.json())   // 类型是 any/Promise<any>
// 后端返回什么，前端 TS 说了不算
```
- 后端可能返回 `{id: "abc"}`（id 是字符串），即使 TS 声明 `id: number`。
- **解法**：在边界（API 响应）用 **Zod/Valibot** 做运行时校验，校验通过才认定类型：
```
const UserSchema = z.object({ id: z.number(), name: z.string() })
const user = UserSchema.parse(await res.json())   // 运行时校验，不符则抛错
// parse 返回的才真的有 User 类型
```
> 这是 TS 的边界认知：**类型是开发时的假设，边界处（外部数据）要运行时验证。** 呼应当前[01-8 表单校验](../01-8-interaction-forms/form-validation.md)（schema 校验）。

## 常见坑

- ❌ **不 strict**：开着 TS 但 any 满天飞，等于没用。
- ❌ **滥用 any**：遇到难写的类型就 `as any` 绕过，类型安全失效。
  - ✅ 正例：尽量写准类型；实在难写用 `unknown`（强制你检查）比 `any` 安全。
- ❌ **以为类型保证运行时**：后端返回错的数据，TS 挡不住。边界校验。
- ❌ **类型定义散落不统一**：同一个实体到处定义不同类型。统一在 types/ 或 API 层定义。

## 关联（双向打通）

- **依赖 ↓**：[01-2 组件 API（props 类型）](../01-2-componentization/component-api.md)、[01-6 数据架构（类型贯穿）](../01-6-data-fetching/fetch-architecture.md)
- **属于 ↑**：[01-12 架构与工程化](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 类型与 schema 校验 → [01-8 表单校验](../01-8-interaction-forms/form-validation.md)
  - 类型作为工程规范 → [工程规范](./engineering-conventions.md)
  - 配置的类型校验 → [环境与配置](./environment-config.md)
