# KNOWLEDGE-MAP：代码 → 知识点映射

> ★ 这个文件是 Dashboard 示例的核心价值。每一行代码都能追溯到 v1/v2 的某个概念。
> 阅读方法：看到某个文件/某段代码，来这里查"它对应哪个知识点"，再跳过去读原理。

## 整体架构对应

| 代码 | 对应 v1 概念 | 对应 v2 笔记 |
|---|---|---|
| Next.js App Router | [01-7 路由模型](../../../01-pillars/01-7-routing/routing-model.md) | [nextjs/01 选型](../../nextjs/01-stack-overview.md) |
| 默认 Server Component | [02-1 SSR/同构](../../../02-advanced/ssr-isomorphic.md) | [nextjs/04 渲染模式](../../nextjs/04-rendering-modes.md) |
| Tailwind + CSS 变量 | [01-3 设计令牌](../../../01-pillars/01-3-styling/design-tokens.md) | [styling/02 令牌](../../styling/02-design-tokens.md) |
| Zustand 客户端状态 | [01-5 状态分类](../../../01-pillars/01-5-state-management/state-classification.md) | [state/01 Zustand](../../state/01-zustand.md) |
| TanStack Query 服务端状态 | [01-6 客户端缓存](../../../01-pillars/01-6-data-fetching/client-cache.md) | [state/02 Query](../../state/02-tanstack-query.md) |
| TypeScript strict | [01-12 TS 类型系统](../../../01-pillars/01-12-architecture-engineering/typescript-types.md) | [engineering/03 规范](../../engineering/03-conventions-ci.md) |

## 文件级映射

### 配置层

| 文件 | 关键点 | 对应 |
|---|---|---|
| `tsconfig.json` | `strict: true` | v2 [engineering/03](../../engineering/03-conventions-ci.md) + v1 [01-12 TS](../../../01-pillars/01-12-architecture-engineering/typescript-types.md) |
| `tailwind.config.ts` | 语义令牌绑 `var(--color-*)`、`darkMode: 'class'` | v2 [styling/01](../../styling/01-tailwind-config.md) + [02](../../styling/02-design-tokens.md) |
| `.env.example` | `NEXT_PUBLIC_` 边界（客户端可见，不放密钥） | v2 [engineering/01](../../engineering/01-build-deploy.md) + v1 [01-11 安全](../../../01-pillars/01-11-security/other-security.md) |

### lib/（数据与样式基础）

| 文件 | 关键点 | 对应 |
|---|---|---|
| `lib/types.ts` | 领域类型集中定义，全项目共享 | v1 [01-12 类型贯穿](../../../01-pillars/01-12-architecture-engineering/typescript-types.md) |
| `lib/api.ts` | **API 层**：纯请求函数，类型化返回 | v1 [01-6 数据架构](../../../01-pillars/01-6-data-fetching/fetch-architecture.md) 的"API 层" |
| `lib/globals.css` | **令牌三层**（全局→语义→暗色覆盖）+ `@tailwind` 指令 | v2 [styling/02](../../styling/02-design-tokens.md) + [03](../../styling/03-theme-responsive.md) |
| `lib/utils.ts` | `cn()` 合并 class + `Intl.DateTimeFormat` 格式化 | v1 [01-10 国际化用 Intl](../../../01-pillars/01-10-accessibility-multiplatform/internationalization.md) |

### stores/（客户端状态）

| 文件 | 关键点 | 对应 |
|---|---|---|
| `useUIStore.ts` | Zustand store，**只放客户端 UI 状态**（侧栏开关） | v2 [state/01](../../state/01-zustand.md) + v1 [01-5 状态分类](../../../01-pillars/01-5-state-management/state-classification.md) |
| `usePrefsStore.ts` | `persist` 中间件存 localStorage（偏好跨刷新保留） | v2 [state/01 persist](../../state/01-zustand.md) + v1 [01-5 本地持久](../../../01-pillars/01-5-state-management/state-classification.md) |

### hooks/（服务端状态封装）

| 文件 | 关键点 | 对应 |
|---|---|---|
| `hooks/useUsers.ts` | **Hook 层**：把 api 封装成带缓存/竞态/失效的 Query；mutation `onSuccess` 失效 | v1 [01-6 数据架构](../../../01-pillars/01-6-data-fetching/fetch-architecture.md) 的"Hook 层" + v2 [state/02](../../state/02-tanstack-query.md) |

### app/（路由层）

