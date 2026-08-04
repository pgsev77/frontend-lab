# 加载性能（Loading Performance）

> 首屏快不快，60% 取决于"加载"——要下多少东西、下了多久、先下哪个。这篇讲加载优化的全套手段，是 [01-9](./README.md) 的实战核心。

## 是什么

加载性能指**从用户发起访问到首屏可用**的速度。优化集中在三件事：**少下、快下、先下关键的**。

一句话边界：**加载优化 = 减少要传的字节 + 加快传输 + 调整加载优先级。**

## 为什么：首屏慢的根源

首屏慢通常是这几个原因之一：
- **要传的太多**：JS/CSS/图片体积大。
- **串行传输**：能并行的请求写成串行（[01-6 瀑布](../01-6-data-fetching/fetch-patterns.md)）。
- **优先级错**：非关键资源抢占了首屏关键资源带宽。
- **缓存没用好**：重复访问还要重新下载全部。

## 怎么用：四类手段

### 1. 减少传输体积
- **代码分割**：按路由/组件拆分，首屏只加载首页代码（[01-7 代码分割](../01-7-routing/code-splitting.md)）。
- **Tree-shaking**：构建时剔除未使用的代码（[01-12 构建工具](../01-12-architecture-engineering/README.md)）。
- **压缩**：JS/CSS 用 gzip/brotli 压缩传输；代码 minify。
- **图片优化**：用现代格式（WebP/AVIF，比 JPEG/PNG 小 30-50%）、按需尺寸（不同 DPR 不同图，[01-1 视口与坐标](../01-1-view-fundamentals/viewport-coordinates.md)）、懒加载非首屏图片。

### 2. 代码分割与按需加载 ★ 最有效
首屏只加载首页需要的代码，其余页面/组件按需加载：
```
// 路由级分割
const Settings = lazy(() => import('./Settings'))
// 大组件分割
const Editor = lazy(() => import('./Editor'))
```
配合**预取**把延迟藏起来（悬停/空闲时预取下一页，[01-7 代码分割](../01-7-routing/code-splitting.md)）。

### 3. 资源优先级
- **关键 CSS 内联首屏**，非关键 CSS 异步（[关键渲染路径](./critical-rendering-path.md)）。
- **字体 preload + font-display: swap**：字体优先加载，但先用回退字体避免文字消失。
- **图片懒加载**：非首屏图片用 `loading="lazy"`，进入视口才加载。
- **Resource Hints**：preconnect 省握手、preload 关键资源、prefetch 下一页。

### 4. HTTP 缓存策略 ★
让重复访问不重下载：
| 资源 | 策略 |
|---|---|
| 带文件指纹的 JS/CSS（`app.a3f9.js`） | 强缓存（Cache-Control: max-age=31536000，一年） |
| index.html | 不缓存或短缓存（确保拿到最新引用） |
| API 数据 | 协商缓存或短缓存 |

> 指纹策略的精髓：**文件内容变 → 文件名变（hash）→ 浏览器当成新资源请求**；内容不变 → 文件名不变 → 用缓存。这让带 hash 的资源可以放心长缓存。详见 [09 HTTP](../../09-prerequisites/README.md) 和 [03 构建](../../03-engineering/README.md)。

## 常见坑

- ❌ **不分割，首屏加载全部代码**：SPA 首屏把所有页面代码都下了。
  - ✅ 正例：路由级 + 大组件级分割。
- ❌ **图片不优化**：用原始 JPEG、不缩放、不懒加载，首屏图片几 MB。
- ❌ **缓存策略错**：index.html 长缓存 → 发了新版本用户拿不到（还在用旧的 index.html 引用旧 JS）。
  - ✅ 正例：HTML 不缓存，带 hash 的资源长缓存。
- ❌ **关键资源优先级低**：首屏字体没 preload，文字迟迟不出现。

## 关联（双向打通）

- **依赖 ↓**：[关键渲染路径](./critical-rendering-path.md)、[01-7 代码分割](../01-7-routing/code-splitting.md)
- **属于 ↑**：[01-9 性能与体验](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 分割与构建 → [01-12 构建工具](../01-12-architecture-engineering/README.md)
  - 缓存与部署 → [03 工程实践](../../03-engineering/README.md)、[09 HTTP](../../09-prerequisites/README.md)
  - 极致优化进阶 → [02 性能极致](../../02-advanced/README.md)
