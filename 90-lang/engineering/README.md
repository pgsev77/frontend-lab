# 工程化（v2-5）

> 构建、测试、规范、CI-CD 在 Next.js + React + TS 技术栈的落地。

## 详细大纲（→ 点击标题阅读）

### [01. 构建与部署](./01-build-deploy.md)
- next build 产物结构、三种部署模式（静态/Node/Vercel）
- 缓存指纹自动化、环境变量（NEXT_PUBLIC_ 边界）、发布回滚
- 对应 v1：[03 构建部署](../../03-engineering/build-deploy-release.md)

### [02. 测试](./02-testing.md)
- Vitest（单元/组件）+ Testing Library（测行为不测实现）
- MSW mock 请求、Playwright E2E（只核心流程）
- 对应 v1：[03 测试策略](../../03-engineering/testing-strategy.md)

### [03. 规范与 CI](./03-conventions-ci.md)
- TS strict + ESLint + Prettier 三件套
- Husky 本地卡 + CI 门禁（阻断而非警告）
- 对应 v1：[01-12 工程规范](../../01-pillars/01-12-architecture-engineering/engineering-conventions.md)

## 学完应能回答
- Next.js 的三种部署模式怎么选？缓存指纹怎么自动化？
- Testing Library 为什么测行为不测实现？用什么选择器？
- CI 门禁为什么要阻断而非警告？Husky 和 CI 各管什么？
