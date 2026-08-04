# A/B 测试与实验（A/B Testing & Experimentation）

> "新设计转化率更高吗？"——别靠拍脑袋，用 A/B 测试让数据说话。前端是 A/B 测试的主战场，因为"用户看到什么"完全由前端控制。

## 是什么

A/B 测试指**把用户随机分到不同版本（A 对照、B 实验），比较哪个指标更好**，用数据驱动决策而非直觉。

```
用户访问 → 按用户ID哈希分桶
  ├─ 50% 看到 A 版本（对照组，原设计）
  └─ 50% 看到 B 版本（实验组，新设计）
收集两边的转化率/点击率 → 统计判断 B 是否显著优于 A
```

一句话边界：**A/B 测试 = 用真实用户数据验证"哪个方案更好"，而非靠争论或拍脑袋。**

## 为什么：为什么要实验

### 直觉不可靠
"红色按钮点击率更高""新布局转化更好"——这些判断常被偏见误导。UI/产品决策靠直觉，一半概率错。A/B 测试用数据纠偏。

### 降低发布风险
全量上线新功能有风险。先对 5% 用户开（实验），数据验证无害甚至更好，再放量。呼应当前[01-12 Feature Flag](../01-12-architecture-engineering/environment-config.md)——Flag 控制放量比例。

### 量化收益
"这次改版提升了多少转化"——没有实验，无法归因（可能是季节、市场因素）。实验隔离变量，精确量化改动的贡献。

## 怎么用：前端实现

### 分桶（bucketing）
用户进来，按稳定规则分到某组：
```
const variant = hash(userId + experimentName) % 100 < 50 ? 'B' : 'A'
// 用 userId 保证：同一用户每次来分到同一组（不会一会 A 一会 B）
// 用 experimentName 保证：不同实验独立分桶
```
- **稳定分桶**：同一用户对同一实验，分桶结果稳定（用 userId 哈希），否则体验不一致。
- **均匀**：哈希保证大致 50/50。

### 前端渲染按分桶
```
const variant = useExperiment('new-checkout')   // 返回 'A' | 'B'
return variant === 'B' ? <NewCheckout/> : <OldCheckout/>
```
配合 [Feature Flag](../01-12-architecture-engineering/environment-config.md)：Flag 控制实验开关和流量比例。

### 指标采集与上报
两组都要上报关键指标（点击、转化、停留），实验平台统计差异：
```
// 两组都埋点
track('checkout_view', { experiment: 'new-checkout', variant })
track('checkout_complete', { experiment, variant })   // 转化
```

### 实验的工程要点
- **可灰度**：从 1% 起逐步放量，发现指标恶化立即关掉（呼应当前[01-12 Flag](../01-12-architecture-engineering/environment-config.md) 的快速回滚）。
- **一致性**：实验期间，用户看到的版本要一致（分桶稳定），不能刷新变版本。
- **足够样本与时长**：样本太小不显著；时间太短没考虑周期波动（如工作日 vs 周末）。要跑到统计显著。
- **SRM 检查**：监控分桶比例是否真的 50/50（漏洞导致比例失衡，结论失真）。

## 常见坑

- ❌ **分桶不稳定**：同一用户一会 A 一会 B，体验混乱、数据污染。
- ❌ **样本太小就下结论**：统计不显著，可能是随机波动。跑到显著。
- ❌ **忽视 SRM**：分桶比例实际偏了（如某组用户被某条件过滤），结论错。
- ❌ **同时跑互相干扰的实验**：两个实验都改结账流程，互相污染。注意实验隔离/互斥。

## 关联（双向打通）

- **依赖 ↓**：[01-12 Feature Flag（灰度放量）](../01-12-architecture-engineering/environment-config.md)、[前端监控（埋点）](./frontend-monitoring.md)
- **属于 ↑**：[01-13 可观测性与质量](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 灰度与回滚 → [01-12 Feature Flag](../01-12-architecture-engineering/environment-config.md)、[03 发布策略](../../03-engineering/README.md)
  - 指标埋点 → [前端监控](./frontend-monitoring.md)
