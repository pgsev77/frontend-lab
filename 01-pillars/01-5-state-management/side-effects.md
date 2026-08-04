# 副作用管理（Side Effects Management）

> 状态变化的"副作用"——发请求、改 URL、写日志——是前端最容易写乱的地方。useEffect 的依赖数组、清理函数、竞态，是 React 开发者的集体痛点。这篇讲清"副作用该放哪、怎么管"。

## 是什么

副作用（Side Effect）指**状态/渲染之外的操作**：发起网络请求、操作 DOM、订阅事件、写存储、改 URL。它们不参与"状态→视图"的纯计算，是"对外部世界的动作"。

一句话边界：**渲染（纯计算）只管"算出 UI"，副作用管"和外部世界交互"。** 两者必须分离——纯函数渲染保证可预测，副作用集中管理保证可控。

## 为什么：副作用为什么难

### 难点 1：时机
副作用"什么时候执行"很微妙：组件挂载时、状态更新时、卸载时。React 的 useEffect 把副作用挂在渲染之后，但它的依赖数组决定了"什么时候重跑"，极易写错。

### 难点 2：竞态与清理
副作用常涉及异步（请求）和订阅（事件监听）。组件卸载时请求才回来、订阅没清理，就会导致**更新已卸载组件**、内存泄漏、数据错乱。呼应 [01-6 竞态处理](../01-6-data-fetching/README.md)。

### 难点 3：与渲染的边界
副作用如果写在渲染过程中（组件函数体），每次渲染都执行，导致混乱。必须隔离到渲染之外。

## 怎么用：useEffect 的正确姿势

### 副作用放 effect，别放渲染体
```
function Component({ userId }) {
  const [user, setUser] = useState(null)
  // ❌ 不能在渲染体里直接发请求：每次渲染都发
  // fetch('/api/' + userId).then(setUser)

  // ✅ 放 effect，按依赖执行
  useEffect(() => {
    fetch('/api/' + userId).then(setUser)
  }, [userId])   // 只在 userId 变化时重跑
  return <div>{user?.name}</div>
}
```

### 依赖数组 ★ 最易错
useEffect 的第二个参数决定重跑时机：
- `[]`：只在挂载时跑一次。
- `[dep]`：dep 变化时重跑。
- 不写：每次渲染都跑（几乎总是错的）。

**关键纪律**：依赖数组必须包含 effect 里用到的所有外部变量（props/state），否则用到的是过时值（stale closure）。

```
❌ 漏依赖：用了 count 但没列入，effect 用的是旧的 count
useEffect(() => { document.title = `Count: ${count}` }, [])

✅ 列全依赖
useEffect(() => { document.title = `Count: ${count}` }, [count])
```

### 清理函数（cleanup）防泄漏 ★
涉及订阅/异步的 effect，**必须返回清理函数**：
```
useEffect(() => {
  const handler = (e) => { ... }
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)  // ★ 卸载/重跑前清理
}, [])
```
不清理 → 组件卸载后监听器还在 → 内存泄漏 + 操作已卸载组件报错。

### 副作用的位置选择
不是所有副作用都该放 useEffect：
- **数据获取** → 用 Query 库（[01-6](../01-6-data-fetching/README.md)），别手撸 effect（竞态/缓存/重试太难搞）。
- **订阅事件** → useEffect + 清理。
- **派生状态** → 用 useMemo 计算，不是副作用。
- **改 state** → 在事件处理函数里改，别用 effect 链式同步（容易死循环）。

> 经验法则：**能用别的方式解决，就别用 useEffect**。effect 是"逃生舱"，不是万能工具。数据获取交给 Query 库，派生交给 useMemo，状态同步交给事件处理。

## 常见坑

- ❌ **依赖数组写 `[]` 但用了 props/state**：用到的是初始值，永远不更新（stale closure）。
- ❌ **effect 里链式 setState**：A 的 effect 改 B，B 的 effect 改 A，死循环。
  - ✅ 正例：状态同步用事件处理或派生，不用 effect 链。
- ❌ **不写清理函数**：订阅/定时器泄漏。
- ❌ **用 effect 做数据获取**：手撸竞态/缓存/重试，bug 不断。
  - ✅ 正例：交给 TanStack Query，它专门解决这些。

## 关联（双向打通）

- **依赖 ↓**：[01-4 渲染机制](../01-4-rendering/rendering-scheduling.md)（effect 在 commit 阶段后跑）、[单向数据流](./unidirectional-flow.md)
- **属于 ↑**：[01-5 状态管理](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 数据获取副作用 → [01-6 数据获取](../01-6-data-fetching/README.md)
  - 副作用与并发渲染 → [01-4 渲染调度](../01-4-rendering/rendering-scheduling.md)
