# 浏览器原理（Browser Principles）

> 浏览器是前端的运行时。渲染管线、事件循环、存储、安全模型——这些底层机制被 01~03 反复引用。这篇是"按需查阅"的底层参考，把分散的知识点收拢。

## 是什么

浏览器原理指**浏览器如何工作**的底层机制。本篇聚焦前端概念常依赖的几个：渲染引擎、事件循环、存储、安全模型。

一句话边界：**这里是"遇到 01/02 不懂的底层"时回查的参考层**，非必读前置。

## 核心知识点

### 1. 渲染引擎工作流
浏览器把 HTML/CSS/JS 变成像素的完整流程（关键渲染路径）：
```
HTML → DOM
CSS → CSSOM → Render Tree → Layout → Paint → Composite → 像素
JS 可改 DOM/CSSOM
```
详见 [01-9 关键渲染路径](../01-pillars/01-9-performance-ux/critical-rendering-path.md) 与 [01-4 从状态到像素](../01-pillars/01-4-rendering/state-to-pixel.md)。这里是它的"为什么"。

### 2. 事件循环（Event Loop）★ 最常被引用
JS 是单线程，靠事件循环处理异步。核心模型：
```
调用栈（同步代码执行）
  ↓ 清空后
微任务队列（Promise.then、queueMicrotask）→ 全部清空
  ↓ 每轮微任务后
宏任务队列（setTimeout、事件回调）→ 取一个执行
  ↓ 宏任务后
渲染（如需要）→ rAF 回调 → 浏览器决定是否渲染
```
**执行顺序**：同步代码 → 微任务（全部）→ 宏任务（一个）→ 渲染 → 下一个宏任务...

> 关键认知：**微任务在每次宏任务后、渲染前全部清空**。这就是为什么 `Promise.then` 比 `setTimeout(0)` 先执行——它在同一轮的微任务阶段，setTimeout 在下一轮宏任务。

### 渲染时机：setTimeout(0) vs requestAnimationFrame
- `setTimeout(0)`：至少 4ms 延迟（规范），在下一个宏任务，可能在渲染前或后。
- `requestAnimationFrame`：在下一次渲染**前**执行，对齐刷新率。
- 视觉更新用 rAF（呼应当前[01-3 动画](../01-pillars/01-3-styling/animation-transition.md)），延时逻辑用 setTimeout。

### 3. 浏览器存储
| 存储 | 容量 | 作用域 | 持久 | 注意 |
|---|---|---|---|---|
| Cookie | 小（4KB） | 同源+路径 | 可控 | 自动随请求带，安全属性重要 |
| localStorage | 大（5MB+） | 同源 | 持久 | 同步、JS 可读（XSS 风险） |
| sessionStorage | 大 | 同源+标签 | 关标签即失 | 同步 |
| IndexedDB | 很大 | 同源 | 持久 | 异步、结构化、适合大量数据 |
| Cache API | 大 | 同源 | 持久 | Service Worker 用，离线缓存 |

> 安全：localStorage/sessionStorage JS 可读写，**不存敏感数据**（呼应当前[01-11 安全](../01-pillars/01-11-security/other-security.md)）。Cookie 的 HttpOnly/Secure/SameSite 属性见当前[01-11 CSRF](../01-pillars/01-11-security/csrf.md)。

### 4. 浏览器安全模型
- **同源策略**：默认禁止跨源访问（协议+域名+端口），是 Web 安全基石。详见当前[01-11 CORS](../01-pillars/01-11-security/cors.md)。
- **沙箱**：每个标签页/iframe 隔离，一个崩不拖垮其他。
- **进程隔离**：现代浏览器多进程（渲染进程/GPU 进程/网络进程），稳定性更高。

### 5. 浏览器进程与线程
- 渲染进程（每个标签页）：跑 JS、渲染、事件。
- GPU 进程：合成、绘图。
- 网络进程：网络请求。
- JS 单线程在渲染进程的主线程上——所以长任务会阻塞渲染和交互（呼应当前[01-9 运行时性能](../01-pillars/01-9-performance-ux/runtime-performance.md)）。

## 学完应能回答
- 事件循环里同步/微任务/宏任务/渲染的顺序？
- 为什么 Promise.then 比 setTimeout(0) 先执行？
- setTimeout(0) 和 requestAnimationFrame 的时机区别？
- 各浏览器存储的特点与安全注意？

## 关联（双向打通）

- **属于 ↑**：[09 支撑基础](./README.md) → 总纲 [../README.md]
- **相关 →**：被 [01-4 渲染](../01-pillars/01-4-rendering/README.md)、[01-9 性能](../01-pillars/01-9-performance-ux/README.md)、[01-11 安全](../01-pillars/01-11-security/README.md) 反复引用
