# 运行时性能（Runtime Performance）

> 首屏加载完，不等于性能问题结束。用户用着用着卡顿——滚动掉帧、输入延迟、越来越慢——这是运行时性能。它关乎"持续流畅"，是交互体验的根基。

## 是什么

运行时性能指**页面加载完成后，持续使用过程中的流畅度**。与加载性能（首次下载）相对，它关注的是**主线程在运行中是否被阻塞**。

一句话边界：**加载性能管"快进得来"，运行时性能管"用着不卡"。** 两者瓶颈不同：加载靠减传输，运行时靠减计算。

## 为什么：运行时卡顿的根源

浏览器主线程既要执行 JS、又要做布局计算、又要响应用户输入。**任何一项占满主线程，其他就得排队等待**——用户就感觉"卡"。三大根源：

### 1. 长任务（Long Task）★
执行超过 50ms 的 JS 任务。期间主线程被占，用户输入（点击、滚动）得不到响应。
- 典型：一次处理上万条数据、复杂计算、同步的巨型渲染。
- 50ms 的阈值来自"要让用户感觉即时响应，主线程每 50ms 要有空隙"。

### 2. 无谓重渲染
React 等框架，父组件渲染时子组件跟着重渲染（即使 props 没变），或大列表全量重渲染。详见 [01-4 重渲染控制](../01-4-rendering/re-render-control.md)。这是 React 应用运行时卡顿的头号来源。

### 3. 内存泄漏
组件卸载了，但定时器/监听器/闭包引用没清理，对象无法回收。内存随时间增长，GC 越来越频繁（GC 也会卡主线程），最终崩溃。
```
useEffect(() => {
  const t = setInterval(...)
  return () => clearInterval(t)   // ★ 不清理就泄漏
}, [])
```

## 怎么用：四类优化

### 1. 拆解长任务
- **分片处理大数据**：上万条数据别一次处理，用 `requestIdleCallback` 或分批 setTimeout 分片。
- **Web Worker**：把重计算移到 Worker 线程，不阻塞主线程（[02 极致性能](../../02-advanced/README.md)）。
- **虚拟列表**：上万条只渲染可见的几十条（[02 复杂交互](../../02-advanced/README.md)）。

### 2. 消除无谓重渲染（React）
- `React.memo` + 稳定的 props 引用（[01-4 重渲染控制](../01-4-rendering/re-render-control.md)）。
- selector 精确订阅状态（[01-5 状态订阅](../01-5-state-management/state-subscription.md)）。
- key 稳定（[01-4 虚拟 DOM](../01-4-rendering/virtual-dom.md)）。

### 3. 防抖节流降频
高频事件（滚动、输入、拖拽）用防抖节流降频，避免每像素/每字符都触发重计算（[01-8 交互反馈](../01-8-interaction-forms/interaction-feedback.md)）。

### 4. 检测内存泄漏
- Chrome DevTools Performance/Memory 面板：看堆内存是否持续增长。
- 关注：未清理的监听器、定时器、闭包持有已卸载组件引用、全局缓存只增不减。

## 常见坑

- ❌ **同步处理大数据**：一次渲染上万行，主线程卡死几百毫秒。
  - ✅ 正例：虚拟列表 + 分片。
- ❌ **不 memo 导致无谓重渲染**：每次输入整页重渲染。
- ❌ **effect 不清理**：监听器/定时器泄漏，越用越卡。
- ❌ **高频事件不降频**：滚动每像素触发重计算。
- ❌ **改触发重排的属性做动画**：动画 width/top，每帧重排。用 transform（[01-3 动画](../01-3-styling/animation-transition.md)）。

## 关联（双向打通）

- **依赖 ↓**：[01-4 重渲染控制](../01-4-rendering/re-render-control.md)、[01-4 从状态到像素](../01-4-rendering/state-to-pixel.md)
- **属于 ↑**：[01-9 性能与体验](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 重渲染优化 → [01-4 重渲染控制](../01-4-rendering/re-render-control.md)
  - 动画性能 → [动画性能](./animation-performance.md)
  - 事件降频 → [01-8 交互反馈](../01-8-interaction-forms/interaction-feedback.md)
  - 虚拟列表/Web Worker → [02 极致性能](../../02-advanced/README.md)
