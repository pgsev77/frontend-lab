# Dashboard 示例（v2-6 集大成）

> 这是 v2 的"集大成"——把所有知识点串成一个**可 clone 可运行**的最小 Dashboard。
> 目的：让读者看完 v1/v2 原理后，看到一个"完整可运行"的实例，知道所有概念长在一起是什么样。

## 功能（每个功能对应一个知识点）

| 功能 | 对应 v1 概念 | 对应 v2 笔记 |
|---|---|---|
| App Router 路由（首页/用户/设置） | [01-7 路由模型](../../../01-pillars/01-7-routing/routing-model.md) | [nextjs/02 骨架](../../nextjs/02-app-router-structure.md) + [03 路由](../../nextjs/03-routing-layout.md) |
| Server Component 首页（0 客户端 JS） | [02-1 SSR](../../../02-advanced/ssr-isomorphic.md) | [nextjs/04 渲染模式](../../nextjs/04-rendering-modes.md) |
| TanStack Query 用户列表（缓存+四态） | [01-6 客户端缓存](../../../01-pillars/01-6-data-fetching/client-cache.md) | [state/02 Query](../../state/02-tanstack-query.md) |
| mutation 失效自动刷新 | [01-6 同步策略](../../../01-pillars/01-6-data-fetching/sync-strategies.md) | [state/02 Query](../../state/02-tanstack-query.md) |
| Zustand 设置页偏好（持久化） | [01-5 状态分类](../../../01-pillars/01-5-state-management/state-classification.md) | [state/01 Zustand](../../state/01-zustand.md) |
| React Hook Form + Zod 表单 | [01-8 表单状态](../../../01-pillars/01-8-interaction-forms/form-state.md) | [state/03 表单](../../state/03-form-state.md) |
| Tailwind + 设计令牌 + 暗色模式 | [01-3 设计令牌](../../../01-pillars/01-3-styling/design-tokens.md) | [styling/01-03](../../styling/README.md) |
| loading.tsx 骨架屏 | [01-9 感知性能](../../../01-pillars/01-9-performance-ux/perceived-performance.md) | [nextjs/02 骨架](../../nextjs/02-app-router-structure.md) |
| error.tsx 错误边界 | [01-13 错误边界](../../../01-pillars/01-13-observability-quality/error-boundary.md) | [react/03 错误边界](../../react/03-error-boundary.md) |
| not-found 404 兜底 | [01-7 导航体验](../../../01-pillars/01-7-routing/navigation-ux.md) | [nextjs/02 骨架](../../nextjs/02-app-router-structure.md) |
| TypeScript 类型贯穿 | [01-12 TS](../../../01-pillars/01-12-architecture-engineering/typescript-types.md) | [engineering/03 规范](../../engineering/03-conventions-ci.md) |
| API 层 + Hook 层分离 | [01-6 数据架构](../../../01-pillars/01-6-data-fetching/fetch-architecture.md) | [state/02 Query](../../state/02-tanstack-query.md) |

## 怎么运行

```bash
# 1. 安装依赖
cd 90-lang/examples/dashboard
npm install

# 2. 配置环境变量（可选，默认用内置 mock）
cp .env.example .env

# 3. 启动开发服务器
npm run dev

# 4. 打开 http://localhost:3000
```

> **注意**：本示例的 `/api/users` 接口需要后端。为方便学习，可：
> - 对接任意返回 `User[]` 的 API（配 `NEXT_PUBLIC_API_URL`）。
> - 或用 MSW mock（生产级做法见 [engineering/02 测试](../../engineering/02-testing.md)）。

## 目录结构

```
dashboard/
├── README.md                 ← 你在这里
├── KNOWLEDGE-MAP.md          ← ★ 每个文件对应哪个知识点（核心价值）
├── package.json              ← 完整依赖
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts        ← 设计令牌绑 CSS 变量
├── postcss.config.mjs
├── .env.example
├── .eslintrc.json
├── lib/
│   ├── types.ts              ← 领域类型（集中定义）
│   ├── api.ts                ← API 层（纯请求函数）
│   ├── globals.css           ← 令牌三层 + 暗色
│   └── utils.ts              ← cn() + formatDate
├── stores/
│   ├── useUIStore.ts         ← Zustand 客户端 UI 状态
│   └── usePrefsStore.ts      ← Zustand 持久化偏好
├── hooks/
│   └── useUsers.ts           ← TanStack Query Hook 层
├── components/
│   ├── NavBar.tsx            ← Link 导航 + 主题切换
│   ├── ThemeToggle.tsx       ← next-themes 暗色
│   ├── UserList.tsx          ← Query 四态列表
│   └── UserForm.tsx          ← RHF + Zod 表单
└── app/
    ├── layout.tsx            ← 根布局 + Providers
    ├── providers.tsx         ← QueryClient + ThemeProvider
    ├── page.tsx              ← 首页（Server Component）
    ├── loading.tsx           ← 全局骨架屏
    ├── error.tsx             ← 全局错误兜底
    ├── not-found.tsx         ← 404
    ├── users/
    │   ├── page.tsx          ← 用户管理页
    │   └── loading.tsx       ← 路由级骨架
    └── settings/
        └── page.tsx          ← 设置页（Zustand 持久化）
```

## 阅读建议

1. **先看 [KNOWLEDGE-MAP.md](./KNOWLEDGE-MAP.md)**：理解每个文件"对应什么知识点"。
2. **看 app/layout.tsx + providers.tsx**：理解全局骨架（布局持久化 + Provider 注册）。
3. **看 lib/ 三层（types → api → hooks）**：理解数据架构分层。
4. **看 components/UserList.tsx**：理解异步四态 + Query 缓存。
5. **看 components/UserForm.tsx**：理解 RHF + Zod 表单。
6. **看 lib/globals.css + tailwind.config.ts**：理解令牌三层 + 暗色模式。

## 注意

- 这是**学习用**的最小示例，不是生产级代码（生产要加：鉴权、完善测试、监控、错误上报、API 错误细化等）。
- 重点是**结构清晰、知识点可识别**，而非功能完整。
- 每个关键文件顶部都有 `// 对应 v2: xxx` 注释，方便对照学习。
