# 数据获取（Next.js 落地）

> 对应 v1：[01-6 数据获取与缓存](../../01-pillars/01-6-data-fetching/README.md) · [01-6 数据架构位置](../../01-pillars/01-6-data-fetching/fetch-architecture.md) · [01-7 数据路由](../../01-pillars/01-7-routing/data-routing.md)

## 它解决什么

v1 [01-6](../../01-pillars/01-6-data-fetching/README.md) 讲了数据获取的原理（四态/缓存/竞态/架构分层）。这篇讲在 Next.js App Router 里**怎么获取数据**——Server Components 直接 fetch、TanStack Query 在客户端怎么配合、两者怎么分工。

## 两条数据获取路径

| 路径 | 在哪 | 适合 | 呼应 v1 |
|---|---|---|---|
| **Server Components async fetch** | 服务端 | 首屏数据、SEO 数据 | [01-6 获取模式](../../01-pillars/01-6-data-fetching/fetch-patterns.md) 的"获取后渲染" |
| **TanStack Query** | 客户端 | 交互后的数据、需要缓存/失效的 | [01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md) |

## Server Components：async 直接获取（首屏）

```tsx
// app/users/page.tsx —— 服务端组件，async 获取
async function getUsers() {
  const res = await fetch('https://api.example.com/users', { next: { revalidate: 60 } })
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()    // 服务端获取，并行无瀑布
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )
}
```

**fetch 的缓存选项**（Next.js 扩展）：
```tsx
fetch(url, { cache: 'force-cache' })    // 默认：缓存（SSG）
fetch(url, { cache: 'no-store' })       // 不缓存：每次请求（SSR）
fetch(url, { next: { revalidate: 60 } }) // 缓存但每 60s 再生（ISR）
```

**并行获取（消除瀑布）**：
```tsx
export default async function Page() {
  // 并行，无瀑布（呼应当前 v1 [01-6 获取模式](../../01-pillars/01-6-data-fetching/fetch-patterns.md)）
  const [user, orders] = await Promise.all([getUser(), getOrders()])
  return <Dashboard user={user} orders={orders} />
}
```

**Suspense 流式渲染**：
```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <h1>仪表盘</h1>
      <Suspense fallback={<Skeleton />}>    {/* 慢的部分先显示 fallback */}
        <SlowChart />                        {/* 数据到了再填 */}
      </Suspense>
    </>
  )
}
```
呼应当前 v1 [01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md) 的流式渲染——先发就绪部分，数据到了再补。

## TanStack Query：客户端数据缓存

交互后的数据（搜索、筛选、变更）用 TanStack Query。呼应当前 v1 [01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md)。

```tsx
// app/providers.tsx —— 全局 Provider（客户端）
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
// 在 app/layout.tsx 里包裹 <Providers>{children}</Providers>
```

```tsx
// components/UserSearch.tsx —— 客户端组件用 Query
'use client'
import { useQuery } from '@tanstack/react-query'

export function UserSearch({ keyword }: { keyword: string }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['users', 'search', keyword],
    queryFn: () => fetch(`/api/users?q=${keyword}`).then(r => r.json()),
    // stale-while-revalidate、窗口聚焦刷新、去重全内置
  })

  if (isPending) return <Skeleton />                    // 异步四态
  if (isError) return <ErrorView onRetry={() => refetch()} />
  return <UserList users={data} />
}
```

## mutation 与缓存失效

```tsx
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UserInput) => fetch(`/api/users/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })   // 变更后失效，自动重取
    }
  })
}
```
呼应当前 v1 [01-6 同步策略](../../01-pillars/01-6-data-fetching/sync-strategies.md) 的"变更后手动失效"。

## 两条路径怎么分工 ★

```
首屏渲染（SSR/SSG）
  → Server Components async fetch（服务端拿数据，渲染 HTML，0 客户端请求）
     ↓
用户交互后（搜索/筛选/分页/变更）
  → TanStack Query（客户端缓存，失效重取，竞态自动处理）
```
- **首屏用 Server Components**：服务端拿数据，首屏快、SEO 好、无瀑布。
- **交互后用 TanStack Query**：需要客户端缓存、失效、乐观更新。
- 两者配合：首屏数据由服务端组件注入 Query 缓存（`initialData` 或 `hydrate`），交互后 Query 接管。

## 为什么这样写（设计决策）

- **服务端优先**：首屏数据在服务端拿，减少客户端请求和水合成本（呼应当前 v1 [01-9 关键渲染路径](../../01-pillars/01-9-performance-ux/critical-rendering-path.md)）。
- **fetch 扩展缓存选项**：一个 fetch 调用同时表达"获取+缓存策略"，比写 getStaticProps/getServerSideProps 简洁。
- **Query 只管客户端**：不让 Query 担首屏（那是 Server Components 的活），分工清晰（呼应当前 v1 [01-6 数据架构](../../01-pillars/01-6-data-fetching/fetch-architecture.md) 的分层）。

## 常见坑

- ❌ **首屏也用 TanStack Query**：客户端 effect 拿数据，首屏白屏 + 瀑布。首屏用 Server Components。
- ❌ **服务端 fetch 不设缓存选项**：行为随 Next 版本变化（默认 force-cache）。明确写 `cache`/`revalidate`。
- ❌ **客户端组件里 async 获取**：客户端组件不能 async（那是服务端特权），用 Query。
- ❌ **mutation 后不失效缓存**：数据更新了界面没变。onSuccess 里 invalidate。

## 关联

- ↑ 对应 v1 原理：[01-6 数据获取](../../01-pillars/01-6-data-fetching/README.md) · [01-6 数据架构](../../01-pillars/01-6-data-fetching/fetch-architecture.md) · [01-7 数据路由](../../01-pillars/01-7-routing/data-routing.md)
- → v2 相关：[04 渲染模式](./04-rendering-modes.md) · [state/ TanStack Query](../state/README.md)
