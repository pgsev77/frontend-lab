# 性能（React 落地）

> 对应 v1：[01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md) · [01-9 运行时性能](../../01-pillars/01-9-performance-ux/runtime-performance.md)

## 它解决什么

React 18 的并发特性（useTransition/useDeferredValue/Suspense）让重渲染可中断、用户输入优先。这篇讲这些 API 怎么用，以及 React Profiler 怎么定位性能问题。把 v1 [01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md) 在 React 落地。

## useTransition：让重渲染不阻塞输入 ★

呼应当前 v1 [01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md)——把"昂贵的状态更新"标为低优先级，用户输入永远优先：

```tsx
'use client'
import { useState, useTransition } from 'react'

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)                    // 高优先级：输入框立即更新（流畅）
    startTransition(() => {                      // 低优先级：结果可延后
      setResults(expensiveSearch(e.target.value))   // 大列表重渲染不阻塞输入
    })
  }

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <span>搜索中...</span>}
      <ResultList results={results} />
    </>
  )
}
```

**原理**（呼应当前 v1）：`startTransition` 里的更新被标为 transition，React 在渲染它时可中断——若有用户输入到来，先处理输入，transition 延后。这解决了"输入框卡顿"（输入时大列表重渲染阻塞）。

## useDeferredValue：推迟派生值

类似 useTransition，但用于"接收外部值想推迟"的场景：

```tsx
'use client'
import { useDeferredValue, useMemo } from 'react'

function FilteredList({ items, query }: { items: Item[]; query: string }) {
  const deferredQuery = useDeferredValue(query)   // 推迟 query 的更新
  const filtered = useMemo(() => items.filter(i => i.name.includes(deferredQuery)), [items, deferredQuery])
  // query 变了，但 filtered 用旧的 deferredQuery 算，等空闲再切到新值
  return <ul>{filtered.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}
```

> useTransition 适合"你主动触发的更新降优先级"；useDeferredValue 适合"被动接收的 props/状态想推迟"。两者都是并发渲染的应用。

## Suspense：声明式加载态

呼应当前 v1 [01-6 异步四态](../../01-pillars/01-6-data-fetching/async-four-states.md) + [01-4 流式渲染](../../01-pillars/01-4-rendering/rendering-scheduling.md)：

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <h1>仪表盘</h1>
      {/* 慢组件数据没到时显示 fallback，到了自动替换 */}
      <Suspense fallback={<Skeleton />}>
        <SlowChart />
      </Suspense>
    </>
  )
}
```
配合 Server Components 的 async fetch 或 TanStack Query 的 Suspense 模式，实现"先显示骨架，数据到了再填"的流式渲染。

## React Profiler：定位重渲染

呼应当前 v1 [01-13 调试](../../01-pillars/01-13-observability-quality/debugging.md)——用 React DevTools 的 Profiler 找"谁在频繁/昂贵地重渲染"：

1. 装 React DevTools 浏览器扩展。
2. 打开 Profiler → 录制 → 操作界面 → 停止。
3. 看火焰图：哪些组件渲染了、耗时多少、**为什么渲染**（props 变了？state 变了？父渲染带动？）。
4. 针对性优化（memo / 拆状态 / useTransition）。

> Profiler 的价值：**用数据定位**"到底慢在哪、谁在无谓渲染"，而非盲目 memo。

## 优化手段回顾（呼应各篇）

| 问题 | 手段 | 见 |
|---|---|---|
| 无谓重渲染 | memo + 稳定引用 | [02 状态与重渲染](./02-state-rerender.md) |
| 输入卡顿 | useTransition | 本篇 |
| 大列表 | 虚拟列表 | v1 [02-3 极致性能](../../02-advanced/performance-extreme.md) |
| 长任务 | Web Worker | v1 [02-3 极致性能](../../02-advanced/performance-extreme.md) |
| 定位瓶颈 | Profiler | 本篇 + v1 [01-13 调试](../../01-pillars/01-13-observability-quality/debugging.md) |

## 为什么这样写（设计决策）

- **并发 API 按需用**：useTransition 只用于"可延后的昂贵更新"，别滥用（普通更新套 transition 反而拖慢）。
- **Suspense 做加载态**：比手写 `if (loading)` 更声明式，且支持流式渲染（呼应当前 v1 [01-4](../../01-pillars/01-4-rendering/rendering-scheduling.md)）。
- **Profiler 驱动优化**：先测后优化，不盲目 memo。

## 常见坑

- ❌ **滥用 useTransition**：所有更新都套 transition，普通更新也被拖慢。只用于昂贵可延后的。
- ❌ **不测就 memo**：盲目 memo，依赖数组维护成本超过收益。先 Profiler 定位。
- ❌ **Suspense fallback 不友好**：用空白 fallback，用户不知道在加载。用骨架。
- ❌ **忽视 Server Components 的性能红利**：RSC 本身就减少客户端 JS 和重渲染，优先用 RSC，再考虑客户端优化（见 [nextjs/04](../nextjs/04-rendering-modes.md)）。

## 关联

- ↑ 对应 v1 原理：[01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md) · [01-9 运行时性能](../../01-pillars/01-9-performance-ux/runtime-performance.md) · [01-13 调试](../../01-pillars/01-13-observability-quality/debugging.md)
- → v2 相关：[02 状态与重渲染](./02-state-rerender.md) · [nextjs/04 渲染模式](../nextjs/04-rendering-modes.md)
