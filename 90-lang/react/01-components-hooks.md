# 组件与 Hooks（React 落地）

> 对应 v1：[01-2 组件模型](../../01-pillars/01-2-componentization/component-model.md) · [01-2 组合优于继承](../../01-pillars/01-2-componentization/composition-over-inheritance.md)

## 它解决什么

React 用**函数组件 + Hooks** 组织 UI。这篇讲清 React 里组件怎么写、props/children 怎么用、自定义 Hook 怎么抽逻辑——把 v1 的组件原理在 React 落地。

## 函数组件与 props

```tsx
// 函数组件：接收 props，返回 JSX（呼应当前 v1 组件 = f(props) → UI）
type ButtonProps = {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200'} onClick={onClick}>
      {children}
    </button>
  )
}

// 使用
<Button onClick={() => alert('hi')}>提交</Button>
```

**关键约定**：
- 组件名首字母大写（React 据此区分组件与 HTML 标签）。
- props 只读，永不修改（呼应当前 v1 [01-2 组件模型](../../01-pillars/01-2-componentization/component-model.md) 的单向数据流）。
- children 让组件成容器（呼应当前 v1 组合）。

## 自定义 Hook：把逻辑从组件抽出来 ★

v1 [01-2 组合](../../01-pillars/01-2-componentization/composition-over-inheritance.md) 讲过"Hook 是组合逻辑的现代方案"。React 里把可复用的有状态逻辑抽成 `useXxx`：

```tsx
// hooks/useToggle.ts —— 可复用的开关逻辑
import { useState, useCallback } from 'react'

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(v => !v), [])
  const set = useCallback((v: boolean) => setOn(v), [])
  return { on, toggle, set }
}

// 任意组件复用
function Modal() {
  const { on, toggle } = useToggle(false)
  return on ? <Dialog onClose={toggle} /> : <button onClick={toggle}>打开</button>
}
```

**Hook 规则**（必须遵守）：
- 只在**顶层**调用（不在 if/循环里）——React 靠调用顺序对应 state。
- 只在**组件或自定义 Hook** 里调用。

## children 与组合

```tsx
// 用 children 让组件成容器（外壳模式）
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg shadow p-4">{children}</div>
}

<Card>
  <h2>标题</h2>
  <p>内容</p>
</Card>
```

## 复合组件（context 协作）

呼应当前 v1 [01-2 组件分类](../../01-pillars/01-2-componentization/component-classification.md) 的复合组件模式——子部件通过 context 共享状态：

```tsx
'use client'
import { createContext, useContext, useState } from 'react'

const TabsContext = createContext<{ active: string; setActive: (v: string) => void } | null>(null)

export function Tabs({ defaultActive, children }: { defaultActive: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultActive)
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>
}

export function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  return <button onClick={() => ctx.setActive(value)} aria-selected={ctx.active === value}>{children}</button>
}

export function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  return ctx.active === value ? <div>{children}</div> : null
}

// 用法：声明式组合，子部件隐式协作
<Tabs defaultActive="a">
  <Tab value="a">A</Tab>
  <Tab value="b">B</Tab>
  <TabPanel value="a">内容A</TabPanel>
  <TabPanel value="b">内容B</TabPanel>
</Tabs>
```

## 为什么这样写（设计决策）

- **函数组件 + Hooks 取代 class**：Hooks 让逻辑跨组件复用不再依赖继承/mixin（呼应当前 v1 组合优于继承）。App Router 下 class 组件不支持 RSC，函数组件是唯一选择。
- **'use client' 标记**：含 useState/ useContext 的组件（上面的 Tabs）要 `'use client'`，因为 state 是客户端能力（详见 [nextjs/04 渲染模式](../nextjs/04-rendering-modes.md)）。
- **props 用 TypeScript 类型**：类型即契约（呼应当前 v1 [01-2 组件 API](../../01-pillars/01-2-componentization/component-api.md) + [01-12 TS](../../01-pillars/01-12-architecture-engineering/typescript-types.md)）。

## 常见坑

- ❌ **Hook 放在条件/循环里**：调用顺序变了，state 对不上，bug 难查。永远顶层调用。
- ❌ **直接改 props**：`props.items.push(x)` 破坏单向数据流，引发不可预测渲染。
- ❌ **App Router 里用 class 组件**：RSC 不支持 class。用函数组件。
- ❌ **含 state 的组件忘 'use client'**：服务端组件报错。交互组件加 'use client'。

## 关联

- ↑ 对应 v1 原理：[01-2 组件模型](../../01-pillars/01-2-componentization/component-model.md) · [01-2 组合优于继承](../../01-pillars/01-2-componentization/composition-over-inheritance.md)
- → v2 相关：[02 状态与重渲染](./02-state-rerender.md) · [nextjs/04 渲染模式](../nextjs/04-rendering-modes.md)
