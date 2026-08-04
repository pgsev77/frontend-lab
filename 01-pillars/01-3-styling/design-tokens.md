# 设计令牌与主题（Design Tokens & Theming）

> "换个主题，全站颜色跟着变"——这件事的底层就是设计令牌。令牌是设计系统 [01-2](../01-2-componentization/design-system.md) 的地基，也是样式层"单一修改点"思想的载体。这篇深入令牌的分层、CSS 变量的机制、主题切换的实现。

## 是什么

设计令牌（Design Token）是**把视觉决策命名化、变量化**的命名值。不是散落的 `#1677ff`，而是有名字的 `--color-primary`：

```
❌ 硬编码：.btn { background: #1677ff; }      /* 多处重复，改不动 */
✅ 令牌：  .btn { background: var(--color-primary); }  /* 单一来源 */
```

主题化（Theming）则是**通过切换令牌值，让整个界面换一套外观**——最常见的是亮色/暗色模式。

一句话边界：**令牌是"命名的视觉值"，主题是"令牌值的一套预设"。** 改主题 = 换一套令牌值。

## 为什么：令牌解决什么

### 1. 单一修改点
主色变了，只改 `--color-primary` 一处，所有用到它的地方同步更新。硬编码则要全局搜索替换，极易遗漏。

### 2. 语义隔离
业务代码用**语义令牌**（`--color-danger`）而非原始值（`#ff0000`）。"危险色"以后从红改成橙，业务代码不动，只改语义令牌的定义。

### 3. 主题切换的物理基础
主题切换本质是"运行时换一套令牌值"。只有用**可运行时改的 CSS 变量**做令牌，主题切换才可能。预处理器变量（Sass）编译后就固定了，做不了动态主题。

## 怎么用

### 令牌的三层分层 ★
```
① 全局令牌（原始值，无语义）
   --color-blue-500: #1677ff;
   --color-red-500: #ff4d4f;

② 语义令牌（按用途命名）★ 业务只用这层
   --color-primary: var(--color-blue-500);
   --color-danger: var(--color-red-500);

③ 组件令牌（组件内专用）
   --button-bg: var(--color-primary);
   --input-border: var(--color-gray-300);
```
- **业务代码只引用语义令牌**，绝不直接用全局令牌或原始值。
- 换主题只改语义层，全局和组件层不动。

### CSS 变量 vs 预处理器变量
| | CSS 变量（自定义属性） | Sass/Less 变量 |
|---|---|---|
| 何时生效 | 运行时（浏览器里可改） | 编译时（构建后固定） |
| 能否 JS 改 | 能（`element.style.setProperty`） | 不能 |
| 主题切换 | 天然支持 | 不支持动态切换 |
| 现代 CSS | ✅ 首选 | 渐被替代 |

### 主题切换（亮/暗模式）实现
```css
/* 默认（亮色）令牌 */
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
}
/* 暗色令牌：覆盖同名语义令牌 */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #eeeeee;
}
/* 业务只用语义令牌，对主题无感 */
body { background: var(--color-bg); color: var(--color-text); }
```
切换主题只需改 `<html data-theme="dark">`，所有令牌整体换值。还可配合 `@media (prefers-color-scheme: dark)` 跟随系统设置。

> 关键：业务代码**从不写死颜色**，只用 `var(--color-xxx)`，主题切换才能无缝。详见 [01-2 设计系统](../01-2-componentization/design-system.md)。

## 常见坑

- ❌ **业务代码硬编码颜色**：`color: #fff` 绕过令牌，主题切换失效。
  - ✅ 正例：一律 `var(--color-xxx)`。
- ❌ **跳过语义层直接用原始令牌**：`var(--color-blue-500)` 直接用，换主题改不动。
  - ✅ 正例：业务只用语义令牌，原始令牌仅作调色板。
- ❌ **用 Sass 变量做动态主题**：编译后固定，切换不了。
- ❌ **暗色模式忘校验对比度**：暗背景上的灰字看不清。呼应 [01-10 可访问性](../01-10-accessibility-multiplatform/README.md) 的对比度标准。

## 关联（双向打通）

- **依赖 ↓**：[01-1 层叠与特异性](../01-1-view-fundamentals/cascade-specificity.md)、[CSS 架构演进](./css-architecture-evolution.md)
- **属于 ↑**：[01-3 样式方案与视觉](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 令牌是设计系统的地基 → [01-2 设计系统](../01-2-componentization/design-system.md)
  - 暗色模式与对比度 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
  - 原子化 CSS 基于令牌 → [原子化 CSS](./atomic-css.md)
