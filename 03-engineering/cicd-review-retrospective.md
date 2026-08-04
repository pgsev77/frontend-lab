# CI/CD、评审与复盘（CI/CD, Review & Retrospective）

> 代码写完到上线，中间有 CI 自动检查、人工评审；上线后要复盘学到东西。这套闭环让团队持续进步而非重复踩坑。是 [00-4 需求生命周期](../00-foundation/requirement-lifecycle.md) 第⑥⑦⑨步的落地。

## 是什么

- **CI/CD**：自动化流水线（构建/测试/部署），代码一推自动跑。
- **代码评审（Code Review）**：第二双眼睛把关。
- **复盘（Retrospective）**：从每次需求/事故学到东西。

一句话边界：**CI/CD 自动化"机械检查"，评审把关"人能判断的"，复盘沉淀"经验"。三者构成质量与成长的闭环。**

## 怎么用

### CI/CD 流水线
```
代码推送 → CI 自动：
  lint → typecheck → test → build → （门禁，呼应当前01-13质量门禁）
通过 → 可合并 → 合并后 CD 自动部署（按灰度策略，呼应当前03部署）
```
- **CI（持续集成）**：每次提交自动构建测试，早发现问题。
- **CD（持续部署/交付）**：合并后自动部署。
- 配当前[01-13 质量门禁](../01-pillars/01-13-observability-quality/quality-gates.md)：不达标阻断。

### 代码评审
评审清单（聚焦机器查不了的）：
- **正确性**：逻辑对不对、边界处理。
- **可读性**：命名、结构、是否过度复杂。
- **架构**：是否符合项目架构（呼应当前[01-12 项目架构](../01-pillars/01-12-architecture-engineering/project-architecture.md)）、有无破坏封装。
- **性能**：有无明显性能问题（N+1 渲染、大列表未虚拟化）。
- **安全**：有无 XSS/敏感信息泄露（呼应当前[01-11 安全](../01-pillars/01-11-security/README.md)）。
- **可访问性**：语义化、键盘可达（呼应当前[01-10 a11y](../01-pillars/01-10-accessibility-multiplatform/README.md)）。
> 评审不替代门禁——机器能查的（lint/格式）让机器查，评审聚焦架构/逻辑/安全这些需要人判断的。

### 设计走查（前端特有）
代码评审 + 设计还原度走查：
- 视觉还原（像素级/合理偏差）。
- 交互细节（hover、加载态、错误态）。
- 边界态（空/错/超长文本）。

### 性能预算与回归
- PR 里跑 Lighthouse CI，性能退化不让合并。呼应当前[01-9 性能预算](../01-pillars/01-9-performance-ux/performance-budget-monitoring.md)。

### 无指责复盘（Blameless Postmortem）★
事故后复盘，原则是**对事不对人**：
- 不追究"谁的错"，而是分析"系统哪里让这个错发生了"。
- 用 **5 Whys**（连续问 5 个为什么）挖根因，而非停在表面。
- 产出改进项（加测试、加监控、改流程），而非"下次注意"。

> 为什么无指责：追责会让人隐瞒问题（怕被罚），问题反复发生。无指责让人坦诚分析，真正修复系统。呼应当前[00 前端哲学](../00-foundation/frontend-essence.md)——流程是保护人的。

### 语义化版本（Semantic Versioning）
版本号传达变更类型：
- major：不兼容变更。
- minor：向后兼容的新功能。
- patch：bug 修复。
组件库/SDK 用语义化版本，让使用者知道升级风险。

## 常见坑

- ❌ **评审只看格式**：机器能查的让人查，浪费。聚焦架构/逻辑。
- ❌ **复盘变追责**：人隐瞒问题，根因掩盖。
- ❌ **复盘无改进项**：只讨论不落地，问题反复。
- ❌ **CI 不卡门禁**：跑了但失败也合并，CI 形同虚设。

## 关联（双向打通）

- **依赖 ↓**：[00-4 需求生命周期](../00-foundation/requirement-lifecycle.md)、[01-13 质量门禁](../01-pillars/01-13-observability-quality/quality-gates.md)、[01-9 性能预算](../01-pillars/01-9-performance-ux/performance-budget-monitoring.md)
- **属于 ↑**：[03 工程实践](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 门禁 → [01-13 质量门禁](../01-pillars/01-13-observability-quality/quality-gates.md)
  - 评审涉及的安全/a11y → [01-11 安全](../01-pillars/01-11-security/README.md)、[01-10 a11y](../01-pillars/01-10-accessibility-multiplatform/README.md)
  - 部署与回滚 → [构建部署与发布](./build-deploy-release.md)
