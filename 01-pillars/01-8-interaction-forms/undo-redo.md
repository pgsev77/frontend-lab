# 撤销与重做（Undo / Redo）

> "撤销"是用户的安全网——做错了能退回去。编辑器、绘图、表单都离不开它。这篇讲撤销重做的两种实现模型，以及为什么不可变数据让它变简单。

## 是什么

撤销/重做（Undo/Redo）指**让用户回退或恢复之前的操作**。两种实现模型：

| 模型 | 思路 | 适合 |
|---|---|---|
| **命令模式（Command）** | 把每个操作封装成可执行+可撤销的对象 | 操作种类明确（编辑器、绘图） |
| **状态快照（Snapshot）** | 存历史状态的拷贝，撤销=回到上个快照 | 状态整体、操作复杂 |

一句话边界：**撤销的本质是"记住过去，能回去"。** 命令模式记"操作"，快照模式记"状态"。

## 为什么：撤销是体验的安全感

回到 [前端的本质](../../00-foundation/frontend-essence.md)——用户行为不可预测、会犯错。没有撤销，用户不敢大胆操作（怕改错回不去）；有撤销，用户敢探索，体验更放松。撤销是"容错"的用户体验体现。

> 这也是为什么 [乐观更新](../01-6-data-fetching/optimistic-update.md) 的"失败回滚"本质就是一种撤销——让用户的错误操作能退回。

## 怎么用：两种模型

### 1. 命令模式（操作可逆）
把每个操作封装成带 `execute`（执行）和 `undo`（撤销）的对象：
```
class InsertText {
  execute(doc) { doc.text += this.text; 记录位置 }
  undo(doc) { 删掉插入的文本 }
}
class DeleteText {
  execute(doc) { 记录被删的文本和位置; 删除 }
  undo(doc) { 把删掉的文本插回原位置 }
}
// 操作历史栈
const undoStack = []   // 已执行的操作
const redoStack = []   // 被撤销的操作（用于重做）
function doCommand(cmd) { cmd.execute(); undoStack.push(cmd); redoStack.clear() }
function undo() { const cmd = undoStack.pop(); cmd.undo(); redoStack.push(cmd) }
function redo() { const cmd = redoStack.pop(); cmd.execute(); undoStack.push(cmd) }
```
- **优点**：内存高效（只存操作，不存整个状态）。
- **代价**：每个操作都要写 undo 逻辑，复杂。
- **适合**：操作种类明确、状态大的场景（富文本编辑器、绘图）。

### 2. 状态快照模式（存历史状态）
每次操作前存一份状态拷贝，撤销=回到上个快照：
```
const history = [initialState]   // 状态历史
let current = 0                   // 当前指向哪个快照
function setState(newState) {
  history.length = current + 1    // 丢弃 redo 部分（新操作覆盖了）
  history.push(newState)
  current++
}
function undo() { if (current > 0) current--; 恢复 history[current] }
function redo() { if (current < history.length-1) current++; 恢复 history[current] }
```
- **优点**：简单通用（不用为每个操作写 undo）。
- **代价**：内存（存多个状态拷贝）。
- **适合**：状态不大、操作难以分解为命令的场景（简单表单、配置）。

### 不可变数据让快照变简单 ★
如果状态是**不可变**的（呼应 [01-4 不可变性](../01-4-rendering/re-render-control.md)），快照就是"存旧引用"——因为旧状态对象不会被修改，存它的引用即可，撤销时直接用。这让快照模式既简单又高效（结构共享，不用深拷贝）。

### redo 的清空规则
**新操作会清空 redo 栈**：用户撤销了 3 步，然后做了新操作，之前的 3 步 redo 就废弃了（因为新操作产生了新的时间线）。这是撤销重做的通用规则。

## 常见坑

- ❌ **可变状态做快照**：存的是引用，状态被后续修改污染，撤销回到错误状态。
  - ✅ 正例：状态不可变，或快照时深拷贝。
- ❌ **忘了清空 redo 栈**：撤销后做新操作，旧 redo 没清，导致 redo 到错误状态。
- ❌ **操作粒度不当**：每个字符一个撤销步，用户撤销要点 50 次。应合并连续操作为一个撤销步。
- ❌ **协同场景的撤销难题**：多用户同时编辑，"撤销我的操作"可能影响别人的。需操作转换（OT）/CRDT，进阶见 [02 复杂交互](../../02-advanced/README.md)。

## 关联（双向打通）

- **依赖 ↓**：[01-4 不可变性](../01-4-rendering/re-render-control.md)、[01-5 状态管理](../01-5-state-management/README.md)
- **属于 ↑**：[01-8 交互与表单](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 乐观更新的回滚是撤销 → [01-6 乐观更新](../01-6-data-fetching/optimistic-update.md)
  - 不可变数据 → [01-4 重渲染控制](../01-4-rendering/re-render-control.md)
  - 协同编辑的撤销 → [02 复杂交互](../../02-advanced/README.md)
