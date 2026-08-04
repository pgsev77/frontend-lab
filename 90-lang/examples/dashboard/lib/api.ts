// 对应 v2: nextjs/05 数据获取 + v1: 01-6 数据架构位置（API 层定义契约）
// API 层：纯请求函数，返回类型化数据。Hook 层在此基础上套缓存

import type { User, UserInput } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`请求失败：${res.status}`)
  return res.json() as Promise<T>
}

// 集中管理用户相关 API（一处定义，多处复用）
export const userApi = {
  list: () => request<User[]>('/users'),
  get: (id: string) => request<User>(`/users/${id}`),
  create: (data: UserInput) => request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UserInput) =>
    request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' }),
}
