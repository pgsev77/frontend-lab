# Zustand 客户端状态（React 落地）

> 对应 v1：[01-5 全局状态方案](../../01-pillars/01-5-state-management/global-state-solutions.md) · [01-5 状态粒度与订阅](../../01-pillars/01-5-state-management/state-subscription.md)

## 它解决什么

v1 [01-5 状态分类](../../01-pillars/01-5-state-management/state-classification.md) 明确：**客户端 UI 状态**（当前 Tab、弹窗、本地计数）该用 Zustand 管，别和接口数据混。这篇讲 Zustand 怎么建 store、怎么 selector 精确订阅、怎么持久化。把 v1 [01-5 全局状态方案](../../01-pillars/01-5-state-management/global-state-solutions.md) 在 React 落地。

## 创建 store

```tsx
// stores/useUIStore.ts
import { create } from 'zustand'

type UIState = {
  sidebarOpen: boolean
  activeTab: string
  toggleSidebar: () => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeTab: 'home',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
```

## selector 精确订阅 ★

呼应当前 v1 [01-5 状态订阅](../../01-pillars/01-5-state-management/state-subscription.md)——只订阅用到的字段，避免无关变化触发重渲染：

```tsx
'use client'
import { useUIStore } from '@/stores/useUIStore'

function Sidebar() {
  // ✅ selector：只订阅 sidebarOpen。activeTab 变了，本组件不重渲染
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  return <aside className={sidebarOpen ? 'block' : 'hidden'}>...</aside>
}

function Tabs() {
  const activeTab = useUIStore((s) => s.activeTab)   // 只订阅 activeTab
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  return <nav>...</nav>
}
```

> 别 `useUIStore((s) => s)`（订阅整个 store）——任何字段变都重渲染，失去 Zustand 的性能优势。呼应当前 v1 粗粒度订阅的性能问题。

## 派生状态（呼应当前 v1 单一数据源）

呼应当前 v1 [01-5 状态订阅](../../01-pillars/01-5-state-management/state-subscription.md)——能算出来的不存：

```tsx
// ❌ 冗余存储：badgeCount 单独存，items 变了要手动同步
// ✅ 派生：从 items 算
const itemCount = useUIStore((s) => s.items.length)   // 自动派生，单一来源
```

## 持久化（localStorage）

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'user-prefs' }   // 自动存到 localStorage，刷新恢复
  )
)
```
呼应当前 v1 [01-5 状态分类](../../01-pillars/01-5-state-management/state-classification.md) 的"本地持久状态"——用户偏好跨刷新保留。

## 为什么用 Zustand 而非 Redux/Context

呼应当前 v1 [01-5 全局状态方案](../../01-pillars/01-5-state-management/global-state-solutions.md)：
- **vs Redux**：Zustand API 极简（一个 create），无样板（action type/reducer）；selector 精确订阅，性能好。中小型项目首选。
- **vs Context**：Context 值变所有消费者全重渲染；Zustand selector 只订阅用到的。高频/大对象用 Zustand。

## 何时该用 Zustand

呼应当前 v1 [01-5 状态架构](../../01-pillars/01-5-state-management/state-architecture.md) 决策树——只放**跨组件共享的客户端 UI 状态**：
- ✅ 当前 Tab、侧栏开关、全局 toast、用户偏好。
- ❌ 接口数据 → 用 [02 TanStack Query](./02-tanstack-query.md)（服务端状态）。
- ❌ 路由/筛选/分页 → 用 URL（[nextjs/03 路由](../nextjs/03-routing-layout.md) 的 searchParams）。
- ❌ 只一个组件用的 → 用 useState。

## 为什么这样写（设计决策）

- **selector 订阅**：精确控制重渲染范围（呼应当前 v1 性能）。
- **persist 中间件**：统一管理持久化，不散落 localStorage 调用（呼应当前 v1 状态架构分层）。
- **只管客户端状态**：严格区分客户端/服务端/URL 状态（呼应当前 v1 状态分类）。

## 常见坑

- ❌ **订阅整个 store**：`useStore((s) => s)` 任何字段变都重渲染。用 selector。
- ❌ **把接口数据塞进 Zustand**：手动 refetch 泥潭。接口数据用 Query。
- ❌ **selector 返回新对象**：`useStore((s) => ({ a: s.a, b: s.b }))` 每次新引用，永远不等，反而每次重渲染。分别订阅 a 和 b，或用 shallow。
- ❌ **全局化本该局部的状态**：一个弹窗开关也放全局。局部用 useState。

## 关联

- ↑ 对应 v1 原理：[01-5 全局状态方案](../../01-pillars/01-5-state-management/global-state-solutions.md) · [01-5 状态粒度与订阅](../../01-pillars/01-5-state-management/state-subscription.md) · [01-5 状态架构](../../01-pillars/01-5-state-management/state-architecture.md)
- → v2 相关：[02 TanStack Query](./02-tanstack-query.md) · [03 表单状态](./03-form-state.md)
