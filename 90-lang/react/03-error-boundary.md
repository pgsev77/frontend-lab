# 错误边界（React 落地）

> 对应 v1：[01-13 错误边界与兜底](../../01-pillars/01-13-observability-quality/error-boundary.md)

## 它解决什么

一个子组件渲染崩溃会拖垮整页白屏。错误边界把崩溃隔离在局部。这篇讲 React 错误边界怎么写，以及 App Router 的 `error.tsx` 如何用文件约定自动兜底。把 v1 [01-13 错误边界](../../01-pillars/01-13-observability-quality/error-boundary.md) 在 React/Next.js 落地。

## React 错误边界（类组件）

React 错误边界**只能用类组件**实现（函数组件无原生等价）：

```tsx
'use client'
import React from 'react'

type Props = { children: React.ReactNode; fallback?: React.ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  // 渲染抛错时触发，返回新 state 显示降级 UI
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  // 捕获错误用于上报（呼应当前 v1 [01-13 监控](../../01-pillars/01-13-observability-quality/frontend-monitoring.md)）
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('捕获到错误', error, info)
    // reportToMonitoring(error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback />
    }
    return this.props.children
  }
}

function DefaultFallback() {
  return <div className="p-4 text-red-600">这部分出错了，<button onClick={() => location.reload()}>刷新</button></div>
}

// 用法：包裹易出错的子树
;<ErrorBoundary><UserWidget /></ErrorBoundary>
```

## App Router 的 error.tsx（约定优于配置）★

App Router 用 `error.tsx` 文件**自动为每层路由建错误边界**，不用手写 ErrorBoundary 包裹：

```tsx
// app/dashboard/error.tsx —— /dashboard 及子路由渲染出错时显示
'use client'   // ★ error 必须是客户端组件（需要 reset 交互）

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-4">
      <h2>出错了</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
      {/* reset 会重新渲染该路由段 */}
    </div>
  )
}
```

> App Router 把"每层路由都有错误兜底"**约定化**——放 error.tsx 即生效，呼应当前 v1 [01-13 错误边界](../../01-pillars/01-13-observability-quality/error-boundary.md) 的"局部失败不拖垮全局"。详见 [nextjs/02 App Router 骨架](../nextjs/02-app-router-structure.md)。

## 边界放哪（粒度）

- **error.tsx（每层路由）**：路由级兜底，最常用。
- **局部 ErrorBoundary**：包裹特别易错/独立的 widget（如第三方图表），隔离更细。
- **全局边界**（App 顶层）：最后防线，兜住所有未捕获错误。

## 边界兜不住的错误 ★ 重要认知

呼应当前 v1 [01-13](../../01-pillars/01-13-observability-quality/error-boundary.md)：错误边界**只捕获渲染时的同步错误**，捕获不了：
- 事件处理函数里的错误（`onClick` 里 throw）。
- 异步错误（setTimeout/fetch 回调）。
- useEffect 里的错误。

这些要 try-catch / 全局 error 事件 / [01-13 前端监控](../../01-pillars/01-13-observability-quality/frontend-monitoring.md) 兜。

```tsx
// 这些错误 error.tsx / ErrorBoundary 兜不住：
function Bad() {
  const handleClick = () => { throw new Error('事件错') }   // 不被捕获
  useEffect(() => { throw new Error('effect 错') }, [])     // 不被捕获
  return <button onClick={handleClick}>x</button>
}
```

## 为什么这样写（设计决策）

- **error.tsx 用文件约定**：减少样板代码，强制每层路由都有兜底（呼应当前 v1 四态/错误不可省）。
- **error.tsx 必须客户端组件**：它要 `reset`（重新渲染），是客户端交互。
- **类组件写 ErrorBoundary**：React 目前只支持类组件做边界；App Router 下类组件仍可用于边界（它是客户端组件）。

## 常见坑

- ❌ **error.tsx 忘 'use client'**：reset 是客户端能力，必须是客户端组件。
- ❌ **以为边界能兜所有错**：事件/异步/effect 里的错兜不住，要其他手段。
- ❌ **降级 UI 是空白**：用户不知发生了什么。给提示 + reset/刷新入口。
- ❌ **全局边界都没有**：任何渲染错全页白屏。至少 error.tsx 兜每层路由。

## 关联

- ↑ 对应 v1 原理：[01-13 错误边界与兜底](../../01-pillars/01-13-observability-quality/error-boundary.md) · [01-13 前端监控](../../01-pillars/01-13-observability-quality/frontend-monitoring.md)
- → v2 相关：[nextjs/02 App Router 骨架](../nextjs/02-app-router-structure.md) · [nextjs/04 渲染模式](../nextjs/04-rendering-modes.md)
