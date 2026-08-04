// 对应 v2: nextjs/02 loading.tsx 约定 + v1: 01-6 异步四态 loading + 01-9 感知性能骨架屏

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-surface" />
      <div className="h-4 w-full animate-pulse rounded bg-surface" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
    </div>
  )
}
