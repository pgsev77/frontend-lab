# 大型应用架构（Large App Architecture）

> 应用大到一定程度，单体前端就力不从心——构建慢、代码量巨大、多团队协作冲突。微前端、模块联邦、Monorepo 是应对"超大规模"的架构演进。

## 是什么

大型应用架构指**当单体前端撑不住时，如何组织超大规模代码**。三个方向：

| 方向 | 解决什么 |
|---|---|
| **状态架构演进** | 状态在巨型应用里如何不失控 |
| **微前端 / 模块联邦** | 把大应用拆成独立部署的子应用 |
| **Monorepo** | 多应用/包的代码仓库管理 |

一句话边界：**单体前端靠 feature-based（[01-12](../01-pillars/01-12-architecture-engineering/project-architecture.md)）撑到一定规模；超过后需要微前端拆部署、Monorepo 管多包。**

## 为什么：单体的天花板

单体前端（一个仓库、一个应用）随规模增长遇到瓶颈：
- **构建慢**：代码量大，构建几分钟，开发体验差。
- **部署耦合**：一个小改动要重新部署整个应用，风险大、协调成本高。
- **多团队冲突**：多个团队改同一仓库，合并冲突、互相阻塞。
- **技术栈锁定**：整个应用用同一框架/版本，难以渐进升级。

## 怎么用：三种方向

### 1. 状态架构演进
超大应用的状态管理要更克制（呼应当前[01-5 状态架构](../01-pillars/01-5-state-management/state-architecture.md)）：
- **状态严格分层**：服务端状态全交 Query 库，全局 store 只放真正全局的，feature 内部状态自管。
- **领域边界**：每个业务领域（user/order/payment）的状态独立，通过明确接口通信，避免"大锅饭"式全局 state。
- **派生优于存储**：能算出来的不存，减少同步点。

### 2. 微前端（Micro Frontend）★
把大应用拆成**多个独立部署的子应用**，组合成整体：
```
主壳（shell）负责导航和组合
  ├─ 子应用 A（用户中心，团队A维护，独立部署）
  ├─ 子应用 B（订单，团队B维护，独立部署）
  └─ 子应用 C（营销，团队C维护，独立部署）
```
- **独立部署**：各子应用独立构建部署，互不阻塞。
- **技术栈解耦**（理论上）：各子应用可用不同框架/版本（实践中统一更省心）。
- **实现方式**：iframe 集成、NPM 包分发、运行时加载（qiankun/single-spa）、Module Federation。
- **代价**：复杂度大增——样式隔离、路由集成、共享状态、公共依赖重复、性能（多框架实例）。**只有真的需要（多团队/超大）才用**，否则单体更简单。

### 3. 模块联邦（Module Federation）
Webpack 5 的特性，让**多个独立构建的应用在运行时共享模块**：
```
应用 A 暴露：Button 组件
应用 B 运行时远程 import A 的 Button，无需自己打包
```
- 比"整个子应用集成"更细粒度——共享的是模块/组件。
- 解决"多个应用共用同一组件库但各自打包"的重复问题。
- 是微前端的一种轻量实现。

### 4. Monorepo ★ 多包管理
多个应用/包在一个仓库管理（pnpm workspaces / Turborepo / Nx）：
```
monorepo/
  apps/web/        主站
  apps/admin/      后台
  packages/ui/     共享组件库
  packages/utils/  共享工具
```
- **代码共享**：apps 共用 packages，改一处全受益。
- **原子提交**：改组件库 + 用它的应用一起提交，不会版本错配。
- **构建编排**：Turborepo/Nx 做增量构建（只构建受影响的包）。
- 适合"多应用 + 共享代码"的组织。呼应当前[01-12 项目架构](../01-pillars/01-12-architecture-engineering/project-architecture.md)。

## 怎么选

| 场景 | 推荐 |
|---|---|
| 单应用，中等规模 | 单体 feature-based（[01-12](../01-pillars/01-12-architecture-engineering/project-architecture.md)） |
| 多应用共享代码 | **Monorepo** |
| 超大应用 + 多团队 + 需独立部署 | **微前端**（慎重，复杂度大） |
| 多应用运行时共享模块 | **模块联邦** |

> 经验：**优先单体 + Monorepo**，微前端是最后的手段。它的复杂度（隔离/路由/共享）往往超过收益，除非真的是超大型多团队场景。

## 常见坑

- ❌ **过早上微前端**：中等规模就微前端，复杂度爆炸无收益。先单体。
- ❌ **微前端忽视隔离**：子应用样式/全局变量互相污染。要做隔离。
- ❌ **Monorepo 没用工具编排**：全量构建慢。用增量构建（Turborepo/Nx）。
- ❌ **共享状态混乱**：微前端间状态共享设计不当，耦合死。

## 关联（双向打通）

- **依赖 ↓**：[01-12 项目架构](../01-pillars/01-12-architecture-engineering/project-architecture.md)、[01-5 状态架构](../01-pillars/01-5-state-management/state-architecture.md)、[01-12 打包](../01-pillars/01-12-architecture-engineering/bundling-optimization.md)
- **属于 ↑**：[02 前端进阶](./README.md) → 总纲 [../README.md]
- **相关 →**：
  - 单体架构基础 → [01-12 项目架构](../01-pillars/01-12-architecture-engineering/project-architecture.md)
  - 状态架构 → [01-5 状态架构](../01-pillars/01-5-state-management/state-architecture.md)
  - 构建与分包 → [01-12 打包优化](../01-pillars/01-12-architecture-engineering/bundling-optimization.md)
