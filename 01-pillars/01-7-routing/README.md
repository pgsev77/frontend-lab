# 01-7 · 路由与导航

> **轴属：状态轴**。路由的本质是"把 URL 当成状态"——当前显示哪个页面、什么筛选条件、第几页，都应该是 URL 的一部分。本支柱回答"怎么用 URL 组织页面、怎么处理嵌套与布局、怎么做代码分割"。

## 本支柱解决什么问题
路由看似只是"点链接跳页面"，实则是状态轴的重要一环：**URL 是可分享、可刷新、可后退的状态**。本支柱回答：**路由模型怎么工作、嵌套路由与布局怎么组织、URL 怎么当状态用、代码分割怎么配合路由**。

## 详细大纲（→ 待填充原子笔记内容）

### 1. 路由模型（Routing Model）
- 客户端路由 vs 服务端路由（多页应用 vs 单页应用）
- History API（pushState/replaceState/popstate）
- Hash 路由 vs Browser 路由（为什么现在都用 Browser 路由）
- 路由匹配（路径参数 /search/:id、通配符、查询参数）

### 2. 嵌套路由与布局（Nested Routes & Layout）
- 为什么需要嵌套（页面共享布局：导航/侧栏/页脚）
- 嵌套路由的渲染：父路由渲染 layout，子路由渲染到 `<Outlet/>`
- 布局持久化（切换子路由时父布局不重渲染/不卸载）
- 路由层级的副作用与生命周期

### 3. 数据路由（Data Routing / Loaders & Actions）
- 新一代路由的范式：路由不只是"显示哪个组件"，还管"加载什么数据、提交什么 action"
- loader：进入路由前并行加载数据（解决请求瀑布）
- action：表单提交/数据变更，配合 loader 自动重新验证
- Remix/Next.js App Router 的数据路由模型
- → 与 [01-6 数据获取](../01-6-data-fetching/README.md) 的关系：路由层获取 vs 组件层获取

### 4. URL 即状态（URL as State）
- 哪些状态该放进 URL：当前页码、筛选条件、排序、Tab、搜索关键词、展开折叠
- 放进 URL 的好处：可分享、可刷新、可后退、可收藏
- 查询参数 vs 路径参数（/search?q=x vs /search/x）
- URL 状态与全局状态（Redux）的边界——能用 URL 就别用 store
- → 呼应 [01-5 状态分类](../01-5-state-management/README.md)

### 5. 代码分割与懒加载（Code Splitting）
- 为什么按路由分割（首屏只加载首页代码）
- 路由级 lazy loading（React.lazy / dynamic import）
- 分割与预取的配合（悬停/空闲时预取下一页）
- 分割的代价（额外请求、瀑布）与权衡

### 6. 导航体验
- 路由切换的过渡（过渡动画、骨架屏）
- 导航中的数据加载态（pending state）
- 滚动恢复（scroll restoration）：后退时回到原位置
- 错误路由（404）与重定向

### 7. 编程式导航
- 命令式导航（navigate/redirect）
- 导航拦截（beforeunload、离开页面确认）
- 深层链接与回退栈管理

## 学完应能回答
- 客户端路由和服务端路由的区别？为什么 SPA 用客户端路由？
- 嵌套路由解决什么问题？布局怎么持久化？
- "URL 即状态"是什么意思？哪些状态该放进 URL？
- 为什么按路由做代码分割？有什么代价？
- loader/action 模型和组件内 fetch 有什么区别？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 状态轴
- **依赖 ↓**：[01-5 状态管理](../01-5-state-management/README.md)（URL 是状态的一种）、[09 网络](../../09-prerequisites/README.md)（History API/HTTP）
- **相关 →**：[01-6 数据获取](../01-6-data-fetching/README.md)（数据路由）、[01-9 性能](../01-9-performance-ux/README.md)（代码分割/首屏）、[02-1 SSR](../../02-advanced/README.md)（服务端路由）
