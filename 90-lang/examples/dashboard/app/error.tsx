'use client'

// 对应 v2: nextjs/02 error.tsx 约定 + react/03 错误边界
// 全局错误兜底：渲染出错时显示降级 UI（对应 v1: 01-13 局部失败不拖垮全局）

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold text-red-600">出错了</h2>
      <p className="text-muted">{error.message}</p>
      <button
        onClick={() => reset()}
        className="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
      >
        重试
      </button>
    </div>
  )
}
