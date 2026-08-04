# Source Map（源映射）

> 生产代码是压缩混淆的——变量变成 `a`、`b`，行号没了。线上报错堆栈指向 `a.js:1:23456`，完全不可读。Source Map 把它还原成原始源码位置，是线上调试的钥匙。

## 是什么

Source Map 是一个**映射文件**，记录"压缩混淆后的代码位置" ↔ "原始源码位置"的对应关系。有了它，能从生产报错还原出原始文件、行号、甚至变量名。

一句话边界：**Source Map 是混淆代码和源码之间的"翻译表"**——让线上报错可读、可调试。

## 为什么：为什么需要 Source Map

生产构建会：minify（变量名缩短）、合并（多文件合一）、删除注释。结果是：
```
原始：function handleClick(event) { fetchUser(event.target.id).then(setUser) }
生产：function a(b){c(b.target.id).then(d)}
报错堆栈：a.js:1:4567   // 这是什么？不可读
```
没有 Source Map，线上错误堆栈无法定位，调试靠猜。有了它，错误工具能映射回原始的 `handleClick at UserList.tsx:23`。

## 怎么用：双面性——调试 vs 安全

Source Map 是双刃剑：**帮你调试，但泄露源码**。

### 调试用：上报时关联 Source Map
1. 构建生成 `.map` 文件 + JS 末尾的 `//# sourceMappingURL=app.js.map` 注释。
2. 错误上报时，监控平台用 Source Map 把混淆堆栈还原成原始堆栈。

### 安全：别让用户拿到 Source Map ★
`.map` 文件如果公开访问，任何人能还原你的完整源码（含逻辑、注释）——这是 [01-11 敏感信息泄露](../01-11-security/other-security.md) 的典型。处理方式：
- **方案 A：不部署 .map 到生产 CDN**。只在监控平台/内部保留 map，用它解析上报的错误。
- **方案 B：hidden source map**。生成 map 但 JS 不带 `sourceMappingURL` 注释（用户浏览器不加载它），map 私下传给监控平台。
- **方案 C：部署但限制访问**。map 放需鉴权的内部服务，不公开。

> 关键原则：**Source Map 用于团队调试，不应对终端用户公开。** 否则等于开源了源码。

### 监控平台如何用 Source Map
错误上报带"混淆堆栈 + 文件名 + 版本"。监控平台按版本找到对应的 Source Map，用 `source-map` 库解析：
```
// 伪代码：还原
const pos = SourceMapConsumer(map).originalPositionFor({ line: 1, column: 4567 })
// → { source: 'UserList.tsx', line: 23, name: 'handleClick' }
```
所以要在构建时**按版本归档 Source Map**，每个线上版本对应一套 map，供事后解析。

## 常见坑

- ❌ **生产公开部署 .map**：用户能还原源码，泄露。map 不公开或限制访问。
- ❌ **错误堆栈不可读**：没生成/没关联 map，线上报错无法定位。
- ❌ **map 与版本不对应**：新版本发布后旧 map 找不到，老版本报错无法解析。按版本归档。
- ❌ **生产 JS 带 sourceMappingURL 却不部署 map**：浏览器请求 map 404，且暴露你在用 map（虽拿不到）。

## 关联（双向打通）

- **依赖 ↓**：[前端监控（错误还原）](./frontend-monitoring.md)、[01-12 构建工具](../01-12-architecture-engineering/build-tools.md)
- **属于 ↑**：[01-13 可观测性与质量](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - map 泄露风险 → [01-11 其他安全](../01-11-security/other-security.md)
  - 构建生成 map → [01-12 构建工具](../01-12-architecture-engineering/build-tools.md)
