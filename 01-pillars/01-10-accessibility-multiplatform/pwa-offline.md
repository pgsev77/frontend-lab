# PWA 与离线（PWA & Offline）

> "原生 App 能离线用、能装到桌面、能收推送，网页行吗？"——PWA（Progressive Web App）让网页也具备这些能力。它是 Web 跨向"应用"体验的桥梁。

## 是什么

PWA 指用 Web 技术构建、但具备**类原生应用能力**的应用。核心三件套：

| 组件 | 作用 |
|---|---|
| **Manifest**（manifest.json） | 声明应用名/图标/主题色/启动方式，让浏览器知道"这是个可安装应用" |
| **Service Worker** | 后台脚本，拦截请求做**离线缓存**、推送通知、后台同步 |
| **HTTPS** | 安全前提（Service Worker 必须在 HTTPS 下运行） |

一句话边界：**PWA 让网页获得离线可用、可安装、能推送的"原生感"。**

> 这呼应 [前端本质](../../00-foundation/frontend-essence.md) 差异 3——对抗网络不可控，PWA 的离线缓存是终极防御。

## 为什么：PWA 填补 Web 的哪些短板

Web 应用相比原生 App 的传统劣势：
- **不能离线**：断网就废。PWA 的 Service Worker 缓存让关键资源离线可用。
- **不在桌面/启动器**：要每次开浏览器输 URL。PWA 可"安装"到桌面/启动器，像原生 App 一样启动。
- **不能推送**：PWA 支持推送通知（即使应用没打开）。

PWA 让 Web 在这些场景逼近原生体验，且无需应用商店审核、永远最新版。

## 怎么用：三件套

### 1. Manifest —— 可安装性
```
<!-- HTML 链接 manifest -->
<link rel="manifest" href="manifest.json">
<!-- manifest.json -->
{
  "name": "我的应用",
  "short_name": "应用",
  "icons": [...],
  "start_url": "/",
  "display": "standalone",     // 启动时隐藏浏览器 UI，像原生 App
  "theme_color": "#1677ff"
}
```
满足条件（manifest + service worker + https）后，浏览器会提示"添加到主屏幕"。

### 2. Service Worker —— 离线与缓存 ★ 核心
Service Worker 是独立于页面的后台脚本，能**拦截网络请求**，决定从缓存返还是发网络：
```
// 注册 service worker
navigator.serviceWorker.register('/sw.js')

// sw.js：拦截请求，缓存优先
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      // 缓存新请求
      const copy = resp.clone()
      caches.open('v1').then(c => c.put(e.request, copy))
      return resp
    }))
  )
})
```
**缓存策略**：
- **缓存优先**（cache-first）：先查缓存，没有再请求。适合静态资源。
- **网络优先**（network-first）：先请求，失败用缓存。适合动态数据。
- **stale-while-revalidate**：先返缓存、后台更新。兼顾即时与新鲜。

### 3. 推送与后台同步（进阶）
- **Push 通知**：服务器推消息，SW 接收显示通知（即使页面关闭）。
- **后台同步**：网络恢复后自动同步用户的离线操作。

## PWA vs 原生 App 的定位
- **PWA 优势**：免审核、永远最新、跨平台、低获客成本（一个链接）。
- **PWA 劣势**：能力受限于浏览器（如 iOS 对 PWA 支持有限）、性能/集成度不及原生。
- **定位**：内容型/工具型应用适合 PWA；强设备能力/高性能要求的应用仍需原生。

## 常见坑

- ❌ **Service Worker 缓存不更新**：缓存了旧版本，用户永远看到旧内容。
  - ✅ 正例：缓存带版本号，更新时激活新 SW、清理旧缓存。
- ❌ **缓存策略一刀切**：静态资源用网络优先（慢且浪费），动态数据用缓存优先（过时）。匹配资源类型选策略。
- ❌ **忽视 iOS 限制**：iOS Safari 对 PWA 推送支持有限，别假设所有平台一致。
- ❌ **没 HTTPS 就上 SW**：SW 只在 HTTPS（或 localhost）可用。

## 关联（双向打通）

- **依赖 ↓**：[前端本质（不可控环境/网络）](../../00-foundation/frontend-essence.md)、[01-9 加载性能（缓存）](../01-9-performance-ux/loading-performance.md)
- **属于 ↑**：[01-10 可访问性与多端](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 缓存策略呼应数据缓存 → [01-6 客户端缓存](../01-6-data-fetching/client-cache.md)
  - 离线与加载优化 → [01-9 加载性能](../01-9-performance-ux/loading-performance.md)
  - HTTP 缓存 → [09 网络](../../09-prerequisites/README.md)
