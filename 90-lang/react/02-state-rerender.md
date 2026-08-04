# 状态与重渲染（React 落地）

> 对应 v1：[01-4 重渲染控制](../../01-pillars/01-4-rendering/re-render-control.md) · [01-5 状态管理](../../01-pillars/01-5-state-management/README.md)

## 它解决什么

React 状态变化会触发重渲染——但如果重渲染太多/太频，性能就崩。这篇讲 React 里 state 怎么用、重渲染怎么触发、memo/useMemo/useCallback 怎么控制。把 v1 [01-4 重渲染控制](../../01-pillars/01-4-rendering/re-render-control.md) 在 React 落地。

## useState 与不可变更新 ★

```tsx
'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  // ❌ 直接改 state：React 检测不到变化（同一引用），不重渲染
  // const bad = () => { count++; setCount(count) }   // count 是 number，这写法本身就错，但对象同理

  // ✅ 返回新值（不可变更新）
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>{count}</button>
}
```

**对象/数组的不可变更新**（React 用引用相等判断变化）：
```tsx
const [user, setUser] = useState({ name: 'a', age: 1 })

// ❌ 直接改：引用没变，React 不渲染
// user.age = 2; setUser(user)

// ✅ 返回新对象
const grow = () => setUser(u => ({ ...u, age: u.age + 1 }))

const [items, setItems] = useState([1, 2, 3])
// ✅ 数组不可变更新
const add = (n: number) => setItems(list => [...list, n])
const remove = (i: number) => setItems(list => list.filter((_, idx) => idx !== i))
```
呼应当前 v1 [01-4 重渲染控制](../../01-pillars/01-4-rendering/re-render-control.md)——不可变性是 React 检测变化 + memo 浅比较的基础。

## 什么时候触发重渲染

| 情况 | 重渲染范围 |
|---|---|
| 组件自己 state 变 | 该组件 + 所有子孙（默认） |
| 父组件重渲染 | 子孙默认跟着渲染（即使 props 没变） |
| Context 值变 | 所有消费该 Context 的组件 |

**核心痛点**：父渲染时，即使传给子的 props 没变，子也重渲染——这是 React 不做深比较的默认行为，是无谓重渲染的主要来源。

## 三种控制手段

### 1. React.memo —— props 没变就跳过

```tsx
const ExpensiveList = React.memo(function List({ items }: { items: Item[] }) {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
})
// 父渲染时，若 items 引用没变，List 不重渲染
```

### 2. useMemo / useCallback —— 稳定引用 ★

```tsx
function Parent({ data }: { data: Item[] }) {
  const [tab, setTab] = useState('a')

  // ❌ 每次父渲染都新建函数/对象 → memo 的子组件每次都失效（引用变了）
  // return <Child onClick={() => doX()} filter={{ tab }} />

  // ✅ 用 useCallback/useMemo 稳定引用
  const handleClick = useCallback(() => doX(), [])
  const filter = useMemo(() => ({ tab }), [tab])
  return <Child onClick={handleClick} filter={filter} />
}
```

**关键洞察**（呼应当前 v1）：`memo` 只有配合**稳定的 props 引用**才有效。父每次新建函数/对象传下去，memo 浅比较每次都不等，白 memo。

### 3. 正确的 key（列表）

```tsx
// ❌ index 当 key：列表插入/删除时，React 以为所有元素都变了，全重建
{items.map((item, idx) => <Row key={idx} item={item} />)}

// ✅ 稳定唯一 ID 当 key
{items.map(item => <Row key={item.id} item={item} />)}
```
呼应当前 v1 [01-4 虚拟 DOM](../../01-pillars/01-4-rendering/virtual-dom.md)——key 是 React 复用 DOM 节点的身份标识。

## useReducer：复杂状态用状态机

状态逻辑复杂（多字段联动、明确流转）时，用 useReducer 替代多个 useState（呼应当前 v1 [01-5 状态机](../../01-pillars/01-5-state-management/state-machine.md)）：

```tsx
type State = { status: 'idle' | 'loading' | 'success' | 'error'; data?: Data; error?: string }
type Action = { type: 'fetch' } | { type: 'success'; data: Data } | { type: 'error'; error: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'fetch': return { status: 'loading' }
    case 'success': return { status: 'success', data: action.data }
    case 'error': return { status: 'error', error: action.error }
  }
}

function useFetchData() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' })
  // 调 dispatch({ type: 'success', data })
  return state
}
```
单一 status 枚举替代散落布尔，呼应当前 v1 [01-6 异步四态](../../01-pillars/01-6-data-fetching/async-four-states.md)。

## 为什么这样写（设计决策）

- **默认不可变更新**：让 React 用浅比较高效检测变化（呼应当前 v1 [01-4](../../01-pillars/01-4-rendering/re-render-control.md)）。
- **memo 按需用**：先测有性能问题再 memo，不为 memo 而 memo（依赖数组有维护成本）。
- **复杂状态用 reducer**：状态机式 reducer 让流转可预测、可追踪（呼应当前 v1 [01-5](../../01-pillars/01-5-state-management/state-machine.md)）。

## 常见坑

- ❌ **可变更新**：`setUser(u => { u.age++; return u })` 引用没变，不渲染。返回新对象。
- ❌ **memo 了但 props 引用不稳**：传内联函数/对象，memo 失效。
- ❌ **index 当 key**：列表变动时全重建 + 状态串项。
- ❌ **滥用 useMemo/useCallback**：到处 memo，依赖数组维护成本超过收益。

## 关联

- ↑ 对应 v1 原理：[01-4 重渲染控制](../../01-pillars/01-4-rendering/re-render-control.md) · [01-4 虚拟 DOM](../../01-pillars/01-4-rendering/virtual-dom.md) · [01-5 状态机](../../01-pillars/01-5-state-management/state-machine.md)
- → v2 相关：[01 组件与 Hooks](./01-components-hooks.md) · [04 性能](./04-performance.md)
