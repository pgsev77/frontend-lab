# 获取模式（Fetch Patterns）

> "什么时候发请求、怎么发、发几个"——这是数据获取的时机问题。请求瀑布（waterfall）是前端性能杀手之一。这篇讲清四种获取模式和如何避免瀑布。

## 是什么

获取模式指**何时发起请求、请求之间如何组织**。核心区别在于并行还是串行：

| 模式 | 特点 | 性能 |
|---|---|---|
| **渲染时获取**（render-phase fetch） | 组件挂载即请求 | 简单，但易瀑布 |
| **获取后渲染**（fetch-then-render） | 数据到齐再渲染 | 无瀑布，但延迟显示 |
| **并行获取**（parallel） | 多个请求同时发 | 快 |
| **瀑布获取**（waterfall）❌ | 请求串行依赖 | 慢 |

一句话边界：**并行 vs 串行是性能分水岭。** `Promise.all` 让独立请求并行，瀑布则让总时间等于所有请求之和。

## 为什么：请求瀑布为什么慢

### 瀑布的典型场景
```
组件挂载 → fetch 用户信息 → 等待 → 拿到 userId
  → fetch 用户订单（依赖 userId）→ 等待 → 拿到订单
    → fetch 订单详情（依赖订单 id）→ 等待
总时间 = T1 + T2 + T3   （串行累加，慢）
```
更隐蔽的瀑布：**子组件各自挂载时 fetch**，父渲染完子才挂载、子 fetch 完孙才挂载——层层等待，视觉上"内容一点点冒出来"，体验差。

### 并行的解法
如果请求之间**没有依赖**，用 `Promise.all` 并行：
```
// 三个独立请求，并行发，总时间 ≈ 最慢的那个
const [user, orders, notices] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/orders').then(r => r.json()),
  fetch('/api/notices').then(r => r.json()),
])
```

## 怎么用：四种模式

### 1. 渲染时获取（最常见）
组件 mount 时发请求，配合 [异步四态](./async-four-states.md)。
```
useEffect(() => { fetchUser().then(setUser) }, [])
```
- **优点**：简单，组件自治。
- **坑**：嵌套组件各自 fetch 容易形成瀑布。

### 2. 并行获取（消除瀑布）
把无依赖的请求用 Promise.all 并发。子组件的请求，如果无依赖，可在父级并行发起再传入。

### 3. 预取（prefetch）★ 感知优化
在用户**还未到达**时就提前请求，等用户到了数据已就绪，"感觉瞬间加载"：
- **路由预取**：用户悬停在链接上时，预取目标页数据（Next.js Link 默认预取）。
- **空闲预取**：首屏加载完后，用 `requestIdleCallback` 预取用户大概率会去的下一页。
- **SWR 预取**：Query 库常支持 `prefetch` API。

> 预取是 [感知性能](../01-9-performance-ux/README.md) 的利器——把请求时间藏到用户感知不到的地方。

### 4. 数据路由（loader）—— 解决依赖瀑布
新一代路由（Next.js App Router / Remix）支持 **loader**：在路由层级并行加载数据，组件接收已就绪的数据，避免"渲染→fetch→再渲染"的瀑布。详见 [01-7 数据路由](../01-7-routing/README.md)。

```
// 路由 loader：进入路由前并行加载，组件直接拿数据
route('/user/:id', {
  loader: async ({ params }) => {
    const user = await fetchUser(params.id)       // 依赖关系在这里处理
    const orders = await fetchOrders(user.id)
    return { user, orders }
  },
  Component: ({ data }) => <UserView user={data.user} orders={data.orders} />
})
```

## 常见坑

- ❌ **嵌套组件各自 fetch 形成瀑布**：父 fetch 完渲染子、子再 fetch，层层等待。
  - ✅ 正例：把无依赖请求提升到父级并行，或用路由 loader。
- ❌ **能并行的请求写成 await 串行**：`await a(); await b()` 比 `Promise.all([a(),b()])` 慢一倍。
  - ✅ 正例：无依赖时用 Promise.all。
- ❌ **过度预取**：预取太多用户根本不会去的页面，浪费流量和带宽。

## 关联（双向打通）

- **依赖 ↓**：[异步四态](./async-four-states.md)、[01-5 副作用管理](../01-5-state-management/side-effects.md)
- **属于 ↑**：[01-6 数据获取与缓存](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 请求结果的缓存 → [客户端缓存](./client-cache.md)
  - 路由层获取 → [01-7 数据路由](../01-7-routing/README.md)
  - 预取与感知性能 → [01-9 性能与体验](../01-9-performance-ux/README.md)
