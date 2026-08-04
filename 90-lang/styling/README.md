# 样式方案（v2-3）

> Tailwind CSS 在 Next.js 里的落地：配置、设计令牌、主题与响应式。

## 详细大纲（→ 点击标题阅读）

### [01. Tailwind 配置](./01-tailwind-config.md)
- 基本用法（原子化组合）、响应式/状态前缀
- tailwind.config（content 扫描、extend vs 覆盖）、globals.css 指令
- 何时抽象组件（三次法则，避免 @apply）
- 对应 v1：[01-3 原子化 CSS](../../01-pillars/01-3-styling/atomic-css.md)

### [02. 设计令牌](./02-design-tokens.md)
- 令牌三层（全局/语义/组件）用 CSS 变量 + Tailwind 主题实现
- CSS 变量 vs Sass 变量（运行时主题切换）
- 间距/字号令牌的约束力
- 对应 v1：[01-3 设计令牌](../../01-pillars/01-3-styling/design-tokens.md)

### [03. 主题与响应式](./03-theme-responsive.md)
- 暗色模式（next-themes，解决闪屏/系统跟随）
- 移动优先断点、无断点自适应（auto-fit）
- 对比度与可访问性、reduced-motion
- 对应 v1：[01-3 响应式演进](../../01-pillars/01-3-styling/responsive-evolution.md)

## 学完应能回答
- Tailwind 的 content 扫描为什么重要？extend 和覆盖的区别？
- 令牌三层怎么用 CSS 变量实现？为什么换主题只改语义层？
- 暗色模式用 next-themes 解决了什么坑？为什么移动优先？
