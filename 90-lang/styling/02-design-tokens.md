# 设计令牌（Next.js + Tailwind 落地）

> 对应 v1：[01-3 设计令牌与主题](../../01-pillars/01-3-styling/design-tokens.md) · [01-2 设计系统](../../01-pillars/01-2-componentization/design-system.md)

## 它解决什么

v1 [01-3 设计令牌](../../01-pillars/01-3-styling/design-tokens.md) 讲了令牌三层分层（全局→语义→组件）和"单一修改点"。这篇讲在 Tailwind + CSS 变量里怎么实现令牌分层，让换主题只改一层。

## 令牌三层在 Tailwind 的实现 ★

呼应当前 v1 三层模型，用 **CSS 变量 + Tailwind 主题扩展**实现：

```css
/* app/globals.css —— 三层令牌 */

/* ① 全局令牌：原始调色板（无语义） */
:root {
  --color-blue-500: #1677ff;
  --color-gray-900: #1a1a1a;
  --color-gray-50: #f9fafb;
}

/* ② 语义令牌：按用途命名（业务只用这层） */
:root {
  --color-primary: var(--color-blue-500);
  --color-text: var(--color-gray-900);
  --color-bg: #ffffff;
}

/* 暗色模式：只覆盖语义层，全局层不动（呼应当前 v1） */
.dark {
  --color-text: var(--color-gray-50);
  --color-bg: var(--color-gray-900);
}
```

```ts
// tailwind.config.ts —— 把语义令牌注册成 Tailwind 颜色
const config: Config = {
  darkMode: 'class',          // 用 class 切换暗色
  theme: {
    extend: {
      colors: {
        // 用 CSS 变量，运行时可改（主题切换的基础）
        primary: 'var(--color-primary)',
        text: 'var(--color-text)',
        bg: 'var(--color-bg)',
      },
    },
  },
}
```

```tsx
// 业务代码只用语义令牌（永远不写原始值）
export function Card({ title }: { title: string }) {
  return (
    <div className="rounded-lg bg-bg p-4 text-text">   {/* bg-bg = var(--color-bg) */}
      <h2 className="text-primary">{title}</h2>          {/* text-primary */}
    </div>
  )
}
```

> 关键洞察（呼应当前 v1）：**业务只用语义令牌**。换主题只改语义层（`.dark` 里覆盖），全局层和业务代码都不动——这就是"单一修改点"。

## 为什么用 CSS 变量而非 Sass 变量

呼应当前 v1 [01-3 设计令牌](../../01-pillars/01-3-styling/design-tokens.md)：
- **Sass 变量编译时固定**：做不了运行时主题切换。
- **CSS 变量运行时可改**：切 `.dark` class 立即生效，是暗色模式的物理基础。

## 间距/字号令牌

Tailwind 自带间距/字号令牌（`p-4`=16px, `text-lg`=18px），且**强制使用预设值**——这就是令牌的约束力（呼应当前 v1 [01-3 原子化](../../01-pillars/01-3-styling/atomic-css.md) 的一致性优势）：

```tsx
// ✅ 用预设令牌，全站一致
<div className="p-4 gap-2 text-base">

// ❌ 任意值，破坏一致性
<div className="p-[13px] gap-[7px] text-[15px]">
```

## 为什么这样写（设计决策）

- **语义令牌绑 CSS 变量**：让 Tailwind class（如 `text-primary`）既享受 Tailwind 的便利，又支持运行时主题切换。
- **业务禁用原始值**：保证换主题/换品牌只改令牌定义，业务零改动（呼应当前 v1 单一修改点）。
- **间距/字号用预设**：Tailwind 的预设值就是设计令牌，强制一致性。

## 常见坑

- ❌ **业务写原始颜色**：`color: #1677ff` 绕过令牌，主题切换失效。只用语义令牌。
- ❌ **Tailwind 颜色直接写死值**：`colors: { primary: '#1677ff' }` 编译时固定，做不了主题切换。绑 `var(--color-primary)`。
- ❌ **暗色模式改全局层**：要在语义层（`.dark` 覆盖语义令牌），不动全局层。
- ❌ **间距用任意值**：`p-[13px]` 破坏一致性。用预设 `p-3`(12px)/`p-4`(16px)。

## 关联

- ↑ 对应 v1 原理：[01-3 设计令牌与主题](../../01-pillars/01-3-styling/design-tokens.md) · [01-2 设计系统](../../01-pillars/01-2-componentization/design-system.md)
- → v2 相关：[01 Tailwind 配置](./01-tailwind-config.md) · [03 主题与响应式](./03-theme-responsive.md)
