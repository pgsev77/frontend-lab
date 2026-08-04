# 01-10 · 可访问性与多端

> **轴属：横切**。前端运行在不可控环境、面向所有人。本支柱回答"怎么让视障/键盘/移动端/旧浏览器用户都能正常用"——这是 [前端本质：差异 3（不可控环境）](../../00-foundation/frontend-essence.md) 的直接应对。

## 本支柱解决什么问题
可访问性（a11y）不是"可选加分项"，而是让产品能被更多人使用的底线；多端适配不是"以后再做"，而是从一开始就要考虑。本支柱回答：**怎么做无障碍、怎么做响应式、怎么做国际化和降级**。

## 详细大纲（→ 点击标题阅读）

### [1. 可访问性基础](./accessibility-basics.md)
- a11y 是什么（让残障人士也能用：视障/听障/运动障碍/认知障碍）
- WCAG 标准（可感知/可操作/可理解/健壮，POUR）
- 语义化 HTML 是 a11y 的基础（→ 详见 01-1）
- ARIA（Accessible Rich Internet Applications）：语义增强
- ARIA 的滥用陷阱（"No ARIA is better than bad ARIA"）

### [2. 键盘可达性](./keyboard-access.md)
- 所有操作应能用键盘完成（Tab/Enter/Esc/方向键）
- 焦点管理（focus/blur、tabindex、可见的焦点环）
- 焦点陷阱（模态框内的焦点循环）
- 跳过链接（Skip to content）
- → 配合 [01-8 焦点交互](../01-8-interaction-forms/README.md)

### [3. 屏幕阅读器与 ARIA](./screen-reader-aria.md)
- 屏幕阅读器怎么读页面（DOM 顺序、aria-label、alt）
- 常用 ARIA：role / aria-label / aria-hidden / aria-live / aria-expanded
- 动态内容的通告（aria-live 区域）
- 图标按钮、表单错误的可访问性

### [4. 颜色与对比度](./color-contrast.md)
- 对比度标准（WCAG AA 4.5:1 / AAA 7:1）
- 不能只靠颜色传达信息（色盲友好）
- 暗色模式的对比度
- prefers-contrast 媒体查询

### [5. 响应式设计](./responsive-design.md)
- 移动优先（Mobile First）策略
- 断点设计（基于内容而非设备）
- 流式布局（Flex/Grid + 弹性单位）
- 响应式图片（srcset / picture / sizes）
- 触摸友好（足够大的点击区域、间距）
- → CSS 基础见 [01-3](../01-3-styling/README.md)

### [6. 国际化与本地化](./internationalization.md)
- 文本提取与翻译（不要硬编码文案）
- 文本方向（LTR / RTL，逻辑属性 margin-inline）
- 复数/性别/日期/数字/货币的本地化
- 翻译带来的布局问题（德语比中文长 30%）

### [7. 兼容与降级](./compatibility-graceful-degradation.md)
- 渐进增强（Progressive Enhancement）vs 优雅降级（Graceful Degradation）
- 浏览器特性检测（@supports / typeof window.X）
- Polyfill 与转译（Babel / core-js，目标浏览器配置）
- 容错：功能不可用时给替代方案，而非崩溃
- → 这是 [防御性哲学](../../00-foundation/frontend-essence.md) 的体现

### [8. PWA 与离线](./pwa-offline.md)
- PWA 三件套：Manifest + Service Worker + HTTPS
- 离线可用（Service Worker 缓存）
- 可安装（Add to Home Screen）
- 后台同步与推送通知
- PWA vs 原生 App 的定位

## 学完应能回答
- a11y 只是"为残障人士"吗？它对所有人有什么好处？
- 语义化 HTML 和 ARIA 的关系？什么时候该用 ARIA？
- 怎么让一个自定义组件（如自定义下拉）键盘可达？
- 移动优先的响应式设计怎么做？
- 渐进增强和优雅降级有什么区别？
- PWA 的核心三件套是什么？

## 关联
- **属于 ↑**：[01 核心支柱](../README.md) → 横切
- **依赖 ↓**：[01-1 视图基础](../01-1-view-fundamentals/README.md)（语义化 HTML）、[01-3 样式](../01-3-styling/README.md)（响应式/对比度）
- **相关 →**：[01-8 交互](../01-8-interaction-forms/README.md)（焦点/键盘）、[01-9 性能](../01-9-performance-ux/README.md)（PWA/离线）、[01-13 质量](../01-13-observability-quality/README.md)（a11y 测试）
