# 受控 vs 非受控（Controlled vs Uncontrolled）

> "这个输入框的值，谁说了算？"——这是设计组件 API 时最核心的决策之一。受控与非受控决定了状态归属，进而决定组件的可组合性和可测试性。

## 是什么

一个组件内部有"状态"时，这个状态可以由两种方式管理：

| 模式 | 谁持有状态 | 数据流 |
|---|---|---|
| **受控（Controlled）** | 父组件（外部）持有，通过 props 传入 | 父是唯一数据源，子组件纯展示+上报变化 |
| **非受控（Uncontrolled）** | 组件自己持有（内部 state / DOM） | 组件自管，父组件通过 ref 来读取 |

一句话边界：**受控 = 状态在外部（"我说啥你显示啥"），非受控 = 状态在内部（"我自己管，想知道就问我"）。**

### 经典例子：输入框
```
// 受控：value 由父组件的 state 控制
function Form() {
  const [name, setName] = useState('')
  return <input value={name} onChange={e => setName(e.target.value)} />
}

// 非受控：input 自己管值，用 ref 读
function Form() {
  const inputRef = useRef()
  return <input defaultValue="" ref={inputRef} />
  // 提交时读 inputRef.current.value
}
```

## 为什么：两种模式各解决什么

### 受控的优势
- **单一数据源**：状态在父组件，整个数据流可追踪（呼应 [01-5 单向数据流](../01-5-state-management/README.md)）。
- **可派生/可校验**：父组件拿到值后，可以实时校验、格式化、联动其他字段。
- **可测试**：传 props 即可控制组件行为，测试简单。

### 受控的代价
- 每次按键都触发父组件 state 更新 → 整个表单可能重渲染。大表单会有性能问题。
- 父组件要维护所有字段的 state，样板代码多。

### 非受控的优势
- **性能好**：组件内部管理，不触发父组件更新。
- **简单**：不关心中间值，只在提交时读取，适合简单表单。

### 非受控的代价
- 数据流不透明，难实时校验/联动。
- 父组件无法"强制"设置子组件的值（要靠 ref 命令式操作，违背声明式）。

## 怎么用：怎么选

| 场景 | 推荐 | 原因 |
|---|---|---|
| 单字段输入（搜索框、用户名） | 受控 | 需要实时校验/联动 |
| 大表单（几十个字段） | 非受控 + 表单库 | 性能 + 减少样板，交给 React Hook Form 等 |
| 只在提交时读值 | 非受控 | 简单，无需实时同步 |
| 需要外部强制重置值（如"清空"按钮） | 受控 | 非受控难做到 |

> 现代实践：**简单场景受控，复杂表单用非受控表单库**（如 React Hook Form 内部非受控，但提供受控般的 API）。详见 [01-8 交互与表单](../01-8-interaction-forms/README.md)。

### 进阶：双模式 API（同时支持两种）
成熟的组件库常让组件**同时支持受控和非受控**：传了 `value` 就受控，不传就用内部默认。这降低了使用门槛，但实现要处理好"控制权切换"，见 [组件 API 设计](./component-api.md)。

```
// 双模式伪代码
function Switch({ checked, defaultChecked, onChange }) {
  const [internal, setInternal] = useState(defaultChecked)
  const isControlled = checked !== undefined   // 传了 value 就是受控
  const value = isControlled ? checked : internal
  // onChange 时：受控模式只上报，非受控模式自己更新
}
```

## 常见坑

- ❌ **受控组件不写 onChange**：`value` 锁死了值却不变，输入框变成只读。
  - ✅ 正例：受控必须配 `onChange` 更新 state，否则用 `defaultValue`（非受控）。
- ❌ **受控/非受控中途切换**：组件生命周期内切换控制权，导致状态错乱。
  - ✅ 正例：控制权在挂载时确定，之后不变（双模式 API 的标准实现）。
- ❌ **大表单全用受控**：每个按键触发整表重渲染，输入卡顿。
  - ✅ 正例：大表单用非受控表单库，或把每个字段的状态下沉到字段组件内部。

## 关联（双向打通）

- **依赖 ↓**：[组件模型](./component-model.md)（props/state 的归属）、[01-5 状态管理](../01-5-state-management/README.md)
- **属于 ↑**：[01-2 组件化与复用](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 表单是受控/非受控的主战场 → [01-8 交互与表单](../01-8-interaction-forms/README.md)
  - 双模式 API 的实现 → [组件 API 设计](./component-api.md)
  - 受控呼应单向数据流 → [01-5 状态管理](../01-5-state-management/README.md)
