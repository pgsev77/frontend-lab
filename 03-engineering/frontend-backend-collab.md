# 前后端协作（Frontend-Backend Collaboration）

> 前端不孤立——它消费后端的接口、依赖后端的数据。前后端协作的顺畅度，直接影响开发效率。接口契约、Mock、联调、BFF 边界，是协作的关键。

## 是什么

前后端协作指**前端和后端如何配合交付**：定接口契约、Mock 并行开发、联调、明确 BFF 边界。

一句话边界：**好协作让前后端"并行开发、低返工"，差协作是"互相等待、反复扯皮"。**

## 为什么：协作不畅的代价

- **联调返工**：接口字段对不上，前端改一遍。
- **互相等待**：前端等后端接口、后端等前端反馈，串行低效。
- **错误处理不一致**：错误码各搞各的，前端难统一处理。
- **边界模糊**：聚合/裁剪逻辑谁做不清，重复或遗漏。

## 怎么用

### 1. 接口契约 ★ 核心
- **契约先行**：前后端先约定字段/类型/错误码/分页/幂等，再各自开发。
- **契约载体**：OpenAPI（Swagger）/ GraphQL Schema / TypeScript 类型共享。
- **类型共享**：用 TypeScript 类型从前端贯穿到后端（或用工具从 OpenAPI 生成前端类型），让接口变更编译器自动报错。呼应当前[01-12 TypeScript](../01-pillars/01-12-architecture-engineering/typescript-types.md) 与 [01-6 数据架构](../01-pillars/01-6-data-fetching/fetch-architecture.md)。

### 2. Mock 并行开发
契约定好后，前端用 **Mock 先行**，不等后端：
- **MSW（Mock Service Worker）**：拦截请求返 Mock，开发/测试都用。呼应当当前[03 测试策略](./testing-strategy.md)。
- 前端按契约 Mock，后端按契约实现，并行推进，最后联调。

### 3. 契约测试（防漂移）
契约可能随时间漂移（后端改了字段没通知前端）。**契约测试**自动验证"后端实际响应符合契约"，漂移时 CI 报错。呼应当当前[01-13 测试](../01-pillars/01-13-observability-quality/testing.md)。

### 4. 错误处理的协作约定
- 统一错误模型：错误码 + 信息 + 详情，前后端共享一套。
- 区分错误类型（网络/服务端/业务），前端据此决定重试还是展示。呼应当前[01-6 错误处理](../01-pillars/01-6-data-fetching/error-handling-retry.md)。

### 5. BFF（Backend for Frontend）边界 ★
当后端是通用 API（微服务），前端要聚合多个接口、裁剪字段、适配视图，这些逻辑放哪？
- **BFF**：前端专属的中间层，做聚合/裁剪/适配，给前端"刚好需要"的数据。
- **边界判断**：
  - 视图相关的聚合/裁剪 → BFF（前端掌控）。
  - 业务规则/数据一致性 → 后端核心服务（不进 BFF）。
- BFF 可由前端团队用 Node 维护，或用 Next.js API Routes / RSC 在框架内做。

### 6. 联调环境与数据
- 提供联调环境（稳定的测试服务器 + 测试数据）。
- 数据准备：覆盖正常/边界/异常的测试数据，方便前端验证四态（呼应当当前[01-6 异步四态](../01-pillars/01-6-data-fetching/async-four-states.md)）。

## 常见坑

- ❌ **无契约各自开发**：联调时字段对不上，大返工。
- ❌ **前端等后端**：不 Mock，串行低效。
- ❌ **类型不共享**：后端改字段，前端运行时才崩。
- ❌ **BFF 边界模糊**：业务逻辑漏进 BFF，或聚合全堆后端导致前端难用。
- ❌ **后端不校验只信前端**：前端校验可绕过，后端必须独立校验。呼应当前[01-8 表单校验](../01-pillars/01-8-interaction-forms/form-validation.md) 与 [01-11 安全](../01-pillars/01-11-security/README.md)。

## 关联（双向打通）

- **依赖 ↓**：[01-6 数据架构](../01-pillars/01-6-data-fetching/fetch-architecture.md)、[01-12 TypeScript（类型共享）](../01-pillars/01-12-architecture-engineering/typescript-types.md)、[01-6 错误处理](../01-pillars/01-6-data-fetching/error-handling-retry.md)
- **属于 ↑**：[03 工程实践](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 契约与数据架构 → [01-6 数据架构](../01-pillars/01-6-data-fetching/fetch-architecture.md)
  - 类型贯穿 → [01-12 TypeScript](../01-pillars/01-12-architecture-engineering/typescript-types.md)
  - BFF 与 SSR → [02 SSR](../02-advanced/ssr-isomorphic.md)
