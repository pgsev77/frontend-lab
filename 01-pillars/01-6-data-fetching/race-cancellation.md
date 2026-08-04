# 竞态与取消（Race Condition & Cancellation）

> 用户连点两次切换，第一个请求还没回，第二个先回了——然后第一个慢吞吞地回来覆盖了新数据。这就是竞态，前端最隐蔽的 bug 之一。这篇讲清竞态怎么产生、怎么根治。

## 是什么

- **竞态（Race Condition）**：多个异步操作并发，其完成顺序与发起顺序不一致，导致结果错乱。
- **取消（Cancellation）**：主动终止一个还未完成的异步操作，丢弃其结果。

一句话边界：**竞态是"后发先至"导致的错乱，取消是"主动丢弃过时请求"的解法。**

## 为什么：竞态怎么产生

经典场景：用户快速切换 Tab（A→B），每个 Tab 都发请求加载列表。

```
时刻 t1: 点 Tab A → 发起请求 A
时刻 t2: 点 Tab B → 发起请求 B（A 还没回）
时刻 t3: 请求 B 回来了 → 显示 B 数据 ✓
时刻 t4: 请求 A 才回来 → 覆盖成 A 数据 ❌（用户看的是 B，数据却是 A！）
```
用户明明在 Tab B，界面却显示 Tab A 的数据——因为慢的请求 A 后到，覆盖了正确的 B 结果。

### 更隐蔽的场景
- 搜索框：输入"app"，发了 a/ap/app 三个请求，"app"先回，"a"最后回覆盖成 "a" 的结果。
- 路由切换：连点两个页面，旧页面的请求回来覆盖新页面。

> 竞态是 [复杂度来源](../../00-foundation/complexity-sources.md) "异步时间错位"的典型——发起顺序 ≠ 完成顺序，而代码却假设"后发起的后到"。

## 怎么用：两种解法

### 1. 请求 ID / 序号（只认最新的）
给每次请求一个递增 ID，回调时检查"我是不是最新的"，不是就丢弃：
```
const reqIdRef = useRef(0)
useEffect(() => {
  const myId = ++reqIdRef.current      // 本次请求的 ID
  fetchData().then(data => {
    if (myId !== reqIdRef.current) return  // ★ 我已经不是最新请求了，丢弃结果
    setData(data)
  })
}, [query])
```
**原理**：只接受"最后一次"请求的结果，过时请求的结果被忽略。简单可靠。

### 2. AbortController（取消旧请求）★ 更彻底
真正**取消**未完成的请求，不只是忽略结果：
```
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })   // 把 signal 传给 fetch
    .then(r => r.json()).then(setData)
    .catch(e => { if (e.name !== 'AbortError') /* 真错误才处理 */ })
  return () => controller.abort()   // ★ 清理时取消请求
}, [query])
```
**原理**：effect 重跑/卸载时，abort 上一个请求，浏览器真正终止它（不浪费带宽、不会回来覆盖）。这是更彻底的解法。

### TanStack Query 自动处理竞态
Query 库**内置**竞态处理：同一 key 的并发请求自动去重 + 取最新，开发者不用手写。这是用 Query 库的又一个理由（呼应 [客户端缓存](./client-cache.md)）。

### useEffect 的竞态陷阱
这是手撸 fetch 最常见的 bug 源：
```
❌ effect 里 fetch 但不处理竞态
useEffect(() => {
  fetch(`/api?q=${q}`).then(setData)   // q 快速变化时，旧请求覆盖新
}, [q])
```
要么用请求 ID，要么用 AbortController，要么干脆用 Query 库。

## 常见坑

- ❌ **effect 里 fetch 不处理竞态**：用户快速操作时数据错乱。
  - ✅ 正例：请求 ID 或 AbortController；最佳是用 Query 库。
- ❌ **abort 后没区分错误类型**：把"被取消"当成真错误，弹出错误提示。
  - ✅ 正例：catch 里判断 `AbortError`，被取消的不当错误处理。
- ❌ **用 setTimeout 模拟取消**：定时器取消不掉已发出的网络请求，只是忽略结果，带宽已浪费。

## 关联（双向打通）

- **依赖 ↓**：[异步四态](./async-four-states.md)、[获取模式](./fetch-patterns.md)、[复杂度来源（异步）](../../00-foundation/complexity-sources.md)
- **属于 ↑**：[01-6 数据获取与缓存](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 缓存库自动处理竞态 → [客户端缓存](./client-cache.md)
  - effect 清理与竞态 → [01-5 副作用管理](../01-5-state-management/side-effects.md)
