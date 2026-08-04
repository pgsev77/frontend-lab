# DOM 模型（Document Object Model）

> HTML 写出来是文本，但浏览器把它解析成一棵**树**——这就是 DOM。前端的一切（CSS 样式、JS 操作、框架渲染）最终都作用在这棵树上。理解 DOM，才能理解"为什么直接操作 DOM 慢"，从而理解 [01-4 渲染机制](../01-4-rendering/README.md) 里"虚拟 DOM"为什么被发明。

## 是什么

DOM（文档对象模型）是 HTML 文档在内存中的**树形结构表示**。浏览器解析 HTML 文本后，把它转成由"节点（Node）"组成的树，JavaScript 通过 DOM API 读写这棵树，从而动态改变页面。

一句话边界：**HTML 是源码文本，DOM 是它在内存里的活对象**。你改 HTML 文件不会立即影响已加载的页面；你改 DOM 才会。

## 为什么：DOM 为什么是树

HTML 本身就是嵌套结构，天然映射成树：

```
HTML 文本                      DOM 树
<html>                         document (根)
  <head>                         ├── html
    <title>Hi</title>            │   ├── head
  <body>                         │   │   └── title (文本: "Hi")
    <p>Hello</p>                 │   └── body
  </body>                        │       └── p (文本: "Hello")
</html>
```

树的每个节点是一个对象，有 `tagName`、`attributes`、`childNodes`、`parentNode` 等属性。这种结构让"查找/修改某个元素"有清晰的路径（从根遍历，或用选择器直接定位）。

### 节点类型
- **元素节点（Element）**：`<div>`、`<p>` 等，最常见。
- **文本节点（Text）**：标签之间的文字。
- **属性节点（Attr）**：元素的属性（实际操作时多用 `element.getAttribute()`）。
- **文档节点（Document）**：整棵树的根，`document` 对象。

## 怎么工作：操作 DOM 的成本（★ 核心）

DOM 操作是前端性能问题的头号来源。原因不在 API 本身，而在**操作 DOM 会触发浏览器的渲染流水线**：

```
改 DOM → 重新计算样式 → 重新布局(Layout/重排) → 重新绘制(Paint/重绘) → 合成
```

这条流水线很贵，尤其"重排（Layout）"——它要重新计算所有元素的位置和大小。

### 昂贵的操作模式
```
❌ 反例：循环里反复读写 DOM（强制同步布局 / layout thrashing）
for (let i = 0; i < 1000; i++) {
  const el = document.getElementById('list')
  el.appendChild(document.createElement('li'))  // 写 DOM
  const width = el.offsetWidth                  // 读布局 → 触发立即重排！
}
```
每次读 `offsetWidth`（布局属性）时，浏览器被迫立即执行积压的布局计算（同步重排），1000 次循环 = 1000 次完整布局，极慢。

```
✅ 正例：先批量读，再批量写；或用 DocumentFragment 一次性插入
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(document.createElement('li'))
}
document.getElementById('list').appendChild(fragment)  // 只触发一次重排
```

### 为什么"直接操作 DOM"在大型应用里失控
- **状态与视图脱节**：你手动 `appendChild`/`removeChild`，但很难保证 DOM 始终反映最新状态。状态一复杂，就忘了该删哪个节点、该更新哪个属性。
- **跨浏览器差异**：早期 DOM API 在不同浏览器行为不一，需要大量兼容代码（jQuery 当年就是解决这个）。

> 这两个痛点正是 [01-4 声明式 UI 与虚拟 DOM](../01-4-rendering/README.md) 被发明的动机：**让框架自动算出 DOM 该怎么变，开发者只描述状态**。

## 常见坑

- ❌ **频繁读写交替**：循环里"读布局属性 → 改 DOM → 再读布局"，触发强制同步布局。
  - ✅ 正例：分离读写，或用 `requestAnimationFrame` 批量化。
- ❌ **以为改 HTML 字符串就改了页面**：`innerHTML` 赋值才生效，且会**销毁并重建**所有子节点（连带事件监听、状态全丢）。
- ❌ **滥用 innerHTML 拼接用户输入**：导致 [XSS](../01-11-security/README.md)（把用户内容当代码执行）。用户内容应走 `textContent` 或转义。
- ❌ **忘记事件监听器/引用未清理**：手动移除 DOM 节点时，若 JS 仍持有其引用或绑定了监听器，节点无法被垃圾回收 → 内存泄漏。

## 关联（双向打通）

- **依赖 ↓**：[09 浏览器原理](../../09-prerequisites/README.md)（解析 HTML → 构建 DOM 的流程）
- **属于 ↑**：[01-1 视图基础与文档结构](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - DOM 是虚拟 DOM 的对照基准 → [01-4 渲染机制](../01-4-rendering/README.md)
  - 操作 DOM 的成本引出声明式渲染 → [01-4 渲染机制](../01-4-rendering/README.md)
  - 改 DOM 触发重排重绘 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - innerHTML 与 XSS → [01-11 安全](../01-11-security/README.md)
