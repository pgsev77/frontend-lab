'use client'

// 对应 v2: state/02 TanStack Query Hook 层 + v1: 01-6 数据架构（API层+Hook层分离）
// 把 userApi 封装成带缓存/竞态/四态的 Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/api'
import type { UserInput } from '@/lib/types'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],            // 对应 v2: state/02 稳定的 cache key
    queryFn: () => userApi.list(),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UserInput) => userApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })   // 对应 v2: state/02 变更后失效自动重取
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
