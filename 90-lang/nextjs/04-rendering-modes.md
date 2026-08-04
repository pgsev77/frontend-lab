# 渲染模式（Next.js 落地）

> 对应 v1：[02-1 SSR 与同构](../../02-advanced/ssr-isomorphic.md) · [01-4 声明式 UI](../../01-pillars/01-4-rendering/declarative-rendering.md) · [01-9 关键渲染路径](../../01-pillars/01-9-performance-ux/critical-rendering-path.md)

## 它解决什么

v1 [02-1](../../02-advanced/ssr-isomorphic.md) 讲了 CSR/SSR/SSG/ISR/RSC 的原理。这篇讲在 **Next.js App Router 里怎么选、怎么写**——每个组件/页面用哪种模式、'use client' 何时加。

## 核心认知：App Router 默认是 Server Component ★

App Router 里，**所有组件默认是服务端组件（RSC）**——在服务器渲染，**不发 JS 到客户端**。只有需要交互（useState/useEffect/事件）的才标 `'use client'` 变客户端组件。

这是与 Pages Router/纯 SPA 最大的区别：**默认服务端，按需客户端**（而非默认客户端）。

## 三种模式怎么写

### 1. 静态生成（SSG，默认）★

page.tsx 不用动态函数时，**构建时生成静态 HTML**，最快：

```tsx
// app/blog/[slug]/page.tsx —— 构建时静态生成
async function getPost(slug: string) {
  return await db.post.findUnique({ where: { slug } })
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)   // 服务端直接 async 获取
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>
}
```
> 这篇页面构建时生成静态 HTML，CDN 分发，毫秒级。呼应当前 v1 [01-9 加载性能](../../01-pillars/01-9-performance-ux/loading-performance.md) 的 SSG+CDN。

### 2. 服务端渲染（SSR，按需）

需要"每次请求都重新渲染"（个性化数据），用动态函数：

```tsx
import { cookies, headers } from 'next/headers'

// app/dashboard/page.tsx —— 每次请求都渲染（读登录态）
export default async function Dashboard() {
  const userId = cookies().get('userId')?.value   // 动态函数 → 强制 SSR
  const user = await getUser(userId)
  return <h1>欢迎，{user.name}</h1>
}
```
读了 `cookies()`/`headers()` 等动态函数，这个页面就变成 SSR（每次请求渲染）。呼应当前 v1 [02-1 SSR](../../02-advanced/ssr-isomorphic.md)。

### 3. 增量静态再生（ISR）

内容会更新但不必每次请求都渲染——定期重新生成静态页：

```tsx
// app/blog/page.tsx —— 每 60 秒重新生成
export const revalidate = 60

export default async function Blog() {
  const posts = await getPosts()   // 首次构建静态，之后每 60s 后台再生
  return posts.map(p => <PostCard key={p.id} post={p} />)
}
```
呼应当前 v1 [02-1 ISR](../../02-advanced/ssr-isomorphic.md)——静态的速度 + 内容新鲜度。

## 客户端组件：'use client'

需要交互（state/effect/事件）时，**加 `'use client'`**：

```tsx
// app/components/Counter.tsx
'use client'                      // ★ 标记客户端组件
import { useState } from 'react'

export function Counter() {
  const [n, setN] = useState(0)   // useState 只在客户端组件可用
  return <button onClick={() => setN(n + 1)}>点了 {n} 次</button>
}
```

**组合使用**：服务端组件（数据获取/SEO）内嵌客户端组件（交互）：
```tsx
// app/products/page.tsx（服务端组件）
export default async function Products() {
  const products = await getProducts()       // 服务端获取，0 客户端 JS
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
      <FilterBar />    {/* 客户端组件，负责交互筛选 */}
    </div>
  )
}
```

## 怎么选：决策树

```
这个组件/页面需要：
├─ 交互（state/effect/事件）？     → 'use client'（客户端组件）
├─ 读请求时数据（cookies/headers）？ → SSR（动态函数）
├─ 内容定期更新？                   → ISR（revalidate）
└─ 否则                            → SSG（默认，构建时静态）
```

## 为什么这样写（设计决策）

- **默认服务端组件**：减少客户端 JS（呼应当前 v1 [01-9 加载](../../01-pillars/01-9-performance-ux/loading-performance.md)），首屏快。只有交互部分发到客户端。
- **async 直接获取数据**：Server Components 里 `await getData()`，无需 getServerSideProps 那套样板，也无请求瀑布（呼应当前 v1 [01-7 数据路由](../../01-pillars/01-7-routing/data-routing.md)）。
- **'use client' 边界尽量下推**：把客户端组件做成叶子节点（最小范围），让尽可能多的组件保持服务端。

## 常见坑

- ❌ **在服务端组件里用 useState/useEffect**：报错。需要交互就加 'use client'。
- ❌ **'use client' 加在顶层把整树变客户端**：失去 RSC 优势（全发客户端）。下推到叶子。
- ❌ **客户端组件里直接 async 获取数据**：客户端组件不能 async 获取（那是服务端特权），客户端用 TanStack Query。
- ❌ **误以为加了 'use client' 就不能 SEO**：客户端组件仍可在服务端预渲染初始 HTML。

## 关联

- ↑ 对应 v1 原理：[02-1 SSR 与同构](../../02-advanced/ssr-isomorphic.md) · [01-4 声明式 UI](../../01-pillars/01-4-rendering/declarative-rendering.md)
- → v2 相关：[05 数据获取](./05-data-fetching.md) · [react/ 组件与 Hooks](../react/README.md)
