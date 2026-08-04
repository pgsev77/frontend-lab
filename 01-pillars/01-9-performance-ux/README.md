# 01-9 · 性能与体验

> **轴属：横切**。性能服务于两条轴——视图轴要渲染快、状态轴要更新流畅。但前端的性能不只是"真的快"，更是"感觉快"。本支柱回答"怎么让加载快、运行时顺、体感流畅"。

## 本支柱解决什么问题
性能差直接导致用户流失（[前端的本质：差异 1](../../00-foundation/frontend-essence.md)）。本支柱回答：**加载性能怎么优化、运行时性能怎么不卡、Core Web Vitals 怎么达标、动画怎么流畅、怎么让用户"感觉快"**。这是 [00-2 权衡（体验 vs 性能）](../../00-foundation/tradeoffs.md) 的实战展开。

## 详细大纲（→ 待填充原子笔记内容）

### 1. 关键渲染路径（Critical Rendering Path）
- 浏览器从 URL 到像素的完整流程
- HTML 解析 → DOM，CSS 解析 → CSSOM → Render Tree → Layout → Paint → Composite
- 阻塞资源（CSS 阻塞渲染、JS 阻塞解析）
- defer / async / preload / prefetch / modulepreload
- → 底层见 [09 浏览器原理](../../09-prerequisites/README.md)

### 2. 加载性能（Loading Performance）
- 首屏优化：关键 CSS 内联、首屏 JS 最小化、图片懒加载/优先级
- 代码分割与按需加载（路由级/组件级）
- 资源优化：图片格式（WebP/AVIF）、字体子集化、压缩
- 预取策略（prefetch/prerender，空闲时加载下一页）
- HTTP 缓存策略（强缓存/协商缓存，→ 详见 09）

### 3. 运行时性能（Runtime Performance）
- 长任务（Long Task）与主线程阻塞
- 无谓重渲染的检测与消除（→ 详见 01-4）
- 内存泄漏（未清理的定时器/监听器/闭包引用）
- 大列表渲染（虚拟列表，进阶见 02-4）
- 防抖节流减少高频计算（→ 详见 01-8）

### 4. Core Web Vitals（★ 核心指标）
- LCP（Largest Contentful Paint）：最大内容渲染时间，衡量加载
- INP（Interaction to Next Paint）：交互到下一次绘制，衡量响应性（替代 FID）
- CLS（Cumulative Layout Shift）：累积布局偏移，衡量视觉稳定
- 辅助指标：FCP、TTFB、TBT
- 每个指标的优化方向

### 5. 动画性能（Animation Performance）
- 为什么 transform/opacity 性能好（合成层，不触发重排重绘）
- 为什么动画 width/top/left 慢（触发重排）
- will-change 与合成层提升（及滥用风险）
- requestAnimationFrame 与动画节拍
- 动画的硬件加速与限制

### 6. 感知性能（Perceived Performance）
- "真的快" vs "感觉快"
- 骨架屏（Skeleton）：让等待显得更短
- 进度指示（ProgressBar vs Spinner：有进度 vs 无进度）
- 乐观更新：让操作"瞬间完成"
- 预加载与过渡动画掩盖延迟
- → 这是 [前端哲学：性能感知](../../00-foundation/frontend-essence.md) 的体现

### 7. 性能预算与监控
- 性能预算（Performance Budget）：每个页面的指标上限
- 持续监控（RUM 真实用户监控 vs 合成监控 Lighthouse）
- 性能回归的 CI 门禁
- → 监控落地见 [01-13 可观测性](../01-13-observability-quality/README.md)

## 学完应能回答
- 浏览器关键渲染路径是怎样的？哪些资源阻塞渲染？
- Core Web Vitals 的三大指标各衡量什么？怎么优化？
- 为什么动画用 transform/opacity 而非 width/top？
- "真的快"和"感觉快"的区别？骨架屏为什么有效？
- 怎么检测和消除无谓重渲染？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 横切
- **依赖 ↓**：[01-4 渲染机制](../01-4-rendering/README.md)（重渲染性能）、[09 浏览器原理](../../09-prerequisites/README.md)（渲染管线）
- **相关 →**：[01-3 样式](../01-3-styling/README.md)（CSS 性能/动画）、[01-7 路由](../01-7-routing/README.md)（代码分割）、[01-13 可观测](../01-13-observability-quality/README.md)（性能监控）、[02-3 性能极致](../../02-advanced/README.md)
