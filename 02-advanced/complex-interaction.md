# 复杂交互模式（Complex Interaction Patterns）

> 拖拽、虚拟列表、撤销重做、富文本、协同编辑——这些"高难度交互"超出了 [01-8 基础交互](../01-pillars/01-8-interaction-forms/README.md) 的范畴。它们各有难点，这篇梳理它们的实现思路与共性挑战。

## 是什么

复杂交互模式指**超出常规点击/输入/表单的高难度交互**：拖拽、虚拟列表、富文本编辑、撤销重做、协同编辑。

一句话边界：**这些交互的共性是"状态复杂、性能敏感、边界多"**——基础组件库往往不够，需专门方案。

## 怎么用：各模式要点

### 1. 虚拟列表（海量数据）
渲染上万行，只渲染可见的几十行。详见 [性能极致优化](./performance-extreme.md)。难点：滚动定位、动态高度、键盘可达。

### 2. 拖拽（Drag & Drop）
- **HTML5 DnD API**：原生拖拽，但 API 怪异、移动端支持差。
- **自定义拖拽**：基于 Pointer Events（[01-8 手势](../01-pillars/01-8-interaction-forms/gestures-pointers.md)）+ setPointerCapture 自己实现，更可控、跨设备。
- **库**：dnd-kit（现代、无障碍、灵活）、react-beautiful-dnd（停止维护）。
- **难点**：拖拽时的视觉反馈、放置目标判定、排序算法、键盘可达（a11y——拖拽不能只靠鼠标）。

### 3. 撤销重做（Undo/Redo）
命令模式或状态快照。详见 [01-8 撤销重做](../01-pillars/01-8-interaction-forms/undo-redo.md)。难点：操作粒度、协同场景下的撤销。

### 4. 富文本编辑器 ★ 最难
基于 `contenteditable` 的编辑器是前端最复杂的领域之一：
- **contenteditable 的坑**：浏览器对 contenteditable 的行为不一致，光标/选区/复制粘贴/换行各浏览器表现不同。
- **思路**：不用原生 contenteditable 的"自由编辑"，而是把文档抽象成**数据模型**（如 ProseMirror 的文档树），编辑操作转成对模型的修改，再渲染成 DOM。即"数据驱动编辑"。
- **库**：ProseMirror（强大复杂）/ TipTap（ProseMirror 封装，易用）/ Slate（React 友好）/ Lexical（Meta 出品）。
- **难点**：选区/光标管理、复制粘贴净化、协同编辑、复杂格式嵌套。

### 5. 协同编辑（最复杂）★
多人同时编辑同一文档（如 Google Docs、Figma）。核心难题：**一致性**——A 和 B 同时改同一处，怎么合并不冲突不丢数据。

两种主流方案：
- **OT（Operational Transformation，操作转换）**：每个编辑是"操作"，服务器对并发操作做"转换"使它们不冲突。算法复杂（需中心化服务器）。Google Docs 用此。
- **CRDT（Conflict-free Replicated Data Type，无冲突复制数据类型）**：数据结构本身设计成"任何合并顺序结果一致"，去中心化、可离线。Yjs/Automerge 是实现。新兴方向。

> 协同编辑的难度在于"并发 + 网络 + 一致性"三者交织。OT 需中心服务器，CRDT 去中心化但实现复杂。多数新项目选 CRDT（Yjs）。

呼应当前[01-8 实时交互](../01-pillars/01-8-interaction-forms/realtime-interaction.md)（WebSocket 传输操作）和 [01-8 撤销重做](../01-pillars/01-8-interaction-forms/undo-redo.md)（协同下的撤销更难）。

## 共性挑战

| 挑战 | 应对 |
|---|---|
| 状态复杂 | 用 [状态机](../01-pillars/01-5-state-management/state-machine.md) / 不可变数据 |
| 性能敏感 | 虚拟化、Worker、rAF、避免重排 |
| 边界多 | 充分测试边界（空/极值/并发） |
| 可访问性 | 拖拽/编辑要支持键盘操作 |

## 常见坑

- ❌ **手撸富文本编辑器**：contenteditable 的坑深不见底，用成熟库（ProseMirror/TipTap/Slate）。
- ❌ **协同编辑自己造一致性算法**：OT/CRDT 极复杂，用 Yjs/Automerge 等。
- ❌ **拖拽忽视 a11y**：只鼠标能拖，键盘用户用不了。
- ❌ **复杂交互无撤销**：用户误操作无法恢复，体验差。

## 关联（双向打通）

- **依赖 ↓**：[01-8 交互与表单](../01-pillars/01-8-interaction-forms/README.md)、[性能极致优化（虚拟列表/Worker）](./performance-extreme.md)
- **属于 ↑**：[02 前端进阶](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 撤销重做 → [01-8 撤销重做](../01-pillars/01-8-interaction-forms/undo-redo.md)
  - 手势与拖拽基础 → [01-8 手势与指针](../01-pillars/01-8-interaction-forms/gestures-pointers.md)
  - 协同的实时通信 → [01-8 实时交互](../01-pillars/01-8-interaction-forms/realtime-interaction.md)
