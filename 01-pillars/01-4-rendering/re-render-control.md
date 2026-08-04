# 重渲染控制（Re-render Control）

> React 这类拉取式框架，"状态变就整组件重算"。如果重算太频繁、范围太大，性能就崩。这篇讲怎么用 memo、不可变数据、key 等手段，把无谓的重渲染压到最小。

## 是什么

重渲染控制指**手动约束"哪些组件在状态变化时该重新渲染、哪些不该"**。在拉取式框架（React）里，这是必须掌握的性能优化技能；在推送式框架（Vue/Solid）里，框架自动精确更新，通常无需手动控制。

一句话边界：**拉取式默认"多渲染"（要你手动减负），推送式默认"少渲染"（自动精确）。**

## 为什么：React 什么时候重渲染

理解 React 重渲染的触发条件，是控制它的前提：

| 情况 | 是否重渲染子组件 |
|---|---|
| 组件自己的 state 变了 | 是（该组件及子孙默认全渲染） |
| 父组件重渲染 | 是（子组件默认跟着渲染，即使 props 没变） |
| Context 值变了 | 所有消费该 Context 的组件 |

**核心痛点**：父组件重渲染时，**即使传给子组件的 props 没变，子组件也会重渲染**——这是 React 不做深比较导致的默认行为，也是无谓重渲染的主要来源。

## 怎么用：四种控制手段

### 1. React.memo —— 跳过 props 没变的子组件
```
const ExpensiveList = React.memo(function List({ items }) { ... })
// 父组件重渲染时，若 items 引用没变，List 不重渲染
```
`memo` 对 props 做浅比较，相同则跳过。**但前提是父组件传的 props 引用稳定**——这引出下面两条。

### 2. useMemo / useCallback —— 稳定引用 ★
```
// ❌ 每次父渲染都创建新函数/新对象 → memo 失效（引用每次都变）
<Child onClick={() => doX()} data={{ a: 1 }} />

// ✅ 用 useCallback/useMemo 稳定引用
const handleClick = useCallback(() => doX(), [])
const data = useMemo(() => ({ a: 1 }), [])
<Child onClick={handleClick} data={data} />
```
**关键洞察**：`memo` 只有配合稳定的 props 引用才有效。父组件每次新建函数/对象传下去，`memo` 的浅比较每次都不等，白 memo。

### 3. 不可变数据（Immutable Update）—— 让"变化"可检测
React 用**引用相等**判断状态是否变化。不可变更新（返回新对象而非改原对象）让 React 一眼看出"变了"：
```
❌ state.items.push(newItem); setItems(state.items)   // 同一引用，React 以为没变，不渲染！
✅ setItems([...state.items, newItem])                 // 新数组引用，React 检测到变化
```
不可变性是 React 检测变化 + 重渲染控制（memo 浅比较）的共同基础。

### 4. 正确的 key —— 避免列表错误重建
详见 [虚拟 DOM 与调和](./virtual-dom.md)。用稳定 ID 当 key，列表变动时复用而非重建。

## 常见坑

- ❌ **滥用 useMemo/useCallback**：给所有东西都 memo，引入依赖数组的维护成本，却没收益（子组件本来就不重或 props 本来就稳定）。
  - ✅ 正例：先测，有性能问题再 memo；优先用 Context/状态拆分减少依赖范围。
- ❌ **memo 了但 props 引用不稳**：传了内联函数/对象，memo 每次都失效。
- ❌ **可变更新导致不渲染**：直接改 state 对象，引用没变，React 不触发渲染。
- ❌ **在子组件里改 props**：违背单向数据流，引发不可预测渲染。呼应 [组件模型](../01-2-componentization/component-model.md)。

## 关联（双向打通）

- **依赖 ↓**：[响应式原理](./reactivity.md)（拉取式的代价）、[虚拟 DOM 与调和](./virtual-dom.md)（key）
- **属于 ↑**：[01-4 渲染机制](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 重渲染性能 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 不可变数据与状态管理 → [01-5 状态管理](../01-5-state-management/README.md)
