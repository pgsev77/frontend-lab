# 屏幕阅读器与 ARIA（Screen Reader & ARIA）

> 屏幕阅读器把界面"读"给视障用户听。它靠 HTML 语义理解页面，但有些复杂交互（自定义组件、动态更新）语义化 HTML 表达不了——这时需要 ARIA 补充语义。

## 是什么

- **屏幕阅读器（Screen Reader）**：辅助技术，把屏幕内容转成语音/盲文。常见的有 NVDA、JAWS（Windows）、VoiceOver（Mac/iOS）、TalkBack（Android）。
- **ARIA（Accessible Rich Internet Applications）**：一组 HTML 属性，给元素**补充语义**，让屏幕阅读器理解复杂组件。

一句话边界：**语义化 HTML 是首选，ARIA 是补丁——HTML 表达不了的语义才用 ARIA。**

> ARIA 第一法则：**No ARIA is better than bad ARIA.** 用错了 ARIA 比不用更糟——它给屏幕阅读器错误信息，让用户更困惑。

## 为什么：ARIA 解决什么

### 语义化 HTML 的局限
`<button>` 屏幕阅读器读"按钮"，但一个自定义的 `<div>` 做的下拉菜单，屏幕阅读器读不出"这是个下拉、现在展开了、选中了哪项"。ARIA 补这些语义。

### ARIA 的三类用途
| 类别 | 属性 | 作用 |
|---|---|---|
| **角色（role）** | `role="tablist"`/`role="tab"` | 声明"这是什么组件" |
| **状态/属性** | `aria-expanded`/`aria-selected`/`aria-disabled` | 声明"当前状态" |
| **关系/描述** | `aria-label`/`aria-labelledby`/`aria-describedby` | 给元素补说明 |

## 怎么用：常用 ARIA

### role —— 声明组件类型
```
<div role="button" tabindex="0">自定义按钮</div>
<!-- 屏幕阅读器读"按钮"而非"文本" -->
```
但**优先用 `<button>`**——它自带 role、键盘、焦点。只有无法用语义标签时才加 role。

### aria-label / aria-labelledby —— 补充名称
图标按钮没有文字，屏幕阅读器读不出，需补名称：
```
<!-- 图标按钮：aria-label 提供名称 -->
<button aria-label="关闭"><XIcon/></button>
<!-- 读作"关闭 按钮"而非"按钮" -->

<!-- aria-labelledby：用页面上已有的文字命名 -->
<div role="tab" aria-labelledby="tab1-title"><span id="tab1-title">详情</span></div>
```

### aria-hidden —— 对辅助技术隐藏
装饰性元素（图标、纯视觉）对屏幕阅读器无意义，应隐藏避免干扰：
```
<button><XIcon aria-hidden="true"/><span>关闭</span></button>
<!-- 图标对屏幕阅读器隐藏，只读"关闭" -->
```

### aria-live —— 动态内容通告 ★
页面动态更新（如搜索结果、实时通知、表单错误），屏幕阅读器默认不会主动读出来。`aria-live` 让它**通告变化**：
```
<div aria-live="polite" id="search-results">找到 3 条结果</div>
<!-- 内容变化时，屏幕阅读器会读出新内容 -->
```
- `polite`：等屏幕阅读器空闲再读（不打断）。
- `assertive`：立即打断当前朗读（紧急错误）。

### 状态 ARIA
```
<button aria-expanded="false" aria-controls="menu">菜单</button>
<ul id="menu" role="menu" hidden>...</ul>
<!-- 展开：aria-expanded="true"，隐藏移除 -->
```
`aria-expanded`/`aria-selected`/`aria-checked`/`aria-disabled` 让屏幕阅读器知道组件当前状态。

## 常见坑

- ❌ **滥用 ARIA**：到处加 role，破坏原生语义。优先用语义标签。
  - ✅ 正例：用 `<button>` 而非 `<div role="button">`。
- ❌ **加了 role 不补行为**：`role="button"` 但没键盘处理，屏幕阅读器用户以为能按却按不了。
- ❌ **aria-label 和可见文字重复**：按钮上写"关闭"又加 `aria-label="关闭"`，屏幕阅读器读两次。
- ❌ **动态更新无 aria-live**：搜索结果变了，屏幕阅读器用户不知道。

## 关联（双向打通）

- **依赖 ↓**：[a11y 基础](./accessibility-basics.md)、[01-1 语义化 HTML](../01-1-view-fundamentals/semantic-html.md)、[键盘可达性](./keyboard-access.md)
- **属于 ↑**：[01-10 可访问性与多端](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 自定义组件的 a11y → [01-2 组件分类](../01-2-componentization/component-classification.md)
  - 表单错误的 a11y → [01-8 表单校验](../01-8-interaction-forms/form-validation.md)
