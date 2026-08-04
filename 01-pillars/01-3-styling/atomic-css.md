# 原子化 CSS（Atomic / Utility-first CSS）

> Tailwind 让"在 HTML 里堆一堆 class 名"这种看似丑陋的写法成了主流。理解原子化 CSS 为什么有效，才能理解它的取舍——为什么它既能减小体积、提升一致性，又被人吐槽"类名冗长"。

## 是什么

原子化 CSS（Atomic CSS，也叫 Utility-first）指**不写语义化的自定义 class，而是用预设的单一用途工具类组合出样式**。每个类只干一件事：

```
❌ 语义化 CSS（写自定义 class）
<button class="btn-primary">提交</button>
.btn-primary { background: blue; color: white; padding: 8px 16px; border-radius: 4px; }

✅ 原子化 CSS（用工具类组合）
<button class="bg-blue-500 text-white px-4 py-2 rounded">提交</button>
```

一句话边界：**语义化 CSS 是"给元素起名字再定义样式"，原子化 CSS 是"直接用现成的小积木拼样式"。**

## 为什么：原子化为什么有效

### 1. 解决死代码与体积问题（反直觉）
直觉上"每个元素堆一堆 class"会让 CSS 膨胀。但实际上：
- 语义化方案：每个新组件都要写一套新 CSS，CSS 随组件线性增长，且有很多重复。
- 原子化：工具类是**固定集合**（Tailwind 核心就几千个类），无论多少组件，CSS 体积稳定。**所有组件复用同一套工具类，越多用越划算。**

> 配合 PurgeCSS（按需删除用不到的类），生产环境的 Tailwind CSS 往往只有 10-15KB，比传统方案小得多。

### 2. 强制一致性
工具类来自预设的设计系统（颜色/间距都是固定的 token 值），你**没法随手写 `padding: 13px`**——只能用 `p-3`(12px) 或 `p-4`(16px)。这让全产品的视觉天然一致，呼应 [设计系统](../01-2-componentization/design-system.md)。

### 3. 消除命名负担
不用绞尽脑汁想 class 名（`.sidebar-wrapper-inner`），也不用担心命名冲突（呼应 [CSS 架构演进](./css-architecture-evolution.md)）。

## 怎么用

### 基本写法
```
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
  <img class="w-10 h-10 rounded-full" />
  <div class="text-lg font-semibold text-gray-800">标题</div>
</div>
```
每个类都是单职责的"积木"，组合出完整样式。

### 响应式与状态变体
原子化 CSS 用**前缀**优雅处理响应式和状态：
```
<button class="w-full md:w-auto hover:bg-blue-600 disabled:opacity-50">
```
- `md:w-auto`：中等屏幕及以上变 auto（响应式，无需媒体查询）
- `hover:bg-blue-600`：悬停变蓝（状态，无需伪类 CSS）
- `disabled:opacity-50`：禁用态变半透明

### 何时抽象成组件
原子化的批评点是"类名冗长"。实践原则：**只在重复了 3 次以上时，才把一组工具类抽成组件**（呼应 [01-2 复用陷阱](../01-2-componentization/reuse-pitfalls.md) 的三次法则）。抽象后用 `@apply` 或封装成 React 组件。

## 常见坑

- ❌ **滥用 @apply 把 Tailwind 退化成语义化 CSS**：到处 `@apply`，失去了原子化的体积优势。
- ❌ **在 HTML 里堆几十个类不放任何抽象**：一个按钮 30 个 class，无法维护。
  - ✅ 正例：重复的结构抽成组件（业务组件层 + 原子化内部）。
- ❌ **忽视设计约束的代价**：原子化强制你用预设值，但有时确实需要任意值。Tailwind 用 `[]` 语法（`w-[17px]`）支持，但滥用会破坏一致性。
- ❌ **认为原子化能解决一切**：复杂动态主题、运行时多变样式，原子化不如 CSS 变量 + CSS-in-JS 灵活。

## 关联（双向打通）

- **依赖 ↓**：[CSS 架构演进](./css-architecture-evolution.md)、[01-1 层叠与特异性](../01-1-view-fundamentals/cascade-specificity.md)
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 工具类来自设计令牌 → [设计令牌与主题](./design-tokens.md)
  - 抽象成组件的时机 → [01-2 复用陷阱](../01-2-componentization/reuse-pitfalls.md)
