# 点击劫持（Clickjacking）

> 用户以为在点"领奖"按钮，实际点的是被透明 iframe 覆盖的"转账确认"按钮——这就是点击劫持。隐蔽性强，但防御简单。

## 是什么

点击劫持（Clickjacking，又称 UI redressing）指攻击者用自己的页面作伪装，下面**透明嵌入目标站点的 iframe**，诱导用户在不知情下点击目标站点的按钮。

```
攻击者页面：
  顶层：诱人按钮"领奖"（用户看到的）
  底层：透明的 <iframe src="bank.com/transfer">（用户看不到）
用户点"领奖" → 实际点中了 iframe 里的"转账确认"
```

一句话边界：**点击劫持 = 用透明 iframe 诱骗用户点目标站点的按钮。** 本质是"视觉欺骗 + 跨 frame 点击"。

## 为什么：攻击怎么成立

成立的条件：
1. 目标站点可被 iframe 嵌入（默认允许）。
2. 目标站点的敏感操作（转账、改密码、授权）在点击即触发，无需额外输入（利用用户已登录态）。

攻击者通过 CSS 把 iframe 设为透明、绝对定位、`z-index` 调整，让诱饵按钮恰好覆盖目标按钮。用户以为点诱饵，实际点目标。

## 怎么用：两种防御

### 1. X-Frame-Options ★ 经典
HTTP 头，声明本页是否允许被 iframe 嵌入：
| 值 | 行为 |
|---|---|
| `DENY` | 完全禁止被任何页面 iframe |
| `SAMEORIGIN` | 只允许同源页面 iframe |
```
X-Frame-Options: DENY
```

### 2. CSP frame-ancestors ★ 现代替代
CSP 的 `frame-ancestors` 指令，比 X-Frame-Options 更灵活（可指定多个允许的源）：
```
Content-Security-Policy: frame-ancestors 'self' https://trusted.com;
// 只允许同源和 trusted.com 嵌入
```
> 两者设其一即可。现代浏览器优先 CSP，X-Frame-Options 作旧浏览器兼容。

### 3. 配合 SameSite Cookie
即使被 iframe 嵌入，Cookie 设了 `SameSite=Lax/Strict`，跨站 iframe 不带 Cookie——敏感操作因未登录而失败。这是 [CSRF](./csrf.md) 防御的副产品，也挡住点击劫持。

### 敏感操作加二次确认
关键操作（转账、删除）不只靠"点击"，加额外输入（密码/验证码）或明确确认弹窗。这样即使被诱导点击，也需二次确认，攻击难成。

## 常见坑

- ❌ **敏感页面不设 frame 防御**：可被任意 iframe 嵌入，点击劫持风险。
  - ✅ 正例：设 `frame-ancestors 'self'` 或 `X-Frame-Options: DENY`。
- ❌ **只靠 frame 防御不做二次确认**：同源内的点击劫持（攻击者在同源页面内搞）frame 防御挡不住。
- ❌ **忽视 SameSite 的副产品防护**：以为只防 CSRF，其实也削弱点击劫持（无登录态的操作无意义）。

## 关联（双向打通）

- **依赖 ↓**：[09 浏览器原理（iframe/同源）](../../09-prerequisites/README.md)、[CSRF](./csrf.md)
- **属于 ↑**：[01-11 安全](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - SameSite Cookie → [CSRF](./csrf.md)、[09 网络](../../09-prerequisites/README.md)
  - CSP 的其他用途 → [CSP](./csp.md)
