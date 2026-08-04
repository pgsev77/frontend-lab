'use client'

// 对应 v2: state/02 TanStack Query 异步四态 + react/02 列表 key
// 用户列表：Query 获取（带缓存/竞态自动处理），按四态渲染

import { useUsers, useDeleteUser } from '@/hooks/useUsers'
import { formatDate } from '@/lib/utils'

export function UserList() {
  const { data: users, isPending, isError, error, refetch } = useUsers()
  const del = useDeleteUser()

  // 对应 v1: 01-6 异步四态，缺一即 bug
  if (isPending) return <p className="text-muted">加载中...</p>
  if (isError) return (
    <div className="space-y-2">
      <p className="text-red-600">加载失败：{error.message}</p>
      <button onClick={() => refetch()} className="rounded bg-primary px-3 py-1 text-white">重试</button>
    </div>
  )
  if (!users || users.length === 0) return <p className="text-muted">暂无用户（empty 态）</p>

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {users.map((u) => (
        // 对应 v1: 01-4 虚拟 DOM + react/02 稳定 key（用 id 不用 index）
        <li key={u.id} className="flex items-center justify-between p-3">
          <div>
            <p className="font-medium">{u.name} <span className="text-xs text-muted">({u.role})</span></p>
            <p className="text-sm text-muted">{u.email} · 创建于 {formatDate(u.createdAt)}</p>
          </div>
          <button
            onClick={() => del.mutate(u.id)}
            disabled={del.isPending}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            删除
          </button>
        </li>
      ))}
    </ul>
  )
}
