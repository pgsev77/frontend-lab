# 响应式原理（Reactivity）

> 声明式 UI 的第一个问题是："框架怎么知道状态变了？"——这就是响应式要解决的。React 和 Vue 用了截然不同的两种思路，理解它们的差异，才能理解为什么两个框架的写法和性能特征不同。

## 是什么

响应式（Reactivity）指**系统自动感知状态变化，并触发依赖该状态的部分更新**的能力。它是声明式 UI `UI = f(state)` 能自动运转的引擎。

两种核心范式：

| 范式 | 思路 | 代表 |
|---|---|---|
| **拉取式（Pull）** | 改了状态先"标记脏"，下次渲染时**整体重新计算** | React |
| **推送式（Push）** | 状态一变，**精确通知**依赖它的那个视图单元更新 | Vue、Svelte、Solid |

一句话边界：**拉取式是"状态脏了，我待会儿重算一遍"；推送式是"状态变了，立刻告诉相关的人"。**

## 为什么：两种范式从哪来

### React 的拉取式
React 不追踪"哪个状态被谁读了"。它只做一件事：你调 `setState`，它标记"这个组件脏了"，然后在下次渲染时机，**整个组件函数重新跑一遍**，得到新 UI，再 diff。

- **优点**：实现简单，不依赖响应式系统的精确追踪；状态可以是任何不可变值。
- **代价**：不知道哪些地方真用了这个状态，只能整组件重算——所以需要 [重渲染控制](./re-render-control.md) 手动优化。

### Vue/Svelte 的推送式（细粒度）
Vue 用 Proxy 拦截对状态的读写：读时**记录"谁依赖了这个属性"**，写时**精确通知那些依赖者**更新。Svelte/Solid 更进一步，在编译期就把依赖关系分析出来，做到**属性级**精确更新。

- **优点**：只更新真正依赖变化的部分，无需手动 memo，默认性能好。
- **代价**：响应式系统有运行时开销（Proxy 拦截）或编译期复杂度；状态必须是"可追踪的"（对象/代理），原始值要包装。

> 直觉：React 把"依赖追踪"这个难题**甩给开发者**（用 memo/依赖数组手动声明），换取运行时简单；Vue/Svelte 把它**自动化**，换取运行时/编译时复杂度。各有取舍。

## 怎么工作

### React：setState → 标记脏 → 重新渲染
```
const [count, setCount] = useState(0)
// setCount 触发：标记组件脏 → 下次渲染时机，组件函数重跑 → 新 UI diff
setCount(1)
```
组件函数每次渲染都重新执行，所有用到 `count` 的地方自然拿到新值。React 不关心"谁读了 count"，因为它会把整个组件重算。

### Vue：Proxy 拦截 → 依赖收集 → 精确通知
```
const state = reactive({ count: 0 })
// 模板里用到 state.count → 访问时被 Proxy 拦截 → 记录"模板依赖 count"
// state.count = 1 → 写时被拦截 → 通知"依赖 count 的模板"更新
```
只有真正读了 `state.count` 的地方会更新，其他部分不动。

### Signal：新一代细粒度响应式
Signal 是把"响应式值"独立出来的原语（Solid/Vue 3.5+/Preact Signals/Svelte Runes）。任何函数订阅一个 Signal，Signal 变了只通知订阅者，做到**函数级、属性级**精确更新，是细粒度响应式的趋势。

## 常见坑

- ❌ **用 React 的心智用 Vue**：以为 Vue 改了状态要手动触发更新，其实 Proxy 自动追踪；反过来用 Vue 心智用 React，以为不调 setState 也能更新。
- ❌ **React 里直接改 state 对象**：`state.count = 1` 不触发更新（没调 setter，React 不知道变了）。
  - ✅ 正例：必须用 `setState(新对象)`，依赖不可变性让 React 检测到变化。详见 [重渲染控制](./re-render-control.md)。
- ❌ **Vue 里解构 reactive 对象丢失响应性**：`const { count } = reactive(...)` 后 count 不再响应。
  - ✅ 正例：用 `toRefs` 包裹，或用 `ref`。

## 关联（双向打通）

- **依赖 ↓**：[声明式 UI](./declarative-rendering.md)（响应式让"状态变→UI 更新"自动发生）
- **属于 ↑**：[01-4 渲染机制](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 拉取式的代价 → [重渲染控制](./re-render-control.md)
  - 状态怎么变成 DOM → [虚拟 DOM 与调和](./virtual-dom.md)
  - 响应式状态管理 → [01-5 状态管理](../01-5-state-management/README.md)
