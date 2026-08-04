# 01-12 · 架构与工程化

> **轴属：横切**。前端规模一大，"怎么组织代码"就成了最大难题。本支柱回答"怎么组织项目结构、怎么构建打包、怎么定工程规范"——这是 [复杂度来源 3（规模化组织）](../../00-foundation/complexity-sources.md) 的系统化解法。

## 本支柱解决什么问题
前端不需要"后端那样的分布式架构"，但需要**视图与状态的规模化组织架构**。本支柱回答：**项目结构怎么分、构建工具怎么用、模块化怎么做、工程规范怎么定、状态架构怎么设计**。

## 详细大纲（→ 点击标题阅读）

### [1. 项目架构](./project-architecture.md)
- feature-based（按业务功能组织）vs layer-based（按技术层组织）
- 典型结构：`features/` + `shared/` + `app/`
- 公共 vs 私有：什么该提取到通用层
- 单体 vs Monorepo（多包管理，大型项目）
- 目录约定的价值（约定优于配置）

### [2. 状态架构] → 已在 [01-5 状态架构](../01-5-state-management/state-architecture.md) 完整覆盖
- 状态分层与归属决策（UI/服务端/URL/持久）、单一数据源、API层+Hook层分离

### [3. 构建工具](./build-tools.md)
- 为什么前端需要构建（编译/打包/转译/优化）
- Webpack vs Vite vs esbuild vs Turbopack vs Rollup 的定位
- 开发时（dev server / HMR）vs 生产构建（bundle/优化）
- 构建的核心能力：打包、Tree-shaking、代码分割、转译、压缩

### [4. 打包与优化](./bundling-optimization.md)
- 模块系统（ESM vs CommonJS vs UMD）
- Tree-shaking：剔除未使用代码（依赖 ESM 静态分析）
- 代码分割：路由级 / 组件级 / 动态 import
- 分包策略（vendor/common/page）与缓存复用
- 包体积分析与优化（bundle analyzer）

### [5. 模块化](./modularity.md)
- ES Modules（import/export）是现代标准
- 命名导出 vs 默认导出的权衡
- 循环依赖的危害与检测
- Barrel 文件（index.ts 聚合导出）的利弊

### [6. 工程规范](./engineering-conventions.md)
- 代码规范：ESLint / Prettier / TypeScript strict
- 提交规范：Conventional Commits / commitlint
- 目录与命名约定
- 代码评审清单（→ 详见 03-4）
- 规范的自动化（git hooks / Husky / lint-staged）

### [7. 环境与配置](./environment-config.md)
- 多环境（dev/staging/prod）的配置管理
- 环境变量（.env）与构建时替换
- 前端不能存真正的密钥（→ 详见 01-11）
- Feature Flag（功能开关）做灰度发布

### [8. TypeScript 与类型系统](./typescript-types.md)
- 为什么前端需要类型（大型项目的可维护性）
- 类型即文档、类型即契约（API/Props/状态）
- strict 模式、类型推导、泛型的基础
- 类型与运行时数据的差异（类型不能保证 API 返回）

## 学完应能回答
- feature-based 和 layer-based 架构的区别？为什么推荐 feature-based？
- 构建工具为什么存在？Webpack 和 Vite 的核心差异？
- Tree-shaking 是什么？为什么依赖 ESM？
- 代码分割的几种方式？分别解决什么？
- 状态架构怎么分层？什么是"单一数据源"？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 横切
- **依赖 ↓**：[01-2 组件化](../01-2-componentization/README.md)（组件是架构单元）、[01-5 状态管理](../01-5-state-management/README.md)（状态架构）
- **相关 →**：[01-7 路由](../01-7-routing/README.md)（代码分割）、[03 工程实践](../../03-engineering/README.md)（构建发布/规范）、[02-2 大型应用架构](../../02-advanced/README.md)
