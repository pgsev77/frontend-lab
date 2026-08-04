# 状态层（v2-4）

> Zustand（客户端状态）、TanStack Query（服务端状态）、表单状态的落地。

## 详细大纲（→ 点击标题阅读）

### [01. Zustand 客户端状态](./01-zustand.md)
- store 创建、selector 精确订阅、派生状态、persist 持久化
- vs Redux/Context、何时该用 Zustand
- 对应 v1：[01-5 全局状态方案](../../01-pillars/01-5-state-management/global-state-solutions.md)

### [02. TanStack Query 服务端状态](./02-tanstack-query.md)
- useQuery 异步四态、queryKey 设计、mutation 失效、乐观更新
- staleTime vs gcTime、与 Server Components 分工
- 对应 v1：[01-6 客户端缓存](../../01-pillars/01-6-data-fetching/client-cache.md)

### [03. 表单状态](./03-form-state.md)
- React Hook Form（内部非受控）+ Zod（校验+类型）
- 校验时机（onBlur）、异步校验、Server Actions 提交
- 对应 v1：[01-8 表单状态](../../01-pillars/01-8-interaction-forms/form-state.md)

## 学完应能回答
- Zustand 怎么 selector 订阅？为什么别订阅整个 store？
- TanStack Query 的 queryKey 怎么设计？mutation 后怎么让列表刷新？
- React Hook Form 为什么内部非受控？Zod schema 怎么同时做校验和类型？
