# 规范与 CI（Next.js + React 落地）

> 对应 v1：[01-12 工程规范](../../01-pillars/01-12-architecture-engineering/engineering-conventions.md) · [01-13 质量门禁](../../01-pillars/01-13-observability-quality/quality-gates.md) · [03 CI/CD 评审复盘](../../03-engineering/cicd-review-retrospective.md)

## 它解决什么

v1 [01-12 工程规范](../../01-pillars/01-12-architecture-engineering/engineering-conventions.md) 讲了"约定+自动化"。这篇讲 Next.js + React + TS 技术栈的具体规范工具链（ESLint/Prettier/TS strict）和 CI 门禁配置。

## 规范工具链

### TypeScript strict（类型安全的基础）

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // ★ 开启所有严格检查
    "noUncheckedIndexedAccess": true,  // arr[i] 类型含 undefined（防越界）
    "noEmit": true
  }
}
```
呼应当前 v1 [01-12 TypeScript](../../01-pillars/01-12-architecture-engineering/typescript-types.md)——strict 是 TS 价值的前提。

### ESLint + Prettier

```json
// .eslintrc.json —— Next.js 自带 ESLint 配置
{
  "extends": ["next/core-web-vitals", "plugin:react-hooks/recommended"],
  "rules": {
    "react-hooks/exhaustive-deps": "warn"   // 检查 useEffect 依赖
  }
}
```
```json
// .prettierrc
{ "semi": false, "singleQuote": true, "tabWidth": 2 }
```
> Next.js 的 `next/core-web-vitals` 已含性能/无障碍/TypeScript 检查规则。呼应当前 v1 [01-12 工程规范](../../01-pillars/01-12-architecture-engineering/engineering-conventions.md) 的"Prettier 管格式，ESLint 管质量"。

### Husky + lint-staged（提交前自动卡）★

```json
// package.json
{
  "scripts": {
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```
```bash
# 装 Husky，配 pre-commit 钩子
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```
呼应当前 v1 [01-12 工程规范](../../01-pillars/01-12-architecture-engineering/engineering-conventions.md)——把规范卡在提交前，不合规进不了仓库。

## CI 门禁配置

呼应当前 v1 [01-13 质量门禁](../../01-pillars/01-13-observability-quality/quality-gates.md) + [03 CI/CD](../../03-engineering/cicd-review-retrospective.md)——CI 里卡检查，不达标不让合并：

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint          # ESLint
      - run: npm run typecheck     # tsc --noEmit
      - run: npm run test          # Vitest（单元/组件）
      - run: npm run build         # 生产构建
      # 任一步失败 → CI 失败 → 阻止合并（呼应当前 v1：门禁必须阻断）
```

**门禁的关键（呼应当前 v1）**：CI 必须**阻断合并**（GitHub branch protection 要求 CI 通过才能 merge），而非只警告。

## 可选：性能/a11y 门禁

呼应当前 v1 [01-9 性能预算](../../01-pillars/01-9-performance-ux/performance-budget-monitoring.md) + [01-10 a11y](../../01-pillars/01-10-accessibility-multiplatform/README.md)：
- **Lighthouse CI**：CI 跑 Lighthouse，性能/a11y 分数低于阈值失败。
- **@axe-core/playwright**：E2E 里自动跑 a11y 检查。

## 为什么这样写（设计决策）

- **strict + ESLint + Prettier 三件套**：类型安全 + 代码质量 + 格式统一（呼应当前 v1）。
- **Husky 本地卡 + CI 远端卡**：本地反馈快（提交时），CI 兜底（确保没人绕过）。
- **门禁阻断而非警告**：呼应当前 v1 [01-13 质量门禁](../../01-pillars/01-13-observability-quality/quality-gates.md)——不达标不让合并，否则形同虚设。

## 常见坑

- ❌ **不 strict**：TS 形同虚设，any 满天飞。
- ❌ **CI 只警告不阻断**：开发者无视警告合并。branch protection 强制。
- ❌ **门禁太慢**：CI 跑 10 分钟，开发者绕过。并行/缓存优化。
- ❌ **Prettier 和 ESLint 冲突**：两者都管格式打架。用 eslint-config-prettier 关闭 ESLint 格式规则。

## 关联

- ↑ 对应 v1 原理：[01-12 工程规范](../../01-pillars/01-12-architecture-engineering/engineering-conventions.md) · [01-13 质量门禁](../../01-pillars/01-13-observability-quality/quality-gates.md) · [03 CI/CD](../../03-engineering/cicd-review-retrospective.md)
- → v2 相关：[01 构建部署](./01-build-deploy.md) · [02 测试](./02-testing.md)
