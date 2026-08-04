# 响应式样式的演进（Responsive Styling Evolution）

> 响应式不是"加几个媒体查询"那么简单。从移动优先到容器查询，响应式的方法论在不断进化。这篇梳理响应式样式的完整演进，与 [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md) 的响应式设计主题互补——这里讲 CSS 手段，那里讲整体策略。

## 是什么

响应式样式指**让同一套 CSS 适配不同屏幕/设备**的技术手段。它的演进分四代：

```
固定布局 → 媒体查询（视口响应）→ 移动优先 → 容器查询（组件响应）
```

一句话边界：**响应式核心是"让布局随可用空间自适应"，手段从"按视口切换"进化到"按组件容器切换"。**

## 为什么：为什么响应式是标配

回顾 [前端的本质](../../00-foundation/frontend-essence.md) 差异 3——前端运行在不可控环境，屏幕尺寸千差万别（320px 手机到 4K 显示器）。如果不做响应式，要么手机上要横向滚动，要么大屏留一大片空白。响应式让**一套代码适配所有屏幕**，是 [01-10 多端适配](../01-10-accessibility-multiplatform/README.md) 的 CSS 落地。

## 怎么用：四代演进

### 1. 固定布局（已淘汰）
早期按固定宽度（如 960px）设计，手机上整体缩放，字小难用。移动端 `<meta viewport>` 引入后才真正可做响应式。

### 2. 媒体查询——视口响应 ★ 最常用
基于**视口宽度**切换布局：
```
/* 桌面：三列 */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); }
/* 平板：两列 */
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }
/* 手机：一列 */
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
```
- **优点**：简单直观，适合"整个页面级"的布局切换。
- **局限**：只看视口，不看组件自身容器。同一组件在不同位置（窄侧栏 vs 宽主区）无法自适应。这是容器查询要解决的。

### 3. 移动优先（Mobile First）★ 方法论
写 CSS 时**从最小屏幕开始**，再用 `min-width` 向上增强：
```
/* 基础：手机（一列），这是默认 */
.grid { display: grid; grid-template-columns: 1fr; }
/* 平板及以上：两列 */
@media (min-width: 481px) { .grid { grid-template-columns: repeat(2, 1fr); } }
/* 桌面及以上：三列 */
@media (min-width: 769px) { .grid { grid-template-columns: repeat(3, 1fr); } }
```
**为什么移动优先更好**：
- 手机是约束最强的环境（性能弱、屏幕小、网络差），先在它上做好，桌面增强就稳。
- `min-width`（渐进增强）比 `max-width`（优雅降级）更符合"基础可用、增强更好"的原则。
- 避免"桌面优先再裁剪"导致手机加载冗余样式。

### 4. 容器查询——组件响应
基于**组件容器宽度**响应，详见 [现代布局进阶](./modern-layout.md)。适合可复用组件库（组件不知道自己会放多宽的地方）。

### 流式布局配合
响应式不只是媒体查询，还要用流式单位让布局**自然填充**空间：
- `Grid` 的 `fr` 单位、`auto-fit` + `minmax` 实现"自动换行的等宽列"，无需媒体查询：
```
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
/* 容器够宽就多列，不够就自动换行，完全自适应 */
```

### 响应式图片
```html
<img srcset="photo-480w.jpg 480w, photo-960w.jpg 960w, photo-1920w.jpg 1920w"
     sizes="(max-width: 600px) 480px, 90vw"
     src="photo-960w.jpg" />
```
让浏览器按屏幕和 DPR 选最合适的图。呼应 [01-1 视口与坐标](../01-1-view-fundamentals/viewport-coordinates.md) 的 DPR。

## 常见坑

- ❌ **桌面优先 + max-width**：默认是桌面样式，再往手机裁剪。手机加载了用不到的桌面样式，且容易遗漏裁剪。
  - ✅ 正例：移动优先，`min-width` 向上增强。
- ❌ **断点按设备定**（如"iPhone 宽度 375px"）：设备无穷多，断点应基于**内容布局变化的临界点**。
- ❌ **只靠媒体查询不做流式布局**：每个断点写死宽度，中间尺寸断裂。配合 `fr`/`auto-fit` 让过渡平滑。
- ❌ **忽视触摸交互**：响应式只调布局，没调点击区域——手机上按钮太小点不到。呼应 [01-10 触摸友好](../01-10-accessibility-multiplatform/README.md)。

## 关联（双向打通）

- **依赖 ↓**：[01-1 布局体系](../01-1-view-fundamentals/layout-systems.md)、[现代布局进阶](./modern-layout.md)
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 响应式的整体策略 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
  - 响应式图片与 DPR → [01-1 视口与坐标](../01-1-view-fundamentals/viewport-coordinates.md)
  - 原子化的响应式前缀 → [原子化 CSS](./atomic-css.md)
