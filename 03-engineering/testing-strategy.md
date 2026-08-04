# 测试策略（Testing Strategy）

> [01-13 测试](../01-pillars/01-13-observability-quality/testing.md) 讲了测试的层级和原则。这篇讲**团队怎么落地测试**——测什么、测多细、怎么配 CI，让测试真正保护质量而非成为负担。

## 是什么

测试策略指**团队对"测什么、用什么测、测到什么程度、怎么跑"的整体规划**。它是 [01-13 测试](../01-pillars/01-13-observability-quality/testing.md) 的工程化落地。

一句话边界：**好策略让测试"高保护、低维护"，而非"什么都测但维护累死人"。**

## 为什么：需要策略而非盲目测

没有策略的测试常见症状：
- **E2E 太多**：跑半小时，flaky 不断，团队失去信心。
- **测了没用的**（简单展示组件、第三方库），维护贵收益低。
- **关键路径没测**：核心转化流程没 E2E，回归靠人工。
- **覆盖率导向**：追 100% 覆盖率，产出一堆低价值测试。

策略让测试**聚焦高价值区域**，避免低价值高维护。

## 怎么用：分层策略

### 测试金字塔的合理配比
```
        E2E（少，只关键流程）
      组件测试（中，核心组件交互）
    单元测试（多，纯逻辑/工具/Hook）
```
呼应当前[01-13 测试](../01-pillars/01-13-observability-quality/testing.md)。比例大致：单元 70% / 组件 20% / E2E 10%。E2E 只覆盖核心业务流程（登录、下单、支付等关键转化）。

### 测什么不测什么 ★
**该测**：
- 复杂纯逻辑（计算、转换、reducer、状态机）——单元主力。
- 核心组件的关键交互——组件测试。
- 核心业务流程——E2E。
- 边界与异常处理（空/错/并发）。

**不该测/低优先**：
- 纯展示无逻辑的组件（一个只渲染 props 的卡片）——收益低。
- 框架本身（别测 React 的 useState）。
- 第三方库（它们有自己的测试）。
- 简单 getter/setter。

### 组件测试：测行为不测实现
呼应当前[01-13 测试原则](../01-pillars/01-13-observability-quality/testing-principles.md)：给 props 渲染，模拟用户交互，断言结果。不测内部 state/方法（实现细节，重构就断）。

### Mock 与测试数据
- **Mock 外部依赖**：API 用 MSW（Mock Service Worker）拦截，测试不依赖网络。呼应当前[01-6 数据获取](../01-pillars/01-6-data-fetching/README.md)。
- **测试数据**：工厂函数生成，每个测试独立 setup，不互相依赖。呼应当前[01-13 测试原则](../01-pillars/01-13-observability-quality/testing-principles.md)。

### CI 里跑测试
- PR 必跑：lint + typecheck + 单元/组件测试。
- E2E：可 nightly 或预发布环境跑（慢，不阻塞每个 PR）。
- 配当前[01-13 质量门禁](../01-pillars/01-13-observability-quality/quality-gates.md)：测试不过不让合并。

### 覆盖率的正确态度
覆盖率是**参考**不是**目标**。关键路径高覆盖比全局 100% 重要。设一个合理下限（如 80%）防退化，但不盲目追高。

## 常见坑

- ❌ **E2E 滥用**：什么都 E2E，CI 慢且 flaky。E2E 只守关键流程。
- ❌ **测实现细节**：重构就断，测试拖累迭代。
- ❌ **追 100% 覆盖率**：低价值测试一堆。聚焦关键。
- ❌ **flaky 测试不管**：偶发失败消磨信心。要么修要么删。

## 关联（双向打通）

- **依赖 ↓**：[01-13 测试](../01-pillars/01-13-observability-quality/testing.md)、[01-13 测试原则](../01-pillars/01-13-observability-quality/testing-principles.md)、[01-13 质量门禁](../01-pillars/01-13-observability-quality/quality-gates.md)
- **属于 ↑**：[03 工程实践](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 测试层级与原则 → [01-13 测试](../01-pillars/01-13-observability-quality/testing.md)
  - 门禁落地 → [01-13 质量门禁](../01-pillars/01-13-observability-quality/quality-gates.md)
  - Mock 数据层 → [01-6 数据获取](../01-pillars/01-6-data-fetching/README.md)
