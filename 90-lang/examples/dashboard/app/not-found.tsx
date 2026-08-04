// 对应 v2: nextjs/02 not-found + v1: 01-7 导航体验 404 兜底

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="space-y-4 p-8 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted">页面不存在</p>
      <Link href="/" className="inline-block rounded bg-primary px-4 py-2 text-white hover:opacity-90">
        回首页
      </Link>
    </div>
  )
}
