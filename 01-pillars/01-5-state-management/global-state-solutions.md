# 全局状态方案（Global State Solutions）

> "多组件共享的状态放哪？"——Context、Redux、Zustand、Pinia 给出了不同答案。这篇梳理它们的核心差异和选型，让你不再"无脑上 Redux"。

## 是什么

全局状态方案指**管理跨组件共享状态**的工具。它们都基于 [单向数据流](./unidirectional-flow.md) 思想，但在 API、心智模型、样板量上差异很大：

| 方案 | 心智模型 | 适合 |
|---|---|---|
| **Context** | "状态+订阅"内置 | 低频、中粒度共享 |
| **Redux** | 严格单向 + 单一 store | 大型应用、需时间旅行调试 |
| **Zustand/Jotai** | 轻量 Hooks store | 现代项目默认选择 |
| **Pinia** | Vue 的现代状态库 | Vue 项目 |

一句话边界：**没有最好，只有最合适。Context 够用就别上 Redux，Redux 太重就换 Zustand。**

## 为什么：为什么有这么多方案

**根本矛盾**：全局共享状态要满足两个互相冲突的要求——
1. **共享**：多组件读写同一份数据。
2. **性能**：共享了不能让无关组件都重渲染。

不同方案在这两端做不同权衡：
- Context 简单但"共享易、性能难"（值变则所有消费者重渲染）。
- Redux 用 selector 解决性能，但样板重。
- Zustand/Jotai 用"原子订阅"兼顾简单和性能。

## 怎么用：各方案要点

### 1. Context（React 内置）
```
const ThemeContext = createContext('light')
function App() {
  return <ThemeContext.Provider value="dark"><Page/></ThemeContext.Provider>
}
function Button() { const theme = useContext(ThemeContext); ... }
```
- **优点**：React 原生、零依赖、API 极简。
- **适用**：低频变化的全局值（主题、用户信息、语言）。
- **性能坑**：Context 值一变，**所有 useContext 消费者全部重渲染**，即使只用了值的一小部分。所以不适合高频变化或大对象。

### 2. Redux
严格的 Flux 模型：单一 store + action + reducer + 中间件。
- **优点**：可预测、可追踪（DevTools 时间旅行）、中间件生态成熟（thunk/saga）。
- **代价**：样板代码多（action type/creator/reducer）、学习曲线陡。
- **适用**：大型应用、需要严格的状态变更审计、团队习惯函数式风格。
> Redux Toolkit（RTK）大幅减少了样板，是现代 Redux 的推荐写法。

### 3. Zustand（★ 现代推荐）
```
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}))
function Counter() {
  const count = useStore(state => state.count)  // ★ selector 只订阅 count
  const increment = useStore(state => state.increment)
}
```
- **优点**：API 极简（一个 create）、无 Provider、Hooks 原生、**selector 精确订阅**（只订阅用到的字段，性能好）。
- **适用**：中小型到大型应用，是现代 React 项目的默认选择，替代了多数 Redux 场景。

### 4. Jotai / Recoil（原子化）
把状态拆成最小"原子"，组件订阅需要的原子。
```
const countAtom = atom(0)
function Counter() { const [count, setCount] = useAtom(countAtom) }
```
- **优点**：极细粒度，天然避免无谓重渲染；适合状态分散、依赖关系复杂的场景。
- **代价**：原子拆分需要经验，状态散落多出。

### 5. Pinia（Vue）
Vue 官方推荐的状态库，组合式 API 风格，比 Vuex 更简洁。思想和 Zustand 类似（轻量、组合式）。

## 常见坑

- ❌ **无脑上 Redux**：中小项目用 Redux，样板代码成本超过收益。
  - ✅ 正例：中小项目用 Context（低频）或 Zustand。
- ❌ **Context 存高频变化的大对象**：每次值变，所有消费者重渲染，性能崩。
  - ✅ 正例：高频/大对象用 Zustand 的 selector 精确订阅，或拆分 Context。
- ❌ **把服务端状态塞进全局 store**：手动 refetch 泥潭。呼应 [状态分类](./state-classification.md)——服务端状态用 Query 库。
- ❌ **全局化本该局部的状态**：一个弹窗开关也放全局，增加耦合。

## 关联（双向打通）

- **依赖 ↓**：[单向数据流](./unidirectional-flow.md)、[状态分类](./state-classification.md)
- **属于 ↑**：[01-5 状态管理](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 订阅粒度与性能 → [状态粒度与订阅](./state-subscription.md)
  - 服务端状态不在本篇 → [01-6 数据获取](../01-6-data-fetching/README.md)
