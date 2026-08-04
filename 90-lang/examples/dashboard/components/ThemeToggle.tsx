'use client'

// 对应 v2: styling/03 next-themes 暗色模式切换
// 主题切换按钮：读/切主题

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免水合不一致：挂载后才渲染（next-themes 在客户端才知道实际主题）
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span className="w-8" />

  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded bg-bg px-3 py-1.5 text-sm hover:opacity-80"
      aria-label={isDark ? '切换到亮色' : '切换到暗色'}
    >
      {isDark ? '☀️ 亮色' : '🌙 暗色'}
    </button>
  )
}
