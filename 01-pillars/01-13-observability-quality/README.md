# 01-13 · 可观测性与质量

> **轴属：横切**。前端上线后，你怎么知道它在用户那里发生了什么？本支柱回答"怎么监控前端的错误/性能/行为、怎么测试、怎么把质量卡在上线前"——没有可观测的前端，等于盲飞。

## 本支柱解决什么问题
前端的 bug 用户不会主动报，他会直接走（[前端本质：差异 1](../../00-foundation/frontend-essence.md)）。本支柱回答：**怎么监控线上、怎么兜住错误、怎么测试、怎么设质量门禁**。可观测让你"看得见"，质量保证让你"做对"。

## 详细大纲（→ 待填充原子笔记内容）

### 1. 前端监控（Frontend Monitoring）
- 监控三类：错误监控 / 性能监控 / 行为监控
- 错误监控：JS 异常、未处理的 Promise、资源加载失败、白屏
- 性能监控：Core Web Vitals 的真实用户数据（RUM）
- 行为监控：用户操作埋点、轨迹回放（session replay）
- 监控平台（Sentry / 自建）与采样策略

### 2. 错误边界与兜底（Error Boundary）
- 错误边界（React Error Boundary）：子组件崩溃不拖垮整页
- 全局兜底：window.onerror / unhandledrejection
- 资源加载失败的兜底（img onerror、script onerror）
- 白屏检测与降级页面
- 错误上报与去重

### 3. Source Map 与线上调试
- 生产代码是压缩混淆的，出错堆栈不可读
- Source Map 还原原始堆栈
- Source Map 的安全管理（不公开上传到 CDN）
- 错误聚合与归因

### 4. 测试（Testing）
- 前端测试金字塔：单元多 / 组件中 / E2E 少
- 单元测试：纯函数、工具、Hook（Jest/Vitest）
- 组件测试：渲染、交互、断言（Testing Library）
- E2E 测试：真实浏览器跑用户流程（Playwright/Cypress）
- 视觉回归测试：截图对比（Percy/Chromatic）
- 测什么、不测什么（测行为不测实现细节）

### 5. 测试的实践原则
- 测试金字塔为什么"底大顶小"（E2E 慢且脆）
- 测试与开发的关系（TDD vs 测试后置）
- Mock vs Stub vs 真实依赖（→ 详见 03-3）
- 测试数据管理
- 覆盖率的正确态度（指标不是目的）

### 6. 调试（Debugging）
- 浏览器 DevTools：Elements / Console / Sources / Network / Performance
- 性能分析（Performance 面板、火焰图、长任务）
- 状态调试（React DevTools / Vue DevTools）
- 移动端调试（远程调试 / 模拟器）

### 7. 质量门禁（Quality Gates）
- Lighthouse CI：性能/a11y/SEO/最佳实践的自动评分
- 类型检查（tsc --noEmit）作为门禁
- 测试覆盖率门禁
- bundle 体积预算
- a11y 自动检查（axe-core）
- → 门禁落地见 [03-4 CI/CD](../../03-engineering/README.md)

### 8. A/B 测试与实验
- 灰度发布与 Feature Flag 的配合
- A/B 测试的前端实现（分桶/开关/数据上报）
- 实验数据的可观测

## 学完应能回答
- 前端监控分哪三类？分别监控什么？
- 错误边界解决什么问题？它兜得住哪些错误、兜不住哪些？
- 前端测试金字塔为什么是底大顶小？
- 组件测试该测什么、不该测什么？
- Source Map 在线上调试的作用？怎么安全管理？
- 质量门禁能在 CI 里卡哪些检查？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 横切
- **依赖 ↓**：[01-9 性能](../01-9-performance-ux/README.md)（性能监控指标）、[01-4 渲染机制](../01-4-rendering/README.md)（错误边界）
- **相关 →**：[01-10 可访问性](../01-10-accessibility-multiplatform/README.md)（a11y 检查）、[01-11 安全](../01-11-security/README.md)（安全监控）、[03 工程实践](../../03-engineering/README.md)（测试/CI/复盘）
