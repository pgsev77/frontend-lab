# 调试（Debugging）

> 代码会出 bug，这是常态。高效调试是一种被低估的技能——会用 DevTools、能读性能火焰图、会抓包定位问题，能省大量时间。这篇梳理前端调试的工具和方法。

## 是什么

调试指**定位和修复问题**的过程。前端调试主要靠浏览器 DevTools，配合状态调试工具。

一句话边界：**调试 = 用对的工具，高效地从"现象"追到"根因"。**

## 为什么：调试能力决定效率

写代码花的时间，常常不如调 bug 多。同样的现象：
- 会调试的人：开 DevTools 看请求、断点、查状态，10 分钟定位。
- 不会的人：到处 console.log、改改试试、猜来猜去，半天找不着。

调试工具是"放大镜和听诊器"——让你看见肉眼看不到的运行细节。

## 怎么用：DevTools 各面板

### Elements 面板
- 检查/实时编辑 DOM 和样式。
- 调试布局问题（盒模型、Flex/Grid 对齐）——改了立即看效果。

### Console ★
- 执行 JS、查变量、`console.log` 调试。
- 技巧：`console.table`（表格化数据）、`console.group`（分组）、`$0`（当前选中元素）、`$$`（querySelectorAll 快捷）。

### Sources / 断点 ★
- 设断点，代码执行到此处暂停，查看作用域变量、调用栈。
- 比 console.log 强大：能看完整调用链、逐步执行、条件断点（满足条件才停）。
> 别只靠 console.log——复杂问题靠断点 + 调用栈定位快得多。

### Network ★
- 看所有请求：URL、状态码、请求/响应体、耗时。
- 调试 API 问题（请求对不对、返回对不对、为什么慢、为什么失败）的首选工具。
- 呼应当前[01-6 数据获取](../01-6-data-fetching/README.md)。

### Performance 面板 ★
- 录制操作，看性能瓶颈：火焰图（哪些函数耗时）、长任务、重排重绘、FPS。
- 调试卡顿的首选——能精确定位"慢在哪个函数/哪次重排"。呼应当前[01-9 运行时性能](../01-9-performance-ux/runtime-performance.md)。

### Application 面板
- 查看/编辑 Cookie、localStorage、sessionStorage、IndexedDB、Service Worker、缓存。
- 调试存储和 PWA 问题。

## 状态调试工具
- **React DevTools**：查组件树、props/state、Hooks 值。"为什么这个组件渲染了""state 现在是什么"靠它。
- **Vue DevTools**：同理 Vue。

## 移动端调试
- **远程调试**：手机连电脑，用桌面 Chrome DevTools 调试手机 Chrome 页面（chrome://inspect）。
- **模拟器**：DevTools 的设备模拟（屏幕尺寸、触摸、网络限速）。
- **真机必要性**：模拟器不还原真实性能/触摸行为，关键问题要在真机测。

## 调试方法论
1. **复现**：先稳定复现 bug，否则没法修。
2. **定位**：用工具缩小范围（Network 看是不是接口、断点看是不是逻辑、Performance 看是不是性能）。
3. **根因**：找到"为什么会这样"，而非"现象层打补丁"。
4. **验证**：修后测原场景 + 相邻场景（防止修一个引出别的）。

## 常见坑

- ❌ **只靠 console.log**：复杂问题效率低。用断点和调用栈。
- ❌ **不查 Network 就猜 API**：明明是请求问题却去查逻辑。先看 Network。
- ❌ **改了不清缓存**：旧的 JS/CSS 缓存导致"改了没生效"假象。禁用缓存或硬刷新。
- ❌ **只看现象打补丁**：不追根因，bug 反复。找到"为什么"再修。

## 关联（双向打通）

- **依赖 ↓**：[01-6 数据获取（Network 调试）](../01-6-data-fetching/README.md)、[01-9 性能（Performance 调试）](../01-9-performance-ux/runtime-performance.md)
- **属于 ↑**：[01-13 可观测性与质量](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 线上调试靠 Source Map → [Source Map](./source-map.md)
  - 线上错误靠监控发现 → [前端监控](./frontend-monitoring.md)
