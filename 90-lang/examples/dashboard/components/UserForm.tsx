'use client'

// 对应 v2: state/03 React Hook Form + Zod（内部非受控 + 校验+类型）
// 新建用户表单：RHF 管字段（非受控，不触发整表重渲染），Zod 做校验

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateUser } from '@/hooks/useUsers'

// 对应 v2: state/03 一份 Zod schema 同时做校验 + 类型推导
const schema = z.object({
  name: z.string().min(1, '姓名必填'),
  email: z.string().email('邮箱格式错误'),
  role: z.enum(['admin', 'member']),
})
type FormData = z.infer<typeof schema>   // 类型从 schema 派生（对应 v2: 01-12 类型贯穿）

export function UserForm() {
  const create = useCreateUser()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', role: 'member' },
    mode: 'onBlur',           // 对应 v2: state/03 onBlur 校验，不打扰输入
  })

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data)   // 对应 v2: hooks/useUsers mutation 成功后自动失效缓存
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg bg-surface p-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1">
          <input {...register('name')} placeholder="姓名" className="w-full rounded border border-border bg-bg px-3 py-2" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div className="flex-1">
          <input {...register('email')} placeholder="邮箱" className="w-full rounded border border-border bg-bg px-3 py-2" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <select {...register('role')} className="rounded border border-border bg-bg px-3 py-2">
          <option value="member">成员</option>
          <option value="admin">管理员</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
      >
        {create.isPending ? '提交中...' : '添加用户'}
      </button>
    </form>
  )
}
