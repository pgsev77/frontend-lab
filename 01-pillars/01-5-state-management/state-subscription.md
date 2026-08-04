# 状态粒度与订阅（State Granularity & Subscription）

> 全局 store 共享了状态，但"共享"带来一个性能问题：值一变，谁该重渲染？这篇讲 selector、原子状态、派生状态——核心是怎么"只订阅真正需要的部分"，避免无谓重渲染。

## 是什么

状态粒度指**状态被拆分/订阅的精细程度**；订阅指**组件如何选取它依赖的状态切片**。两者决定了"状态变时，哪些组件重渲染"：

- **粗粒度订阅**：订阅整个 store → 任何字段变都重渲染。
- **细粒度订阅**：只订阅用到的字段 → 只有该字段变才重渲染。

一句话边界：**性能优化的核心是"订阅范围 = 渲染依赖范围"，不多不少。** 订阅过多导致无谓重渲染，订阅过少导致数据不更新。

## 为什么：粗粒度订阅的性能问题

以 Context 为例（最典型）：
```
const AppContext = createContext({ user: {}, theme: '', cart: [] })
function Component() {
  const { user, theme, cart } = useContext(AppContext)  // 订阅整个 context 值
}
```
**问题**：Context 值是整个对象，只要对象里**任何字段**变（theme 变了），所有 useContext 的组件都重渲染——即使某组件只用了 user。

store 同理：Zustand 里 `useStore(state => state)`（订阅整个 state）等于粗粒度，任何变化都重渲染。

## 怎么用：三种精确订阅手段

### 1. Selector——只选需要的字段 ★
```
// Zustand：selector 只订阅 count，其他字段变不影响本组件
const count = useStore(state => state.count)

// Redux：selector 同理
const count = useSelector(state => state.count)
```
组件只依赖 count，store 里别的字段变，本组件不重渲染。**这是 store 性能优化的第一手段。**

### 2. 原子状态（Atom）
Jotai/Recoil 把状态拆成最小单元，每个原子独立订阅：
```
const countAtom = atom(0)
const nameAtom = atom('x')
function C() { const [count] = useAtom(countAtom) }  // 只依赖 countAtom
```
countAtom 变只通知订阅它的组件，天然细粒度。适合状态分散的场景。

### 3. 派生状态（Derived State）与 memoize
很多"状态"其实是其他状态的**计算结果**，不该单独存储：
```
❌ 冗余存储：total 单独存，items 变了要手动同步 total
const [items, setItems] = useState([])
const [total, setTotal] = useState(0)
useEffect(() => setTotal(items.reduce(...)), [items])  // 同步噩梦

✅ 派生：total 由 items 计算，单一来源
const total = useMemo(() => items.reduce(...), [items])  // 自动派生
```
**派生状态原则**：能从已有状态算出来的，就别单独存。冗余存储 = 同步地狱（呼应 [单向数据流](./unidirectional-flow.md) 的单一数据源）。

> 派生状态要用 `useMemo`/selector 缓存，避免每次渲染都重算。Redux 的 reselect、Zustand 的 selector 都支持 memoize 派生。

### 拆分 Context 规避粗粒度
如果非用 Context，把一个大的 Context **按变化频率拆成多个**：
```
// ❌ 一个大 Context，theme 变 cart 消费者也重渲染
<BigContext.Provider value={{ user, theme, cart }}>

// ✅ 按频率拆分，互不影响
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>  // theme 变只影响 theme 消费者
    <CartContext.Provider value={cart}>...
```

## 常见坑

- ❌ **订阅整个 store/context**：`useContext(BigContext)` 或 `useStore(s => s)`，任何字段变都重渲染。
  - ✅ 正例：用 selector 只选需要的字段。
- ❌ **冗余存储派生状态**：把可计算的值单独存，手动同步，导致不一致。
  - ✅ 正例：派生状态用 useMemo/selector 计算。
- ❌ **selector 里返回新对象**：`useStore(s => ({ a: s.a, b: s.b }))` 每次返回新引用，浅比较永远不等，反而每次都重渲染。
  - ✅ 正例：用浅比较 equalityFn，或分别订阅 a 和 b。

## 关联（双向打通）

- **依赖 ↓**：[全局状态方案](./global-state-solutions.md)、[01-4 重渲染控制](../01-4-rendering/re-render-control.md)
- **属于 ↑**：[01-5 状态管理](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 派生状态与单一数据源 → [单向数据流](./unidirectional-flow.md)
  - 重渲染优化 → [01-4 渲染机制](../01-4-rendering/README.md)
