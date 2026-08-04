# 环境与配置（Environment & Config）

> 同一份代码要跑在 dev/test/staging/prod 多个环境，每个环境用不同的 API 地址、开关、密钥。怎么管理这些"随环境变的东西"，不让它混乱泄露？这是工程化的基本配置问题。

## 是什么

环境配置指**管理随环境变化的变量**（API 地址、特性开关、第三方密钥等）。核心实践：
- 多环境隔离（dev/staging/prod）。
- 环境变量（`.env`）+ 构建时注入。
- Feature Flag（功能开关）做灰度发布。

一句话边界：**配置 = "代码不变、随环境变的东西"。** 好的配置让同一份代码无缝跑在多环境。

## 为什么：为什么需要环境管理

### 不同环境差异
- **dev**：本地开发，API 指本地 mock/开发服务器。
- **staging**：预发布，连类生产数据，做验收。
- **prod**：生产，连真实数据和 API。
同一份代码，API 地址不同。硬编码就要维护多份代码——错。配置化让它一份代码多环境。

### Feature Flag 的价值
新功能想"先上线但只对部分用户开"。不用 Feature Flag，要么等开发完才合并（长期分支地狱），要么全量发布（风险高）。Feature Flag 让代码已合并但运行时按开关决定是否启用——**解耦"发布"和"启用"**。

## 怎么用

### 环境变量（.env）
```
# .env.development
VITE_API_URL=http://localhost:3000
# .env.production
VITE_API_URL=https://api.example.com

// 代码里
const apiUrl = import.meta.env.VITE_API_URL   // 构建时按环境注入
```
- 不同环境的 `.env` 文件分别管理。
- 构建时把变量**静态替换**进产物（所以改环境变量要重新构建）。
- **敏感的别放前端**：见下。

### 前端不能存真正的密钥 ★
呼应当前[01-11](../01-11-security/other-security.md)：前端代码用户可查看，任何写在前端的值都不安全。
- ❌ 把数据库密码、第三方 secret 放前端环境变量——用户 F12 就能看到。
- ✅ 真正敏感的密钥放**服务端**，前端通过自己的后端代理调用第三方。
- ✅ 前端可放的：API 公开地址、设计为公开的客户端 ID（配合域名白名单）。

> 区分"配置"和"密钥"：配置可公开（API 地址），密钥不可公开（必须服务端）。前端只放配置不放密钥。

### Feature Flag（功能开关）
```
// 用开关控制功能启用
if (flags.newCheckout) {
  return <NewCheckout/>
}
return <OldCheckout/>
```
- **发布与启用解耦**：代码已上线（合并主干），但开关关着，不影响用户。逐步放量时打开开关。
- **快速回滚**：出问题关掉开关即可，不用重新发布代码。
- 实现可简单（环境变量布尔值）或复杂（专门平台，按用户分桶）。

### 配置校验
环境变量是字符串，用 Zod 等在启动/构建时校验，避免运行时 undefined：
```
const env = z.object({
  API_URL: z.string().url(),
  ENABLE_FEATURE: z.enum(['true','false'])
}).parse(import.meta.env)
// 缺了或格式错，构建时立即报错，而非运行时崩
```

## 常见坑

- ❌ **密钥放前端环境变量**：用户可见，泄露。
  - ✅ 正例：敏感密钥服务端，前端只放公开配置。
- ❌ **环境变量运行时才检查**：缺了到运行时才崩。构建/启动时校验。
- ❌ **`.env` 提交了密钥**：`.env.local` 等含密钥的别入库（加 .gitignore），只提交 `.env.example` 模板。
- ❌ **Feature Flag 用完不清**：开关越堆越多，代码里满是 `if(flag)` 死分支。功能稳定后清理开关和旧代码。

## 关联（双向打通）

- **依赖 ↓**：[01-11 安全（密钥不进前端）](../01-11-security/other-security.md)、[构建工具（构建时注入）](./build-tools.md)
- **属于 ↑**：[01-12 架构与工程化](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 灰度发布与 Flag → [03 构建/部署](../../03-engineering/README.md)
  - 类型化配置 → [TypeScript](./typescript-types.md)
