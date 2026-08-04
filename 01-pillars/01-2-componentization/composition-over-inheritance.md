# 组合优于继承（Composition over Inheritance）

> "前端不用继承组织组件"——这是现代前端有别于传统 OOP 的核心设计选择。理解为什么，才能理解 Hooks、render props、HOC 这些"组合模式"为什么被发明。

## 是什么

组织复用代码有两种思路：
- **继承（Inheritance）**：子类继承父类，获得父的能力并扩展。`class B extends A`。
- **组合（Composition）**：把多个独立的能力"拼"在一起，而非从一个父类派生。

前端（尤其 React 等现代框架）**强烈倾向组合**：组件之间通过 props/children/Hooks 拼接，而非通过继承树派生。

一句话边界：**继承是"is-a"（B 是一种 A），组合是"has-a"（B 由 A、C、D 组成）**。前端 UI 复用，"has-a"几乎总是更合适。

## 为什么：继承为什么不适合 UI

### 问题 1：UI 复用是"拼装"，不是"派生"
一个 `Modal` 由 `Header` + `Body` + `Footer` + `Overlay` 组成——这是**拼装**（has-a）。强行用继承写 `class ModalWithHeader extends Modal`，会导致变体爆炸：`ModalWithHeaderAndFooter`、`ModalWithHeaderNoClose`……继承树越深越僵化。

### 问题 2：继承耦合方向是错的
继承是**最强的耦合**——子类依赖父类的全部内部实现，父类一改，所有子类可能崩。而 UI 需要的是**松耦合的拼装**：换一个部件不影响其他部件。

### 问题 3：复用"行为"时，继承拿跨组件的共享逻辑没办法
一个组件想复用"数据获取""日志""权限检查"这些行为，这些行为不属于任何"父类"。继承表达不了"横向复用"，组合（尤其 Hooks）可以。

## 怎么用：四种组合模式

### 1. children / 插槽——最基础
```
function Card({ children }) {
  return <div class="card">{children}</div>
}
<Card>
  <任意内容 />       // 调用方决定内容，Card 只管外壳
</Card>
```
适用：容器型组件（布局壳、卡片、对话框）。

### 2. render props——把"渲染什么"作为函数传入
```
function DataFetcher({ url, render }) {
  const data = useFetch(url)
  return render(data)            // 调用方决定怎么渲染数据
}
<DataFetcher url="/api/user" render={data => <UserCard user={data} />} />
```
适用：把"数据/行为"和"渲染"解耦。Hooks 出现后已大量被 Hooks 取代，但理解它有助于理解组合思想。

### 3. HOC（高阶组件）——组件包装组件
```
function withAuth(Component) {
  return function Authed(props) {
    if (!isLoggedIn()) return <Login />
    return <Component {...props} />
  }
}
const ProtectedPage = withAuth(Page)
```
适用：横切关注点（鉴权、日志、埋点）。缺点是嵌套深、props 来源不明（被 HOC 注入的 props 看不出从哪来），现代实践多用 Hooks 替代。

### 4. Hooks——把"逻辑"抽成可复用单元 ★ 现代
```
function useUser() {
  const [user, setUser] = useState(null)
  useEffect(() => { fetch('/api/me').then(setUser) }, [])
  return user
}
// 任意组件复用这个逻辑，无需继承
function Header() { const user = useUser(); return <span>{user?.name}</span> }
```
Hooks 是"组合逻辑"的现代答案——把状态ful逻辑抽成独立函数，任意组件调用，**彻底绕开继承**。详见 [01-4 渲染机制](../01-4-rendering/README.md) 与 [01-5 状态管理](../01-5-state-management/README.md)。

## 常见坑

- ❌ **用继承做组件变体**：`class PrimaryButton extends Button`、`class LargeButton extends Button`……变体一多，继承树失控。
  - ✅ 正例：用 props 控制变体（`<Button variant="primary" size="lg">`），用组合拼装。
- ❌ **HOC 滥用导致 props 地狱**：层层 HOC 包装，`props` 里莫名多出一堆字段，调试时不知道谁注入的。
  - ✅ 正例：能用 Hooks 就别用 HOC；HOC 只用于真正需要"包裹渲染"的场景。
- ❌ **以为"组合优于继承"等于"永远不能用 class**"：组合是组织思想，和语法（class/函数）正交。关键是别用继承树组织组件。

## 关联（双向打通）

- **依赖 ↓**：[组件模型](./component-model.md)（props/children 是组合的基础）
- **属于 ↑**：[01-2 组件化与复用](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - Hooks 是组合逻辑的现代方案 → [01-4 渲染机制](../01-4-rendering/README.md)
  - 组件变体的 API 设计 → [组件 API 设计](./component-api.md)
  - 组合与复用的权衡 → [复用陷阱](./reuse-pitfalls.md)
