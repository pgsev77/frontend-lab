# 技术栈全景与选型理由（Next.js 落地）

> 对应 v1：[01-4 声明式 UI](../../01-pillars/01-4-rendering/declarative-rendering.md) · [01-7 路由模型](../../01-pillars/01-7-routing/routing-model.md) · [02-1 SSR 与同构](../../02-advanced/ssr-isomorphic.md)

## 它解决什么

在开始写 Next.js 代码前，先看清整个技术栈的全貌——每个组件解决什么问题、为什么选它、它们怎么协作。这一篇是 v2 其余所有笔记的"地图"。

## 技术栈全景

```
┌──────────────────────────────────────────────┐
│              浏览器（用户）                    │
└──────────────────────────────────────────────┘
                      ↓ HTTPS
┌──────────────────────────────────────────────┐
│   Next.js 14（元框架，App Router）            │
│  ┌────────────────────────────────────────┐  │
│  │ app/（路由层）layout · page · loading  │  │
│  │ Server Components（默认服务端渲染）     │  │
│  │ Client Components（'use client' 交互）  │  │
│  └────────────────────────────────────────┘  │
│  数据获取（async/await · loader）· 缓存       │
└──────────────────────────────────────────────┘
        ↓                ↓
┌──────────────┐   ┌──────────────────┐
│  React 18    │   │   Tailwind CSS    │
│ Hooks/并发/vDOM│   │ 原子化样式+设计令牌│
└──────────────┘   └──────────────────┘
        ↓                ↓
┌──────────────┐   ┌──────────────────┐
│  Zustand     │   │ TanStack Query   │
│ 客户端状态    │   │ 服务端状态/缓存   │
└──────────────┘   └──────────────────┘
```

## 各组件的选型理由

### Next.js：为什么不是 Vite + React SPA

| 维度 | Vite + React（纯 SPA） | Next.js（App Router） |
|---|---|---|
| 路由 | 自己配 React Router | **文件系统路由**（app/ 目录即路由） |
| 渲染模式 | 只有 CSR | **CSR/SSR/SSG/ISR/RSC 全支持** |
| 首屏/SEO | 差（纯 CSR 白屏） | **好**（SSR/SSG 首屏快、可抓取） |
| 数据获取 | 全靠客户端 effect | **Server Components 直接 async** |
| 部署 | 静态托管 | 静态/Node/Edge 全支持 |

> v1 反复强调"首屏性能、SEO、渲染模式选择"（[02-1 SSR](../../02-advanced/ssr-isomorphic.md)、[01-9 关键渲染路径](../../01-pillars/01-9-performance-ux/critical-rendering-path.md)）。Next.js 是 React 生态里**原生覆盖这些**的框架，纯 SPA 要自己搭还搭不全。

### App Router：为什么不是 Pages Router

| 维度 | Pages Router（旧） | App Router（新，Next 13+） |
|---|---|---|
| 路由组织 | `pages/` 一层扁平 | **嵌套 layout**（共享布局持久化） |
| 数据获取 | `getServerSideProps`/`getStaticProps` | **Server Components 直接 async** |
| 默认渲染 | 组件在客户端渲染 | **默认服务端组件**（0 客户端 JS） |
| 布局 | 每页重挂载 | **layout 跨页持久化**（呼应 v1 [01-7 嵌套路由](../../01-pillars/01-7-routing/nested-routes-layout.md)） |

> App Router 把 v1 讲的"嵌套路由布局持久化""数据路由消除瀑布""服务端组件减少客户端 JS"原生落地。本 v2 全部基于 App Router。

### React 18：并发渲染

React 18 的并发特性（[01-4 渲染调度](../../01-pillars/01-4-rendering/rendering-scheduling.md)）——`useTransition`/`useDeferredValue`/Suspense——让重渲染可中断、用户输入优先。Next.js App Router 原生基于 React 18。

### Tailwind：为什么不是 CSS-in-JS

| 维度 | CSS-in-JS（styled-components） | Tailwind |
|---|---|---|
| 运行时 | 有（SSR 复杂、有开销） | **0 运行时**（编译成纯 CSS） |
| 体积 | 随组件增长 | **固定集合 + PurgeCSS，反而更小** |
| 一致性 | 靠人遵守 | **强制设计令牌**（呼应当前 v1 [01-3 原子化](../../01-pillars/01-3-styling/atomic-css.md)） |

> v1 [01-3 原子化 CSS](../../01-pillars/01-3-styling/atomic-css.md) 讲过原子化的体积/一致性优势。Tailwind 是落地它的最成熟方案，且与 Next.js/SSR 无缝（0 运行时）。

### Zustand + TanStack Query：状态分层

呼应 v1 [01-5 状态分类](../../01-pillars/01-5-state-management/state-classification.md) 的核心命题——**客户端状态 vs 服务端状态分开管**：
- **Zustand**：客户端 UI 状态（当前 Tab、弹窗、本地计数）。
- **TanStack Query**：服务端状态（接口数据的缓存/失效/重取）。
- **URL（Next.js 路由）**：URL 状态（筛选、分页、Tab）。

三者各管一摊，不混（呼应当前 v1 [01-5 状态架构](../../01-pillars/01-5-state-management/state-architecture.md) 的分层）。

## 版本固定（写进 `package.json`）

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "zustand": "^4.0.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0"
  }
}
```

> 版本固定是为让 v2 代码示例长期可复现。读者克隆 `examples/` 能直接跑。

## 怎么搭起来（最小可运行）

```bash
# 1. 创建 Next.js 项目（官方 CLI，含 TS + Tailwind + App Router）
npx create-next-app@latest my-app --typescript --tailwind --app --eslint
cd my-app

# 2. 加状态库
npm install zustand @tanstack/react-query

# 3. 加表单与校验
npm install react-hook-form zod @hookform/resolvers

# 4. 启动
npm run dev
```

## 为什么这样写（设计决策）

- **`--app`**：用 App Router（本 v2 全部基于它）。
- **`--tailwind`**：CLI 自动配好 Tailwind，开箱即用。
- **Zod 作校验**：一份 schema 同时跑前端校验 + 类型推导 +（可共享给后端）边界校验（呼应当前 v1 [01-12 TS 边界](../../01-pillars/01-12-architecture-engineering/typescript-types.md)）。

## 常见坑

- ❌ **用 Pages Router 跟着本 v2 学**：v2 全部基于 App Router，Pages Router 的 `getServerSideProps` 等已过时，别混用。
- ❌ **React/Next 版本不匹配**：Next 14 要配 React 18，混用 17 会有水合/并发问题。
- ❌ **忘记 App Router 默认是服务端组件**：在服务端组件里用 useState/useEffect 会报错——要加 `'use client'`（详见 [04 渲染模式](./04-rendering-modes.md)）。

## 关联

- ↑ 对应 v1 原理：[01-4 声明式 UI](../../01-pillars/01-4-rendering/declarative-rendering.md) · [01-7 路由模型](../../01-pillars/01-7-routing/routing-model.md) · [02-1 SSR](../../02-advanced/ssr-isomorphic.md)
- → v2 相关：[02 App Router 骨架](./02-app-router-structure.md) · [04 渲染模式](./04-rendering-modes.md)
