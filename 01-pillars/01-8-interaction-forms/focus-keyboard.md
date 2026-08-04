# 焦点与键盘交互（Focus & Keyboard）

> 不是所有用户都用鼠标——键盘用户、屏幕阅读器用户靠 Tab 键和焦点导航。管理好焦点，是可访问性的基础，也是复杂交互（模态框、菜单）的必要功。

## 是什么

- **焦点（Focus）**：当前接收键盘输入的元素（如输入框、按钮）。页面上"按 Tab 能到达"的元素。
- **焦点管理**：控制"当前焦点在哪、Tab 顺序、焦点能否离开某区域"。

一句话边界：**焦点是键盘交互的"光标"——焦点在哪，键盘操作就作用在哪。**

## 为什么：焦点为什么重要

### 可访问性根基
键盘用户（包括很多视障用户）靠 Tab 在元素间移动，靠回车/空格激活。如果焦点管理混乱：
- Tab 顺序跳跃（跳到看不见的元素）。
- 模态框打开后焦点跑到背后页面。
- 自定义组件（如 div 做的按钮）焦点进不去。

这让键盘用户根本用不了。焦点管理是 [01-10 可访问性](../01-10-accessibility-multiplatform/README.md) 的核心。

### 复杂交互必需
模态框、下拉菜单、抽屉——这些组件打开时要**把焦点锁在里面**，关闭后**焦点回到触发元素**。不做焦点管理，体验混乱（Tab 跑到背后、关了不知道焦点去哪）。

## 怎么用

### 哪些元素天然可获得焦点
- `<input>`、`<button>`、`<a href>`、`<select>`、`<textarea>`、`<summary>`。
- **`<div>`、`<span>` 默认不可获焦点**——这是用 div 模拟按钮的最大 a11y 问题（呼应 [01-1 语义化](../01-1-view-fundamentals/semantic-html.md)）。

### tabindex —— 控制焦点行为
| 值 | 行为 |
|---|---|
| 不写 | 默认（可聚焦元素能聚焦，div 等不能） |
| `tabindex="0"` | 让元素进入 Tab 序列（按文档顺序） |
| `tabindex="-1"` | 可编程聚焦（JS 可 focus），但不在 Tab 序列 |
| `tabindex="1+"` | ❌ 别用——强制 Tab 顺序，破坏文档流，难维护 |

```
// 让自定义组件可聚焦（但优先用语义标签）
<div role="button" tabindex="0" onKeyDown={handleKey}>自定义按钮</div>
```

### 焦点陷阱（Focus Trap）★ 模态框关键
模态框打开时，焦点应**锁在框内**循环（Tab 到最后一个再 Tab 回第一个），不能跑到背后页面。关闭后焦点**回到打开它的那个按钮**：
```
function Modal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement   // 记住触发元素
    focusFirstElement(modalRef)
    trapFocus(modalRef)                                  // Tab 锁在框内
    return () => previouslyFocused.focus()              // 关闭时焦点回去
  }, [isOpen])
}
```
> 焦点陷阱是模态框/抽屉组件的必备能力，成熟的 UI 库（如 Radix、Headless UI）内置处理。

### 键盘交互
所有鼠标能做的操作，键盘也应能做。典型键盘约定：
- 回车/空格：激活按钮/选项。
- Esc：关闭模态框/菜单。
- 方向键：在列表/菜单项间移动。
- Tab/Shift+Tab：在焦点元素间前后移动。

> 这些是 WAI-ARIA 的约定（[01-10 a11y](../01-10-accessibility-multiplatform/README.md)）。自定义组件必须实现这些键盘行为，否则对键盘用户不可用。

### 可见的焦点环
聚焦的元素要有**可见的焦点指示**（默认是 outline 环），让键盘用户知道"当前焦点在哪"。
```
❌ *:focus { outline: none }   // 删焦点环，键盘用户彻底迷路
✅ 保留默认 outline，或自定义更明显的焦点样式
```
> 删除焦点环是常见的 a11y 大忌。如果嫌默认丑，自定义更明显的，别直接 none。

## 常见坑

- ❌ **div 模拟按钮，焦点进不去**：键盘用户无法操作。
  - ✅ 正例：用 `<button>`；非要用 div 要加 `tabindex`、`role`、键盘处理。
- ❌ **模态框不锁焦点**：Tab 跑到背后页面，键盘用户迷失。
  - ✅ 正例：焦点陷阱，关闭后焦点回触发元素。
- ❌ **删焦点环**：键盘用户看不到焦点位置。
- ❌ **用 `tabindex="1+"`**：破坏自然 Tab 顺序，维护噩梦。

## 关联（双向打通）

- **依赖 ↓**：[事件系统](./event-system.md)、[01-1 语义化 HTML](../01-1-view-fundamentals/semantic-html.md)
- **属于 ↑**：[01-8 交互与表单](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 焦点是 a11y 的核心 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
  - 模态框/菜单组件的焦点管理 → [01-2 组件分类](../01-2-componentization/component-classification.md)
