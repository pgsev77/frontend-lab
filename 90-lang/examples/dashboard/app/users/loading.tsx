// 对应 v2: nextjs/02 路由级 loading（/users 加载时骨架屏）

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-32 animate-pulse rounded bg-surface" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded bg-surface" />
      ))}
    </div>
  )
}
