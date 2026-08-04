# 01-6 · 数据获取与缓存

> **轴属：状态轴**。前端不拥有数据，只是后端状态的投影。本支柱回答"这份投影怎么获取、怎么缓存、怎么保持新鲜、怎么应对异步的混乱"——这是前端最频繁也最容易出 bug 的领域。

## 本支柱解决什么问题
前端 80% 的 bug 和"数据获取"有关：竞态、过时数据、重复请求、loading/error/empty 四态缺失。本支柱回答：**怎么规范地获取数据、怎么用客户端缓存、怎么处理竞态与取消、怎么做乐观更新**。这是 [复杂度来源 2（异步时间错位）](../../00-foundation/complexity-sources.md) 的核心战场。

## 详细大纲（→ 点击标题阅读）

### [1. 异步四态](./async-four-states.md)
- loading（加载中）→ 骨架屏/Spinner
- success（成功）→ 渲染数据
- error（失败）→ 错误态 + 重试
- empty（成功但为空）→ 空状态
- 为什么"四态缺一"就是 bug（只写 success = 赌运气）

### [2. 获取模式](./fetch-patterns.md)
- 渲染时获取（组件 mount 即请求）
- 获取后渲染（请求完再渲染，配合 Suspense）
- 渲染同时获取（流水线，并行）
- waterfall vs parallel（请求瀑布 vs 并发，Promise.all）
- 预取（prefetch）：路由切换/悬停时提前请求

### [3. 客户端缓存](./client-cache.md)
- 为什么要把服务端状态缓存起来（避免重复请求、即时显示）
- SWR / TanStack Query 的核心模型：
  - 缓存 key（请求的唯一标识）
  - stale-while-revalidate（先返缓存，后台静默刷新）
  - 自动重新获取（窗口聚焦、网络恢复、轮询）
- 缓存失效策略（invalidate / TTL / 手动）
- 为什么不该用 Redux/Zustand 手撸请求缓存（→ 呼应 00-2 权衡）

### [4. 竞态与取消](./race-cancellation.md)
- 竞态问题：连点切换，旧请求后返回，覆盖了新数据
- 解决方案：
  - 请求 ID / 序号（只认最新请求的结果）
  - AbortController（取消旧请求）
- useEffect 的竞态陷阱与正确写法
- → 竞态是 [复杂度来源 2](../../00-foundation/complexity-sources.md) 的典型表现

### [5. 乐观更新](./optimistic-update.md)
- 什么是乐观更新：先假设成功改 UI，等服务端确认
- 为什么用它（即时反馈，体验好）
- 代价：失败时要回滚
- TanStack Query 的 onMutate / rollback 模式
- 乐观更新 vs 悲观更新的权衡

### [6. 数据同步策略](./sync-strategies.md)
- 什么时候该重新拉取（stale-while-revalidate、焦点刷新、轮询、手动失效）
- 乐观更新后如何让缓存与服务端一致
- 实时数据：WebSocket / SSE 推送更新缓存（→ 详见 01-8 交互的实时通信）
- 分页与无限滚动的缓存处理

### [7. 错误处理与重试](./error-handling-retry.md)
- 请求失败的三类：网络错误、服务端错误、业务错误
- 重试策略（指数退避、最大次数）
- 错误边界兜底（→ 详见 01-13）
- 优雅降级（部分数据失败时仍展示可用部分）

### [8. 数据获取的架构位置](./fetch-architecture.md)
- 在组件里直接 fetch（简单但难复用）
- 自定义 Hook 封装（useUser/useOrder）
- API 层 + Hook 层分离（API 定义契约，Hook 管缓存与状态）
- → 完整分层见 [01-12 架构](../01-12-architecture-engineering/README.md)

## 学完应能回答
- 异步四态是哪四个？为什么缺一个就是 bug？
- SWR/TanStack Query 的 stale-while-revalidate 是什么意思？
- 竞态问题怎么产生的？怎么解决（请求 ID / AbortController）？
- 乐观更新是什么？失败时为什么要回滚？
- 为什么不该用 Redux 手撸请求缓存？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 状态轴
- **依赖 ↓**：[01-5 状态管理](../01-5-state-management/README.md)（服务端状态是状态分类的一类）、[09 网络](../../09-prerequisites/README.md)（HTTP/缓存）
- **相关 →**：[01-7 路由](../01-7-routing/README.md)（数据路由 loader）、[01-8 交互](../01-8-interaction-forms/README.md)（实时通信/防抖）、[01-13 可观测](../01-13-observability-quality/README.md)（错误监控）
