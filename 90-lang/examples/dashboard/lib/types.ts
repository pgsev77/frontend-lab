// 对应 v2: state/03 表单 Zod 类型 + 01-12 TypeScript 类型贯穿
// 所有领域类型集中定义，API/Hook/组件共享

export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  createdAt: string
}

export type UserInput = {
  name: string
  email: string
  role: 'admin' | 'member'
}
