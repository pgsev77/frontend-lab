# CSS 性能（CSS Performance）

> CSS 看似"只是描述样式"，但它有性能代价——选择器匹配、重排重绘、阻塞渲染。这篇讲 CSS 层面的性能优化，是 [01-9 性能与体验](../01-9-performance-ux/README.md) 在样式侧的细化。

## 是什么

CSS 性能问题集中在三类：
1. **选择器匹配成本**：浏览器要为每个元素匹配所有 CSS 规则。
2. **重排/重绘代价**：改某些样式触发昂贵的布局重新计算。详见 [从状态到像素](../01-4-rendering/state-to-pixel.md)。
3. **阻塞渲染**：CSS 未加载完会阻塞首屏渲染。

一句话边界：**CSS 性能 = 选得快（选择器）+ 改得便宜（少重排）+ 加载不卡（不阻塞）。**

## 为什么：每个问题的根源

### 1. 选择器从右向左匹配 ★
浏览器匹配选择器是**从右往左**的：`.nav .item a` 会先找所有 `<a>`，再逐个向上看祖先是否匹配。这意味着：
- 最右边的选择器（key selector）决定匹配成本。
- 后代选择器（`A B`）链越长，回溯检查越多，越慢。

```
❌ 慢：* { } 或 div * { }              /* 通用选择器，匹配一切 */
❌ 慢：.nav ul li a                     /* 长链后代选择器，每个 a 都回溯 */
✅ 快：.nav-link                        /* 单一类选择器，直接匹配 */
```

### 2. 重排（Layout）vs 重绘（Paint）的代价
| 改动 | 触发 | 代价 |
|---|---|---|
| 改 `width/height/margin` | 重排+重绘+合成 | 最贵 |
| 改 `color/background` | 重绘+合成 | 中 |
| 改 `transform/opacity` | 仅合成 | 最便宜 |

重排最贵，因为元素间几何相互影响，改一个可能牵动整页重新布局。详见 [从状态到像素](../01-4-rendering/state-to-pixel.md)。

### 3. CSS 阻塞渲染
浏览器**必须等 CSS 解析完才渲染**（避免"无样式闪烁"）。所以 CSS 是**阻塞渲染的资源**——CSS 没加载完，页面就一直白屏。这就是为什么"关键 CSS 内联到 `<head>`"能加速首屏。

## 怎么用：优化手段

### 选择器层面
- **优先用单 class 选择器**（`.nav-link`），避免长链后代选择器。
- **避免通用选择器**（`*`）和属性选择器滥用。
- 现代原子化 CSS / CSS Modules 天然规避了这些问题（都是单 class）。

### 动画/高频改动层面 ★ 最关键
- **动画只用 `transform` 和 `opacity`**——它们只触发合成层，不触发重排重绘。详见 [动画与过渡](./animation-transition.md)。
- 避免动画 `width/top/left/margin`（触发重排）。
- 用 `will-change` 提示浏览器提前提升合成层（但别滥用，每个合成层都有内存代价）。

### 加载层面
- **关键 CSS 内联**到 `<head>`，首屏不阻塞。
- 非关键 CSS 异步加载（`media="print" onload`）或拆分按路由加载。
- CSS 压缩、去重（构建工具自动做）。

## 常见坑

- ❌ **动画改 width/top**：每帧重排，必然卡顿。
  - ✅ 正例：用 `transform: translateX()` 代替 `left`，`transform: scale()` 代替 `width`。
- ❌ **深嵌套后代选择器**：`.layout .sidebar .menu .item .link`，慢且脆弱。
  - ✅ 正例：扁平的单 class（`.sidebar-link`）。
- ❌ **滥用 will-change**：给所有元素都 `will-change: transform`，内存爆炸。
  - ✅ 正例：只在确实要动画的元素、动画期间临时加。
- ❌ **大段 CSS 阻塞首屏**：所有 CSS 放一个文件阻塞到底。
  - ✅ 正例：关键 CSS 内联，非关键按需加载。

## 关联（双向打通）

- **依赖 ↓**：[01-1 层叠与特异性](../01-1-view-fundamentals/cascade-specificity.md)、[从状态到像素](../01-4-rendering/state-to-pixel.md)
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 动画性能 → [动画与过渡](./animation-transition.md)
  - 整体性能体系 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 浏览器渲染管线 → [09 支撑基础](../../09-prerequisites/README.md)
