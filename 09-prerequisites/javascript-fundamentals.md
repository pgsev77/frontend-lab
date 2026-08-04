# JavaScript 语言基础（JavaScript Fundamentals）

> JS 是前端的母语。类型、作用域、闭包、异步、原型——这些语言基础，是理解所有框架（React/Vue）和行为的前提。按需查阅的底层参考。

## 是什么

JS 语言基础指**语言本身的核心机制**：类型系统、作用域与闭包、异步、原型、this、模块、错误处理。

一句话边界：**按需查阅**——遇到"为什么闭包里拿到旧值""this 指向哪""async/await 怎么工作"回这里查。

## 核心知识点

### 1. 类型系统
- **原始类型**：string/number/boolean/null/undefined/symbol/bigint。
- **引用类型**：Object（含 Array/Function/Date 等）。
- **类型转换坑**：`==` 会隐式转换（`"1"==1` 为 true），**永远用 `===`**。`[] == false`、`null == undefined` 等隐式转换是 bug 源。

### 2. 作用域与闭包 ★ 高频
- **作用域**：变量可见范围。`var`（函数作用域，提升）、`let`/`const`（块作用域，暂存死区）。
- **闭包**：函数"记住"其定义时的作用域，即使在外部执行。这是 JS 实现私有/工厂/记忆的核心机制。
```
function counter() {
  let n = 0                    // 被闭包记住
  return () => ++n
}
const c = counter()
c()  // 1   —— n 在外部访问不到，但 c 记住了它
```
**闭包陷阱**（呼应当前[01-5 副作用](../01-pillars/01-5-state-management/side-effects.md)）：useEffect 用了变量但没列入依赖，闭包里是"旧的"值（stale closure）。

### 3. 异步 ★ 核心
JS 单线程，异步靠事件循环（详见[浏览器原理](./browser-principles.md)）。
- **Promise**：异步操作的占位。`.then`/`.catch`/`.finally`，状态 pending→fulfilled/rejected。
- **async/await**：Promise 的语法糖，让异步写起来像同步。
```
async function load() {
  try {
    const user = await fetchUser()    // 等 Promise 解决
    return user
  } catch (e) { ... }
}
```
- **Promise.all / allSettled / race**：并发控制（呼应当前[01-6 获取模式](../01-pillars/01-6-data-fetching/fetch-patterns.md)）。

### 4. 原型与继承
- JS 用**原型链**实现继承：对象有 `__proto__` 指向其原型，访问属性时沿链找。
- `class` 是原型链的语法糖，本质仍是原型。
- 多数业务代码用 class 即可，理解原型有助于排查"属性从哪来"。

### 5. this 绑定
`this` 指向取决于**调用方式**：
- 默认：非严格模式指向全局，严格模式 undefined。
- 隐式：`obj.method()` 里 this 是 obj。
- 显式：`call`/`apply`/`bind`。
- new：新创建的对象。
> 箭头函数没有自己的 this，继承外层——这是 React 早期用箭头函数绑定 this 的原因。

### 6. 模块系统
ESM（import/export）是标准，CommonJS（require）是 Node 历史。详见当前[01-12 模块化](../01-pillars/01-12-architecture-engineering/modularity.md)。

### 7. 可迭代与迭代器
- `for...of` 遍历可迭代对象（Array/String/Map/Set/Generator）。
- 生成器（`function*`）：可暂停的函数，用于惰性序列/协程。

### 8. 错误处理
- `try/catch`：同步错误捕获。
- Promise 错误：`.catch` 或 await + try/catch。
- 未捕获错误：冒泡到全局 error 事件（呼应当当前[01-13 错误边界](../01-pillars/01-13-observability-quality/error-boundary.md) 与 [01-13 监控](../01-pillars/01-13-observability-quality/frontend-monitoring.md)）。

## 学完应能回答
- 原始类型和引用类型的区别？为什么 `===` 比 `==` 安全？
- 闭包是什么？stale closure 怎么产生？
- Promise.all 和 allSettled 的区别？
- this 的绑定规则？箭头函数的 this？

## 关联（双向打通）

- **属于 ↑**：[09 支撑基础](./README.md) → 总纲 [../README.md]
- **相关 →**：被几乎所有 01 支柱引用（闭包→副作用/渲染；异步→数据获取；this→事件；模块→构建）
