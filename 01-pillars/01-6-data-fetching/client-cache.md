# 客户端缓存（Server State Cache）

> 前端不拥有数据，只是后端状态的缓存。那这份缓存怎么管？——SWR/TanStack Query 给出了优雅答案。理解缓存模型，就理解了为什么"别用 Redux 管接口数据"。

## 是什么

客户端缓存指**把服务端返回的数据在浏览器内存里存一份**，下次要时先用缓存，避免重复请求。它是管理 [服务端状态](../01-5-state-management/state-classification.md) 的核心机制。

一句话边界：**服务端状态的本质就是"缓存"**——后端是真理，前端存的是可能过时的副本。缓存库（SWR/TanStack Query）专门解决"这份副本怎么存、什么时候过期、怎么刷新"。

## 为什么：为什么不用 Redux 管接口数据

### 手撸的痛苦
如果用 Redux/Zustand 手动管理接口数据，你要自己处理：
- 请求时设 loading，成功设 data，失败设 error（[四态](./async-four-states.md)）。
- 什么时候重新拉取？（数据可能过时了）
- 多个组件用同一份数据，怎么避免重复请求？
- 竞态、缓存失效、乐观更新……每一样都要手写。

结果是大量模板代码，还经常显示过时数据。

### 缓存库的承诺
TanStack Query / SWR 把这些**全部自动化**：
- **四态内置**：返回 `isPending/isError/data`，不用手管。
- **缓存 key**：每个请求用唯一 key 标识，相同 key 复用缓存。
- **自动重新获取**：窗口聚焦、网络恢复、定时刷新时自动拉新数据。
- **去重**：多个组件请求同一 key，实际只发一个请求。
- **stale-while-revalidate**：核心策略（见下）。

## 怎么用：stale-while-revalidate ★

这是现代缓存库的灵魂策略：
```
1. 第一次请求：发请求，拿到数据，存缓存。显示 loading。
2. 再次需要时（如路由回来）：
   - 立即返回缓存数据 → 界面"瞬间"显示（不白屏）
   - 同时在后台静默发请求 → 拿到新数据后替换缓存 → 界面更新
3. 用户感知：永远不白屏（有缓存先顶），且数据是较新的（后台在刷新）
```

**核心价值**：**用"可能短暂过时"换"永不白屏"**——这正是 [感知性能](../01-9-performance-ux/README.md) 的体现。

### 缓存 key 的设计
key 是请求的唯一标识，相同 key 共享缓存：
```
useQuery(['user', userId], fetchUser)       // key = ['user', userId]
useQuery(['orders', { status, page }], fetchOrders)  // key 含筛选/分页
```
key 变化（如 userId 变、筛选变）→ 视为新请求；key 相同 → 用缓存。

### 缓存失效（invalidation）
什么时候认为缓存"过期了"、需要重新拉？
- **自动失效**：库默认按 `staleTime`（如 0 = 立即 stale，后台刷新）。
- **手动失效**：执行了变更（如提交了订单）后，手动让相关缓存失效：
```
const mutation = useMutation(submitOrder, {
  onSuccess: () => queryClient.invalidateQueries(['orders'])  // 订单列表失效，自动重拉
})
```
- **触发刷新的事件**：窗口聚焦（用户切回标签页）、网络重连、定时轮询。

### 与 [状态分类](../01-5-state-management/state-classification.md) 的呼应
服务端状态交给 Query 库，**客户端 UI 状态才用 Zustand/useState**。各管各的，不要混。

## 常见坑

- ❌ **用 Redux 手撸请求缓存**：重复造轮子，还造不好（失效/竞态/去重全要手写）。
  - ✅ 正例：服务端状态用 Query 库。
- ❌ **cache key 不稳定**：key 里含每次新建的对象/函数引用，导致每次都 miss 缓存，狂发请求。
  - ✅ 正例：key 用稳定的原始值（字符串/数字/稳定对象）。
- ❌ **变更后忘了失效缓存**：提交了数据，列表没刷新，用户以为没提交成功。
  - ✅ 正例：mutation 成功后 invalidate 相关 query。
- ❌ **staleTime 设太长**：数据明明变了，界面还显示旧的。

## 关联（双向打通）

- **依赖 ↓**：[状态分类（服务端状态）](../01-5-state-management/state-classification.md)、[异步四态](./async-four-states.md)
- **属于 ↑**：[01-6 数据获取与缓存](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 缓存与竞态 → [竞态与取消](./race-cancellation.md)
  - 缓存与乐观更新 → [乐观更新](./optimistic-update.md)
  - 感知性能 → [01-9 性能与体验](../01-9-performance-ux/README.md)
