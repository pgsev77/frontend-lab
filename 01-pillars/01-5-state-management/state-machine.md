# 状态机（State Machine）

> 很多前端状态本质是"有限个状态 + 明确的流转规则"。但多数人用一堆布尔标志（isLoading && !isError && ...）去拼，导致逻辑漏洞百出。状态机是让复杂交互变得**可预测、无遗漏**的利器。

## 是什么

状态机（State Machine）是一种建模方式：把一个流程抽象为**有限个状态**，以及状态之间的**合法流转（transition）**。在任意时刻，对象只处于一个状态，只能按预定义的规则从一个状态转到另一个。

对比"散落的布尔标志"：

```
❌ 散落布尔（典型的烂写法）
const [isLoading, setLoading] = useState(false)
const [isError, setError] = useState(false)
const [isSuccess, setSuccess] = useState(false)
const [data, setData] = useState(null)
// 会出现非法组合：isLoading && isError 同时为 true！状态空间爆炸

✅ 状态机（明确的状态枚举）
const [state, setState] = useState({ status: 'idle' })  // idle | loading | success | error
// 任一时刻只有一个 status，不可能同时 loading 和 error
```

一句话边界：**状态机用"单一状态枚举 + 合法流转"替代"多个布尔标志的组合爆炸"。**

## 为什么：布尔标志的组合爆炸

n 个独立布尔标志，状态空间是 2ⁿ。3 个标志 = 8 种组合，但很多组合是**非法的**（如 loading 和 success 同时为真）。用布尔标志时，你要在每个用到的地方用 `&&`/`||` 排除非法组合，极易遗漏。

状态机把"合法状态"收敛为枚举值，**非法组合根本不存在**——你只能处于 idle/loading/success/error 之一，不可能"既是 loading 又是 error"。这消除了整类 bug。

> 这正是 [复杂度来源](../../00-foundation/complexity-sources.md) 里"异步时间错位"的典型：loading→success→error 的流转用布尔标志管理，漏判一个分支就出错。状态机让流转显式化。

## 怎么用

### 异步四态：最基础的状态机
数据获取的 loading/success/error/empty 就是经典状态机（[01-6](../01-6-data-fetching/README.md) 详讲）。用 useReducer 实现：
```
function fetchReducer(state, action) {
  switch (action.type) {
    case 'fetch':  return { status: 'loading' }
    case 'success': return { status: 'success', data: action.data }
    case 'error':  return { status: 'error', error: action.error }
  }
}
// 视图按 status 分支渲染，不可能出现非法组合
switch (state.status) {
  case 'loading': return <Spinner/>
  case 'success': return <Data data={state.data}/>
  case 'error':   return <Error msg={state.error}/>
}
```

### 复杂流程：显式状态机库（XState）
复杂交互（多步表单、向导、播放器）的状态流转多，用 XState 等库**可视化地定义状态和流转**：
```
// 伪代码：定义状态和合法流转
createMachine({
  initial: 'idle',
  states: {
    idle:    { on: { SUBMIT: 'submitting' } },
    submitting: { on: { SUCCESS: 'success', FAIL: 'error' } },
    success: { on: { RESET: 'idle' } },
    error:   { on: { RETRY: 'submitting', RESET: 'idle' } }
  }
})
```
- 每个状态明确列出"能响应哪些事件、转到哪个状态"。
- 非法流转被禁止（idle 状态直接 SUBMIT 才到 submitting，不能跳过）。
- 可生成可视化图，帮助理解和沟通。

### 何时该用状态机
- 有明确的"阶段/模式"切换（加载/表单步骤/播放器状态）。
- 状态流转规则复杂、容易遗漏分支。
- 多个布尔标志组合判断、出现非法组合 bug。
> 简单的局部 UI（一个开关）不需要状态机，useState 足够。状态机适合**流转复杂**的场景。

## 常见坑

- ❌ **用多个布尔标志表达互斥状态**：`isLoading && isError` 等非法组合，分支漏洞。
  - ✅ 正例：用单一 status 枚举（状态机）。
- ❌ **状态机里塞副作用**：状态流转应是纯数据变更，副作用（发请求）放在流转触发处或 effect。
- ❌ **滥用 XState**：简单三态用 useReducer 就够，不必引入重型库。

## 关联（双向打通）

- **依赖 ↓**：[单向数据流](./unidirectional-flow.md)（reducer 是状态机的简化）、[01-6 异步四态](../01-6-data-fetching/README.md)
- **属于 ↑**：[01-5 状态管理](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 异步状态机 → [01-6 数据获取](../01-6-data-fetching/README.md)
  - 复杂交互的状态机 → [01-8 交互与表单](../01-8-interaction-forms/README.md)
