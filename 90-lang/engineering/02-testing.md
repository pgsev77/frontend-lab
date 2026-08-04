# 测试（Next.js + React 落地）

> 对应 v1：[03 测试策略](../../03-engineering/testing-strategy.md) · [01-13 测试](../../01-pillars/01-13-observability-quality/testing.md) · [01-13 测试原则](../../01-pillars/01-13-observability-quality/testing-principles.md)

## 它解决什么

v1 [03 测试策略](../../03-engineering/testing-strategy.md) 讲了测试金字塔和"测行为不测实现"。这篇讲 Next.js + React 技术栈的具体测试工具：Vitest（单元/组件）、Playwright（E2E）、Testing Library。

## 工具选型

| 层级 | 工具 | 测什么 |
|---|---|---|
| 单元测试 | **Vitest** | 纯函数、工具、Hook、Zod schema |
| 组件测试 | **Vitest + Testing Library** | 单组件渲染与交互 |
| E2E | **Playwright** | 真实浏览器跑用户流程 |

> 选 Vitest 而非 Jest：Vitest 原生 ESM、与 Vite/Next 生态契合、配置简单、快。呼应当前 v1 [01-13 测试](../../01-pillars/01-13-observability-quality/testing.md)。

## 组件测试：测行为不测实现 ★

呼应当前 v1 [01-13 测试原则](../../01-pillars/01-13-observability-quality/testing-principles.md)——用 Testing Library，按用户视角测：

```tsx
// components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('输入邮箱密码点提交，调用 onSubmit', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    // 按用户视角操作（用 label/role 找元素，不用 CSS class）
    await userEvent.type(screen.getByLabelText('邮箱'), 'a@b.com')
    await userEvent.type(screen.getByLabelText('密码'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '登录' }))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'password123' })
  })

  it('邮箱格式错显示错误', async () => {
    render(<LoginForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByLabelText('邮箱'), 'bad')
    await userEvent.tab()   // 触发 onBlur 校验
    expect(screen.getByText('邮箱格式错误')).toBeInTheDocument()
  })
})
```

**关键原则**（呼应当前 v1）：
- ✅ 用 `getByLabelText`/`getByRole` 找元素（用户视角，抗重构，顺便测了 a11y）。
- ❌ 不用 `querySelector('.submit-btn')`（实现细节，重构就断）。
- 测"输入 X → 点提交 → 调 onSubmit"（行为），不测"setState 经历哪些值"（实现）。

## 单元测试：纯逻辑

```tsx
import { describe, it, expect } from 'vitest'
import { formatPrice, calcTotal } from './utils'

describe('calcTotal', () => {
  it('累加价格', () => { expect(calcTotal([{ price: 10 }, { price: 20 }])).toBe(30) })
  it('空数组返 0', () => { expect(calcTotal([])).toBe(0) })   // 边界（呼应当前 v1）
})
```

## Mock：MSW 拦截请求

呼应当前 v1 [03 测试策略](../../03-engineering/testing-strategy.md)——用 MSW 拦截请求，测试不依赖真实 API：

```tsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'Alice' }]))
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## E2E：Playwright

```tsx
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('用户可登录', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'a@b.com')
  await page.fill('[name=password]', 'password123')
  await page.click('text=登录')
  await expect(page).toHaveURL('/dashboard')   // 关键流程（呼应当前 v1，E2E 只测核心路径）
})
```

## 为什么这样写（设计决策）

- **Vitest + Testing Library**：测行为不测实现，抗重构（呼应当前 v1 [01-13 原则](../../01-pillars/01-13-observability-quality/testing-principles.md)）。
- **MSW mock**：测试不依赖网络/真实后端，稳定可重复（呼应当前 v1）。
- **E2E 只测核心流程**：不多（慢且脆），呼应当前 v1 金字塔。

## 常见坑

- ❌ **测实现细节**：`expect(wrapper.state('xxx'))`/`querySelector`，重构就断。测行为。
- ❌ **E2E 滥用**：什么都 E2E，CI 慢且 flaky。只核心流程。
- ❌ **测试互相依赖**：A 创建数据 B 用。每个测试独立 setup。
- ❌ **追 100% 覆盖率**：简单展示组件也测，低价值。测关键逻辑。

## 关联

- ↑ 对应 v1 原理：[03 测试策略](../../03-engineering/testing-strategy.md) · [01-13 测试](../../01-pillars/01-13-observability-quality/testing.md) · [01-13 测试原则](../../01-pillars/01-13-observability-quality/testing-principles.md)
- → v2 相关：[03 规范与 CI](./03-conventions-ci.md) · [state/03 表单](../state/03-form-state.md)
