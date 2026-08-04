# 跨域与 CORS（Cross-Origin & CORS）

> 前端请求接口报 "CORS 错误"，是几乎所有前端都遇过的痛。但 CORS 不是 bug，它是浏览器的安全机制。理解它的原理，才能正确解决跨域，而不是盲目加 `*`。

## 是什么

- **同源策略**：浏览器默认禁止不同源的页面互相访问（读响应）。源 = 协议+域名+端口。
- **CORS（Cross-Origin Resource Sharing）**：服务器用 HTTP 头**声明**"允许哪些源跨域访问我"的机制。

一句话边界：**同源策略是浏览器"默认禁止跨域"的安全机制，CORS 是服务器"有选择放开"的协议。**

## 为什么：为什么要有同源策略

设想没有同源策略：你登录了银行 `bank.com`，又打开攻击者 `evil.com`。evil.com 的 JS 发请求到 `bank.com/transfer`——浏览器**自动带上 bank.com 的 Cookie**，转账成功。

同源策略阻止这个：**evil.com 的 JS 能向 bank.com 发请求，但不能读取响应**（默认）。这样 evil.com 即使发请求也"看不到结果"，攻击受限。

> CORS 是这个机制的"合法开口"——bank.com 主动声明"我允许 evil.com 读我的响应"，才放开。这是**服务器**的决策，不是浏览器的。

## 怎么用：CORS 的工作机制

### 简单请求
满足条件（GET/POST/HEAD + 特定 Header）的请求，浏览器直接发，服务器响应里带 `Access-Control-Allow-Origin`，浏览器才让 JS 读响应：
```
请求：GET https://api.example.com/data  （从 app.example.com 发起）
响应头：Access-Control-Allow-Origin: https://app.example.com
→ 浏览器放行，JS 能读响应
若响应头没带或源不匹配 → 浏览器拦截响应，JS 读不到（报 CORS 错）
```

### 预检请求（Preflight）★
不满足"简单请求"（如 PUT/DELETE、自定义 Header、Content-Type: application/json）时，浏览器**先发一个 OPTIONS 请求**问服务器"我能不能发这个请求"：
```
1. 预检：OPTIONS 请求
   Access-Control-Request-Method: PUT
   Access-Control-Request-Headers: Authorization
2. 服务器响应预检：
   Access-Control-Allow-Methods: GET, POST, PUT
   Access-Control-Allow-Headers: Authorization
3. 预检通过 → 浏览器才发真正的 PUT 请求
   预检失败 → 真正的请求不发，报 CORS 错
```
**预检的意义**：在发"可能修改数据"的复杂请求前，先确认服务器允许，避免非授权请求实际执行。

### 凭证请求（带 Cookie）
默认跨域请求**不带 Cookie**。要带必须两端配合：
```
前端：fetch(url, { credentials: 'include' })
服务端：Access-Control-Allow-Origin: https://app.example.com（★ 不能是 *，必须具体域名）
        Access-Control-Allow-Credentials: true
```
> 注意：带凭证时，`Access-Control-Allow-Origin` **不能是 `*`**，必须是具体域名——否则任何站都能带 Cookie 访问，危险。

## 常见误区

- ❌ **以为 CORS 是前端问题**：CORS 是**服务端**的决策，前端只能配合。报错在前端，但修复在服务端响应头。
- ❌ **生产用 `Access-Control-Allow-Origin: *`**：开发偷懒用，生产等于"任何站都能读我"，危险（尤其带凭证时还不允许）。
- ❌ **不理解预检**：好奇"为什么我的 PUT 变成了两个请求（OPTIONS+PUT）"——那是预检。
- ❌ **CORS 是浏览器限制，绕过它不等于安全**：CORS 只挡浏览器里的 JS。用 curl/服务端请求不受 CORS 限制——所以**真正的安全校验必须在服务端**，不能依赖 CORS。

## 关联（双向打通）

- **依赖 ↓**：[09 网络（同源策略/Cookie）](../../09-prerequisites/README.md)、[CSRF](./csrf.md)（同源策略也防 CSRF）
- **属于 ↑**：[01-11 安全](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - Cookie 跨域携带 → [前端鉴权与令牌存储](./auth-token-storage.md)
  - 同源策略 → [09 网络](../../09-prerequisites/README.md)
