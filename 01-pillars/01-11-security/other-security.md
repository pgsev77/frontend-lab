# 其他前端安全要点（Miscellaneous Security）

> 除了 XSS/CSRF/CSP 这些大头，还有一些零散但重要的前端安全点。它们单独看不大，但忽视任何一个都可能成为攻击入口。

## 是什么

本篇汇总前端需关注的其他安全问题：开放重定向、敏感信息泄露、postMessage 安全、存储限制。

一句话边界：**安全是"木桶效应"——最短的板决定整体。这些小点常被忽视，却是常见攻击入口。**

## 开放重定向（Open Redirect）

### 漏洞
应用有个跳转参数 `?redirect=https://...`，服务器/前端不校验就直接跳过去。攻击者构造 `https://bank.com/login?redirect=https://evil.com`，用户以为是银行登录，登录后被跳到钓鱼站。
```
❌ 不校验：location.href = new URLSearchParams(location.search).get('redirect')
✅ 白名单校验：只允许跳同源或可信域名
```
防御：**重定向目标做白名单校验**（只允许相对路径或可信域名），拒绝外部 URL。

## 敏感信息泄露

前端是用户能完全查看的，**不要在前端放任何真正的密钥**。

### 源码 map 泄露
生产环境若部署了 `.map` 文件（sourcemap），用户能还原源码（含注释、逻辑）。
- 生产要么不生成 map，要么部署到内部、不公开访问。
- 详见 [01-13 Source Map](../01-13-observability-quality/README.md)。

### API Key 硬编码
```
❌ const API_KEY = 'sk-xxx'  // 前端代码里，用户 F12 就能看到
```
前端代码用户可查看，任何写在前端的"密钥"都不安全。**真正敏感的密钥必须放服务端**，前端通过自己的后端代理调用第三方。前端可放的是"设计为公开的"key（如客户端 ID、公开地图 key，且配合域名白名单限制）。

### console 残留
生产代码里 `console.log(token)`、`console.log(user)` 把敏感数据打到控制台。生产构建应移除 console（构建工具配置）。

## postMessage 安全

`postMessage` 是跨窗口（iframe/弹出窗/Worker）通信。接收方必须**校验来源**，否则任意来源的消息都能触发逻辑：
```
❌ 不校验来源
window.addEventListener('message', e => { 执行 e.data 的指令 })

✅ 校验 origin
window.addEventListener('message', e => {
  if (e.origin !== 'https://trusted.com') return   // 只信可信来源
  处理 e.data
})
```
发 postMessage 时也指定 targetOrigin，防止消息泄露给恶意 iframe。

## localStorage / sessionStorage 不存敏感数据

这俩存储 JS 可读写，一旦 XSS（[XSS](./xss.md)），里面的数据全暴露。
- **不存**：token（用 [双令牌模式](./auth-token-storage.md)）、密码、个人敏感信息。
- **可存**：用户偏好、非敏感 UI 状态、公开缓存。

## 防御性输入校验

即使前端做了校验，**后端必须再校验**。前端校验只为"体验"（即时反馈），不能当安全手段——绕过前端校验太容易（改请求、直接调 API）。呼应 [01-8 表单校验](../01-8-interaction-forms/form-validation.md)。

## 其他要点
- **HTTPS 强制**：全站 HTTPS，防中间人窃听/篡改。HSTS 头强制浏览器总用 HTTPS。
- **不信任的链接 target="_blank" 加 rel="noopener"**：防止新开页面通过 `window.opener` 操纵原页面（老浏览器风险）。
- **隐藏字段不藏权限**：`<input type="hidden" value="admin">` 用户能改，别用它做权限判断。

## 常见坑

- ❌ **重定向不校验**：开放重定向成钓鱼跳板。
- ❌ **密钥写前端**：用户 F12 就拿到。
- ❌ **生产部署 sourcemap**：源码泄露。
- ❌ **postMessage 不校验来源**：恶意页面能触发逻辑。
- ❌ **localStorage 存 token**：XSS 一发就泄露。
- ❌ **前端校验当安全手段**：后端不校验，绕过前端即可攻击。

## 关联（双向打通）

- **依赖 ↓**：[XSS](./xss.md)、[前端鉴权与令牌存储](./auth-token-storage.md)、[01-13 监控](../01-13-observability-quality/README.md)
- **属于 ↑**：[01-11 安全](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 前端校验 vs 后端校验 → [01-8 表单校验](../01-8-interaction-forms/form-validation.md)、[03 前后端协作](../../03-engineering/README.md)
  - sourcemap 安全 → [01-13 可观测性](../01-13-observability-quality/README.md)
