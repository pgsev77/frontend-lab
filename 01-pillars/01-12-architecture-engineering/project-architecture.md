# 项目架构（Project Architecture）

> 应用一大，"文件放哪"就成了真问题。按技术层分？按业务功能分？怎么分才能让人"一眼找到"、改动不扩散？项目架构是规模化开发的骨架。

## 是什么

项目架构指**如何组织代码目录结构**，决定"一个功能/组件/逻辑该放哪个文件夹"。两种主流范式：

| 范式 | 组织方式 | 例子 |
|---|---|---|
| **layer-based（按技术层）** | components/、hooks/、utils/、services/ | 按代码类型分 |
| **feature-based（按业务功能）** ★ | features/user/、features/order/（各自含组件/hook/api） | 按业务模块分 |

一句话边界：**feature-based 让"一个功能的所有代码在一起"，layer-based 让"同类代码在一起"。** 现代大型项目首选 feature-based。

## 为什么：为什么选 feature-based

### layer-based 的痛点（规模一大就崩）
```
src/
  components/   ← 几百个组件，找一个"用户头像"要翻遍
  hooks/        ← 几百个 hook
  utils/        ← 几百个工具函数
  services/     ← 所有 API
```
改一个"用户"功能，要在 components（找 UserCard）、hooks（找 useUser）、services（找 userApi）、utils（找 userHelpers）四个目录间跳来跳去。**一个功能的代码被技术层切散**，维护痛苦，改动扩散面大。

### feature-based 的承诺：高内聚
```
src/
  features/
    user/
      components/   ← UserCard、UserList（只 user 用）
      hooks/        ← useUser
      api.ts        ← userApi
      utils.ts
      index.ts      ← 对外只导出公共接口
    order/
      ...（order 的所有代码自包含）
  shared/           ← 跨功能复用的（通用 UI、通用工具）
    components/
    utils/
  app/              ← 应用入口、全局配置、路由
```
- **一个功能的代码聚在一起**：改 user 只动 features/user。
- **封装**：通过 index.ts 只导出公共接口，内部细节不暴露（呼应当前功能边界）。
- **可复用下沉**：跨功能的通用部分放 shared/。

> feature-based 的本质是"内聚"——让一个业务概念的所有相关代码住在一起，而非被技术分类拆散。

## 怎么用：feature-based 实践

### 单个 feature 的结构
```
features/user/
  api/            接口请求（呼应对应 v1 概念：[01-6 数据架构](../01-6-data-fetching/fetch-architecture.md)）
  components/     该功能的 UI 组件
  hooks/          该功能的逻辑（useUser、useUpdateUser）
  types.ts        该功能的类型
  index.ts        公共出口（barrel），只导出别人需要的
```

### 公共 vs 私有的边界 ★
- **feature 内部**：只本功能用的，不导出，其他 feature 不直接 import 其内部文件。
- **shared/**：真正跨功能复用的（如通用 Button、formatDate 工具），任何 feature 都能用。
- **判断标准**：一个东西只有一处用，留在该 feature 内部；多处用，提到 shared/。
> 这呼应 [01-2 复用陷阱](../01-2-componentization/reuse-pitfalls.md)：不要过早提到 shared，等复用真实出现再提取（三次法则）。

### app/ 层
应用级的东西：入口（main）、全局 Provider、路由配置、全局 store、全局配置。它组合各 feature，不包含业务逻辑。

### Monorepo（多包管理）
当项目大到含多个应用/包（如 web + admin + mobile 共享组件库），用 Monorepo（pnpm workspaces / Turborepo / Nx）：
```
packages/
  ui/         共享组件库
  utils/      共享工具
apps/
  web/        主站
  admin/      后台
```
让多应用共享代码而不重复。详见 [02 大型应用架构](../../02-advanced/README.md)。

## 常见坑

- ❌ **死守 layer-based**：项目大了还按技术层分，改动跳遍目录。
  - ✅ 正例：中大型项目用 feature-based。
- ❌ **feature 间互相 import 内部**：绕过 index.ts，破坏封装，耦合死。
  - ✅ 正例：feature 只通过公共接口（index.ts）对外。
- ❌ **过早提取 shared**：只用一次的东西就提到 shared，污染公共层。
  - ✅ 正例：复用稳定出现再提取。
- ❌ **shared 变成"什么都有"**：各种杂烩堆 shared，失去"通用"意义。shared 应是真正稳定通用的。

## 关联（双向打通）

- **依赖 ↓**：[01-2 组件化](../01-2-componentization/README.md)、[01-5 状态架构](../01-5-state-management/state-architecture.md)、[01-6 数据架构](../01-6-data-fetching/fetch-architecture.md)
- **属于 ↑**：[01-12 架构与工程化](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 状态归属 → [01-5 状态架构](../01-5-state-management/state-architecture.md)
  - 大型项目 Monorepo → [02 大型应用](../../02-advanced/README.md)
  - 工程规范 → [工程规范](./engineering-conventions.md)
