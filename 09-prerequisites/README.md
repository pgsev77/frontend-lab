# 09 · 支撑基础 (Prerequisites)

> 浏览器原理、计算机网络、JavaScript 语言这些底层知识。它们不是前端特有，但前端的几乎所有概念都建立在它们之上。**这里是"按需查阅"的参考层，不是必读前置**——遇到 01/02 里不懂的底层概念，回这里查。

## 怎么用本模块
- 不要从头通读（除非你想系统补底层）
- 在学 01/02 时，某个原子笔记的"依赖↓"指向这里，再来看对应条目
- 每个条目保持精炼，讲清"前端为什么需要它"

## 详细大纲（→ 点击标题阅读）

### [1. 浏览器原理](./browser-principles.md)
- 渲染引擎工作流（HTML/CSS 解析 → Render Tree → Layout → Paint → Composite）
- ★ JavaScript 引擎与事件循环（Event Loop：宏任务/微任务/渲染时机）
- 浏览器存储（Cookie / localStorage / sessionStorage / IndexedDB / Cache API）
- 浏览器安全模型（同源策略 / 沙箱 / 进程隔离）
- 浏览器进程与线程（渲染进程 / GPU 进程 / 网络进程）
- ★ 渲染时机：为什么 `setTimeout(0)` 和 `requestAnimationFrame` 时机不同

### [2. HTTP 与网络](./http-networking.md)
- HTTP/1.1 vs HTTP/2（多路复用、头部压缩）vs HTTP/3（QUIC）
- HTTP 缓存：强缓存（Cache-Control/Expires）vs 协商缓存（ETag/Last-Modified）
- Cookie 属性（HttpOnly / Secure / SameSite / Domain / Path）
- ★ CORS 与跨域（同源策略、预检请求、凭证请求）
- DNS 与 CDN
- WebSocket / SSE 的协议层
- TLS/HTTPS 基础

### [3. JavaScript 语言基础](./javascript-fundamentals.md)
- 类型系统（原始类型/引用类型、类型转换坑）
- 作用域（全局/函数/块级）与闭包
- ★ 异步（Promise / async-await / 事件循环 / 微任务）
- 原型与继承（原型链、class 语法糖）
- this 绑定（默认/隐式/显式/new）
- 模块系统（ESM vs CommonJS）
- 可迭代与迭代器（for...of / 生成器）
- 错误处理（try-catch / 错误冒泡 / 未捕获异常）

## 学完应能回答
- 浏览器渲染引擎的完整流程是什么？
- 事件循环里宏任务、微任务、渲染的执行顺序？
- HTTP 强缓存和协商缓存的区别？怎么配合用？
- Cookie 的 HttpOnly 和 SameSite 各防什么攻击？
- CORS 是保护谁的？什么时候发预检请求？
- Promise 的微任务和 setTimeout 的宏任务，谁先执行？

## 关联
- **属于 ↑**：frontend-lab 总纲 [../README.md]
- **相关 →**：被 01/02/03 的概念反复引用（渲染管线、事件循环、HTTP 缓存、CORS、异步）
