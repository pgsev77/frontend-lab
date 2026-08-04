# CSS 盒模型（Box Model）

> CSS 里**每一个元素都是一个矩形盒子**。盒模型定义了这个盒子由哪几层组成、它们怎么算尺寸。这是所有布局的基础——不懂盒模型，就解释不了"为什么设了 width:100px，实际却比 100px 宽"。

## 是什么

盒模型（Box Model）指每个 HTML 元素被渲染成一个由四层组成的矩形盒子，从内到外依次是：

| 层 | 名称 | 说明 |
|---|---|---|
| content | 内容区 | 实际放文字/图片的区域，由 `width`/`height` 定义 |
| padding | 内边距 | 内容到边框的留白，**算盒子背景** |
| border | 边框 | 盒子的边框线 |
| margin | 外边距 | 盒子与其他盒子之间的间距，**透明** |

一句话边界：**padding 是盒子内部的填充（带背景色），margin 是盒子外部的间隔（透明）。**

## 为什么：默认 box-sizing 的"尺寸陷阱"

关键的坑在于：**默认 `width`/`height` 只定义 content 区，不包括 padding 和 border**。这导致实际可见宽度比设定的更大：

```
默认 box-sizing: content-box
div { width: 100px; padding: 10px; border: 2px solid; }
实际可见宽度 = 100(content) + 10×2(padding) + 2×2(border) = 124px  ❗
```
你想让盒子占 100px，结果占了 124px，布局错位。当 padding/border 一变，整个布局跟着挪。

### 现代项目的标准解法：border-box
```
✅ box-sizing: border-box   （width 包含 padding 和 border）
div { width: 100px; padding: 10px; border: 2px solid; }
实际可见宽度 = 100px（width 已含 padding+border），content 自动缩小为 76px
```
`border-box` 让 `width` 就等于"盒子实际占多宽"，符合直觉。几乎所有现代项目在全局重置里设：

```css
*, *::before, *::after { box-sizing: border-box; }
```

## 怎么用：margin 与 padding 的选择

**选 padding 还是 margin？** 看你要的间距是否属于"盒子自身的一部分"：

| 场景 | 选哪个 | 原因 |
|---|---|---|
| 按钮文字到边框的距离 | padding | 属于按钮自身的"呼吸感"，带背景色 |
| 两个按钮之间的间距 | margin | 是外部间隔，不属于任一按钮 |
| 卡片标题到卡片边的留白 | padding | 属于卡片内部 |
| 两张卡片之间的间隔 | margin | 卡片之间 |

> 直觉：**背景色覆盖到哪，padding 就到哪；margin 永远透明、在背景之外。**

### 外边距合并（Margin Collapsing）★ 经典坑
垂直方向相邻的两个 margin 会**合并**（取较大者），而非相加：

```
❌ 以为会相加：
.a { margin-bottom: 20px; }
.b { margin-top: 30px; }
你期望 a、b 间距 = 20 + 30 = 50px
实际间距 = max(20, 30) = 30px   ← 合并了！
```
合并发生的三个场景：
1. 相邻兄弟元素的上/下 margin
2. 父元素与第一个/最后一个子元素（margin 透过父级边界）
3. 空元素的上下 margin 自身合并

**现代解法**：用 Flexbox/Grid 布局时，**margin 不会合并**（只有正常的"块级格式化上下文"才合并）。所以现代项目多用 `gap`（Flex/Grid 间距属性）规避此问题。若要用 margin，可用 `overflow: hidden`、`padding`、`border` 等触发新的 BFC（块级格式化上下文）来阻止合并。

## 常见坑

- ❌ **忘记设 border-box**：尺寸算不对，padding/border 一改布局全乱。
  - ✅ 正例：全局 `* { box-sizing: border-box; }`。
- ❌ **用 margin 调内部留白**：把"按钮文字到边缘"做成 margin，导致点击区域（背景）不包含留白，体验差。
  - ✅ 正例：内部留白用 padding，外部间隔用 margin。
- ❌ **被外边距合并坑到**：两个元素间距比预期小，排查半天。
  - ✅ 正例：布局优先用 Flex/Grid + `gap`，规避合并问题。
- ❌ **负 margin 滥用**：负 margin 能让盒子重叠，但难维护、易破布局，只在特定技巧（如等高列）下小心使用。

## 关联（双向打通）

- **依赖 ↓**：[DOM 模型](./dom-model.md)（盒子是 DOM 元素的渲染表现）
- **属于 ↑**：[01-1 视图基础与文档结构](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 盒子怎么排列 → [布局体系](./layout-systems.md)
  - gap 是现代布局方案 → [01-3 样式方案](../01-3-styling/README.md)
  - 重排成本与盒模型相关 → [01-9 性能与体验](../01-9-performance-ux/README.md)
