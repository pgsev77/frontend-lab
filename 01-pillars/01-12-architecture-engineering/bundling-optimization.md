# 打包与优化（Bundling & Optimization）

> 打包不只是"把文件合一起"，而是**如何合并、如何拆分、如何剔除多余**的整套优化。理解 Tree-shaking、代码分割、vendor 分包，才能让产物又小又快。

## 是什么

打包（Bundling）指把模块化的源码合成浏览器可加载的产物。优化指在这个过程中**减小体积、加快加载**：
- Tree-shaking：剔除未用代码。
- 代码分割：拆成按需加载的块。
- 分包（chunk splitting）：公共依赖单独成块复用。
- 压缩：minify。

一句话边界：**打包管"合"，优化管"合得又小又智能"。**

## 为什么：优化的两个目标

### 目标 1：产物小
- Tree-shaking 删死代码。
- 压缩（变量名缩短、去空白）。
- 避免重复打包同一依赖。

### 目标 2：加载快（按需 + 缓存友好）
- 代码分割：首屏只加载首页（[01-7](../01-7-routing/code-splitting.md)）。
- vendor 分包：把不常变的第三方库单独成块，长缓存复用（呼应当前[01-9](../01-9-performance-ux/loading-performance.md) 缓存指纹）。

## 怎么用：四类优化

### 1. Tree-shaking ★
基于 ESM 的**静态分析**，剔除"导出了但没人用"的代码：
```
// math.js
export function add(a,b){...}
export function unusedHeavyFn(){ /* 几百行，但没人 import 它 */ }

// app.js 只 import add
import { add } from './math'
// 构建时：unusedHeavyFn 被识别为"没人用"，从产物剔除
```
**为什么依赖 ESM**：ESM 是静态的（import/export 在编译时就能分析依赖关系），构建工具据此判断"谁被用了"。CommonJS 是动态的（require 可在运行时），无法可靠分析，所以 Tree-shaking 对 CommonJS 无效。详见 [模块化](./modularity.md)。

**副作用（sideEffects）**：有些模块导入就有副作用（改全局、注册 polyfill），Tree-shaking 不会删它们。在 package.json 声明 `"sideEffects": false` 告诉构建工具"我可安全 shake"。

### 2. 代码分割 ★
按路由/组件动态 import，首屏只加载必要代码。详见 [01-7 代码分割](../01-7-routing/code-splitting.md)。
```
const Settings = lazy(() => import('./Settings'))  // 动态 import 触发分割
```

### 3. 分包策略（chunk splitting）★ 缓存优化
把产物按"变化频率"拆分，让缓存复用最大化：
```
产物拆成：
  vendor.js    ← 第三方库（React/lodash），极少变，长缓存
  common.js    ← 多页面共享的业务代码
  [page].js    ← 各页面自己的代码，随业务变
```
- vendor 几乎不变 → 设长缓存（Cache-Control: max-age=31536000），用户二次访问直接用缓存。
- 业务代码变了 → 只有 page.js 文件名（hash）变，vendor 缓存仍复用。
- 呼应当前[01-9 加载性能](../01-9-performance-ux/loading-performance.md) 的缓存指纹策略。

### 4. 包体积分析与控制
- **bundle analyzer**（webpack-bundle-analyzer / rollup-plugin-visualizer）：可视化产物构成，发现"谁占了体积"。
- 常见发现：误引了整个 lodash（应按需 `import debounce from 'lodash/debounce'`）、某 UI 库太大、重复依赖。
- 配合 [性能预算](../01-9-performance-ux/performance-budget-monitoring.md) 在 CI 卡体积。

## 常见坑

- ❌ **误引整包**：`import _ from 'lodash'` 把整个 lodash（70KB+）打进去了，应该按需引。
- ❌ **CommonJS 破坏 Tree-shaking**：依赖用 CommonJS 导出，Tree-shaking 失效，整包打入。
- ❌ **不分包，一锅炖**：所有代码一个大文件，任何改动让整个文件缓存失效，用户每次重下。
  - ✅ 正例：按变化频率分包（vendor/common/page）。
- ❌ **重复依赖**：依赖树里同一个库装了两个版本，都被打包。

## 关联（双向打通）

- **依赖 ↓**：[01-7 代码分割](../01-7-routing/code-splitting.md)、[01-9 加载性能（缓存指纹）](../01-9-performance-ux/loading-performance.md)
- **属于 ↑**：[01-12 架构与工程化](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - Tree-shaking 依赖 ESM → [模块化](./modularity.md)
  - 构建工具本体 → [构建工具](./build-tools.md)
  - 体积预算门禁 → [01-9 性能预算](../01-9-performance-ux/performance-budget-monitoring.md)
