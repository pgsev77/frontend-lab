# 组件 API 设计（Component API Design）

> 组件的"内部实现"是写给自己看的，但"API（props）"是写给所有调用方看的。一个好的 API 让组件好用、难用错；一个坏的 API 让调用方反复查文档、频繁踩坑。这篇是写给"组件库作者"和"团队内公共组件维护者"的。

## 是什么

组件 API 指组件对外暴露的 **props 接口**——它定义了"调用方能传什么、组件会怎样表现"。好的 API 设计让组件**正交、可预测、难用错**。

一句话边界：**API 设计 = 设计调用方的体验**。你不是在设计组件，你是在设计"别人怎么用你的组件"。

## 为什么：坏 API 的代价

一个坏 API 会持续产生成本：每个调用方都要查文档、猜参数、踩坑。而坏 API 一旦发布、被很多人用，就**很难改**（向后兼容负担）。所以 API 设计要在"第一次发布前"想清楚。

### 坏 API 的典型症状
- **prop 蔓延**：30 个 props，调用方不知道该设哪些。
- **魔法值**：`mode="1"` 是什么意思？没人记得住。
- **隐式耦合**：设了 A 就必须设 B，否则崩溃，但文档没说。
- **控制不住**：想改组件内部行为却没接口，只能 fork。

## 怎么用：API 设计原则

### 1. 少而正交（最小完备）
- 每个 prop 只控制一个维度，**props 之间正交**（互不依赖）。
- 提供合理的默认值，让"不传也能用"。
```
❌ <Button type="primary-large-rounded" />   // 一个 prop 塞三个维度
✅ <Button variant="primary" size="lg" rounded />  // 三个正交的 prop
```

### 2. 用语义化的枚举，不用魔法值
```
❌ <Dialog mode={1} />              // 1 是啥？
✅ <Dialog role="alert" />          // 语义清晰，IDE 有提示
```

### 3. 受控/非受控双模式（降低使用门槛）
让组件既支持受控（传 `value`）也支持非受控（传 `defaultValue`）。详见 [受控 vs 非受控](./controlled-uncontrolled.md)。这样简单场景用户不用管状态，复杂场景又能完全控制。

### 4. 组合优于配置（提供插槽而非堆 prop）
```
❌ <Card title="x" subtitle="y" icon="z" action="w" />  // prop 越堆越多
✅ <Card>
     <Card.Header><Icon/></Card.Header>
     <Card.Body>...</Card.Body>
     <Card.Footer><Button/></Card.Footer>
   </Card>
```
用复合组件（children/插槽）让调用方自由组合，而不是无限增加配置 prop。呼应 [组合优于继承](./composition-over-inheritance.md)。

### 5. 透传"逃生舱"（escape hatch）
不要把组件封死。允许调用方透传原生属性（`className`、`style`、`onClick`、`...rest`），让他们能覆盖你的默认行为。**封死的组件一定会被 fork**。

### 6. 命名一致
- 布尔用 `disabled`/`loading`/`visible`，别忽 `open` 忽 `show`。
- 回调用 `onXxx`（`onChange`/`onClose`），处理器用 `handleXxx`。
- 整个库内保持同一套命名约定。

## 常见坑

- ❌ **配置型 API 膨胀**：为每个变体加 prop，最终 `type/size/variant/color/shape/border/shadow...` 几十个。
  - ✅ 正例：用组合（插槽/复合组件）代替无限配置。
- ❌ **没有默认值**：调用方必须传满所有 prop 才能用，门槛过高。
- ❌ **API 太宽**：暴露内部实现细节作为 prop，后续重构受限（内部一改，API 就破）。
  - ✅ 正例：API 只暴露"稳定的语义意图"，实现细节藏在内部。
- ❌ **破坏性变更随意发**：改个 prop 名导致所有调用方崩。
  - ✅ 正例：公共组件 API 视为契约，变更要走弃用-迁移流程（呼应 [03 工程实践](../../03-engineering/README.md)）。

## 关联（双向打通）

- **依赖 ↓**：[组件模型](./component-model.md)（props 是 API 的载体）、[受控 vs 非受控](./controlled-uncontrolled.md)
- **属于 ↑**：[01-2 组件化与复用](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 复合组件提供灵活 API → [组件分类](./component-classification.md)
  - 组件库的一致性靠设计系统 → [设计系统](./design-system.md)
  - API 是契约，变更需规范 → [03 工程实践](../../03-engineering/README.md)
