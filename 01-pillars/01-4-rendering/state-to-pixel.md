# 从状态到像素：浏览器渲染管线

> 前端有两层"渲染"，别混淆：**框架的渲染**（状态→虚拟 DOM→真实 DOM）和**浏览器的渲染**（DOM→像素）。这篇打通第二层，讲清一个状态变化最终是怎么变成屏幕上的像素的。

## 是什么

当组件状态变化、框架把变更应用到 DOM 后，**浏览器还要把 DOM 变成屏幕上的像素**——这条流水线叫**关键渲染路径（Critical Rendering Path）**。

```
框架层:    state 变化 → 重新计算虚拟 DOM → diff → 应用到真实 DOM
                                                            ↓
浏览器层:  DOM + CSSOM → Render Tree → Layout → Paint → Composite → 像素
```

一句话边界：**框架渲染只负责"改 DOM"，浏览器渲染负责"把 DOM 画出来"。** 性能优化要分别针对这两层。

## 为什么：为什么要分清两层

很多性能困惑源于混淆两层：
- "我用了 React.memo，为什么还卡？"——memo 优化的是框架层重渲染，但浏览器层的布局/绘制可能才是瓶颈。
- "改个颜色为什么也卡？"——颜色变化只触发 Paint，不触发 Layout，但仍可能有合成开销。

分清两层，才能定位性能问题到底在哪一层、用对应手段优化。详见 [01-9 性能与体验](../01-9-performance-ux/README.md)。

## 怎么工作：浏览器的五步流水线

### 1. 构建 DOM / CSSOM
- HTML 解析成 **DOM 树**（[01-1 DOM 模型](../01-1-view-fundamentals/dom-model.md)）。
- CSS 解析成 **CSSOM 树**（样式规则）。
- 这两步是并行的，但有阻塞：CSS 未加载完会阻塞渲染（避免"无样式闪烁"）。

### 2. Render Tree（渲染树）
合并 DOM 和 CSSOM，但**只包含可见节点**——`display: none` 的元素不进 Render Tree，`<head>` 等也不进。

### 3. Layout（布局 / 重排）★ 最贵
根据 Render Tree **计算每个元素的几何信息**（位置、大小）。这是最贵的步骤，因为元素间相互影响（改一个盒子的宽，可能影响整行）。

**触发重排的操作**：改尺寸、位置、字体、增删元素、读 `offsetWidth` 等。

### 4. Paint（绘制 / 重绘）
把布局好的元素**填充像素**（文字、颜色、图片、边框、阴影）。

**触发重绘的操作**：改颜色、背景、阴影等"外观"属性（不改几何）。

### 5. Composite（合成）
把各层（layer）的绘制结果**合成到一起**输出到屏幕。某些属性（transform/opacity）只影响合成层，**不触发 Layout 和 Paint**——所以它们动画性能最好。详见 [01-3 样式](../01-3-styling/README.md) 与 [01-9 性能](../01-9-performance-ux/README.md)。

### 重排 vs 重绘 vs 合成的代价
```
重排（Layout）> 重绘（Paint）> 合成（Composite）
最贵            中等           最便宜
```
性能优化的核心原则：**尽量只触发合成，避免重排**。这就是为什么动画推荐用 transform 而非 left/top。

## 常见坑

- ❌ **混淆框架渲染和浏览器渲染**：用框架性能手段（memo）去解决浏览器层问题（重排），或反之。
- ❌ **以为改 DOM 就是最终结果**：改 DOM 后还有 Layout/Paint/Composite，这些才是用户最终看到的。
- ❌ **强制同步布局**：在循环里读 `offsetWidth` 又改 DOM，详见 [01-1 DOM 模型](../01-1-view-fundamentals/dom-model.md)。
- ❌ **动画改触发重排的属性**：动画 `width/top/left`，每帧都重排，必然卡顿。
  - ✅ 正例：动画用 `transform`/`opacity`，只触发合成。

## 关联（双向打通）

- **依赖 ↓**：[01-1 DOM 模型](../01-1-view-fundamentals/dom-model.md)（DOM 是渲染对象）、[重渲染控制](./re-render-control.md)（框架层渲染）
- **属于 ↑**：[01-4 渲染机制](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 重排重绘的性能优化 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 动画属性选择 → [01-3 样式方案](../01-3-styling/README.md)
  - 浏览器渲染底层 → [09 支撑基础](../../09-prerequisites/README.md)
