# 数据获取的架构位置（Fetch Architecture Placement）

> "请求代码该写在哪一层？"——写得太散（组件里到处 fetch）难复用难测试，写得太集中又僵化。这篇讲清数据获取的分层架构，把"请求"从组件里抽出来。

## 是什么

数据获取的架构位置指**请求逻辑放在代码的哪一层**。从乱到治的演进：

```
组件里直接 fetch（散乱）→ 自定义 Hook 封装（复用）→ API层 + Hook层分离（清晰）
```

一句话边界：**好的架构把"请求什么"（API 契约）和"怎么缓存/怎么用"（Hook）分开，组件只管"显示"。**

## 为什么：组件里直接 fetch 的问题

### 散乱的写法
```
// 到处都是 fetch，逻辑、状态、UI 混在一起
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)  // 竞态？错误？缓存？全没管
  }, [])
  return <ul>{users.map(u => <li>{u.name}</li>)}</ul>
}
```
问题：
- **重复**：多个组件要用户列表，各写一遍 fetch。
- **难测试**：请求逻辑混在 UI 里，测试要渲染组件。
- **bug 多**：竞态、四态、缓存全没处理（[异步四态](./async-four-states.md)、[竞态](./race-cancellation.md)）。
- **难替换**：换 API 地址/换数据源，要改 N 处。

## 怎么用：三层分离架构 ★

### 第 1 层：API 层（定义契约）
只管"怎么请求"，返回原始数据。一个资源一个文件，集中管理：
```
// api/user.ts
export const userApi = {
  getList: () => fetch('/api/users').then(r => r.json()),
  getById: (id) => fetch(`/api/users/${id}`).then(r => r.json()),
  update: (id, data) => fetch(`/api/users/${id}`, { method:'PUT', body: JSON.stringify(data) })
}
```
- **价值**：API 契约集中、URL/参数一处定义、好替换（换数据源只改这层）。
- 可结合 TypeScript 类型，让返回值有类型（类型即契约）。

### 第 2 层：Hook 层（封装缓存与状态）
用 Query 库把 API 封装成 Hook，处理缓存/竞态/四态：
```
// hooks/useUser.ts
export function useUser(id) {
  return useQuery(['user', id], () => userApi.getById(id))  // 自动处理四态/缓存/竞态
}
export function useUpdateUser() {
  return useMutation(userApi.update, {
    onSuccess: () => queryClient.invalidateQueries(['user'])  // 变更后失效
  })
}
```
- **价值**：把 [客户端缓存](./client-cache.md)、[竞态](./race-cancellation.md)、[异步四态](./async-four-states.md) 全封装好，组件不用操心。
- 复用：任何组件 `useUser(id)` 就拿到带缓存和状态的数据。

### 第 3 层：组件层（只管显示）
组件只调用 Hook，按状态渲染：
```
function UserProfile({ id }) {
  const { data: user, isPending, isError, refetch } = useUser(id)
  if (isPending) return <Skeleton/>
  if (isError) return <ErrorView onRetry={refetch}/>
  return <div>{user.name}</div>
}
```
- 组件变得**纯粹**：只管"拿数据→显示"，不碰请求细节。
- 可测试：mock Hook 即可测试组件。

### 这种分层的好处
- **单一职责**：API 层管契约，Hook 层管缓存，组件管显示。
- **可替换**：换 Query 库只改 Hook 层；换 API 只改 API 层。
- **可测试**：每层独立测试（API mock、Hook 单测、组件渲染测试）。
- 呼应 [01-12 架构](../01-12-architecture-engineering/README.md) 的分层思想。

## 常见坑

- ❌ **组件里直接 fetch**：散乱、难复用、bug 多。
  - ✅ 正例：API 层 + Hook 层分离。
- ❌ **Hook 里混业务逻辑**：Hook 应只管"数据获取+缓存"，业务计算放组件或专门的工具函数。
- ❌ **API 层和 Hook 层不分**：把 URL/参数塞进 Hook，难替换数据源。
  - ✅ 正例：API 层是纯请求函数，Hook 层套缓存逻辑。
- ❌ **类型不贯穿**：API 返回 any，类型契约丢失。用 TypeScript 让类型从 API → Hook → 组件贯穿。

## 关联（双向打通）

- **依赖 ↓**：[客户端缓存](./client-cache.md)、[异步四态](./async-four-states.md)、[01-5 状态架构](../01-5-state-management/state-architecture.md)
- **属于 ↑**：[01-6 数据获取与缓存](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 整体项目架构 → [01-12 架构与工程化](../01-12-architecture-engineering/README.md)
  - 类型契约贯穿 → [01-12 TypeScript](../01-12-architecture-engineering/README.md)
  - 测试各层 → [01-13 可观测性与质量](../01-13-observability-quality/README.md)
