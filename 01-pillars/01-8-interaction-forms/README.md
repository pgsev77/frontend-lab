# 01-8 · 交互与表单

> **轴属：两轴交汇**。这是视图轴和状态轴的交汇点——用户操作改状态（状态轴），状态变触发视图更新（视图轴），视图给用户反馈。本支柱回答"用户操作怎么变成状态变化、表单怎么管、交互反馈怎么做"。

## 本支柱解决什么问题
交互是前端区别于静态页面的根本。本支柱回答：**事件系统怎么工作、表单状态怎么管（受控/非受控）、交互反馈怎么做（防抖节流/撤销）、手势指针怎么处理**。这是 [两条主轴交汇](../../00-foundation/two-axes.md) 的完整闭环。

## 详细大纲（→ 待填充原子笔记内容）

### 1. 事件系统（Event System）
- DOM 事件流：捕获 → 目标 → 冒泡
- 事件委托（Event Delegation）：利用冒泡，父元素统一处理
- 合成事件（Synthetic Event）：React/Vue 为什么包装原生事件
- 事件委托与合成事件的关系（React 17+ 的根节点委托）
- 阻止冒泡/默认行为（stopPropagation / preventDefault 的正确用法）

### 2. 表单状态（Form State）
- 受控表单：每个字段由状态驱动（`value` + `onChange`）
- 非受控表单：DOM 自管，ref 取值
- 何时用受控/非受控（单字段 vs 整表单）
- 表单状态库（React Hook Form / Formik / vee-validate）：为什么不用手撸
- 表单的初始值、默认值、重置

### 3. 表单校验（Validation）
- 校验时机（onChange / onBlur / onSubmit）
- 同步校验（必填/格式/长度）vs 异步校验（唯一性/服务端校验）
- 校验与错误展示（字段级 vs 表单级）
- 校验 schema（Zod / Yup / Valibot）的统一描述

### 4. 交互反馈（Interaction Feedback）
- 防抖（debounce）：连续触发只执行最后一次（搜索框）
- 节流（throttle）：固定频率执行（滚动/resize）
- requestAnimationFrame：动画与高频更新的正确节拍
- 即时反馈（按钮 loading、点击波纹、过渡动画）
- → 防抖节流是应对 [复杂度来源 2（异步/用户行为）](../../00-foundation/complexity-sources.md) 的工具

### 5. 撤销与重做（Undo / Redo）
- 命令模式：把每次操作封装成可撤销的命令
- 状态快照（snapshot）/ 状态历史栈
- 不可变数据让撤销变得简单
- 协同编辑的撤销难题（操作转换 OT / CRDT，进阶见 02）

### 6. 手势与指针（Gesture & Pointer）
- 鼠标事件 vs 触摸事件 vs 指针事件（Pointer Events 统一）
- 手势识别（滑动/长按/双击/捏合缩放）
- 滑动与拖拽（drag & drop / 自定义滑动）
- 触摸的事件顺序坑（300ms 延迟、passive 事件）

### 7. 实时交互（Realtime Interaction）
- WebSocket：双向实时通信
- SSE（Server-Sent Events）：单向推送
- 轮询（polling）vs 长连接的选型
- 实时数据如何更新前端缓存（→ 配合 01-6）
- 连接管理（重连、心跳、断线检测）

### 8. 焦点与键盘交互
- 焦点管理（focus/blur、tabindex、focus trap）
- 键盘可达性（所有操作应能用键盘完成）
- 模态框/抽屉的焦点陷阱
- → 完整可达性见 [01-10](../01-10-accessibility-multiplatform/README.md)

## 学完应能回答
- 事件冒泡和事件委托是什么？合成事件为什么存在？
- 受控表单和非受控表单的区别？什么时候用哪种？
- 防抖和节流的区别？分别适合什么场景？
- 撤销重做怎么实现？为什么不可变数据有帮助？
- Pointer Events 为什么比 mouse/touch 事件好？
- WebSocket 和 SSE 各适合什么场景？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 两轴交汇
- **依赖 ↓**：[01-4 渲染机制](../01-4-rendering/README.md)（状态变触发渲染）、[01-5 状态管理](../01-5-state-management/README.md)（交互改状态）
- **相关 →**：[01-6 数据获取](../01-6-data-fetching/README.md)（实时数据/竞态）、[01-10 可访问性](../01-10-accessibility-multiplatform/README.md)（键盘/焦点）、[01-9 性能](../01-9-performance-ux/README.md)（防抖节流/动画性能）
