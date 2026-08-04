'use client'

// 对应 v2: nextjs/03 Link 导航 + react/01 客户端组件（含交互）
// 全局导航：Link 预取 + 主题切换

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: '首页' },
  { href: '/users', label: '用户' },
  { href: '/settings', label: '设置' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div className="flex gap-4">
          {links.map((l) => (
            // 对应 v2: nextjs/03 Link 默认预取，悬停/视口即拉目标页
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded px-3 py-1.5 transition',
                pathname === l.href ? 'bg-primary text-white' : 'hover:bg-bg',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
