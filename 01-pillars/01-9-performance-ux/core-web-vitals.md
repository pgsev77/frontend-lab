# Core Web Vitals

> "我的网站快不快？"——以前这个问题没有统一答案。Google 用 Core Web Vitals 给出了标准化指标。它不只是技术指标，更直接影响 SEO 排名，是性能优化的"北极星"。

## 是什么

Core Web Vitals 是 Google 定义的一组**核心用户体验指标**，衡量加载、交互、视觉稳定三方面：

| 指标 | 全名 | 衡量 | 好的阈值 |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | **加载**：最大内容渲染时间 | < 2.5s |
| **INP** | Interaction to Next Paint | **响应性**：交互到下次绘制 | < 200ms |
| **CLS** | Cumulative Layout Shift | **视觉稳定**：累积布局偏移 | < 0.1 |

一句话边界：**CWV 是"用户感知性能"的标准化量化。** 它们不是技术细节（如 TTFB），而是直接映射"用户感觉怎样"。

> 2024 年起，**INP 取代了 FID** 成为响应性核心指标——FID 只测首次输入，INP 测整个会话所有交互，更贴近真实体验。

## 为什么：每个指标为什么重要

### LCP —— "主要内容什么时候出来"
最大内容元素（如主图、大标题、主区块）渲染完成的时间。它比"首字节 TTFB""DOM 解析完"更贴近用户感知——用户关心的是"看到主要内容"，不是"技术加载阶段"。
- 慢的常见原因：大图片、阻塞的 CSS/JS、服务器响应慢、字体加载。
- 优化：见 [加载性能](./loading-performance.md)。

### INP —— "点了之后多久有反应"
用户每次交互（点击、按键）到浏览器**下一次绘制**（视觉反馈）的延迟。它测量整个会话所有交互，取最差值。这直接回答"用起来卡不卡"。
- 慢的常见原因：长任务占主线程（[运行时性能](./runtime-performance.md)）、无谓重渲染、事件处理器太重。
- 优化：拆解长任务、用 `startTransition` 把重渲染降优先级（[01-4 渲染调度](../01-4-rendering/rendering-scheduling.md)）。

### CLS —— "界面会不会乱跳"
页面生命周期内，内容**意外位移**的累积量。典型场景：图片加载完把文字挤下去、字体加载完文字位移、广告插入推开内容。这种"点不到按钮/读串行"的体验很糟。
- 慢的常见原因：图片/广告无尺寸预留（加载完撑开）、字体 FOIT/FOUT 位移、动态插入内容。
- 优化：图片/视频**预设宽高**、字体 `font-display`、广告位预留空间、避免在已渲染内容上方插入。

## 怎么用

### 测量
- **Lighthouse**：实验室环境合成测量（开发时用）。
- **web-vitals 库 / RUM**：真实用户环境测量（生产用，反映真实体验）。
- **Chrome DevTools Performance**：详细分析每次交互、渲染。

### 优化映射
| 指标 | 主要手段 |
|---|---|
| LCP | 关键 CSS 内联、preload 关键资源、图片优化、SSR/预渲染 |
| INP | 拆长任务、startTransition、减少重渲染、Web Worker |
| CLS | 预设尺寸、font-display、预留广告位 |

> 这三个指标恰好覆盖性能的三个维度：**进来快（LCP）、用着顺（INP）、不乱跳（CLS）**。优化要均衡，不能只追一个。

## 常见坑

- ❌ **只优化 Lighthouse 分数，忽视真实用户**：实验室环境好不代表真实用户（弱网、低端机）好。要 RUM 测真实用户。
- ❌ **CLS 不重视**：以为"加载快就行"，结果内容乱跳，体验极差。
- ❌ **CLS 修复靠"预设尺寸"忘了字体**：图片设了尺寸，但字体加载完文字位移，CLS 还是高。
- ❌ **优化一个指标恶化另一个**：过度内联 CSS 让 LCP 好但首屏字节大；过度预加载抢带宽。

## 关联（双向打通）

- **依赖 ↓**：[关键渲染路径](./critical-rendering-path.md)、[运行时性能](./runtime-performance.md)
- **属于 ↑**：[01-9 性能与体验](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - LCP 优化 → [加载性能](./loading-performance.md)
  - INP 优化 → [运行时性能](./runtime-performance.md)、[01-4 渲染调度](../01-4-rendering/rendering-scheduling.md)
  - 真实用户监控 → [性能预算与监控](./performance-budget-monitoring.md)、[01-13 可观测性](../01-13-observability-quality/README.md)
