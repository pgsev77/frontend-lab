# 异步四态（Async Four States）

> 这是数据获取的地基。前端 80% 的 bug 来自"只处理了成功态"——loading/error/empty 全靠用户运气。这篇定义异步必须处理的四个状态，它是 [01-5 状态机](../01-5-state-management/state-machine.md) 在数据获取场景的具体化。

## 是什么

任何一次异步数据获取，界面都可能处于以下四种状态之一：

| 状态 | 含义 | 界面应显示 |
|---|---|---|
| **loading** | 正在请求，数据未到 | 骨架屏 / Spinner |
| **success** | 请求成功，有数据 | 渲染数据 |
| **error** | 请求失败 | 错误提示 + 重试按钮 |
| **empty** | 请求成功但数据为空 | 空状态占位 |

一句话边界：**四态缺一就是 bug。** 只写 success 等于赌运气——网络一抖、数据一空，用户就看到白屏或报错。

> 这四个状态正好是一个 [状态机](../01-5-state-management/state-machine.md)：idle→loading→{success|error}，success 下还可能 empty。用单一 status 枚举管理，而非散落的布尔标志。

## 为什么：为什么必须处理四态

回到 [前端的本质](../../00-foundation/frontend-essence.md) 差异 4——前端应对非结构化的用户行为和不可控的网络。网络会断、会超时，后端会出错、会返回空。如果只写"成功后渲染数据"，那其余三种情况用户看到的就是：
- loading 时：空白（用户以为卡死）。
- error 时：白屏或一堆报错（用户不知所措）。
- empty 时：空白列表（用户以为坏了）。

每一种都让用户流失。**四态的本质是"对每一种可能都给用户合理反馈"**，这是 [防御性哲学](../../00-foundation/frontend-essence.md) 的直接体现。

## 怎么用

### 用单一 status 枚举（状态机）
```
// ❌ 散落布尔：会出现非法组合
const [isLoading, setLoading] = useState(true)
const [isError, setError] = useState(false)
const [data, setData] = useState(null)
// 视图里要写：if (isLoading && !isError && !data) ... 极易漏

// ✅ 单一 status
const [state, setState] = useState({ status: 'loading' })
// status: 'loading' | 'success' | 'error' | 'empty'
switch (state.status) {
  case 'loading': return <Skeleton/>
  case 'error':   return <ErrorView onRetry={refetch}/>
  case 'empty':   return <EmptyState/>
  case 'success': return <List items={state.data}/>
}
```
单一 status 保证任一时刻只处一个状态，非法组合不存在。TanStack Query 等库直接返回 `isPending/isError/isSuccess/data`，本质就是这个状态机。

### empty 态容易被忘
success 不等于"有数据"——请求成功但返回空数组，也是 success。要单独判断：
```
case 'success':
  if (state.data.length === 0) return <EmptyState/>  // ★ empty 态
  return <List items={state.data}/>
```

### loading 态的两种处理
- **首次加载**（还没数据）：用**骨架屏**（模拟布局的占位），它比 Spinner 体验好——减少感知等待（呼应 [01-9 感知性能](../01-9-performance-ux/README.md)）。
- **刷新/已有数据**：可保留旧数据显示，后台静默刷新（stale-while-revalidate，详见 [客户端缓存](./client-cache.md)）。

## 常见坑

- ❌ **只写 success 分支**：loading 白屏、error 报错、empty 空白，三种坏体验。
- ❌ **散落布尔标志**：`isLoading && !isError` 组合判断，漏分支。
  - ✅ 正例：单一 status 状态机。
- ❌ **loading 一律用 Spinner**：首次加载用 Spinner 让用户盯着空白转圈，感知差。
  - ✅ 正例：首次加载用骨架屏，刷新时保留旧数据。
- ❌ **error 态没有重试入口**：只显示"出错了"，用户没法自救。
  - ✅ 正例：error 态提供"重试"按钮。

## 关联（双向打通）

- **依赖 ↓**：[01-5 状态机](../01-5-state-management/state-machine.md)、[复杂度来源（异步）](../../00-foundation/complexity-sources.md)
- **属于 ↑**：[01-6 数据获取与缓存](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 四态的缓存配合 → [客户端缓存](./client-cache.md)
  - 错误态的细化 → [错误处理与重试](./error-handling-retry.md)
  - loading 的感知优化 → [01-9 感知性能](../01-9-performance-ux/README.md)
