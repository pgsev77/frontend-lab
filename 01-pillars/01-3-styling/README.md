# 01-3 · 样式方案与视觉

> **轴属：视图轴**。界面"长什么样"由样式决定。本支柱梳理 CSS 架构的演进、现代样式方案、设计令牌与主题、CSS 性能与动画——回答"怎么管理样式才不混乱、不冲突、可主题化"。

## 本支柱解决什么问题
CSS 看似简单，实则是前端最容易失控的部分：全局样式冲突、特异性战争、重复样式、难主题化。本支柱回答：**用什么样的 CSS 架构、怎么避免冲突、怎么做主题与设计系统、CSS 怎么写才高性能**。

## 详细大纲（→ 点击标题阅读）

### [1. CSS 架构演进](./css-architecture-evolution.md)
- 全局 CSS：简单但冲突严重
- BEM / OOCSS / SMACSS：命名约定规避冲突
- CSS Modules：编译时局部作用域
- CSS-in-JS（styled-components / emotion）：运行时/编译时作用域 + 动态样式
- 各方案的权衡（运行时开销、可维护性、SSR 兼容）

### [2. 原子化 CSS](./atomic-css.md)
- Tailwind 的哲学（utility-first，组合而非命名）
- 为什么原子化能减小体积、提升一致性
- Tailwind 的代价（学习曲线、类名冗长、设计约束）
- 原子化 vs 组件化 CSS 的取舍

### [3. 设计令牌与主题](./design-tokens.md)
- 设计令牌：把颜色/间距/字号/圆角抽成统一变量
- CSS 变量（自定义属性）vs 预处理器变量（Sass/Less）
- 主题切换（CSS 变量 + data-theme 属性）
- 暗色模式的实现
- 令牌分层：全局令牌 → 别名令牌 → 组件令牌

### [4. CSS 性能](./css-performance.md)
- CSS 选择器性能（从右向左匹配，避免通用选择器嵌套）
- 重排（reflow）vs 重绘（repaint）的代价
- will-change 与 GPU 合成层
- 关键 CSS（critical CSS）内联首屏
- CSS 的加载与阻塞渲染

### [5. 动画与过渡](./animation-transition.md)
- transition（状态过渡）vs animation（关键帧动画）
- transform 与 opacity：唯一"合成层"属性，动画性能最好
- 为什么避免动画 width/top/left（触发重排）
- 动画的缓动函数（easing）与体感
- 视图过渡（View Transitions API）
- 动画与可访问性（prefers-reduced-motion，→ 详见 01-10）

### [6. 现代布局进阶](./modern-layout.md)
- Flexbox/Grid 复杂布局（→ 基础见 01-1）
- 容器查询（Container Queries）：基于容器而非视口的响应式
- 子网格（subgrid）
- 逻辑属性（logical properties：margin-inline/start，为多语言布局准备）

### [7. 响应式样式的演进](./responsive-evolution.md)
- 媒体查询（@media，基于视口）
- 容器查询（基于组件容器）
- 弹性单位（rem/em/%/fr/vw/vh）的选择
- → 完整响应式设计见 [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)

## 学完应能回答
- 全局 CSS、BEM、CSS Modules、CSS-in-JS、Tailwind 各自的权衡？
- 为什么 Tailwind 能减小最终体积？
- 设计令牌是什么？怎么做暗色模式？
- 哪些 CSS 属性动画性能好，为什么？动画 width 为什么慢？
- 容器查询解决了媒体查询的什么问题？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 视图轴
- **依赖 ↓**：[01-1 视图基础](../01-1-view-fundamentals/README.md)（盒模型/层叠/特异性）、[01-2 组件化](../01-2-componentization/README.md)（设计系统）
- **相关 →**：[01-9 性能与体验](../01-9-performance-ux/README.md)（CSS 性能/动画性能）、[01-10 可访问性多端](../01-10-accessibility-multiplatform/README.md)（响应式/prefers-reduced-motion）
