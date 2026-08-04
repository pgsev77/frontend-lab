# 组件分类（Component Classification）

> 组件多了就需要分类。合理的分类让职责清晰、复用更有层次。这篇讲三种经典分法，以及 Hooks 时代它们如何演变。

## 是什么

按职责把组件分类，最常见的三种视角：

| 分类 | 区分维度 | 典型 |
|---|---|---|
| **展示组件 vs 容器组件** | 管不管数据 | 纯 UI / 管数据获取与状态 |
| **复合组件（Compound）** | 多组件协作方式 | Select/Option、Tabs/Tab 通过 context 联动 |
| **自定义 Hook** | 把"逻辑"独立出来 | useUser、useForm（不是 UI，是可复用逻辑） |

## 为什么：为什么要分类

不分类的组件，职责混杂——一个组件既请求接口、又管状态、又做布局、又写样式，结果是**改一处动全身、无法复用**。分类的目的是**让每类组件只关心一件事**：

- 展示组件只管"怎么显示"——可被任意数据源复用。
- 容器组件只管"数据从哪来、状态怎么变"——把数据逻辑集中。
- 复合组件只管"几个部件怎么协作"——对外是一个整体，对内灵活。

## 怎么用

### 1. 展示组件 vs 容器组件
```
// 展示组件：纯函数，输入 props 输出 UI，不碰数据获取
function UserList({ users, onSelect }) {
  return <ul>{users.map(u => <li onClick={() => onSelect(u)}>{u.name}</li>)}</ul>
}

// 容器组件：管数据获取与状态，组合展示组件
function UserListContainer() {
  const [users, setUsers] = useState([])
  useEffect(() => { fetchUsers().then(setUsers) }, [])
  return <UserList users={users} onSelect={...} />
}
```
- **展示组件**：可复用、可测试（传 props 即可）、不依赖具体数据源。
- **容器组件**：隔离数据获取细节，展示组件不被数据层污染。

> **Hooks 时代的演变**：Hooks（如 `useUsers`）能替代容器组件的"数据获取"职责，所以现在常看到"容器组件 + 自定义 Hook"组合，而非传统的容器写满 fetch 逻辑。展示/容器的**思想**仍然有效（UI 与数据分离），只是实现更轻了。

### 2. 复合组件（Compound Components）★
当一个组件由多个**紧密协作的子部件**组成，且子部件间需要**隐式共享状态**，用复合组件模式：

```
// 用户只管组合，不用关心 Select 内部如何把 value 传给 Option
<Select value={v} onChange={setV}>
  <Option value="a">选项 A</Option>
  <Option value="b">选项 B</Option>
</Select>

// Tabs 同理
<Tabs>
  <TabList><Tab>标签1</Tab><Tab>标签2</Tab></TabList>
  <TabPanels><Panel>内容1</Panel><Panel>内容2</Panel></TabPanels>
</Tabs>
```
**实现关键**：父组件（Select/Tabs）通过 Context 把共享状态隐式传给后代（Option/Tab），后代无需逐层 props 透传。好处是 API **声明式且灵活**——用户自由组合子部件顺序，不用记一堆配置 prop。

> 这是 [组合优于继承](./composition-over-inheritance.md) 的高阶应用：部件通过 context 协作，而非继承。

### 3. 自定义 Hook——把"逻辑"也组件化
```
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn(!on)
  return [on, toggle]
}
// 任意组件复用这个"开关"逻辑
function Modal() { const [open, toggle] = useToggle(); ... }
```
Hook 不是 UI 组件，但它是"可复用的逻辑单元"，和组件一样服务于复用。它把传统容器组件里的"状态ful逻辑"独立出来，让 UI 和逻辑都能各自复用。

## 常见坑

- ❌ **过度套用展示/容器二分**：把每个小组件都强行分这两类，徒增层级。这种分类是**架构层的指导**，不是每个组件都要套。
- ❌ **展示组件里偷偷请求接口**：破坏"纯展示"约定，导致组件依赖具体数据源，无法复用。
  - ✅ 正例：数据获取放容器组件或 Hook，展示组件只接收 props。
- ❌ **复合组件不用 Context 用 prop 透传**：`<Select>` 把 value 一层层传给 `<Option>`，层级一深就乱。
  - ✅ 正例：用 Context 隐式共享状态。

## 关联（双向打通）

- **依赖 ↓**：[组件模型](./component-model.md)、[组合优于继承](./composition-over-inheritance.md)
- **属于 ↑**：[01-2 组件化与复用](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 容器组件与数据获取 → [01-6 数据获取](../01-6-data-fetching/README.md)
  - Hook 与状态管理 → [01-5 状态管理](../01-5-state-management/README.md)
  - 组件库的整体设计 → [设计系统](./design-system.md)
