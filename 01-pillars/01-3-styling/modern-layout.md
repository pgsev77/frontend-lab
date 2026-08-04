# 现代布局进阶（Modern Layout）

> [01-1 布局体系](../01-1-view-fundamentals/layout-systems.md) 讲了 Flex/Grid/定位的基础。这篇讲现代 CSS 新增的布局能力——容器查询、子网格、逻辑属性——它们解决了传统布局解决不了的痛点，让响应式和国际化布局更优雅。

## 是什么

现代布局进阶指 CSS 近年新增的、超越 Flex/Grid 基础用法的布局能力：

| 特性 | 解决什么 |
|---|---|
| **容器查询（Container Queries）** | 基于组件容器宽度响应，而非视口宽度 |
| **子网格（subgrid）** | 子元素继承父网格的轨道定义 |
| **逻辑属性（Logical Properties）** | 为多语言/RTL 布局准备的方位居中无关属性 |

一句话边界：**Flex/Grid 解决"怎么排"，现代布局进阶解决"组件级响应式"和"国际化布局"。**

## 为什么：每个特性解决什么痛点

### 1. 容器查询——媒体查询的根本局限
传统响应式靠 `@media (max-width: 768px)`，但它基于**视口宽度**。问题：同一个组件放在侧栏（窄）和主区（宽），视口没变，但组件可用空间差很多。媒体查询无法区分——它只看视口，不看组件自己待的空间。

容器查询让组件**根据自身容器宽度响应**：同一个卡片组件，容器宽时横排、容器窄时竖排，无论视口如何。

```
/* 传统：只看视口，组件放窄侧栏也得遵守视口规则 */
@media (max-width: 768px) { .card { flex-direction: column } }

/* 容器查询：看组件自己的容器，更精准 */
.card-container { container-type: inline-size; }
@container (max-width: 300px) {
  .card { flex-direction: column; }   /* 容器窄就竖排，与视口无关 */
}
```

### 2. 子网格——共享对齐线
父 Grid 定义了列轨道，子元素想和父网格的列对齐时，传统要重复定义轨道。`subgrid` 让子元素**直接继承父网格的轨道**，保证父子精确对齐（如表单标签和输入框对齐）。

### 3. 逻辑属性——方向无关布局
传统 `margin-left` 是"物理左"。但阿拉伯语（RTL）里，"左"语义上是"结束"侧。逻辑属性 `margin-inline-start` 会自动适配书写方向：LTR 时是左，RTL 时是右。这让一套 CSS 同时支持中英文（LTR）和阿拉伯语（RTL）。

## 怎么用

### 容器查询
```
.sidebar { container-type: inline-size; }
@container (min-width: 400px) {
  .widget { display: grid; grid-template-columns: 1fr 1fr; }
}
```
让 `.widget` 根据它所在的 `.sidebar` 宽度决定布局，而非视口。这是真正的**组件级响应式**。

### 子网格
```
.form { display: grid; grid-template-columns: max-content 1fr; gap: 8px; }
.form-row { display: grid; grid-template-columns: subgrid; }  /* 继承父的列定义 */
```
`.form-row` 的两列和父级精确对齐，无需重定义。

### 逻辑属性
| 物理属性 | 逻辑属性 | 说明 |
|---|---|---|
| `margin-left` | `margin-inline-start` | 行内起始侧（LTR=左，RTL=右） |
| `margin-right` | `margin-inline-end` | 行内结束侧 |
| `margin-top` | `margin-block-start` | 块级起始（上） |
| `text-align: left` | `text-align: start` | 自动适配方向 |

### 弹性单位的选择
- `rem`：相对根字号，利于整体缩放（无障碍）。**间距/字号首选。**
- `em`：相对父字号，用于组件内相对尺寸。
- `%` / `fr`：相对父容器，布局填充用。
- `vw`/`vh`：视口比例，全屏场景用（注意移动端 100vh 的坑）。
- `clamp(min, ideal, max)`：流式响应，如 `font-size: clamp(1rem, 2vw, 1.5rem)`。

## 常见坑

- ❌ **用视口单位做全屏时的移动端坑**：`100vh` 在移动端含地址栏，实际超出可见区。用 `100dvh`（动态视口高度）或 `min-height: 100%`。
- ❌ **忽视逻辑属性**：硬编码 `margin-left`，做不了 RTL 国际化。
  - ✅ 正例：国际化项目一律用逻辑属性。
- ❌ **滥用容器查询**：所有响应式都换成容器查询，增加复杂度。媒体查询仍适合"整个页面级"的响应式，容器查询适合"组件级"。
- ❌ **子网格兼容性**：较老浏览器不支持，按需降级。

## 关联（双向打通）

- **依赖 ↓**：[01-1 布局体系](../01-1-view-fundamentals/layout-systems.md)（Flex/Grid 基础）、[01-1 盒模型](../01-1-view-fundamentals/box-model.md)
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 响应式设计整体 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
  - 国际化与 RTL → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
