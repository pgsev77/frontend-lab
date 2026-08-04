# Next.js 基础设施（v2-1）

> Next.js 项目的骨架与通用基础设施（App Router / 路由 / 渲染模式 / 数据获取）。这一层是所有业务功能的地基。

## 详细大纲（→ 点击标题阅读）

### [01. 技术栈全景与选型理由](./01-stack-overview.md)
- Next.js + React + TS + Tailwind + Zustand + TanStack Query 全景
- 为什么选 Next.js（vs Vite SPA）、App Router（vs Pages）、Tailwind（vs CSS-in-JS）
- 版本固定、最小可运行搭建

### [02. App Router 项目骨架](./02-app-router-structure.md)
- 目录即路由（app/ 约定）
- 文件角色：page/layout/loading/error/not-found
- 文件约定如何对应 v1 的四态/错误边界/404

### [03. 路由与布局落地](./03-routing-layout.md)
- 嵌套布局持久化、路由组（不影响 URL）
- Link 导航与预取、编程式导航（useRouter）
- URL 即状态（searchParams 读写）

### [04. 渲染模式](./04-rendering-modes.md)
- App Router 默认 Server Component（RSC）
- SSG / SSR / ISR / 客户端组件（'use client'）
- 渲染模式决策树

### [05. 数据获取](./05-data-fetching.md)
- Server Components async fetch（首屏，消除瀑布）
- TanStack Query（客户端缓存/失效/竞态）
- 两条路径的分工

## 学完应能回答
- App Router 的目录约定是什么？layout 为什么能持久化？
- Server Component 和 Client Component 的区别？'use client' 何时加？
- SSG/SSR/ISR 在 Next.js 里怎么写？怎么选？
- 首屏数据为什么用 Server Components 而非 TanStack Query？
