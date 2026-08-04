# 路由与布局落地（Next.js 落地）

> 对应 v1：[01-7 路由模型](../../01-pillars/01-7-routing/routing-model.md) · [01-7 嵌套路由](../../01-pillars/01-7-routing/nested-routes-layout.md) · [01-7 URL 即状态](../../01-pillars/01-7-routing/url-as-state.md)

## 它解决什么

上一篇讲了目录约定，这篇讲**路由的实际使用**：嵌套布局怎么持久化、动态/路由组、Link 导航、URL 状态（searchParams）怎么读写。把 v1 的路由原理在 App Router 里落地。

## 嵌套布局与持久化

```tsx
// app/dashboard/layout.tsx —— /dashboard 的布局
import { Sidebar } from './sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />              {/* 切换子路由时，Sidebar 不重挂载、状态保留 */}
      <main className="flex-1">{children}</main>
    </div>
  )
}

// app/dashboard/analytics/page.tsx
export default function Analytics() { return <AnalyticsView /> }
// app/dashboard/settings/page.tsx
export default function Settings() { return <SettingsView /> }
```
从 `/dashboard/analytics` 切到 `/dashboard/settings`：Sidebar 不卸载（持久化），只有 `<main>` 内的 children 换。呼应当前 v1 [01-7 嵌套](../../01-pillars/01-7-routing/nested-routes-layout.md) 的"布局持久化"。

## 路由组（Route Groups）：组织不影响 URL

用 `(group)` 目录分组，**不进入 URL**：
```
app/
├── (marketing)/          ← 组名加括号，不进 URL
│   ├── page.tsx          ← 仍是 /（不是 /(marketing)/）
│   └── about/page.tsx    ← /about
├── (dashboard)/
│   └── admin/page.tsx    ← /admin
```
用途：给不同区域用不同 layout，但不改 URL。呼应当前 v1 [01-12 项目架构](../../01-pillars/01-12-architecture-engineering/project-architecture.md) 的内聚组织。

## Link 与导航

```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 声明式导航（推荐）
<Link href="/users/123">用户详情</Link>
<Link href="/users/123" prefetch>   {/* 默认就预取，悬停/进入视口时拉目标页 */}

// 编程式导航（'use client' 组件内）
'use client'
function LoginButton() {
  const router = useRouter()
  return <button onClick={() => router.push('/dashboard')}>登录</button>
}
// router.replace('/login')  替换（不进历史栈，呼应当前 v1 编程式导航）
// router.back()             后退
```
> `Link` 默认预取（prefetch）目标页——用户点之前代码已就绪，"感觉瞬间"。呼应当前 v1 [01-7 代码分割](../../01-pillars/01-7-routing/code-splitting.md) 的预取感知优化。

## URL 即状态：searchParams

App Router 里，**服务端组件**通过 props 收 searchParams，**客户端组件**用 `useSearchParams`：

```tsx
// 服务端组件：searchParams 作为 prop
// app/products/page.tsx  路由 /products?category=phone&page=2
export default function Products({ searchParams }: { searchParams: { category?: string; page?: string } }) {
  const category = searchParams.category ?? 'all'   // 读 URL 状态
  return <ProductList category={category} />
}

// 客户端组件：useSearchParams
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

function FilterBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    router.push(`${pathname}?${params}`)   // 改 URL = 改状态
  }
  return <button onClick={() => setFilter('category', 'phone')}>手机</button>
}
```
呼应当前 v1 [01-7 URL 即状态](../../01-pillars/01-7-routing/url-as-state.md)：筛选/分页放 URL，可分享、可刷新、可后退。

## 动态路由与 catch-all

```tsx
// app/users/[id]/page.tsx        → /users/123      params: { id: '123' }
// app/shop/[...slug]/page.tsx    → /shop/a/b/c     params: { slug: ['a','b','c'] }
// app/shop/[[...slug]]/page.tsx  → /shop 也可（可选 catch-all）
export default function Page({ params }: { params: { id: string } }) { ... }
```

## 为什么这样写（设计决策）

- **Link 默认预取**：感知性能优先（呼应当前 v1 [01-9 感知性能](../../01-pillars/01-9-performance-ux/perceived-performance.md)）。
- **searchParams 服务端可直接读**：服务端组件能拿到 URL 状态做初始渲染，避免"客户端才拿筛选"的瀑布。
- **路由组不进 URL**：保持 URL 干净（呼应当前 v1 [01-7 URL 即状态](../../01-pillars/01-7-routing/url-as-state.md) 的"URL 是给用户/分享的"）。

## 常见坑

- ❌ **用 `<a href>` 而非 `<Link>`**：`<a>` 整页刷新，丢失 SPA 体验和状态。用 `Link`。
- ❌ **客户端组件忘 'use client' 就用 useRouter/useSearchParams**：这些是客户端 hook，必须在客户端组件。
- ❌ **searchParams 当唯一数据源但忘了同步**：改了筛选没更新 URL，刷新丢失。改状态同时改 URL。
- ❌ **Link 预取太多**：大量 Link 都预取，占带宽。非关键链接可 `{ prefetch: false }`。

## 关联

- ↑ 对应 v1 原理：[01-7 路由模型](../../01-pillars/01-7-routing/routing-model.md) · [01-7 URL 即状态](../../01-pillars/01-7-routing/url-as-state.md) · [01-7 编程式导航](../../01-pillars/01-7-routing/programmatic-navigation.md)
- → v2 相关：[04 渲染模式](./04-rendering-modes.md) · [05 数据获取](./05-data-fetching.md)
