# 01-11 · 安全

> **轴属：横切**。前端是用户和系统之间的边界，也是攻击面。本支柱回答"怎么在前端防住 XSS/CSRF、怎么安全地存令牌、怎么用 CSP 加固"——安全是守底线，不是可选项。

## 本支柱解决什么问题
前端安全常被忽视（"安全是后端的事"），但 XSS、令牌泄露、CSRF 都发生在前端。本支柱回答：**前端有哪些攻击面、怎么防 XSS/CSRF、令牌该存哪、CSP 怎么配、依赖怎么保安全**。

## 详细大纲（→ 点击标题阅读）

### [1. XSS](./xss.md)
- XSS 是什么：攻击者把恶意脚本注入到你的页面执行
- 三种 XSS：存储型 / 反射型 / DOM 型
- 防御核心：**输出转义**（HTML/属性/JS/URL 上下文不同）
- 框架的自动转义（React 的 JSX 默认转义）vs 危险 API（dangerouslySetInnerHTML / v-html）
- 输入净化（sanitize）vs 输出转义的区别

### [2. CSRF](./csrf.md)
- CSRF 是什么：诱导用户在已登录状态下发起非自愿请求
- 防御：CSRF Token / SameSite Cookie / 校验 Referer
- SameSite=Lax/Strict/None 的区别与权衡
- CSRF 与 XSS 的关系（XSS 可绕过 CSRF 防御）

### [3. CSP](./csp.md)
- CSP 是什么：白名单限制能加载/执行什么资源
- 常用指令（script-src / style-src / img-src / connect-src）
- nonce / hash 替代 unsafe-inline
- CSP 的报告模式（Report-Only）先观察再启用
- CSP 对现代框架（内联样式/脚本）的挑战

### [4. 前端鉴权与令牌存储](./auth-token-storage.md)
- 令牌存哪：localStorage vs sessionStorage vs Cookie vs 内存
- 各方案的权衡：
  - localStorage：简单但 XSS 可读
  - HttpOnly Cookie：XSS 读不到，但有 CSRF 风险
  - 内存：最安全但刷新丢失，配合刷新令牌
- 访问令牌（短期）vs 刷新令牌（长期）的双令牌模式
- 令牌过期、刷新、并发刷新的处理

### [5. 跨域与 CORS](./cors.md)
- 同源策略：为什么默认禁止跨域
- CORS：服务端声明允许哪些源访问
- 预检请求（OPTIONS）与简单请求
- 凭证请求（withCredentials / Cookie）
- CORS 是浏览器的限制，不是服务端的（curl 不受限）

### [6. 点击劫持](./clickjacking.md)
- 点击劫持：用透明 iframe 诱导用户点击
- 防御：X-Frame-Options / CSP frame-ancestors
- 配合 SameSite Cookie

### [7. 依赖安全](./dependency-security.md)
- 第三方依赖的风险（恶意包、漏洞依赖）
- lockfile 锁定版本、定期审计（npm audit / Snyk）
- 子资源完整性（SRI）：防 CDN 篡改
- 动态加载第三方脚本的风险

### [8. 其他前端安全要点](./other-security.md)
- 开放重定向漏洞
- 敏感信息泄露（源码 map、API key 硬编码、console 残留）
- postMessage 的来源校验
- localStorage/sessionStorage 不存敏感数据

## 学完应能回答
- XSS 的三种类型？防御的核心是什么？框架的自动转义和危险 API？
- CSRF 怎么防？SameSite Cookie 的三个值？
- 访问令牌该存哪？localStorage 和 HttpOnly Cookie 的权衡？
- CSP 解决什么问题？unsafe-inline 为什么危险？
- CORS 是保护谁的限制？预检请求什么时候发？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 横切
- **依赖 ↓**：[09 网络](../../09-prerequisites/README.md)（HTTP/Cookie/CORS）、[09 浏览器原理](../../09-prerequisites/README.md)（同源策略）
- **相关 →**：[01-6 数据获取](../01-6-data-fetching/README.md)（鉴权请求）、[01-13 可观测](../01-13-observability-quality/README.md)（安全监控）、[03 工程实践](../../03-engineering/README.md)（依赖审计）
