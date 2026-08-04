# CSRF（跨站请求伪造）

> 用户登录了银行网站，又打开攻击者页面。攻击者页面偷偷向银行发转账请求——浏览器自动带上银行 Cookie，请求"合法"地发出了。这就是 CSRF，Web 经典攻击。

## 是什么

CSRF（Cross-Site Request Forgery，跨站请求伪造）指攻击者诱导用户在**已登录某站点**的状态下，**非自愿地**向该站点发起请求。浏览器自动携带 Cookie，服务器以为请求来自用户本人。

一句话边界：**XSS 是"在站点内执行恶意代码"，CSRF 是"在站点外借用户的登录态发请求"。** XSS 偷身份，CSRF 借身份。

## 为什么：CSRF 怎么成立

CSRF 成立的三个条件：
1. 用户在 A 站登录了（A 的 Cookie 存在）。
2. 用户访问了攻击者的 B 站。
3. B 站偷偷向 A 发请求（表单提交/img/fetch）。

```
攻击者 B 站页面：
<img src="https://bank.com/transfer?to=attacker&amount=1000">
<!-- 浏览器请求 bank.com 时自动带上用户的 bank Cookie -->
<!-- 服务器以为用户主动转账，执行了 -->
```
浏览器同源策略**不阻止发送**跨域请求（它只限制"读响应"）。所以 B 站能向 A 发请求，且 Cookie 自动携带——这就是 CSRF 的温床。

## 怎么用：四种防御

### 1. CSRF Token ★ 经典防御
服务器发一个**随机 token**（嵌在表单/Header），提交请求必须带上正确 token。攻击者在 B 站**读不到** A 站的 token（同源策略阻止读 A 的页面），所以伪造不出合法请求：
```
// A 站登录后，服务器返回带 token 的表单
<form action="/transfer">
  <input type="hidden" name="csrf_token" value="随机token">
  ...
</form>
// 服务器校验 csrf_token 匹配才执行。攻击者在 B 站拿不到这个 token。
```
**为什么有效**：同源策略允许 B 站"向 A 发请求"，但**禁止 B 站读取 A 的内容**（拿不到 token）。

### 2. SameSite Cookie ★ 现代首选
Cookie 的 `SameSite` 属性限制跨站携带：
| 值 | 行为 |
|---|---|
| `Strict` | 完全不跨站携带（连点外链进来都不带，最严但影响体验） |
| `Lax` ★ | 跨站**只允许顶级导航的 GET** 携带，POST/PUT 不带（默认值，挡住多数 CSRF） |
| `None` | 总是携带（需配合 Secure，不安全） |
```
Set-Cookie: session=xxx; SameSite=Lax; Secure
// Lax 挡住了跨站 POST（转账通常是 POST），CSRF 大幅减少
```
> 现代浏览器默认 SameSite=Lax，已挡住大量 CSRF。但旧浏览器和 GET 类 CSRF 仍要其他防御。

### 3. 校验 Referer / Origin
服务器检查请求的 `Referer`/`Origin` 是否来自自己的域名，拒绝跨站请求。简单但 Referer 可被用户禁用，作为辅助手段。

### 4. 不用 Cookie 传认证 → 改 Authorization Header
如果认证不靠 Cookie 而靠 `Authorization: Bearer <token>`（前端手动加 Header），那跨站请求**不会自动携带**（只有 Cookie 会自动带），CSRF 自然不成立。详见 [前端鉴权与令牌存储](./auth-token-storage.md)。

## CSRF 与 XSS 的关系
- **XSS 可绕过 CSRF 防御**：如果站点有 XSS，攻击者脚本在站点内运行，能读到 CSRF token，CSRF 防御失效。
- 所以 **XSS 是更根本的威胁**——防住 XSS，CSRF 防御才可靠。
- 这也是为什么 CSP（防 XSS）也是 CSRF 防御的间接保障。

## 常见坑

- ❌ **只用 GET 做状态变更**：`/transfer?amount=1000` 这种 GET 请求，`<img>` 就能触发，CSRF 极易。
  - ✅ 正例：状态变更用 POST/PUT/DELETE，且配 CSRF 防御。
- ❌ **依赖 Referer 单一防御**：Referer 可被禁用/伪造（部分场景），不可靠。
- ❌ **设了 SameSite=None 不当**：为支持第三方 Cookie 设 None，失去 CSRF 防护。
- ❌ **忽视旧浏览器**：旧浏览器不支持 SameSite，仍需 CSRF token。

## 关联（双向打通）

- **依赖 ↓**：[09 网络（Cookie/同源策略）](../../09-prerequisites/README.md)、[XSS](./xss.md)
- **属于 ↑**：[01-11 安全](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - Cookie 属性详解 → [09 网络](../../09-prerequisites/README.md)
  - 不用 Cookie 改 Header → [前端鉴权与令牌存储](./auth-token-storage.md)
  - XSS 绕过 CSRF → [XSS](./xss.md)
