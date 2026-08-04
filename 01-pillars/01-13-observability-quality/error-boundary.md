# 错误边界与兜底（Error Boundary & Fallback）

> 一个小组件渲染崩溃，能拖垮整个页面白屏——这是 React 等框架的"渲染错误传染"特性。错误边界把崩溃隔离在局部，让"一处出错不毁全局"，是前端健壮性的关键防线。

## 是什么

错误边界（Error Boundary）指**捕获子组件树的渲染错误，显示降级 UI 而非崩溃白屏**的机制。它是 [防御性哲学](../../00-foundation/frontend-essence.md) 在渲染层的体现。

一句话边界：**没有错误边界，一个 bug 让整页白屏；有了它，bug 只让局部降级，其余照常工作。**

## 为什么：渲染错误为什么会传染

React 等声明式框架，组件树是一体的——任何一个组件渲染时抛错（如 `user.name` 但 user 是 null），错误会**沿组件树向上冒泡**，导致整个应用卸载、白屏。

```
<App>
  <Header/>
  <Main>
    <UserCard user={null} />   // 这里渲染抛错（访问 user.name）
  </Main>
  <Footer/>
</App>
// 没有边界：整个 App 崩溃，全页白屏
// 有边界：UserCard 处的边界捕获，显示"加载失败"，Header/Main 其余/Footer 照常
```

> 这违背"局部失败不该拖垮全局"的防御性原则。错误边界修复这点。

## 怎么用

### React 错误边界
React 用类组件的 `componentDidCatch` / `getDerivedStateFromError` 实现（函数组件暂无原生等价，需用库或类组件包裹）：
```
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }   // 渲染时触发
  componentDidCatch(error, info) { report(error, info) }             // 上报错误
  render() {
    return this.state.hasError
      ? <FallbackUI/>                      // 降级 UI
      : this.props.children                // 正常渲染
  }
}
// 使用：包裹易出错的子树
<ErrorBoundary><UserCard/></ErrorBoundary>
```

### 边界放在哪
- **全局边界**（App 顶层）：兜底所有未捕获的错误，至少不白屏，显示"出错了，刷新"。
- **局部边界**（关键组件/区块）：更细粒度隔离。如 Sidebar、Widget 各包边界，一个挂不影响其他。
- **粒度权衡**：太粗（只全局）一处错影响大区域；太细到处包，啰嗦。关键区域/易错组件单独包。

### 边界兜不住的错误 ★ 重要认知
错误边界**只捕获渲染时的同步错误**，捕获不了：
- 事件处理函数里的错误（onClick 里的 throw）。
- 异步错误（setTimeout/fetch 回调里的错误）。
- useEffect 里的错误。

这些要用 try-catch / 全局 error 事件 / [前端监控](./frontend-monitoring.md) 兜。

### 资源加载失败兜底
图片/脚本加载失败，用元素自身的 onerror：
```
<img src={url} onError={e => e.target.src = '/fallback.png'} />
```

### 降级 UI 的设计
降级界面要：① 不影响周围布局；② 告诉用户"这里出问题了"（而非空白）；③ 提供恢复手段（重试/刷新）。呼应当前[01-6 错误处理](../01-6-data-fetching/error-handling-retry.md) 的优雅降级。

## 常见坑

- ❌ **没全局边界**：任何渲染错全页白屏。
  - ✅ 正例：至少 App 顶层包一个全局边界。
- ❌ **以为边界能兜所有错误**：事件/异步/useEffect 里的错兜不住，要其他手段。
- ❌ **降级 UI 是空白**：用户不知道发生了什么。给提示 + 恢复入口。
- ❌ **边界太细或太粗**：到处包（啰嗦）或只全局（隔离不足）。关键区块包即可。

## 关联（双向打通）

- **依赖 ↓**：[前端本质（防御性）](../../00-foundation/frontend-essence.md)、[01-6 错误处理](../01-6-data-fetching/error-handling-retry.md)
- **属于 ↑**：[01-13 可观测性与质量](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 边界捕获的错误要上报 → [前端监控](./frontend-monitoring.md)
  - 数据层错误处理 → [01-6 错误处理与重试](../01-6-data-fetching/error-handling-retry.md)
