# 嵌套路由与布局（Nested Routes & Layout）

> 一个应用不只一个页面孤岛——它有共享的导航栏、侧边栏、页脚，只有中间内容区随路由变。嵌套路由解决"页面共享布局"的问题，是大型应用路由组织的基础。

## 是什么

嵌套路由指**路由按层级嵌套**，父路由渲染共享布局，子路由渲染到布局里的 `<Outlet/>`（内容出口）。这样切换子路由时，父布局保持不动。

```
路由层级:                视图结构:
/admin                   <AdminLayout>      ← 父路由（含侧栏导航）
  /admin/users             <Outlet/>          ← 子路由渲染处
  /admin/orders              <UsersList/>    ← /admin/users 渲染这里
  /admin/settings            <OrdersList/>   ← /admin/orders 渲染这里
```

一句话边界：**嵌套路由让"共享的外壳"和"变化的内容"分离——切内容不动外壳。**

## 为什么：为什么需要嵌套

### 痛点：每个页面重复布局
不用嵌套时，每个页面组件都要自己写一遍导航栏、侧栏：
```
function UsersPage() {
  return <div><Nav/><Sidebar/><UsersList/><Footer/></div>   // 重复
}
function OrdersPage() {
  return <div><Nav/><Sidebar/><OrdersList/><Footer/></div>  // 又重复
}
```
问题：重复代码、布局改一处要改 N 个页面、**切换页面时整个布局（含导航）重新挂载**——导航状态丢失（如展开的菜单收起）、闪烁。

### 嵌套的承诺：布局持久化
父路由（布局）在子路由切换时**不卸载**，只有 `<Outlet/>` 内容区换。好处：
- **状态保持**：侧栏的展开/折叠、滚动位置不丢。
- **性能**：不重复挂载/卸载布局组件。
- **DRY**：布局写一次。

## 怎么用

### 基本结构
```
// 路由配置（以 React Router 为例）
<Route path="/admin" element={<AdminLayout/>}>   // 父路由 = 布局
  <Route path="users" element={<UsersList/>}/>   // 子路由渲染到 Outlet
  <Route path="orders" element={<OrdersList/>}/>
</Route>

// AdminLayout 里要有 Outlet，子路由才渲染得进去
function AdminLayout() {
  return (
    <div class="layout">
      <Sidebar/>
      <main><Outlet/></main>   {/* ★ 子路由在这里渲染 */}
      <Footer/>
    </div>
  )
}
```

### 布局持久化的关键
切子路由时，React 看到父组件（AdminLayout）在树里位置没变 → **复用**它，不重新挂载。只有 `<Outlet/>` 内部的内容因路由匹配变化而替换。所以侧栏的状态自然保留。

> 这个"复用"机制和 [01-4 虚拟 DOM](../01-4-rendering/virtual-dom.md) 的 key 复用同源——只要元素身份（类型+位置）没变，React 就复用而非重建。

### 多层嵌套
布局可以多层嵌套：`应用外壳 > 仪表盘布局 > 区域布局 > 具体页面`。每层各管各的共享部分。

### 索引路由（Index Route）
父路由的"默认子路由"（访问 `/admin` 不带子路径时显示什么）：
```
<Route path="/admin" element={<AdminLayout/>}>
  <Route index element={<Dashboard/>}/>   {/* 访问 /admin 时显示 Dashboard */}
  <Route path="users" element={<UsersList/>}/>
</Route>
```

## 常见坑

- ❌ **忘写 `<Outlet/>`**：父布局组件里没有 Outlet，子路由无处渲染，界面空白。
- ❌ **每个页面重复布局**：不用嵌套，导航栏每个页面写一遍，切换时重挂载、状态丢。
- ❌ **布局组件做了不该做的副作用**：布局在子路由切换时不该重新执行 effect（因为没卸载）。如果发现 effect 反复跑，说明布局被意外重挂载了（检查 key 是否稳定）。
- ❌ **嵌套层级过深难维护**：5 层嵌套的路由配置很难追踪。适当扁平化，或用路由组管理。

## 关联（双向打通）

- **依赖 ↓**：[路由模型](./routing-model.md)、[01-2 组件模型](../01-2-componentization/component-model.md)
- **属于 ↑**：[01-7 路由与导航](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 嵌套路由配合数据加载 → [数据路由](./data-routing.md)
  - 布局持久化与渲染复用 → [01-4 虚拟 DOM](../01-4-rendering/virtual-dom.md)
