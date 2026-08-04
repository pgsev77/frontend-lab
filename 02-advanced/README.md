# 02 · 前端进阶 (Advanced)

> 学完 01 的单页应用（SPA）基础后，这一层应对"规模与极致"：服务端渲染、大型应用架构、性能极致优化、复杂交互模式。01 回答"怎么把界面做出来"，02 回答"怎么扛住规模、做到极致"。

## 本模块解决什么问题
当应用变大、性能要求变高、交互变复杂，SPA 的基础方案就不够了。本模块回答：**要不要上 SSR、大型应用怎么不失控、性能怎么榨到极致、复杂交互怎么实现**。

## 详细大纲（→ 待填充原子笔记内容）

### 1. 服务端渲染与同构（SSR / SSG / ISR / RSC）
- 为什么需要 SSR（SEO、首屏、首字节）—— SPA 的根本局限
- CSR（客户端渲染）vs SSR（服务端渲染）vs SSG（静态生成）vs ISR（增量静态再生）
- 同构（Isomorphic）：同一份代码跑在服务端和客户端
- 水合（Hydration）：服务端 HTML + 客户端 JS 接管的衔接，及其坑
- React Server Components（RSC）：服务端组件的新范式
- Next.js App Router 的渲染模型
- 流式渲染（Streaming SSR）与 Suspense

### 2. 大型应用架构
- 状态架构的演进（从 Context 到分层 store）
- 微前端（Micro Frontend）：独立部署的子应用组合
- 模块联邦（Module Federation）：运行时共享模块
- Monorepo 管理（pnpm workspaces / Turborepo / Nx）
- 分包策略与公共依赖管理
- → 基础架构见 [01-12](../01-pillars/01-12-architecture-engineering/README.md)

### 3. 性能极致优化
- 首屏极致优化（预渲染、边缘计算、RSC）
- 资源加载策略（HTTP/2 推送、Resource Hints、CDN 策略）
- 缓存层级（浏览器/CDN/Service Worker/内存）
- 运行时极致（虚拟列表、Web Worker、WASM）
- → 基础性能见 [01-9](../01-pillars/01-9-performance-ux/README.md)

### 4. 复杂交互模式
- 虚拟列表（Virtual List）：渲染上万条数据
- 拖拽（Drag & Drop）：自定义拖拽与 HTML5 DnD API
- 撤销重做（Undo/Redo）：命令模式与状态历史
- 富文本编辑器：ContentEditable 的难题、ProseMirror/TipTap/Slate
- 协同编辑：操作转换（OT）/ CRDT，实时协作的一致性
- 大表单：动态字段、跨步校验、分步表单

## 学完应能回答
- CSR/SSR/SSG/ISR/RSC 各是什么？分别解决什么问题？
- 同构的核心难点是什么？水合可能出什么问题？
- 微前端和模块联邦的区别？各适合什么场景？
- 虚拟列表怎么实现？它牺牲了什么换性能？
- 协同编辑为什么难？OT 和 CRDT 的思路差异？

## 关联
- **属于 ↑**：frontend-lab 总纲 [../README.md]
- **依赖 ↓**：[01 核心支柱](../01-pillars/README.md)（02 是 01 的进阶）
- **相关 →**：[03 工程实践](../03-engineering/README.md)（大型应用的工程化）
