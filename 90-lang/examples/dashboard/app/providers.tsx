'use client'

// 对应 v2: state/02 TanStack Query Provider + styling/03 next-themes
// 全局 Provider 集中注册

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,             // 对应 v2: state/02 30s 内算新鲜
            refetchOnWindowFocus: true,    // 窗口聚焦刷新
            retry: 1,
          },
        },
      }),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* 对应 v2: styling/03 attribute="class" 配合 .dark 令牌切换 */}
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
