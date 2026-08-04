# CSP（内容安全策略）

> XSS 即使发生，如果浏览器拒绝执行未授权来源的脚本，攻击也得逞不了。CSP 就是这层"白名单"——纵深防御，让 XSS 即使绕过第一道防线也难以生效。

## 是什么

CSP（Content Security Policy，内容安全策略）是一个 HTTP 头，让站点**白名单声明**允许加载/执行哪些资源（脚本、样式、图片、连接等）。不符合白名单的资源被浏览器拦截。

一句话边界：**CSP 是 XSS 的纵深防御——即使代码有 XSS 漏洞，CSP 也能阻止注入的脚本执行。**

> 纵深防御的意义：不要只靠一道防线。转义防 XSS 是第一道，CSP 是第二道——万一转义漏了，CSP 还能兜。

## 为什么：CSP 解决什么

### 默认信任问题
浏览器默认**信任页面里所有的脚本**，不管来源。一旦 XSS 注入了 `<script>`，浏览器二话不说就执行。CSP 改变这个默认：**只有白名单来源的脚本才执行**。

### 限制内联脚本（XSS 主要载体）
XSS 注入的脚本通常是**内联**的（`<script>恶意代码</script>`）或从攻击者域名加载的。CSP 默认禁止内联脚本和任意域名的脚本，只允许白名单——这就堵住了 XSS 的常见执行路径。

## 怎么用

### 基本指令
CSP 用指令声明各类资源的白名单：
```
Content-Security-Policy:
  default-src 'self';              默认只允许同源
  script-src 'self' https://cdn.example.com;   脚本只允许同源 + 指定 CDN
  style-src 'self' 'unsafe-inline';            样式允许内联（很多库需要）
  img-src 'self' data: https:;                 图片允许同源/data/https
  connect-src 'self' https://api.example.com;  fetch/XHR/WebSocket 目标
  font-src 'self' https://fonts.gstatic.com;
```

### 处理内联脚本：nonce / hash
现代框架（Vue/Svelte）常生成内联脚本，直接禁内联会让框架崩。用 **nonce**（一次性随机值）或 **hash** 标记"这个内联脚本是可信的"：
```
Content-Security-Policy: script-src 'nonce-abc123'
<script nonce="abc123">/* 只有带正确 nonce 的内联脚本才执行 */</script>
```
比 `'unsafe-inline'`（允许所有内联，等于没防）安全得多。

### Report-Only：先观察后启用 ★
直接启用 CSP 可能误伤（挡了正常脚本，功能崩）。用 `Content-Security-Policy-Report-Only` 先**只上报不拦截**，观察一段时间，确认无正常资源被挡，再切到强制策略：
```
Content-Security-Policy-Report-Only: ... ; report-to /csp-report
// 违规只上报到 /csp-report，不拦截。观察日志，调整白名单。
```

### CSP 与现代框架的挑战
- React/Vue 等常需要 `style-src 'unsafe-inline'`（动态注入样式）。
- inline script 的 nonce 机制要服务端配合（每次请求生成新 nonce）。
- 评估工具（eval）要 `'unsafe-eval'`，多数场景应避免。

## 常见坑

- ❌ **用 `unsafe-inline` 偷懒**：允许所有内联，CSP 的 XSS 防御形同虚设。
  - ✅ 正例：用 nonce/hash 精确允许可信内联。
- ❌ **直接上强制 CSP 不观察**：误伤正常资源，功能崩。
  - ✅ 正例：先 Report-Only 观察，再切强制。
- ❌ **白名单太宽**（`script-src *`）：等于没限制。
- ❌ **忽视 dynamic import**：动态加载的模块也要在 script-src 白名单内。

## 关联（双向打通）

- **依赖 ↓**：[XSS](./xss.md)（CSP 是 XSS 的纵深防御）、[09 浏览器原理](../../09-prerequisites/README.md)
- **属于 ↑**：[01-11 安全](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 防 XSS 的第一道防线 → [XSS](./xss.md)
  - 跨域资源加载 → [跨域与 CORS](./cors.md)
  - nonce 要服务端配合 → [03 工程实践](../../03-engineering/README.md)
