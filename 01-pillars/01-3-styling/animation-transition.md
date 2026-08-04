# 动画与过渡（Animation & Transition）

> 动画不只是"好看"，它服务于体验——告诉用户"发生了什么变化"，让界面有连续性。但动画也是性能重灾区。这篇讲清"怎么让动画既流畅又不卡"，核心是**只动 transform/opacity**这条铁律。

## 是什么

CSS 提供两种动画机制：

| 机制 | 用途 | 特点 |
|---|---|---|
| **transition（过渡）** | 状态 A → B 的平滑过渡 | 只需定义起止值和时长，浏览器自动插值 |
| **animation（动画）** | 复杂的关键帧序列、循环 | 用 `@keyframes` 定义多个关键帧 |

一句话边界：**transition 是"两点间过渡"，animation 是"多关键帧编排"。** 简单的状态变化用 transition，复杂运动用 animation。

## 为什么：动画的性能铁律

### 核心铁律：只动 `transform` 和 `opacity`
回顾 [从状态到像素](../01-4-rendering/state-to-pixel.md) 的渲染管线：
- 改 `width/top/left/margin` → 触发**重排（Layout）**，最贵。
- 改 `color/background` → 触发**重绘（Paint）**，中等。
- 改 `transform/opacity` → **只触发合成（Composite）**，最便宜。

`transform` 和 `opacity` 之所以便宜，是因为它们作用于**独立的合成层（GPU 层）**，浏览器直接在 GPU 上移动/变形这个层，不需要重新计算布局或重绘像素。

```
❌ 卡：animate { left: 0 → 100px }     每帧重排
✅ 顺：animate { transform: translateX(100px) }   只合成
```

> 这是动画性能的**第一性原理**：能不能做到"只合成"，决定了动画流不流畅。60fps 意味着每帧只有 16ms，重排在这个预算内几乎必超时。

## 怎么用

### transition —— 状态过渡
```
.btn { background: blue; transition: background 0.2s ease; }
.btn:hover { background: darkblue; }   /* 自动过渡 0.2s */
```
- 定义要过渡的属性 + 时长 + 缓动函数。
- 适合 hover、展开收起、开关切换等"两点过渡"。

### animation —— 关键帧
```
@keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
.loader { animation: spin 1s linear infinite; }
```
- 适合旋转、弹跳、循环、多步骤序列。

### 用 transform 替代昂贵属性
```
❌ 移动：left/top           ✅ transform: translate(x, y)
❌ 缩放：width/height        ✅ transform: scale(n)
❌ 旋转：（无原生替代）        ✅ transform: rotate(deg)
❌ 透明度变化：（无替代）      ✅ opacity
```

### 缓动函数（easing）与体感
- `linear`（线性）：机械感，少用。真实世界少有匀速运动。
- `ease-out`：快进慢出，最常用——符合"快速响应、平滑停止"的直觉。
- `ease-in`：慢进快出，适合"离开/消失"。
- 过长的动画（>300ms）让人感觉迟钝，过短（<100ms）又像没动画。**150-250ms 是大多数微交互的甜区。**

### prefers-reduced-motion（可访问性）
部分用户对动画敏感（前庭功能障碍），应尊重系统设置：
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```
呼应 [01-10 可访问性](../01-10-accessibility-multiplatform/README.md)。

## 常见坑

- ❌ **动画触发重排的属性**：动画 `width/height/top/left`，每帧重排，必然掉帧。
- ❌ **动画时长过长**：300ms 的展开动画让人觉得"慢"，违背 [感知性能](../01-9-performance-ux/README.md)。
- ❌ **忽视 prefers-reduced-motion**：强迫所有用户看动画，伤害敏感用户。
- ❌ **滥用 will-change**：到处 `will-change`，内存开销反而拖慢。只在动画元素上、动画期间临时加。

## 关联（双向打通）

- **依赖 ↓**：[从状态到像素](../01-4-rendering/state-to-pixel.md)（合成层原理）、[CSS 性能](./css-performance.md)
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 动画性能与整体性能 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 减少动画的可访问性 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
