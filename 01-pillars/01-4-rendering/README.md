# 01-4 · 渲染机制

> **轴属：视图轴**。这是视图轴的"引擎室"——回答"状态变化后，界面怎么高效更新"。理解渲染机制，是理解所有前端框架、所有性能优化的前提。

## 本支柱解决什么问题
声明式 UI 的核心承诺是"状态变，视图自动更新"。但这个"自动"背后是复杂的渲染机制。本支柱回答：**声明式 UI 怎么工作、响应式怎么追踪依赖、虚拟 DOM 怎么调和、怎么控制重渲染**。这是 [复杂度来源 1（状态-视图同步）](../../00-foundation/complexity-sources.md) 的核心战场。

## 详细大纲（→ 点击标题阅读）

### [1. 声明式 UI 与数据驱动](./declarative-rendering.md)
- 命令式（操作 DOM）vs 声明式（描述状态，框架更新）
- 声明式 UI 的核心模型：`UI = f(state)`
- 为什么声明式在规模化下胜出（→ 详见 00-2 权衡）
- 声明式的代价：框架需要算出"差异"

### [2. 响应式原理](./reactivity.md)
- 两种响应式范式：
  - **拉取式（Pull）**：React 的 setState → 标记脏 → 下次渲染重新计算
  - **推送式（Push）**：Vue/Svelte 的依赖追踪 → 状态变 → 精确通知依赖它的视图
- 依赖追踪（Vue 的 Proxy / Svelte 的编译期分析）
- 响应式粒度：组件级（React）vs 属性级（Vue/Svelte/Solid）
- Signal：新一代细粒度响应式原语

### [3. 虚拟 DOM 与调和](./virtual-dom.md)
- 虚拟 DOM 是什么（真实 DOM 的轻量 JS 对象描述）
- 为什么需要它（直接操作 DOM 慢、diff 比较成本低）
- 调和算法（Diff）：同层比较、key 的作用、类型不同直接替换
- Diff 的假设（O(n) 的三条启发式）
- 虚拟 DOM 的争议（细粒度响应式 vs vDOM，编译时框架如 Svelte/Solid）

### [4. 重渲染控制](./re-render-control.md)
- 什么时候触发重渲染（state/props 变化、父组件渲染）
- React 的渲染流程：render 阶段（可中断）+ commit 阶段
- Fiber 架构：可中断/可恢复的渲染（时间切片）
- 避免无谓重渲染：memo / useMemo / useCallback
- 不可变数据（immutable）与重渲染检测的关系
- key 的正确使用（为什么不能用 index 当 key）

### [5. 渲染时机与调度](./rendering-scheduling.md)
- 同步渲染 vs 并发渲染（Concurrent）
- 时间切片（Time Slicing）与 transition
- Suspense 与异步渲染
- 渲染优先级（用户输入 > 数据更新）

### [6. 从状态到像素：浏览器渲染管线](./state-to-pixel.md)
- 浏览器关键渲染路径：DOM/CSSOM → Render Tree → Layout → Paint → Composite
- 重排（Layout）vs 重绘（Paint）vs 合成（Composite）的代价
- 框架的"渲染"与浏览器的"渲染"是两件事（→ 详见 01-9）

## 学完应能回答
- 命令式和声明式的本质区别？为什么现代框架选声明式？
- 拉取式响应式（React）和推送式（Vue）的区别？各有什么代价？
- 虚拟 DOM 解决什么问题？它的 Diff 算法有哪三条假设？
- React 什么时候重渲染？怎么避免无谓重渲染？
- 为什么不能用数组 index 当 key？
- 框架的渲染和浏览器的渲染是两件事吗？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 视图轴
- **依赖 ↓**：[01-1 视图基础](../01-1-view-fundamentals/README.md)（DOM 是渲染的对象）、[09 浏览器原理](../../09-prerequisites/README.md)（渲染管线）
- **相关 →**：[01-5 状态管理](../01-5-state-management/README.md)（状态变化触发渲染）、[01-9 性能与体验](../01-9-performance-ux/README.md)（重渲染性能）、[02-1 SSR](../../02-advanced/README.md)（服务端渲染）
