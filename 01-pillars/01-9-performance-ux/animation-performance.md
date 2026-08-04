# 动画性能（Animation Performance）

> 动画要 60fps（每帧 16ms），但很多动画用错属性导致每帧重排，必然掉帧。这篇是 [01-3 动画与过渡](../01-3-styling/animation-transition.md) 在性能侧的深化——核心还是那条铁律，但讲透"为什么"和"怎么测"。

## 是什么

动画性能指**动画运行时的流畅度**（是否达到 60fps）。它由"动画改了什么属性"决定：改合成层属性流畅，改布局属性卡顿。

一句话边界：**动画性能 = 只让 GPU 忙（合成），别让 CPU/布局忙（重排）。**

## 为什么：渲染管线决定动画成本

回顾 [01-4 渲染管线](../01-4-rendering/state-to-pixel.md)：
```
改属性 → Layout（重排）→ Paint（重绘）→ Composite（合成）→ 像素
```
- 改 `width/top/margin` → 触发 **Layout**（重排）：要重新算所有受影响元素的位置，最贵。每帧 16ms 内跑不完必掉帧。
- 改 `color/background` → 触发 **Paint**（重绘）：重填像素，中等。
- 改 `transform/opacity` → **只触发 Composite**（合成）：GPU 直接移动/变形已有图层，最便宜。

> `transform`/`opacity` 之所以快，是浏览器把它们提升到**独立合成层**（GPU 层），动画时只在这层变换，不碰主布局和重绘。这就是铁律的物理基础。

## 怎么用：铁律的落地

### 用合成属性替代布局属性 ★
```
❌ 卡：element.style.left = '100px'          触发重排
✅ 顺：element.style.transform = 'translateX(100px)'  只合成

❌ 卡：element.style.width = '200px'          触发重排
✅ 顺：element.style.transform = 'scaleX(2)'  只合成（用 scale 模拟放大）

❌ 卡：element.style.top/left 移动            触发重排
✅ 顺：element.style.transform: translate(x,y)  只合成
```
**凡是"移动/缩放/旋转/淡入淡出"，一律用 transform/opacity。**

### will-change —— 提前告知浏览器
提前告诉浏览器"这个元素要动画"，浏览器把它提升为合成层，动画时更高效：
```
.box { will-change: transform; }
```
**慎用**：每个 will-change 都占内存（一个 GPU 层）。别给所有元素加，只在确实要动画的元素上、动画期间临时加，动画后移除。

### requestAnimationFrame —— 动画的正确节拍
JS 驱动的动画用 `requestAnimationFrame`，它会**对齐浏览器刷新率**（60fps），在最佳时机执行，不浪费：
```
function animate() {
  // 更新一帧
  requestAnimationFrame(animate)   // 下一帧继续
}
requestAnimationFrame(animate)
```
> 别用 `setInterval`/`setTimeout` 做动画——它们不和刷新率对齐，会掉帧或在不可见时还跑。

### 怎么测：Performance 面板
Chrome DevTools Performance 录制动画，看：
- **FPS**：是否稳定 60。掉帧会显示红条。
- **火焰图**：Layout/Paint/Composite 占比。Layout 多说明改了布局属性。
- **Layers 面板**：看合成层情况。

## 常见坑

- ❌ **动画 width/top/left/margin**：每帧重排，必然掉帧。
  - ✅ 正例：用 transform。
- ❌ **JS 动画用 setInterval**：不对齐刷新率，掉帧且后台还在跑。
  - ✅ 正例：用 requestAnimationFrame 或 CSS 动画。
- ❌ **will-change 滥用**：到处加，内存爆炸反而变卡。
- ❌ **动画元素触发重排的布局变化**：如动画时父容器尺寸跟着变（transform 不影响布局，但改 width 会）。

## 关联（双向打通）

- **依赖 ↓**：[01-3 动画与过渡](../01-3-styling/animation-transition.md)、[01-4 从状态到像素](../01-4-rendering/state-to-pixel.md)
- **属于 ↑**：[01-9 性能与体验](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 动画的基础（transition/animation）→ [01-3 动画与过渡](../01-3-styling/animation-transition.md)
  - 渲染管线 → [01-4 从状态到像素](../01-4-rendering/state-to-pixel.md)
  - CSS 性能整体 → [01-3 CSS 性能](../01-3-styling/css-performance.md)
