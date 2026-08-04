# HTTP 与网络（HTTP & Networking）

> HTTP 是前端和后端通信的协议。HTTP 版本差异、缓存、Cookie、CORS——这些底层网络知识，是理解 [01-6 数据获取](../01-pillars/01-6-data-fetching/README.md) 和 [01-11 安全](../01-pillars/01-11-security/README.md) 的基础。

## 是什么

HTTP 与网络知识指前端涉及的协议层：HTTP 版本、缓存机制、Cookie、CORS、DNS/CDN、WebSocket。

一句话边界：**按需查阅的底层参考**——遇到"为什么接口被缓存了""CORS 报错""Cookie 怎么设"回这里查。

## 核心知识点

### 1. HTTP 版本演进
| 版本 | 关键改进 |
|---|---|
| HTTP/1.1 | 长连接、管道化（实际少用）、队头阻塞 |
| HTTP/2 | **多路复用**（一个连接并发多请求）、头部压缩、服务器推送 |
| HTTP/3 | 基于 **QUIC（UDP）**，解决 TCP 队头阻塞，弱网更快 |

> HTTP/2 的多路复用解决了"HTTP/1.1 一个连接一个请求"的低效。但前端"域名分片"（多域名分散请求）这种 HTTP/1.1 时代的优化，在 HTTP/2 下反而有害（多连接开销）。

### 2. HTTP 缓存 ★ 高频引用
两类缓存配合：
| 类型 | 机制 | 不发请求？ |
|---|---|---|
| **强缓存** | `Cache-Control: max-age=N` / `Expires` | ✅ 有效期内不发请求，直接用本地 |
| **协商缓存** | `ETag`/`If-None-Match`、`Last-Modified`/`If-Modified-Since` | 发请求但可能返 304（无 body，用本地） |

**前端缓存策略**（呼应当前[01-9 加载](../01-pillars/01-9-performance-ux/loading-performance.md) 与 [03 部署](../03-engineering/build-deploy-release.md)）：
- 带 hash 的资源（`app.a3f9.js`）：强缓存长时效（内容变 hash 变，自然失效）。
- index.html：不缓存或协商缓存（确保拿最新引用）。

### 3. Cookie ★ 安全高频
Cookie 属性：
| 属性 | 作用 |
|---|---|
| `HttpOnly` | JS 读不到（防 XSS 偷） |
| `Secure` | 只 HTTPS 传输 |
| `SameSite=Lax/Strict/None` | 跨站携带策略（防 CSRF） |
| `Domain`/`Path` | 作用域 |

详见当前[01-11 CSRF](../01-pillars/01-11-security/csrf.md) 与 [01-11 令牌存储](../01-pillars/01-11-security/auth-token-storage.md)。

### 4. CORS ★ 前端高频痛点
- 同源策略：协议+域名+端口相同才同源。
- CORS：服务端用响应头声明允许的跨源访问。
- 预检请求（OPTIONS）：复杂请求先问。
详见当前[01-11 CORS](../01-pillars/01-11-security/cors.md)。

### 5. DNS 与 CDN
- **DNS**：域名解析成 IP。DNS 查询有耗时，用 `dns-prefetch`/`preconnect` 提前。
- **CDN**：内容分发网络，边缘节点就近响应。静态资源上 CDN 加速。呼应当前[01-9 加载](../01-pillars/01-9-performance-ux/loading-performance.md)。

### 6. WebSocket / SSE
- **WebSocket**：双向实时通信（基于 HTTP 升级）。详见当前[01-8 实时交互](../01-pillars/01-8-interaction-forms/realtime-interaction.md)。
- **SSE**：服务器单向推送（基于 HTTP）。

### 7. TLS/HTTPS 基础
- HTTPS = HTTP + TLS，加密传输。
- 全站 HTTPS 是安全基础（防中间人）。HSTS 头强制浏览器用 HTTPS。

## 学完应能回答
- HTTP/1.1、HTTP/2、HTTP/3 的核心差异？
- 强缓存和协商缓存的区别？怎么配合用？
- Cookie 的 HttpOnly/Secure/SameSite 各防什么？
- CORS 是保护谁的限制？预检何时发？

## 关联（双向打通）

- **属于 ↑**：[09 支撑基础](./README.md) → 总纲 [../README.md]
- **相关 →**：被 [01-6 数据获取](../01-pillars/01-6-data-fetching/README.md)、[01-9 加载性能](../01-pillars/01-9-performance-ux/loading-performance.md)、[01-11 安全](../01-pillars/01-11-security/README.md)、[01-8 实时交互](../01-pillars/01-8-interaction-forms/realtime-interaction.md) 反复引用
