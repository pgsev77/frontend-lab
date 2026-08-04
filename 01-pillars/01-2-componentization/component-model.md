# 组件模型（Component Model）

> 组件是现代前端的**基本组织单元**——把界面拆成可独立、可复用的小块。这篇定义"组件到底是什么"，是 [01-2 组件化](./README.md) 的起点，也是整个视图轴"怎么组织"的根基。

## 是什么

组件（Component）是界面上一块**可独立、可复用、可组合**的单元。它接收**输入（props）**，产出**视图（UI）**，像函数一样：

```
组件 = f(props) → UI
```

一句话边界：**组件是"带状态的视图函数"**。它把"一块界面怎么显示"封装成一个可调用的单元，调用方只管传 props，不管它内部怎么渲染。

### 组件的三个要素
| 要素 | 说明 |
|---|---|
| **props** | 外部传入的输入，只读。父组件传给子组件，决定它"长什么样" |
| **state**（可选） | 组件自管的内部状态，可变。组件自己的私事，外部不直接干预 |
| **render/视图** | 根据 props + state 计算出的 UI 输出 |

## 为什么：为什么需要组件

回到 [前端的本质](../../00-foundation/frontend-essence.md) 差异 5——前端的复杂度在"规模化的视图组织"。如果整个页面写在一个文件、一个函数里，几百上千行混杂，无法维护。组件解决三个问题：

### 1. 分而治之
把一个复杂页面拆成小组件树：`页面 = Header + Sidebar + Content + Footer`，`Content = SearchBar + List + Pagination`……每个组件只管自己那块，复杂度被分解。

### 2. 复用
同一个按钮、卡片、表单项，写一次，到处用。改一处，所有用到的地方同步更新——这是复用的核心价值：**单一修改点**。

### 3. 关注点隔离
每个组件封装自己的"显示逻辑"，组件之间通过 props 这条"窄接口"通信，互不干涉内部。这和后端的"模块化"是同一个思想。

## 怎么用：props 与 children

### props——组件的输入接口
```
// 伪代码：组件接收 props，返回视图
function Button(props) {
  return <button class={props.variant}>{props.label}</button>
}
// 调用
<Button variant="primary" label="提交" />
```
- props 是**只读**的，子组件不能改自己收到的 props（要改就提升到 state，或回调通知父组件）。
- props 是父子通信的**单向**通道：父→子传数据，子→父通过回调 props（`onClick` 等）通知。

### children——组件的内容插槽
```
function Card(props) {
  return <div class="card">{props.children}</div>   // children 是包裹的内容
}
// 调用：children 是 Card 标签之间的内容
<Card>
  <h2>标题</h2>
  <p>内容</p>
</Card>
```
`children` 让组件变成"容器"——调用方决定里面放什么，组件只负责外壳。这是组合（而非继承）的基础，详见 [组合优于继承](./composition-over-inheritance.md)。

### 组件的边界：什么时候该拆
- ✅ **该拆**：这块 UI 在多处复用；这块有独立的职责（如 SearchBar 自管输入）；这块太大（超 200 行）。
- ❌ **不该拆**：只为一处使用、且逻辑简单，硬拆反而增加跳转成本（违反 [YAGNI](../../00-foundation/tradeoffs.md)）。

> 拆组件的判断标准不是"行数"，而是**职责单一** + **是否复用**。一个 300 行但职责单一的组件，比一个 50 行却混了三种职责的组件好。

## 常见坑

- ❌ **props 当数据管道乱传**：A→B→C→D 层层透传 props（prop drilling），中间组件被迫接收自己用不到的 props。
  - ✅ 正例：用状态提升或全局状态/Context 直达，详见 [01-5 状态管理](../01-5-state-management/README.md)。
- ❌ **在子组件里直接改 props**：破坏单向数据流，导致数据来源不可追踪。
  - ✅ 正例：props 只读；要变就提升为父组件的 state，通过回调改。
- ❌ **拆得太碎**：每个 `<div>` 都封成组件，导致组件爆炸、跳转地狱。
  - ✅ 正例：按职责和复用拆，不为拆而拆。
- ❌ **组件名含糊**：`<Box>`、`<View>`、`<Comp1>`——名字不表达职责。
  - ✅ 正例：名字说明"它是什么/干什么"，如 `<UserCard>`、`<SubmitButton>`。

## 关联（双向打通）

- **依赖 ↓**：[01-1 视图基础](../01-1-view-fundamentals/README.md)（DOM/HTML 是组件的底层）、[01-4 渲染机制](../01-4-rendering/README.md)（props/state 变触发渲染）
- **属于 ↑**：[01-2 组件化与复用](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - props 传递与组合模式 → [组合优于继承](./composition-over-inheritance.md)
  - props 驱动的受控/非受控 → [受控 vs 非受控](./controlled-uncontrolled.md)
  - 组件的复用边界 → [复用陷阱](./reuse-pitfalls.md)