| 文件 | 关键点 | 对应 |
|---|---|---|
| `app/layout.tsx` | **根布局**（持久化不重挂载）+ Providers 包裹 + `suppressHydrationWarning` | v2 [nextjs/02](../../nextjs/02-app-router-structure.md) + [03](../../nextjs/03-routing-layout.md) + v1 [01-7 嵌套](../../../01-pillars/01-7-routing/nested-routes-layout.md) |
| `app/providers.tsx` | QueryClient（staleTime/refetch 配置）+ ThemeProvider | v2 [state/02](../../state/02-tanstack-query.md) + [styling/03](../../styling/03-theme-responsive.md) |
| `app/page.tsx` | **Server Component** 首页（async/无，0 客户端 JS） | v2 [nextjs/04](../../nextjs/04-rendering-modes.md) + v1 [02-1 SSR](../../../02-advanced/ssr-isomorphic.md) |
| `app/loading.tsx` | **骨架屏**（animate-pulse 模拟布局） | v1 [01-9 感知性能](../../../01-pillars/01-9-performance-ux/perceived-performance.md) + v2 [nextjs/02](../../nextjs/02-app-router-structure.md) |
| `app/error.tsx` | **错误边界**（'use client'，reset 重试） | v2 [react/03](../../react/03-error-boundary.md) + v1 [01-13 错误边界](../../../01-pillars/01-13-observability-quality/error-boundary.md) |
| `app/not-found.tsx` | 404 兜底 + 回首页 | v1 [01-7 导航体验](../../../01-pillars/01-7-routing/navigation-ux.md) |
| `app/users/page.tsx` | 子路由组合 UserForm + UserList | v2 [nextjs/02 子路由](../../nextjs/02-app-router-structure.md) |
| `app/settings/page.tsx` | Zustand selector 订阅 + 持久化偏好演示 | v2 [state/01](../../state/01-zustand.md) |

### components/（UI 组件）

| 文件 | 关键点 | 对应 |
|---|---|---|
| `NavBar.tsx` | `Link` 预取导航 + `usePathname` 高亮当前 | v2 [nextjs/03](../../nextjs/03-routing-layout.md) |
| `ThemeToggle.tsx` | next-themes `useTheme` + 挂载后才渲染（防水合不一致） | v2 [styling/03](../../styling/03-theme-responsive.md) |
| `UserList.tsx` ★ | **异步四态**（loading/error/empty/success）+ 稳定 key + mutation 删除 | v1 [01-6 四态](../../../01-pillars/01-6-data-fetching/async-four-states.md) + v2 [state/02](../../state/02-tanstack-query.md) + v1 [01-4 key](../../../01-pillars/01-4-rendering/virtual-dom.md) |
| `UserForm.tsx` ★ | **RHF 非受控** + **Zod schema 校验+类型** + onBlur 时机 | v2 [state/03](../../state/03-form-state.md) + v1 [01-8 表单](../../../01-pillars/01-8-interaction-forms/form-state.md) |

## 核心知识点的代码对照（精读）

### 状态三层分工（对应 v1 [01-5 状态分类](../../../01-pillars/01-5-state-management/state-classification.md)）
```
本示例的三类状态严格分离：
- 服务端状态 → TanStack Query（hooks/useUsers.ts，接口数据缓存）
- 客户端 UI 状态 → Zustand（stores/useUIStore.ts，侧栏开关）
- 本地持久状态 → Zustand persist（stores/usePrefsStore.ts，偏好）
- URL 状态 → Next.js 路由（app/users/ 目录即路由）
绝不混用——这是 v1 状态架构的核心纪律。
```

### 异步四态（对应 v1 [01-6](../../../01-pillars/01-6-data-fetching/async-four-states.md)）
```tsx
// components/UserList.tsx 完整四态：
if (isPending) return <p>加载中...</p>           // loading
if (isError) return <p>失败 + 重试</p>            // error
if (users.length === 0) return <p>暂无用户</p>     // empty（★ 最易漏）
return <ul>...</ul>                               // success
```

### 令牌三层（对应 v1 [01-3 设计令牌](../../../01-pillars/01-3-styling/design-tokens.md)）
```css
/* lib/globals.css */
:root { --color-blue-500: #1677ff }          /* ① 全局令牌（原始） */
:root { --color-primary: var(--color-blue-500) }  /* ② 语义令牌（业务用这层） */
.dark { --color-bg: var(--color-gray-900) }   /* 暗色只覆盖语义层 */
```
```ts
// tailwind.config.ts —— 语义令牌绑 Tailwind 颜色
colors: { primary: 'var(--color-primary)' }
```
```tsx
// 业务只用语义令牌（text-primary/bg-bg），永不写原始值
<div className="bg-bg text-text">...</div>
```

### 数据架构三层（对应 v1 [01-6 数据架构](../../../01-pillars/01-6-data-fetching/fetch-architecture.md)）
```
lib/types.ts   ← 类型定义（User/UserInput）
     ↓
lib/api.ts     ← API 层：userApi.list/get/create（纯请求，类型化）
     ↓
hooks/useUsers.ts  ← Hook 层：useQuery 套缓存 + useMutation 失效
     ↓
components/UserList.tsx  ← 组件层：只管显示，调 hook 拿数据
```
组件不碰请求细节，Hook 不碰 UI——三层各司其职，可独立测试/替换。
