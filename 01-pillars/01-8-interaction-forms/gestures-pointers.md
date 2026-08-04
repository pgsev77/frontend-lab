# 手势与指针（Gestures & Pointers）

> 鼠标点击、触摸滑动、捏合缩放——不同输入设备产生不同事件。早期要分别处理 mouse 和 touch 事件，代码分叉。Pointer Events 统一了它们，让一套代码适配所有设备。

## 是什么

| 事件类型 | 来源 |
|---|---|
| **鼠标事件**（mousedown/move/up） | 鼠标 |
| **触摸事件**（touchstart/move/end） | 触屏 |
| **指针事件**（pointerdown/move/up）★ | 统一鼠标、触摸、手写笔 |

一句话边界：**Pointer Events 是"统一抽象"，一份代码处理所有指针设备。**

## 为什么：为什么需要 Pointer Events

### 痛点：分叉的事件处理
鼠标和触摸是两套事件。想同时支持 PC（鼠标）和移动（触摸），要么写两套逻辑，要么浏览器还会"触摸时也触发鼠标事件"导致重复处理。代码分叉、行为不一致。

### Pointer Events 的承诺
Pointer Events 把鼠标、触摸、手写笔抽象成统一的"指针"，提供一致的 down/move/up/cancel 事件。一套代码处理所有设备，无需分叉。

**额外能力**：
- `pointerType`：区分来源（mouse/touch/pen）。
- `pressure`：压感（手写笔）。
- 多点触控：每个触点独立 pointerId。

## 怎么用

### 基本指针事件
```
element.addEventListener('pointerdown', e => {
  // e.pointerType: 'mouse' | 'touch' | 'pen'
  // e.clientX/Y: 坐标
  // e.pointerId: 多点触控时区分各点
})
```
down → move（拖动中）→ up（释放）/ cancel（被打断，如来电）。

### 手势识别
基于原始指针事件，识别高级手势：
| 手势 | 识别方式 |
|---|---|
| 点击 | down 后短时间内 up，且位移很小 |
| 长按 | down 后保持不动超过阈值 |
| 拖拽 | down 后 move 超过位移阈值 |
| 滑动（swipe） | 快速单向 move |
| 双指缩放（pinch） | 两个 pointer 距离变化 |
| 双指旋转 | 两个 pointer 角度变化 |

```
// 简化的拖拽：记录 down 位置，move 时算偏移
let startX, startY
el.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; el.setPointerCapture(e.pointerId) })
el.addEventListener('pointermove', e => {
  if (startX == null) return
  const dx = e.clientX - startX, dy = e.clientY - startY
  // 移动元素到 dx, dy 偏移
})
el.addEventListener('pointerup', () => { startX = null })
```

### setPointerCapture ★ 关键
拖拽时，指针可能移出元素范围（如拖得很快），导致 move/up 收不到。`setPointerCapture` 把指针"锁定"到元素，即使移出也继续收到事件——这是拖拽实现的关键。

### 滚动与 passive 事件
触摸事件默认会阻塞滚动（浏览器要等你的处理器跑完才决定要不要滚动），导致滚动卡顿。用 `{ passive: true }` 声明"我不会 preventDefault"，让浏览器立即滚动：
```
// 告诉浏览器我不会阻止滚动，你可以并行滚动
el.addEventListener('touchmove', handler, { passive: true })
```

## 常见坑

- ❌ **还用 mouse + touch 两套事件**：分叉、重复触发。
  - ✅ 正例：用 Pointer Events 统一。
- ❌ **拖拽不用 setPointerCapture**：指针移出元素就丢失 move/up，拖拽中断。
- ❌ **touch 事件不设 passive**：阻塞滚动，移动端卡顿。
  - ✅ 正例：scroll/touchmove 用 passive。
- ❌ **忽视 pointercancel**：拖拽被系统打断（来电、通知），没处理 cancel 导致状态卡住。
  - ✅ 正例：处理 cancel 释放拖拽状态。

## 关联（双向打通）

- **依赖 ↓**：[事件系统](./event-system.md)、[01-1 视口与坐标](../01-1-view-fundamentals/viewport-coordinates.md)
- **属于 ↑**：[01-8 交互与表单](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 拖拽的坐标计算 → [01-1 视口与坐标](../01-1-view-fundamentals/viewport-coordinates.md)
  - 触摸友好与多端 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
  - 复杂手势（拖拽/缩放）实现 → [02 复杂交互](../../02-advanced/README.md)
