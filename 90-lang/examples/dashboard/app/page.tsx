// 对应 v2: nextjs/04 Server Component 首页 + 05 数据获取
// 首页是 Server Component（默认），服务端渲染，0 客户端 JS

import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard 示例</h1>
      <p className="text-muted">
        这是 frontend-lab v2 的集大成示例，串联 App Router / Server Components / TanStack Query /
        Zustand / Tailwind / 暗色模式 / 表单 / 错误边界。
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/users" className="rounded-lg bg-surface p-4 hover:bg-primary hover:text-white transition">
          <h2 className="font-semibold">用户管理 →</h2>
          <p className="text-sm text-muted">CRUD + TanStack Query 缓存</p>
        </Link>
        <Link href="/settings" className="rounded-lg bg-surface p-4 hover:bg-primary hover:text-white transition">
          <h2 className="font-semibold">设置 →</h2>
          <p className="text-sm text-muted">Zustand 持久化偏好</p>
        </Link>
      </div>
    </div>
  )
}
