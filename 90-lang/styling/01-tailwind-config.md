# Tailwind 配置（Next.js 落地）

> 对应 v1：[01-3 原子化 CSS](../../01-pillars/01-3-styling/atomic-css.md) · [01-3 CSS 架构演进](../../01-pillars/01-3-styling/css-architecture-evolution.md)

## 它解决什么

`create-next-app --tailwind` 自动配好 Tailwind，但要理解配置才能定制。这篇讲 Tailwind 在 Next.js 的配置、content 扫描、扩展主题，把 v1 [01-3 原子化 CSS](../../01-pillars/01-3-styling/atomic-css.md) 落地。

## 基本用法：原子化组合

```tsx
export function Card({ title }: { title: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  )
}
```
每个 class 单职责，组合出样式。呼应当前 v1 [01-3 原子化](../../01-pillars/01-3-styling/atomic-css.md)——不写自定义 class，用预设工具类拼。

**响应式与状态前缀**（呼应当前 v1 [01-3 响应式](../../01-pillars/01-3-styling/responsive-evolution.md)）：
```tsx
<button className="w-full md:w-auto hover:bg-blue-600 disabled:opacity-50 focus:ring-2">
  提交
</button>
```

## 配置文件：tailwind.config.ts

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',       // ★ 扫描这些文件，找出用到的 class
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {                     // ★ extend 而非覆盖，保留默认值
      colors: {
        brand: '#1677ff',         // 自定义颜色
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}
export default config
```

### content 扫描 ★ 关键
Tailwind 靠扫描 `content` 里的文件，**只生成用到的 class**（PurgeCSS）。漏配 content → 用到的 class 被当作"没用"删掉，样式失效。

### extend vs 覆盖
- `theme.extend`：在默认基础上加（保留默认）。
- 直接写 `theme.colors`：**覆盖**默认（失去 Tailwind 自带调色板）。**几乎总是用 extend**。

## globals.css：Tailwind 指令

```css
/* app/globals.css */
@tailwind base;       /* Preflight（CSS reset） */
@tailwind components; /* 组件层（通常空，按需） */
@tailwind utilities;  /* 工具类（核心） */
```

## 何时抽象组件（呼应当前 v1 三次法则）

呼应当前 v1 [01-2 复用陷阱](../../01-pillars/01-2-componentization/reuse-pitfalls.md)——别过早抽象：
```tsx
// ❌ 只用一次就抽成 Button 组件
// ✅ 重复 3 次以上再抽，抽成 React 组件（不是 @apply class）
function Button({ children }: { children: React.ReactNode }) {
  return <button className="rounded-md bg-brand px-4 py-2 text-white hover:bg-brand-600">{children}</button>
}
```

> **避免滥用 `@apply`**：`@apply` 把 Tailwind 退化回"自定义 class"，失去体积/一致性优势。重复的结构抽成 React 组件，而非 @apply 成 class。呼应当前 v1 [01-3 原子化](../../01-pillars/01-3-styling/atomic-css.md)。

## 为什么这样写（设计决策）

- **content 扫描**：只生成用到的 class，产物极小（呼应当前 v1 体积反直觉优势）。
- **extend 优先**：保留 Tailwind 完整调色板，只加项目专属（呼应当前 v1 [01-3 设计令牌](../../01-pillars/01-3-styling/design-tokens.md) 的分层）。
- **抽组件不抽 class**：保持原子化的体积优势，复用走组件层（呼应当前 v1 [01-2 组件化](../../01-pillars/01-2-componentization/README.md)）。

## 常见坑

- ❌ **content 漏配**：用到的 class 被删，样式失效。确保扫描所有含 class 的文件。
- ❌ **theme 覆盖而非 extend**：失去默认调色板。用 extend。
- ❌ **滥用 @apply**：退化成语义化 CSS，失去原子化优势。
- ❌ **任意值滥用 `w-[17px]`**：破坏设计令牌一致性。优先用预设值，特殊值才用 `[]`。

## 关联

- ↑ 对应 v1 原理：[01-3 原子化 CSS](../../01-pillars/01-3-styling/atomic-css.md) · [01-3 CSS 架构演进](../../01-pillars/01-3-styling/css-architecture-evolution.md)
- → v2 相关：[02 设计令牌](./02-design-tokens.md) · [03 主题与响应式](./03-theme-responsive.md)
