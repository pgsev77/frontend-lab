# 关键渲染路径（Critical Rendering Path）

> 浏览器从收到 HTML 到画出第一个像素，要走一条完整的流水线。理解这条路径，才能知道"首屏慢在哪、哪些资源阻塞渲染、defer/async 怎么用"。它是 [01-4 从状态到像素](../01-4-rendering/state-to-pixel.md) 在"加载阶段"的前传。

## 是什么

关键渲染路径（Critical Rendering Path, CRP）指浏览器**从获取 HTML 到首次渲染**的关键步骤：

```
HTML ──解析──> DOM
CSS  ──解析──> CSSOM ┐
                     ├─> Render Tree ─> Layout ─> Paint ─> Composite ─> 像素
（JS 可能改 DOM/CSSOM）─┘
```

一句话边界：**CRP 是"首屏第一次画出来"必经的流水线，哪一步卡住，首屏就慢。**

## 为什么：理解阻塞才能优化首屏

### CSS 阻塞渲染 ★
浏览器**必须等 CSS 解析完才渲染**（避免"无样式闪烁" FOUC）。所以 CSS 是**阻塞渲染的资源**——CSS 没加载完，页面就一直白屏，即使 HTML 已到。

> 推论：CSS 要尽快加载（放 `<head>`、压缩、内联关键 CSS）。CSS 慢 = 首屏白屏。

### JS 阻塞解析 ★
默认 `<script>` 会**阻塞 HTML 解析**——因为 JS 可能改 DOM（document.write 等），浏览器必须停下来等 JS 执行完再继续解析。
```
HTML 解析中 ──遇到 <script>──> 停下，下载+执行 JS ──> 继续解析
```
JS 还可能依赖 CSS（如读元素样式），所以执行前还要等 CSSOM。这双重阻塞让 `<script>` 位置和加载方式严重影响首屏。

## 怎么用：defer / async / preload

### JS 的三种加载方式 ★
```
<script src="app.js"></script>            默认：阻塞解析，下载+执行完才继续
<script src="app.js" defer></script>      defer：不阻塞，HTML 解析完后按顺序执行
<script src="app.js" async></script>      async：不阻塞，下载完立即执行（顺序不定）
```
| 方式 | 阻塞解析 | 执行时机 | 顺序 | 用途 |
|---|---|---|---|---|
| 默认 | 是 | 立即 | 文档顺序 | 几乎别用（会阻塞） |
| **defer** ★ | 否 | HTML 解析完后 | 保持顺序 | **主应用 JS 推荐** |
| async | 否 | 下载完即执行 | 不定 | 独立脚本（统计、广告） |

> 实践：**主 JS 用 defer**（放 `<head>` 也安全，不阻塞解析，DOMContentLoaded 前按序执行）；独立第三方脚本用 async。

### Resource Hints（资源提示）
| 指令 | 作用 |
|---|---|
| `preload` | 提前加载**当前页**关键资源（如关键字体/CSS） |
| `prefetch` | 空闲时加载**未来页**可能用的资源（如下一页代码） |
| `preconnect` | 提前建立连接（DNS/TCP/TLS），省握手时间 |
| `dns-prefetch` | 只提前做 DNS 解析 |

```
<link rel="preload" href="critical-font.woff2" as="font" crossorigin>
<link rel="preconnect" href="https://cdn.example.com">
<link rel="prefetch" href="/next-page.js">
```

### 关键 CSS 内联
首屏所需 CSS 内联到 `<head>`（不另发请求），让首屏不阻塞：
```
<head>
  <style>/* 首屏关键 CSS 直接写这里 */</style>
  <link rel="preload" href="full.css" as="style" onload="this.rel='stylesheet'">  <!-- 非关键异步 -->
</head>
```

## 常见坑

- ❌ **`<script>` 放 `<head>` 不加 defer**：阻塞 HTML 解析，首屏严重延迟。
  - ✅ 正例：用 defer，或放 `</body>` 前。
- ❌ **CSS 放页面底部**：HTML 渲染了但样式没到，先裸结构后突然有样式（FOUC）。
  - ✅ 正例：CSS 放 `<head>`，尽快加载。
- ❌ **忽视字体阻塞**：字体加载慢导致文字"先看不见后突然出现"（FOIT/FOUT）。用 `font-display: swap` 先用回退字体。
- ❌ **滥用 preload**：preload 太多非关键资源，抢占首屏带宽。

## 关联（双向打通）

- **依赖 ↓**：[01-4 从状态到像素](../01-4-rendering/state-to-pixel.md)（同一条管线，CRP 是首次执行）、[01-1 DOM 模型](../01-1-view-fundamentals/dom-model.md)
- **属于 ↑**：[01-9 性能与体验](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 加载优化的具体手段 → [加载性能](./loading-performance.md)
  - 浏览器渲染底层 → [09 支撑基础](../../09-prerequisites/README.md)
  - Core Web Vitals 衡量 → [Core Web Vitals](./core-web-vitals.md)
