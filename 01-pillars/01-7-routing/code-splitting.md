# 代码分割与懒加载（Code Splitting）

> 如果把所有页面代码打进一个首屏包，用户打开首页却要下载"设置页、个人页、订单页"的全部代码——首屏必然慢。代码分割让用户**只为当前页面付费**，是首屏性能的关键手段。

## 是什么

代码分割（Code Splitting）指**把打包产物拆成多个小块，按需加载**。懒加载（Lazy Loading）则是**用到时才加载某块代码**。两者配合，让首屏只加载必要代码。

```
不分割：首屏加载 [首页 + 设置 + 订单 + 个人 + ...] 全部 = 2MB，慢
分割后：首屏只加载 [首页] = 300KB，快；点"设置"才加载 [设置] 块
```

一句话边界：**分割是"切成块"，懒加载是"用到才取那块"。** 路由是最自然的分割边界——按页面分块。

## 为什么：为什么按路由分割

回到 [前端的本质](../../00-foundation/frontend-essence.md) 差异 1——首屏体验决定去留。如果首屏要下载整个应用的 JS（用户可能永远不会去的页面），首屏必然慢，尤其弱网/低端机。

按路由分割后：
- **首屏最小化**：只下载首页代码，首屏快。
- **按需付费**：用户去某页面才下载该页代码。
- **并行优势**：多块可并行下载。

> 这是 [01-9 性能](../01-9-performance-ux/README.md) 加载优化的核心手段，也是 [01-12 构建工具](../01-12-architecture-engineering/README.md) 的关键能力。

## 怎么用

### 路由级懒加载 ★ 最常用
把每个路由组件设为**动态 import**，路由匹配时才加载：
```
// React Router + React.lazy
const Settings = React.lazy(() => import('./pages/Settings'))  // 动态导入
const Orders = React.lazy(() => import('./pages/Orders'))

<Route path="/settings" element={<Suspense fallback={<Spinner/>}><Settings/></Suspense>}/>
```
- `import('./pages/Settings')` 返回一个 Promise，加载完成后才渲染组件。
- 用 `<Suspense>` 包裹，加载期间显示 fallback（Spinner/骨架屏），呼应 [异步四态](../01-6-data-fetching/async-four-states.md)。

### 预取（prefetch）配合 ★ 感知优化
懒加载的代价：点链接后要等那块代码下载，有延迟。用预取把延迟藏起来：
- **悬停预取**：鼠标悬停在链接上时（用户大概率要点），提前加载目标页代码。
- **空闲预取**：首屏加载完，用 `requestIdleCallback` 在空闲时预取用户大概率会去的页面。
- **Next.js Link** 默认预取：链接进入视口就预取目标页。

> 预取让懒加载"无感"——用户点的时候代码已经在了，等于没延迟。这是 [感知性能](../01-9-performance-ux/README.md) 的妙用。

### 组件级分割
除了路由，特别大的独立组件（如富文本编辑器、图表库）也可单独分割，用到才加载：
```
const Editor = React.lazy(() => import('./HeavyEditor'))
// 只有点"编辑"按钮时才加载编辑器（几十KB甚至MB）
```

## 常见坑

- ❌ **懒加载不用 Suspense**：组件还没加载完就渲染，报错或白屏。
  - ✅ 正例：`React.lazy` 必须配 `<Suspense fallback>`。
- ❌ **分割太碎**：每个小组件都分割，导致一堆小请求，HTTP 开销反而增大。
  - ✅ 正例：按路由/大组件分割，颗粒度适中。
- ❌ **懒加载不配预取**：每次点页面都要等下载，体验割裂。
  - ✅ 正例：悬停/空闲预取，藏住延迟。
- ❌ **共享依赖重复打包**：两个页面都用了 lodash，分割后各打一份。构建工具的 vendor 分包能共享公共依赖（详见 [01-12 构建工具](../01-12-architecture-engineering/README.md)）。

## 关联（双向打通）

- **依赖 ↓**：[01-12 构建工具](../01-12-architecture-engineering/README.md)、[01-6 异步四态（加载态）](../01-6-data-fetching/async-four-states.md)
- **属于 ↑**：[01-7 路由与导航](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 首屏性能 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 感知性能（预取）→ [01-9 性能与体验](../01-9-performance-ux/README.md)
  - Suspense 与流式渲染 → [01-4 渲染调度](../01-4-rendering/rendering-scheduling.md)
