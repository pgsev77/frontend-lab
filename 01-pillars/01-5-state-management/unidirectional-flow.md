# 单向数据流（Unidirectional Data Flow）

> "数据从哪来、怎么流动、谁触发更新"——单向数据流给这个问题一个确定的答案。它是 Redux/Flux 的核心思想，也是大型应用状态可预测的根基。

## 是什么

单向数据流指状态（数据）只沿**一个方向**流动的约束：

```
状态(State) → 视图(View) → 用户操作(Action) → 更新状态(Reducer) → 回到状态
   ↑                                                                      |
   └──────────────────────────────────────────────────────────────────────┘
                          （单向闭环，不反向）
```

对比双向绑定（如 Vue 的 v-model、早期 Angular 的 ngModel）：视图直接改状态，状态也直接改视图，数据**双向流动**。

一句话边界：**单向数据流是"状态驱动视图、操作通过明确的 action 改状态"；双向绑定是"视图和状态互相直接改"。**

## 为什么：单向为什么更适合大型应用

### 双向绑定的陷阱
双向绑定在小场景很方便（一个表单字段，输入即更新状态）。但规模一大就失控：
- 数据流不可追踪：状态被改了，不知道是哪个视图、哪条路径改的。
- 级联更新难调试：A 改 B，B 改 C，C 又改 A，形成环，死循环风险。
- 副作用散落：状态变更的副作用（发请求、改 URL）夹在各处，难定位。

### 单向的承诺：可预测、可追踪
单向数据流强制：**状态的变更只能通过明确的 action 触发**。好处：
- **可追踪**：每个状态变化都有对应的 action，调试时能看到"谁、何时、改了什么"（Redux DevTools 的时间旅行就靠这个）。
- **可预测**：给定 state + action，新 state 唯一确定（reducer 是纯函数）。没有隐式的连锁更新。
- **副作用集中**：副作用放在 action/reducer 边界，不散落在视图里。

> 单向的代价是**样板代码多**（要写 action type、action creator、reducer）。但这个"啰嗦"换来的是大型应用的可维护性。现代方案（Zustand 等）在保留单向思想的同时减少了样板。

## 怎么用：Flux/Redux 模型

```
用户点击 ──> dispatch({ type: 'INCREMENT' })   // 发起 action（描述"发生了什么"）
                    │
                    ▼
            reducer(state, action) ──> newState  // 纯函数：根据 action 算新 state
                    │
                    ▼
            视图根据 newState 重新渲染
```

### 三要素
- **Action**：描述"发生了什么"的纯数据对象（`{ type, payload }`），不含逻辑。
- **Reducer**：纯函数 `(state, action) => newState`，根据 action 返回新 state。**不能有副作用，不能改原 state（不可变更新）。**
- **Store**：持有唯一 state，提供 dispatch 和订阅。

### 关键约束
- **状态不可变**：reducer 返回**新对象**，不能改原 state。这让变化可检测（呼应 [重渲染控制](../01-4-rendering/re-render-control.md)）。
- **单一数据源**：整个应用的状态在一棵树里，不散落多处。
- **纯函数 reducer**：同样的输入永远产出同样的输出，可回放、可测试。

### 子→父通信用回调（仍是单向）
React 里子组件改父状态，不是"子直接改父"（反向流），而是**父把回调传给子，子调回调发起 action**。数据流仍是单向的：action 向上，state 向下。
```
function Parent() {
  const [count, setCount] = useState(0)
  return <Child value={count} onIncrement={() => setCount(count+1)} />
  // state 向下传，子通过回调"发起变更"，不直接改
}
```

## 常见坑

- ❌ **在 reducer 里做副作用**（发请求、改全局变量）：破坏纯函数性，调试和回放失效。
  - ✅ 正例：副作用放 action creator 或中间件（如 redux-thunk/saga），reducer 保持纯。
- ❌ **直接改 state**（可变更新）：单向数据流的检测机制失效。
  - ✅ 正例：不可变更新，返回新对象。
- ❌ **把单向当教条**：简单表单用 Redux 全套，过度设计。局部 UI 状态用 useState 即可，全局共享才上 store。

## 关联（双向打通）

- **依赖 ↓**：[状态分类](./state-classification.md)（哪些状态适合单向 store）、[01-4 不可变性](../01-4-rendering/re-render-control.md)
- **属于 ↑**：[01-5 状态管理](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - store 的具体方案 → [全局状态方案](./global-state-solutions.md)
  - 受控组件是单向的体现 → [01-2 受控 vs 非受控](../01-2-componentization/controlled-uncontrolled.md)
