# App Router 项目骨架（Next.js 落地）

> 对应 v1：[01-7 嵌套路由与布局](../../01-pillars/01-7-routing/nested-routes-layout.md) · [01-12 项目架构](../../01-pillars/01-12-architecture-engineering/project-architecture.md)

## 它解决什么

App Router 用**文件系统约定**定义路由——目录结构即路由结构。这篇讲清 App Router 的目录约定、文件角色（layout/page/loading/error），让你看懂任何 App Router 项目。

## 目录即路由

```
app/
├── layout.tsx          ← 根布局（所有页面共享，持久化不重挂载）
├── page.tsx            ← 首页（路由 /）
├── globals.css         ← 全局样式
├── loading.tsx         ← 全局加载态（Suspense fallback）
├── error.tsx           ← 全局错误边界
├── not-found.tsx       ← 404
├── users/
│   ├── layout.tsx      ← /users 的布局（持久化）
│   ├── page.tsx        ← /users 列表页
│   └── [id]/
│       └── page.tsx    ← /users/:id 详情页（动态路由）
└── settings/
    └── page.tsx        ← /settings
```

**核心约定**：
- **目录 = 路由段**：`users/` 目录对应 `/users`。
- **`page.tsx` = 该路由的 UI**：有 page.tsx 才是可访问路由。
- **`[id]` = 动态路由**：`/users/123` 里 `id=123`。
- **`layout.tsx` = 嵌套布局**：包裹子路由，跨页持久化。

## 文件角色

| 文件 | 作用 | 呼应 v1 |
|---|---|---|
| `page.tsx` | 路由页面 UI | [01-7 路由](../../01-pillars/01-7-routing/routing-model.md) |
| `layout.tsx` | 嵌套布局（持久化） | [01-7 嵌套路由布局](../../01-pillars/01-7-routing/nested-routes-layout.md) |
| `loading.tsx` | 加载态（Suspense fallback） | [01-6 异步四态](../../01-pillars/01-6-data-fetching/async-four-states.md) |
| `error.tsx` | 错误边界 | [01-13 错误边界](../../01-pillars/01-13-observability-quality/error-boundary.md) |
| `not-found.tsx` | 404 兜底 | [01-7 导航体验](../../01-pillars/01-7-routing/navigation-ux.md) |
| `template.tsx` | 类似 layout 但每次重挂载（少用） | — |

## 怎么写：基础骨架

```tsx
// app/layout.tsx —— 根布局（必须，包裹所有页面）
import './globals.css'

export const metadata = { title: 'My App' }   // SEO 元数据

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <NavBar />          {/* 全局导航，跨页持久化 */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

```tsx
// app/page.tsx —— 首页（路由 /）
export default function Home() {
  return <h1>首页</h1>
}
```

```tsx
// app/users/[id]/page.tsx —— 动态路由 /users/:id
export default function UserDetail({ params }: { params: { id: string } }) {
  return <h1>用户 {params.id}</h1>   // params.id 来自 URL
}
```

## loading.tsx 与 error.tsx（约定优于配置）

```tsx
// app/users/loading.tsx —— /users 及子路由加载时显示
export default function Loading() {
  return <Skeleton />          // 自动用 Suspense 包裹，无需手写
}

// app/users/error.tsx —— /users 及子路由渲染出错兜底
'use client'                    // error 必须是客户端组件
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>出错了：{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )
}
```

> App Router 把 v1 讲的"异步四态""错误边界""404 兜底"全部**约定化**——放对应文件即生效，不用手写 Suspense/ErrorBoundary 包裹。呼应当前 v1 [01-13 错误边界](../../01-pillars/01-13-observability-quality/error-boundary.md)。

## 为什么这样写（设计决策）

- **文件约定 > 配置**：不用写路由表，目录就是路由，符合 [01-12 项目架构](../../01-pillars/01-12-architecture-engineering/project-architecture.md) "约定优于配置"。
- **layout 持久化**：切换子路由时 layout 不重挂载，状态保留（呼应当前 v1 [01-7 嵌套](../../01-pillars/01-7-routing/nested-routes-layout.md)）。
- **loading/error 用文件而非手动包裹**：减少样板代码，强制每个路由都有加载/错误态（呼应当前 v1 [01-6 异步四态](../../01-pillars/01-6-data-fetching/async-four-states.md) 的"四态不可省"）。

## 常见坑

- ❌ **忘了 page.tsx**：只有目录没有 page.tsx，路由不可访问。
- ❌ **error.tsx 忘加 'use client'**：error 组件需要 reset（客户端交互），必须是客户端组件。
- ❌ **在 layout 里做依赖子路由数据的副作用**：layout 持久化，子路由切换时不会重跑 effect。
- ❌ **混淆动态路由 `[id]` 和 catch-all `[...slug]`**：前者单段，后者匹配多段。

## 关联

- ↑ 对应 v1 原理：[01-7 嵌套路由](../../01-pillars/01-7-routing/nested-routes-layout.md) · [01-12 项目架构](../../01-pillars/01-12-architecture-engineering/project-architecture.md)
- → v2 相关：[03 路由与布局](./03-routing-layout.md) · [04 渲染模式](./04-rendering-modes.md)
