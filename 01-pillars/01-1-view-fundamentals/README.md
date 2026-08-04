# 01-1 · 视图基础与文档结构

> **轴属：视图轴**。这是视图轴的起点——在学组件、渲染之前，先理解界面最底层的"原子"：HTML 怎么描述结构，CSS 怎么描述外观。现代框架把这些抽象掉了，但底层仍是 DOM 与 CSSOM。

## 本支柱解决什么问题
界面不是凭空出现的，它最终都落到 **HTML 文档结构 + CSS 视觉规则**。本支柱回答：**怎么用语义化的结构描述界面、怎么用 CSS 盒模型与布局体系排版、层叠与特异性如何决定样式优先级**。这是所有框架的运行底座。

## 详细大纲（→ 待填充原子笔记内容）

### 1. HTML 语义化（Semantic HTML）
- 为什么语义化重要（可访问性、SEO、可维护性）
- 文档大纲与语义标签（header/nav/main/article/section/aside/footer）
- 语义化 vs div 满天飞

### 2. DOM 模型
- DOM 是什么（文档对象模型，HTML 的内存表示）
- DOM 树、节点类型、DOM 操作的成本（为什么直接操作 DOM 慢）
- DOM 与 JS 的桥梁（→ 引出虚拟 DOM 的动机，详见 01-4）

### 3. CSS 盒模型（Box Model）
- content / padding / border / margin
- `box-sizing: border-box` vs `content-box`
- 外边距合并等坑

### 4. 布局体系
- 正常文档流（block / inline / inline-block）
- ★ Flexbox（一维布局：主轴/交叉轴、对齐、伸缩）
- ★ Grid（二维布局：行列、区域、显式/隐式）
- 定位（static/relative/absolute/fixed/sticky）
- 脱离文档流的代价

### 5. 层叠与特异性（Cascade & Specificity）
- 层叠规则（源顺序、重要性、特异性、层叠层 @layer）
- 特异性计算（ID/类/元素的选择器权重）
- 为什么样式"不生效"——90% 是特异性或层叠问题
- 现代 CSS 架构如何规避特异性战争（→ 详见 01-3 样式）

### 6. 视口与坐标
- viewport、设备像素 vs CSS 像素、DPR
- 元素尺寸与位置（offsetWidth/clientWidth/getBoundingClientRect）
- 滚动与坐标系（→ 滚动性能、虚拟列表的基础）

## 学完应能回答
- 为什么语义化 HTML 不只是"规范"，而是可访问性和 SEO 的基础？
- 直接操作 DOM 为什么慢？这如何引出虚拟 DOM？
- Flexbox 和 Grid 分别适合什么布局？
- 样式"不生效"时，该怎么排查（特异性？层叠？继承？）？
- border-box 和 content-box 的区别？为什么现代项目默认 border-box？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 视图轴起点
- **依赖 ↓**：[09 支撑基础](../../09-prerequisites/README.md)（浏览器渲染引擎）
- **相关 →**：[01-3 样式方案](../01-3-styling/README.md)（CSS 架构）、[01-4 渲染机制](../01-4-rendering/README.md)（DOM → 渲染）
