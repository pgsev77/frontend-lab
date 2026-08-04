# 实时交互（Realtime Interaction）

> 聊天、协作编辑、实时通知、股票行情——这些场景需要服务器**主动推送**数据，而非客户端反复请求。WebSocket 和 SSE 是两种主流方案。

## 是什么

实时交互指**客户端与服务器保持持久连接，数据可双向/单向实时传输**。两种技术：

| 技术 | 通信方向 | 特点 |
|---|---|---|
| **WebSocket** | 双向（全双工） | 客户端和服务器都能随时发消息 |
| **SSE（Server-Sent Events）** | 单向（服务器→客户端） | 服务器单向推送，客户端只能监听 |
| **轮询（Polling）** | 伪实时 | 客户端定时请求，非真正实时 |

一句话边界：**WebSocket 是"双向通话"，SSE 是"广播收音机"，轮询是"不停打电话问"。**

## 为什么：为什么不用轮询

### 轮询的局限
客户端每隔 N 秒请求一次服务器问"有新消息吗"。问题：
- **延迟**：消息最多等 N 秒才到（不够实时）。
- **浪费**：大部分请求返回"无新消息"，浪费带宽和服务器资源。
- **服务器压力**：大量客户端定时请求，QPS 高。

### 长连接的优势
WebSocket/SSE 建立一条**持久连接**，服务器有数据时**主动推**过来：
- **真实时**：数据产生即推送，无延迟。
- **省资源**：一个连接持续用，不像轮询反复建连。
- **服务器主动**：不用等客户端问。

## 怎么用：选型

### WebSocket（双向场景）★
需要客户端也实时发数据给服务器时用 WebSocket：
- 聊天（收发消息）
- 协作编辑（多人同时编辑，操作实时同步）
- 游戏（实时操作上传）
- 实时交易（下单、行情）

```
const ws = new WebSocket('wss://example.com/chat')
ws.onmessage = e => { 显示收到的消息(JSON.parse(e.data)) }
sendBtn.onclick = () => ws.send(JSON.stringify({ text: input.value }))
```

### SSE（单向推送场景）
只需要服务器推、客户端不用实时发时用 SSE（更简单）：
- 通知/消息提醒
- 股票行情/比分直播
- 日志流/构建进度

```
const es = new EventSource('/api/notifications')
es.onmessage = e => { 显示通知(JSON.parse(e.data)) }
// SSE 基于 HTTP，更简单，自动重连，但不能客户端→服务器实时发
```

**SSE vs WebSocket 怎么选**：只需服务器推 → SSE（简单、自动重连、走 HTTP 友好）；需要双向 → WebSocket。

### 实时数据如何更新前端缓存
收到推送后，更新 [客户端缓存](../01-6-data-fetching/client-cache.md)：
```
ws.onmessage = e => {
  const data = JSON.parse(e.data)
  queryClient.setQueryData(['orders'], old => 更新订单)  // 直接写缓存
  // 或 invalidateQueries 让其重拉
}
```
呼应 [01-6 同步策略](../01-6-data-fetching/sync-strategies.md) 的实时推送。

### 连接管理 ★ 工程难点
长连接的维护是实时交互的主要复杂度：
- **重连**：连接断了要自动重连（指数退避，避免雪崩，呼应 [01-6 错误处理](../01-6-data-fetching/error-handling-retry.md)）。
- **心跳**：定期发心跳包，检测连接是否还活着（防"假连接"）。
- **断线补偿**：断线期间错过的消息，重连后怎么补（Last-Event-ID / 时间戳续传）。
- **多实例扩展**：服务器多实例时，WebSocket 要配合消息中间件（Redis Pub/Sub）广播。

## 常见坑

- ❌ **能用 SSE 却用 WebSocket**：只需服务器推，却用更复杂的 WebSocket。
- ❌ **不处理重连**：网络抖动断连，连接就废了，用户收不到新消息。
  - ✅ 正例：自动重连 + 退避。
- ❌ **不做心跳**：NAT/代理可能让连接静默断开（不报错），不心跳就发现不了。
- ❌ **断线期间消息丢失**：重连后不补拉，用户漏掉断线时的消息。
  - ✅ 正例：用 Last-Event-ID 或时间戳，重连后续传错过的消息。

## 关联（双向打通）

- **依赖 ↓**：[09 网络（HTTP/WebSocket）](../../09-prerequisites/README.md)、[01-6 客户端缓存](../01-6-data-fetching/client-cache.md)
- **属于 ↑**：[01-8 交互与表单](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 推送更新缓存 → [01-6 同步策略](../01-6-data-fetching/sync-strategies.md)
  - 重连与退避 → [01-6 错误处理](../01-6-data-fetching/error-handling-retry.md)
  - 协同编辑进阶 → [02 复杂交互](../../02-advanced/README.md)
