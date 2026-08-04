# 布局体系（Layout Systems）

> 盒模型回答了"单个盒子怎么算尺寸"，布局回答"一堆盒子怎么排列"。CSS 有两套现代布局——**Flexbox（一维）和 Grid（二维）**，加上定位（position）。掌握这三者，95% 的布局问题都能解决。

## 是什么

布局体系指 CSS 控制元素排列位置与尺寸的机制：

| 机制 | 维度 | 适用场景 |
|---|---|---|
| **正常文档流** | — | 默认行为，块级元素纵向堆叠、行内元素横向排列 |
| **Flexbox** | 一维（行或列） | 一行/一列内的对齐与伸缩（导航栏、工具条、卡片行） |
| **Grid** | 二维（行+列） | 整体页面布局、复杂网格（仪表盘、表单） |
| **定位（position）** | 脱离文档流 | 重叠、固定、吸附（模态框、吸顶导航、徽标） |

一句话边界：**Flex 管一条线上的排列，Grid 管一个面（行+列）的排列，定位管脱离正常流。**

## 为什么：为什么需要 Flex/Grid

早期前端布局全靠 `float` + `display:inline-block` + 定位硬凑， famously 痛苦（"圣杯布局""双飞翼布局"各种奇技淫巧）。痛点是：
- 水平居中、等高列、自适应分配空间——这些"基本需求"在旧方案里极难实现。
- `float` 本是为文字环绕图片设计的，被滥用做布局，副作用多（需清除浮动）。

Flexbox（2013）和 Grid（2017）就是为了**让布局回归直觉**：你描述"这一行怎么对齐、怎么分配空间"，浏览器自动算。

## 怎么用

### 1. Flexbox（一维布局）

设 `display: flex` 的容器，其子元素沿**主轴（main axis）**排列。核心属性都围绕"主轴/交叉轴"两根轴：

```css
.container {
  display: flex;
  flex-direction: row;       /* 主轴方向：row(横) | column(竖) */
  justify-content: center;   /* ★ 主轴对齐：start/end/center/space-between */
  align-items: center;       /* ★ 交叉轴对齐：start/end/center/stretch */
  gap: 12px;                 /* 子元素间距（不用再写 margin） */
}
.item {
  flex: 1;                   /* ★ 伸缩：按比例分配剩余空间 */
}
```

**`justify-content` vs `align-items` 易混点**：别记"水平/垂直"，记"主轴/交叉轴"。当 `flex-direction: column` 时，主轴变成垂直方向，两者的"方向"也跟着翻转。

**`flex: 1` 的含义**：`flex` 是 `flex-grow`(放大) / `flex-shrink`(缩小) / `flex-basis`(基准) 的缩写。`flex: 1` = 等比例填满剩余空间。三个等宽列就给每个 `flex: 1`。

**经典用法**：
- 水平垂直居中：`display:flex; justify-content:center; align-items:center;`（旧方案要写五行，Flex 一行搞定）
- 顶栏：左 logo + 右菜单 → `justify-content: space-between`
- 卡片行均分 → 每个 `flex: 1` + `gap`

### 2. Grid（二维布局）

设 `display: grid`，用 `grid-template-columns` / `grid-template-rows` 定义行列：

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;  /* 左侧栏 弹性主区 右侧栏 */
  grid-template-rows: auto 1fr auto;       /* 头部 主体 页脚 */
  gap: 16px;
}
.sidebar { grid-area: sidebar; }           /* 命名区域，语义清晰 */
```

**Grid vs Flex 怎么选**：
- 一条线上的排列（一行按钮、一列菜单）→ **Flex**
- 整体页面骨架（头-侧-体-脚的二维结构）→ **Grid**
- 不确定时：Grid 能做 Flex 能做的，但 Flex 在一维场景更简洁。**Grid 用于复杂二维，Flex 用于线性排列**，常配合使用。

**响应式利器**：`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` 一行实现"自动换行的等宽卡片列"——无需媒体查询。

### 3. 定位（position）

| 值 | 行为 | 典型用途 |
|---|---|---|
| `static` | 默认，在文档流中 | 不用写 |
| `relative` | 相对自身原位置偏移，**仍占原位** | 作为绝对定位的参照 |
| `absolute` | 脱离文档流，相对最近的非 static 祖先 | 角标、气泡、嵌套小元素 |
| `fixed` | 脱离文档流，相对视口 | 吸顶导航、固定按钮 |
| `sticky` | 滚动到阈值前是 static，到达后变 fixed | 吸顶表头、侧边栏 |

**绝对定位的关键**：`absolute` 的参照物是**最近的、position 非 static 的祖先**。所以用绝对定位时，通常给父元素设 `position: relative` 作为参照锚点。

**脱离文档流的代价**：absolute/fixed 元素不占位，父容器高度不会包含它们，且对响应式不友好。**只在确需重叠/固定时用定位，别用它做整体布局。**

## 常见坑

- ❌ **用 float 做布局**：float 是为文字环绕设计的，副作用多（需清除浮动、高度塌陷）。现代布局用 Flex/Grid，float 回归本职。
- ❌ **混淆 justify-content 和 align-items**：死记水平垂直，遇到 `flex-direction: column` 就乱。记住"主轴/交叉轴"。
- ❌ **定位做整体布局**：用 absolute 硬摆每个元素，一改屏幕尺寸全乱套。
  - ✅ 正例：整体布局用 Flex/Grid，定位只用于局部重叠元素。
- ❌ **sticky 不生效**：sticky 需要父容器有足够高度且无 `overflow: hidden` 拦截，否则没有滚动空间。
- ❌ **Grid 的 1fr 和 Flex 的 flex:1 混淆**：Grid 的 `fr` 是列宽单位（占剩余空间比例），Flex 的 `flex` 是子项属性。语义类似但写法不同。

## 关联（双向打通）

- **依赖 ↓**：[盒模型](./box-model.md)（布局是盒子的排列）、[层叠与特异性](./cascade-specificity.md)
- **属于 ↑**：[01-1 视图基础与文档结构](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 响应式布局 → [01-10 可访问性与多端](../01-10-accessibility-multiplatform/README.md)
  - 现代布局属性（gap/container query）→ [01-3 样式方案](../01-3-styling/README.md)
  - 布局变化触发重排 → [01-9 性能与体验](../01-9-performance-ux/README.md)
