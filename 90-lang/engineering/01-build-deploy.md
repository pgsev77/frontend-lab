# 构建与部署（Next.js 落地）

> 对应 v1：[03 构建部署与发布](../../03-engineering/build-deploy-release.md) · [01-12 构建工具](../../01-pillars/01-12-architecture-engineering/build-tools.md)

## 它解决什么

v1 [03 构建部署](../../03-engineering/build-deploy-release.md) 讲了构建产物/缓存指纹/发布策略的原理。这篇讲 Next.js 的构建（next build）、产物结构、部署方式。把 v1 落地到 Next.js。

## Next.js 构建

```bash
next build     # 生产构建
next start     # 启动生产服务（Node 模式）
```

构建产出 `.next/` 目录，含：
- **静态产物**（SSG 页面）：可直接 CDN。
- **服务端产物**（SSR/RSC/Action）：需 Node 运行时。
- **客户端 JS**：带 hash，浏览器加载。

## 三种部署模式

呼应当前 v1 [03 部署](../../03-engineering/build-deploy-release.md) + [nextjs/04 渲染模式](../nextjs/04-rendering-modes.md)：

| 模式 | 适合 | 特点 |
|---|---|---|
| **静态导出（next export）** | 纯静态站（博客/文档/营销页） | 全 SSG，CDN 托管，最简单 |
| **Node 部署（next start）** | 用了 SSR/Action/动态路由 | 需 Node 服务器，功能全 |
| **Vercel/边缘** | 通用 | 平台托管，自动构建部署+边缘 |

## 缓存指纹策略 ★

呼应当前 v1 [03 部署](../../03-engineering/build-deploy-release.md) 的缓存策略——Next.js 自动处理：
- **带 hash 的 JS/CSS**：`_next/static/chunks/abc123.js`，内容变 hash 变，**长缓存**。
- **HTML**：不缓存（确保拿到最新引用）。

```ts
// next.config.js —— 一般无需手动配缓存，Next.js 默认指纹策略已对
const nextConfig = {
  // 生产默认开启压缩、代码分割、Tree-shaking
}
```

## 环境变量

呼应当前 v1 [01-12 环境配置](../../01-pillars/01-12-architecture-engineering/environment-config.md)：
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com   # NEXT_PUBLIC_ 前缀暴露给客户端
DATABASE_URL=...                               # 无前缀只在服务端（Server Components/Action）
```
> 客户端能读的（`NEXT_PUBLIC_`）**不能放密钥**——呼应当前 v1 [01-11 安全](../../01-pillars/01-11-security/other-security.md)。

## 发布与回滚

呼应当前 v1 [03 发布](../../03-engineering/build-deploy-release.md)：
- **Vercel**：每次 push 自动构建部署，平台提供一键回滚到任意历史版本。
- **自托管**：版本化部署（每版本独立目录/容器），出问题切回旧版。
- **灰度**：Vercel 的 Preview Deployments + Feature Flag（[01-12](../../01-pillars/01-12-architecture-engineering/environment-config.md)）控制放量。

## 为什么这样写（设计决策）

- **构建产物按渲染模式分**：SSG 出静态、SSR 出服务端代码，各走各的最优路径（呼应当前 v1 [01-9 加载](../../01-pillars/01-9-performance-ux/loading-performance.md)）。
- **hash 指纹自动化**：开发者不用手动管缓存版本，Next.js 默认处理（呼应当前 v1 缓存策略）。
- **环境变量分客户端/服务端**：`NEXT_PUBLIC_` 明确边界，防止密钥泄露。

## 常见坑

- ❌ **纯静态导出却用了 SSR 特性**：`cookies()`/动态路由服务端逻辑在静态导出下报错。确认渲染模式与部署模式匹配。
- ❌ **密钥用 NEXT_PUBLIC_**：暴露给客户端。敏感的去掉前缀（只服务端）。
- ❌ **部署没回滚预案**：自托管没版本化，出事无法快速回退。
- ❌ **HTML 被长缓存**：用户拿旧 HTML 引用旧 JS，看不到新版。HTML 不缓存。

## 关联

- ↑ 对应 v1 原理：[03 构建部署与发布](../../03-engineering/build-deploy-release.md) · [01-12 构建工具](../../01-pillars/01-12-architecture-engineering/build-tools.md) · [01-12 环境配置](../../01-pillars/01-12-architecture-engineering/environment-config.md)
- → v2 相关：[03 规范与 CI](./03-conventions-ci.md) · [nextjs/04 渲染模式](../nextjs/04-rendering-modes.md)
