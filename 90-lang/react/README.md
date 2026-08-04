# React 核心（v2-2）

> React 的核心机制在 Next.js 里的落地：组件与 Hooks、状态与重渲染、错误边界、性能。

## 详细大纲（→ 点击标题阅读）

### [01. 组件与 Hooks](./01-components-hooks.md)
- 函数组件、props/children、自定义 Hook
- 复合组件（context 协作）、Hook 规则
- 对应 v1：[01-2 组件模型](../../01-pillars/01-2-componentization/component-model.md)

### [02. 状态与重渲染](./02-state-rerender.md)
- useState 与不可变更新、React.memo、useMemo/useCallback
- useReducer（复杂状态用状态机）、正确的 key
- 对应 v1：[01-4 重渲染控制](../../01-pillars/01-4-rendering/re-render-control.md)

### [03. 错误边界](./03-error-boundary.md)
- React Error Boundary（类组件）、App Router 的 error.tsx 约定
- 边界兜不住的错误（事件/异步/effect）
- 对应 v1：[01-13 错误边界](../../01-pillars/01-13-observability-quality/error-boundary.md)

### [04. 性能](./04-performance.md)
- useTransition/useDeferredValue（并发渲染）、Suspense
- React Profiler 定位重渲染
- 对应 v1：[01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md)

## 学完应能回答
- 函数组件怎么写？自定义 Hook 怎么抽逻辑？Hook 的两条规则？
- React 什么时候重渲染？memo/useMemo/useCallback 怎么配合控制？
- useTransition 解决什么问题？和 useDeferredValue 有什么区别？
- App Router 的 error.tsx 怎么用？边界兜不住哪些错误？
