# 性能极致优化（Extreme Performance）

> [01-9 性能与体验](../01-pillars/01-9-performance-ux/README.md) 讲了常规优化。当要求"更快"——首屏毫秒级、海量数据流畅、计算密集型不卡——就要上极致手段：SSR/预渲染、边缘计算、Web Worker、WASM、虚拟列表。

## 是什么

性能极致优化指**常规手段（分割/缓存/memo）之外的进阶优化**，针对极端性能需求：首屏极致、海量数据、CPU 密集。

一句话边界：**常规优化解决"够不够快"，极致优化追求"还能更快吗"。**

## 为什么：何时需要极致优化

常规优化后仍不达标的场景：
- **首屏极致**（如落地页要毫秒级）：SSR/SSG 还不够，要预渲染 + 边缘 CDN。
- **海量数据**（渲染上万/十万行）：常规渲染必卡，要虚拟列表。
- **CPU 密集**（图像处理、加密、大数据计算）：主线程跑必卡，要 Web Worker / WASM。

## 怎么用：四类极致手段

### 1. 首屏极致
- **SSG + CDN 边缘缓存**：内容预渲染成静态，放 CDN 边缘节点，用户就近毫秒级拿到。呼应当前[02 SSR](./ssr-isomorphic.md) 与 [01-9 加载](../01-pillars/01-9-performance-ux/loading-performance.md)。
- **关键路径极致**：内联关键 CSS、预连接、字体 preload + swap、最小化首屏 JS（RSC 减少客户端 JS）。
- **骨架/占位优先**：先显示结构，数据到了填充，感知更快（呼应当前[01-9 感知性能](../01-pillars/01-9-performance-ux/perceived-performance.md)）。

### 2. 虚拟列表（海量数据渲染）★
渲染上万/十万行，全量渲染 DOM 必爆。**虚拟列表只渲染可见区域的几十行**，滚动时动态替换：
```
总数据 10000 行，视口只显示 20 行
→ DOM 里永远只有 ~30 个 DOM 节点（可见 + 缓冲）
→ 滚动时，根据 scrollTop 算出"现在该显示哪些行"，替换内容
```
- **原理**：用绝对定位 + transform 把可见行放到正确位置，外层容器用超大高度撑出滚动条。
- **代价**：失去"浏览器原生查找"（Ctrl+F 找不到未渲染的内容）、复杂度增加。
- **库**：react-window / react-virtualized / TanStack Virtual。

### 3. Web Worker（CPU 密集移出主线程）★
主线程跑 CPU 密集任务（大计算、图像处理、复杂数据转换）会阻塞交互。**Web Worker 在独立线程跑这些**，不阻塞主线程：
```
// 主线程
const worker = new Worker('./heavy.js')
worker.postMessage(bigData)
worker.onmessage = e => setResult(e.data)

// heavy.js（Worker 线程）
self.onmessage = e => {
  const result = 复杂计算(e.data)   // 在 Worker 跑，不卡主线程
  self.postMessage(result)
}
```
- **适合**：数据处理、图像/视频处理、加密、大 JSON 解析、复杂算法。
- **代价**：线程通信有序列化开销（postMessage 数据要拷贝/序列化），小任务反而更慢。

### 4. WASM（WebAssembly）
把 C/C++/Rust 等编译成 WASM 在浏览器跑，性能接近原生：
- **适合**：极致性能的计算（图像/视频编解码、游戏引擎、复杂仿真）。
- **代价**：开发复杂、与 JS 交互有开销、包体积大。**只有 JS 真的扛不住时才用**。

## 常见坑

- ❌ **虚拟列表滥用**：几百行也上虚拟列表，复杂度增加却无收益。数据量真大才用。
- ❌ **Worker 处理小任务**：通信开销大于计算，反而慢。大计算才用。
- ❌ **WASM 过度使用**：常规逻辑也 WASM，增加复杂度体积却无收益。
- ❌ **忽视感知优化**：只优化真实性能，忽视骨架/过渡，用户感觉不到改善。

## 关联（双向打通）

- **依赖 ↓**：[01-9 性能与体验](../01-pillars/01-9-performance-ux/README.md)、[02 SSR](./ssr-isomorphic.md)、[09 浏览器原理（线程模型）](../09-prerequisites/README.md)
- **属于 ↑**：[02 前端进阶](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 常规性能 → [01-9 性能与体验](../01-pillars/01-9-performance-ux/README.md)
  - 首屏与 SSR → [02 SSR](./ssr-isomorphic.md)、[01-9 加载性能](../01-pillars/01-9-performance-ux/loading-performance.md)
  - 复杂交互（虚拟列表也属此）→ [复杂交互模式](./complex-interaction.md)
