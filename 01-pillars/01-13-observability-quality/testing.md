# 测试（Testing）

> "我改了这段代码，会不会弄坏别的？"——没有测试，这个问题只能靠人工点遍所有功能，慢且不可靠。测试让回归有自动化保障。前端测试有多个层级，各有用途。

## 是什么

前端测试分层级（测试金字塔）：

| 层级 | 测什么 | 数量 | 工具 |
|---|---|---|---|
| **单元测试** | 纯函数、工具、Hook | 多 | Jest/Vitest |
| **组件测试** | 单个组件的渲染与交互 | 中 | Testing Library |
| **E2E 测试** | 真实浏览器的完整用户流程 | 少 | Playwright/Cypress |
| **视觉回归** | UI 是否意外变化 | 少 | Percy/Chromatic |

一句话边界：**测试金字塔"底大顶小"——单元多（快稳）、E2E 少（慢脆）。** 全靠 E2E 会慢得跑不动。

## 为什么：为什么要分层

### 单元测试：快、隔离
测纯逻辑（utils、reducer、复杂计算），毫秒级，不依赖 DOM/网络。跑得快、反馈即时、出问题定位精确。是金字塔的底座，数量最多。

### 组件测试：平衡
测单个组件——给它 props，渲染，断言输出、模拟交互。比单元稍慢但接近真实，比 E2E 快得多。是 React 应用的主力测试。

### E2E：最真实但最贵
开真实浏览器，跑完整流程（登录→下单→支付）。最接近用户体验，但：慢（分钟级）、脆（网络/时序导致偶发失败）、维护贵。只测关键流程，不能多。

> 为什么金字塔底大顶小：越往上越慢越脆。E2E 全覆盖会让 CI 跑半小时、偶发失败消磨信心。单元/组件覆盖多数情况，E2E 只守关键路径。

## 怎么用：各层要点

### 单元测试
```
test('formatDate 格式化日期', () => {
  expect(formatDate('2024-01-01')).toBe('2024年1月1日')
  expect(formatDate(null)).toBe('-')   // 边界
})
```
- 测纯函数的输入输出。
- 快、稳定、覆盖边界和异常。

### 组件测试 ★ 测行为不测实现
```
test('提交表单触发 onSubmit', () => {
  const onSubmit = vi.fn()
  render(<Form onSubmit={onSubmit}/>)
  await userEvent.type(screen.getByLabelText('用户名'), 'alice')
  await userEvent.click(screen.getByRole('button', { name: '提交' }))
  expect(onSubmit).toHaveBeenCalledWith({ username: 'alice' })
})
```
**Testing Library 的哲学：测用户视角的行为，不测实现细节**。
- ✅ 测"用户输入 alice 点提交，调了 onSubmit"——这是用户行为，稳定。
- ❌ 测"组件 setState 了某个值""渲染了 3 个 div"——这是实现细节，重构就断。
> 组件内部实现一重构（如换 state 管理），测实现细节的测试全挂，但这些重构本不该破坏测试。测行为才抗重构。

### E2E 测试
```
test('用户可完成下单', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=user]', 'alice')
  await page.click('text=登录')
  await page.click('text=商品A')
  await page.click('text=下单')
  await expect(page).toHaveText('下单成功')
})
```
- 只覆盖关键业务流程（登录、核心转化）。
- 用 role/text 选择器（贴近用户视角），避免依赖实现细节的 CSS class。

### 视觉回归
截图对比，捕捉"样式意外变了"。适合设计系统/组件库。

## 常见坑

- ❌ **只写 E2E 或只写单元**：要么太慢、要么覆盖不足。分层组合。
- ❌ **测实现细节**：重构就断，测试反而拖累迭代。测行为。
- ❌ **追求 100% 覆盖率**：覆盖率是参考不是目标。关键路径覆盖好，比无意义的 100% 重要。
- ❌ **E2E 偶发失败不管**：flaky 测试消磨信心，要么修要么删。

## 关联（双向打通）

- **依赖 ↓**：[测试的实践原则](./testing-principles.md)、[质量门禁](./quality-gates.md)
- **属于 ↑**：[01-13 可观测性与质量](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 测什么不测什么 → [测试的实践原则](./testing-principles.md)
  - 测试卡进 CI → [质量门禁](./quality-gates.md)、[03 测试策略](../../03-engineering/README.md)
