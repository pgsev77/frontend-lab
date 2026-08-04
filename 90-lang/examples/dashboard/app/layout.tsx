// 对应 v2: nextjs/02 根布局 + 02 providers 包裹
// 根布局：所有页面共享，持久化不重挂载（对应 v1: 01-7 嵌套布局）

import type { Metadata } from 'next'
import '../lib/globals.css'
import { Providers } from './providers'
import { NavBar } from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Dashboard 示例',
  description: 'frontend-lab v2 集大成示例',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      {/* suppressHydrationWarning: next-themes 改 html class，抑制水合警告（对应 v2: styling/03） */}
      <body className="bg-bg text-text min-h-screen">
        <Providers>
          <NavBar />
          <main className="mx-auto max-w-5xl p-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
