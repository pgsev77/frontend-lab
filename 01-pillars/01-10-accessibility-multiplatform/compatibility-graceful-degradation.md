# 兼容与降级（Compatibility & Graceful Degradation）

> 前端运行在不可控环境——旧浏览器、奇怪内核、被禁用的 JS、受限网络。你的应用在这些环境会"白屏崩溃"还是"降级可用"？兼容与降级策略决定这个答案。

## 是什么

两种互补的策略：

| 策略 | 思路 | 起点 |
|---|---|---|
| **渐进增强（Progressive Enhancement）** | 先做**最基础可用**的核心，再为强环境加增强 | 从"最低"起，向上加 |
| **优雅降级（Graceful Degradation）** | 先做**完整功能**，再为弱环境做降级处理 | 从"最高"起，向下兜 |

一句话边界：**渐进增强是"先有保底再锦上添花"，优雅降级是"先完美再补漏洞"。** 现代实践多倾向渐进增强。

> 这呼应 [前端本质](../../00-foundation/frontend-essence.md) 的"防御性"哲学——不信任运行环境，永远有降级方案。

## 为什么：环境不可控的几种情况

| 情况 | 后果（无降级） |
|---|---|
| 旧浏览器不支持新 API | JS 报错，功能失效 |
| JS 被禁用/加载失败 | 整页白屏 |
| 弱网/请求失败 | 数据不显示 |
| 用户关闭了 Cookie/localStorage | 持久化失效 |
| 特性被浏览器限制（如自动播放） | 功能不触发 |

不处理，用户在这些环境遇到的就是"崩溃"。处理了，是"核心功能可用，部分增强降级"。

## 怎么用：四种手段

### 1. 特性检测（Feature Detection）★
检测当前环境是否支持某特性，支持才用，不支持降级：
```
❌ 浏览器嗅探（判断是不是 Chrome）—— userAgent 会骗人，且新版本变化快
✅ 特性检测
if ('IntersectionObserver' in window) {
  // 用 IO 做懒加载
} else {
  // 降级：直接加载所有图片，或用 scroll 事件模拟
}
```
> 原则：**检测能力，而非检测浏览器**。能力检测最可靠。

### 2. Polyfill（补丁）
旧浏览器缺某个新 API，用 polyfill（一段 JS）补上它的行为：
```
// 按需 polyfill：只在缺的浏览器加载
import 'core-js/stable/promise/all-settled'   // 补 Promise.allSettled
```
- 配合 `browserslist` 配置目标浏览器，构建工具（Babel）自动按需转译+polyfill。
- **权衡**：polyfill 增加体积。按需 polyfill（只补目标浏览器缺的）比全量省。

### 3. CSS 的渐进增强
用 `@supports` 检测 CSS 特性：
```css
.card { /* 基础样式，所有浏览器可用 */ }
@supports (display: grid) {
  .card { display: grid; /* 支持 grid 的增强布局 */ }
}
```

### 4. JS 失败的降级
JS 加载失败/被禁用时，提供基础可用内容（HTML 本身能渲染）：
```
<noscript>本页面需要 JavaScript，请启用。</noscript>   <!-- JS 禁用提示 -->
<!-- 关键内容尽量在 HTML 里有基础结构，而非全靠 JS 渲染（SSR 有助此） -->
```

## 常见坑

- ❌ **浏览器嗅探**：判断 UA 决定行为，UA 不可靠且维护痛苦。
  - ✅ 正例：特性检测。
- ❌ **全量 polyfill**：所有 polyfill 都打进去，现代浏览器白背体积。
  - ✅ 正例：按目标浏览器按需 polyfill。
- ❌ **JS 失败即白屏**：核心内容全靠 JS 渲染，JS 挂了整页空。
- ❌ **忽视目标浏览器配置**：没设 browserslist，构建工具不知要兼容到哪，可能转译过度或不足。

## 关联（双向打通）

- **依赖 ↓**：[前端本质（防御性/不可控环境）](../../00-foundation/frontend-essence.md)、[01-12 构建工具](../01-12-architecture-engineering/README.md)
- **属于 ↑**：[01-10 可访问性与多端](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - polyfill 与构建 → [01-12 构建工具](../01-12-architecture-engineering/README.md)
  - 错误兜底 → [01-13 错误边界](../01-13-observability-quality/README.md)、[01-6 错误处理](../01-6-data-fetching/error-handling-retry.md)
  - SSR 的可用性 → [02 前端进阶](../../02-advanced/README.md)
