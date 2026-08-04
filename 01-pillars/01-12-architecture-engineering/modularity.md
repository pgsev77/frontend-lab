# 模块化（Modularity）

> JS 的模块化经历漫长混乱——全局变量、IIFE、AMD、CommonJS，直到 ES Modules 成为标准。理解模块化，才能理解 import/export、Tree-shaking、循环依赖这些日常问题。

## 是什么

模块化指**把代码组织成独立、可复用、有明确接口的单元（模块）**。JS 的模块系统演进：
```
全局变量 → IIFE → AMD/CMD（RequireJS）→ CommonJS（Node）→ ES Modules（标准）★
```

一句话边界：**ES Modules（ESM）是现代 JS 模块标准**——`import`/`export`，静态、可 Tree-shake。CommonJS 是 Node 历史遗产，前端新项目别用。

## 为什么：模块化解决什么

### 没有模块化的地狱
早期 JS 没有模块，所有代码共享全局作用域。`script` 标签堆在一起，变量名冲突、依赖顺序靠人记、无法复用。IIFE（立即执行函数）是早期"假装模块"的手段。

### 模块化的承诺
- **封装**：模块内部不污染全局，只通过 export 暴露。
- **显式依赖**：`import` 声明依赖，不用记加载顺序。
- **复用**：一个模块到处 import。

## 怎么用：ESM 核心知识

### 命名导出 vs 默认导出 ★
```
// 命名导出（推荐）
export function add(a,b){...}
export const PI = 3.14
import { add, PI } from './math'        // 按名导入，明确

// 默认导出（一个模块一个）
export default class User {...}
import User from './user'                // 默认导入，名字随意
```
**为什么推荐命名导出**：
- **明确**：`import { add }` 一眼知道导入了什么；默认导出的名字是导入方随意起的，易不一致。
- **重构友好**：重命名时，命名导出能被工具追踪；默认导出难追踪。
- **Tree-shaking 友好**：命名导出便于静态分析哪些被用了。
> 多数现代风格指南（如 Airbnb 后期）推荐用命名导出，慎用默认导出。

### ESM 的静态性 ★
ESM 的 import/export 是**顶层静态声明**（不能在 if 里、运行时动态）：
```
// ✅ 合法：静态 import
import { add } from './math'

// ❌ 非法：不能在条件/运行时静态 import
if (cond) { import './x' }   // 语法错

// ✅ 动态加载用 import()（返回 Promise）
if (cond) { const mod = await import('./x') }   // 这是"动态 import"，用于代码分割
```
静态性的价值：构建工具能在**编译时**分析整个依赖图，这是 Tree-shaking、代码分割的基础（呼应当前[01-12 打包](./bundling-optimization.md)）。CommonJS 的 require 是运行时的，无法可靠静态分析。

### 循环依赖 ★ 坑
A import B，B 又 import A，形成环：
```
// a.js
import { b } from './b'
export const a = () => b()

// b.js
import { a } from './a'   // 循环！
export const b = () => a()
```
循环依赖时，模块求值顺序混乱，可能拿到"还没初始化"的导出（undefined）。**循环依赖是设计缺陷的信号**——说明模块边界划错了，应重构拆分。

### Barrel 文件（index.ts 聚合）
用 index.ts 把一个目录的多个模块聚合导出，简化导入路径：
```
// features/user/index.ts
export * from './components'
export * from './hooks'
export * from './api'
// 外部：import { UserCard, useUser } from '@/features/user'   // 一行导入多个
```
**权衡**：barrel 简化导入，但 `export *` 可能破坏 Tree-shaking（取决于工具），且循环依赖更隐蔽。适度使用。

## 常见坑

- ❌ **新项目用 CommonJS**：失去 Tree-shaking、静态分析。前端用 ESM。
- ❌ **循环依赖**：模块边界设计错误。重构解环。
- ❌ **滥用默认导出**：重命名难追踪、名字不一致。
- ❌ **barrel 的 export * 破坏 Tree-shaking**：按需用具名导出聚合。

## 关联（双向打通）

- **依赖 ↓**：[项目架构（feature 的模块边界）](./project-architecture.md)、[打包与优化（Tree-shaking）](./bundling-optimization.md)
- **属于 ↑**：[01-12 架构与工程化](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - ESM 是 Tree-shaking 基础 → [打包与优化](./bundling-optimization.md)
  - 模块边界 → [项目架构](./project-architecture.md)
