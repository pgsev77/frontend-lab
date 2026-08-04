# 路由模型（Routing Model）

> 单页应用（SPA）能让"点链接不刷新整页"，靠的就是客户端路由。这是状态轴的起点——路由的本质是把"当前显示哪个页面"变成一种**状态**。理解路由模型，才能理解后面所有的嵌套、数据路由、URL 即状态。

## 是什么

路由（Routing）指**根据 URL 决定显示哪个界面**的机制。它分两种实现：

| 模式 | 实现 | 特点 |
|---|---|---|
| **服务端路由** | 每次跳转都向服务器请求新页面（多页应用 MPA） | 整页刷新 |
| **客户端路由** | JS 拦截跳转，本地切换界面（单页应用 SPA） | 不刷新，体验流畅 |

一句话边界：**服务端路由是"换 URL = 换页面（重新请求）"，客户端路由是"换 URL = 换视图（JS 本地切换）"。**

## 为什么：为什么 SPA 用客户端路由

### 痛点：整页刷新的体验割裂
传统多页应用，每次点链接都向服务器请求完整 HTML、重新加载所有 JS/CSS。体验上：白屏闪烁、状态丢失（如表单输入、滚动位置）、资源重复加载。

### SPA + 客户端路由的承诺
- **不刷新**：JS 拦截链接，只换视图，无白屏，过渡流畅。
- **状态保持**：全局状态、已加载数据在路由切换间保留。
- **按需加载**：配合代码分割，只加载当前页代码（[代码分割](./code-splitting.md)）。

### 代价
- **首屏需加载框架**：SPA 首次要加载 JS 框架，首屏可能慢（SSR 缓解，见 [02 进阶](../../02-advanced/README.md)）。
- **SEO 劣势**：纯客户端渲染，爬虫可能拿不到内容（SSR/SSG 解决）。

## 怎么工作：客户端路由的底层

### History API
现代客户端路由靠浏览器的 History API：
- `history.pushState(state, title, url)`：**改 URL 但不刷新**，压入历史栈。
- `history.replaceState(...)`：替换当前记录（不留后退痕迹）。
- `popstate` 事件：用户点后退/前进时触发，路由库据此切换视图。

```
用户点链接 /about
  → 路由库拦截，调 history.pushState 改 URL 为 /about（不刷新）
  → 根据 /about 匹配到 <About/> 组件，渲染它
用户点后退
  → 触发 popstate，URL 变回 /，路由库渲染 <Home/>
```

### Hash 路由 vs Browser 路由
| | Hash 路由（`/#/about`） | Browser 路由（`/about`） |
|---|---|---|
| 原理 | 用 URL 的 `#` 部分（hashchange 事件） | 用 History API |
| 服务器配置 | 不需要（# 后不发请求） | 需要（所有路径都返回 index.html） |
| SEO | 差（# 后爬虫忽略） | 好 |
| 现代选择 | 几乎不用 | **主流** |

> 现在都用 Browser 路由。Hash 路由是 History API 普及前的过渡方案，除非环境不支持服务端配置（如纯静态托管无 fallback），否则别用。

### 路由匹配
路由库把 URL 和路由配置匹配，支持：
- **路径参数**：`/user/:id` 匹配 `/user/123`，`id=123`。
- **查询参数**：`/search?q=x&page=2`，解析成对象。
- **通配/嵌套**：`/dashboard/*` 匹配所有 dashboard 子路由。

## 常见坑

- ❌ **Browser 路由不配服务器**：直接访问 `/about` 或刷新，服务器找不到该路径返回 404。
  - ✅ 正例：服务端配置"所有路径都回退到 index.html"（SPA fallback）。
- ❌ **混淆路径参数和查询参数**：`/user/:id` 是路径参数（路由定义），`?key=value` 是查询参数（任意附加）。用途不同，详见 [URL 即状态](./url-as-state.md)。
- ❌ **忽视 SEO**：纯客户端路由的内容爬虫可能看不到。需要 SSR/预渲染。
- ❌ **路由不做代码分割**：所有页面代码打进首屏包，首屏慢。呼应 [代码分割](./code-splitting.md)。

## 关联（双向打通）

- **依赖 ↓**：[09 网络（History API/HTTP）](../../09-prerequisites/README.md)、[01-5 状态分类（URL 状态）](../01-5-state-management/state-classification.md)
- **属于 ↑**：[01-7 路由与导航](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - URL 是状态 → [URL 即状态](./url-as-state.md)
  - 嵌套与布局 → [嵌套路由与布局](./nested-routes-layout.md)
  - SSR 与服务端路由 → [02 前端进阶](../../02-advanced/README.md)
