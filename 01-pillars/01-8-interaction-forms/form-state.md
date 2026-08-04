# 表单状态（Form State）

> 表单是前端最复杂的交互之一——几十个字段、实时校验、动态联动、提交处理。表单状态怎么管（受控/非受控），决定了表单是"好写"还是"噩梦"。这篇是 [01-2 受控 vs 非受控](../01-2-componentization/controlled-uncontrolled.md) 在表单场景的深化。

## 是什么

表单状态指**表单字段值的管理方式**。两种模式（呼应 [01-2](../01-2-componentization/controlled-uncontrolled.md)）：

| 模式 | 状态在哪 | 特点 |
|---|---|---|
| **受控表单** | 父组件 state 持有，`value`+`onChange` 驱动 | 实时校验/联动方便 |
| **非受控表单** | DOM 自管，ref 读取 | 性能好，简单 |

一句话边界：**受控 = 状态在外，每次输入都同步；非受控 = DOM 自管，提交时才读。**

## 为什么：表单的特殊复杂性

表单比普通交互复杂，因为它要同时处理：
- **字段值**：每个输入框的当前值。
- **校验**：实时或提交时校验。
- **联动**：A 字段变，B 字段的选项/可见性跟着变。
- **错误显示**：每个字段的错误信息。
- **提交状态**：提交中/成功/失败。

这些交织在一起，状态管理不当极易失控。

## 怎么用：三种方案

### 1. 受控表单（简单场景）
```
function SimpleForm() {
  const [name, setName] = useState('')
  return <input value={name} onChange={e => setName(e.target.value)} />
}
```
- **优点**：值实时可见，易做即时校验/联动。
- **代价**：每次按键触发 state 更新，**大表单会触发整表重渲染**，输入卡顿。

### 2. 非受控表单（简单只读场景）
```
function UncontrolledForm() {
  const ref = useRef()
  return <input defaultValue="" ref={ref} />   // 不控制 value
  // 提交时读：ref.current.value
}
```
- **优点**：DOM 自管，不触发 React 重渲染，性能好。
- **适合**：只在提交时读值、无需实时校验/联动的简单表单。

### 3. 表单库（复杂表单）★ 推荐
大表单既想要受控的"实时校验/联动"，又想要非受控的"性能"，怎么办？用表单库（React Hook Form / Formik），它**内部非受控（不触发 React 重渲染），对外提供受控般的 API**：
```
// React Hook Form：内部非受控，性能好；API 简洁
const { register, handleSubmit, formState: { errors } } = useForm()
return (
  <form onSubmit={handleSubmit(data => submit(data))}>
    <input {...register('name', { required: '必填' })} />   {/* 注册字段，非受控 */}
    {errors.name && <span>{errors.name.message}</span>}
  </form>
)
```
**为什么表单库用非受控**：把字段值存在库的内部 ref 里，不进 React state，**输入时不触发重渲染**——这是大表单性能的关键。但库提供 `watch`/`errors` 等让你按需订阅，达到"受控般的体验"。

> 选择：**单字段简单场景受控；几十字段的大表单用表单库**。手撸受控大表单是性能和样板的双重噩梦。详见 [01-2 受控 vs 非受控](../01-2-componentization/controlled-uncontrolled.md)。

### 表单的初始值与重置
- **初始值**：受控用 state 初始值；非受控用 `defaultValue`。
- **重置**：受控改 state；表单库有 `reset()` API。注意重置要清掉校验错误状态，不只清值。

## 常见坑

- ❌ **大表单全受控**：每个按键触发整表重渲染，输入卡顿。
  - ✅ 正例：大表单用非受控表单库。
- ❌ **受控不写 onChange**：value 锁死，输入框变只读。
- ❌ **校验状态和值状态纠缠**：字段值、错误信息、是否触碰过……分散在多个 state，同步噩梦。
  - ✅ 正例：用表单库统一管理，或用 [状态机](../01-5-state-management/state-machine.md) 组织。
- ❌ **重置只清值不清错误**：清空输入后旧的错误提示还挂着。

## 关联（双向打通）

- **依赖 ↓**：[01-2 受控 vs 非受控](../01-2-componentization/controlled-uncontrolled.md)、[事件系统](./event-system.md)
- **属于 ↑**：[01-8 交互与表单](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 表单校验 → [表单校验](./form-validation.md)
  - 表单状态的组织 → [01-5 状态机](../01-5-state-management/state-machine.md)
