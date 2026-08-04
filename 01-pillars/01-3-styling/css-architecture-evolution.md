# CSS 架构演进（CSS Architecture Evolution）

> CSS 本身只是"给元素加样式"的语言，但当应用变大，**怎么组织 CSS** 成了真正的难题：全局冲突、特异性战争、重复样式。这篇梳理 CSS 架构从"全局裸写"到"作用域隔离"的完整演进，是理解所有现代样式方案的脉络。

## 是什么

CSS 架构指**如何组织和管理 CSS，让它在规模下不冲突、可维护、可复用**。它的演进史就是一部"对抗全局作用域和特异性战争"的历史：

```
全局 CSS → 命名约定(BEM) → CSS Modules → CSS-in-JS → 原子化(Tailwind)
   冲突       规避冲突       编译期隔离      运行时隔离     约束+复用
```

一句话边界：**所有 CSS 架构方案，本质都在解决一个问题——"怎么让样式只作用于该作用的元素，不互相打架"。**

## 为什么：全局 CSS 的原罪

CSS 默认是**全局作用域**：任何 `.title` 规则都作用到所有 `.title` 元素上。这带来三个致命问题：

### 1. 命名冲突
两个开发者都写了 `.btn`，后加载的覆盖前者（[层叠与特异性](../01-1-view-fundamentals/cascade-specificity.md)）。应用一大，谁也不敢确定自己的 class 名是否已被占用。

### 2. 特异性战争
为了盖过别人的样式，不断加长选择器、堆 ID、最终 `!important` 满天飞。详见 [层叠与特异性](../01-1-view-fundamentals/cascade-specificity.md)。

### 3. 死代码
改一个样式不敢删旧的（怕影响别处），旧规则越堆越多，永远清不掉。

## 怎么用：五代方案

### 1. 全局 CSS + 命名约定（BEM/OOCSS/SMACSS）
不改变 CSS 机制，用**人为约定**避免冲突。BEM（Block-Element-Modifier）最流行：
```
.block {}              /* 区块 */
.block__element {}     /* 区块的子元素 */
.block--modifier {}    /* 区块的变体 */
/* 如：.card__title、.card--featured */
```
- **优点**：零工具、可读性尚可。
- **代价**：靠人遵守，一旦有人违规就崩；类名冗长。
> 这一代承认"CSS 只能全局"，转而用命名"假装"有作用域。

### 2. CSS Modules —— 编译期自动隔离
构建工具把 class 名**自动加唯一哈希**（如 `.btn` → `.btn_a3f9k`），每个文件里的 class 互不影响：
```
/* Button.module.css —— 只作用于本文件 */
.btn { color: red; }
import styles from './Button.module.css'
<button className={styles.btn}>   // 实际是 btn_a3f9k
```
- **优点**：真正的局部作用域，零冲突，零运行时开销。
- **代价**：动态样式（运行时根据数据变颜色）不方便。

### 3. CSS-in-JS（styled-components / emotion）
把样式写进 JS，运行时生成唯一 class，**天然支持动态样式**：
```
const Button = styled.button`
  color: ${props => props.primary ? 'blue' : 'gray'};  /* 可读 props */
`
```
- **优点**：样式与组件同处，动态样式优雅，自动隔离。
- **代价**：运行时开销（解析生成 class）、SSR 复杂、与传统 CSS 工具链不兼容。
> 现代编译时 CSS-in-JS（如 Linaria/Vanilla Extract）把开销移到编译期，缓解了运行时问题。

### 4. 原子化 CSS（Tailwind）—— 约束式复用
不写自定义 class，直接用**预设的原子工具类**拼样式，详见 [原子化 CSS](./atomic-css.md)。

## 常见坑

- ❌ **死守一种方案**：每种方案都有取舍，按项目规模和团队选择，别教条。
- ❌ **全局 CSS 和模块化混用不打招呼**：全局 `.card` 影响了 Module 里的 `.card`，难排查。
- ❌ **CSS-in-JS 里做高频动态样式**：每帧重新生成 class，性能差。
  - ✅ 正例：高频变化的样式用 inline style 或 CSS 变量，而非 CSS-in-JS 动态生成。
- ❌ **忽视 SSR 兼容**：运行时 CSS-in-JS 在 SSR 下有样式闪烁/水合问题。

## 关联（双向打通）

- **依赖 ↓**：[01-1 层叠与特异性](../01-1-view-fundamentals/cascade-specificity.md)（所有方案都在对抗它）
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 原子化方案 → [原子化 CSS](./atomic-css.md)
  - 设计令牌 → [设计令牌与主题](./design-tokens.md)
  - 组件化与样式隔离 → [01-2 组件化](../01-2-componentization/README.md)
