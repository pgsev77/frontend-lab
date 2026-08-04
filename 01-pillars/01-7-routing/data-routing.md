# 数据路由（Data Routing / Loaders & Actions）

> 路由曾经只管"显示哪个组件"。新一代路由（Remix / Next.js App Router）让它还管"加载什么数据、提交什么变更"——这就是数据路由。它从根本上解决了请求瀑布问题。

## 是什么

数据路由指**把数据获取和变更逻辑绑定到路由上**，而非散落在组件的 useEffect 里。路由提供两个能力：

| 能力 | 时机 | 作用 |
|---|---|---|
| **loader** | 进入路由时（渲染前） | 并行加载该路由所需数据 |
| **action** | 表单提交/变更时 | 处理变更，完成后自动重新验证数据 |

一句话边界：**传统路由只管"显示什么"，数据路由还管"数据从哪来、变更怎么提交"。**

## 为什么：解决组件内 fetch 的两大顽疾

### 顽疾 1：请求瀑布
传统组件内 fetch，父子组件各自加载，形成瀑布（详见 [01-6 获取模式](../01-6-data-fetching/fetch-patterns.md)）：
```
进入 /users/123
  → 渲染 UserPage → effect 发请求拿 user → 等待
    → 拿到 user.id → 渲染 UserOrders → effect 拿 orders → 等待
      → 渲染 OrderDetail → effect 拿详情 → 等待
总时间 = T1 + T2 + T3（串行，慢）
```

### 顽疾 2：effect 管理四态/竞态/缓存太繁琐
组件里手撸 fetch，[异步四态](../01-6-data-fetching/async-four-states.md)、[竞态](../01-6-data-fetching/race-cancellation.md) 全要自己处理，模板代码多、易出 bug。

### 数据路由的解法
把数据获取提到**路由层**，在进入路由**之前**就并行加载好，组件直接接收就绪的数据：
```
// 路由定义 loader，进入前执行
route('/users/:id', {
  loader: async ({ params }) => {
    const [user, orders] = await Promise.all([  // ★ 并行，无瀑布
      fetchUser(params.id),
      fetchOrders(params.id)
    ])
    return { user, orders }
  },
  Component: ({ loaderData }) => <UserPage user={loaderData.user} orders={loaderData.orders}/>
})
```
- 进入路由前 loader 已跑完，组件渲染即有数据，**无瀑布、无 effect、无手撸四态**。
- loader 里的并行获取天然消除瀑布。

## 怎么用：loader 与 action

### loader —— 数据加载
在路由模块导出 loader，路由匹配时执行。组件通过 hook 拿数据。Loader 可配合 Suspense 做流式渲染（部分数据先到先显示）。

### action —— 数据变更
表单提交时走 action，处理完后**自动重新跑 loader**（重新验证），UI 自动更新：
```
route('/users/:id', {
  action: async ({ request, params }) => {
    const formData = await request.formData()
    await updateUser(params.id, formData)   // 提交变更
    // action 成功后，路由自动重新执行 loader → 拿最新数据 → UI 更新
  }
})
```
**关键价值**：action + 自动 revalidate 让"提交后列表自动刷新"成为默认行为，不用手动 invalidate 缓存（对比 [01-6 缓存失效](../01-6-data-fetching/sync-strategies.md) 的手动失效）。

### 串行依赖在 loader 里处理
有依赖的请求（拿 user.id 才能拿 orders），在 loader 里串行 await：
```
loader: async ({ params }) => {
  const user = await fetchUser(params.id)        // 先拿 user
  const orders = await fetchOrders(user.id)      // 再拿 orders（依赖）
  return { user, orders }
}
```
依赖串行在 loader 里是**显式**的，比组件链式 effect 清晰得多。

## 常见坑

- ❌ **用了数据路由还在组件里 fetch**：双重获取，loader 拿一次、组件 effect 又拿一次。
  - ✅ 正例：数据路由下，组件只用 loader 提供的数据，不在 effect 里重复 fetch。
- ❌ **loader 里做重计算**：loader 应只管数据获取，重计算（排序/过滤）可放组件或派生。
- ❌ **action 后不重新验证**：手动忘了 revalidate，导致提交后数据不更新。
  - ✅ 正例：action 成功后自动/手动 invalidate，让 loader 重跑。
- ❌ **把所有状态都塞 loader**：纯 UI 状态（弹窗开关）还是用组件 state，loader 只放"路由相关的数据"。

## 关联（双向打通）

- **依赖 ↓**：[01-6 获取模式（瀑布）](../01-6-data-fetching/fetch-patterns.md)、[01-6 客户端缓存](../01-6-data-fetching/client-cache.md)、[嵌套路由](./nested-routes-layout.md)
- **属于 ↑**：[01-7 路由与导航](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 消除请求瀑布 → [01-6 获取模式](../01-6-data-fetching/fetch-patterns.md)
  - 变更后自动更新 → [01-6 同步策略](../01-6-data-fetching/sync-strategies.md)
  - Next.js App Router 的落地 → [02 前端进阶](../../02-advanced/README.md)
