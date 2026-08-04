# 构建、部署与发布（Build, Deploy & Release）

> 代码写完不算完——要构建成产物、部署到服务器、安全发布给用户、能快速回滚。前端发布策略决定了"上线稳不稳、出事能不能回"。

## 是什么

构建部署发布指**从代码到线上可用的完整流程**：
- **构建**：源码 → 产物（打包/优化/指纹）。
- **部署**：产物放到服务器/CDN。
- **发布**：让用户看到新版本（灰度/蓝绿/金丝雀）。
- **回滚**：出问题快速退回旧版。

一句话边界：**构建管"产物"，部署管"放上去"，发布管"让谁看到"，回滚管"出事能退"。**

## 为什么：发布为什么是风险点

发布是变更进入生产的时刻——最容易出事。一次糟糕发布能让全站白屏。所以发布需要策略：渐进放量（灰度）、可对比（蓝绿）、可快速退（回滚）。

## 怎么用

### 构建产物
- 打包、分割、Tree-shaking、压缩（呼应当前[01-12 打包](../01-pillars/01-12-architecture-engineering/bundling-optimization.md)）。
- **缓存指纹**★：文件名带 hash（`app.a3f9.js`），内容变 hash 变。
  - 配合缓存策略：带 hash 资源长缓存，index.html 不缓存。呼应当前[01-9 加载](../01-pillars/01-9-performance-ux/loading-performance.md)。

### 部署方式
| 方式 | 说明 |
|---|---|
| **静态托管/CDN** | 纯前端产物上传 CDN，最简单常见 |
| **Node 服务（SSR）** | SSR 应用要部署 Node 服务，复杂度高 |

### 缓存策略 ★
```
index.html         → 不缓存（确保拿到最新引用）
app.[hash].js      → 长缓存（一年，内容变 hash 变自然失效）
```
> 关键：HTML 不缓存保证用户拿到最新版本引用；带 hash 的资源长缓存省带宽。这是前端缓存的核心策略。

### 发布策略
| 策略 | 做法 | 特点 |
|---|---|---|
| **全量** | 所有人直接切新版 | 快但风险高 |
| **灰度** | 按比例（1%→10%→100%）逐步放量 | 渐进，发现问题影响小 |
| **蓝绿** | 两套环境，切流量 | 可瞬时切换/回滚 |
| **金丝雀** | 先给少量用户，观察再放量 | 灰度的极致版 |

呼应当前[01-12 Feature Flag](../01-pillars/01-12-architecture-engineering/environment-config.md)——Flag 控制灰度比例，出问题关 Flag 即回滚。

### 回滚 ★ 不可省
- **静态资源**：CDN 切回旧版本目录，秒级。
- **SSR**：需版本管理，切回旧服务镜像。
- **数据库/迁移相关**：前端少见，但要确保回滚不依赖破坏性变更。
> 底线：任何发布都要有回滚预案。没有回滚预案的发布是赌博。

## 常见坑

- ❌ **index.html 长缓存**：用户拿到旧 HTML，引用旧 JS，永远看不到新版。
  - ✅ 正例：HTML 不缓存，带 hash 资源长缓存。
- ❌ **全量发布无灰度**：一出问题全员受影响。
  - ✅ 正例：灰度/金丝雀渐进放量。
- ❌ **没回滚预案**：出事只能紧急修代码重新发布，慢且放大影响。
- ❌ **SSR 部署忽视服务端回滚**：前端切了旧版但服务还在新版，不一致。

## 关联（双向打通）

- **依赖 ↓**：[01-12 构建工具/打包](../01-pillars/01-12-architecture-engineering/build-tools.md)、[01-9 加载性能（缓存）](../01-pillars/01-9-performance-ux/loading-performance.md)、[01-12 Feature Flag](../01-pillars/01-12-architecture-engineering/environment-config.md)
- **属于 ↑**：[03 工程实践](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 构建与打包 → [01-12 构建工具](../01-pillars/01-12-architecture-engineering/build-tools.md)
  - 灰度的 Flag → [01-12 Feature Flag](../01-pillars/01-12-architecture-engineering/environment-config.md)
  - 发布后监控 → [01-13 前端监控](../01-pillars/01-13-observability-quality/frontend-monitoring.md)
