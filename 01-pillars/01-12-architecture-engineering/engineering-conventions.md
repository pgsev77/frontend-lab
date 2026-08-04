# 工程规范（Engineering Conventions）

> 代码是写给机器的，但更是写给团队（和未来的自己）的。规范让团队代码风格一致、减少低级错误、让代码可读可维护。规范不是束缚，是团队协作的基础设施。

## 是什么

工程规范指**团队约定的代码风格、质量标准、提交规范**，并通过工具自动化执行。核心组成：

| 规范类型 | 工具 | 作用 |
|---|---|---|
| **代码格式化** | Prettier | 统一缩进/引号/换行，消除风格争论 |
| **代码质量检查** | ESLint | 发现 bug、坏模式、可维护性问题 |
| **类型检查** | TypeScript | 类型安全（[类型系统](./typescript-types.md)） |
| **提交规范** | commitlint / Conventional Commits | 统一 commit 格式，可生成 changelog |
| **Git Hooks** | Husky + lint-staged | 提交前自动检查，把规范卡在入库前 |

一句话边界：**规范 = 约定 + 自动化。** 约定靠文档，执行靠工具——只靠人遵守的规范必然失效。

## 为什么：规范的价值

### 减少"风格之争"
"用 tab 还是空格""分号加不加"——这些没有对错，但团队不统一就乱。Prettier 一键统一，把时间留给真正的问题。

### 在早期发现 bug
ESLint 能在写代码时就发现：未用变量、永远为真的条件、可能的空指针、React 忘了 useEffect 依赖。早发现省去调试时间。

### 团队协作的"共同语言"
统一的风格让任何人都能快速读懂任何人的代码。新成员融入快、code review 聚焦逻辑而非风格。

## 怎么用：规范工具链

### Prettier —— 格式化
```
// 保存时自动格式化（编辑器集成）
// 或命令行：prettier --write .
```
只管"长什么样"（格式），不管"写得对不对"。配置一次，团队统一。

### ESLint —— 质量检查
```
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"   // 检查 useEffect 依赖
  }
}
```
发现 bug 和坏模式。可集成 TypeScript（typescript-eslint）。

### TypeScript strict —— 类型安全
开启 `strict: true`，让类型系统帮你挡住空指针、类型错误。详见 [类型系统](./typescript-types.md)。

### Conventional Commits + commitlint
统一 commit 格式，便于生成 changelog、自动化版本：
```
feat(auth): 新增登录
fix(order): 修复下单崩溃
docs: 更新文档
```

### Husky + lint-staged —— 自动化执行 ★
在 `git commit` 前自动跑检查，不通过就不让提交：
```
// 提交前：对暂存的文件跑 prettier + eslint，不通过则提交失败
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
}
```
> 关键：**把规范卡在提交前**，不合规的代码进不了仓库。这是规范"落地"的关键——靠 CI 兜底也行，但本地 hook 反馈更快。

## 常见坑

- ❌ **规范靠文档不靠工具**：写了规范文档但不自动执行，没人遵守。
  - ✅ 正例：Husky + lint-staged 自动卡。
- ❌ **ESLint 规则太多太严**：一堆 `error` 让开发处处碰壁，团队抵触。从 recommended 起，逐步收紧。
- ❌ **Prettier 和 ESLint 冄突**：两者都管格式会打架。用 eslint-config-prettier 关闭 ESLint 的格式规则，让 Prettier 管格式。
- ❌ **规范从不演进**：项目初期定的规则一成不变。随团队成熟度调整。

## 关联（双向打通）

- **依赖 ↓**：[01-13 质量门禁](../01-13-observability-quality/README.md)、[03 CI/CD](../../03-engineering/README.md)
- **属于 ↑**：[01-12 架构与工程化](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 类型规范 → [TypeScript 与类型系统](./typescript-types.md)
  - CI 里卡规范 → [03 工程实践](../../03-engineering/README.md)、[01-13 质量门禁](../01-13-observability-quality/README.md)
