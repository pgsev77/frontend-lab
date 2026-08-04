# TanStack Query 服务端状态（React 落地）

> 对应 v1：[01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md) · [01-6 竞态与取消](../../01-pillars/01-6-data-fetching/race-cancellation.md) · [01-6 同步策略](../../01-pillars/01-6-data-fetching/sync-strategies.md)

## 它解决什么

v1 [01-6](../../01-pillars/01-6-data-fetching/README.md) 讲了服务端状态的本质（缓存+失效+竞态）。这篇讲 TanStack Query 在 React 里的实际用法——queryKey/staleTime/mutation/乐观更新。把 v1 [01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md) 落地。

## 配置 Provider

```tsx
// app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,           // 30s 内算新鲜，不后台刷新
        refetchOnWindowFocus: true,  // 窗口聚焦自动刷新
        retry: 1,                    // 失败重试 1 次
      },
    },
  }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

## 查询：useQuery + 异步四态

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'

export function UserList() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['users'],                       // ★ 缓存 key（唯一标识）
    queryFn: () => fetch('/api/users').then(r => r.json()),
  })

  if (isPending) return <Skeleton />           // 呼应当前 v1 异步四态
  if (isError) return <ErrorView msg={error.message} onRetry={() => refetch()} />
  if (data.length === 0) return <EmptyState /> // empty 态
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```
呼应当前 v1 [01-6 异步四态](../../01-pillars/01-6-data-fetching/async-four-states.md)——Query 内置 loading/error/data，不用手管。竞态/去重也自动处理（呼应当前 v1 [01-6 竞态](../../01-pillars/01-6-data-fetching/race-cancellation.md)）。

## queryKey 设计 ★

key 是缓存唯一标识，相同 key 共享缓存：
```tsx
useQuery({ queryKey: ['users'], queryFn: ... })                    // 用户列表
useQuery({ queryKey: ['users', userId], queryFn: ... })            // 单个用户
useQuery({ queryKey: ['users', { role: 'admin' }], queryFn: ... }) // 筛选
useQuery({ queryKey: ['users', 'page', page], queryFn: ... })      // 分页
```
> key 要稳定（用原始值），别放每次新建的对象/函数引用，否则每次 miss 缓存。呼应当前 v1 [01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md)。

## mutation 与失效

```tsx
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: string; name: string }) =>
      fetch(`/api/users/${input.id}`, { method: 'PUT', body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })   // ★ 变更后失效，自动重取
    },
  })
}
```
呼应当前 v1 [01-6 同步策略](../../01-pillars/01-6-data-fetching/sync-strategies.md) 的"变更后手动失效"。

## 乐观更新

呼应当前 v1 [01-6 乐观更新](../../01-pillars/01-6-data-fetching/optimistic-update.md)——先假设成功改 UI，失败回滚：

```tsx
useMutation({
  mutationFn: toggleLike,
  onMutate: async (vars) => {
    await qc.cancelQueries({ queryKey: ['post', vars.id] })
    const prev = qc.getQueryData(['post', vars.id])
    qc.setQueryData(['post', vars.id], (old: Post) => ({ ...old, liked: vars.liked }))  // 乐观改
    return { prev }
  },
  onError: (_e, vars, ctx) => {
    qc.setQueryData(['post', vars.id], ctx!.prev)   // 失败回滚
  },
  onSettled: () => qc.invalidateQueries({ queryKey: ['post'] }),
})
```

## staleTime vs gcTime（易混）

呼应当前 v1 [01-6 同步策略](../../01-pillars/01-6-data-fetching/sync-strategies.md)：
- `staleTime`：多久内算"新鲜"（不后台刷新）。
- `gcTime`（旧 cacheTime）：多久没被用就从内存清掉。

## 与 Server Components 的分工

呼应当前 v1 + [nextjs/05](../nextjs/05-data-fetching.md)：
- **首屏**用 Server Components async fetch（服务端拿，0 客户端请求）。
- **交互后**用 TanStack Query（客户端缓存/失效）。
- 两者配合：首屏数据注入 Query 缓存（`initialData` / Hydration），交互后 Query 接管。

## 为什么这样写（设计决策）

- **Query 只管服务端状态**：不混客户端 UI（那是 Zustand 的活），呼应当前 v1 状态分类。
- **mutation onSuccess 失效**：让"提交后列表自动刷新"成为默认，不用手动同步。
- **乐观更新存旧值**：失败能回滚（呼应当前 v1）。

## 常见坑

- ❌ **用 Zustand 管接口数据**：手动 refetch 泥潭。接口数据用 Query。
- ❌ **queryKey 不稳定**：含新建对象/函数，每次 miss 缓存狂发请求。
- ❌ **mutation 后不失效**：提交了数据界面没变。onSuccess invalidate。
- ❌ **乐观更新不存旧值**：失败无法回滚。
- ❌ **首屏也用 Query**：客户端 effect 拿数据，白屏+瀑布。首屏用 Server Components。

## 关联

- ↑ 对应 v1 原理：[01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md) · [01-6 同步策略](../../01-pillars/01-6-data-fetching/sync-strategies.md) · [01-6 乐观更新](../../01-pillars/01-6-data-fetching/optimistic-update.md)
- → v2 相关：[01 Zustand](./01-zustand.md) · [nextjs/05 数据获取](../nextjs/05-data-fetching.md)
