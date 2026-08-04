# 90-lang · 语言绑定层（v2，规划中）

> 把 v1 的"语言无关原理"翻译成 **React + Next.js + TypeScript + Tailwind** 的具体工程落地。
> v1 回答"为什么这样设计"，v2 回答"在 React/Next.js 里到底怎么写"。

> **状态：本目录为阶段二的规划占位。v1（`00~09`）先行，v2 待 v1 核心原子笔记完成后实现。**

---

## 一、v2 是什么

`90-lang/` 将是 frontend-lab 的**语言绑定层**。v1（`00~09` 模块）讲的是与语言无关的前端原理，v2 把这些原理落到一个具体的、工业级的技术栈上：

- **框架**：React 18（声明式 UI、Hooks、并发渲染）
- **元框架**：Next.js 14 App Router（路由、SSR/SSG/RSC、数据获取、部署）
- **语言**：TypeScript 5（严格类型）
- **样式**：Tailwind CSS（原子化 CSS）+ 设计令牌
- **状态**：Zustand（客户端状态）+ TanStack Query（服务端状态）
- **表单**：React Hook Form + Zod（校验）

## 二、为什么选 React + Next.js

选 React + Next.js 而非 Vue/Svelte/Solid，核心原因：**与 v1"前端专精、完整覆盖"的定位契合**。

| v1 涵盖的前端能力 | React + Next.js 支持度 |
|---|---|
| 声明式 UI 与组件化 | ✅ React 原生 |
| Hooks（状态/副作用） | ✅ React 原生 |
| 渲染机制（vDOM/并发） | ✅ React Fiber |
| 客户端状态 | ✅ Zustand |
| **服务端状态（缓存）** | ✅ TanStack Query |
| 路由（嵌套/数据路由） | ✅ Next.js App Router |
| **SSR/SSG/ISR/RSC** | ✅ Next.js（Vue/Svelte 生态的 Next 对等物成熟度不及 Next.js） |
| 样式方案（原子化） | ✅ Tailwind |
| 表单 | ✅ React Hook Form + Zod |
| 性能优化（分割/Suspense） | ✅ Next.js 原生 |
| TypeScript | ✅ 全栈类型 |

> React + Next.js 是少数能**完整覆盖 v1 全部前端概念**、且生态最成熟的技术栈——这是选它的根本理由。

## 三、与 v1 的关系

```
v1（语言无关原理）  ←——双向交叉引用——→  v2（React/Next.js 落地）

v1: 01-4 渲染机制                  v2: react/03 渲染与重渲染
    "为什么需要虚拟 DOM"                  "React 里 memo/useMemo 怎么用"
         ↑                                   ↑
         └─────  v2 顶部 "> 对应 v1：[链接]"  ─────┘
         └─ v1 关键笔记补 "v2 落地见 [链接]"
```

**阅读方式**：
- 学完 v1 某概念，跳到 v2 看它"具体长什么样"。
- 在 v2 看到某个 React 写法，跳到 v1 查"为什么这样设计"。

## 四、规划目录结构（阶段二实现）

```
90-lang/
├── README.md                ← 你在这里（v2 总纲）
├── nextjs/                  ← Next.js 基础设施（App Router/路由/渲染模式/数据获取/部署）
├── react/                   ← React 核心（组件/Hooks/状态/性能/错误边界）
├── styling/                 ← 样式方案（Tailwind/设计令牌/主题/CSS 架构）
├── state/                   ← 状态层（Zustand/TanStack Query/表单状态）
├── engineering/             ← 工程化（构建/测试/规范/CI-CD）
└── examples/                ← 完整实战串联（示例项目 + KNOWLEDGE-MAP.md）
```

## 五、每篇 v2 笔记的结构（阶段二遵循）

```
# [主题名]（React/Next.js 落地）

> 对应 v1：[v1 概念链接]   ← 双向打通起点

## 它解决什么
在 React/Next.js 里这个概念对应什么机制。

## 怎么实现（含完整可运行代码）
TypeScript + React/Next.js 的真实代码。

## 为什么这样写
落地时的设计选择（呼应 v1 原理，不重复）。

## 常见坑（React/Next.js/Tailwind 特定）
❌ 反例 → ✅ 正例。

## 关联
- 对应 v1 原理 ↑：[链接]
- v2 相关 →：[链接]
```

## 六、阶段二实现计划

1. `nextjs/`：App Router 骨架、路由与布局、渲染模式（CSR/SSR/SSG/RSC）、数据获取、部署
2. `react/`：组件模型、Hooks（useState/useEffect/useMemo）、状态与重渲染、错误边界、性能
3. `styling/`：Tailwind 配置、设计令牌、主题、响应式
4. `state/`：Zustand 客户端状态、TanStack Query 服务端状态、表单状态
5. `engineering/`：构建（Next.js 内置）、测试（Vitest/Playwright）、规范、CI-CD
6. `examples/`：完整可运行的示例项目 + `KNOWLEDGE-MAP.md`（代码↔v1/v2知识点映射）

## 七、约定（阶段二实现时）

- 代码示例**必须可运行**（非伪代码），版本固定为上述技术栈。
- 所有代码遵循 `engineering/` 里的规范。
- `examples/` 下的示例项目是唯一会包含完整 `package.json`/`tsconfig.json` 的可运行项目；其他笔记只展示关键片段。
- v2 与 v1 双向链接：v2 每篇顶部 `> 对应 v1：[链接]`，v1 关键概念补 `v2 落地 ↓` 反向链接。
