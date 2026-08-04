# 表单状态（React 落地）

> 对应 v1：[01-8 表单状态](../../01-pillars/01-8-interaction-forms/form-state.md) · [01-8 表单校验](../../01-pillars/01-8-interaction-forms/form-validation.md)

## 它解决什么

v1 [01-8 表单状态](../../01-pillars/01-8-interaction-forms/form-state.md) 讲了受控/非受控和"大表单用表单库"。这篇讲 React Hook Form + Zod 怎么写——内部非受控（性能好）、Zod 做校验、TypeScript 类型贯穿。把 v1 在 React 落地。

## 为什么用 React Hook Form（呼应当前 v1）

呼应当前 v1 [01-8 表单状态](../../01-pillars/01-8-interaction-forms/form-state.md)：大表单全受控（每次按键触发整表重渲染）会卡。React Hook Form **内部非受控**（字段值存 ref，不进 React state，输入不触发重渲染），但对外提供受控般的 API（errors/watch）。

## 基本用法 + Zod 校验

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ★ Zod schema：一份定义同时做校验 + 类型推导
const schema = z.object({
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(8, '至少 8 位'),
})
type FormData = z.infer<typeof schema>   // ★ 类型从 schema 派生（类型即契约）

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),       // 集成 Zod 校验
  })

  const onSubmit = async (data: FormData) => {
    await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="邮箱" />
      {errors.email && <span className="text-red-600">{errors.email.message}</span>}

      <input type="password" {...register('password')} placeholder="密码" />
      {errors.password && <span className="text-red-600">{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>{isSubmitting ? '提交中' : '登录'}</button>
    </form>
  )
}
```

**呼应当前 v1 多个概念**：
- `{...register('email')}`：注册字段，非受控（值在 ref，输入不触发重渲染）→ 呼应当前 v1 [01-8 表单状态](../../01-pillars/01-8-interaction-forms/form-state.md) 的非受控性能优势。
- Zod schema：声明式校验 + 类型推导 + 可共享给后端 → 呼应当前 v1 [01-8 校验](../../01-pillars/01-8-interaction-forms/form-validation.md) 的 schema 共享 + [01-12 TS](../../01-pillars/01-12-architecture-engineering/typescript-types.md) 的类型贯穿。
- `errors.email.message`：字段级错误展示 → 呼应当前 v1。

## 校验时机

呼应当前 v1 [01-8 校验](../../01-pillars/01-8-interaction-forms/form-validation.md) 的"onBlur 最佳"：
```tsx
useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onBlur',          // 失焦时校验（不打扰输入过程）
})
```

## 异步校验（呼应当前 v1）

```tsx
const schema = z.object({
  username: z.string().refine(
    async (v) => !(await checkExists(v)),     // 异步查服务端
    '用户名已被占用'
  ),
})
// 注意：异步校验要配合防抖，避免每输一个字符请求（呼应当前 v1 [01-8](../../01-pillars/01-8-interaction-forms/form-validation.md)）
```

## 服务端 action 提交（Next.js 集成）

Next.js Server Actions 让表单直接提交到服务端函数，无需手写 API：

```tsx
// app/login/page.tsx
import { z } from 'zod'

const schema = z.object({ email: z.string().email(), password: z.string().min(8) })

async function loginAction(formData: FormData) {
  'use server'
  const parsed = schema.parse(Object.fromEntries(formData))   // 服务端也校验（呼应当前 v1 后端必须校验）
  // 处理登录...
}

export default function Login() {
  return (
    <form action={loginAction}>   {/* 原生 form action，Next.js 拦截 */}
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">登录</button>
    </form>
  )
}
```
> Server Actions 让"前端表单 + 后端处理"在同一文件，schema 可共享校验。呼应当当前 v1 [03 前后端协作](../../03-engineering/frontend-backend-collab.md) 的"后端必须独立校验"。

## 为什么这样写（设计决策）

- **RHF 内部非受控**：大表单不卡（呼应当前 v1）。
- **Zod 一份 schema 多用**：前端校验 + 类型推导 + 服务端校验，单一来源（呼应当前 v1 [01-12 TS 边界](../../01-pillars/01-12-architecture-engineering/typescript-types.md)）。
- **onBlur 校验**：既及时又不打扰（呼应当前 v1）。

## 常见坑

- ❌ **大表单全受控（useState 每个字段）**：每次按键整表重渲染，卡。用 RHF。
- ❌ **校验只前端**：绕过前端即可攻击，后端必须再校验。呼应当前 v1 [01-11 安全](../../01-pillars/01-11-security/README.md)。
- ❌ **异步校验不防抖**：每输一字符请求服务器。
- ❌ **schema 前后端各写一份**：不一致。共享一份 Zod schema。

## 关联

- ↑ 对应 v1 原理：[01-8 表单状态](../../01-pillars/01-8-interaction-forms/form-state.md) · [01-8 表单校验](../../01-pillars/01-8-interaction-forms/form-validation.md) · [03 前后端协作](../../03-engineering/frontend-backend-collab.md)
- → v2 相关：[01 Zustand](./01-zustand.md) · [react/01 组件与 Hooks](../react/01-components-hooks.md)
