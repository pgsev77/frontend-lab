// 对应 v2: nextjs/02 子路由 + state/02 TanStack Query 客户端数据
// /users：客户端组件，用 TanStack Query 获取+缓存用户列表

import { UserList } from '@/components/UserList'
import { UserForm } from '@/components/UserForm'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">用户管理</h1>
      <UserForm />
      <UserList />
    </div>
  )
}
