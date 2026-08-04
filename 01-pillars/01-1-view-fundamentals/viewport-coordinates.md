# 视口与坐标（Viewport & Coordinates）

> 前端的"位置"有三个不同参照系：CSS 像素、物理像素、视口坐标。搞不清它们的换算，就会出现"图标在视网膜屏上发虚""滚动后点击位置偏了"这类诡异 bug。这篇是 [滚动性能](../01-9-performance-ux/README.md)、[虚拟列表](../../02-advanced/README.md) 的几何基础。

## 是什么

涉及三组容易混淆的概念：

| 概念 | 含义 |
|---|---|
| **视口（viewport）** | 浏览器窗口里实际显示网页的可视区域 |
| **CSS 像素** | CSS 用的逻辑像素单位（`px`），与物理像素解耦 |
| **设备像素（物理像素）** | 屏幕上真实的发光点数 |

一句话边界：**CSS 写的是逻辑像素（px），屏幕显示的是物理像素，两者通过 DPR 换算。** 前端代码里绝大多数情况只关心 CSS 像素。

## 为什么：为什么会有两套像素

早期屏幕一个 CSS 像素 = 一个物理像素，简单。但**高 DPI（Retina）屏**出现后，物理像素密度翻倍：一个 CSS 像素对应 2×2=4 个物理像素（DPR=2），甚至 3×3（DPR=3）。

这样设计是为了：**让 CSS 代码不因屏幕清晰度而改变**。同样 `width: 100px`，在普通屏和 Retina 层都占相同的物理尺寸，只是 Retina 屏用更多物理像素来渲染它，所以更清晰。

```
DPR (设备像素比) = 物理像素 / CSS 像素
普通屏：DPR = 1   → 1 CSS px = 1 物理 px
Retina 屏：DPR = 2 → 1 CSS px = 2×2 物理 px（更清晰）
```

### DPR 对图片的影响（★ 高清屏发虚的根因）
一张 100×100 的图片，在 DPR=2 的屏上被拉伸到占 100 CSS px = 200 物理像素，于是模糊。**解法**：提供 200×200 的图，让浏览器缩小显示（`<img src="hi.png" width="100">` 或 srcset）。

```html
✅ 用 srcset 让浏览器按 DPR 选图
<img src="logo-1x.png"
     srcset="logo-1x.png 1x, logo-2x.png 2x, logo-3x.png 3x">
```

## 怎么用：三种坐标系

获取元素位置时，参照系不同，数值含义不同：

| 属性/方法 | 参照系 | 含义 | 是否随滚动变 |
|---|---|---|---|
| `offsetLeft/Top` | **offsetParent**（最近的定位祖先） | 相对定位父元素 | 否 |
| `clientX/Y`（事件） | **视口**（浏览器可视区） | 鼠标相对可视区左上角 | 否（视口本身） |
| `pageX/Y`（事件） | **整个文档** | 鼠标相对文档左上角 | 含滚动偏移 |
| `getBoundingClientRect()` | **视口** | 元素相对可视区的位置+尺寸 | 是（滚动后变） |
| `scrollTop` | — | 元素滚动的距离 | 随滚动变 |

### getBoundingClientRect()（★ 最常用）
返回元素相对视口的位置和尺寸，是做拖拽、定位提示、[虚拟列表](../../02-advanced/README.md) 的核心 API：
```js
const rect = el.getBoundingClientRect()
// rect.left / rect.top    相对视口左上角
// rect.width / rect.height 元素的 CSS 尺寸
// rect.right / rect.bottom 右下角坐标
```
注意：它相对**视口**，所以滚动页面后值会变。要算相对文档的位置需加上滚动偏移：
```js
const docTop = rect.top + window.scrollY   // 加滚动距离 = 相对文档
```

### offsetWidth / clientWidth / scrollWidth 区别
```
offsetWidth  = content + padding + border（含边框，整体占位）
clientWidth  = content + padding（不含边框，可视内部）
scrollWidth  = content + padding（含溢出滚动的内容，整体内容宽）
```

## 常见坑

- ❌ **忽略 DPR 导致高清屏图片模糊**：只提供 1x 图，在 Retina 屏发虚。
  - ✅ 正例：用 srcset 或 CSS 的 image-set 提供多倍图。
- ❌ **混淆视口坐标和文档坐标**：用 `getBoundingClientRect()` 的 top 当文档坐标，没加 `scrollY`，滚动后位置全错。
  - ✅ 正例：文档坐标 = 视口坐标 + scrollY/scrollX。
- ❌ **移动端没设 viewport meta**：手机上页面默认按 980px 宽渲染再缩小，导致字小、布局挤。
  - ✅ 正例：HTML `<head>` 加 `<meta name="viewport" content="width=device-width, initial-scale=1">`，让 CSS 像素 = 设备宽度。
- ❌ **offsetParent 不确定就用 offsetLeft**：offsetLeft 相对的是 offsetParent（最近定位祖先），若祖先没设定位，参照物可能是 body，结果不可预期。
  - ✅ 正例：要精确位置用 `getBoundingClientRect()`。

## 关联（双向打通）

- **依赖 ↓**：[DOM 模型](./dom-model.md)（坐标是对 DOM 元素的度量）、[盒模型](./box-model.md)（尺寸由盒模型决定）
- **属于 ↑**：[01-1 视图基础与文档结构](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 坐标是拖拽/虚拟列表的基础 → [02-4 复杂交互](../../02-advanced/README.md)
  - 滚动与坐标 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 响应式图片与多端 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
