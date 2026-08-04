# 前端监控（Frontend Monitoring）

> 前端上线后，用户遇到白屏、卡顿、报错，他们不会主动报障——他们会直接离开。没有监控，团队对线上问题一无所知，直到客诉涌入。前端监控是"看得见"的基础。

## 是什么

前端监控指**采集和上报线上前端运行数据**，分三类：

| 类型 | 监控什么 |
|---|---|
| **错误监控** | JS 异常、未处理 Promise、资源加载失败、白屏 |
| **性能监控** | Core Web Vitals（LCP/INP/CLS）真实用户数据 |
| **行为监控** | 用户操作埋点、访问路径、会话回放 |

一句话边界：**监控让线上"从黑盒变透明"——知道发生了什么、哪里有问题、用户体验如何。**

## 为什么：为什么前端必须有监控

回到 [前端本质](../../00-foundation/frontend-essence.md) 差异 1——前端是用户感知层，bug 直接导致流失，且用户不主动报。没有监控：
- 线上白屏了，团队不知道，直到流失一大半用户。
- 某机型性能差，不知道，持续流失该机型用户。
- 某按钮点了报错，不知道，转化率悄悄下降。

监控把"被动等客诉"变成"主动发现问题"。呼应当前[01-9 性能预算](../01-9-performance-ux/performance-budget-monitoring.md)（性能要 RUM 监控）。

## 怎么用：三类监控

### 1. 错误监控 ★
捕获前端所有错误来源：
```
// JS 运行时错误
window.addEventListener('error', e => report({ type: 'js_error', ... }))
// 未处理的 Promise rejection
window.addEventListener('unhandledrejection', e => report({ type: 'promise_error', ... }))
// 资源加载失败（img/script/css）
window.addEventListener('error', e => {
  if (e.target.tagName) report({ type: 'resource_error', tag: e.target.tagName, src: e.target.src })
}, true)   // ★ 资源错误不冒泡，要在捕获阶段监听
```
- 捕获后上报到监控平台（自建或 Sentry 等）。
- 错误要**聚合去重**（同一个错上报千万次没意义），按"错误指纹"归并。
- 配合 [Source Map](./source-map.md) 还原压缩代码的原始堆栈。

### 2. 性能监控（RUM）★
用 web-vitals 库采集真实用户的 Core Web Vitals（呼应当前[01-9](../01-9-performance-ux/core-web-vitals.md)）：
```
import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(metric => report(metric))
// 真实用户的 LCP，比 Lighthouse 实验室数据更准
```
- 实验室数据（Lighthouse）不代表真实用户（弱网、低端机）。
- RUM 按维度细分（设备/网络/地区），发现"某类用户特别慢"。

### 3. 行为监控（埋点）
- **埋点**：记录用户关键操作（点击、页面访问、转化）。
- **会话回放**（session replay）：录制用户操作过程，定位问题复现路径。
- 用于产品分析（转化漏斗）+ 问题诊断。

### 采样策略
全量上报数据量巨大，常采样：
- 错误：全量（错误少且重要）。
- 性能/行为：按比例采样（如 10%），足够代表性即可。

## 常见坑

- ❌ **不上报或上报不及时**：监控装了但没接上报，或离线丢失。要可靠上报（sendBeacon / 重试）。
- ❌ **错误不去重**：同一个错刷屏，淹没真问题。按指纹聚合。
- ❌ **只看实验室不看 RUM**：Lighthouse 分高，真实弱网用户极慢。
- ❌ **监控本身有 bug 拖垮应用**：上报阻塞主线程、数据量爆炸。监控要轻量、异步。

## 关联（双向打通）

- **依赖 ↓**：[01-9 Core Web Vitals](../01-9-performance-ux/core-web-vitals.md)、[错误边界与兜底](./error-boundary.md)
- **属于 ↑**：[01-13 可观测性与质量](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 错误还原 → [Source Map](./source-map.md)
  - 性能监控 → [01-9 性能预算与监控](../01-9-performance-ux/performance-budget-monitoring.md)
  - 监控卡在 CI → [质量门禁](./quality-gates.md)
