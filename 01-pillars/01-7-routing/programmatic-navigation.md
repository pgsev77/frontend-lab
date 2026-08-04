# 编程式导航（Programmatic Navigation）

> 不是所有跳转都靠用户点链接——登录成功后跳首页、表单提交后跳结果页、权限不足跳登录。这些"代码触发的导航"叫编程式导航。

## 是什么

编程式导航指**通过代码（而非用户点 `<a>` 链接）触发路由跳转**。它分两类操作：
- **navigate**：跳到一个新地址（压入历史栈，可后退）。
- **redirect**：重定向（替换当前记录，常用于"不该在这个页面"的纠正）。

一句话边界：**链接导航是用户主动的，编程式导航是代码主动的——响应业务事件后跳转。**

## 为什么：什么场景需要代码触发跳转

| 场景 | 触发 |
|---|---|
| 登录成功 | 跳到首页/来源页 |
| 表单提交成功 | 跳到结果页/详情页 |
| 权限不足 | 跳到登录页（带上回来地址） |
| 资源不存在 | 跳到 404 |
| 完成向导某步 | 跳到下一步 |

这些共同点：跳转发生在**某个业务操作完成后**，不是用户点链接。所以要在代码里调导航 API。

## 怎么用

### navigate —— 普通跳转（可后退）
```
// React Router 的 useNavigate
const navigate = useNavigate()
function handleLogin() {
  await login(...)
  navigate('/dashboard')          // 跳到 dashboard，用户可后退回登录页
}
```
压入历史栈，用户点后退能回到跳转前的页面。

### redirect —— 替换（不可后退）★ 区别关键
```
navigate('/login', { replace: true })   // 替换，不进历史栈
```
- **replace**：替换当前历史记录，用户后退**跳过**这个页面。
- **用途**：纠正性跳转——登录后跳首页用 replace（不该让用户后退回登录页再登一次）；权限不足跳登录也用 replace。

> 判断用 navigate 还是 replace：**这个页面用户"后退"到这里合理吗？** 不合理（如登录页、中间跳转页）就用 replace。

### 带状态的导航
跳转时可传 state（不进 URL，但目标页能拿到）：
```
navigate('/order-detail', { state: { from: 'checkout' } })
// 目标页：const location = useLocation(); location.state.from
```
适合"目标页需要知道来源但不想暴露在 URL"的场景。注意 state 不进 URL，刷新会丢——敏感或需持久的信息还是用 URL 参数（[URL 即状态](./url-as-state.md)）。

### 导航拦截（离开确认）
用户在有未保存数据的表单页要点离开时，拦截确认：
```
// React Router 的 unstable_useBlocker 或 beforeunload
useBlocker(() => !isSaved ? '有未保存更改，确定离开？' : false)
// 浏览器原生
window.addEventListener('beforeunload', e => { if (!isSaved) e.preventDefault() })
```
防止用户误操作丢失数据，呼应 [01-8 表单](../01-8-interaction-forms/README.md)。

### 深层链接与回退栈管理
- 应用要支持**深链直达**：用户访问 `/orders/123` 直接到订单详情，不需从首页层层点入。
- 回退栈：每次 navigate 压栈，用户能逐层后退。注意别用 navigate 制造死循环（A→B→A）。

## 常见坑

- ❌ **登录后用 navigate 而非 replace**：用户后退能回到登录页，造成困惑/重复登录。
  - ✅ 正例：纠正性跳转用 replace。
- ❌ **导航放进渲染体**：组件渲染时直接调 navigate，导致渲染中副作用、可能死循环。
  - ✅ 正例：导航放事件处理函数或 effect 里，不在渲染过程调。
- ❌ **未保存数据不拦截离开**：用户误点离开，输入丢失。
- ❌ **依赖回退栈的复杂逻辑**：手动操作历史栈易出错。优先用路由库的导航 API，别直接操作 history。

## 关联（双向打通）

- **依赖 ↓**：[路由模型](./routing-model.md)、[URL 即状态](./url-as-state.md)
- **属于 ↑**：[01-7 路由与导航](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 跳转带状态 vs URL 状态 → [URL 即状态](./url-as-state.md)
  - 导航拦截与表单 → [01-8 交互与表单](../01-8-interaction-forms/README.md)
  - 服务端重定向 → [02 前端进阶](../../02-advanced/README.md)
