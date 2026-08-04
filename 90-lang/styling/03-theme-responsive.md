# 主题与响应式（Next.js + Tailwind 落地）

> 对应 v1：[01-3 响应式样式的演进](../../01-pillars/01-3-styling/responsive-evolution.md) · [01-10 响应式设计](../../01-pillars/01-10-accessibility-multiplatform/responsive-design.md) · [01-10 颜色与对比度](../../01-pillars/01-10-accessibility-multiplatform/color-contrast.md)

## 它解决什么

v1 讲了暗色模式和移动优先响应式的原理。这篇讲在 Next.js + Tailwind 里：暗色模式怎么实现（next-themes）、响应式断点怎么用、对比度/可访问性怎么保证。

## 暗色模式：next-themes ★

```tsx
// app/providers.tsx
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
// attribute="class"：通过加 .dark class 切换（配合 [02 设计令牌](./02-design-tokens.md) 的 .dark）
// enableSystem：跟随系统暗色设置（呼应当前 v1 prefers-color-scheme）
```

```tsx
// app/layout.tsx —— 包裹 Providers
import { Providers } from './providers'
export default function RootLayout({ children }) {
  return <html suppressHydrationWarning><body><Providers>{children}</Providers></body></html>
  // suppressHydrationWarning：next-themes 会改 html 的 class，抑制水合警告
}
```

```tsx
// 组件里读/切主题
'use client'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>切换</button>
}
```

> next-themes 解决了"暗色模式闪屏（FOUC）"和"跟随系统"等问题——手动实现易踩坑，用成熟库。

## 响应式：Tailwind 移动优先断点

呼应当前 v1 [01-3 响应式演进](../../01-pillars/01-3-styling/responsive-evolution.md) 的移动优先——Tailwind 默认就是移动优先（基础样式是手机，`md:` 以上增强）：

```tsx
export function Grid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 手机：1列（基础）；平板(md)：2列；桌面(lg)：3列 */}
      {items.map(i => <Card key={i.id} item={i} />)}
    </div>
  )
}
```

**Tailwind 默认断点**：
| 前缀 | 断点 |
|---|---|
| (无) | 0（手机，基础） |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

**无断点自适应**（呼应当前 v1 [01-3 现代布局](../../01-pillars/01-3-styling/modern-layout.md)）：
```tsx
<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  {/* 容器够宽就多列，不够自动换行，无需断点 */}
</div>
```

## 对比度与可访问性

呼应当前 v1 [01-10 颜色对比度](../../01-pillars/01-10-accessibility-multiplatform/color-contrast.md)——暗色模式要校验对比度（WCAG AA 4.5:1）。用语义令牌（[02](./02-design-tokens.md)）让亮/暗各有一套对比度达标的值，而非简单反色。

**不只靠颜色**（呼应当前 v1）：
```tsx
// 错误态：颜色 + 图标 + 文字（色盲也能识别）
<div className="flex items-center gap-2 text-red-600">
  <ErrorIcon /> <span>格式错误</span>
</div>
```

## 动画与 reduced-motion

呼应当前 v1 [01-3 动画](../../01-pillars/01-3-styling/animation-transition.md) 的可访问性——尊重系统"减少动画"设置：
```tsx
// Tailwind 配置里加 reduced-motion 变体，或用内置 motion-reduce:
<div className="animate-spin motion-reduce:animate-none">加载</div>
```

## 为什么这样写（设计决策）

- **next-themes 而非手撸**：解决闪屏/系统跟随/水合等坑，成熟可靠。
- **移动优先**：Tailwind 默认移动优先，符合 v1 [01-3 响应式](../../01-pillars/01-3-styling/responsive-evolution.md) 的最佳实践。
- **语义令牌保证对比度**：暗色模式不是简单反色，要各模式校验对比度。

## 常见坑

- ❌ **手撸暗色模式闪屏**：初次渲染时主题未确定，闪一下亮色。用 next-themes。
- ❌ **忘 suppressHydrationWarning**：next-themes 改 html class 触发水合警告。
- ❌ **桌面优先写法**：`grid-cols-3 md:grid-cols-1`（默认桌面，移动降级）。应移动优先 `grid-cols-1 md:grid-cols-3`。
- ❌ **暗色模式不校验对比度**：暗背景灰字看不清。用语义令牌各模式达标。

## 关联

- ↑ 对应 v1 原理：[01-3 响应式演进](../../01-pillars/01-3-styling/responsive-evolution.md) · [01-10 响应式设计](../../01-pillars/01-10-accessibility-multiplatform/responsive-design.md) · [01-10 颜色与对比度](../../01-pillars/01-10-accessibility-multiplatform/color-contrast.md)
- → v2 相关：[02 设计令牌](./02-design-tokens.md) · [01 Tailwind 配置](./01-tailwind-config.md)
